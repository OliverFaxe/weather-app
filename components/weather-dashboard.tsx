'use client';

import { useState, useRef, useEffect } from 'react';
import { PopoverForm } from './btnform';

interface WeatherCard {
  icon: string;
  value: string;
  unit: string;
  label: string;
}

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
        transform: `perspective(${isLarge ? '1400px' : '1200px'}) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${
          isHovered ? 16 : 0
        }px)`,
        transition: tilt.x === 0 && tilt.y === 0 ? 'transform 0.5s cubic-bezier(0.23, 1, 0.320, 1)' : 'none',
      }}
      className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary/50 transition-all duration-300 ${
        isLarge ? 'p-6 sm:p-8 md:p-10' : 'p-5 sm:p-6 md:p-8'
      }`}
    >
      {/* Base Card Background - shadcn card color */}
      <div className="absolute inset-0 bg-card" />

      {/* Hover Shadow Effect - creates contrast from background */}
      <div
        className={`absolute inset-0 rounded-2xl sm:rounded-3xl transition-all duration-500 ${
          isHovered
            ? 'shadow-xl sm:shadow-2xl shadow-primary/40'
            : 'shadow-sm sm:shadow-md shadow-primary/10'
        }`}
      />

      {/* Depth overlay on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-primary/15 to-transparent rounded-2xl sm:rounded-3xl transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div
          className={`mb-3 sm:mb-4 transition-all duration-500 ${
            isLarge ? 'text-4xl sm:text-5xl md:text-6xl' : 'text-3xl sm:text-4xl md:text-5xl'
          } ${isHovered ? 'scale-105' : 'scale-100'}`}
        >
          {item.icon}
        </div>

        {/* Value */}
        <div className="flex items-baseline gap-1 mb-1 sm:mb-2">
          <span
            className={`font-bold text-foreground transition-all duration-500 ${
              isLarge ? 'text-3xl sm:text-4xl md:text-5xl' : 'text-2xl sm:text-3xl md:text-4xl'
            }`}
          >
            {item.value}
          </span>
          <span className={`text-muted-foreground transition-all duration-500 ${isLarge ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg md:text-xl'}`}>
            {item.unit}
          </span>
        </div>

        {/* Label */}
        <p className="text-muted-foreground text-xs sm:text-sm md:text-base font-medium">{item.label}</p>
      </div>

      {/* Glossy top-left highlight */}
      <div className="absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-white/15 to-transparent rounded-full blur-2xl sm:blur-3xl -m-12 sm:-m-16 pointer-events-none" />
    </div>
  );
}

export function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState<any>(null);

  useEffect(() => {
    const lat = localStorage.getItem("Latitude") || "55.60";
    const lon = localStorage.getItem("Longitude") || "13.00";
    
    fetchData(parseFloat(lat), parseFloat(lon));
  }, []);

  function fetchData(latitude: number, longitude: number) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,visibility&hourly=uv_index&daily=sunrise,sunset&timezone=auto`;
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setWeatherData(data);
        console.log(data);
      })
      .catch(error => console.error('Error:', error));
  }

  const formatTime = (timeString: string) => {
    if (!timeString) return '--:--';
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const topCards: WeatherCard[] = [
    { 
      icon: '🌡️', 
      value: weatherData?.current?.temperature_2m ? Math.round(weatherData.current.temperature_2m).toString() : '--', 
      unit: '°c', 
      label: 'Temperature' 
    },
    { 
      icon: '🕐', 
      value: getCurrentTime(), 
      unit: '', 
      label: 'Current Time' 
    },
  ];

  const threeRowCards: WeatherCard[] = [
    { 
      icon: '💧', 
      value: weatherData?.current?.relative_humidity_2m?.toString() || '--', 
      unit: '%', 
      label: 'Humidity' 
    },
    { 
      icon: '💨', 
      value: weatherData?.current?.wind_speed_10m ? Math.round(weatherData.current.wind_speed_10m).toString() : '--', 
      unit: 'km/h', 
      label: 'Wind Speed' 
    },
    { 
      icon: '🔽', 
      value: weatherData?.current?.pressure_msl ? Math.round(weatherData.current.pressure_msl).toString() : '--', 
      unit: 'hPa', 
      label: 'Pressure' 
    },
  ];

  const gridCards: WeatherCard[] = [
    { 
      icon: '👁️', 
      value: weatherData?.current?.visibility ? (weatherData.current.visibility / 1000).toFixed(1) : '--', 
      unit: 'km', 
      label: 'Visibility' 
    },
    { 
      icon: '☁️', 
      value: weatherData?.current?.cloud_cover?.toString() || '--', 
      unit: '%', 
      label: 'Cloud Cover' 
    },
    { 
      icon: '☀️', 
      value: weatherData?.hourly?.uv_index?.[0]?.toFixed(1) || '--', 
      unit: '', 
      label: 'UV Index' 
    },
    { 
      icon: '🌧️', 
      value: weatherData?.current?.precipitation?.toString() || '0', 
      unit: 'mm', 
      label: 'Precipitation' 
    },
    { 
      icon: '🌬️', 
      value: weatherData?.current?.apparent_temperature ? Math.round(weatherData.current.apparent_temperature).toString() : '--', 
      unit: '°c', 
      label: 'Feels Like' 
    },
    { 
      icon: '🌅', 
      value: formatTime(weatherData?.daily?.sunrise?.[0]), 
      unit: '', 
      label: 'Sunrise' 
    },
  ];

  return (
    <div className="min-h-screen bg-background px-3 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-10 lg:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-1 sm:mb-2">
            Weather Dashboard
          </h1>
          <PopoverForm />
        </div>

        {/* Top Two Large Cards - Side by side on tablet+, stacked on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-4 sm:mb-5 md:mb-6">
          {topCards.map((item, index) => (
            <WeatherCard key={index} item={item} isLarge={true} />
          ))}
        </div>

        {/* Three Cards Row - 1 col mobile, 3 cols from tablet+ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-4 sm:mb-5 md:mb-6">
          {threeRowCards.map((item, index) => (
            <WeatherCard key={index} item={item} />
          ))}
        </div>

        {/* Six Cards Grid - 1 col mobile, 3 cols from tablet+ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {gridCards.map((item, index) => (
            <WeatherCard key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
