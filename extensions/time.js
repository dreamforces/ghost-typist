// ghost {"id":"community.time","name":"Time","version":"1.2.0","author":"Ghost Typist","description":"Type /time, then Tab, for the time now with its time zone. /time 24 changes one use. Options set the format and whether it is UTC.","tags":["commands"],"capabilities":["1 command"]}
//
// Type /time and press Tab. The extension's Options say what you type after the slash (it can be
// several names, such as "time, t"), so the command is named where you can change it.

const LANGUAGES = { System: undefined, English: "en", Turkish: "tr", German: "de", French: "fr", Spanish: "es", Italian: "it", Portuguese: "pt", Dutch: "nl" };


const zoneName = (d, utc) => {
  try {
    const parts = new Intl.DateTimeFormat(undefined, { timeZone: utc ? "UTC" : undefined, timeZoneName: "short" }).formatToParts(d);
    return (parts.find((part) => part.type === "timeZoneName") || {}).value || "";
  } catch (e) { return utc ? "UTC" : ""; }
};

// yyyy yy | MMMM MMM MM M | dd d | EEEE EEE | HH H hh h | mm | ss | a. Text in [brackets] is kept as it is.
const format = (d, pattern, locale, utc) => {
  const zone = utc ? "UTC" : undefined;
  const part = (options) => d.toLocaleString(locale, { ...options, timeZone: zone });
  const two = (n) => String(n).padStart(2, "0");
  const f = utc
    ? { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate(), h: d.getUTCHours(), i: d.getUTCMinutes(), s: d.getUTCSeconds() }
    : { y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate(), h: d.getHours(), i: d.getMinutes(), s: d.getSeconds() };
  return pattern.replace(/\[([^\]]*)\]|y{4}|y{2}|M{1,4}|d{1,2}|E{3,4}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|a|z/g, (t, literal) => {
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
      case "z": return zoneName(d, utc);
      default: return f.h < 12 ? "AM" : "PM";
    }
  });
};

ghost.define({
  id: "community.time",
  name: "Time",
  version: "1.2.0",
  author: "Ghost Typist",
  description: "Type /time, then Tab, for the time now with its time zone. /time 24 changes one use. Options set the format and whether it is UTC.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "time",
      help: "What you type after the /. Several names work: time, t." },
    { id: "format", title: "Format", type: "choice", value: "12-hour with time zone",
      options: ["12-hour", "12-hour with time zone", "24-hour", "24-hour with time zone", "Custom"] },
    { id: "pattern", title: "Custom pattern", type: "text", value: "HH:mm z",
      when: { setting: "format", equals: "Custom" }, help: "Letters: yyyy year, MMMM month name, MM month, dd day, EEEE weekday, HH or hh hours, mm minutes, ss seconds, a AM/PM, z time zone. Put text in [brackets]." },
    { id: "zone", title: "Time zone", type: "choice", value: "My time zone", options: ["My time zone", "UTC"] }
  ],
  commands: {
    time: {
      title: "The time now",
      nameFrom: "command",
      usage: "[24] [tz]",
      examples: ["", "24", "tz"],
      run(ctx) {
        const custom = ctx.settings.format === "Custom";
        let twentyFour = ctx.settings.format.startsWith("24"), zone = ctx.settings.format.includes("time zone");
        const flags = ctx.args.toLowerCase().split(/\s+/).filter(Boolean);
        for (const word of flags) {
          if (word === "24") twentyFour = true;
          else if (word === "12") twentyFour = false;
          else if (word === "tz" || word === "zone") zone = true;
          else throw new Error("use 12, 24 or tz.");
        }
        const pattern = custom && !flags.length ? ctx.settings.pattern
          : (twentyFour ? "HH:mm" : "h:mm a") + (zone ? " z" : "");
        return format(new Date(), pattern, undefined, ctx.settings.zone === "UTC").trim();
      }
    }
  }
})
