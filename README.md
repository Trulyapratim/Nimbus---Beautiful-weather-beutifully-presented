# Nimbus

Nimbus is a responsive weather dashboard. Search for a city to see current conditions, weather highlights, a three-day forecast, and an hourly temperature chart. The page theme changes with the weather.

## Run locally

1. Create a free API key at [WeatherAPI](https://www.weatherapi.com/).
2. Copy `js/configexample.js` to `js/config.js` and add your key in `js/config.js`.
3. Serve the project folder with any static web server. For example, run `python3 -m http.server 8000` from the project folder and open `http://localhost:8000`.

The app uses ES modules, so opening `index.html` directly as a `file://` URL may not work. Chart.js is loaded from jsDelivr; the rest of the app is static HTML, CSS, and JavaScript.

## Deploy

Deploy the project folder to GitHub Pages, Netlify, or another static host after adding your WeatherAPI key. `js/config.js` is intentionally ignored by Git to keep your local key out of the repository. Add a deployment-time config file or use a small serverless proxy for your hosted site. A key embedded in a browser app is visible to visitors, so restrict it to your domain where possible; use a serverless proxy if you need to keep it private.

## Project structure

- `index.html` — page structure
- `css/` — styles and design tokens
- `js/app.js` — search and application flow
- `js/api.js` — WeatherAPI request and data mapping
- `js/ui.js` — rendering, chart, and loading/error states
- `js/theme.js` — weather-based color themes
- `js/configexample.js` — safe config template; copy it to the ignored `js/config.js` for local use

WeatherAPI provides the current conditions and forecast. Chart.js is distributed by jsDelivr.
