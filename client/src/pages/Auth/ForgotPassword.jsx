import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import "../../styles/AuthStyle.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newpassword, setnewPassword] = useState("");
  const [answer, setAnswer] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/forgot-password`,
        {
          email,
          newpassword,
          answer,
        },
        { withCredentials: true }
      );

      if (res && res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Password Reset Failed");
    }
  };

  return (
    <Layout title={"Forgot Password - Ecommerce App"}>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h4 className="title">Reset Password</h4>

          <div className="mb-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="Enter Your Email"
              required
              autoFocus
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="form-control"
              placeholder="Enter Your Birth Date"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              value={newpassword}
              onChange={(e) => setnewPassword(e.target.value)}
              className="form-control"
              placeholder="Enter New Password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            RESET
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
