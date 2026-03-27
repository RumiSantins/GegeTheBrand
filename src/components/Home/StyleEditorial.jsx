import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Instagram, Quote } from 'lucide-react';
import { API_BASE_URL } from '../../api/config';

const StyleEditorial = () => {
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/editorial-settings`);
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data);

                    // Handle precision scroll if this is the target section
                    if (window.location.hash === '#editorial') {
                        setTimeout(() => {
                            const section = document.getElementById('editorial');
                            if (section && window.lenis) {
                                window.lenis.scrollTo(section, { offset: -140, duration: 1.2 });
                            }
                        }, 500);
                    }
                }
            } catch (err) {
                console.error("Error fetching editorial settings:", err);
            }
        };
        fetchSettings();
    }, []);
    const resolveImageUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') || url.startsWith('blob') ? url : `${API_BASE_URL}${encodeURI(url)}`;
    };

    const moodboardImages = [
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop", // Texture/Silk
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1976&auto=format&fit=crop", // Detail/Jewelry
        "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=2070&auto=format&fit=crop", // Soft color palette
        "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=1964&auto=format&fit=crop", // Minimalist architecture/light
    ];

    if (!settings) return <section id="editorial" className="py-40 bg-white dark:bg-black min-h-[60vh] flex items-center justify-center text-gray-300 dark:text-gray-800 uppercase tracking-[0.3em] text-[10px] font-bold">Cargando Editorial...</section>;

    return (
        <section id="editorial" className="py-40 bg-white dark:bg-black relative overflow-hidden text-black dark:text-white">
            {/* Background Decorative Text */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 select-none opacity-[0.02] pointer-events-none">
                <span className="text-[25rem] font-serif font-bold italic leading-none whitespace-nowrap overflow-visible">
                    {settings?.bg_text || 'Muse'}
                </span>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">

                    {/* Column 1: Intro & Half Moodboard (lg:col-span-4) */}
                    <div className="lg:col-span-4 flex flex-col justify-between space-y-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="text-purple-600 font-bold tracking-[0.4em] text-[10px] uppercase mb-6 block">
                                Editorial Edition / 2026
                            </span>
                            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-8 tracking-tighter leading-[0.9]">
                                {settings?.title_line1 || 'LA'} <span className="italic">{settings?.title_italic || 'NUEVA'}</span> <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">{settings?.title_gradient || 'POÉTICA'}</span>
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed max-w-sm mb-8">
                                {settings?.description || 'Redefiniendo la feminidad a través de líneas puras y texturas que cuentan historias de libertad y elegancia atemporal.'}
                            </p>
                            <Link to={settings?.button_url || "/#shop"} className="w-fit flex items-center space-x-3 group border-b border-black dark:border-white pb-2 transition-all hover:pr-4">
                                <span className="text-sm font-bold tracking-widest uppercase">Ver Colección</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                resolveImageUrl(settings?.image_1_url) || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
                                resolveImageUrl(settings?.image_2_url) || "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1976&auto=format&fit=crop"
                            ].map((img, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: idx * 0.2 }}
                                    className="aspect-square rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 shadow-lg"
                                >
                                    <img src={img} alt={`Mood ${idx}`} className="w-full h-full object-cover" />
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                            className="bg-purple-50 dark:bg-purple-950/50 p-8 rounded-3xl relative overflow-hidden group"
                        >
                            <Quote className="absolute -top-4 -right-4 w-24 h-24 text-purple-100 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                            <p className="relative z-10 text-gray-600 dark:text-gray-300 font-serif italic text-lg leading-snug">
                                "{settings?.quote_text || 'La elegancia es la única belleza que nunca desaparece.'}"
                            </p>
                            <p className="mt-4 text-[10px] font-bold tracking-widest text-purple-400 uppercase">— {settings?.quote_author || 'Audrey Hepburn'}</p>
                        </motion.div>
                    </div>

                    {/* Column 2: Main Feature (lg:col-span-5) */}
                    <div className="lg:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative h-full min-h-[600px] rounded-[2rem] overflow-hidden shadow-2xl group"
                        >
                            <img
                                src={resolveImageUrl(settings?.image_main_url) || "https://images.unsplash.com/photo-1549062572-544a64fb0c56?q=80&w=1974&auto=format&fit=crop"}
                                alt="Main Feature"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms]"
                            />

                            {/* Overlay with info */}
                            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 via-black/20 to-transparent text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-700">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-60 mb-2">Look Reference</p>
                                        <h4 className="text-2xl font-serif italic">{settings?.look_name || 'Conjunto Minimal Seda'}</h4>
                                    </div>
                                    <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                                        <span className="text-xs font-bold uppercase tracking-widest">{settings?.look_price || 'S/ 185'}</span>
                                        <Plus className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                        </motion.div>
                    </div>

                    {/* Column 3: The Rest & Social (lg:col-span-3) */}
                    <div className="lg:col-span-3 flex flex-col justify-between space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl"
                        >
                            <img
                                src={resolveImageUrl(settings?.image_3_url) || "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"}
                                alt="Side Detail"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>

                        <div className="space-y-4">
                            {[
                                resolveImageUrl(settings?.image_4_url) || "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=2070&auto=format&fit=crop",
                                resolveImageUrl(settings?.image_5_url) || "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=1964&auto=format&fit=crop"
                            ].map((img, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.4 + (idx * 0.2) }}
                                    className="aspect-[16/9] rounded-2xl overflow-hidden shadow-md"
                                >
                                    <img src={img} alt={`Mood ${idx + 2}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                                </motion.div>
                            ))}
                        </div>

                        <div className="bg-gray-50 dark:bg-[#07020f] p-6 rounded-[2rem] border border-gray-100 dark:border-[#1a0e30]">
                            <div className="flex items-center justify-between mb-6">
                                <Instagram className="w-5 h-5 text-pink-500" />
                                <span className="text-[10px] font-bold tracking-widest text-gray-400">@GEGETHEBRAND</span>
                            </div>
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="User" />
                                    </div>
                                ))}
                                <div className="w-8 h-8 rounded-full border-2 border-white bg-white flex items-center justify-center text-[8px] font-bold text-gray-400">
                                    +12k
                                </div>
                            </div>
                            <p className="mt-4 text-[9px] text-gray-400 uppercase tracking-tighter leading-none">Únete a nuestra <br />comunidad de musas.</p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default StyleEditorial;
