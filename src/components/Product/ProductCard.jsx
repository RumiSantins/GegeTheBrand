import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { id, name, price, category, image1, image2 } = product;

    // Fallback image in case of load error
    const fallbackImage = "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&q=80&w=800";

    const [img1Src, setImg1Src] = useState(image1);
    const [img2Src, setImg2Src] = useState(image2);

    return (
        <div className="group relative">
            <Link
                to={`/product/${id}`}
                className="block relative overflow-hidden aspect-[3/4] bg-gray-200"
            >
                {/* Image 1 (Default) */}
                <img
                    src={img1Src}
                    alt={name}
                    loading="lazy"
                    onError={() => setImg1Src(fallbackImage)}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-100 group-hover:opacity-0"
                />
                {/* Image 2 (Hover) */}
                <img
                    src={img2Src}
                    alt={`${name} hover`}
                    loading="lazy"
                    onError={() => setImg2Src(fallbackImage)}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                />

                {/* Quick Add Button (Visible on Hover) */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        addToCart({ ...product, size: 'M' }); // Default size for quick add
                    }}
                    className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black hover:text-white"
                >
                    <ShoppingBag className="w-5 h-5" />
                </button>
            </Link>

            <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{category}</p>
                <h3 className="text-lg font-medium font-body truncate">{name}</h3>
                <p className="text-sm font-bold mt-1">${price.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default ProductCard;
