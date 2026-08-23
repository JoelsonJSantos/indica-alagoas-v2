"use client";

import {
  Send,
  Star,
} from "lucide-react";

import {
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import styles from "./professional-profile.module.css";

const MAX_COMMENT_LENGTH = 120;

type ProfessionalReviewFormProps = {
  professionalSlug: string;
};

type SubmitStatus =
  | "idle"
  | "submitting"
  | "success"
  | "error";

type ApiResponse = {
  ok?: boolean;
  message?: string;
};

export function ProfessionalReviewForm({
  professionalSlug,
}: ProfessionalReviewFormProps) {
  const [name, setName] =
    useState("");

  const [rating, setRating] =
    useState(0);

  const [
    hoverRating,
    setHoverRating,
  ] = useState(0);

  const [comment, setComment] =
    useState("");

  const [status, setStatus] =
    useState<SubmitStatus>("idle");

  const [
    feedbackMessage,
    setFeedbackMessage,
  ] = useState("");

  const isSubmitting =
    status === "submitting";

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const cleanName =
      name.trim();

    const cleanComment =
      comment.trim();

    if (
      cleanName.length < 2
    ) {
      setStatus("error");

      setFeedbackMessage(
        "Informe seu nome.",
      );

      return;
    }

    if (rating < 1) {
      setStatus("error");

      setFeedbackMessage(
        "Escolha uma nota de 1 a 5 estrelas.",
      );

      return;
    }

    if (
      cleanComment.length < 5
    ) {
      setStatus("error");

      setFeedbackMessage(
        "Escreva um comentário com pelo menos 5 caracteres.",
      );

      return;
    }

    setStatus("submitting");
    setFeedbackMessage("");

    try {
      const response =
        await fetch(
          "/api/reviews",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              professionalSlug,

              name: cleanName,

              rating,

              comment:
                cleanComment,

              /*
               * Honeypot normal permanece
               * vazio.
               */
              website: "",
            }),
          },
        );

      let data: ApiResponse = {};

      try {
        data =
          (await response.json()) as ApiResponse;
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Não foi possível enviar sua avaliação.",
        );
      }

      setName("");
      setRating(0);
      setHoverRating(0);
      setComment("");

      setStatus("success");

      setFeedbackMessage(
        data.message ??
          "Avaliação enviada para moderação.",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível enviar sua avaliação.";

      setStatus("error");

      setFeedbackMessage(
        message,
      );
    }
  }

  return (
    <div
      className={
        styles.reviewFormWrapper
      }
    >
      <div
        className={
          styles.reviewFormDivider
        }
      />

      <form
        className={
          styles.reviewForm
        }
        onSubmit={
          handleSubmit
        }
      >
        <h3>
          Deixe sua avaliação
        </h3>

        {/*
         * Honeypot anti-bot.
         *
         * Fica fora da área visível e
         * da navegação por teclado.
         */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{
            position:
              "absolute",

            left: "-10000px",

            width: "1px",
            height: "1px",

            opacity: 0,

            pointerEvents:
              "none",
          }}
        />

        <div
          className={
            styles.reviewFormTop
          }
        >
          <label
            className={
              styles.reviewField
            }
          >
            <span>Seu nome</span>

            <input
              type="text"
              name="name"
              value={name}
              minLength={2}
              maxLength={80}
              placeholder="Ex.: Maria Oliveira"
              autoComplete="name"
              disabled={
                isSubmitting
              }
              onChange={(
                event,
              ) => {
                setName(
                  event.target
                    .value,
                );

                if (
                  status !==
                  "submitting"
                ) {
                  setStatus(
                    "idle",
                  );

                  setFeedbackMessage(
                    "",
                  );
                }
              }}
              required
            />
          </label>

          <div
            className={
              styles.ratingField
            }
          >
            <span>Nota</span>

            <div
              className={
                styles.ratingSelector
              }
              onMouseLeave={() =>
                setHoverRating(
                  0,
                )
              }
              role="radiogroup"
              aria-label="Nota da avaliação"
            >
              {Array.from({
                length: 5,
              }).map(
                (_, index) => {
                  const value =
                    index + 1;

                  const active =
                    value <=
                    (hoverRating ||
                      rating);

                  return (
                    <button
                      key={
                        value
                      }
                      type="button"
                      role="radio"
                      aria-checked={
                        rating ===
                        value
                      }
                      disabled={
                        isSubmitting
                      }
                      className={
                        active
                          ? styles.ratingStarActive
                          : styles.ratingStar
                      }
                      onMouseEnter={() =>
                        setHoverRating(
                          value,
                        )
                      }
                      onClick={() => {
                        setRating(
                          value,
                        );

                        setStatus(
                          "idle",
                        );

                        setFeedbackMessage(
                          "",
                        );
                      }}
                      aria-label={`${value} estrela${
                        value > 1
                          ? "s"
                          : ""
                      }`}
                    >
                      <Star
                        size={23}
                        fill={
                          active
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>
                  );
                },
              )}
            </div>
          </div>
        </div>

        <label
          className={
            styles.reviewField
          }
        >
          <span>
            Comentário
          </span>

          <textarea
            name="comment"
            value={comment}
            minLength={5}
            maxLength={
              MAX_COMMENT_LENGTH
            }
            rows={4}
            placeholder="Conte como foi o atendimento e a qualidade do serviço."
            disabled={
              isSubmitting
            }
            onChange={(
              event,
            ) => {
              setComment(
                event.target.value,
              );

              if (
                status !==
                "submitting"
              ) {
                setStatus(
                  "idle",
                );

                setFeedbackMessage(
                  "",
                );
              }
            }}
            required
          />
        </label>

        <div
          className={
            styles.reviewFormMeta
          }
          aria-live="polite"
        >
          <span
            style={{
              color:
                status ===
                "success"
                  ? "var(--profile-success)"
                  : status ===
                      "error"
                    ? "var(--profile-highlight)"
                    : undefined,
            }}
          >
            {status ===
              "success"
              ? feedbackMessage
              : status ===
                  "error"
                ? feedbackMessage
                : "A publicação será feita após moderação."}
          </span>

          <span>
            {comment.length}/
            {
              MAX_COMMENT_LENGTH
            }
          </span>
        </div>

        <button
          type="submit"
          className={
            styles.reviewSubmitButton
          }
          disabled={
            rating === 0 ||
            isSubmitting
          }
        >
          <Send size={16} />

          {isSubmitting
            ? "Enviando..."
            : "Enviar avaliação"}
        </button>
      </form>
    </div>
  );
}