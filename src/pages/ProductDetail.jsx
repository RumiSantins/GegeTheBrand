import React, { useState, useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { motion } from 'framer-motion';
import { ChevronRight, Heart, Share2, Ruler } from 'lucide-react';
import { API_BASE_URL } from '../api/config';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useContext(CartContext);
    const { toggleWishlist, isInWishlist } = useWishlist();

    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const [relatedProduct, setRelatedProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/products`);
                if (res.ok) {
                    const data = await res.json();
                    const foundProduct = data.find(p => p.id === id || p.id.toString() === id);
                    if (foundProduct) {
                        setProduct(foundProduct);
                    }
                }
            } catch (err) {
                console.error("Error al obtener detalle del producto:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        const fetchRelatedProduct = async () => {
            if (product && product.related_product_id) {
                try {
                    const res = await fetch(`${API_BASE_URL}/products`);
                    if (res.ok) {
                        const allProducts = await res.json();
                        const found = allProducts.find(p => p.id === product.related_product_id);
                        if (found) {
                            setRelatedProduct(found);
                        }
                    }
                } catch (err) {
                    console.error("Error fetching related product:", err);
                }
            } else {
                setRelatedProduct(null);
            }
        };
        fetchRelatedProduct();
    }, [product]);

    useEffect(() => {
        if (window.lenis) {
            window.lenis.scrollTo(0, { immediate: true });
        } else {
            window.scrollTo(0, 0);
        }
    }, [id]);

    if (loading) {
        return <div className="min-h-screen pt-32 pb-24 px-6 text-center">Cargando...</div>;
    }

    if (!product) {
        return (
            <div className="min-h-screen pt-32 pb-24 px-6 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold uppercase mb-4">Producto no encontrado</h2>
                <Link to="/#shop" className="border-b border-black dark:border-white pb-1 uppercase text-sm font-bold tracking-widest">
                    Volver a la tienda
                </Link>
            </div>
        );
    }

    let parsedImages = [];
    try {
        parsedImages = JSON.parse(product.images || '[]');
    } catch (e) { }

    const imgs = parsedImages.map(url => url.startsWith('http') ? url : `${API_BASE_URL}${url}`);

    // Extract unique sizes and colors from variants
    const variants = product.variants || [];
    const sizesArray = [...new Set(variants.map(v => v.size))];
    const colorsArray = [...new Set(variants.map(v => v.color))];

    // Find the currently selected variant
    const currentVariant = variants.find(v => v.size === selectedSize && v.color === selectedColor);

    // Total product stock for a quick check if completely sold out
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
            image: imgs[0],
            selectedSize,
            selectedColor,
            variant_id: currentVariant ? currentVariant.id : null,
            quantity,
            price: product.price, // original price
            original_price: product.price,
            offer_price: product.offer_price,
            offer_min_qty: product.offer_min_qty,
            is_offer: product.is_offer
        };

        addToCart(itemToAdd);
    };

    const handleWishlistToggle = () => {
        if (sizesArray.length > 0 && !selectedSize) {
            alert('Por favor selecciona una talla para guardar en tu Wishlist');
            return;
        }
        if (colorsArray.length > 0 && !selectedColor) {
            alert('Por favor selecciona un color para guardar en tu Wishlist');
            return;
        }

        const itemToSave = {
            ...product,
            image: imgs[0],
            selectedSize,
            selectedColor,
            variant_id: currentVariant ? currentVariant.id : null,
        };

        toggleWishlist(itemToSave);
    };

    const isSavedInWishlist = isInWishlist(product.id, selectedSize, selectedColor);

    return (
        <div className="pt-40 md:pt-56 pb-24 bg-white dark:bg-[#07020f] min-h-screen transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-12">
                    <Link to="/" className="hover:text-black dark:hover:text-white">Home</Link>
                    <ChevronRight size={12} />
                    <Link to="/#shop" className="hover:text-black dark:hover:text-white">Shop</Link>
                    <ChevronRight size={12} />
                    <span className="text-black dark:text-white">{product.name}</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
                    {/* Images Column */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-4">
                        {imgs.length > 0 ? imgs.map((img, idx) => (
                            <div key={idx} className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 relative">
                                <img
                                    src={img}
                                    alt={`${product.name} view ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                {idx === 0 && relatedProduct && (
                                    <div className="absolute bottom-12 left-0 z-20 group/stl">
                                        <Link 
                                            to={`/product/${relatedProduct.id}`}
                                            className="flex items-center bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 p-2 pl-0 rounded-r-full shadow-2xl transition-all duration-500 hover:bg-white dark:hover:bg-[#1a1425] hover:pl-3 group-hover/stl:shadow-white/5"
                                        >
                                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 shadow-inner">
                                                <img 
                                                    src={(() => {
                                                        try {
                                                            const relImages = JSON.parse(relatedProduct.images || '[]');
                                                            const firstImg = relImages[0];
                                                            return firstImg.startsWith('http') ? firstImg : `${API_BASE_URL}${firstImg}`;
                                                        } catch(e) { return ''; }
                                                    })()} 
                                                    alt={relatedProduct.name}
                                                    className="w-full h-full object-cover group-hover/stl:scale-110 transition-transform duration-700"
                                                />
                                            </div>
                                            <div className="max-w-0 overflow-hidden group-hover/stl:max-w-xs transition-all duration-500 ease-in-out">
                                                <div className="px-4 whitespace-nowrap flex flex-col">
                                                    <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-0.5">Shop the Look</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[11px] font-bold uppercase tracking-tight text-black dark:text-white">{relatedProduct.name}</span>
                                                        <ChevronRight size={10} className="text-black dark:text-white" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )) : (
                            <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center">
                                Sin imagen
                            </div>
                        )}
                    </div>

                    {/* Details Column */}
                    <div className="w-full lg:w-1/2 flex flex-col">
                        <div className="sticky top-32">
                            <h1 className="text-3xl md:text-4xl font-header font-bold uppercase tracking-tight mb-2">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-3 mb-8">
                                {product.is_offer ? (
                                    <>
                                        <p className="text-2xl text-purple-600 font-bold tracking-tight">
                                            S/ {product.offer_price.toFixed(2)}
                                        </p>
                                        <p className="text-lg text-gray-400 line-through tracking-widest">
                                            S/ {product.price.toFixed(2)}
                                        </p>
                                        <div className="flex flex-col">
                                            <span className="bg-purple-600 text-white text-[10px] font-bold uppercase py-1 px-2 rounded-sm ml-2">
                                                Oferta
                                            </span>
                                            {product.offer_min_qty > 1 && (
                                                <span className="text-[10px] text-purple-500 font-bold uppercase mt-1 ml-2">
                                                    * Llevando {product.offer_min_qty} o más
                                                </span>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-xl text-gray-900 dark:text-gray-100 tracking-widest">
                                        S/ {product.price.toFixed(2)}
                                    </p>
                                )}
                            </div>

                            <div className="mb-8">
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Colors Section */}
                            {colorsArray.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-xs font-bold uppercase tracking-widest mb-3">
                                        Color: {selectedColor || 'Seleccionar'}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {colorsArray.map(color => {
                                            const colorVariant = variants.find(v => v.color === color);
                                            const hasStockForColor = variants.some(v => v.color === color && v.stock > 0);
                                            const renderColorHex = colorVariant?.color_hex || color; // fallback

                                            return (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(color)}
                                                    disabled={!hasStockForColor}
                                                    className={`w-10 h-10 rounded-full border-2 transition-all ${!hasStockForColor
                                                        ? 'border-gray-200 dark:border-gray-800 opacity-30 cursor-not-allowed'
                                                        : selectedColor === color
                                                            ? 'border-black dark:border-white scale-110 shadow-lg'
                                                            : 'border-transparent ring-1 ring-gray-300 dark:ring-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
                                                        }`}
                                                    style={{ backgroundColor: renderColorHex }}
                                                    title={color}
                                                >
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Sizes Section */}
                            {sizesArray.length > 0 && (
                                <div className="mb-8 border-t border-gray-100 dark:border-gray-800 pt-8">
                                    <div className="flex justify-between items-end mb-3">
                                        <h3 className="text-xs font-bold uppercase tracking-widest">
                                            Talla: {selectedSize || 'Seleccionar'}
                                        </h3>
                                        <button className="text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-1 hover:text-black">
                                            <Ruler size={12} /> Guía de tallas
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        {sizesArray.map(size => {
                                            // Ensure this size has stock, particularly within the selected color if there is one
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
                                                    className={`py-3 border text-xs font-bold uppercase tracking-widest transition-all ${!hasStockForSize
                                                        ? 'border-gray-100 dark:border-white/10 text-gray-300 dark:text-white/20 cursor-not-allowed'
                                                        : selectedSize === size
                                                            ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                                                            : 'border-gray-200 dark:border-white/20 text-gray-600 dark:text-gray-300 hover:border-black dark:hover:border-white hover:bg-black/5 dark:hover:bg-white/5'
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Add to Cart */}
                            <div className="border-t border-gray-100 dark:border-gray-800 pt-8 mt-auto">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isAddToCartDisabled}
                                    className={`w-full py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 ${isAddToCartDisabled
                                        ? 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                        : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 active:scale-[0.98]'
                                        }`}
                                >
                                    {totalStock === 0 ? 'Agotado' : isAddToCartDisabled ? 'Selecciona variante' : 'Añadir al carrito'}
                                </button>

                                <div className="mt-4 flex gap-4">
                                    <button 
                                        onClick={handleWishlistToggle}
                                        className={`flex-1 py-3 border flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                                            isSavedInWishlist 
                                                ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-500/10' 
                                                : 'border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-300 hover:border-black dark:hover:border-white hover:bg-black/5 dark:hover:bg-white/5'
                                        }`}
                                    >
                                        <Heart size={14} className={isSavedInWishlist ? 'fill-current' : ''} /> 
                                        {isSavedInWishlist ? 'Guardado' : 'Wishlist'}
                                    </button>
                                    <button className="flex-1 py-3 border border-gray-200 dark:border-white/10 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest hover:border-black dark:hover:border-white hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300">
                                        <Share2 size={14} /> Compartir
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
