import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import PolicyPage from "./pages/Policy";
import PageNotFound from "./pages/PageNotFound";
import Register from "./pages/Auth/Register";
import LoginPage from "./pages/Auth/LoginPage";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Dashboard from "./pages/user/Dashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import PrivateRoute from "./components/routes/Private";
import AdminRoute from "./components/routes/AdminRoute";
import Orders from "./pages/user/Orders";
import "react-toastify/dist/ReactToastify.css";
import CreateCategory from "./pages/Admin/CreateCatagory";
import CreateProduct from "./pages/Admin/CreateProduct";
import Profile from "./pages/user/Profile";
import Users from "./pages/Admin/Users";
import ForgotPasssword from "./pages/Auth/ForgotPassword";
import Login from "./pages/Auth/LoginPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Policy from "./pages/Policy";
import Pagenotfound from "./pages/PageNotFound";
import Products from "./pages/Admin/Products";
import UpdateProduct from "./pages/Admin/UpdateProduct.jsx";
import Search from "./pages/Search.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Categories from "./pages/Categories.jsx";
import CategoryProduct from "./pages/CategoryProduct.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:slug" element={<ProductDetails/>} />
        <Route path="/categories/:slug" element={<Categories/>} />
        <Route path="/category/:slug" element={<CategoryProduct/>} />
        <Route path="/search" element={<Search/>}></Route>
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="user" element={<Dashboard />} />
          <Route path="user/orders" element={<Orders />} />
          <Route path="user/profile" element={<Profile />} />
        </Route>
        <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/create-category" element={<CreateCategory />} />
          <Route path="admin/create-product" element={<CreateProduct />} />
          <Route path="admin/product/:slug" element={<UpdateProduct />} />
          <Route path="admin/products" element={<Products />} />
          <Route path="admin/users" element={<Users />} />
        </Route>

        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPasssword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="*" element={<Pagenotfound />} />
      </Routes>
    </>
  );
}

export default App;
