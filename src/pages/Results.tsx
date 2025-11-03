import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, TrendingUp, Leaf, Beaker } from "lucide-react";
import { toast } from "sonner";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

interface AgriInput {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph_level: number;
  temperature: number;
  rainfall: number;
  previous_crop: string | null;
  soil_moisture: number;
  created_at: string;
}

interface AgriResult {
  best_crop: string;
  yield_prediction: number;
  fertilizer_plan: string;
}

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState<AgriInput | null>(null);
  const [result, setResult] = useState<AgriResult | null>(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      // Fetch input data
      const { data: inputData, error: inputError } = await supabase
        .from("agri_inputs")
        .select("*")
        .eq("id", id)
        .single();

      if (inputError) throw inputError;
      setInput(inputData);

      // Fetch result data
      const { data: resultData, error: resultError } = await supabase
        .from("agri_results")
        .select("*")
        .eq("input_id", id)
        .single();

      if (resultError) throw resultError;
      setResult(resultData);
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast.error("Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!input || !result) return;

    const content = `
Smart Agriculture Advisor - Prediction Report
Generated: ${new Date(input.created_at).toLocaleDateString()}

=== INPUT DATA ===
Nitrogen (N): ${input.nitrogen} kg/ha
Phosphorus (P): ${input.phosphorus} kg/ha
Potassium (K): ${input.potassium} kg/ha
pH Level: ${input.ph_level}
Temperature: ${input.temperature}°C
Rainfall: ${input.rainfall}mm
Previous Crop: ${input.previous_crop || "N/A"}
Soil Moisture: ${input.soil_moisture}%

=== PREDICTIONS ===
🌾 Best Crop: ${result.best_crop}
📈 Expected Yield: ${result.yield_prediction} kg/ha
🧪 Fertilizer Plan: ${result.fertilizer_plan}
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prediction-report-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Report downloaded successfully");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading results...</div>
      </div>
    );
  }

  if (!input || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Results not found</p>
          <Button onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <DashboardHeader />
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Prediction Results</h1>
          <p className="text-muted-foreground">
            Generated on {new Date(input.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Prediction Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="shadow-medium border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Best Crop</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary mb-2">
                {result.best_crop}
              </p>
              <CardDescription>
                Recommended for your soil and climate conditions
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="shadow-medium border-2 border-accent/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-lg">Expected Yield</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent mb-2">
                {result.yield_prediction.toLocaleString()}
              </p>
              <CardDescription>kg/ha under optimal conditions</CardDescription>
            </CardContent>
          </Card>

          <Card className="shadow-medium border-2 border-secondary/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Beaker className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-lg">Fertilizer Plan</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold mb-2">
                {result.fertilizer_plan}
              </p>
              <CardDescription>
                Optimized for maximum yield
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Input Summary */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Input Data Summary</CardTitle>
            <CardDescription>
              The data used to generate these predictions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Nitrogen (N)</p>
                <p className="text-lg font-semibold">{input.nitrogen} kg/ha</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Phosphorus (P)</p>
                <p className="text-lg font-semibold">{input.phosphorus} kg/ha</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Potassium (K)</p>
                <p className="text-lg font-semibold">{input.potassium} kg/ha</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">pH Level</p>
                <p className="text-lg font-semibold">{input.ph_level}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Temperature</p>
                <p className="text-lg font-semibold">{input.temperature}°C</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Rainfall</p>
                <p className="text-lg font-semibold">{input.rainfall}mm</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Soil Moisture</p>
                <p className="text-lg font-semibold">{input.soil_moisture}%</p>
              </div>
              {input.previous_crop && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Previous Crop</p>
                  <p className="text-lg font-semibold">{input.previous_crop}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Results;
