import { useState } from "react";
import { useCart } from "../context/CartContext";
import { toast } from "./Toast";

function Stars({ rating }) {
  return (
    <span className="stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ opacity: i <= Math.floor(rating) ? 1 : i - 0.5 <= rating ? 0.5 : 0.2 }}>★</span>
      ))}
    </span>
  );
}

export default function ProductCard({ product }) {
  const { dispatch } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    dispatch({ type: "ADD", product });
    toast(`${product.emoji} ${product.name} added to cart`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="product-card">
      <div className="product-img-wrap">
        {product.badge && (
          <span className={`product-badge ${product.badge === "Hot" ? "badge-hot" : ""}`}>
            {product.badge}
          </span>
        )}
        {product.emoji}
      </div>
      <div className="product-body">
        <div className="product-name">{product.name}</div>
        <div className="product-desc">{product.description}</div>
        <div className="product-meta">
          <div className="product-price">${product.price.toFixed(2)}</div>
          <div className="product-rating">
            <Stars rating={product.rating} />
            <span style={{ marginLeft: 3 }}>({product.reviews})</span>
          </div>
        </div>
        <button className={`add-to-cart ${added ? "added" : ""}`} onClick={handleAdd}>
          {added ? "✓ Added!" : "+ Add to Cart"}
        </button>
      </div>
    </div>
  );
}
