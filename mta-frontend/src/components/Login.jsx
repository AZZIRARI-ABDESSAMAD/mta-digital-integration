import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Lock, Mail, ChevronRight } from 'lucide-react';
import api from '../api/axios';

const Login = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        login: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/login', { login: formData.login, password: formData.password });
            localStorage.setItem('mta_token', response.data.access_token);
            localStorage.setItem('mta_user', JSON.stringify(response.data.user));
            navigate('/');
        } catch (err) {
            if (err.response) {
                const status = err.response.status;

                if (status === 401) {
                    setError('Email ou mot de passe incorrect.');
                } else if (status === 500) {
                    setError('Internal Server Error. Please contact the IT department.');
                } else {
                    setError('An unexpected error occurred. Please try again.');
                }
            } else {
                setError('Cannot connect to the server. Check your internet connection.');
            }
        }
    };

    return (
        <div className="min-h-screen flex font-official bg-white">

            {/* Left side: Factory image */}
            <div className="hidden lg:flex w-1/2 bg-mtaBlue relative overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"
                    alt="MTA Factory"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative z-20 m-auto text-white p-12">
                    <motion.h1
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-5xl font-bold mb-4"
                    >
                        MTA Morocco
                    </motion.h1>
                    <p className="text-xl text-gray-200">L'excellence industrielle au service de l'automobile.</p>
                </div>
            </div>

            {/* Right side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full"
                >
                    <div className="mb-10">
                        <div className="h-12 mb-6 flex items-center gap-2">
                            <span className="text-3xl font-black text-mtaBlue tracking-tight">MTA </span>
                            <span className="text-sm font-medium text-gray-400">|</span>
                            <span className="text-sm font-medium text-gray-500">Automotive Maroc Kenitra </span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">Bienvenue</h2>
                        <p className="text-gray-600 mt-2">Accès strictement réservé au personnel MTA.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Email Professionnel</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="login"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-mtaBlue focus:border-transparent outline-none transition-all"
                                    value={formData.login}
                                    onChange={handleChange}
                                    placeholder="Email ou CIN"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Mot de passe</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-mtaBlue focus:border-transparent outline-none transition-all"
                                    placeholder="••••••••"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-xs font-medium bg-red-50 p-3 rounded-lg">{error}</p>}

                        <button
                            type="submit"
                            className="w-full bg-mtaBlue hover:bg-blue-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 group"
                        >
                            Se Connecter <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <p className="text-center mt-8 text-sm text-gray-500">
                        © 2026 MTA Morocco - Portail d'Intégration
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;