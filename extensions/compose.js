// ghost {"id":"community.compose","name":"Compose","version":"1.0.0","author":"Ghost Typist","description":"Type // and a short note, then press Tab: the writing model turns it into a message in your tone.","tags":["writing"],"capabilities":["compose"]}
ghost.define({
  id: "community.compose",
  name: "Compose",
  version: "1.0.0",
  author: "Ghost Typist",
  description: "Type // and a short note, then press Tab: the writing model turns it into a message in your tone.",
  settings: [
    { id: "tone", title: "Tone", type: "choice", options: ["friendly", "formal", "warm", "direct"], value: "friendly" },
    { id: "length", title: "Length", type: "choice", options: ["two or three sentences", "one short paragraph", "one sentence"], value: "two or three sentences" }
  ],
  compose: {
    instruction: "Write {length} in a {tone} tone, in the note's language, as the writer speaking. Keep every name, time and fact from the note and add nothing but courteous framing. Examples. Note: thank Rachel for coming yesterday. Message: Hi Rachel, thank you so much for coming yesterday. It meant a lot to have you there, and I really appreciate you making the time. Note: is Jason coming tomorrow. Message: Hi, I wanted to check whether Jason is still planning to come tomorrow. Could you let me know when you get a chance? Thanks!"
  }
})
