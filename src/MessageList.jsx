import React, { useState, useEffect } from "react";

import { useQuery } from "react-query";
import * as jose from "jose";

const MessageList = ({ user, onSelectMessageSender }) => {
  const {
    data: messages,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(
    ["messages", user],
    async () => {
      const response = await fetch(
        `https://chat-log-naveenterances-projects.vercel.app/messages/${user}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch data");
      }

      return data.data;
    },
    {
      refetchInterval: 1,
    }
  );

  if (isLoading) {
    return (
      <>
        <div className="flex gap-4 items-center mt-4">
          <div className="skeleton w-16 h-16 rounded-full shrink-0"></div>
          <div className="flex flex-col gap-4">
            <div className="skeleton h-4 w-20"></div>
            <div className="skeleton h-4 w-28"></div>
          </div>
        </div>
        <div className="mt-12 ">
          <div className="skeleton h-4 w-3/4 ml-2 mt-8"></div>
          <div className="skeleton h-4 w-3/4 ml-2 mt-8"></div>
          <div className="skeleton h-4 w-3/4 ml-2 mt-8"></div>
          <div className="skeleton h-4 w-3/4 ml-2 mt-8"></div>
          <div className="skeleton h-4 w-3/4 ml-2 mt-8"></div>
          <div className="skeleton h-4 w-3/4 ml-2 mt-8"></div>
        </div>
      </>
    );
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  const token = localStorage.getItem("token");
  const claims = jose.decodeJwt(token);

  const senderInfo = new Map();

  messages.forEach((message) => {
    if (
      message.message === "[Added as a contact]" ||
      message.sender === claims.name ||
      message.view == "Seen"
    ) {
      return;
    }

    const sender = message.sender;

    // Update sender information
    senderInfo.set(sender, {
      count: (senderInfo.get(sender)?.count || 0) + 1,
      lastUnseenMessage: message,
    });
  });

  return (
    <div>
      {senderInfo.size ? (
        <div className="container mx-auto p-4 ">
          <div className="overflow-x-auto animate__animated animate__fadeInUp">
            <table className="table">
              <tbody>
                {[...senderInfo.entries()].map(([sender, info]) => (
                  <tr
                    key={sender}
                    className="mb-4 border-4 border-transparent hover:border-x-error shadow-lg  "
                    onClick={() => onSelectMessageSender(sender)}
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img
                              src={`https://robohash.org/${sender}?set=set3`}
                              alt="Avatar Tailwind CSS Component"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{sender}</div>
                          <div className="badge badge-error gap-2 ">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6 m-2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                              />
                            </svg>
                            <div className="font-bold">{info.count}</div>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      {" "}
                      {info.lastUnseenMessage && (
                        <div className="text-sm">
                          {info.lastUnseenMessage.message}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <>
          <div className="m-auto  text-2xl font-light flex p-8 animate__animated animate__fadeInUp">
            <img
              width="100"
              height="100"
              src="https://img.icons8.com/clouds/100/clouds.png"
              alt="clouds"
            />
            <div className="ml-4 italic">No new messages</div>
          </div>
        </>
      )}
    </div>
  );
};

export default MessageList;
