import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function Tooltip({ data, model, color }) {
  const svgRef = useRef();

  useEffect(() => {
    const width = 200;
    const height = 100;
    const margin = { top: 10, right: 10, bottom: 30, left: 30 };

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    // Clear previous content
    svg.selectAll("*").remove();

    // Append group for chart
    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse dates for the X-axis
    const parsedData = data.map((d) => ({
      ...d,
      Date: new Date(d.Date),
    }));

    // Scales
    const xScale = d3
      .scaleBand()
      .domain(parsedData.map((d) => d3.timeFormat("%b")(d.Date))) // Format months for X-axis
      .range([0, width])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(parsedData, (d) => d[model])])
      .range([height, 0]);

    // X-Axis
    chart
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "middle");

    // Y-Axis
    chart.append("g").call(d3.axisLeft(yScale).ticks(5));

    // Bars
    chart
      .selectAll("rect")
      .data(parsedData)
      .join("rect")
      .attr("x", (d) => xScale(d3.timeFormat("%b")(d.Date)))
      .attr("y", (d) => yScale(d[model]))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d[model]))
      .attr("fill", color); // Use the color passed from the hovered section
  }, [data, model, color]);

  return <svg ref={svgRef}></svg>;
}

export default Tooltip;
