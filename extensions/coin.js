// ghost {"id":"community.coin","name":"Coin Flip","version":"1.0.0","author":"Ghost Typist","description":"Type /coin, then Tab, to flip a coin. Options choose what it says: heads or tails, yes or no, or 1 or 0.","tags":["commands"],"capabilities":["1 command"]}
//
// Type /coin and press Tab. The extension's Options say what you type after the slash (it can be
// several names, such as "coin, c"), so the command is named where you can change it.

ghost.define({
  id: "community.coin",
  name: "Coin Flip",
  version: "1.0.0",
  author: "Ghost Typist",
  description: "Type /coin, then Tab, to flip a coin. Options choose what it says: heads or tails, yes or no, or 1 or 0.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "coin",
      help: "What you type after the /. Give it several names with commas, such as coin, c." },
    { id: "faces", title: "Answers", type: "choice", value: "Heads or tails", options: ["Heads or tails", "Yes or no", "1 or 0"] }
  ],
  commands: {
    coin: {
      title: "Flip a coin",
      nameFrom: "command",
      run(ctx) {
        const faces = { "Heads or tails": ["Heads", "Tails"], "Yes or no": ["Yes", "No"], "1 or 0": ["1", "0"] }[ctx.settings.faces];
        return faces[ghost.random(2)];
      }
    }
  }
})
