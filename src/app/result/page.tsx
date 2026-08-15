import type { Metadata } from "next";
import { ResultView } from "@/components/ResultView";
import { SiteFooter } from "@/components/SiteFooter";
import { LANDING } from "@/lib/landing";

export const metadata: Metadata = {
  title: LANDING.resultMeta.title,
  description: LANDING.resultMeta.description,
  alternates: { canonical: "/result" },
  robots: { index: false, follow: true },
};

export default function ResultPage() {
  return (
    <>
      <ResultView />
      <SiteFooter />
    </>
  );
}
