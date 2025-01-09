import React from "react";
import Layout from "../components/Layouts/Layout";
import useCategory from "../hooks/useCategory";
import { Link } from "react-router-dom";

const Categories = () => {
  const categories = useCategory(); // Fixed typo in 'Const'

  return (
    <Layout title="All Categories - Ecommerce App">
      {/* Page Header */}
      <div className="text-center my-4">
        <h1>All Categories</h1>
      </div>

      <div className="container">
        <div className="row">
          {/* Dynamic Categories */}
          {categories?.length > 0 ? (
            categories.map((category) => (
              <div className="col-md-3 mb-4" key={category._id}>
                <div className="card h-100">
                  <img
                    src={category.image || "/images/default-category.jpg"} // Default image fallback
                    alt={category.name}
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{category.name}</h5>
                    <p className="card-text">
                      {category.description || "No description available."}
                    </p>
                    <Link
                      to={`/category/${category.slug}`}
                      className="btn btn-primary"
                    >
                      View Products
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center">
              <p>No categories available at the moment.</p>
            </div>
          )}
        </div>

      
      </div>
    </Layout>
  );
};

export default Categories;
