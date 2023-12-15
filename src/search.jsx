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
        <span id={user._id} className="hover:text-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
            />
          </svg>

          {user.name}
        </span>
      </>
    ) : null;
  };

  return (
    <>
      <div className="App">
        <header className="App-header">
          <div
            style={{
              width: "100%",
              zIndex: 999,
              position: "absolute ",
              height: "60px",
              border: "8px solid teal",
              borderRadius: "24px",
              backgroundColor: "white",
              boxShadow: "rgba(32, 33, 36, 0.28) 0px 1px 6px 0px",
              hoverBackgroundColor: "red",
              color: "#212121",
              fontSize: "56px",
              fontFamily: "Arial",
              iconColor: "grey",
              lineColor: "rgb(232, 234, 237)",
              placeholderColor: "grey",
              clearIconMargin: "3px 14px 0 0",
              searchIconMargin: "0 0 0 16px",
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
            />
          </div>
        </header>
      </div>
    </>
  );
};

export default Search;
