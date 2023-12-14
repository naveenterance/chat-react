import React from "react";
import { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [Loginerror, setLoginerror] = useState(false);

  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    password: Yup.string().required("Password is required"),
  });

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
        validationSchema={validationSchema}
        onSubmit={login}
      >
        <Form className="max-w-md mx-auto animate__animated animate__bounceIn">
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-base-content text-sm font-bold mb-2"
            >
              Name
            </label>
            <Field
              type="text"
              id="name"
              name="name"
              className="bg-slate-200  w-full px-3 py-2 border rounded-md focus:outline-none focus:border-success"
            />
            <div className="text-red-500">
              <ErrorMessage name="name" />
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-base-content text-sm font-bold mb-2"
            >
              Password
            </label>
            <Field
              type="password"
              id="password"
              name="password"
              className="bg-slate-200  w-full px-3 py-2 border rounded-md focus:outline-none focus:border-success"
            />
            <div className="text-red-500">
              <ErrorMessage name="password" />
            </div>
          </div>
          <div className="text-red-600 text-bold">
            {console.log(Loginerror)}
            {Loginerror ? "[UserName/Password incorrect]" : ""}
          </div>

          <button
            type="submit"
            className=" hover:underline hover:decoration-success hover:text-success font-semibold hover:decoration-4 group w-40 h-24 rounded-full hover:border-4 border-transparent hover:border-x-success justify-center items-center flex"
          >
            <img src="./signup.gif" className="mr-2" />
            Login
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default Login;
