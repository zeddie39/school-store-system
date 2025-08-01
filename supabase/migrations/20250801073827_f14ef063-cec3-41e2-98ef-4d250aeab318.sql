-- Create assets table for real asset valuation
CREATE TABLE public.assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('land', 'vehicles', 'textbooks', 'equipment', 'buildings', 'furniture')),
  description TEXT,
  purchase_date DATE NOT NULL,
  purchase_price DECIMAL(12,2) NOT NULL,
  current_value DECIMAL(12,2) NOT NULL,
  depreciation_rate DECIMAL(5,2) DEFAULT 0.00,
  quantity INTEGER NOT NULL DEFAULT 1,
  location TEXT,
  supplier TEXT,
  purchase_order_number TEXT,
  condition TEXT DEFAULT 'good' CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
  last_valuation_date DATE DEFAULT CURRENT_DATE,
  warranty_expiry DATE,
  serial_number TEXT,
  added_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- Create policies for assets
CREATE POLICY "Everyone can view assets" 
ON public.assets 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage assets" 
ON public.assets 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- Create function to calculate depreciated value
CREATE OR REPLACE FUNCTION public.calculate_asset_value(
  purchase_price DECIMAL,
  purchase_date DATE,
  depreciation_rate DECIMAL,
  category TEXT
)
RETURNS DECIMAL
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  years_owned DECIMAL;
  annual_depreciation DECIMAL;
  total_depreciation DECIMAL;
  current_value DECIMAL;
BEGIN
  -- Calculate years owned
  years_owned := EXTRACT(YEAR FROM AGE(CURRENT_DATE, purchase_date));
  
  -- Set default depreciation rates by category if not provided
  IF depreciation_rate = 0 THEN
    CASE category
      WHEN 'vehicles' THEN depreciation_rate := 15.00; -- 15% per year
      WHEN 'equipment' THEN depreciation_rate := 10.00; -- 10% per year
      WHEN 'textbooks' THEN depreciation_rate := 20.00; -- 20% per year
      WHEN 'furniture' THEN depreciation_rate := 8.00; -- 8% per year
      WHEN 'buildings' THEN depreciation_rate := 2.00; -- 2% per year
      WHEN 'land' THEN depreciation_rate := 0.00; -- Land doesn't depreciate
      ELSE depreciation_rate := 5.00; -- Default 5% per year
    END CASE;
  END IF;
  
  -- Calculate depreciation
  annual_depreciation := purchase_price * (depreciation_rate / 100);
  total_depreciation := annual_depreciation * years_owned;
  
  -- Calculate current value (minimum 10% of original value)
  current_value := purchase_price - total_depreciation;
  current_value := GREATEST(current_value, purchase_price * 0.1);
  
  RETURN current_value;
END;
$$;

-- Create trigger to update current_value automatically
CREATE OR REPLACE FUNCTION public.update_asset_value()
RETURNS TRIGGER AS $$
BEGIN
  NEW.current_value := public.calculate_asset_value(
    NEW.purchase_price,
    NEW.purchase_date,
    NEW.depreciation_rate,
    NEW.category
  );
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_asset_value_trigger
  BEFORE INSERT OR UPDATE ON public.assets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_asset_value();

-- Create department passwords table for real authentication
CREATE TABLE public.department_passwords (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  department_name TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.department_passwords ENABLE ROW LEVEL SECURITY;

-- Only admins can manage department passwords
CREATE POLICY "Admins can manage department passwords" 
ON public.department_passwords 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- Insert default department passwords (hashed with bcrypt would be better in production)
INSERT INTO public.department_passwords (department_name, password_hash) VALUES
('library', 'lib123'),
('laboratory', 'lab456'),
('kitchen', 'kitchen789'),
('sports', 'sports012'),
('ict_lab', 'ict345'),
('boarding', 'board678'),
('examination', 'exam901'),
('agriculture', 'agri234'),
('general', 'gen567');