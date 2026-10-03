// ghost {"id":"community.date","name":"Date","version":"1.3.0","author":"Ghost Typist","description":"Type /date, then Tab, for today's date. /date yesterday or /date next Tue gives another day. Options set the format and the language.","tags":["commands"],"capabilities":["1 command"]}
//
// Type /date and press Tab. The extension's Options say what you type after the slash (it can be
// several names, such as "date, d"), so the command is named where you can change it.

const LANGUAGES = { English: "en", Turkish: "tr", German: "de", French: "fr", Spanish: "es", Italian: "it", Portuguese: "pt", Dutch: "nl" };

// yyyy yy | MMMM MMM MM M | dd d | EEEE EEE | HH H hh h | mm | ss | a. Text in [brackets] is kept as it is.
const format = (d, pattern, locale, utc) => {
  const zone = utc ? "UTC" : undefined;
  const part = (options) => d.toLocaleString(locale, { ...options, timeZone: zone });
  const two = (n) => String(n).padStart(2, "0");
  const f = utc
    ? { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate(), h: d.getUTCHours(), i: d.getUTCMinutes(), s: d.getUTCSeconds() }
    : { y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate(), h: d.getHours(), i: d.getMinutes(), s: d.getSeconds() };
  return pattern.replace(/\[([^\]]*)\]|y{4}|y{2}|M{1,4}|d{1,2}|E{3,4}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|a/g, (t, literal) => {
    if (literal !== undefined) return literal;
    switch (t) {
      case "yyyy": return String(f.y);
      case "yy": return two(f.y % 100);
      case "MMMM": return part({ month: "long" });
      case "MMM": return part({ month: "short" });
      case "MM": return two(f.m);
      case "M": return String(f.m);
      case "dd": return two(f.d);
      case "d": return String(f.d);
      case "EEEE": return part({ weekday: "long" });
      case "EEE": return part({ weekday: "short" });
      case "HH": return two(f.h);
      case "H": return String(f.h);
      case "hh": return two(f.h % 12 || 12);
      case "h": return String(f.h % 12 || 12);
      case "mm": return two(f.i);
      case "m": return String(f.i);
      case "ss": return two(f.s);
      case "s": return String(f.s);
      default: return f.h < 12 ? "AM" : "PM";
    }
  });
};

ghost.define({
  id: "community.date",
  name: "Date",
  version: "1.3.0",
  author: "Ghost Typist",
  description: "Type /date, then Tab, for today's date. /date yesterday or /date next Tue gives another day. Options set the format and the language.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "date",
      help: "What you type after the /. Several names work: date, d. Try yesterday, next Tue, last Thursday of last month, 6 October 2026, or +7." },
    { id: "format", title: "Format", type: "choice", value: "Long",
      options: ["Long", "American", "Day/Month/Year", "Month/Day/Year", "Year-Month-Day", "With weekday", "Custom"] },
    { id: "pattern", title: "Custom pattern", type: "text", value: "EEEE d MMMM yyyy",
      when: { setting: "format", equals: "Custom" }, help: "Letters: yyyy year, MMMM month name, MM month, dd day, EEEE weekday, HH or hh hours, mm minutes, ss seconds, a AM/PM. Put text in [brackets]." },
    { id: "language", title: "Language", type: "choice", value: "System", options: ["System", "English", "Turkish", "German", "French", "Spanish", "Italian", "Portuguese", "Dutch"],
      help: "The language of month and weekday names. System follows the language you are writing." }
  ],
  commands: {
    date: {
      title: "Today's date",
      nameFrom: "command",
      usage: "[tomorrow or +7]",
      examples: ["", "yesterday", "next Tue", "+7"],
      run(ctx) {
        const patterns = {
          "Long": "d MMMM yyyy", "American": "MMMM d, yyyy", "Day/Month/Year": "dd/MM/yyyy", "Month/Day/Year": "MM/dd/yyyy",
          "Year-Month-Day": "yyyy-MM-dd", "With weekday": "EEEE, d MMMM yyyy", "Custom": ctx.settings.pattern
        };
        const chosen = ctx.settings.language;
        const locale = !chosen || chosen === "System" ? ctx.language : LANGUAGES[chosen];
        const given = String(ctx.args || "").trim();
        let d = new Date();
        if (given) {
          const iso = ghost.date(given, { language: locale });
          const parts = iso.split("-");
          d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        }
        return format(d, patterns[ctx.settings.format] || patterns.Long, locale, false);
      }
    }
  }
})
