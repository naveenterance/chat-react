import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
const Home = () => {
  console.log("home");
  return (
    <>
      <div>Welcome</div> <Link to="/Login">Login</Link>
      <Link to="/Signup">Signup</Link>
    </>
  );
};

export default Home;
