import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [mainImage, setMainImage] = useState('');

    useEffect(() => {
        const foundProduct = products.find(p => p.id === parseInt(id));
        if (foundProduct) {
            setProduct(foundProduct);
            setMainImage(foundProduct.images[0]);
        }
    }, [id]);

    if (!product) return <div className="pt-32 text-center">Cargando producto...</div>;

    return (
        <div className="pt-40 md:pt-44 pb-20 container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Gallery */}
                <div className="space-y-4">
                    <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
                        <motion.img
                            key={mainImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            src={mainImage}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex space-x-4 overflow-x-auto pb-2">
                        {product.images.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setMainImage(img)}
                                className={`w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${mainImage === img ? 'border-black' : 'border-transparent hover:border-gray-300'
                                    }`}
                            >
                                <img src={img} alt={`${product.name} ${index}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col justify-center">
                    <h1 className="text-3xl md:text-5xl font-header font-bold mb-4 uppercase">{product.name}</h1>
                    <p className="text-xl font-bold text-gray-900 mb-6">S/ {product.price.toFixed(2)}</p>

                    <p className="text-gray-600 mb-8 leading-relaxed">
                        {product.description}
                    </p>

                    <div className="mb-8">
                        <h3 className="font-bold text-sm uppercase tracking-wider mb-3">Seleccionar Talle</h3>
                        <div className="flex flex-wrap gap-3">
                            {product.sizes.map(size => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`w-12 h-12 flex items-center justify-center border rounded transition-all duration-200 ${selectedSize === size
                                        ? 'border-pink-500 text-pink-500 font-bold ring-1 ring-pink-500'
                                        : 'border-gray-200 hover:border-black'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                        {!selectedSize && <p className="text-red-500 text-xs mt-2">Por favor selecciona un talle</p>}
                    </div>

                    <button
                        onClick={() => {
                            if (selectedSize) {
                                addToCart({ ...product, size: selectedSize });
                            } else {
                                alert('Selecciona un talle primero');
                            }
                        }}
                        className="w-full btn-accent text-lg py-4 shadow-lg shadow-purple-200 transform hover:-translate-y-1 transition-transform"
                    >
                        AÑADIR AL CARRITO
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
