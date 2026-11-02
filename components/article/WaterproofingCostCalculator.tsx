"use client";

import { useState } from "react";
import { Calculator, PhoneCall, Info, CheckCircle2, ShieldAlert } from "lucide-react";
import { formatTaka } from "@/utils/formatCurrency";

export default function WaterproofingCostCalculator() {
  const [area, setArea] = useState<number>(1200);

  const minCost = area * 25;
  const maxCost = area * 80;

  return (
    <div className="my-10 overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-white via-[#f7fafd] to-[#edf4fa] p-6 shadow-sm sm:p-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-line/80 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue/10 text-blue">
            <Calculator className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue">
              Cost Benchmark & Estimator
            </span>
            <h3 className="text-xl font-extrabold text-navy sm:text-2xl">
              Roof Waterproofing Cost in Bangladesh
            </h3>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-blue/30 bg-blue/5 px-4 py-1.5 text-xs font-bold text-blue">
          <span>Standard Estimate:</span>
          <span className="text-sm font-extrabold text-navy">৳25 – ৳80 / sq. ft.</span>
        </div>
      </div>

      {/* Interactive Estimator */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center justify-between text-sm">
              <label htmlFor="roof-area-input" className="font-bold text-navy">
                Enter or Adjust Roof Area (Square Feet):
              </label>
              <span className="font-extrabold text-blue text-base">
                {area.toLocaleString("en-BD")} sq. ft.
              </span>
            </div>

            <input
              id="roof-area-range"
              type="range"
              min={200}
              max={10000}
              step={100}
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              aria-label="Roof area slider"
              className="mt-3 h-2.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue"
            />

            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>200 sq. ft. (Small terrace)</span>
              <span>5,000 sq. ft.</span>
              <span>10,000+ sq. ft. (Commercial)</span>
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-medium text-slate-500">Common sizes:</span>
            {[600, 1200, 2000, 3500, 5000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setArea(preset)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  area === preset
                    ? "bg-navy text-white shadow-sm"
                    : "border border-line bg-white text-slate-600 hover:border-blue hover:text-blue"
                }`}
              >
                {preset.toLocaleString("en-BD")} sq ft
              </button>
            ))}
          </div>

          {/* Factors affecting cost */}
          <div className="rounded-2xl border border-line/60 bg-white/70 p-4">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy">
              <Info className="h-4 w-4 text-blue" aria-hidden="true" />
              Primary Cost Determining Factors:
            </h4>
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
                <span><strong>Roof size & layout:</strong> Larger uninterrupted slabs offer economies of scale.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
                <span><strong>Surface condition:</strong> Degree of existing cracks, dampness, and concrete spalling.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
                <span><strong>System type:</strong> Single-layer vs. 7-layer reinforced multilayer membrane.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
                <span><strong>Project complexity:</strong> Number of parapets, water tanks, and drainage points.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Calculation Result Card */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-blue/20 bg-gradient-to-b from-navy to-[#012437] p-6 text-white shadow-md">
          <div>
            <div className="inline-block rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-paste">
              Estimated Investment Range
            </div>
            <p className="mt-3 text-xs text-slate-300">
              For approximately <span className="font-bold text-white">{area.toLocaleString("en-BD")} sq. ft.</span>:
            </p>

            <div className="mt-4 border-y border-white/10 py-4">
              <div className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {formatTaka(minCost)} <span className="text-lg font-normal text-slate-400">–</span> {formatTaka(maxCost)}
              </div>
              <p className="mt-1.5 text-xs text-slate-300">
                Calculated based on ৳25 (basic preventive treatment) to ৳80 (heavy-duty multilayer system) per sq. ft.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <a
              href="tel:01613220101"
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-blue py-3.5 text-center text-sm font-bold text-white shadow-lg transition-all hover:bg-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <PhoneCall className="h-4 w-4" aria-hidden="true" />
              <span>Call 01613220101 for Free Site Inspection</span>
            </a>

            <div className="flex items-start gap-2 text-[11px] text-slate-300">
              <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" aria-hidden="true" />
              <span>
                <strong>Disclaimer:</strong> This amount is an editorial estimate from our guide. Official final quotations are issued following an on-site structural moisture inspection.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
