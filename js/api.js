export async function fetchWeather(city) {
  const proxyUrl = `/api/weather?city=${encodeURIComponent(city)}`;
  let response;

  try {
    response = await fetch(proxyUrl);
  } catch {
    throw new Error("Couldn't connect. Check your internet connection and try again.");
  }

  // A basic local static server has no Vercel function, so use the ignored
  // local config file as a development fallback.
  if (response.status === 404) {
    return fetchWeatherLocally(city);
  }

  const data = await response.json();
  if (!response.ok) {
    if (response.status === 400) throw new Error("We couldn't find that location. Check the spelling and try again.");
    if (response.status === 401 || response.status === 403) throw new Error("The weather API key is invalid or unavailable. Check your Vercel WEATHER_API_KEY setting.");
    throw new Error(data.error?.message || "Weather is temporarily unavailable. Please try again.");
  }

  return normalizeWeather(data);
}

async function fetchWeatherLocally(city) {
  let config;
  try {
    config = await import("./config.js");
  } catch {
    throw new Error("Weather service is not configured. Add WEATHER_API_KEY in Vercel, or create js/config.js from js/configexample.js for local use.");
  }

  const { API_KEY, BASE_URL } = config;
  if (!API_KEY || API_KEY === "YOUR_WEATHERAPI_KEY") {
    throw new Error("Add your WeatherAPI key in js/config.js to get started.");
  }

  const url = new URL(`${BASE_URL}/forecast.json`);
  url.search = new URLSearchParams({ key: API_KEY, q: city, days: "3", aqi: "yes" });
  let response;
  try {
    response = await fetch(url);
  } catch {
    throw new Error("Couldn't connect. Check your internet connection and try again.");
  }

  const data = await response.json();
  if (!response.ok) {
    if (response.status === 400) throw new Error("We couldn't find that location. Check the spelling and try again.");
    if (response.status === 401 || response.status === 403) throw new Error("The local WeatherAPI key is invalid or unavailable. Check js/config.js.");
    throw new Error(data.error?.message || "Weather is temporarily unavailable. Please try again.");
  }
  return normalizeWeather(data);
}

function normalizeWeather(data) {
  return {
    city: data.location.name,
    country: data.location.country,
    temperature: data.current.temp_c,
    feelsLike: data.current.feelslike_c,
    condition: data.current.condition.text,
    icon: data.current.condition.icon,
    humidity: data.current.humidity,
    pressure: data.current.pressure_mb,
    visibility: data.current.vis_km,
    windSpeed: data.current.wind_kph,
    uvIndex: data.current.uv,
    pm25: data.current.air_quality?.pm2_5 ?? null,
    pm10: data.current.air_quality?.pm10 ?? null,
    airQualityIndex: data.current.air_quality?.["us-epa-index"] ?? null,
    sunrise: data.forecast.forecastday[0].astro.sunrise,
    updatedAt: data.current.last_updated,
    forecast: data.forecast.forecastday.map((day) => ({
      date: day.date,
      icon: day.day.condition.icon,
      maxTemp: Math.round(day.day.maxtemp_c),
      minTemp: Math.round(day.day.mintemp_c),
    })),
    hourly: data.forecast.forecastday[0].hour.filter((_, index) => index % 3 === 0).map((hour) => ({
      time: hour.time,
      temperature: Math.round(hour.temp_c),
    })),
  };
}
