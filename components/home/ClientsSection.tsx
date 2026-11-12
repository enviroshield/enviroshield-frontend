"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import Container from "../Container";
import DottedBackground from "../DottedBackground";
import { SectionHeader } from "../SectionHeader";
import { StaggerContainer, StaggerItem } from "../animations/reveal";

/* ────────────────────────────────────────────────────────────────
   1. YOUR LOGOS: just keep adding to ONE flat list.
   • Every 18 logos = 1 slide (first 9 → left cluster, next 9 → right).
   • More than 18 → extra slides appear automatically with
     arrows, dots, swipe and autoplay.
   Put PNGs in /public/images/clients/
──────────────────────────────────────────────────────────────── */
interface ClientPartner {
  name: string;
  logo: string;
}

const CLIENTS: ClientPartner[] = [
  { name: "Enam Medical College & Hospital", logo: "/images/client-images/enam-medical-college.png" },
  { name: "Oriental Real Estate Limited", logo: "/images/client-images/oriental-real-estate.png" },
  { name: "Bangladesh Bank", logo: "/images/client-images/bangladesh-bank.png" },
  { name: "Holiday Inn", logo: "/images/client-images/holiday-inn.png" },
  { name: "Bridge Holdings", logo: "/images/client-images/bridge-holdings.png" },
  { name: "BRAC University", logo: "/images/client-images/brac-university.png" },
  { name: "Abdul Monem Ltd.", logo: "/images/client-images/abdul-monem.png" },
  { name: "Rupayan Housing Estate", logo: "/images/client-images/rupayan-housing-estate.png" },
  { name: "Anwer Khan Modern Hospital", logo: "/images/client-images/anwer-khan-modern.png" },
  { name: "Baywatch Army Welfare Trust", logo: "/images/client-images/baywatch-army-welfare-trust.png" },
  { name: "Equity Property Management", logo: "/images/client-images/equity-property-management.png" },
  { name: "Seagull Hotels", logo: "/images/client-images/seagull-hotels.png" },
  { name: "Finlay", logo: "/images/client-images/finlay.png" },
  { name: "Navana Group", logo: "/images/client-images/navana-group.png" },
  { name: "Hakkani Group", logo: "/images/client-images/hakkani-group.png" },
  { name: "Bestway Group", logo: "/images/client-images/bestway-group.png" },
  { name: "Link-Tex Sportswear", logo: "/images/client-images/link-tex-sportswear.png" },
  { name: "International Islamic University Chittagong", logo: "/images/client-images/iiuc.png" },
  { name: "Comfit Composite Knit Ltd.", logo: "/images/client-images/comfit-composite-knit.png" },
  { name: "Momen Real Estates Limited", logo: "/images/client-images/momen-real-estates.png" },
  { name: "Elegant Group", logo: "/images/client-images/elegant-group.png" },
  { name: "Ispahani", logo: "/images/client-images/ispahani.png" },
  { name: "Kurmitola Golf Club", logo: "/images/client-images/kurmitola-golf-club.png" },
  { name: "Bangladesh Army", logo: "/images/client-images/bangladesh-army.png" },
  { name: "Paramount Textile", logo: "/images/client-images/paramount-textile.png" },
  { name: "Bestway", logo: "/images/client-images/bestway.png" },
  { name: "Best Service", logo: "/images/client-images/best-service.png" },
  { name: "Nova Poultry Limited", logo: "/images/client-images/nova-poultry.png" },
  { name: "Le Méridien", logo: "/images/client-images/le-meridien.png" },
  { name: "Daffodil International University", logo: "/images/client-images/daffodil-international-university.png" },
  { name: "Laila Group", logo: "/images/client-images/laila-group.png" },
  { name: "Meghna Group of Industries", logo: "/images/client-images/meghna-group-of-industries.png" },
  { name: "Mithila Group of Industries", logo: "/images/client-images/mithila-group-of-industries.png" },
  { name: "ismartu", logo: "/images/client-images/ismartu.png" },
  { name: "United Group", logo: "/images/client-images/united-group.png" },
  { name: "Purbachal Bestway City", logo: "/images/client-images/purbachal-bestway-city.png" },
  { name: "Shimanto Convention Centre", logo: "/images/client-images/shimanto-convention-centre.png" },
  { name: "MIST Bangladesh", logo: "/images/client-images/mist-bangladesh.png" },
  { name: "Flaxen Group", logo: "/images/client-images/flaxen-group.png" },
  { name: "Varendra University", logo: "/images/client-images/varendra-university.png" },
  { name: "Shaptak Grihayan", logo: "/images/client-images/shaptak-grihayan.png" },
  { name: "Zaman Group", logo: "/images/client-images/zaman-group.png" },
  { name: "Base Camp", logo: "/images/client-images/base-camp.png" },
  { name: "Abul Khair Group", logo: "/images/client-images/abul-khair-group.png" },
  { name: "Unitex Group", logo: "/images/client-images/unitex-group.png" },
  { name: "Air Wing", logo: "/images/client-images/air-wing.png" },
  { name: "ULAB (University of Liberal Arts Bangladesh)", logo: "/images/client-images/ulab.png" },
  { name: "PMG", logo: "/images/client-images/pmg.png" },
  { name: "Rancon Developments", logo: "/images/client-images/rancon-developments.png" },
  { name: "Border Guard Bangladesh", logo: "/images/client-images/border-guard-bangladesh.png" },
  { name: "Park View Medical College Hospital", logo: "/images/client-images/park-view-medical-college.png" },
  { name: "OMC", logo: "/images/client-images/omc.png" },
  { name: "Generation Next", logo: "/images/client-images/generation-next.png" },
  { name: "National Development Engineers Ltd.", logo: "/images/client-images/national-development-engineers.png" },
];

