export async function GET(request) {
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    return Response.json({ error: { message: "Weather service is not configured. Add WEATHER_API_KEY in Vercel project settings." } }, { status: 500 });
  }

  const city = new URL(request.url).searchParams.get("city")?.trim();
  if (!city || city.length > 100) {
    return Response.json({ error: { message: "Enter a city name to search." } }, { status: 400 });
  }

  const url = new URL("https://api.weatherapi.com/v1/forecast.json");
  url.search = new URLSearchParams({ key: apiKey, q: city, days: "3", aqi: "yes" });

  try {
    const upstream = await fetch(url);
    const body = await upstream.text();
    return new Response(body, {
      status: upstream.status,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "s-maxage=600, stale-while-revalidate=300",
      },
    });
  } catch {
    return Response.json({ error: { message: "Weather is temporarily unavailable. Please try again." } }, { status: 502 });
  }
}
