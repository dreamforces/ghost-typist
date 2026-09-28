// ghost {"id":"community.compose","name":"Compose","version":"1.2.0","author":"Ghost Typist","description":"Type // and a short note, then press Tab: the writing model turns it into a message in your tone, a few sentences unless the note asks for a length.","tags":["writing"],"capabilities":["compose"]}
ghost.define({
  id: "community.compose",
  name: "Compose",
  version: "1.2.0",
  author: "Ghost Typist",
  description: "Type // and a short note, then press Tab: the writing model turns it into a message in your tone, a few sentences unless the note asks for a length.",
  settings: [
    { id: "tone", title: "Tone", type: "choice", options: ["Friendly", "Formal", "Direct", "Executive"], value: "Friendly", help: "The same tones as Change Tone. Ask for a length in the note: //thank Rachel in a few paragraphs for coming yesterday" }
  ],
  compose: {
    instruction: "Expand the note into a {tone} message that the writer sends. A question in the note is the writer asking the reader. Keep only the facts in the note."
  }
})
