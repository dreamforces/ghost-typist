// ghost {"id":"community.rewrite","name":"Rewrite Actions","version":"3.4.2","author":"Ghost Typist","description":"Rewrite, shorten, enrich, change tone, summarise, fix grammar, or remove filler in a selection.","icon":"pencil.line","tags":["writing"],"capabilities":["7 actions"]}
ghost.define({
  id: "community.rewrite",
  name: "Rewrite Actions",
  version: "3.4.2",
  author: "Ghost Typist",
  description: "Rewrite, shorten, enrich, change tone, summarise, fix grammar, or remove filler in a selection.",
  icon: "pencil.line",
  settings: [
    { id: "shorter", title: "Shorten to", type: "choice", options: ["a little shorter", "about half", "one sentence"], value: "about half",
      help: "How much Shorten takes out." },
    { id: "summary", title: "Summary length", type: "choice", options: ["a few words", "one sentence", "a short paragraph"], value: "a few words",
      help: "How long Summarise is." }
  ],
  actions: [
    { id: "rewrite", title: "Rewrite", instruction: "Rewrite the text so it reads more clearly: change the wording and sentence structure, and keep every fact and the writer's voice. Use normal capitalisation and punctuation.", symbol: "arrow.triangle.2.circlepath" },
    { id: "shorten", title: "Shorten", instruction: "Shorten the text so that it is {shorter}. Keep the key facts and drop the rest.", symbol: "arrow.down.right.and.arrow.up.left" },
    { id: "enrich", title: "Enrich", instruction: "Expand the text to roughly twice its length: add concrete detail, context and a courteous touch, in the same voice, without inventing names, dates or numbers.", symbol: "arrow.up.left.and.arrow.down.right" },
    { id: "tone", title: "Change Tone", instruction: "Rewrite the text so it unmistakably sounds {argument}. Change the word choice and sentence length to match, keep the facts and point of view, and do not return a copy. (Direct: plain, point first, short sentences, no apology. Executive: brisk, decisive, no pleasantries. Formal: polished, courteous. Friendly: warm, casual.)", argumentsFrom: "app.tones", symbol: "theatermasks" },
    { id: "summarise", title: "Summarise", instruction: "Summarise the text in {summary}, keeping the meaning.", symbol: "list.bullet.rectangle" },
    { id: "fixgrammar", title: "Fix Grammar", instruction: "Fix every spelling, grammar, capitalisation and punctuation mistake: start each sentence with a capital letter, write I and names with capitals, and end each sentence with a full stop or question mark. Change nothing else.", symbol: "checkmark.seal" },
    { id: "tighten", title: "Remove Filler", instruction: "Delete filler words (just, basically, really, um, like, you know, actually, I think, sort of) and redundant phrases. Do not change any other wording. Example: \"So, um, I think we should, like, go now\" becomes \"We should go now.\"", symbol: "scissors" }
  ]
})
