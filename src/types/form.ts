export interface ExhibitorData {
  firstName: string;
  surname: string;
  email: string;
  phone: string;
}

export interface EventEntry {
  eventType: 'Show Dog of the Year' | 'Puppy of the Year' | 'Neuter of the Year';
  qualifyingShow: string;
  qualifyingDate: string;
}

export interface DogEntry {
  id: string;
  pedigreeName: string;
  dogsNzRegistration: string;
  breed: string;
  events: EventEntry[];
  photo?: File;
  photoUrl?: string;
}

export interface CateringData {
  dinnerTickets: number;
  extraCatalogues: number;
  dietaryRequirements?: string;
}

export interface FormData {
  exhibitor: ExhibitorData;
  dogs: DogEntry[];
  catering: CateringData;
}

export interface SubmissionData extends FormData {
  submissionId: string;
  timestamp: string;
  totalAmount: number;
}

export const DOG_BREEDS = [
  'Afghan Hound',
  'Airedale Terrier',
  'Akita',
  'Alaskan Malamute',
  'American Staffordshire Terrier',
  'Australian Cattle Dog',
  'Australian Shepherd',
  'Basenji',
  'Basset Hound',
  'Beagle',
  'Bearded Collie',
  'Bernese Mountain Dog',
  'Border Collie',
  'Border Terrier',
  'Boston Terrier',
  'Boxer',
  'Bulldog',
  'Bull Terrier',
  'Cavalier King Charles Spaniel',
  'Chihuahua',
  'Chinese Crested',
  'Cocker Spaniel',
  'Collie',
  'Dachshund',
  'Dalmatian',
  'Doberman',
  'English Setter',
  'English Springer Spaniel',
  'Fox Terrier',
  'German Shepherd',
  'German Shorthaired Pointer',
  'Golden Retriever',
  'Great Dane',
  'Greyhound',
  'Irish Setter',
  'Irish Wolfhound',
  'Jack Russell Terrier',
  'Labrador Retriever',
  'Maltese',
  'Mastiff',
  'Newfoundland',
  'Old English Sheepdog',
  'Papillon',
  'Poodle',
  'Pug',
  'Rhodesian Ridgeback',
  'Rottweiler',
  'Saint Bernard',
  'Samoyed',
  'Scottish Terrier',
  'Shetland Sheepdog',
  'Shih Tzu',
  'Siberian Husky',
  'Staffordshire Bull Terrier',
  'Standard Schnauzer',
  'Vizsla',
  'Weimaraner',
  'Welsh Corgi',
  'West Highland White Terrier',
  'Whippet',
  'Yorkshire Terrier'
];

export const EVENT_TYPES = [
  'Show Dog of the Year',
  'Puppy of the Year',
  'Neuter of the Year'
] as const;