<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        return response()->json(Setting::allAsArray());
    }

    public function update(Request $request)
    {
        $request->validate([
            'brand_name' => 'nullable|string|max:255',
            'brand_logo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'address' => 'nullable|string|max:1000',
            'footer_text' => 'nullable|string|max:500',
            'card_expiry_years' => 'nullable|integer|min:0|max:10',
        ]);

        if ($request->hasFile('brand_logo')) {
            $path = $request->file('brand_logo')->store('branding', 'public');
            Setting::setValue('brand_logo', $path);
        }

        foreach (['brand_name', 'address', 'footer_text', 'card_expiry_years'] as $k) {
            if ($request->filled($k) || $request->has($k)) {
                Setting::setValue($k, $request->input($k));
            }
        }

        return response()->json(['success' => true, 'settings' => Setting::allAsArray()]);
    }
}
