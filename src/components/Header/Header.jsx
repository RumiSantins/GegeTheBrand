import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, User, Menu, X, Phone, Mail, Instagram, Heart, Moon, Sun } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SearchModal from './SearchModal';
import { API_BASE_URL } from '../../api/config';

const Header = () => {
    const { toggleCart, cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isShopOpen, setIsShopOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [announcementText, setAnnouncementText] = useState("ENVÍO GRATIS EN COMPRAS MAYORES A S/ 150  •  NUEVA COLECCIÓN DISPONIBLE  •  DESCUENTOS EXCLUSIVOS PARA MIEMBROS");

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/categories`);
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data);
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };

        const fetchSettings = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/site-settings`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.announcement_text) {
                        setAnnouncementText(data.announcement_text);
                    }
                }
            } catch (err) {
                console.error("Error fetching site settings:", err);
            }
        };

        fetchCategories();
        fetchSettings();
    }, []);

    const resolveImageUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);



    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
            if (window.lenis) window.lenis.stop();
        } else {
            document.body.style.overflow = 'unset';
            if (window.lenis) window.lenis.start();
        }
        return () => {
            document.body.style.overflow = 'unset';
            if (window.lenis) window.lenis.start();
        };
    }, [isMobileMenuOpen]);

    const isSolidHeader = true; // Always solid as requested

    return (
        <header className={`fixed w-full z-50 transition-all duration-300 ${isSolidHeader ? 'bg-white dark:bg-black shadow-md dark:shadow-gray-800/30' : 'bg-transparent'}`}>
            {/* Top Bar */}
            <div className="bg-purple-100/50 dark:bg-purple-950/50 overflow-hidden py-2 transition-colors duration-500">
                <div className="animate-marquee text-sm font-medium tracking-wide text-purple-900 dark:text-purple-200 whitespace-nowrap">
                    {announcementText}
                </div>
            </div>

            {/* Navbar */}
            <nav className={`container mx-auto px-4 flex justify-between items-center relative transition-all duration-500 ${scrolled ? 'py-2' : 'py-3'}`}>

                {/* Left: Hamburger Menu (Now on all screens) */}
                <div className={`w-1/3 flex items-center z-50 ${isSolidHeader ? 'text-black dark:text-gray-200' : 'text-white'}`}>
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-1 hover:text-purple-600 transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                {/* Center: Logo (Balanced for perfect centering) */}
                <div className="w-1/3 flex justify-center">
                    <Link to="/" className="flex items-center group relative z-50">
                        <div className={`flex flex-col items-center justify-center transition-all duration-700 ${scrolled ? 'scale-90' : 'scale-100'}`}>
                            {/* Main Name with Breathing Effect */}
                            <div className="relative">
                                <span className={`block text-3xl md:text-4xl font-serif font-black tracking-tighter leading-none transition-all duration-500 group-hover:tracking-[0.05em] ${isSolidHeader ? 'text-black dark:text-white' : 'text-white'}`}>
                                    GEGE
                                </span>
                                {/* Floating Accent Dot */}
                                <div className="absolute -top-1 -right-2 w-1 h-1 rounded-full bg-accent-gradient opacity-0 group-hover:opacity-100 transition-all duration-500 scale-0 group-hover:scale-100 shadow-[0_0_8px_#F472B6]"></div>
                            </div>

                            {/* Stylized Subtitle with Expanding Lines */}
                            <div className="flex items-center gap-3 mt-1.5 overflow-hidden">
                                <div className={`h-[0.5px] w-3 transition-all duration-700 group-hover:w-8 ${isSolidHeader ? 'bg-black/20 dark:bg-white/20' : 'bg-white/30'} group-hover:bg-purple-400`}></div>
                                <span className={`block text-[0.4rem] md:text-[0.5rem] font-sans font-black tracking-[0.5em] transition-all duration-500 uppercase ${isSolidHeader ? 'text-gray-500 dark:text-gray-400' : 'text-white/80'} group-hover:text-purple-500 dark:group-hover:text-purple-400`}>
                                    The Brand
                                </span>
                                <div className={`h-[0.5px] w-3 transition-all duration-700 group-hover:w-8 ${isSolidHeader ? 'bg-black/20 dark:bg-white/20' : 'bg-white/30'} group-hover:bg-purple-400`}></div>
                            </div>
                        </div>
                    </Link>
                </div>


                {/* Right: Icons (Balanced for perfect centering) */}
                <div className={`w-1/3 flex items-center justify-end space-x-4 md:space-x-6 ${isSolidHeader ? 'text-black dark:text-gray-200' : 'text-white'}`}>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleTheme();
                        }}
                        className="p-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors focus:outline-none"
                        title={isDark ? 'Modo claro' : 'Modo oscuro'}
                        style={{ zIndex: 60 }} // Extra z-index to be safe
                    >
                        {isDark ? <Sun className="w-[1.32rem] h-[1.32rem] pointer-events-none text-yellow-400" /> : <Moon className="w-[1.32rem] h-[1.32rem] pointer-events-none" />}
                    </button>
                    <Link to="/wishlist" className="relative cursor-pointer group">
                        <Heart className="w-[1.32rem] h-[1.32rem] hover:text-red-500 transition-colors group-hover:scale-110 duration-200" />
                        {wishlistCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-400 to-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-bounce">
                                {wishlistCount}
                            </span>
                        )}
                    </Link>
                    <div className="relative cursor-pointer group" onClick={toggleCart}>
                        <ShoppingBag className="w-[1.32rem] h-[1.32rem] hover:text-purple-600 dark:hover:text-purple-400 transition-colors group-hover:scale-110 duration-200" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-bounce">
                                {cartCount}
                            </span>
                        )}
                    </div>
                </div>
            </nav>

            {/* Sidebar Overlay */}
            {
                isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-[100] transition-opacity"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )
            }

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-screen w-[85%] max-w-sm bg-white dark:bg-[#07020f] z-[110] transform transition-transform duration-300 ease-in-out flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Sidebar Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-[#1a0e30]">
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
                    <div className="flex flex-col text-[13px] tracking-[0.1em] font-medium text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-[#1a0e30]">
                        {!isShopOpen ? (
                            <div className="flex flex-col px-6 pb-6 gap-6">
                                <button
                                    className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex justify-between items-center w-full uppercase"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        setIsSearchOpen(true);
                                    }}
                                >
                                    BUSCAR
                                    <Search className="w-4 h-4 text-gray-400 dark:text-gray-300" />
                                </button>
                                <button
                                    className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex justify-between items-center w-full uppercase"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        navigate('/');
                                    }}
                                >
                                    INICIO
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                </button>
                                <button
                                    className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex justify-between items-center w-full uppercase"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        const el = document.getElementById('shop');
                                        if (location.pathname === '/' && el) {
                                            if (window.lenis) window.lenis.scrollTo(el, { offset: -100, duration: 1.5 });
                                            else window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
                                        } else {
                                            navigate('/#shop');
                                        }
                                    }}
                                >
                                    TIENDA
                                    <ShoppingBag className="w-4 h-4 text-gray-400" />
                                </button>
                                <button
                                    className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex justify-between items-center w-full uppercase"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        navigate('/nosotros');
                                    }}
                                >
                                    NOSOTROS
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </button>
                                <button className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex justify-between items-center w-full uppercase" onClick={() => setIsShopOpen(true)}>
                                    CATEGORÍAS
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </button>
                                <button
                                    className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex justify-between items-center w-full uppercase"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        if (location.pathname === '/' && location.hash === '#editorial') {
                                            const el = document.getElementById('editorial');
                                            if (el) {
                                                if (window.lenis) window.lenis.scrollTo(el, { offset: -100, duration: 1.5 });
                                                else window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
                                            }
                                        } else {
                                            navigate('/#editorial');
                                        }
                                    }}
                                >
                                    EDITORIAL
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col w-full">
                                <button
                                    className="px-6 pb-4 pt-1 hover:text-purple-600 transition-colors flex justify-between items-center w-full uppercase font-serif text-[15px] tracking-wider mb-2 dark:text-white"
                                    onClick={() => setIsShopOpen(false)}
                                >
                                    CATEGORÍAS
                                    <svg className="w-5 h-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                </button>
                                <div className="grid grid-cols-2 gap-x-3 gap-y-6 px-4 pb-6">
                                    {categories.map((cat, idx) => (
                                        <Link
                                            key={idx}
                                            to={`/?category=${encodeURIComponent(cat.name)}#shop`}
                                            className="flex flex-col w-full group"
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                setIsShopOpen(false);

                                                if (location.pathname !== '/') {
                                                    // Allow the link 'to=\"/?category=...#shop\"' to trigger navigation
                                                    // the useEffect on mount will handle scrolling to shop
                                                    return;
                                                }

                                                setTimeout(() => {
                                                    const shopSection = document.getElementById('shop');
                                                    if (shopSection) {
                                                        if (window.lenis) {
                                                            window.lenis.scrollTo(shopSection, { offset: -100, duration: 1.5 });
                                                        } else {
                                                            const headerOffset = 100;
                                                            const elementPosition = shopSection.getBoundingClientRect().top;
                                                            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                                                            window.scrollTo({
                                                                top: offsetPosition,
                                                                behavior: 'smooth'
                                                            });
                                                        }
                                                    }
                                                }, 150);
                                            }}
                                        >
                                            <div className="relative w-full aspect-[4/5] bg-gray-100 dark:bg-black overflow-hidden mb-2 rounded-sm shadow-sm transition-shadow duration-300 group-hover:shadow-md">
                                                <img src={resolveImageUrl(cat.image_url)} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105" />
                                            </div>
                                            <span className="text-gray-900 dark:text-gray-100 font-serif text-[10px] sm:text-[11px] tracking-widest uppercase leading-snug px-1 line-clamp-2">
                                                {cat.name}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Contact Info */}
                    <div className="px-6 py-6 border-b border-gray-100 dark:border-[#1a0e30] space-y-4">
                        <p className="text-sm font-serif mb-2 dark:text-white">Contacta con nosotros</p>
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                            <Phone className="w-4 h-4" />
                            <span>+51 948 124 445</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                            <Mail className="w-4 h-4" />
                            <span>contacto@gegethebrand.com</span>
                        </div>
                    </div>

                    <div className="px-6 py-6 flex gap-4">
                        <a href="https://www.instagram.com/gege.thebrand/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-black dark:bg-[#110620] border border-transparent dark:border-[#1a0e30] rounded-full flex items-center justify-center text-white hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] active:scale-90 transition-all group">
                            <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </a>
                        <a href="https://www.tiktok.com/@gege.thebrand" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-black dark:bg-[#110620] border border-transparent dark:border-[#1a0e30] rounded-full flex items-center justify-center text-white hover:bg-black hover:shadow-[0_0_15px_#25f4ee,0_0_15px_#fe2c55] active:scale-90 transition-all group">
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.08.33-.54.31-.99.77-1.24 1.35-.43.99-.26 2.12.35 3.01.62.9 1.71 1.48 2.82 1.47 1.52.01 2.97-.93 3.42-2.38.16-.5.22-1.01.21-1.53.03-4.97-.03-9.95.02-14.93z"/></svg>
                        </a>
                    </div>
                </div>
            </div>

            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                categories={categories}
            />
        </header >
    );
};

export default Header;