/* Slider settings */
const PER_SIDE = 9; // logos per cluster
const PER_SLIDE = PER_SIDE * 2; // logos per slide
const AUTOPLAY_MS = 5000; // set to 0 to disable autoplay
const OUT_MS = 480; // how long the "leave" animation runs before swapping slides
const IN_STAGGER = 0.07; // seconds between each hexagon popping in
const OUT_STAGGER = 0.03; // seconds between each hexagon leaving

/* ────────────────────────────────────────────────────────────────
   2. GEOMETRY (pointy-top hexagons, everything derives from --hw)
──────────────────────────────────────────────────────────────── */
const HEX_CLIP =
  "[clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]";

const GEOMETRY_VARS = {
  "--hg": "calc(var(--hw) * 0.08)", // gap
  "--hh": "calc(var(--hw) * 1.1547)", // hexagon height
  "--pw": "calc(var(--hw) * 3 + var(--hg) * 2 + (var(--hw) + var(--hg)) / 2)", // cluster width
  "--ph": "calc(var(--hh) * 2.5 + var(--hg) * 2)", // 3-row cluster height
  "--phm": "calc(var(--hh) + (var(--hh) * 0.75 + var(--hg)) * 5)", // 6-row mobile height
} as CSSProperties;

type Phase = "hidden" | "in" | "out";

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/* Place items into a rows × cols grid COLUMN BY COLUMN (top → bottom, then the
   next column). `colOrder` says which column gets filled first, e.g. [2,1,0]
   fills the right-most column first. Empty slots stay null. */
function buildGrid<T>(items: T[], rows: number, colOrder: number[]): (T | null)[][] {
  const grid: (T | null)[][] = Array.from({ length: rows }, () =>
    Array(colOrder.length).fill(null),
  );
  items.forEach((item, i) => {
    const col = colOrder[Math.floor(i / rows)];
    if (col !== undefined) grid[i % rows][col] = item;
  });
  return grid;
}

/* Invisible placeholder that keeps empty slots aligned */
function HexSpacer() {
  return (
    <div
      aria-hidden="true"
      className="flex-none"
      style={{ width: "var(--hw)", height: "var(--hh)" }}
    />
  );
}

