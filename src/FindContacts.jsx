import React, { useState, useEffect } from "react";
import * as jose from "jose";

const FindContacts = () => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const claims = jose.decodeJwt(token);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const fetchSuggestions = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://chat-log-naveenterances-projects.vercel.app/contacts/${claims.name}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch contacts");
      }

      const data = await response.json();

      console.log("Fetched data:", data); // Add this line for debugging

      const receivers = data.receivers.map((receiver) => receiver ?? "");
      console.log("Receivers:", receivers);
      const filteredSuggestions = receivers.filter((receiver) => {
        const lowerCaseReceiver = receiver.toLowerCase();
        const lowerCaseQuery = query.toLowerCase();
        const includesQuery = lowerCaseReceiver.includes(lowerCaseQuery);

        console.log(
          `${lowerCaseReceiver} includes ${lowerCaseQuery}: ${includesQuery}`
        );

        return includesQuery;
      });

      console.log("Filtered suggestions:", filteredSuggestions); // Add this line for debugging

      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      if (inputValue.trim() !== "") {
        fetchSuggestions(inputValue);
      } else {
        setSuggestions([]);
      }
    }, 300); // Introduce a delay to avoid rapid API requests

    return () => clearTimeout(delayTimer); // Clear the timer on component unmount
  }, [inputValue]);
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
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Type to search..."
        className=" w-full transition-all duration-300 bg-base-100  px-3 py-2 border-4 border-transparent border-b-success rounded-md focus:outline-none focus:border-success"
      />
      {loading && <p>Loading suggestions...</p>}
      {showSuggestions && !loading && suggestions && suggestions.length > 0 && (
        <ul>
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FindContacts;
