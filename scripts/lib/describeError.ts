type ErrorLike = {
  name?: string;
  code?: string;
  message?: string;
};

// Turns the usual setup mistakes into something that says what to fix.
// Anything else falls through to the original message.
export function describeError(err: unknown) {
  const error = (err ?? {}) as ErrorLike;
  const message = error.message ?? String(err);

  if (error.name === "ExitPromptError") {
    return "Cancelled.";
  }

  if (error.name === "NoSuchBucket") {
    return `R2 bucket "${process.env.R2_BUCKET}" doesn't exist. Check R2_BUCKET.`;
  }

  if (error.name === "Unauthorized" || error.name === "SignatureDoesNotMatch" || error.name === "InvalidAccessKeyId") {
    return "R2 rejected the credentials. Check ACCESS_KEY_ID and SECRET_ACCESS_KEY.";
  }

  if (error.name === "AccessDenied") {
    return "The R2 token can't write to this bucket. It needs \"Object Read & Write\" permission.";
  }

  if (error.code === "ENOTFOUND") {
    return `Couldn't reach ${message.split(" ").pop()}. Check ENDPOINT and your internet connection.`;
  }

  if (message.includes("Invalid API key")) {
    return "Supabase rejected the key. Check SUPABASE_SECRET_KEY.";
  }

  if (error.code === "42501") {
    return "Supabase denied access. SUPABASE_SECRET_KEY needs to be the secret key, not the publishable one.";
  }

  if (error.code === "42703" || error.code === "PGRST204" || error.code === "PGRST205") {
    return `The database is missing a table or column (${message}).`;
  }

  if (message.includes("fetch failed")) {
    return "Couldn't reach Supabase. Check NEXT_PUBLIC_SUPABASE_URL and your internet connection.";
  }

  return message;
}
