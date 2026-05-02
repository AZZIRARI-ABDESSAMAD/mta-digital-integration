<?php

namespace Tests\Unit;

use App\Services\GeminiService;
use PHPUnit\Framework\TestCase;

class GeminiServiceTest extends TestCase
{
    public function test_system_prompt_forbids_latin_words_in_arabic_replies(): void
    {
        $service = new class extends GeminiService
        {
            public function exposeSystemPrompt(): string
            {
                return $this->buildSystemPrompt();
            }
        };

        $prompt = $service->exposeSystemPrompt();

        $this->assertStringContainsString('write the whole answer in Arabic script only', $prompt);
        $this->assertStringContainsString('DO NOT write French words, English words, or Latin letters anywhere', $prompt);
        $this->assertStringContainsString('اتش اس إي', $prompt);
        $this->assertStringNotContainsString('Packaging)', $prompt);
        $this->assertStringNotContainsString('aucun mot latin', mb_strtolower($prompt));
    }

    public function test_arabic_formatting_detection_handles_arabic_and_romanized_darija(): void
    {
        $service = new class extends GeminiService
        {
            public function exposeShouldForceFormatting(?string $message, array $history): bool
            {
                return $this->shouldForceArabicScriptFormatting($message, $history);
            }
        };

        $this->assertTrue($service->exposeShouldForceFormatting('بغيت نشرح packaging ديال الخط', []));
        $this->assertTrue($service->exposeShouldForceFormatting('wach ممكن تشرح lia hadshi dyal packaging', []));
        $this->assertFalse($service->exposeShouldForceFormatting('Pouvez-vous expliquer le packaging de la ligne ?', []));
    }

    public function test_image_normalization_keeps_existing_data_url(): void
    {
        $service = new class extends GeminiService
        {
            public function exposeNormalizeImageDataUrl(string $image): string
            {
                return $this->normalizeImageDataUrl($image);
            }
        };

        $dataUrl = 'data:image/png;base64,abc123';

        $this->assertSame($dataUrl, $service->exposeNormalizeImageDataUrl($dataUrl));
        $this->assertSame('data:image/jpeg;base64,abc123', $service->exposeNormalizeImageDataUrl('abc123'));
    }
}
