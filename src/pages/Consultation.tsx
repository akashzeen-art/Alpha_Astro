import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CallScreen from "@/components/consultation/CallScreen";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

const generateSessionId = () => "CALL" + Math.random().toString(36).substring(2, 8).toUpperCase();

const Consultation = () => {
  const navigate = useNavigate();
  const [sessionId] = useState(generateSessionId);
  const [minutes, setMinutes] = useState(12);
  const [panditStatus, setPanditStatus] = useState<"online" | "busy" | "offline">(
    () => (localStorage.getItem("pandit_status") as "online" | "busy" | "offline") || "busy"
  );
  const [ended, setEnded] = useState(false);

  // Listen for admin status changes
  useEffect(() => {
    const handler = (e: Event) => {
      setPanditStatus((e as CustomEvent).detail);
    };
    window.addEventListener("pandit-status-change", handler);
    return () => window.removeEventListener("pandit-status-change", handler);
  }, []);

  // Save session to localStorage for admin panel
  useEffect(() => {
    const session = {
      sessionId,
      startTime: new Date().toISOString(),
      minutes,
      amount: 551,
      status: "active",
    };
    const stored = JSON.parse(localStorage.getItem("call_sessions") || "[]");
    stored.push(session);
    localStorage.setItem("call_sessions", JSON.stringify(stored));
  }, [sessionId]);

  const handleEnd = () => {
    // Update session status
    const stored = JSON.parse(localStorage.getItem("call_sessions") || "[]");
    const updated = stored.map((s: any) =>
      s.sessionId === sessionId ? { ...s, status: "completed", endTime: new Date().toISOString() } : s
    );
    localStorage.setItem("call_sessions", JSON.stringify(updated));
    setEnded(true);
  };

  const handleRecharge = (newMinutes: number) => {
    setMinutes(newMinutes);
    setEnded(false);
  };

  if (panditStatus === "offline") {
    return (
      <Layout fullBleed>
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="grahveda-panel text-center space-y-4 max-w-sm p-8">
          <div className="text-5xl">🧘</div>
          <h2 className="font-display text-xl font-bold text-amber-50">Pandit Ji is Offline</h2>
          <p className="text-orange-100/50 text-sm">Pandit Ji is not available right now. Please try again later.</p>
          <Button onClick={() => navigate("/")} variant="outline" className="grahveda-btn-outline">
            Back to Home
          </Button>
        </div>
      </div>
      </Layout>
    );
  }

  if (ended) {
    return (
      <Layout fullBleed>
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="grahveda-panel text-center space-y-5 max-w-sm p-8">
          <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-amber-400/50">
            <Phone className="w-10 h-10 text-amber-400" />
          </div>
          <h2 className="font-display text-xl font-bold text-amber-50">Consultation Ended</h2>
          <p className="text-orange-100/50 text-sm">Thank you for consulting with Pandit Shiv Sharma Ji.</p>
          <p className="text-orange-100/50 text-sm">Session ID: <span className="text-amber-300 font-mono">{sessionId}</span></p>
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => { setMinutes(12); setEnded(false); }}
              className="grahveda-btn-primary font-bold"
            >
              <Phone className="w-4 h-4 mr-2" /> Recharge & Talk Again — ₹551
            </Button>
            <Button onClick={() => navigate("/")} variant="outline" className="grahveda-btn-outline">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
      </Layout>
    );
  }

  return (
    <Layout fullBleed>
    <CallScreen
      sessionId={sessionId}
      minutes={minutes}
      panditStatus={panditStatus}
      onEnd={handleEnd}
      onRecharge={handleRecharge}
    />
    </Layout>
  );
};

export default Consultation;
