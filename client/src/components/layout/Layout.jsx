import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet";

function Layout({ children, title, description, keywords, author }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <div>
          <meta charSet="utf-8" />
          <meta name="description" content="Farmer" />
          <meta name="keywords" content="HTML, CSS, JavaScript" />
          <meta name="author" content="John Doe" />
          <title>My Title</title>
        </div>
      </Helmet>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
