import { NextResponse } from "next/server";
import { generatePDF } from "@/lib/pdf";
import { buildSections } from "@/lib/sections";
import type { QuizAnswers } from "@/lib/quiz";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface Body {
  userData?: unknown;
  plan?: unknown;
}

function asAnswers(value: unknown): QuizAnswers {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out: QuizAnswers = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (typeof entry === "string") out[key.slice(0, 40)] = entry.slice(0, 400);
  }
  return out;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;

    const answers = asAnswers(body.userData);
    const plan = typeof body.plan === "string" ? body.plan : "standard";

    const pdfBuffer = await generatePDF({
      title: SITE.productName,
      userName: answers.name || "Дорогой клиент",
      sections: buildSections(answers, plan),
      siteName: SITE.productName,
      accentColor: SITE.accentColor,
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="result.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[generate-pdf] failed", error);
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }
}
