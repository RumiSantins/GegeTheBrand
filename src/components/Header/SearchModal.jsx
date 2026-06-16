import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../api/config';

const SearchModal = ({ isOpen, onClose, categories = [] }) => {
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);

    // Fetch all products when modal opens to perform local filtering
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            const fetchProducts = async () => {
                setLoading(true);
                try {
                    const res = await fetch(`${API_BASE_URL}/products`);
                    if (res.ok) {
                        const data = await res.json();
                        // Pre-parse images to avoid JSON.parse during render loops
                        const optimizedData = data.map(product => {
                            let parsedImages = [];
                            try {
                                parsedImages = typeof product.images === 'string' ? JSON.parse(product.images) : (product.images || []);
                            } catch (e) { }
                            return { ...product, parsedImages };
                        });
                        setProducts(optimizedData);
                    }
                } catch (error) {
                    console.error("Error fetching products for search:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchProducts();

            // Focus input after a small delay for animation
            setTimeout(() => {
                if (inputRef.current) inputRef.current.focus();
            }, 100);

            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            if (window.lenis) window.lenis.stop();
        } else {
            // Restore body scroll
            document.body.style.overflow = 'unset';
            if (window.lenis) window.lenis.start();
        }

        return () => {
            document.body.style.overflow = 'unset';
            if (window.lenis) window.lenis.start();
        };
    }, [isOpen]);

    const resolveImageUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `${API_BASE_URL}${encodeURI(url)}`;
    };

    // Filter products based on search query (Memoized for performance)
    const filteredProducts = useMemo(() => {
        if (query.trim() === '') return [];
        const lowerQuery = query.toLowerCase();
        return products.filter(product =>
            product.name.toLowerCase().includes(lowerQuery) ||
            (product.description && product.description.toLowerCase().includes(lowerQuery))
        );
    }, [query, products]);

    // Handle closing when clicking on a link
    const handleResultClick = () => {
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Dark Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 z-[100]"
                    />

                    {/* Search Panel (Drops from Top) */}
                    <motion.div
                        initial={{ y: '-100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '-100%' }}
                        transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
                        className="fixed top-0 left-0 w-full bg-white dark:bg-[#07020f] z-[110] shadow-2xl h-auto max-h-[85vh] flex flex-col pt-safe-top"
                    >
                        {/* Search Input Area */}
                        <div className="container mx-auto px-6 py-6 border-b border-gray-100 dark:border-[#1a0e30] flex items-center relative gap-4">
                            <Search className="w-6 h-6 text-gray-400" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="¿Qué estás buscando?"
                                className="w-full text-xl md:text-3xl font-header outline-none border-none bg-transparent placeholder-gray-300 dark:placeholder-gray-500 uppercase tracking-widest text-black dark:text-white"
                            />
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-purple-900/20 rounded-full transition-colors flex-shrink-0"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        {/* Results Area */}
                        <div className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-[#110620]/50">
                            {query.trim().length > 0 && (
                                <div className="container mx-auto px-6 py-8">
                                    <div className="flex justify-between items-end mb-6">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">
                                            Resultados
                                        </h3>
                                        <span className="text-xs text-gray-400 font-medium">
                                            {filteredProducts.length} encontrado(s)
                                        </span>
                                    </div>

                                    {loading ? (
                                        <div className="flex justify-center py-12">
                                            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    ) : filteredProducts.length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                            {filteredProducts.map((product) => {
                                                // Extract main image safely using pre-parsed images
                                                const mainImage = product.parsedImages && product.parsedImages.length > 0
                                                    ? resolveImageUrl(product.parsedImages[0])
                                                    : '';

                                                return (
                                                    <Link
                                                        key={product.id}
                                                        to={`/product/${product.id}`}
                                                        onClick={handleResultClick}
                                                        className="group flex flex-col rounded bg-white dark:bg-[#110620] p-3 shadow-sm hover:shadow-md transition-shadow"
                                                    >
                                                        <div className="aspect-[3/4] bg-gray-100 dark:bg-[#1a0e30] rounded overflow-hidden mb-3 relative">
                                                            {mainImage ? (
                                                                <img
                                                                    src={mainImage}
                                                                    alt={product.name}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Sin foto</div>
                                                            )}
                                                        </div>
                                                        <span className="text-xs font-bold font-header uppercase tracking-wider line-clamp-2 leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors dark:text-gray-200">
                                                            {product.name}
                                                        </span>
                                                        <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">
                                                            S/ {product.price.toFixed(2)}
                                                        </span>
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-center py-16 flex flex-col items-center">
                                            <Search className="w-12 h-12 text-gray-200 mb-4" />
                                            <p className="text-base text-gray-500 font-header uppercase tracking-widest">No encontramos nada para "{query}"</p>
                                            <p className="text-sm text-gray-400 mt-2">Intenta revisar la ortografía o probar otros términos.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {!query.trim() && !loading && (
                                <div className="container mx-auto px-6 py-10 hidden md:block">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 font-header">
                                        Explorar Categorías
                                    </h3>
                                    {categories.length > 0 ? (
                                        <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                            {/* Hide scrollbar for webkit via inline styles or custom css class, assuming tailwind plugin or inline standard is enough here */}
                                            <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                                            <div className="flex gap-4 hide-scrollbar">
                                                {categories.map((cat, idx) => (
                                                    <Link
                                                        key={idx}
                                                        to={`/?category=${encodeURIComponent(cat.name)}#shop`}
                                                        onClick={() => {
                                                            onClose();
                                                            // Give React Router and DOM a moment to update before forced scroll
                                                            setTimeout(() => {
                                                                const shopSection = document.getElementById('shop');
                                                                if (shopSection) {
                                                                    const headerOffset = 100; // Height of the sticky header roughly
                                                                    const elementPosition = shopSection.getBoundingClientRect().top;
                                                                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                                                                    window.scrollTo({
                                                                        top: offsetPosition,
                                                                        behavior: 'smooth'
                                                                    });
                                                                }
                                                            }, 150);
                                                        }}
                                                        className="flex-shrink-0 w-40 md:w-48 group snap-start flex flex-col"
                                                    >
                                                        <div className="relative w-full aspect-[4/5] bg-gray-100 dark:bg-[#110620] overflow-hidden mb-3 rounded-sm shadow-sm transition-shadow duration-300 group-hover:shadow-md">
                                                            <img
                                                                src={resolveImageUrl(cat.image_url)}
                                                                alt={cat.name}
                                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                                                            />
                                                        </div>
                                                        <span className="text-gray-900 dark:text-gray-300 font-serif text-[11px] md:text-xs tracking-widest uppercase leading-snug px-1 text-center line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                                            {cat.name}
                                                        </span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-10">
                                            <p className="text-gray-400 font-header text-lg uppercase tracking-widest opacity-50">Comienza a escribir para ver resultados</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SearchModal;
