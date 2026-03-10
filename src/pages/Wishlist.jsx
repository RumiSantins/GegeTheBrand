import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, Heart, Share2, ShoppingBag } from 'lucide-react';

const Wishlist = () => {
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    const handleShare = () => {
        if (wishlistItems.length === 0) {
            alert("Tu lista de deseos está vacía.");
            return;
        }

        const itemsText = wishlistItems.map(item => 
            `- ${item.name} (${item.selectedSize}, ${item.selectedColor}) - S/${item.price}`
        ).join('\n');

        const message = `¡Mira mi lista de deseos en Gege The Brand!\n\n${itemsText}\n\nVisita la tienda: ${window.location.origin}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="pt-32 md:pt-40 pb-24 bg-white min-h-screen">
            <div className="max-w-5xl mx-auto px-6">
                <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-6">
                    <h1 className="text-3xl md:text-4xl font-header font-bold uppercase tracking-tight flex items-center gap-3">
                        <Heart className="w-8 h-8 md:w-10 md:h-10 text-red-500 fill-current" />
                        Mi Wishlist
                    </h1>
                    
                    {wishlistItems.length > 0 && (
                        <button 
                            onClick={handleShare}
                            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 hover:bg-green-600 transition-colors uppercase text-xs font-bold tracking-widest"
                        >
                            <Share2 className="w-4 h-4" />
                            Compartir
                        </button>
                    )}
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 flex flex-col items-center">
                        <Heart className="w-16 h-16 text-gray-300 mb-4" />
                        <h2 className="text-xl font-medium text-gray-800 mb-2">Tu lista de deseos está vacía</h2>
                        <p className="text-gray-500 mb-8">¡Explora la tienda y guarda tus productos favoritos!</p>
                        <Link to="/" className="bg-black text-white px-8 py-3 uppercase text-sm font-bold tracking-widest hover:bg-purple-600 transition-colors">
                            Ir a la Tienda
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {wishlistItems.map((item, idx) => (
                            <div key={`${item.id}-${idx}`} className="group flex flex-col bg-white border border-gray-100 relative">
                                <Link to={`/product/${item.id}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-100">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">Sin imagen</div>
                                    )}
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>

                                <button 
                                    onClick={() => removeFromWishlist(item.id, item.selectedSize, item.selectedColor)}
                                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm hover:text-red-500 hover:shadow-md transition-all z-10"
                                    title="Eliminar de Wishlist"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>

                                <div className="p-5 flex flex-col flex-grow text-center">
                                    <h3 className="text-sm font-semibold mb-2 uppercase tracking-wide leading-tight group-hover:text-purple-600 transition-colors">
                                        <Link to={`/product/${item.id}`}>{item.name}</Link>
                                    </h3>
                                    <p className="text-sm text-gray-900 font-bold mb-3 tracking-widest">S/ {item.price.toFixed(2)}</p>
                                    
                                    <div className="flex justify-center gap-4 text-xs text-gray-600 uppercase tracking-widest mb-6">
                                        <span>Talla: <strong>{item.selectedSize}</strong></span>
                                        <span>|</span>
                                        <span>Color: <strong>{item.selectedColor}</strong></span>
                                    </div>

                                    <button 
                                        onClick={() => addToCart({...item, quantity: 1})}
                                        className="mt-auto flex items-center justify-center gap-2 border border-black bg-white text-black py-2.5 hover:bg-black hover:text-white transition-colors w-full uppercase text-xs font-bold tracking-widest"
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
