// ghost {"id":"community.upper-case","name":"ALL CAPS","version":"1.2.0","author":"Ghost Typist","description":"Type /caps and some text, then Tab, for English capitals. /caps tr istanbul becomes İSTANBUL. A language code such as fr, de or el works the same way.","tags":["commands"],"capabilities":["1 command"]}
//
// Type /caps and press Tab. A language code before the text, such as tr or fr, capitalises in that language.

// A leading word is a language only when it is that language's own code, and more text follows.
// "in" is an old alias for Indonesian, so it stays part of the text.
const localeOf = (token) => {
  if (!/^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/i.test(token)) return null;
  let tag;
  try { tag = new Intl.Locale(token).baseName; } catch (e) { return null; }
  if (tag.toLowerCase() !== token.toLowerCase()) return null;
  try { return Intl.DateTimeFormat.supportedLocalesOf([tag], { localeMatcher: "lookup" }).length ? tag : null; }
  catch (e) { return null; }
};

ghost.define({
  id: "community.upper-case",
  name: "ALL CAPS",
  version: "1.2.0",
  author: "Ghost Typist",
  description: "Type /caps and some text, then Tab, for English capitals. /caps tr istanbul becomes İSTANBUL. A language code such as fr, de or el works the same way.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "caps",
      help: "What you type after the /. Several names work: caps, c." }
  ],
  commands: {
    caps: {
      title: "ALL CAPS",
      nameFrom: "command",
      usage: "<text>",
      examples: ["quiet please", "tr istanbul", "fr école", "el άθηνα"],
      run(ctx) {
        const raw = (ctx.args || "").trim();
        if (!raw) throw new Error("type some text after the command.");
        const gap = raw.search(/\s/);
        const first = gap === -1 ? raw : raw.slice(0, gap);
        const rest = gap === -1 ? "" : raw.slice(gap).trim();
        const locale = rest ? localeOf(first) : null;
        return (locale ? rest : raw).toLocaleUpperCase(locale || "en");
      }
    }
  }
})
