// ghost {"id":"community.time","name":"Time","version":"1.0.0","author":"Ghost Typist","description":"Type /time, then Tab, for the time now. Options set 12 or 24 hours and seconds; /time 24 or /time seconds changes one use.","tags":["commands"],"capabilities":["1 command"]}
//
// Type /time and press Tab. The extension's Options say what you type after the slash (it can be
// several names, such as "time, t"), so the command is named where you can change it.

ghost.define({
  id: "community.time",
  name: "Time",
  version: "1.0.0",
  author: "Ghost Typist",
  description: "Type /time, then Tab, for the time now. Options set 12 or 24 hours and seconds; /time 24 or /time seconds changes one use.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "time",
      help: "What you type after the /. Give it several names with commas, such as time, t." },
    { id: "format", title: "Format", type: "choice", value: "12-hour (9:41 PM)",
      options: ["12-hour (9:41 PM)", "12-hour with seconds", "24-hour (21:41)", "24-hour with seconds"] }
  ],
  commands: {
    time: {
      title: "The time now",
      nameFrom: "command",
      usage: "[24] [seconds]",
      run(ctx) {
        const two = (n) => String(n).padStart(2, "0");
        let twentyFour = ctx.settings.format.startsWith("24"), seconds = ctx.settings.format.includes("seconds");
        for (const word of ctx.args.toLowerCase().split(/\s+/).filter(Boolean)) {
          if (word === "24") twentyFour = true;
          else if (word === "12") twentyFour = false;
          else if (word === "seconds") seconds = true;
          else throw new Error("use 12, 24 or seconds.");
        }
        const d = new Date(), h = d.getHours();
        const clock = (twentyFour ? two(h) : String(h % 12 || 12)) + ":" + two(d.getMinutes()) + (seconds ? ":" + two(d.getSeconds()) : "");
        return twentyFour ? clock : clock + " " + (h < 12 ? "AM" : "PM");
      }
    }
  }
})
