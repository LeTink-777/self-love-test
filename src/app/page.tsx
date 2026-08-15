import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Faq } from "@/components/Faq";
import { Icon } from "@/components/Icon";
import { QuizForm } from "@/components/QuizForm";
import { SiteFooter } from "@/components/SiteFooter";
import { LANDING } from "@/lib/landing";
import { PLAN_LIST } from "@/lib/plans";
import { formatPrice } from "@/lib/format";
import { SITE } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <main className="flex-1">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 pt-6">
          <span className="font-display text-lg text-ink">{SITE.productName}</span>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
          >
            <BookOpen className="size-4" aria-hidden="true" />
            Блог
          </Link>
        </nav>

        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-32 h-[560px]"
            style={{
              background:
                "radial-gradient(52% 52% at 26% 30%, color-mix(in srgb, var(--accent) 22%, transparent) 0%, transparent 72%), radial-gradient(42% 42% at 82% 16%, color-mix(in srgb, var(--accent2) 14%, transparent) 0%, transparent 70%)",
            }}
          />

          <div className="relative mx-auto grid w-full max-w-6xl gap-14 px-5 pb-20 pt-14 lg:grid-cols-[1.02fr_0.98fr] lg:items-start lg:pt-20">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-xs uppercase tracking-[0.18em] text-accent3">
                <Icon name={LANDING.badgeIcon} className="size-3.5" />
                {LANDING.badge}
              </p>

              <h1 className="mt-7 font-display text-[2.5rem] leading-[1.08] text-ink sm:text-[3.4rem]">
                {LANDING.h1.lead} <span className="text-accent">{LANDING.h1.accent}</span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">{LANDING.intro}</p>

              <div className="mt-10 space-y-4">
                {LANDING.bullets.map((bullet) => (
                  <div
                    key={bullet.title}
                    className="flex gap-4 rounded-2xl border border-line bg-card p-5"
                  >
                    <Icon name={bullet.icon} className="mt-0.5 size-5 shrink-0 text-accent3" />
                    <div>
                      <p className="font-display text-lg text-ink">{bullet.title}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">{bullet.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:pl-4">
              <p className="mb-4 font-display text-xl text-ink">{LANDING.formTitle}</p>
              <QuizForm cta={LANDING.formCta} />
            </div>
          </div>
        </section>

        <section className="border-t border-line bg-card/40">
          <div className="mx-auto w-full max-w-6xl px-5 py-20">
            <div className="max-w-2xl">
              <h2 className="font-display text-4xl leading-tight text-ink">
                {LANDING.inside.title}
              </h2>
              <p className="mt-5 leading-relaxed text-muted">{LANDING.inside.lead}</p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {LANDING.inside.items.map((item) => (
                <div key={item.title} className="rounded-2xl border border-line bg-card p-6">
                  <Icon name={item.icon} className="size-5 text-accent" />
                  <h3 className="mt-4 font-display text-lg leading-snug text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 py-20">
          <h2 className="font-display text-4xl leading-tight text-ink">Как это работает</h2>

          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LANDING.steps.map((step, index) => (
              <li key={step.title} className="rounded-2xl border border-line bg-card p-6">
                <span className="tnum font-display text-3xl text-accent2">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-3 font-display text-lg leading-snug text-ink">{step.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
              </li>
            ))}
          </ol>

          <p className="mt-10 text-sm leading-relaxed text-muted">
            Разбор доступен в трёх форматах: от {formatPrice(PLAN_LIST[0].price)} ₽ за PDF до{" "}
            {formatPrice(PLAN_LIST[PLAN_LIST.length - 1].price)} ₽ за версию с аудио и личной
            сессией. Тарифы открываются после бесплатной части.
          </p>
        </section>

        <section className="border-t border-line bg-card/40">
          <div className="mx-auto w-full max-w-3xl px-5 py-20 text-center">
            <Icon name={LANDING.closing.icon} className="mx-auto size-8 text-accent2" />
            <h2 className="mt-6 font-display text-3xl leading-tight text-ink sm:text-4xl">
              {LANDING.closing.heading}
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-relaxed text-muted">
              {LANDING.closing.lead}
            </p>

            <a
              href="#quiz"
              className="mt-10 inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-4 font-semibold text-bg transition-transform hover:-translate-y-0.5"
            >
              {LANDING.formCta}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>

            <p className="mt-8 text-xs text-muted">
              {SITE.owner.fullName}. ИНН {SITE.owner.inn}. {SITE.owner.status}.
            </p>
          </div>
        </section>

        <Faq />
      </main>
      <SiteFooter />
    </>
  );
}
