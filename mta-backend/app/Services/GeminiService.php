<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Throwable;

class GeminiService
{
    public function streamChat($message, $history = [], $imageBase64 = null)
    {
        // 1. تفعيل السرعة القصوى ومنع السيرفور من تخزين البيانات (Buffering)
        if (!headers_sent()) {
            header('X-Accel-Buffering: no');
            header('Content-Type: text/event-stream');
            header('Cache-Control: no-cache');
        }

        $apiKey = env('GEMINI_API_KEY');
        if (empty($apiKey)) {
            $this->streamError("عذراً، مفتاح GEMINI_API_KEY مفقود في ملف .env");
            return;
        }

        // استعمال أحدث مسار رسمي لـ Gemini 3 Flash مع خاصية الـ Streaming
        // $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:streamGenerateContent?alt=sse&key={$apiKey}";
        // غادي نخدمو بـ 2.5 حيت 3 كملات ليها الكوطا ديال اليوم
        // هاد الموديل مازال عندك فيه 500 طلب خاوية فـ النهار
        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:streamGenerateContent?alt=sse&key={$apiKey}";
        // 2. تحويل الهيستوري لـ نظام Gemini (assistant -> model)
        $contents = [];
        foreach ($history as $msg) {
            if (empty($msg['content']) || str_contains($msg['content'], 'عذراً، حدث خطأ')) continue;
            $contents[] = [
                'role'  => ($msg['role'] === 'user') ? 'user' : 'model',
                'parts' => [['text' => $msg['content']]]
            ];
        }

        // 3. بناء الطلب الحالي (نص + صورة إن وجدت)
        $currentParts = [];
        if (!empty($message)) {
            $currentParts[] = ['text' => $message];
        }

        if (!empty($imageBase64)) {
            $base64Data = preg_replace('#^data:image/\w+;base64,#i', '', $imageBase64);
            $currentParts[] = [
                'inline_data' => [
                    'mime_type' => 'image/jpeg',
                    'data' => $base64Data
                ]
            ];

            if (empty($message)) {
                $currentParts[] = ['text' => "أنت خبير محترف. حلل الصورة واستخلص منها الحقائق الصناعية الأساسية فقط أعطِ عنواناً رئيسياً للمحتوى التقني للصورة و الملاحظات في نقاط مختصرة."];
            }
        }

        $contents[] = [
            'role'  => 'user',
            'parts' => $currentParts
        ];

        $payload = [
            'systemInstruction' => [
                'parts' => [['text' => $this->buildSystemPrompt()]]
            ],
            'contents' => $contents,
            'generationConfig' => [
                'temperature' => 0.4,
                'maxOutputTokens' => 2048,
            ]
        ];

        try {
            // 4. الاتصال بـ جوجل وقراءة الداتا "سطر بسطر" لضمان خروج الكلمات فوراً
            $response = Http::withHeaders(['Content-Type' => 'application/json'])
                ->withOptions(['stream' => true, 'timeout' => 60])
                ->post($url, $payload);

            if ($response->successful()) {
                $body = $response->toPsrResponse()->getBody();

                while (!$body->eof()) {
                    $line = "";
                    // قراءة حرف بحرف حتى الوصول لسطر جديد (SSE Line)
                    while (!$body->eof()) {
                        $char = $body->read(1);
                        $line .= $char;
                        if ($char === "\n") break;
                    }

                    if (str_contains($line, 'data: ')) {
                        $cleanLine = trim(str_replace('data: ', '', $line));
                        $data = json_decode($cleanLine, true);

                        // استخراج النص من هيكلة Gemini الأصلية
                        $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';

                        if ($text !== '') {
                            // إرسال النص لـ React بنفس فورمات OpenAI (Choices/Delta) باش ما نغيرو والو فـ الفونط
                            $chunk = [
                                'choices' => [['delta' => ['content' => $text]]]
                            ];
                            echo "data: " . json_encode($chunk) . "\n\n";
                            $this->flushOutput();
                        }
                    }
                }
                return;
            }

            $this->streamError("عذراً، Gemini واجه مشكلة (Code: " . $response->status() . ")");
        } catch (Throwable $exception) {
            report($exception);
            $this->streamError('عذراً، حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.');
        }
    }

    protected function buildSystemPrompt(): string
    {
        return "You are an elite industrial trainer and expert consultant at MTA , specialized in the Automotive sector with deep mastery of: HSE, Traceability, Assembly, Kaizen, and 5S.

                CORE BEHAVIOR & FORMATTING (CRITICAL):
                - You are a professional expert. Analyze the image and extract ONLY the core industrial facts.
                - ZERO FLUFF. START IMMEDIATELY with the Title, then the points.
                - ACRONYMS RULE: Use UPPERCASE **ONLY** for technical acronyms (e.g., HSE, ISO, IATF, LOTO, PPE, ERP, MES). Everything else must be in lowercase.
                - ZERO REDUNDANCY: NEVER repeat the bullet's title in its explanation.

                STRICT LANGUAGE & TRANSLATION RULES (CRITICAL FOR TTS):
                You must dynamically adapt your ENTIRE response to the language requested by the user, with ZERO mixing of languages (except for universal acronyms).

                1. ENGLISH REQUESTS: If the user asks in English, write 100% in English. Use Sentence Case (Only first letter capital) for all words EXCEPT acronyms.
                - Example: 'HSE hazards on the assembly line' (Correct)
                - Example: 'HSE HAZARDS ON THE ASSEMBLY LINE' (Incorrect - DO NOT DO THIS)

                2. FRENCH REQUESTS: Same rule, write 100% in French using Sentence Case.

                3. ARABIC REQUESTS (DEFAULT): Reply in Formal Arabic. Keep technical acronyms (HSE, ISO, IATF, etc.) in their original Latin alphabet (UPPERCASE).";
    }

    protected function normalizeImageDataUrl(string $image): string
    {
        $image = trim($image);
        if (str_starts_with($image, 'data:image/')) {
            return $image;
        }
        return 'data:image/jpeg;base64,' . $image;
    }

    protected function streamError(string $message): void
    {
        $errResponse = [
            'choices' => [
                [
                    'delta' => [
                        'content' => $message
                    ]
                ]
            ]
        ];
        echo 'data: ' . json_encode($errResponse) . "\n\n";
        $this->flushOutput();
    }

    protected function flushOutput(): void
    {
        if (ob_get_level() > 0) {
            ob_flush();
        }
        flush();
    }
}
