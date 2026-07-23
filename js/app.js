import { fetchWeather } from "./api.js";
import { renderWeather } from "./ui.js";

const searchForm = document.getElementById("search-form"); // // Listen for the form's submit event

const searchInput = document.getElementById("search-input"); // searchInput is a reference to the <input> element itself.

// // Listen for the user submitting the search form

searchForm.addEventListener("submit", async (event) => { // the event is created by browser as we have form feed in the html. async because we can use await.
      event.preventDefault(); // stops the browser from reloading the page.

      const inputData = searchInput.value;

      const city = inputData.trim();

      if (!city) return; // validates the input before making a network request.

      try {
            const weather = await fetchWeather(city);
            renderWeather(weather);
      }
      catch(error){
            console.error(error);
      }

      
});
