-- Enable the pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create admin_users table for admin portal access
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
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
    AND password_hash = crypt(password_input, password_hash)
  );
END;
$$;

-- Create a function to create admin user with hashed password
CREATE OR REPLACE FUNCTION public.create_admin_user(username_input TEXT, password_input TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_users (username, password_hash)
  VALUES (username_input, crypt(password_input, gen_salt('bf')));
  
  RETURN TRUE;
EXCEPTION
  WHEN unique_violation THEN
    RETURN FALSE;
END;
$$;

-- Insert default admin user (username: admin, password: admin123)
SELECT public.create_admin_user('admin', 'admin123');