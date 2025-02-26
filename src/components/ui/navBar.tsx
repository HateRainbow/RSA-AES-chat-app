import React from "react";

export default function ChatHeader() {
  return <div>ChatHeader</div>;
}

const getFormattedTime = () => {
  const now = new Date();
  return (
    now.toLocaleDateString("sv-SE") +
    " " +
    now.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" })
  );
};
