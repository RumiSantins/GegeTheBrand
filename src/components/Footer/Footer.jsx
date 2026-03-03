import React from 'react';
import { Instagram, Smartphone } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 py-12 font-body">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Brand & Newsletter */}
                <div className="md:col-span-2 space-y-4">
                    <h3 className="text-xl font-header font-bold tracking-widest">GEGE THE BRAND</h3>
                    <p className="text-gray-500 text-sm">Suscríbete para recibir novedades y ofertas exclusivas.</p>
                    <div className="relative max-w-sm">
                        <input
                            type="email"
                            placeholder="tu@email.com"
                            className="w-full pl-4 pr-12 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all bg-secondary"
                        />
                        <button className="absolute right-1 top-1 bottom-1 px-4 bg-black text-white rounded text-sm hover:bg-gray-800 transition-colors">
                            →
                        </button>
                    </div>
                </div>

                {/* Navigation Links */}
                <div>
                    <h4 className="font-bold mb-4 uppercase text-sm tracking-wider">Ayuda</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li><a href="#" className="hover:text-black transition-colors">Envíos</a></li>
                        <li><a href="#" className="hover:text-black transition-colors">Devoluciones</a></li>
                        <li><a href="#" className="hover:text-black transition-colors">Legal</a></li>
                        <li><a href="#" className="hover:text-black transition-colors">Contacto</a></li>
                    </ul>
                </div>

                {/* Social & Legal */}
                <div className="flex flex-col justify-between">
                    <div>
                        <h4 className="font-bold mb-4 uppercase text-sm tracking-wider">Síguenos</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="p-2 border rounded-full hover:border-purple-400 hover:text-purple-500 transition-all group">
                                <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="#" className="p-2 border rounded-full hover:border-pink-400 hover:text-pink-500 transition-all group">
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
