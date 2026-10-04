// ghost {"id":"community.encode","name":"HTML Encode","version":"1.1.1","author":"Ghost Typist","description":"Type /encode and some text, then Tab, to turn &, < and > into HTML entities. Options choose whether quotes and non-ASCII letters are encoded too.","tags":["commands"],"capabilities":["1 command","1 action"]}
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
  version: "1.1.1",
  author: "Ghost Typist",
  description: "Type /encode and some text, then Tab, to turn &, < and > into HTML entities. Options choose whether quotes and non-ASCII letters are encoded too.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "encode",
      help: "What you type after the /. Several names work: encode, e." },
    { id: "quotes", title: "Also encode quotes", type: "toggle", value: true },
    { id: "non-ascii", title: "Also encode accented letters", type: "toggle", value: false, help: "é becomes &#233;. Useful for plain-ASCII email and feeds." }
  ],
  commands: {
    encode: {
      title: "Encode HTML characters",
      nameFrom: "command",
      usage: "<text>",
      selection: true,
      examples: ["<b>Tom & \"Jerry\"</b>"],
      run(ctx) {
        let out = text(ctx).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        if (ctx.settings.quotes) out = out.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
        if (ctx.settings["non-ascii"]) out = out.replace(/[^\x00-\x7f]/gu, (c) => "&#" + c.codePointAt(0) + ";");
        return out;
      }
    }
  }
})
