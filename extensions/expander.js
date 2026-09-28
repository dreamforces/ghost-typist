// ghost {"id":"community.expander","name":"Text Expander","version":"2.0.0","author":"Ghost Typist","description":"Type an abbreviation and press Tab: it is replaced with the text you set in Options.","tags":["writing"],"capabilities":["abbreviations"]}
ghost.define({
  id: "community.expander",
  name: "Text Expander",
  version: "2.0.0",
  author: "Ghost Typist",
  description: "Type an abbreviation and press Tab: it is replaced with the text you set in Options.",
  settings: [
    {
      id: "abbreviations", title: "Abbreviations", type: "list",
      help: "An abbreviation is one word. It expands only when it is the whole word before the caret.",
      columns: [{ id: "trigger", title: "Type" }, { id: "text", title: "Becomes" }],
      value: [
        { trigger: "brb", text: "be right back" },
        { trigger: "omw", text: "on my way" },
        { trigger: "ttys", text: "talk to you soon" }
      ]
    }
  ],
  expansionsFrom: "abbreviations"
})
