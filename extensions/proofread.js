// ghost {"id":"community.proofread","name":"Spelling & Grammar","version":"1.2.0","author":"Ghost Typist","description":"Underlines misspellings and grammar slips with the macOS checker, or fixes a typo when you turn that on.","tags":["writing"],"capabilities":["marks writing"]}
ghost.define({
  id: "community.proofread",
  name: "Spelling & Grammar",
  version: "1.2.0",
  author: "Ghost Typist",
  description: "Underlines misspellings and grammar slips with the macOS checker, or fixes a typo when you turn that on.",
  settings: [
    { id: "fix", title: "Fix typos", type: "toggle", value: false,
      help: "On, a misspelling in the scratchpad is replaced with the suggestion when you pause. Off, it is only underlined." },
    { id: "spelling", title: "Mark spelling", type: "toggle", value: true },
    { id: "grammar", title: "Mark grammar", type: "toggle", value: true },
    { id: "ignore-caps", title: "Ignore ALL-CAPS words", type: "toggle", value: false, help: "Acronyms such as NASA and API." },
    { id: "ignore-numbers", title: "Ignore words with numbers", type: "toggle", value: true, help: "Codes and names such as B2B and 3rd." },
    { id: "ignore-links", title: "Ignore links and emails", type: "toggle", value: true },
    {
      id: "accepted", title: "Words to accept", type: "list",
      help: "Names and terms that are spelled right.",
      columns: [{ id: "word", title: "Word" }],
      value: []
    }
  ],
  analyze(text, settings) {
    // The whole run of non-space characters the hit sits in, so "B2B" and "me@site.com" are judged as written.
    const token = (text, hit) => {
      let a = hit.start, b = hit.end;
      while (a > 0 && !/\s/.test(text[a - 1])) a--;
      while (b < text.length && !/\s/.test(text[b])) b++;
      return text.slice(a, b);
    };
    const accepted = new Set(settings.accepted.map((row) => (row.word || "").toLowerCase()));
    for (const hit of ghost.proofread(text)) {
      if (!settings[hit.kind]) continue;
      if (hit.kind === "spelling") {
        if (accepted.has(hit.text.toLowerCase())) continue;
        if (settings["ignore-caps"] && hit.text.length > 1 && hit.text === hit.text.toUpperCase()) continue;
        if (settings["ignore-numbers"] && /\d/.test(token(text, hit))) continue;
        if (settings["ignore-links"] && /@|:\/\/|^www\.|\.(com|org|net|io|dev|app)\b/i.test(token(text, hit))) continue;
      }
      const guess = hit.guesses[0];
      ghost.mark(hit, hit.message, { kind: hit.kind, replacement: guess, apply: !!settings.fix && hit.kind === "spelling" && !!guess });
    }
  }
})
