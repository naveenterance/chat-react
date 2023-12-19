import React from "react";
import { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [Loginerror, setLoginerror] = useState(false);
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
              className="  w-64 transition-all duration-300 bg-base-200  px-3 py-2 border-4 border-transparent border-b-secondary rounded-md focus:outline-none "
            />
            <div className="text-error">
              <ErrorMessage name="name" />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-bold mb-2">
              Password
            </label>
            <div className="flex">
              <Field
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="w-full mr-2 transition-all duration-300 bg-base-200  px-3 py-2 border-4 border-transparent border-b-secondary rounded-md focus:outline-none  "
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    dataSlot="icon"
                    className="w-6 h-6 text-success "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    dataSlot="icon"
                    className="w-6 h-6 text-error"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                )}
              </button>
            </div>
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
            className=" hover:underline hover:decoration-primary hover:text-primary font-semibold hover:decoration-4 group w-40 h-24 rounded-full  justify-center items-center flex"
          >
            {!isButtonDisabled ? (
              <>
                <div className="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    dataSlot="icon"
                    className="w-12 h-12"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </div>
                <div>Login</div>
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
