"use client";

import { Send, Star } from "lucide-react";
import {
  FormEvent,
  useState,
} from "react";

import styles from "./professional-profile.module.css";

const MAX_COMMENT_LENGTH = 120;

export function ProfessionalReviewForm() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] =
    useState(0);

  const [comment, setComment] =
    useState("");

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    /*
     * Depois vamos conectar este formulário
     * ao Supabase.
     */
  }

  return (
    <div className={styles.reviewFormWrapper}>
      <div className={styles.reviewFormDivider} />

      <form
        className={styles.reviewForm}
        onSubmit={handleSubmit}
      >
        <h3>Deixe sua avaliação</h3>

        <div className={styles.reviewFormTop}>
          <label className={styles.reviewField}>
            <span>Seu nome</span>

            <input
              type="text"
              name="name"
              placeholder="Ex.: Maria Oliveira"
              required
            />
          </label>

          <div className={styles.ratingField}>
            <span>Nota</span>

            <div
              className={styles.ratingSelector}
              onMouseLeave={() =>
                setHoverRating(0)
              }
            >
              {Array.from({
                length: 5,
              }).map((_, index) => {
                const value = index + 1;

                const active =
                  value <=
                  (hoverRating || rating);

                return (
                  <button
                    key={value}
                    type="button"
                    className={
                      active
                        ? styles.ratingStarActive
                        : styles.ratingStar
                    }
                    onMouseEnter={() =>
                      setHoverRating(value)
                    }
                    onClick={() =>
                      setRating(value)
                    }
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
              })}
            </div>
          </div>
        </div>

        <label className={styles.reviewField}>
          <span>Comentário</span>

          <textarea
            name="comment"
            value={comment}
            maxLength={
              MAX_COMMENT_LENGTH
            }
            rows={4}
            placeholder="Conte como foi o atendimento e a qualidade do serviço."
            onChange={(event) =>
              setComment(
                event.target.value,
              )
            }
            required
          />
        </label>

        <div className={styles.reviewFormMeta}>
          <span>
            A publicação será feita após
            aprovação do profissional.
          </span>

          <span>
            {comment.length}/
            {MAX_COMMENT_LENGTH}
          </span>
        </div>

        <button
          type="submit"
          className={styles.reviewSubmitButton}
          disabled={rating === 0}
        >
          <Send size={16} />

          Enviar avaliação
        </button>
      </form>
    </div>
  );
}