import React, { useState, useEffect } from 'react';
import ProductCard from '../Product/ProductCard';
import QuickShopModal from '../Product/QuickShopModal';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

const ProductGrid = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const urlCategory = searchParams.get('category');

    // Initialize filter from URL or default to 'All'
    const [activeFilter, setActiveFilter] = useState(urlCategory || 'All');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState(null);
    const [quickShopProduct, setQuickShopProduct] = useState(null);

    const fetchSettings = async () => {
        try {
            const res = await fetch('http://localhost:8080/site-settings');
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
            }
        } catch (err) {
            console.error("Error fetching site settings:", err);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch('http://localhost:8080/products');
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (err) {
            console.error("Error al obtener productos:", err);
        } finally {
            setLoading(false);
        }
    };

    const [categories, setCategories] = useState(['All']);

    const fetchCategories = async () => {
        try {
            const res = await fetch('http://localhost:8080/categories');
            if (res.ok) {
                const data = await res.json();
                const fetchedCategories = data.map(c => c.name);
                setCategories(['All', ...fetchedCategories]);
            }
        } catch (err) {
            console.error("Error al obtener categorías:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchSettings();
    }, []);

    // Sync activeFilter when URL search parameter changes externally
    useEffect(() => {
        if (urlCategory) {
            setActiveFilter(urlCategory);
            // Optionally clear the query param after picking it up if we don't want it stuck in the URL, 
            // but keeping it is fine for shareability. Let's just sync it.
        } else {
            // If urlCategory is removed, we might optionally want to reset to 'All', 
            // but if user navigates back and forth it's fine.
            // We'll trust the urlCategory.
            if (searchParams.has('category') === false && activeFilter !== 'All') {
                // do nothing, let local state persist if they cleared URL manually
            }
        }
    }, [urlCategory]);

    const handleCategorySelect = (category) => {
        setActiveFilter(category);
        setSearchParams({ category });
    };

    const filteredProducts = activeFilter === 'All'
        ? products
        : products.filter(p => p.category?.toLowerCase() === activeFilter.toLowerCase());

    return (
        <section id="shop" className="py-24 max-w-7xl mx-auto overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 px-6 md:px-12">
                <div>
                    <h2 className="text-3xl md:text-5xl font-header font-bold uppercase tracking-tighter mb-4">
                        {settings?.shop_title || 'Tienda'}
                    </h2>
                    <p className="text-gray-500 max-w-md text-sm leading-relaxed">
                        {settings?.shop_description || 'Descubre nuestra última colección. Piezas diseñadas con atención al detalle y materiales de primera calidad.'}
                    </p>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-2 w-full md:w-auto overflow-visible no-scrollbar">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => handleCategorySelect(category)}
                            className={`text-xs font-bold uppercase tracking-widest pb-1 border-b-2 whitespace-nowrap transition-all duration-300 ${activeFilter === category
                                ? 'border-black text-black'
                                : 'border-transparent text-gray-400 hover:text-black'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="py-20 text-center text-gray-500 uppercase font-bold tracking-widest text-sm">
                    Cargando colección...
                </div>
            ) : (
                <motion.div
                    layout
                    className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-6 md:px-12 pb-16 no-scrollbar"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map(product => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                                key={product.id}
                                className="w-[80vw] sm:w-[45vw] md:w-[320px] lg:w-[280px] xl:w-[300px] flex-shrink-0 snap-center md:snap-start"
                            >
                                <ProductCard product={product} onQuickShop={() => setQuickShopProduct(product)} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            <QuickShopModal
                isOpen={!!quickShopProduct}
                onClose={() => setQuickShopProduct(null)}
                product={quickShopProduct}
            />
        </section>
    );
};

export default ProductGrid;
