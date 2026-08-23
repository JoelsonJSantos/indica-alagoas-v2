import {
  MessageCircle,
  Star,
} from "lucide-react";

import type { ProfessionalReview } from "@/types/professional";

import { ProfessionalReviewForm } from "./professional-review-form";
import { SectionHeading } from "./section-heading";

import styles from "./professional-profile.module.css";

type ProfessionalReviewsProps = {
  professionalSlug: string;

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
    <div
      className={styles.stars}
    >
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
  professionalSlug,
  rating,
  reviewsCount,
  reviews,
}: ProfessionalReviewsProps) {
  return (
    <section
      className={styles.card}
    >
      <SectionHeading
        icon={
          <MessageCircle
            size={18}
          />
        }
        title="Avaliações de clientes"
      />

      <div
        className={
          styles.reviewsLayout
        }
      >
        <div
          className={
            styles.reviewSummary
          }
        >
          <strong>
            {rating
              .toFixed(1)
              .replace(
                ".",
                ",",
              )}
          </strong>

          <Stars
            rating={rating}
          />

          <span>
            {reviewsCount}{" "}
            {reviewsCount === 1
              ? "avaliação"
              : "avaliações"}
          </span>
        </div>

        <div
          className={
            styles.reviewList
          }
        >
          {reviews.length ===
          0 ? (
            <p
              style={{
                margin: 0,

                color:
                  "var(--profile-muted)",

                fontSize:
                  "13px",

                lineHeight:
                  1.65,
              }}
            >
              Ainda não há
              avaliações
              publicadas para
              este profissional.
            </p>
          ) : (
            reviews.map(
              (review) => (
                <article
                  key={
                    review.id
                  }
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
                        {
                          review.author
                        }
                      </strong>

                      <span>
                        {
                          review.date
                        }
                      </span>
                    </div>

                    <Stars
                      rating={
                        review.rating
                      }
                    />
                  </div>

                  <p>
                    {
                      review.comment
                    }
                  </p>
                </article>
              ),
            )
          )}
        </div>
      </div>

      <ProfessionalReviewForm
        professionalSlug={
          professionalSlug
        }
      />
    </section>
  );
}