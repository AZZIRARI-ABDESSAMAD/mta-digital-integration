// import React, { useState, useRef, useEffect } from 'react';
// import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';
// import { Volume2, Loader2, Square } from 'lucide-react';

// const AIVoiceReader = ({ textToRead }) => {
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);

//     // Use Ref for synthesizer and player to avoid stale closures in event handlers
//     const synthesizerRef = useRef(null);
//     const playerRef = useRef(null);

//     const handlePlayAudio = () => {
//         if (!textToRead) {
//             console.warn("AIVoiceReader: No text provided to read.");
//             return;
//         }

//         const key = import.meta.env.VITE_AZURE_SPEECH_KEY;
//         const region = import.meta.env.VITE_AZURE_SPEECH_REGION;

//         if (!key || !region) {
//             console.error("AIVoiceReader: Missing Azure Speech credentials in .env");
//             alert("خطأ: مفاتيح خدمة Azure Speech غير متوفرة. المرجو التحقق من ملف .env");
//             return;
//         }

//         setIsLoading(true);
//         console.log("AIVoiceReader: Initializing speech synthesis...");

//         try {
//             const speechConfig = speechsdk.SpeechConfig.fromSubscription(key, region);

//             // Clean text: keep punctuation like . , : - ! ? and Arabic commas
//             let cleanedText = textToRead
//                 .replace(/[*#_~`>|(){}\[\]\\/@&^+=<>$%"']/g, '')
//                 .replace(/\n{3,}/g, '\n\n')
//                 .trim();

//             let currentLang = 'en-US';
//             let currentVoice = 'en-US-AvaNeural';

//             // Dynamic voice: detect language of the response
//             const hasArabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(cleanedText);

//             if (hasArabic) {
//                 // Arabic text: remove ALL Latin/French words so TTS only speaks Arabic
//                 cleanedText = cleanedText.replace(/[a-zA-ZÀ-ÿ]+/g, '').replace(/\s{2,}/g, ' ').trim();
//                 currentLang = 'ar-MA';
//                 currentVoice = 'ar-MA-JamalNeural';
//             } else {
//                 // Heuristic to distinguish French from English: 
//                 // Check for common French accents or common French function words
//                 const hasFrenchIndicators = /[àâçéèêëîïôûùÿ]/.test(cleanedText.toLowerCase()) ||
//                     /\b(le|la|les|un|une|des|et|est|dans|pour|avec)\b/i.test(cleanedText);

//                 if (hasFrenchIndicators) {
//                     currentLang = 'fr-FR';
//                     currentVoice = 'fr-FR-DeniseNeural';
//                 }
//             }

//             speechConfig.speechSynthesisLanguage = currentLang;
//             speechConfig.speechSynthesisVoiceName = currentVoice;
//             console.log(`AIVoiceReader: Voice → ${currentVoice}`);

//             // Helper to generate SSML with punctuation pauses
//             const createSSML = (text, lang, voice) => {
//                 // Escape XML characters
//                 let escapedText = text
//                     .replace(/&/g, '&amp;')
//                     .replace(/</g, '&lt;')
//                     .replace(/>/g, '&gt;');

//                 // Completely replace problematic punctuation so they aren't spoken aloud as "point", "tiret", etc.
//                 // We keep ? and ! because removing them breaks the voice's intonation.
//                 let pauseText = escapedText.replace(/([.,:;،؛\-])/g, ' <break time="500ms" /> ');
//                 pauseText = pauseText.replace(/([!؟?])/g, '$1 <break time="500ms" /> ');

//                 return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${lang}">
//                             <voice name="${voice}">
//                                 ${pauseText}
//                             </voice>
//                         </speak>`;
//             };

//             const ssmlPayload = createSSML(cleanedText, currentLang, currentVoice);

//             const player = new speechsdk.SpeakerAudioDestination();
//             playerRef.current = player;

//             const audioConfig = speechsdk.AudioConfig.fromSpeakerOutput(player);
//             const synthesizer = new speechsdk.SpeechSynthesizer(speechConfig, audioConfig);
//             synthesizerRef.current = synthesizer;

//             player.onAudioStart = () => {
//                 console.log("AIVoiceReader: Audio playback started.");
//                 setIsLoading(false);
//                 setIsPlaying(true);
//             };

