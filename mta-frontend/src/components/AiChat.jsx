import React, { useState, useRef, useEffect } from 'react';
import AIVoiceReader from '../pages/AIVoiceReader';

const AiChat = () => {
    const [messages, setMessages] = useState([
        { role: 'model', content: 'مرحباً! أنا المساعد الذكي. يمكنك سحب أي صورة من الدرس وإفلاتها هنا لي اشرحها لك !' }
    ]);
    const [input, setInput] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // حالة جديدة باش نعرفو واش اليوزر كيجر شي تصويرة فوق الشات
    const [isDragging, setIsDragging] = useState(false);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // ===== دوال السحب والإفلات (Drag & Drop) =====
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setIsDragging(false);

        const imageUrl = e.dataTransfer.getData('text/plain');
        if (imageUrl) {
            try {
                // كنجيبو التصويرة من الرابط وكنحولوها باش تبان فالشات
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImage(reader.result);
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(blob);
            } catch (err) {
                console.error("Erreur lors du chargement de l'image:", err);
            }
        }
    };

    // ===== باقي الدوال ديال الشات (كيفما كانو) =====
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() && !image) return;

        const userMsg = { role: 'user', content: input, image: imagePreview };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setImage(null);
        setImagePreview(null);
        setIsLoading(true);

        const history = messages.map(m => ({ role: m.role, content: m.content }));

        try {
            setMessages(prev => [...prev, { role: 'model', content: '' }]);
            const token = localStorage.getItem('mta_token');
            const response = await fetch('http://127.0.0.1:8000/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json, text/event-stream',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ message: userMsg.content, image: userMsg.image, history })
            });

            if (!response.ok) throw new Error('Network error');

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let doneReading = false;
            let buffer = '';
            let currentStreamedText = '';

            while (!doneReading) {
                const { value, done } = await reader.read();
                if (done) {
                    doneReading = true;
                    break;
                }

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.trim().startsWith('data:')) {
                        const dataStr = line.replace('data:', '').trim();
                        if (dataStr === '[DONE]') continue;
                        try {
                            const dataObj = JSON.parse(dataStr);
                            if (dataObj.choices && dataObj.choices.length > 0 && dataObj.choices[0].delta?.content) {
                                const newText = dataObj.choices[0].delta.content;
                                currentStreamedText += newText;

                                setMessages(prev => {
                                    const newMsgs = [...prev];
                                    newMsgs[newMsgs.length - 1].content = currentStreamedText;
                                    return newMsgs;
                                });
                            }
                        } catch (e) { }
                    }
                }
            }
        } catch (error) {
            setMessages(prev => {
                const newMsgs = [...prev];
                newMsgs[newMsgs.length - 1].content = "عذراً، حدث خطأ أثناء الاتصال.";
                return newMsgs;
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="fixed right-0 top-0 h-full w-[520px] bg-white/95 backdrop-blur-xl border-l border-slate-200 shadow-[0_0_50px_rgba(0,0,0,0.1)] flex flex-col z-[100] font-sans transition-all duration-300"
            dir="rtl"
            // أحداث السحب والإفلات
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* واجهة زجاجية كتبان فاش اليوزر كيجر التصويرة فوق الشات */}
            {isDragging && (
                <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-sm z-[200] border-4 border-dashed border-blue-500 flex items-center justify-center m-4 rounded-3xl">
                    <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center animate-bounce">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12 text-blue-600 mb-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        <p className="font-bold text-blue-700 text-lg">أفلت الصورة هنا!</p>
                    </div>
                </div>
            )}

            <div className="h-20 flex items-center px-6 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md w-full relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
                <div className="flex items-center gap-3 z-10">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-lg tracking-wide">المساعد الذكي</h2>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/50 flex flex-col w-full scroll-smooth">
                {messages.map((msg, idx) => {
                    const hasArabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(msg.content);

                    return (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'} w-full`}>
                            <div className={`max-w-[85%] p-4 shadow-sm relative group ${msg.role === 'user'
                                ? 'bg-gradient-to-bl from-blue-500 to-blue-600 text-white rounded-2xl rounded-tr-sm shadow-blue-200'
                                : 'bg-white text-slate-800 rounded-2xl rounded-tl-sm border border-slate-200/60 shadow-slate-100'
                                }`}>
                                {msg.image && (
                                    <img src={msg.image} alt="uploaded" className="w-full rounded-xl mb-3 object-cover max-h-48 border border-black/10" />
                                )}
                                <p
                                    className={`whitespace-pre-wrap text-[15px] leading-relaxed ${hasArabic ? 'text-right' : 'text-left'}`}
                                    dir={hasArabic ? "rtl" : "ltr"}
                                >
                                    {msg.content.replace(/[*#_~`]/g, '')}
                                </p>

                                {/* بوطونة الصوت باستخدام AIVoiceReader */}
                                {msg.role === 'model' && msg.content !== '' && !isLoading && (
                                    <div className="absolute -left-10 top-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-all shadow-md rounded-full bg-white">
                                        <AIVoiceReader textToRead={msg.content} />
                                    </div>
                                )}

                                {msg.role === 'model' && msg.content === '' && isLoading && (
                                    <div className="flex space-x-1 space-x-reverse h-5 items-center justify-center mt-1 w-full opacity-70">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-75"></div>
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="bg-white border-t border-slate-200 p-4 flex flex-col gap-3 w-full shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
                {imagePreview && (
                    <div className="relative inline-block self-start ml-2 mb-1">
                        <div className="p-1 bg-white rounded-xl border border-slate-200 shadow-sm">
                            <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-lg" />
                        </div>
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 hover:scale-110 transition-all focus:outline-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex items-center gap-2.5 w-full relative">
                    <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                    </button>

                    <input
                        type="text"
                        placeholder="سولني أو جيب تصويرة لهنا..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 bg-slate-100 border-transparent focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-2xl py-3 px-5 outline-none transition-all text-right text-[15px] border w-full text-slate-700 placeholder-slate-400"
                        disabled={isLoading}
                    />

                    <button type="submit" disabled={isLoading || (!input.trim() && !image)} className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all flex items-center justify-center focus:outline-none">
                        {isLoading ? (
                            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 -ml-1 transform rotate-180">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AiChat;
