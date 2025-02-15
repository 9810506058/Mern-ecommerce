import React from "react";
import Layout from "../components/Layouts/Layout";
import { useSearch } from "../context/search";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast for notifications
import { useCart } from "../context/cart"; // Assuming you have a cart context

const Search = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();
  const [cart, setCart] = useCart(); // Use cart context

  // Function to navigate to product details page
  const goToProductDetails = (product) => {
    navigate(`/product/${product.slug}`);
  };

  // Function to add a product to the cart
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

  return (
    <Layout title={"Search results"}>
      <div className="container">
        <h1 className="text-center my-4">Search Results</h1>
        <div className="row">
          {values.results?.length > 0 ? (
            values.results.map((product) => (
              <div className="col-md-4 mb-4" key={product._id}>
                <div className="card product-card">
                  <img
                    src={`/api/v1/product/product-photo/${product._id}`}
                    className="card-img-top"
                    alt={product.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">
                      {product.description.substring(0, 30)}...
                    </p>
                    <p className="card-text">RS {product.price}</p>

                    {/* Button to navigate to product details page */}
                    <button
                      className="btn btn-primary mb-2 product-btn"
                      onClick={() => goToProductDetails(product)}
                    >
                      More Details
                    </button>

                    {/* Button to add product to cart */}
                    <button
                      className="btn btn-secondary product-btn"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No products found</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Search;