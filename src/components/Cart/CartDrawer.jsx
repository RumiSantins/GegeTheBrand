import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const CartDrawer = () => {
    const { isCartOpen, toggleCart, cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

    const handleCheckout = () => {
        const phoneNumber = "51930291524";
        const orderId = Math.floor(1000 + Math.random() * 9000);
        const now = new Date();
        const timestamp = `${now.toLocaleDateString('es-PE')} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

        let message = `🛍️ *GEGE THE BRAND - RESUMEN DE PEDIDO*\n`;
        message += `Ref: #${orderId} | ${timestamp}\n`;
        message += `───────────────────────\n\n`;

        message += `📍 *ENVÍO*\n`;
        message += `• Dirección: [Completar]\n`;
        message += `• Distrito: [Completar]\n\n`;

        message += `✨ *PRODUCTOS*\n`;
        cartItems.forEach(item => {
            message += `• *${item.name.toUpperCase()}*\n`;
            message += `  Talla: ${item.size}\n`;
            message += `  Cantidad: ${item.quantity}\n`;
            message += `  Precio: S/ ${item.price.toFixed(2)} c/u\n\n`;
        });

        message += `───────────────────────\n`;
        message += `💳 *METODO DE PAGO:* [Yape / Plin / Transferencia]\n`;
        message += `💰 *TOTAL PRODUCTOS: S/ ${cartTotal.toFixed(2)}*\n`;
        message += `🚚 *COSTO DE ENVÍO:* [A calcular]\n`;
        message += `───────────────────────\n\n`;
        message += `💖 ¡Hola! Me gustaría concretar esta compra. Quedo atento/a para el pago.`;

        const waUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        className="fixed inset-0 bg-black/40 z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
                        className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-[70] shadow-2xl flex flex-col will-change-transform"
                    >
                        {/* Header */}
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-header font-bold flex items-center">
                                <ShoppingBag className="w-5 h-5 mr-2" />
                                Tu Carrito
                            </h2>
                            <button
                                onClick={toggleCart}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                                    <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                                    <p>Tu carrito está vacío.</p>
                                    <button onClick={toggleCart} className="mt-4 text-black underline font-bold">
                                        Volver a la tienda
                                    </button>
                                </div>
                            ) : (
                                cartItems.map((item) => (
                                    <CartItem
                                        key={`${item.id}-${item.size}`}
                                        item={item}
                                        updateQuantity={updateQuantity}
                                        removeFromCart={removeFromCart}
                                    />
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className="p-6 border-t bg-gray-50">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="text-xl font-bold font-header">S/ {cartTotal.toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full btn-accent py-4 text-lg shadow-lg active:scale-95 transition-transform"
                                >
                                    PROCEDER AL PAGO
                                </button>
                                <p className="text-xs text-center text-gray-400 mt-4">
                                    Envío e impuestos calculados en el pago.
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// Extracted CartItem component for better performance and isolated state (like images)
const CartItem = ({ item, updateQuantity, removeFromCart }) => {
    // Determine initial image source safely
    const initialImage = item.image1 || (item.images && item.images.length > 0 ? item.images[0] : null);
    const [imgSrc, setImgSrc] = React.useState(initialImage);
    const fallbackImage = "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=800";

    return (
        <div className="flex space-x-4">
            <div className="w-20 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0 relative">
                <img
                    src={imgSrc || fallbackImage}
                    alt={item.name}
                    onError={() => setImgSrc(fallbackImage)}
                    className="w-full h-full object-cover absolute inset-0"
                />
            </div>
            <div className="flex-1">
                <h3 className="font-bold text-sm font-header">{item.name}</h3>
                <p className="text-gray-500 text-xs mt-1">Talle: {item.size}</p>
                <p className="text-sm font-bold mt-2">S/ {item.price.toFixed(2)}</p>
            </div>
            <div className="flex flex-col justify-between items-end">
                <button
                    onClick={() => removeFromCart(item.id, item.size)}
                    className="text-gray-400 hover:text-red-500 transition-colors mb-2"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center border rounded-md">
                    <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                        disabled={item.quantity <= 1}
                    >
                        <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-medium px-2 w-6 text-center">{item.quantity}</span>
                    <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <Plus className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartDrawer;
