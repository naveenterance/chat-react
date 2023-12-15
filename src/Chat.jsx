import React from "react";
import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { Formik, Field, Form } from "formik";

const queryClient = new QueryClient();

export default function Appold() {
  return (
    <QueryClientProvider client={queryClient}>
      <MyComponent />
    </QueryClientProvider>
  );
}

const fetchData = async () => {
  const response = await fetch("https://chat-log-naveenterances-projects.vercel.app/log");
  const data = await response.json();
  return data;
};


  const { isLoading, isError, data, error } = useQuery("myData", fetchData);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }
  const add = async (values) => {
    try {
      const response = await fetch("https://chat-log-naveenterances-projects.vercel.app/log", {
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

  return (
    <>
      <div>
        <div>
          {user ? (
            <div>
              <p>ID: {user._id}</p>
              <p>Username: {user.name}</p>
              {/* Add other user properties as needed */}
            </div>
          ) : (
            <p>Loading user...</p>
          )}
        </div>
        {data.map((item) => (
          <p key={item._id}>
            {item.sender}----{item.receiver}----{item.message}
          </p>
        ))}

        <Formik
          initialValues={{
            sender: "",
            receiver: "",
            message: "",
          }}
          onSubmit={add}
        >
          <Form>
            <label htmlFor="sender">sender</label>
            <Field type="text" id="sender" name="sender" />

            <label htmlFor="receiver">receiver</label>
            <Field type="text" id="receiver" name="receiver" />

            <label htmlFor="message">Message</label>
            <Field type="text" id="message" name="message" />

            <button type="submit">login</button>
          </Form>
        </Formik>
      </div>
    </>
  );
};
