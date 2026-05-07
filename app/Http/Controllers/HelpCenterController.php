<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\HelpMessage;
use Illuminate\Http\Request;

class HelpCenterController extends Controller
{
    public function index(Request $request)
    {
        $messages = HelpMessage::latest()->take(200)->get()->reverse()->values();
        return response()->json($messages);
    }

    public function store(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:2000',
        ]);

        $message = HelpMessage::create([
            'user_id' => $request->user()?->id,
            'name' => $request->user()?->name ?? $request->input('name'),
            'message' => $request->input('message'),
        ]);

        return response()->json($message);
    }
}
