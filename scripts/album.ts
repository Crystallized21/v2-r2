import { exiftool } from "exiftool-vendored";
import { getMissingEnv } from "./lib/checkEnv";
import { describeError } from "./lib/describeError";

const USAGE = `Usage:
  pnpm album new <folder>          create an album from a folder of JPEGs
  pnpm album add <slug> <folder>   add photos to an album (skips ones already there)
  pnpm album password <slug>       change an album's password
  pnpm album publish <slug>        make an album visible on the site

See scripts/README.md for setup.`;

function isValidCommand(command: string | undefined, args: string[]) {
  if (command === "new") return args.length === 1;
  if (command === "add") return args.length === 2;
  if (command === "password") return args.length === 1;
  if (command === "publish") return args.length === 1;
  return false;
}

async function main() {
  const [command, ...args] = process.argv.slice(2);

  if (!isValidCommand(command, args)) {
    console.log(USAGE);
    process.exitCode = 1;
    return;
  }

  const missing = getMissingEnv();

  if (missing.length > 0) {
    console.error(`Missing environment variables:\n  ${missing.join("\n  ")}\n\nAdd them to .env.local, see scripts/README.md.`);
    process.exitCode = 1;
    return;
  }

  // imported after the env check because they set up the Supabase and R2 clients on load
  if (command === "new") {
    const { createAlbum } = await import("./commands/createAlbum");
    await createAlbum(args[0]);
  } else if (command === "add") {
    const { addPhotos } = await import("./commands/addPhotos");
    await addPhotos(args[0], args[1]);
  } else if (command === "password") {
    const { setPassword } = await import("./commands/setPassword");
    await setPassword(args[0]);
  } else if (command === "publish") {
    const { publishAlbum } = await import("./commands/publishAlbum");
    await publishAlbum(args[0]);
  }
}

main()
  .catch((err) => {
    console.error(describeError(err));
    process.exitCode = 1;
  })
  // exiftool runs as a background process, the script hangs until it's closed
  .finally(() => exiftool.end());
