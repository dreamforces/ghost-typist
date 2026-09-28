// ghost {"id":"community.translate","name":"Translate","version":"3.2.0","author":"Ghost Typist","description":"Translates a selection with Hy-MT2 7B, in the same menu as your other actions.","tags":["writing","translation"],"capabilities":["1 action","translation model"]}
ghost.define({
  id: "community.translate",
  name: "Translate",
  version: "3.2.0",
  author: "Ghost Typist",
  description: "Translates a selection with Hy-MT2 7B, in the same menu as your other actions.",
  model: {
    name: "Hy-MT2 · 7B",
    repository: "tencent/Hy-MT2-7B-GGUF",
    revision: "ab8472660ac61fac25f1af43fac2599d52a8a775",
    file: "Hy-MT2-7B-Q4_K_M.gguf",
    bytes: 4624648896,
    sha256: "9f96256500f3fc1ab4d64336b58f52a949a95ad7516b0c229476eef782f9f77b"
  },
  settings: [
    { id: "languages", title: "Languages", type: "choices", custom: true, help: "Hy-MT2 translates 38 languages; the [full list](https://huggingface.co/tencent/Hy-MT2-7B-GGUF) is on its model card.", options: ["English", "Chinese", "Spanish", "French", "German", "Portuguese", "Russian", "Arabic", "Japanese", "Korean", "Turkish"], value: ["English", "French", "Turkish"] }
  ],
  actions: [
    { id: "translate", title: "Translate", instruction: "Translate the following text into {argument}. Note that you should only output the translated result without any additional explanation:", argumentsFrom: "languages", symbol: "character.book.closed" }
  ]
})
