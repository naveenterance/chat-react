import React, { useState, useEffect } from "react";
import * as jose from "jose";
import { useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { Formik, Field, Form } from "formik";

const queryClient = new QueryClient();

const fetchUserData = async (userId) => {
  const response = await fetch(`http://localhost:3000/users/${userId}`);
  const data = await response.json();
  return data;
};

export default function Profile() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProfileComponent />
    </QueryClientProvider>
  );
}

const ProfileComponent = () => {
  const [isLoggedOut, setLoggedOut] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!token || isLoggedOut) {
    navigate("/Login");
    return null;
  }
  const claims = jose.decodeJwt(token);

  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useQuery("userData", () => fetchUserData(claims.userId));

  const { data, isLoading, isError, error } = useQuery("myData", () =>
    fetch(`http://localhost:4000/log/${claims.userId}`).then((res) =>
      res.json()
    )
  );

  const Logout = () => {
    localStorage.removeItem("token");
    setLoggedOut(true);
    navigate("/Login");
  };

  const add = async (values) => {
    try {
      const response = await fetch("http://localhost:4000/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // ...other headers
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
        <div>Login successful: {claims.userId}</div>
        <button onClick={Logout}>Logout</button>
        <div>
          {userLoading ? (
            <p>Loading user...</p>
          ) : userError ? (
            <p>Error loading user: {userError.message}</p>
          ) : (
            <div>
              <p>ID: {user._id}</p>
              <p>Username: {user.name}</p>
              {/* Add other user properties as needed */}
            </div>
          )}
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <p>Error: {error.message}</p>
        ) : (
          <div>
            {data.map((item) => (
              <p key={item._id}>
                {item.sender}----{item.receiver}----{item.message}
              </p>
            ))}
          </div>
        )}

        <Formik
          initialValues={{
            sender: "",
            receiver: "",
            message: "",
          }}
          onSubmit={(values) => add(values)}
        >
          <Form>
            <label htmlFor="sender">sender</label>
            <Field type="text" id="sender" name="sender" />

            <label htmlFor="receiver">receiver</label>
            <Field type="text" id="receiver" name="receiver" />

            <label htmlFor="message">Message</label>
            <Field type="text" id="message" name="message" />

            <button type="submit">Submit</button>
          </Form>
        </Formik>
      </div>
    </>
  );
};
