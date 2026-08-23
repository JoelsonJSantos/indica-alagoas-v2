import {
  MapPin,
} from "lucide-react";
import { FaFacebook, FaInstagram } from 'react-icons/fa';

import Link from "next/link";

import styles from "./site-shell.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          <div className={styles.footerLogo}>
            <MapPin size={23} />

            <strong>
              Indica
              <em>Alagoas</em>
            </strong>
          </div>

          <p>
            Um ponto de encontro para
            descobrir profissionais,
            comparar informações e iniciar
            uma conversa direta.
          </p>

          <div className={styles.footerSocials}>
            <a
              href="#"
              aria-label="Instagram"
            >
              <FaInstagram size={17} />
            </a>

            <a
              href="#"
              aria-label="Facebook"
            >
              <FaFacebook size={17} />
            </a>
          </div>
        </div>

        <div className={styles.footerColumn}>
          <strong>Indica Alagoas</strong>

          <Link href="/sobre">
            Sobre
          </Link>

          <Link href="/como-funciona">
            Como funciona
          </Link>

          <Link href="/planos">
            Planos
          </Link>

          <Link href="/contato">
            Contato
          </Link>
        </div>

        <div className={styles.footerColumn}>
          <strong>Informações</strong>

          <Link href="/termos">
            Termos de uso
          </Link>

          <Link href="/privacidade">
            Política de Privacidade
          </Link>

          <Link href="/cookies">
            Política de cookies
          </Link>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <span>
          © 2026 Indica Alagoas.
          Todos os direitos reservados.
        </span>

        <span>
          Feito para aproximar Alagoas
          de quem sabe fazer.
        </span>
      </div>
    </footer>
  );
}