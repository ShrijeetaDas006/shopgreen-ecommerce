import { createContext, useContext, useReducer } from "react";

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find(i => i.id === action.product.id);
      if (existing) {
        return { ...state, items: state.items.map(i => i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i) };
      }
      return { ...state, items: [...state.items, { ...action.product, qty: 1 }] };
    }
    case "REMOVE":
      return { ...state, items: state.items.filter(i => i.id !== action.id) };
    case "INC":
      return { ...state, items: state.items.map(i => i.id === action.id ? { ...i, qty: i.qty + 1 } : i) };
    case "DEC":
      return {
        ...state,
        items: state.items
          .map(i => i.id === action.id ? { ...i, qty: i.qty - 1 } : i)
          .filter(i => i.qty > 0),
      };
    case "CLEAR":
      return { ...state, items: [] };
    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const subtotal = state.items.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = subtotal * 0.08;
  const shipping = state.items.length > 0 ? 4.99 : 0;
  const total = subtotal + tax + shipping;
  const count = state.items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ items: state.items, subtotal, tax, shipping, total, count, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
