import React, { useEffect } from 'react';
import BrandManifesto from '../components/Home/BrandManifesto';

const Nosotros = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="animate-fade-in pt-20">
            <BrandManifesto />
        </div>
    );
};

export default Nosotros;
