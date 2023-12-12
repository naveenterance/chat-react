import React, { useState, useEffect } from "react";
import * as jose from "jose";
import { useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import Search from "./Search";
import Home from "./Home";
import MessageViewer from "./MessageViewer";
import MessageList from "./MessageList";

// QueryClient wrapping start
const queryClient = new QueryClient();

export default function Profile() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProfileComponent />
    </QueryClientProvider>
  );
}
// QueryClient wrapping end

// Yup schema start
const SignupSchema = Yup.object().shape({
  receiver: Yup.string().required("Required"),
});
//Yup schema End

const ProfileComponent = () => {
  const [isLoggedOut, setLoggedOut] = useState(false);
  const [client, setclient] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [receiver, setReceiver] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  //token check start
  if (token == null || isLoggedOut) {
    console.log(token, isLoggedOut);

    return <Home />;
  }
  //token check end

  const handleSelectedItem = (item) => {
    setSelectedItem(item);
  };

  useEffect(() => {
    setReceiver(client);
    console.log(receiver);
  }, [client]);

  const claims = jose.decodeJwt(token);

  // Function to refresh queries start
  // const refreshQueries = () => {
  //   queryClient.invalidateQueries("myData");
  //   queryClient.invalidateQueries("myContacts");
  // };
  // // Function to refresh queries end

  // // Fetch data every 5 seconds
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     refreshQueries();
  //   }, 5000);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, []);

  //chat log fetch start
  const { data, isLoading, isError, error } = useQuery(
    "myData",
    async () => {
      const response = await fetch(`http://localhost:4000/log/${claims.name}`);

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      return response.json();
    },
    {
      refetchInterval: 5000,
    }
  );

  //chat log fetch end
  //contacts fetch start
  const {
    data: receivers,
    isLoading: cisLoading,
    isError: cisError,
    error: cerror,
  } = useQuery(
    "myContacts",
    async () => {
      const response = await fetch(
        `http://localhost:4000/contacts/${claims.name}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch contacts");
      }

      return response.json();
    },
    {
      refetchInterval: 5000,
    }
  );

  //contacts fetch end
  //logout function start
  const Logout = () => {
    localStorage.removeItem("token");
    setLoggedOut(true);
    navigate("/");
  };
  //logout function end
  //sent message start
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
        // Refresh queries after posting a message
        // refreshQueries();
      } else {
        console.error("Failed to post value to the API:", response.status);
      }
    } catch (error) {
      console.error("Failed to post value to the API:", error);
    }
    setSelectedItem();
  };
  //sent message end
  //delete contact start
  const deleteContact = async (receiver) => {
    try {
      const response = await fetch(
        `http://localhost:4000/contacts/${claims.name}/${receiver}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log("Contact deleted successfully!");
        // Refresh queries after deleting a contact
        refreshQueries();
      } else {
        console.error("Failed to delete contact:", response.status);
      }
    } catch (error) {
      console.error("Failed to delete contact:", error);
    }
  };
  //delete contact end

  //seen-notseen start
  const handleUpdateView = async (sender, receiver) => {
    try {
      const response = await fetch(
        `http://localhost:4000/updateView/${sender}/${receiver}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update documents");
      }
      console.log("handlview");
    } catch (error) {
      console.error("Error updating documents:", error);
    }
  };
  //seen-notseen end
  //setclient
  const select = (receiver) => {
    setclient(receiver);
    setReceiver(receiver);
    handleUpdateView(receiver, claims.name);
    console.log(client);
  };
  //setcient end
  //seen

  //seen
  return (
    <>
      <div className="flex">
        <MessageList user={claims.name} />

        {!receiver ? (
          <div>
            <div className="w-1/2 p-4">
              <h1 className="text-2xl mb-4">{claims.name}</h1>

              <div>
                <h2 className="text-xl">Search Results</h2>

                <Search onValueChange={handleSelectedItem} />
                {selectedItem && (
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
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2"
                      >
                        ADD {selectedItem.name} as contact?
                      </button>
                    </Form>
                  </Formik>
                )}
              </div>
            </div>
            <div className="w-full p-4 mt-4 ">
              <div className="mb-4">
                <p className="text-lg">CONTACTS</p>
                {cisLoading ? (
                  <p>Loading...</p>
                ) : cisError ? (
                  <p className="text-red-500">Error: {cerror.message}</p>
                ) : (
                  <div>
                    <button
                      onClick={() => select("All")}
                      className="bg-gray-200 text-gray-700 px-4 py-2 mt-2"
                    >
                      ALL
                    </button>
                    {receivers &&
                    receivers.receivers &&
                    receivers.receivers.length > 0 ? (
                      <div>
                        {receivers.receivers.map((receiver) => (
                          <div
                            key={receiver}
                            className="flex justify-between items-center mt-2"
                          >
                            <button
                              onClick={() => select(receiver)}
                              className="bg-blue-500 text-white px-4 py-2"
                            >
                              {receiver}
                            </button>
                            <button
                              onClick={() => deleteContact(receiver)}
                              className="bg-red-500 text-white px-4 py-2 ml-2"
                            >
                              Delete {receiver}
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No contacts available.</p>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={Logout}
                className="bg-red-500 text-white px-4 py-2 mt-4"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <button onClick={() => setReceiver("")}>Go back</button>

            <h2 className="text-2xl font-bold mb-4">Messages:{receiver}</h2>
            {isLoading ? (
              <p className="text-gray-500">Loading...</p>
            ) : isError ? (
              <p className="text-red-500">Error: {error.message}</p>
            ) : (
              <div>
                {data.map((item) => (
                  <div key={item._id} className="">
                    <p className="mb-2">
                      {item.message !== "[Added as a contact]" &&
                      (item.sender === receiver ||
                        item.receiver === receiver) ? (
                        <>
                          <span className="font-bold">
                            {item.sender === claims.name ? "YOU" : item.sender}
                          </span>
                          <span className="ml-2">-----</span>
                          {item.message}
                          <span className="ml-2">-----</span>
                          <span className="font-bold">
                            {item.receiver === claims.name
                              ? "YOU"
                              : item.receiver}
                          </span>
                          <span className="ml-2">-----</span>
                          {item.date}
                          <span className="ml-2">-----</span>
                          {item.view}
                        </>
                      ) : null}
                    </p>
                  </div>
                ))}
              </div>
            )}
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
              <Form className="mt-4">
                <p>
                  {!client ? (
                    <span>Select a contact</span>
                  ) : (
                    <span>TO:{client}</span>
                  )}
                </p>

                <label htmlFor="message" className="block mt-2">
                  Message
                </label>
                <Field
                  type="text"
                  id="message"
                  name="message"
                  className="w-full border p-2 mt-1"
                />

                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 mt-2"
                >
                  Submit
                </button>
              </Form>
            </Formik>
          </div>
        )}
      </div>
    </>
  );
};
