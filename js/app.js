import { fetchWeather } from "./api.js";
import { applyWeatherTheme } from "./theme.js";
import { renderWeather, showLoading, hideLoading, setAppState } from "./ui.js";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = searchInput.value.trim();
  if (!city) {
    searchInput.focus();
    return;
  }

  showLoading();
  setAppState("loading");

  try {
    const weather = await fetchWeather(city);
    renderWeather(weather);
    applyWeatherTheme(weather.condition);
    setAppState("success");
  } catch (error) {
    setAppState("error", error.message);
  } finally {
    hideLoading();
  }
});
