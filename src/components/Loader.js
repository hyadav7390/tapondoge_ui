// src/components/Loader.js
import React from 'react';
import { useLoader } from '@/contexts/LoaderContext';

const Loader = () => {
    const { loading } = useLoader();

    if (!loading) return null;

    return (
        <div className="loader-overlay">
            <div className="spinner"></div>
        </div>
    );
};

export default Loader;
