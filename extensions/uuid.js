// ghost {"id":"community.uuid","name":"UUID","version":"1.0.0","author":"Ghost Typist","description":"Type /uuid, then Tab, for a random version 4 UUID. Options set the letter case and whether it has hyphens.","tags":["commands"],"capabilities":["1 command"]}
//
// Type /uuid and press Tab. The extension's Options say what you type after the slash (it can be
// several names, such as "uuid, u"), so the command is named where you can change it.

ghost.define({
  id: "community.uuid",
  name: "UUID",
  version: "1.0.0",
  author: "Ghost Typist",
  description: "Type /uuid, then Tab, for a random version 4 UUID. Options set the letter case and whether it has hyphens.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "uuid",
      help: "What you type after the /. Give it several names with commas, such as uuid, u." },
    { id: "uppercase", title: "Uppercase letters", type: "toggle", value: false },
    { id: "hyphens", title: "Hyphens", type: "toggle", value: true }
  ],
  commands: {
    uuid: {
      title: "Random UUID",
      nameFrom: "command",
      run(ctx) {
        const b = Array.from({ length: 16 }, () => ghost.random(256));
        b[6] = (b[6] & 0x0f) | 0x40;
        b[8] = (b[8] & 0x3f) | 0x80;
        let hex = b.map((x) => x.toString(16).padStart(2, "0")).join("");
        if (ctx.settings.hyphens) hex = [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join("-");
        return ctx.settings.uppercase ? hex.toUpperCase() : hex;
      }
    }
  }
})
