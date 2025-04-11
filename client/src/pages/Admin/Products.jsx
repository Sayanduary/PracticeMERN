import { useState, useEffect } from "react";
import React from "react";
import AdminMenu from "../../components/layout/AdminMenu";
import Layout from "../../components/layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/product/get-product`
      );
      setLoading(false);
      if (data?.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message || "Failed to fetch products");
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error("Error fetching products");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout title="All Products">
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center mb-4">All Products Lists</h1>

            {loading ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="row">
                {products?.length > 0 ? (
                  products.map((p) => (
                    <div className="col-md-4 mb-3" key={p._id}>
                      <div className="card h-100">
                        <Link
                          to={`/dashboard/admin/product/${p.slug}`}
                          className="text-decoration-none text-dark"
                        >
                          <img
                            src={`${import.meta.env.VITE_API_URL}/api/v1/product/product-photo/${p._id}`}
                            className="card-img-top img-fluid"
                            alt={p.name}
                            style={{ height: "200px", objectFit: "cover" }}
                          />
                          <div className="card-body">
                            <h5 className="card-title">{p.name}</h5>
                            <p className="card-text">
                              {p.description.substring(0, 60)}...
                            </p>
                            <p className="card-text">
                              <strong>Price:</strong> ₹{p.price}
                            </p>
                          </div>
                        </Link>
                        
                        </div>
                      </div>
                    
                  ))
                ) : (
                  <div className="text-center">
                    <h4>No products found</h4>
                    <Link
                      to="/dashboard/admin/create-product"
                      className="btn btn-primary mt-3"
                    >
                      Create Product
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
