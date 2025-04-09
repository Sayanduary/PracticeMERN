import React from "react";
import {NavLink} from 'react-router-dom'

function Header() {
  return (
    <>
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
      <NavLink to ='/'class="navbar-brand" href="#">Hidden brand</NavLink>
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <NavLink to ='/'class="nav-link active" aria-current="page" href="#">Home</NavLink>
        </li>
        <li class="nav-item">
          <NavLink to ='/'class="nav-link" href="#">Link</NavLink>
        </li>
        <li class="nav-item">
          <NavLink to ='/'class="nav-link disabled" aria-disabled="true">Disabled</NavLink>
        </li>
      </ul>
      
    </div>
  </div>
</nav>
    </>
  );
}

export default Header;
