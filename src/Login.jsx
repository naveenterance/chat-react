import React from "react";
import { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { Formik, Field, Form } from "formik";

import { useNavigate } from "react-router-dom";

const Login = () => {
  const [Loginerror, setLoginerror] = useState(false);

  const navigate = useNavigate();

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
        console.log(data);
        navigate("/Profile");
        try {
          jwt.verify(token, "your-secret-key");
        } catch (error) {
          // Redirect to the login page if the token is invalid or missing
          return <div>TOKEN ERROR</div>;
        }
      } else {
        console.error("Failed to login value to the API:", response.status);
        setLoginerror(true);
      }
    } catch (error) {
      console.error("Failed to login value to the API:", error);
      setLoginerror(true);
    }
  };
  return (
    <div>
      <Formik
        initialValues={{
          // Initialize your form fields here
          name: "",
          password: "",
        }}
        onSubmit={login}
      >
        <Form>
          <label htmlFor="name">Name</label>
          <Field type="text" id="name" name="name" />

          <label htmlFor="password">Password</label>
          <Field type="password" id="password" name="password" />

          <button type="submit">login</button>
        </Form>
      </Formik>
      <div>
        {console.log(Loginerror)}
        {Loginerror ? "UserName/Password is wrong" : ""}
      </div>
    </div>
  );
};

export default Login;
