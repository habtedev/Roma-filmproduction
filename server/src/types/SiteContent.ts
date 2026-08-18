export interface PhotoItem {
  id: number;
  title: string;
  category: string;
  location: string;
  src: string;
  specs: string;
  featured?: boolean;
}

export interface VideoFilmItem {
  id: number;
  title: string;
  type: string;
  location: string;
  duration: string;
  tag: string;
  poster: string;
  videoUrl: string;
  quote: string;
  couple: string;
}

export interface PackageItem {
  title: string;
  subtitle: string;
  price: string;
  features: string[];
  recommended?: boolean;
  cta: string;
  popular?: boolean;
}

export interface ServiceItem {
  category: string;
  title: string;
  desc: string;
  features: string[];
  tag: string;
  image: string;
}

export interface ProcessStep {
  num: string;
  title: string;
  desc: string;
}

export interface AboutData {
  eyebrow: string;
  heading: string;
  subheading: string;
  leadParagraph: string;
  secondaryParagraph: string;
  quote: string;
  quoteAuthor: string;
  artistName: string;
  artistRole: string;
  artistImage: string;
  badgeText: string;
  experienceYears: string;
  weddingsCount: string;
  countriesCount: string;
  satisfactionRate: string;
  processSteps: ProcessStep[];
}

export interface InquiryItem {
  id: string;
  name: string;
  partnerName?: string;
  email: string;
  phone: string;
  service: string;
  weddingDate: string;
  venue: string;
  guestCount?: string;
  budget: string;
  message: string;
  howFound?: string;
  status: "new" | "replied" | "booked" | "archived";
  createdAt: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  hours: string;
  instagram: string;
  facebook: string;
  youtube: string;
}

export interface AdminProfile {
  name: string;
  email: string;
  role: string;
  phone: string;
  avatar: string;
  studioName: string;
  twoFactorEnabled: boolean;
  lastLogin: string;
}

export interface SiteContentData {
  about: AboutData;
  photos: PhotoItem[];
  videos: VideoFilmItem[];
  packages: PackageItem[];
  services: ServiceItem[];
  inquiries: InquiryItem[];
  adminProfile: AdminProfile;
  contact: ContactInfo;
}
