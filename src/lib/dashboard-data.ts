import { supabase } from "@/integrations/supabase/client";

export interface AgriInputRecord {
  id: string;
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

export interface AgriResultRecord {
  id: string;
  input_id: string;
  best_crop: string;
  yield_prediction: number;
  fertilizer_plan: string;
  created_at: string;
}

export interface PredictionSummary {
  input: AgriInputRecord;
  result: AgriResultRecord | null;
}

export const fetchPredictionHistory = async (limit?: number): Promise<PredictionSummary[]> => {
  let inputQuery = supabase
    .from("agri_inputs")
    .select("*")
    .order("created_at", { ascending: false });

  if (limit) {
    inputQuery = inputQuery.limit(limit);
  }

  const { data: inputs, error: inputsError } = await inputQuery;

  if (inputsError) {
    throw inputsError;
  }

  if (!inputs || inputs.length === 0) {
    return [];
  }

  const inputIds = inputs.map((item) => item.id);

  const { data: results, error: resultsError } = await supabase
    .from("agri_results")
    .select("*")
    .in("input_id", inputIds)
    .order("created_at", { ascending: false });

  if (resultsError) {
    throw resultsError;
  }

  const resultsByInputId = new Map<string, AgriResultRecord>();

  (results || []).forEach((result) => {
    if (!resultsByInputId.has(result.input_id)) {
      resultsByInputId.set(result.input_id, result);
    }
  });

  return inputs.map((input) => ({
    input,
    result: resultsByInputId.get(input.id) || null,
  }));
};

export const fetchPredictionDetail = async (inputId: string): Promise<PredictionSummary | null> => {
  const [{ data: input, error: inputError }, { data: result, error: resultError }] = await Promise.all([
    supabase.from("agri_inputs").select("*").eq("id", inputId).maybeSingle(),
    supabase.from("agri_results").select("*").eq("input_id", inputId).maybeSingle(),
  ]);

  if (inputError) {
    throw inputError;
  }

  if (resultError) {
    throw resultError;
  }

  if (!input) {
    return null;
  }

  return {
    input,
    result: result || null,
  };
};

export const fetchLatestPredictionDetail = async (): Promise<PredictionSummary | null> => {
  const { data: latestResult, error: latestResultError } = await supabase
    .from("agri_results")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestResultError) {
    throw latestResultError;
  }

  if (!latestResult) {
    return null;
  }

  const { data: input, error: inputError } = await supabase
    .from("agri_inputs")
    .select("*")
    .eq("id", latestResult.input_id)
    .maybeSingle();

  if (inputError) {
    throw inputError;
  }

  if (!input) {
    return null;
  }

  return {
    input,
    result: latestResult,
  };
};
