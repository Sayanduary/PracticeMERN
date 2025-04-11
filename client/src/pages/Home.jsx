/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setCheked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/category/get-category`
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Get total products count
  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/product/product-count`
      );
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch all products by page
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      if (data?.success) {
        if (page === 1) {
          setProducts(data.products);
        } else {
          setProducts((prev) => [...prev, ...data.products]);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching products:", error);
    }
  };

  // Filters
  const handleFilter = (checkedValue, id) => {
    let all = [...checked];
    if (checkedValue) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setCheked(all);
  };

  const filterProducts = async () => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/product/product-filter`,
        { checked, radio }
      );
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  // Initial Load
  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  // Load more on page change
  useEffect(() => {
    if (!checked.length && !radio.length) {
      getAllProducts();
    }
  }, [page]);

  // Filter watcher
  useEffect(() => {
    if (checked.length || radio.length) filterProducts();
  }, [checked, radio]);

  return (
    <Layout title={"All Products - Best Offers"}>
      <div className="row mt-3">
        {/* Filters */}
        <div className="col-md-2">
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>

          <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>

          <div className="d-flex flex-column">
            <button
              className="btn btn-danger mt-4"
              onClick={() => window.location.reload()}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Product List */}
        <div className="col-md-9">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap justify-content-center">
            {products?.map((p) => (
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
                    {p.description.substring(0, 60)}...
                  </p>
                  <p className="card-text fw-bold">₹{p.price}</p>
                  <button
                    className="btn btn-primary me-2"
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
            ))}
          </div>

          {/* Load More or No More Message */}
          <div className="m-2 p-3 text-center">
            {!checked.length && !radio.length && (
              <>
                {products.length < total ? (
                  <button
                    className="btn btn-warning"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((prev) => prev + 1);
                    }}
                  >
                    {loading ? "Loading ..." : "Load More"}
                  </button>
                ) : (
                  <p className="text-muted mt-3">No more products to show.</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
