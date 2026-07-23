// the brain of the Nimbus . IT listen to the use and take actions.

import { API_KEY, BASE_URL } from "./config.js";

export async function fetchWeather(city) {
      const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=yes`;

      // now fetch the url into response we will use await as so that We tell this async function to pause until the Promise returned by fetch() is fulfilled.. If we had simply used the fetch() it would have returned only promise. 
      const response = await fetch(url); // here we will have respone object istead of json.
      if (!response.ok) {  // checks if responsse is valid or not.
            throw new Error("City not found!");
      }

      const data = await response.json(); // Calling response.json() reads the response body and parses it as JSON.The result is converted into a normal JavaScript object.So after this line:data is not JSON anymore.It is a JavaScript object.
      // return data; // this is not wrong but here our entire application now depends on WeatherAPI's response format.


      const forecastArray = data.forecast.forecastday.map(dayData => {     // used map to remove unnecessary data from the WeatherAPI array
            return {
                  date: dayData.date, // Raw date string, e.g., "2026-07-21"
                  icon: dayData.day.condition.icon,
                  maxTemp: Math.round(dayData.day.maxtemp_c),
                  minTemp: Math.round(dayData.day.mintemp_c)
            };
      });

      const hourlyArray = data.forecast.forecastday[0].hour.filter((_, index) => index % 3 === 0) // Takes hours at index 0, 3, 6, 9, 12..
      .map(hourData => {
            return {
                  time: hourData.time,
                  temperature: Math.round(hourData.temp_c)
            };
      });

      


      // NOW we should do data normalization 
      const weather = {
            // Location
            city: data.location.name,
            country: data.location.country,

            // Temperature
            temperature: data.current.temp_c,
            feelsLike: data.current.feelslike_c,

            // Condition
            condition: data.current.condition.text,
            icon: data.current.condition.icon,

            //Atmosphere
            humidity: data.current.humidity,
            pressure: data.current.pressure_mb,
            visibility: data.current.vis_km,

            // Wind
            windSpeed: data.current.wind_kph,

            // Air Quality
            uvIndex: data.current.uv,
            pm25: data.current.air_quality.pm2_5,
            pm10: data.current.air_quality.pm10,
            airQualityIndex: data.current.air_quality["us-epa-index"],

            sunrise: data.forecast.forecastday[0].astro.sunrise,

            // Metadata
            updatedAt: data.current.last_updated,


            forecast: forecastArray,

            hourly: hourlyArray,
      };
      // console.log("My normalized weather object:", weather);

      // console.log(weather.hourly);

      return weather;





}

