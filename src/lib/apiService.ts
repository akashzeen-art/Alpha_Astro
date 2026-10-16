import { STORAGE_KEYS } from "./config";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  phone_number?: string;
  birth_date?: string;
  birth_time?: string;
  birth_place?: string;
  gender?: string;
  timezone: string;
  current_plan: string;
  subscription_status: string;
  subscription_start?: string;
  subscription_end?: string;
  total_readings: number;
  accuracy_score: number;
  favorite_reading_type?: string;
  member_since: string;
  email_notifications: boolean;
  daily_horoscope: boolean;
  marketing_emails: boolean;
  profile_visibility: string;
  is_premium: boolean;
  readings_this_month: number;
  date_joined: string;
  last_login?: string;
}

export interface Reading {
  id: string;
  user: string;
  type: "palm_analysis" | "astrology_reading" | "numerology";
  status: "pending" | "analyzing" | "completed" | "failed";
  accuracy: number;
  created_at: string;
  updated_at: string;
  results?: any;
  insights?: number;
}

export interface PalmAnalysisLine {
  quality: string;
  score: number;
  meaning: string;
  details: string;
}

export interface PalmAnalysisTrait {
  name: string;
  score: number;
  description: string;
}

export interface PalmAnalysisPrediction {
  area: string;
  timeframe: string;
  prediction: string;
  confidence: number;
  advice?: string;
}

export type PalmAnalysisImpactLevel = "High" | "Medium" | "Low";

export interface PalmAnalysisSpecialMark {
  name: string;
  location?: string;
  meaning: string;
  significance: PalmAnalysisImpactLevel;
}

export interface PalmAnalysisCompatibility {
  type: string;
  match: number;
  description: string;
}

export interface PalmAnalysisAccuracy {
  lineDetection: number;
  patternAnalysis: number;
  interpretation: number;
  overall: number;
}

export interface PalmAnalysisResult {
  overallScore: number;
  lines: {
    lifeLine: PalmAnalysisLine;
    heartLine: PalmAnalysisLine;
    headLine: PalmAnalysisLine;
    fateLine: PalmAnalysisLine;
  };
  personality: {
    traits: PalmAnalysisTrait[];
    dominantHand: string;
    palmShape: string;
    fingerLength: string;
    handType: string;
    thumbShape?: string;
    mounts?: Record<string, { development: string; meaning: string }>;
    handTypeAnalysis?: string;
  };
  predictions: PalmAnalysisPrediction[];
  specialMarks: PalmAnalysisSpecialMark[];
  compatibility: PalmAnalysisCompatibility[];
  accuracy: PalmAnalysisAccuracy;
  summary: string;
  modelVersion: string;
}

export interface PalmReading extends Reading {
  type: "palm_analysis";
  image_url?: string;
  upload_id?: string;
  results?: PalmAnalysisResult;
}

export interface AstrologyReading extends Reading {
  type: "astrology_reading";
  birth_data?: {
    date: string;
    time: string;
    place: string;
    timezone: string;
  };
  birth_chart?: any;
}

export interface NumerologyApiResult {
  lifePathNumber: number;
  destinyNumber: number;
  soulNumber: number;
  personalityNumber: number;
  luckyNumbers?: number[];
  interpretation?: string;
  personality?: string;
  strengths?: string[];
  challenges?: string[];
  compatibility?: string[];
  yearPrediction?: string;
  monthPrediction?: string;
  title?: string;
  career_path?: string;
  love_insights?: string;
  lucky_color?: string;
  element?: string;
  traits?: string[];
}

export interface DashboardPrediction {
  area: string;
  timeframe: string;
  prediction: string;
  confidence: number;
}

export interface DashboardData {
  recent_readings: Reading[];
  weekly_activity: Array<{ day: string; readings: number; accuracy: number }>;
  spiritual_progress: Array<{ name: string; value: number; color: string }>;
  user_stats: {
    total_readings: number;
    readings_this_month: number;
    readings_this_week: number;
    average_accuracy: number;
    favorite_reading_type: string;
    member_since: string;
    subscription_days_left: number;
    last_reading_date: string;
    total_insights_generated: number;
  };
  upcoming_predictions?: DashboardPrediction[];
}

// ─── Local storage helpers ────────────────────────────────────────────────────

function loadLocalReadings(): Reading[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.READINGS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalReadings(readings: Reading[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.READINGS, JSON.stringify(readings));
  } catch {
    // storage full — ignore
  }
}

// ─── Mock data ────────────────────────────────────────────────────────────────

