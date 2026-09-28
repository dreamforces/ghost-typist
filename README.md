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

## Using the extensions

- `/date` then Tab types today's date; its format is under **/date** in Slash Commands → Options. A command
  works at the start of a line or after a space (`twelve apples /wc`).
- Your own commands are JavaScript in Slash Commands → Options: the body of `run(ctx)`. Words typed after the
  name reach it as `ctx.args`; `ctx.before` and `ctx.after` surround it; what it returns replaces the command.

  ```js
  // /wc sentences → "3 sentences"
  const unit = ctx.args || "words";
  const count = unit === "words" ? ghost.words(ctx.before).length : ghost.sentences(ctx.before).length;
  return count + " " + unit;
  ```

  An extension's own commands read the options it declares from `ctx.settings` instead, as `/date` does.
- `//note` then Tab: Compose writes the note as a message in the chosen tone (Friendly, Formal, Direct,
  Executive, the same as ⌘K Change Tone). It is a few sentences unless the note asks for a length:
  `//thank Rachel in a few paragraphs for coming yesterday`.
- Translate lists 11 languages; add any others Hy-MT2 supports by name, comma-separated.

## Adding or updating a package

1. Add or edit the file in `phrases/` or `extensions/`, and bump its `version` (x.y.z) on changes.
2. Run `python3 scripts/build-extension-index.py` at the repo root. It refuses a package on the wrong shelf.
3. Commit the package with the shelf's `index.json`. The app installs a package only if its SHA-256 matches.

## App updates

`appcast.xml` lists Ghost Typist releases, which are published as GitHub releases here by
`scripts/release.sh` in the app's source tree. Installed copies check it weekly, or on
Check for Updates, and verify each release's signature before installing it.
