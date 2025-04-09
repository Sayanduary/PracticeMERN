import React from "react";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/auth";

function Home() {
  const [auth, setAuth] = useAuth();
  return (
    <Layout title={"Shop Now"}>
      <h1>Homepage</h1>
      <pre>{JSON.stringify(auth, null, 4)}</pre>
    </Layout>
  );
}

export default Home;
