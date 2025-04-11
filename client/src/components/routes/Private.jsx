import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import Spinner from "../Spinner";
import axios from "axios";

const PrivateRoute = () => {
  const [ok, setOk] = useState(false);
  const [auth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/auth/user-auth`,
          {
            headers: {
              // eslint-disable-next-line no-constant-binary-expression
              Authorization: `Bearer ${auth?.token}` || "",
            },
          }
        );
        setOk(res.data.ok);
      } catch (err) {
        setOk(false);
        console.error("Auth Check Failed:", err.response?.data || err.message);
      }
    };
  
    if (auth?.token) authCheck();
  }, [auth?.token]);
  
  return ok ? <Outlet /> : <Spinner />;
};

export default PrivateRoute;
