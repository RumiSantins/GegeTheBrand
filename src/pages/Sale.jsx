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

    return (
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
            <div className="mb-12 text-center mt-12">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                    <AnimatePresence mode="popLayout">
                        {products.map((product, index) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                key={product.id}
                                className="h-full"
                            >
                                <ProductCard product={product} onQuickShop={() => setQuickShopProduct(product)} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <QuickShopModal
                isOpen={!!quickShopProduct}
                onClose={() => setQuickShopProduct(null)}
                product={quickShopProduct}
            />
        </section>
    );
};

export default Sale;
