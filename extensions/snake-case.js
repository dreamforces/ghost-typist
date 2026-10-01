// ghost {"id":"community.snake-case","name":"snake_case","version":"1.0.0","author":"Ghost Typist","description":"Type /snake and some text, then Tab, to join its words in lower case with underscores.","tags":["commands"],"capabilities":["1 command"]}
//
// Type /snake and press Tab. The extension's Options say what you type after the slash (it can be
// several names, such as "snake, s"), so the command is named where you can change it.

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
  id: "community.snake-case",
  name: "snake_case",
  version: "1.0.0",
  author: "Ghost Typist",
  description: "Type /snake and some text, then Tab, to join its words in lower case with underscores.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "snake",
      help: "What you type after the /. Give it several names with commas, such as snake, s." }
  ],
  commands: {
    snake: {
      title: "snake_case",
      nameFrom: "command",
      usage: "<text>",
      run(ctx) {
        return words(text(ctx)).map((w) => w.toLowerCase()).join("_");
      }
    }
  }
})
