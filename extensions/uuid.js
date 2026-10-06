// ghost {"id":"community.uuid","name":"UUID","version":"1.1.1","author":"Ghost Typist","description":"Type /uuid, then Tab, for a random UUID. Options set the version, the letter case, the hyphens and braces.","icon":"number","tags":["commands"],"capabilities":["1 command"]}
//
// Type /uuid and press Tab. The extension's Options say what you type after the slash (it can be
// several names, such as "uuid, u"), so the command is named where you can change it.

ghost.define({
  id: "community.uuid",
  name: "UUID",
  version: "1.1.1",
  author: "Ghost Typist",
  description: "Type /uuid, then Tab, for a random UUID. Options set the version, the letter case, the hyphens and braces.",
  icon: "number",
  settings: [
    { id: "command", title: "Command", type: "text", value: "uuid",
      help: "What you type after the /. Several names work: uuid, u." },
    { id: "version", title: "Version", type: "choice", value: "v4 (random)", options: ["v4 (random)", "v7 (time-ordered)"],
      help: "v7 starts with the time, so new ones sort after older ones." },
    { id: "uppercase", title: "Uppercase letters", type: "toggle", value: false },
    { id: "hyphens", title: "Hyphens", type: "toggle", value: true },
    { id: "braces", title: "Wrap in braces", type: "toggle", value: false }
  ],
  commands: {
    uuid: {
      title: "Random UUID",
      nameFrom: "command",
      examples: [""],
      run(ctx) {
        const b = Array.from({ length: 16 }, () => ghost.random(256));
        if (ctx.settings.version.startsWith("v7")) {
          let t = Date.now();
          for (let i = 5; i >= 0; i--) { b[i] = t % 256; t = Math.floor(t / 256); }
          b[6] = (b[6] & 0x0f) | 0x70;
        } else {
          b[6] = (b[6] & 0x0f) | 0x40;
        }
        b[8] = (b[8] & 0x3f) | 0x80;
        let hex = b.map((x) => x.toString(16).padStart(2, "0")).join("");
        if (ctx.settings.hyphens) hex = [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join("-");
        if (ctx.settings.uppercase) hex = hex.toUpperCase();
        return ctx.settings.braces ? "{" + hex + "}" : hex;
      }
    }
  }
})
