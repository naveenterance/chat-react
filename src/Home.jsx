import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
const Home = () => {
  return (
    <>
      <div>Welcome</div> <Link to="/Login">Login</Link>
    </>
  );
};

export default Home;
