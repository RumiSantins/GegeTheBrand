import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/Product/ProductCard';
import QuickShopModal from '../components/Product/QuickShopModal';
import { API_BASE_URL } from '../api/config';

const Sale = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quickShopProduct, setQuickShopProduct] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/products`);
                if (res.ok) {
                    const data = await res.json();
                    // Filter only products on sale
                    setProducts(data.filter(p => p.is_offer));
                }
            } catch (err) {
                console.error("Error al obtener productos:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const productsByCategory = products.reduce((acc, product) => {
        const category = product.category || 'Otros';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(product);
        return acc;
    }, {});

    return (
        <section className="py-24 max-w-full w-full overflow-hidden min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 text-center mt-12 px-6 md:px-12">
                    <h1 className="text-4xl md:text-5xl font-header font-black uppercase tracking-tighter mb-4 text-red-500">
                        SALE
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">
                        Descubre nuestras piezas exclusivas con descuentos especiales por tiempo limitado.
                    </p>
                </div>

                {loading ? (
                    <div className="py-20 text-center text-gray-500 uppercase font-bold tracking-widest text-sm">
                        Cargando ofertas...
                    </div>
                ) : products.length === 0 ? (
                    <div className="py-20 text-center text-gray-500 uppercase font-bold tracking-widest text-sm">
                        Por el momento no hay productos en oferta.
                    </div>
                ) : (
                    <div className="flex flex-col gap-16">
                        {Object.entries(productsByCategory).map(([category, catProducts]) => (
                            <div key={category} className="w-full">
                                <h2 className="text-2xl md:text-3xl font-header font-bold uppercase tracking-tighter mb-8 px-6 md:px-12 text-left">
                                    {category}
                                </h2>
                                <motion.div
                                    layout
                                    className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-6 md:px-12 pb-8 no-scrollbar"
                                >
                                    <AnimatePresence mode="popLayout">
                                        {catProducts.map((product) => (
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
                            </div>
                        ))}
                    </div>
                )}

                <QuickShopModal
                    isOpen={!!quickShopProduct}
                    onClose={() => setQuickShopProduct(null)}
                    product={quickShopProduct}
                />
            </div>
        </section>
    );
};

export default Sale;
