<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Evaluation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EvaluationController extends Controller
{
    /**
     * List all operators (user_type = operator) for the engineer to evaluate.
     */
    public function operators(Request $request)
    {
        $search = $request->query('search');

        $query = User::where('user_type', 'operator')
            ->where('is_active', true)
            ->with('department');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('cin', 'like', "%{$search}%");
            });
        }

        return response()->json($query->orderBy('last_name')->get());
    }

    /**
     * Save a new evaluation (audit).
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'operator_id'    => 'required|exists:users,id',
            'category'       => 'required|in:HSE,Traceability,Production',
            'criteria'       => 'required|array|min:1',
            'criteria.*.item'    => 'required|string',
            'criteria.*.checked' => 'required|boolean',
            'overall_status' => 'required|boolean',
            'comments'       => 'nullable|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $evaluation = Evaluation::create([
            'operator_id'    => $request->operator_id,
            'engineer_id'    => $request->user()->id,
            'category'       => $request->category,
            'criteria'       => $request->criteria,
            'overall_status' => $request->overall_status,
            'comments'       => $request->comments,
        ]);

        return response()->json([
            'message'    => 'Évaluation enregistrée avec succès.',
            'evaluation' => $evaluation->load(['operator', 'engineer']),
        ], 201);
    }

    /**
     * List evaluations (history) for the logged-in engineer.
     */
    public function history(Request $request)
    {
        $evaluations = Evaluation::where('engineer_id', $request->user()->id)
            ->with(['operator.department'])
            ->orderByDesc('created_at')
            ->get();

        return response()->json($evaluations);
    }
}
