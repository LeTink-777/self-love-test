import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { ThankYouView } from "@/components/ThankYouView";
import { isPlanId } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Заказ оформлен",
  description: "Страница подтверждения заказа и скачивания PDF-разбора.",
  alternates: { canonical: "/thank-you" },
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ThankYouPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const raw = params.plan;
  const plan = typeof raw === "string" && isPlanId(raw) ? raw : null;

  return (
    <>
      <ThankYouView planFromUrl={plan} />
      <SiteFooter />
    </>
  );
}
