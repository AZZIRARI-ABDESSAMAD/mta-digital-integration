<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TtsController extends Controller
{
    public function synthesize(Request $request)
    {
        $request->validate([
            'text' => 'required|string'
        ]);

        $apiKey = env('ELEVENLABS_API_KEY');
        $voiceId = env('ELEVENLABS_DEFAULT_VOICE', 'pNInz6obpgDQGcFmaJcg');

        // صيفطنا الطلب لـ ElevenLabs
        $response = Http::withHeaders([
            'xi-api-key' => $apiKey,
            'Content-Type' => 'application/json',
            'Accept' => 'audio/mpeg',
        ])->post("https://api.elevenlabs.io/v1/text-to-speech/{$voiceId}", [
            'text' => $request->text,
            'model_id' => 'eleven_multilingual_v2',
            'voice_settings' => [
                'stability' => 0.5,
                'similarity_boost' => 0.75,
            ]
        ]);

        // يلا كاين شي إيرور من السيرفور ديالهم، غيبان لينا
        if ($response->failed()) {
            return response()->json([
                'error' => 'ElevenLabs API Error',
                'details' => $response->json()
            ], $response->status());
        }

        // كنرجعو الأوديو ديريكت للفرونت-اند
        return response($response->body(), 200)
            ->header('Content-Type', 'audio/mpeg');
    }
}
