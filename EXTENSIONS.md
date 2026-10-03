# Writing extensions and phrasebooks

Ghost Typist ships a timer, emoji abbreviations, a calculator, unit conversion, currency conversion and time conversion. Everything else comes from the library at
[dreamforces/ghost-typist](https://github.com/dreamforces/ghost-typist), or from a file. Installing a script
asks once, from **Allow third-party extensions** at the top of the Extensions page. Until then search, Install from File and Install stay off. After that an install is one click
with a spinner, and **Details** on any row shows what it adds. Phrasebooks are only terms and never ask.

- **Extensions** are one JavaScript file each: `/commands` (compose is one too: `//note`), abbreviations, proofreading
  marks, a prompt style, and ⌃⌘/ actions. Each one declares its own options; the app draws them in
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

A description is at most 160 characters, about two lines. Options and the extensions list show two lines; the rest is on hover.

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
| `list` | rows `{ columnId: string }` | a table; a column with `code: true` is a JavaScript editor; `multiline: true` is a cell of several lines (up to 500 characters); `placeholder` shows while a cell is empty |
| `info` | a string | a note, not an option the user edits |

`when: { setting, equals }` shows an option only while another `choice` option has that value (a password's
symbol list only for "Letters, digits and symbols"). A hidden option still has its value.

Hooks receive the current values as `settings` (or `ctx.settings`), keyed by id. `help` may hold Markdown
links; only `https` links are clickable.

### What an extension can do

- `commands: { name: { title, run(ctx) } }`: Tab after `/name` and any words after it, at the start of a line
  or after a space, replaces them with what `run` returns (a string or number). `ctx.args` is those words
  (`/wc sentences` gives `"sentences"`), `ctx.text` is everything else typed, `ctx.before` and `ctx.after`
  surround the command. `ctx.language` is the language of that writing, a tag such as `en` or `tr`: English until the text shows otherwise. A command may declare its own `settings`; Options lists them under the command, and
  its `ctx.settings` holds those plus the extension's top-level settings. A command may call `ghost.notify` and
  return no text: the slash command is removed and nothing is typed. Text it does return is still typed, and the
  notice is shown as well.

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
  (`date`, or `d`, or `date, d` for both). Lowercase letters, digits and hyphens only, plus `=` so the line reads `/= 3^2`; an empty or invalid value
  falls back to the key the command is declared under (`date` here). `usage` is shown beside the name in the
  `/` menu: `<text>` says the command needs words after its name, `[format]` that it may take some. Typing `/` opens
  that menu, ↑↓ browse it, and Tab completes the name; on a whole name Tab runs a command that needs no words,
  and only closes the menu for one whose usage starts with `<`. A line that starts with `/=`, or has `/=` after a space, is that command through the end of the line, so a later `/` is division. `examples` (up to 4, 80 characters) are full
  lines such as `/date iso`; Options runs each through the script with the user's current options and shows the
  result beside the command name, so the writer sees what their settings do. A command with no `nameFrom`
  or `examples` still works; Options then shows only its name.
- `commandsFrom: "<list setting>"`: the user writes more commands in Options. The list has a `name` column
  and a `run` code column holding a function body, e.g. `return ctx.text.length + " characters"`. These
  commands have no Options of their own; they read their choices from `ctx.args`.
- `expansionsFrom: "<list setting>"`: a list with `trigger` and `text` columns. The writer types `/~` and a
  trigger (`/~ttys`), then Tab, and the trigger is replaced with its text; a plain word never expands. With
  `typedExpansions: true` the trigger is instead typed as it is and expands on Tab as the whole word before the
  caret (for emoticons such as `:)`); those are not listed after `/~`. `{skin}` in the text
  becomes the skin-tone modifier from a choice setting named `skin`, when that choice is an emoji of the tone,
  and nothing when the emoji has no tone. Give the `text` column `multiline: true` and an abbreviation can
  be several lines with tab stops (below).
- **Tab stops** in an abbreviation's text, written as TextMate does: `$1`, `$2`… are the places Tab visits in
  order, `${1:name}` is one with a default that is selected when Tab arrives (type to replace it), and `$0` is
  where the caret ends (the end of the text if there is none). `\$` is a dollar sign, `\}` a brace inside a default.
  After the expansion the first stop is selected; Tab goes to the next and Shift-Tab back, and the last Tab
  leaves the caret at `$0`. A click, an arrow key, Esc, Tab past the last stop or another app ends it. A number
  used twice is one stop, at its first place. A price is `\$5`, since `$5` is stop 5. Lines are typed as Shift-Return,
  so they do not send a chat message (Control-Option-Return in an Excel cell, where Shift-Return would commit it). For example, `/~late` then Tab:

  ```
  Hi ${1:everyone},

  Sorry I'm running late and will join the meeting in ${2:10 minutes}.
  ```

  Tab types it whole, without a ghost preview; the menu bar says "⇥ expands late". The menu shows only the first line.
  The first stop is selected once the field has finished taking the keys. Stops are followed by the keys typed in the
  placeholder, and checked against the field where it reports its selection; where it does not, arrow keys move the
  caret, so editing a placeholder with a shortcut that deletes more than a character (⌥⌫) can lose the place.
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
- `analyze(text, settings)`: marks spans with `ghost.mark(span, message, { replacement?, action?, kind?, apply? })`.
  `kind` is `spelling` or `grammar` for those colours. `apply: true` replaces the span in the scratchpad instead of
  only underlining it. It runs per paragraph, in the background, after you pause; unchanged paragraphs are not analyzed again.
- `style: { instruction, vocabulary?, apps? }`: added to every suggestion request (or those in `apps`).
- `actions: [{ id, title, instruction, arguments? | argumentsFrom?, symbol? }]`: ⌃⌘/ rewrites.
  `{argument}` is the submenu choice; `argumentsFrom` names a `choices` setting. `{setting-id}` is replaced with that setting's value.
- `model: { name, repository, revision, file, bytes, sha256 }`: a pinned Hugging Face GGUF the actions run
  on. The app downloads it into the Hugging Face cache; the script never names a URL.
- `network: true`: the extension may call `ghost.fetch`. It stays off until the user allows it. Allowing
  means the calls are their responsibility; declining leaves it off, and turning it on later asks again.
  Put `"network"` in the header `capabilities` as well, so the library can say so before install.

### What `ghost` offers

`ghost.words(text)`, `ghost.sentences(text)`, `ghost.repetitions(text)`, `ghost.passive(text)` and
`ghost.proofread(text)` return spans `{ text, start, end, words, kind, message, guesses }`. Offsets are
UTF-16, as in JavaScript strings. `ghost.proofread` is the macOS spelling and grammar checker, in the
language it detects.

`ghost.random(n)` is a whole number from 0 up to n (exclusive), from the system's random source;
`ghost.latin(text)` writes text in plain Latin letters (`İzmir` becomes `Izmir`); `ghost.base64Encode(text)`
and `ghost.base64Decode(text)` (a string, or null when it is not Base64 of UTF-8 text).

`ghost.notify(title, message, options)` posts a notice. It is for commands (`run`, including commands written
in Options) and returns `false` when the notice is rejected. Analysis cannot post.

| argument | |
|---|---|
| `title` | required, 1–80 characters |
| `message` | up to 200 characters; pass `""` when there is nothing more to say |
| `options.after` | whole seconds from now, 0–86400. Omit it, or pass 0, to show the notice as soon as the command finishes. Fractions are rejected |
| `options.symbol` | an SF Symbol name: a lowercase letter, then lowercase letters, digits and dots, at most 40 characters. `bell` when omitted |

A command may post up to 8 notices. A delayed notice sends a macOS notification when it starts and another
when it is due, and the due notice is its own popover under the menu bar icon, not a row in the app menu.
The first banner asks for notification permission. If that prompt is missed or declined, Apps asks again,
and opens System Settings once macOS will not show the prompt.
The app keeps the time: a script still cannot wait or schedule its own callback. Options runs examples
without posting them.

`ghost.fetch(url)` makes one HTTPS GET and returns the response text. It throws when the address is refused,
the call fails, or this extension is not allowed to use the network. A command may make 4 calls. Each one is
HTTPS on port 443, to a public address, with no password in the URL, and the response is at most 256 KB of text.
Addresses on this Mac or a private network are refused. Analysis cannot fetch. Currency uses it for the
European Central Bank rates published by [Frankfurter](https://www.frankfurter.app/).

`ghost.date(text, options)` returns a date as `YYYY-MM-DD`, on this Mac's calendar. It throws when it does not
understand, or the day is not real. `options.language` reads an ambiguous number: `en` and `en-US` take the month
first, and any other language takes the day first. A part over 12 settles the order. With no language, it reads as English.
It understands today, tomorrow, yesterday, +7 and -3; Tuesday, next Tue and last Thursday; last Thursday of the last
month and first Monday of October; 6 October 2026, October 6, 2026, 2026-10-06, 29/01/2026 and 01/29/2026.
`next Tuesday` is the coming one, after today. A month named without a year is this year.

There is nothing else: no files, clipboard or keys. Each extension runs in its own JavaScript
context on its own background queue. A command that does not answer within five seconds, or an analysis over
250 ms per paragraph, is dropped. A script that loops forever keeps only its own queue busy.

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
