// ghost {"id":"community.translate","name":"Translate","version":"3.2.3","author":"Ghost Typist","description":"Translates a selection, in the same menu as your other actions.","icon":"translate","tags":["writing","translation"],"capabilities":["1 action","translation model"]}
ghost.define({
  id: "community.translate",
  name: "Translate",
  version: "3.2.3",
  author: "Ghost Typist",
  description: "Translates a selection, in the same menu as your other actions.",
  icon: "translate",
  model: "translategemma-4b-q4",
  settings: [
    { id: "languages", title: "Languages", type: "choices", custom: true, help: "The languages Translate offers. Add your own.", options: ["English", "Chinese", "Spanish", "French", "German", "Portuguese", "Russian", "Arabic", "Japanese", "Korean", "Turkish"], value: ["English", "French", "Turkish"] }
  ],
  actions: [
    { id: "translate", title: "Translate", instruction: "Translate the following text into {argument}. Note that you should only output the translated result without any additional explanation:", argumentsFrom: "languages", symbol: "character.book.closed" }
  ]
})
