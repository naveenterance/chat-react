import React, { useState, useEffect } from "react";
import * as jose from "jose";
import { Formik, Field, Form } from "formik";

const Autocomplete = ({ sendDataToParent }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [names, setNames] = useState([]);
  const [view, setView] = useState("contacts");
  const [animateButton, setAnimateButton] = useState(false);

  const token = localStorage.getItem("token");
  const claims = jose.decodeJwt(token);

  useEffect(() => {
    const fetchSuggestions = async (query) => {
      setLoading(true);
      try {
        const APIResponse = await fetch(
          `https://chat-node-naveenterances-projects.vercel.app/users`
        );
        const data1 = await APIResponse.json();

        const response = await fetch(
          `https://chat-log-naveenterances-projects.vercel.app/contacts/${claims.name}`
        );
        const data2 = await response.json();

        const { receivers } = data2;

        // Set the names state with the latest data
        let updatedNames = [];
        if (view === "global") {
          updatedNames = data1
            .map((user) => user.name)
            .filter((name) => !receivers.includes(name));
        } else {
          updatedNames = receivers;
        }

        setNames(updatedNames);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (inputValue) {
      fetchSuggestions(inputValue);
    } else {
      setSuggestions([]);
    }
  }, [inputValue, view]);

  useEffect(() => {
    // Move filtering logic here
    const filteredSuggestions = names.filter((name) =>
      name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  }, [inputValue, names]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setShowSuggestions(true); // Show suggestions when input changes
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setSuggestions([]); // Clear suggestions when a suggestion is clicked
    setShowSuggestions(false); // Hide suggestions after selection
  };

  const handleview = () => {
    if (view === "contacts") {
      setView("global");
    } else {
      setView("contacts");
    }

    setAnimateButton(true);
    setTimeout(() => {
      setAnimateButton(false);
    }, 1000); //
  };

  const add = async (values) => {
    try {
      // Disable the button immediately upon submission

      const response = await fetch(
        "https://chat-log-naveenterances-projects.vercel.app/log",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        console.log("Value posted to the API successfully!");
        // Optionally, refresh queries after posting a message
        // refreshQueries();
      } else {
        console.error("Failed to post value to the API:", response.status);
      }
    } catch (error) {
      console.error("Failed to post value to the API:", error);
    }
  };

  const sendDataToParentHandler = (suggestReceiver) => {
    sendDataToParent(suggestReceiver);
  };

  return (
    <>
      <button
        className={`btn btn-ghost text-bold w-auto animate__animated   ${
          animateButton ? "animate__flipInX" : ""
        } `}
        onClick={handleview}
      >
        {view == "contacts" ? (
          <>
            Contacts
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              dataSlot="icon"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </>
        ) : (
          <>
            Global
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              dataSlot="icon"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
              />
            </svg>
          </>
        )}
      </button>
      <div className="focus:bg-transparent">
        <div className="">
          <div>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Type to search..."
              className="lg:w-96 w-auto transition-all duration-300 bg-base-100 px-3 py-2 border-4 border-transparent border-b-primary rounded-md focus:outline-none "
            />
          </div>
          {loading && (
            <progress className="progress progress-primary w-full"></progress>
          )}
          {Array.isArray(suggestions) && suggestions.length === 1 && (
            <div className=" shadow-lg mt-4  h-full py-8 px-2">
              <div className=" ">
                <img
                  className="w-12 mx-auto ring-4 ring-success rounded-full  "
                  src={`https://robohash.org/${suggestions[0]}?set=set3`}
                  alt=""
                />

                <div className="divider divider-primary">{suggestions[0]}</div>
                {view !== "contacts" && (
                  <Formik
                    initialValues={{
                      sender: claims.name,
                      receiver: suggestions[0] || "",
                      message: "[Added as a contact]",
                    }}
                    enableReinitialize={true}
                    onSubmit={(values) => add(values)}
                  >
                    <Form>
                      <button
                        type="submit"
                        className="btn  btn-success w-full flex mb-2"
                      >
                        Add Contact
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 text-base-100"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                          />
                        </svg>
                      </button>
                    </Form>
                  </Formik>
                )}
                <button
                  type="submit"
                  className="btn  btn-info w-full flex"
                  onClick={() => sendDataToParentHandler(suggestions[0])}
                >
                  message
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    dataSlot="icon"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {showSuggestions &&
            !loading &&
            suggestions &&
            suggestions.length > 1 &&
            suggestions.slice(0, 10).map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className=" animate__animated animate__zoomIn flex shadow-lg justify-between items-center border-4  border-transparent rounded-lg hover:border-x-success "
              >
                <img
                  className="w-12  "
                  src={`https://robohash.org/${suggestion}?set=set3`}
                  alt=""
                />
                [{suggestion}]
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Autocomplete;
