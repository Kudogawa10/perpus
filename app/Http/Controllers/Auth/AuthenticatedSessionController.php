<?php
// ============================================================
// Auth - AuthenticatedSessionController
// File: app/Http/Controllers/Auth/AuthenticatedSessionController.php
// ============================================================

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function store(Request $request)
    {
        $request->validate([
            'email'    => 'required|string|email',
            'password' => 'required|string',
        ]);

        $throttleKey = Str::transliterate(Str::lower($request->input('email')).'|'.$request->ip());

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);

            throw ValidationException::withMessages([
                'email' => "Terlalu banyak percobaan login. Coba lagi dalam {$seconds} detik.",
            ]);
        }

        if (!Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            RateLimiter::hit($throttleKey, 60);

            throw ValidationException::withMessages([
                'email' => 'Email atau password salah.',
            ]);
        }

        RateLimiter::clear($throttleKey);
        $request->session()->regenerate();

        $user = Auth()->user();

        if ($user->status !== 'aktif') {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return back()->withErrors(['email' => 'Akun Anda tidak aktif atau ditangguhkan.']);
        }

        // Terapkan pembatasan wilayah login hanya untuk role 'pengguna'
        if ($user->hasRole('pengguna')) {
            $allowed = config('perpus.allowed_login_keywords', ['Jakarta', 'Bogor', 'Depok', 'Tangerang', 'Bekasi']);
            $domisili = $user->domisili ?? '';
            $allowedOk = false;
            foreach ($allowed as $kw) {
                if ($domisili && stripos($domisili, $kw) !== false) {
                    $allowedOk = true;
                    break;
                }
            }
            if (!$allowedOk) {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                return back()->withErrors(['email' => 'Login hanya diperbolehkan untuk pengguna berdomisili di wilayah JABODETABEK (Jakarta, Bogor, Depok, Tangerang, Bekasi).']);
            }
        }

        // Redirect by role
        if ($user->hasRole('admin')) {
            return redirect()->intended('/admin/dashboard');
        }

        if ($user->hasRole('petugas')) {
            return redirect()->intended('/petugas/dashboard');
        }

        return redirect()->intended('/dashboard');
    }

    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/login');
    }
}
