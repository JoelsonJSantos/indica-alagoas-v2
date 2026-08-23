import { createServerSupabaseClient } from "@/lib/supabase/server";

import type {
  ProfessionalGalleryItem,
  ProfessionalProfile,
  ProfessionalReview,
  ProfessionalSocials,
} from "@/types/professional";

type CategoryRelation = {
  name: string;
};

type ProfessionalRow = {
  id: string;
  slug: string;
  name: string;

  short_description: string | null;
  about: string | null;

  whatsapp: string;

  avatar_url: string | null;

  location_text: string | null;

  response_time: string | null;
  experience_range: string | null;
  service_type: string | null;
  availability_text: string | null;

  available: boolean;
  featured: boolean;

  rating: number | string;
  reviews_count: number;

  created_at: string;

  categories:
    | CategoryRelation
    | CategoryRelation[]
    | null;
};

function getCategoryName(
  category: ProfessionalRow["categories"],
) {
  if (!category) {
    return "Profissional";
  }

  if (Array.isArray(category)) {
    return category[0]?.name ?? "Profissional";
  }

  return category.name;
}

function formatMemberSince(date: string) {
  const value = new Date(date);

  const formatted = new Intl.DateTimeFormat(
    "pt-BR",
    {
      month: "long",
      year: "numeric",
      timeZone: "America/Maceio",
    },
  ).format(value);

  return (
    formatted.charAt(0).toUpperCase() +
    formatted.slice(1)
  );
}

function formatReviewDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Maceio",
  }).format(new Date(date));
}

export async function getProfessionalBySlug(
  slug: string,
): Promise<ProfessionalProfile | null> {
  const supabase =
    createServerSupabaseClient();

  const {
    data: professional,
    error: professionalError,
  } = await supabase
    .from("professionals")
    .select(
      `
        id,
        slug,
        name,
        short_description,
        about,
        whatsapp,
        avatar_url,
        location_text,
        response_time,
        experience_range,
        service_type,
        availability_text,
        available,
        featured,
        rating,
        reviews_count,
        created_at,
        categories (
          name
        )
      `,
    )
    .eq("slug", slug)
    .single();

  if (professionalError || !professional) {
    return null;
  }

  const row =
    professional as unknown as ProfessionalRow;

  const [
    socialsResult,
    galleryResult,
    reviewsResult,
  ] = await Promise.all([
    supabase
      .from("professional_socials")
      .select(
        `
          network,
          url,
          position
        `,
      )
      .eq("professional_id", row.id)
      .order("position", {
        ascending: true,
      }),

    supabase
      .from("professional_gallery")
      .select(
        `
          id,
          image_url,
          alt_text,
          position
        `,
      )
      .eq("professional_id", row.id)
      .eq("status", "approved")
      .order("position", {
        ascending: true,
      }),

    supabase
      .from("professional_reviews")
      .select(
        `
          id,
          client_name,
          rating,
          comment,
          created_at
        `,
      )
      .eq("professional_id", row.id)
      .eq("status", "approved")
      .order("created_at", {
        ascending: false,
      }),
  ]);

  const socials: ProfessionalSocials = {};

  for (const social of socialsResult.data ?? []) {
    switch (social.network) {
      case "instagram":
        socials.instagram = social.url;
        break;

      case "facebook":
        socials.facebook = social.url;
        break;

      case "linkedin":
        socials.linkedin = social.url;
        break;

      case "tiktok":
        socials.tiktok = social.url;
        break;
    }
  }

  const gallery: ProfessionalGalleryItem[] =
    (galleryResult.data ?? []).map(
      (item) => ({
        id: item.id,
        imageUrl: item.image_url,
        alt:
          item.alt_text ??
          `Trabalho realizado por ${row.name}`,
      }),
    );

  const reviews: ProfessionalReview[] =
    (reviewsResult.data ?? []).map(
      (review) => ({
        id: review.id,

        author: review.client_name,

        date: formatReviewDate(
          review.created_at,
        ),

        rating: review.rating,

        comment: review.comment,
      }),
    );

  return {
    slug: row.slug,

    name: row.name,

    category: getCategoryName(
      row.categories,
    ),

    location:
      row.location_text ??
      "Alagoas",

    description:
      row.short_description ?? "",

    about:
      row.about ??
      row.short_description ??
      "",

    avatarUrl: row.avatar_url,

    whatsapp: row.whatsapp,

    rating: Number(row.rating),

    reviewsCount: row.reviews_count,

    responseTime:
      row.response_time ??
      "Sob consulta",

    experience:
      row.experience_range ??
      "Não informado",

    serviceType:
      row.service_type ??
      "Não informado",

    availability:
      row.availability_text ??
      "Sob consulta",

    memberSince: formatMemberSince(
      row.created_at,
    ),

    available: row.available,

    featured: row.featured,

    socials,

    gallery,

    reviews,
  };
}