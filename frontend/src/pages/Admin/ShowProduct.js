import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layouts/Layout";
import AdminMenu from "./../../components/Layouts/AdminMenu";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';


const ShowProduct = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Get all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/get-product");
      if (data?.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const handleDelete = async (productId) => {
    try {
      let answer = window.confirm("Are you sure you want to delete this product?");
      if (!answer) return;

      const { data } = await axios.delete(`/api/v1/product/delete-product/${productId}`);
      if (data?.success) {
        toast.success("Product deleted successfully");
        setProducts(products.filter(product => product._id !== productId));
       
      } else {
        toast.error("Failed to delete product");
        alert("failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Dashboard - Manage Products"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="p-3 w-50">
              <NavLink to="/dashboard/admin/create-product/" className="btn btn-primary">
                Create Product
              </NavLink>
            </div>
            <div className="w-75">
              <h2 className="text-center">Manage Products</h2>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Category</th>
                    <th scope="col">Images</th>
                    <th scope="col">Price</th>
                    <th scope="col">Stock</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>{product.category?.name}</td>
                        <td>
                          <img
                            src={`/api/v1/product/product-photo/${product._id}`}
                            alt={product.name}
                            width={'150px'}
                          />
                        </td>
                        <td>{product.price}</td>
                        <td>{product.quantity}</td>
                        <td>
                          <NavLink
                            to={`/dashboard/admin/edit-product/${product.slug}`}
                            className="btn btn-warning btn-sm"
                          >
                            Edit
                          </NavLink>
                          <button
  className="btn btn-danger btn-sm ms-2"
  onClick={() => {
    handleDelete(product._id);
  }}
>
  Delete
</button>

                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
   
    </Layout>
  );
};

export default ShowProduct;
