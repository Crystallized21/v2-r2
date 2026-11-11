# crystal's spectra vault

my photo site for sharing albums with clients. every album has its own password, the photos live in a private cloudflare r2 bucket, and nothing leaves that bucket until someone has unlocked the album.

this is a rewrite of my old site. the old one worked, but this time i wanted the security to actually hold up and the code to still make sense when i come back to it in six months.

## what it does

- the home page lists albums, newest first, grouped by date
- each album asks for its password, then shows a masonry grid and a lightbox with zoom
- download a single photo from the lightbox, or the whole album as one zip
- an unlocked album stays open on that browser for 4 hours

## stack

next.js 16 (app router, server actions) · react 19 with the react compiler · tailwind 4 · supabase (postgres) · cloudflare r2 · sentry · vercel

## how it works

### unlocking an album

```
password form ─► server action
                   ├─ rate limit: 5 tries per visitor per album, then 15 min lockout
                   ├─ argon2id verify against the stored hash
                   └─ set a signed cookie ─► page re-renders and shows the gallery
```

- the password is only ever checked on the server. the browser never sees the hash
- the cookie is a signed token (`jose`, hs256) holding the album id, a password version and an expiry. httponly, so javascript can't read it, and it never contains the password
- every album has a `password_version`. changing a password bumps it, which logs out everyone who unlocked it with the old one
- attempts are counted in one postgres statement, so firing off requests in parallel doesn't get you extra guesses. ips are stored as an hmac hash, never raw
- a cron job clears out old attempt rows every night

### getting photos to people

- the bucket is private. the server signs short-lived urls, and only after checking the cookie for that exact album
- urls are signed from the start of the hour, so the same photo has the same url for that hour and the browser can cache it
- the grid loads 800px thumbnails, the lightbox loads 2048px previews, and originals are only signed when someone clicks download (through a route that checks the session first, then redirects to a 60 second link)
- photo bytes go straight from r2 to the browser and never pass through vercel
- if a tab is left open long enough for the urls to expire, coming back to it quietly fetches fresh ones. failed images get reported to sentry with enough context to tell an expired url from anything else

### the database

- row level security is on with no policies, so the public supabase key can't read anything at all. the server uses the secret key, and `server-only` makes the build fail if that code ever ends up in the browser
- something i learned the hard way: rls filters rows, not columns. my first policy let published albums be read publicly, which also meant their password hashes were readable. that's why there are no policies now

### caching

both pages render on every request. the home page so a newly published album shows up straight away, and album pages because they depend on the session cookie. i tried next's cache components for the home page, but for a site this small the speedup wasn't worth the extra rules it puts on every page, or losing real 404s on missing albums.

### uploading

photos go up with a small cli i run on my own machine, not through the site:

```bash
pnpm album new ~/exports/some-album
```

it strips gps from every photo (capture time and camera info stay), makes the thumbnails and previews with sharp, uploads everything to r2, sorts by capture time and builds the "download all" zip. full details in [scripts/README.md](scripts/README.md).

## project layout

```
src/
├── app/                  routes, plus the two api routes for downloads
├── components/
│   ├── home/             album list
│   ├── unlock/           password form
│   └── gallery/          grid, lightbox, download button
└── lib/
    ├── albums/           which albums exist
    ├── access/           who can open them: sessions, rate limiting
    ├── photos/           signing urls, downloads, zips
    └── clients/          supabase + r2

scripts/                  the upload cli
supabase/migrations/      changes i've made to the database
```

## running it locally

```bash
pnpm install
pnpm dev
```

it needs a `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SECRET_KEY=
ENDPOINT=                 # https://<account-id>.r2.cloudflarestorage.com
ACCESS_KEY_ID=
SECRET_ACCESS_KEY=
R2_BUCKET=
ALBUM_SESSION_SECRET=     # 32+ random bytes, e.g. openssl rand -base64 32
SENTRY_AUTH_TOKEN=
```

heads up: this runs against my own supabase project and the full schema isn't in the repo, so it won't work out of the box. the table shapes are in `src/types/database.types.ts` if you're curious.

other commands:

```bash
pnpm lint
pnpm build
pnpm generate:types       # regenerate database types from supabase
```
