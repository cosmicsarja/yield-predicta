import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudSun, Droplets, Wind, Thermometer, Cloud, Loader2, Navigation, Sprout } from "lucide-react";
import { toast } from "sonner";
import { fetchWeatherByCity, getFarmingRecommendations, type WeatherData } from "@/lib/weather";

export default function WeatherUpdates() {
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const fetchWeather = async (city: string) => {
    setLoading(true);
    try {
      const data = await fetchWeatherByCity(city);
      setWeather(data);
      toast.success("Weather data updated!");
    } catch (error: any) {
      console.error("Weather fetch error:", error);
      toast.error(error.message || "Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      fetchWeather(location.trim());
    }
  };

  const recommendations = weather ? getFarmingRecommendations(weather) : [];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CloudSun className="h-8 w-8 text-primary" />
          Weather Updates
        </h1>
        <p className="text-muted-foreground mt-2">
          Live weather information and practical field recommendations
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Location</CardTitle>
          <CardDescription>Enter a city or town to get current weather data</CardDescription>
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
                <CardTitle className="text-sm font-medium">Wind Direction</CardTitle>
                <Navigation className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{weather.windDirection}</div>
                <p className="text-xs text-muted-foreground mt-1">Direction</p>
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
                <p className="text-xs text-muted-foreground mt-1">Current precipitation</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="h-5 w-5 text-primary" />
                Farming Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {recommendations.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
