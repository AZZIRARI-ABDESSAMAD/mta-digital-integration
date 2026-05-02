import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Building, Briefcase, GraduationCap, Eye, Lock, Unlock } from 'lucide-react';
import axios from 'axios';
import TrainingPath from '../components/TrainingPath';
import MainLayout from '../components/MainLayout';

const Formations = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState(null); // Type for admins to switch views

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Bonjour' : 'Bonsoir';

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('mta_token');
                const response = await axios.get('http://127.0.0.1:8000/api/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    }
                });
                setUser(response.data);
                // Initialize selectedType with user's type
                setSelectedType(response.data.user_type || 'operator');
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (loading) {
        return (
            <MainLayout>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                </div>
            </MainLayout>
        );
    }

    const userName = user?.first_name || 'Collaborateur';
    const userDept = user?.department?.name || 'Non assigné';
    const isAdmin = user?.role === 'admin';
    const currentStep = (user?.onboarding_step || 0) + 1;

    // We use the selectedType for display, which defaults to the user's type but can be changed by admins
    const activeType = selectedType || user?.user_type || 'operator';

    // --- Les 3 Cartes de Formation ---
    const trainingCards = [
        {
            id: 'operator',
            title: 'Parcours Opérateur',
            icon: Briefcase,
            desc: 'Formation complète : HSE, assemblage, traçabilité, kaizen, Règlement Intérieur, quiz.',
            color: 'text-green-600',
            bg: 'bg-green-100'
        },
        {
            id: 'stagiaire',
            title: 'Parcours Stagiaire',
            icon: GraduationCap,
            desc: "HSE, assemblage, traçabilité, kaizen, Règlement Intérieur, quiz.",
            color: 'text-blue-600',
            bg: 'bg-blue-100'
        },
        {
            id: 'visitor',
            title: 'Parcours Visiteur',
            icon: Eye,
            desc: 'HSE, Consignes de sécurité strictes pour un accès journalier.',
            color: 'text-orange-600',
            bg: 'bg-orange-100'
        }
    ];

    return (
        <MainLayout>
            <div className="min-h-screen bg-gray-50 p-8 lg:p-12 font-sans overflow-hidden">
                <div className="max-w-5xl mx-auto">

                    {/* --- Welcome Banner --- */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 rounded-[2rem] p-8 md:p-10 mb-10 shadow-2xl overflow-hidden text-white"
                    >
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-blue-400 opacity-20 rounded-full blur-2xl"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-4">
                                    <Sparkles size={16} className="text-yellow-300" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-blue-50">Espace Intégration</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">
                                    {greeting}, {userName} ! 👋
                                </h1>
                                <p className="text-blue-100 text-lg md:text-xl font-medium max-w-xl">
                                    Sélectionnez le parcours qui correspond à votre profil pour débloquer votre accès.
                                </p>
                            </div>

                            <div className="hidden md:flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-inner">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Building size={24} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-blue-200 uppercase tracking-widest">Votre Département</p>
                                    <p className="text-xl font-bold text-white">{userDept}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* --- Les 3 Cartes de Profil --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {trainingCards.map((card, index) => {
                            const isMyProfile = card.id === activeType;
                            const isAllowed = isAdmin || card.id === user?.user_type;
                            const Icon = card.icon;

                            return (
                                <motion.div
                                    key={card.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.15 }}
                                    onClick={() => isAdmin && setSelectedType(card.id)}
                                    className={`relative p-8 rounded-[2rem] border-2 transition-all duration-300 overflow-hidden flex flex-col items-center text-center ${isAdmin && 'cursor-pointer'} ${isMyProfile
                                        ? 'bg-white border-blue-600 shadow-xl ring-4 ring-blue-50 scale-105 z-10'
                                        : isAllowed
                                            ? 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg opacity-90'
                                            : 'bg-gray-100 border-gray-200 opacity-60 grayscale-[50%]'
                                        }`}
                                >
                                    {/* Lock/Unlock Badge */}
                                    <div className="absolute top-6 right-6">
                                        {isAllowed ? (
                                            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                                <Unlock size={20} />
                                            </div>
                                        ) : (
                                            <div className="bg-gray-200 p-2 rounded-full text-gray-500">
                                                <Lock size={20} />
                                            </div>
                                        )}
                                    </div>

                                    <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center shadow-inner ${isAllowed ? card.bg : 'bg-gray-200'} ${isAllowed ? card.color : 'text-gray-500'}`}>
                                        <Icon size={32} />
                                    </div>

                                    <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">{card.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-6 font-medium">{card.desc}</p>

                                    {isMyProfile ? (
                                        <div className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 uppercase tracking-wide">
                                            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                                            {isAdmin ? 'Vue Actuelle' : 'Parcours Débloqué'}
                                        </div>
                                    ) : isAllowed ? (
                                        <div className="text-sm font-bold text-blue-400 uppercase tracking-wide">
                                            Cliquez pour voir
                                        </div>
                                    ) : (
                                        <div className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                                            Accès Restreint
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* --- Training Path Component (Only shows steps for the active profile) --- */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100"
                    >
                        <TrainingPath userType={activeType} />
                    </motion.div>

                </div>
            </div>
        </MainLayout>
    );
};

export default Formations;