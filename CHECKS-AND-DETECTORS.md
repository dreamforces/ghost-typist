# Checks and detectors

Two ways a package marks writing that is already on the page. Neither calls a model, and neither types for the user. The scratchpad underlines each mark. A package can include either, or both.

A name or phrase that is not described here is rejected when the package is installed.

## Checks

A check is a phrase you write in the package.

```json
{ "phrase": "due to the fact that", "message": "‘due to the fact that’ is wordy.", "replacement": "because" }
```

| Field | Required | Limit |
|---|---|---|
| `phrase` | yes | 2–120 characters |
| `message` | yes | 1–160 characters. Shown as the underline’s tooltip. |
| `replacement` | no | up to 120 characters. A shorter wording the reader can use. |

A package holds at most 300 checks. Matching is a case-insensitive substring, not a whole word and not a pattern. `"use"` also matches `"user"`. Prefer a phrase that is unlikely to sit inside another word, as the lists below do. `"very"` matches `"every"`, so short words belong in a detector, not a check.

## Checks in this library

**Cliché Detector** (`community.cliches`) marks these, with no replacement:

at the end of the day, think outside the box, low-hanging fruit, move the needle, circle back, touch base, boil the ocean, best of breed, synergy, paradigm shift, game changer, hit the ground running, on the same page, win-win, going forward, needle in a haystack.

**Plain English** (`community.plain-english`) also has a prompt and a ⌘K action. Its checks are:

| Phrase | Replacement |
|---|---|
| utilize | use |
| in order to | to |
| leverage | — |

**Wordiness** (`community.wordiness`) marks these and offers a replacement:

| Phrase | Replacement |
|---|---|
| due to the fact that | because |
| in the event that | if |
| a large number of | many |
| in spite of the fact that | although |
| at this point in time | now |
| has the ability to | can |
| in close proximity to | near |
| in the near future | soon |
| each and every | every |
| first and foremost | first |
| for the purpose of | to |
| with regard to | about |

To add your own, copy one of those files, give it a new `id` (`you.your-checks`), and list your phrases. One package can mix checks with a prompt, actions, or a detector.

## Detectors

A detector is one name. The behavior lives in the app, because it needs word or sentence boundaries a phrase list cannot express. A package turns exactly one on:

```json
{ "schemaVersion": 2, "id": "community.repetition", "name": "Repetition Detector", "version": "1.0.0",
  "author": "Ghost Typist", "description": "Marks a word repeated close to itself.",
  "detector": "repetition" }
```

You cannot define a new detector in JSON. A package that names anything else is rejected. The names the app implements:

| Name | Package | What it marks | What it leaves |
|---|---|---|---|
| `repetition` | `community.repetition` | The later copy of a word that already appeared within the last six content words. | Words under four letters, words that are not all letters, and the stop words the, a, an, and, or, but, of, to, in, on, for, with, as, at, by, is, are, was, were, be, it, this, that, i, you, we, they, he, she. |
| `passive` | `community.passive` | A form of “to be” — is, are, was, were, be, been, being, get, got — followed by a past participle, such as “was written”. | A be-verb that is not followed by a participle. |
| `long-sentence` | `community.long-sentence` | A sentence of more than 25 words. | A sentence of 25 words or fewer. |
| `adverb` | `community.adverb` | An adverb ending in -ly, such as “quickly”. | Words that are not adverbs, and early, daily, weekly, monthly, yearly, family, apply, reply, supply, likely, friendly, lonely, costly, timely. |

The threshold and the word lists are fixed. A package cannot pass its own number or its own word list. Two detector packages can be installed together; each mark is drawn.
