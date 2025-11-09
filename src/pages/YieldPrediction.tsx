import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BarChart, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function YieldPrediction() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    ph_level: "",
    temperature: "",
    rainfall: "",
    soil_moisture: "",
    previous_crop: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

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
          soil_moisture: parseFloat(formData.soil_moisture),
          previous_crop: formData.previous_crop,
        })
        .select()
        .single();

      if (inputError) throw inputError;

      const { data: result, error: apiError } = await supabase.functions.invoke(
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
            soil_moisture: parseFloat(formData.soil_moisture),
            previous_crop: formData.previous_crop,
          },
        }
      );

      if (apiError) throw apiError;

      toast.success(t("common.success"));
      navigate("/results");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart className="h-8 w-8 text-primary" />
          {t("nav.yieldPrediction")}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t("home.features.yield.desc")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("common.submit")}</CardTitle>
          <CardDescription>
            {t("home.features.yield.desc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nitrogen">Nitrogen (N) - kg/ha</Label>
                <Input
                  id="nitrogen"
                  type="number"
                  step="0.01"
                  required
                  value={formData.nitrogen}
                  onChange={(e) => setFormData({ ...formData, nitrogen: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phosphorus">Phosphorus (P) - kg/ha</Label>
                <Input
                  id="phosphorus"
                  type="number"
                  step="0.01"
                  required
                  value={formData.phosphorus}
                  onChange={(e) => setFormData({ ...formData, phosphorus: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="potassium">Potassium (K) - kg/ha</Label>
                <Input
                  id="potassium"
                  type="number"
                  step="0.01"
                  required
                  value={formData.potassium}
                  onChange={(e) => setFormData({ ...formData, potassium: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ph_level">pH Level</Label>
                <Input
                  id="ph_level"
                  type="number"
                  step="0.1"
                  min="0"
                  max="14"
                  required
                  value={formData.ph_level}
                  onChange={(e) => setFormData({ ...formData, ph_level: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  required
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rainfall">Rainfall (mm)</Label>
                <Input
                  id="rainfall"
                  type="number"
                  step="0.1"
                  required
                  value={formData.rainfall}
                  onChange={(e) => setFormData({ ...formData, rainfall: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="soil_moisture">Soil Moisture (%)</Label>
                <Input
                  id="soil_moisture"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  required
                  value={formData.soil_moisture}
                  onChange={(e) => setFormData({ ...formData, soil_moisture: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="previous_crop">Previous Crop (Optional)</Label>
                <Input
                  id="previous_crop"
                  type="text"
                  value={formData.previous_crop}
                  onChange={(e) => setFormData({ ...formData, previous_crop: e.target.value })}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.loading")}
                </>
              ) : (
                t("nav.yieldPrediction")
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
