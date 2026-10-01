// ghost {"id":"community.upper-case","name":"ALL CAPS","version":"1.0.0","author":"Ghost Typist","description":"Type /caps and some text, then Tab, for capital letters.","tags":["commands"],"capabilities":["1 command"]}
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
  version: "1.0.0",
  author: "Ghost Typist",
  description: "Type /caps and some text, then Tab, for capital letters.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "caps",
      help: "What you type after the /. Give it several names with commas, such as caps, c." }
  ],
  commands: {
    caps: {
      title: "ALL CAPS",
      nameFrom: "command",
      usage: "<text>",
      run(ctx) {
        return text(ctx).toUpperCase();
      }
    }
  }
})
