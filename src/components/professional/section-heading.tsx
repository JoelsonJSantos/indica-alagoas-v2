import type { ReactNode } from "react";

import styles from "./professional-profile.module.css";

type SectionHeadingProps = {
  icon: ReactNode;
  title: string;
};

export function SectionHeading({
  icon,
  title,
}: SectionHeadingProps) {
  return (
    <div className={styles.sectionHeader}>
      <span className={styles.sectionIcon}>
        {icon}
      </span>

      <h2>{title}</h2>
    </div>
  );
}