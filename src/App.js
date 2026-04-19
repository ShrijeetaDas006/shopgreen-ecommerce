import { useState, useMemo } from "react";
import { CartProvider, useCart } from "./context/CartContext";
import { ToastProvider } from "./components/Toast";
import Sidebar from "./components/Sidebar";
import ProductCard from "./components/ProductCard";
import CartPanel from "./components/CartPanel";
import PaymentForm from "./components/PaymentForm";
import { products } from "./data/products";
import "./index.css";

function OrderSuccess({ onReset }) {
  const orderNum = useMemo(() => `SG-${Math.floor(100000 + Math.random() * 900000)}`, []);
  return (
    <div className="success-screen">
      <div className="success-icon">🎉</div>
      <div className="success-title">Order Confirmed!</div>
      <div className="success-sub">Thank you for your purchase.<br />A confirmation has been sent to your email.</div>
      <div className="order-num">Order #{orderNum}</div>
      <button className="checkout-btn" style={{ width: "auto", padding: "10px 24px", marginTop: 4 }} onClick={onReset}>
        Continue Shopping
      </button>
    </div>
  );
}

function AppInner() {
  const { count, dispatch } = useCart();
  const [activeCat, setActiveCat] = useState("all");
  const [maxPrice, setMaxPrice] = useState(200);
  const [sortBy, setSortBy] = useState("default");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("cart"); // cart | pay | success

  const filtered = useMemo(() => {
    let list = products.filter(p =>
      (activeCat === "all" || p.category === activeCat) &&
      p.price <= maxPrice &&
      (search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
    );
    if (sortBy === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    else if (sortBy === "reviews") list = [...list].sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [activeCat, maxPrice, sortBy, search]);

  const catLabel = activeCat === "all" ? "All Products" :
    activeCat === "electronics" ? "Electronics" :
    activeCat === "fashion" ? "Fashion" :
    activeCat === "food" ? "Food & Drink" : "Home & Living";

  const handleSuccess = () => {
    dispatch({ type: "CLEAR" });
    setTab("success");
  };

  const handleReset = () => {
    setTab("cart");
    setActiveCat("all");
    setSearch("");
  };

  return (
    <div>
      <header className="topbar">
        <div className="logo">
          shop<span className="logo-dot">●</span>green
        </div>
        <div className="search-wrap">
          <div className="search-box">
            <svg className="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              placeholder="Search products…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="topbar-actions">
          <button className="cart-btn" onClick={() => setTab("cart")}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            Cart
            <span className="cart-count">{count}</span>
          </button>
        </div>
      </header>

      <div className="app-layout">
        <Sidebar
          activeCat={activeCat}
          setActiveCat={setActiveCat}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <main className="main-content">
          <div className="content-header">
            <h1 className="content-title">{catLabel}</h1>
            <span className="result-count">{filtered.length} product{filtered.length !== 1 ? "s" : ""}</span>
          </div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", color: "var(--text3)", padding: "60px 0", fontSize: 14 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
              No products match your filters.
            </div>
          ) : (
            <div className="products-grid">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </main>

        <aside className="cart-panel">
          <div className="panel-tabs">
            <button className={`panel-tab ${tab === "cart" ? "active" : ""}`} onClick={() => setTab("cart")}>
              Cart ({count})
            </button>
            <button className={`panel-tab ${tab === "pay" || tab === "success" ? "active" : ""}`} onClick={() => count > 0 && setTab("pay")}>
              Payment
            </button>
          </div>

          {tab === "cart" && <CartPanel onCheckout={() => count > 0 && setTab("pay")} />}
          {tab === "pay" && <PaymentForm onBack={() => setTab("cart")} onSuccess={handleSuccess} />}
          {tab === "success" && <OrderSuccess onReset={handleReset} />}
        </aside>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <ToastProvider>
        <AppInner />
      </ToastProvider>
    </CartProvider>
  );
}
