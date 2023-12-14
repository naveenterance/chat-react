import React from "react";
import { useQuery } from "react-query";
import Profile from "./Profile";
import * as jose from "jose";

const MessageList = ({ user, onSelectMessageSender }) => {
  const {
    data: messages,
    isLoading,
    isError,
    error,
  } = useQuery(
    ["messages", user],
    async () => {
      const response = await fetch(`http://localhost:4000/messages/${user}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch data");
      }

      return data.data;
    },
    {
      refetchInterval: 5000,
    }
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  const token = localStorage.getItem("token");
  const claims = jose.decodeJwt(token);
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Messages for {user}</h2>
      <div className="list-disc ">
        {messages.map(
          (message) =>
            message.message !== "[Added as a contact]" && (
              <div
                key={message._id}
                className="mb-4"
                onClick={() =>
                  onSelectMessageSender(
                    message.receiver != claims.name
                      ? message.receiver
                      : message.sender
                  )
                }
              >
                {message.sender != claims.name && (
                  <div
                    className={`p-4 border  ${
                      message.sender !== claims.name
                        ? "rounded-r-full lg:mr-48 mr-16"
                        : "rounded-l-full lg:ml-48 ml-16"
                    } w-5/6
                  ${message.view == "notSeen" ? "border-error" : ""}`}
                  >
                    <p className=" font-bold">
                      <span className="font-semibold">Sender:</span>{" "}
                      {message.sender == claims.name ? "you" : message.sender}
                    </p>

                    <p className="">
                      <span className="font-semibold">Receiver:</span>
                      {message.receiver == claims.name
                        ? "you"
                        : message.receiver}
                    </p>
                    <p className="">
                      <span className="font-semibold">Message:</span>
                      {message.message.length > 20
                        ? `${message.message.slice(0, 10)}...`
                        : message.message}
                    </p>
                    <p className="">
                      <span className="font-semibold">Date:</span>{" "}
                      {message.date}
                    </p>
                    <p className="">
                      <span className="font-semibold">View:</span>{" "}
                      {message.view}
                    </p>
                  </div>
                )}
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default MessageList;
