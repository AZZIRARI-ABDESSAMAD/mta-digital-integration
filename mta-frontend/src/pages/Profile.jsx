import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Lock, FileSignature, Mail, Briefcase,
    Building, Camera, CheckCircle, ShieldCheck, Upload
} from 'lucide-react';
import MainLayout from '../components/MainLayout';
import axios from 'axios';

const Profile = () => {
    // 1. States
    const [activeTab, setActiveTab] = useState('infos');
    const fileInputRef = useRef(null);

    const [userData, setUserData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        role: '',
        department: '',
        position: '',
        avatarPreview: null,
        signature_path: null
    });

    const [passwords, setPasswords] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    });

    // 2. Fetch User Data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('mta_token');
                const res = await axios.get('http://127.0.0.1:8000/api/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const reglementMod = res.data.completed_modules?.find(m => m.module_slug === 'reglement');

                setUserData({
                    first_name: res.data.first_name,
                    last_name: res.data.last_name,
                    email: res.data.email,
                    role: res.data.role,
                    department: res.data.department?.name || 'Non assigné',
                    position: res.data.position,
                    avatarPreview: res.data.avatar ? `http://127.0.0.1:8000/storage/${res.data.avatar}` : null,
                    signature_path: reglementMod ? reglementMod.signature : null
                });
            } catch (error) {
                console.error("Impossible de récupérer les infos :", error);
            }
        };

        fetchUserData();
    }, []);


    // 2. Handlers
    // ملي كيعزل تصويرة جديدة

    // ... (داخل Profile Component) ...

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 1. نبينوها فـ الشاشة ديك الساعة باش اليوزر ما يتسناش (UX زوينة)
        const localUrl = URL.createObjectURL(file);
        setUserData(prev => ({ ...prev, avatarPreview: localUrl }));

        // 2. نوجدو التصويرة باش نصيفطوها (كانستعملو FormData حيت عندنا Fichier ماشي JSON)
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            // 3. نصيفطوها لـ Laravel (تأكد بلي الـ URL صحيح وعندك التوكين)
            const token = localStorage.getItem('mta_token'); // ولا السمية لي مسمي بيها التوكين ديالك
            const response = await axios.post('http://127.0.0.1:8000/api/profile/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            // 4. إيلا داز كولشي مزيان، كنعوضو ديك التصويرة المؤقتة بالرابط الحقيقي لي جا من السيرفر
            setUserData(prev => ({ ...prev, avatarPreview: response.data.avatar_url }));
            console.log("Avatar sauvgardé avec succès !");

        } catch (error) {
            console.error("Erreur lors de l'envoi de l'avatar :", error);
            alert("Erreur lors de la sauvegarde de l'image.");
            // إيلا وقع مشكل، نرجعو التصويرة للـ null ولا القديمة
        }
    };


    // ملي كيبغي يبدل المودپاس
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        // 1. فحص أولي فـ React باش ما نعيطوش للسيرفر فابور إيلا كانوا ما متطابقينش
        if (passwords.new_password !== passwords.new_password_confirmation) {
            alert("Les mots de passe ne correspondent pas !");
            return;
        }

        try {
            const token = localStorage.getItem('mta_token');

            // 2. كنصيفطو الداتا لـ API
            const response = await axios.put('http://127.0.0.1:8000/api/profile/password', {
                current_password: passwords.current_password,
                new_password: passwords.new_password,
                new_password_confirmation: passwords.new_password_confirmation
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // 3. إيلا داز كولشي مزيان
            alert("✅ " + response.data.message); // ولا استعمل SweetAlert إيلا بغيتي الديزاين زوين

            // 4. كنمحو الخانات باش يرجعو خاويين
            setPasswords({ current_password: '', new_password: '', new_password_confirmation: '' });

        } catch (error) {
            // 5. إيلا كان المودپاس القديم غالط ولا كاين شي مشكل فـ Validation ديال Laravel
            console.error("Erreur de mot de passe :", error);

            // كنجبدو الميساج لي صيفط لينا لارافيل فـ Error
            const errorMsg = error.response?.data?.message || "Erreur lors du changement de mot de passe.";
            alert(`❌ ${errorMsg}`);
        }
    };

    return (
        <MainLayout>
            <div className="w-full max-w-5xl mx-auto py-12 px-4 font-sans text-slate-800">

                {/* 🌟 Header Section: Avatar & Basic Info */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 mb-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                    {/* Background Decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>

                    {/* Avatar with Upload Logic */}
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                        <div className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl font-black shadow-xl border-4 border-white transition-all overflow-hidden
                        ${userData.avatarPreview ? 'bg-white' : 'bg-gradient-to-br from-blue-600 to-blue-800 text-white'}`}>

                            {userData.avatarPreview ? (
                                <img src={userData.avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span>{userData.first_name.charAt(0)}{userData.last_name.charAt(0)}</span>
                            )}
                        </div>

                        {/* Hover Overlay للكاميرا */}
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Camera className="text-white w-8 h-8" />
                        </div>

                        {/* Input مخفي */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/png, image/jpeg, image/jpg"
                            className="hidden"
                        />
                    </div>

                    {/* User Details */}
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-black capitalize text-slate-900">
                            {userData.first_name} {userData.last_name}
                        </h1>
                        <div className="mt-3 flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-semibold text-slate-600">
                            <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                                <Briefcase size={16} className="text-blue-600" /> {userData.position}
                            </span>
                            <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                                <Building size={16} className="text-blue-600" /> {userData.department}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 🌟 Main Content: Tabs & Panels */}
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar Tabs */}
                    <div className="w-full md:w-1/4 space-y-2">
                        <TabButton active={activeTab === 'infos'} onClick={() => setActiveTab('infos')} icon={<User size={20} />} label="Mes Informations" />
                        <TabButton active={activeTab === 'securite'} onClick={() => setActiveTab('securite')} icon={<Lock size={20} />} label="Sécurité" />
                        <TabButton active={activeTab === 'documents'} onClick={() => setActiveTab('documents')} icon={<FileSignature size={20} />} label="Mes Documents" />
                    </div>

                    {/* Tab Panels */}
                    <div className="w-full md:w-3/4 bg-white rounded-3xl shadow-sm border border-slate-200 p-8 min-h-[400px]">
                        <AnimatePresence mode="wait">

                            {/* Panel 1: Infos */}
                            {activeTab === 'infos' && (
                                <motion.div key="infos" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                    <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
                                        <User className="text-blue-600" /> Données Personnelles
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InfoCard label="Email Professionnel" value={userData.email} icon={<Mail size={16} />} />
                                        <InfoCard label="Département" value={userData.department} icon={<Building size={16} />} />
                                        <InfoCard label="Fonction / Poste" value={userData.position} icon={<Briefcase size={16} />} />
                                        <InfoCard label="Type d'accès" value={userData.role} icon={<ShieldCheck size={16} />} isUppercase />
                                    </div>
                                    <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                                        <span className="text-amber-500 text-xl">💡</span>
                                        <p className="text-sm text-amber-800 font-medium leading-relaxed">
                                            Ces informations sont gérées par l'administration de MTA. Si vous remarquez une erreur, veuillez contacter le service des ressources humaines pour effectuer une modification.
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Panel 2: Sécurité */}
                            {activeTab === 'securite' && (
                                <motion.div key="securite" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                    <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
                                        <ShieldCheck className="text-blue-600" /> Changer le mot de passe
                                    </h2>
                                    <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-md">
                                        <PasswordInput label="Mot de passe actuel" value={passwords.current_password} onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })} />
                                        <PasswordInput label="Nouveau mot de passe" value={passwords.new_password} onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })} />
                                        <PasswordInput label="Confirmer le nouveau mot de passe" value={passwords.new_password_confirmation} onChange={(e) => setPasswords({ ...passwords, new_password_confirmation: e.target.value })} />

                                        <button type="submit" className="mt-4 bg-blue-600 text-white font-bold px-6 py-3.5 rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all w-full flex justify-center items-center gap-2">
                                            <Lock size={18} /> Mettre à jour
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {/* Panel 3: Documents */}
                            {activeTab === 'documents' && (
                                <motion.div key="documents" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                    <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
                                        <FileSignature className="text-blue-600" /> Documents et Engagements
                                    </h2>
                                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 max-w-md bg-slate-50 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">Signé</div>
                                        <h3 className="font-bold text-slate-800 mb-2">Règlement Intérieur</h3>
                                        <p className="text-sm text-slate-500 mb-4">Vous avez lu et approuvé le règlement interne de MTA Morocco.</p>

                                        {userData.signature_path ? (
                                            <div className="bg-white p-4 rounded-xl border border-slate-200 inline-block shadow-sm">
                                                {/* هنا غتبدل localhost بالرابط ديال الباكاند */}
                                                <img src={`http://127.0.0.1:8000/storage/${userData.signature_path}`} alt="Signature" className="max-h-20 mix-blend-multiply opacity-80" />
                                                <p className="text-xs text-green-600 font-black mt-3 flex items-center justify-center gap-1">
                                                    <CheckCircle size={14} /> Validé électroniquement
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-slate-400 italic text-sm">Signature non disponible.</p>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

/* --- Small Sub-Components for cleaner code --- */

const TabButton = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl font-bold transition-all duration-200
            ${active ? 'bg-blue-600 text-white shadow-md scale-105' : 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
    >
        {icon} {label}
    </button>
);

const InfoCard = ({ label, value, icon, isUppercase }) => (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">{label}</label>
        <div className={`flex items-center gap-2 font-bold text-slate-800 ${isUppercase ? 'uppercase' : ''}`}>
            <span className="text-blue-500 bg-blue-50 p-1.5 rounded-lg">{icon}</span> {value}
        </div>
    </div>
);

const PasswordInput = ({ label, value, onChange }) => (
    <div>
        <label className="text-sm font-bold text-slate-700 block mb-2">{label}</label>
        <input
            type="password"
            value={value}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            required
        />
    </div>
);

export default Profile;