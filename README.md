# Ghost Typist library

What Ghost Typist searches and installs from, plus the feed its updates come from.

- **Phrasebooks** (in the app: Phrasebooks → Library): a field and its terms, given to the writing model so suggestions use that field's words.
- **Extensions** (in the app: Extensions → Library): `/commands` (one extension each, named in its options), abbreviations, `//note` compose, spelling and grammar marks, and ⌃⌘/ actions. Each declares its own options.

```
phrases/*.json          phrasebooks (schema 3)
phrases/index.json      generated
extensions/*.js         extensions, one JavaScript file each
extensions/index.json   generated
appcast.xml             app updates (written by the release script)
scripts/                index builder
```

The app ships none of these. Allow third-party extensions, at the top of the Extensions page, asks once; until then search and install stay off. After that an install is one click, and Details shows what a
package adds, including any prompt text word for word. Scripts run in a sandbox with no files or keys. A script uses the network only after you allow that one to. The catalog, the phrasebooks, and the API are in [EXTENSIONS.md](EXTENSIONS.md).

## Adding or updating a package

1. Add or edit the file in `phrases/` or `extensions/`, and bump its `version` (x.y.z) on changes.
2. Run `python3 scripts/build-extension-index.py` at the repo root. It refuses a package on the wrong shelf.
3. Commit the package with the shelf's `index.json`. The app installs a package only if its SHA-256 matches.

## App updates

`appcast.xml` lists Ghost Typist releases, which are published as GitHub releases here by
`scripts/release.sh` in the app's source tree. Installed copies check it weekly, or on
Check for Updates, and verify each release's signature before installing it.
