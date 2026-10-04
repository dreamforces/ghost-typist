// ghost {"id":"community.pascal-case","name":"PascalCase","version":"1.2.1","author":"Ghost Typist","description":"Type /pascal and some text, then Tab, to join its words with a capital letter on each. An option starts with a small letter instead, for camelCase.","tags":["commands"],"capabilities":["1 command","1 action"]}
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
const capital = (w, locale) => w.charAt(0).toLocaleUpperCase(locale) + w.slice(1).toLocaleLowerCase(locale);

ghost.define({
  id: "community.pascal-case",
  name: "PascalCase",
  version: "1.2.1",
  author: "Ghost Typist",
  description: "Type /pascal and some text, then Tab, to join its words with a capital letter on each. An option starts with a small letter instead, for camelCase.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "pascal",
      help: "What you type after the /. Several names work: pascal, p." },
    { id: "camel", title: "Start with a small letter", type: "toggle", value: false, help: "camelCase instead of PascalCase." }
  ],
  commands: {
    pascal: {
      title: "PascalCase",
      nameFrom: "command",
      usage: "<text>",
      selection: true,
      examples: ["hello world again", "user_account_id"],
      run(ctx) {
        const locale = ctx.language || "en";
        const list = words(text(ctx)).map((w) => capital(w, locale));
        if (ctx.settings.camel && list.length) list[0] = list[0].charAt(0).toLocaleLowerCase(locale) + list[0].slice(1);
        return list.join("");
      }
    }
  }
})
