import React, { createContext, useContext, useState } from 'react';

export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const addToCart = (product) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id && item.selectedSize === product.selectedSize && item.selectedColor === product.selectedColor);
            const qtyToAdd = product.quantity || 1;
            if (existing) {
                return prev.map(item =>
                    item.id === product.id && item.selectedSize === product.selectedSize && item.selectedColor === product.selectedColor
                        ? { ...item, quantity: item.quantity + qtyToAdd }
                        : item
                );
            }
            return [...prev, { ...product, quantity: qtyToAdd }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (productId, selectedSize, selectedColor) => {
        setCartItems(prev => prev.filter(item => !(item.id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor)));
    };

    const updateQuantity = (productId, selectedSize, selectedColor, quantity) => {
        setCartItems(prev => prev.map(item =>
            item.id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor ? { ...item, quantity } : item
        ));
    };

    const toggleCart = () => setIsCartOpen(!isCartOpen);

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cartItems.reduce((acc, item) => {
        const minQty = item.offer_min_qty || 1;
        const effectivePrice = (item.is_offer && item.quantity >= minQty) 
            ? item.offer_price 
            : (item.original_price || item.price);
        return acc + (effectivePrice * item.quantity);
    }, 0);

    const value = React.useMemo(() => ({
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        isCartOpen,
        toggleCart,
        cartCount,
        cartTotal
    }), [cartItems, isCartOpen, cartCount, cartTotal]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
