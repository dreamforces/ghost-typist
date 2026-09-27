# Ghost Typist library

What Ghost Typist searches and installs from, plus the signed app info it checks weekly.

- **Phrases** (in the app: Phrases → Library): packs of text you write often. Type the start, Tab fills in the rest.
- **Extensions** (in the app: Extensions → Library): change how suggestions are written, mark things in your writing, or add ⌘K rewrites.

```
phrases/*.json          phrase packs (schema 1)
phrases/index.json      generated
extensions/*.json       extensions (schema 2)
extensions/index.json   generated
apps.json(.sig)         app notes and reading kinds, signed
scripts/                index builder
```

Packages are data only: no code, network or storage access. Every install shows a review sheet first,
including any prompt text word for word.

## Phrase packs

```json
{ "schemaVersion": 1, "id": "you.team-replies", "name": "Team replies", "version": "1.0.0",
  "author": "You", "description": "Replies we send every day.",
  "phrases": [ { "trigger": "Thanks for", "completion": " the quick turnaround!" } ] }
```

Up to 500 phrases; triggers 2–160 characters, completions 1–160. See `phrases/`.

## Extensions

Schema 2 with any of `prompt` (a style added to every suggestion request, optionally only in some apps),
`checks` (literal phrases to mark, with a message and optional replacement) and `actions` (⌘K rewrites).
See `extensions/plain-english.json`. Extensions never contain phrases.

## Adding or updating a package

1. Add or edit the file in `phrases/` or `extensions/`, and bump its `version` (x.y.z) on changes.
2. Run `python3 scripts/build-extension-index.py` at the repo root. It refuses a package on the wrong shelf.
3. Commit the package with the shelf's `index.json`. The app installs a package only if its SHA-256 matches.

## App info (`apps.json`)

Tells Ghost Typist which apps need a particular way of reading text, with a note shown in
Applications. Entries replace the app's built-in ones with the same `match`:

```json
{ "version": 2, "apps": [
  { "match": "com.example.App", "kind": "unsupported", "note": "Shown on hover and in the ⓘ popover." },
  { "match": "example.com/board/", "kind": "canvas" }
] }
```

`match` is a bundle ID, or a web page as host and path prefix. `kind` is `canvas` (read from the
screen), `document` (Office/iWork-style document mode), `unsupported` or `info`. Unknown kinds are
skipped by older app versions.

To publish: bump `version`, then sign from the Ghost Typist source tree
(`swift scripts/sign-app-profiles.swift /path/to/apps.json`), and commit `apps.json` and
`apps.json.sig` together. The app ignores a file whose signature doesn't match its built-in key.
