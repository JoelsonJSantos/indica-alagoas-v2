"use client";

import {
  Grid2X2,
  LogIn,
  MapPin,
  Menu,
  X,
} from "lucide-react";

import Link from "next/link";
import { useState } from "react";

import { ThemeToggle } from "./theme-toggle";

import styles from "./site-shell.module.css";

export function SiteHeader() {
  const [open, setOpen] =
    useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link
          href="/"
          className={styles.brand}
        >
          <span className={styles.brandMark}>
            <MapPin size={23} />
          </span>

          <span>
            <strong>
              Indica
              <em>Alagoas</em>
            </strong>

            <small>
              Profissionais e serviços
              perto de você
            </small>
          </span>
        </Link>

        <nav className={styles.desktopNav}>
          <Link href="/">Início</Link>
          <Link href="/buscar">
            Buscar
          </Link>
          <Link href="/categorias">
            Categorias
          </Link>
          <Link href="/como-funciona">
            Como funciona
          </Link>
        </nav>

        <div className={styles.headerActions}>
          <ThemeToggle />

          <Link
            className={styles.panelButton}
            href="/painel"
          >
            <Grid2X2 size={17} />
            Painel
          </Link>

          <Link
            className={styles.loginButton}
            href="/login"
          >
            <LogIn size={17} />
            Entrar
          </Link>

          <button
            type="button"
            className={styles.mobileMenuButton}
            onClick={() =>
              setOpen((value) => !value)
            }
            aria-label="Abrir menu"
          >
            {open ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav className={styles.mobileNav}>
          <Link href="/">Início</Link>
          <Link href="/buscar">
            Buscar
          </Link>
          <Link href="/categorias">
            Categorias
          </Link>
          <Link href="/como-funciona">
            Como funciona
          </Link>
          <Link href="/painel">
            Painel
          </Link>
          <Link href="/login">
            Entrar
          </Link>
        </nav>
      )}
    </header>
  );
}