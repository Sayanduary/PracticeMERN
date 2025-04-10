import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";  // Your custom authentication context
import { Outlet, Navigate } from "react-router-dom"; // For redirection
import Spinner from "../Spinner"; // Your loading spinner component
import axios from "axios";

const AdminRoute = () => {
  const [isAuthorized, setIsAuthorized] = useState(null); // Track authorization status
  const [auth] = useAuth();

  useEffect(() => {
    const checkAdminAuth = async () => {
      if (auth?.token) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/v1/auth/admin-auth`,
            {
              headers: {
                Authorization: `Bearer ${auth.token}`, // Ensure you prefix with "Bearer"
              },
            }
          );
          setIsAuthorized(response.data.ok); // Backend should return { ok: true }
        } catch (error) {
          console.error('Error during authorization check:', error.response ? error.response.data : error.message);
          setIsAuthorized(false); // Set false if an error occurs
        }
      } else {
        setIsAuthorized(false); // No token, cannot access
      }
    };

    checkAdminAuth();
  }, [auth?.token]);

  // While checking, show the spinner
  if (isAuthorized === null) {
    return <Spinner path="" />;
  }

  // Redirect if not authorized
  if (!isAuthorized) {
    return <Navigate to="/unauthorized" replace />; // Redirect to an unauthorized page or a login page
  }

  // If authorized, render the child routes
  return <Outlet />;
};

export default AdminRoute;