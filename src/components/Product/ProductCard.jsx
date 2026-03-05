import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);

    const formatPrice = (price) => {
        return typeof price === 'number' ? price.toFixed(2) : price;
    };

    const resolveImageUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `http://localhost:8080${url}`;
    };

    const mainImage = resolveImageUrl(product.image_url);
    const hoverImage = resolveImageUrl(product.image2_url) || mainImage;

    return (
        <div
            className="group cursor-pointer flex flex-col h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-gray-100">
                <Link to={`/product/${product.id}`} className="block w-full h-full">
                    <img
                        src={mainImage}
                        alt={product.name}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${isHovered && product.image2_url ? 'opacity-0' : 'opacity-100'}`}
                    />
                    <img
                        src={hoverImage}
                        alt={`${product.name} alternative`}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${isHovered && product.image2_url ? 'opacity-100' : 'opacity-0'}`}
                    />
                </Link>

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-black hover:text-white transition-colors duration-300">
                        <ShoppingBag size={18} />
                    </button>
                </div>

                {product.stock <= 5 && product.stock > 0 && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1">
                        Pocas unidades
                    </div>
                )}

                {product.stock === 0 && (
                    <div className="absolute top-2 left-2 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1">
                        Agotado
                    </div>
                )}
            </div>

            <div className="flex flex-col flex-grow text-center">
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">{product.category}</p>
                <h3 className="text-sm font-semibold mb-1 uppercase tracking-wide leading-tight group-hover:underline">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                </h3>
                <p className="text-sm text-gray-900 font-bold mt-auto tracking-widest">${formatPrice(product.price)}</p>
                {product.colors && (
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">{product.colors.split(',').length} Colores</p>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
