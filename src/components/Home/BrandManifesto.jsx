import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const BrandManifesto = () => {
    const [manifesto, setManifesto] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch('http://localhost:8080/manifesto');
                const data = await res.json();
                setManifesto(data);

                // Handle precision scroll if this is the target section
                if (window.location.hash === '#nosotros') {
                    setTimeout(() => {
                        const section = document.getElementById('nosotros');
                        if (section && window.lenis) {
                            window.lenis.scrollTo(section, { offset: -140, duration: 1.2 });
                        }
                    }, 500);
                }
            } catch (err) {
                console.error("Error fetching manifesto:", err);
            }
        };
        loadData();
    }, []);

    const resolveImageUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') || url.startsWith('blob') ? url : `http://localhost:8080${encodeURI(url)}`;
    };
    const textRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: textRef,
        offset: ["start 75%", "end 25%"]
    });

    // Parallax effects for floating images
    const y1 = useTransform(scrollYProgress, [0, 1], [50, -150]);
    const y2 = useTransform(scrollYProgress, [0, 1], [-50, 150]);
    const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);

    if (!manifesto) return <section id="nosotros" className="py-44 md:py-60 bg-white dark:bg-black min-h-[40vh] flex items-center justify-center text-gray-300 dark:text-gray-800 uppercase tracking-[0.3em] text-[10px] font-bold">Cargando...</section>;

    return (
        <section id="nosotros" className="relative py-44 md:py-60 overflow-hidden bg-white dark:bg-black">
            {/* Soft Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none select-none">
                <div className="absolute top-10 left-10 text-[10rem] font-serif italic text-black dark:text-white leading-none">{manifesto?.bg_text_1 || 'GEGE'}</div>
                <div className="absolute bottom-10 right-10 text-[10rem] font-serif italic text-black dark:text-white leading-none whitespace-nowrap">{manifesto?.bg_text_2 || 'THE BRAND'}</div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center">

                    {/* Floating Decorative Images (Desktop only for precision) */}
                    <motion.div
                        style={{ y: y1, opacity, willChange: "transform, opacity" }}
                        className="absolute -left-20 top-20 w-72 aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl hidden xl:block"
                    >
                        <img
                            src={manifesto?.image_1_url ? resolveImageUrl(manifesto.image_1_url) : "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop"}
                            alt="Fashion Texture"
                            className="w-full h-full object-cover brightness-105"
                        />
                    </motion.div>

                    <motion.div
                        style={{ y: y2, opacity, willChange: "transform, opacity" }}
                        className="absolute -right-20 top-40 w-80 aspect-[4/5] rounded-full overflow-hidden shadow-2xl hidden xl:block"
                    >
                        <img
                            src={manifesto?.image_2_url ? resolveImageUrl(manifesto.image_2_url) : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop"}
                            alt="Brand Essence"
                            className="w-full h-full object-cover grayscale"
                        />
                    </motion.div>

                    {/* Content Block */}
                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="inline-flex items-center space-x-4 mb-10"
                        >
                            <div className="h-px w-8 bg-purple-400" />
                            <span className="text-xs font-bold text-purple-600 uppercase tracking-[0.3em]">
                                {manifesto?.subtitle || 'Nuestro Manifiesto'}
                            </span>
                            <div className="h-px w-8 bg-purple-400" />
                        </motion.div>

                        <motion.h2
                            ref={textRef}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-5xl md:text-8xl font-serif font-bold text-black dark:text-white mb-12 leading-[1.1] tracking-tighter"
                        >
                            {manifesto?.title_line1 || 'Diseñamos para la'} <br />
                            <span className="inline-block pr-6 italic text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 py-2">
                                {manifesto?.title_highlight || 'mujer real'}
                            </span>, <br />
                            {manifesto?.title_line2 || 'la que inspira.'}
                        </motion.h2>

                        {/* Principles Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-16 border-t border-gray-100 dark:border-gray-800 pt-16">
                            {[
                                { title: manifesto?.principle_1_title || "Elegancia", desc: manifesto?.principle_1_desc || "La belleza en la simplicidad." },
                                { title: manifesto?.principle_2_title || "Autenticidad", desc: manifesto?.principle_2_desc || "Viste tu verdad cada día." },
                                { title: manifesto?.principle_3_title || "Fuerza", desc: manifesto?.principle_3_desc || "Empoderamiento a través del estilo." }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.4 + (idx * 0.2) }}
                                    className="px-4"
                                >
                                    <h4 className="text-2xl font-serif italic mb-3">{item.title}</h4>
                                    <p className="text-gray-400 text-sm font-body uppercase tracking-widest">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 1 }}
                            className="mt-20"
                        >
                            <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-serif italic max-w-2xl mx-auto leading-relaxed">
                                {manifesto?.quote || '"Gege the Brand nace de la necesidad de celebrar la individualidad femenina. Piezas que no solo visten, sino que acompañan."'}
                            </p>
                        </motion.div>
                    </div>

                </div>
            </div>

            {/* Bottom Gradient Accent */}
            <div className="absolute bottom-0 left-0 w-full h-[6px] bg-accent-gradient opacity-10" />
        </section>
    );
};

export default BrandManifesto;
