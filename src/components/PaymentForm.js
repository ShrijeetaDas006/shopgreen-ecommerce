import { useState } from "react";
import { useCart } from "../context/CartContext";

function formatCardNumber(val) {
  return val.replace(/\D/g, "").substring(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(val) {
  let v = val.replace(/\D/g, "").substring(0, 4);
  if (v.length >= 2) v = v.substring(0, 2) + "/" + v.substring(2);
  return v;
}

export default function PaymentForm({ onBack, onSuccess }) {
  const { total } = useCart();
  const [form, setForm] = useState({ name: "", email: "", cardNum: "", expiry: "", cvv: "" });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    setErrors(e => ({ ...e, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = true;
    if (!form.email.includes("@")) e.email = true;
    if (form.cardNum.replace(/\s/g, "").length < 16) e.cardNum = true;
    if (form.expiry.length < 5) e.expiry = true;
    if (form.cvv.length < 3) e.cvv = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setProcessing(true);
    setTimeout(() => { setProcessing(false); onSuccess(); }, 1800);
  };

  return (
    <div className="panel-body">
      <div className="secure-header">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        SSL Encrypted · Secure Payment
      </div>

      <div className="payment-form">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>Card Details</div>
          <div className="card-brands">
            <span className="brand">VISA</span>
            <span className="brand">MC</span>
            <span className="brand">AMEX</span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Cardholder name</label>
          <input className={`form-input ${errors.name ? "error" : ""}`} placeholder="Jane Doe" value={form.name} onChange={e => set("name", e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Email address</label>
          <input className={`form-input ${errors.email ? "error" : ""}`} type="email" placeholder="you@email.com" value={form.email} onChange={e => set("email", e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Card number</label>
          <input
            className={`form-input ${errors.cardNum ? "error" : ""}`}
            placeholder="1234 5678 9012 3456"
            value={form.cardNum}
            onChange={e => set("cardNum", formatCardNumber(e.target.value))}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Expiry</label>
            <input
              className={`form-input ${errors.expiry ? "error" : ""}`}
              placeholder="MM/YY"
              value={form.expiry}
              onChange={e => set("expiry", formatExpiry(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">CVV</label>
            <input
              className={`form-input ${errors.cvv ? "error" : ""}`}
              type="password"
              placeholder="•••"
              maxLength={4}
              value={form.cvv}
              onChange={e => set("cvv", e.target.value.replace(/\D/g, ""))}
            />
          </div>
        </div>

        <div className="ssl-note">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
          Your payment info is encrypted and never stored
        </div>

        <button className="checkout-btn" onClick={handleSubmit} disabled={processing}>
          {processing ? (
            <>Processing…</>
          ) : (
            <>Pay ${total.toFixed(2)} →</>
          )}
        </button>

        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 13, color: "var(--text3)", cursor: "pointer", textAlign: "center", fontFamily: "var(--font-body)" }}>
          ← Back to cart
        </button>
      </div>
    </div>
  );
}
