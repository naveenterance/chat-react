import React from "react";
import { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { Formik, Field, Form } from "formik";
// import jwt from "jsonwebtoken";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MyComponent />
    </QueryClientProvider>
  );
}

const fetchData = async () => {
  const response = await fetch("https://chat-node-three.vercel.app/users");
  const data = await response.json();
  return data;
};

const MyComponent = () => {
  const { isLoading, isError, data, error } = useQuery("myData", fetchData);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }
  const add = async (values) => {
    try {
      const response = await fetch("https://chat-node-three.vercel.app/users", {
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

      if (response.ok) {
        console.log("Value posted to the API successfully!");
      } else {
        console.error("Failed to post value to the API:", response.status);
      }
    } catch (error) {
      console.error("Failed to post value to the API:", error);
    }
  };
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

      if (response.ok) {
        console.log("logged in");
        const token = localStorage.getItem("token");
        console.log(token);
      } else {
        console.error("Failed to login value to the API:", response.status);
      }
    } catch (error) {
      console.error("Failed to login value to the API:", error);
    }
  };
  const remove = async (id) => {
    try {
      const response = await fetch(
        "https://chat-node-three.vercel.app/users/" + id,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
            "Access-Control-Allow-Headers":
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        }
      );

      if (response.ok) {
        console.log("Value delete successfully!");
      } else {
        console.error("Failed to delete to the API:", response.status);
      }
    } catch (error) {
      console.error("Failed to delete to the API:", error);
    }
  };

  return (
    <>
      <div>
        {data.map((item) => (
          <p key={item._id}>
            {item.name}
            <button onClick={() => remove(item._id)}>Delete</button>
          </p>
        ))}
        <Formik
          initialValues={{
            // Initialize your form fields here
            name: "",
            email: "",
            age: "",
          }}
          onSubmit={add}
        >
          <Form>
            <label htmlFor="name">Name</label>
            <Field type="text" id="name" name="name" />
            <label htmlFor="age">Age</label>
            <Field type="text" id="age" name="age" />

            <label htmlFor="email">Email</label>
            <Field type="email" id="email" name="email" />

            <button type="submit">Submit</button>
          </Form>
        </Formik>
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
      </div>
    </>
  );
};
