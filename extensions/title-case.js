// ghost {"id":"community.title-case","name":"Title Case","version":"1.0.0","author":"Ghost Typist","description":"Type /title and some text, then Tab, to capitalise each word. Options can keep small words such as of and the in lower case.","tags":["commands"],"capabilities":["1 command"]}
//
// Type /title and press Tab. The extension's Options say what you type after the slash (it can be
// several names, such as "title, t"), so the command is named where you can change it.

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
  id: "community.title-case",
  name: "Title Case",
  version: "1.0.0",
  author: "Ghost Typist",
  description: "Type /title and some text, then Tab, to capitalise each word. Options can keep small words such as of and the in lower case.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "title",
      help: "What you type after the /. Give it several names with commas, such as title, t." },
    { id: "small-words", title: "Keep small words lowercase", type: "toggle", value: false,
      help: "Leaves a, an, and, of, the and similar words in lower case, except the first and last." }
  ],
  commands: {
    title: {
      title: "Title Case",
      nameFrom: "command",
      usage: "<text>",
      run(ctx) {
        const small = ["a", "an", "and", "as", "at", "but", "by", "for", "in", "nor", "of", "on", "or", "the", "to", "via", "vs"];
        const parts = text(ctx).split(" ");
        return parts.map((w, i) => ctx.settings["small-words"] && i > 0 && i < parts.length - 1 && small.includes(w.toLowerCase()) ? w.toLowerCase() : capital(w)).join(" ");
      }
    }
  }
})
