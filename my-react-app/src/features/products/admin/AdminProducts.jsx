import { useEffect, useState } from "react";
import useAuth from "../../auth/hooks/useAuth";
import {
  getProducts,
  deleteProduct,
  createProduct
} from "../api/productApi";
import Loader from "../../../shared/components/Loader";

function AdminProducts() {

  const { user, loading: authLoading } = useAuth();

  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingProducts, setFetchingProducts] = useState(true);

  // Show loading while auth is being checked
  if (authLoading) {
    return <Loader />;
  }

  if (!user || user.role !== "ADMIN") {
    return <p>Access Denied</p>;
  }
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: ""
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {

    async function load() {
      try {
        const res = await getProducts();
        // Backend returns { total, page, pages, products }
        setProducts(res.data.products || []);
      } catch (error) {
        console.error("Error loading products:", error);
        setProducts([]);
      } finally {
        setFetchingProducts(false);
      }
    }

    load();

  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setProducts(prevProducts => prevProducts.filter(p => p._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData for file upload
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("category", formData.category);
      if (imageFile) {
        data.append("image", imageFile);
      }

      const res = await createProduct(data);

      // Add new product to list using functional update
      // Backend returns product directly, not wrapped in data
      setProducts(prevProducts => [...(prevProducts || []), res.data]);
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: ""
      });
      setImageFile(null);
      setShowForm(false);
      
      alert("Product created successfully!");
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">

      <h2>Admin Product Manager</h2>

      <button 
        onClick={() => setShowForm(!showForm)}
        className="btn btn-primary"
        style={{ marginBottom: "20px" }}
      >
      {showForm ? "Cancel" : "Add New Product"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: "30px", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
          <h3>Create New Product</h3>
          
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Product Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              style={{ width: "100%", padding: "8px", minHeight: "80px" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Price:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Stock:</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Category:</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Product Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ width: "100%", padding: "8px" }}
            />
            {imageFile && (
              <p style={{ marginTop: "5px", color: "green" }}>
                Selected: {imageFile.name}
              </p>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Product"}
          </button>
        </form>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
        {products.map((p) => (
          <div key={p._id} style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px" }}>
            {p.image && (
              <img 
                src={`https://e-commerce-er9b.onrender.com${p.image}`} 
                alt={p.name}
                style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "4px" }}
              />
            )}
            {!p.image && (
              <div style={{ width: "100%", height: "200px", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px" }}>
                <span style={{ fontSize: "40px" }}>🛍️</span>
              </div>
            )}
            <h3 style={{ marginTop: "10px" }}>{p.name}</h3>
            <p>Price: ${p.price}</p>
            <p>Stock: {p.stock}</p>
            <button
              onClick={() => handleDelete(p._id)}
              className="btn btn-danger"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}

export default AdminProducts;
