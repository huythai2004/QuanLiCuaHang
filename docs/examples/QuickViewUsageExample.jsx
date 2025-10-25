/**
 * EXAMPLE: Cách sử dụng QuickViewModal trong các components khác
 * 
 * File này minh họa cách integrate QuickViewModal vào:
 * 1. Product List (Grid/List view)
 * 2. Search Results
 * 3. Related Products
 * 4. Featured Products
 */

import React, { useState } from 'react';
import QuickViewModal from '../components/QuickViewModal';

// ============================================
// EXAMPLE 1: Trong Product Grid
// ============================================
export function ProductGridExample() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);

  const handleQuickView = async (product) => {
    try {
      // Fetch additional images
      const response = await fetch(`http://localhost:8080/product-images/product/${product.id}`);
      const images = await response.json();
      
      const productWithImages = {
        ...product,
        images: images && images.length > 0 ? images : product.images || []
      };
      
      setSelectedProduct(productWithImages);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error:", error);
      setSelectedProduct(product);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="product-grid">
      {products.map(product => (
        <div key={product.id} className="product-item">
          <img src={product.primary_image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>${product.price}</p>
          
          {/* Quick View Button */}
          <button 
            className="btn-quick-view"
            onClick={() => handleQuickView(product)}
          >
            Quick View
          </button>
        </div>
      ))}

      {/* Modal */}
      <QuickViewModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

// ============================================
// EXAMPLE 2: Trong Search Results
// ============================================
export function SearchResultsExample() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleQuickView = async (product) => {
    // Fetch product details
    try {
      const [imagesRes, detailsRes] = await Promise.all([
        fetch(`http://localhost:8080/product-images/product/${product.id}`),
        fetch(`http://localhost:8080/products/${product.id}`)
      ]);

      const images = await imagesRes.json();
      const details = await detailsRes.json();

      const productWithFullDetails = {
        ...details,
        images: images || []
      };

      setSelectedProduct(productWithFullDetails);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error:", error);
      setSelectedProduct(product);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="search-results">
      <h2>Search Results</h2>
      {searchResults.map(product => (
        <div key={product.id} className="search-result-item">
          <div className="result-image">
            <img src={product.primary_image} alt={product.name} />
          </div>
          <div className="result-info">
            <h4>{product.name}</h4>
            <p>{product.description}</p>
            <span className="price">${product.price}</span>
            <button onClick={() => handleQuickView(product)}>
              Quick View
            </button>
          </div>
        </div>
      ))}

      <QuickViewModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

// ============================================
// EXAMPLE 3: Với Custom Hook (Recommended)
// ============================================

// Custom Hook để tái sử dụng logic
export function useQuickView() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const openQuickView = async (product) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/product-images/product/${product.id}`);
      const images = await response.json();
      
      const productWithImages = {
        ...product,
        images: images && images.length > 0 ? images : product.images || []
      };
      
      setSelectedProduct(productWithImages);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching product details:", error);
      setSelectedProduct(product);
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const closeQuickView = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300); // Wait for animation
  };

  return {
    selectedProduct,
    isModalOpen,
    loading,
    openQuickView,
    closeQuickView
  };
}

// Sử dụng custom hook
export function ProductListWithHook() {
  const { selectedProduct, isModalOpen, loading, openQuickView, closeQuickView } = useQuickView();
  const [products, setProducts] = useState([]);

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <button 
            onClick={() => openQuickView(product)}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Quick View'}
          </button>
        </div>
      ))}

      <QuickViewModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeQuickView}
      />
    </div>
  );
}

// ============================================
// EXAMPLE 4: Với Context API (For Global State)
// ============================================

import { createContext, useContext } from 'react';

const QuickViewContext = createContext();

export function QuickViewProvider({ children }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openQuickView = async (product) => {
    try {
      const response = await fetch(`http://localhost:8080/product-images/product/${product.id}`);
      const images = await response.json();
      
      setSelectedProduct({
        ...product,
        images: images || []
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      setSelectedProduct(product);
      setIsModalOpen(true);
    }
  };

  const closeQuickView = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <QuickViewContext.Provider value={{ openQuickView, closeQuickView, selectedProduct, isModalOpen }}>
      {children}
      <QuickViewModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeQuickView}
      />
    </QuickViewContext.Provider>
  );
}

// Hook để sử dụng context
export function useQuickViewContext() {
  const context = useContext(QuickViewContext);
  if (!context) {
    throw new Error('useQuickViewContext must be used within QuickViewProvider');
  }
  return context;
}

// Sử dụng context
export function ProductWithContext() {
  const { openQuickView } = useQuickViewContext();
  
  return (
    <button onClick={() => openQuickView(product)}>
      Quick View
    </button>
  );
}

// Wrap App với Provider
// In App.js:
// <QuickViewProvider>
//   <Products />
//   <SearchResults />
//   <RelatedProducts />
// </QuickViewProvider>

// ============================================
// EXAMPLE 5: Với Animation Libraries
// ============================================

import { motion, AnimatePresence } from 'framer-motion';

export function AnimatedQuickView() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <QuickViewModal 
            product={selectedProduct}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================
// EXAMPLE 6: Với Loading State
// ============================================

export function QuickViewWithLoading() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickView = async (product) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const response = await fetch(`http://localhost:8080/product-images/product/${product.id}`);
      const images = await response.json();
      
      setSelectedProduct({
        ...product,
        images: images || []
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button 
        onClick={() => handleQuickView(product)}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="spinner"></span>
            Loading...
          </>
        ) : (
          'Quick View'
        )}
      </button>

      <QuickViewModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

// ============================================
// EXAMPLE 7: Error Handling
// ============================================

export function QuickViewWithErrorHandling() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const handleQuickView = async (product) => {
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8080/product-images/product/${product.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch product images');
      }
      
      const images = await response.json();
      
      setSelectedProduct({
        ...product,
        images: images || []
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      setError(error.message);
      
      // Still show modal with basic info
      setSelectedProduct(product);
      setIsModalOpen(true);
    }
  };

  return (
    <div>
      {error && (
        <div className="alert alert-warning">
          {error}
        </div>
      )}
      
      <button onClick={() => handleQuickView(product)}>
        Quick View
      </button>

      <QuickViewModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setError(null);
        }}
      />
    </div>
  );
}

// ============================================
// TIPS & BEST PRACTICES
// ============================================

/*
1. Sử dụng Custom Hook (useQuickView) để tái sử dụng logic
2. Implement loading state để UX tốt hơn
3. Error handling để app không crash
4. Cleanup state khi unmount component
5. Debounce multiple clicks
6. Preload images để smooth hơn
7. Analytics tracking khi user mở quick view
8. Lazy load modal component nếu cần optimize

RECOMMENDED APPROACH:
- Dùng Custom Hook cho small projects
- Dùng Context API cho large projects với nhiều components
- Always handle errors gracefully
- Add loading indicators
*/

