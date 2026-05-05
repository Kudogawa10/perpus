<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class RegisteredUserController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/Register', [
            // Keep legacy domisiliOptions for backwards compatibility (frontend uses API)
            'domisiliOptions' => config('perpus.jabodetabek'),
        ]);
    }

    public function store(Request $request)
    {
        // Load available kabupaten/kecamatan from dataset
        $regionsPath = database_path('data/jabodetabek_regions.json');
        $regions = file_exists($regionsPath) ? json_decode(file_get_contents($regionsPath), true) : [];
        $kabupatenKeys = array_keys($regions);

        $request->validate([
            'name'         => 'required|string|max:255',
            'email'        => 'required|string|email|max:255|unique:users',
            'password'     => ['required', 'string', 'confirmed', 'max:72', Password::min(8)->letters()->numbers()],
            'phone'        => 'required|string|max:20',
            'address'      => 'required|string|max:1000',
            'accepted_terms' => 'required|accepted',
            'kabupaten'    => ['required', Rule::in($kabupatenKeys)],
            'kecamatan'    => ['required', function ($attribute, $value, $fail) use ($regions, $request) {
                $kab = $request->input('kabupaten');
                if (empty($kab) || !isset($regions[$kab]) || !in_array($value, $regions[$kab])) {
                    $fail('Kecamatan tidak valid untuk kabupaten terpilih.');
                }
            }],
        ]);

        $domisili = $request->kabupaten . ' / ' . $request->kecamatan;

        $user = User::create([
            'name'       => $request->name,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'phone'      => $request->phone,
            'address'    => $request->address,
            'domisili'   => $domisili,
            'no_anggota' => User::generateNoAnggota(),
            'status'     => 'aktif',
        ]);

        $user->assignRole('pengguna');

        event(new Registered($user));

        // Do not auto-login. Redirect to login page and show a popup there.
        return redirect('/login?registered=1&email=' . urlencode($user->email));
    }
}
