import { useState, useContext, createContext } from 'react';

// Create Cart Context
const CartContext = createContext();

// CartProvider Component
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  return (
    <CartContext.Provider value={[cart, setCart]}>
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook for using the Cart Context
export const useCart = () => useContext(CartContext);

export { CartProvider };
