import React, { useState, useEffect } from "react";
import { useMutation } from "react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

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
});

const Signup = () => {
  const handleOnError = (error) => {
    console.error("An error occurred:", error);
    navigate("/");
  };

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
      <Form>
        <label htmlFor="name">Name</label>
        <Field type="text" id="name" name="name" />
        <div style={{ color: "red" }}>
          <ErrorMessage name="name" />
        </div>
        <label htmlFor="password">Password</label>
        <Field type="text" id="password" name="password" />
        <div style={{ color: "red" }}>
          <ErrorMessage name="password" />
        </div>

        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
};

export default Signup;
