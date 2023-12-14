import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import Login from "./Login";
import Signup from "./Signup";

const Home = () => {
  const [view, setView] = useState("login");
  const queryClient = new QueryClient();
  const handlesubmit = (newview) => {
    setView(newview);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen flex items-center justify-center bg-[url('/greenwave.svg')] bg-cover bg-center lg:bg-fixed font-sans  ">
        <div className="grid grid-cols-2 rounded-lg   h-3/4  text-neutral">
          <div
            className={
              view !== "login"
                ? "animate__animated animate__fadeInDown hover:underline hover:decoration-success hover:text-success font-semibold hover:decoration-4 group w-40 h-24 rounded-full hover:border-4 border-transparent hover:border-x-success justify-center items-center flex"
                : "animate__animated animate__fadeInDown underline decoration-success text-success font-semibold decoration-4 group w-40 h-24 rounded-full border-4 border-transparent border-x-success justify-center items-center flex"
            }
            onClick={() => handlesubmit("login")}
          >
            <img
              src="https://img.icons8.com/isometric/50/password.png"
              alt="Default Image"
              className="w-50 h-50 "
            />

            <p className="">Login</p>
          </div>

          <div
            className={
              view === "login"
                ? "animate__animated animate__fadeInDown hover:underline hover:decoration-success hover:text-success font-semibold hover:decoration-4 group w-40 h-24 rounded-full hover:border-4 border-transparent hover:border-x-success justify-center items-center flex"
                : "animate__animated animate__fadeInDown underline decoration-success text-success font-semibold decoration-4 group w-40 h-24 rounded-full border-4 border-transparent border-x-success justify-center items-center flex"
            }
            onClick={() => handlesubmit("signup")}
          >
            <img
              src="https://img.icons8.com/isometric/50/book-shelf.png"
              alt="Default Image"
              className="w-50 h-50 "
            />
            Sign up
          </div>

          <div className="col-span-2">
            {view == "login" ? <Login /> : <Signup />}
          </div>

          {/* <div className=" animate__animated animate__fadeInRight    hover:underline hover:decoration-indigo-500 hover:text-indigo-500 text-3xl font-semibold hover:decoration-4 group ">
            <img
              src="https://img.icons8.com/isometric/50/about.png"
              alt="Default Image"
              className="w-50 h-50 "
            />
            About
          </div> */}
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default Home;
