import { Layers, ShieldCheck, Sun, CheckCircle, Sparkles, Droplets } from "lucide-react";
import Image from "next/image";

export type LayerStep = {
  step: number;
  product: string;
  name: string;
  thickness: string;
  category: string;
  description: string;
  benefit: string;
  colorClass: string;
};

const layers: LayerStep[] = [
  {
    step: 1,
    product: "LatexShield",
    name: "1st Layer: LatexShield Bonding Primer",
    thickness: "200 µm",
    category: "Substrate Penetration & Bonding",
    description: "Applied after mechanical grinding and cleaning of the rooftop slab. Seals capillary pores, prevents shrinkage, and ensures monolithic adhesion.",
    benefit: "Waterproofing primer, reduced shrinkage, improved adhesion, and enhanced substrate durability.",
    colorClass: "border-slate-300 bg-slate-50/80 text-slate-900",
  },
  {
    step: 2,
    product: "BondShield",
    name: "2nd Layer: BondShield Heavy Levelling",
    thickness: "1.5 mm",
    category: "Surface Levelling & Void Filling",
    description: "Deep structural filler and levelling layer that eliminates surface undulations, smoothing out rough concrete depressions.",
    benefit: "Levelling the surface, smoothing undulations, and providing a solid monolithic foundation.",
    colorClass: "border-blue-200 bg-blue-50/60 text-blue",
  },
  {
    step: 3,
    product: "BondShield",
    name: "3rd Layer: BondShield Precision Smoothing",
    thickness: "1.0 mm",
    category: "Secondary Levelling & Substrate Consolidation",
    description: "Fine levelling coat that locks in structural smoothness, ensuring a perfectly planar surface for elastomeric membranes.",
    benefit: "Monolithic planar finish, void elimination, and seamless base consolidation.",
    colorClass: "border-sky-200 bg-sky-50/60 text-sky-950",
  },
  {
    step: 4,
    product: "GumShield",
    name: "4th Layer: GumShield Elastic Membrane",
    thickness: "200 µm",
    category: "Primary Elastomeric Waterproofing",
    description: "High-elasticity waterproof gum polymer with 200% elongation that stretches and flexes with concrete thermal expansion without tearing.",
    benefit: "200% Elongation, highly elastic waterproof material, and super flexible membrane barrier.",
    colorClass: "border-cyan-200 bg-cyan-50/60 text-cyan-950",
  },
  {
    step: 5,
    product: "GumShield",
    name: "5th Layer: GumShield Reinforcement Coat",
    thickness: "200 µm",
    category: "Secondary Elastic Barrier",
    description: "Second elastomeric membrane coat doubling structural elasticity and sealing any remaining microscopic vulnerabilities.",
    benefit: "Doubled membrane resilience, superior fatigue resistance, and extended roof lifespan.",
    colorClass: "border-teal-200 bg-teal-50/60 text-teal-950",
  },
  {
    step: 6,
    product: "PU AquaShield Color",
    name: "6th Layer: PU AquaShield Protective Coating",
    thickness: "150 µm",
    category: "Polyurethane Thermal & Waterproof Barrier",
    description: "High-performance aliphatic polyurethane coat offering crack bridging up to 1.5mm, UV resistance, and solar heat reflection.",
    benefit: "Crack bridging up to 1.5mm, heat reflective, UV protective, 100% waterproof, and low VOCs.",
    colorClass: "border-indigo-200 bg-indigo-50/60 text-indigo-950",
  },
  {
    step: 7,
    product: "PU AquaShield Color",
    name: "7th Layer: PU AquaShield Color Topcoat",
    thickness: "150 µm",
    category: "Final Weather & Anti-Microbial Shield",
    description: "Architectural color topcoat engineered for superior anti-fading, year-after-year sheen, corrosion defense, and anti-algae/fungi resistance.",
    benefit: "Superior anti-fading, dust-repellent sheen, anti-algae & fungi, prevents corrosion, and withstands foot traffic.",
    colorClass: "border-emerald-200 bg-emerald-50/60 text-emerald-950",
  },
];

export default function MultilayerWaterproofingDiagram() {
  return (
    <div className="my-10 rounded-3xl border border-line bg-white p-6 shadow-sm sm:p-8">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Enviro Supreme Waterproofing Method
          </span>
          <h3 className="mt-2 text-xl font-extrabold text-navy sm:text-2xl">
            7-Layer Engineered Waterproofing Architecture
          </h3>
        </div>
        <div className="flex flex-col items-start gap-1 rounded-2xl bg-mist px-4 py-2.5 sm:items-end">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Total Build Thickness</span>
          <span className="text-lg font-extrabold text-navy">3.0 mm – 4.0 mm</span>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-600">
        Unlike single-coat paint treatments that peel after a single monsoon season, Enviro Shield applies the proprietary <strong>Enviro Supreme Seven Layers Waterproofing Method</strong>. Formulated with imported high-grade raw materials and in-house chemical manufacturing, this multi-tier system delivers permanent monolithic protection against heavy rainfall, extreme humidity, and thermal roof expansion.
      </p>

      {/* Diagram Graphic Preview */}
      <div className="my-6 overflow-hidden rounded-2xl border border-line bg-slate-50 p-3 sm:p-4">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-white shadow-inner">
          <Image
            src="/images/enviro-supreme-7-layers-waterproofing-method.png"
            alt="Enviro Supreme Seven Layers Waterproofing Method architectural diagram showing LatexShield, BondShield, GumShield, and PU AquaShield Color"
            fill
            className="object-contain"
            sizes="(max-width: 900px) 100vw, 850px"
          />
        </div>
        <p className="mt-2.5 text-center text-xs text-muted">
          Substrate Preparation: Applied monolithically after mechanical surface grinding & cleaning of the concrete rooftop slab.
        </p>
      </div>

      {/* Layer Step Cards */}
      <div className="mt-8 space-y-3.5">
        {layers.map((layer) => (
          <div
            key={layer.step}
            className={`group relative flex flex-col justify-between gap-4 rounded-2xl border p-4.5 transition-all hover:shadow-md sm:flex-row sm:items-center ${layer.colorClass}`}
          >
            <div className="flex items-start gap-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white font-extrabold text-navy shadow-xs ring-1 ring-black/5">
                {layer.step}
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-bold text-navy sm:text-base">
                    {layer.name}
                  </h4>
                  <span className="rounded-md bg-white/80 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                    {layer.category}
                  </span>
                  <span className="rounded-md bg-navy px-2 py-0.5 text-[11px] font-bold text-white">
                    Thickness: {layer.thickness}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                  {layer.description}
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                  <CheckCircle className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
                  <span>{layer.benefit}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System Highlights Footer */}
      <div className="mt-8 grid grid-cols-2 gap-3 border-t border-line pt-6 max-[600px]:grid-cols-1">
        <div className="flex items-center gap-3 rounded-xl bg-mist/60 p-3.5">
          <Droplets className="h-5 w-5 shrink-0 text-blue" />
          <span className="text-xs font-semibold text-navy">100% Waterproof & Heat Reflective Elastomeric System</span>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-mist/60 p-3.5">
          <ShieldCheck className="h-5 w-5 shrink-0 text-blue" />
          <span className="text-xs font-semibold text-navy">Crack Bridging up to 1.5mm with 200% Elongation</span>
        </div>
      </div>
    </div>
  );
}
