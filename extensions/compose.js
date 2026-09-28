// ghost {"id":"community.compose","name":"Compose","version":"1.1.0","author":"Ghost Typist","description":"Type // and a short note, then press Tab: the writing model turns it into a message in your tone.","tags":["writing"],"capabilities":["compose"]}
ghost.define({
  id: "community.compose",
  name: "Compose",
  version: "1.1.0",
  author: "Ghost Typist",
  description: "Type // and a short note, then press Tab: the writing model turns it into a message in your tone.",
  settings: [
    { id: "tone", title: "Tone", type: "choice", options: ["friendly", "formal", "warm", "direct"], value: "friendly" },
    { id: "length", title: "Length", type: "choice", options: ["two or three sentences", "one short paragraph", "one sentence"], value: "two or three sentences" }
  ],
  compose: {
    instruction: "Expand the note into a {tone} message of {length} that the writer sends. A question in the note is the writer asking the reader. Keep only the facts in the note."
  }
})
