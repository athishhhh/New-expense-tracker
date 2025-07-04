import React, { useContext } from "react";
import { GlobalContext } from "../context/Global";
import { Chart } from "react-google-charts";

export function PieChart  ()  {
  const { transactions } = useContext(GlobalContext);
  let data = [];
  
  const expeseTransactions = transactions.filter((t) => t.type === "expense");

  if (expeseTransactions.length === 0){
    return  (<p>No expense data to display </p>);
  }
  
  data = [
    ["Category", "Amount"],

    ...expeseTransactions.map((t) => [t.text, Math.abs(t.amount)]),
  ];



  const options = {

    title: '',
    pieHole: 0.4,
    is3D: true,
    pieStartAngle: 100,
    sliceVisibilityThreshold: 0.02,
    legend: { 
      position: 'bottom', 
      alignment: 'center',
      textStyle: {
        color: "#233238",
        fontSize: 14,
      }, },
      colors: ["#8AD1C2", "#9F8AD1", "#D18A99", "#BCD18A", "#D1C28A"],
  };
  return (
    <div
      className="pie-chart-container"
      style={{
        background: "linear-gradient(135deg, rgba(6, 0, 65, 0.75), rgb(15, 15, 15))",
        boxShadow: "0 8px 32px rgba(31, 38, 135, 0.37)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.18)",
        color: "#eaeaea",
        padding: "1rem"
      }}
    >
      <h3 className="h3Ai" style={{ color: "#eaeaea" }}>Expense Distribution</h3>
      <Chart
        chartType="PieChart"
        data={data}
        options={{
          ...options,
          backgroundColor: { fill: "transparent" },
          legend: {
            ...options.legend,
            textStyle: {
              ...options.legend.textStyle,
              color: "#eaeaea"
            }
          }
        }}
        width={"100%"}
        height={"300px"}
      />
    </div>
  );
}
