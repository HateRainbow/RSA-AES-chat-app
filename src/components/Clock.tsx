import React, { useState } from "react";

export default function Clock() {
  const [currentTime, setCurrentTime] = useState("");

  const getCurrentTime = () => {
    const date = new Date();
    setCurrentTime(date.toLocaleTimeString());
  };

  // Call getCurrentTime every second
  setInterval(getCurrentTime, 1000);

  return <p>{currentTime}</p>;
}
