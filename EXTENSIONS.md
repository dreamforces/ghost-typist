# Writing extensions and phrasebooks

Ghost Typist ships no extensions. Everything comes from the library at
[dreamforces/ghost-typist](https://github.com/dreamforces/ghost-typist), or from a file, and every install
shows a review sheet first.

- **Extensions** are one JavaScript file each: `/commands`, abbreviations, `//note` compose, proofreading
  marks, a prompt style, and ⌘K actions. Each one declares its own options; the app draws them in
  **Extensions → Options…**.
- **Phrasebooks** are JSON: a field (“Payment systems”) and its terms. They tell the writing model what the
  writer works on, so a plain sentence is continued in that field's words.

## Extensions

The first line is a header the library index reads. The rest calls `ghost.define` once, with the same
identity.

```js
// ghost {"id":"you.commands","name":"My Commands","version":"1.0.0","author":"You","description":"Word count.","capabilities":["1 command"]}
ghost.define({
  id: "you.commands", name: "My Commands", version: "1.0.0", author: "You", description: "Word count.",
  settings: [
    { id: "unit", title: "Say", type: "choice", options: ["words", "Wörter"], value: "words" }
  ],
  commands: {
    wc: { title: "Word count", run(ctx) { return ghost.words(ctx.text).length + " " + ctx.settings.unit } }
  }
})
```

### Settings

Every option lives in the script. `settings` is a list of `{ id, title, type, value, help?, options?, columns? }`.
`value` is the default; what the user sets in Options replaces it, and a saved value that no longer fits
falls back to the default. Ids are lowercase letters, digits and `-`.

| type | value | Options shows |
|---|---|---|
| `text` | string, up to 500 characters | a text field |
| `number` | integer 0–100000 | a stepper |
| `toggle` | `true` / `false` | a checkbox |
| `choice` | one of `options` | a pop-up menu |
| `choices` | a subset of `options` | checkboxes |
| `list` | rows `{ columnId: string }` | a table; a column with `code: true` is a JavaScript editor |

Hooks receive the current values as `settings` (or `ctx.settings`), keyed by id.

### What an extension can do

- `commands: { name: { title, run(ctx) } }`: Tab on a line that is only `/name` replaces that line with
  what `run` returns (a string or number). `ctx.text` is everything else typed, `ctx.before` and `ctx.after`
  surround the line.
- `commandsFrom: "<list setting>"`: the user writes more commands in Options. The list has a `name` column
  and a `run` code column holding a function body, e.g. `return ctx.text.length + " characters"`.
- `expansionsFrom: "<list setting>"`: a list with `trigger` and `text` columns. When the whole word before
  the caret is a trigger, its text is offered, and Tab replaces the trigger with it.
- `compose: { instruction }`: Tab on `//note` asks the writing model to turn the note into a message.
  `{setting-id}` in the instruction is replaced with that setting's value. The note is framed as something
  to write, never a question to answer.
- `analyze(text, settings)`: marks spans with `ghost.mark(span, message, { replacement?, action?, kind? })`.
  `kind` is `spelling` or `grammar` for those colours. It runs per paragraph, in the background, after you
  pause; unchanged paragraphs are not analyzed again.
- `style: { instruction, vocabulary?, apps? }`: added to every suggestion request (or those in `apps`).
- `actions: [{ id, title, instruction, arguments? | argumentsFrom?, symbol? }]`: ⌘K rewrites.
  `{argument}` is the submenu choice; `argumentsFrom` names a `choices` setting.
- `model: { name, repository, revision, file, bytes, sha256 }`: a pinned Hugging Face GGUF the actions run
  on. The app downloads it into the Hugging Face cache; the script never names a URL.

### What `ghost` offers

`ghost.words(text)`, `ghost.sentences(text)`, `ghost.repetitions(text)`, `ghost.passive(text)` and
`ghost.proofread(text)` return spans `{ text, start, end, words, kind, message, guesses }`. Offsets are
UTF-16, as in JavaScript strings. `ghost.proofread` is the macOS spelling and grammar checker, in the
language it detects.

There is nothing else: no files, network, clipboard, timers or keys. Each extension runs in its own
JavaScript context on its own background queue. A command that does not answer within a second, or an
analysis over 250 ms per paragraph, is dropped. A script that loops forever keeps only its own queue busy.

## Phrasebooks

```json
{ "schemaVersion": 3, "id": "you.payments", "name": "Payments", "version": "1.0.0", "author": "You",
  "description": "Card and bank payment terms.", "domain": "Payment systems",
  "terms": ["chargeback", "settlement", "interchange fee", "3-D Secure"] }
```

Up to 500 terms of up to 60 characters. For each suggestion the model is told the field and given up to
40 terms, those sharing a word with the last few sentences first.

## Publishing

1. Add or edit the file in `extensions/` (`.js`) or `phrases/` (`.json`) in the library, and bump its version.
2. Run `python3 scripts/build-extension-index.py` at the library root.
3. Commit the file with the shelf's `index.json`. The app installs a package only if its SHA-256 matches.
