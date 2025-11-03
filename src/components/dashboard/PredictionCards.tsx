import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, TrendingUp, Beaker } from "lucide-react";

const PredictionCards = () => {
  const [stats, setStats] = useState({
    totalPredictions: 0,
    avgYield: 0,
    mostCommonCrop: "N/A",
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get total predictions
      const { count: totalCount } = await supabase
        .from("agri_inputs")
        .select("*", { count: "exact", head: true });

      // Get results for calculations
      const { data: results } = await supabase
        .from("agri_results")
        .select("best_crop, yield_prediction");

      if (results && results.length > 0) {
        // Calculate average yield
        const avgYield = results.reduce((sum, r) => sum + r.yield_prediction, 0) / results.length;

        // Find most common crop
        const cropCounts: Record<string, number> = {};
        results.forEach((r) => {
          cropCounts[r.best_crop] = (cropCounts[r.best_crop] || 0) + 1;
        });
        const mostCommonCrop = Object.entries(cropCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

        setStats({
          totalPredictions: totalCount || 0,
          avgYield: Math.round(avgYield),
          mostCommonCrop,
        });
      } else {
        setStats({
          totalPredictions: totalCount || 0,
          avgYield: 0,
          mostCommonCrop: "N/A",
        });
      }
    } catch (error) {
      console.error("Stats fetch error:", error);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 mb-8">
      <Card className="shadow-medium hover:shadow-strong transition-smooth">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-base">Total Predictions</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.totalPredictions}</p>
          <CardDescription>AI analyses completed</CardDescription>
        </CardContent>
      </Card>

      <Card className="shadow-medium hover:shadow-strong transition-smooth">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-accent/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <CardTitle className="text-base">Avg. Yield</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.avgYield.toLocaleString()}</p>
          <CardDescription>kg/ha predicted</CardDescription>
        </CardContent>
      </Card>

      <Card className="shadow-medium hover:shadow-strong transition-smooth">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Beaker className="h-5 w-5 text-secondary" />
            </div>
            <CardTitle className="text-base">Top Crop</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats.mostCommonCrop}</p>
          <CardDescription>Most recommended</CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictionCards;
