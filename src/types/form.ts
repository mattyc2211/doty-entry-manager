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
  'Affenpinscher',
  'Afghan Hound',
  'Airedale Terrier',
  'Akita',
  'Alaskan Malamute',
  'American Bulldog',
  'American Cocker Spaniel',
  'American Staffordshire Terrier',
  'Anatolian Shepherd',
  'Australian Cattle Dog',
  'Australian Kelpie',
  'Australian Shepherd',
  'Australian Stumpy Tail Cattle Dog',
  'Australian Terrier',
  'Basenji',
  'Basset Hound',
  'Beagle',
  'Bearded Collie',
  'Beauceron',
  'Belgian Shepherd',
  'Bernese Mountain Dog',
  'Bichon Frise',
  'Bloodhound',
  'Boerboel',
  'Border Collie',
  'Border Terrier',
  'Boston Terrier',
  'Boxer',
  'Brittany',
  'Brussels Griffon',
  'Bulldog',
  'Bull Mastiff',
  'Bull Terrier',
  'Cairn Terrier',
  'Cane Corso',
  'Cardigan Welsh Corgi',
  'Cavalier King Charles Spaniel',
  'Chihuahua',
  'Chinese Crested',
  'Chinese Shar Pei',
  'Chow Chow',
  'Clumber Spaniel',
  'Cocker Spaniel',
  'Collie',
  'Coton de Tulear',
  'Dachshund',
  'Dalmatian',
  'Doberman',
  'English Bulldog',
  'English Cocker Spaniel',
  'English Pointer',
  'English Setter',
  'English Springer Spaniel',
  'English Toy Terrier',
  'Field Spaniel',
  'Finnish Spitz',
  'Flat-Coated Retriever',
  'Fox Terrier',
  'French Bulldog',
  'German Pinscher',
  'German Shepherd',
  'German Shorthaired Pointer',
  'German Wirehaired Pointer',
  'Giant Schnauzer',
  'Golden Retriever',
  'Gordon Setter',
  'Great Dane',
  'Great Pyrenees',
  'Greater Swiss Mountain Dog',
  'Greyhound',
  'Havanese',
  'Huntaway',
  'Irish Setter',
  'Irish Wolfhound',
  'Italian Greyhound',
  'Jack Russell Terrier',
  'Japanese Chin',
  'Japanese Spitz',
  'Keeshond',
  'Kerry Blue Terrier',
  'Labrador Retriever',
  'Lagotto Romagnolo',
  'Leonberger',
  'Lhasa Apso',
  'Maltese',
  'Mastiff',
  'Miniature Schnauzer',
  'Newfoundland',
  'Norfolk Terrier',
  'Norwegian Elkhound',
  'Old English Sheepdog',
  'Papillon',
  'Pembroke Welsh Corgi',
  'Pharaoh Hound',
  'Pointer',
  'Pomeranian',
  'Poodle',
  'Portuguese Water Dog',
  'Pug',
  'Pyrenean Mountain Dog',
  'Rhodesian Ridgeback',
  'Rottweiler',
  'Saint Bernard',
  'Samoyed',
  'Schipperke',
  'Scottish Terrier',
  'Shetland Sheepdog',
  'Shih Tzu',
  'Siberian Husky',
  'Smooth Fox Terrier',
  'Spanish Water Dog',
  'Staffordshire Bull Terrier',
  'Standard Schnauzer',
  'Sussex Spaniel',
  'Tibetan Spaniel',
  'Tibetan Terrier',
  'Vizsla',
  'Weimaraner',
  'Welsh Corgi',
  'Welsh Springer Spaniel',
  'West Highland White Terrier',
  'Whippet',
  'White Swiss Shepherd',
  'Wire Fox Terrier',
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