import React, { useState, useEffect } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import * as jose from "jose";

const Search = ({ onValueChange }) => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const claims = jose.decodeJwt(token);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await fetch(
        "https://chat-node-naveenterances-projects.vercel.app/users"
      );
      const info = await response.json();
      setUsers(info);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  const handleOnSearch = (string, results) => {
    console.log(string, results);
  };

  const handleOnHover = (result) => {
    console.log(result);
  };

  const handleOnSelect = (item) => {
    console.log(item);
    // Call the callback function from the parent with the selected item
    onValueChange(item);
  };

  const handleOnFocus = () => {
    console.log("Focused");
  };

  const formatResult = (user) => {
    return user.name !== claims.name ? (
      <>
        <span
          id={user._id}
          className="hover:text-success flex items-center space-x-2 bg-error"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            {/* Your SVG path here */}
          </svg>
          <span>{user.name}</span>
        </span>
      </>
    ) : null;
  };

  return (
    <div className="App z-50">
      <header className="App-header">
        <div
          style={{
            width: 300,
            zIndex: 9999, // Wrap the property in quotes
          }}
        >
          <ReactSearchAutocomplete
            items={users}
            onSearch={handleOnSearch}
            onHover={handleOnHover}
            onSelect={handleOnSelect}
            onFocus={handleOnFocus}
            autoFocus
            formatResult={formatResult}
            autoHighlight={false}
            placeholder="Find new contacts"
            styling={{
              height: "44px",
              border: "4px solid #bdbdbd", // Adjust border color
              borderRadius: "30px", // Use a smaller border radius
              backgroundColor: "#0c4a6e",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Use a lighter shadow
              hoverBackgroundColor: "teal", // Lighter background on hover
              color: "white",
              fontSize: "16px",
              fontFamily: "Roboto, Arial, sans-serif", // Use Roboto font
              // Adjust icon color
              lineColor: "red", // Lighter line color
              placeholderColor: "#757575",
              clearIconMargin: "3px 14px 0 0",
              searchIconMargin: "0 0 0 16px",
            }}
          />
        </div>
      </header>
    </div>
  );
};

export default Search;
