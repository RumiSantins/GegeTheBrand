import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const BrandManifesto = () => {
    const { scrollYProgress } = useScroll();

    // Parallax effects for floating images
    const y1 = useTransform(scrollYProgress, [0.4, 0.8], [0, -150]);
    const y2 = useTransform(scrollYProgress, [0.4, 0.8], [0, 150]);
    const opacity = useTransform(scrollYProgress, [0.35, 0.45], [0, 1]);

    return (
        <section className="relative py-32 md:py-48 overflow-hidden bg-white">
            {/* Soft Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none select-none">
                <div className="absolute top-10 left-10 text-[10rem] font-serif italic text-black leading-none">GEGE</div>
                <div className="absolute bottom-10 right-10 text-[10rem] font-serif italic text-black leading-none">GEGE</div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center">

                    {/* Floating Decorative Images (Desktop only for precision) */}
                    <motion.div
                        style={{ y: y1, opacity }}
                        className="absolute -left-20 top-20 w-72 aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl hidden xl:block"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop"
                            alt="Fashion Texture"
                            className="w-full h-full object-cover brightness-105"
                        />
                    </motion.div>

                    <motion.div
                        style={{ y: y2, opacity }}
                        className="absolute -right-20 top-40 w-80 aspect-[4/5] rounded-full overflow-hidden shadow-2xl hidden xl:block"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop"
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
                                Nuestro Manifiesto
                            </span>
                            <div className="h-px w-8 bg-purple-400" />
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-5xl md:text-8xl font-serif font-bold text-black mb-12 leading-[1.1] tracking-tighter"
                        >
                            Diseñamos para la <br />
                            <span className="inline-block pr-6 italic text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400">
                                mujer real
                            </span>, <br />
                            la que inspira.
                        </motion.h2>

                        {/* Principles Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-16 border-t border-gray-100 pt-16">
                            {[
                                { title: "Elegancia", desc: "La belleza en la simplicidad." },
                                { title: "Autenticidad", desc: "Viste tu verdad cada día." },
                                { title: "Fuerza", desc: "Empoderamiento a través del estilo." }
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
                            <p className="text-gray-500 text-lg md:text-xl font-serif italic max-w-2xl mx-auto leading-relaxed">
                                "Gege the Brand nace de la necesidad de celebrar la individualidad femenina. Piezas que no solo visten, sino que acompañan."
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
