import { FloatingWhatsapp } from "@/components/professional/floating-whatsapp";
import { ProfessionalAbout } from "@/components/professional/professional-about";
import { ProfessionalGallery } from "@/components/professional/professional-gallery";
import { ProfessionalHero } from "@/components/professional/professional-hero";
import { ProfessionalInfo } from "@/components/professional/professional-info";
import { ProfessionalReviews } from "@/components/professional/professional-reviews";
import { ProfessionalSafety } from "@/components/professional/professional-safety";
import { ProfessionalSocials } from "@/components/professional/professional-socials";

import type { ProfessionalProfile } from "@/types/professional";

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

  /*
   * Temporário.
   *
   * Depois este objeto será substituído pela consulta
   * do profissional no Supabase usando o slug.
   */

  const professional: ProfessionalProfile = {
    slug,

    name: "JS Segurança Eletrônica",

    category: "Segurança Eletrônica",

    location: "Todo o estado de Alagoas",

    description:
      "Instalação e manutenção de câmeras, alarmes, cercas elétricas, controle de acesso e monitoramento.",

    about:
      "A JS Segurança Eletrônica atua com instalação e manutenção de sistemas de segurança eletrônica, atendendo residências, comércios e empresas em Alagoas.\n\nO trabalho é realizado de forma personalizada, buscando entender a necessidade de cada cliente antes de definir a melhor solução para o ambiente.\n\nCada projeto é desenvolvido com foco em segurança, organização e qualidade na instalação, desde pequenos sistemas residenciais até soluções mais completas de monitoramento e controle de acesso.",

    avatarUrl: null,

    whatsapp: "5582999999999",

    rating: 5,
    reviewsCount: 2,

    responseTime: "30 min",
    experience: "5 a 10 anos",

    serviceType: "Residencial e Comercial",
    availability: "Horário Comercial",
    memberSince: "Agosto de 2026",

    available: true,
    featured: true,

    socials: {
      instagram:
        "https://www.instagram.com/",
      facebook:
        "https://www.facebook.com/",
      linkedin:
        "https://www.linkedin.com/",
      tiktok:
        "https://www.tiktok.com/",
    },

    gallery: [
      {
        id: "1",
        imageUrl:
          "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
        alt: "Sistema de segurança instalado",
      },
      {
        id: "2",
        imageUrl:
          "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
        alt: "Câmera de segurança",
      },
      {
        id: "3",
        imageUrl:
          "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80",
        alt: "Sistema de acesso",
      },
      {
        id: "4",
        imageUrl:
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
        alt: "Monitoramento residencial",
      },
      {
        id: "5",
        imageUrl:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
        alt: "Sistema eletrônico",
      },
      {
        id: "6",
        imageUrl:
          "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80",
        alt: "Projeto residencial",
      },
    ],

    reviews: [
      {
        id: "1",
        author: "Jonas",
        date: "07/08/2026",
        rating: 5,
        comment:
          "Serviços de qualidade, atendimento profissional. Recomendo!",
      },
      {
        id: "2",
        author: "Joelson J Santos",
        date: "06/08/2026",
        rating: 5,
        comment:
          "Excelente profissional, serviço de qualidade e atendimento impecável. Recomendo!",
      },
    ],
  };

  return (
    <div className={styles.page}>
      <main className={styles.container}>
        <ProfessionalHero
          name={professional.name}
          category={professional.category}
          location={professional.location}
          description={professional.description}
          avatarUrl={professional.avatarUrl}
          whatsapp={professional.whatsapp}
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
          available={professional.available}
          featured={professional.featured}
        />

        <div className={styles.contentGrid}>
          <div className={styles.mainColumn}>
            <ProfessionalAbout
              description={professional.about}
            />

            <ProfessionalGallery
              items={professional.gallery}
            />

            <ProfessionalReviews
              rating={professional.rating}
              reviewsCount={
                professional.reviewsCount
              }
              reviews={professional.reviews}
            />
          </div>

          <aside className={styles.sidebar}>
            <ProfessionalInfo
              category={professional.category}
              serviceType={
                professional.serviceType
              }
              availability={
                professional.availability
              }
              memberSince={
                professional.memberSince
              }
              featured={professional.featured}
            />

            <ProfessionalSocials
              socials={professional.socials}
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