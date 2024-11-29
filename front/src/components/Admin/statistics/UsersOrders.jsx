import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import axios from "axios";

function OrdersPerCustomerLineChart() {
  const chartRef = useRef();

  useEffect(() => {
    const fetchCustomerOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3001/order/orders-statistics");
        createLineChart(response.data);
      } catch (error) {
        console.error("Error fetching orders per customer:", error);
      }
    };

    fetchCustomerOrders();
  }, []);

  const createLineChart = (data) => {
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const baseWidth = 800;
    const extraWidthPerDataPoint = 20; // רוחב נוסף פר משתמש
    const dynamicWidth = Math.max(baseWidth, data.length * extraWidthPerDataPoint); // התאמת הרוחב

    const width = dynamicWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(chartRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .html("") // איפוס התוכן הקיים
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // סקאלות
    const x = d3.scaleBand()
      .domain(data.map(d => d.fullName || "Unknown"))
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.totalOrders)])
      .nice() // מתיחה לטווח נעים
      .range([height, 0]);

    // ציר X
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    // ציר Y
    svg.append("g")
      .call(d3.axisLeft(y));

    // הקו
    const line = d3.line()
      .x(d => x(d.fullName || "Unknown") + x.bandwidth() / 2)
      .y(d => y(d.totalOrders))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", 2)
      .attr("d", line);

    // נקודות על הקו
    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.fullName || "Unknown") + x.bandwidth() / 2)
      .attr("cy", d => y(d.totalOrders))
      .attr("r", 4)
      .attr("fill", "#69b3a2")
      .on("mouseover", (event, d) => {
        tooltip.style("visibility", "visible").text(`${d.fullName || "Unknown"}: ${d.totalOrders} orders`);
      })
      .on("mousemove", event => {
        tooltip
          .style("top", `${event.pageY - 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", () => tooltip.style("visibility", "hidden"));

    // כלי עזר להצגת נתונים (Tooltip)
    const tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid #ccc")
      .style("padding", "5px")
      .style("border-radius", "4px")
      .style("visibility", "hidden");
  };


  return (
    <div>
      <h2>Orders number per User</h2>
      <svg ref={chartRef}></svg>
    </div>
  );
}

export default OrdersPerCustomerLineChart;
