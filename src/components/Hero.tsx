import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { whenPreloaderReady } from "@/lib/scrollAnimations";
import { BRAND } from "@/lib/brand";

const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: gsap.Context | undefined;

    const run = () => {
      if (!contentRef.current) return;
      ctx = gsap.context(() => {
        gsap.fromTo(
          contentRef.current!.querySelectorAll("[data-hero]"),
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.85, stagger: 0.1, ease: "power3.out", delay: 0.08 }
        );
      }, heroRef);
    };

    const remove = whenPreloaderReady(run);
    return () => {
      remove();
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100svh] overflow-hidden bg-transparent md:min-h-[min(100svh,52rem)]"
    >
      {/* Readability washes: top on mobile (system is below), left on desktop (system is right) */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(215_30%_4%/0.82)_0%,hsl(215_30%_4%/0.45)_42%,transparent_68%)] md:hidden" />
        <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,hsl(215_30%_4%/0.72)_0%,hsl(215_30%_4%/0.28)_38%,transparent_68%)] md:block" />
      </div>

      <div className="container relative mx-auto flex min-h-[100svh] flex-col justify-start px-4 pb-28 pt-10 sm:px-6 md:min-h-[min(100svh,52rem)] md:justify-center md:pb-24 md:pt-12">
        <div ref={contentRef} className="relative z-10 max-w-xl md:max-w-2xl lg:max-w-3xl">
          <p
            data-hero
            className="mb-4 font-display text-4xl font-semibold tracking-tight text-slate-50 drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)] sm:text-5xl md:mb-5 md:text-6xl lg:text-[5rem]"
          >
            {BRAND.NAME}
          </p>

          <h1
            data-hero
            className="mb-4 max-w-xl font-display text-xl font-medium leading-snug text-slate-100/90 sm:text-2xl md:mb-5 md:text-3xl lg:text-4xl"
          >
            Charts that read clean.
            <span className="mt-1 block alpha-text">Guidance that holds.</span>
          </h1>

          <p
            data-hero
            className="mb-8 max-w-md text-sm leading-relaxed text-slate-300/85 sm:text-base md:mb-10 md:max-w-xl md:text-lg md:text-slate-400"
          >
            Vedic kundli, numerology, and palm insights — calibrated for clarity,
            not noise. Observatory calm. Precise readings.
          </p>

          <div data-hero className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="h-12 w-full rounded-md border-0 bg-teal-400 px-8 text-base font-semibold text-slate-950 hover:bg-teal-300 sm:w-auto"
            >
              <Link to="/astrology">
                Open Kundli <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 w-full rounded-md border-white/15 bg-slate-950/30 px-8 text-slate-200 backdrop-blur-sm hover:bg-white/5 hover:text-teal-100 sm:w-auto"
            >
              <Link to="/live-consultation">
                <Compass className="mr-2 h-4 w-4" /> Talk to an Expert
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
