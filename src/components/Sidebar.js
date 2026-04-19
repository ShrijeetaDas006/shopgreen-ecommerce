import { categories } from "../data/products";

export default function Sidebar({ activeCat, setActiveCat, maxPrice, setMaxPrice, sortBy, setSortBy }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-heading">Browse</div>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`cat-btn ${activeCat === cat.id ? "active" : ""}`}
            onClick={() => setActiveCat(cat.id)}
          >
            <span className="cat-icon">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      <div className="sidebar-section">
        <div className="sidebar-heading">Price</div>
        <div className="price-filter">
          <div className="price-label">
            <span>Up to</span>
            <span className="price-val">${maxPrice}</span>
          </div>
          <input
            type="range"
            min={10}
            max={200}
            step={5}
            value={maxPrice}
            onChange={e => setMaxPrice(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-heading">Sort By</div>
        <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="default">Featured</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="rating">Top Rated</option>
          <option value="reviews">Most Reviewed</option>
        </select>
      </div>
    </aside>
  );
}
