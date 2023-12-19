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
      <div className="h-screen flex items-center justify-center    ">
        <div className="grid grid-cols-2 gap-2 rounded-lg   h-3/4  ">
          <div
            className={
              view !== "login"
                ? "animate__animated animate__rubberBand  btn  justify-center items-center flex w-full h-12 "
                : "animate__animated animate__rubberBand  btn btn-primary hover:btn-primary justify-center items-center flex w-full h-12 "
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
                ? "animate__animated animate__rubberBand  btn  justify-center items-center flex w-full h-12 "
                : "animate__animated animate__rubberBand   btn btn-primary hover:btn-primary justify-center items-center flex w-full h-12 "
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
            {view == "login" ? <Login /> : <Signup setView={setView} />}
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default Home;
