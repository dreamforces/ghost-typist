// ghost {"id":"community.alarm","name":"Alarm","version":"1.0.0","author":"Ghost Typist","description":"Type /alarm 2pm pay the bills, then Tab. The clock counts down, then shakes when it is time.","tags":["commands"],"capabilities":["1 command"]}
//
// Type /alarm, a clock time, and a note, then Tab. 2pm and 8:45am are today, or tomorrow if
// that time has passed. The menu bar counts down, and the clock grows and rocks when it is due.

const clock = (seconds) => {
  const left = Math.max(0, seconds);
  const hours = Math.floor(left / 3600);
  const minutes = Math.floor((left % 3600) / 60);
  const remain = left % 60;
  const pad = (n) => (n < 10 ? "0" : "") + n;
  if (hours > 0) return hours + ":" + pad(minutes) + ":" + pad(remain);
  return minutes + ":" + pad(remain);
};

ghost.define({
  id: "community.alarm",
  name: "Alarm",
  version: "1.0.0",
  author: "Ghost Typist",
  description: "Type /alarm 2pm pay the bills, then Tab. The clock counts down, then shakes when it is time.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "alarm",
      help: "What you type after the /. Several names work: alarm, a." }
  ],
  commands: {
    alarm: {
      title: "Alarm",
      nameFrom: "command",
      usage: "<time> <note>",
      examples: ["2pm pay the bills", "8:45am take kids to the school"],
      run(ctx) {
        const parsed = /^(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b\s*([\s\S]*)$/i.exec(String(ctx.args || "").trim());
        if (!parsed) throw new Error("use a time and a note, like 2pm pay the bills.");
        let hour = Number(parsed[1]);
        const minute = parsed[2] ? Number(parsed[2]) : 0;
        const note = parsed[4].trim();
        if (hour < 1 || hour > 12 || minute > 59) throw new Error("use a time like 2pm or 8:45am.");
        if (!note) throw new Error("say what the alarm is for.");
        if (note.length > 200) throw new Error("keep the note to 200 characters.");
        hour %= 12;
        if (parsed[3].toLowerCase() === "pm") hour += 12;
        const now = new Date();
        const due = new Date(now.getTime());
        due.setHours(hour, minute, 0, 0);
        if (due.getTime() <= now.getTime()) due.setDate(due.getDate() + 1);
        let seconds = Math.round((due.getTime() - now.getTime()) / 1000);
        if (seconds < 1) seconds = 1;
        if (seconds > 86400) throw new Error("that time is more than 24 hours away.");
        if (!ghost.notify("Alarm", note, { after: seconds, symbol: "alarm", motion: "shake" })) {
          throw new Error("that alarm could not be set.");
        }
        if (!ghost.menubar("alarm", clock, { seconds, tip: note })) {
          throw new Error("that alarm could not be set.");
        }
        return "";
      }
    }
  }
})
