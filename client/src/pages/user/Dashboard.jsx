import React from "react";
import Layout from "../../components/layout/Layout";
import UserMenu from "../../components/layout/UserMenu";
import { useAuth } from "../../context/auth";

const Dashboard = () => {
  const [auth] = useAuth();

  return (
    <Layout title={"Dashboard - FarmNest"}>
      <div className="container-fluid p-3 m-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3">
              <h3>Name: {auth?.user?.name}</h3>
              <p>Email: {auth?.user?.email}</p>
              <p>Address:</p>
              <p>Street: {auth?.user?.address?.street}</p>
              <p>City: {auth?.user?.address?.city}</p>
              <p>Postal Code: {auth?.user?.address?.postalCode}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;