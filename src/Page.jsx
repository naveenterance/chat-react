import React, { useEffect } from "react";
import addNotification from "react-push-notification";

const Page = ({ sender, title, message }) => {
  const buttonClick = () => {
    {
      message &&
        addNotification({
          title: sender,
          subtitle: sender,
          message: message,
          theme: "darkblue",
          native: true, // when using native, your OS will handle theming.
        });
    }
  };

  // Use useEffect to run the buttonClick function every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      buttonClick();
    }, 15000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [message]); // The empty dependency array ensures the effect runs only once after the initial render

  // Return some JSX here
  return (
    <div className="page">
      <p></p>
    </div>
  );
};

export default Page;
