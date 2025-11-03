-- Create agri_inputs table for storing farmer input data
CREATE TABLE public.agri_inputs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nitrogen DECIMAL(5,2) NOT NULL,
  phosphorus DECIMAL(5,2) NOT NULL,
  potassium DECIMAL(5,2) NOT NULL,
  ph_level DECIMAL(4,2) NOT NULL,
  temperature DECIMAL(5,2) NOT NULL,
  rainfall DECIMAL(6,2) NOT NULL,
  previous_crop TEXT,
  soil_moisture DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create agri_results table for storing AI predictions
CREATE TABLE public.agri_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  input_id UUID NOT NULL REFERENCES public.agri_inputs(id) ON DELETE CASCADE,
  best_crop TEXT NOT NULL,
  yield_prediction DECIMAL(8,2) NOT NULL,
  fertilizer_plan TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  farm_location TEXT,
  farm_size DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.agri_inputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agri_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for agri_inputs
CREATE POLICY "Users can view their own inputs"
  ON public.agri_inputs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own inputs"
  ON public.agri_inputs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own inputs"
  ON public.agri_inputs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own inputs"
  ON public.agri_inputs FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for agri_results
CREATE POLICY "Users can view their own results"
  ON public.agri_results FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.agri_inputs
      WHERE agri_inputs.id = agri_results.input_id
      AND agri_inputs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own results"
  ON public.agri_results FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.agri_inputs
      WHERE agri_inputs.id = input_id
      AND agri_inputs.user_id = auth.uid()
    )
  );

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by owner"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for automatic timestamp updates on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile automatically
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();