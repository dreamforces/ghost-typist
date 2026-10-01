// ghost {"id":"community.encode","name":"HTML Encode","version":"1.0.0","author":"Ghost Typist","description":"Type /encode and some text, then Tab, to turn &, < and > into HTML entities. Options choose whether quotes are encoded too.","tags":["commands"],"capabilities":["1 command"]}
//
// Type /encode and press Tab. The extension's Options say what you type after the slash (it can be
// several names, such as "encode, e"), so the command is named where you can change it.

const text = (ctx) => {
  if (!ctx.args) throw new Error("type some text after the command.");
  return ctx.args;
};

ghost.define({
  id: "community.encode",
  name: "HTML Encode",
  version: "1.0.0",
  author: "Ghost Typist",
  description: "Type /encode and some text, then Tab, to turn &, < and > into HTML entities. Options choose whether quotes are encoded too.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "encode",
      help: "What you type after the /. Give it several names with commas, such as encode, e." },
    { id: "quotes", title: "Also encode quotes", type: "toggle", value: true }
  ],
  commands: {
    encode: {
      title: "Encode HTML characters",
      nameFrom: "command",
      usage: "<text>",
      run(ctx) {
        let out = text(ctx).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        if (ctx.settings.quotes) out = out.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
        return out;
      }
    }
  }
})
