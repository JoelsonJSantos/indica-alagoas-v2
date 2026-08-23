import {
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  Info,
  Layers3,
  Star,
} from "lucide-react";

import { SectionHeading } from "./section-heading";

import styles from "./professional-profile.module.css";

type ProfessionalInfoProps = {
  category: string;
  serviceType: string;
  availability: string;
  memberSince: string;
  featured?: boolean;
};

export function ProfessionalInfo({
  category,
  serviceType,
  availability,
  memberSince,
  featured = false,
}: ProfessionalInfoProps) {
  return (
    <section className={styles.card}>
      <SectionHeading
        icon={<Info size={18} />}
        title="Informações do profissional"
      />

      <div className={styles.infoList}>
        <div className={styles.infoRow}>
          <Layers3 size={19} />

          <div>
            <span>Categoria</span>
            <strong>{category}</strong>
          </div>
        </div>

        <div className={styles.infoRow}>
          <BriefcaseBusiness size={19} />

          <div>
            <span>Tipo de atendimento</span>
            <strong>{serviceType}</strong>
          </div>
        </div>

        <div className={styles.infoRow}>
          <Clock3 size={19} />

          <div>
            <span>Disponibilidade</span>
            <strong>{availability}</strong>
          </div>
        </div>

        <div className={styles.infoRow}>
          <CalendarDays size={19} />

          <div>
            <span>Membro desde</span>
            <strong>{memberSince}</strong>
          </div>
        </div>
      </div>

      {featured && (
        <div className={styles.sidebarFeatured}>
          <Star
            size={17}
            fill="currentColor"
          />

          Profissional em destaque
        </div>
      )}
    </section>
  );
}