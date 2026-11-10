<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->guest(route('login'));
        }

        $userRole = is_string($user->role) ? $user->role : $user->role->value;

        if (! in_array($userRole, $roles, true)) {
            abort(403, 'Unauthorized access: You do not have permission to view this resource.');
        }

        return $next($request);
    }
}
