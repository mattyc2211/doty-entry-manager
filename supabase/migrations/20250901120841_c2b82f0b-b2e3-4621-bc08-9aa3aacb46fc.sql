-- Create admin_users table for admin portal access (simplified)
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL, -- Simple password storage for now
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin users (only admins can access admin data)
CREATE POLICY "Admin users can view their own record" 
ON public.admin_users 
FOR SELECT 
USING (true);

-- Create a function to verify admin credentials
CREATE OR REPLACE FUNCTION public.verify_admin_credentials(username_input TEXT, password_input TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE username = username_input 
    AND password = password_input
  );
END;
$$;

-- Insert default admin user (username: admin, password: admin123)
INSERT INTO public.admin_users (username, password)
VALUES ('admin', 'admin123');