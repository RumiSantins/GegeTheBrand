import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slides, setSlides] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch slides from backend
        fetch('http://localhost:8080/hero-slides')
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    setSlides(data);
                }
            })
            .catch(err => console.error("Error fetching hero slides:", err));
    }, []);

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides]);

    const resolveImageUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `http://localhost:8080${encodeURI(url)}`;
    };

    const handleCtaClick = (ctaUrl) => {
        if (!ctaUrl) return;
        if (ctaUrl.startsWith('http://') || ctaUrl.startsWith('https://')) {
            window.location.href = ctaUrl;
        } else {
            navigate(ctaUrl);
        }
    };

    if (slides.length === 0) return <div className="h-[80vh] w-full bg-gray-900 flex items-center justify-center text-white">Cargando...</div>;

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
                        style={{ backgroundImage: `url('${resolveImageUrl(slides[currentSlide].image_url)}')` }}
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
                                    onClick={() => handleCtaClick(slides[currentSlide].cta_url)}
                                    className="btn-accent flex items-center space-x-2 group"
                                >
                                    <span>{slides[currentSlide].cta_text}</span>
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
