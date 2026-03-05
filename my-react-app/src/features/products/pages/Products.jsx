import { useState } from "react";
import useProducts from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";

function Products() {

  const { products, fetchProducts } = useProducts();

  const [search, setSearch] = useState("");

  const handleSearch = () => {
    fetchProducts({ search });
  };

  const handleCategory = (category) => {
    fetchProducts({ category });
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Our Products</h2>

      <div className="products-toolbar">
        <div className="search-box">
          <input
            className="form-input"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>

        <CategoryFilter onSelect={handleCategory} />
      </div>

      <div className="products-grid">

        {(products || []).map((p) => (

          <ProductCard
            key={p._id}
            product={p}
          />

        ))}

      </div>

      {(products || []).length === 0 && (
        <div className="empty-state">
          <p>No products found</p>
        </div>
      )}

    </div>
  );
}

export default Products;
