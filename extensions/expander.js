// ghost {"id":"community.expander","name":"Text Expander","version":"1.0.0","author":"Ghost Typist","description":"Fills in a few chat abbreviations, such as ttys.","tags":["writing"],"capabilities":["3 expansions"]}
ghost.define({
  id: "community.expander",
  name: "Text Expander",
  version: "1.0.0",
  author: "Ghost Typist",
  description: "Fills in a few chat abbreviations, such as ttys.",
  expansions: [
    { trigger: "ttys", completion: "talk to you soon" },
    { trigger: "brb", completion: "be right back" },
    { trigger: "omw", completion: "on my way" }
  ]
})
