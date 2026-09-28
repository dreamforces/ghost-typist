// ghost {"id":"community.proofread","name":"Spelling & Grammar","version":"1.0.0","author":"Ghost Typist","description":"Underlines misspellings and grammar slips with the macOS checker. Click an underline for a fix.","tags":["writing"],"capabilities":["marks writing"]}
ghost.define({
  id: "community.proofread",
  name: "Spelling & Grammar",
  version: "1.0.0",
  author: "Ghost Typist",
  description: "Underlines misspellings and grammar slips with the macOS checker. Click an underline for a fix.",
  settings: [
    { id: "spelling", title: "Mark spelling", type: "toggle", value: true },
    { id: "grammar", title: "Mark grammar", type: "toggle", value: true },
    {
      id: "accepted", title: "Words to accept", type: "list",
      help: "Names and terms that are spelled right.",
      columns: [{ id: "word", title: "Word" }],
      value: []
    }
  ],
  analyze(text, settings) {
    const accepted = new Set(settings.accepted.map((row) => (row.word || "").toLowerCase()));
    for (const hit of ghost.proofread(text)) {
      if (!settings[hit.kind]) continue;
      if (hit.kind === "spelling" && accepted.has(hit.text.toLowerCase())) continue;
      ghost.mark(hit, hit.message, { kind: hit.kind, replacement: hit.guesses[0] });
    }
  }
})
