import React from "react";
import Layout from "../components/layout/Layout";
import { useCart } from "../context/Cart";
import { useAuth } from "../context/auth";
import { useNavigate, useLocation } from "react-router-dom";

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.forEach((item) => {
        total += item?.price || 0;
      });
      return total.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // delete item
  const removeCartItem = (pid) => {
    try {
      const updatedCart = cart.filter((item) => item._id !== pid);
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="container my-4">
        <div className="row">
          <div className="col-md-12 text-center">
            <h2 className="bg-light p-2 mb-2">
              {auth?.token ? `Hello, ${auth?.user?.name}` : "Welcome to Cart"}
            </h2>
            <h5>
              {cart?.length
                ? `You have ${cart.length} item(s) in your cart`
                : "Your cart is empty"}
            </h5>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-8">
            {cart?.map((p) => (
              <div className="card flex-row p-3 mb-3" key={p._id}>
                <div className="col-md-4">
                  <img
                    src={`${
                      import.meta.env.VITE_API_URL
                    }/api/v1/product/product-photo/${p._id}`}
                    className="img-fluid"
                    alt={p.name}
                    style={{ height: "150px", objectFit: "cover" }}
                  />
                </div>
                <div className="col-md-8">
                  <h5>{p.name}</h5>
                  <p>{p.description?.substring(0, 60)}...</p>
                  <p className="fw-bold">Price: ₹{p.price}</p>
                  <button
                    className="btn btn-sm btn-danger mt-2"
                    onClick={() => removeCartItem(p._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-4 text-center">
            <h3>Cart Summary</h3>
            <p>Total | Checkout | Payment</p>
            <hr />
            <h5>Total: {totalPrice()}</h5>
            {auth?.user?.address?.street ? (
              <>
                <div className="mb-3">
                  <h5>Shipping to:</h5>
                  <p>Street: {auth?.user?.address?.street}</p>
                  {auth?.user?.address?.city && <p>City: {auth?.user?.address?.city}</p>}
                  {auth?.user?.address?.postalCode && <p>Postal Code: {auth?.user?.address?.postalCode}</p>}
                  <button
                    className="btn btn-outline-warning btn-sm"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                </div>
              </>
            ) : (
              <div className="mb-3">
                {auth?.token ? (
                  <button
                    className="btn btn-outline-warning btn-sm"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Add Address to Checkout
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() =>
                      navigate("/login", {
                        state: location.pathname,
                      })
                    }
                  >
                    Please Login to Checkout
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;