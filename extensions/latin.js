// ghost {"id":"community.latin","name":"Latin Letters","version":"1.0.0","author":"Ghost Typist","description":"Type /latin and some text, then Tab, to write it in plain Latin letters: Café becomes Cafe and İzmir becomes Izmir.","tags":["commands"],"capabilities":["1 command"]}
//
// Type /latin and press Tab. The extension's Options say what you type after the slash (it can be
// several names, such as "latin, l"), so the command is named where you can change it.

const text = (ctx) => {
  if (!ctx.args) throw new Error("type some text after the command.");
  return ctx.args;
};

ghost.define({
  id: "community.latin",
  name: "Latin Letters",
  version: "1.0.0",
  author: "Ghost Typist",
  description: "Type /latin and some text, then Tab, to write it in plain Latin letters: Café becomes Cafe and İzmir becomes Izmir.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "latin",
      help: "What you type after the /. Give it several names with commas, such as latin, l." }
  ],
  commands: {
    latin: {
      title: "Plain Latin letters",
      nameFrom: "command",
      usage: "<text>",
      run(ctx) {
        return ghost.latin(text(ctx));
      }
    }
  }
})
