"use client";

import * as React from "react";

interface SliderProps {
  min: number;
  max: number;
  value: number[];
  onValueChange: (value: number[]) => void;
  step?: number;
  className?: string;
}

export default function Slider({
  min,
  max,
  value,
  onValueChange,
  step = 1,
  className = "",
}: SliderProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const sliderRef = React.useRef<HTMLDivElement>(null);

  const percentage = (val: number) => ((val - min) / (max - min)) * 100;

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newValue = min + percentage * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));

    const newValueArray = [...value];
    newValueArray[0] = clampedValue;
    onValueChange(newValueArray);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={sliderRef}
      className={`relative h-2 bg-neutral-200 rounded-full ${className}`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Track */}
      <div
        className="absolute h-full bg-primary-600 rounded-full shadow-lg shadow-primary-500/30"
        style={{
          left: `${percentage(value[0])}%`,
          right: `${100 - percentage(value[1])}%`,
        }}
      />

      {/* Thumb 1 */}
      <div
        className="absolute w-4 h-4 bg-white border-2 border-primary-600 rounded-full cursor-pointer -top-1 shadow-md hover:scale-110 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        style={{ left: `calc(${percentage(value[0])}% - 8px)` }}
        onMouseDown={handleMouseDown}
      />

      {/* Thumb 2 */}
      <div
        className="absolute w-4 h-4 bg-white border-2 border-primary-600 rounded-full cursor-pointer -top-1 shadow-md hover:scale-110 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        style={{ left: `calc(${percentage(value[1])}% - 8px)` }}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}
