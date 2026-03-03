import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const slides = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
        title: "NUEVA COLECCIÓN 2026",
        subtitle: "Elegancia minimalista para el día a día.",
        cta: "VER COLECCIÓN"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2020&auto=format&fit=crop",
        title: "DENIM EXCLUSIVO",
        subtitle: "La reinvención del clásico.",
        cta: "COMPRAR DENIM"
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1550614000-4b9519e0034a?q=80&w=2073&auto=format&fit=crop",
        title: "ESENCIALES URBANOS",
        subtitle: "Diseños que marcan tendencia.",
        cta: "DESCUBRIR MÁS"
    }
];

const HeroSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-[80vh] w-full overflow-hidden bg-gray-900 text-white">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                >
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
                    >
                        <div className="absolute inset-0 bg-black/30" /> {/* Overlay */}
                    </div>

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
                        <div className="container mx-auto">
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="text-4xl md:text-6xl font-header font-bold mb-4 tracking-wider uppercase"
                            >
                                {slides[currentSlide].title}
                            </motion.h2>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.8 }}
                                className="text-lg md:text-xl font-body font-light mb-8 max-w-2xl mx-auto"
                            >
                                {slides[currentSlide].subtitle}
                            </motion.p>
                            <div className="flex justify-center">
                                <motion.button
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.9, duration: 0.8 }}
                                    className="btn-accent flex items-center space-x-2 group"
                                >
                                    <span>{slides[currentSlide].cta}</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Dots Navigation */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroSlider;
