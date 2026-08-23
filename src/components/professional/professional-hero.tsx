import {
  BriefcaseBusiness,
  Clock3,
  MessageCircle,
  MapPin,
  Star,
} from "lucide-react";
import { FaWhatsapp } from 'react-icons/fa';

import { ShareProfileButton } from "./share-profile-button";

import styles from "./professional-profile.module.css";

type ProfessionalHeroProps = {
  name: string;
  category: string;
  location: string;
  description: string;

  whatsapp: string;

  avatarUrl?: string | null;

  rating: number;
  reviewsCount: number;

  responseTime: string;
  experience: string;

  available?: boolean;
  featured?: boolean;
};

export function ProfessionalHero({
  name,
  category,
  location,
  description,
  whatsapp,
  avatarUrl,
  rating,
  reviewsCount,
  responseTime,
  experience,
  available = false,
  featured = false,
}: ProfessionalHeroProps) {
  const whatsappNumber = whatsapp.replace(/\D/g, "");

  const whatsappMessage = encodeURIComponent(
    `Olá! Encontrei o perfil de ${name} no Indica Alagoas.`,
  );

  const whatsappUrl =
    `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <section
      className={styles.hero}
      data-professional-hero
    >
      <div className={styles.heroGlow} />

      <div className={styles.heroMain}>
        <div className={styles.avatarWrapper}>
          <div className={styles.avatar}>
            {avatarUrl ? (
              <span
                className={styles.avatarImage}
                style={{
                  backgroundImage: `url("${avatarUrl}")`,
                }}
                role="img"
                aria-label={name}
              />
            ) : (
              <span className={styles.avatarInitials}>
                {initials}
              </span>
            )}
          </div>
        </div>

        <div className={styles.heroContent}>
          <div className={styles.badges}>
            {available && (
              <span className={styles.availableBadge}>
                <span />
                Disponível agora
              </span>
            )}

            {featured && (
              <span className={styles.featuredBadge}>
                <Star size={13} />
                Profissional em destaque
              </span>
            )}
          </div>

          <h1>{name}</h1>

          <p className={styles.category}>
            {category}
          </p>

          <div className={styles.location}>
            <MapPin size={18} />

            <span>{location}</span>
          </div>

          <p className={styles.description}>
            {description}
          </p>
        </div>

        <div className={styles.heroActions}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappButton}
          >
            <FaWhatsapp size={20} />

            Chamar no WhatsApp
          </a>

          <ShareProfileButton
            professionalName={name}
          />
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <Star size={31} />

          <div>
            <strong>
              {rating.toFixed(1).replace(".", ",")}
            </strong>

            <span>Avaliação</span>
          </div>
        </div>

        <div className={styles.stat}>
          <MessageCircle size={30} />

          <div>
            <strong>{reviewsCount}</strong>

            <span>Avaliações</span>
          </div>
        </div>

        <div className={styles.stat}>
          <Clock3 size={30} />

          <div>
            <strong>{responseTime}</strong>

            <span>Tempo de resposta</span>
          </div>
        </div>

        <div className={styles.stat}>
          <BriefcaseBusiness size={30} />

          <div>
            <strong>{experience}</strong>

            <span>Experiência</span>
          </div>
        </div>
      </div>
    </section>
  );
}