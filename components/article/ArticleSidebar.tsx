"use client";

import Link from "next/link";
import {
  PhoneCall,
  MessageCircle,
  MapPin,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import ArticleTableOfContents, { type TocItem } from "./ArticleTableOfContents";

export default function ArticleSidebar({
  tocItems,
}: {
  tocItems: TocItem[];
}) {
  return (
    <aside className="space-y-6">
      {/* Table of Contents */}
      <ArticleTableOfContents items={tocItems} />

      {/* Direct Contact & Consultation Card */}
      <div className="rounded-2xl border border-line bg-gradient-to-br from-navy to-[#012d45] p-5 text-white shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-paste">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-paste">
            Enviro Shield Hotline
          </span>
        </div>

        <h4 className="mt-3 text-base font-extrabold text-white">
          Dealing with Roof Leakage?
        </h4>
        <p className="mt-1 text-xs text-slate-300 leading-relaxed">
          Talk directly with our senior structural waterproofing engineers for a complimentary diagnosis.
        </p>

        <div className="mt-4 space-y-2.5">
          <a
            href="tel:01613220101"
            className="flex items-center justify-center gap-2 rounded-xl bg-blue py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <PhoneCall className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Call 01613220101</span>
          </a>

          <a
            href="https://wa.me/8801613220101?text=Hello%20Enviro%20Shield,%20I%20need%20assistance%20with%20roof%20waterproofing."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 py-2.5 text-xs font-bold text-white transition-all hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <MessageCircle className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        <div className="mt-4 border-t border-white/10 pt-3 text-[11px] text-slate-300">
          <div className="flex items-start gap-1.5">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-paste" aria-hidden="true" />
            <span>Mirpur 11, Pallabi, Dhaka 1216</span>
          </div>
        </div>
      </div>

      {/* Contextual Services Box */}
      <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
        <h4 className="text-xs font-bold uppercase tracking-wider text-navy border-b border-line pb-2.5">
          Related Solutions
        </h4>
        <ul className="mt-3 space-y-2 text-xs">
          <li>
            <Link
              href="/services"
              className="group flex items-center justify-between font-semibold text-slate-700 transition-colors hover:text-blue"
            >
              <span>Roof & Terrace Waterproofing</span>
              <ArrowRight className="h-3 w-3 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-blue" />
            </Link>
          </li>
          <li>
            <Link
              href="/services"
              className="group flex items-center justify-between font-semibold text-slate-700 transition-colors hover:text-blue"
            >
              <span>Crack Repair & Injection Grouting</span>
              <ArrowRight className="h-3 w-3 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-blue" />
            </Link>
          </li>
          <li>
            <Link
              href="/services"
              className="group flex items-center justify-between font-semibold text-slate-700 transition-colors hover:text-blue"
            >
              <span>Heatproof Roof Coatings</span>
              <ArrowRight className="h-3 w-3 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-blue" />
            </Link>
          </li>
          <li>
            <Link
              href="/projects"
              className="group flex items-center justify-between font-semibold text-slate-700 transition-colors hover:text-blue"
            >
              <span>Commercial Waterproofing Projects</span>
              <ArrowRight className="h-3 w-3 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-blue" />
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="group flex items-center justify-between font-semibold text-slate-700 transition-colors hover:text-blue"
            >
              <span>Book Site Inspection</span>
              <ArrowRight className="h-3 w-3 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-blue" />
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