//             player.onAudioEnd = () => {
//                 console.log("AIVoiceReader: Audio playback finished.");
//                 setIsPlaying(false);
//                 cleanupSynthesizer();
//             };

//             synthesizer.speakSsmlAsync(
//                 ssmlPayload,
//                 (result) => {
//                     if (result.reason === speechsdk.ResultReason.SynthesizingAudioCompleted) {
//                         console.log("AIVoiceReader: Synthesis successful.");
//                     } else {
//                         console.error("AIVoiceReader: Synthesis failed:", result.errorDetails);
//                         setIsLoading(false);
//                         setIsPlaying(false);
//                         cleanupSynthesizer();
//                     }
//                 },
//                 (error) => {
//                     console.error("AIVoiceReader: speakSsmlAsync error:", error);
//                     setIsLoading(false);
//                     setIsPlaying(false);
//                     cleanupSynthesizer();
//                 }
//             );

//         } catch (err) {
//             console.error("AIVoiceReader: Initialization error:", err);
//             setIsLoading(false);
//             setIsPlaying(false);
//         }
//     };

//     const cleanupSynthesizer = () => {
//         if (synthesizerRef.current) {
//             synthesizerRef.current.close();
//             synthesizerRef.current = null;
//         }
//         if (playerRef.current) {
//             playerRef.current.pause();
//             playerRef.current = null;
//         }
//     };

//     const handleStopAudio = () => {
//         console.log("AIVoiceReader: Stopping audio manually.");
//         cleanupSynthesizer();
//         setIsPlaying(false);
//         setIsLoading(false);
//     };

//     // Cleanup on unmount
//     useEffect(() => {
//         return () => cleanupSynthesizer();
//     }, []);

//     return (
//         <button
//             onClick={isPlaying ? handleStopAudio : handlePlayAudio}
//             disabled={isLoading}
//             className={`flex items-center justify-center p-2 rounded-full transition-all duration-200 
//                 ${isPlaying ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'} 
//                 ${isLoading ? 'opacity-50 cursor-not-allowed text-slate-300' : ''}`}
//             title={isPlaying ? "إيقاف القراءة" : "استمع للمساعد"}
//         >
//             {isLoading ? (
//                 <Loader2 size={20} className="animate-spin text-blue-500" />
//             ) : isPlaying ? (
//                 <Square size={18} fill="currentColor" />
//             ) : (
//                 <Volume2 size={20} />
//             )}
//         </button>
//     );
// };

// export default AIVoiceReader;












import React, { useState, useRef, useEffect } from 'react';
import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';
import { Volume2, Loader2, Square } from 'lucide-react';

