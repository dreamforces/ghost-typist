// ghost {"id":"community.dice","name":"Dice","version":"1.0.0","author":"Ghost Typist","description":"Type /dice, then Tab, to roll a die. /dice 20 rolls a 20-sided one. Options set the sides of a plain /dice.","tags":["commands"],"capabilities":["1 command"]}
//
// Type /dice and press Tab. The extension's Options say what you type after the slash (it can be
// several names, such as "dice, d"), so the command is named where you can change it.

ghost.define({
  id: "community.dice",
  name: "Dice",
  version: "1.0.0",
  author: "Ghost Typist",
  description: "Type /dice, then Tab, to roll a die. /dice 20 rolls a 20-sided one. Options set the sides of a plain /dice.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "dice",
      help: "What you type after the /. Give it several names with commas, such as dice, d." },
    { id: "sides", title: "Sides", type: "number", value: 6, help: "The die a plain /dice rolls: 2 to 1000." }
  ],
  commands: {
    dice: {
      title: "Roll a die",
      nameFrom: "command",
      usage: "[sides]",
      run(ctx) {
        const given = ctx.args.trim(), sides = given ? Number(given) : ctx.settings.sides;
        if (!Number.isInteger(sides) || sides < 2 || sides > 1000) throw new Error("sides is 2 to 1000.");
        return String(1 + ghost.random(sides));
      }
    }
  }
})
