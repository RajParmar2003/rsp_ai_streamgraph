import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Tooltip from "./Tooltip";

function Streamgraph({ data, colors }) {
  const svgRef = useRef();
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipModel, setTooltipModel] = useState("");
  const [tooltipColor, setTooltipColor] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!data.length) return;

    const margin = { top: 20, right: 100, bottom: 50, left: 50 }; // Adjusted right margin
    const width = 600 - margin.left - margin.right; // Reduced width
    const height = 400 - margin.top - margin.bottom;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const keys = Object.keys(data[0]).filter((key) => key !== "Date");
    const stackedData = d3.stack()
      .keys(keys)
      .offset(d3.stackOffsetWiggle)(data);

    // Scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.Date.toISOString()))
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(stackedData, (d) => d3.min(d, (d) => d[0])) - 20,
        d3.max(stackedData, (d) => d3.max(d, (d) => d[1])),
      ])
      .range([height, 0]);

    const colorScale = d3.scaleOrdinal().domain(keys).range(colors);

    // X-Axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(
        d3.axisBottom(xScale).tickFormat((d) => {
          const date = new Date(d);
          return d3.timeFormat("%b")(date); // Format as month names (Jan, Feb, etc.)
        })
      )
      .selectAll("text")
      .attr("transform", "translate(0, 5)")
      .style("text-anchor", "middle");

    // Streamgraph Layers
    svg
      .selectAll(".layer")
      .data(stackedData)
      .enter()
      .append("path")
      .attr("class", "layer")
      .attr(
        "d",
        d3
          .area()
          .curve(d3.curveCardinal)
          .x((d) => xScale(d.data.Date.toISOString()) + xScale.bandwidth() / 2)
          .y0((d) => yScale(d[0]))
          .y1((d) => yScale(d[1]))
      )
      .attr("fill", (d) => colorScale(d.key))
      .on("mousemove", (event, d) => {
        // Update tooltip state
        const [mouseX, mouseY] = d3.pointer(event);
        setTooltipData(data);
        setTooltipModel(d.key);
        setTooltipColor(colorScale(d.key));
        setTooltipPosition({ x: mouseX + 20, y: mouseY + 20 });
      })
      .on("mouseout", () => {
        // Hide tooltip
        setTooltipData(null);
      });
  }, [data, colors]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg ref={svgRef}></svg>
      {tooltipData && (
        <div
          style={{
            position: "absolute",
            top: tooltipPosition.y,
            left: tooltipPosition.x,
            background: "rgba(255, 255, 255, 0.9)",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "10px",
            pointerEvents: "none",
          }}
        >
          <Tooltip data={tooltipData} model={tooltipModel} color={tooltipColor} />
        </div>
      )}
    </div>
  );
}

export default Streamgraph;
