import React, { createContext, useState, useEffect, useContext } from 'react';

export const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);

    useEffect(() => {
        try {
            const savedWishlist = localStorage.getItem('gege_wishlist');
            if (savedWishlist) {
                setWishlistItems(JSON.parse(savedWishlist));
            }
        } catch (e) {
            console.error('Failed to load wishlist from local storage', e);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('gege_wishlist', JSON.stringify(wishlistItems));
        } catch (e) {
            console.error('Failed to save wishlist to local storage', e);
        }
    }, [wishlistItems]);

    // An item is identified by its unique combination of id, size, and color
    const addToWishlist = (item) => {
        setWishlistItems(prev => {
            const exists = prev.some(
                w => w.id === item.id && w.selectedSize === item.selectedSize && w.selectedColor === item.selectedColor
            );
            if (exists) return prev;
            return [...prev, item];
        });
    };

    const removeFromWishlist = (id, size, color) => {
        setWishlistItems(prev => 
            prev.filter(w => !(w.id === id && w.selectedSize === size && w.selectedColor === color))
        );
    };

    const isInWishlist = (id, size, color) => {
        return wishlistItems.some(w => w.id === id && w.selectedSize === size && w.selectedColor === color);
    };

    const updateWishlistQuantity = (id, size, color, quantity) => {
        setWishlistItems(prev =>
            prev.map(w =>
                w.id === id && w.selectedSize === size && w.selectedColor === color
                    ? { ...w, quantity }
                    : w
            )
        );
    };

    const toggleWishlist = (item) => {
        if (isInWishlist(item.id, item.selectedSize, item.selectedColor)) {
            removeFromWishlist(item.id, item.selectedSize, item.selectedColor);
            return false; // Removed
        } else {
            addToWishlist(item);
            return true; // Added
        }
    };

    const wishlistCount = wishlistItems.length;

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            toggleWishlist,
            updateWishlistQuantity,
            wishlistCount
        }}>
            {children}
        </WishlistContext.Provider>
    );
};
