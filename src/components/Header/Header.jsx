import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, User, Menu, X, Phone, Mail, Facebook, Instagram, Smartphone, Heart, Moon, Sun } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SearchModal from './SearchModal';

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
                const res = await fetch('http://localhost:8080/categories');
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
                const res = await fetch('http://localhost:8080/site-settings');
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
        return url.startsWith('http') ? url : `http://localhost:8080${url}`;
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
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const isHomePage = location.pathname === '/';
    const isSolidHeader = scrolled || !isHomePage;

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

                {/* Left: Hamburger Menu (Mobile Only) */}
                <div className={`md:hidden w-1/3 flex items-center z-50 ${isSolidHeader ? 'text-black dark:text-gray-200' : 'text-white'}`}>
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
                        <div className={`relative flex items-center justify-center rounded-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-sm border border-white/20 dark:border-gray-700/50 group-hover:bg-white/80 dark:group-hover:bg-gray-800/80 transition-all duration-500 ${scrolled ? 'w-18 h-18 md:w-28 md:h-28' : 'w-20 h-20 md:w-32 md:h-32'}`}>
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
                                        <circle key={i} cx={x} cy={y} r="2.7" fill={`hsl(${hue}, 90%, 70%)`} />
                                    );
                                })}
                            </svg>

                            {/* Text Center */}
                            <div className={`text-center z-10 flex flex-col items-center justify-center mt-0.5 transition-all duration-500 ${scrolled ? 'scale-[0.7] md:scale-95' : 'scale-[0.75] md:scale-110'}`}>
                                <span className="block text-[1.53rem] font-serif font-bold tracking-tight leading-none text-black dark:text-white transition-colors">GEGE</span>
                                <span className="block text-[0.4rem] font-sans font-bold tracking-[0.2em] text-black dark:text-white transition-colors">THE BRAND</span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Center: Navigation Links (Desktop) */}
                <div className="hidden md:flex items-center space-x-8">
                    {[
                        { name: 'INICIO', target: null },
                        { name: 'NOSOTROS', target: 'nosotros' },
                        { name: 'TIENDA', target: 'shop' },
                        { name: 'EDITORIAL', target: 'editorial' },
                    ].map((item) => (
                        <button
                            key={item.name}
                            onClick={() => {
                                if (location.pathname !== '/' || item.target) {
                                    navigate(item.target ? `/#${item.target}` : '/');
                                } else {
                                    // Already on '/' with no target (Inicio)
                                    if (window.lenis) {
                                        window.lenis.scrollTo(0, { duration: 1.2 });
                                    } else {
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }
                                }
                            }}
                            className={`text-sm font-bold tracking-widest hover:text-purple-600 dark:hover:text-purple-400 transition-colors relative group ${isSolidHeader ? 'text-black dark:text-gray-200' : 'text-white'}`}
                        >
                            {item.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
                        </button>
                    ))}
                </div>

                {/* Right: Icons */}
                <div className={`w-1/3 flex items-center justify-end space-x-4 md:w-auto md:space-x-6 ${isSolidHeader ? 'text-black dark:text-gray-200' : 'text-white'}`}>
                    <Search
                        className="hidden md:block w-[1.32rem] h-[1.32rem] hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition-colors"
                        onClick={() => setIsSearchOpen(true)}
                    />
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleTheme();
                        }}
                        className="hidden md:block p-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors focus:outline-none"
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
                className={`fixed top-0 left-0 h-screen w-[85%] max-w-sm bg-white dark:bg-[#07020f] z-[110] transform transition-transform duration-300 ease-in-out flex flex-col md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
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
                                {/* Dark mode toggle - mobile */}
                                <button
                                    className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex justify-between items-center w-full uppercase"
                                    onClick={toggleTheme}
                                >
                                    {isDark ? 'MODO CLARO' : 'MODO OSCURO'}
                                    {isDark ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-gray-400" />}
                                </button>
                                <button
                                    className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex justify-between items-center w-full uppercase"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        if (location.pathname !== '/') {
                                            navigate('/#nosotros');
                                        } else {
                                            const el = document.getElementById('nosotros');
                                            if (el) {
                                                if (window.lenis) {
                                                    window.lenis.scrollTo(el, { offset: -100, duration: 1.5 });
                                                } else {
                                                    const headerOffset = 100;
                                                    const elementPosition = el.getBoundingClientRect().top;
                                                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                                                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                                                }
                                            }
                                        }
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
                                        if (location.pathname !== '/') {
                                            navigate('/#editorial');
                                        } else {
                                            const el = document.getElementById('editorial');
                                            if (el) {
                                                if (window.lenis) {
                                                    window.lenis.scrollTo(el, { offset: -100, duration: 1.5 });
                                                } else {
                                                    const headerOffset = 100;
                                                    const elementPosition = el.getBoundingClientRect().top;
                                                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                                                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                                                }
                                            }
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
                            <span>+51 930 291 524</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                            <Mail className="w-4 h-4" />
                            <span>contacto@gegethebrand.com</span>
                        </div>
                    </div>

                    {/* Socials */}
                    <div className="px-6 py-6 flex gap-4">
                        <a href="#" className="w-10 h-10 bg-black dark:bg-[#110620] border border-transparent dark:border-[#1a0e30] rounded-full flex items-center justify-center text-white hover:bg-purple-600 transition-colors group">
                            <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </a>
                        <a href="#" className="w-10 h-10 bg-black dark:bg-[#110620] border border-transparent dark:border-[#1a0e30] rounded-full flex items-center justify-center text-white hover:bg-purple-600 transition-colors group">
                            <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </a>
                        <a href="#" className="w-10 h-10 bg-black dark:bg-[#110620] border border-transparent dark:border-[#1a0e30] rounded-full flex items-center justify-center text-white hover:bg-purple-600 transition-colors group">
                            <Smartphone className="w-5 h-5 group-hover:scale-110 transition-transform" />
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
