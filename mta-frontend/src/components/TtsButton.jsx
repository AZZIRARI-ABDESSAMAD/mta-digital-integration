import React, { useState } from 'react';
import { Volume2, Loader2, Square } from 'lucide-react';
import api from '../api/axios'; // استعمل axios لي مريڭل عندك

const TtsButton = ({ text }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioElement, setAudioElement] = useState(null);

    const handlePlay = async () => {
        // يلا كان خدام وبغا يحبسو
        if (isPlaying && audioElement) {
            audioElement.pause();
            audioElement.currentTime = 0;
            setIsPlaying(false);
            return;
        }

        setIsLoading(true);

        try {
            // صيفطنا للباكاند، والسر هو blob باش مايخسرش الملف الصوتي
            const response = await api.post('/tts', { text }, {
                responseType: 'blob'
            });

            // حولنا داك blob لملف صوتي يقدر يتقرا فالمتصفح
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const audio = new Audio(url);

            setAudioElement(audio);

            audio.onplay = () => {
                setIsLoading(false);
                setIsPlaying(true);
            };

            audio.onended = () => {
                setIsPlaying(false);
            };

            audio.play();

        } catch (error) {
            console.error("Error fetching audio:", error);
            alert("وقع مشكل فتشغيل الصوت. تأكد من السيرفور.");
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handlePlay}
            disabled={isLoading}
            className="flex items-center justify-center p-3 rounded-full transition-all shadow-md active:scale-95 bg-slate-800 text-yellow-400 hover:bg-slate-700 border-2 border-slate-600"
            title="استمع للشرح الصوتي"
        >
            {isLoading ? (
                <Loader2 size={24} className="animate-spin" />
            ) : isPlaying ? (
                <Square size={24} className="fill-yellow-400" />
            ) : (
                <Volume2 size={24} />
            )}
        </button>
    );
};

export default TtsButton;