import React, { useEffect, useState } from "react";
import Layout from "./../components/Layouts/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import "./styles/cartpage.css";

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Retrieve cart
  useEffect(() => {
    if (auth?.token) {
      const savedCart = JSON.parse(localStorage.getItem("cart"));
      if (savedCart) setCart(savedCart);
    } else {
      const savedCart = JSON.parse(sessionStorage.getItem("cart"));
      if (savedCart) setCart(savedCart);
    }
  }, [auth?.token, setCart]);

  // Store cart
  useEffect(() => {
    if (cart.length > 0) {
      if (auth?.token) {
        localStorage.setItem("cart", JSON.stringify(cart));
      } else {
        sessionStorage.setItem("cart", JSON.stringify(cart));
      }
    }
  }, [cart, auth?.token]);

  // Calculate total price for all cart items
  const totalPrice = () =>
    cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toLocaleString("en-US", { style: "currency", currency: "USD" });

  // Calculate total price for selected items
  const selectedTotalPrice = () =>
    cart
      .filter((item) => selectedItems.includes(item._id))
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toLocaleString("en-US", { style: "currency", currency: "USD" });

  // Update product quantity
  const updateQuantity = (pid, quantity) => {
    if (quantity <= 0) return;
    const updatedCart = cart.map((item) =>
      item._id === pid ? { ...item, quantity } : item
    );
    setCart(updatedCart);
  };

  // Remove a product from the cart
  const removeCartItem = (pid) => {
    const updatedCart = cart.filter((item) => item._id !== pid);
    setCart(updatedCart);
    setSelectedItems(selectedItems.filter((id) => id !== pid));
  };

  // Clear the entire cart
  const clearCart = () => {
    setCart([]);
    setSelectedItems([]);
    if (auth?.token) {
      localStorage.removeItem("cart");
    } else {
      sessionStorage.removeItem("cart");
    }
  };

  // Handle product selection
  const handleSelection = (pid) => {
    setSelectedItems((prev) =>
      prev.includes(pid) ? prev.filter((id) => id !== pid) : [...prev, pid]
    );
  };

  // Handle payment
  const handlePayment = async () => {
    try {
      setLoading(true);
      const selectedProducts = cart.filter((item) =>
        selectedItems.includes(item._id)
      );

      const response = await axios.post("/api/v1/payment/create", {
        amount: selectedTotalPrice(),
        cart: selectedProducts,
        userId: auth?.user?._id,
      });

      if (response.data.success) {
        window.location.href = response.data.paymentUrl;
      } else {
        alert("Payment failed. Please try again later.");
      }
    } catch (error) {
      alert("Error initiating payment. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Cart">
      <div className="container mt-4">
        <div className="text-center">
          <h1 className="bg-light p-3 rounded">
            {auth?.token ? `Hello, ${auth?.user?.name}` : "Welcome to the Cart Page"}
          </h1>
          <h4 className="text-muted">
            {cart.length
              ? `You have ${cart.length} item${cart.length > 1 ? "s" : ""} in your cart`
              : "Your Cart is Empty"}
          </h4>
        </div>

        {cart.length ? (
          <div className="row">
            {/* Cart Items */}
            <div className="col-md-8">
              {cart.map((item) => (
                <div
                  className="card mb-3 shadow-sm p-3 d-flex flex-row align-items-center"
                  key={item._id}
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item._id)}
                    onChange={() => handleSelection(item._id)}
                  />
                  <img
                    src={`/api/v1/product/product-photo/${item._id}`}
                    alt={item.name}
                    className="rounded"
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                  <div className="flex-grow-1 ms-3">
                    <h5>{item.name}</h5>
                    <p className="text-muted mb-1">
                      {item.description.substring(0, 50)}...
                    </p>
                    <p className="mb-1">Price: ${item.price.toFixed(2)}</p>
                    <div className="d-flex align-items-center">
                      <input
                        type="number"
                        value={item.quantity}
                        min="1"
                        className="form-control me-3"
                        style={{ width: "80px" }}
                        onChange={(e) =>
                          updateQuantity(item._id, parseInt(e.target.value) || 1)
                        }
                      />
                      <FaTrashAlt
                        className="text-danger"
                        style={{ cursor: "pointer" }}
                        onClick={() => removeCartItem(item._id)}
                      />
                    </div>
                  </div>
                  <h6 className="text-primary ms-3">
                    Total: ${(item.price * item.quantity).toFixed(2)}
                  </h6>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="col-md-4">
              <div className="card p-4 shadow-sm">
                <h3 className="text-center mb-3">Cart Summary</h3>
                <h5>Total Items: {cart.length}</h5>
                <h5>Total Selected Items: {selectedItems.length}</h5>
                <h4 className="my-3">
                  Total Price: {totalPrice()}
                </h4>
                <h4 className="my-3">
                  Selected Total: {selectedTotalPrice()}
                </h4>
                <button
                  className="btn btn-danger btn w-100 mb-2"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>

                {auth?.token && (
                  <button
                    className="btn btn-success btn w-100"
                    onClick={handlePayment}
                    disabled={!selectedItems.length || loading}
                  >
                    {loading ? "Processing Payment..." : "Proceed with Selected Items"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center mt-5">
            <img
              src="https://i.imgur.com/dCdflKN.png"
              alt="Empty Cart"
              style={{ width: "150px" }}
            />
            <h3>Your Cart is Empty</h3>
            <button
              className="btn btn-primary mt-3"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
