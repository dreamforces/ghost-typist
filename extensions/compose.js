// ghost {"id":"community.compose","name":"Compose","version":"2.0.2","author":"Ghost Typist","description":"Type // and a short note, then Tab. The model turns it into a message in your tone. Rename the second slash in Options.","tags":["writing","commands"],"capabilities":["compose"]}
ghost.define({
  id: "community.compose",
  name: "Compose",
  version: "2.0.2",
  author: "Ghost Typist",
  description: "Type // and a short note, then Tab. The model turns it into a message in your tone. Rename the second slash in Options.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "/",
      help: "What you type after the first /. The default, a second /, reads //note. Try write for /write thank Rachel. Several names work: /, write." },
    { id: "tone", title: "Tone", type: "choice", options: ["Friendly", "Formal", "Direct", "Executive"], value: "Friendly", help: "The same tones as Change Tone. Ask for a length in the note: //thank Rachel in a few paragraphs for coming yesterday" },
    { id: "length", title: "Length", type: "choice", options: ["as short as possible", "a sentence", "a paragraph", "unlimited"], value: "unlimited",
      help: "How long an expanded or rephrased note is. An answer to a question stays short." }
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
    instruction: "Expand the note into a {tone} message that the writer sends. When expanding or rephrasing, the length is {length}. A question in the note is the writer asking the reader. Keep only the facts in the note."
  }
})
