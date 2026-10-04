// ghost {"id":"community.timer","name":"Timer","version":"1.0.2","author":"Ghost Typist","description":"Type /timer 25m, then Tab, to count down. A note after the time is shown when it ends.","tags":["commands"],"capabilities":["1 command"]}
//
// Type /timer and a length, then Tab. 30s, 25m and 1hr are whole amounts. Anything after the
// length is the note shown when the time is up.

const span = (seconds) => {
  if (seconds % 3600 === 0) {
    const hours = seconds / 3600;
    return hours === 1 ? "1 hour" : hours + " hours";
  }
  if (seconds % 60 === 0) {
    const minutes = seconds / 60;
    return minutes === 1 ? "1 minute" : minutes + " minutes";
  }
  return seconds === 1 ? "1 second" : seconds + " seconds";
};

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
  id: "community.timer",
  name: "Timer",
  version: "1.0.2",
  author: "Ghost Typist",
  description: "Type /timer 25m, then Tab, to count down. A note after the time is shown when it ends.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "timer",
      help: "What you type after the /. Several names work: timer, t." }
  ],
  commands: {
    timer: {
      title: "Countdown",
      nameFrom: "command",
      usage: "<time> [note]",
      examples: ["30s", "25m", "90m", "1hr don't forget to pay the bill"],
      run(ctx) {
        const parsed = /^(\d+)(s|m|hr)(?:\s+([\s\S]+))?$/i.exec(ctx.args.trim());
        if (!parsed) throw new Error("use a whole number, like 30s, 25m or 1hr.");
        const amount = Number(parsed[1]);
        const unit = parsed[2].toLowerCase();
        const seconds = unit === "s" ? amount : unit === "m" ? amount * 60 : amount * 3600;
        if (amount < 1 || seconds > 86400) throw new Error("a timer can run from 1 second up to 24 hours.");
        const note = (parsed[3] || "").trim();
        if (note.length > 200) throw new Error("keep the note to 200 characters.");
        const message = note || span(seconds);
        if (!ghost.notify("Time is up", message, { after: seconds, symbol: "hourglass" })) {
          throw new Error("that timer could not be set.");
        }
        if (!ghost.menubar("hourglass", clock, { seconds, tip: message })) {
          throw new Error("that timer could not be set.");
        }
        ghost.ack("hourglass", { motion: "rotate" });
        ghost.cursor("wait");
        return "";
      }
    }
  }
})
