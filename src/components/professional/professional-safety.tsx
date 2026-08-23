import {
  CheckCircle2,
  Flag,
  ShieldCheck,
} from "lucide-react";

import { SectionHeading } from "./section-heading";

import styles from "./professional-profile.module.css";

export function ProfessionalSafety() {
  const items = [
    "Verifique as avaliações e o histórico do profissional",
    "Converse sobre prazos e valores",
    "Peça referências de trabalhos anteriores",
    "Formalize o combinado por escrito",
  ];

  return (
    <section className={styles.card}>
      <SectionHeading
        icon={<ShieldCheck size={18} />}
        title="Antes de contratar"
      />

      <div className={styles.safetyList}>
        {items.map((item) => (
          <div
            key={item}
            className={styles.safetyItem}
          >
            <CheckCircle2 size={16} />
            <span>{item}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        className={styles.reportButton}
      >
        <Flag size={17} />

        Denunciar perfil
      </button>
    </section>
  );
}