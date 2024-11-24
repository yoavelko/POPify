import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { getProductsWithPopularity } from "../../../utils/OrderRoutes";

const ProductPopularityD3 = () => {
  const chartRef = useRef(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // שליפת נתוני פופולריות מהממשק
    const fetchProductPopularity = async () => {
      try {
        const response = await axios.get('http://localhost:3001/order/with-popularity');
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching product popularity:", error.message);
      }
    };

    fetchProductPopularity();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const svg = d3.select(chartRef.current);

      const width = 600;
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

      // סקאלות
      const x = d3.scaleBand()
        .domain(products.map(d => d.name))
        .range([0, chartWidth])
        .padding(0.1);

      const y = d3.scaleLinear()
        .domain([0, d3.max(products, d => d.purchaseCount)])
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
        .call(d3.axisLeft(y));

      // ציור העמודות
      chart.selectAll(".bar")
        .data(products)
        .join("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.purchaseCount))
        .attr("width", x.bandwidth())
        .attr("height", d => chartHeight - y(d.purchaseCount))
        .attr("fill", "steelblue");

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
      <h2>Product Popularity (D3.js)</h2>
      <svg ref={chartRef}></svg>
    </div>
  );
};

export default ProductPopularityD3;
