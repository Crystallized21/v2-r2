import { password } from "@inquirer/prompts";
import { hash } from "@node-rs/argon2";

// same settings as the existing albums, argon2id is the default algorithm
const HASH_OPTIONS = { memoryCost: 32768, timeCost: 3, parallelism: 1 };

export async function askPasswordHash() {
  const first = await password({
    message: "Album password:",
    mask: "*",
    validate: (value) => value.length >= 4 || "At least 4 characters",
  });

  const second = await password({ message: "Same again:", mask: "*" });

  if (first !== second) {
    throw new Error("Passwords didn't match");
  }

  return hash(first, HASH_OPTIONS);
}
