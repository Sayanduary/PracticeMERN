import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const params = useParams();
  const [product, setProduct] = useState({});
  const navigate = useNavigate();
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/product/get-product/${
          params.slug
        }`
      );
      setProduct(data?.product);
      getSimilarProducts(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  const getSimilarProducts = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="row container mt-3">
        {product && product._id ? (
          <>
            <div className="col-md-5">
              <img
                src={`${
                  import.meta.env.VITE_API_URL
                }/api/v1/product/product-photo/${product._id}`}
                className="card-img-top img-fluid"
                alt={product.name}
                style={{ height: "200px", objectFit: "cover" }}
              />
            </div>
            <div className="col-md-6">
              <h1 className="text-center">Product Details</h1>
              <h6>Name: {product.name}</h6>
              <h6>Description: {product.description}</h6>
              <h6>Price: ₹{product.price}</h6>
              <h6>Category: {product.category?.name}</h6>
              <button
                className="btn btn-secondary ms-1"
                onClick={() => {
                  let cart = JSON.parse(localStorage.getItem("cart")) || [];
                  cart.push(product);
                  localStorage.setItem("cart", JSON.stringify(cart));
                  toast.success("Added to cart");
                }}
              >
                ADD TO CART
              </button>
            </div>
          </>
        ) : (
          <p className="text-center">Loading product...</p>
        )}
      </div>

      <hr />

      <div className="row container">
        <h6>Similar Products</h6>
        {relatedProducts.length < 1 && (
          <p className="text-center">No similar products found</p>
        )}
        <div className="d-flex flex-wrap justify-content-center">
          {relatedProducts?.map((p) => (
            <div className="card m-2" style={{ width: "18rem" }} key={p._id}>
              <img
                src={`${
                  import.meta.env.VITE_API_URL
                }/api/v1/product/product-photo/${p._id}`}
                className="card-img-top"
                alt={p.name}
                style={{ height: "200px", objectFit: "cover" }}
              />

              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">
                  {p.description?.substring(0, 60)}...
                </p>
                <p className="card-text fw-bold">₹{p.price}</p>
                <div className="d-flex justify-content-between gap-2 mt-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    let cart = JSON.parse(localStorage.getItem("cart")) || [];
                    cart.push(p);
                    localStorage.setItem("cart", JSON.stringify(cart));
                    toast.success("Added to cart");
                  }}
                >
                  Add to Cart
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/product/${p.slug}`)}
                >
                  More Details
                </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
