import { AnimatedCounter } from "@/components/animations/animated-counter";
import {
  Reveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/reveal";
import Container from "@/components/Container";
import ContactSection from "@/components/home/ContactSection";
import PageHero from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { images } from "@/lib/data/content";
import {
  Award,
  Building2,
  Check,
  CheckCircle2,
  Compass,
  Droplets,
  Eye,
  Globe,
  GraduationCap,
  HandHeart,
  Layers,
  Leaf,
  Paintbrush,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  Users,
} from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title:
    "About Enviro Shield | Australian Waterproofing & Flooring Experts in Bangladesh",
  description:
    "Learn about Enviro Shield Pvt. Ltd. Founded in Australia in 2009 and operating in Bangladesh since 2017, we deliver advanced 7-layer waterproofing, epoxy/PU flooring, in-house chemical manufacturing, and protective coating solutions with 3M+ SFT completed.",
  keywords: [
    "about Enviro Shield",
    "Enviro Shield Bangladesh",
    "waterproofing company Bangladesh",
    "Engr Tony Stephen",
    "Engr Mohammad Mahbubur Rahman",
    "Australian waterproofing brand",
    "7 layer waterproofing",
    "epoxy flooring Bangladesh",
    "PU flooring",
    "in-house construction chemical manufacturing",
    "protective construction solutions",
  ],
  alternates: {
    canonical: `${siteUrl}/about`,
  },
};

/* -------------------------------------------------------------------------- */
/* DATA                                                                       */
/* -------------------------------------------------------------------------- */

const missionVision = [
  {
    eyebrow: "OUR MISSION",
    title: "Mission",
    text: "To provide high quality, cost effective, and durable solution through top-grade material application, and consistent execution ensuring customer satisfaction at every step.",
    icon: Target,
    accent: "blue",
    highlights: [
      "Cost-effective & durable formulations",
      "Top-grade material application",
      "Customer satisfaction at every single step",
    ],
  },
  {
    eyebrow: "OUR VISION",
    title: "Vision",
    text: "To be the leading and most trusted waterproofing & protective solutions company in Bangladesh, covering brands in quality, innovation, and long-term performance.",
    icon: Eye,
    accent: "navy",
    highlights: [
      "Leading & most trusted waterproofing partner",
      "Uncompromising quality & technical innovation",
      "Guaranteed long-term structural performance",
    ],
  },
];

const leaders = [
  {
    name: "Engr. Tony Stephen",
    role: "Founder, EnviroShield Pvt. Ltd. Australia",
    badge: "FOUNDER & CHIEF ADVISER",
    image: "/images/leadership/engr-tony-stephen.png",
    alt: "Engr. Tony Stephen, Founder of EnviroShield Pvt. Ltd. Australia",
    credentials: [
      "BSc Engineer, Swinburne University of Technology, Australia",
      "Certificate III in Construction Waterproofing, Australia",
    ],
    bio: "Engr. Tony Stephen founded EnviroShield in Australia in 2009. With extensive background in Australian engineering construction standards and advanced polymer waterproofing chemistry, he acts as Chief Technical Adviser guiding international quality formulations, material sourcing, and structural diagnostics.",
  },
  {
    name: "Engr. Mohammad Mahbubur Rahman",
    role: "Managing Director, EnviroShield Pvt. Ltd. (Bangladesh)",
    badge: "MANAGING DIRECTOR",
    image: "/images/leadership/engr-mohammad-mahbubur-rahman.jpg",
    alt: "Engr. Mohammad Mahbubur Rahman, Managing Director of EnviroShield Bangladesh",
    credentials: [
      "MSc Engineer (IUT)",
      "Certificate III in Construction Waterproofing, Australia",
    ],
    bio: "Engr. Mohammad Mahbubur Rahman oversees EnviroShield's Bangladesh expansion and operations since 2017. Certified in construction waterproofing in Australia and holding a post-graduate master's degree in engineering from IUT, he directs an expert engineering corps and over 130 applicators nationwide.",
  },
];

const stats = [
  { value: 3, suffix: "M+", label: "Million SFT Completed" },
  { value: 130, suffix: "+", label: "Skilled Applicators" },
  { value: 20, suffix: "+", label: "Certified Engineers" },
  { value: 17, suffix: "+", label: "Years Experience (Since 2009)" },
];

