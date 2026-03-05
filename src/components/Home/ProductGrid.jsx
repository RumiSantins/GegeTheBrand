import React, { useState, useEffect } from 'react';
import ProductCard from '../Product/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

const ProductGrid = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        fetchProducts();
    }, []);

    const categories = ['All', 'Tops', 'Pantalones', 'Abrigos', 'Calzado', 'Vestidos'];

    const filteredProducts = activeFilter === 'All'
        ? products
        : products.filter(p => p.category?.toLowerCase() === activeFilter.toLowerCase());

    return (
        <section id="shop" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                <div>
                    <h2 className="text-3xl md:text-5xl font-header font-bold uppercase tracking-tighter mb-4">
                        Novedades
                    </h2>
                    <p className="text-gray-500 max-w-md text-sm leading-relaxed">
                        Descubre nuestra última colección. Piezas diseñadas con atención al detalle y materiales de primera calidad.
                    </p>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-2 w-full md:w-auto overflow-visible no-scrollbar">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveFilter(category)}
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
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16"
                >
                    <AnimatePresence>
                        {filteredProducts.map(product => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                                key={product.id}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </section>
    );
};

export default ProductGrid;
