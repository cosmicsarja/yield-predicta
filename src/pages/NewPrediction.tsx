import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const NewPrediction = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    ph_level: "",
    temperature: "",
    rainfall: "",
    previous_crop: "",
    soil_moisture: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to continue");
        navigate("/auth");
        return;
      }

      // Insert input data
      const { data: inputData, error: inputError } = await supabase
        .from("agri_inputs")
        .insert({
          user_id: user.id,
          nitrogen: parseFloat(formData.nitrogen),
          phosphorus: parseFloat(formData.phosphorus),
          potassium: parseFloat(formData.potassium),
          ph_level: parseFloat(formData.ph_level),
          temperature: parseFloat(formData.temperature),
          rainfall: parseFloat(formData.rainfall),
          previous_crop: formData.previous_crop,
          soil_moisture: parseFloat(formData.soil_moisture),
        })
        .select()
        .single();

      if (inputError) throw inputError;

      // Call ML prediction edge function
      const { data: predictionData, error: predictionError } = await supabase.functions.invoke(
        "predict-agriculture",
        {
          body: {
            input_id: inputData.id,
            nitrogen: parseFloat(formData.nitrogen),
            phosphorus: parseFloat(formData.phosphorus),
            potassium: parseFloat(formData.potassium),
            ph_level: parseFloat(formData.ph_level),
            temperature: parseFloat(formData.temperature),
            rainfall: parseFloat(formData.rainfall),
            previous_crop: formData.previous_crop,
            soil_moisture: parseFloat(formData.soil_moisture),
          },
        }
      );

      if (predictionError) throw predictionError;

      toast.success("Prediction generated successfully!");
      navigate(`/results/${inputData.id}`);
    } catch (error: any) {
      console.error("Prediction error:", error);
      toast.error(error.message || "Failed to generate prediction");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <DashboardHeader />
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">New Prediction</h1>
          <p className="text-muted-foreground">
            Enter your farm data to get AI-powered crop recommendations
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            {/* Soil Parameters */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Soil Parameters</CardTitle>
                <CardDescription>
                  Enter NPK values and pH level of your soil
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nitrogen">Nitrogen (N) - kg/ha</Label>
                  <Input
                    id="nitrogen"
                    name="nitrogen"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 90"
                    value={formData.nitrogen}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phosphorus">Phosphorus (P) - kg/ha</Label>
                  <Input
                    id="phosphorus"
                    name="phosphorus"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 42"
                    value={formData.phosphorus}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="potassium">Potassium (K) - kg/ha</Label>
                  <Input
                    id="potassium"
                    name="potassium"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 43"
                    value={formData.potassium}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ph_level">pH Level</Label>
                  <Input
                    id="ph_level"
                    name="ph_level"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 6.5"
                    value={formData.ph_level}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Weather Conditions */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Weather Conditions</CardTitle>
                <CardDescription>
                  Current temperature and rainfall data
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature (°C)</Label>
                  <Input
                    id="temperature"
                    name="temperature"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 25.5"
                    value={formData.temperature}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rainfall">Rainfall (mm)</Label>
                  <Input
                    id="rainfall"
                    name="rainfall"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 202.5"
                    value={formData.rainfall}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>
                  Previous crop and soil moisture details
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="previous_crop">Previous Crop (optional)</Label>
                  <Input
                    id="previous_crop"
                    name="previous_crop"
                    type="text"
                    placeholder="e.g., Rice, Wheat"
                    value={formData.previous_crop}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="soil_moisture">Soil Moisture (%)</Label>
                  <Input
                    id="soil_moisture"
                    name="soil_moisture"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 45.5"
                    value={formData.soil_moisture}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="shadow-medium hover:shadow-strong transition-smooth"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Predictions
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default NewPrediction;
