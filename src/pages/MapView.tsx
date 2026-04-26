import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin, Cloud, Droplets, Wind, Thermometer,
  Maximize2, Layers, Info, CloudRain, Gauge, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";

const WINDY_BASE = "https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=%C2%B0C&metricWind=km/h&zoom=5&overlay=rain&product=ecmwf&level=surface&lat=20&lon=78&p:off";

const layerOptions = [
  {
    key: "precip",
    icon: CloudRain,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    url: "https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=%C2%B0C&metricWind=km/h&zoom=5&overlay=rain&product=ecmwf&level=surface&lat=20&lon=78&p:off",
  },
  {
    key: "temp",
    icon: Thermometer,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    url: "https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=%C2%B0C&metricWind=km/h&zoom=5&overlay=temp&product=ecmwf&level=surface&lat=20&lon=78&p:off",
  },
  {
    key: "wind",
    icon: Wind,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    url: "https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=%C2%B0C&metricWind=km/h&zoom=5&overlay=wind&product=ecmwf&level=surface&lat=20&lon=78&p:off",
  },
  {
    key: "clouds",
    icon: Cloud,
    color: "text-gray-500",
    bg: "bg-gray-500/10",
    border: "border-gray-400/30",
    url: "https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=%C2%B0C&metricWind=km/h&zoom=5&overlay=clouds&product=ecmwf&level=surface&lat=20&lon=78&p:off",
  },
  {
    key: "humidity",
    icon: Droplets,
    color: "text-teal-500",
    bg: "bg-teal-500/10",
    border: "border-teal-500/30",
    url: "https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=%C2%B0C&metricWind=km/h&zoom=5&overlay=rh&product=ecmwf&level=surface&lat=20&lon=78&p:off",
  },
  {
    key: "pressure",
    icon: Gauge,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    url: "https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=%C2%B0C&metricWind=km/h&zoom=5&overlay=pressure&product=ecmwf&level=surface&lat=20&lon=78&p:off",
  },
  {
    key: "storms",
    icon: Zap,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    url: "https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=%C2%B0C&metricWind=km/h&zoom=5&overlay=cape&product=ecmwf&level=surface&lat=20&lon=78&p:off",
  },
];

export default function MapView() {
  const { t } = useTranslation();
  const [activeUrl, setActiveUrl] = useState(WINDY_BASE);
  const [activeLayer, setActiveLayer] = useState("precip");

  const indicatorKeys = [
    "wind", "temp", "rain", "clouds", "humidity", "pressure", "storms"
  ] as const;

  return (
    <div className="container mx-auto p-4 max-w-7xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <MapPin className="h-7 w-7 text-primary" />
            {t("map.title")}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{t("map.subtitle")}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open("https://www.windy.com", "_blank")}
          className="gap-2 shrink-0"
        >
          <Maximize2 className="h-4 w-4" />
          {t("map.openFullscreen")}
        </Button>
      </div>

      {/* Layer Selector */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            {t("map.layers")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {layerOptions.map((layer, i) => {
              const Icon = layer.icon;
              const indicatorKey = indicatorKeys[i];
              return (
                <button
                  key={layer.key}
                  onClick={() => {
                    setActiveLayer(layer.key);
                    setActiveUrl(layer.url);
                  }}
                  className={`
                    flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 text-center
                    ${activeLayer === layer.key
                      ? `${layer.bg} ${layer.border} ${layer.color} shadow-sm scale-105`
                      : "border-border hover:border-primary/30 hover:bg-muted/50"
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 ${activeLayer === layer.key ? layer.color : "text-muted-foreground"}`} />
                  <span className={`text-xs font-medium leading-tight ${activeLayer === layer.key ? layer.color : "text-muted-foreground"}`}>
                    {t(`map.indicators.${indicatorKey}`).split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Zoom.earth Map Embed */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">{t("map.mapTitle")}</CardTitle>
              <CardDescription className="text-xs mt-0.5">{t("map.mapDesc")}</CardDescription>
            </div>
            <Badge variant="secondary" className="text-xs gap-1 shrink-0">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              LIVE
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative w-full" style={{ paddingBottom: "56.25%", minHeight: "400px" }}>
            <iframe
              key={activeUrl}
              src={activeUrl}
              title="Live Weather Map"
              className="absolute inset-0 w-full h-full border-0"
              style={{ minHeight: "400px" }}
              allow="geolocation"
              loading="lazy"
            />
          </div>
        </CardContent>
      </Card>

      {/* Indicator Reference Cards */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            {t("map.layerGuide")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {layerOptions.map((layer, i) => {
              const Icon = layer.icon;
              const indicatorKey = indicatorKeys[i];
              return (
                <button
                  key={layer.key}
                  onClick={() => {
                    setActiveLayer(layer.key);
                    setActiveUrl(layer.url);
                  }}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 text-left w-full
                    ${activeLayer === layer.key ? `${layer.bg} ${layer.border}` : "border-border hover:bg-muted/40"}
                  `}
                >
                  <div className={`p-2 rounded-lg ${layer.bg} shrink-0`}>
                    <Icon className={`h-4 w-4 ${layer.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate ${activeLayer === layer.key ? layer.color : ""}`}>
                      {t(`map.indicators.${indicatorKey}`)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Usage Guide */}
      <Card className="bg-muted/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{t("map.usage.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>{t("map.usage.zoom")}</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>{t("map.usage.pan")}</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>{t("map.usage.layers")}</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>{t("map.usage.markers")}</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>{t("map.usage.combine")}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
