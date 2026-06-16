import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Heart } from 'lucide-react';
import { CartContext } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../api/config';

const QuickShopModal = ({ isOpen, onClose, product }) => {
    const { addToCart } = useContext(CartContext);
    const { addToWishlist, removeFromWishlist, wishlistItems } = useWishlist();
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // Reset states when product changes or modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedSize(null);
            setSelectedColor(null);
            setQuantity(1);
        }
    }, [isOpen, product]);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            if (window.lenis) window.lenis.stop();
        } else {
            document.body.style.overflow = 'unset';
            if (window.lenis) window.lenis.start();
        }
        return () => {
            document.body.style.overflow = 'unset';
            if (window.lenis) window.lenis.start();
        };
    }, [isOpen]);

    if (!product) return null;

    let parsedImages = [];
    try {
        parsedImages = JSON.parse(product.images || '[]');
    } catch (e) { }

    const imgs = parsedImages.map(url => url.startsWith('http') ? url : `${API_BASE_URL}${encodeURI(url)}`);
    
    const variants = product.variants || [];
    
    // Dynamic Main Image based on color
    const selectedVariantForColor = variants.find(v => v.color === selectedColor && v.image_url);
    const variantImgUrl = selectedVariantForColor ? 
        (selectedVariantForColor.image_url.startsWith('http') ? selectedVariantForColor.image_url : `${API_BASE_URL}${encodeURI(selectedVariantForColor.image_url)}`) 
        : null;

    const mainImage = variantImgUrl || (imgs.length > 0 ? imgs[0] : '');
    const sizesArray = [...new Set(variants.map(v => v.size))];
    const colorsArray = [...new Set(variants.map(v => v.color))];

    const currentVariant = variants.find(v => v.size === selectedSize && v.color === selectedColor);
    const totalStock = variants.reduce((acc, curr) => acc + curr.stock, 0);

    const isAddToCartDisabled = totalStock === 0 || (selectedSize && selectedColor && !currentVariant) || (currentVariant && currentVariant.stock === 0);

    const handleAddToCart = () => {
        if (sizesArray.length > 0 && !selectedSize) {
            alert('Por favor selecciona una talla');
            return;
        }
        if (colorsArray.length > 0 && !selectedColor) {
            alert('Por favor selecciona un color');
            return;
        }

        const itemToAdd = {
            ...product,
            image: mainImage,
            selectedSize,
            selectedColor,
            variant_id: currentVariant ? currentVariant.id : null,
            quantity
        };

        addToCart(itemToAdd);
        onClose(); // Close modal after adding
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 py-12 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 10 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="bg-white dark:bg-[#07020f] text-black dark:text-white w-full max-w-3xl max-h-full overflow-y-auto shadow-2xl pointer-events-auto rounded-lg flex flex-col relative"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-[#07020f] z-10">
                                <h2 className="font-header font-bold text-lg">Tienda rápida</h2>
                                <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col md:flex-row p-6 gap-8">
                                {/* Left: Image & Info */}
                                <div className="w-full md:w-1/2 flex flex-col">
                                    <div className="aspect-[3/4] bg-gray-100 mb-4 rounded overflow-hidden relative">
                                        <AnimatePresence mode="wait">
                                            {mainImage ? (
                                                <motion.img 
                                                    key={mainImage}
                                                    initial={{ opacity: 0, scale: 1.05 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                                    src={mainImage} 
                                                    className="w-full h-full object-cover" 
                                                    alt={product.name} 
                                                />
                                            ) : (
                                                <motion.div 
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-sm"
                                                >
                                                    Sin imagen
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <h3 className="font-header font-bold text-xl uppercase tracking-tight mb-1 dark:text-white">{product.name}</h3>
                                    
                                    <div className="flex items-center gap-3 mb-6">
                                        {product.is_offer ? (
                                            <>
                                                <p className="text-xl text-purple-600 font-bold tracking-tight">
                                                    S/ {product.offer_price.toFixed(2)}
                                                </p>
                                                <p className="text-sm text-gray-400 line-through tracking-widest">
                                                    S/ {product.price.toFixed(2)}
                                                </p>
                                                <span className="text-purple-600 font-bold text-[10px] uppercase tracking-wider">
                                                    {Math.round(((product.price - product.offer_price) / product.price) * 100)}% DCTO.
                                                </span>
                                            </>
                                        ) : (
                                            <p className="text-lg text-gray-900 dark:text-gray-100 font-bold tracking-widest">
                                                S/ {product.price.toFixed(2)}
                                            </p>
                                        )}
                                    </div>

                                    <Link to={`/product/${product.id}`} className="text-sm border-b border-black dark:border-white self-start pb-1 uppercase font-bold tracking-widest hover:text-gray-600 dark:hover:text-gray-400 transition">
                                        Ver detalles del producto
                                    </Link>
                                </div>

                                {/* Right: Variants & Action */}
                                <div className="w-full md:w-1/2 flex flex-col relative">

                                    {/* Colors */}
                                    {colorsArray.length > 0 && (
                                        <div className="mb-6">
                                            <h4 className="text-xs font-bold uppercase tracking-widest mb-3">
                                                Color <span className="text-gray-500 font-normal">{selectedColor || ''}</span>
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {colorsArray.map(color => {
                                                    const colorVariant = variants.find(v => v.color === color);
                                                    const hasStockForColor = variants.some(v => v.color === color && v.stock > 0);
                                                    const renderColorHex = colorVariant?.color_hex || color; // fallback to color text

                                                    return (
                                                        <button
                                                            key={color}
                                                            onClick={() => setSelectedColor(color)}
                                                            disabled={!hasStockForColor}
                                                            className={`w-10 h-10 rounded-full border-2 transition-all ${!hasStockForColor
                                                                ? 'border-gray-200 opacity-30 cursor-not-allowed'
                                                                : selectedColor === color
                                                                    ? 'border-black'
                                                                    : 'border-transparent ring-1 ring-gray-300 hover:border-gray-400'
                                                                }`}
                                                            style={{ backgroundColor: renderColorHex }}
                                                            title={color}
                                                        >
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            {/* Render color names as buttons too just in case CSS background fails for weird names */}
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {colorsArray.map(color => {
                                                    const hasStockForColor = variants.some(v => v.color === color && v.stock > 0);
                                                    return (
                                                        <button
                                                            key={color}
                                                            onClick={() => setSelectedColor(color)}
                                                            disabled={!hasStockForColor}
                                                            className={`px-3 py-1 border text-[10px] font-bold uppercase tracking-widest transition-all ${!hasStockForColor
                                                                ? 'border-gray-200 text-gray-300 cursor-not-allowed hidden'
                                                                : selectedColor === color
                                                                    ? 'border-black bg-black text-white'
                                                                    : 'border-gray-300 text-gray-600 hover:border-black'
                                                                }`}
                                                        >
                                                            {color}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Sizes */}
                                    {sizesArray.length > 0 && (
                                        <div className="mb-8">
                                            <h4 className="text-xs font-bold uppercase tracking-widest mb-3">
                                                Size <span className="text-gray-500 font-normal">{selectedSize || ''}</span>
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {sizesArray.map(size => {
                                                    let hasStockForSize = false;
                                                    if (selectedColor) {
                                                        hasStockForSize = variants.some(v => v.size === size && v.color === selectedColor && v.stock > 0);
                                                    } else {
                                                        hasStockForSize = variants.some(v => v.size === size && v.stock > 0);
                                                    }

                                                    return (
                                                        <button
                                                            key={size}
                                                            onClick={() => setSelectedSize(size)}
                                                            disabled={!hasStockForSize}
                                                            className={`w-12 h-12 flex items-center justify-center border text-xs font-bold transition-all rounded-full ${!hasStockForSize
                                                                ? 'border-gray-200 dark:border-gray-800 text-gray-300 dark:text-gray-700 cursor-not-allowed line-through'
                                                                : selectedSize === size
                                                                    ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black'
                                                                    : 'border-gray-300 dark:border-gray-500 text-gray-600 dark:text-gray-200 hover:border-black dark:hover:border-white'
                                                                }`}
                                                        >
                                                            {size}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions bottom fixed inside right col */}
                                    <div className="mt-auto pt-6 flex flex-col gap-4 border-t border-gray-100 dark:border-gray-800">
                                        <div className="flex flex-row gap-3">
                                            <div className="flex items-center justify-between border border-gray-300 dark:border-gray-700 rounded-full px-4 py-2 w-1/3">
                                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-500 hover:text-black dark:hover:text-white transition">
                                                    <Minus size={16} />
                                                </button>
                                                <span className="text-sm font-bold w-8 text-center dark:text-white">{quantity}</span>
                                                <button onClick={() => setQuantity(quantity + 1)} className="text-gray-500 hover:text-black dark:hover:text-white transition">
                                                    <Plus size={16} />
                                                </button>
                                            </div>

                                            <button
                                                onClick={handleAddToCart}
                                                disabled={isAddToCartDisabled}
                                                className={`flex-1 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-colors ${isAddToCartDisabled
                                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                    : 'bg-black text-white hover:bg-gray-800 shadow-lg'
                                                    }`}
                                            >
                                                {totalStock === 0 ? 'Agotado' : isAddToCartDisabled ? 'Seleccionar variante' : 'Añadir al carrito'}
                                            </button>
                                        </div>

                                        {(() => {
                                            const isInWishlist = selectedSize && selectedColor && wishlistItems.some(
                                                w => w.id === product.id && w.selectedSize === selectedSize && w.selectedColor === selectedColor
                                            );
                                            return (
                                                <button
                                                    onClick={() => {
                                                        if (!selectedSize && sizesArray.length > 0) { alert('Selecciona una talla primero'); return; }
                                                        if (!selectedColor && colorsArray.length > 0) { alert('Selecciona un color primero'); return; }
                                                        if (isInWishlist) {
                                                            removeFromWishlist(product.id, selectedSize, selectedColor);
                                                        } else {
                                                            addToWishlist({
                                                                ...product,
                                                                image: mainImage,
                                                                selectedSize,
                                                                selectedColor,
                                                                quantity,
                                                            });
                                                        }
                                                    }}
                                                    className={`w-full py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 border ${
                                                        isInWishlist
                                                            ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50'
                                                            : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white'
                                                    }`}
                                                >
                                                    <Heart size={16} className={isInWishlist ? 'fill-current' : ''} />
                                                    {isInWishlist ? 'En tu Wishlist' : 'Añadir a Wishlist'}
                                                </button>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default QuickShopModal;
