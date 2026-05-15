import React from 'react';
import { Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-black border-t border-gray-100 dark:border-gray-800 py-12 font-body transition-colors duration-500">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

                <div className="md:col-span-2 space-y-4">
                    <h3 className="text-xl font-header font-bold tracking-widest uppercase">Encuéntranos</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Visita nuestra tienda para conocer nuestras colecciones exclusivas en persona.</p>
                    <div className="relative w-full h-48 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm mt-4 group">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.810688825725!2d-77.01633532409825!3d-12.056557688181604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c898c1995555%3A0xe54c15330aa180ea!2sJir%C3%B3n%20Agust%C3%ADn%20Gamarra%201043%2C%20La%20Victoria%2015018!5e0!3m2!1ses-419!2spe!4v1709923812000!5m2!1ses-419!2spe"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Nuestra Ubicación"
                        ></iframe>
                        {/* Address Overlay */}
                        <div className="absolute bottom-4 left-4 right-4 md:right-auto bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-3 rounded shadow pointer-events-none border border-gray-100 dark:border-gray-700 transition-opacity group-hover:opacity-90">
                            <p className="font-bold text-sm text-black dark:text-white">Agustín Gamarra 1043</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Centro Comercial YA - 2do piso tienda 42</p>
                            <p className="text-xs text-gray-400">La Victoria, Lima</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <div>
                    <h4 className="font-bold mb-4 uppercase text-sm tracking-wider">Ayuda</h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Envíos</a></li>
                        <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Devoluciones</a></li>
                        <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Legal</a></li>
                        <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Contacto</a></li>
                    </ul>
                </div>

                {/* Social & Legal */}
                <div className="flex flex-col justify-between">
                    <div>
                        <h4 className="font-bold mb-4 uppercase text-sm tracking-wider">Síguenos</h4>
                        <div className="flex space-x-4">
                            <a href="https://www.instagram.com/gege.thebrand/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-black dark:bg-[#110620] border border-transparent dark:border-[#1a0e30] rounded-full flex items-center justify-center text-white hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] active:scale-90 transition-all group">
                                <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="https://www.tiktok.com/@gege.thebrand" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-black dark:bg-[#110620] border border-transparent dark:border-[#1a0e30] rounded-full flex items-center justify-center text-white hover:bg-black hover:shadow-[0_0_15px_#25f4ee,0_0_15px_#fe2c55] active:scale-90 transition-all group">
                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.08.33-.54.31-.99.77-1.24 1.35-.43.99-.26 2.12.35 3.01.62.9 1.71 1.48 2.82 1.47 1.52.01 2.97-.93 3.42-2.38.16-.5.22-1.01.21-1.53.03-4.97-.03-9.95.02-14.93z" /></svg>
                            </a>
                        </div>
                    </div>
                    <div className="mt-8 text-xs text-gray-400">
                        © 2026 GEGE THE BRAND. <br /> Todos los derechos reservados.
                        <div className="mt-2 flex items-center gap-1 group">
                            <span>Hecho por</span>
                            <a
                                href="https://www.linkedin.com/in/felipe-rumi-santillan-echevarria-1082a71b2/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                            >
                                Felipe Santillan
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
