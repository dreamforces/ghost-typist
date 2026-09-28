// ghost {"id":"community.commands","name":"Slash Commands","version":"1.0.0","author":"Ghost Typist","description":"Tab inserts the date with /date and your signature with /signature. Tab on a // line writes that paragraph.","tags":["writing"],"capabilities":["2 commands"]}
ghost.define({
  id: "community.commands",
  name: "Slash Commands",
  version: "1.0.0",
  author: "Ghost Typist",
  description: "Tab inserts the date with /date and your signature with /signature. Tab on a // line writes that paragraph.",
  settings: [{ id: "signature", title: "Signature", text: "Best regards" }],
  commands: [
    { command: "date", title: "Date and time", datetime: true },
    { command: "signature", title: "Signature", setting: "signature" }
  ]
})
