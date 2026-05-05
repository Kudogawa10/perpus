<?php

namespace App\Providers;

use App\Models\Peminjaman;
use App\Policies\PeminjamanPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Ensure the container has a 'files' binding available.
        // Some environments or bootstrap sequences may not register
        // the Filesystem binding early enough; provide a safe fallback.
        if (! $this->app->bound('files')) {
            $this->app->singleton('files', function () {
                return new \Illuminate\Filesystem\Filesystem();
            });
        }
    }

    public function boot(): void
    {
        Gate::policy(Peminjaman::class, PeminjamanPolicy::class);

        // Force HTTPS in production
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }
    }
}
