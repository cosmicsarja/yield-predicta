
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  farm_location TEXT,
  farm_size NUMERIC,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Create agri_inputs table
CREATE TABLE public.agri_inputs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nitrogen NUMERIC NOT NULL DEFAULT 0,
  phosphorus NUMERIC NOT NULL DEFAULT 0,
  potassium NUMERIC NOT NULL DEFAULT 0,
  ph_level NUMERIC NOT NULL DEFAULT 7,
  temperature NUMERIC NOT NULL DEFAULT 25,
  rainfall NUMERIC NOT NULL DEFAULT 100,
  previous_crop TEXT,
  soil_moisture NUMERIC NOT NULL DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.agri_inputs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own inputs" ON public.agri_inputs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own inputs" ON public.agri_inputs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create agri_results table
CREATE TABLE public.agri_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  input_id UUID NOT NULL REFERENCES public.agri_inputs(id) ON DELETE CASCADE,
  best_crop TEXT NOT NULL,
  yield_prediction NUMERIC NOT NULL,
  fertilizer_plan TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.agri_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own results" ON public.agri_results FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.agri_inputs WHERE agri_inputs.id = agri_results.input_id AND agri_inputs.user_id = auth.uid())
);
CREATE POLICY "Service can insert results" ON public.agri_results FOR INSERT WITH CHECK (true);

-- Timestamp update function and triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
