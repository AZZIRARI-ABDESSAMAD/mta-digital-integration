import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Factory, Cog, ShieldCheck, Cpu, Truck, Wrench, PieChart, Users, Building, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/MainLayout';

// Professional data focused on Departments
const departments = [
    { id: 1, name: 'Manufacturing Engineering', head: 'Head: TBD', icon: <Wrench size={32} />, image: 'mta-images/departments/manufacturing.jpg' },
    { id: 2, name: 'Production', head: 'Head: A. Benani', icon: <Factory size={32} />, image: 'mta-images/departments/production.webp' },
    { id: 3, name: 'Logistics', head: 'Head: K. Mansouri', icon: <Truck size={32} />, image: 'mta-images/departments/logistics.jpg' },
    { id: 4, name: 'Finance', head: 'Head: TBD', icon: <PieChart size={32} />, image: 'mta-images/departments/finance.jpg' },
    { id: 5, name: 'QHSE', head: 'Head: S. El Fassi', icon: <ShieldCheck size={32} />, image: 'mta-images/departments/qhse.jpg' },
    { id: 6, name: 'HR', head: 'Head: TBD', icon: <Users size={32} />, image: 'mta-images/departments/rh.jpeg' },
    { id: 7, name: 'Facilities', head: 'Head: TBD', icon: <Building size={32} />, image: 'mta-images/departments/facilities.jpg' },
    { id: 8, name: 'R&D', head: 'Head: TBD', icon: <Lightbulb size={32} />, image: 'mta-images/departments/rd.jpg' },
    { id: 9, name: 'Maintenance', head: 'Head: M. Tahiri', icon: <Cog size={32} />, image: 'mta-images/departments/maintenance.jpg' },
];

const mtaImages = ["mta-images/imgAub/mtaImg1.jpg", "mta-images/imgAub/mtaImg2.jpg", "mta-images/imgAub/mtaImg3.jpg",
    "mta-images/imgAub/mtaImg4.jpg", "mta-images/imgAub/mtaImg5.jpg", "mta-images/imgAub/mtaImg6.jpg", "mta-images/imgAub/mtaImg7.png",
    "mta-images/imgAub/mtaImg8.png", "mta-images/imgAub/mtaImg9.jpg"
];

