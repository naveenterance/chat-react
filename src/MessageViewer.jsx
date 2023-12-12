import React, { useState, useEffect } from "react";

const MessageViewer = ({ sender, receiver }) => {
  const [messageData, setMessageData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/getMessage/${sender}/${receiver}`
        );
        const data = await response.json();

        if (response.ok) {
          setMessageData(data);
        } else {
          setError(data.error || "Failed to fetch data.");
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setError("Internal server error.");
      }
    };

    fetchData();
  }, [sender, receiver]);

  return (
    <div>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <h2>-----</h2>
          {messageData.message && (
            <>
              <p>Message: {messageData.message}</p>
              <p>View: {messageData.view}</p>
              <p>Date:{messageData.date}</p>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MessageViewer;
