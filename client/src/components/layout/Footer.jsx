import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container text-center">
        <h5>All Rights Reserved &copy; Techinfoyt</h5>
        <p className="mt-2">
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/policy">Privacy Policy</Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;