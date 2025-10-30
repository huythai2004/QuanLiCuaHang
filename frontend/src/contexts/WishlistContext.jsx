import React, { createContext, useState, useContext, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlist from localStorage when app starts
  useEffect(() => {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      setWishlistItems(JSON.parse(storedWishlist));
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Add item to wishlist
  const addToWishlist = (product) => {
    setWishlistItems(prevItems => {
      // Check if product already exists in wishlist
      const existingItem = prevItems.find(item => item.id === product.id);

      if (existingItem) {
        // Product already in wishlist, don't add again
        return prevItems;
      } else {
        // Add new item to wishlist
        return [...prevItems, {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.primary_image || product.images?.[0]?.imageUrl || '',
          description: product.description || '',
          stock_qty: product.stock_qty,
          category: product.category
        }];
      }
    });
  };

  // Remove item from wishlist
  const removeFromWishlist = (productId) => {
    setWishlistItems(prevItems => 
      prevItems.filter(item => item.id !== productId)
    );
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  // Toggle wishlist (add if not exists, remove if exists)
  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      return false; // Removed
    } else {
      addToWishlist(product);
      return true; // Added
    }
  };

  // Clear wishlist
  const clearWishlist = () => {
    setWishlistItems([]);
  };

  // Get total items count
  const getTotalItems = () => {
    return wishlistItems.length;
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
    getTotalItems
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

