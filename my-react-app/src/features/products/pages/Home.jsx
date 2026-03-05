import useProducts from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";

function Home() {

  const { products } = useProducts();

  return (
    <div className="home-page">
      <div className="container">
        {/* Hero Section */}
        <div className="hero">
          <div className="hero-content">
            <h1>Welcome to E-Shop</h1>
            <p>Discover amazing products at great prices. Shop now and enjoy the best online shopping experience!</p>
            <a href="/products" className="btn btn-primary">Shop Now</a>
          </div>
        </div>

        {/* Featured Products */}
        <section className="page-header">
          <h2>Featured Products</h2>
          <p>Check out our latest collection</p>
        </section>

        <div className="grid">

          {(products || []).slice(0,4).map((p) => (

            <ProductCard
              key={p._id}
              product={p}
            />

          ))}

        </div>

        {(products || []).length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <h3 className="empty-title">No products available</h3>
            <p>Check back later for new products!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
