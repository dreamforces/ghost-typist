// ghost {"id":"community.base64","name":"Base64","version":"1.0.0","author":"Ghost Typist","description":"Type /base64 and some text, then Tab, to encode it. /base64 -d and Base64 text decodes it. Options choose which way a plain /base64 goes.","tags":["commands"],"capabilities":["1 command"]}
//
// Type /base64 and press Tab. The extension's Options say what you type after the slash (it can be
// several names, such as "base64, b"), so the command is named where you can change it.

ghost.define({
  id: "community.base64",
  name: "Base64",
  version: "1.0.0",
  author: "Ghost Typist",
  description: "Type /base64 and some text, then Tab, to encode it. /base64 -d and Base64 text decodes it. Options choose which way a plain /base64 goes.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "base64",
      help: "What you type after the /. Give it several names with commas, such as base64, b." },
    { id: "direction", title: "Without a flag", type: "choice", value: "Encode", options: ["Encode", "Decode"],
      help: "-d always decodes and -e always encodes, whatever this is set to." }
  ],
  commands: {
    base64: {
      title: "Base64 encode or decode",
      nameFrom: "command",
      usage: "<text>",
      run(ctx) {
        let given = ctx.args.trim(), decode = ctx.settings.direction === "Decode";
        const flag = given.match(/^-([de])\s+([\s\S]*)$/);
        if (flag) { decode = flag[1] === "d"; given = flag[2]; }
        if (!given) throw new Error("type the text after the command. Add -d to decode.");
        if (!decode) return ghost.base64Encode(given);
        const plain = ghost.base64Decode(given);
        if (typeof plain !== "string") throw new Error("that is not valid Base64 text.");
        return plain;
      }
    }
  }
})
