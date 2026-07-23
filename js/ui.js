//Only one responsibility. Update the page.It shouldn't know where data came from.

// Cache DOM references once so they can be reused
// every time renderWeather() is called.

// =================Current weather References ====================

const greetingElement = document.getElementById("greeting");
const temperatureElement = document.getElementById("temperature");
const feelsLikeElement = document.getElementById("feels-like");
const cityElement = document.getElementById("city");
const conditionElement = document.getElementById("condition");
const updateElement = document.getElementById("updated-time");


// =============== Highlights References =============================

const humidityElement = document.getElementById("humidity");
const windSpeedElement = document.getElementById("wind-speed");
const pressureElement = document.getElementById("pressure");
const visibilityElement = document.getElementById("visibility");
const uvIndexElement = document.getElementById("uv-index");
const sunriseElement = document.getElementById("sunrise");


// ==================Forcast Element References ===================

const forecastContainerElement = document.getElementById("forecast-container");


// =================Chart References =============================

const temperatureChartCanvas = document.getElementById("temperature-chart");  // this is the canvas 

let temperatureChart = null;        // chart.js instance







export function renderWeather(weather) {
      renderCurrentWeather(weather);
      renderHighlights(weather);
      renderForecast(weather);
      renderTemperatureChart(weather);
}



// ===========renderCurrentWeather logic ===========================

function renderCurrentWeather(weather) {
      greetingElement.textContent = getGreeting();

      cityElement.textContent = weather.city;
      conditionElement.textContent = weather.condition;

      temperatureElement.textContent = `${weather.temperature.toFixed(1)}°C`;

      feelsLikeElement.textContent = `Feels like ${weather.feelsLike.toFixed(1)}°C`;

      updateElement.textContent = `Updated ${formatTime(weather.updatedAt)}`;
}


// ===================renderHighlights==================================

function renderHighlights(weather) {
      humidityElement.textContent = `${weather.humidity}%`;
      windSpeedElement.textContent = `${weather.windSpeed} km/h`;
      pressureElement.textContent = `${weather.pressure} hPa`;
      visibilityElement.textContent = `${weather.visibility} km`;
      uvIndexElement.textContent = weather.uvIndex;
      sunriseElement.textContent = weather.sunrise;
}



// =====================renderForecast===============================

function renderForecast(weather) {

      //     console.log("renderForecast called");

      forecastContainerElement.replaceChildren();
      /* named the forecast so that we can get the access of :- forecast.date, forecast.icon ,forecast.maxTemp, forecast.minTemp*/
      weather.forecast.forEach(forecast => {
            const card = createForecastCard(forecast);

            forecastContainerElement.appendChild(card);
      });
}


function createForecastCard(forecast) {
      const card = document.createElement("div");
      card.classList.add("forecast-card");

      card.innerHTML = `
            <h2>${formatDay(forecast.date)}</h2>
            <img src="https:${forecast.icon}" alt="Forecast Icon">
            <p>
                  <span class = "max-temp">${forecast.maxTemp}°</span>
                  /
                  <span class = "min-temp">${forecast.minTemp}°</span>
            </p>
      `;
      return card;
}




// ====================renderchart=================================

function renderTemperatureChart(weather) {
      // Extract array of time strings for x-axis
      const labels = weather.hourly.map(hour => formatHour(hour.time));
      // // Extract array of temperature strings for y-axis
      const temperatures = weather.hourly.map(hour => hour.temperature);


      // console.log(labels);
      // console.log(temperatures);

      if (temperatureChart) {
            temperatureChart.destroy();
      }


      // chart implementation

      const chartConfig = {
            type: "line",

            data: {
                  labels,
                  datasets: [
                        {
                              label: "Temperature",
                              data: temperatures,

                              borderColor: "#3b82f6",

                              backgroundColor: ({ chart }) => {
                                    const { ctx, chartArea } = chart;

                                    if (!chartArea) {
                                          return "rgba(59,130,246,0.12)";
                                    }

                                    const gradient = ctx.createLinearGradient(
                                          0,
                                          chartArea.top,
                                          0,
                                          chartArea.bottom
                                    );

                                    gradient.addColorStop(
                                          0,
                                          "rgba(59,130,246,0.20)"
                                    );

                                    gradient.addColorStop(
                                          1,
                                          "rgba(59,130,246,0)"
                                    );

                                    return gradient;
                              },

                              fill: true,

                              tension: 0.4,

                              borderWidth: 3,

                              pointRadius: 3,

                              pointHoverRadius: 6,

                              pointBackgroundColor: "#ffffff",

                              pointBorderColor: "#3b82f6",

                              pointBorderWidth: 2
                        }
                  ]

            },

            options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  interaction: {
                        mode: 'index',
                        intersect: false, // Smooth hover interaction
                  },
                  plugins: {
                        legend: {
                              display: false // Clutter removal: the user already knows this is a temperature chart
                        },
                        tooltip: {
                              backgroundColor: 'rgba(17, 24, 39, 0.9)', // Dark tooltip
                              padding: 12,
                              cornerRadius: 8,
                              displayColors: false, // Clutter removal: hides the redundant little color box inside the tooltip
                        }
                  },
                  scales: {
                        x: {
                              grid: {
                                    display: false, // Removes vertical grid lines entirely
                              },
                              border: {
                                    display: false  // Removes the heavy baseline axis border
                              },
                              ticks: {
                                    color: '#9ca3af', // Visually subtle gray text 
                                    padding: 10
                              }
                        },
                        y: {
                              grid: {
                                    color: 'rgba(0, 0, 0, 0.04)', // Barely visible horizontal lines for quiet data support
                                    drawTicks: false // Removes the tiny default tick marks on the axis
                              },
                              border: {
                                    display: false // Removes the heavy vertical axis border
                              },
                              ticks: {
                                    color: '#9ca3af', // Visually subtle gray text
                                    padding: 10
                              }
                        }
                  }
            },
      }
      temperatureChart = new Chart(temperatureChartCanvas, chartConfig);
}







// Implemented getGreeting

function getGreeting() {
      const now = new Date();

      const currentHour = now.getHours();

      if (currentHour >= 5 && currentHour < 12) {
            return "Good Morning";
      }

      if (currentHour >= 12 && currentHour < 17) {
            return "Good Afternoon";
      }

      if (currentHour >= 17 && currentHour < 21) {
            return "Good Evening";
      }

      return "Good Night";
}


// ================Formatting helper=======================

function formatTime(updatedAt) {

      const date = new Date(updatedAt);

      let hours = date.getHours();
      let minutes = date.getMinutes();

      const ampm = hours >= 12 ? 'PM' : 'AM';

      // 2. Convert 24-hour time to 12-hour time
      // The modulo operator (%) divides by 12 and returns the remainder. 
      // 14 % 12 = 2. 
      hours = hours % 12;

      hours = hours ? hours : 12;

      minutes = minutes.toString().padStart(2, '0');

      return `${hours}:${minutes} ${ampm}`;
}



function formatDay(date) {
      const day = new Date(date);

      return day.toLocaleDateString("en-US", {
            weekday: "short"
      });
}



function formatHour(time) {
      const date = new Date(time);
      let hours = date.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // Converts 0 (midnight) to 12
      return `${hours} ${ampm}`;
}