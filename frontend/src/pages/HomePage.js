import React, { useState, useEffect } from "react";
import Layout from "./../components/Layouts/Layout";
import axios from "axios";
import { Checkbox, Slider } from "antd";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import { ToastContainer, toast } from 'react-toastify';
import "./styles/homepage.css"; // Custom styles


const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([0, 10000]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useCart();

  const navigate = useNavigate();

  // Fetch all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) setCategories(data?.category);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch total products count
  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
    getAllProducts();
  }, []);

  useEffect(() => {
    if (page > 1) loadMore();
  }, [page]);

  // Load more products
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts((prevProducts) => [...prevProducts, ...data?.products]);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // Filter by category
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) all.push(id);
    else all = all.filter((c) => c !== id);
    setChecked(all);
  };

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
    else getAllProducts();
  }, [checked, radio]);

  // Fetch filtered products
  const filterProduct = async () => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filters", {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.error(error);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setChecked([]);
    setRadio([0, 10000]);
    getAllProducts();
  };

  // Navigate to product details page
  const goToProductDetails = (p) => {
    navigate(`/product/${p.slug}`);
  };

  // Add product to cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item._id === product._id);

      if (existingProduct) {
        // If product exists, increase its quantity
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new product with quantity 1
        toast.success("Item added to cart!");
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Render
  return (
    <Layout title={"All Products - Best offers"}>
      <div className="container-fluid row mt-3">
        <div className="col-md-2">
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
                checked={checked.includes(c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          <h4 className="text-center mt-4">Filter By Price</h4>
          <Slider
            range
            min={0}
            max={10000}
            value={radio}
            onChange={(value) => setRadio(value)}
          />
          <button className="btn btn-danger mt-3" onClick={resetFilters}>
            RESET FILTERS
          </button>
        </div>
        <div className="col-md-9">
  <h1 className="text-center">All Products</h1>
  <div className="row">
    {products.length ? (
      products.map((p) => (
        <div
          key={p._id}
          className="col-md-3 mb-4 d-flex justify-content-center"
        >
          <div className="card product-card" style={{ width: "18rem" }}>
            <img
              src={`/api/v1/product/product-photo/${p._id}`}
              className="card-img-top"
              alt={p.name}
              style={{ height: "200px", objectFit: "cover" }}
            />
            <div className="card-body">
              <h5 className="card-title">{p.name}</h5>
              <p className="card-text">{p.description.substring(0, 30)}...</p>
              <p className="card-text">RS {p.price}</p>

              {/* Button to navigate to product details page */}
              <button
                className="btn btn-primary mb-2 product-btn"
                onClick={() => goToProductDetails(p)}
              >
                More Details
              </button>

              {/* Button to add product to cart */}
              <button
                className="btn btn-secondary product-btn"
                onClick={() => addToCart(p)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))
    ) : (
      <p>No products found</p>
    )}
  </div>
  <div className="m-2 p-3 text-center">
    {products.length < total && (
      <button
        className="btn btn-warning"
        onClick={() => setPage(page + 1)}
      >
        {loading ? "Loading ..." : "Load more"}
      </button>
    )}
  </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
