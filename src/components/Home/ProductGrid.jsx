import React, { useState } from 'react';
import ProductCard from '../Product/ProductCard';
import { products } from '../../data/products';

const categories = ["TODOS", "VESTIDOS", "CALZADO", "PANTALONES", "ABRIGOS", "TOPS"];

const ProductGrid = () => {
    const [activeCategory, setActiveCategory] = useState("TODOS");

    const filteredProducts = activeCategory === "TODOS"
        ? products
        : products.filter(product => product.category.toUpperCase() === activeCategory);

    return (
        <section className="py-20 bg-secondary">
            <div className="container mx-auto">
                <h2 className="text-3xl font-header font-bold text-center mb-8 uppercase tracking-widest">
                    NUEVOS INGRESOS
                </h2>

                {/* Categories Filter */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-6 py-2 rounded-full text-sm font-bold tracking-widest transition-all duration-300 ${activeCategory === category
                                ? 'bg-black text-white shadow-lg scale-105'
                                : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-black border border-gray-200'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <p className="text-center text-gray-500 mt-8 italic">No se encontraron productos en esta categoría.</p>
                )}
            </div>
        </section>
    );
};

export default ProductGrid;
