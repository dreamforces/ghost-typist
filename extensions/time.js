// ghost {"id":"community.time","name":"Current Time","version":"1.7.1","author":"Ghost Typist","description":"Type /now, then Tab, for the time now. /now 24 changes one use. Options set the format, the time zone, and whether that zone is shown.","icon":"clock","tags":["commands"],"capabilities":["1 command"]}
//
// Type /now and press Tab. The extension's Options say what you type after the slash (it can be
// several names, such as "now, n"), so the command is named where you can change it.

const zoneName = (d, timeZone, locale) => {
  try {
    const parts = new Intl.DateTimeFormat(locale, { timeZone, timeZoneName: "short" }).formatToParts(d);
    return (parts.find((part) => part.type === "timeZoneName") || {}).value || "";
  } catch (e) { return ""; }
};

// The clock in a named zone. No zone means this Mac's.
const clock = (d, timeZone) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric",
    hour: "numeric", minute: "numeric", second: "numeric",
  }).formatToParts(d);
  const n = (type) => Number((parts.find((part) => part.type === type) || {}).value);
  return { y: n("year"), m: n("month"), d: n("day"), h: n("hour"), i: n("minute"), s: n("second") };
};

// yyyy yy | MMMM MMM MM M | dd d | EEEE EEE | HH H hh h | mm | ss | a. Text in [brackets] is kept as it is.
const format = (d, pattern, locale, timeZone) => {
  const part = (options) => d.toLocaleString(locale, { ...options, timeZone });
  const two = (n) => String(n).padStart(2, "0");
  const f = clock(d, timeZone);
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
      case "z": return zoneName(d, timeZone, locale);
      default: {
        const period = new Intl.DateTimeFormat(locale, { timeZone, hour: "numeric", hourCycle: "h12" }).formatToParts(d);
        return (period.find((part) => part.type === "dayPeriod") || {}).value || (f.h < 12 ? "AM" : "PM");
      }
    }
  });
};

const timeZones = () => {
  let known = [];
  try { known = Intl.supportedValuesOf("timeZone"); } catch (e) { known = []; }
  return ["My time zone", "UTC"].concat(known.filter((zone) => zone !== "UTC"));
};

ghost.define({
  id: "community.time",
  name: "Current Time",
  version: "1.7.1",
  author: "Ghost Typist",
  description: "Type /now, then Tab, for the time now. /now 24 changes one use. Options set the format, the time zone, and whether that zone is shown.",
  icon: "clock",
  settings: [
    { id: "command", title: "Command", type: "text", value: "now",
      help: "What you type after the /. Several names work: now, n." },
    { id: "format", title: "Format", type: "choice", value: "12-hour with time zone",
      options: ["12-hour", "12-hour with time zone", "24-hour", "24-hour with time zone", "Custom"] },
    { id: "show-zone", title: "Show time zone", type: "toggle", value: true,
      help: "Adds the abbreviation, such as BST. Turn this off for the time alone. tz after the command shows it once." },
    { id: "pattern", title: "Custom pattern", type: "text", value: "HH:mm z",
      when: { setting: "format", equals: "Custom" }, help: "Letters: yyyy year, MMMM month name, MM month, dd day, EEEE weekday, HH or hh hours, mm minutes, ss seconds, a AM/PM, z time zone. Put text in [brackets]." },
    { id: "zone", title: "Time zone", type: "choice", value: "My time zone", options: timeZones() }
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
        const asked = flags.includes("tz") || flags.includes("zone");
        for (const word of flags) {
          if (word === "24") twentyFour = true;
          else if (word === "12") twentyFour = false;
          else if (word === "tz" || word === "zone") zone = true;
          else throw new Error("use 12, 24 or tz.");
        }
        if (ctx.settings["show-zone"] === false && !asked) zone = false;
        let pattern = custom && !flags.length ? ctx.settings.pattern
          : (twentyFour ? "HH:mm" : "h:mm a") + (zone ? " z" : "");
        if (ctx.settings["show-zone"] === false && !asked) {
          pattern = pattern.replace(/\[([^\]]*)\]|\bz\b/g, (token, literal) => (literal !== undefined ? token : ""));
        }
        const chosen = ctx.settings.zone && ctx.settings.zone !== "My time zone" ? ctx.settings.zone : undefined;
        return format(new Date(), pattern, ctx.language, chosen).trim();
      }
    }
  }
})
