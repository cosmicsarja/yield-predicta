import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudSun, Droplets, Wind, Thermometer, Cloud, Loader2, Navigation, Sprout, Search, Map } from "lucide-react";
import { toast } from "sonner";
import { fetchWeatherByCity, getFarmingRecommendations, type WeatherData } from "@/lib/weather";
import { useTranslation } from "react-i18next";

export default function WeatherUpdates() {
  const { t } = useTranslation();
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const fetchWeather = async (city: string) => {
    setLoading(true);
    try {
      const data = await fetchWeatherByCity(city);
      setWeather(data);
      toast.success(t("common.success"));
    } catch (error: any) {
      console.error("Weather fetch error:", error);
      toast.error(error.message || t("common.error"));
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

  const weatherCards = weather ? [
    { label: t("weather.temperature"), value: `${weather.temperature}°C`, icon: Thermometer, desc: t("weather.currentTemp"), color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: t("weather.humidity"), value: `${weather.humidity}%`, icon: Droplets, desc: t("weather.relativeHumidity"), color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: t("weather.windSpeed"), value: `${weather.windSpeed} km/h`, icon: Wind, desc: t("weather.currentWind"), color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { label: t("weather.windDirection"), value: weather.windDirection, icon: Navigation, desc: t("weather.direction"), color: "text-violet-500", bg: "bg-violet-500/10" },
    { label: t("weather.cloudCover"), value: `${weather.cloudCover}%`, icon: Cloud, desc: t("weather.skyCoverage"), color: "text-gray-500", bg: "bg-gray-500/10" },
    { label: t("weather.rainfall"), value: `${weather.rainfall} mm`, icon: Droplets, desc: t("weather.currentPrecip"), color: "text-teal-500", bg: "bg-teal-500/10" },
  ] : [];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CloudSun className="h-8 w-8 text-primary" />
          {t("weather.title")}
        </h1>
        <p className="text-muted-foreground mt-2">{t("weather.liveInfo")}</p>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            {t("weather.searchLocation")}
          </CardTitle>
          <CardDescription>{t("weather.enterCity")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              placeholder={t("weather.searchPlaceholder")}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("common.loading")}
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  {t("weather.search")}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {!weather && !loading && (
        <div className="text-center py-16 text-muted-foreground">
          <CloudSun className="h-16 w-16 mx-auto mb-4 opacity-30" />
          <p>{t("weather.noWeatherYet")}</p>
        </div>
      )}

      {weather && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold">
              {weather.location}
            </h2>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20">
              {weather.description}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {weatherCards.map(({ label, value, icon: Icon, desc, color, bg }) => (
              <Card key={label} className="hover:shadow-medium transition-smooth">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{label}</CardTitle>
                  <div className={`p-2 rounded-lg ${bg}`}>
                    <Icon className={`h-4 w-4 ${color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${color}`}>{value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sprout className="h-5 w-5 text-primary" />
                  {t("weather.farmingRecs")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {recommendations.map((item) => (
                    <li key={item} className="flex items-start gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
                      <span className="text-primary mt-0.5 shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="overflow-hidden h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Map className="h-5 w-5 text-primary" />
                  {t("weather.radarMap", "Local Weather Map")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1 relative min-h-[300px]">
                <iframe
                  key={`windy-${weather.latitude}-${weather.longitude}`}
                  src={`https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=%C2%B0C&metricWind=km/h&zoom=5&overlay=rain&product=ecmwf&level=surface&lat=${weather.latitude}&lon=${weather.longitude}`}
                  title="Live Weather Map"
                  className="absolute inset-0 w-full h-full border-0"
                  allow="geolocation"
                  loading="lazy"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
