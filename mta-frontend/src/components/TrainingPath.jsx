import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, PlayCircle, BookOpen, RotateCcw, Lock, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

// Maps slug → route (source of truth for navigation)
const SLUG_TO_ROUTE = {
    reglement: '/reglement-interieur',
    hse_operator: '/formation/hse-operateur',
    hse_visitor: '/formation/hse-visiteur',
    tracabilite: '/formation/tracabilite',
    assemblage: '/formation/assemblage',
    kaizen_5s: '/formation/kaizen-5s',
};

const TrainingPath = ({ userType = 'operator' }) => {
    const [formations, setFormations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [highlightSlug, setHighlightSlug] = useState(null);

    useEffect(() => {
        const fetchProgress = async () => {
            setIsLoading(true);
            try {
                const res = await api.get('/user/progress', { params: { type: userType } });
                setFormations(res.data.formations || []);
            } catch (error) {
                console.error('Failed to fetch progress:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProgress();
    }, [userType]);

    // Handle auto-scroll from session storage (after completing a module)
    useEffect(() => {
        const pendingScroll = sessionStorage.getItem('pendingScroll');

        if (!isLoading && pendingScroll) {
            const attemptScroll = (attempts = 0) => {
                const targetElement = document.getElementById(`module-${pendingScroll}`);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setHighlightSlug(pendingScroll);
                    sessionStorage.removeItem('pendingScroll');
                    setTimeout(() => setHighlightSlug(null), 4000);
                } else if (attempts < 10) {
                    setTimeout(() => attemptScroll(attempts + 1), 200);
                }
            };
            setTimeout(() => attemptScroll(), 500);
        }
    }, [isLoading]);

    const completedCount = formations.filter(f => f.completed).length;
    const progress = formations.length > 0 ? Math.min((completedCount / formations.length) * 100, 100) : 0;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto py-16 px-4 font-sans">
            {/* Header */}
            <div className="mb-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-blue-100"
                >
                    <BookOpen size={14} />
                    Progression Actuelle
                </motion.div>

                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                    Parcours d'Intégration
                </h2>

                <div className="w-full max-w-md mx-auto bg-gray-100 rounded-full h-3 mb-4 overflow-hidden shadow-inner border border-gray-200">
                    <motion.div
                        className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                </div>

                <div className="flex items-center justify-center gap-3">
                    <span className="text-3xl font-black text-blue-600">{Math.round(progress)}%</span>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        {completedCount} / {formations.length} {formations.length > 1 ? 'étapes validées' : 'étape validée'}
                    </p>
                </div>
            </div>

            {/* Timeline */}
            <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1.5 h-full bg-gray-100 rounded-full"></div>

                <motion.div
                    className="absolute left-1/2 transform -translate-x-1/2 w-1.5 bg-blue-600 rounded-full origin-top"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: formations.length > 0 ? completedCount / formations.length : 0 }}
                    transition={{ duration: 2, ease: 'easeInOut' }}
                />

                <div className="space-y-16 relative z-10">
                    {formations.map((step, index) => {
                        const isCompleted = step.completed;
                        const isLocked = step.is_locked;
                        const isEven = index % 2 === 0;
                        const route = SLUG_TO_ROUTE[step.slug] || '#';
                        const isHighlighted = highlightSlug === step.slug;

                        return (
                            <div
                                key={step.slug}
                                id={`module-${step.slug}`}
                                className={`flex items-center w-full ${isEven ? 'justify-start' : 'justify-end'}`}
                            >
                                <motion.div
                                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className={`w-5/12 ${isEven ? 'text-right pr-14' : 'text-left pl-14'}`}
                                >
                                    <div
                                        className={`p-8 rounded-3xl transition-all duration-300 flex flex-col items-center text-center relative
                                            ${isCompleted ? 'bg-white shadow-md border-2 border-green-200 hover:shadow-lg'
                                                : isLocked ? 'bg-slate-50 border-2 border-slate-200 opacity-60 grayscale cursor-not-allowed'
                                                    : 'bg-white shadow-xl border-2 border-blue-500 ring-4 ring-blue-50 transform hover:scale-105'
                                            }
                                            ${isHighlighted ? 'animate-pulse ring-4 ring-blue-400 shadow-2xl scale-105' : ''}
                                        `}
                                        onClick={(e) => {
                                            if (isLocked) {
                                                e.preventDefault();
                                                alert('Ce module est verrouillé. Complétez d\'abord le module précédent.');
                                            }
                                        }}
                                    >
                                        <span className={`text-xs font-black px-4 py-1.5 rounded-full mb-4 inline-block tracking-wide
                                            ${isCompleted ? 'bg-green-100 text-green-700'
                                                : isLocked ? 'bg-slate-200 text-slate-500'
                                                    : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            Module {index + 1}
                                        </span>

                                        <h3 className="text-2xl font-black mb-3 text-gray-900 tracking-tight">
                                            {step.title}
                                        </h3>

                                        {/* Buttons based on status */}
                                        {isLocked ? (
                                            <button disabled className="inline-flex items-center gap-2 bg-slate-200 text-slate-500 px-6 py-2.5 rounded-full font-bold text-sm cursor-not-allowed mt-2">
                                                <Lock size={16} />
                                                Verrouillé
                                            </button>
                                        ) : isCompleted ? (
                                            <Link to={route}>
                                                <button className="inline-flex items-center gap-2 bg-green-50 text-green-700 border-2 border-green-200 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-green-100 hover:shadow-md transition-all mt-2">
                                                    <RotateCcw size={16} />
                                                    Revoir le module
                                                </button>
                                            </Link>
                                        ) : (
                                            <Link to={route}>
                                                <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-blue-700 hover:shadow-lg transition-all mt-2">
                                                    <PlayCircle size={20} />
                                                    Commencer
                                                </button>
                                            </Link>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Timeline Node Icon */}
                                <motion.div
                                    className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: index * 0.1 + 0.3, type: 'spring', stiffness: 200 }}
                                >
                                    <div className={`w-16 h-16 rounded-full border-4 border-white flex items-center justify-center shadow-lg transition-all duration-500 
                                        ${isCompleted ? 'bg-green-500 text-white'
                                            : isLocked ? 'bg-slate-300 text-slate-500'
                                                : 'bg-blue-600 text-white ring-8 ring-blue-100 scale-110'
                                        }`}>
                                        {isCompleted ? <Check size={28} strokeWidth={3} />
                                            : isLocked ? <Lock size={24} />
                                                : <BookOpen size={24} />}
                                    </div>
                                </motion.div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TrainingPath;