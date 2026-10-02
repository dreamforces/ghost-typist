# Writing extensions and phrasebooks

Ghost Typist ships no extensions. Everything comes from the library at
[dreamforces/ghost-typist](https://github.com/dreamforces/ghost-typist), or from a file. Installing a script
asks once ("Allow third-party extensions", also a switch in the Library); after that an install is one click
with a spinner, and **Details** on any row shows what it adds. Phrasebooks are only terms and never ask.

- **Extensions** are one JavaScript file each: `/commands` (compose is one too: `//note`), abbreviations, proofreading
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

Every option lives in the script. `settings` is a list of `{ id, title, type, value, help?, options?, custom?, columns?, group?, when? }`.
`value` is the default; what the user sets in Options replaces it, and a saved value that no longer fits
falls back to the default. Ids are lowercase letters, digits and `-`.

| type | value | Options shows |
|---|---|---|
| `text` | string, up to 500 characters | a text field |
| `number` | integer 0–100000 | a stepper |
| `toggle` | `true` / `false` | a checkbox |
| `choice` | one of `options` | a pop-up menu |
| `choices` | a subset of `options`; with `custom: true` also up to 20 names the user types, comma-separated | checkboxes |
| `list` | rows `{ columnId: string }` | a table; a column with `code: true` is a JavaScript editor; `placeholder` shows while a cell is empty |

`when: { setting, equals }` shows an option only while another `choice` option has that value (a password's
symbol list only for "Letters, digits and symbols"). A hidden option still has its value.

Hooks receive the current values as `settings` (or `ctx.settings`), keyed by id. `help` may hold Markdown
links; only `https` links are clickable.

### What an extension can do

- `commands: { name: { title, run(ctx) } }`: Tab after `/name` and any words after it, at the start of a line
  or after a space, replaces them with what `run` returns (a string or number). `ctx.args` is those words
  (`/wc sentences` gives `"sentences"`), `ctx.text` is everything else typed, `ctx.before` and `ctx.after`
  surround the command. A command may declare its own `settings`; Options lists them under the command, and
  its `ctx.settings` holds those plus the extension's top-level settings.

  ```js
  settings: [
    { id: "command", title: "Command", type: "text", value: "date", help: "What you type after the /. Several names: date, d." },
    { id: "format", title: "Format", type: "choice", value: "long", options: ["long", "iso"] }
  ],
  commands: {
    date: {
      title: "Today's date",
      nameFrom: "command",
      usage: "[format]",
      examples: ["/date", "/date iso"],
      run(ctx) { return ctx.settings.format === "iso" ? new Date().toISOString().slice(0, 10) : new Date().toDateString() }
    }
  }
  ```

  The app has no commands of its own; this is how an extension registers one. `nameFrom` names a `text` setting
  whose value is what the user types after the `/`, so the user names the command in the extension's Options
  (`date`, or `d`, or `date, d` for both). Lowercase letters, digits and hyphens only; an empty or invalid value
  falls back to the key the command is declared under (`date` here). `usage` is shown beside the name in the
  `/` menu: `<text>` says the command needs words after its name, `[format]` that it may take some. Typing `/` opens
  that menu, ↑↓ browse it, and Tab completes the name; on a whole name Tab runs a command that needs no words,
  and only closes the menu for one whose usage starts with `<`. `examples` (up to 4, 80 characters) are full
  lines such as `/date iso`; Options runs each through the script with the user's current options and shows the
  result beside the command name, so the writer sees what their settings do. A command with no `nameFrom`
  or `examples` still works; Options then shows only its name.
- `commandsFrom: "<list setting>"`: the user writes more commands in Options. The list has a `name` column
  and a `run` code column holding a function body, e.g. `return ctx.text.length + " characters"`. These
  commands have no Options of their own; they read their choices from `ctx.args`.
- `expansionsFrom: "<list setting>"`: a list with `trigger` and `text` columns. When the whole word before
  the caret is a trigger, its text is offered, and Tab replaces the trigger with it.
- `compose: { instruction, nameFrom?, title?, usage?, examples? }`: compose is a slash command whose name
  defaults to `/`, so the line reads `//note`; set a `text` setting with `nameFrom` and the writer can make it
  `/write` instead (`/` or `//` always means the default). It appears in the `/` menu as `//` with `usage`
  (`<note>`) and `title`. `examples` are `{ input, output }` pairs shown as documentation (compose is not run
  by Options, since it needs a model). Tab on `//note` sends the note, and up to 500 characters of text before it, to
  the writing model. What the model writes replaces only the note, so it carries on from the text before it.
  The note's first word routes it: tell, ask, offer, suggest… ("tell Rachel I appreciate it") is written as
  the words the writer says; write, explain, describe… ("write two paragraphs about…") is written out; list and
  name are answered. Otherwise the model is first asked whether anyone could answer the note from general
  knowledge: if so ("capital of France") it gets only the answer, and if not ("I can't make the meeting") the
  note is the writer's own words, with the grammar fixed. `{setting-id}` in the instruction is replaced with that setting's value; the app
  reads the tone (Friendly, Formal, Direct or Executive) from it. With a remote model, the text before the note
  is sent only from apps the writer allowed.
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

`ghost.random(n)` is a whole number from 0 up to n (exclusive), from the system's random source;
`ghost.latin(text)` writes text in plain Latin letters (`İzmir` becomes `Izmir`); `ghost.base64Encode(text)`
and `ghost.base64Decode(text)` (a string, or null when it is not Base64 of UTF-8 text).

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
40 terms, those sharing a word with the last few sentences first. When the unfinished word (3 letters or more)
starts a word of a term, the rest of that term is offered directly: `dia` offers `gnosis`.

## Publishing

1. Add or edit the file in `extensions/` (`.js`) or `phrases/` (`.json`) in the library, and bump its version.
2. Run `python3 scripts/build-extension-index.py` at the library root.
3. Commit the file with the shelf's `index.json`. The app installs a package only if its SHA-256 matches.
