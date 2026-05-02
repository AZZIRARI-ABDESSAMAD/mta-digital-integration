import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle, Lock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import api from '../api/axios';
import AiChat from '../components/AiChat';
import QuizEngine from '../components/QuizEngine';
import { formationsConfig } from './formationsConfig';

const FormationViewer = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const formation = formationsConfig[id];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);
    const [accessDenied, setAccessDenied] = useState(false);
    const [checkingAccess, setCheckingAccess] = useState(true);

    // Safety check: verify the module is unlocked before showing content
    useEffect(() => {
        if (!formation) {
            setCheckingAccess(false);
            return;
        }
        const checkAccess = async () => {
            try {
                await api.get(`/user/progress/check/${formation.slug}`);
                setCheckingAccess(false);
            } catch (err) {
                if (err.response?.status === 403) {
                    setAccessDenied(true);
                }
                setCheckingAccess(false);
            }
        };
        checkAccess();
    }, [formation]);

    if (!formation) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center min-h-screen text-2xl font-bold text-red-500">
                    Formation introuvable !
                </div>
            </MainLayout>
        );
    }

    if (checkingAccess) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
            </MainLayout>
        );
    }

    if (accessDenied) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-screen gap-6 text-center p-8">
                    <div className="w-24 h-24 bg-red-100 rounded-3xl flex items-center justify-center">
                        <Lock className="text-red-500" size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-800">Module Verrouillé</h2>
                    <p className="text-gray-500 text-lg max-w-md">
                        Vous devez compléter le module précédent avant d'accéder à cette formation.
                    </p>
                    <button
                        onClick={() => navigate('/formations')}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg hover:-translate-y-1"
                    >
                        Retour aux formations
                    </button>
                </div>
            </MainLayout>
        );
    }

    const nextSlide = () => {
        if (currentIndex < formation.images.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const startQuiz = () => {
        setShowQuiz(true);
    };

    // Order of formations matching TrainingPath steps
    const formationOrder = ['reglement', 'hse_operator', 'hse_visitor', 'tracabilite', 'assemblage', 'kaizen_5s'];
    const submitProgress = async () => {
        try {
            await api.post('/user/progress', { module_slug: formation.slug });

            let nextSlug = null;
            const currentSlug = formation.slug;

            // Find the next formation in the sequence
            if (currentSlug === 'hse_operator' || currentSlug === 'hse_visitor') {
                nextSlug = 'tracabilite';
            } else if (currentSlug === 'tracabilite') {
                nextSlug = 'assemblage';
            } else if (currentSlug === 'assemblage') {
                nextSlug = 'kaizen_5s';
            }

            if (nextSlug) {
                sessionStorage.setItem('pendingScroll', nextSlug);
            }
            navigate('/formations');
        } catch (error) {
            console.error("Erreur de validation", error);
            alert("Une erreur est survenue lors de la validation.");
        }
    };

    return (
        <MainLayout>
            <div className={`min-h-[calc(100vh-2rem)] bg-gray-50 flex flex-col items-center px-4 ${showQuiz ? 'pt-10 pb-8' : 'pt-0 pb-8 lg:pr-[510px]'}`}>
                <div className="w-full max-w-6xl">

                    {showQuiz ? (
                        <QuizEngine
                            category={formation.slug}
                            onComplete={submitProgress}
                        />
                    ) : (
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-6">
                            <div className="mb-6">
                                <div className="flex justify-between text-sm font-bold text-gray-500 mb-2">
                                    <span>{formation.title}</span>
                                    <span>{currentIndex + 1} / {formation.images.length}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${((currentIndex + 1) / formation.images.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-200">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={currentIndex}
                                        src={formation.images[currentIndex]}
                                        alt={`${formation.title} - ${currentIndex + 1}`}
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        transition={{ duration: 0.3 }}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </AnimatePresence>
                            </div>

                            <div className="mt-8 flex items-center justify-between">
                                <button
                                    onClick={prevSlide}
                                    disabled={currentIndex === 0}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${currentIndex === 0
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <ChevronLeft size={20} />
                                    Précédent
                                </button>

                                {currentIndex === formation.images.length - 1 ? (
                                    <button
                                        onClick={startQuiz}
                                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:-translate-y-1"
                                    >
                                        <CheckCircle size={20} />
                                        Passer le Quiz
                                    </button>
                                ) : (
                                    <button
                                        onClick={nextSlide}
                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:-translate-y-1"
                                    >
                                        Suivant
                                        <ChevronRight size={20} />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {!showQuiz && <AiChat />}
        </MainLayout>
    );
};

export default FormationViewer;