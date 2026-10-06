// ghost {"id":"community.compose","name":"Prompt","version":"2.1.3","author":"Ghost Typist","description":"Type // and an instruction or question, then Tab. The model answers in your tone. Rename the second slash in Options.","icon":"text.bubble","tags":["writing","commands"],"capabilities":["compose"]}
ghost.define({
  id: "community.compose",
  name: "Prompt",
  version: "2.1.3",
  author: "Ghost Typist",
  description: "Type // and an instruction or question, then Tab. The model answers in your tone. Rename the second slash in Options.",
  icon: "text.bubble",
  settings: [
    { id: "command", title: "Command", type: "text", value: "/",
      help: "What you type after the first /. The default, a second /, reads //prompt. Try write for /write thank Rachel. Several names work: /, write. Name a size in the prompt: //thank Rachel in 2 paragraphs." }
  ],
  compose: {
    nameFrom: "command",
    title: "Ask the model",
    usage: "<prompt>",
    examples: [
      { input: "thank Rachel for coming yesterday", output: "Rachel, thank you so much for coming yesterday." },
      { input: "ask Maria for the slides", output: "Maria, could you send me the slides when you get a chance?" },
      { input: "capital of France", output: "Paris" }
    ],
    instruction: "Expand the note into a message that the writer sends, in the tone the app is set to. A question in the note is the writer asking the reader. Keep only the facts in the note."
  }
})
