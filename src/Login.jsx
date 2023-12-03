import React from "react";
import { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { Formik, Field, Form } from "formik";
// import jwt from "jsonwebtoken";

const Login = () => {
  const login = async (values) => {
    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          "Access-Control-Allow-Headers":
            "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("logged in");
        localStorage.setItem("token", data.token);
        console.log(data.token);
        try {
          jwt.verify(token, "your-secret-key");
        } catch (error) {
          // Redirect to the login page if the token is invalid or missing
          return <div>TOKEN ERROR</div>;
        }
      } else {
        console.error("Failed to login value to the API:", response.status);
      }
    } catch (error) {
      console.error("Failed to login value to the API:", error);
    }
  };
  return (
    <Formik
      initialValues={{
        // Initialize your form fields here
        name: "",
        email: "",
      }}
      onSubmit={login}
    >
      <Form>
        <label htmlFor="name">Name</label>
        <Field type="text" id="name" name="name" />

        <label htmlFor="email">Email</label>
        <Field type="email" id="email" name="email" />

        <button type="submit">login</button>
      </Form>
    </Formik>
  );
};

export default Login;
