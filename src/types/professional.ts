export type ProfessionalGalleryItem = {
  id: string;
  imageUrl: string;
  alt: string;
};

export type ProfessionalReview = {
  id: string;
  author: string;
  date: string;
  rating: number;
  comment: string;
};

export type ProfessionalSocials = {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  tiktok?: string;
};

export type ProfessionalProfile = {
  slug: string;

  name: string;
  category: string;
  location: string;

  description: string;
  about: string;

  avatarUrl?: string | null;

  whatsapp: string;

  rating: number;
  reviewsCount: number;

  responseTime: string;
  experience: string;

  serviceType: string;
  availability: string;
  memberSince: string;

  available: boolean;
  featured: boolean;

  socials: ProfessionalSocials;

  gallery: ProfessionalGalleryItem[];
  reviews: ProfessionalReview[];
};