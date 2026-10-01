// ghost {"id":"community.password","name":"Password","version":"1.0.0","author":"Ghost Typist","description":"Type /password, then Tab, for a random password. Options set the length, the characters and whether it is memorable; /password 24 special changes one use.","tags":["commands"],"capabilities":["1 command"]}
//
// Type /password and press Tab. The extension's Options say what you type after the slash (it can be
// several names, such as "password, p"), so the command is named where you can change it.

ghost.define({
  id: "community.password",
  name: "Password",
  version: "1.0.0",
  author: "Ghost Typist",
  description: "Type /password, then Tab, for a random password. Options set the length, the characters and whether it is memorable; /password 24 special changes one use.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "password",
      help: "What you type after the /. Give it several names with commas, such as password, p." },
    { id: "length", title: "Length", type: "number", value: 16, help: "4 to 128 characters." },
    { id: "characters", title: "Characters", type: "choice", value: "Letters and digits",
      options: ["Letters and digits", "Letters, digits and symbols", "Letters", "Digits"] },
    { id: "memorable", title: "Memorable", type: "toggle", value: false,
      help: "Pronounceable syllables, easier to remember and type. It still ends in a digit and a symbol when those are allowed." }
  ],
  commands: {
    password: {
      title: "Random password",
      nameFrom: "command",
      usage: "[length] [kind]",
      run(ctx) {
        const classes = { letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", digits: "0123456789", symbols: "!@#$%^&*_-+=?" };
        const kinds = {
          "Letters and digits": ["letters", "digits"],
          "Letters, digits and symbols": ["letters", "digits", "symbols"],
          "Letters": ["letters"],
          "Digits": ["digits"]
        };
        let length = ctx.settings.length, kind = ctx.settings.characters, memorable = ctx.settings.memorable;
        for (const word of ctx.args.toLowerCase().split(/\s+/).filter(Boolean)) {
          if (/^\d+$/.test(word)) length = Number(word);
          else if (word === "memorable") memorable = true;
          else if (word === "alnum" || word === "alphanumeric") kind = "Letters and digits";
          else if (word === "letters" || word === "alpha") kind = "Letters";
          else if (word === "digits" || word === "numeric") kind = "Digits";
          else if (word === "special" || word === "symbols") kind = "Letters, digits and symbols";
          else throw new Error("use a length, letters, digits, special or memorable.");
        }
        if (!(length >= 4 && length <= 128)) throw new Error("length is 4 to 128.");
        const pick = (set) => set[ghost.random(set.length)];
        const allowed = kinds[kind];
        if (memorable && allowed.includes("letters")) {
          const consonants = "bcdfghjklmnpqrstvwxyz", vowels = "aeiou";
          const out = Array.from({ length }, (_, i) => pick(i % 2 ? vowels : consonants));
          out[0] = out[0].toUpperCase();
          if (allowed.includes("symbols")) out[length - 1] = pick(classes.symbols);
          if (allowed.includes("digits")) out[length - (allowed.includes("symbols") ? 2 : 1)] = pick(classes.digits);
          return out.join("");
        }
        // One of each kind first, so every kind asked for is there, then the rest, shuffled.
        const sets = allowed.map((k) => classes[k]);
        const out = sets.map(pick);
        const everything = sets.join("");
        while (out.length < length) out.push(pick(everything));
        for (let i = out.length - 1; i > 0; i--) {
          const j = ghost.random(i + 1);
          [out[i], out[j]] = [out[j], out[i]];
        }
        return out.join("");
      }
    }
  }
})
