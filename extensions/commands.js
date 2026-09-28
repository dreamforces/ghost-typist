// ghost {"id":"community.commands","name":"Slash Commands","version":"1.1.0","author":"Ghost Typist","description":"Tab on /date inserts the date. Add your own commands on the installed row. Tab on a // line expands that note.","tags":["writing"],"capabilities":["1 command"]}
ghost.define({
  id: "community.commands",
  name: "Slash Commands",
  version: "1.1.0",
  author: "Ghost Typist",
  description: "Tab on /date inserts the date. Add your own commands on the installed row. Tab on a // line expands that note.",
  settings: [
    { id: "date-format", title: "Date format", single: true, options: ["English", "American", "Day/Month/Year", "Month/Day/Year", "Year-Month-Day"], default: ["English"] },
    { id: "tone", title: "Tone for //", single: true, options: ["Friendly", "Formal"], default: ["Friendly"] }
  ],
  commands: [
    { command: "date", title: "Date", datetime: true, formatFrom: "date-format" }
  ]
})
