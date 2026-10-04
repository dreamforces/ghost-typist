// ghost {"id":"community.decode","name":"HTML Decode","version":"1.1.1","author":"Ghost Typist","description":"Type /decode and some text, then Tab, to turn HTML entities such as &lt;, &#39; and &copy; back into characters.","tags":["commands"],"capabilities":["1 command","1 action"]}
//
// Type /decode and press Tab. The extension's Options say what you type after the slash (it can be
// several names, such as "decode, d"), so the command is named where you can change it.

const text = (ctx) => {
  if (!ctx.args) throw new Error("type some text after the command.");
  return ctx.args;
};

ghost.define({
  id: "community.decode",
  name: "HTML Decode",
  version: "1.1.1",
  author: "Ghost Typist",
  description: "Type /decode and some text, then Tab, to turn HTML entities such as &lt;, &#39; and &copy; back into characters.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "decode",
      help: "What you type after the /. Several names work: decode, d." },
    { id: "common", title: "Also decode names like &copy;", type: "toggle", value: true,
      help: "Off decodes only &lt; &gt; &quot; &apos; &amp; and numbers like &#39;." },
    { id: "spaces", title: "Turn &nbsp; into a plain space", type: "toggle", value: false }
  ],
  commands: {
    decode: {
      title: "Decode HTML characters",
      nameFrom: "command",
      usage: "<text>",
      selection: true,
      examples: ["&lt;b&gt;Tom &amp; Jerry&lt;/b&gt; &copy; 2026"],
      run(ctx) {
        const names = { lt: "<", gt: ">", quot: '"', apos: "'", amp: "&" };
        if (ctx.settings.common) {
          Object.assign(names, { nbsp: 160, copy: 169, reg: 174, trade: 8482, hellip: 8230, mdash: 8212, ndash: 8211, lsquo: 8216, rsquo: 8217,
            ldquo: 8220, rdquo: 8221, laquo: 171, raquo: 187, euro: 8364, pound: 163, yen: 165, cent: 162, deg: 176, plusmn: 177, times: 215,
            divide: 247, bull: 8226, middot: 183, para: 182, sect: 167 });
        }
        const character = (code) => ctx.settings.spaces && code === 160 ? " " : String.fromCodePoint(code);
        return text(ctx).replace(/&(#x[0-9a-f]+|#\d+|[a-z]+\d*);/gi, (all, body) => {
          if (body[0] === "#") {
            const code = body[1] === "x" || body[1] === "X" ? parseInt(body.slice(2), 16) : Number(body.slice(1));
            return code > 0 && code <= 0x10ffff ? character(code) : all;
          }
          const known = names[body.toLowerCase()];
          return known === undefined ? all : typeof known === "number" ? character(known) : known;
        });
      }
    }
  }
})
