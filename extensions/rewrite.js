// ghost {"id":"community.rewrite","name":"Rewrite Actions","version":"3.1.0","author":"Ghost Typist","description":"Rewrite, shorten, enrich, change tone, summarise, fix grammar, or remove filler in a selection.","tags":["writing"],"capabilities":["7 actions"]}
ghost.define({
  id: "community.rewrite",
  name: "Rewrite Actions",
  version: "3.1.0",
  author: "Ghost Typist",
  description: "Rewrite, shorten, enrich, change tone, summarise, fix grammar, or remove filler in a selection.",
  actions: [
    { id: "rewrite", title: "Rewrite", instruction: "Rewrite the text to read more clearly while preserving its meaning. Keep the original language. Return only the rewritten text.", symbol: "arrow.triangle.2.circlepath" },
    { id: "shorten", title: "Shorten", instruction: "Make the text more concise without losing meaning. Keep the original language. Return only the shortened text.", symbol: "arrow.down.right.and.arrow.up.left" },
    { id: "enrich", title: "Enrich", instruction: "Enrich the text with a little more detail, in the same voice. Keep the original language. Return only the enriched text.", symbol: "arrow.up.left.and.arrow.down.right" },
    { id: "tone", title: "Change Tone", instruction: "Rewrite the text in a {argument} tone, preserving meaning. Keep the original language. Return only the rewritten text.", arguments: ["Friendly", "Formal", "Direct", "Executive"], symbol: "theatermasks" },
    { id: "summarise", title: "Summarise", instruction: "Summarise the text in a few words, keeping the meaning. Keep the original language. Return only the summary.", symbol: "list.bullet.rectangle" },
    { id: "fixgrammar", title: "Fix Grammar", instruction: "Correct spelling, grammar and punctuation. Change nothing else. Keep the original language. Return only the corrected text.", symbol: "checkmark.seal" },
    { id: "tighten", title: "Remove Filler", instruction: "Remove filler words and redundancy. Keep the meaning and voice. Keep the original language. Return only the tightened text.", symbol: "scissors" }
  ]
})