const AIVoiceReader = ({ textToRead }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const synthesizerRef = useRef(null);
    const playerRef = useRef(null);

    const handlePlayAudio = () => {
        if (!textToRead) {
            console.warn("AIVoiceReader: No text provided to read.");
            return;
        }

        const key = import.meta.env.VITE_AZURE_SPEECH_KEY;
        const region = import.meta.env.VITE_AZURE_SPEECH_REGION;

        if (!key || !region) {
            console.error("AIVoiceReader: Missing Azure Speech credentials in .env");
            alert("خطأ: مفاتيح خدمة Azure Speech غير متوفرة. المرجو التحقق من ملف .env");
            return;
        }

        setIsLoading(true);

        try {
            const speechConfig = speechsdk.SpeechConfig.fromSubscription(key, region);

            // Clean text: keep punctuation but remove markdown/special characters
            let cleanedText = textToRead
                .replace(/[*#_~`>|(){}\[\]\\/@&^+=<>$%"']/g, '')
                .replace(/\n{3,}/g, '\n\n')
                // السطر السحري اللي غيفك المشكل ديال ڭاع الاختصارات بحال HSE و ISO
                .replace(/\b[A-Z]{2,}\b/g, (match) => match.split('').join(' '))
                .trim();

            let currentLang = 'en-US';
            let currentVoice = 'en-US-AvaNeural';

            // Detect language based on Arabic characters
            // Detect language based on Arabic characters
            const hasArabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(cleanedText);

            if (hasArabic) {
                currentLang = 'ar-MA';
                currentVoice = 'ar-MA-JamalNeural';

                // 1. السحر الأول: مسح أي كلمة فرنسية/لاتينية فيها حروف صغيرة (بحال Traçabilité أو Produits)
                cleanedText = cleanedText.replace(/[A-Za-zÀ-ÿ]*[a-zà-ÿ][A-Za-zÀ-ÿ]*/g, '');

                // 2. السحر الثاني: الاختصارات اللي بقاو (كلهم Majuscule) غنفرقوهم باش يتقراو مزيان (IATF تولي I A T F)
                cleanedText = cleanedText.replace(/\b[A-Z]{2,}\b/g, (match) => match.split('').join(' '));

                // 3. السحر الثالث: ملي غنمسحو الكلمات، غيبقاو لينا أقواس خاويين ()، هاد السطر كيمسحهم باش ما يتقراوش
                cleanedText = cleanedText.replace(/\(\s*\)/g, ' ');

                // 4. تنقية المسافات الزايدة
                cleanedText = cleanedText.replace(/\s{2,}/g, ' ').trim();
            } else {
                const hasFrenchIndicators = /[àâçéèêëîïôûùÿ]/.test(cleanedText.toLowerCase()) ||
                    /\b(le|la|les|un|une|des|et|est|dans|pour|avec)\b/i.test(cleanedText);

                if (hasFrenchIndicators) {
                    currentLang = 'fr-FR';
                    currentVoice = 'fr-FR-DeniseNeural';
                }
            }

            speechConfig.speechSynthesisLanguage = currentLang;
            speechConfig.speechSynthesisVoiceName = currentVoice;

            const createSSML = (text, lang, voice) => {
                let escapedText = text
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');

                // Add 500ms pause after punctuation marks
                let pauseText = escapedText.replace(/([.,:;،؛\-])/g, ' <break time="500ms" /> ');
                pauseText = pauseText.replace(/([!؟?])/g, '$1 <break time="500ms" /> ');

                return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${lang}">
                            <voice name="${voice}">
                                ${pauseText}
                            </voice>
                        </speak>`;
            };

            const ssmlPayload = createSSML(cleanedText, currentLang, currentVoice);

            const player = new speechsdk.SpeakerAudioDestination();
            playerRef.current = player;

            const audioConfig = speechsdk.AudioConfig.fromSpeakerOutput(player);
            const synthesizer = new speechsdk.SpeechSynthesizer(speechConfig, audioConfig);
            synthesizerRef.current = synthesizer;

            player.onAudioStart = () => {
                setIsLoading(false);
                setIsPlaying(true);
            };

            player.onAudioEnd = () => {
                setIsPlaying(false);
                cleanupSynthesizer();
            };

            synthesizer.speakSsmlAsync(
                ssmlPayload,
                (result) => {
                    if (result.reason !== speechsdk.ResultReason.SynthesizingAudioCompleted) {
                        console.error("AIVoiceReader: Synthesis failed:", result.errorDetails);
                        setIsLoading(false);
                        setIsPlaying(false);
                        cleanupSynthesizer();
                    }
                },
                (error) => {
                    console.error("AIVoiceReader: speakSsmlAsync error:", error);
                    setIsLoading(false);
                    setIsPlaying(false);
                    cleanupSynthesizer();
                }
            );

        } catch (err) {
            console.error("AIVoiceReader: Initialization error:", err);
            setIsLoading(false);
            setIsPlaying(false);
        }
    };

    const cleanupSynthesizer = () => {
        if (synthesizerRef.current) {
            synthesizerRef.current.close();
            synthesizerRef.current = null;
        }
        if (playerRef.current) {
            playerRef.current.pause();
            playerRef.current = null;
        }
    };

    const handleStopAudio = () => {
        cleanupSynthesizer();
        setIsPlaying(false);
        setIsLoading(false);
    };

    useEffect(() => {
        return () => cleanupSynthesizer();
    }, []);

    return (
        <button
            onClick={isPlaying ? handleStopAudio : handlePlayAudio}
            disabled={isLoading}
            className={`flex items-center justify-center p-2 rounded-full transition-all duration-200 
                ${isPlaying ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'} 
                ${isLoading ? 'opacity-50 cursor-not-allowed text-slate-300' : ''}`}
            title={isPlaying ? "إيقاف القراءة" : "استمع للمساعد"}
        >
            {isLoading ? (
                <Loader2 size={20} className="animate-spin text-blue-500" />
            ) : isPlaying ? (
                <Square size={18} fill="currentColor" />
            ) : (
                <Volume2 size={20} />
            )}
        </button>
    );
};

export default AIVoiceReader;