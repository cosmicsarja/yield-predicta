import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Sprout, Droplets, Bug, Sun, Wind } from "lucide-react";

const tips = [
  {
    category: "Soil Health",
    icon: Sprout,
    color: "text-green-600",
    tips: [
      "Test soil pH regularly - most crops prefer 6.0-7.0 pH range",
      "Add organic matter like compost to improve soil structure",
      "Rotate crops to prevent nutrient depletion and disease buildup",
      "Use cover crops during off-season to prevent erosion",
      "Monitor soil moisture - overwatering is as harmful as underwatering",
    ],
  },
  {
    category: "Water Management",
    icon: Droplets,
    color: "text-blue-600",
    tips: [
      "Water early morning or evening to minimize evaporation",
      "Use drip irrigation for 30-50% water savings",
      "Mulch around plants to retain soil moisture",
      "Collect rainwater for irrigation during dry periods",
      "Check soil moisture before watering to avoid overwatering",
    ],
  },
  {
    category: "Pest Control",
    icon: Bug,
    color: "text-red-600",
    tips: [
      "Use companion planting - marigolds deter many pests naturally",
      "Encourage beneficial insects like ladybugs and lacewings",
      "Remove diseased plants immediately to prevent spread",
      "Apply neem oil as a natural pesticide alternative",
      "Inspect crops regularly for early pest detection",
    ],
  },
  {
    category: "Climate Adaptation",
    icon: Sun,
    color: "text-orange-600",
    tips: [
      "Choose drought-resistant varieties in water-scarce regions",
      "Use shade nets during extreme heat periods",
      "Install windbreaks to protect crops from strong winds",
      "Monitor weather forecasts and plan activities accordingly",
      "Harvest before heavy rains to prevent crop damage",
    ],
  },
  {
    category: "Nutrient Management",
    icon: Wind,
    color: "text-purple-600",
    tips: [
      "Apply fertilizers based on soil test results, not guesswork",
      "Use slow-release fertilizers for sustained nutrient supply",
      "Don't over-fertilize - excess nutrients can harm crops",
      "Consider green manure crops to naturally boost soil nitrogen",
      "Balance NPK ratios according to crop requirements",
    ],
  },
];

export default function SmartTips() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Lightbulb className="h-8 w-8 text-primary" />
          Smart Farming Tips
        </h1>
        <p className="text-muted-foreground mt-2">
          AI-powered farming tips for better yield and soil health
        </p>
      </div>

      <div className="grid gap-6">
        {tips.map((section, index) => {
          const Icon = section.icon;
          return (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${section.color}`} />
                  {section.category}
                </CardTitle>
                <CardDescription>
                  Best practices for {section.category.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {section.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-3">
                      <span className={`mt-0.5 ${section.color}`}>•</span>
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6 bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>💡 Pro Tip</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Keep a farming journal to track what works best for your specific conditions. 
            Document planting dates, weather patterns, pest problems, and yields. 
            This historical data becomes invaluable for making better decisions in future seasons.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
