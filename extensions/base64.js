// ghost {"id":"community.base64","name":"Base64","version":"1.1.3","author":"Ghost Typist","description":"Type /base64 and some text, then Tab, to encode it. /base64 -d decodes. Options set the direction and whether the result is URL-safe.","icon":"number.square","tags":["commands"],"capabilities":["1 command","1 action"]}
//
// Type /base64 and press Tab. The extension's Options say what you type after the slash (it can be
// several names, such as "base64, b"), so the command is named where you can change it.

ghost.define({
  id: "community.base64",
  name: "Base64",
  version: "1.1.3",
  author: "Ghost Typist",
  description: "Type /base64 and some text, then Tab, to encode it. /base64 -d decodes. Options set the direction and whether the result is URL-safe.",
  icon: "number.square",
  settings: [
    { id: "command", title: "Command", type: "text", value: "base64",
      help: "What you type after the /. Several names work: base64, b." },
    { id: "direction", title: "Without a flag", type: "choice", value: "Encode", options: ["Encode", "Decode"],
      help: "-d always decodes and -e always encodes, whatever this is set to." },
    { id: "urlsafe", title: "URL-safe", type: "toggle", value: false, help: "Writes - and _ instead of + and /, with no = at the end." }
  ],
  commands: {
    base64: {
      title: "Base64 encode or decode",
      nameFrom: "command",
      usage: "<text>",
      selection: true,
      examples: ["hello", "-d aGVsbG8="],
      run(ctx) {
        let given = ctx.args.trim(), decode = ctx.settings.direction === "Decode";
        const flag = given.match(/^-([de])\s+([\s\S]*)$/);
        if (flag) { decode = flag[1] === "d"; given = flag[2]; }
        if (!given) throw new Error("type the text after the command. Add -d to decode.");
        if (!decode) {
          const out = ghost.base64Encode(given);
          return ctx.settings.urlsafe ? out.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : out;
        }
        // Either alphabet decodes, with or without the = at the end.
        let normal = given.replace(/-/g, "+").replace(/_/g, "/");
        while (normal.length % 4) normal += "=";
        const plain = ghost.base64Decode(normal);
        if (typeof plain !== "string") throw new Error("that is not valid Base64 text.");
        return plain;
      }
    }
  }
})
