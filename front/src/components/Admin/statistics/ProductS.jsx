import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const ProductPopularityD3 = () => {
  const chartRef = useRef(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // שליפת נתוני פופולריות מהממשק
    const fetchProductPopularity = async () => {
      try {
        const response = await axios.get('http://localhost:3001/order/with-popularity');
        // מיון המוצרים לפי כמות רכישות בסדר יורד
        const sortedProducts = response.data.sort((a, b) => b.purchaseCount - a.purchaseCount);
        setProducts(sortedProducts);
      } catch (error) {
        console.error("Error fetching product popularity:", error.message);
      }
    };

    fetchProductPopularity();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const svg = d3.select(chartRef.current);

      const width = 600; // רוחב קבוע של הגרף
      const height = 400;
      const margin = { top: 20, right: 30, bottom: 40, left: 50 };

      const chartWidth = width - margin.left - margin.right;
      const chartHeight = height - margin.top - margin.bottom;

      // ניקוי ה-SVG לפני הציור מחדש
      svg.selectAll("*").remove();

      const chart = svg
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // יצירת Tooltip
      const tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "1px solid #ccc")
        .style("padding", "5px")
        .style("border-radius", "4px")
        .style("visibility", "hidden")
        .style("box-shadow", "0px 4px 6px rgba(0, 0, 0, 0.1)");

      // סקאלות
      const x = d3.scaleBand()
        .domain(products.map(d => d.name)) // סדר המוצרים בהתאם למיון
        .range([0, chartWidth])
        .paddingInner(0.2) // רווח פנימי שווה
        .paddingOuter(0.1); // רווח חיצוני קטן

      const y = d3.scaleLinear()
        .domain([0, d3.max(products, d => Math.ceil(d.purchaseCount))*1.1]) // מבטיח טווח שלם
        .nice()
        .range([chartHeight, 0]);

      // ציר X
      chart.append("g")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

      // ציר Y
      chart.append("g")
        .call(d3.axisLeft(y).ticks(d3.max(products, d => Math.ceil(d.purchaseCount))));

      // ציור העמודות
      chart.selectAll(".bar")
        .data(products)
        .join("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.purchaseCount))
        .attr("width", x.bandwidth()) // רוחב דינמי לכל עמודה
        .attr("height", d => chartHeight - y(d.purchaseCount))
        .attr("fill", "steelblue")
        .on("mouseover", (event, d) => {
          tooltip.style("visibility", "visible").text(`Product: ${d.name}`);
        })
        .on("mousemove", event => {
          tooltip
            .style("top", `${event.pageY - 10}px`)
            .style("left", `${event.pageX + 10}px`);
        })
        .on("mouseout", () => {
          tooltip.style("visibility", "hidden");
        });

      // הוספת טקסט על העמודות
      chart.selectAll(".label")
        .data(products)
        .join("text")
        .attr("class", "label")
        .attr("x", d => x(d.name) + x.bandwidth() / 2)
        .attr("y", d => y(d.purchaseCount) - 5)
        .attr("text-anchor", "middle")
        .text(d => d.purchaseCount);
    }
  }, [products]);

  return (
    <div>
      <h2>Product Popularity</h2>
      <svg ref={chartRef}></svg>
    </div>
  );
};

export default ProductPopularityD3;
