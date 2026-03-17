import React from 'react';
import { Instagram, Smartphone } from 'lucide-react';

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
                            <a href="#" className="p-2 border dark:border-gray-700 rounded-full hover:border-purple-400 hover:text-purple-500 transition-all group">
                                <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="#" className="p-2 border dark:border-gray-700 rounded-full hover:border-pink-400 hover:text-pink-500 transition-all group">
                                <Smartphone className="w-5 h-5 group-hover:scale-110 transition-transform" /> {/* Using Smartphone as TikTok alternative if unavailable, or just generically */}
                            </a>
                        </div>
                    </div>
                    <div className="mt-8 text-xs text-gray-400">
                        © 2026 GEGE THE BRAND. <br /> Todos los derechos reservados.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
