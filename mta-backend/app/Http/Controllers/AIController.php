<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\GeminiService;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AIController extends Controller
{
    protected $geminiService;

    public function __construct(GeminiService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    public function chat(Request $request)
    {
        // زدت الفاليداسيون ديال التصويرة
        $request->validate([
            'message' => 'string|nullable',
            'history' => 'array|nullable',
            'image' => 'string|nullable', // Base64 ديال الصورة
        ]);

        $message = $request->input('message');
        $history = $request->input('history', []);
        $image = $request->input('image');

        return new StreamedResponse(function () use ($message, $history, $image) {
            $this->geminiService->streamChat($message, $history, $image);
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no',
        ]);
    }
}
