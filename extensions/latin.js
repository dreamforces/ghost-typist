// ghost {"id":"community.latin","name":"Latin Letters","version":"1.1.1","author":"Ghost Typist","description":"Type /latin and some text, then Tab, to write it in plain Latin letters: Café becomes Cafe and İzmir becomes Izmir. An option writes a URL slug instead.","tags":["commands"],"capabilities":["1 command","1 action"]}
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
  version: "1.1.1",
  author: "Ghost Typist",
  description: "Type /latin and some text, then Tab, to write it in plain Latin letters: Café becomes Cafe and İzmir becomes Izmir. An option writes a URL slug instead.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "latin",
      help: "What you type after the /. Several names work: latin, l." },
    { id: "output", title: "Write as", type: "choice", value: "Plain letters", options: ["Plain letters", "URL slug"],
      help: "A slug is lower case with hyphens, such as cafe-izmir." }
  ],
  commands: {
    latin: {
      title: "Plain Latin letters",
      nameFrom: "command",
      usage: "<text>",
      selection: true,
      examples: ["Café İzmir Şişli", "Çok Güzel Bir Gün!"],
      run(ctx) {
        const plain = ghost.latin(text(ctx));
        if (ctx.settings.output !== "URL slug") return plain;
        const slug = plain.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        if (!slug) throw new Error("there is nothing left for a slug.");
        return slug;
      }
    }
  }
})
