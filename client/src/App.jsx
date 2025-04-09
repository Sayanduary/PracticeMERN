import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import PolicyPage from "./pages/Policy";
import PageNotFound from "./pages/PageNotFound";
import login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/auth/Dashboard";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<PolicyPage />} />
        <Route path="/register" element={<PolicyPage />} />
        <Route path="/login" element={<PolicyPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/policy" element={<PolicyPage />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
