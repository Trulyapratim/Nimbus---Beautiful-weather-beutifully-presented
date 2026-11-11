const $ = (selector) => document.querySelector(selector);
const forecastContainer = $("#forecast-container");
const canvas = $("#temperature-chart");
let chart;

export function renderWeather(weather) {
  $("#greeting").textContent = getGreeting();
  $("#temperature").textContent = `${Math.round(weather.temperature)}°C`;
  $("#feels-like").textContent = `Feels like ${Math.round(weather.feelsLike)}°C`;
  $("#city").textContent = `${weather.city}, ${weather.country}`;
  $("#condition").textContent = weather.condition;
  $("#updated-time").textContent = `Updated ${formatTime(weather.updatedAt)}`;
  $("#humidity").textContent = `${weather.humidity}%`;
  $("#wind-speed").textContent = `${Math.round(weather.windSpeed)} km/h`;
  $("#pressure").textContent = `${weather.pressure} hPa`;
  $("#visibility").textContent = `${weather.visibility} km`;
  $("#uv-index").textContent = weather.uvIndex;
  $("#sunrise").textContent = weather.sunrise;
  renderForecast(weather.forecast);
  renderChart(weather.hourly);
}

function renderForecast(days) {
  forecastContainer.replaceChildren();
  days.forEach((day, index) => {
    const card = document.createElement("article");
    card.className = "forecast-card";
    const label = document.createElement("h3");
    label.textContent = index === 0 ? "Today" : formatDay(day.date);
    const icon = document.createElement("img");
    icon.src = `https:${day.icon}`;
    icon.alt = "";
    icon.width = 48;
    icon.height = 48;
    const temps = document.createElement("p");
    temps.innerHTML = `<span class="max-temp">${day.maxTemp}°</span> <span class="min-temp">${day.minTemp}°</span>`;
    card.append(label, icon, temps);
    forecastContainer.append(card);
  });
}

function renderChart(hours) {
  if (!window.Chart || !canvas) return;
  chart?.destroy();
  chart = new window.Chart(canvas, {
    type: "line",
    data: {
      labels: hours.map(({ time }) => formatHour(time)),
      datasets: [{
        data: hours.map(({ temperature }) => temperature),
        borderColor: "#3978e8",
        backgroundColor: "rgba(57, 120, 232, .12)",
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointBackgroundColor: "#3978e8",
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { ticks: { callback: (value) => `${value}°` } } },
    },
  });
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  if (hour < 21) return "Good Evening";
  return "Good Night";
}

function formatTime(value) {
  return new Date(value.replace(" ", "T")).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function formatDay(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString([], { weekday: "short" });
}

function formatHour(value) {
  return new Date(value.replace(" ", "T")).toLocaleTimeString([], { hour: "numeric" });
}

export function showLoading() {
  $("#search-button").disabled = true;
  $("#search-input").disabled = true;
  $("#search-button-content").innerHTML = '<span class="spinner" aria-label="Loading"></span>';
}

export function hideLoading() {
  $("#search-button").disabled = false;
  $("#search-input").disabled = false;
  $("#search-button-content").textContent = "🔎";
}

export function setAppState(state, message = "") {
  $("#empty-state").classList.toggle("hidden", state !== "empty");
  $("#error-card").classList.toggle("hidden", state !== "error");
  $("#weather-content").classList.toggle("hidden", state !== "success");
  if (state === "error") {
    $(".error-title").textContent = "Couldn't load weather";
    $(".error-message").textContent = message;
  }
}
