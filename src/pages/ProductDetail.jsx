import React, { useState, useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { motion } from 'framer-motion';
import { ChevronRight, Heart, Share2, Ruler } from 'lucide-react';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useContext(CartContext);

    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch('http://localhost:8080/products');
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
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return <div className="min-h-screen pt-32 pb-24 px-6 text-center">Cargando...</div>;
    }

    if (!product) {
        return (
            <div className="min-h-screen pt-32 pb-24 px-6 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold uppercase mb-4">Producto no encontrado</h2>
                <Link to="/" className="border-b border-black pb-1 uppercase text-sm font-bold tracking-widest">
                    Volver a la tienda
                </Link>
            </div>
        );
    }

    const imgs = [];
    if (product.image_url) {
        imgs.push(product.image_url.startsWith('http') ? product.image_url : `http://localhost:8080${product.image_url}`);
    }
    if (product.image2_url && product.image2_url !== product.image_url) {
        imgs.push(product.image2_url.startsWith('http') ? product.image2_url : `http://localhost:8080${product.image2_url}`);
    }

    const sizesArray = product.sizes ? product.sizes.split(',').map(s => s.trim()).filter(s => s) : [];
    const colorsArray = product.colors ? product.colors.split(',').map(c => c.trim()).filter(c => c) : [];

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
            quantity
        };

        addToCart(itemToAdd);
    };

    return (
        <div className="pt-24 pb-24 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest mb-8">
                    <Link to="/" className="hover:text-black">Home</Link>
                    <ChevronRight size={12} />
                    <Link to="/#shop" className="hover:text-black">Shop</Link>
                    <ChevronRight size={12} />
                    <span className="text-black">{product.name}</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
                    {/* Images Column */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-4">
                        {imgs.length > 0 ? imgs.map((img, idx) => (
                            <div key={idx} className="aspect-[3/4] bg-gray-100 relative">
                                <img
                                    src={img}
                                    alt={`${product.name} view ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                />
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
                            <p className="text-xl text-gray-900 tracking-widest mb-8">
                                ${product.price.toFixed(2)}
                            </p>

                            <div className="mb-8">
                                <p className="text-sm text-gray-600 leading-relaxed">
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
                                        {colorsArray.map(color => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`px-4 py-2 border text-xs font-bold uppercase tracking-widest transition-all ${selectedColor === color
                                                        ? 'border-black bg-black text-white'
                                                        : 'border-gray-300 text-gray-600 hover:border-black'
                                                    }`}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Sizes Section */}
                            {sizesArray.length > 0 && (
                                <div className="mb-8 border-t border-gray-100 pt-8">
                                    <div className="flex justify-between items-end mb-3">
                                        <h3 className="text-xs font-bold uppercase tracking-widest">
                                            Talla: {selectedSize || 'Seleccionar'}
                                        </h3>
                                        <button className="text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-1 hover:text-black">
                                            <Ruler size={12} /> Guía de tallas
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        {sizesArray.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`py-3 border text-xs font-bold uppercase tracking-widest transition-all ${selectedSize === size
                                                        ? 'border-black bg-black text-white'
                                                        : 'border-gray-300 text-gray-600 hover:border-black'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Add to Cart */}
                            <div className="border-t border-gray-100 pt-8 mt-auto">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                    className={`w-full py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors ${product.stock === 0
                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                            : 'bg-black text-white hover:bg-gray-800'
                                        }`}
                                >
                                    {product.stock === 0 ? 'Agotado' : 'Añadir al carrito'}
                                </button>

                                <div className="mt-4 flex gap-4">
                                    <button className="flex-1 py-3 border border-gray-300 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest hover:border-black transition-colors">
                                        <Heart size={14} /> Wishlist
                                    </button>
                                    <button className="flex-1 py-3 border border-gray-300 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest hover:border-black transition-colors">
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
