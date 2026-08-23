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
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link
          href="/"
          className={styles.brand}
          onClick={closeMenu}
        >
          <span className={styles.brandMark}>
            <MapPin size={23} />
          </span>

          <span>
            <strong>
              Indica<em>Alagoas</em>
            </strong>

            <small>
              Profissionais e serviços perto de você
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
            onClick={() => setOpen((value) => !value)}
            aria-label={
              open
                ? "Fechar menu"
                : "Abrir menu"
            }
            aria-expanded={open}
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
        <>
          <button
            type="button"
            className={styles.mobileBackdrop}
            onClick={closeMenu}
            aria-label="Fechar menu"
          />

          <nav className={styles.mobileNav}>
            <Link
              href="/"
              onClick={closeMenu}
            >
              Início
            </Link>

            <Link
              href="/buscar"
              onClick={closeMenu}
            >
              Buscar
            </Link>

            <Link
              href="/categorias"
              onClick={closeMenu}
            >
              Categorias
            </Link>

            <Link
              href="/como-funciona"
              onClick={closeMenu}
            >
              Como funciona
            </Link>

            <div className={styles.mobileNavDivider} />

            <Link
              href="/painel"
              onClick={closeMenu}
              className={styles.mobilePanelLink}
            >
              <Grid2X2 size={17} />
              Painel
            </Link>

            <Link
              href="/login"
              onClick={closeMenu}
              className={styles.mobileLoginLink}
            >
              <LogIn size={17} />
              Entrar
            </Link>
          </nav>
        </>
      )}
    </header>
  );
}