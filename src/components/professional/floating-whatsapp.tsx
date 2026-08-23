"use client";

import { FaWhatsapp } from 'react-icons/fa';
import { useEffect, useState } from "react";

import styles from "./professional-profile.module.css";

type FloatingWhatsappProps = {
  phone: string;
  professionalName: string;
};

export function FloatingWhatsapp({
  phone,
  professionalName,
}: FloatingWhatsappProps) {
  const [heroVisible, setHeroVisible] =
    useState(true);

  const [footerVisible, setFooterVisible] =
    useState(false);

  useEffect(() => {
    const hero = document.querySelector(
      "[data-professional-hero]",
    );

    const footer =
      document.querySelector("footer");

    if (!hero) {
      return;
    }

    const heroObserver =
      new IntersectionObserver(
        ([entry]) => {
          setHeroVisible(entry.isIntersecting);
        },
        {
          threshold: 0.12,
        },
      );

    heroObserver.observe(hero);

    let footerObserver:
      | IntersectionObserver
      | undefined;

    if (footer) {
      footerObserver =
        new IntersectionObserver(
          ([entry]) => {
            setFooterVisible(
              entry.isIntersecting,
            );
          },
          {
            threshold: 0.02,
          },
        );

      footerObserver.observe(footer);
    }

    return () => {
      heroObserver.disconnect();
      footerObserver?.disconnect();
    };
  }, []);

  if (heroVisible || footerVisible) {
    return null;
  }

  const number =
    phone.replace(/\D/g, "");

  const message = encodeURIComponent(
    `Olá! Encontrei o perfil de ${professionalName} no Indica Alagoas.`,
  );

  return (
    <a
      href={`https://wa.me/${number}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.floatingWhatsapp}
      aria-label={`Chamar ${professionalName} no WhatsApp`}
    >
      <FaWhatsapp size={27} />
    </a>
  );
}