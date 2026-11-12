import { images } from "@/lib/data/content";
import { Check } from "lucide-react";
import Image from "next/image";
import { AnimatedCounter } from "../animations/animated-counter";
import { StaggerContainer, StaggerItem } from "../animations/reveal";
import { Button } from "../Button";
import Container from "../Container";
import { Reveal } from "../Reveal";
import { SectionHeader } from "../SectionHeader";

// Swap these with the exact photos from your design.
const aboutImages = {
  application: {
    src: "/images/home/rooftop-waterproofing-application.jpg",
    alt: "Enviroshield specialist applying protective waterproof coating to building rooftop",
  },
  completedRooftop: {
    src: "/images/home/completed-waterproof-rooftop-coating.jpg",
    alt: "Completed seamless waterproof and heat-insulated residential rooftop terrace",
  },
  terraceBalcony: {
    src: "/images/home/terrace-waterproofing-protective-floor.png",
    alt: "Finished protective waterproof floor coating on residential balcony terrace",
  },
};

const avatars = [
  "https://i.pravatar.cc/80?img=12",
  "https://i.pravatar.cc/80?img=33",
  "https://i.pravatar.cc/80?img=47",
  "https://i.pravatar.cc/80?img=45",
];

const photoClass =
  "group relative h-[340px] overflow-hidden rounded-[18px] max-[600px]:h-[210px]";
const imgClass =
  "object-cover transition-transform duration-[0.6s] group-hover:scale-[1.04]";

function PhotoFx() {
  return (
    <>
      {/* soft darken */}
      <span
        className="pointer-events-none absolute inset-0 bg-navy/25 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
      />

      {/* inner frame */}
      <span
        className="pointer-events-none absolute inset-3 scale-110 rounded-[12px] border border-white/80 opacity-0 transition-all duration-500 ease-out group-hover:scale-100 group-hover:opacity-100"
        aria-hidden="true"
      />

      {/* diagonal shine */}
      <span
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-[500%]"
        aria-hidden="true"
      />
    </>
  );
}

export default function AboutSection() {
  return (
    <section
      aria-labelledby="about-heading"
      className="py-[112px] max-[900px]:py-20 max-[600px]:py-16"
    >
      <Container className="grid grid-cols-2 items-center gap-16 max-[900px]:grid-cols-1 max-[900px]:gap-[50px]">
        {/* ---------- Left: image collage ---------- */}
        <Reveal dir="image">
          <div className="grid grid-cols-2 gap-5 max-[900px]:mx-auto max-[900px]:w-full max-[900px]:max-w-[580px] max-[600px]:gap-3">
            {/* left column (offset down) */}
            <div className="flex flex-col gap-[27px] pt-[70px] max-[600px]:gap-3 max-[600px]:pt-10">
              <div className={photoClass}>
                <Image
                  src={aboutImages.application.src}
                  alt={aboutImages.application.alt}
                  fill
                  sizes="(max-width: 900px) 45vw, 25vw"
                  className={imgClass}
                />
                <PhotoFx />
              </div>

              <div className="flex h-[128px] flex-col items-center justify-center gap-2 rounded-[18px] bg-mist max-[600px]:h-[100px]">
                <div className="flex items-center">
                  {avatars.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={src}
                      src={src}
                      alt=""
                      aria-hidden="true"
                      className={`h-[42px] w-[42px] rounded-full border-2 border-white bg-white object-cover max-[600px]:h-9 max-[600px]:w-9 ${
                        i > 0 ? "-ml-2.5" : ""
                      }`}
                    />
                  ))}
                  <span
                    className="-ml-2.5 grid h-[42px] w-[42px] place-items-center rounded-full border-2 border-white bg-blue text-[22px] leading-none text-white max-[600px]:h-9 max-[600px]:w-9"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </div>
                <span className="text-[15px] text-ink">
                  Happy Customer
                </span>
              </div>
            </div>

            {/* right column */}
            <div className="flex flex-col gap-[27px] max-[600px]:gap-3">
              <div className={photoClass}>
                <Image
                  src={aboutImages.completedRooftop.src}
                  alt={aboutImages.completedRooftop.alt}
                  fill
                  sizes="(max-width: 900px) 45vw, 25vw"
                  className={imgClass}
                />
                <PhotoFx />
              </div>
              <div className={photoClass}>
                <Image
                  src={aboutImages.terraceBalcony.src}
                  alt={aboutImages.terraceBalcony.alt}
                  fill
                  sizes="(max-width: 900px) 45vw, 25vw"
                  className={imgClass}
                />
                <PhotoFx />
              </div>
            </div>
          </div>
        </Reveal>

        <div>
          <SectionHeader
            eyebrow="ABOUT ENVIRO SHIELD"
            title="Protecting structures. Extending life."
            text="Founded in Australia in 2009, EnviroShield Pvt. Ltd. is a trusted company in waterproofing, flooring, and protective coating solutions. Operating in Bangladesh since 2017 with in-house construction chemical manufacturing and imported raw materials from the UK, Germany, Australia, and China, we deliver durable, high-performance solutions for residential, commercial, and industrial projects."
            headingId="about-heading"
          />

          <StaggerContainer className="mb-[30px] grid grid-cols-2 gap-x-[22px] gap-y-[15px] max-[600px]:grid-cols-1 max-[600px]:gap-3">
            {[
              "Australian Brand Founded in 2009",
              "Operating in Bangladesh Since 2017",
              "Proven 7-Layer Waterproofing System",
              "Imported Raw Materials (UK, Germany, Australia, China)",
              "In-House Construction Chemical Manufacturing",
              "20+ Certified Engineers & 130 Applicators",
            ].map((item) => (
              <StaggerItem
                key={item}
                className="flex items-center gap-2 text-[14px] font-medium text-navy"
              >
                <span
                  className="grid h-5 w-5 flex-none place-items-center rounded-full bg-blue text-white"
                  aria-hidden="true"
                >
                  <Check size={12} strokeWidth={3.5} />
                </span>
                {item}
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div className="mb-7 grid grid-cols-4 gap-4 border-t border-line pt-6 max-[768px]:grid-cols-2 max-[600px]:gap-4">
            <div>
              <strong className="block text-[32px] font-extrabold tracking-[-0.04em] text-navy max-[600px]:text-[26px]">
                <AnimatedCounter value={3} suffix="M+" />
              </strong>
              <span className="text-[12px] text-ink">
                SFT Completed
              </span>
            </div>

            <div>
              <strong className="block text-[32px] font-extrabold tracking-[-0.04em] text-navy max-[600px]:text-[26px]">
                <AnimatedCounter value={130} suffix="+" />
              </strong>
              <span className="text-[12px] text-ink">
                Skilled Applicators
              </span>
            </div>

            <div>
              <strong className="block text-[32px] font-extrabold tracking-[-0.04em] text-navy max-[600px]:text-[26px]">
                <AnimatedCounter value={20} suffix="+" />
              </strong>
              <span className="text-[12px] text-ink">
                Engineers
              </span>
            </div>

            <div>
              <strong className="block text-[32px] font-extrabold tracking-[-0.04em] text-navy max-[600px]:text-[26px]">
                <AnimatedCounter value={17} suffix="+" />
              </strong>
              <span className="text-[12px] text-ink">
                Years Experience
              </span>
            </div>
          </div>

          <Button href="/about" variant="outline">
            Discover our story
          </Button>
        </div>
      </Container>
    </section>
  );
}
