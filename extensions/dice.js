// ghost {"id":"community.dice","name":"Dice","version":"1.1.1","author":"Ghost Typist","description":"Type /dice, then Tab, to roll a die. /dice 20 rolls a 20-sided one and /dice 2d6 rolls two six-sided dice. Options set the dice a plain /dice rolls.","icon":"die.face.5","tags":["commands"],"capabilities":["1 command"]}
//
// Type /dice and press Tab. The extension's Options say what you type after the slash (it can be
// several names, such as "dice, d"), so the command is named where you can change it.

ghost.define({
  id: "community.dice",
  name: "Dice",
  version: "1.1.1",
  author: "Ghost Typist",
  description: "Type /dice, then Tab, to roll a die. /dice 20 rolls a 20-sided one and /dice 2d6 rolls two six-sided dice. Options set the dice a plain /dice rolls.",
  icon: "die.face.5",
  settings: [
    { id: "command", title: "Command", type: "text", value: "dice",
      help: "What you type after the /. Several names work: dice, d." },
    { id: "sides", title: "Sides", type: "number", value: 6, help: "2 to 1000." },
    { id: "count", title: "Dice", type: "number", value: 1, help: "1 to 20." },
    { id: "show", title: "Show", type: "choice", value: "Total", options: ["Total", "Each roll", "Rolls and total"],
      help: "Matters when there is more than one die." }
  ],
  commands: {
    dice: {
      title: "Roll dice",
      nameFrom: "command",
      usage: "[20 or 2d6]",
      examples: ["", "20", "2d6"],
      run(ctx) {
        let sides = ctx.settings.sides, count = ctx.settings.count;
        const given = ctx.args.trim().toLowerCase();
        if (given) {
          const m = given.match(/^(?:(\d+)?d)?(\d+)$/);
          if (!m) throw new Error("give sides such as 20, or dice such as 2d6.");
          if (m[1]) count = Number(m[1]);
          sides = Number(m[2]);
        }
        if (!Number.isInteger(sides) || sides < 2 || sides > 1000) throw new Error("sides is 2 to 1000.");
        if (!Number.isInteger(count) || count < 1 || count > 20) throw new Error("dice is 1 to 20.");
        const rolls = Array.from({ length: count }, () => 1 + ghost.random(sides));
        const total = rolls.reduce((a, b) => a + b, 0);
        if (count === 1) return String(total);
        if (ctx.settings.show === "Each roll") return rolls.join(", ");
        if (ctx.settings.show === "Rolls and total") return rolls.join(" + ") + " = " + total;
        return String(total);
      }
    }
  }
})
