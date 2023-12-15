import React from "react";
import { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [Loginerror, setLoginerror] = useState(false);
  const [isButtonDisabled, setButtonDisabled] = useState(false);

  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(
      <div role="alert" className="alert alert-error mt-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>UserName is required</span>
      </div>
    ),
    password: Yup.string().required(
      <div role="alert" className="alert alert-error mt-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Password is required</span>
      </div>
    ),
  });

  const login = async (values) => {
    try {
      setButtonDisabled(true);
      const response = await fetch(
        "https://chat-node-naveenterances-projects.vercel.app/users/login",
        {
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
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log("logged in");
        localStorage.setItem("token", data.token);

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
    } finally {
      setTimeout(() => {
        setButtonDisabled(false);
      }, 5000);
    }
  };
  return (
    <div className="">
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
            <label htmlFor="name" className="block text-sm font-bold mb-2">
              Name
            </label>
            <Field
              type="text"
              id="name"
              name="name"
              className="  w-full transition-all duration-300 bg-base-100  px-3 py-2 border-4 border-transparent border-b-success rounded-md focus:outline-none focus:border-success "
            />
            <div className="text-error">
              <ErrorMessage name="name" />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-bold mb-2">
              Password
            </label>
            <Field
              type="password"
              id="password"
              name="password"
              className=" w-full transition-all duration-300 bg-base-100 px-3 py-2 border-4 border-transparent border-b-success rounded-md focus:outline-none focus:border-success  "
            />
            <div className="text-error">
              <ErrorMessage name="password" />
            </div>
          </div>
          <div className="text-error text-bold">
            {console.log(Loginerror)}
            {Loginerror ? (
              <div role="alert" className="alert alert-error mt-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>UserName/Password incorrect</span>
              </div>
            ) : (
              ""
            )}
          </div>

          <button
            type="submit"
            disabled={isButtonDisabled}
            className=" hover:underline hover:decoration-success hover:text-success font-semibold hover:decoration-4 group w-40 h-24 rounded-full hover:border-4 border-transparent hover:border-x-success justify-center items-center flex"
          >
            {!isButtonDisabled ? (
              <>
                <img src="./signup.gif" className="mr-2" />
                Login
              </>
            ) : (
              <span className="loading loading-dots loading-md"></span>
            )}
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default Login;
