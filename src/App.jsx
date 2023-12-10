import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import ReactDOM from "react-dom/client";
import Login from "./Login";
import Profile from "./Profile";
import Home from "./Home";
import Signup from "./Signup";
import Layout from "./Layout";
const queryClient = new QueryClient();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" index element={<Home />} />

            <Route path="/Login" element={<Login />} />
            <Route
              path="/Signup"
              element={
                <QueryClientProvider client={queryClient}>
                  <Signup />
                </QueryClientProvider>
              }
            />
            <Route path="/Profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
