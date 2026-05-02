import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Image as ImageIcon, Film, X, Calendar, AlignLeft, Images, ChevronRight, ChevronLeft } from 'lucide-react';
import MainLayout from '../components/MainLayout';

// Mock data (Système d'Albums ajouté)
const mediaItems = [
    {
        id: 1,
        type: 'video',
        src: 'mtaVids/eventvid1.mp4',
        title: 'Quality week',
        date: '15 Avril 2026',
        description: 'Quality week at MTA Morocco – “Quality Starts With Me”',
        thumbnail: 'tmbImg/tmb1.png',
    },
    {
        id: 2,
        type: 'video',
        src: 'mtaVids/eventvid2.mp4',
        title: 'GALA 2025',
        date: '10 Avril 2026',
        description: `GALA 2025 | MEILLEURS MOMENTS Une soirée pour célébrer l’excellence, honorer la performance et reconnaître l’engagement.
                        Derrière chaque succès se trouvent des femmes et des hommes passionnés.
                        Merci à notre force de travail, notre véritable raison d’être.
                        Bravo à toutes et à tous. Vous êtes notre fierté au quotidien.
                        GALA 2025 | MEILLEURS MOMENTS 
                        Une soirée pour célébrer l’excellence, honorer la performance et reconnaître l’engagement.
                        Derrière chaque succès se trouvent des femmes et des hommes passionnés.
                        Merci à notre force de travail, notre véritable raison d’être.
                        Bravo à toutes et à tous. Vous êtes notre fierté au quotidien.
                        `,
        thumbnail: 'tmbImg/tmb2.png',

    },
    {
        id: 3,
        type: 'video',
        src: 'mtaVids/eventvid3.mp4',
        title: `Let’s celebrate women. Let’s celebrate excellence`,
        date: '20 Fev 2026',
        thumbnail: `https://img.youtube.com/vi/wd5IXPMp4GY/hqdefault.jpg`,
        description: `On the occasion of International Women’s Day, we celebrated the commitment, talent, and determination of all the women who contribute every day to moving our company forward.`
    },
    {
        id: 4,
        type: 'album',
        src: 'mta-images/event/eventImg1.webp',
        title: 'GALA 2025',
        description: '',
        images: [
            'mta-images/event/eventImg1.webp',
            'mta-images/event/eventImg2.webp',
            'mta-images/event/eventImg4.webp',
            'mta-images/event/eventImg3.webp',
            'mta-images/event/eventImg5.webp',
            'mta-images/event/eventImg6.webp',
            'mta-images/event/eventImg7.webp',
            'mta-images/event/eventImg8.webp',
        ],
        description: `GALA 2025 | MEILLEURS MOMENTS Une soirée pour célébrer l’excellence, honorer la performance et reconnaître l’engagement.
                        Derrière chaque succès se trouvent des femmes et des hommes passionnés.
                        Merci à notre force de travail, notre véritable raison d’être.
                        Bravo à toutes et à tous. Vous êtes notre fierté au quotidien.
                        GALA 2025 | MEILLEURS MOMENTS 
                        Une soirée pour célébrer l’excellence, honorer la performance et reconnaître l’engagement.
                        Derrière chaque succès se trouvent des femmes et des hommes passionnés.
                        Merci à notre force de travail, notre véritable raison d’être.
                        Bravo à toutes et à tous. Vous êtes notre fierté au quotidien.
                        `
    },
    {
        id: 5,
        type: 'album',
        src: 'mta-images/HappyWomenDay/HDWomen1.webp',
        title: 'International Women\'s Day',
        images: [
            'mta-images/HappyWomenDay/HDWomen1.webp',
            'mta-images/HappyWomenDay/HDWomen2.webp',
            'mta-images/HappyWomenDay/HDWomen3.webp',
            'mta-images/HappyWomenDay/HDWomen4.webp',
            'mta-images/HappyWomenDay/HDWomen5.webp',
            'mta-images/HappyWomenDay/HDWomen6.webp',
            'mta-images/HappyWomenDay/HDWomen7.webp',
            'mta-images/HappyWomenDay/HDWomen8.webp',
            'mta-images/HappyWomenDay/HDWomen9.webp',
        ],
        description: `Happy International Women's Day to all the exceptional women working at MTA worldwide!
                        Pictures from MTA Morocco ⬆️
                        -
                        Buona Giornata Internazionale della Donna a tutte le colleghe eccezionali che lavorano in MTA in tutto il mondo!
                        Foto da MTA Morocco ⬆️
                        `
    },
    {
        id: 6,
        type: 'album',
        src: 'mta-images/foot/footImg1.jpg',
        title: 'first edition of the Atlantic Free Zone Football Cup',
        images: [
            'mta-images/foot/footImg1.jpg',
            'mta-images/foot/footImg2.jpg',
            'mta-images/foot/footImg3.jpg',
            'mta-images/foot/footImg4.jpg',
            'mta-images/foot/footImg5.jpg'
        ],
        description: `
                        Liked by hamzabdeladim and 111 others
                        Good luck to our fantastic team! ⚽️🙌
                        Today, the MTA Morocco football team will play the semi-final match of the first edition of the Atlantic Free Zone Football Cup, organized by the AFZIA (Atlantic Free Zone Investors Association). The MTA team has reached the final stages of the competition, attended by 32 companies from the Kenitra industrial acceleration zone.
                        -
                        Buona fortuna al nostro fantastico team!
                        Oggi la squadra di MTA Morocco giocherà la semifinale della prima edizione dell'Atlantic Free Zone Football Cup, organizzata dall'AFZIA (Atlantic Free Zone Investors Association). Il team MTA ha raggiunto le fasi finali del torneo, a cui hanno partecipato 32 aziende della zona di accelerazione industriale di Kenitra.                                              `
    },
    {
        id: 7,
        type: 'album',
        src: 'mta-images/Wic/Wic1.jpg',
        title: 'International campaign for breast cancer prevention',
        images: [
            'mta-images/Wic/Wic1.jpg',
            'mta-images/Wic/Wic2.jpg',
            'mta-images/Wic/Wic3.jpg',
            'mta-images/Wic/Wic4.jpg',
            'mta-images/Wic/Wic5.jpg'
        ],
        description: `
                        MTA Morocco turns pink to support the international campaign that aims to highlight the importance of breast cancer prevention, early identification and prompt treatment 🎗
                        `
    }
];

