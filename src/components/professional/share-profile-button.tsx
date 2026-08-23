"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

import styles from "./professional-profile.module.css";

type ShareProfileButtonProps = {
  professionalName: string;
};

export function ShareProfileButton({
  professionalName,
}: ShareProfileButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: professionalName,
          text: `Confira o perfil de ${professionalName} no Indica Alagoas.`,
          url,
        });

        return;
      }

      await navigator.clipboard.writeText(url);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      // O usuário pode cancelar o compartilhamento.
    }
  }

  return (
    <button
      type="button"
      className={styles.shareButton}
      onClick={handleShare}
    >
      {copied ? <Check size={19} /> : <Share2 size={19} />}

      {copied ? "Link copiado" : "Compartilhar perfil"}
    </button>
  );
}