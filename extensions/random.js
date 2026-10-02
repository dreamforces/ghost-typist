// ghost {"id":"community.random","name":"Random Number","version":"1.1.0","author":"Ghost Typist","description":"Type /random, then Tab, for a random number. /random 6 picks 1 to 6 and /random 3-9 picks 3 to 9. Options set the range for plain /random and how many decimals it has.","tags":["commands"],"capabilities":["1 command"]}
//
// Type /random and press Tab. The extension's Options say what you type after the slash (it can be
// several names, such as "random, r"), so the command is named where you can change it.

ghost.define({
  id: "community.random",
  name: "Random Number",
  version: "1.1.0",
  author: "Ghost Typist",
  description: "Type /random, then Tab, for a random number. /random 6 picks 1 to 6 and /random 3-9 picks 3 to 9. Options set the range for plain /random and how many decimals it has.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "random",
      help: "What you type after the /. Several names work: random, r." },
    { id: "minimum", title: "Lowest number", type: "number", value: 1, help: "The range of a plain /random." },
    { id: "maximum", title: "Highest number", type: "number", value: 100 },
    { id: "decimals", title: "Decimal places", type: "number", value: 0, help: "0 to 6. With 2, /random gives numbers like 41.27." }
  ],
  commands: {
    random: {
      title: "Random number",
      nameFrom: "command",
      usage: "[6 or 3-9]",
      examples: ["", "6", "3-9"],
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
        const places = Math.min(6, Math.max(0, ctx.settings.decimals)), scale = 10 ** places;
        if (Math.abs(low) > 1e12 || Math.abs(high) > 1e12 || (high - low) * scale > 9e15) throw new Error("that range is too large.");
        const n = ghost.random(Math.round((high - low) * scale) + 1);
        return places ? (low + n / scale).toFixed(places) : String(low + n);
      }
    }
  }
})
