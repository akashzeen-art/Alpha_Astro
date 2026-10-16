import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PhoneOff, Mic, MicOff, Volume2 } from "lucide-react";
import Timer from "./Timer";
import RechargeModal from "./RechargeModal";

interface CallScreenProps {
  sessionId: string;
  minutes: number;
  panditStatus: "online" | "busy" | "offline";
  onEnd: () => void;
  onRecharge: (newMinutes: number) => void;
}

type CallState = "connecting" | "waiting" | "connected";

const IVR_MESSAGES = [
  "Namaste 🙏 Pandit Ji is currently busy. Please stay on the line. Your call will be connected shortly.",
  "Aapka swagat hai 🙏 Pandit Ji thodi der mein available ho jayenge. Kripya prateeksha karein.",
  "Thank you for your patience. Pandit Ji will connect with you shortly. Please hold on.",
];

const CallScreen = ({ sessionId, minutes, panditStatus, onEnd, onRecharge }: CallScreenProps) => {
  const [callState, setCallState] = useState<CallState>("connecting");
  const [muted, setMuted] = useState(false);
  const [ivrIndex, setIvrIndex] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [showExpired, setShowExpired] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [currentMinutes, setCurrentMinutes] = useState(minutes);
  const ivrRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      if (panditStatus === "online") {
        setCallState("connected");
      } else {
        setCallState("waiting");
        ivrRef.current = setInterval(() => setIvrIndex((i) => (i + 1) % IVR_MESSAGES.length), 15000);
      }
    }, 2000);
    return () => clearTimeout(t);
  }, [panditStatus]);

  useEffect(() => {
    if (callState !== "waiting") return;
    const t = setTimeout(() => {
      if (ivrRef.current) clearInterval(ivrRef.current);
      setCallState("connected");
    }, 8000);
    return () => clearTimeout(t);
  }, [callState]);

  useEffect(() => {
    if (callState !== "connected") return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [callState]);

  const handleEndCall = () => {
    if (ivrRef.current) clearInterval(ivrRef.current);
    onEnd();
  };

  const handleRecharge = async () => {
    setShowWarning(false);
    setShowExpired(false);
    await new Promise((r) => setTimeout(r, 1200));
    setCurrentMinutes(12);
    onRecharge(12);
  };

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-950/50 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        {callState === "connecting" && <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30 px-4 py-2 animate-pulse">📡 Connecting...</Badge>}
        {callState === "waiting" && <Badge className="bg-orange-500/20 text-orange-300 border-orange-400/30 px-4 py-2 animate-pulse">⏳ Please Hold...</Badge>}
        {callState === "connected" && <Badge className="bg-green-500/20 text-green-300 border-green-400/30 px-4 py-2">🟢 Connected</Badge>}
      </div>

      <div className="relative mb-6">
        <div className={`w-28 h-28 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-5xl shadow-2xl ${callState === "connected" ? "ring-4 ring-green-400/50" : ""}`}>
          🧘
        </div>
        {callState === "connected" && (
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-400 rounded-full border-2 border-slate-900" />
        )}
      </div>

      <h2 className="text-xl font-bold text-white mb-1">Pandit Shiv Sharma Ji</h2>
      <p className="text-gray-400 text-sm mb-6">Vedic Astrology • Palm Reading</p>

      {callState === "waiting" && (
        <div className="max-w-xs text-center bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
          <Volume2 className="w-5 h-5 text-amber-300 mx-auto mb-2" />
          <p className="text-sm text-gray-300 leading-relaxed">{IVR_MESSAGES[ivrIndex]}</p>
        </div>
      )}

      {callState === "connecting" && (
        <div className="flex gap-1 mb-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      )}

      {callState === "connected" && (
        <div className="mb-6 text-center">
          <Timer
            totalSeconds={currentMinutes * 60}
            onWarning={() => setShowWarning(true)}
            onExpired={() => setShowExpired(true)}
            warningAt={120}
          />
          <p className="text-xs text-gray-500 mt-2">Duration: {fmt(elapsed)} • Session: {sessionId}</p>
        </div>
      )}

      {(callState === "waiting" || callState === "connected") && (
        <div className="flex items-center gap-6 mt-4">
          <Button onClick={() => setMuted(!muted)} variant="outline"
            className={`w-14 h-14 rounded-full border-2 ${muted ? "bg-red-500/20 border-red-400/50 text-red-300" : "bg-white/10 border-white/20 text-white"}`}>
            {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>
          <Button onClick={handleEndCall} className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/40">
            <PhoneOff className="w-6 h-6" />
          </Button>
          <Button variant="outline" className="w-14 h-14 rounded-full border-2 bg-white/10 border-white/20 text-white">
            <Volume2 className="w-5 h-5" />
          </Button>
        </div>
      )}

      {muted && <p className="text-xs text-red-400 mt-3 animate-pulse">🔇 Muted</p>}

      <RechargeModal open={showWarning} type="warning" onRecharge={handleRecharge} onClose={() => setShowWarning(false)} />
      <RechargeModal open={showExpired} type="expired" onRecharge={handleRecharge} onClose={handleEndCall} />
    </div>
  );
};

export default CallScreen;
