import { BRAND } from "./brand";

export const APP_CONFIG = {
  NAME: BRAND.NAME,
  VERSION: "1.0.0",
  ENVIRONMENT: import.meta.env.MODE,
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
} as const;

export const FEATURES = {
  MOCK_API: true,
  ANALYTICS: false,
  PAYMENTS: import.meta.env.VITE_ENABLE_PAYMENTS === "true",
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: "alphaastro_token",
  REFRESH_TOKEN: "alphaastro_refresh_token",
  USER_DATA: "alphaastro_user",
  SETTINGS: "alphaastro_settings",
  READINGS: "alphaastro_readings",
} as const;

export default APP_CONFIG;
