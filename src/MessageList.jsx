// import React, { useState, useEffect } from "react";

// const MessageList = ({ user }) => {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const response = await fetch(`http://localhost:4000/messages/${user}`);
//         const data = await response.json();

//         if (!response.ok) {
//           throw new Error(data.error || "Failed to fetch data");
//         }

//         setMessages(data.data);
//         setLoading(false);
//       } catch (error) {
//         setError(error.message);
//         setLoading(false);
//       }
//     };

//     fetchMessages();
//   }, [user]);

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (error) {
//     return <p>Error: {error}</p>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">Messages for {user}</h2>
//       <ul className="list-disc pl-4">
//         {messages.map((message) => (
//           <li key={message._id} className="mb-4">
//             <div className="bg-gray-100 p-4 border rounded-md">
//               <p className="text-blue-800 font-bold">
//                 <span className="font-semibold">Sender:</span> {message.sender}
//               </p>
//               <p className="text-green-600">
//                 <span className="font-semibold">Receiver:</span>{" "}
//                 {message.receiver}
//               </p>
//               <p className="text-gray-700">
//                 <span className="font-semibold">Message:</span>{" "}
//                 {message.message}
//               </p>
//               <p className="text-gray-500">
//                 <span className="font-semibold">Date:</span> {message.date}
//               </p>
//               <p className="text-purple-600">
//                 <span className="font-semibold">View:</span> {message.view}
//               </p>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default MessageList;
import React from "react";
import { useQuery } from "react-query";

const MessageList = ({ user }) => {
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

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Messages for {user}</h2>
      <ul className="list-disc pl-4">
        {messages.map((message) => (
          <li key={message._id} className="mb-4">
            <div className="bg-gray-100 p-4 border rounded-md">
              <p className="text-blue-800 font-bold">
                <span className="font-semibold">Sender:</span> {message.sender}
              </p>
              <p className="text-green-600">
                <span className="font-semibold">Receiver:</span>{" "}
                {message.receiver}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Message:</span>{" "}
                {message.message}
              </p>
              <p className="text-gray-500">
                <span className="font-semibold">Date:</span> {message.date}
              </p>
              <p className="text-purple-600">
                <span className="font-semibold">View:</span> {message.view}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageList;
