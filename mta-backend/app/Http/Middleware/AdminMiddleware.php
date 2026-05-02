<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // check if the user is authenticated and has the role of admin
        if ($request->user() && $request->user()->role === 'admin') {
            return $next($request);
        }
        // if the user is not authenticated or does not have the role of admin, return an error response
        return response()->json([
            'message' => 'Accès non autorisé. Réservé aux administrateurs.'
        ], 403);
    }
}
