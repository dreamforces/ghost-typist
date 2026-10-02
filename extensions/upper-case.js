// ghost {"id":"community.upper-case","name":"ALL CAPS","version":"1.4.0","author":"Ghost Typist","description":"Type /caps and some text, then Tab. Capitals follow the language you are writing.","tags":["commands"],"capabilities":["1 command"]}
//
// Type /caps and press Tab. Capitals follow the language of the writing.

ghost.define({
  id: "community.upper-case",
  name: "ALL CAPS",
  version: "1.4.0",
  author: "Ghost Typist",
  description: "Type /caps and some text, then Tab. Capitals follow the language you are writing.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "caps",
      help: "What you type after the /. Several names work: caps, c." }
  ],
  commands: {
    caps: {
      title: "ALL CAPS",
      nameFrom: "command",
      usage: "<text>",
      examples: ["quiet please", "istanbul"],
      run(ctx) {
        const raw = (ctx.args || "").trim();
        if (!raw) throw new Error("type some text after the command.");
        return raw.toLocaleUpperCase(ctx.language || "en");
      }
    }
  }
})
