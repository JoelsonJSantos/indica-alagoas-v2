import { Images } from "lucide-react";

import type { ProfessionalGalleryItem } from "@/types/professional";

import { SectionHeading } from "./section-heading";

import styles from "./professional-profile.module.css";

type ProfessionalGalleryProps = {
  items: ProfessionalGalleryItem[];
};

export function ProfessionalGallery({
  items,
}: ProfessionalGalleryProps) {
  return (
    <section className={styles.card}>
      <SectionHeading
        icon={<Images size={18} />}
        title="Galeria de trabalhos"
      />

      <div className={styles.galleryGrid}>
        {items.slice(0, 6).map((item) => (
          <button
            type="button"
            className={styles.galleryItem}
            key={item.id}
            aria-label={`Abrir ${item.alt}`}
          >
            <span
              className={styles.galleryImage}
              style={{
                backgroundImage: `url("${item.imageUrl}")`,
              }}
              role="img"
              aria-label={item.alt}
            />
          </button>
        ))}
      </div>

      {items.length > 0 && (
        <button
          type="button"
          className={styles.outlineAction}
        >
          <Images size={16} />

          Ver todas as fotos
        </button>
      )}
    </section>
  );
}