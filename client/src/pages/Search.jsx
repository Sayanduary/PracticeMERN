import React from 'react'
import Layout from '../components/layout/Layout'
import { useSearch } from '../context/Search'

const Search = () => {
    const [values,setValues]=useSearch()
  return (
    <Layout title={'Search results'}>
        <div className="container">
            <div className="text-center">
                <h1>Search Results</h1>
                <h6>{values?.results.length<1? 'no products found' : `Found ${values?.results.length}`}</h6>

                <div className="d-flex flex-wrap justify-content-center mt-4">
                            {values?.results.map((p) => (
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
            </div>
        </div>
      
    </Layout>
  )
}

export default Search
