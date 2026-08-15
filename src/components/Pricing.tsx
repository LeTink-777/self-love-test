"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  Clock,
  FileText,
  Headphones,
  Loader2,
  ShieldCheck,
  Video,
} from "lucide-react";
import { useCountdown } from "@/components/Countdown";
import { startCheckout } from "@/lib/checkout";
import { discountPercent, formatPrice } from "@/lib/format";
import { PLAN_LIST, type PlanId } from "@/lib/plans";
import type { QuizAnswers } from "@/lib/quiz";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const TIER_ICON: Record<PlanId, typeof FileText> = {
  basic: FileText,
  standard: Headphones,
  premium: Video,
};

export function Pricing({
  answers,
  defaultEmail = "",
}: {
  answers: QuizAnswers;
  defaultEmail?: string;
}) {
  const uid = useId();
  const [selected, setSelected] = useState<PlanId>("standard");
  const [email, setEmail] = useState(defaultEmail);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const countdown = useCountdown(24);

  useEffect(() => {
    if (defaultEmail) setEmail(defaultEmail);
  }, [defaultEmail]);

  const plan = PLAN_LIST.find((item) => item.id === selected) ?? PLAN_LIST[1];

  async function handlePay() {
    const address = email.trim().toLowerCase();
    if (!EMAIL_RE.test(address)) {
      setError("Укажите почту, на которую отправить разбор");
      return;
    }
    setError(null);
    setPending(true);
    try {
      await startCheckout({
        plan: plan.id,
        email: address,
        name: answers.name || "",
        answers,
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не удалось создать платёж.");
      setPending(false);
    }
  }

  return (
    <div>
      <div className="grid gap-5 lg:grid-cols-3">
        {PLAN_LIST.map((item) => {
          const active = selected === item.id;
          const TierIcon = TIER_ICON[item.id];

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(item.id)}
              aria-pressed={active}
              className="flex flex-col rounded-3xl border-2 bg-card p-6 text-left transition-all duration-300 hover:-translate-y-1"
              style={{
                borderColor: active ? "var(--accent)" : "var(--line)",
                boxShadow: active ? "0 30px 70px -46px var(--accent)" : "none",
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  className="flex size-11 items-center justify-center rounded-2xl"
                  style={{
                    background: active
                      ? "color-mix(in srgb, var(--accent) 18%, transparent)"
                      : "var(--elev)",
                  }}
                >
                  <TierIcon
                    className="size-5"
                    style={{ color: active ? "var(--accent)" : "var(--muted)" }}
                    aria-hidden="true"
                  />
                </span>
                {item.popular ? (
                  <span className="rounded-full border border-accent2 px-3 py-1 text-[11px] uppercase tracking-widest text-accent2">
                    Выбирают чаще
                  </span>
                ) : null}
              </div>

              <h3 className="mt-5 font-display text-2xl leading-tight text-ink">{item.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.summary}</p>

              <p className="mt-5 flex items-baseline gap-3">
                <span className="tnum font-display text-3xl text-ink">
                  {formatPrice(item.price)} ₽
                </span>
                <span className="tnum text-sm text-muted line-through">
                  {formatPrice(item.oldPrice)} ₽
                </span>
              </p>
              <p className="mt-1 text-xs uppercase tracking-widest text-accent">
                выгода {discountPercent(item.price, item.oldPrice)}%
              </p>

              <ul className="mt-6 flex-1 space-y-2.5">
                {item.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                    <Check
                      className="mt-0.5 size-4 shrink-0"
                      style={{ color: active ? "var(--accent)" : "var(--accent3)" }}
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <AnimatePresence initial={false}>
                {active && item.timer ? (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-5 inline-flex items-center gap-2 overflow-hidden text-xs text-accent2"
                  >
                    <Clock className="size-3.5 shrink-0" aria-hidden="true" />
                    Цена держится ещё{" "}
                    <span className="tnum font-semibold" suppressHydrationWarning>
                      {countdown.text}
                    </span>
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </button>
          );
        })}
      </div>

      <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-line bg-card p-6">
        <label htmlFor={`${uid}-email`} className="mb-2 block text-sm text-muted">
          Куда отправить разбор
        </label>
        <input
          id={`${uid}-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-ink placeholder:text-muted/60 transition-colors focus:border-accent focus:outline-none"
        />

        {error ? (
          <p role="alert" className="mt-3 flex items-start gap-2 text-sm text-accent">
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={handlePay}
          disabled={pending}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-4 font-semibold text-bg transition-transform hover:-translate-y-0.5 disabled:opacity-70"
        >
          {pending ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : null}
          Открыть «{plan.name}» за {formatPrice(plan.price)} ₽
        </button>

        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          Оплата через ЮKassa. На странице оплаты доступны карты, СБП, ЮMoney и
          рассрочка — выберите удобный способ.
        </p>
      </div>
    </div>
  );
}
