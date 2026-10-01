// ghost {"id":"community.random","name":"Random Number","version":"1.0.0","author":"Ghost Typist","description":"Type /random, then Tab, for a random whole number. /random 6 picks 1 to 6 and /random 3-9 picks 3 to 9. Options set the range for plain /random.","tags":["commands"],"capabilities":["1 command"]}
//
// Type /random and press Tab. The extension's Options say what you type after the slash (it can be
// several names, such as "random, r"), so the command is named where you can change it.

ghost.define({
  id: "community.random",
  name: "Random Number",
  version: "1.0.0",
  author: "Ghost Typist",
  description: "Type /random, then Tab, for a random whole number. /random 6 picks 1 to 6 and /random 3-9 picks 3 to 9. Options set the range for plain /random.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "random",
      help: "What you type after the /. Give it several names with commas, such as random, r." },
    { id: "minimum", title: "Lowest number", type: "number", value: 1, help: "The range of a plain /random." },
    { id: "maximum", title: "Highest number", type: "number", value: 100 }
  ],
  commands: {
    random: {
      title: "Random number",
      nameFrom: "command",
      usage: "[6 or 3-9]",
      run(ctx) {
        let low = ctx.settings.minimum, high = ctx.settings.maximum;
        const given = ctx.args.trim();
        if (given) {
          const single = given.match(/^\d+$/), pair = given.match(/^(-?\d+)\s*(?:[-–—]|\s)\s*(-?\d+)$/);
          if (single) { low = 1; high = Number(given); }
          else if (pair) { low = Number(pair[1]); high = Number(pair[2]); }
          else throw new Error("give a range like 6 or 3-9.");
        }
        if (low > high) [low, high] = [high, low];
        if (Math.abs(low) > 1e12 || Math.abs(high) > 1e12) throw new Error("that range is too large.");
        return String(low + ghost.random(high - low + 1));
      }
    }
  }
})
