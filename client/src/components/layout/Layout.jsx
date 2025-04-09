import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet";

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
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;