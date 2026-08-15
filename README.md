# Разбор самооценки по дате рождения

Тест на тип самооценки и разбор по дате рождения: 5 причин нелюбви к себе, число судьбы и 30-дневный план самопринятия. Тип самооценки — бесплатно.

- Стек: Next.js 16 (App Router), TypeScript strict, Tailwind CSS 4, Framer Motion, Lucide.
- Оплата: ЮKassa REST API через fetch, без SDK. `payment_method_type` не передаётся, поэтому доступны все подключённые способы: карты, СБП, ЮMoney, оплата частями.
- PDF: @react-pdf/renderer со встроенным PT Sans (кириллица).
- Письма: Resend, вложение с PDF.

## Маршруты

| Путь | Назначение |
| --- | --- |
| `/` | Лендинг с формой |
| `/result` | Бесплатная часть результата, остальное под пейволом |
| `/thank-you` | Подтверждение оплаты и скачивание PDF |
| `/blog`, `/blog/[slug]` | Блог, 5 статьи |
| `/privacy`, `/offer` | Политика конфиденциальности и оферта |
| `/api/checkout` | Создание платежа ЮKassa |
| `/api/webhook` | Уведомление об оплате, отправка письма с PDF |
| `/api/generate-pdf` | Генерация PDF по ответам |

## Настройка ЮKassa

- Return URL: `https://self-love-test.vercel.app/thank-you`
- Webhook URL: `https://self-love-test.vercel.app/api/webhook` — события `payment.succeeded` и `payment.canceled`

## Локальный запуск

```bash
npm install
npm run dev
```

Переменные окружения — в `.env.local` (см. `.env.example`).
