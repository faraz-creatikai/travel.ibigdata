"use client";
import React from "react";

const ProgressCircle = ({
  percentage = 0,
  size = 120,
  strokeWidth = 12,
  color = "#4f46e5",
  outerStrokeWidth = 2,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const outerRadius = radius + strokeWidth / 2 + 6;
  const outerCircumference = 2 * Math.PI * outerRadius;

  const cx = (size + 30) / 2;
  const cy = (size + 30) / 2;

  // Glow intensity based on percentage
  const glowOpacity = 0.15 + (percentage / 100) * 0.35;

  return (
    <div className="relative flex items-center justify-center">

      {/* ── Glow bloom behind circle ── */}
      <div
        className="absolute rounded-full blur-xl pointer-events-none transition-all duration-500"
        style={{
          width: size * 0.7,
          height: size * 0.7,
          background: color,
          opacity: glowOpacity,
        }}
      />

      <svg
        width={size + 30}
        height={size + 30}
        className="rotate-[-90deg] drop-shadow-sm"
      >
        {/* ── Outer dashed orbit ring ── */}
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={outerStrokeWidth}
          r={outerRadius}
          cx={cx}
          cy={cy}
          strokeDasharray="3 7"
          opacity={0.25}
        />

        {/* ── Track circle (dark/light) ── */}
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={cx}
          cy={cy}
          className="text-slate-100 dark:text-white/[0.07]"
        />

        {/* ── Soft inner shadow ring ── */}
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth * 0.4}
          r={radius}
          cx={cx}
          cy={cy}
          opacity={0.12}
        />

        {/* ── Progress arc ── */}
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx={cx}
          cy={cy}
          className="transition-all duration-500 ease-in-out"
          style={{
            filter: `drop-shadow(0 0 6px ${color}90)`,
          }}
        />

        {/* ── Subtle cap dot at progress end ── */}
        {percentage > 3 && percentage < 100 && (() => {
          const angle = ((percentage / 100) * 360 - 90) * (Math.PI / 180);
          const dotX = cx + radius * Math.cos(angle);
          const dotY = cy + radius * Math.sin(angle);
          return (
            <circle
              cx={dotX}
              cy={dotY}
              r={strokeWidth / 2.8}
              fill={color}
              style={{ filter: `drop-shadow(0 0 4px ${color})` }}
            />
          );
        })()}
      </svg>

      {/* ── Center content ── */}
      <div className="absolute flex flex-col items-center justify-center gap-0.5">
        <span
          className="font-black leading-none tracking-tight"
          style={{
            fontSize: size * 0.2,
            color: color,
          }}
        >
          {percentage}
          <span
            className="font-bold"
            style={{ fontSize: size * 0.11, opacity: 0.7 }}
          >
            %
          </span>
        </span>
      </div>
    </div>
  );
};

export default ProgressCircle;