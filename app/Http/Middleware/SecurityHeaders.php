<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        /** @var \Symfony\Component\HttpFoundation\Response $response */
        $response = $next($request);

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', config('security.frame_options', 'SAMEORIGIN'));
        $response->headers->set('Referrer-Policy', config('security.referrer_policy', 'strict-origin-when-cross-origin'));
        $response->headers->set('Permissions-Policy', config('security.permissions_policy', 'camera=(), microphone=(), geolocation=()'));
        $response->headers->set('X-XSS-Protection', '0');

        if (config('security.hsts.enabled')) {
            $maxAge = (int) config('security.hsts.max_age', 31536000);
            $value = "max-age={$maxAge}";

            if (config('security.hsts.include_subdomains')) {
                $value .= '; includeSubDomains';
            }

            if (config('security.hsts.preload')) {
                $value .= '; preload';
            }

            $response->headers->set('Strict-Transport-Security', $value);
        }

        return $response;
    }
}
