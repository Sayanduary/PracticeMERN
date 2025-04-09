import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import { ContactPage } from "./pages/Contact";
import {PolicyPage} from './pages/Policy'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={ContactPage} />
        <Route path="/policy" element={PolicyPage}/>
        <Route pa/>
      </Routes>
    </>
  );
}

export default App;
