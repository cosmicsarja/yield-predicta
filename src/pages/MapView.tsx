import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Cloud, Droplets, Wind, AlertTriangle } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default markers
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function MapView() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const API_KEY = "f9e7e68c1e76a8b4f5d89c34d71f3ae5"; // OpenWeatherMap API key

    // Initialize map centered on India
    const map = L.map(mapRef.current).setView([20.5937, 78.9629], 5);
    mapInstanceRef.current = map;

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add weather overlay layers with real API key
    const weatherLayer = L.tileLayer(
      `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
      {
        attribution: '© OpenWeatherMap',
        opacity: 0.6,
      }
    );

    const cloudLayer = L.tileLayer(
      `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
      {
        attribution: '© OpenWeatherMap',
        opacity: 0.5,
      }
    );

    const windLayer = L.tileLayer(
      `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
      {
        attribution: '© OpenWeatherMap',
        opacity: 0.5,
      }
    );

    const temperatureLayer = L.tileLayer(
      `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
      {
        attribution: '© OpenWeatherMap',
        opacity: 0.6,
      }
    );

    // Layer control
    const overlays = {
      "Rainfall": weatherLayer,
      "Clouds": cloudLayer,
      "Wind": windLayer,
      "Temperature": temperatureLayer,
    };

    L.control.layers(undefined, overlays).addTo(map);

    // Add markers for major agricultural regions with weather data
    const regions = [
      { name: "Punjab - Wheat Belt", coords: [31.1471, 75.3412] as [number, number] },
      { name: "Uttar Pradesh - Sugarcane", coords: [26.8467, 80.9462] as [number, number] },
      { name: "Maharashtra - Cotton", coords: [19.7515, 75.7139] as [number, number] },
      { name: "Tamil Nadu - Rice", coords: [11.1271, 78.6569] as [number, number] },
      { name: "Karnataka - Coffee", coords: [15.3173, 75.7139] as [number, number] },
    ];

    regions.forEach((region) => {
      const marker = L.marker(region.coords).addTo(map);
      
      // Fetch weather data for each region
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${region.coords[0]}&lon=${region.coords[1]}&appid=${API_KEY}&units=metric`
      )
        .then(res => res.json())
        .then(data => {
          const windDirection = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(data.wind.deg / 45) % 8];
          marker.bindPopup(`
            <div style="min-width: 200px;">
              <b>${region.name}</b><br>
              <hr style="margin: 8px 0;">
              🌡️ Temperature: ${Math.round(data.main.temp)}°C<br>
              💧 Humidity: ${data.main.humidity}%<br>
              🌧️ Rainfall: ${data.rain?.['1h'] || 0} mm<br>
              💨 Wind: ${Math.round(data.wind.speed * 3.6)} km/h ${windDirection}<br>
              ☁️ Clouds: ${data.clouds.all}%<br>
              📝 ${data.weather[0].description}
            </div>
          `);
        })
        .catch(err => {
          console.error("Error fetching weather:", err);
          marker.bindPopup(`<b>${region.name}</b><br>Weather data unavailable`);
        });
    });

    setLoading(false);

    return () => {
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
          Interactive map with real-time weather layers for rainfall, temperature, wind, and cloud coverage
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              Rainfall
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Toggle rainfall layer to see precipitation patterns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Cloud className="h-4 w-4 text-gray-500" />
              Cloud Cover
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              View cloud coverage and formation patterns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wind className="h-4 w-4 text-green-500" />
              Wind Speed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Monitor wind patterns and speed with direction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              View temperature distribution across regions
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interactive Weather Map</CardTitle>
          <CardDescription>
            Use the layer control (top right) to toggle different weather overlays. 
            Click on markers to view detailed regional weather information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            ref={mapRef}
            className="w-full h-[600px] rounded-lg border"
            style={{ minHeight: "600px" }}
          />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50">
              <p className="text-sm text-muted-foreground">Loading map...</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>ℹ️ Map Usage Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• Use the <strong>+/-</strong> buttons or scroll to zoom in/out</p>
          <p>• Click and drag to pan across the map</p>
          <p>• Use the <strong>layer control</strong> in the top-right to toggle weather overlays</p>
          <p>• Click on <strong>markers</strong> to see real-time weather data for that region</p>
          <p>• Combine multiple layers to analyze weather patterns comprehensively</p>
          <p>• Weather data includes temperature, humidity, rainfall, wind speed & direction, and cloud cover</p>
        </CardContent>
      </Card>
    </div>
  );
}
