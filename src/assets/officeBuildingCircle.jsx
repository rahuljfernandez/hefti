import React from 'react';

export default function OfficeBuildingCircle(props) {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="1"
        y="1"
        width="62"
        height="62"
        rx="31"
        stroke="#2563EB"
        strokeWidth="2"
      />
      <path
        d="M19.625 45.5H44.375M20.75 18.5H43.25M21.875 18.5V45.5M42.125 18.5V45.5M27.5 24.125H29.75M27.5 28.625H29.75M27.5 33.125H29.75M34.25 24.125H36.5M34.25 28.625H36.5M34.25 33.125H36.5M27.5 45.5V40.4375C27.5 39.5055 28.2555 38.75 29.1875 38.75H34.8125C35.7445 38.75 36.5 39.5055 36.5 40.4375V45.5"
        stroke="#2563EB"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
