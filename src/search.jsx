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
      const response = await fetch("http://localhost:3000/users");
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
        <span style={{ display: "block", textAlign: "left" }} id={user._id}>
          {user.name}
        </span>
      </>
    ) : null;
  };

  return (
    <>
      <div className="App">
        <header className="App-header">
          <div style={{ width: 400 }}>
            <ReactSearchAutocomplete
              items={users}
              onSearch={handleOnSearch}
              onHover={handleOnHover}
              onSelect={handleOnSelect}
              onFocus={handleOnFocus}
              autoFocus
              formatResult={formatResult}
              autoHighlight={false}
            />
          </div>
        </header>
      </div>
    </>
  );
};

export default Search;
