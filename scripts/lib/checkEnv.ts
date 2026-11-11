const REQUIRED_ENV = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SECRET_KEY",
  "ENDPOINT",
  "ACCESS_KEY_ID",
  "SECRET_ACCESS_KEY",
  "R2_BUCKET",
];

export function getMissingEnv() {
  return REQUIRED_ENV.filter((name) => !process.env[name]);
}
