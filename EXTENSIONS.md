# Writing an extension

An extension is one JavaScript file. The app runs it with a frozen `ghost` object: no files, no network, and no API keys. A model call is an action you declare. The app sends it to the writing model, or to a tool model it already knows, such as `hy-mt2-7b-q4`.

Open a pull request here. The review is what makes the package available to everyone. After it is merged, run `python3 scripts/build-extension-index.py` and commit `extensions/index.json` with the script.

## File

The first line is a header. `ghost.define` must repeat the same id, name, version, author and description.

```javascript
// ghost {"id":"you.example","name":"Example","version":"1.0.0","author":"You","description":"What it does.","tags":["writing"],"capabilities":["1 action","marks writing"]}
ghost.define({
  id: "you.example",
  name: "Example",
  version: "1.0.0",
  author: "You",
  description: "What it does.",
  settings: [{ id: "max-words", title: "Maximum words", number: 25 }],
  actions: [{ id: "shorten", title: "Shorten", instruction: "Split this into shorter sentences. Keep the original language. Return only the edit." }],
  analyze: function (text) {
    var max = ghost.number("max-words")
    ghost.sentences(text).forEach(function (sentence) {
      if (sentence.words > max) ghost.mark(sentence, "This sentence is long.", { action: "shorten" })
    })
  }
})
```

`examples/long-sentence.js` is that pattern and is not installed. Copy it into `extensions/` to contribute it.

## What you may declare

- **settings** — `options` and `default` are checkboxes. `number` is a stepper. `text` is one line, such as a signature. The script reads them with `ghost.number`, `ghost.choices`, and the stored text is what a command inserts.
- **commands** — Tab on a line that is only `/name`. Use `datetime: true` for the clock, and `formatFrom` to name a single-choice date format. `setting` inserts a text preference, or `text` is fixed words. One of those three. People add their own text commands on the installed row. A `tone` setting (Friendly or Formal) is how `//` expands a note.
- **expansions** — `{ trigger, completion }`. Tab fills the completion when the trigger is at the cursor, the same way a phrase pack does.
- **model** — a pinned Hugging Face GGUF: `{ name, repository, revision, file, bytes, sha256 }`. `repository` is `owner/name`, `revision` is the 40-character commit, `file` ends in `.gguf`. The app downloads it from Hugging Face. A script cannot name a URL. Without a model, the writing model edits the selection.
- **actions** — `{ id, title, instruction }`. `{argument}` comes from `arguments` or from `argumentsFrom`, which names a checkbox setting. `model` on an action is a catalog id. Without a model, the writing model edits the selection as a fragment and keeps its language.
- **style** — `{ instruction, vocabulary, apps }` folded into suggestions.
- **analyze(text)** — mark the scratchpad. Call only the host functions below, then `ghost.mark(span, message, { replacement, action })`. A replacement can be accepted from the underline. An action runs on that span.

`//instruction` is not a package. Tab on a line that is `//` plus the request asks the writing model to write that paragraph and replaces the line. It works in the scratchpad.

## Host functions

Each returns `{ text, start, end, words, message, guesses }`. `start` and `end` are UTF-16 offsets into the string you passed.

- `ghost.sentences(text)`, `ghost.words(text)`
- `ghost.repetitions(text)` — a content word repeated within the last six content words
- `ghost.passive(text)` — a form of “to be” followed by a past participle
- `ghost.typos(text)` — system misspellings and guesses. Read only
- `ghost.grammar(text)` — system grammar hits, descriptions, and corrections
- `ghost.mark(span, message, options)`

A script that loops can stall analysis until Ghost Typist quits. Keep `analyze` to a single pass over the host’s spans.

## Packages here

- **Slash Commands** — `/date`, `/signature` (edit the signature on the installed row)
- **Text Expander** — `ttys`, `brb`, `omw`
- **Typos** — underline a misspelling, accept the guess
- **Grammar** — underline a grammar hit, and Fix Grammar on the selection
- **Rewrite Actions** — the selection menu
- **Translate** — the same menu, using Hy-MT2
