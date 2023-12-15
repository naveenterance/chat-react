import React, { useState, useEffect } from "react";
import { useMutation } from "react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Confetti from "react-confetti";

const Signup = () => {
  const [isButtonDisabled, setButtonDisabled] = useState(false);
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
      setButtonDisabled(true);
      await addMutation.mutateAsync(values);
    } catch (error) {
      console.error("Failed to post value to the API:", error);
    } finally {
      setTimeout(() => {
        setButtonDisabled(false);
      }, 5000);
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
            <p className="flex p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                />
              </svg>
              New Account Created
            </p>
            <p className="flex p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              An avatar will be autogenerated based on your username{" "}
            </p>
            <p className="flex p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
              Now login to your neww account
            </p>
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
              className="mt-1 p-2 border-4 transition-all duration-300  border-transparent border-b-success rounded-md  focus:outline-none focus:border-success bg-base-100"
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
              className="mt-1 p-2  transition-all duration-300  border-4 border-transparent border-b-success rounded-md focus:outline-none focus:border-success bg-base-100"
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
              className="transition-all duration-300  mt-1 p-2 border-4 border-transparent border-b-success  rounded-md  focus:outline-none focus:border-success bg-base-100"
            />

            <ErrorMessage name="confirmPassword" />
          </div>

          <button
            type="submit"
            className=" hover:underline hover:decoration-success hover:text-success font-semibold hover:decoration-4 group w-40 h-24 rounded-full hover:border-4 border-transparent border-transparent hover:border-x-success justify-center items-center flex"
          >
            {!isButtonDisabled ? (
              <>
                <img src="./signup.gif" className="mr-2" />
                Sign up
              </>
            ) : (
              <span className="loading loading-dots loading-md"></span>
            )}
          </button>
        </Form>
      </Formik>
    </>
  );
};

export default Signup;
