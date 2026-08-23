import {
  ShieldCheck,
} from "lucide-react";

import {
  redirect,
} from "next/navigation";

import {
  getAppUser,
} from "@/lib/auth/get-app-user";

import {
  LoginForm,
} from "./login-form";

import styles from "./login.module.css";

export default async function LoginPage() {
  const user =
    await getAppUser();

  if (user) {
    redirect("/painel");
  }

  return (
    <main
      className={
        styles.page
      }
    >
      <section
        className={
          styles.card
        }
      >
        <div
          className={
            styles.brandIcon
          }
        >
          <ShieldCheck
            size={28}
          />
        </div>

        <div
          className={
            styles.heading
          }
        >
          <span>
            Área de acesso
          </span>

          <h1>
            Entrar no Indica Alagoas
          </h1>

          <p>
            Acesso exclusivo para
            profissionais cadastrados
            e administradores.
          </p>
        </div>

        <LoginForm />

        <p
          className={
            styles.securityNote
          }
        >
          Sua sessão permanece
          válida por até 24 horas.
        </p>
      </section>
    </main>
  );
}