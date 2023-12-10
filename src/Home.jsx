import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
const Home = () => {
  console.log("home");
  return (
    <>
      <div className="h-screen flex items-center justify-center bg-[url('/greenwave.svg')] bg-cover bg-center bg-fixed font-sans ">
        <div className="grid grid-cols-1 p-4 gap-4 rounded-lg mb-16">
          <Link to="/Login">
            <div className=" animate__animated animate__fadeInRight   hover:underline hover:decoration-green-500 hover:text-green-500 text-3xl font-semibold hover:decoration-4 group w-80 h-24 rounded-full hover:border-4 border-transparent hover:border-x-green-500 justify-center items-center flex">
              <img
                src="https://img.icons8.com/isometric/50/password.png"
                alt="Default Image"
                className="w-50 h-50  "
              />

              <p className="">Login</p>
            </div>
          </Link>
          <Link to="/Signup">
            <div className=" animate__animated animate__fadeInLeft   hover:underline hover:decoration-orange-500 hover:text-orange-500 text-3xl font-semibold hover:decoration-4 group w-80 h-24 rounded-full hover:border-4 border-transparent hover:border-x-orange-500 justify-center items-center flex group w-80 h-24 rounded-full hover:border-4 border-transparent hover:border-x-green-500 justify-center items-center flex">
              <img
                src="https://img.icons8.com/isometric/50/book-shelf.png"
                alt="Default Image"
                className="w-50 h-50 "
              />
              Sign up
            </div>
          </Link>
          <div className=" animate__animated animate__fadeInRight    hover:underline hover:decoration-indigo-500 hover:text-indigo-500 text-3xl font-semibold hover:decoration-4 group w-80 h-24 rounded-full hover:border-4 border-transparent hover:border-x-indigo-500 justify-center items-center flex group">
            <img
              src="https://img.icons8.com/isometric/50/about.png"
              alt="Default Image"
              className="w-50 h-50 "
            />
            About
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
