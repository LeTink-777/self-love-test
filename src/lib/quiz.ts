import { formatBirth } from "@/lib/numerology";

export type QuizAnswers = Record<string, string>;

export type FieldType = "text" | "date" | "textarea" | "radio";

export interface FieldOption {
  id: string;
  label: string;
  /** Points this option adds to each result type. */
  score?: Record<string, number>;
}

export interface QuizField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  help?: string;
  required: boolean;
  /** Lay the radio buttons out in two columns. */
  columns?: number;
  /** Include this answer in the short summary shown on /result. */
  summary?: boolean;
  options?: FieldOption[];
}

export const FIELDS: QuizField[] = [
  {
    "id": "name",
    "type": "text",
    "label": "Как вас зовут",
    "placeholder": "Имя",
    "required": true,
    "summary": true
  },
  {
    "id": "birth",
    "type": "date",
    "label": "Дата рождения",
    "help": "Нужна для расчёта числа судьбы и дополнительного слоя разбора.",
    "required": true,
    "summary": true
  },
  {
    "id": "q1",
    "type": "radio",
    "label": "1. Когда вы чувствуете себя нормально по отношению к себе?",
    "required": true,
    "options": [
      {
        "id": "a",
        "label": "Когда что-то успешно сделала",
        "score": {
          "conditional": 3
        }
      },
      {
        "id": "b",
        "label": "Когда меня похвалили или одобрили",
        "score": {
          "external": 3
        }
      },
      {
        "id": "c",
        "label": "Когда выгляжу не хуже других",
        "score": {
          "comparing": 3
        }
      },
      {
        "id": "d",
        "label": "Честно говоря, почти никогда",
        "score": {
          "numb": 3,
          "critic": 1
        }
      }
    ]
  },
  {
    "id": "q2",
    "type": "radio",
    "label": "2. Что происходит у вас в голове после ошибки?",
    "required": true,
    "options": [
      {
        "id": "a",
        "label": "Долгий внутренний разбор, довольно жёсткий",
        "score": {
          "critic": 3
        }
      },
      {
        "id": "b",
        "label": "Страх, что теперь обо мне подумают плохо",
        "score": {
          "external": 2,
          "critic": 1
        }
      },
      {
        "id": "c",
        "label": "Мысль, что другие бы так не ошиблись",
        "score": {
          "comparing": 3
        }
      },
      {
        "id": "d",
        "label": "Ничего особенного, просто пустота",
        "score": {
          "numb": 2
        }
      }
    ]
  },
  {
    "id": "q3",
    "type": "radio",
    "label": "3. Как вы реагируете на комплимент?",
    "required": true,
    "options": [
      {
        "id": "a",
        "label": "Обесцениваю: это случайность или вежливость",
        "score": {
          "critic": 2,
          "conditional": 1
        }
      },
      {
        "id": "b",
        "label": "Очень радуюсь, настроение зависит от этого весь день",
        "score": {
          "external": 3
        }
      },
      {
        "id": "c",
        "label": "Сравниваю: есть люди, которым это подошло бы больше",
        "score": {
          "comparing": 2
        }
      },
      {
        "id": "d",
        "label": "Не чувствую ничего",
        "score": {
          "numb": 3
        }
      }
    ]
  },
  {
    "id": "q4",
    "type": "radio",
    "label": "4. Что вы чувствуете, отдыхая без причины?",
    "required": true,
    "options": [
      {
        "id": "a",
        "label": "Вину: надо было что-то сделать",
        "score": {
          "conditional": 3
        }
      },
      {
        "id": "b",
        "label": "Беспокойство, что меня сочтут ленивой",
        "score": {
          "external": 2
        }
      },
      {
        "id": "c",
        "label": "Мысли о том, как другие в это время растут",
        "score": {
          "comparing": 3
        }
      },
      {
        "id": "d",
        "label": "Ничего, отдых нормально переносится",
        "score": {
          "numb": 1
        }
      }
    ]
  },
  {
    "id": "q5",
    "type": "radio",
    "label": "5. Каким тоном звучит ваш внутренний голос?",
    "required": true,
    "options": [
      {
        "id": "a",
        "label": "Резким, как строгий учитель",
        "score": {
          "critic": 3
        }
      },
      {
        "id": "b",
        "label": "Тревожным, вечно спрашивает, что подумают",
        "score": {
          "external": 3
        }
      },
      {
        "id": "c",
        "label": "Сравнивающим, всё время приводит примеры других",
        "score": {
          "comparing": 3
        }
      },
      {
        "id": "d",
        "label": "Глухим, я почти его не слышу",
        "score": {
          "numb": 3
        }
      }
    ]
  }
];

/** Radio fields start unselected on purpose — the answer has to be a real one. */
export const DEFAULTS: QuizAnswers = {};

const BY_ID = new Map(FIELDS.map((field) => [field.id, field]));

export function labelFor(fieldId: string, value: string): string {
  const field = BY_ID.get(fieldId);
  if (!field) return value;
  if (field.type === "date") return formatBirth(value);
  if (field.type !== "radio") return value;
  return field.options?.find((option) => option.id === value)?.label ?? value;
}

/** Returns the first problem found, or null when the form is ready to submit. */
export function validate(answers: QuizAnswers): string | null {
  for (const field of FIELDS) {
    if (!field.required) continue;
    const value = (answers[field.id] ?? "").trim();
    if (!value) {
      return field.type === "radio"
        ? `Выберите вариант: ${field.label}`
        : `Заполните поле: ${field.label}`;
    }
    if (field.type === "date" && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return "Укажите дату рождения полностью";
    }
  }
  return null;
}

/** Sums the per-option weights into a score for each result type. */
export function scoreAnswers(answers: QuizAnswers): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const field of FIELDS) {
    if (field.type !== "radio") continue;
    const chosen = field.options?.find((option) => option.id === answers[field.id]);
    if (!chosen?.score) continue;
    for (const [type, points] of Object.entries(chosen.score)) {
      totals[type] = (totals[type] ?? 0) + points;
    }
  }
  return totals;
}

/** Every answered field, written out for the PDF. */
export function describeAnswers(answers: QuizAnswers): string[] {
  const lines: string[] = [];
  for (const field of FIELDS) {
    const value = (answers[field.id] ?? "").trim();
    if (!value) continue;
    lines.push(`${field.label}: ${labelFor(field.id, value)}`);
  }
  return lines;
}

/** The one-line version shown under the free teaser on /result. */
export function summaryAnswers(answers: QuizAnswers): string[] {
  const lines: string[] = [];
  for (const field of FIELDS) {
    if (!field.summary) continue;
    const value = (answers[field.id] ?? "").trim();
    if (!value) continue;
    lines.push(labelFor(field.id, value));
  }
  return lines;
}
