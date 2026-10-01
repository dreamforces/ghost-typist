// ghost {"id":"community.pascal-case","name":"PascalCase","version":"1.0.0","author":"Ghost Typist","description":"Type /pascal and some text, then Tab, to join its words with a capital letter on each.","tags":["commands"],"capabilities":["1 command"]}
//
// Type /pascal and press Tab. The extension's Options say what you type after the slash (it can be
// several names, such as "pascal, p"), so the command is named where you can change it.

const text = (ctx) => {
  if (!ctx.args) throw new Error("type some text after the command.");
  return ctx.args;
};

// Splits "helloWorld", "HTMLParser", "hello_world" and "hello-world" into words.
const words = (s) => s
  .replace(/([\p{Ll}\d])(\p{Lu})/gu, "$1 $2")
  .replace(/(\p{Lu}+)(\p{Lu}\p{Ll})/gu, "$1 $2")
  .split(/[\s_-]+/).filter(Boolean);
const capital = (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();

ghost.define({
  id: "community.pascal-case",
  name: "PascalCase",
  version: "1.0.0",
  author: "Ghost Typist",
  description: "Type /pascal and some text, then Tab, to join its words with a capital letter on each.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "pascal",
      help: "What you type after the /. Give it several names with commas, such as pascal, p." }
  ],
  commands: {
    pascal: {
      title: "PascalCase",
      nameFrom: "command",
      usage: "<text>",
      run(ctx) {
        return words(text(ctx)).map(capital).join("");
      }
    }
  }
})
