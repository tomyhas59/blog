import React, { useState, useEffect } from "react";

const Drag = () => {
  const [buttonPosition, setButtonPosition] = useState(0);
  const [isMovingRight, setIsMovingRight] = useState(true);

  useEffect(() => {
    const container = document.getElementById("container");
    const containerWidth = container.offsetWidth;
    const buttonWidth = 100;
    const maxButtonX = containerWidth - buttonWidth;
    const speed = 1; // 이동 속도 (조절 가능)

    const intervalId = setInterval(() => {
      setButtonPosition((prevPosition) => {
        let newPosition;
        if (isMovingRight) {
          newPosition = prevPosition + speed;
          if (newPosition >= maxButtonX) {
            newPosition = maxButtonX;
            setIsMovingRight(false);
          }
        } else {
          newPosition = prevPosition - speed;
          if (newPosition <= 0) {
            newPosition = 0;
            setIsMovingRight(true);
          }
        }
        return newPosition;
      });
    }, 10);

    return () => {
      clearInterval(intervalId);
    };
  }, [isMovingRight]);

  return (
    <div
      id="container"
      style={{
        width: "500px",
        height: "100px",
        position: "relative",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          width: "100px",
          height: "100px",
          position: "absolute",
          left: buttonPosition + "px",
        }}
      >
        안녕하세요
      </div>
    </div>
  );
};

export default Drag;
