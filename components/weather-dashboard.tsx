'use client';

import { useState, useRef } from 'react';

interface WeatherCard {
  icon: string;
  value: string;
  unit: string;
  label: string;
}

const topCard: WeatherCard = {
  icon: '🌡️',
  value: '24',
  unit: '°c',
  label: 'Temperature',
};

const twoRowCards: WeatherCard[] = [
  { icon: '💧', value: '65', unit: '%', label: 'Humidity' },
  { icon: '💨', value: '12', unit: 'km/h', label: 'Wind Speed' },
];

const gridCards: WeatherCard[] = [
  { icon: '👁️', value: '10', unit: 'km', label: 'Visibility' },
  { icon: '🔽', value: '1013', unit: 'hPa', label: 'Pressure' },
  { icon: '☁️', value: '40', unit: '%', label: 'Cloud Cover' },
  { icon: '☀️', value: '6', unit: '', label: 'UV Index' },
  { icon: '🌧️', value: '20', unit: '%', label: 'Rain Chance' },
  { icon: '🌬️', value: '22', unit: '°c', label: 'Feels Like' },
];

interface CardState {
  x: number;
  y: number;
}

function WeatherCard({
  item,
  isLarge = false,
}: {
  item: WeatherCard;
  isLarge?: boolean;
}) {
  const [tilt, setTilt] = useState<CardState>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = (e.clientX - rect.left - centerX) / centerX;
    const y = (e.clientY - rect.top - centerY) / centerY;

    setTilt({
      x: -y * 8,
      y: x * 8,
    });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current || e.touches.length === 0) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = (e.touches[0].clientX - rect.left - centerX) / centerX;
    const y = (e.touches[0].clientY - rect.top - centerY) / centerY;

    setTilt({
      x: -y * 8,
      y: x * 8,
    });
    setIsHovered(true);
  };

  const handleTouchEnd = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      style={{
        transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${
          isHovered ? 16 : 0
        }px)`,
        transition: tilt.x === 0 && tilt.y === 0 ? 'transform 0.5s cubic-bezier(0.23, 1, 0.320, 1)' : 'none',
      }}
      className={`group relative rounded-3xl overflow-hidden cursor-pointer outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary/50 transition-all duration-300 ${
        isLarge ? 'p-8 sm:p-10' : 'p-6 sm:p-8'
      }`}
    >
      {/* Base Card Background - shadcn card color */}
      <div className="absolute inset-0 bg-card" />

      {/* Hover Shadow Effect - creates contrast from background */}
      <div
        className={`absolute inset-0 rounded-3xl transition-all duration-500 ${
          isHovered
            ? 'shadow-2xl shadow-primary/40'
            : 'shadow-md shadow-primary/10'
        }`}
      />

      {/* Depth overlay on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-primary/15 to-transparent rounded-3xl transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div
          className={`mb-4 transition-all duration-500 ${
            isLarge ? 'text-5xl sm:text-6xl' : 'text-4xl sm:text-5xl'
          } ${isHovered ? 'scale-105' : 'scale-100'}`}
        >
          {item.icon}
        </div>

        {/* Value */}
        <div className="flex items-baseline gap-1 mb-2">
          <span
            className={`font-bold text-foreground transition-all duration-500 ${
              isLarge ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl'
            }`}
          >
            {item.value}
          </span>
          <span className={`text-muted-foreground transition-all duration-500 ${isLarge ? 'text-2xl' : 'text-lg sm:text-xl'}`}>
            {item.unit}
          </span>
        </div>

        {/* Label */}
        <p className="text-muted-foreground text-sm sm:text-base font-medium">{item.label}</p>
      </div>

      {/* Glossy top-left highlight */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-white/15 to-transparent rounded-full blur-3xl -m-16 pointer-events-none" />
    </div>
  );
}

export function WeatherDashboard() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2">
            Weather Dashboard
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">Hover or touch cards to interact</p>
        </div>

        {/* Top Large Card */}
        <div className="mb-6">
          <WeatherCard item={topCard} isLarge={true} />
        </div>

        {/* Two Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {twoRowCards.map((item, index) => (
            <WeatherCard key={index} item={item} />
          ))}
        </div>

        {/* Six Cards Grid (3x2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {gridCards.map((item, index) => (
            <WeatherCard key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
