import React, { useState, useEffect } from "react";
import { useMutation } from "react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Confetti from "react-confetti";

const Signup = () => {
  const handleOnError = (error) => {
    console.error("An error occurred:", error);
    navigate("/");
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(
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
      )
      .test(
        "user-exists",
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
          <span> User Name not available</span>
        </div>,
        async function (value) {
          if (value) {
            const response = await fetch(
              `https://chat-node-naveenterances-projects.vercel.app/users/${value}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            const data = await response.json();
            return !data.exists;
          }
          return true;
        }
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
        <span>Passwords is required</span>
      </div>
    ),
    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref("password"), null],
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
          <span>Passwords not matching</span>
        </div>
      )
      .required(
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
          <span>Password confirmation in required</span>
        </div>
      ),
  });

  const addMutation = useMutation(
    (values) =>
      fetch("https://chat-node-naveenterances-projects.vercel.app/users", {
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
      }),
    {
      onSuccess: () => {
        console.log("Value posted to the API successfully!");

        document.getElementById("my_modal_3").showModal();
      },
      onError: (error) => {
        console.error("Failed to post value to the API:", error);
      },
    }
  );

  const add = async (values) => {
    try {
      await addMutation.mutateAsync(values);
    } catch (error) {
      console.error("Failed to post value to the API:", error);
    }
  };

  return (
    <>
      <dialog id="my_modal_3" className="modal">
        <Confetti width="1000" height="1000" />
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          <h3 className="font-bold text-lg text-success">
            New Account Created , Now login
          </h3>

          <form method="dialog">
            <button className="btn mt-2 btn-circle w-full  right-0 text-success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </form>
        </div>
      </dialog>
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => add(values)}
      >
        <Form className="mt-4 space-y-4 animate__animated animate__bounceIn">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Field
              type="text"
              id="name"
              name="name"
              className="mt-1 p-2 border-4 border-transparent border-b-success rounded-md  focus:outline-none focus:border-success bg-base-100"
            />
            <div className="text-error">
              <ErrorMessage name="name" />
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Field
              type="password"
              id="password"
              name="password"
              className="mt-1 p-2 border-4 border-transparent border-b-success rounded-md focus:outline-none focus:border-success bg-base-100"
            />
            <div className="text-error">
              <ErrorMessage name="password" />
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </label>
            <Field
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="mt-1 p-2 border-4 border-transparent border-b-success  rounded-md  focus:outline-none focus:border-success bg-base-100"
            />

            <ErrorMessage name="confirmPassword" />
          </div>

          <button
            type="submit"
            className=" hover:underline hover:decoration-success hover:text-success font-semibold hover:decoration-4 group w-40 h-24 rounded-full hover:border-4 border-transparent border-transparent hover:border-x-success justify-center items-center flex"
          >
            <img src="./signup.gif" className="mr-2" />
            Sign up
          </button>
        </Form>
      </Formik>
    </>
  );
};

export default Signup;
