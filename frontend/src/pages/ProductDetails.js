import React, { useState, useEffect } from "react";
import Layout from "./../components/Layouts/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/ProductDetails.css"; // Custom styles

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products || []);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="product-details container my-5">
        {/* Product Details */}
        <div className="row align-items-center">
          <div className="col-md-6 ">
            <img
              src={`/api/v1/product/product-photo/${product._id}`}
              className="img-fluid rounded shadow"
              alt={product.name}
            />
          </div>
          <div className="col-md-6">
            <h1 className="product-title mb-4">Product Details</h1>
            <p>
              <strong>Name:</strong> {product.name}
            </p>
            <p>
              <strong>Description:</strong> {product.description}
            </p>
            <p>
              <strong>Price:</strong> Rs. {product.price}
            </p>
            <p>
              <strong>Category:</strong> {product?.category?.name}
            </p>
            <p>
              <strong>Stock: {product.quantity > 0 ? "In Stock" : "Out of Stock"}</strong>
            </p>
            <button className="btn btn-primary mt-3 px-4 py-2">Add to Cart</button>
          </div>
        </div>

        {/* Similar Products */}
        <hr className="my-5" />
        <div className="similar-products">
          <h3 className="mb-4">Similar Products</h3>
          {relatedProducts.length === 0 ? (
            <p className="text-muted">No similar products found.</p>
          ) : (
            <div className="row">
              {relatedProducts.map((p) => (
                <div className="col-md-4 mb-4" key={p._id}>
                  <div className="card product-card h-100">
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text">
                        {p.description.substring(0, 50)}...
                      </p>
                      <p className="card-text">
                       Rs. <strong>{p.price}</strong>
                      </p>
                      <div className="d-flex">
                        <button
                          className="btn btn-outline-primary me-2"
                          onClick={() => navigate(`/product/${p.slug}`)}
                        >
                          More Details
                        </button>
                        {/* {add to cart functuonality} */}
                        
                        <button className="btn btn-secondary">Add to Cart</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
