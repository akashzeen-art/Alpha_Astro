import { useState } from "react";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Sun,
  Moon,
  Globe,
  Heart,
  TrendingUp,
  Brain,
  Shield,
  Eye,
  CheckCircle,
  Share2,
} from "lucide-react";
import { Link } from "react-router-dom";

// ─── Local astrology generator (no backend needed) ───────────────────────────
function generateLocalAstrologyResult(birthData: { name: string; birthDate: string; birthTime: string; birthPlace: string; gender: string }) {
  const SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
  const seed = (birthData.birthDate || "2000-01-01").replace(/-/g, "").split("").reduce((s, d) => s + parseInt(d), 0);
  const sun = SIGNS[seed % 12];
  const moon = SIGNS[(seed + 4) % 12];
  const rising = SIGNS[(seed + 7) % 12];
  return {
    sun_sign: sun, moon_sign: moon, rising_sign: rising,
    overview: {
      summary: `${birthData.name || "You"} carry the radiant energy of ${sun} with the emotional depth of ${moon}. Your ${rising} rising shapes how the world perceives you — bringing a unique blend of intellect, warmth, and purpose to everything you do.`,
      key_themes: ["Self-discovery", "Purposeful action", "Emotional growth"],
      confidence: 0.87,
    },
    planetary_positions: [
      { planet: "Sun", sign: sun, house: "1st House", aspect: "Core identity and life force" },
      { planet: "Moon", sign: moon, house: "4th House", aspect: "Emotional world and instincts" },
      { planet: "Mercury", sign: SIGNS[(seed + 1) % 12], house: "2nd House", aspect: "Communication and intellect" },
      { planet: "Venus", sign: SIGNS[(seed + 2) % 12], house: "3rd House", aspect: "Love and beauty" },
      { planet: "Mars", sign: SIGNS[(seed + 3) % 12], house: "5th House", aspect: "Drive and ambition" },
    ],
    personality: {
      summary: `A natural ${sun} energy combined with ${moon} emotional intelligence makes you deeply perceptive and driven.`,
      traits: ["Intuitive", "Determined", "Empathetic", "Creative", "Adaptable"],
      confidence: 0.86,
    },
    strengths: {
      items: ["Natural leadership", "Strong intuition", "Emotional intelligence", "Creative vision"],
      summary: "These core strengths guide your path toward fulfillment and success.",
      confidence: 0.89,
    },
    challenges: {
      items: ["Overthinking", "Perfectionism", "Emotional sensitivity"],
      summary: "Awareness of these patterns opens the door to conscious growth.",
      confidence: 0.80,
    },
    life_predictions: [
      { area: "Career", timeframe: "Next 12 months", prediction: "A significant professional opportunity aligns with your natural talents. Trust your instincts and take bold steps forward.", confidence: 0.85 },
      { area: "Love", timeframe: "Next 6 months", prediction: "Meaningful connections deepen. Open your heart to vulnerability and authentic expression.", confidence: 0.80 },
      { area: "Health", timeframe: "Ongoing", prediction: "Your vitality is strong. Maintain balance between activity and rest for sustained well-being.", confidence: 0.88 },
      { area: "Finance", timeframe: "Next year", prediction: "Steady growth through disciplined effort. Avoid impulsive decisions and focus on long-term security.", confidence: 0.78 },
    ],
    compatibility: [
      { sign: SIGNS[(seed + 4) % 12], match: 94, type: "Soulmate" },
      { sign: SIGNS[(seed + 8) % 12], match: 88, type: "Perfect Match" },
      { sign: SIGNS[(seed + 2) % 12], match: 76, type: "Good Match" },
    ],
    model_version: "local-astro-v1",
  };
}

