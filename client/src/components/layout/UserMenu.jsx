import React from "react";
import { NavLink } from "react-router-dom";

const UserMenu = () => {
  return (
    <div>
      <div className="text-center">
        <div className="list-group">
          <h4>Dashboard</h4>
          <NavLink
            to="/dashboard/user/profile"
            className="list-group-item list-group-item-action active"
            aria-current="true"
          >
            profile
          </NavLink>
          <NavLink
            to="/dashboard/user/orders "
            className="list-group-item list-group-item-action"
          >
            orders
          </NavLink>
          <NavLink
            to="/dashboard/admin/create-product "
            className="list-group-item list-group-item-action"
          >
            Create Product
          </NavLink>

          <NavLink
            className="list-group-item list-group-item-action disabled"
            aria-disabled="true"
          >
            A disabled link item
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
