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

    // Initialize map centered on India
    const map = L.map(mapRef.current).setView([20.5937, 78.9629], 5);
    mapInstanceRef.current = map;

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add weather overlay layer (OpenWeatherMap)
    // Note: Requires API key for production use
    const weatherLayer = L.tileLayer(
      `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=demo`,
      {
        attribution: '© OpenWeatherMap',
        opacity: 0.6,
      }
    );

    // Add cloud layer
    const cloudLayer = L.tileLayer(
      `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=demo`,
      {
        attribution: '© OpenWeatherMap',
        opacity: 0.5,
      }
    );

    // Add wind layer
    const windLayer = L.tileLayer(
      `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=demo`,
      {
        attribution: '© OpenWeatherMap',
        opacity: 0.5,
      }
    );

    // Layer control
    const overlays = {
      "Rainfall": weatherLayer,
      "Clouds": cloudLayer,
      "Wind": windLayer,
    };

    L.control.layers(undefined, overlays).addTo(map);

    // Add some sample markers for major agricultural regions
    const regions = [
      { name: "Punjab - Wheat Belt", coords: [31.1471, 75.3412] },
      { name: "Uttar Pradesh - Sugarcane", coords: [26.8467, 80.9462] },
      { name: "Maharashtra - Cotton", coords: [19.7515, 75.7139] },
      { name: "Tamil Nadu - Rice", coords: [11.1271, 78.6569] },
      { name: "Karnataka - Coffee", coords: [15.3173, 75.7139] },
    ];

    regions.forEach((region) => {
      L.marker(region.coords)
        .addTo(map)
        .bindPopup(`<b>${region.name}</b><br>Click for weather details`);
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
          Interactive map with real-time weather layers for rainfall, temperature, wind, and storm predictions
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
              Monitor wind patterns and speed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Storm Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Real-time severe weather warnings
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interactive Weather Map</CardTitle>
          <CardDescription>
            Use the layer control (top right) to toggle different weather overlays. 
            Click on markers to view regional information.
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
          <p>• Click on <strong>markers</strong> to see regional agricultural information</p>
          <p>• Combine multiple layers to analyze weather patterns comprehensively</p>
        </CardContent>
      </Card>
    </div>
  );
}
