import { NextResponse, NextRequest } from "next/server";

type OpenMeteoHourly = {
  time: string[];
  temperature_2m: number[];
  rain: number[];
  cloud_cover: number[];
  uv_index: number[];
  direct_radiation: number[];
  snowfall: number[];
  apparent_temperature: number[];
};

type OpenMeteoResponse = {
  hourly: OpenMeteoHourly;
};

type WeatherResponse = {
  current: {
    time: string;
    temperature: number;
    rain: number;
    cloud_cover: number;
    uv_index: number;
    direct_radiation: number;
    snowfall: number;
    apparent_temperature: number;
  };
  hourly: {
    time: string;
    temperature: number;
    rain: number;
    cloud_cover: number;
    uv_index: number;
    direct_radiation: number;
    snowfall: number;
    apparent_temperature: number;
  }[];
};

// GET api/weather/current
export async function GET() {
  // Hämta resultaten från API:et
  const res = await fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=55.6059&longitude=13.0007&hourly=temperature_2m,rain,cloud_cover,uv_index,direct_radiation,snowfall,apparent_temperature",
  );

  const data: OpenMeteoResponse = await res.json(); // Hämtar de råa JSON responset från API:et

  const hourlyArray = []; //Skapar en tom array som ska fyllas med Objekt som representerar varje timme i veckan.
  for (let i = 1; i < data.hourly.temperature_2m.length; i++) {
    // loopar igenom alla för att skapa individuell objekt och pushar in det i den tomma arrayen
    hourlyArray.push({
      time: data.hourly.time[i],
      temperature: data.hourly.temperature_2m[i],
      rain: data.hourly.rain[i],
      cloud_cover: data.hourly.cloud_cover[i],
      uv_index: data.hourly.uv_index[i],
      direct_radiation: data.hourly.direct_radiation[i],
      snowfall: data.hourly.snowfall[i],
      apparent_temperature: data.hourly.apparent_temperature[i],
    });
  }

  let now = new Date(); // Tar dagens datum och tid
  let currentIndex = 0; // en variabel som vi använder för att visa rätt timme genom att loopa igenom alla timmar från JSON response.
  for (let i = 0; i < data.hourly.time.length; i++) {
    // loopar igenom alla timmar som hämtas från API:et
    let timeDate = new Date(data.hourly.time[i]); // en variabel som kör igenom alla dessa timmar
    if (
      timeDate.getHours() === now.getHours() && // om variabeln har samma värde i timmar och datum som dagens.hour & dagens.date ->
      timeDate.getDate() === now.getDate()
    ) {
      currentIndex = i; // låt currentIndex bli rätt tid
      break; // avsluta loopen
    }
  }

  const response: WeatherResponse = {
    current: {
      // Här sätter vi rätt tid från när anropet gjordes och visar aktuell timme.
      time: data.hourly.time[currentIndex],
      temperature: data.hourly.temperature_2m[currentIndex],
      rain: data.hourly.rain[currentIndex],
      cloud_cover: data.hourly.cloud_cover[currentIndex],
      uv_index: data.hourly.uv_index[currentIndex],
      direct_radiation: data.hourly.direct_radiation[currentIndex],
      snowfall: data.hourly.snowfall[currentIndex],
      apparent_temperature: data.hourly.apparent_temperature[currentIndex],
    },
    hourly: hourlyArray, // resterande + inkl currentIndex tid för att displaya hela veckans timmar.
  };

  return NextResponse.json(response);
}