const AstrologyReading = () => {
  // Authentication removed
  const { language, tr } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [birthData, setBirthData] = useState({
    name: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
    gender: "",
    questions: "",
  });

  const [focusAreas, setFocusAreas] = useState<string[]>([]);

  const [astrologyResults, setAstrologyResults] = useState<{
    sunSign: string;
    moonSign: string;
    risingSign: string;
    planetaryPositions: { planet: string; sign: string; house: string; aspect: string }[];
    personalityTraits: { trait: string; score: number; description: string }[];
    strengths: { item: string; score: number; description: string }[];
    challenges: { item: string; score: number; description: string }[];
    lifePredictions: { area: string; timeframe: string; prediction: string; confidence: number }[];
    compatibility: { sign: string; match: number; type: string }[];
    personalitySummary: string;
    modelVersion: string;
    overview?: { summary: string; key_themes: string[]; confidence: number } | null;
    keyThemes?: string[];
  } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setBirthData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleFocusArea = (id: string) => {
    setFocusAreas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const baseUrl = "";

  const handleNext = async () => {
    setError(null);
    try {
      if (currentStep === 1) {
        if (!birthData.name.trim() || !birthData.gender) {
          setError("Please enter your full name and select a gender.");
          return;
        }
        setSessionId(`session_${Date.now()}`);
        setCurrentStep(2);
        return;
      }
      if (currentStep === 2) {
        setCurrentStep(3);
        return;
      }
      if (currentStep === 3) {
        await generateReading();
      }
    } catch (e: any) {
      setError(e.message || "Something went wrong. Please try again.");
    }
  };

  const generateReading = async () => {
    if (!sessionId) {
      setError("Session not initialized. Please complete previous steps.");
      return;
    }
    setIsAnalyzing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 95 ? prev : prev + 5));
    }, 300);

    try {
      // Simulate processing delay
      await new Promise((r) => setTimeout(r, 3000));

      // Generate local astrology reading based on birth data
      const result = generateLocalAstrologyResult(birthData);

      const mapped = {
        sunSign: result.sun_sign,
        moonSign: result.moon_sign,
        risingSign: result.rising_sign,
        planetaryPositions: result.planetary_positions,
        personalityTraits: result.personality.traits.map((trait: string, i: number) => ({
          trait,
          score: Math.max(72, Math.min(98, Math.round(result.personality.confidence * 100) + (i % 4) * 2)),
          description: `${trait}: ${result.personality.summary}`,
        })),
        strengths: result.strengths.items.map((item: string, i: number) => ({
          item,
          score: Math.max(78, Math.min(98, Math.round(result.strengths.confidence * 100) + (i % 3) * 2)),
          description: result.strengths.summary,
        })),
        challenges: result.challenges.items.map((item: string, i: number) => ({
          item,
          score: Math.max(62, Math.min(88, Math.round(result.challenges.confidence * 100) + (i % 3) * 2)),
          description: result.challenges.summary,
        })),
        lifePredictions: result.life_predictions.map((pred: any) => ({
          area: pred.area,
          timeframe: pred.timeframe,
          prediction: pred.prediction,
          confidence: Math.round(pred.confidence * 100),
        })),
        compatibility: result.compatibility,
        personalitySummary: result.overview.summary,
        modelVersion: result.model_version,
        overview: result.overview,
        keyThemes: result.overview.key_themes,
      };

      setAstrologyResults(mapped);
      setProgress(100);
      setAnalysisComplete(true);

      // Save locally
      try {
        const { apiService } = await import("@/lib/apiService");
        await apiService.saveReading({
          reading_type: "astrology_reading",
          result: { ...result, session_id: sessionId, generated_at: new Date().toISOString() },
          accuracy: Math.round(result.overview.confidence * 100),
          source_id: `astrology-${sessionId}`,
        });
        window.dispatchEvent(new CustomEvent("reading-saved", { detail: { reading_type: "astrology_reading" } }));
      } catch {
        // non-critical
      }
    } catch (e: any) {
      setError(e.message || "Failed to generate astrology reading.");
    } finally {
      clearInterval(interval);
      setIsAnalyzing(false);
    }
  };

  const steps = [
    { number: 1, title: tr.astrology.steps.personalInfo, description: tr.astrology.steps.personalInfoDesc },
    { number: 2, title: tr.astrology.steps.birthDetails, description: tr.astrology.steps.birthDetailsDesc },
    { number: 3, title: tr.astrology.steps.preferences, description: tr.astrology.steps.preferencesDesc },
  ];

  if (analysisComplete && astrologyResults) {
    return (
      <Layout>
        <div className="grahveda-page relative z-10">
          {/* Header */}
          <section className="pb-6 sm:pb-8 relative overflow-hidden">
            <div className="absolute inset-0 stars-bg opacity-20"></div>
            <div className="container mx-auto px-3 sm:px-4 relative z-10">
              <div className="text-center">
                <Badge
                  variant="outline"
                  className="mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border-cosmic/50 text-cosmic bg-cosmic/10"
                >
                  <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                  {tr.astrology.readingComplete}
                </Badge>
                <h1
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2"
                  style={{
                    fontFamily: `'Playfair Display', 'DM Serif Display', 'Cinzel', serif`,
                    color: '#fff',
                    textShadow: '0 2px 12px rgba(0,0,0,0.3)',
                    letterSpacing: '0.01em',
                    lineHeight: 1.1,
                  }}
                >
                  Your{' '}
                  <span style={{background: 'linear-gradient(90deg,#a78bfa,#fbbf24,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>{tr.astrology.cosmicBlueprint}</span>
                </h1>
                <p
                  className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-4 sm:mb-6 px-2"
                  style={{
                    fontFamily: `'Merriweather', 'Georgia', serif`,
                    color: '#e0e0e0',
                    textShadow: '0 1px 8px rgba(0,0,0,0.18)',
                    fontWeight: 400,
                    lineHeight: 1.3,
                  }}
                >
                  {tr.astrology.cosmicBlueprintSubtitle}
                </p>
              </div>
            </div>
          </section>

          {/* Results */}
          <section className="pb-12 sm:pb-20">
            <div className="container mx-auto px-3 sm:px-4">
              <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
                <TabsList className="grid w-full grid-cols-4 glass-card p-0.5 sm:p-1 rounded-lg sm:rounded-xl overflow-x-auto">
                  <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 touch-manipulation">{tr.astrology.overview}</TabsTrigger>
                  <TabsTrigger value="personality" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 touch-manipulation">{tr.astrology.personality}</TabsTrigger>
                  <TabsTrigger value="predictions" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 touch-manipulation">{tr.astrology.predictions}</TabsTrigger>
                  <TabsTrigger value="compatibility" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 touch-manipulation">{tr.astrology.compatibility}</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4 sm:space-y-6">
                  {astrologyResults.personalitySummary && (
                    <Card className="glass-card">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Sparkles className="h-4 w-4 text-cosmic" />
                          {tr.astrology.cosmicSummary}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {astrologyResults.personalitySummary}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                    <Card className="glass-card grahveda-glow hover:scale-105 transition-transform">
                      <CardContent className="p-4 sm:p-6 text-center">
                        <Sun className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-golden mx-auto mb-3 sm:mb-4 animate-glow" />
                        <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1.5 sm:mb-2">{tr.astrology.sunSign}</h3>
                        <p className="text-xl sm:text-2xl cosmic-text font-bold">
                          {astrologyResults.sunSign}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 sm:mt-2">
                          {tr.astrology.sunSignDesc}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="glass-card grahveda-glow hover:scale-105 transition-transform">
                      <CardContent className="p-4 sm:p-6 text-center">
                        <Moon className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-stellar mx-auto mb-3 sm:mb-4 animate-glow" />
                        <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1.5 sm:mb-2">{tr.astrology.moonSign}</h3>
                        <p className="text-xl sm:text-2xl cosmic-text font-bold">
                          {astrologyResults.moonSign}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 sm:mt-2">
                          {tr.astrology.moonSignDesc}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="glass-card grahveda-glow hover:scale-105 transition-transform">
                      <CardContent className="p-4 sm:p-6 text-center">
                        <Globe className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-cosmic mx-auto mb-3 sm:mb-4 animate-glow" />
                        <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1.5 sm:mb-2">{tr.astrology.risingSign}</h3>
                        <p className="text-xl sm:text-2xl cosmic-text font-bold">
                          {astrologyResults.risingSign}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 sm:mt-2">
                          {tr.astrology.risingSignDesc}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="glass-card">
                    <CardHeader className="pb-3">
                      <CardTitle
                        className="text-lg sm:text-xl md:text-2xl font-bold mb-2 flex items-center gap-2"
                        style={{
                          fontFamily: `'Playfair Display', 'DM Serif Display', 'Cinzel', serif`,
                          color: '#fff',
                          textShadow: '0 2px 8px rgba(0,0,0,0.18)',
                        }}
                      >
                        <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" /> {tr.astrology.planetaryPositions}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 sm:space-y-4">
                        {astrologyResults.planetaryPositions.map(
                          (planet, index) => (
                            <div
                              key={index}
                              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-lg border border-border/50 hover:border-cosmic/50 transition-colors gap-2 sm:gap-0"
                            >
                              <div className="flex-1">
                                <p className="font-semibold text-sm sm:text-base md:text-lg">
                                  {planet.planet} in {planet.sign}
                                </p>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                                  {planet.house}
                                </p>
                              </div>
                              <p className="text-xs sm:text-sm text-cosmic sm:text-right max-w-xs">
                                {planet.aspect}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {astrologyResults.modelVersion && (
                    <Card className="glass-card">
                      <CardContent className="p-4 text-center">
                        <p className="text-xs text-muted-foreground">
                          Analysis generated using model version {astrologyResults.modelVersion}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Personality Tab */}
                <TabsContent value="personality" className="space-y-4 sm:space-y-6">
                  {astrologyResults.personalitySummary && (
                    <Card className="glass-card">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Star className="h-4 w-4 text-cosmic" />
                          {tr.astrology.overview}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed">
                          {astrologyResults.personalitySummary}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  <Card className="glass-card">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Brain className="h-4 w-4 text-cosmic" />
                        {tr.astrology.personalityTraits}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6">
                      {astrologyResults.personalityTraits.length > 0 ? (
                        astrologyResults.personalityTraits.map(
                        (trait, index) => (
                          <div key={index} className="space-y-1.5 sm:space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-sm sm:text-base md:text-lg">{trait.trait}</span>
                                <span className="text-cosmic font-bold text-sm sm:text-base md:text-lg">
                                {trait.score}%
                              </span>
                            </div>
                            <Progress value={trait.score} className="h-2 sm:h-3" />
                              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                              {trait.description}
                            </p>
                          </div>
                        ),
                        )
                      ) : (
                        <p className="text-sm text-muted-foreground">No personality traits available.</p>
                      )}
                    </CardContent>
                  </Card>

                  {astrologyResults.strengths.length > 0 && (
                    <Card className="glass-card">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Shield className="h-4 w-4 text-green-400" />
                          {tr.astrology.strengths}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 sm:space-y-6">
                        {astrologyResults.strengths.map((strength, index) => (
                          <div key={index} className="space-y-1.5 sm:space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-sm sm:text-base md:text-lg">{strength.item}</span>
                              <span className="text-green-400 font-bold text-sm sm:text-base md:text-lg">
                                {strength.score}%
                              </span>
                            </div>
                            <Progress value={strength.score} className="h-2 sm:h-3" />
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                              {strength.description}
                            </p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {astrologyResults.challenges.length > 0 && (
                    <Card className="glass-card">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Eye className="h-4 w-4 text-yellow-400" />
                          {tr.astrology.areasForGrowth}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 sm:space-y-6">
                        {astrologyResults.challenges.map((challenge, index) => (
                          <div key={index} className="space-y-1.5 sm:space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-sm sm:text-base md:text-lg">{challenge.item}</span>
                              <span className="text-yellow-400 font-bold text-sm sm:text-base md:text-lg">
                                {challenge.score}%
                              </span>
                            </div>
                            <Progress value={challenge.score} className="h-2 sm:h-3" />
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                              {challenge.description}
                            </p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Predictions Tab */}
                <TabsContent value="predictions" className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                    {astrologyResults.lifePredictions.map(
                      (prediction, index) => (
                        <Card
                          key={index}
                          className="glass-card hover:grahveda-glow transition-transform duration-200"
                        >
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                              <div className="p-2 sm:p-3 bg-cosmic/20 rounded-full flex-shrink-0">
                                {prediction.area === "Career" && (
                                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-cosmic" />
                                )}
                                {prediction.area === "Love" && (
                                  <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-cosmic" />
                                )}
                                {prediction.area === "Health" && (
                                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-cosmic" />
                                )}
                                {prediction.area === "Finance" && (
                                  <Star className="h-5 w-5 sm:h-6 sm:w-6 text-cosmic" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-sm sm:text-base">
                                  {prediction.area}
                                </h3>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                  {prediction.timeframe}
                                </p>
                              </div>
                            </div>
                            <p className="text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                              {prediction.prediction}
                            </p>
                            <div className="space-y-1.5 sm:space-y-2">
                              <div className="flex justify-between text-xs sm:text-sm">
                                <span className="text-muted-foreground">
                                      {tr.astrology.confidence}:
                                </span>
                                <span className="font-medium text-cosmic">
                                  {prediction.confidence}%
                                </span>
                              </div>
                              <Progress
                                value={prediction.confidence}
                                className="h-1.5 sm:h-2"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ),
                    )}
                  </div>
                </TabsContent>

                {/* Compatibility Tab */}
                <TabsContent value="compatibility" className="space-y-4 sm:space-y-6">
                  <Card className="glass-card">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Heart className="h-4 w-4 text-cosmic" />
                        {tr.astrology.loveCompatibility}
                      </CardTitle>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 sm:mt-2">
                        Based on your Sun Sign ({astrologyResults.sunSign}), {tr.astrology.loveCompatibilityDesc}
                      </p>
                    </CardHeader>
                    <CardContent>
                      {astrologyResults.compatibility.length > 0 ? (
                      <div className="space-y-3 sm:space-y-4">
                        {astrologyResults.compatibility.map((match, index) => (
                          <div
                            key={index}
                              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-lg border border-border/50 hover:border-cosmic/50 transition-colors gap-2 sm:gap-0"
                          >
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cosmic/20 rounded-full flex items-center justify-center flex-shrink-0">
                                  <Star className="h-5 w-5 sm:h-6 sm:w-6 text-cosmic" />
                              </div>
                              <div className="min-w-0 flex-1">
                                  <p className="font-semibold text-sm sm:text-base md:text-lg">{match.sign}</p>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                  {match.type}
                                </p>
                              </div>
                            </div>
                            <div className="text-left sm:text-right">
                                <p className="text-lg sm:text-xl font-bold cosmic-text">
                                {match.match}%
                              </p>
                              <Progress
                                value={match.match}
                                  className="h-1.5 sm:h-2 w-full sm:w-24 mt-1"
                              />
                            </div>
                          </div>
                        ))}
                        </div>
                      ) : (
                        <p className="text-xs sm:text-sm text-muted-foreground text-center py-6 sm:py-8">
                          Compatibility data will be calculated based on your birth chart.
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="glass-card">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Globe className="h-4 w-4 text-cosmic" />
                        {tr.astrology.cosmicTriad}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        <div className="text-center p-3 sm:p-4 rounded-lg border border-border/50">
                          <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">{tr.astrology.sunSign}</p>
                          <p className="text-lg sm:text-xl font-bold cosmic-text">{astrologyResults.sunSign}</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">{tr.astrology.coreIdentity}</p>
                        </div>
                        <div className="text-center p-3 sm:p-4 rounded-lg border border-border/50">
                          <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">{tr.astrology.moonSign}</p>
                          <p className="text-lg sm:text-xl font-bold cosmic-text">{astrologyResults.moonSign}</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">{tr.astrology.emotionalNature}</p>
                        </div>
                        <div className="text-center p-3 sm:p-4 rounded-lg border border-border/50">
                          <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">{tr.astrology.risingSign}</p>
                          <p className="text-lg sm:text-xl font-bold cosmic-text">{astrologyResults.risingSign}</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">{tr.astrology.outwardPersona}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Enhanced Action buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 md:gap-4 justify-center items-center mt-8 sm:mt-12 px-3 sm:px-0">
                <Button 
                  onClick={async () => {
                    if (!astrologyResults || !sessionId) return;
                    try {
                      const { apiService } = await import("@/lib/apiService");
                      await apiService.saveReading({
                        reading_type: "astrology_reading",
                        result: {
                          sun_sign: astrologyResults.sunSign,
                          moon_sign: astrologyResults.moonSign,
                          rising_sign: astrologyResults.risingSign,
                          personality: { summary: astrologyResults.personalitySummary },
                          planetary_positions: astrologyResults.planetaryPositions,
                          life_predictions: astrologyResults.lifePredictions,
                          session_id: sessionId,
                          generated_at: new Date().toISOString(),
                        },
                        accuracy: astrologyResults.overview?.confidence ? Math.round(astrologyResults.overview.confidence * 100) : 85,
                        source_id: `astrology-${sessionId}`,
                      });
                      window.dispatchEvent(new CustomEvent("reading-saved", { detail: { reading_type: "astrology_reading" } }));
                      alert("Reading saved successfully!");
                    } catch {
                      alert("Failed to save reading. Please try again.");
                    }
                  }}
                  className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-teal-600 hover:from-orange-700 hover:to-teal-700 text-white shadow-lg shadow-orange-500/30 rounded-lg sm:rounded-xl px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium transition-all hover:scale-[1.02] touch-manipulation"
                  size="sm"
                >
                  <Star className="h-4 w-4 mr-1.5 sm:mr-2" />
                  {tr.astrology.saveReading}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto border-amber-400/50 text-amber-300 hover:bg-orange-500/20 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium transition-all hover:scale-[1.02] touch-manipulation"
                >
                  <Share2 className="h-4 w-4 mr-1.5 sm:mr-2" />
                  {tr.astrology.shareResults}
                </Button>
                <Link to="/dashboard" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto border-teal-400/50 text-teal-300 hover:bg-teal-500/20 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium transition-all hover:scale-[1.02] touch-manipulation"
                  >
                    <Eye className="h-4 w-4 mr-1.5 sm:mr-2" />
                    {tr.astrology.viewDashboard}
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="grahveda-page relative z-10">

        {/* Back Button on Left Side */}
        <div className="container mx-auto px-4 pt-20 pb-4">
          <Link to="/">
            <Button
              variant="outline"
              className="border-amber-400/50 text-amber-300 hover:bg-orange-500/10 bg-white/10 rounded-lg px-4 py-2 text-sm font-medium"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              {tr.astrology.backHome}
            </Button>
              </Link>
        </div>

        {/* Enhanced Header */}
        <section className="pt-8 pb-12 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-8">
              <Badge
                variant="outline"
                className="mb-4 px-4 py-2 text-sm border-amber-400/50 text-amber-400 bg-orange-500/20 backdrop-blur-sm"
              >
                <Star className="h-3.5 w-3.5 mr-1.5" />
                {tr.astrology.badge}
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                Your{' '}
                <span 
                  className="inline-block"
                  style={{
                    background: 'linear-gradient(135deg, #a78bfa, #fbbf24, #60a5fa, #ec4899)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    backgroundSize: '200% 200%',
                    animation: 'gradient-shift 5s ease infinite',
                  }}
                >
                  {tr.astrology.titleHighlight}
                </span>
              </h1>
              <p className="text-sm text-gray-300 max-w-xl mx-auto">
                Get personalized astrological insights based on your birth chart and planetary alignments.
              </p>
              <style>{`
                @keyframes gradient-shift {
                  0%, 100% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                }
              `}</style>
            </div>
          </div>
        </section>

        {/* Enhanced Progress indicator - Centered with blank background */}
        <section className="pb-6 sm:pb-8 bg-transparent">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="max-w-4xl mx-auto bg-transparent">
              <div className="flex items-center justify-center mb-6 sm:mb-8 bg-transparent overflow-x-auto">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center bg-transparent">
                    <div className="flex flex-col items-center bg-transparent">
                    <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                        currentStep >= step.number
                            ? "border-amber-400 bg-gradient-to-br from-orange-500/30 to-orange-600/30 text-white shadow-md shadow-orange-500/30"
                            : "border-white/20 bg-white/5 text-gray-400"
                      }`}
                    >
                      {currentStep > step.number ? (
                          <CheckCircle className="h-5 w-5 text-amber-300" />
                      ) : (
                          <span className="font-bold text-base">{step.number}</span>
                      )}
                    </div>
                      <div className="mt-2 text-center bg-transparent">
                        <p className="text-xs font-medium text-white">{step.title}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                        {step.description}
                      </p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`h-0.5 w-12 sm:w-16 mx-2 sm:mx-3 transition-all duration-200 flex-shrink-0 ${
                          currentStep > step.number 
                            ? "bg-gradient-to-r from-orange-500 to-teal-500" 
                            : "bg-white/10"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Form steps */}
        <section className="pb-12 sm:pb-20 bg-transparent">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="max-w-2xl mx-auto">
              <Card className="glass-card border-orange-500/30 hover:border-amber-400/50 transition-all duration-200 hover:shadow-xl hover:shadow-orange-500/20 rounded-xl sm:rounded-2xl">
                <CardContent className="p-4 sm:p-6">
                  {error && (
                    <p className="mb-4 text-sm text-red-400 text-center">
                      {error}
                    </p>
                  )}

                  {currentStep === 1 && (
                    <div className="space-y-5">
                      <div className="text-center mb-6">
                        <h2 className="text-lg font-bold mb-2 text-white">
                          {tr.astrology.personalInfo}
                        </h2>
                        <p className="text-sm text-gray-300">
                          {tr.astrology.personalInfoSubtitle}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label 
                            htmlFor="name"
                            className="text-sm font-medium text-white mb-1.5 block"
                          >
                            {tr.astrology.fullName}
                          </Label>
                          <Input
                            id="name"
                            value={birthData.name}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                            placeholder={tr.astrology.fullNamePlaceholder}
                            className="bg-white/10 border-amber-400/30 text-white placeholder:text-gray-400 focus:border-amber-400 focus:ring-amber-400/50 rounded-lg text-sm"
                          />
                        </div>

                        <div>
                          <Label 
                            htmlFor="gender"
                            className="text-sm font-medium text-white mb-1.5 block"
                          >
                            {tr.astrology.gender}
                          </Label>
                          <Select
                            value={birthData.gender}
                            onValueChange={(value) =>
                              handleInputChange("gender", value)
                            }
                          >
                            <SelectTrigger className="bg-white/10 border-amber-400/30 text-white focus:border-amber-400 focus:ring-amber-400/50 rounded-lg text-sm">
                              <SelectValue placeholder={tr.astrology.genderPlaceholder} />
                            </SelectTrigger>
                            <SelectContent className="bg-[hsl(16_32%_9%)] border-amber-400/30">
                              <SelectItem value="Male">{tr.astrology.male}</SelectItem>
                              <SelectItem value="Female">{tr.astrology.female}</SelectItem>
                              <SelectItem value="Non-Binary">{tr.astrology.nonBinary}</SelectItem>
                              <SelectItem value="Prefer not to say">{tr.astrology.preferNotSay}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <p className="text-xs text-gray-400 pt-1">
                          {tr.astrology.consentText}
                        </p>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-5">
                      <div className="text-center mb-6">
                        <h2 className="text-lg font-bold mb-2 text-white">
                          {tr.astrology.birthDetails}
                        </h2>
                        <p className="text-sm text-gray-300">
                          {tr.astrology.birthDetailsSubtitle}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label
                            htmlFor="birthDate"
                            className="flex items-center gap-1.5 text-sm font-medium text-white mb-1.5"
                          >
                            <Calendar className="h-4 w-4 text-amber-300" />
                            {tr.astrology.birthDate}
                          </Label>
                          <Input
                            id="birthDate"
                            type="date"
                            value={birthData.birthDate}
                            onChange={(e) =>
                              handleInputChange("birthDate", e.target.value)
                            }
                            className="bg-white/10 border-amber-400/30 text-white focus:border-amber-400 focus:ring-amber-400/50 rounded-lg text-sm"
                          />
                        </div>

                        <div>
                          <Label
                            htmlFor="birthTime"
                            className="flex items-center gap-1.5 text-sm font-medium text-white mb-1.5"
                          >
                            <Clock className="h-4 w-4 text-amber-300" />
                            {tr.astrology.birthTime}
                          </Label>
                          <Input
                            id="birthTime"
                            type="time"
                            value={birthData.birthTime}
                            onChange={(e) =>
                              handleInputChange("birthTime", e.target.value)
                            }
                            className="bg-white/10 border-amber-400/30 text-white focus:border-amber-400 focus:ring-amber-400/50 rounded-lg text-sm"
                          />
                          <p className="text-xs text-gray-400 mt-1.5">
                            {tr.astrology.birthTimeHint}
                          </p>
                        </div>

                        <div>
                          <Label
                            htmlFor="birthPlace"
                            className="flex items-center gap-1.5 text-sm font-medium text-white mb-1.5"
                          >
                            <MapPin className="h-4 w-4 text-amber-300" />
                            {tr.astrology.birthPlace}
                          </Label>
                          <Input
                            id="birthPlace"
                            value={birthData.birthPlace}
                            onChange={(e) =>
                              handleInputChange("birthPlace", e.target.value)
                            }
                            placeholder={tr.astrology.birthPlacePlaceholder}
                            className="bg-white/10 border-amber-400/30 text-white placeholder:text-gray-400 focus:border-amber-400 focus:ring-amber-400/50 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-5">
                      <div className="text-center mb-6">
                        <h2 className="text-lg font-bold mb-2 text-white">
                          {tr.astrology.readingFocus}
                        </h2>
                        <p className="text-sm text-gray-300">
                          {tr.astrology.readingFocusSubtitle}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {[
                          {
                            id: "love",
                            label: tr.astrology.love,
                            icon: Heart,
                            color: "from-pink-500/30 to-rose-500/30",
                            borderColor: "border-pink-400/50",
                            iconColor: "text-pink-300",
                          },
                          {
                            id: "career",
                            label: tr.astrology.career,
                            icon: TrendingUp,
                            color: "from-green-500/30 to-emerald-500/30",
                            borderColor: "border-green-400/50",
                            iconColor: "text-green-300",
                          },
                          {
                            id: "health",
                            label: tr.astrology.health,
                            icon: Shield,
                            color: "from-teal-500/30 to-cyan-500/30",
                            borderColor: "border-teal-400/50",
                            iconColor: "text-teal-300",
                          },
                          {
                            id: "spiritual",
                            label: tr.astrology.spiritual,
                            icon: Eye,
                            color: "from-orange-500/30 to-teal-600/30",
                            borderColor: "border-amber-400/50",
                            iconColor: "text-amber-300",
                          },
                        ].map((focus) => {
                          const Icon = focus.icon;
                          const isActive = focusAreas.includes(focus.id);
                          return (
                            <div
                              key={focus.id}
                              className={`group p-3 border rounded-lg transition-all duration-200 cursor-pointer hover:scale-105 ${
                                isActive
                                  ? `bg-gradient-to-br ${focus.color} ${focus.borderColor} shadow-md`
                                  : "bg-white/5 border-white/10 hover:border-amber-400/50 hover:bg-white/10"
                              }`}
                              onClick={() => toggleFocusArea(focus.id)}
                            >
                              <div className={`p-2 rounded-md bg-gradient-to-br ${focus.color} ${focus.borderColor} mb-2 group-hover:scale-110 transition-transform inline-flex`}>
                                <Icon className={`h-4 w-4 ${focus.iconColor}`} />
                              </div>
                              <p className="font-medium text-white text-xs leading-tight">
                                {focus.label}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      <div>
                        <Label 
                          htmlFor="questions"
                          className="text-sm font-medium text-white mb-1.5 block"
                        >
                          {tr.astrology.specificQuestions}
                        </Label>
                        <Textarea
                          id="questions"
                          placeholder={tr.astrology.specificQuestionsPlaceholder}
                          rows={3}
                          value={birthData.questions}
                          onChange={(e) =>
                            handleInputChange("questions", e.target.value)
                          }
                          className="bg-white/10 border-amber-400/30 text-white placeholder:text-gray-400 focus:border-amber-400 focus:ring-amber-400/50 rounded-lg text-sm resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {isAnalyzing && (
                    <div className="text-center space-y-5 py-6">
                      <div className="p-4 rounded-full bg-gradient-to-br from-orange-500/20 to-teal-500/20 border border-amber-400/30 inline-flex">
                        <Sparkles className="h-10 w-10 text-amber-300 animate-spin" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold mb-2 text-white">
                          {tr.astrology.calculating}
                        </h2>
                        <p className="text-sm text-gray-300 mb-4">
                          {tr.astrology.calculatingSubtitle}
                        </p>
                        <div className="max-w-md mx-auto space-y-2">
                        <Progress
                          value={progress}
                            className="w-full h-2"
                        />
                          <p className="text-sm text-amber-300 font-medium">
                          {progress}% Complete
                        </p>
                      </div>
                      </div>
                      <div className="text-xs text-gray-400 space-y-1">
                        {progress < 25 && (
                          <p className="animate-pulse">{tr.astrology.mappingCoords}</p>
                        )}
                        {progress >= 25 && progress < 50 && (
                          <p className="animate-pulse">{tr.astrology.calculatingAspects}</p>
                        )}
                        {progress >= 50 && progress < 75 && (
                          <p className="animate-pulse">{tr.astrology.analyzingHouses}</p>
                        )}
                        {progress >= 75 && (
                          <p className="animate-pulse">{tr.astrology.generatingInsights}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {!isAnalyzing && (
                    <div className="flex justify-between items-center gap-3 pt-6 border-t border-white/10">
                      <Button
                        variant="outline"
                        onClick={() =>
                          setCurrentStep(Math.max(1, currentStep - 1))
                        }
                        disabled={currentStep === 1}
                        className="border-amber-400/50 text-amber-300 hover:bg-orange-500/20 bg-white/10 rounded-lg px-4 py-2 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                        {tr.astrology.previous}
                      </Button>
                      <Button
                        onClick={handleNext}
                        className="bg-gradient-to-r from-orange-600 via-teal-600 to-amber-600 hover:from-orange-700 hover:via-teal-700 hover:to-amber-700 text-white shadow-lg shadow-orange-500/30 rounded-lg px-6 py-2 text-sm font-medium transition-all hover:scale-[1.02]"
                      >
                        {currentStep === 3 ? (
                            <>{tr.astrology.generateReading}</>
                        ) : (
                            <>{tr.astrology.next}</>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AstrologyReading;
