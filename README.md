# Ghost Typist library

What Ghost Typist searches and installs from, plus the feed its updates come from.

- **Phrases** (in the app: Phrases → Library): packs of text you write often. Type the start, Tab fills in the rest.
- **Extensions** (in the app: Extensions → Library): change how suggestions are written, mark things in your writing, or add selection actions (rewrites on ⌘K, or whichever shortcut you set).

```
phrases/*.json          phrase packs (schema 1)
phrases/index.json      generated
extensions/*.json       extensions (schema 2)
extensions/index.json   generated
appcast.xml             app updates (written by the release script)
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
`checks` (literal phrases to mark, with a message and optional replacement) and `actions` (selection rewrites, ⌘K by default).
See `extensions/plain-english.json`. Extensions never contain phrases.

## Adding or updating a package

1. Add or edit the file in `phrases/` or `extensions/`, and bump its `version` (x.y.z) on changes.
2. Run `python3 scripts/build-extension-index.py` at the repo root. It refuses a package on the wrong shelf.
3. Commit the package with the shelf's `index.json`. The app installs a package only if its SHA-256 matches.

## App updates

`appcast.xml` lists Ghost Typist releases, which are published as GitHub releases here by
`scripts/release.sh` in the app's source tree. Installed copies check it weekly, or on
Check for Updates, and verify each release's signature before installing it.
