# Ghost Typist library

What Ghost Typist searches and installs from, plus the feed its updates come from.

- **Phrasebooks** (in the app: Phrasebooks → Library): a field and its terms, given to the writing model so suggestions use that field's words.
- **Extensions** (in the app: Extensions → Library): `/commands` (one extension each, named in its options), abbreviations, `//note` compose, spelling and grammar marks, and ⌘K actions. Each declares its own options.

```
phrases/*.json          phrasebooks (schema 3)
phrases/index.json      generated
extensions/*.js         extensions, one JavaScript file each
extensions/index.json   generated
appcast.xml             app updates (written by the release script)
scripts/                index builder
```

The app ships none of these. Installing a script asks once (Allow third-party extensions); after that it is one click, and Details shows what a
package adds, including any prompt text word for word. Scripts run in a sandbox with no files, network or keys. The guide is [EXTENSIONS.md](EXTENSIONS.md).

## Using the extensions

- Slash commands: install one extension per command (`date`, `time`, `random`, `uuid`, `dice`, `coin`, `password`,
  `base64`, `encode`, `decode`, `title`, `snake`, `pascal`, `caps`, `lower`, `latin`). The name you type after the
  `/` is the first option of each one, so `/date` can be `/d`, or both (`date, d`); the others are what suits the
  command: a date format, a number range, a password's length and characters. Type `/` for the list, ↑↓ to
  browse, Tab to complete a name and close the list, and Tab again to run it. On a whole name Tab runs a command
  that needs nothing more and only closes the list for one that needs words after it (`/base64 hello`).
  Words after the name override its options for that one use: `/password 24 special`, `/random 3-9`, `/time 24`.
  A command works at the start of a line or after a space (`twelve apples /wc`).
- `//note` then Tab: Compose is a slash command too, and its name is an option (the default is a second `/`; make it `write` for `/write`). It writes the note as a message in the chosen tone (Friendly, Formal, Direct,
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
