import React from "react";

function Legend({ models, colors }) {
  // Reverse the models and colors arrays
  const reversedModels = [...models].reverse();
  const reversedColors = [...colors].reverse();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        position: "absolute",
        right: "10%", // Dynamically adjust closer to the middle-right
        top: "38%", // Align with the middle-top section of the graph
        lineHeight: "1.8",
      }}
    >
      {reversedModels.map((model, index) => (
        <div
          key={model}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "5px",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: reversedColors[index], // Use reversed color order
              marginRight: "10px",
            }}
          ></div>
          <span style={{ fontSize: "14px", fontWeight: "500" }}>{model}</span>
        </div>
      ))}
    </div>
  );
}

export default Legend;
