export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  windDirection: string;
  cloudCover: number;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  soilMoisture: number | null;
}

interface GeocodingResult {
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

const weatherCodeMap: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
};

export const getWindDirection = (degrees: number): string => {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

const formatLocation = (geo: GeocodingResult): string => {
  return [geo.name, geo.admin1, geo.country].filter(Boolean).join(", ");
};

export const geocodeLocation = async (query: string): Promise<GeocodingResult> => {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`
  );

  if (!response.ok) {
    throw new Error("Unable to search location right now");
  }

  const data = await response.json();
  const match = data.results?.[0];

  if (!match) {
    throw new Error("Location not found");
  }

  return match;
};

export const fetchWeatherByCoordinates = async (
  latitude: number,
  longitude: number,
  location: string
): Promise<WeatherData> => {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,cloud_cover,wind_speed_10m,wind_direction_10m,weather_code&hourly=soil_moisture_0_to_1cm&forecast_days=1&timezone=auto`
  );

  if (!response.ok) {
    throw new Error("Unable to fetch weather data");
  }

  const data = await response.json();
  const current = data.current;

  if (!current) {
    throw new Error("Weather data unavailable");
  }

  return {
    temperature: Math.round(current.temperature_2m),
    humidity: current.relative_humidity_2m,
    rainfall: current.precipitation,
    windSpeed: Math.round(current.wind_speed_10m),
    windDirection: getWindDirection(current.wind_direction_10m ?? 0),
    cloudCover: current.cloud_cover,
    description: weatherCodeMap[current.weather_code] || "Current conditions",
    location,
    latitude,
    longitude,
    soilMoisture: typeof data.hourly?.soil_moisture_0_to_1cm?.[0] === "number"
      ? Math.round(data.hourly.soil_moisture_0_to_1cm[0] * 100)
      : null,
  };
};

export const fetchWeatherByCity = async (city: string): Promise<WeatherData> => {
  const geo = await geocodeLocation(city);
  return fetchWeatherByCoordinates(geo.latitude, geo.longitude, formatLocation(geo));
};

export const getFarmingRecommendations = (weather: WeatherData): string[] => {
  const recommendations: string[] = [];

  if (weather.temperature > 32) {
    recommendations.push("High temperature detected — irrigate early morning or evening to reduce water loss.");
  }

  if (weather.humidity < 40) {
    recommendations.push("Low humidity — monitor soil moisture closely and consider mulching.");
  }

  if (weather.rainfall > 4) {
    recommendations.push("Recent rainfall — inspect drainage and delay fertilizer application if soil is saturated.");
  }

  if (weather.windSpeed > 25) {
    recommendations.push("Strong winds — protect delicate crops and avoid spraying right now.");
  }

  if (weather.soilMoisture !== null && weather.soilMoisture < 20) {
    recommendations.push("Topsoil moisture looks low — prioritize irrigation for young plants and shallow roots.");
  }

  if (recommendations.length === 0) {
    recommendations.push("Conditions look stable for routine farming work, monitoring, and field scouting.");
  }

  return recommendations;
};
