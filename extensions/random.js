// ghost {"id":"community.random","name":"Random Number","version":"1.2.1","author":"Ghost Typist","description":"Type /random, then Tab, for a random number in the default range. /random 200 goes up to 200, and /random 3-9 uses that range.","icon":"shuffle","tags":["commands"],"capabilities":["1 command"]}
//
// Type /random and press Tab. The extension's Options say what you type after the slash (it can be
// several names, such as "random, r"), so the command is named where you can change it.

ghost.define({
  id: "community.random",
  name: "Random Number",
  version: "1.2.1",
  author: "Ghost Typist",
  description: "Type /random, then Tab, for a random number in the default range. /random 200 goes up to 200, and /random 3-9 uses that range.",
  icon: "shuffle",
  settings: [
    { id: "command", title: "Command", type: "text", value: "random",
      help: "What you type after the /. Several names work: random, r." },
    { id: "minimum", title: "From", type: "number", value: 1, help: "The default range of /random on its own. /random 200 keeps this number and goes up to 200." },
    { id: "maximum", title: "Up to", type: "number", value: 100, help: "The high end of a plain /random. /random 3-9 ignores both and uses the range you type." },
    { id: "decimals", title: "Decimal places", type: "number", value: 0, help: "0 to 6. With 2, /random gives numbers like 41.27." }
  ],
  commands: {
    random: {
      title: "Random number",
      nameFrom: "command",
      usage: "[200 or 3-9]",
      examples: ["", "200", "3-9"],
      run(ctx) {
        let low = ctx.settings.minimum, high = ctx.settings.maximum;
        const given = ctx.args.trim();
        if (given) {
          const single = given.match(/^\d+$/), pair = given.match(/^(-?\d+)\s*(?:[-–—]|\s)\s*(-?\d+)$/);
          if (single) high = Number(given);
          else if (pair) { low = Number(pair[1]); high = Number(pair[2]); }
          else throw new Error("give a range like 200 or 3-9.");
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
