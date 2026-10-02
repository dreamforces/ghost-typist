// ghost {"id":"community.upper-case","name":"ALL CAPS","version":"1.1.0","author":"Ghost Typist","description":"Type /caps and some text, then Tab, for capital letters. An option follows Turkish rules, where i becomes İ.","tags":["commands"],"capabilities":["1 command"]}
//
// Type /caps and press Tab. The extension's Options say what you type after the slash (it can be
// several names, such as "caps, c"), so the command is named where you can change it.

const text = (ctx) => {
  if (!ctx.args) throw new Error("type some text after the command.");
  return ctx.args;
};

ghost.define({
  id: "community.upper-case",
  name: "ALL CAPS",
  version: "1.1.0",
  author: "Ghost Typist",
  description: "Type /caps and some text, then Tab, for capital letters. An option follows Turkish rules, where i becomes İ.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "caps",
      help: "What you type after the /. Several names work: caps, c." },
    { id: "rules", title: "Language rules", type: "choice", value: "Standard", options: ["Standard", "Turkish"],
      help: "Turkish writes i as İ and ı as I." }
  ],
  commands: {
    caps: {
      title: "ALL CAPS",
      nameFrom: "command",
      usage: "<text>",
      examples: ["quiet please", "istanbul"],
      run(ctx) {
        return ctx.settings.rules === "Turkish" ? text(ctx).toLocaleUpperCase("tr") : text(ctx).toUpperCase();
      }
    }
  }
})
