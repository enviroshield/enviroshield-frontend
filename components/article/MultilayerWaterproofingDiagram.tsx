import { Layers, ShieldCheck, Sun, CheckCircle } from "lucide-react";

export type LayerStep = {
  step: number;
  name: string;
  category: string;
  description: string;
  benefit: string;
  colorClass: string;
};

const layers: LayerStep[] = [
  {
    step: 1,
    name: "Surface Preparation & Crack Repair",
    category: "Substrate Conditioning",
    description: "Thorough cleaning, debris removal, mechanical grinding, and repairing micro-cracks using specialized polymer-modified mortars or injection grouting.",
    benefit: "Ensures monolithic adhesion and eliminates hollow weak spots.",
    colorClass: "border-slate-300 bg-slate-50 text-slate-800",
  },
  {
    step: 2,
    name: "Waterproof Primer Application",
    category: "Pore Sealing",
    description: "Deep-penetrating acrylic or epoxy primer applied across the cured concrete slab to seal porous capillary networks.",
    benefit: "Stabilizes the substrate and locks chemical adhesion.",
    colorClass: "border-blue-200 bg-blue-50/60 text-blue",
  },
  {
    step: 3,
    name: "Flexible Waterproof Membrane",
    category: "Primary Barrier",
    description: "High-grade elastomeric liquid polymer applied seamlessly with zero joints, creating an impermeable barrier against standing water.",
    benefit: "Superior elongation that flexes with building thermal movement.",
    colorClass: "border-indigo-200 bg-indigo-50/60 text-indigo-900",
  },
  {
    step: 4,
    name: "Reinforcement Layer",
    category: "Structural Reinforcement",
    description: "Embedment of high-tensile fiberglass or polyester mesh embedded directly into the wet elastomeric membrane across corners, joints, and critical junctions.",
    benefit: "Prevents puncture damage and bridges structural stress cracks.",
    colorClass: "border-cyan-200 bg-cyan-50/60 text-cyan-900",
  },
  {
    step: 5,
    name: "Protective Waterproof Coating",
    category: "Secondary Sealing",
    description: "Intermediate heavy-duty protective coating that encapsulates the reinforcement fabric and doubles the membrane thickness.",
    benefit: "Guarantees continuous dry film thickness (DFT) without pinholes.",
    colorClass: "border-teal-200 bg-teal-50/60 text-teal-900",
  },
  {
    step: 6,
    name: "UV-Resistant Layer",
    category: "Atmospheric Shield",
    description: "Specialized aliphatic polyurethane coating engineered specifically for the intense sun exposure and monsoon humidity of Bangladesh.",
    benefit: "Resists UV degradation, solar heat buildup, and chalking.",
    colorClass: "border-amber-200 bg-amber-50/60 text-amber-900",
  },
  {
    step: 7,
    name: "Glossy Protective Finishing",
    category: "Final Topcoat",
    description: "Non-stick, washable, abrasion-resistant glossy finish that repels algae, moss, and chemical dust accumulation while allowing light foot traffic.",
    benefit: "Delivers an aesthetic finish and easy rainwater runoff.",
    colorClass: "border-emerald-200 bg-emerald-50/60 text-emerald-900",
  },
];

export default function MultilayerWaterproofingDiagram() {
  return (
    <div className="my-10 rounded-3xl border border-line bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue">
            Engineered Waterproofing System
          </span>
          <h3 className="text-xl font-extrabold text-navy sm:text-2xl">
            Enviro Shield&apos;s 7-Layer Roof Waterproofing Architecture
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <Layers className="h-4 w-4 text-blue" aria-hidden="true" />
          <span>Multilayer Monolithic Protection</span>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-600">
        Unlike single-coat paint treatments that peel after a single monsoon season, Enviro Shield applies an engineered multi-stage barrier formulated specifically for Bangladesh&apos;s intense rainfall, humidity fluctuations, and concrete thermal expansion.
      </p>

      {/* Layer Step Cards */}
      <div className="mt-8 space-y-3.5">
        {layers.map((layer) => (
          <div
            key={layer.step}
            className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-4.5 transition-all hover:shadow-md ${layer.colorClass}`}
          >
            <div className="flex items-start gap-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white font-extrabold text-navy shadow-xs ring-1 ring-black/5 text-sm">
                0{layer.step}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-navy">
                    {layer.name}
                  </h4>
                  <span className="hidden rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 sm:inline-block">
                    {layer.category}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600 sm:max-w-xl leading-relaxed">
                  {layer.description}
                </p>
              </div>
            </div>

            <div className="shrink-0 sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-black/5">
              <span className="text-[11px] font-semibold text-slate-500 block">Engineering Benefit:</span>
              <span className="text-xs font-bold text-navy flex items-center gap-1 sm:justify-end mt-0.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                {layer.benefit}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-mist/60 px-5 py-4 text-xs text-slate-600">
        <span className="flex items-center gap-2 font-medium">
          <ShieldCheck className="h-4 w-4 text-blue" aria-hidden="true" />
          Seamless barrier: Zero overlapping seams prevents hydrostatic water penetration.
        </span>
        <span className="flex items-center gap-2 font-medium">
          <Sun className="h-4 w-4 text-amber-500" aria-hidden="true" />
          UV & Heat Resistance: Protects roof slab from tropical sun baking.
        </span>
      </div>
    </div>
  );
}
