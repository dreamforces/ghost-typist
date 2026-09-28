# Ghost Typist library

What Ghost Typist searches and installs from, plus the feed its updates come from.

- **Phrasebooks** (in the app: Phrasebooks → Library): a field and its terms, given to the writing model so suggestions use that field's words.
- **Extensions** (in the app: Extensions → Library): `/commands`, abbreviations, `//note` compose, spelling and grammar marks, and ⌘K actions. Each declares its own options.

```
phrases/*.json          phrasebooks (schema 3)
phrases/index.json      generated
extensions/*.js         extensions, one JavaScript file each
extensions/index.json   generated
appcast.xml             app updates (written by the release script)
scripts/                index builder
```

The app ships none of these. Every install shows a review sheet first, including any prompt text word for
word. Scripts run in a sandbox with no files, network or keys. The guide is [EXTENSIONS.md](EXTENSIONS.md).

## Adding or updating a package

1. Add or edit the file in `phrases/` or `extensions/`, and bump its `version` (x.y.z) on changes.
2. Run `python3 scripts/build-extension-index.py` at the repo root. It refuses a package on the wrong shelf.
3. Commit the package with the shelf's `index.json`. The app installs a package only if its SHA-256 matches.

## App updates

`appcast.xml` lists Ghost Typist releases, which are published as GitHub releases here by
`scripts/release.sh` in the app's source tree. Installed copies check it weekly, or on
Check for Updates, and verify each release's signature before installing it.
