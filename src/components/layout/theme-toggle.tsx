"use client";

import { Moon, Sun } from "lucide-react";

import styles from "./site-shell.module.css";

export function ThemeToggle() {
  function toggleTheme() {
    const html = document.documentElement;

    const currentTheme =
      html.dataset.theme === "dark"
        ? "dark"
        : "light";

    const nextTheme =
      currentTheme === "dark"
        ? "light"
        : "dark";

    html.dataset.theme = nextTheme;

    localStorage.setItem(
      "indica-alagoas-theme",
      nextTheme,
    );
  }

  return (
    <button
      type="button"
      className={styles.iconButton}
      onClick={toggleTheme}
      aria-label="Alternar entre tema claro e escuro"
      title="Alternar tema"
    >
      <span
        className={styles.themeMoon}
        aria-hidden="true"
      >
        <Moon size={18} />
      </span>

      <span
        className={styles.themeSun}
        aria-hidden="true"
      >
        <Sun size={18} />
      </span>
    </button>
  );
}