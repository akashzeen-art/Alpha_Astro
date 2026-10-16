import { useEffect, useRef, useState } from "react";
import { Calculator, Hand } from "lucide-react";
import Numerology from "@/pages/Numerology";
import PalmUpload from "@/components/PalmUpload";
import PalmResults from "@/components/PalmResults";
import { cn } from "@/lib/utils";

const HomeQuickReadings = () => {
  const [showPalmResults, setShowPalmResults] = useState(false);
  const palmSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleShowResults = () => {
      setShowPalmResults(true);
      requestAnimationFrame(() => {
        palmSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };

    window.addEventListener("showPalmResults", handleShowResults);
    return () => window.removeEventListener("showPalmResults", handleShowResults);
  }, []);

  return (
    <section className="container mx-auto space-y-10 px-4 pb-8 pt-2 md:space-y-14 md:pb-12">
      <p className="mx-auto max-w-2xl text-center text-xs font-semibold uppercase tracking-[0.28em] text-violet-300/55">
        Your Readings
      </p>

      {/* Numbers — full numerology on home */}
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-400/45 bg-violet-600/30">
            <Calculator className="h-6 w-6 text-amber-300" strokeWidth={2.25} />
          </span>
          <h2 className="font-display text-2xl font-bold text-slate-50 sm:text-3xl">Numbers</h2>
        </div>
        <div className="rounded-2xl border border-violet-500/30 bg-violet-950/25 p-4 sm:p-6">
          <Numerology embedded />
        </div>
      </div>

      {/* Palm — full upload + results on home */}
      <div ref={palmSectionRef} className="mx-auto max-w-5xl scroll-mt-24">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-400/45 bg-violet-600/30">
            <Hand className="h-6 w-6 text-amber-300" strokeWidth={2.25} />
          </span>
          <h2 className="font-display text-2xl font-bold text-slate-50 sm:text-3xl">Palm</h2>
        </div>
        <div
          className={cn(
            "rounded-2xl border border-violet-500/30 bg-violet-950/25 p-4 sm:p-6",
            showPalmResults && "border-amber-400/35"
          )}
        >
          {showPalmResults ? (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setShowPalmResults(false)}
                className="text-sm font-medium text-violet-200/70 hover:text-amber-300"
              >
                ← Upload another palm
              </button>
              <PalmResults />
            </div>
          ) : (
            <PalmUpload />
          )}
        </div>
      </div>
    </section>
  );
};

export default HomeQuickReadings;
