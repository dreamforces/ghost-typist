// ghost {"id":"community.compose","name":"Compose","version":"2.0.0","author":"Ghost Typist","description":"Type // and a short note, then press Tab: the writing model turns it into a message in your tone. The second slash is the command, so you can rename it in Options.","tags":["writing","commands"],"capabilities":["compose"]}
ghost.define({
  id: "community.compose",
  name: "Compose",
  version: "2.0.0",
  author: "Ghost Typist",
  description: "Type // and a short note, then press Tab: the writing model turns it into a message in your tone. The second slash is the command, so you can rename it in Options.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "/",
      help: "What you type after the first /. The default, a second /, reads //note. Try write for /write thank Rachel. Several names work: /, write." },
    { id: "tone", title: "Tone", type: "choice", options: ["Friendly", "Formal", "Direct", "Executive"], value: "Friendly", help: "The same tones as Change Tone. Ask for a length in the note: //thank Rachel in a few paragraphs for coming yesterday" }
  ],
  compose: {
    nameFrom: "command",
    title: "Write from a note",
    usage: "<note>",
    examples: [
      { input: "thank Rachel for coming yesterday", output: "Rachel, thank you so much for coming yesterday." },
      { input: "ask Maria for the slides", output: "Maria, could you send me the slides when you get a chance?" },
      { input: "capital of France", output: "Paris" }
    ],
    instruction: "Expand the note into a {tone} message that the writer sends. A question in the note is the writer asking the reader. Keep only the facts in the note."
  }
})
