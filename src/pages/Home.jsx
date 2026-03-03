import React, { useEffect } from 'react';
import HeroSlider from '../components/Home/HeroSlider';
import ProductGrid from '../components/Home/ProductGrid';
import BrandManifesto from '../components/Home/BrandManifesto';
import StyleEditorial from '../components/Home/StyleEditorial';

const Home = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="animate-fade-in">
            <HeroSlider />
            <BrandManifesto />
            <ProductGrid />
            <StyleEditorial />
        </div>
    );
};

export default Home;
