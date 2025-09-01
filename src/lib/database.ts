import { supabase } from '@/integrations/supabase/client';
import { FormData } from '@/types/form';

export interface SubmissionData {
  submissionId: string;
  exhibitorFirstName: string;
  exhibitorSurname: string;
  exhibitorEmail: string;
  exhibitorPhone: string;
  totalAmount: number;
  dinnerTickets: number;
  extraCatalogues: number;
  dietaryRequirements?: string;
}

export interface DogEntryData {
  submissionId: string;
  pedigreeName: string;
  dogsNzRegistration: string;
  breed: string;
  photoUrl?: string;
}

export interface EventEntryData {
  dogEntryId: string;
  eventType: string;
  qualifyingShow: string;
  qualifyingDate: string;
}

export const uploadDogPhoto = async (file: File, dogId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${dogId}-${Date.now()}.${fileExt}`;
  const filePath = `dogs/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('dog-photos')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw new Error('Failed to upload photo');
  }

  const { data: { publicUrl } } = supabase.storage
    .from('dog-photos')
    .getPublicUrl(filePath);

  return publicUrl;
};

export const submitFormData = async (formData: FormData, entryType: 'competition' | 'catering'): Promise<string> => {
  const submissionId = `NZ${Date.now().toString().slice(-6)}`;
  
  // Calculate total
  const eventCost = formData.dogs.reduce((total, dog) => total + (dog.events.length * 30), 0);
  const dinnerCost = formData.catering.dinnerTickets * 45;
  const catalogueCost = formData.catering.extraCatalogues * 10;
  const totalAmount = eventCost + dinnerCost + catalogueCost;

  // Insert main submission
  const submissionData: SubmissionData = {
    submissionId,
    exhibitorFirstName: formData.exhibitor.firstName,
    exhibitorSurname: formData.exhibitor.surname,
    exhibitorEmail: formData.exhibitor.email,
    exhibitorPhone: formData.exhibitor.phone,
    totalAmount,
    dinnerTickets: formData.catering.dinnerTickets,
    extraCatalogues: formData.catering.extraCatalogues,
    dietaryRequirements: formData.catering.dietaryRequirements || undefined,
  };

  const { data: submission, error: submissionError } = await supabase
    .from('submissions')
    .insert([{
      submission_id: submissionData.submissionId,
      exhibitor_first_name: submissionData.exhibitorFirstName,
      exhibitor_surname: submissionData.exhibitorSurname,
      exhibitor_email: submissionData.exhibitorEmail,
      exhibitor_phone: submissionData.exhibitorPhone,
      total_amount: submissionData.totalAmount,
      dinner_tickets: submissionData.dinnerTickets,
      extra_catalogues: submissionData.extraCatalogues,
      dietary_requirements: submissionData.dietaryRequirements,
    }])
    .select()
    .single();

  if (submissionError) {
    console.error('Submission error:', submissionError);
    throw new Error('Failed to submit form data');
  }

  // Insert dog entries if competition
  if (entryType === 'competition' && formData.dogs.length > 0) {
    for (const dog of formData.dogs) {
      // Upload photo if present
      let photoUrl: string | undefined;
      if (dog.photo) {
        try {
          photoUrl = await uploadDogPhoto(dog.photo, dog.id);
        } catch (error) {
          console.error('Photo upload failed for dog:', dog.id, error);
          // Continue without photo rather than failing the entire submission
        }
      }

      // Insert dog entry
      const { data: dogEntry, error: dogError } = await supabase
        .from('dog_entries')
        .insert([{
          submission_id: submission.id,
          pedigree_name: dog.pedigreeName,
          dogs_nz_registration: dog.dogsNzRegistration,
          breed: dog.breed,
          photo_url: photoUrl,
        }])
        .select()
        .single();

      if (dogError) {
        console.error('Dog entry error:', dogError);
        throw new Error('Failed to submit dog entry');
      }

      // Insert event entries
      for (const event of dog.events) {
        const { error: eventError } = await supabase
          .from('event_entries')
          .insert([{
            dog_entry_id: dogEntry.id,
            event_type: event.eventType,
            qualifying_show: event.qualifyingShow,
            qualifying_date: new Date().toISOString().split('T')[0], // Default date since not required in form
          }]);

        if (eventError) {
          console.error('Event entry error:', eventError);
          throw new Error('Failed to submit event entry');
        }
      }
    }
  }

  return submissionId;
};

export const getSubmissionById = async (submissionId: string) => {
  const { data: submission, error } = await supabase
    .from('submissions')
    .select(`
      *,
      dog_entries (
        *,
        event_entries (*)
      )
    `)
    .eq('submission_id', submissionId)
    .single();

  if (error) {
    console.error('Get submission error:', error);
    throw new Error('Failed to retrieve submission');
  }

  return submission;
};