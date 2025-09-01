-- Create storage bucket for dog photos
INSERT INTO storage.buckets (id, name, public) VALUES ('dog-photos', 'dog-photos', true);

-- Create submissions table for main form entries
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id TEXT NOT NULL UNIQUE,
  exhibitor_first_name TEXT NOT NULL,
  exhibitor_surname TEXT NOT NULL,
  exhibitor_email TEXT NOT NULL,
  exhibitor_phone TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  dinner_tickets INTEGER DEFAULT 0,
  extra_catalogues INTEGER DEFAULT 0,
  dietary_requirements TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dog_entries table for individual dogs
CREATE TABLE public.dog_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  pedigree_name TEXT NOT NULL,
  dogs_nz_registration TEXT NOT NULL,
  breed TEXT NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create event_entries table for specific events per dog
CREATE TABLE public.event_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dog_entry_id UUID NOT NULL REFERENCES public.dog_entries(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('Show Dog', 'Puppy', 'Neuter')),
  qualifying_show TEXT NOT NULL,
  qualifying_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dog_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access (since this is a public form)
CREATE POLICY "Allow public insert on submissions" ON public.submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on submissions" ON public.submissions FOR SELECT USING (true);

CREATE POLICY "Allow public insert on dog_entries" ON public.dog_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on dog_entries" ON public.dog_entries FOR SELECT USING (true);

CREATE POLICY "Allow public insert on event_entries" ON public.event_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on event_entries" ON public.event_entries FOR SELECT USING (true);

-- Create storage policies for dog photos
CREATE POLICY "Public can view dog photos" ON storage.objects FOR SELECT USING (bucket_id = 'dog-photos');
CREATE POLICY "Public can upload dog photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'dog-photos');
CREATE POLICY "Public can update dog photos" ON storage.objects FOR UPDATE USING (bucket_id = 'dog-photos');
CREATE POLICY "Public can delete dog photos" ON storage.objects FOR DELETE USING (bucket_id = 'dog-photos');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_submissions_updated_at
  BEFORE UPDATE ON public.submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();