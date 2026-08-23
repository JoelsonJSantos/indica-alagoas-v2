"use client";

import {
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  LogIn,
  Mail,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import styles from "./login.module.css";

type LoginResponse = {
  ok?: boolean;
  message?: string;
  role?: string;
};

export function LoginForm() {
  const router =
    useRouter();

  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    const cleanEmail =
      email
        .trim()
        .toLowerCase();

    if (
      !cleanEmail ||
      !password
    ) {
      setErrorMessage(
        "Informe o e-mail e a senha.",
      );

      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const response =
        await fetch(
          "/api/auth/login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                email:
                  cleanEmail,

                password,
              }),
          },
        );

      let data: LoginResponse =
        {};

      try {
        data =
          (await response.json()) as LoginResponse;
      } catch {
        data = {};
      }

      if (!response.ok) {
        setErrorMessage(
          data.message ??
            "Não foi possível entrar.",
        );

        return;
      }

      router.replace(
        "/painel",
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Erro ao entrar:",
        error,
      );

      setErrorMessage(
        "Não foi possível entrar.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      className={
        styles.form
      }
      onSubmit={
        handleSubmit
      }
    >
      <div
        className={
          styles.field
        }
      >
        <label
          htmlFor="email"
        >
          E-mail
        </label>

        <div
          className={
            styles.inputWrapper
          }
        >
          <Mail
            size={18}
            aria-hidden="true"
          />

          <input
            id="email"
            name="email"
            type="email"
            value={email}
            autoComplete="email"
            placeholder="seu@email.com"
            disabled={
              submitting
            }
            onChange={(
              event,
            ) => {
              setEmail(
                event.target
                  .value,
              );

              setErrorMessage(
                "",
              );
            }}
            required
          />
        </div>
      </div>

      <div
        className={
          styles.field
        }
      >
        <label
          htmlFor="password"
        >
          Senha
        </label>

        <div
          className={
            styles.inputWrapper
          }
        >
          <LockKeyhole
            size={18}
            aria-hidden="true"
          />

          <input
            id="password"
            name="password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            value={password}
            autoComplete="current-password"
            placeholder="Digite sua senha"
            disabled={
              submitting
            }
            onChange={(
              event,
            ) => {
              setPassword(
                event.target
                  .value,
              );

              setErrorMessage(
                "",
              );
            }}
            required
          />

          <button
            type="button"
            className={
              styles.passwordToggle
            }
            onClick={() =>
              setShowPassword(
                (current) =>
                  !current,
              )
            }
            aria-label={
              showPassword
                ? "Ocultar senha"
                : "Mostrar senha"
            }
            title={
              showPassword
                ? "Ocultar senha"
                : "Mostrar senha"
            }
          >
            {showPassword ? (
              <EyeOff
                size={18}
              />
            ) : (
              <Eye
                size={18}
              />
            )}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div
          className={
            styles.errorMessage
          }
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        className={
          styles.submitButton
        }
        disabled={
          submitting
        }
      >
        {submitting ? (
          <>
            <LoaderCircle
              size={18}
              className={
                styles.spinner
              }
            />

            Entrando...
          </>
        ) : (
          <>
            <LogIn
              size={18}
            />

            Entrar
          </>
        )}
      </button>
    </form>
  );
}