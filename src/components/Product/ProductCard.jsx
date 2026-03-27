import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../api/config';

const ProductCard = ({ product, onQuickShop }) => {
    const [isHovered, setIsHovered] = useState(false);

    const formatPrice = (price) => {
        return typeof price === 'number' ? price.toFixed(2) : price;
    };

    const resolveImageUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    };

    let parsedImages = [];
    try {
        parsedImages = JSON.parse(product.images || '[]');
    } catch (e) { }

    const totalStock = product.variants ? product.variants.reduce((acc, curr) => acc + curr.stock, 0) : 0;
    const uniqueColorObjects = product.variants 
        ? product.variants.filter((v, i, a) => a.findIndex(t => t.color === v.color) === i && v.color)
        : [];

    const mainImage = parsedImages.length > 0 ? resolveImageUrl(parsedImages[0]) : '';
    const hoverImage = parsedImages.length > 1 ? resolveImageUrl(parsedImages[1]) : mainImage;

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

                {totalStock <= 5 && totalStock > 0 && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1">
                        Pocas unidades
                    </div>
                )}

                {totalStock === 0 && (
                    <div className="absolute top-2 left-2 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1">
                        Agotado
                    </div>
                )}
            </div>

            <div className="flex flex-col flex-grow text-center mt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">{product.category}</p>
                <h3 className="text-sm font-semibold mb-1 uppercase tracking-wide leading-tight group-hover:underline">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                </h3>
                <p className="text-sm text-gray-900 dark:text-gray-100 font-bold mt-auto tracking-widest">S/ {formatPrice(product.price)}</p>
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
