import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet";
import { ToastContainer } from "react-toastify";

function Layout({ children, title, description, keywords, author }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>
      <Header />
      <main className="flex-grow">
        <ToastContainer />
        {children}
      </main>

      <Footer />
    </div>
  );
}

Layout.defaultProps = {
  title: "FarmNest App",
  description: "Mern Stack",
  keywords: "mern,react,node,mongodb",
  author: "ByteBusters",
};

export default Layout;
