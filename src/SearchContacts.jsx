import React, { useState, useEffect } from "react";
import * as jose from "jose";

const Autocomplete = () => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [names, setNames] = useState([]);
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
        const updatedNames = data1
          .map((user) => user.name)
          .filter((name) => !receivers.includes(name));

        //const updatedNames =receivers;
        setNames(updatedNames);

        // Move filtering logic here
        const filteredSuggestions = updatedNames.filter((name) =>
          name.toLowerCase().includes(query.toLowerCase())
        );

        setSuggestions(filteredSuggestions);
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
  }, [inputValue, claims.name]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setShowSuggestions(true); // Show suggestions when input changes
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setSuggestions([]); // Clear suggestions when a suggestion is clicked
    setShowSuggestions(false); // Hide suggestions after selection
  };

  return (
    <>
      <div className="hover:bg-base-100">
        <div className="">
          <div>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Type to search..."
              className="lg:w-96 transition-all duration-300 bg-base-100 px-3 py-2 border-4 border-transparent border-b-success rounded-md focus:outline-none "
            />
          </div>
          {loading && <progress className="progress w-56"></progress>}
          {Array.isArray(suggestions) && suggestions.length === 1 && (
            <div className=" shadow-lg mt-4  h-full py-8 px-2">
              <div className=" ">
                <img
                  className="w-12 mx-auto ring-4 ring-success rounded-full  "
                  src={`https://robohash.org/${suggestions[0]}?set=set3`}
                  alt=""
                />

                <div className="divider divider-primary">{suggestions[0]}</div>
              </div>
              <div className="flex justify-between px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 mr-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                  />
                </svg>

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
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </div>
            </div>
          )}

          {showSuggestions &&
            !loading &&
            suggestions &&
            suggestions.length > 0 &&
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
