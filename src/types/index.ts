// Common shared interfaces
export interface BaseEntity {
  id: number;
  created_at: string;
  updated_at: string;
}

// User & Auth related interfaces
export type UserRole = 
  | 'director'
  | 'educateur'
  | 'chef_groupe'
  | 'infirmier'
  | 'animateur_general'
  | 'economat'
  | 'postman'
  | 'normal';

export interface User extends BaseEntity {
  name: string;
  email: string;
  role: UserRole;
  profile_picture?: string;
  status?: 'active' | 'inactive' | 'banned';
  phone?: string;
  gender?: 'M' | 'F';
  cin?: string;
  date_naissance?: string;
  certification?: string;
  address?: string;
  join_year?: number;
}

export interface Member extends BaseEntity {
  name: string; // required|string|max:255
  email: string; // required|string|email|max:255|unique:users
  password?: string; // required (on create), confirmed, min:8
  password_confirmation?: string; // used for confirmation
  role: UserRole;
  gender?: 'M' | 'F'; // nullable|in:M,F
  phone?: string; // nullable|string|max:20
  cin?: string; // nullable|string|max:20
  date_naissance?: string; // nullable|date (ISO string)
  certification?: string; // nullable|string
  address?: string; // nullable|string
  join_year?: number; // nullable|integer|min:1900|max:next year
  profile_picture?: string; // nullable|string
  status?: 'active' | 'inactive' | 'banned'; // nullable|in:...
}

// Children-related interfaces
export interface Enfant extends BaseEntity {
  name: string;
  age?: number;
  gender?: 'male' | 'female';
  group?: string;
  join_date?: string;
  status?: 'active' | 'inactive';
  notes?: string;
  photo?: string;
  
  // Adding the fields used in EnfantForm.tsx
  date_naissance?: string;
  lieu_naissance?: string;
  sexe?: string;
  niveau_scolaire?: string;
  nombre_freres?: number;
  nombre_soeurs?: number;
  rang_familial?: string;
  nom_pere?: string;
  nom_mere?: string;
  contact_parent?: string;
  profession_parent?: string;
  date_examen_medical?: string;
  resultat_examen?: string;
  region?: string;
  participation_count?: number;
  floss?: number;
  interests?:string;
  hobbies?:string;
}

// Health-related interfaces
export interface Maladie extends BaseEntity {
  enfant_id: number;
  name_maladie: string;
  description_maladie: string;
  medicament_name?: string | null;
  posologie?: string | null;
  enfant?: {
    id: number;
    name: string;
  };
}

// Content-related interfaces
export interface Post extends BaseEntity {
  title: string;
  content: string;
  author_id: number;
  author_name?: string;
  status: 'draft' | 'published' | 'archived';
  image?: string;
  
  // For backward compatibility
  titre?: string;
  contenu?: string;
  user?: {
    id: number;
    name: string;
    profile_picture?: string;
  };
  
  // For handling post images
  images?: {
    id: number;
    image_url: string;
  }[];
}

export interface Program extends BaseEntity {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  organizer_id: number;
  organizer_name: string;
  
  // For additional fields
  phase_id?: number;
  jour?: string;
  horaire?: string;
  type_activite?: 'matin' | 'apres_midi' | 'soiree' | 'pedagogique';
  activite?: string;
  jour_semaine?: string;
  
  // Phase relation
  phase?: {
    id: number;
    name: string;
  };
  
  // Adding the missing properties used in ProgramDetailsModal
  image_url?: string;
  location?: string;
  capacity?: number;
  details_url?: string;
}

export interface CarteTechnique extends BaseEntity {
  title: string;
  content: string;
  category: string;
  author_id: number;
  author_name: string;
  status: 'draft' | 'published' | 'archived';
  
  // Adding fields from your database schema
  name_nachat?: string;
  type_nachat?: string;
  sujet_nachat?: string;
  goals_nachat?: string;
  fi2a_mostahdafa?: string;
  gender?: string;
  '3adad_monkharitin'?: number;
  lieu?: string;
  time?: string;
  hajyat?: string;
  tari9a?: string;
  time_of_day?: string; // Add this field for the time of day
}

// Organization interfaces
export interface Phase extends BaseEntity {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'planning' | 'active' | 'completed';
  year: number;
}

export interface Team extends BaseEntity {
  name?: string;
  description?: string;
  phase_id?: number;
  phase?: {
    id: number;
    name: string;
    year?: number;
  };
  chef_id?: number;
  chef?: {
    id: number;
    name: string;
  };
  educateur_id?: number;
  educateur?: {
    id: number;
    name: string;
  };
  enfant_id?: number[];
  enfants?: Enfant[];
}

// Content & Media interfaces
export interface Anachid extends BaseEntity {
  title: string;
  lyrics: string;
  audio_url?: string;
  author?: string;
  category: string;
  
  // Adding fields to match your actual data
  name_nachid?: string;
  auteur?: string;
  words?: string;
  audio?: string;
  photo?: string;
}

// Transaction types
export interface Transaction extends BaseEntity {
  enfant_id: number;
  item_description: string;
  item_cost: number;
  enfant?: Enfant;
}

// Hobby related interfaces
export interface Hobby extends BaseEntity {
  enfant_id: number;
  enfant_name?: string;
  hobbies: string[];
  interests: string[];
}
