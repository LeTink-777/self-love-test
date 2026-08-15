import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Блог",
  description: `Разборы и статьи по теме: ${SITE.description}`,
  keywords: SITE.keywords,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    title: `Блог — ${SITE.productName}`,
    description: `Разборы и статьи по теме: ${SITE.description}`,
    url: `${SITE.url}/blog`,
  },
  robots: { index: true, follow: true },
};

export default function BlogIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE.url}/blog#blog`,
    name: `Блог — ${SITE.productName}`,
    url: `${SITE.url}/blog`,
    inLanguage: "ru-RU",
    blogPost: BLOG_POSTS.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      url: `${SITE.url}/blog/${post.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-3xl px-5 py-14">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            На главную
          </Link>

          <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-xs uppercase tracking-[0.18em] text-accent">
            <BookOpen className="size-3.5" aria-hidden="true" />
            Блог
          </p>

          <h1 className="mt-6 font-display text-4xl leading-[1.1] text-ink sm:text-5xl">
            Статьи по теме
          </h1>

          <p className="mt-5 leading-relaxed text-muted">
            Подробные разборы, инструкции и ответы на частые вопросы. Каждая
            статья — самостоятельный материал, читать можно в любом порядке.
          </p>

          <ul className="mt-12 space-y-4">
            {BLOG_POSTS.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block rounded-2xl border border-line bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-accent"
                >
                  <h2 className="font-display text-xl leading-snug text-ink sm:text-2xl">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{post.description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm text-accent">
                    Читать
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
