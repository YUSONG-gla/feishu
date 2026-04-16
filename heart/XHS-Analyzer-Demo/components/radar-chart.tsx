"use client";

import { useState, useEffect } from "react";

interface RadarChartProps {
  data: {
    label: string;
    value: number;
    fullLabel: string;
  }[];
}

export function RadarChart({ data }: RadarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Responsive sizing - smaller on mobile to prevent overflow
  const size = isMobile ? 280 : 340;
  const center = size / 2;
  const maxRadius = isMobile ? 70 : 100;
  const levels = 5;
  const labelRadius = isMobile ? maxRadius + 32 : maxRadius + 38;

  const angleStep = (2 * Math.PI) / data.length;
  const startAngle = -Math.PI / 2;

  // Simplified labels for space efficiency
  const shortLabels = [
    "情感", "环境", "脆弱", "认知", "语气", "情节", "解决", "发展", "转变"
  ];

  const getPoint = (index: number, value: number) => {
    const angle = startAngle + index * angleStep;
    const radius = (value / 10) * maxRadius;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  const gridLevels = Array.from({ length: levels }, (_, i) => (i + 1) / levels);

  const dataPoints = data.map((d, i) => getPoint(i, d.value));

  // Get label position with smart text anchor
  const getLabelPosition = (index: number) => {
    const angle = startAngle + index * angleStep;
    const x = center + labelRadius * Math.cos(angle);
    const y = center + labelRadius * Math.sin(angle);
    
    // Determine text anchor based on angle position
    const cosAngle = Math.cos(angle);
    let textAnchor: "start" | "middle" | "end" = "middle";
    
    // Right side of chart
    if (cosAngle > 0.4) textAnchor = "start";
    // Left side of chart
    else if (cosAngle < -0.4) textAnchor = "end";
    
    // Adjust y position for top/bottom labels
    const sinAngle = Math.sin(angle);
    let yOffset = 0;
    if (sinAngle < -0.7) yOffset = -4; // Top labels move up slightly
    if (sinAngle > 0.7) yOffset = 4;   // Bottom labels move down slightly
    
    return { x, y: y + yOffset, textAnchor };
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Container with responsive padding to prevent label overflow */}
      <div 
        className="relative"
        style={{ 
          padding: isMobile ? "16px" : "24px",
          width: "100%",
          maxWidth: size + (isMobile ? 80 : 100),
          margin: "0 auto"
        }}
      >
        <svg 
          width="100%" 
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          preserveAspectRatio="xMidYMid meet"
          className="overflow-visible"
        >
          {/* Grid levels - dashed polygons */}
          {gridLevels.map((level) => {
            const points = data.map((_, i) => {
              const angle = startAngle + i * angleStep;
              const radius = level * maxRadius;
              return `${center + radius * Math.cos(angle)},${center + radius * Math.sin(angle)}`;
            });
            return (
              <polygon
                key={level}
                points={points.join(" ")}
                fill="none"
                stroke="#E5E5E5"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Axis lines */}
          {data.map((_, i) => {
            const angle = startAngle + i * angleStep;
            const endX = center + maxRadius * Math.cos(angle);
            const endY = center + maxRadius * Math.sin(angle);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={endX}
                y2={endY}
                stroke="#E5E5E5"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Data polygon - stroke only, HeyTea style */}
          <polygon
            points={dataPoints.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="rgba(0,0,0,0.03)"
            stroke="black"
            strokeWidth="2"
          />

          {/* Data points */}
          {dataPoints.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r={hoveredIndex === i ? 5 : 3.5}
              fill="black"
              className="transition-all duration-200 cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}

          {/* Labels - simplified text, no truncation */}
          {data.map((_, i) => {
            const { x, y, textAnchor } = getLabelPosition(i);
            const label = shortLabels[i] || data[i].label.slice(0, 2);
            
            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                className="font-medium fill-current select-none"
                style={{ 
                  fontSize: isMobile ? "10px" : "11px",
                  letterSpacing: "0.02em"
                }}
              >
                {label}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Tooltip - positioned below chart */}
      {hoveredIndex !== null && (
        <div
          className="mt-2 bg-white border-2 border-black px-3 py-2 text-sm animate-fade-in-up"
          style={{ minWidth: "140px" }}
        >
          <p className="font-bold text-center">{data[hoveredIndex].fullLabel}</p>
          <p className="text-gray-600 text-center">得分: {data[hoveredIndex].value.toFixed(1)} / 10</p>
        </div>
      )}
    </div>
  );
}
