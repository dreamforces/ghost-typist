// ghost {"id":"community.grammar","name":"Grammar","version":"1.0.0","author":"Ghost Typist","description":"Marks grammar the system checker finds, and can ask your model to fix a selection.","tags":["writing"],"capabilities":["1 action","marks writing"]}
ghost.define({
  id: "community.grammar",
  name: "Grammar",
  version: "1.0.0",
  author: "Ghost Typist",
  description: "Marks grammar the system checker finds, and can ask your model to fix a selection.",
  actions: [{ id: "fix", title: "Fix Grammar", instruction: "Correct spelling, grammar and punctuation. Change nothing else. Keep the original language. Return only the corrected text.", symbol: "checkmark.seal" }],
  analyze: function (text) {
    var hits = ghost.grammar(text)
    for (var i = 0; i < hits.length; i++) {
      var guess = hits[i].guesses.length ? hits[i].guesses[0] : ""
      ghost.mark(hits[i], hits[i].message, guess ? { replacement: guess, action: "fix" } : { action: "fix" })
    }
  }
})
