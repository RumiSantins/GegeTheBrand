import React, { useEffect } from 'react';
import HeroSlider from '../components/Home/HeroSlider';
import ProductGrid from '../components/Home/ProductGrid';
import StyleEditorial from '../components/Home/StyleEditorial';

const Home = () => {
    useEffect(() => {
        // Only scroll to top if there's no hash (let Header handle hash navigation smoothly)
        if (!window.location.hash) {
            window.scrollTo(0, 0);
        }
    }, []);

    return (
        <div className="animate-fade-in">
            <HeroSlider />
            <ProductGrid />
            <StyleEditorial />
        </div>
    );
};

export default Home;
