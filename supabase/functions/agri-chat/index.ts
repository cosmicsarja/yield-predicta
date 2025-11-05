import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Get authorization header for Supabase queries
    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader! } },
    });

    // Get user's recent agricultural inputs for context
    let userContext = "";
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const { data: inputs } = await supabase
          .from("agri_inputs")
          .select("*")
          .eq("user_id", userData.user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        const { data: results } = await supabase
          .from("agri_results")
          .select("*, agri_inputs(*)")
          .order("created_at", { ascending: false })
          .limit(3);

        if (inputs && inputs.length > 0) {
          userContext += "\n\nUser's Recent Agricultural Data:\n";
          inputs.forEach((input, i) => {
            userContext += `\nEntry ${i + 1} (${new Date(input.created_at).toLocaleDateString()}):\n`;
            userContext += `- Soil: N=${input.nitrogen}, P=${input.phosphorus}, K=${input.potassium}, pH=${input.ph_level}\n`;
            userContext += `- Weather: Temp=${input.temperature}°C, Rainfall=${input.rainfall}mm\n`;
            userContext += `- Soil Moisture: ${input.soil_moisture}%\n`;
            if (input.previous_crop) userContext += `- Previous Crop: ${input.previous_crop}\n`;
          });
        }

        if (results && results.length > 0) {
          userContext += "\n\nUser's Recent Predictions:\n";
          results.forEach((result, i) => {
            userContext += `\nPrediction ${i + 1} (${new Date(result.created_at).toLocaleDateString()}):\n`;
            userContext += `- Recommended Crop: ${result.best_crop}\n`;
            userContext += `- Expected Yield: ${result.yield_prediction} kg/ha\n`;
            userContext += `- Fertilizer Plan: ${result.fertilizer_plan}\n`;
          });
        }
      }
    } catch (error) {
      console.error("Error fetching user context:", error);
    }

    // Enhanced system prompt with agricultural expertise
    const systemPrompt = `You are an expert agricultural advisor AI assistant for farmers. You provide practical, actionable advice on:

🌾 CROP MANAGEMENT:
- Crop selection and rotation strategies
- Planting schedules and best practices
- Growth stages and monitoring
- Harvest timing optimization

🌡️ WEATHER & CLIMATE:
- Weather pattern interpretation
- Climate-adapted farming strategies
- Drought and flood management
- Seasonal planning advice

💧 SOIL & WATER:
- Soil health assessment and improvement
- NPK nutrient balance guidance
- pH management strategies
- Irrigation optimization
- Water conservation techniques

🧪 FERTILIZERS & NUTRIENTS:
- Organic vs synthetic fertilizer guidance
- Application timing and quantities
- Nutrient deficiency identification
- Soil amendment recommendations

🐛 PEST & DISEASE:
- Integrated pest management (IPM)
- Disease identification and prevention
- Natural and chemical control methods
- Beneficial insects and biological controls

💰 FARM ECONOMICS:
- Cost-benefit analysis
- Market timing and pricing strategies
- Resource optimization
- Government schemes and subsidies

COMMUNICATION GUIDELINES:
- Use simple, practical language suitable for farmers
- Provide specific, actionable recommendations
- Include both traditional wisdom and modern techniques
- Consider local conditions and constraints
- Prioritize sustainable and cost-effective solutions
- Use emojis sparingly for better readability
- Break down complex topics into digestible steps

IMPORTANT:
- Always base recommendations on the user's specific data when available
- Acknowledge limitations (e.g., local regulations, specific varieties)
- Encourage consulting local agricultural extension services for critical decisions
- Promote sustainable and environmentally friendly practices
${userContext}

When answering, be concise but thorough. If the user asks about their specific situation, reference their recent data provided above.`;

    console.log("Starting AI chat with context length:", systemPrompt.length);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded. Please try again in a moment." }), 
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service requires additional credits. Please contact support." }), 
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable" }), 
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), 
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
