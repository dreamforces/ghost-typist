// ghost {"id":"community.date","name":"Date","version":"1.0.0","author":"Ghost Typist","description":"Type /date, then Tab, for today's date. Options set the format and what you type after the slash.","tags":["commands"],"capabilities":["1 command"]}
//
// Type /date and press Tab. The extension's Options say what you type after the slash (it can be
// several names, such as "date, d"), so the command is named where you can change it.

ghost.define({
  id: "community.date",
  name: "Date",
  version: "1.0.0",
  author: "Ghost Typist",
  description: "Type /date, then Tab, for today's date. Options set the format and what you type after the slash.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "date",
      help: "What you type after the /. Give it several names with commas, such as date, d." },
    { id: "format", title: "Format", type: "choice", value: "English (28 September 2026)",
      options: ["English (28 September 2026)", "American (September 28, 2026)", "Day/Month/Year", "Month/Day/Year", "Year-Month-Day", "With weekday (Monday, 28 September 2026)"] }
  ],
  commands: {
    date: {
      title: "Today's date",
      nameFrom: "command",
      run(ctx) {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const two = (n) => String(n).padStart(2, "0");
        const d = new Date(), day = d.getDate(), month = d.getMonth(), year = d.getFullYear();
        switch (ctx.settings.format) {
          case "American (September 28, 2026)": return `${months[month]} ${day}, ${year}`;
          case "Day/Month/Year": return `${two(day)}/${two(month + 1)}/${year}`;
          case "Month/Day/Year": return `${two(month + 1)}/${two(day)}/${year}`;
          case "Year-Month-Day": return `${year}-${two(month + 1)}-${two(day)}`;
          case "With weekday (Monday, 28 September 2026)": return `${days[d.getDay()]}, ${day} ${months[month]} ${year}`;
          default: return `${day} ${months[month]} ${year}`;
        }
      }
    }
  }
})
