import React, { useState, useEffect } from "react";
import * as jose from "jose";
import { useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import Search from "./Search";

const queryClient = new QueryClient();

export default function Profile() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProfileComponent />
    </QueryClientProvider>
  );
}

const SignupSchema = Yup.object().shape({
  receiver: Yup.string().required("Required"),
});

const ProfileComponent = () => {
  const [isLoggedOut, setLoggedOut] = useState(false);
  const [client, setclient] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [receiver, setReceiver] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);

  // Callback function to handle the selected item
  const handleSelectedItem = (item) => {
    setSelectedItem(item);
    // Do something with the selected item in the parent component
    console.log("Selected Item in App Component:", item);
  };

  useEffect(() => {
    setReceiver(client);
  }, [client]);

  //token check
  if (!token || isLoggedOut) {
    navigate("/Login");
    return null;
  }
  const claims = jose.decodeJwt(token);

  //chat log fetch
  const { data, isLoading, isError, error } = useQuery("myData", () =>
    fetch(`http://localhost:4000/log/${claims.name}`).then((res) => res.json())
  );

  //contacts fetch
  const {
    data: receivers,
    isLoading: cisLoading,
    isError: cisError,
    error: cerror,
  } = useQuery("myContacts", () =>
    fetch(`http://localhost:4000/contacts/${claims.name}`).then((res) =>
      res.json()
    )
  );

  //logout function
  const Logout = () => {
    localStorage.removeItem("token");
    setLoggedOut(true);
    navigate("/Login");
  };

  //sent message
  const add = async (values) => {
    try {
      const response = await fetch("http://localhost:4000/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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

  //setclient
  const select = (receiver) => {
    setclient(receiver);
    console.log(client);
  };

  //view
  return (
    <>
      <div>
        <h1>App Component</h1>
        {/* Pass the callback function as a prop to the Search component */}

        {/* Display the search results in the parent component */}
        <div>
          <h2>Search Results</h2>
          <p>Selected Item: {selectedItem ? selectedItem.name : "None"}</p>
          <Search onValueChange={handleSelectedItem} />
        </div>
      </div>
      <div>
        <div>Login successful: {claims.name}</div>
        <div>
          <p>CONTACTS</p>
          {cisLoading ? (
            <p>Loading...</p>
          ) : cisError ? (
            <p>Error: {cerror.message}</p>
          ) : (
            <div>
              {receivers &&
              receivers.receivers &&
              receivers.receivers.length > 0 ? (
                <div>
                  {receivers.receivers.map((receiver) => (
                    <button onClick={() => select(receiver)} key={receiver}>
                      {receiver}
                    </button>
                  ))}
                </div>
              ) : (
                <p>No contacts available.</p>
              )}
            </div>
          )}
        </div>
        <button onClick={Logout}>Logout</button>
        <div>
          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p>Error: {error.message}</p>
          ) : (
            <div>
              {data.map((item) => (
                <p key={item._id}>
                  {item.sender == claims.name ? <span>YOU</span> : item.sender}
                  -----{item.message}-----
                  {item.receiver == claims.name ? (
                    <span>YOU</span>
                  ) : (
                    item.receiver
                  )}
                  {item.date}
                </p>
              ))}
            </div>
          )}
        </div>

        <Formik
          initialValues={{
            sender: claims.name,
            receiver: receiver,
            message: "",
          }}
          enableReinitialize={true}
          validationSchema={SignupSchema}
          onSubmit={(values) => add(values)}
        >
          <Form>
            <p>
              {!client ? (
                <span>Select a contact</span>
              ) : (
                <span>TO:{client}</span>
              )}
            </p>

            <label htmlFor="message">Message</label>
            <Field type="text" id="message" name="message" />

            <button type="submit">Submit</button>
          </Form>
        </Formik>
        <Formik
          initialValues={{
            sender: claims.name,
            receiver: selectedItem ? selectedItem.name : "",
            message: "[Added as a contact]",
          }}
          enableReinitialize={true}
          validationSchema={SignupSchema}
          onSubmit={(values) => add(values)}
        >
          <Form>
            {/* <label htmlFor="receiver">New Contact</label>
            <Field type="text" id="receiver" name="receiver" /> */}

            <button type="submit">ADD</button>
          </Form>
        </Formik>
      </div>
    </>
  );
};
