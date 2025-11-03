import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      input_id,
      nitrogen,
      phosphorus,
      potassium,
      ph_level,
      temperature,
      rainfall,
      previous_crop,
      soil_moisture,
    } = await req.json();

    console.log("Processing prediction for input:", input_id);

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // ML Model Logic (Simplified rule-based system for demo)
    // In production, this would call actual ML models or APIs
    
    // Crop Recommendation Logic
    let best_crop = "Rice";
    if (nitrogen > 80 && rainfall > 150 && temperature > 25) {
      best_crop = "Rice";
    } else if (phosphorus > 40 && potassium > 40 && ph_level < 7) {
      best_crop = "Wheat";
    } else if (nitrogen > 60 && temperature > 20 && temperature < 30) {
      best_crop = "Maize";
    } else if (ph_level > 6.5 && soil_moisture > 50) {
      best_crop = "Cotton";
    } else if (nitrogen < 50 && rainfall < 100) {
      best_crop = "Millets";
    } else if (potassium > 50 && temperature > 28) {
      best_crop = "Sugarcane";
    } else {
      best_crop = "Pulses";
    }

    // Yield Prediction (simplified formula)
    const base_yield = 3000;
    const n_factor = (nitrogen / 100) * 500;
    const p_factor = (phosphorus / 50) * 400;
    const k_factor = (potassium / 50) * 300;
    const ph_factor = (ph_level >= 6 && ph_level <= 7.5) ? 200 : -100;
    const temp_factor = (temperature >= 20 && temperature <= 30) ? 300 : -150;
    const rain_factor = (rainfall >= 100 && rainfall <= 250) ? 400 : -100;
    const moisture_factor = (soil_moisture / 100) * 200;

    const yield_prediction = Math.max(
      1500,
      base_yield + n_factor + p_factor + k_factor + ph_factor + temp_factor + rain_factor + moisture_factor
    );

    // Fertilizer Plan Logic
    let fertilizer_plan = "Balanced NPK 10-10-10";
    const n_deficit = Math.max(0, 90 - nitrogen);
    const p_deficit = Math.max(0, 45 - phosphorus);
    const k_deficit = Math.max(0, 45 - potassium);

    if (n_deficit > 30) {
      fertilizer_plan = `High Nitrogen (Urea ${Math.round(n_deficit * 2)}kg/ha) + Balanced PK`;
    } else if (p_deficit > 20) {
      fertilizer_plan = `High Phosphorus (DAP ${Math.round(p_deficit * 2.5)}kg/ha) + NK`;
    } else if (k_deficit > 20) {
      fertilizer_plan = `High Potassium (MOP ${Math.round(k_deficit * 2)}kg/ha) + NP`;
    } else if (n_deficit > 10 || p_deficit > 10 || k_deficit > 10) {
      fertilizer_plan = `NPK 20-20-20 at ${Math.round((n_deficit + p_deficit + k_deficit) * 1.5)}kg/ha`;
    } else {
      fertilizer_plan = "Maintenance dose: NPK 10-10-10 at 150kg/ha";
    }

    // Add organic recommendation if pH is off
    if (ph_level < 6) {
      fertilizer_plan += " + Lime 500kg/ha for pH correction";
    } else if (ph_level > 7.5) {
      fertilizer_plan += " + Sulfur 200kg/ha for pH correction";
    }

    // Store results in database
    const { data: result, error } = await supabase
      .from("agri_results")
      .insert({
        input_id,
        best_crop,
        yield_prediction: Math.round(yield_prediction),
        fertilizer_plan,
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      throw error;
    }

    console.log("Prediction completed successfully:", result);

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in predict-agriculture:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
