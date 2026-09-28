// ghost {"id":"community.long-sentence","name":"Long Sentences","version":"1.0.0","author":"Ghost Typist","description":"Marks a sentence longer than your limit and offers to shorten it.","tags":["writing"],"capabilities":["1 action","marks writing"]}
ghost.define({
  id: "community.long-sentence",
  name: "Long Sentences",
  version: "1.0.0",
  author: "Ghost Typist",
  description: "Marks a sentence longer than your limit and offers to shorten it.",
  settings: [{ id: "max-words", title: "Maximum words", number: 25 }],
  actions: [{ id: "shorten", title: "Shorten", instruction: "Split this into shorter sentences. Keep the original language. Return only the edit." }],
  analyze: function (text) {
    var max = ghost.number("max-words")
    var sentences = ghost.sentences(text)
    for (var i = 0; i < sentences.length; i++) {
      if (sentences[i].words > max) ghost.mark(sentences[i], "This sentence is long.", { action: "shorten" })
    }
  }
})
