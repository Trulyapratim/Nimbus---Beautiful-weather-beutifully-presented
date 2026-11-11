const themes = {
  clear: ["#fff7e8", "#fffdf8", "#e99b28"],
  cloudy: ["#edf2f8", "#ffffff", "#64748b"],
  rain: ["#e9f0fa", "#f8fbff", "#3978e8"],
  storm: ["#e8eaf3", "#f8f8fc", "#6256a5"],
  snow: ["#eef7fb", "#ffffff", "#4d9db8"],
  mist: ["#eef1f2", "#ffffff", "#70838b"],
};

export function applyWeatherTheme(condition = "") {
  const text = condition.toLowerCase();
  let key = "cloudy";
  if (/thunder|storm/.test(text)) key = "storm";
  else if (/snow|sleet|ice|blizzard/.test(text)) key = "snow";
  else if (/rain|drizzle|shower/.test(text)) key = "rain";
  else if (/mist|fog|haze/.test(text)) key = "mist";
  else if (/clear|sunny/.test(text)) key = "clear";

  const [background, surface, accent] = themes[key];
  const root = document.documentElement;
  root.style.setProperty("--background", background);
  root.style.setProperty("--surface", surface);
  root.style.setProperty("--accent", accent);
}
