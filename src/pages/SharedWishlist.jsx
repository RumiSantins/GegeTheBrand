import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { API_BASE_URL } from '../api/config';

const SharedWishlist = () => {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart, cartItems } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const encoded = searchParams.get('items');
        if (!encoded) {
            setLoading(false);
            return;
        }

        try {
            const decoded = JSON.parse(atob(encoded));

            fetch(`${API_BASE_URL}/products`)
                .then(res => res.json())
                .then(allProducts => {
                    const matched = decoded.map(item => {
                        const product = allProducts.find(p => p.id === item.id);
                        if (!product) return null;

                        let parsedImages = [];
                        try { parsedImages = JSON.parse(product.images || '[]'); } catch (e) { }
                        const imgs = parsedImages.map(url => url.startsWith('http') ? url : `${API_BASE_URL}${url}`);

                        return {
                            ...product,
                            image: imgs[0] || '',
                            selectedSize: item.size,
                            selectedColor: item.color,
                            quantity: item.quantity || 1,
                        };
                    }).filter(Boolean);

                    setProducts(matched);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        } catch (e) {
            console.error('Error decoding shared wishlist:', e);
            setLoading(false);
        }
    }, [searchParams]);

    const updateQuantity = (id, size, color, newQty) => {
        setProducts(prev =>
            prev.map(p =>
                p.id === id && p.selectedSize === size && p.selectedColor === color
                    ? { ...p, quantity: newQty }
                    : p
            )
        );
    };

    const removeProduct = (id, size, color) => {
        setProducts(prev =>
            prev.filter(p => !(p.id === id && p.selectedSize === size && p.selectedColor === color))
        );
    };

    if (loading) {
        return (
            <div className="pt-48 md:pt-60 pb-24 bg-white dark:bg-black min-h-screen flex items-center justify-center transition-colors duration-500">
                <p className="text-gray-500 uppercase tracking-widest text-sm font-bold animate-pulse">Cargando wishlist...</p>
            </div>
        );
    }

    return (
        <div className="pt-48 md:pt-60 pb-24 bg-white dark:bg-black min-h-screen transition-colors duration-500">
            <div className="max-w-5xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-gray-100 dark:border-gray-800 pb-6">
                    <h1 className="text-3xl md:text-4xl font-header font-bold uppercase tracking-tight flex items-center gap-3">
                        <Heart className="w-8 h-8 md:w-10 md:h-10 text-red-500 fill-current" />
                        Wishlist Compartida
                    </h1>

                    {products.length > 0 && (
                        <button 
                            onClick={() => {
                                const newItems = products.filter(item =>
                                    !cartItems.some(c => c.id === item.id && c.selectedSize === item.selectedSize && c.selectedColor === item.selectedColor)
                                );
                                newItems.forEach(item => addToCart({...item, quantity: item.quantity || 1}));
                            }}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-3 sm:py-2 hover:bg-purple-600 dark:hover:bg-purple-500 hover:text-white transition-colors uppercase text-xs font-bold tracking-widest"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Añadir todo al carrito
                        </button>
                    )}
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 dark:bg-[#07020f] border border-transparent dark:border-[#1a0e30] flex flex-col items-center transition-colors">
                        <Heart className="w-16 h-16 text-gray-300 mb-4" />
                        <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">No se encontraron productos</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">El enlace puede haber expirado o los productos ya no están disponibles.</p>
                        <button 
                            onClick={() => navigate('/#shop')}
                            className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 uppercase text-sm font-bold tracking-widest hover:bg-purple-600 dark:hover:bg-purple-500 hover:text-white transition-colors"
                        >
                            Ir a la Tienda
                        </button>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-500 text-sm mb-8">
                            Alguien compartió estos {products.length} producto{products.length !== 1 ? 's' : ''} contigo ✨
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((item, idx) => (
                                <div key={`${item.id}-${idx}`} className="group flex flex-col bg-white dark:bg-[#07020f] border border-gray-100 dark:border-[#1a0e30] relative transition-colors">
                                    <Link to={`/product/${item.id}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-black">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">Sin imagen</div>
                                        )}
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>

                                    <button 
                                        onClick={() => removeProduct(item.id, item.selectedSize, item.selectedColor)}
                                        className="absolute top-3 right-3 bg-white dark:bg-black p-2 rounded-full shadow-sm hover:text-red-500 dark:hover:text-red-400 hover:shadow-md transition-all z-10 border border-transparent dark:border-[#1a0e30]"
                                        title="Quitar"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    <div className="p-5 flex flex-col flex-grow text-center">
                                        <h3 className="text-sm font-semibold mb-2 uppercase tracking-wide leading-tight group-hover:text-purple-600 transition-colors">
                                            <Link to={`/product/${item.id}`}>{item.name}</Link>
                                        </h3>
                                        <p className="text-sm text-gray-900 dark:text-gray-100 font-bold mb-3 tracking-widest">S/ {item.price.toFixed(2)}</p>

                                        <div className="flex justify-center gap-4 text-xs text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-4">
                                            {item.selectedSize && <span>Talla: <strong>{item.selectedSize}</strong></span>}
                                            {item.selectedSize && item.selectedColor && <span>|</span>}
                                            {item.selectedColor && <span>Color: <strong>{item.selectedColor}</strong></span>}
                                        </div>

                                        {/* Quantity selector */}
                                        <div className="flex items-center justify-center gap-3 mb-4">
                                            <span className="text-xs text-gray-500 uppercase tracking-widest">Cantidad:</span>
                                            <div className="flex items-center border border-gray-300 rounded-full">
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, Math.max(1, (item.quantity || 1) - 1))}
                                                    className="px-2 py-1 text-gray-500 hover:text-black dark:hover:text-white transition"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="text-sm font-bold w-6 text-center">{item.quantity || 1}</span>
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, (item.quantity || 1) + 1)}
                                                    className="px-2 py-1 text-gray-500 hover:text-black dark:hover:text-white transition"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => addToCart({...item, quantity: item.quantity || 1})}
                                            className="mt-auto flex items-center justify-center gap-2 border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white py-2.5 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors w-full uppercase text-xs font-bold tracking-widest"
                                        >
                                            <ShoppingBag className="w-4 h-4" />
                                            Al Carrito
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SharedWishlist;
