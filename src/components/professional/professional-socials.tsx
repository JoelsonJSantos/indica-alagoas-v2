import {
  ExternalLink,
  Share2,
} from "lucide-react";
import { FaFacebook, FaLinkedin, FaInstagram, FaTiktok } from 'react-icons/fa';

import type { ProfessionalSocials as Socials } from "@/types/professional";

import { SectionHeading } from "./section-heading";

import styles from "./professional-profile.module.css";

type ProfessionalSocialsProps = {
  socials: Socials;
};

export function ProfessionalSocials({
  socials,
}: ProfessionalSocialsProps) {
  const links = [
    {
      label: "Instagram",
      url: socials.instagram,
      icon: <FaInstagram size={18} />,
    },
    {
      label: "Facebook",
      url: socials.facebook,
      icon: <FaFacebook size={18} />,
    },
    {
      label: "LinkedIn",
      url: socials.linkedin,
      icon: <FaLinkedin size={18} />,
    },
    {
      label: "TikTok",
      url: socials.tiktok,
      icon: <FaTiktok size={18} />,
    },
  ].filter((item) => item.url);

  if (links.length === 0) {
    return null;
  }

  return (
    <section className={styles.card}>
      <SectionHeading
        icon={<Share2 size={18} />}
        title="Redes sociais"
      />

      <div className={styles.socialList}>
        {links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            <span className={styles.socialIdentity}>
              {link.icon}
              {link.label}
            </span>

            <ExternalLink size={16} />
          </a>
        ))}
      </div>
    </section>
  );
}