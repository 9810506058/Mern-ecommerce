import Layout from "./../components/Layouts/Layout";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./styles/ProductDetails.css"; // Custom styles
import { useNavigate } from "react-router-dom";



const CategoryProduct = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState({ name: "" });
  const { slug } = useParams(); // Destructure slug from URL parameters
const navigate=useNavigate();
  const getProductByCategory = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/product-category/${slug}`);
      if (data?.success) {
        setProducts(data.products || []);
        setCategory(data.category || { name: "" });
      } else {
        console.error("Failed to fetch products for the category");
      }
    } catch (error) {
      console.error("Error fetching category products:", error);
    }
  };

  useEffect(() => {
    getProductByCategory();
  }, [slug]); // Re-run when slug changes

  return (
    <Layout>
      <div className="container my-4">
        {/* Category Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold">{category?.name || "Category"}</h1>
          <p className="text-muted">Explore our exclusive range of {category?.name} products.</p>
        </div>

        {/* Product List */}
        <div className="row g-4">
          {products?.length > 0 ? (
            products.map((product) => (
              <div className="col-md-4" key={product._id}>
              
                  <div className="card product-card h-100">
                    <img
                      src={`/api/v1/product/product-photo/${product._id}`}
                      className="card-img-top"
                      alt={product.name}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text">
                        {product.description.substring(0, 50)}...
                      </p>
                      <p className="card-text">
                       Rs. <strong>{product.price}</strong>
                      </p>
                      <div className="d-flex">
                        <button
                          className="btn btn-outline-primary me-2"
                          onClick={() => navigate(`/product/${product.slug}`)}
                        >
                          More Details
                        </button>
                        <button className="btn btn-secondary">Add to Cart</button>
                      </div>
                    </div>
                  </div>
               
              </div>
            ))
          ) : (
            <div className="text-center">
             
              <p className="text-muted">No products available in this category. Check back later!</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProduct;
