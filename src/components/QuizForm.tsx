"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { DEFAULTS, FIELDS, validate, type QuizAnswers, type QuizField } from "@/lib/quiz";
import { saveLead } from "@/lib/lead";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const INPUT_CLASS =
  "w-full rounded-xl border border-line bg-bg px-4 py-3 text-ink placeholder:text-muted/60 transition-colors focus:border-accent focus:outline-none";

export function QuizForm({ id = "quiz", cta }: { id?: string; cta: string }) {
  const router = useRouter();
  const uid = useId();
  const [answers, setAnswers] = useState<QuizAnswers>({ ...DEFAULTS });
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function set(field: string, value: string) {
    setAnswers((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const problem = validate(answers);
    if (problem) {
      setError(problem);
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError("Проверьте адрес электронной почты");
      return;
    }

    setError(null);
    setPending(true);
    saveLead({ ...answers, email: email.trim().toLowerCase() });
    router.push("/result");
  }

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      noValidate
      className="scroll-mt-24 rounded-3xl border border-line bg-card p-6 shadow-[0_30px_80px_-52px_var(--accent)] sm:p-8"
    >
      <div className="space-y-6">
        {FIELDS.map((field) => (
          <Field
            key={field.id}
            field={field}
            uid={`${uid}-${field.id}`}
            value={answers[field.id] ?? ""}
            onChange={(value) => set(field.id, value)}
          />
        ))}

        <div>
          <label htmlFor={`${uid}-email`} className="mb-2 block text-sm text-muted">
            Email для доставки разбора
          </label>
          <input
            id={`${uid}-email`}
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className={INPUT_CLASS}
          />
        </div>
      </div>

      {error ? (
        <p role="alert" className="mt-5 text-sm text-accent">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-4 font-semibold text-bg transition-transform hover:-translate-y-0.5 disabled:opacity-70"
      >
        {pending ? (
          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
        ) : (
          <ArrowRight className="size-5" aria-hidden="true" />
        )}
        {cta}
      </button>

      <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted">
        <ShieldCheck className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        Ответы остаются в вашем браузере. Почта нужна только для доставки материала.
      </p>
    </form>
  );
}

function Field({
  field,
  uid,
  value,
  onChange,
}: {
  field: QuizField;
  uid: string;
  value: string;
  onChange: (value: string) => void;
}) {
  if (field.type === "radio") {
    const columns = field.columns ?? 1;
    return (
      <fieldset>
        <legend className="mb-3 text-sm text-muted">{field.label}</legend>
        <div
          role="radiogroup"
          aria-label={field.label}
          className={columns > 1 ? "grid grid-cols-2 gap-2" : "grid gap-2"}
        >
          {(field.options ?? []).map((option) => {
            const active = value === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onChange(option.id)}
                className="relative rounded-xl border px-4 py-3 text-left text-sm transition-colors"
                style={{
                  borderColor: active ? "var(--accent)" : "var(--line)",
                  color: active ? "var(--ink)" : "var(--muted)",
                  background: active ? "color-mix(in srgb, var(--accent) 14%, transparent)" : "transparent",
                }}
              >
                {active ? (
                  <motion.span
                    layoutId={`${uid}-active`}
                    className="absolute inset-0 rounded-xl border"
                    style={{ borderColor: "var(--accent)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                ) : null}
                <span className="relative">{option.label}</span>
              </button>
            );
          })}
        </div>
        {field.help ? <p className="mt-2 text-xs text-muted">{field.help}</p> : null}
      </fieldset>
    );
  }

  if (field.type === "textarea") {
    return (
      <div>
        <label htmlFor={uid} className="mb-2 block text-sm text-muted">
          {field.label}
        </label>
        <textarea
          id={uid}
          rows={4}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          className={`${INPUT_CLASS} resize-y`}
        />
        {field.help ? <p className="mt-2 text-xs text-muted">{field.help}</p> : null}
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={uid} className="mb-2 block text-sm text-muted">
        {field.label}
      </label>
      <input
        id={uid}
        type={field.type === "date" ? "date" : "text"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        autoComplete={field.type === "date" ? "bday" : "off"}
        className={INPUT_CLASS}
      />
      {field.help ? <p className="mt-2 text-xs text-muted">{field.help}</p> : null}
    </div>
  );
}
