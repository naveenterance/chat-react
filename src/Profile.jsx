import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const Profile = () => {
  const token = localStorage.getItem("token");

  // Check if the token is present and valid
  try {
    jwt.verify(token, "your-secret-key");
  } catch (error) {
    // Redirect to the login page if the token is invalid or missing
    return <Navigate to="/" />;
  }

  return <div>Login successful</div>;
};

export default Profile;
