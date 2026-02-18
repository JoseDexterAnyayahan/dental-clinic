<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ClientMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user() || ! $request->user()->isClient()) {
            return response()->json([
                'message' => 'Unauthorized. Client access only.'
            ], 403);
        }

        return $next($request);
    }
}