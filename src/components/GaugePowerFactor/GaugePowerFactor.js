import React from "react";
import GaugeChart from "react-gauge-chart";

export default function GaugePowerFactor({ value }) {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <GaugeChart
        id="power-factor-gauge"
        nrOfLevels={4}
        colors={["#2196f3", "#26a69a", "#8bc34a"]}
        arcWidth={0.3}
        percent={value}
        needleColor="#000"
        needleBaseColor="#000"
        textColor="#000"
        hideText={true}
        style={{ width: "80%" }}
      />
    </div>
  );
}
