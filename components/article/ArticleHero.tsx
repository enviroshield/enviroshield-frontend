import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Calendar,
  Clock,
  ShieldCheck,
  PhoneCall,
  CheckCircle2,
} from "lucide-react";

export default function ArticleHero() {
  return (
    <header className="relative border-b border-line/80 bg-gradient-to-b from-[#f5f8fb] via-white to-white pt-8 pb-12 sm:pt-12 sm:pb-16">
      <div className="mx-auto w-[calc(100%_-_48px)] max-w-[1240px] max-[900px]:w-[min(calc(100%_-_40px),680px)] max-[600px]:w-[calc(100%_-_32px)]">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
            <li>
              <Link href="/" className="transition-colors hover:text-blue">
                Home
              </Link>
            </li>
            <li>
              <ChevronRight className="h-3 w-3 text-slate-400" aria-hidden="true" />
            </li>
            <li>
              <Link href="/blog" className="transition-colors hover:text-blue">
                Insights
              </Link>
            </li>
            <li>
              <ChevronRight className="h-3 w-3 text-slate-400" aria-hidden="true" />
            </li>
            <li className="font-semibold text-navy truncate max-w-[240px] sm:max-w-none" aria-current="page">
              Best Roof Waterproofing Company in Bangladesh
            </li>
          </ol>
        </nav>

        {/* Category Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue/20 bg-blue/5 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Engineering & Building Protection Guide</span>
        </div>

        {/* H1 Heading */}
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl md:text-5xl lg:text-[46px] lg:leading-[1.15]">
          Best Roof Waterproofing Company in Bangladesh – Enviro Shield
        </h1>

        {/* Subhead / Lead Description */}
        <p className="mt-4 max-w-3xl text-base sm:text-lg leading-relaxed text-slate-600 font-normal">
          Roof leakage is one of the most common and costly problems faced by building owners in Bangladesh. Learn why professional waterproofing is essential, how advanced multilayer systems protect concrete structures, what standard treatments cost (৳25–৳80/sq ft), and why Enviro Shield is the trusted contractor for long-term building durability.
        </p>

        {/* Author & Editorial Metadata */}
        <div className="mt-6 flex flex-wrap items-center gap-y-3 gap-x-6 border-y border-line/70 py-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-white font-bold text-[11px]">
              ES
            </span>
            <span className="font-bold text-navy">By Enviro Shield</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-blue" aria-hidden="true" />
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <span>Published on March 13, 2026</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <span>Estimated Reading Time: 7 minutes</span>
          </div>

          <div className="ml-auto hidden sm:flex items-center gap-2">
            <a
              href="tel:01613220101"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue/10 px-3 py-1 font-bold text-blue transition-colors hover:bg-blue hover:text-white"
            >
              <PhoneCall className="h-3 w-3" aria-hidden="true" />
              <span>Call 01613220101</span>
            </a>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative mt-8 aspect-[16/9] w-full max-h-[520px] overflow-hidden rounded-3xl border border-line bg-slate-100 shadow-lg">
          <Image
            src="/images/service-hero.jpg"
            alt="Professional concrete roof waterproofing application in Bangladesh by Enviro Shield engineers"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 text-white">
            <div>
              <span className="rounded-md bg-navy/80 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm text-paste">
                Site Operation
              </span>
              <p className="mt-1.5 text-xs sm:text-sm font-medium drop-shadow-md text-white/95">
                Precision seamless elastomeric membrane coating application on reinforced concrete terrace.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-blue px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-deep backdrop-blur-sm"
            >
              Book Site Diagnosis
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