const Home = () => {
    const [isClientsPaused, setIsClientsPaused] = useState(false);

    return (
        <MainLayout>
            <div className="min-h-screen bg-white font-sans overflow-x-hidden">

                {/* 1. Transparent Header */}
                <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                        <div className="flex items-center gap-2 ml-75">
                            <span className="text-2xl font-black text-mtaBlue tracking-tight">MTA</span>
                            <span className="text-gray-300 font-light">|</span>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest text-mtaBlue">Automotive Morocco</span>
                        </div>
                    </div>
                </nav>



                {/* 2. Hero Section - Focus on Mission */}
                <section className="pt-24 pb-24 px-6 text-center">

                    {/* Hero Video */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.3 }}
                        className="mt-5 max-w-7xl mx-auto px-4"
                    >
                        <div className="relative p-1 rounded-[2rem] bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 shadow-[0_20px_80px_-20px_rgba(37,99,235,0.5)]">
                            <div className="relative w-full rounded-[1.75rem] overflow-hidden bg-black" style={{ paddingBottom: '56.25%' }}>
                                <iframe
                                    src="mtaVids/mtaVid.mp4"
                                    title="MTA Morocco"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="absolute inset-0 w-full h-full"
                                />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                        className="mt-16 max-w-4xl mx-auto text-left"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">MTA Morocco</h2>
                        <div className="space-y-4 text-gray-600 leading-relaxed">
                            <p>
                                MTA Morocco was established in <span className="font-semibold text-gray-800">2017</span> in the Atlantic Free Trade Zone of Kenitra, which offers tax advantages to companies that decide to invest there, therefore also benefiting their customers.
                            </p>
                            <p>
                                With this new opening the materials and the components for the electrical products will arrive at the factory equipped for plastic molding and assembly, and then the finished product will be delivered to some of Europe's leading car manufacturers, as well as the tier 1s which established in Morocco to produce vehicles for the EMEA market.
                            </p>
                        </div>

                        {/* Key Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-10">
                            <div className="bg-blue-50 rounded-2xl p-5 text-center">
                                <p className="text-2xl font-black text-mtaBlue">50,000 m²</p>
                                <p className="text-xs text-gray-500 mt-1 font-medium">Plant Area</p>
                            </div>
                            <div className="bg-blue-50 rounded-2xl p-5 text-center">
                                <p className="text-2xl font-black text-mtaBlue">2017</p>
                                <p className="text-xs text-gray-500 mt-1 font-medium">Established</p>
                            </div>
                            <div className="bg-blue-50 rounded-2xl p-5 text-center">
                                <p className="text-2xl font-black text-mtaBlue">EMEA</p>
                                <p className="text-xs text-gray-500 mt-1 font-medium">Market Coverage</p>
                            </div>
                        </div>
                    </motion.div>


                </section>

                {/* 3. Infinite Department Slider (Right to Left) */}
                <section className="py-20 bg-gray-50 border-y border-gray-100 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Our Departments</h2>
                        <p className="text-gray-500">Discover the pillars of our Kenitra plant.</p>
                    </div>

                    <div className="relative flex items-center">
                        <motion.div
                            className="flex gap-6 whitespace-nowrap"
                            // Animation: Moving from 0 to -50% to create an infinite loop
                            animate={{ x: [0, "-50%"] }}
                            transition={{
                                repeat: Infinity,
                                duration: 25,
                                ease: "linear"
                            }}
                            // Stop movement when hovering for better UX
                            whileHover={{ animationPlayState: "paused" }}
                        >
                            {/* Duplicate the departments list for seamless scrolling */}
                            {[...departments, ...departments].map((dept, index) => (
                                <div key={index} className="inline-block min-w-[420px] bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group cursor-default">
                                    <div className="h-52 overflow-hidden">
                                        <img
                                            src={dept.image}
                                            alt={dept.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80"
                                        />
                                    </div>
                                    <div className="p-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="text-mtaBlue bg-blue-50 p-3 rounded-2xl">
                                                {dept.icon}
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">MTA Unit</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900">{dept.name}</h3>
                                        <p className="text-sm text-gray-400 mt-2 font-medium">{dept.head}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </section>
                {/* 4. Simple Info Section */}
                <section className="py-24 max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
                    <div className="space-y-4">
                        <div className="bg-mtaBlue/10 w-16 h-16 rounded-2xl flex items-center justify-center text-mtaBlue mx-auto">
                            <ShieldCheck size={32} />
                        </div>
                        <h4 className="font-bold text-xl">Safety First</h4>
                        <p className="text-gray-500 text-sm">We maintain the highest standards of safety for our employees in Kenitra.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-mtaBlue/10 w-16 h-16 rounded-2xl flex items-center justify-center text-mtaBlue mx-auto">
                            <Cog size={32} />
                        </div>
                        <h4 className="font-bold text-xl">Operational Excellence</h4>
                        <p className="text-gray-500 text-sm">Our processes are optimized for global automotive demands.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-mtaBlue/10 w-16 h-16 rounded-2xl flex items-center justify-center text-mtaBlue mx-auto">
                            <Factory size={32} />
                        </div>
                        <h4 className="font-bold text-xl">MTA World</h4>
                        <p className="text-gray-500 text-sm">Proudly representing MTA Group in the heart of Morocco.</p>
                    </div>
                </section>
                <section className="py-24 bg-gray-50 border-y border-gray-100">
                    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                        {/* Left - Text */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="space-y-6"
                        >
                            <span className="inline-block text-xs font-bold text-mtaBlue uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-full">Investment</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                                MTA among the <span className="text-mtaBlue">26 investors</span> who have signed an agreement with the state of Morocco
                            </h2>
                            <p className="text-gray-500 leading-relaxed">
                                A testament to MTA's commitment to industrial development in Morocco, reinforcing its position as a key player in the automotive sector across the EMEA region.
                            </p>
                        </motion.div>

                        {/* Right - Video */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                        >
                            <div className="relative p-1 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-[0_10px_50px_-15px_rgba(37,99,235,0.4)]">
                                <div className="relative w-full rounded-xl overflow-hidden bg-black" style={{ paddingBottom: '56.25%' }}>
                                    <iframe
                                        src="https://www.youtube.com/embed/ShApdL8MFKk?autoplay=1&mute=1&loop=1&playlist=ShApdL8MFKk"
                                        title="MTA Investment Agreement"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="absolute inset-0 w-full h-full"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Evolution Timeline Section */}
                <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6">
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="text-center mb-16 space-y-4"
                        >
                            <span className="inline-block text-xs font-bold text-mtaBlue uppercase tracking-[0.3em] bg-blue-50 px-5 py-2 rounded-full">
                                Our Journey
                            </span>
                            <h2 className="text-3xl md:text-5xl font-black text-gray-900">
                                The <span className="bg-gradient-to-r from-mtaBlue to-blue-400 bg-clip-text text-transparent">Evolution</span> of MTA Morocco
                            </h2>
                            <p className="text-gray-500 max-w-2xl mx-auto">
                                From our founding vision to a world-class automotive facility — witness our transformation.
                            </p>
                        </motion.div>

                        {/* Timeline Cards — Vertical Full-Width */}
                        <div className="relative space-y-16">
                            {/* Vertical Timeline Spine (hidden on mobile) */}
                            <div className="hidden md:block absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-amber-300 via-mtaBlue/30 to-mtaBlue" />

                            {/* 2016 — The Vision */}
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7 }}
                                className="relative group"
                            >
                                {/* Timeline dot */}
                                <div className="hidden md:flex absolute left-8 top-10 -translate-x-1/2 z-10">
                                    <div className="w-5 h-5 rounded-full bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.5)] ring-4 ring-white" />
                                </div>
                                <div className="md:ml-20">
                                    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-300 via-amber-400 to-orange-400 p-1 shadow-xl hover:shadow-[0_25px_70px_-20px_rgba(251,191,36,0.35)] transition-shadow duration-500">
                                        <div className="bg-white rounded-[1.35rem] overflow-hidden grid md:grid-cols-5">
                                            <div className="relative h-72 md:h-96 overflow-hidden md:col-span-3">
                                                <img src="mta-images/mta2016.png" alt="MTA Morocco Vision 2016" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                                            </div>
                                            <div className="flex flex-col justify-center p-8 md:p-12 space-y-5 md:col-span-2">
                                                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-3xl font-black px-6 py-2.5 rounded-2xl shadow-md w-fit">2016</span>
                                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">The Vision</h3>
                                                <p className="text-gray-500 leading-relaxed">
                                                    MTA Group identified Morocco's Atlantic Free Trade Zone in Kenitra as the strategic location for its new production hub, setting the stage for expansion into the EMEA market.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* 2017 — The Foundation */}
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.1 }}
                                className="relative group"
                            >
                                {/* Timeline dot */}
                                <div className="hidden md:flex absolute left-8 top-10 -translate-x-1/2 z-10">
                                    <div className="w-5 h-5 rounded-full bg-gray-400 shadow-[0_0_15px_rgba(156,163,175,0.5)] ring-4 ring-white" />
                                </div>
                                <div className="md:ml-20">
                                    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-300 via-gray-200 to-gray-400 p-1 shadow-xl hover:shadow-2xl transition-shadow duration-500">
                                        <div className="bg-white rounded-[1.35rem] overflow-hidden grid md:grid-cols-5">
                                            <div className="relative h-72 md:h-96 overflow-hidden md:order-2 md:col-span-3">
                                                <img src="mta-images/mta2017.png" alt="MTA Morocco in 2017" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                                            </div>
                                            <div className="flex flex-col justify-center p-8 md:p-12 space-y-5 md:order-1 md:col-span-2">
                                                <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-3xl font-black px-6 py-2.5 rounded-2xl shadow-md border border-gray-200 w-fit">2017</span>
                                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">The Foundation</h3>
                                                <p className="text-gray-500 leading-relaxed">
                                                    MTA Morocco was inaugurated in the Atlantic Free Trade Zone of Kenitra, laying the foundation for automotive excellence in the EMEA region.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* 2026 — Today & Beyond */}
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                                className="relative group"
                            >
                                {/* Timeline dot */}
                                <div className="hidden md:flex absolute left-8 top-10 -translate-x-1/2 z-10">
                                    <div className="w-5 h-5 rounded-full bg-mtaBlue shadow-[0_0_20px_rgba(37,99,235,0.5)] ring-4 ring-white animate-pulse" />
                                </div>
                                <div className="md:ml-20">
                                    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-500 via-mtaBlue to-blue-700 p-1 shadow-xl hover:shadow-[0_25px_70px_-20px_rgba(37,99,235,0.4)] transition-shadow duration-500">
                                        <div className="bg-white rounded-[1.35rem] overflow-hidden grid md:grid-cols-5">
                                            <div className="relative h-72 md:h-96 overflow-hidden md:col-span-3">
                                                <img src="mta-images/mta2026.jpeg" alt="MTA Morocco in 2026" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                                            </div>
                                            <div className="flex flex-col justify-center p-8 md:p-12 space-y-5 md:col-span-2">
                                                <span className="bg-gradient-to-r from-mtaBlue to-blue-500 text-white text-3xl font-black px-6 py-2.5 rounded-2xl shadow-md w-fit">2026</span>
                                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Today & Beyond</h3>
                                                <p className="text-gray-500 leading-relaxed">
                                                    A state-of-the-art 50,000 m² facility powering Europe's leading car manufacturers with cutting-edge plastic molding and assembly technologies.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>


                {/* section mta images */}
                <section className="py-0 overflow-hidden">
                    {/* Diplomatic Visit — Editorial Layout */}
                    <div className="relative bg-gradient-to-br from-blue-50 via-white to-sky-50 overflow-hidden">
                        {/* Subtle dot pattern background */}
                        <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(circle, #bfdbfe 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                        <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 min-h-[520px]">
                            {/* Left — Photo Panel */}
                            <motion.div
                                initial={{ opacity: 0, x: -40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="relative h-72 md:h-auto overflow-hidden"
                            >
                                <img
                                    src="mta-images/imgAub/mtaImg1.jpg"
                                    alt="Italian Ambassador visits MTA Morocco"
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r  hidden md:block" />
                                <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-transparent md:hidden" />
                                {/* Floating glass badge */}
                                <div className="absolute top-6 left-6 bg-white/70 backdrop-blur-xl border border-blue-200/50 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-lg">
                                    <span className="text-2xl">🇲🇦</span>
                                    <span className="w-5 h-px bg-blue-300" />
                                    <span className="text-2xl">🇮🇹</span>
                                </div>
                            </motion.div>

                            {/* Right — Content Panel */}
                            <motion.div
                                initial={{ opacity: 0, x: 40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.15 }}
                                className="flex items-center px-8 md:px-14 py-14 md:py-0"
                            >
                                <div className="space-y-7">
                                    <span className="inline-block text-[10px] font-bold uppercase tracking-[0.35em] text-mtaBlue bg-blue-100 border border-blue-200 px-4 py-1.5 rounded-full">
                                        Diplomatic Visit
                                    </span>

                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-[1.15]">
                                        Italian Ambassador{' '}
                                        <span className="bg-gradient-to-r from-mtaBlue via-blue-500 to-sky-500 bg-clip-text text-transparent">
                                            visits MTA Morocco
                                        </span>
                                    </h2>

                                    {/* Accent bar */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-1 rounded-full bg-gradient-to-r from-mtaBlue to-sky-400" />
                                        <div className="w-3 h-1 rounded-full bg-blue-300" />
                                    </div>

                                    <p className="text-gray-600 leading-relaxed text-[15px]">
                                        MTA Morocco welcomed the Italian Ambassador,{' '}
                                        <span className="text-gray-900 font-semibold">Armando Barucco</span>, to our Kenitra plant — exploring innovative solutions and cutting-edge technologies that define MTA's commitment to excellence.
                                    </p>

                                    {/* Italian translation — frosted card */}
                                    <div className="bg-white/60 backdrop-blur-sm border border-blue-100 rounded-2xl p-5 shadow-sm">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-lg">🇮🇹</span>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">In Italiano</span>
                                        </div>
                                        <p className="text-gray-500 leading-relaxed italic text-sm">
                                            La scorsa settimana, MTA Marocco ha accolto l'Ambasciatore Italiano in Marocco, Armando Barucco. Durante la visita alla sede di Kenitra, l'Ambasciatore ha acquisito una visione diretta dell'impegno di MTA verso l'eccellenza.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Image Gallery */}
                    <div className="max-w-7xl mx-auto px-6 py-16">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {mtaImages.map((image, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.06 }}
                                    className="relative overflow-hidden rounded-2xl group cursor-pointer h-56 md:h-64"
                                >
                                    <img
                                        src={image}
                                        alt={`MTA Event ${index + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white">
                    <div className="max-w-7xl mx-auto px-6">
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="text-center mb-16 space-y-4"
                        >
                            <span className="inline-block text-xs font-bold text-mtaBlue uppercase tracking-[0.3em] bg-blue-50 px-5 py-2 rounded-full">
                                What We Build
                            </span>
                            <h2 className="text-3xl md:text-5xl font-black text-gray-900">
                                Our <span className="bg-gradient-to-r from-mtaBlue to-blue-400 bg-clip-text text-transparent">Projects</span>
                            </h2>
                            <p className="text-gray-500 max-w-2xl mx-auto">
                                Discover the innovative automotive solutions engineered at our Kenitra facility.
                            </p>
                        </motion.div>

                        {/* Projects Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                            {[
                                { src: "mta-images/projects/proj1.png", name: "CBA" },
                                { src: "mta-images/projects/proj2.png", name: "PRP" },
                                { src: "mta-images/projects/proj3.png", name: "SCM" },
                                { src: "mta-images/projects/proj4.png", name: "BFHT-C" },
                                { src: "mta-images/projects/proj5.png", name: "BFHT-B" },
                                { src: "mta-images/projects/proj6.png", name: "BFHT-A" },
                                { src: "mta-images/projects/proj7.png", name: "CMF1" },
                                { src: "mta-images/projects/proj8.png", name: "FUSE BOX" },
                                { src: "mta-images/projects/proj9.png", name: "CFO" },
                                { src: "mta-images/projects/proj10.png", name: "MVJB" },
                                { src: "mta-images/projects/proj11.png", name: "BFRM" },
                                { src: "mta-images/projects/proj12.png", name: "UDB" },
                                { src: "mta-images/projects/proj13.png", name: "MFRH" },
                                { src: "mta-images/projects/proj14.png", name: "PDU" },
                                { src: "mta-images/projects/proj15.png", name: "PYRO" },

                            ].map((project, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.08 }}
                                    className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-500"
                                >
                                    <div className="relative h-72 md:h-100 overflow-hidden bg-gray-100">
                                        <img
                                            src={project.src}
                                            alt={project.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-mtaBlue/80 via-mtaBlue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-6">
                                            <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-400">
                                                <p className="text-white font-bold text-lg">{project.name}</p>
                                                <p className="text-blue-200 text-sm">MTA Morocco</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
                {/* Our Clients — Infinite Marquee */}
                <section className="py-24 bg-gradient-to-b from-white via-gray-50/50 to-white overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 mb-14">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="text-center space-y-4"
                        >
                            <span className="inline-block text-xs font-bold text-mtaBlue uppercase tracking-[0.3em] bg-blue-50 px-5 py-2 rounded-full">
                                Trusted Partners
                            </span>
                            <h2 className="text-3xl md:text-5xl font-black text-gray-900">
                                Our <span className="bg-gradient-to-r from-mtaBlue to-blue-400 bg-clip-text text-transparent">Clients</span>
                            </h2>
                            <p className="text-gray-500 max-w-2xl mx-auto">
                                Proudly serving Europe's leading automotive manufacturers and tier-1 suppliers.
                            </p>
                        </motion.div>
                    </div>

                    {/* Marquee Track — using pure CSS for bulletproof pause/resume */}
                    <div
                        className="relative flex items-center cursor-pointer"
                        onClick={() => setIsClientsPaused(!isClientsPaused)}
                        title="Click to lock/unlock scrolling"
                    >
                        <style>{`
                            @keyframes scroll-clients {
                                0% { transform: translateX(0); }
                                100% { transform: translateX(-50%); }
                            }
                            .marquee-clients {
                                animation: scroll-clients 25s linear infinite;
                            }
                            /* Auto-pause on hover (matching departments) unless explicitly locked */
                            .marquee-clients:hover {
                                animation-play-state: paused;
                            }
                        `}</style>
                        <div
                            className="flex gap-6 whitespace-nowrap marquee-clients"
                            style={{ animationPlayState: isClientsPaused ? "paused" : undefined }}
                        >
                            {[...(() => {
                                const clients = [
                                    { src: "mta-images/clientsImg/cli2.png", alt: "Client 2" },
                                    { src: "mta-images/clientsImg/cli3.png", alt: "Client 3" },
                                    { src: "mta-images/clientsImg/cli4.png", alt: "Client 4" },
                                    { src: "mta-images/clientsImg/cli5.png", alt: "Client 5" },
                                    { src: "mta-images/clientsImg/cli6.png", alt: "Client 6" },
                                    { src: "mta-images/clientsImg/cli7.png", alt: "Client 7" },
                                    { src: "mta-images/clientsImg/cli8.png", alt: "Client 8" },
                                    { src: "mta-images/clientsImg/cli9.png", alt: "Client 9" },
                                    { src: "mta-images/clientsImg/cli10.png", alt: "Client 10" },
                                    { src: "mta-images/clientsImg/cli11.png", alt: "Client 11" },
                                ];
                                return [...clients, ...clients];
                            })()].map((client, index) => (
                                <div key={index} className="min-w-[380px] h-55 bg-white rounded-2xl border border-gray-100 shadow-sm px-6 flex items-center justify-center hover:shadow-lg hover:border-blue-200 hover:scale-105 transition-all duration-400 group cursor-pointer">
                                    <img
                                        src={client.src}
                                        alt={client.alt}
                                        className="max-h-50 max-w-[300px] object-contain transition-all duration-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                {/* 5. Footer */}
                <footer className="py-12 border-t border-gray-100 text-center">
                    <p className="text-gray-400 text-sm">© 2026 MTA Automotive Morocco. Designed for Onboarding Excellence.</p>
                </footer>
            </div>
        </MainLayout>
    );
};

export default Home;