// ghost {"id":"community.commands","name":"Slash Commands","version":"2.3.0","author":"Ghost Typist","description":"Type /date and press Tab for today's date. Write your own commands in JavaScript in Options.","tags":["writing"],"capabilities":["1 command","your commands"]}
//
// How a command works: Tab after /name, and anything typed after it on the line, calls run(ctx). The
// text it returns replaces /name and those words. ctx holds:
//   ctx.args      the words after /name: "/wc sentences" gives "sentences"
//   ctx.text      everything typed in the field, without the command
//   ctx.before    the text before /name
//   ctx.after     the text after the caret
//   ctx.settings  the options the user chose in Options: those this script declares in `settings`, plus
//                 those a command declares in its own `settings` (like date-format below)
// A command's own `settings` appear under its name in Options. ghost.words(text) and
// ghost.sentences(text) help with counting. There is no network, file or clipboard access.

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const two = (n) => String(n).padStart(2, "0");

const example = [
  "// JavaScript: the body of run(ctx). Return the text that replaces /name.",
  "// ctx.args is what you type after the name: /wc sentences",
  "// ctx.before is the text before /name, ctx.after the text after the caret.",
  "const unit = ctx.args || \"words\";",
  "const count = unit === \"words\" ? ghost.words(ctx.before).length : ghost.sentences(ctx.before).length;",
  "return count + \" \" + unit;"
].join("\n");

ghost.define({
  id: "community.commands",
  name: "Slash Commands",
  version: "2.3.0",
  author: "Ghost Typist",
  description: "Type /date and press Tab for today's date. Write your own commands in JavaScript in Options.",
  settings: [
    {
      id: "commands", title: "Your commands", type: "list",
      help: "Name a command, then write the JavaScript it runs. Type /name, and options after it if your code reads ctx.args, then press Tab.",
      columns: [{ id: "name", title: "Command", placeholder: "wc" }, { id: "run", title: "JavaScript", code: true, placeholder: example }],
      value: []
    }
  ],
  commandsFrom: "commands",
  commands: {
    date: {
      title: "Today's date",
      settings: [
        {
          id: "date-format", title: "Format", type: "choice",
          options: ["English (28 September 2026)", "American (September 28, 2026)", "Day/Month/Year", "Month/Day/Year", "Year-Month-Day", "With weekday (Monday, 28 September 2026)"],
          value: "English (28 September 2026)"
        }
      ],
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
