// ghost {"id":"community.lower-case","name":"lower case","version":"1.0.0","author":"Ghost Typist","description":"Type /lower and some text, then Tab, for small letters.","tags":["commands"],"capabilities":["1 command"]}
//
// Type /lower and press Tab. The extension's Options say what you type after the slash (it can be
// several names, such as "lower, l"), so the command is named where you can change it.

const text = (ctx) => {
  if (!ctx.args) throw new Error("type some text after the command.");
  return ctx.args;
};

ghost.define({
  id: "community.lower-case",
  name: "lower case",
  version: "1.0.0",
  author: "Ghost Typist",
  description: "Type /lower and some text, then Tab, for small letters.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "lower",
      help: "What you type after the /. Give it several names with commas, such as lower, l." }
  ],
  commands: {
    lower: {
      title: "lower case",
      nameFrom: "command",
      usage: "<text>",
      run(ctx) {
        return text(ctx).toLowerCase();
      }
    }
  }
})
