import {
  MessageCircle,
  Star,
} from "lucide-react";

import type { ProfessionalReview } from "@/types/professional";

import { ProfessionalReviewForm } from "./professional-review-form";
import { SectionHeading } from "./section-heading";

import styles from "./professional-profile.module.css";

type ProfessionalReviewsProps = {
  rating: number;
  reviewsCount: number;
  reviews: ProfessionalReview[];
};

function Stars({
  rating,
}: {
  rating: number;
}) {
  return (
    <div className={styles.stars}>
      {Array.from({
        length: 5,
      }).map((_, index) => (
        <Star
          key={index}
          size={16}
          fill={
            index <
            Math.round(rating)
              ? "currentColor"
              : "none"
          }
        />
      ))}
    </div>
  );
}

export function ProfessionalReviews({
  rating,
  reviewsCount,
  reviews,
}: ProfessionalReviewsProps) {
  return (
    <section className={styles.card}>
      <SectionHeading
        icon={
          <MessageCircle size={18} />
        }
        title="Avaliações de clientes"
      />

      <div className={styles.reviewsLayout}>
        <div className={styles.reviewSummary}>
          <strong>
            {rating
              .toFixed(1)
              .replace(".", ",")}
          </strong>

          <Stars rating={rating} />

          <span>
            {reviewsCount}{" "}
            {reviewsCount === 1
              ? "avaliação"
              : "avaliações"}
          </span>
        </div>

        <div className={styles.reviewList}>
          {reviews.map(
            (review) => (
              <article
                key={review.id}
                className={
                  styles.review
                }
              >
                <div
                  className={
                    styles.reviewTop
                  }
                >
                  <span
                    className={
                      styles.reviewAvatar
                    }
                  >
                    {review.author
                      .charAt(0)
                      .toUpperCase()}
                  </span>

                  <div
                    className={
                      styles.reviewIdentity
                    }
                  >
                    <strong>
                      {review.author}
                    </strong>

                    <span>
                      {review.date}
                    </span>
                  </div>

                  <Stars
                    rating={
                      review.rating
                    }
                  />
                </div>

                <p>
                  {review.comment}
                </p>
              </article>
            ),
          )}

          <button
            type="button"
            className={
              styles.outlineActionSmall
            }
          >
            <MessageCircle
              size={15}
            />

            Ver todas as avaliações
          </button>
        </div>
      </div>

      <ProfessionalReviewForm />
    </section>
  );
}