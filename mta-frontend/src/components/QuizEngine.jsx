import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { allQuizzes } from '../pages/quizData';

const QuizEngine = ({ category, onComplete }) => {
    const [lang, setLang] = useState(null); // 'ar' or 'fr'
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isFinished, setIsFinished] = useState(false);
    const bottomRef = useRef(null);

    // Auto-scroll logic
    useEffect(() => {
        if (showExplanation && bottomRef.current) {
            setTimeout(() => {
                bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 400);
        } else if (!showExplanation && !isFinished) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [showExplanation, currentQuestion, isFinished]);

    if (!lang) {
        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center p-12 md:p-24 bg-white rounded-[2.5rem] shadow-2xl border border-blue-50 relative overflow-hidden min-h-[500px] w-full max-w-3xl mx-auto">
                {/* Background decorative elements */}
                <div className="absolute -top-32 -left-32 w-72 h-72 bg-blue-100/50 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-green-100/50 rounded-full blur-3xl"></div>

                <div className="relative z-10 w-full flex flex-col items-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 150, delay: 0.1 }}
                        className="bg-blue-50 text-blue-600 p-5 rounded-[2rem] mb-10 shadow-sm border border-blue-100"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-3 text-center leading-tight tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 drop-shadow-sm">
                            Choisir la langue
                        </span>
                    </h2>
                    <h3 className="text-3xl md:text-4xl font-black text-green-600 mb-14 text-center leading-tight">
                        اختر لغة الاختبار
                    </h3>

                    <div className="flex flex-col sm:flex-row gap-8 w-full max-w-2xl">
                        <button
                            onClick={() => setLang('ar')}
                            className="group flex-1 flex flex-col items-center justify-center py-10 px-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-[2rem] transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/40 hover:-translate-y-2 border-b-[6px] border-green-700 active:border-b-0 active:translate-y-2"
                        >
                            <span className="text-5xl mb-4 block transform group-hover:scale-110 transition-transform duration-300">🇲🇦</span>
                            <span className="text-3xl font-black tracking-wide">العربية</span>
                        </button>

                        <button
                            onClick={() => setLang('fr')}
                            className="group flex-1 flex flex-col items-center justify-center py-10 px-6 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-[2rem] transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-2 border-b-[6px] border-indigo-800 active:border-b-0 active:translate-y-2"
                        >
                            <span className="text-5xl mb-4 block transform group-hover:scale-110 transition-transform duration-300">🇫🇷</span>
                            <span className="text-3xl font-black tracking-wide">Français</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }

    const data = allQuizzes[lang]?.[category];

    // Safety check just in case
    if (!data) {
        return <div className="p-8 text-center text-red-500 font-bold">Quiz data not found!</div>;
    }

    const question = data[currentQuestion];
    const passingScore = Math.ceil(data.length * 0.8);
    const isRtl = lang === 'ar';

    const handleOptionClick = (index) => {
        if (showExplanation) return;
        setSelectedOption(index);
        setShowExplanation(true);
        if (index === question.correctAnswer) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestion < data.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setShowExplanation(false);
            setSelectedOption(null);
        } else {
            setIsFinished(true);
        }
    };

    const handleRetry = () => {
        setCurrentQuestion(0);
        setScore(0);
        setShowExplanation(false);
        setSelectedOption(null);
        setIsFinished(false);
    };

    if (isFinished) {
        const isPassed = score >= passingScore;
        return (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-10 md:p-16 bg-white rounded-3xl shadow-xl border border-gray-100 w-full relative overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
                <div className="relative z-10">
                    <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 150, delay: 0.2 }} className="mx-auto mb-8">
                        {isPassed ? (
                            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/40 border-4 border-white">
                                <CheckCircle className="text-white" size={64} />
                            </div>
                        ) : (
                            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/40 border-4 border-white">
                                <XCircle className="text-white" size={64} />
                            </div>
                        )}
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-gray-900">
                        {isPassed
                            ? (isRtl ? "تهانينا!" : "Félicitations !")
                            : (isRtl ? "فشل في الاختبار" : "Échec du Quiz")}
                    </h2>
                    <p className="text-gray-500 text-xl md:text-2xl font-medium mb-10">
                        {isRtl ? "لقد حصلت على" : "Vous avez obtenu"} <span className={`font-black ${isPassed ? 'text-green-600' : 'text-red-600'}`}>{score}</span> {isRtl ? "من" : "sur"} {data.length}.
                    </p>

                    {isPassed ? (
                        <button onClick={onComplete} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all shadow-xl shadow-blue-500/30 hover:-translate-y-1">
                            {isRtl ? "إنهاء التدريب" : "Terminer la formation"}
                        </button>
                    ) : (
                        <button onClick={handleRetry} className="flex items-center justify-center gap-3 mx-auto bg-gray-500 hover:bg-gray-600 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-md hover:-translate-y-1">
                            <RefreshCw size={24} /> {isRtl ? "إعادة المحاولة" : "Réessayer"}
                        </button>
                    )}
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-gray-100 w-full relative overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>

            <div className="relative z-10">
                {/* Progress bar */}
                <div className="mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">
                        <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                            {isRtl ? `السؤال ${currentQuestion + 1} من ${data.length}` : `Question ${currentQuestion + 1} de ${data.length}`}
                        </span>
                        <span className="text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                            {isRtl ? `النتيجة : ${score}` : `Score : ${score}`}
                        </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${((currentQuestion + 1) / data.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Question Area */}
                <div className="relative bg-blue-600 rounded-3xl p-8 md:p-12 mb-10 min-h-[200px] flex items-center justify-center shadow-lg overflow-hidden group">
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-1000"></div>
                    <h3 className="relative z-10 text-xl md:text-3xl font-bold text-white text-center leading-snug tracking-wide shadow-black/10 drop-shadow-md">{question.question}</h3>
                </div>

                {/* Options */}
                <div className="space-y-4">
                    {question.options.map((option, index) => {
                        let btnClass = `relative w-full ${isRtl ? 'text-right' : 'text-left'} p-5 md:p-6 rounded-[1.5rem] border-2 transition-all duration-300 font-bold text-lg md:text-xl group overflow-hidden `;

                        if (!showExplanation) {
                            btnClass += "border-slate-200 bg-white hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 text-slate-700";
                        } else if (index === question.correctAnswer) {
                            btnClass += "border-green-500 bg-green-50 text-green-800 shadow-md ring-4 ring-green-500/20";
                        } else if (index === selectedOption) {
                            btnClass += "border-red-500 bg-red-50 text-red-800 shadow-md ring-4 ring-red-500/20";
                        } else {
                            btnClass += "border-slate-100 bg-slate-50 text-slate-400 opacity-60";
                        }

                        return (
                            <button key={index} onClick={() => handleOptionClick(index)} className={btnClass} disabled={showExplanation}>
                                {/* Option hover background effect */}
                                {!showExplanation && <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>}

                                <div className="relative z-10 flex items-center gap-5">
                                    <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center shrink-0 text-lg font-black transition-all duration-300 ${!showExplanation ? 'border-slate-200 text-slate-400 group-hover:border-blue-500 group-hover:text-blue-600 group-hover:bg-blue-100/50' :
                                        index === question.correctAnswer ? 'border-green-500 bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg shadow-green-500/30' :
                                            index === selectedOption ? 'border-red-500 bg-gradient-to-br from-red-400 to-red-600 text-white shadow-lg shadow-red-500/30' : 'border-slate-200 text-slate-300'
                                        }`}>
                                        {!showExplanation ? String.fromCharCode(65 + index) :
                                            index === question.correctAnswer ? <CheckCircle size={24} /> :
                                                index === selectedOption ? <XCircle size={24} /> : String.fromCharCode(65 + index)}
                                    </div>
                                    <span className="leading-snug">{option}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                    {showExplanation && (
                        <motion.div initial={{ opacity: 0, y: 10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} className="mt-8 relative overflow-hidden">
                            <div className={`p-6 md:p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-500 ${isRtl ? 'border-r-4 rounded-l-3xl rounded-br-3xl' : 'border-l-4 rounded-r-3xl rounded-bl-3xl'} flex gap-5 items-start shadow-inner`}>
                                <div className="bg-white p-2 rounded-full shadow-sm mt-0.5">
                                    <AlertCircle className="text-blue-600 shrink-0" size={24} />
                                </div>
                                <p className="text-slate-800 text-lg md:text-xl font-bold leading-relaxed">{question.explanation}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Next button */}
                {showExplanation && (
                    <div ref={bottomRef} className="mt-8">
                        <button onClick={handleNext} className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-1">
                            <span className="flex items-center justify-center gap-3">
                                {currentQuestion < data.length - 1
                                    ? (isRtl ? "السؤال التالي" : "Question Suivante")
                                    : (isRtl ? "عرض النتائج" : "Voir les résultats")}
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default QuizEngine;