function getMockPalmResult(): PalmAnalysisResult {
  return {
    overallScore: 94,
    lines: {
      lifeLine: { quality: "Strong", score: 92, meaning: "Excellent vitality and long life", details: "Your life line is deep and well-formed, indicating robust health and strong life force." },
      heartLine: { quality: "Curved", score: 88, meaning: "Emotional and expressive in love", details: "Your heart line curves upward, showing you're a romantic at heart." },
      headLine: { quality: "Clear", score: 96, meaning: "Sharp intellect and analytical mind", details: "A clear, straight head line indicates logical thinking and excellent problem-solving abilities." },
      fateLine: { quality: "Present", score: 85, meaning: "Strong sense of purpose and direction", details: "Your fate line suggests you have a clear life direction and will achieve your goals." },
    },
    personality: {
      traits: [
        { name: "Leadership", score: 93, description: "Natural ability to guide and inspire others" },
        { name: "Creativity", score: 87, description: "Strong artistic and innovative tendencies" },
        { name: "Intuition", score: 91, description: "Excellent instincts and gut feelings" },
        { name: "Communication", score: 84, description: "Good at expressing ideas and connecting with people" },
        { name: "Determination", score: 96, description: "Persistent and goal-oriented nature" },
      ],
      dominantHand: "Right",
      palmShape: "Square",
      fingerLength: "Balanced",
      handType: "Earth",
    },
    predictions: [
      { area: "Career", timeframe: "Next 6 months", prediction: "Significant professional advancement on the horizon. Your leadership qualities will be recognized.", confidence: 89, advice: "Take on challenging projects and showcase your problem-solving skills." },
      { area: "Relationships", timeframe: "Next 3 months", prediction: "A meaningful connection will enter your life. Existing relationships will deepen.", confidence: 82, advice: "Be open to new social situations and express your emotions honestly." },
      { area: "Health", timeframe: "Ongoing", prediction: "Overall excellent health with strong vitality. Minor stress-related concerns possible.", confidence: 94, advice: "Maintain regular exercise and consider meditation for stress management." },
      { area: "Finances", timeframe: "Next year", prediction: "Financial growth through career advancement. Investment opportunities will arise.", confidence: 78, advice: "Focus on long-term planning and avoid impulsive financial decisions." },
    ],
    specialMarks: [
      { name: "Star on Mount of Apollo", meaning: "Creative success and recognition", significance: "High" },
      { name: "Triangle on Mount of Jupiter", meaning: "Leadership abilities and wisdom", significance: "Medium" },
      { name: "Cross on Mount of Mercury", meaning: "Communication challenges to overcome", significance: "Low" },
    ],
    compatibility: [
      { type: "Earth Hands", match: 94, description: "Practical and grounded individuals" },
      { type: "Fire Hands", match: 87, description: "Energetic and passionate personalities" },
      { type: "Water Hands", match: 76, description: "Emotional and intuitive types" },
      { type: "Air Hands", match: 82, description: "Intellectual and communicative people" },
    ],
    accuracy: { lineDetection: 0.98, patternAnalysis: 0.96, interpretation: 0.94, overall: 0.96 },
    summary: "Your palm indicates strong vitality, sharp intellect, emotional depth, and a purposeful life path with high potential for creative and professional success.",
    modelVersion: "palm-ai-v1-local",
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── Service ──────────────────────────────────────────────────────────────────

class PalmAstroAPIService {
  // Auth — purely local, no network
  async login(email: string, _password: string): Promise<{ user: User; accessToken: string }> {
    await delay(600);
    const user = this._buildUser(email);
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, "local_token");
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    return { user, accessToken: "local_token" };
  }

  async signup(payload: {
    full_name: string;
    email: string;
    password: string;
    confirm_password: string;
    accepted_terms: boolean;
    subscribe_newsletter?: boolean;
  }): Promise<{ user: User; accessToken: string }> {
    await delay(600);
    if (payload.password !== payload.confirm_password) throw new Error("Passwords do not match.");
    if (payload.password.length < 8) throw new Error("Password must be at least 8 characters.");
    if (!payload.accepted_terms) throw new Error("You must accept the Terms of Service.");
    const user = this._buildUser(payload.email, payload.full_name);
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, "local_token");
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    return { user, accessToken: "local_token" };
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }

  // Palm analysis — fully local, no network
  async analyzePalmImage(_file: File): Promise<{ success: boolean; reading_id: string; result: PalmAnalysisResult }> {
    await delay(3000);
    return { success: true, reading_id: `palm_${Date.now()}`, result: getMockPalmResult() };
  }

  // Numerology — computed locally, no network
  async createNumerologyReading(fullName: string, birthDate: string): Promise<NumerologyApiResult> {
    await delay(1500);
    const lp = this._calcLifePath(birthDate);
    const destiny = this._calcDestiny(fullName);
    const soul = this._calcSoul(fullName);
    const personality = this._calcPersonality(fullName);
    return {
      lifePathNumber: lp,
      destinyNumber: destiny,
      soulNumber: soul,
      personalityNumber: personality,
      luckyNumbers: [lp, (lp * 2 > 9 ? this._reduce(lp * 2) : lp * 2), (lp * 3 > 9 ? this._reduce(lp * 3) : lp * 3)],
    };
  }

  // Dashboard — built from local readings
  async getDashboardData(): Promise<DashboardData> {
    await delay(300);
    const readings = loadLocalReadings();
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return {
      recent_readings: readings.slice(0, 10),
      weekly_activity: days.map((day) => ({ day, readings: 0, accuracy: 0 })),
      spiritual_progress: [
        { name: "Self-Awareness", value: 85, color: "#8852E0" },
        { name: "Intuition", value: 78, color: "#7575F0" },
        { name: "Spiritual Growth", value: 92, color: "#D4AF37" },
        { name: "Inner Peace", value: 67, color: "#9F7AEA" },
      ],
      user_stats: {
        total_readings: readings.length,
        readings_this_month: readings.length,
        readings_this_week: Math.min(readings.length, 3),
        average_accuracy: readings.length > 0 ? Math.round(readings.reduce((s, r) => s + r.accuracy, 0) / readings.length) : 0,
        favorite_reading_type: readings.length > 0 ? (readings[0].type === "palm_analysis" ? "Palm Analysis" : readings[0].type === "astrology_reading" ? "Astrology Reading" : "Numerology") : "Palm Analysis",
        member_since: new Date().toISOString(),
        subscription_days_left: 30,
        last_reading_date: readings.length > 0 ? readings[0].created_at : "",
        total_insights_generated: readings.length * 8,
      },
      upcoming_predictions: readings.length > 0 ? [
        { area: "Career", timeframe: "Next 2 months", prediction: "Major opportunity approaching", confidence: 87 },
        { area: "Love", timeframe: "Next 3 weeks", prediction: "New meaningful connection likely", confidence: 82 },
      ] : [],
    };
  }

  // Save reading to local storage
  async saveReading(data: {
    reading_type: "palm_analysis" | "numerology" | "astrology_reading";
    result: any;
    accuracy?: number;
    source_id?: string;
    palm_reference_id?: string;
  }): Promise<{ success: boolean; message: string; data: any }> {
    const readings = loadLocalReadings();
    const reading: Reading = {
      id: data.source_id || `${data.reading_type}_${Date.now()}`,
      user: "local",
      type: data.reading_type,
      status: "completed",
      accuracy: data.accuracy ?? 90,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      results: data.result,
    };
    // Avoid duplicates
    const exists = readings.findIndex((r) => r.id === reading.id);
    if (exists >= 0) readings[exists] = reading;
    else readings.unshift(reading);
    saveLocalReadings(readings);
    return { success: true, message: "Saved locally", data: reading };
  }

  async getReadings(limit = 20, offset = 0): Promise<{ count: number; next: null; previous: null; results: Reading[] }> {
    const all = loadLocalReadings();
    const results = all.slice(offset, offset + limit);
    return { count: all.length, next: null, previous: null, results };
  }

  async getLatestPalmReadingId(): Promise<string | null> {
    const readings = loadLocalReadings();
    return readings.find((r) => r.type === "palm_analysis")?.id ?? null;
  }

  // ─── Private helpers ────────────────────────────────────────────────────────

  private _buildUser(email: string, fullName?: string): User {
    const parts = (fullName || email.split("@")[0]).split(" ");
    return {
      id: "local_user",
      email,
      username: email.split("@")[0],
      first_name: parts[0] || "User",
      last_name: parts[1] || "",
      timezone: "UTC",
      current_plan: "stellar_seeker",
      subscription_status: "active",
      total_readings: loadLocalReadings().length,
      accuracy_score: 94,
      member_since: new Date().toISOString(),
      email_notifications: true,
      daily_horoscope: true,
      marketing_emails: false,
      profile_visibility: "private",
      is_premium: false,
      readings_this_month: 0,
      date_joined: new Date().toISOString(),
    };
  }

  private _reduce(n: number): number {
    while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
      n = String(n).split("").reduce((s, d) => s + parseInt(d), 0);
    }
    return n;
  }

  private _calcLifePath(birthDate: string): number {
    const digits = birthDate.replace(/-/g, "").split("").map(Number);
    return this._reduce(digits.reduce((s, d) => s + d, 0));
  }

  private _calcDestiny(name: string): number {
    const map: Record<string, number> = { a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8 };
    const sum = name.toLowerCase().replace(/[^a-z]/g, "").split("").reduce((s, c) => s + (map[c] || 0), 0);
    return this._reduce(sum);
  }

  private _calcSoul(name: string): number {
    const map: Record<string, number> = { a:1,e:5,i:9,o:6,u:3 };
    const sum = name.toLowerCase().split("").filter(c => "aeiou".includes(c)).reduce((s, c) => s + (map[c] || 0), 0);
    return this._reduce(sum);
  }

  private _calcPersonality(name: string): number {
    const map: Record<string, number> = { b:2,c:3,d:4,f:6,g:7,h:8,j:1,k:2,l:3,m:4,n:5,p:7,q:8,r:9,s:1,t:2,v:4,w:5,x:6,y:7,z:8 };
    const sum = name.toLowerCase().replace(/[^a-z]/g, "").split("").filter(c => !"aeiou".includes(c)).reduce((s, c) => s + (map[c] || 0), 0);
    return this._reduce(sum);
  }
}

export const apiService = new PalmAstroAPIService();
export default apiService;

// Keep resolveApiUrl as a no-op for any remaining imports
export function resolveApiUrl(path: string): string { return path; }
