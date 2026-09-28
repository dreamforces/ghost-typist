// ghost {"id":"community.commands","name":"Slash Commands","version":"2.0.0","author":"Ghost Typist","description":"Type /date and press Tab for today's date. Write your own commands in JavaScript in Options.","tags":["writing"],"capabilities":["1 command","your commands"]}
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const two = (n) => String(n).padStart(2, "0");

ghost.define({
  id: "community.commands",
  name: "Slash Commands",
  version: "2.0.0",
  author: "Ghost Typist",
  description: "Type /date and press Tab for today's date. Write your own commands in JavaScript in Options.",
  settings: [
    {
      id: "date-format", title: "Date format", type: "choice",
      options: ["English (28 September 2026)", "American (September 28, 2026)", "Day/Month/Year", "Month/Day/Year", "Year-Month-Day", "With weekday (Monday, 28 September 2026)"],
      value: "English (28 September 2026)"
    },
    {
      id: "commands", title: "Your commands", type: "list",
      help: "Tab on /name runs the code. ctx.text is what you typed, ctx.before and ctx.after surround the line. Return the text to insert.",
      columns: [{ id: "name", title: "Command" }, { id: "run", title: "JavaScript", code: true }],
      value: []
    }
  ],
  commandsFrom: "commands",
  commands: {
    date: {
      title: "Today's date",
      run(ctx) {
        const d = new Date(), day = d.getDate(), month = d.getMonth(), year = d.getFullYear();
        switch (ctx.settings["date-format"]) {
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
