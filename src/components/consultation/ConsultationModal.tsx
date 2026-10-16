import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Clock, Star, Shield } from "lucide-react";

interface ConsultationModalProps {
  open: boolean;
  onClose: () => void;
  onProceed: () => void;
}

const ConsultationModal = ({ open, onClose, onProceed }: ConsultationModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleRecharge = async () => {
    setLoading(true);
    // Demo payment - always succeeds
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    onProceed();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[hsl(16_32%_9%)] border-orange-500/30 text-white max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            🔱 Talk With Pandit Ji
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Pandit Info */}
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-amber-400/20">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-2xl flex-shrink-0">
              🧘
            </div>
            <div>
              <p className="font-semibold text-white">Pandit Shiv Sharma Ji</p>
              <div className="flex items-center gap-1 mt-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                <span className="text-xs text-gray-400 ml-1">(4.9 • 2.3k sessions)</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Vedic Astrology • Palm Reading • Numerology</p>
            </div>
          </div>

          {/* Plan Details */}
          <div className="bg-gradient-to-br from-orange-950/40 to-teal-950/40 border border-amber-400/30 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Clock className="w-4 h-4 text-amber-300" />
                Duration
              </div>
              <Badge className="bg-orange-500/20 text-orange-200 border-amber-400/30">12 Minutes</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Consultation Fee</span>
              <span className="text-2xl font-bold text-white">₹551</span>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>Per minute rate</span>
              <span>₹45.9/min</span>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
            {["Live consultation", "Instant connect", "Secure & private", "Expert guidance"].map((f) => (
              <div key={f} className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                {f}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleRecharge}
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-500/30 text-base"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Recharge & Talk — ₹551
              </span>
            )}
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
            <Shield className="w-3 h-3" />
            Demo mode — no real payment processed
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationModal;
