import React, { useState, useEffect } from "react";
import { useMutation } from "react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Signup = () => {
  const handleOnError = (error) => {
    console.error("An error occurred:", error);
    navigate("/");
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Username is required")
      .test("user-exists", "Username not available", async function (value) {
        if (value) {
          const response = await fetch(`http://localhost:3000/users/${value}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          return !data.exists;
        }
        return true;
      }),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Password confirmation is required"),
  });

  const addMutation = useMutation(
    (values) =>
      fetch("http://localhost:3000/users", {
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
            className="mt-1 p-2 border rounded-md bg-slate-200  focus:outline-none focus:border-success"
          />
          <div className="text-red-500">
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
            className="mt-1 p-2 border rounded-md bg-slate-200 focus:outline-none focus:border-success"
          />
          <div className="text-red-500">
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
            className="mt-1 p-2 border rounded-md bg-slate-200  focus:outline-none focus:border-success"
          />
          <div className="text-red-500">
            <ErrorMessage name="confirmPassword" />
          </div>
        </div>

        <button
          type="submit"
          className=" hover:underline hover:decoration-success hover:text-success font-semibold hover:decoration-4 group w-40 h-24 rounded-full hover:border-4 border-transparent hover:border-x-success justify-center items-center flex"
        >
          <img src="./signup.gif" className="mr-2" />
          Sign up
        </button>
      </Form>
    </Formik>
  );
};

export default Signup;
