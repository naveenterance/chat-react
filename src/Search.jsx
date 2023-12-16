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
          className="hover:text-success flex items-center space-x-2"
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

  const inputStyles = {
    width: "100%",
    height: "100%",
    fontSize: "1.6rem", // Adjust the font size as needed
    border: "10px blue",
    outline: "none",
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="w-full relative h-60 border-8 border-teal-500 rounded-3xl bg-white shadow-md hover:bg-red-500 text-gray-800 text-4xl font-bold p-4">
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
            inputProps={{ style: inputStyles }}
          />
        </div>
      </header>
    </div>
  );
};

export default Search;
