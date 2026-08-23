import { notFound } from "next/navigation";

import { FloatingWhatsapp } from "@/components/professional/floating-whatsapp";
import { ProfessionalAbout } from "@/components/professional/professional-about";
import { ProfessionalGallery } from "@/components/professional/professional-gallery";
import { ProfessionalHero } from "@/components/professional/professional-hero";
import { ProfessionalInfo } from "@/components/professional/professional-info";
import { ProfessionalReviews } from "@/components/professional/professional-reviews";
import { ProfessionalSafety } from "@/components/professional/professional-safety";
import { ProfessionalSocials } from "@/components/professional/professional-socials";

import { getProfessionalBySlug } from "@/lib/professionals/get-professional-by-slug";

import styles from "@/components/professional/professional-profile.module.css";

type ProfessionalPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProfessionalPage({
  params,
}: ProfessionalPageProps) {
  const { slug } = await params;

  const professional =
    await getProfessionalBySlug(slug);

  if (!professional) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <main className={styles.container}>
        <ProfessionalHero
          name={professional.name}
          category={professional.category}
          location={professional.location}
          description={
            professional.description
          }
          avatarUrl={
            professional.avatarUrl
          }
          whatsapp={
            professional.whatsapp
          }
          rating={professional.rating}
          reviewsCount={
            professional.reviewsCount
          }
          responseTime={
            professional.responseTime
          }
          experience={
            professional.experience
          }
          available={
            professional.available
          }
          featured={
            professional.featured
          }
        />

        <div className={styles.contentGrid}>
          <div className={styles.mainColumn}>
            <ProfessionalAbout
              description={
                professional.about
              }
            />

            <ProfessionalGallery
              items={
                professional.gallery
              }
            />

            <ProfessionalReviews
              rating={professional.rating}
              reviewsCount={
                professional.reviewsCount
              }
              reviews={
                professional.reviews
              }
            />
          </div>

          <aside className={styles.sidebar}>
            <ProfessionalInfo
              category={
                professional.category
              }
              serviceType={
                professional.serviceType
              }
              availability={
                professional.availability
              }
              memberSince={
                professional.memberSince
              }
              featured={
                professional.featured
              }
            />

            <ProfessionalSocials
              socials={
                professional.socials
              }
            />

            <ProfessionalSafety />
          </aside>
        </div>
      </main>

      <FloatingWhatsapp
        phone={professional.whatsapp}
        professionalName={
          professional.name
        }
      />
    </div>
  );
}