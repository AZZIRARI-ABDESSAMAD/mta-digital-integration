<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\UserCompletedModule;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProgressController extends Controller
{
    /**
     * The sequential order of formations per user type.
     */
    private function getFormationSequence(string $userType): array
    {
        if ($userType === 'visitor') {
            return [
                ['slug' => 'hse_visitor', 'title' => 'Guides HSE & EPI', 'order' => 1],
            ];
        }

        // For operator, stagiaire, and admin, they share the exact same path
        return [
            ['slug' => 'reglement',   'title' => 'Règlement Intérieur', 'order' => 1],
            ['slug' => 'hse_operator', 'title' => 'Guides HSE & EPI',    'order' => 2],
            ['slug' => 'tracabilite', 'title' => 'Traçabilité',         'order' => 3],
            ['slug' => 'assemblage',  'title' => 'Assemblage',          'order' => 4],
            ['slug' => 'kaizen_5s',   'title' => '5S & Kaizen',         'order' => 5],
        ];
    }

    /**
     * POST /api/user/progress
     * Mark a module as complete. Enforces sequential order for non-admins.
     */
    public function markComplete(Request $request)
    {
        $request->validate([
            'module_slug' => 'required|string',
            'signature'   => 'nullable|string',
        ]);

        $user = $request->user();
        $slug = $request->module_slug;

        // Ensure we retrieve the primary sequence for the user
        $primarySequence = $this->getFormationSequence($user->user_type);
        $completed = $user->completedModules()->pluck('module_slug')->toArray();

        $slugIndex = collect($primarySequence)->search(fn($s) => $s['slug'] === $slug);

        // Handle optional signature
        $signaturePath = null;
        if ($request->filled('signature')) {
            $image_64 = $request->signature;
            $replace = substr($image_64, 0, strpos($image_64, ',') + 1);
            $image = str_replace($replace, '', $image_64);
            $image = str_replace(' ', '+', $image);
            $imageName = 'signatures/sig_user_' . $user->id . '_' . time() . '.png';
            Storage::disk('public')->put($imageName, base64_decode($image));
            $signaturePath = $imageName;
        }

        if ($slugIndex === false) {
            // Module isn't in primary sequence.
            if ($user->role === 'admin') {
                $progress = $user->completedModules()->updateOrCreate(
                    ['module_slug' => $slug],
                    [
                        'completed_at' => now(),
                        'signature'    => $signaturePath,
                    ]
                );
                return response()->json([
                    'message'  => 'Module complété avec succès',
                    'progress' => $progress,
                ]);
            }
            return response()->json(['message' => 'Module inconnu.'], 404);
        }

        if ($slugIndex > $user->onboarding_step) {
            return response()->json([
                'message' => 'Vous devez d\'abord compléter le module précédent.'
            ], 403);
        }

        if ($slugIndex == $user->onboarding_step) {
            $progress = $user->completedModules()->updateOrCreate(
                ['module_slug' => $slug],
                [
                    'completed_at' => now(),
                    'signature'    => $signaturePath,
                ]
            );
            $user->increment('onboarding_step');
        } else {
            // Already completed or syncing
            $progress = $user->completedModules()->updateOrCreate(
                ['module_slug' => $slug],
                [
                    'completed_at' => now(),
                    'signature'    => $signaturePath,
                ]
            );
        }

        return response()->json([
            'message'  => 'Module complété avec succès',
            'progress' => $progress,
        ]);
    }

    /**
     * GET /api/user/progress
     * Returns the full sequential formation list with is_locked status.
     */
    public function getUserProgress(Request $request)
    {
        $user = $request->user();
        $completed = $user->completedModules()->pluck('module_slug')->toArray();
        $isAdmin = $user->role === 'admin';

        // Admin can request a specific type to preview the path
        $requestedType = $request->query('type', $user->user_type);
        $typeToUse = $isAdmin ? $requestedType : $user->user_type;

        $sequence = $this->getFormationSequence($typeToUse);

        // Determine if we are previewing a sequence that is fundamentally different from the primary one
        // If so, we should NOT apply the onboarding_step sync logic, to avoid bleeding completions across paths
        $isPrimarySequence = true;
        if ($isAdmin && $typeToUse === 'visitor' && $user->user_type !== 'visitor') {
            $isPrimarySequence = false;
        }

        $formations = [];

        foreach ($sequence as $index => $step) {
            if ($isPrimarySequence) {
                // Strict logic based on onboarding_step for the user's actual path
                $isCompleted = ($index < $user->onboarding_step);
                $isLocked = ($index > $user->onboarding_step);

                // Sync backwards: if onboarding_step covers this module but it's not in DB, insert it.
                if ($isCompleted && !in_array($step['slug'], $completed)) {
                    $user->completedModules()->updateOrCreate(
                        ['module_slug' => $step['slug']],
                        ['completed_at' => now()]
                    );
                    $completed[] = $step['slug'];
                }

                // Sync forwards: if onboarding_step does NOT cover this module (meaning it's 0 or lowered) but it is in DB, delete it.
                if (!$isCompleted && in_array($step['slug'], $completed)) {
                    $user->completedModules()->where('module_slug', $step['slug'])->delete();
                    $completed = array_diff($completed, [$step['slug']]);
                }
            } else {
                // Secondary sequence (e.g. Admin previewing Visitor)
                // Use actual DB state, no auto-sync
                $isCompleted = in_array($step['slug'], $completed);

                // For visitor, index 0 is always unlocked. Others depend on previous step completion.
                if ($index === 0) {
                    $isLocked = false;
                } else {
                    $previousSlug = $sequence[$index - 1]['slug'];
                    $isLocked = !in_array($previousSlug, $completed);
                }
            }

            $formations[] = [
                'slug'      => $step['slug'],
                'title'     => $step['title'],
                'order'     => $step['order'],
                'completed' => $isCompleted,
                'is_locked' => $isLocked,
            ];
        }

        return response()->json([
            'completed_slugs' => $completed,
            'formations'      => $formations,
        ]);
    }

    /**
     * GET /api/user/progress/check/{slug}
     * Safety check: returns 403 if the module is locked for this user.
     */
    public function checkAccess(Request $request, string $slug)
    {
        $user = $request->user();

        $sequence = $this->getFormationSequence($user->user_type);

        $slugIndex = collect($sequence)->search(fn($s) => $s['slug'] === $slug);

        if ($slugIndex === false) {
            if ($user->role === 'admin') {
                return response()->json(['access' => true]);
            }
            return response()->json(['message' => 'Module introuvable.'], 404);
        }

        if ($slugIndex > $user->onboarding_step) {
            return response()->json([
                'access'  => false,
                'message' => 'Module verrouillé. Complétez d\'abord le module précédent.',
            ], 403);
        }

        return response()->json(['access' => true]);
    }

    /**
     * GET /api/admin/users-progress
     */
    public function getAllUsersProgress(Request $request)
    {
        $users = User::with('completedModules')->get();

        $result = $users->map(function ($user) {
            return [
                'id'                => $user->id,
                'prenom'            => $user->first_name,
                'nom'               => $user->last_name,
                'first_name'        => $user->first_name,
                'last_name'         => $user->last_name,
                'email'             => $user->email,
                'user_type'         => $user->user_type,
                'completed_modules' => $user->completedModules->pluck('module_slug'),
            ];
        });

        return response()->json($result, 200);
    }
}
