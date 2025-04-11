import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState({});

  useEffect(() => {
    if (params?.slug) {
      getProductsByCat();
    }
  }, [params?.slug]);

  const getProductsByCat = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/product/product-category/${params.slug}`
      );
      setProducts(data?.products || []);
      setCategory(data?.category || {});
    } catch (error) {
      console.log(error);
      toast.error("Failed to load products");
    }
  };

  return (
    <Layout>
      <div className="container">
        <h4 className="text-center mt-3">Category - {category?.name}</h4>
        <h6 className="text-center mb-4">{products?.length} result(s) found</h6>
        <div className="row justify-content-center">
          {products?.map((p) => (
            <div className="card m-2" style={{ width: "18rem" }} key={p._id}>
              <img
                src={`${import.meta.env.VITE_API_URL}/api/v1/product/product-photo/${p._id}`}
                className="card-img-top"
                alt={p.name}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">{p.description.substring(0, 60)}...</p>
                  <p className="card-text fw-bold">₹{p.price}</p>
                </div>
                <div className="d-flex gap-2 mt-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    More Details
                  </button>
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
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <p className="text-center">No products found in this category.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProduct;
