import React from "react";
import { NavLink } from "react-router-dom";

const AdminMenu = () => {
  return (
    <>
      <div className="text-center">
        <div className="list-group">
          <NavLink
            to="/dashboard/admin/create-category "
            className="list-group-item list-group-item-action"
          >
            Create Catagory
          </NavLink>
          <NavLink
            to="/dashboard/admin/create-product "
            className="list-group-item list-group-item-action"
          >
            Create Product
          </NavLink>
          <NavLink
            to="/dashboard/admin/users"
            className="list-group-item list-group-item-action"
          >
            Users
          </NavLink>
          <NavLink
            to="/dashboard/admin/products "
            className="list-group-item list-group-item-action"
          >
            Products
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default AdminMenu;
