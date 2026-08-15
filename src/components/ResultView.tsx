"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Sparkles, Unlock } from "lucide-react";
import { Pricing } from "@/components/Pricing";
import { resolveType } from "@/lib/content";
import { LANDING } from "@/lib/landing";
import { DEFAULTS, summaryAnswers, type QuizAnswers } from "@/lib/quiz";
import { isPaid, readLead } from "@/lib/lead";

export function ResultView() {
  const [answers, setAnswers] = useState<QuizAnswers>({ ...DEFAULTS });
  const [unlocked, setUnlocked] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const lead = readLead();
    if (lead) setAnswers({ ...DEFAULTS, ...lead });
    setUnlocked(isPaid());
    setLoaded(true);
  }, []);

  const type = useMemo(() => resolveType(answers), [answers]);
  const summary = useMemo(() => summaryAnswers(answers), [answers]);
  const name = answers.name?.trim();

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-3xl px-5 py-14">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          На главную
        </Link>

        <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-xs uppercase tracking-[0.18em] text-accent3">
          <Unlock className="size-3.5" aria-hidden="true" />
          {unlocked ? "Доступ открыт" : "Бесплатная часть готова"}
        </p>

        <h1 className="mt-6 font-display text-4xl leading-[1.08] text-ink sm:text-5xl">
          {LANDING.result.heading}
        </h1>

        {name ? <p className="mt-4 text-sm text-muted">{name}, вот что показал разбор.</p> : null}

        {/* Free teaser */}
        <section className="mt-10 rounded-3xl border border-accent/40 bg-card p-7 sm:p-9">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            {LANDING.result.teaserLabel}
          </p>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-3 font-display text-3xl leading-tight text-accent sm:text-4xl"
          >
            {type.name}
          </motion.p>
          <p className="mt-5 leading-relaxed text-muted">{type.teaser}</p>
        </section>

        {summary.length ? (
          <p className="mt-5 text-xs leading-relaxed text-muted" suppressHydrationWarning>
            {loaded ? summary.join(" · ") : ""}
          </p>
        ) : null}

        {/* Full blocks — blurred until paid */}
        <section className="mt-16">
          <h2 className="flex items-center gap-3 font-display text-2xl text-ink">
            {unlocked ? (
              <Sparkles className="size-5 text-accent2" aria-hidden="true" />
            ) : (
              <Lock className="size-5 text-accent2" aria-hidden="true" />
            )}
            {unlocked ? "Полный разбор" : LANDING.result.lockedHeading}
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-muted">
            {unlocked ? "Копия отправлена на вашу почту и доступна в PDF." : LANDING.result.lockedNote}
          </p>

          <div className="mt-8 space-y-4">
            {type.blocks.map((block) => (
              <article key={block.title} className="rounded-2xl border border-line bg-card p-6">
                <h3 className="font-display text-xl leading-snug text-ink">{block.title}</h3>

                {unlocked ? (
                  <>
                    {block.body ? (
                      <p className="mt-3 whitespace-pre-line leading-relaxed text-muted">
                        {block.body}
                      </p>
                    ) : null}
                    {block.bullets?.length ? (
                      <ul className="mt-4 space-y-2.5">
                        {block.bullets.map((item) => (
                          <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted">
                            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </>
                ) : (
                  <div aria-hidden="true" className="mt-3 select-none blur-[5px]">
                    <p className="leading-relaxed text-muted">
                      {(block.body ?? block.bullets?.join(" ") ?? "").slice(0, 190)}
                    </p>
                  </div>
                )}

                {!unlocked ? (
                  <p className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-accent2">
                    <Lock className="size-3.5" aria-hidden="true" />
                    Открывается после оплаты
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      </div>

      {!unlocked ? (
        <section className="border-t border-line bg-card/30">
          <div className="mx-auto w-full max-w-6xl px-5 py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-4xl leading-tight text-ink">
                {LANDING.result.unlockHeading}
              </h2>
              <p className="mt-4 leading-relaxed text-muted">{LANDING.result.unlockLead}</p>
            </div>

            <div className="mt-14">
              <Pricing answers={answers} defaultEmail={answers.email ?? ""} />
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
