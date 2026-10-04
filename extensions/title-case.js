// ghost {"id":"community.title-case","name":"Title Case","version":"1.3.1","author":"Ghost Typist","description":"Type /title and some text, then Tab, to capitalise each word. Options keep small words such as of and the in lower case and leave ALL-CAPS words alone.","tags":["commands"],"capabilities":["1 command","1 action"]}
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
const capital = (w, locale) => w.charAt(0).toLocaleUpperCase(locale) + w.slice(1).toLocaleLowerCase(locale);

ghost.define({
  id: "community.title-case",
  name: "Title Case",
  version: "1.3.1",
  author: "Ghost Typist",
  description: "Type /title and some text, then Tab, to capitalise each word. Options keep small words such as of and the in lower case and leave ALL-CAPS words alone.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "title",
      help: "What you type after the /. Several names work: title, t." },
    { id: "small-words", title: "Keep small words lowercase", type: "toggle", value: true,
      help: "Leaves a, an, and, of, the and similar words in lower case, except the first and last." },
    { id: "acronyms", title: "Keep ALL-CAPS words", type: "toggle", value: true, help: "NASA stays NASA instead of becoming Nasa." }
  ],
  commands: {
    title: {
      title: "Title Case",
      nameFrom: "command",
      usage: "<text>",
      selection: true,
      examples: ["the lord of the rings", "NASA and the moon"],
      run(ctx) {
        const locale = ctx.language || "en";
        const english = locale.toLowerCase().startsWith("en");
        const small = ["a", "an", "and", "as", "at", "but", "by", "for", "in", "nor", "of", "on", "or", "the", "to", "via", "vs"];
        const parts = text(ctx).split(" ");
        return parts.map((w, i) => {
          if (ctx.settings.acronyms && w.length > 1 && w === w.toUpperCase() && w !== w.toLowerCase()) return w;
          const lower = w.toLocaleLowerCase(locale);
          return ctx.settings["small-words"] && english && i > 0 && i < parts.length - 1 && small.includes(lower) ? lower : capital(w, locale);
        }).join(" ");
      }
    }
  }
})
