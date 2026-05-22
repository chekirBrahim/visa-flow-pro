import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/utils";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const VISA_SYSTEM_PROMPT = `Tu es un expert en visas internationaux depuis la Tunisie, travaillant pour l'agence VisaFlow Pro.

EXPERTISE:
- Toutes les ambassades en Tunisie : France (TLSContact Tunis/Sfax), Italie, Espagne, Allemagne (VFS Global), Pays-Bas, Belgique
- Visa USA : Centre USCIS/VAC Tunis, entretien, DS-160, DS-5540
- Visa Canada : Centre VFS Tunis, eTa/VRT, IRCC
- eVisa : Turquie, Géorgie, Maroc, Kenya, etc.
- TLSContact Tunis : Avenue Mohamed V, Tel: +216 31 35 96 50
- VFS Global Tunis : Immeuble Ennour, Centre Urbain Nord

CONNAISSANCES CLÉS:
1. Documents requis par type de visa
2. Délais de traitement (Schengen: 15 jours, USA: 3-6 mois, Canada: 2-4 mois)
3. Causes fréquentes de refus chez les Tunisiens : fonds insuffisants, attaches insuffisantes, manque de cohérence du dossier
4. Comment rédiger une lettre de motivation convaincante
5. Garanties financières minimales : 50€/jour pour Schengen
6. Procédures d'appel en cas de refus

STYLE:
- Réponses en français, claires et structurées
- Utilise des bullet points pour les listes de documents
- Donne des conseils pratiques et spécifiques à la Tunisie
- Sois rassurant et professionnel
- Si tu n'es pas sûr, dis-le clairement et recommande de contacter l'ambassade

LIMITATIONS:
- Ne donne pas de garanties absolues sur l'obtention du visa
- Ne promets pas de délais fixes (ils peuvent varier)
- Recommande toujours de vérifier sur le site officiel de l'ambassade`;

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json(apiError("Non autorisé"), { status: 401 });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(apiError("Messages invalides"), { status: 400 });
    }

    // Anthropic SDK requires alternating user/assistant turns
    const formattedMessages = messages
      .slice(-20)
      .filter((m: { role: string; content: string }) =>
        m.role === "user" || m.role === "assistant"
      )
      .map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    const response = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1200,
      system: VISA_SYSTEM_PROMPT,
      messages: formattedMessages,
    });

    const content = response.content[0]?.type === "text"
      ? response.content[0].text
      : null;

    if (!content) {
      throw new Error("No response from Claude");
    }

    // Save conversation to DB (fire and forget)
    await prisma_saveConversation(
      session.user.id,
      messages,
      content,
      response.usage.input_tokens + response.usage.output_tokens
    );

    return NextResponse.json(apiSuccess({ content, role: "assistant" }));
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json(
      apiError("Le service IA est temporairement indisponible"),
      { status: 503 }
    );
  }
}

async function prisma_saveConversation(
  userId: string,
  messages: unknown[],
  response: string,
  tokens: number
) {
  try {
    const { prisma } = await import("@/lib/db");
    const existing = await prisma.aiConversation.findFirst({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    if (existing) {
      await prisma.aiConversation.update({
        where: { id: existing.id },
        data: {
          messages: [
            ...(existing.messages as unknown[]),
            { role: "assistant", content: response },
          ],
          tokensUsed: { increment: tokens },
        },
      });
    }
  } catch {
    // Silently fail
  }
}