const reasons = [
  {
    icon: Globe,
    title: "Imported High-Grade Raw Materials",
    text: "Directly imported from the UK, Germany, Australia, and China, ensuring chemical durability that stands up to Bangladesh's climate.",
  },
  {
    icon: Layers,
    title: "Proven 7-Layer Waterproofing System",
    text: "Our proprietary Enviro Supreme seven-layer method provides a seamless, monolithic 3mm–4mm elastomeric barrier.",
  },
  {
    icon: Award,
    title: "17+ Years of Industry Experience",
    text: "Established in Australia in 2009 and operating in Bangladesh since 2017 with decades of combined engineering expertise.",
  },
  {
    icon: ShieldCheck,
    title: "Strong After-Sales Support",
    text: "Full technical site inspections, comprehensive warranty compliance, and dedicated client follow-up across all projects.",
  },
  {
    icon: Building2,
    title: "Trusted Across All Sectors",
    text: "Successfully completed over 3+ Million SFT for residential homes, commercial towers, and heavy industrial complexes.",
  },
  {
    icon: Users,
    title: "Certified Engineers & Skilled Applicators",
    text: "Over 20 qualified engineers and 130 trained applicators equipped with modern sprayers, grinders, and testing equipment.",
  },
];

const servicesSummary = [
  { title: "Waterproofing", desc: "Roofs, terraces, basements, water reservoirs & structural foundations." },
  { title: "Epoxy Flooring", desc: "Seamless, hygienic, heavy-duty industrial and commercial floors." },
  { title: "PU Flooring", desc: "Thermal-shock and chemical-resistant polyurethane systems." },
  { title: "Floor Hardener", desc: "Non-metallic and metallic monolithic concrete hardening." },
  { title: "Sports Flooring", desc: "Cushioned athletic acrylic and polyurethane sporting surfaces." },
  { title: "Super Flat Flooring", desc: "Laser-guided ultra-flat floors for modern logistic warehouses." },
  { title: "Fair Face Plaster", desc: "Architectural fair-faced concrete repair and weather protection." },
  { title: "Conductive ESD Flooring", desc: "Anti-static electrostatic discharge control for high-tech plants." },
];

const process = [
  {
    number: "01",
    title: "Understand",
    text: "We inspect the site, diagnose structural vulnerabilities, and analyze moisture ingress patterns before prescribing a solution.",
  },
  {
    number: "02",
    title: "Assess",
    text: "Our engineers evaluate concrete slab conditions, tensile requirements, and environmental exposure to design the optimal system.",
  },
  {
    number: "03",
    title: "Apply",
    text: "We execute with mechanical surface grinding, imported primers, multi-layer membranes, and high-performance topcoats.",
  },
  {
    number: "04",
    title: "Protect",
    text: "The finished installation undergoes rigorous quality checks to deliver monolithic, durable, and guaranteed long-term protection.",
  },
];

const sectors = [
  {
    title: "Residential",
    text: "Protecting rooftops, basements, terraces, bathrooms, and exterior walls against dampness and monsoon leaks.",
  },
  {
    title: "Commercial",
    text: "Durable flooring and waterproof membranes for corporate towers, retail centers, hotels, and hospitals.",
  },
  {
    title: "Industrial",
    text: "Heavy-duty epoxy/PU floors, chemical containment, ESD floors, and roof insulation for factories and pharmaceuticals.",
  },
  {
    title: "Institutional",
    text: "Long-lasting protection for universities, public infrastructure, convention centers, and government complexes.",
  },
];

const commitments = [
  "Australian engineering standards since 2009",
  "Operating in Bangladesh since 2017",
  "In-house construction chemical manufacturing",
  "Imported raw materials from UK, Germany, Australia & China",
  "Proven Enviro Supreme 7-layer waterproofing system",
  "Dedicated team of 20+ engineers & 130 applicators",
  "Comprehensive warranty and after-sales support",
  "Over 3+ Million sq. ft. completed nationwide",
];

