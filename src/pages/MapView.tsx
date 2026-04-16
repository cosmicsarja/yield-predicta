import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Cloud, Droplets, Wind, Thermometer, Loader2 } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { fetchWeatherByCoordinates, type WeatherData } from "@/lib/weather";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const regions = [
  { name: "Punjab - Wheat Belt", coords: [31.1471, 75.3412] as [number, number] },
  { name: "Uttar Pradesh - Sugarcane", coords: [26.8467, 80.9462] as [number, number] },
  { name: "Maharashtra - Cotton", coords: [19.7515, 75.7139] as [number, number] },
  { name: "Tamil Nadu - Rice", coords: [11.1271, 78.6569] as [number, number] },
  { name: "Karnataka - Coffee", coords: [15.3173, 75.7139] as [number, number] },
];

export default function MapView() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [regionWeather, setRegionWeather] = useState<Array<WeatherData & { name: string }>>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([20.5937, 78.9629], 5);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    let active = true;

    Promise.all(
      regions.map(async (region) => {
        try {
          const weather = await fetchWeatherByCoordinates(region.coords[0], region.coords[1], region.name);
          return { ...weather, name: region.name, coords: region.coords };
        } catch {
          return null;
        }
      })
    ).then((items) => {
      if (!active) return;

      const validItems = items.filter(Boolean) as Array<WeatherData & { name: string; coords: [number, number] }>;
      setRegionWeather(validItems.map(({ coords, ...rest }) => rest));

      validItems.forEach((item) => {
        L.marker(item.coords)
          .addTo(map)
          .bindPopup(`
            <div style="min-width: 220px;">
              <b>${item.name}</b><br>
              <hr style="margin: 8px 0;">
              🌡️ Temperature: ${item.temperature}°C<br>
              💧 Humidity: ${item.humidity}%<br>
              🌧️ Rainfall: ${item.rainfall} mm<br>
              💨 Wind: ${item.windSpeed} km/h ${item.windDirection}<br>
              ☁️ Clouds: ${item.cloudCover}%<br>
              📝 ${item.description}
            </div>
          `);
      });

      setLoading(false);
    });

    return () => {
      active = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MapPin className="h-8 w-8 text-primary" />
          Agricultural Map & Weather
        </h1>
        <p className="text-muted-foreground mt-2">
          Regional weather map for major farming zones with live field conditions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interactive Weather Map</CardTitle>
          <CardDescription>
            Click a marker to view live weather for each agricultural region.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div
              ref={mapRef}
              className="w-full h-[600px] rounded-lg border"
              style={{ minHeight: "600px" }}
            />
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/70 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading map data...
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
        {regionWeather.map((item) => (
          <Card key={item.name}>
            <CardHeader>
              <CardTitle className="text-base">{item.name}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2"><Thermometer className="h-4 w-4 text-primary" /> {item.temperature}°C</div>
              <div className="flex items-center gap-2"><Droplets className="h-4 w-4 text-primary" /> {item.humidity}%</div>
              <div className="flex items-center gap-2"><Wind className="h-4 w-4 text-primary" /> {item.windSpeed} km/h</div>
              <div className="flex items-center gap-2"><Cloud className="h-4 w-4 text-primary" /> {item.cloudCover}%</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
