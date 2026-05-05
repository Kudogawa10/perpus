<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class IndonesiaAddressController extends Controller
{
    public function kabupaten()
    {
        $path = database_path('data/jabodetabek_regions.json');
        if (!file_exists($path)) {
            return response()->json([], 200);
        }
        $data = json_decode(file_get_contents($path), true);
        $items = collect(array_keys($data))->map(fn($k) => ['id' => $k, 'name' => $k])->values();
        return response()->json($items);
    }

    public function kecamatan(Request $request)
    {
        $kabupaten = $request->query('kabupaten');
        $path = database_path('data/jabodetabek_regions.json');
        if (!file_exists($path)) {
            return response()->json([], 200);
        }
        $data = json_decode(file_get_contents($path), true);
        $list = $data[$kabupaten] ?? [];
        $items = collect($list)->map(fn($k) => ['id' => $k, 'name' => $k])->values();
        return response()->json($items);
    }
}