const values = [
  {
    icon: Compass,
    title: "Technical Expertise",
    text: "Our Australian-certified leadership and experienced civil engineers ensure exact technical execution on every substrate.",
  },
  {
    icon: Leaf,
    title: "Quality Materials",
    text: "We import raw materials from UK, Germany, Australia, and China, complemented by local in-house chemical manufacturing.",
  },
  {
    icon: HandHeart,
    title: "Customer Focus",
    text: "We work directly with building owners, project managers, and architects to solve difficult waterproofing and flooring challenges.",
  },
  {
    icon: Sparkles,
    title: "Quality Workmanship",
    text: "From diamond-wheel concrete grinding to multi-layer spray application, our 130+ applicators maintain high precision.",
  },
  {
    icon: Users,
    title: "Reliable Partnership",
    text: "We build long-term relationships through transparent project estimates, honest engineering counsel, and standing behind our warranties.",
  },
  {
    icon: Check,
    title: "Built to Last",
    text: "Our solutions are engineered to withstand Bangladesh's extreme monsoon seasons and harsh UV conditions for years to come.",
  },
];

const imgClass =
  "object-cover transition-transform duration-[0.6s] group-hover:scale-[1.04]";

function PhotoFx() {
  return (
    <>
      <span
        className="pointer-events-none absolute inset-0 bg-navy/25 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute inset-3 scale-110 rounded-[12px] border border-white/80 opacity-0 transition-all duration-500 ease-out group-hover:scale-100 group-hover:opacity-100"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-[500%]"
        aria-hidden="true"
      />
    </>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="ABOUT ENVIRO SHIELD"
        title="Protecting structures. Extending life."
        text="Founded in Australia in 2009 and operating in Bangladesh since 2017, Enviro Shield Pvt. Ltd. delivers advanced waterproofing systems, epoxy/PU flooring, and in-house construction chemical manufacturing."
        image="/images/service-hero.jpg"
      />

      {/* ------------------------------------------------------------------ */}
      {/* OUR STORY                                                          */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="our-story-heading"
        className="py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container className="grid grid-cols-2 items-center gap-[80px] max-[900px]:grid-cols-1 max-[900px]:gap-[50px]">
          <Reveal dir="image">
            <div className="grid grid-cols-[1.2fr_0.8fr] gap-4">
              <div className="group relative h-[520px] overflow-hidden rounded-[16px] max-[600px]:h-[340px]">
                <Image
                  src="/images/home/rooftop-waterproofing-application.jpg"
                  alt="Enviro Shield specialist applying protective waterproof coating"
                  fill
                  sizes="(max-width: 900px) 60vw, 28vw"
                  className={imgClass}
                />
                <PhotoFx />
              </div>

              <div className="flex flex-col gap-4">
                <div className="group relative flex-1 overflow-hidden rounded-[16px]">
                  <Image
                    src="/images/home/completed-waterproof-rooftop-coating.jpg"
                    alt="Completed waterproof rooftop coating"
                    fill
                    sizes="(max-width: 900px) 40vw, 18vw"
                    className={imgClass}
                  />
                  <PhotoFx />
                </div>

                <div className="rounded-[16px] bg-blue p-6 text-white max-[600px]:p-4">
                  <div className="text-[44px] font-extrabold leading-none tracking-[-0.04em] max-[600px]:text-[32px]">
                    17+
                  </div>
                  <div className="mt-2 text-[13px] font-medium text-white/90">
                    Years Industry Experience (Since 2009)
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal dir="up" delay={0.15}>
            <div>
              <div className="mb-[22px] flex items-center gap-[10px] text-[11px] font-extrabold uppercase tracking-[0.15em] text-blue">
                <span className="h-[2px] w-7 bg-current" aria-hidden="true" />
                WHO WE ARE
              </div>

              <h2
                id="our-story-heading"
                className="mb-6 text-[clamp(34px,4vw,52px)] font-extrabold leading-[1.08] tracking-[-0.04em] text-navy"
              >
                Built on Australian expertise.
                <br />
                Proven in Bangladesh.
              </h2>

              <p className="mb-4 text-[16px] leading-[1.75] text-navy/90 font-medium">
                Founded in Australia in 2009, EnviroShield Pvt. Ltd. is a trusted company in waterproofing, flooring, and protective coating solutions.
              </p>

              <p className="mb-4 text-[15px] leading-[1.75] text-ink">
                Since 2017, EnviroShield has been operating in Bangladesh with advanced Waterproofing systems, Epoxy flooring, PU flooring, and in-house construction chemical manufacturing.
              </p>

              <p className="mb-6 text-[15px] leading-[1.75] text-ink">
                The company provides durable, high-performance solutions for residential, commercial, and industrial projects. With raw materials imported from the UK, Germany, Australia, and China, we formulate systems specifically engineered to endure extreme monsoons, UV exposure, and thermal slab movement.
              </p>

              <ul className="divide-y divide-line border-y border-line">
                {[
                  "Australian Brand Founded in 2009",
                  "Operating in Bangladesh Since 2017",
                  "In-House Construction Chemical Manufacturing",
                  "Imported Raw Materials (UK, Germany, Australia, China)",
                  "Over 3+ Million SFT Completed Nationwide",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 py-3 text-[14px] font-medium text-navy sm:text-[15px]"
                  >
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-blue text-white">
                      <Check size={13} aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* MISSION & VISION                                                   */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="mission-vision-heading"
        className="bg-mist/70 py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container>
          <SectionHeader
            eyebrow="PURPOSE & DIRECTION"
            title="Guiding purpose. Enduring vision."
            text="The foundational standards and ambitions that drive every formulation, chemical process, and protective installation we deliver across Bangladesh."
            headingId="mission-vision-heading"
          />

          <div className="mt-14 grid grid-cols-2 gap-8 max-[900px]:grid-cols-1">
            {missionVision.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.eyebrow}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-[22px] border border-line/90 bg-white p-8 sm:p-10 shadow-[0_4px_24px_rgba(0,51,78,0.06)] transition-all duration-500 hover:-translate-y-1.5 hover:border-blue/40 hover:shadow-[0_20px_45px_rgba(0,51,78,0.12)]"
                >
                  {/* Subtle top color accent strip */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1.5 ${
                      item.accent === "blue" ? "bg-blue" : "bg-navy"
                    }`}
                  />

                  {/* Faint watermark icon in background */}
                  <Icon
                    size={220}
                    className="pointer-events-none absolute -bottom-10 -right-10 text-navy/[0.03] transition-transform duration-700 group-hover:scale-110 group-hover:text-blue/[0.06]"
                    aria-hidden="true"
                  />

                  <div>
                    {/* Header badge & icon */}
                    <div className="mb-6 flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 rounded-full bg-blue/10 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-blue">
                        <span className="size-1.5 rounded-full bg-blue" />
                        {item.eyebrow}
                      </span>

                      <span className="grid size-13 place-items-center rounded-2xl bg-mist text-navy transition-all duration-300 group-hover:bg-blue group-hover:text-white shadow-xs">
                        <Icon size={24} strokeWidth={2} />
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mb-4 text-[26px] font-extrabold tracking-[-0.03em] text-navy sm:text-[30px]">
                      {item.title}
                    </h3>

                    {/* Statement */}
                    <p className="text-[15px] sm:text-[16px] leading-[1.8] text-ink">
                      {item.text}
                    </p>
                  </div>

                  {/* Highlights checklist */}
                  <div className="mt-8 border-t border-line/70 pt-6">
                    <ul className="space-y-2.5">
                      {item.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-center gap-2.5 text-xs sm:text-[13px] font-semibold text-navy/90"
                        >
                          <span className="grid size-4.5 flex-none place-items-center rounded-full bg-blue/10 text-blue group-hover:bg-blue group-hover:text-white transition-colors duration-300">
                            <Check size={11} strokeWidth={3} />
                          </span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* LEADERSHIP                                                         */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="leadership-heading"
        className="py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container>
          <SectionHeader
            eyebrow="OUR LEADERSHIP"
            title="Guiding vision. Australian certified engineering."
            text="EnviroShield is led by Australian-educated and certified engineers with decades of hands-on expertise in polymer waterproofing chemistry and structural diagnostics."
            headingId="leadership-heading"
          />

          <div className="mt-14 grid grid-cols-2 gap-8 max-[900px]:grid-cols-1">
            {leaders.map((leader) => (
              <div
                key={leader.name}
                className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue/30 hover:shadow-xl"
              >
                {/* Header with image & credentials */}
                <div className="grid grid-cols-[160px_1fr] gap-6 border-b border-line bg-mist/50 p-6 max-[600px]:grid-cols-1 max-[600px]:text-center">
                  <div className="relative mx-auto aspect-square w-full max-w-[160px] overflow-hidden rounded-xl border border-line bg-white shadow-inner max-[600px]:max-w-[180px]">
                    <Image
                      src={leader.image}
                      alt={leader.alt}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 600px) 180px, 160px"
                    />
                  </div>

                  <div className="flex flex-col justify-center">
                    <span className="mb-1 text-[11px] font-black uppercase tracking-wider text-blue">
                      {leader.badge}
                    </span>
                    <h3 className="text-xl font-extrabold text-navy sm:text-2xl">
                      {leader.name}
                    </h3>
                    <p className="mt-1 text-xs font-semibold text-ink">
                      {leader.role}
                    </p>

                    <div className="mt-3.5 space-y-1.5 text-left max-[600px]:text-center">
                      {leader.credentials.map((cred) => (
                        <div
                          key={cred}
                          className="flex items-start gap-2 text-xs font-medium text-slate-700 max-[600px]:justify-center"
                        >
                          <GraduationCap
                            size={14}
                            className="mt-0.5 shrink-0 text-blue"
                            aria-hidden="true"
                          />
                          <span>{cred}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bio text */}
                <div className="flex-1 p-6 sm:p-7">
                  <p className="text-sm leading-relaxed text-ink sm:text-[15px]">
                    {leader.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* STATS                                                              */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-label="Enviro Shield at a glance"
        className="bg-blue text-white"
      >
        <Container>
          <div className="grid grid-cols-4 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="border-l border-white/20 px-8 py-14 first:border-l-0 max-[900px]:border-b max-[900px]:[&:nth-child(odd)]:border-l-0 max-[600px]:border-l-0 max-[600px]:px-0 max-[600px]:py-8"
              >
                <div className="mb-2 text-[clamp(42px,4.6vw,64px)] font-extrabold leading-none tracking-[-0.05em]">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                  />
                </div>
                <p className="text-[14px] font-medium text-white/85">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* WHY ENVIRO SHIELD                                                  */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="why-enviroshield-heading"
        className="bg-soft py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container>
          <SectionHeader
            eyebrow="WHY CHOOSE ENVIROSHIELD"
            title="Engineered precision. Proven long-term protection."
            text="We combine imported raw materials, local in-house chemical manufacturing, and Australian certified application standards to safeguard buildings across Bangladesh."
            headingId="why-enviroshield-heading"
          />

          <StaggerContainer className="mt-12 grid grid-cols-3 gap-6 max-[1000px]:grid-cols-2 max-[600px]:grid-cols-1">
            {reasons.map((reason) => {
              const Icon = reason.icon;

              return (
                <StaggerItem key={reason.title}>
                  <div className="group h-full rounded-[16px] bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-navy hover:shadow-xl">
                    <span className="mb-6 grid size-12 place-items-center rounded-[12px] bg-blue text-white transition-colors duration-300 group-hover:bg-paste group-hover:text-navy">
                      <Icon size={24} aria-hidden="true" />
                    </span>

                    <h3 className="mb-3 text-[19px] font-bold leading-[1.3] text-navy transition-colors duration-300 group-hover:text-white">
                      {reason.title}
                    </h3>

                    <p className="text-[14px] leading-[1.7] text-ink transition-colors duration-300 group-hover:text-white/75">
                      {reason.text}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </Container>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CORE SERVICES SUMMARY                                              */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="services-summary-heading"
        className="py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container>
          <SectionHeader
            eyebrow="SERVICE SUMMARY"
            title="Complete building envelope & flooring solutions."
            text="From waterproofing membranes and advanced industrial flooring to specialized sports and ESD surfaces, we provide comprehensive engineered protection."
            headingId="services-summary-heading"
          />

          <div className="mt-12 grid grid-cols-4 gap-5 max-[1100px]:grid-cols-2 max-[600px]:grid-cols-1">
            {servicesSummary.map((srv, idx) => (
              <div
                key={srv.title}
                className="group relative rounded-2xl border border-line bg-white p-6 shadow-xs transition-all duration-300 hover:border-blue/40 hover:shadow-md"
              >
                <span className="mb-3 block text-xs font-extrabold uppercase tracking-wider text-blue">
                  0{idx + 1}
                </span>
                <h3 className="mb-2 text-lg font-bold text-navy group-hover:text-blue transition-colors">
                  {srv.title}
                </h3>
                <p className="text-xs text-ink leading-relaxed">
                  {srv.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* HOW WE WORK                                                        */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="how-we-work-heading"
        className="bg-navy py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container>
          <SectionHeader
            eyebrow="HOW WE WORK"
            title="A systematic engineering approach from diagnostics to delivery."
            text="Every project is approached with thorough diagnostics, mechanical surface preparation, and rigorous adherence to chemical dry film thickness standards."
            light
            headingId="how-we-work-heading"
          />

          <StaggerContainer className="mt-14 grid grid-cols-4 gap-8 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
            {process.map((item) => (
              <StaggerItem key={item.number}>
                <div className="h-full border-t-2 border-blue pt-6">
                  <span className="mb-10 block text-[64px] font-extrabold leading-none tracking-[-0.05em] text-white">
                    {item.number}
                  </span>

                  <h3 className="mb-3 text-[22px] font-semibold text-white">
                    {item.title}
                  </h3>

                  <p className="text-[14px] leading-[1.7] text-white/65">
                    {item.text}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* WHO WE SERVE                                                       */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="sectors-heading"
        className="py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container>
          <SectionHeader
            eyebrow="WHO WE SERVE"
            title="Protection solutions across every type of property."
            text="From homes and commercial towers to heavy pharmaceutical and industrial complexes, our solutions adapt to each facility's exacting demands."
            headingId="sectors-heading"
          />

          <StaggerContainer className="mt-12 grid grid-cols-4 gap-5 max-[1000px]:grid-cols-2 max-[600px]:grid-cols-1">
            {sectors.map((sector, index) => (
              <StaggerItem key={sector.title}>
                <div className="group flex h-full min-h-[280px] flex-col justify-between rounded-[16px] bg-soft p-7 transition-colors duration-300 hover:bg-navy shadow-sm">
                  <span className="text-base font-bold tracking-[0.12em] bg-blue text-white transition-colors duration-300 group-hover:text-navy group-hover:bg-paste rounded-full w-11 h-11 grid place-items-center">
                    0{index + 1}
                  </span>

                  <div>
                    <h3 className="mb-2 text-[22px] font-semibold tracking-[-0.02em] text-navy transition-colors duration-300 group-hover:text-white">
                      {sector.title}
                    </h3>

                    <p className="text-[14px] leading-[1.7] text-ink transition-colors duration-300 group-hover:text-white/80">
                      {sector.text}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* OUR COMMITMENT                                                     */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="commitment-heading"
        className="bg-soft py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container className="grid grid-cols-2 items-center gap-[70px] max-[900px]:grid-cols-1 max-[900px]:gap-[50px]">
          <Reveal dir="up">
            <div>
              <div className="mb-[22px] flex items-center gap-[10px] text-[11px] font-extrabold uppercase tracking-[0.15em] text-blue">
                <span className="h-[2px] w-7 bg-current" aria-hidden="true" />
                OUR COMMITMENT
              </div>

              <h2
                id="commitment-heading"
                className="mb-6 text-[clamp(34px,4vw,52px)] font-extrabold leading-[1.05] tracking-[-0.05em] text-navy"
              >
                Quality is in every layer beneath the surface.
              </h2>

              <p className="text-base leading-[1.75] text-ink">
                Dependable waterproofing and industrial flooring come from chemical formulation, meticulous concrete prep, and disciplined multi-layer execution. That is why EnviroShield controls both manufacturing and application.
              </p>
            </div>
          </Reveal>

          <Reveal dir="image" delay={0.15}>
            <ul className="grid grid-cols-2 gap-3 max-[600px]:grid-cols-1">
              {commitments.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-[12px] bg-white p-3 shadow-xs"
                >
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-blue text-white">
                    <Check size={13} aria-hidden="true" />
                  </span>
                  <span className="text-[14px] font-medium leading-[1.45] text-navy">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* OUR VALUES                                                         */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="values-heading"
        className="py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container>
          <SectionHeader
            eyebrow="WHAT WE VALUE"
            title="The principles behind every solution."
            text="The standards that guide how we formulate chemicals, execute projects, and build long-term relationships with clients."
            align="left"
            headingId="values-heading"
          />

          <StaggerContainer className="mt-12 grid grid-cols-3 gap-6 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <StaggerItem key={value.title}>
                  <div className="h-full rounded-[16px] border border-line p-8 transition-all duration-200 hover:border-blue hover:shadow-sm">
                    <span className="mb-6 grid size-12 place-items-center rounded-[12px] bg-blue/10 text-blue">
                      <Icon size={24} aria-hidden="true" />
                    </span>

                    <h3 className="mb-[10px] text-[20px] font-semibold text-navy">
                      {value.title}
                    </h3>

                    <p className="text-[14px] leading-[1.7] text-ink">
                      {value.text}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </Container>
      </section>

      <ContactSection />
    </>
  );
}
