import React, { useState, useEffect } from "react";
import * as jose from "jose";
import { useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import Search from "./Search";
import Home from "./Home";

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
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [currenttab, setcurrenttab] = useState("messages");

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
    try {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        localStorage.removeItem("token");
      }

      setLoggedOut(true);
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  //logout function end
  //sent message start
  const add = async (values) => {
    try {
      // Disable the button immediately upon submission
      setButtonDisabled(true);

      const response = await fetch("http://localhost:4000/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        console.log("Value posted to the API successfully!");
        // Optionally, refresh queries after posting a message
        // refreshQueries();
        setSelectedItem();
      } else {
        console.error("Failed to post value to the API:", response.status);
      }
    } catch (error) {
      console.error("Failed to post value to the API:", error);
    } finally {
      // Enable the button after 3 seconds, regardless of success or failure
      setTimeout(() => {
        setButtonDisabled(false);
      }, 8000);
    }
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
      } else {
        console.error("Failed to delete contact:", response.status);
      }
    } catch (error) {
      console.error("Failed to delete contact:", error);
    }
    setButtonDisabled(true);

    // Enable the button after 3 seconds
    setTimeout(() => {
      setButtonDisabled(false);
    }, 3000);
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

  const handleSelectMessageSender = (sender) => {
    select(sender);
  };

  return (
    <>
      <div className="navbar bg-base-100 sticky top-0  z-10 ">
        <a
          className={
            !receiver
              ? currenttab !== "messages"
                ? "animate__animated animate__fadeInDown hover:underline hover:decoration-success hover:text-success font-semibold hover:decoration-4 group w-40 h-24 rounded-full hover:border-4 border-transparent hover:border-x-success justify-center items-center flex"
                : "animate__animated animate__fadeInDown underline decoration-success text-success font-semibold decoration-4 group w-40 h-24 rounded-full border-4 border-transparent border-x-success justify-center items-center flex"
              : ""
          }
          onClick={() => {
            setcurrenttab("messages");
            setReceiver("");
          }}
        >
          {!receiver ? (
            <div className="flex">
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
                  d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                />
              </svg>
              Messages
            </div>
          ) : (
            <div className="text-info hover:text-error border-4 border-info hover:border-error rounded-lg p-2  animate__animated animate__fadeInDown">
              <button onClick={() => setReceiver("")} className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
                  />
                </svg>

                <img
                  className="mx-auto w-12 rounded-full  "
                  src={`https://robohash.org/${receiver}?set=set3`}
                  alt="loading.."
                />
                <p className="font-bold underline  decoration-4  ">
                  {receiver}
                </p>
              </button>
            </div>
          )}
        </a>
        <a
          className={
            currenttab !== "contacts"
              ? "animate__animated animate__fadeInDown hover:underline hover:decoration-success hover:text-success font-semibold hover:decoration-4 group w-40 h-24 rounded-full hover:border-4 border-transparent hover:border-x-success justify-center items-center flex"
              : "animate__animated animate__fadeInDown underline decoration-success text-success font-semibold decoration-4 group w-40 h-24 rounded-full border-4 border-transparent border-x-success justify-center items-center flex"
          }
          onClick={() => {
            setcurrenttab("contacts");
            setReceiver("");
          }}
        >
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
              d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
            />
          </svg>
          Contacts
        </a>
      </div>
      <div className="">
        {!receiver && currenttab == "messages" && (
          <MessageList
            user={claims.name}
            onSelectMessageSender={handleSelectMessageSender}
          />
        )}
        {!receiver && currenttab == "contacts" && (
          <div className="p-4 ">
            <div className="w-1/2 p-4 ">
              <div className="rounded-full border-4 border-transparent border-l-warning border-y-info p-4 w-36 flex  ">
                <img
                  className="w-16 rounded-full ring ring-warning ring-offset-warning ring-offset-2"
                  src={`https://robohash.org/${claims.name}?set=set3`}
                  alt="loading.."
                />
                <h1 className="text-4xl rounded-full px-4  font-bold mb-4 ml-4  border-4 border-transparent border-x-info">
                  {claims.name}
                </h1>
                <button
                  onClick={Logout}
                  className="rounded-full px-4 border-4 border-transparent  border-y-info border-r-error hover:border-y-error hover:border-r-info "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-error"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                    />
                  </svg>
                  <div className="text-error">Logout</div>
                </button>
              </div>

              <div className="mt-4">
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
                      <div className="stat  w-auto shadow">
                        <div className="stat-figure text-primary">
                          <div className="avatar ">
                            <div className="w-16 rounded-full ring ring-info ring-offset-base-100 ring-offset-2">
                              <img src="https://robohash.org/$(selectedItem.name)?set=set3" />
                            </div>
                          </div>
                        </div>
                        <div className="stat">
                          <div className="stat-value ">{selectedItem.name}</div>
                        </div>
                        <div className="stat">
                          <button
                            type="submit"
                            className="btn btn-outline btn-info w-36 flex"
                            disabled={isButtonDisabled}
                          >
                            {!isButtonDisabled ? (
                              "Add as a contact"
                            ) : (
                              <span className="loading loading-dots loading-md"></span>
                            )}
                          </button>
                        </div>
                      </div>
                    </Form>
                  </Formik>
                )}
              </div>
            </div>
            <div className="w-full p-1 mt-4 ">
              <div className="mb-4">
                <p className="text-lg">CONTACTS</p>
                {cisLoading ? (
                  <p>Loading...</p>
                ) : cisError ? (
                  <p className="text-red-500">Error: {cerror.message}</p>
                ) : (
                  <div>
                    {receivers &&
                    receivers.receivers &&
                    receivers.receivers.length > 0 ? (
                      <div>
                        {receivers.receivers.map((receiver) => (
                          <div
                            key={receiver}
                            className="flex justify-between items-center mt-2 rounded-full px-2  font-bold mb-4   border-4 border-transparent border-x-info"
                          >
                            <img
                              className="w-12"
                              src={`https://robohash.org/${receiver}?set=set3`}
                              alt="loading"
                            />

                            <button
                              onClick={() => select(receiver)}
                              className=" flex"
                            >
                              {receiver}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6 text-success"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                                />
                              </svg>
                            </button>

                            <button
                              className=""
                              onClick={() =>
                                document
                                  .getElementById("my_modal_3")
                                  .showModal()
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6 text-error"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                                />
                              </svg>
                            </button>
                            <dialog id="my_modal_3" className="modal">
                              <div className="modal-box">
                                <form method="dialog">
                                  {/* if there is a button in form, it will close the modal */}
                                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                    ✕
                                  </button>
                                </form>
                                <h3 className="font-bold text-lg">Hello!</h3>
                                <p className="py-4">
                                  Delete [{receiver}] from contact?
                                </p>
                                <button
                                  onClick={() => deleteContact(receiver)}
                                  className="bg-red-500 text-white px-4 py-2 ml-2"
                                  disabled={isButtonDisabled}
                                >
                                  {!isButtonDisabled ? (
                                    "Yes"
                                  ) : (
                                    <span className="loading loading-dots loading-md"></span>
                                  )}
                                </button>
                              </div>
                            </dialog>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No contacts available.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {receiver && (
          <div className="mt-4 -z-50">
            {receivers.receivers
              .map((receiver) => receiver)
              .includes(receiver) ? (
              <p></p>
            ) : (
              <p>
                {" "}
                <Formik
                  initialValues={{
                    sender: claims.name,
                    receiver: receiver,
                    message: "[Added as a contact]",
                  }}
                  enableReinitialize={true}
                  validationSchema={SignupSchema}
                  onSubmit={(values) => add(values)}
                >
                  <Form>
                    <button
                      type="submit"
                      className="btn btn-outline"
                      disabled={isButtonDisabled}
                    >
                      {!isButtonDisabled ? (
                        `ADD ${receiver} as contact?`
                      ) : (
                        <span className="loading loading-dots loading-md"></span>
                      )}
                    </button>
                  </Form>
                </Formik>
              </p>
            )}
            {isLoading ? (
              <p className="text-gray-500">Loading...</p>
            ) : isError ? (
              <p className="text-red-500">Error: {error.message}</p>
            ) : (
              <div>
                {data.map((item) => (
                  <div key={item._id} className="">
                    {item.message !== "[Added as a contact]" &&
                    (item.sender === receiver || item.receiver === receiver) ? (
                      <>
                        {item.sender === claims.name ? (
                          <div className="chat chat-end">
                            <div className="chat-bubble">{item.message}</div>
                          </div>
                        ) : (
                          <div className="chat chat-start">
                            <div className="chat-bubble">{item.message}</div>
                          </div>
                        )}
                      </>
                    ) : null}
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
              {({ values }) => (
                <Form className="mt-4 flex">
                  <Field
                    type="text"
                    id="message"
                    name="message"
                    className="w-3/4 border bg-transparent rounded-full p-2  m-4"
                    placeholder={`>${receiver}`}
                  />

                  <button
                    type="submit"
                    className=""
                    disabled={isButtonDisabled || !values.message}
                  >
                    {!isButtonDisabled ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-12 h-12 p-2 hover:border-4 hover:rounded-full hover:font-success hover:border-dashed "
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                        />
                      </svg>
                    ) : (
                      <span className="loading loading-dots loading-md"></span>
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        )}
      </div>
    </>
  );
};
