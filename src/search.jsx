import React, { useState, useEffect } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

const Search = () => {
  const [users, setUsers] = useState([]);

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
  };

  const handleOnFocus = () => {
    console.log("Focused");
  };

  const formatResult = (user) => {
    return (
      <>
        <span style={{ display: "block", textAlign: "left" }}>{user.name}</span>
      </>
    );
  };

  return (
    <>
      <div className="App">
        <header className="App-header">
          <div style={{ width: 400 }}>
            <ReactSearchAutocomplete
              items={users} // Use 'items' instead of 'users'
              onSearch={handleOnSearch}
              onHover={handleOnHover}
              onSelect={handleOnSelect}
              onFocus={handleOnFocus}
              autoFocus
              formatResult={formatResult}
            />
          </div>
        </header>
      </div>
    </>
  );
};

export default Search;
