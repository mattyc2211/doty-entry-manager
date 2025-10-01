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
  'American Cocker Spaniel',
  'American Hairless Terrier',
  'American Staffordshire Terrier',
  'Anatolian Shepherd Dog',
  'Australasian Bosdog',
  'Australian Cattle Dog',
  'Australian Kelpie',
  'Australian Shepherd',
  'Australian Silky Terrier',
  'Australian Stumpy Tail Cattle Dog',
  'Australian Terrier',
  'Azawakh',
  'Basenji',
  'Basset Fauve De Bretagne',
  'Basset Hound',
  'Bavarian Mountain Scent Hound',
  'Beagle',
  'Bearded Collie',
  'Beauceron',
  'Bedlington Terrier',
  'Belgian Shepherd (Groenendael)',
  'Belgian Shepherd (Laekinois)',
  'Belgian Shepherd (Malinois)',
  'Belgian Shepherd (Tervueren)',
  'Bergamasco',
  'Bernese Mountain Dog',
  'Bichon Frise',
  'Biewer Terrier',
  'Black And Tan Coonhound',
  'Black Russian Terrier',
  'Bloodhound',
  'Bluetick Coonhound',
  'Bolognese',
  'Border Collie',
  'Border Terrier',
  'Borzoi',
  'Boston Terrier',
  'Bouvier Des Flandres',
  'Boxer',
  'Bracco Italiano',
  'Briard',
  'Brittany',
  'Bull Terrier',
  'Bull Terrier (Miniature)',
  'Bulldog',
  'Bullmastiff',
  'Cairn Terrier',
  'Canaan Dog',
  'Canadian Eskimo Dog',
  'Caucasian Shepherd Dog',
  'Cavalier King Charles Spaniel',
  'Central Asian Shepherd Dog',
  'Cesky Fousek',
  'Cesky Terrier',
  'Chesapeake Bay Retriever',
  'Chihuahua (Long Coat)',
  'Chihuahua (Smooth Coat)',
  'Chinese Crested Dog',
  'Chow Chow',
  'Cirneco Dell Etna',
  'Clumber Spaniel',
  'Cocker Spaniel',
  'Collie (Rough)',
  'Collie (Smooth)',
  'Coton De Tulear',
  'Curly Coated Retriever',
  'Czechoslovakian Wolfdog',
  'Dachshund (Kaninchen Long Haired)',
  'Dachshund (Kaninchen Smooth Haired)',
  'Dachshund (Kaninchen Wire Haired)',
  'Dachshund (Long Haired)',
  'Dachshund (Min. Long Haired)',
  'Dachshund (Min. Smooth Haired)',
  'Dachshund (Min. Wire Haired)',
  'Dachshund (Smooth Haired)',
  'Dachshund (Wire Haired)',
  'Dalmatian',
  'Dandie Dinmont Terrier',
  'Deerhound',
  'Deutsch Langhaar',
  'Dobermann',
  'Dogue De Bordeaux',
  'Dutch Shepherd Dog',
  'English Setter',
  'English Springer Spaniel',
  'English Toy Terrier (Blk & Tan)',
  'Estrela Mountain Dog',
  'Eurasier',
  'Field Spaniel',
  'Finnish Lapphund',
  'Finnish Spitz',
  'Flat-coated Retriever',
  'Fox Terrier (Smooth)',
  'Fox Terrier (Wire)',
  'Foxhound',
  'French Bulldog',
  'German Hunting Terrier',
  'German Pinscher',
  'German Shepherd Dog (Long Stock)',
  'German Shepherd Dog (Stock Coat)',
  'German Shorthaired Pointer',
  'German Spitz (Klein)',
  'German Spitz (Mittel)',
  'German Wirehaired Pointer',
  'Glen Of Imaal Terrier',
  'Golden Retriever',
  'Gordon Setter',
  'Grand Basset Griffon Vendeen',
  'Great Dane',
  'Great Swiss Mountain Dog',
  'Greyhound',
  'Griffon Bruxellois',
  'Hamiltonstovare',
  'Harrier',
  'Havanese',
  'Hungarian Puli',
  'Hungarian Vizsla',
  'Hungarian Wire Haired Vizsla',
  'Ibizan Hound',
  'Icelandic Sheepdog',
  'Irish Red & White Setter',
  'Irish Setter',
  'Irish Terrier',
  'Irish Water Spaniel',
  'Irish Wolfhound',
  'Italian Corso Dog',
  'Italian Greyhound',
  'Italian Spinone',
  'Jack Russell Terrier',
  'Japanese Akita',
  'Japanese Chin',
  'Japanese Spitz',
  'Kangal Dog',
  'Karelian Bear Dog',
  'Keeshond',
  'Kerry Blue Terrier',
  'King Charles Spaniel',
  'Kleine Munsterlander',
  'Komondor',
  'Kuvasz',
  'Labrador Retriever',
  'Lagotto Romagnolo',
  'Lakeland Terrier',
  'Landseer (European Continental Type)',
  'Large Munsterlander',
  'Leonberger',
  'Lhasa Apso',
  'Lowchen',
  'Maltese',
  'Manchester Terrier',
  'Maremma Sheepdog',
  'Mastiff',
  'Miniature American Shepherd',
  'Miniature Pinscher',
  'Murray River Retriever',
  'Neapolitan Mastiff',
  'Newfoundland',
  'Norfolk Terrier',
  'Norwegian Buhund',
  'Norwegian Elkhound',
  'Norwich Terrier',
  'Nova Scotia Duck Tolling Retriever',
  'Nz Huntaway',
  'Old English Sheepdog',
  'Otterhound',
  'Papillon',
  'Parson Russell Terrier',
  'Pekingese',
  'Peruvian Hairless (Large)',
  'Peruvian Hairless (Medium)',
  'Peruvian Hairless (Small)',
  'Petit Basset Griffon Vendeen',
  'Pharaoh Hound',
  'Pointer',
  'Polish Lowland Sheepdog',
  'Pomeranian',
  'Poodle (Miniature)',
  'Poodle (Standard)',
  'Poodle (Toy)',
  'Portuguese Podengo (Smooth-haired Large)',
  'Portuguese Podengo (Smooth-haired Medium)',
  'Portuguese Podengo (Smooth-haired Miniature)',
  'Portuguese Podengo (Wire-haired Large)',
  'Portuguese Podengo (Wire-haired Medium)',
  'Portuguese Podengo (Wire-haired Miniature)',
  'Portuguese Water Dog',
  'Pug',
  'Pumi',
  'Pyrenean Mastiff',
  'Pyrenean Mountain Dog',
  'Pyrenean Sheepdog - Long Haired',
  'Redbone Coonhound',
  'Rhodesian Ridgeback',
  'Rottweiler',
  'Russian Toy (Russkiy Toy)',
  'Saluki',
  'Samoyed',
  'Schipperke',
  'Schnauzer',
  'Schnauzer (Giant)',
  'Schnauzer (Miniature)',
  'Scottish Terrier',
  'Sealyham Terrier',
  'Shar Pei',
  'Shetland Sheepdog',
  'Shiba Inu',
  'Shih Tzu',
  'Shikoku',
  'Siberian Husky',
  'Skye Terrier',
  'Sloughi',
  'Soft Coated Wheaten Terrier',
  'Spanish Mastiff',
  'Spanish Water Dog',
  'St Bernard',
  'Staffordshire Bull Terrier',
  'Sussex Spaniel',
  'Swedish Lapphund',
  'Swedish Vallhund',
  'Tatra Shepherd Dog',
  'Tenterfield Terrier',
  'Thai Ridgeback Dog',
  'Tibetan Mastiff',
  'Tibetan Spaniel',
  'Tibetan Terrier',
  'Tornjak',
  'Weimaraner',
  'Weimaraner (Long Haired)',
  'Welsh Corgi (Cardigan)',
  'Welsh Corgi (Pembroke)',
  'Welsh Springer Spaniel',
  'Welsh Terrier',
  'West Highland White Terrier',
  'Whippet',
  'White Swiss Shepherd Dog',
  'Wirehaired Slovakian Pointer',
  'Xoloitzcuintle (Intermediate)',
  'Xoloitzcuintle (Miniature)',
  'Xoloitzcuintle (Standard)',
  'Yakutian Laika',
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