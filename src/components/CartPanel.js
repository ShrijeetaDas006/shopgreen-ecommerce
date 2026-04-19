import { useCart } from "../context/CartContext";

function CartItem({ item }) {
  const { dispatch } = useCart();
  return (
    <div className="cart-item">
      <div className="cart-item-emoji">{item.emoji}</div>
      <div className="cart-item-info">
        <div className="cart-item-name">{item.name}</div>
        <div className="cart-item-price">${item.price.toFixed(2)} each</div>
        <div className="cart-item-controls">
          <button className="qty-btn" onClick={() => dispatch({ type: "DEC", id: item.id })}>−</button>
          <span className="qty-num">{item.qty}</span>
          <button className="qty-btn" onClick={() => dispatch({ type: "INC", id: item.id })}>+</button>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
        <button className="remove-btn" onClick={() => dispatch({ type: "REMOVE", id: item.id })}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <div className="cart-item-total">${(item.price * item.qty).toFixed(2)}</div>
      </div>
    </div>
  );
}

export default function CartPanel({ onCheckout }) {
  const { items, subtotal, tax, shipping, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="panel-body">
        <div className="empty-cart">
          <div className="empty-icon">🛍️</div>
          <div>Your cart is empty</div>
          <div style={{ fontSize: 12 }}>Add some products to get started!</div>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-body">
      {items.map(item => <CartItem key={item.id} item={item} />)}

      <div className="order-summary">
        <div className="summary-line"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="summary-line"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
        <div className="summary-line"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
        <hr className="summary-divider" />
        <div className="summary-total"><span>Total</span><span>${total.toFixed(2)}</span></div>
      </div>

      <button className="checkout-btn" onClick={onCheckout}>
        Proceed to Checkout →
      </button>
    </div>
  );
}
