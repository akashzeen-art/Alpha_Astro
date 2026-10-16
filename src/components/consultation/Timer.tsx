import { useEffect, useState } from "react";

interface TimerProps {
  totalSeconds: number;
  onWarning?: () => void;
  onExpired?: () => void;
  warningAt?: number;
}

const Timer = ({ totalSeconds, onWarning, onExpired, warningAt = 120 }: TimerProps) => {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [warned, setWarned] = useState(false);

  useEffect(() => {
    setRemaining(totalSeconds);
    setWarned(false);
  }, [totalSeconds]);

  useEffect(() => {
    if (remaining <= 0) {
      onExpired?.();
      return;
    }
    if (remaining <= warningAt && !warned) {
      setWarned(true);
      onWarning?.();
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, warned, warningAt, onWarning, onExpired]);

  const mins = Math.floor(remaining / 60).toString().padStart(2, "0");
  const secs = (remaining % 60).toString().padStart(2, "0");
  const pct = (remaining / totalSeconds) * 100;
  const isLow = remaining <= warningAt;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`text-5xl font-bold font-mono tracking-widest ${isLow ? "text-red-400 animate-pulse" : "text-white"}`}>
        {mins}:{secs}
      </div>
      <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${isLow ? "bg-red-400" : "bg-green-400"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-white/60">Remaining consultation time</p>
    </div>
  );
};

export default Timer;
