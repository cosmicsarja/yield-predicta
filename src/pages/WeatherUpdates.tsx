import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudSun, Droplets, Wind, Thermometer, Cloud, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  cloudCover: number;
  description: string;
  location: string;
}

export default function WeatherUpdates() {
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const fetchWeather = async (city: string) => {
    setLoading(true);
    try {
      // Using OpenWeatherMap API - users should add their API key
      const API_KEY = "demo"; // This is a demo key - users need to add their own
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error("City not found or API key required");
      }

      const data = await response.json();
      
      setWeather({
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        rainfall: data.rain?.["1h"] || 0,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        cloudCover: data.clouds.all,
        description: data.weather[0].description,
        location: data.name,
      });
      
      toast.success("Weather data updated!");
    } catch (error: any) {
      console.error("Weather fetch error:", error);
      toast.error("Please add your OpenWeatherMap API key in Settings");
      
      // Demo data for testing
      setWeather({
        temperature: 28,
        humidity: 65,
        rainfall: 2.5,
        windSpeed: 15,
        cloudCover: 40,
        description: "Partly cloudy",
        location: city,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      fetchWeather(location);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CloudSun className="h-8 w-8 text-primary" />
          Weather Updates
        </h1>
        <p className="text-muted-foreground mt-2">
          Real-time weather information for better farming decisions
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Location</CardTitle>
          <CardDescription>Enter city name to get current weather data</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              placeholder="Enter city name..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Get Weather"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {weather && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            {weather.location} - {weather.description}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Temperature</CardTitle>
                <Thermometer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{weather.temperature}°C</div>
                <p className="text-xs text-muted-foreground mt-1">Current temperature</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Humidity</CardTitle>
                <Droplets className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{weather.humidity}%</div>
                <p className="text-xs text-muted-foreground mt-1">Relative humidity</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Wind Speed</CardTitle>
                <Wind className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{weather.windSpeed} km/h</div>
                <p className="text-xs text-muted-foreground mt-1">Current wind speed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Cloud Cover</CardTitle>
                <Cloud className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{weather.cloudCover}%</div>
                <p className="text-xs text-muted-foreground mt-1">Sky coverage</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Rainfall</CardTitle>
                <Droplets className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{weather.rainfall} mm</div>
                <p className="text-xs text-muted-foreground mt-1">Last hour</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Farming Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {weather.temperature > 30 && (
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">⚠️</span>
                    <span>High temperature - Ensure adequate irrigation for crops</span>
                  </li>
                )}
                {weather.humidity < 40 && (
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500">⚠️</span>
                    <span>Low humidity - Monitor soil moisture levels closely</span>
                  </li>
                )}
                {weather.rainfall > 5 && (
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">💧</span>
                    <span>Recent rainfall - Check drainage systems and avoid waterlogging</span>
                  </li>
                )}
                {weather.windSpeed > 25 && (
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">⚠️</span>
                    <span>Strong winds - Protect delicate crops and check support structures</span>
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
