import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../api/config';

const ProductCard = ({ product, onQuickShop }) => {
    const [isHovered, setIsHovered] = useState(false);

    const formatPrice = (price) => {
        return typeof price === 'number' ? price.toFixed(2) : price;
    };

    const getImageUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `${API_BASE_URL}${encodeURI(url)}`;
    };

    let parsedImages = [];
    try {
        parsedImages = JSON.parse(product.images || '[]');
    } catch (e) { }

    const totalStock = product.variants ? product.variants.reduce((acc, curr) => acc + curr.stock, 0) : 0;
    const uniqueColorObjects = product.variants 
        ? product.variants.filter((v, i, a) => a.findIndex(t => t.color === v.color) === i && v.color)
        : [];

    const mainImage = parsedImages.length > 0 ? getImageUrl(parsedImages[0]) : '';
    const hoverImage = parsedImages.length > 1 ? getImageUrl(parsedImages[1]) : mainImage;

    return (
        <div
            className="group cursor-pointer flex flex-col h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Link to={`/product/${product.id}`} className="block w-full h-full">
                    {mainImage ? (
                        <img
                            src={mainImage}
                            alt={product.name}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${isHovered && parsedImages.length > 1 ? 'opacity-0' : 'opacity-100'}`}
                        />
                    ) : (
                        <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">Sin imagen</div>
                    )}

                    {parsedImages.length > 1 && (
                        <img
                            src={hoverImage}
                            alt={`${product.name} alternative`}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                        />
                    )}
                </Link>

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            if (onQuickShop) onQuickShop();
                        }}
                        className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300 pointer-events-auto"
                    >
                        <ShoppingBag size={18} />
                    </button>
                </div>

                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-20">
                    {totalStock <= 5 && totalStock > 0 && (
                        <div className="bg-red-600/90 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1.5 shadow-lg">
                            Pocas unidades
                        </div>
                    )}

                    {totalStock === 0 && (
                        <div className="bg-gray-900/90 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1.5 shadow-lg">
                            Agotado
                        </div>
                    )}

                    {product.is_offer && totalStock > 0 && (
                        <div className="bg-purple-600/90 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1.5 shadow-lg flex items-center gap-1.5">
                            <span>Oferta</span>
                            {product.price > 0 && product.offer_price > 0 && (
                                <span className="bg-white text-purple-600 px-1 rounded-sm text-[8px] font-black">
                                    -{Math.round(((product.price - product.offer_price) / product.price) * 100)}%
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col flex-grow text-center mt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">{product.category}</p>
                <h3 className="text-sm font-semibold mb-1 uppercase tracking-wide leading-tight group-hover:underline">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                </h3>
                <div className="mt-auto">
                    {product.is_offer ? (
                        <p className="text-sm tracking-widest flex items-center justify-center gap-2">
                            <span className="text-purple-600 font-bold">S/ {formatPrice(product.offer_price)}</span>
                            <span className="text-gray-400 text-xs line-through">S/ {formatPrice(product.price)}</span>
                        </p>
                    ) : (
                        <p className="text-sm text-gray-900 dark:text-gray-100 font-bold tracking-widest">S/ {formatPrice(product.price)}</p>
                    )}
                </div>
                {uniqueColorObjects.length > 0 && (
                    <div className="flex items-center justify-center gap-1.5 mt-2">
                        {uniqueColorObjects.map((variant, idx) => (
                            <div 
                                key={variant.color || idx} 
                                className="w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm"
                                style={{ backgroundColor: variant.color_hex || variant.color }}
                                title={variant.color}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
