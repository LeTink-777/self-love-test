import type { PdfSection } from "@/lib/pdf";
import { PLANS, isPlanId } from "@/lib/plans";
import { formatRub } from "@/lib/format";
import { describeAnswers, type QuizAnswers } from "@/lib/quiz";
import { resolveType, type ResultBlock } from "@/lib/content";
import { SITE } from "@/lib/site";

function renderBlock(block: ResultBlock): string {
  const parts: string[] = [];
  if (block.body) parts.push(block.body);
  if (block.bullets?.length) parts.push(block.bullets.map((item) => `• ${item}`).join("\n"));
  return parts.join("\n\n");
}

/**
 * The paid deliverable. Everything the visitor only saw blurred on /result is
 * written out in full here, followed by the order details.
 */
export function buildSections(answers: QuizAnswers, plan: string): PdfSection[] {
  const sections: PdfSection[] = [];
  const type = resolveType(answers);

  const described = describeAnswers(answers);
  if (described.length) {
    sections.push({ title: "Ваши ответы", content: described.join("\n") });
  }

  sections.push({
    title: `Ваш результат: ${type.name}`,
    content: type.teaser,
  });

  for (const block of type.blocks) {
    sections.push({ title: block.title, content: renderBlock(block) });
  }

  if (isPlanId(plan)) {
    const selected = PLANS[plan];
    sections.push({
      title: `Тариф «${selected.name}» — ${formatRub(selected.price)}`,
      content: selected.features.map((feature) => `• ${feature}`).join("\n"),
    });
    if (selected.extras.length) {
      sections.push({
        title: "Дополнительные материалы тарифа",
        content: selected.extras.join("\n\n"),
      });
    }
  }

  sections.push({
    title: "Важно",
    content:
      "Материал носит информационно-справочный характер и не является медицинской или психотерапевтической помощью. Если состояние ухудшается или сохраняется дольше нескольких недель, обратитесь к специалисту очно.",
  });

  sections.push({
    title: "Поддержка",
    content: `Если письмо с материалом не пришло, проверьте папку «Спам» и вкладку «Промоакции». Мы отвечаем на любые вопросы по заказу в течение рабочего дня: ${SITE.owner.email}, Telegram ${SITE.owner.telegram}.`,
  });

  return sections;
}
