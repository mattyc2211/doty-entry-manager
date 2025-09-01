export interface ExhibitorData {
  firstName: string;
  surname: string;
  email: string;
  phone: string;
}

export interface EventEntry {
  eventType: 'Show Dog' | 'Puppy' | 'Neuter';
  qualifyingShow: string;
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
  'Show Dog',
  'Puppy', 
  'Neuter'
] as const;

// Qualification requirements by event type
export const QUALIFICATION_REQUIREMENTS = {
  'Show Dog': {
    title: 'Show Dog of the Year',
    requirement: 'Entrants must have qualified with a \'BEST IN SHOW\' at an All Breeds Championship Show, a Group or Breed Specialty Championship Show or a \'RESERVE BEST IN SHOW\' at an All Breeds Championship Show only.'
  },
  'Puppy': {
    title: 'Puppy of the Year',
    requirement: 'Entrants must have won \'BABY PUPPY IN SHOW\', a \'MINOR PUPPY IN SHOW\' or \'PUPPY IN SHOW\' at an All Breeds Championship, Group or Breed Specialty Show.'
  },
  'Neuter': {
    title: 'Neuter of the Year',
    requirement: 'Entrants must have won \'NEUTER BEST IN SHOW\', a \'NEUTER RESERVE IN SHOW\' at an All Breeds Championship or a \'BEST IN SHOW\' at a Group or Breed Specialty Show.'
  }
} as const;

// Qualification period 
export const QUALIFICATION_PERIOD = {
  startDate: '2024-10-14',
  endDate: '2025-10-14'
};

// Entry status configuration
export const ENTRY_STATUS = {
  isOpen: true,
  openDate: new Date('2025-02-01'), // When entries opened
  closeDate: new Date('2025-10-17'), // When entries closed
} as const;