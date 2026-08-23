import {
  ClipboardCheck,
  MessageCircle,
  ShieldCheck,
  Users,
} from "lucide-react";

import Link from "next/link";

import {
  requireAdmin,
} from "@/lib/auth/require-admin";

import {
  createAdminSupabaseClient,
} from "@/lib/supabase/admin";

import styles from "./painel.module.css";

export default async function PainelPage() {
  const {
    user,
    profile,
  } =
    await requireAdmin();

  const supabase =
    createAdminSupabaseClient();

  const [
    professionalsResult,
    pendingReviewsResult,
    approvedReviewsResult,
  ] = await Promise.all([
    supabase
      .from(
        "professionals",
      )
      .select(
        "id",
        {
          count: "exact",
          head: true,
        },
      )
      .is(
        "deleted_at",
        null,
      ),

    supabase
      .from(
        "professional_reviews",
      )
      .select(
        "id",
        {
          count: "exact",
          head: true,
        },
      )
      .eq(
        "status",
        "pending",
      ),

    supabase
      .from(
        "professional_reviews",
      )
      .select(
        "id",
        {
          count: "exact",
          head: true,
        },
      )
      .eq(
        "status",
        "approved",
      ),
  ]);

  const professionalsCount =
    professionalsResult.count ??
    0;

  const pendingReviewsCount =
    pendingReviewsResult.count ??
    0;

  const approvedReviewsCount =
    approvedReviewsResult.count ??
    0;

  const displayName =
    profile.fullName ??
    user.email ??
    "Administrador";

  return (
    <main
      className={
        styles.page
      }
    >
      <div
        className={
          styles.container
        }
      >
        <header
          className={
            styles.panelHeader
          }
        >
          <div>
            <span
              className={
                styles.eyebrow
              }
            >
              <ShieldCheck
                size={15}
              />

              Administração
            </span>

            <h1>
              Painel
            </h1>

            <p>
              Olá,{" "}
              <strong>
                {displayName}
              </strong>
              . Gerencie o
              Indica Alagoas por
              aqui.
            </p>
          </div>
        </header>

        <section
          className={
            styles.statsGrid
          }
        >
          <article
            className={
              styles.statCard
            }
          >
            <span
              className={
                styles.statIcon
              }
            >
              <Users
                size={21}
              />
            </span>

            <div>
              <strong>
                {
                  professionalsCount
                }
              </strong>

              <span>
                Profissionais
              </span>
            </div>
          </article>

          <article
            className={
              styles.statCard
            }
          >
            <span
              className={`${styles.statIcon} ${styles.pendingIcon}`}
            >
              <MessageCircle
                size={21}
              />
            </span>

            <div>
              <strong>
                {
                  pendingReviewsCount
                }
              </strong>

              <span>
                Avaliações pendentes
              </span>
            </div>
          </article>

          <article
            className={
              styles.statCard
            }
          >
            <span
              className={`${styles.statIcon} ${styles.approvedIcon}`}
            >
              <ClipboardCheck
                size={21}
              />
            </span>

            <div>
              <strong>
                {
                  approvedReviewsCount
                }
              </strong>

              <span>
                Avaliações aprovadas
              </span>
            </div>
          </article>
        </section>

        <section
          className={
            styles.contentCard
          }
        >
          <div
            className={
              styles.contentHeader
            }
          >
            <div>
              <h2>
                Moderação
              </h2>

              <p>
                Analise conteúdos
                enviados antes da
                publicação.
              </p>
            </div>
          </div>

          <div
            className={
              styles.actionsGrid
            }
          >
            <Link
              href="/painel/avaliacoes"
              className={
                styles.actionCard
              }
            >
              <span
                className={
                  styles.actionIcon
                }
              >
                <MessageCircle
                  size={22}
                />
              </span>

              <div>
                <strong>
                  Avaliações
                </strong>

                <span>
                  {
                    pendingReviewsCount
                  }{" "}
                  {pendingReviewsCount ===
                  1
                    ? "avaliação pendente"
                    : "avaliações pendentes"}
                </span>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}