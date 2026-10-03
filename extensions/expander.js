// ghost {"id":"community.expander","name":"Text Expander","version":"2.5.0","author":"Ghost Typist","description":"Type /~ and an abbreviation, then press Tab: it is replaced with the text you set in Options.","tags":["writing"],"capabilities":["abbreviations"]}
ghost.define({
  id: "community.expander",
  name: "Text Expander",
  version: "2.5.0",
  author: "Ghost Typist",
  description: "Type /~ and an abbreviation, then press Tab: it is replaced with the text you set in Options.",
  settings: [
    {
      id: "abbreviations", title: "Abbreviations", type: "list",
      columns: [{ id: "trigger", title: "Type", placeholder: "brb" }, { id: "text", title: "Becomes", placeholder: "The text to type. Return adds a line.", multiline: true }],
      value: [
        { trigger: "brb", text: "be right back" },
        { trigger: "late", text: "Hi ${1:everyone},\n\nSorry I'm running late and will join the meeting in ${2:10 minutes}. Please start without me." }
      ]
    },
    {
      id: "stops", title: "How Tab moves", type: "info",
      value: "Type /~ and the word, then Tab. brb is typed as it is. late stops on ${1:everyone}: it is selected, and typing replaces it. Tab moves to ${2:10 minutes}, and Shift-Tab moves back. Tab once more finishes. A click, an arrow key or Esc leaves the stops. Return in Becomes starts a new line."
    }
  ],
  expansionsFrom: "abbreviations"
})
