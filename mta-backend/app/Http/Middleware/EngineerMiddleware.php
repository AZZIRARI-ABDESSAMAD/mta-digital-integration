<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EngineerMiddleware
{
    /**
     * Allow access for engineers and admins.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && in_array($user->role, ['engineer', 'admin'])) {
            return $next($request);
        }

        return response()->json([
            'message' => 'Accès non autorisé. Réservé aux ingénieurs.'
        ], 403);
    }
}
