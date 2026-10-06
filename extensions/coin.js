// ghost {"id":"community.coin","name":"Coin Flip","version":"1.1.1","author":"Ghost Typist","description":"Type /coin, then Tab, to flip a coin. Options choose what it says, from heads or tails to answers of your own, and how many flips.","icon":"centsign.circle","tags":["commands"],"capabilities":["1 command"]}
//
// Type /coin and press Tab. The extension's Options say what you type after the slash (it can be
// several names, such as "coin, c"), so the command is named where you can change it.

ghost.define({
  id: "community.coin",
  name: "Coin Flip",
  version: "1.1.1",
  author: "Ghost Typist",
  description: "Type /coin, then Tab, to flip a coin. Options choose what it says, from heads or tails to answers of your own, and how many flips.",
  icon: "centsign.circle",
  settings: [
    { id: "command", title: "Command", type: "text", value: "coin",
      help: "What you type after the /. Several names work: coin, c." },
    { id: "faces", title: "Answers", type: "choice", value: "Heads or tails", options: ["Heads or tails", "Yes or no", "1 or 0", "Custom"] },
    { id: "custom-faces", title: "Your two answers", type: "text", value: "Go, Stay",
      when: { setting: "faces", equals: "Custom" }, help: "Two answers, separated by a comma." },
    { id: "flips", title: "Flips", type: "number", value: 1, help: "1 to 20. More than one gives a list." }
  ],
  commands: {
    coin: {
      title: "Flip a coin",
      nameFrom: "command",
      examples: [""],
      run(ctx) {
        let faces = { "Heads or tails": ["Heads", "Tails"], "Yes or no": ["Yes", "No"], "1 or 0": ["1", "0"] }[ctx.settings.faces];
        if (!faces) {
          faces = ctx.settings["custom-faces"].split(",").map((s) => s.trim()).filter(Boolean);
          if (faces.length !== 2) throw new Error("give two answers separated by a comma in Options.");
        }
        const flips = Math.min(20, Math.max(1, ctx.settings.flips));
        return Array.from({ length: flips }, () => faces[ghost.random(2)]).join(", ");
      }
    }
  }
})