const EventsGallery = () => {
    const [filter, setFilter] = useState('all');
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [albumIndex, setAlbumIndex] = useState(0); // Index ديال التصويرة وسط الألبوم

    const filteredItems = mediaItems.filter(item => filter === 'all' || item.type === filter || (filter === 'image' && item.type === 'album'));

    const openMedia = (item) => {
        setSelectedMedia(item);
        setAlbumIndex(0); // ديما كنبداو من التصويرة اللولة
    };

    const nextImage = (e) => {
        e.stopPropagation();
        if (selectedMedia && selectedMedia.images) {
            setAlbumIndex((prev) => (prev === selectedMedia.images.length - 1 ? 0 : prev + 1));
        }
    };

    const prevImage = (e) => {
        e.stopPropagation();
        if (selectedMedia && selectedMedia.images) {
            setAlbumIndex((prev) => (prev === 0 ? selectedMedia.images.length - 1 : prev - 1));
        }
    };

    return (
        <MainLayout>
            <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">

                    {/* Header & Filters */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                        <div>
                            <h1 className="text-4xl font-black text-slate-800 mb-2">Événements & Médias</h1>
                            <p className="text-slate-500 font-medium">Découvrez les dernières actualités, formations et vidéos de l'entreprise.</p>
                        </div>

                        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
                            <button onClick={() => setFilter('all')} className={`px-6 py-2.5 rounded-xl font-bold transition-all ${filter === 'all' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>Tous</button>
                            <button onClick={() => setFilter('image')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${filter === 'image' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
                                <ImageIcon size={18} /> Albums
                            </button>
                            <button onClick={() => setFilter('video')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${filter === 'video' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
                                <Film size={18} /> Vidéos
                            </button>
                        </div>
                    </div>

                    {/* Media Grid */}
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {filteredItems.map((item) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    key={item.id}
                                    onClick={() => openMedia(item)}
                                    className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer border border-slate-100 aspect-video flex flex-col"
                                >
                                    <div className="relative w-full h-full overflow-hidden">
                                        <img
                                            src={item.thumbnail || item.cover || item.src}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />

                                        {/* Video Icon */}
                                        {item.type === 'video' && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                                                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-full text-blue-600 shadow-lg">
                                                    <Play size={32} className="ml-1" fill="currentColor" />
                                                </div>
                                            </div>
                                        )}

                                        {/* Album Badge (Number of photos) */}
                                        {item.type === 'album' && (
                                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-bold border border-white/20">
                                                <Images size={16} />
                                                <span>{item.images.length}</span>
                                            </div>
                                        )}

                                        {/* Overlay Title */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/90 to-transparent p-4 pt-12">
                                            <h3 className="text-white font-bold text-lg mb-1 truncate">{item.title}</h3>
                                            <div className="flex items-center text-slate-300 text-xs font-medium gap-1.5">
                                                <Calendar size={12} />
                                                <span>{item.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                </div>
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedMedia && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
                        onClick={() => setSelectedMedia(null)}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-50"
                            onClick={() => setSelectedMedia(null)}
                        >
                            <X size={32} />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-5xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Media Content Area */}
                            <div className="relative w-full bg-black flex-1 min-h-0 flex items-center justify-center group">
                                {selectedMedia.type === 'video' ? (
                                    <video src={selectedMedia.src} controls autoPlay className="w-full max-h-[60vh] object-contain" />
                                ) : (
                                    <>
                                        {/* Album Image Navigation */}
                                        <AnimatePresence mode="wait">
                                            <motion.img
                                                key={albumIndex}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.2 }}
                                                src={selectedMedia.images[albumIndex]}
                                                alt={`${selectedMedia.title} - ${albumIndex + 1}`}
                                                className="w-full max-h-[60vh] object-contain"
                                            />
                                        </AnimatePresence>

                                        {/* Left/Right Controls (Only for Albums with > 1 photo) */}
                                        {selectedMedia.images.length > 1 && (
                                            <>
                                                <button onClick={prevImage} className="absolute left-4 p-3 rounded-full bg-black/50 text-white hover:bg-blue-600 transition-colors opacity-0 group-hover:opacity-100">
                                                    <ChevronLeft size={24} />
                                                </button>
                                                <button onClick={nextImage} className="absolute right-4 p-3 rounded-full bg-black/50 text-white hover:bg-blue-600 transition-colors opacity-0 group-hover:opacity-100">
                                                    <ChevronRight size={24} />
                                                </button>

                                                {/* Counter Indicator */}
                                                <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                    {albumIndex + 1} / {selectedMedia.images.length}
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Detailed Information Panel */}
                            <div className="bg-white p-6 md:p-8 shrink-0">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <h2 className="text-slate-800 text-2xl md:text-3xl font-black leading-tight">
                                        {selectedMedia.title}
                                    </h2>
                                    <div className="flex items-center text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap">
                                        <Calendar size={16} className="mr-2" />
                                        {selectedMedia.date}
                                    </div>
                                </div>

                                <div className="flex items-start text-slate-600">
                                    <AlignLeft size={20} className="mr-3 mt-1 shrink-0 text-slate-400" />
                                    <p className="text-base leading-relaxed">
                                        {selectedMedia.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </MainLayout>
    );
};

export default EventsGallery;