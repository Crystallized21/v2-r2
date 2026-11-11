// Plain values with no server imports, so the password form can show them too.

// how long an unlocked album stays open
export const SESSION_HOURS = 4;

// wrong passwords allowed per visitor per album, before a lockout of WINDOW_MINUTES
export const MAX_ATTEMPTS = 5;
export const WINDOW_MINUTES = 15;
