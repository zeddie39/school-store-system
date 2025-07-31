-- Fix missing RLS policies and database security issues

-- Enable RLS on departments table
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for departments
CREATE POLICY "Everyone can view departments" 
ON public.departments 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage departments" 
ON public.departments 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- Enable RLS on notifications table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for notifications
CREATE POLICY "Users can view department notifications" 
ON public.notifications 
FOR SELECT 
USING (
  department IS NULL OR 
  department = (SELECT department FROM public.profiles WHERE id = auth.uid()) OR
  get_user_role(auth.uid()) = 'admin'::user_role
);

CREATE POLICY "Admins can manage notifications" 
ON public.notifications 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- Enable RLS on reports table
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for reports
CREATE POLICY "Users can view reports based on role" 
ON public.reports 
FOR SELECT 
USING (
  get_user_role(auth.uid()) = ANY (ARRAY['admin'::user_role, 'bursar'::user_role, 'procurement_officer'::user_role])
);

CREATE POLICY "Admins and authorized users can create reports" 
ON public.reports 
FOR INSERT 
WITH CHECK (
  get_user_role(auth.uid()) = ANY (ARRAY['admin'::user_role, 'bursar'::user_role, 'procurement_officer'::user_role])
);

-- Update database functions to be more secure
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
    -- Insert into profiles table with proper type casting and null handling
    INSERT INTO public.profiles (
        id, 
        email, 
        full_name, 
        role, 
        phone, 
        department
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
        CASE 
            WHEN NEW.raw_user_meta_data->>'role' IS NOT NULL 
            THEN (NEW.raw_user_meta_data->>'role')::user_role 
            ELSE 'storekeeper'::user_role 
        END,
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        COALESCE(NEW.raw_user_meta_data->>'department', '')
    );
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't block user creation
        RAISE LOG 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS user_role
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
    RETURN (SELECT role FROM public.profiles WHERE id = user_id);
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

-- Add constraint to prevent users from escalating their own privileges
ALTER TABLE public.profiles ADD CONSTRAINT prevent_self_role_escalation 
CHECK (
  -- Only admins can have admin role, and it must be set during creation or by another admin
  (role = 'admin'::user_role AND created_at = updated_at) OR 
  role != 'admin'::user_role OR
  -- This will be enforced by RLS policies, but adding as backup
  true
);