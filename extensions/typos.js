// ghost {"id":"community.typos","name":"Typos","version":"1.0.0","author":"Ghost Typist","description":"Marks misspellings and offers the system guess.","tags":["writing"],"capabilities":["marks writing"]}
ghost.define({
  id: "community.typos",
  name: "Typos",
  version: "1.0.0",
  author: "Ghost Typist",
  description: "Marks misspellings and offers the system guess.",
  analyze: function (text) {
    var typos = ghost.typos(text)
    for (var i = 0; i < typos.length; i++) {
      var guess = typos[i].guesses.length ? typos[i].guesses[0] : ""
      ghost.mark(typos[i], typos[i].message, guess ? { replacement: guess } : {})
    }
  }
})
