# Album scripts

Command line tools for getting photos onto the site. They run on your own machine, not on the server: resizing happens locally and files go straight to R2.

```bash
pnpm album new <folder>          # create an album from a folder of JPEGs
pnpm album add <slug> <folder>   # add photos to an album, skips ones already there
pnpm album password <slug>       # change an album's password
pnpm album publish <slug>        # make an album visible on the site
```

## Setup

These were built against my own Supabase project, and the database schema isn't included in this repo. The table shapes the scripts expect are in `src/types/database.types.ts`.

You need:

- Node 22.9 or newer
- pnpm
- Perl, on Linux and macOS only. It's used by exiftool and most systems already have it (`perl -v` to check). Windows doesn't need it.

Then:

1. `pnpm install`
2. Create a `.env.local` in the project root with these:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `SUPABASE_SECRET_KEY` | Supabase → Project Settings → API keys. The **secret** key (`sb_secret_...`), not the publishable one |
| `ENDPOINT` | `https://<account-id>.r2.cloudflarestorage.com`. Account ID is on the R2 overview page |
| `ACCESS_KEY_ID` | R2 → Manage API tokens → create a token |
| `SECRET_ACCESS_KEY` | Shown once when you create the token |
| `R2_BUCKET` | Name of the bucket |

The R2 token needs **Object Read & Write** on the bucket. Scope it to just that bucket.

If anything is missing, the script tells you which variable before doing anything else.

## Commands

### `pnpm album new <folder>`

Creates a new album from every `.jpg`/`.jpeg` in the folder. It asks for:

- **Name**, shown on the site
- **Slug**, the URL bit: `/albums/<slug>`. Letters, numbers and dashes, must be unused
- **Event date**, defaults to the date of the earliest photo
- **Password**, asked twice

The album is created unpublished, the photos upload, then it asks whether to publish. Nobody can see it until you say yes.

```bash
pnpm album new ~/Pictures/exports/jt-wedding
```

### `pnpm album add <slug> <folder>`

Uploads any photos in the folder that aren't in the album yet, matched by filename. Use it to add more photos later, or to finish an upload that stopped halfway. Works on published and unpublished albums.

```bash
pnpm album add jt-wedding ~/Pictures/exports/jt-wedding
```

### `pnpm album password <slug>`

Sets a new password. Everyone who unlocked the album with the old one is logged out and needs the new one.

### `pnpm album publish <slug>`

Publishes an album you didn't publish during `new`.

## What happens to each photo

1. A copy is made and **GPS location is removed** from it (EXIF and XMP). Capture time, camera, lens and everything else stays. The image isn't re-compressed, so the file is otherwise identical to your export.
2. Two smaller versions are made from that copy: an 800px thumbnail for the grid and a 2048px preview for viewing. These are WebP with no metadata at all.
3. All three go to R2:
   ```
   albums/<album id>/<filename>/original.jpg
   albums/<album id>/<filename>/preview.webp
   albums/<album id>/<filename>/thumbnail.webp
   ```
4. The photo is added to the database.

Your original files are never changed. Four photos upload at a time.

Photos are sorted by capture time, with filename as a tiebreak. Photos without a capture time go at the end. Adding photos later re-sorts the whole album, so they slot in at the right point.

## If something goes wrong

**Upload stopped halfway.** Run `pnpm album add` with the same slug and folder. Finished photos are skipped, and anything half done is redone. `new` prints the exact command if it fails.

**Replacing a photo** you re-edited and exported with the same filename: `add` skips it because the name already exists. Delete that row from the `photos` table first, then run `add`.

**Error messages.** The common setup mistakes say what to fix:

| Message | Fix |
|---|---|
| Missing environment variables | Add them to `.env.local` |
| Supabase rejected the key | Wrong `SUPABASE_SECRET_KEY` |
| Supabase denied access | You used the publishable key instead of the secret one |
| The database is missing a table or column | The database doesn't match what the script expects |
| R2 rejected the credentials | Wrong `ACCESS_KEY_ID` / `SECRET_ACCESS_KEY` |
| R2 bucket doesn't exist | Wrong `R2_BUCKET` |
| The R2 token can't write to this bucket | Give the token Object Read & Write |
| Couldn't reach ... | Wrong URL or endpoint, or you're offline |

Only JPEGs are picked up. Other files in the folder are listed and ignored.

## Code layout

```
scripts/
├── album.ts            entry point, checks env, picks the command
├── commands/           one file per command
└── lib/                the steps: finding photos, reading EXIF, stripping GPS,
                        resizing, uploading, sorting
```