/* A single white hexagon holding one PNG logo.
   The animation lives on an OUTER wrapper so it never fights with
   the hover transform on the inner element. */
function PartnerHex({
  client,
  order,
  phase,
}: {
  client: ClientPartner;
  order: number; // position in the wave (0 = first to appear)
  phase: Phase;
}) {
  return (
    <div
      className={`hex-anim hex-${phase}`}
      style={
        {
          "--di": `${(order * IN_STAGGER).toFixed(3)}s`,
          "--do": `${(order * OUT_STAGGER).toFixed(3)}s`,
        } as CSSProperties
      }
    >
      <div
        title={client.name}
        className="group relative cursor-pointer drop-shadow-[0_6px_14px_rgba(0,51,78,0.08)] transition-all duration-300 hover:z-20 hover:-translate-y-1 hover:scale-[1.07] hover:drop-shadow-[0_16px_26px_rgba(1,110,220,0.22)]"
        style={{ width: "var(--hw)", height: "var(--hh)" }}
      >
        <div className={`absolute inset-0 bg-white ${HEX_CLIP}`}>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-white to-[#f1f5f9]"
          />
          <div className="absolute inset-x-[13%] inset-y-[22%] flex items-center justify-center p-1">
            <Image
              src={client.logo}
              alt={`${client.name} logo`}
              fill
              sizes="(max-width: 640px) 110px, (max-width: 1024px) 150px, 180px"
              quality={95}
              className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* One honeycomb cluster (up to 3 rows × 3). The middle row is pushed
   outward by half a hexagon. The animation wave travels outward from
   the centre hexagon. */
function ClusterPage({
  items,
  side,
  phase,
}: {
  items: ClientPartner[];
  side: "left" | "right";
  phase: Phase;
}) {
  // fill column by column, starting with the column closest to the centre
  const rows = buildGrid(items, 3, side === "left" ? [2, 1, 0] : [0, 1, 2]);
  const dir = side === "left" ? -1 : 1;

  return (
    <div
      className={`flex flex-none flex-col ${
        side === "left" ? "items-end" : "items-start"
      }`}
      style={{ width: "var(--pw)", height: "var(--ph)" }}
    >
      {rows.map((row, r) => (
        <div
          key={r}
          className="flex"
          style={{
            gap: "var(--hg)",
            marginTop: r === 0 ? 0 : "calc(var(--hh) * -0.25 + var(--hg))",
            transform:
              r % 2 === 1
                ? `translateX(calc(${dir} * (var(--hw) + var(--hg)) / 2))`
                : undefined,
          }}
        >
          {row.map((c, i) => {
            if (!c) return <HexSpacer key={`s-${i}`} />;
            // column distance from the centre hexagon
            const fromCentre = side === "left" ? row.length - 1 - i : i;
            return (
              <PartnerHex
                key={`${c.name}-${i}`}
                client={c}
                phase={phase}
                order={fromCentre + r * 0.7}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* Mobile: one compact honeycomb holding a whole slide (up to 18) */
function MobilePage({
  items,
  phase,
}: {
  items: ClientPartner[];
  phase: Phase;
}) {
  // up to 6 rows; fill column by column, middle column first
  const rowCount = Math.min(6, items.length);
  const grid = buildGrid(items, rowCount, [1, 0, 2]);

  return (
    <div
      className="flex flex-none flex-col items-center"
      style={{
        width: "var(--pw)",
        height: `calc(var(--hh) + (var(--hh) * 0.75 + var(--hg)) * ${rowCount - 1})`,
      }}
    >
      {grid.map((row, r) => (
        <div
          key={r}
          className="flex"
          style={{
            gap: "var(--hg)",
            marginTop: r === 0 ? 0 : "calc(var(--hh) * -0.25 + var(--hg))",
            transform: `translateX(calc(${
              r % 2 === 1 ? 1 : -1
            } * (var(--hw) + var(--hg)) / 4))`,
          }}
        >
          {row.map((c, i) =>
            c ? (
              <PartnerHex
                key={`${c.name}-${i}`}
                client={c}
                phase={phase}
                order={r * 0.8 + i * 0.5}
              />
            ) : (
              <HexSpacer key={`s-${i}`} />
            ),
          )}
        </div>
      ))}
    </div>
  );
}

/* The big dark hexagon in the middle */
function CentralHexagon() {
  return (
    <StaggerItem>
      <div
        className="relative shrink-0 drop-shadow-[0_28px_44px_rgba(0,51,78,0.35)] transition-transform duration-500 hover:scale-[1.03]"
        style={{
          width: "calc(var(--hw) * 2.3)",
          height: "calc(var(--hw) * 2.3 * 1.1547)",
        }}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br from-white/50 via-white/10 to-[#9bcfff]/60 ${HEX_CLIP}`}
        >
          <div
            className={`absolute inset-[1.5px] overflow-hidden bg-gradient-to-b from-[#0b1b2b] via-navy to-[#041423] ${HEX_CLIP}`}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(1,110,220,0.55)_0%,rgba(1,110,220,0.15)_40%,transparent_70%)]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(155,207,255,0.16)_0%,transparent_55%)]"
            />

            <div className="relative z-10 flex h-full w-full flex-col items-center justify-center text-center">
              <Image
                src="/images/logo.png"
                alt="EnviroShield"
                width={120}
                height={120}
                priority
                className="h-auto w-[34%] drop-shadow-[0_6px_16px_rgba(155,207,255,0.45)]"
              />
              <span className="mt-[5%] text-[clamp(11px,1.5vw,19px)] font-black tracking-tight text-white">
                EnviroShield
              </span>
              <span className="text-[clamp(7px,0.8vw,11px)] font-bold uppercase tracking-[0.2em] text-paste">
                Pvt. Ltd.
              </span>
            </div>
          </div>
        </div>
      </div>
    </StaggerItem>
  );
}

/* Arrows + dots (only rendered when there is more than one slide) */
function SlideControls({
  count,
  index,
  onPrev,
  onNext,
  onGo,
}: {
  count: number;
  index: number;
  onPrev: () => void;
  onNext: () => void;
  onGo: (i: number) => void;
}) {
  if (count <= 1) return null;

  const arrowBtn =
    "flex h-10 w-10 items-center justify-center rounded-full bg-white text-navy shadow-[0_6px_16px_rgba(0,51,78,0.12)] transition-all duration-300 hover:scale-105 hover:bg-navy hover:text-white";

  return (
    <div className="mt-8 flex items-center justify-center gap-5">
      <button type="button" aria-label="Previous clients" onClick={onPrev} className={arrowBtn}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div className="flex items-center gap-2" role="tablist" aria-label="Client slides">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => onGo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? "w-7 bg-[#016edc]" : "w-2 bg-navy/20 hover:bg-navy/40"
            }`}
          />
        ))}
      </div>

      <button type="button" aria-label="Next clients" onClick={onNext} className={arrowBtn}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}

export default function ClientsSection() {
  /* ── calculate slides from the flat list ── */
  const slides = useMemo(() => chunk(CLIENTS, PER_SLIDE), []);
  const count = slides.length;

  /* ── slider state ──
     index : slide currently shown
     phase : hidden (before scroll-in) → in (hexagons pop in) → out (hexagons leave) */
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("hidden");
  const [paused, setPaused] = useState(false);

  const indexRef = useRef(0);
  const busyRef = useRef(false);
  const timers = useRef<number[]>([]);
  const touchX = useRef<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const left = slides[index].slice(0, PER_SIDE);
  const right = slides[index].slice(PER_SIDE);

  /* Play the entrance once, when the grid scrolls into view */
  useEffect(() => {
    const el = gridRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setPhase("in");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase((p) => (p === "hidden" ? "in" : p));
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Change slide: hexagons leave → swap → hexagons pop in */
  const goTo = useCallback((target: number) => {
    if (busyRef.current || target === indexRef.current) return;
    busyRef.current = true;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPhase("out");

    const t1 = window.setTimeout(
      () => {
        indexRef.current = target;
        setIndex(target);
        setPhase("in");

        const t2 = window.setTimeout(() => {
          busyRef.current = false;
        }, 1100);
        timers.current.push(t2);
      },
      reduced ? 0 : OUT_MS,
    );
    timers.current.push(t1);
  }, []);

  const next = useCallback(() => goTo((indexRef.current + 1) % count), [goTo, count]);
  const prev = useCallback(
    () => goTo((indexRef.current - 1 + count) % count),
    [goTo, count],
  );

  /* Autoplay */
  useEffect(() => {
    if (count <= 1 || !AUTOPLAY_MS || paused) return;
    const id = window.setInterval(next, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [count, paused, next]);

  /* Clear pending timers on unmount */
  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);

  const swipeHandlers = {
    onTouchStart: (e: React.TouchEvent) => {
      touchX.current = e.touches[0].clientX;
    },
    onTouchEnd: (e: React.TouchEvent) => {
      if (touchX.current === null) return;
      const dx = e.changedTouches[0].clientX - touchX.current;
      touchX.current = null;
      if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
    },
  };

  return (
    <section
      aria-labelledby="clients-heading"
      className="relative overflow-hidden bg-mist py-[112px] max-[900px]:py-20 max-[600px]:py-14"
    >
      {/* Hexagon enter / leave animations */}
      <style>{`
        @keyframes hex-in {
          0%   { opacity: 0; transform: translateY(26px) scale(.45) rotate(-14deg); }
          60%  { opacity: 1; }
          100% { opacity: 1; transform: none; }
        }
        @keyframes hex-out {
          0%   { opacity: 1; transform: none; }
          100% { opacity: 0; transform: translateY(-14px) scale(.55) rotate(12deg); }
        }
        .hex-hidden { opacity: 0; }
        .hex-in  { animation: hex-in .75s cubic-bezier(.34,1.56,.64,1) var(--di, 0s) backwards; }
        .hex-out { animation: hex-out .34s cubic-bezier(.5,0,.75,0) var(--do, 0s) forwards; }
        @media (prefers-reduced-motion: reduce) {
          .hex-in, .hex-out { animation: none; }
          .hex-out { opacity: 0; }
        }
      `}</style>

      {/* Full-bleed background: dotted grid + soft colour blobs */}
      <DottedBackground />

      <Container>
        <div className="relative">
          <SectionHeader
            align="center"
            eyebrow="OUR CLIENTS"
            title="Trusted by industry leaders"
            text="Delivering world-class waterproofing, industrial coatings, and protective systems to the most demanding commercial and industrial projects across Bangladesh and Australia."
            headingId="clients-heading"
          />

          <div
            ref={gridRef}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            {...swipeHandlers}
          >
            {/* ── Desktop / tablet: cluster · fixed centre · cluster ── */}
            <div
              className="mt-12 hidden md:block lg:mt-14 lg:-mx-8 xl:-mx-20 md:[--hw:68px] lg:[--hw:98px] xl:[--hw:118px]"
              style={GEOMETRY_VARS}
            >
              <StaggerContainer className="flex items-center justify-center gap-[calc(var(--hw)*0.4)]">
                <ClusterPage key={`l-${index}`} items={left} side="left" phase={phase} />
                <CentralHexagon />
                <ClusterPage key={`r-${index}`} items={right} side="right" phase={phase} />
              </StaggerContainer>
            </div>

            {/* ── Mobile: centre on top, then the honeycomb ── */}
            <div
              className="mt-10 flex flex-col items-center gap-8 md:hidden [--hw:92px] max-[400px]:[--hw:80px]"
              style={GEOMETRY_VARS}
            >
              <StaggerContainer className="flex flex-col items-center gap-8">
                <CentralHexagon />
                <MobilePage key={`m-${index}`} items={slides[index]} phase={phase} />
              </StaggerContainer>
            </div>

            <SlideControls
              count={count}
              index={index}
              onPrev={prev}
              onNext={next}
              onGo={goTo}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}