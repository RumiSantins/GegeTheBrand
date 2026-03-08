import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, User, Menu, X, Phone, Mail, Facebook, Instagram, Smartphone } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const Header = () => {
    const { toggleCart, cartCount } = useCart();
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isShopOpen, setIsShopOpen] = useState(false);

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('http://localhost:8080/categories');
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data);
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategories();
    }, []);

    const resolveImageUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `http://localhost:8080${url}`;
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    return (
        <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
            {/* Top Bar */}
            <div className="bg-purple-100 overflow-hidden py-2">
                <div className="animate-marquee text-sm font-medium tracking-wide text-purple-900">
                    ENVÍO GRATIS EN COMPRAS MAYORES A $150  •  NUEVA COLECCIÓN DISPONIBLE  •  DESCUENTOS EXCLUSIVOS PARA MIEMBROS
                </div>
            </div>

            {/* Navbar */}
            <nav className="container mx-auto py-3 px-4 flex justify-between items-center relative">

                {/* Left: Hamburger Menu (Mobile Only) */}
                <div className="md:hidden w-1/3 flex items-center z-50">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-1 hover:text-purple-600 transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                {/* Left/Center: Logo */}
                <div className="w-1/3 flex justify-center md:w-auto md:justify-start">
                    <Link to="/" className="flex items-center group relative z-50">
                        <div className="relative w-16 h-16 md:w-24 md:h-24 flex items-center justify-center rounded-full bg-white/50 backdrop-blur-sm shadow-sm border border-white/20 group-hover:bg-white/80 transition-all duration-300">
                            {/* Dots Circle SVG */}
                            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-spin-slow opacity-80 group-hover:opacity-100">
                                {/* Generate dots around circle with Pink-Purple Spectrum */}
                                {[...Array(20)].map((_, i) => {
                                    const angleRad = (i * 360 / 20 * Math.PI) / 180;
                                    const radius = 42;
                                    const x = 50 + radius * Math.cos(angleRad);
                                    const y = 50 + radius * Math.sin(angleRad);
                                    const hue = 290 + 40 * Math.sin((i / 20) * 2 * Math.PI);
                                    return (
                                        <circle key={i} cx={x} cy={y} r="3" fill={`hsl(${hue}, 90%, 70%)`} />
                                    );
                                })}
                            </svg>

                            {/* Text Center */}
                            <div className="text-center z-10 scale-[0.6] md:scale-90 flex flex-col items-center justify-center mt-0.5">
                                <span className="block text-3xl font-serif font-bold tracking-tight leading-none text-black">GEGE</span>
                                <span className="block text-[0.4rem] font-sans font-bold tracking-[0.2em] text-black">THE BRAND</span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Center: Navigation Links (Desktop) */}
                <div className="hidden md:flex items-center space-x-8">
                    {['INICIO', 'TIENDA', 'COLECCIONES', 'NOSOTROS'].map((item) => (
                        <Link
                            key={item}
                            to="/"
                            className="text-sm font-bold tracking-widest hover:text-purple-600 transition-colors relative group"
                        >
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    ))}
                </div>

                {/* Right: Icons */}
                <div className="w-1/3 flex items-center justify-end space-x-4 md:w-auto md:space-x-6">
                    <Search className="w-5 h-5 hover:text-purple-600 cursor-pointer transition-colors" />
                    <User className="w-5 h-5 hover:text-purple-600 cursor-pointer transition-colors" />
                    <div className="relative cursor-pointer group" onClick={toggleCart}>
                        <ShoppingBag className="w-5 h-5 hover:text-purple-600 transition-colors group-hover:scale-110 duration-200" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-bounce">
                                {cartCount}
                            </span>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar Overlay */}
            {
                isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-[100] transition-opacity md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )
            }

            {/* Mobile Sidebar */}
            <div
                className={`fixed top-0 left-0 h-screen w-[85%] max-w-sm bg-white z-[110] transform transition-transform duration-300 ease-in-out flex flex-col md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Sidebar Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <span className="text-lg font-serif tracking-wider">Menú</span>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-1 hover:text-purple-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Sidebar Content Scrollable */}
                <div className="flex-1 overflow-y-auto w-full py-4 flex flex-col">
                    {/* Links */}
                    <div className="flex flex-col text-[13px] tracking-[0.1em] font-medium text-gray-800 border-b border-gray-100">
                        {!isShopOpen ? (
                            <div className="flex flex-col px-6 pb-6 gap-6">
                                <button className="hover:text-purple-600 transition-colors flex justify-between items-center w-full uppercase" onClick={() => setIsShopOpen(true)}>
                                    CATEGORÍAS
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </button>
                                <Link to="/" className="hover:text-purple-600 transition-colors flex justify-between items-center" onClick={() => setIsMobileMenuOpen(false)}>
                                    NOSOTROS
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col w-full">
                                <button
                                    className="px-6 pb-4 pt-1 hover:text-purple-600 transition-colors flex justify-between items-center w-full uppercase font-serif text-[15px] tracking-wider mb-2"
                                    onClick={() => setIsShopOpen(false)}
                                >
                                    CATEGORÍAS
                                    <svg className="w-5 h-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                </button>
                                <div className="grid grid-cols-2 gap-x-3 gap-y-6 px-4 pb-6">
                                    {categories.map((cat, idx) => (
                                        <Link
                                            key={idx}
                                            to="/"
                                            className="flex flex-col w-full group"
                                            onClick={() => { setIsMobileMenuOpen(false); setIsShopOpen(false); }}
                                        >
                                            <div className="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden mb-2 rounded-sm shadow-sm transition-shadow duration-300 group-hover:shadow-md">
                                                <img src={resolveImageUrl(cat.image_url)} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105" />
                                            </div>
                                            <span className="text-gray-900 font-serif text-[10px] sm:text-[11px] tracking-widest uppercase leading-snug px-1 line-clamp-2">
                                                {cat.name}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Contact Info */}
                    <div className="px-6 py-6 border-b border-gray-100 space-y-4">
                        <p className="text-sm font-serif mb-2">Contacta con nosotros</p>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>+51 930 291 524</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>contacto@gegethebrand.com</span>
                        </div>
                    </div>

                    {/* Account */}
                    <div className="px-6 py-6 border-b border-gray-100">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-600">Su cuenta</span>
                            <Link to="/" className="border-b border-black pb-0.5 hover:text-purple-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                Iniciar sesión
                            </Link>
                        </div>
                    </div>

                    {/* Socials */}
                    <div className="px-6 py-6 flex gap-4">
                        <a href="#" className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white hover:bg-purple-600 transition-colors group">
                            <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </a>
                        <a href="#" className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white hover:bg-purple-600 transition-colors group">
                            <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </a>
                        <a href="#" className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white hover:bg-purple-600 transition-colors group">
                            <Smartphone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </a>
                    </div>
                </div>
            </div>
        </header >
    );
};

export default Header;
