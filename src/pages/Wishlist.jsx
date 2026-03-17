import React, { useEffect, useState } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Heart, Share2, ShoppingBag, Check, Plus, Minus } from 'lucide-react';

const Wishlist = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const { wishlistItems, removeFromWishlist, updateWishlistQuantity } = useWishlist();
    const { addToCart, cartItems } = useCart();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        if (wishlistItems.length === 0) {
            alert("Tu lista de deseos está vacía.");
            return;
        }

        const itemsData = wishlistItems.map(item => ({
            id: item.id,
            size: item.selectedSize,
            color: item.selectedColor,
            quantity: item.quantity || 1,
        }));
        const encoded = btoa(JSON.stringify(itemsData));
        const shareUrl = `${window.location.origin}/wishlist/shared?items=${encoded}`;

        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch (err) {
            const textArea = document.createElement('textarea');
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    return (
        <div className="pt-48 md:pt-60 pb-24 bg-white dark:bg-black min-h-screen transition-colors duration-500">
            <div className="max-w-5xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-gray-100 dark:border-gray-800 pb-6">
                    <h1 className="text-3xl md:text-4xl font-header font-bold uppercase tracking-tight flex items-center gap-3">
                        <Heart className="w-8 h-8 md:w-10 md:h-10 text-red-500 fill-current" />
                        Mi Wishlist
                    </h1>
                    
                    {wishlistItems.length > 0 && (
                        <div className="flex items-center gap-3 flex-wrap">
                            <button 
                                onClick={() => {
                                    const newItems = wishlistItems.filter(item =>
                                        !cartItems.some(c => c.id === item.id && c.selectedSize === item.selectedSize && c.selectedColor === item.selectedColor)
                                    );
                                    newItems.forEach(item => addToCart({...item, quantity: item.quantity || 1}));
                                }}
                                className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 hover:bg-purple-600 dark:hover:bg-purple-500 hover:text-white transition-colors uppercase text-xs font-bold tracking-widest"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Añadir todo al carrito
                            </button>
                            <button 
                                onClick={handleShare}
                                className={`flex items-center gap-2 px-4 py-2 transition-all duration-300 uppercase text-xs font-bold tracking-widest ${
                                    copied
                                        ? 'bg-black text-white'
                                        : 'bg-green-500 text-white hover:bg-green-600'
                                }`}
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                                {copied ? 'Link copiado!' : 'Compartir'}
                            </button>
                        </div>
                    )}
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 dark:bg-[#07020f] border border-transparent dark:border-[#1a0e30] flex flex-col items-center transition-colors">
                        <Heart className="w-16 h-16 text-gray-300 mb-4" />
                        <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">Tu lista de deseos está vacía</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">¡Explora la tienda y guarda tus productos favoritos!</p>
                        <button 
                            onClick={() => navigate('/#shop')}
                            className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 uppercase text-sm font-bold tracking-widest hover:bg-purple-600 dark:hover:bg-purple-500 hover:text-white transition-colors"
                        >
                            Ir a la Tienda
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {wishlistItems.map((item, idx) => (
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
                                    onClick={() => removeFromWishlist(item.id, item.selectedSize, item.selectedColor)}
                                    className="absolute top-3 right-3 bg-white dark:bg-black p-2 rounded-full shadow-sm hover:text-red-500 dark:hover:text-red-400 hover:shadow-md transition-all z-10 border border-transparent dark:border-[#1a0e30]"
                                    title="Eliminar de Wishlist"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>

                                <div className="p-5 flex flex-col flex-grow text-center">
                                    <h3 className="text-sm font-semibold mb-2 uppercase tracking-wide leading-tight group-hover:text-purple-600 transition-colors">
                                        <Link to={`/product/${item.id}`}>{item.name}</Link>
                                    </h3>
                                    <p className="text-sm text-gray-900 dark:text-gray-100 font-bold mb-3 tracking-widest">S/ {item.price.toFixed(2)}</p>
                                    
                                    <div className="flex justify-center gap-4 text-xs text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-4">
                                        <span>Talla: <strong>{item.selectedSize}</strong></span>
                                        <span>|</span>
                                        <span>Color: <strong>{item.selectedColor}</strong></span>
                                    </div>

                                    {/* Quantity selector */}
                                    <div className="flex items-center justify-center gap-3 mb-4">
                                        <span className="text-xs text-gray-500 uppercase tracking-widest">Cantidad:</span>
                                        <div className="flex items-center border border-gray-300 rounded-full">
                                            <button 
                                                onClick={() => updateWishlistQuantity(item.id, item.selectedSize, item.selectedColor, Math.max(1, (item.quantity || 1) - 1))}
                                                className="px-2 py-1 text-gray-500 hover:text-black dark:hover:text-white transition"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="text-sm font-bold w-6 text-center">{item.quantity || 1}</span>
                                            <button 
                                                onClick={() => updateWishlistQuantity(item.id, item.selectedSize, item.selectedColor, (item.quantity || 1) + 1)}
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
                )}
            </div>
        </div>
    );
};

export default Wishlist;
