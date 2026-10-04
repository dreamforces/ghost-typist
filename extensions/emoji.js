// ghost {"id":"community.emoji","name":"Emoji","version":"1.0.0","author":"Ghost Typist","description":"Type :) then Tab for 😊. Hands and people use the skin tone in Options.","tags":["abbreviations"],"capabilities":["abbreviations"]}
//
// Type an emoticon, then Tab. :) becomes 😊. Hands and people take the skin tone from Options.

const rows = [
  { trigger: ":)", text: "😊" },
  { trigger: ":-)", text: "😊" },
  { trigger: "=)", text: "😊" },
  { trigger: ":D", text: "😃" },
  { trigger: ":-D", text: "😃" },
  { trigger: "=D", text: "😄" },
  { trigger: ";)", text: "😉" },
  { trigger: ";-)", text: "😉" },
  { trigger: ":(", text: "🙁" },
  { trigger: ":-(", text: "🙁" },
  { trigger: "=(", text: "🙁" },
  { trigger: ":'(", text: "😢" },
  { trigger: ":')", text: "😂" },
  { trigger: ":'D", text: "😂" },
  { trigger: ":P", text: "😛" },
  { trigger: ":-P", text: "😛" },
  { trigger: ":p", text: "😛" },
  { trigger: ":O", text: "😮" },
  { trigger: ":-O", text: "😮" },
  { trigger: ":|", text: "😐" },
  { trigger: ":-|", text: "😐" },
  { trigger: ":/", text: "😕" },
  { trigger: ":-/", text: "😕" },
  { trigger: ":*", text: "😘" },
  { trigger: ":-*", text: "😘" },
  { trigger: "xD", text: "😆" },
  { trigger: "XD", text: "😆" },
  { trigger: "<3", text: "❤️" },
  { trigger: "</3", text: "💔" },
  { trigger: ":3", text: "😺" },
  { trigger: "B)", text: "😎" },
  { trigger: "8)", text: "😎" },
  { trigger: ">:(", text: "😠" },
  { trigger: ">:)", text: "😏" },
  { trigger: "O:)", text: "😇" },
  { trigger: "^_^", text: "😊" },
  { trigger: "-_-", text: "😑" },
  { trigger: ">_<", text: "😣" },
  { trigger: "T_T", text: "😭" },
  { trigger: ":$", text: "😳" },
  { trigger: ":x", text: "😶" },
  { trigger: "D:", text: "😧" },
  { trigger: "+1", text: "👍{skin}" },
  { trigger: "-1", text: "👎{skin}" },
  { trigger: "(y)", text: "👍{skin}" },
  { trigger: "(n)", text: "👎{skin}" },
  { trigger: "\\o/", text: "🙌{skin}" },
  { trigger: ":wave:", text: "👋{skin}" },
  { trigger: ":ok:", text: "👌{skin}" },
  { trigger: ":clap:", text: "👏{skin}" },
  { trigger: ":pray:", text: "🙏{skin}" }
];

ghost.define({
  id: "community.emoji",
  name: "Emoji",
  version: "1.0.0",
  author: "Ghost Typist",
  description: "Type :) then Tab for 😊. Hands and people use the skin tone in Options.",
  settings: [
    { id: "skin", title: "Skin tone", type: "choice", value: "👍",
      options: ["👍", "👍🏻", "👍🏼", "👍🏽", "👍🏾", "👍🏿"],
      help: "Hands and people use this tone. Faces such as :) do not." },
    { id: "emoji", title: "Replacements", type: "list",
      columns: [
        { id: "trigger", title: "You type" },
        { id: "text", title: "Emoji" }
      ],
      value: rows,
      help: "Type one of these, then Tab. {skin} uses the tone above. Add your own rows here." }
  ],
  expansionsFrom: "emoji",
  typedExpansions: true
})
