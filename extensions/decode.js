// ghost {"id":"community.decode","name":"HTML Decode","version":"1.0.0","author":"Ghost Typist","description":"Type /decode and some text, then Tab, to turn HTML entities such as &lt; and &#39; back into characters.","tags":["commands"],"capabilities":["1 command"]}
//
// Type /decode and press Tab. The extension's Options say what you type after the slash (it can be
// several names, such as "decode, d"), so the command is named where you can change it.

const text = (ctx) => {
  if (!ctx.args) throw new Error("type some text after the command.");
  return ctx.args;
};

ghost.define({
  id: "community.decode",
  name: "HTML Decode",
  version: "1.0.0",
  author: "Ghost Typist",
  description: "Type /decode and some text, then Tab, to turn HTML entities such as &lt; and &#39; back into characters.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "decode",
      help: "What you type after the /. Give it several names with commas, such as decode, d." }
  ],
  commands: {
    decode: {
      title: "Decode HTML characters",
      nameFrom: "command",
      usage: "<text>",
      run(ctx) {
        const names = { lt: "<", gt: ">", quot: '"', apos: "'", amp: "&" };
        return text(ctx).replace(/&(#x[0-9a-f]+|#\d+|lt|gt|quot|apos|amp);/gi, (all, body) => {
          if (body[0] !== "#") return names[body.toLowerCase()];
          const code = body[1] === "x" || body[1] === "X" ? parseInt(body.slice(2), 16) : Number(body.slice(1));
          return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : all;
        });
      }
    }
  }
})
