import React from "react";
import Layout from "../components/layout/Layout";
import { useSearch } from "../context/Search";
import { Link } from "react-router-dom";

const Search = () => {
  const [values, _, __, loading, error] = useSearch();

  return (
    <Layout title={"Search results"}>
      <div className="container">
        <div className="text-center">
          <h1>Search Results</h1>
          
          {error && (
            <div className="alert alert-warning">
              {error}
              <div className="mt-2 small">
                <strong>Troubleshooting Tips:</strong>
                <ul className="text-start">
                  <li>Make sure your backend server is running</li>
                  <li>Check Vite proxy configuration in vite.config.js</li>
                  <li>Verify API routes in your backend server</li>
                </ul>
              </div>
            </div>
          )}
          
          {loading ? (
            <p>Loading search results...</p>
          ) : (
            <h6>
              {!values?.results || values.results.length < 1
                ? `No Products Found${values.keyword ? ` for "${values.keyword}"` : ""}`
                : `Found ${values.results.length} product(s) for "${values.keyword}"`}
            </h6>
          )}
          
          <div className="d-flex flex-wrap mt-4 justify-content-center">
            {Array.isArray(values?.results) &&
              values.results.map((p) => (
                <div
                  className="card m-2"
                  style={{ width: "18rem" }}
                  key={p._id}
                >
                  <img
                    src={`${import.meta.env.VITE_API_URL}/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                    style={{ height: "200px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = "https://placehold.co/400x300?text=Product+Image";
                      e.target.onerror = null;
                    }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">
                      {p.description?.substring(0, 30)}
                      {p.description?.length > 30 ? "..." : ""}
                    </p>
                    <p className="card-text fw-bold">₹ {p.price}</p>
                    <Link to={`/product/${p.slug}`} className="btn btn-primary ms-1">
                      More Details
                    </Link>
                    <button className="btn btn-secondary ms-1">ADD TO CART</button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
