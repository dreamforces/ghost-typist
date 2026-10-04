// ghost {"id":"community.lower-case","name":"lower case","version":"1.2.1","author":"Ghost Typist","description":"Type /lower and some text, then Tab, for small letters. An option follows Turkish rules, where I becomes ı.","tags":["commands"],"capabilities":["1 command","1 action"]}
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
  version: "1.2.1",
  author: "Ghost Typist",
  description: "Type /lower and some text, then Tab, for small letters. An option follows Turkish rules, where I becomes ı.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "lower",
      help: "What you type after the /. Several names work: lower, l." },
    { id: "rules", title: "Language rules", type: "choice", value: "Standard", options: ["Standard", "Turkish"],
      help: "Standard follows the language you are writing. Turkish always writes I as ı and İ as i." }
  ],
  commands: {
    lower: {
      title: "lower case",
      nameFrom: "command",
      usage: "<text>",
      selection: true,
      examples: ["QUIET PLEASE", "ISTANBUL"],
      run(ctx) {
        const locale = ctx.settings.rules === "Turkish" ? "tr" : (ctx.language || "en");
        return text(ctx).toLocaleLowerCase(locale);
      }
    }
  }
})
