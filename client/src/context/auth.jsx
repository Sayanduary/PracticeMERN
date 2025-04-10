import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });


axios.defaults.headers.common['Authorization']=auth?.token




useEffect(() => {
  const data = localStorage.getItem("auth");
  if (data) {
    const parsed = JSON.parse(data);
    setAuth({
      user: parsed.user,
      token: parsed.token,
    });
    // ✅ set axios token only after reading from localStorage
    axios.defaults.headers.common["Authorization"] = `Bearer ${parsed.token}`;
  }
}, []);
 // ✅ Dependency array ensures it runs only once

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
const useAuth = () => useContext(AuthContext);

// eslint-disable-next-line react-refresh/only-export-components
export { useAuth, AuthProvider };
