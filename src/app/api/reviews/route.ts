import { NextResponse } from "next/server";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const MAX_BODY_LENGTH = 4000;

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 80;

const MIN_COMMENT_LENGTH = 5;
const MAX_COMMENT_LENGTH = 120;

const SLUG_PATTERN =
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type ReviewPayload = {
  professionalSlug?: unknown;
  name?: unknown;
  rating?: unknown;
  comment?: unknown;

  /*
   * Honeypot anti-bot.
   */
  website?: unknown;
};

function jsonError(
  message: string,
  status: number,
) {
  return NextResponse.json(
    {
      ok: false,
      message,
    },
    {
      status,
    },
  );
}

function normalizeName(value: string) {
  return value
    .trim()
    .replace(/\s+/g, " ");
}

function normalizeComment(value: string) {
  return value.trim();
}

export async function POST(
  request: Request,
) {
  try {
    /*
     * Evita receber payloads enormes.
     */
    const rawBody =
      await request.text();

    if (
      rawBody.length >
      MAX_BODY_LENGTH
    ) {
      return jsonError(
        "Requisição muito grande.",
        413,
      );
    }

    let payload: ReviewPayload;

    try {
      payload = JSON.parse(
        rawBody,
      ) as ReviewPayload;
    } catch {
      return jsonError(
        "Dados inválidos.",
        400,
      );
    }

    /*
     * Honeypot.
     *
     * Usuário real nunca preenche esse
     * campo. Bots simples costumam preencher.
     *
     * Retornamos sucesso para o bot não
     * perceber que foi bloqueado.
     */
    if (
      typeof payload.website ===
        "string" &&
      payload.website.trim() !== ""
    ) {
      return NextResponse.json(
        {
          ok: true,
        },
        {
          status: 201,
        },
      );
    }

    if (
      typeof payload.professionalSlug !==
      "string"
    ) {
      return jsonError(
        "Profissional inválido.",
        400,
      );
    }

    const professionalSlug =
      payload.professionalSlug.trim();

    if (
      !professionalSlug ||
      professionalSlug.length > 120 ||
      !SLUG_PATTERN.test(
        professionalSlug,
      )
    ) {
      return jsonError(
        "Profissional inválido.",
        400,
      );
    }

    if (
      typeof payload.name !==
      "string"
    ) {
      return jsonError(
        "Informe seu nome.",
        400,
      );
    }

    const name = normalizeName(
      payload.name,
    );

    if (
      name.length <
        MIN_NAME_LENGTH ||
      name.length >
        MAX_NAME_LENGTH
    ) {
      return jsonError(
        "O nome deve ter entre 2 e 80 caracteres.",
        400,
      );
    }

    if (
      typeof payload.rating !==
        "number" ||
      !Number.isInteger(
        payload.rating,
      ) ||
      payload.rating < 1 ||
      payload.rating > 5
    ) {
      return jsonError(
        "Escolha uma nota entre 1 e 5.",
        400,
      );
    }

    if (
      typeof payload.comment !==
      "string"
    ) {
      return jsonError(
        "Informe um comentário.",
        400,
      );
    }

    const comment =
      normalizeComment(
        payload.comment,
      );

    if (
      comment.length <
        MIN_COMMENT_LENGTH ||
      comment.length >
        MAX_COMMENT_LENGTH
    ) {
      return jsonError(
        "O comentário deve ter entre 5 e 120 caracteres.",
        400,
      );
    }

    const supabase =
      createAdminSupabaseClient();

    /*
     * Não confiamos em um ID enviado pelo
     * navegador.
     *
     * Procuramos o profissional novamente
     * pelo slug no servidor e ainda
     * confirmamos que está público.
     */
    const {
      data: professional,
      error: professionalError,
    } = await supabase
      .from("professionals")
      .select("id")
      .eq(
        "slug",
        professionalSlug,
      )
      .eq(
        "status",
        "approved",
      )
      .eq(
        "available",
        true,
      )
      .is(
        "deleted_at",
        null,
      )
      .maybeSingle();

    if (professionalError) {
      console.error(
        "Erro ao localizar profissional:",
        professionalError,
      );

      return jsonError(
        "Não foi possível enviar a avaliação.",
        500,
      );
    }

    if (!professional) {
      return jsonError(
        "Profissional não encontrado.",
        404,
      );
    }

    /*
     * A avaliação SEMPRE entra como
     * pending.
     *
     * O usuário nunca consegue escolher
     * approved pelo frontend.
     */
    const { error: insertError } =
      await supabase
        .from(
          "professional_reviews",
        )
        .insert({
          professional_id:
            professional.id,

          client_name: name,

          rating:
            payload.rating,

          comment,

          status: "pending",
        });

    if (insertError) {
      console.error(
        "Erro ao salvar avaliação:",
        insertError,
      );

      return jsonError(
        "Não foi possível enviar a avaliação.",
        500,
      );
    }

    return NextResponse.json(
      {
        ok: true,

        message:
          "Avaliação enviada para moderação.",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Erro inesperado em POST /api/reviews:",
      error,
    );

    return jsonError(
      "Ocorreu um erro ao enviar a avaliação.",
      500,
    );
  }
}