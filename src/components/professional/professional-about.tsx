import { UserRound } from "lucide-react";

import { SectionHeading } from "./section-heading";

import styles from "./professional-profile.module.css";

type ProfessionalAboutProps = {
  description: string;
};

export function ProfessionalAbout({
  description,
}: ProfessionalAboutProps) {
  const paragraphs = description
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <section className={styles.card}>
      <SectionHeading
        icon={<UserRound size={18} />}
        title="Sobre o profissional"
      />

      <div className={styles.aboutText}>
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}