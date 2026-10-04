// ghost {"id":"community.calculator","name":"Calculator","version":"1.0.0","author":"Ghost Typist","description":"Type /= 3^2, then Tab, for the answer. () and + - * / ^ all work.","tags":["commands"],"capabilities":["1 command"]}
//
// Type /= and a sum, then Tab. The rest of the line is the calculation, so a later / is division.

const calculate = (source) => {
  const text = String(source ?? "");
  if (!text.trim()) throw new Error("type a calculation, such as 3^2 or (1+2)*4.");
  if (text.length > 200) throw new Error("that is not a calculation. Use numbers, () and + - * / ^.");
  let i = 0;
  let depth = 0;

  const skip = () => { while (text[i] === " " || text[i] === "\t" || text[i] === "\n") i += 1; };
  const peek = () => { skip(); return text[i]; };
  const eat = (ch) => { if (peek() !== ch) return false; i += 1; return true; };
  const bad = () => {
    skip();
    throw new Error(depth > 0 && i >= text.length
      ? "that is missing a )."
      : "that is not a calculation. Use numbers, () and + - * / ^.");
  };
  const check = (n) => {
    if (Number.isNaN(n)) throw new Error("that result is not a real number.");
    if (!Number.isFinite(n) || Math.abs(n) >= 1e15) throw new Error("that result is too large.");
    return n;
  };
  const number = () => {
    skip();
    const start = i;
    const digit = () => text.charCodeAt(i) >= 48 && text.charCodeAt(i) <= 57;
    if (text[i] === ".") {
      i += 1;
      if (!digit()) { i = start; return null; }
      while (digit()) i += 1;
    } else if (digit()) {
      while (digit()) i += 1;
      if (text[i] === ".") { i += 1; while (digit()) i += 1; }
    } else return null;
    return Number(text.slice(start, i));
  };
  const primary = () => {
    if (eat("(")) {
      depth += 1;
      const value = expr();
      if (!eat(")")) throw new Error("that is missing a ).");
      depth -= 1;
      return value;
    }
    const value = number();
    if (value === null) bad();
    return value;
  };
  const unary = () => eat("+") ? unary() : eat("-") ? -unary() : primary();
  // Right-associative: 2^3^2 is 2^(3^2). A leading minus belongs to the number, so 3^-2 is 0.25.
  const power = () => {
    const base = unary();
    if (!eat("^")) return base;
    return check(Math.pow(base, power()));
  };
  const term = () => {
    let value = power();
    while (peek() === "*" || peek() === "/") {
      const op = text[i];
      i += 1;
      const right = power();
      if (op === "/" && right === 0) throw new Error("that divides by zero.");
      value = check(op === "*" ? value * right : value / right);
    }
    return value;
  };
  const expr = () => {
    let value = term();
    while (peek() === "+" || peek() === "-") {
      const op = text[i];
      i += 1;
      const right = term();
      value = check(op === "+" ? value + right : value - right);
    }
    return value;
  };

  const value = expr();
  if (peek() !== undefined) bad();
  return format(value);
};

const format = (n) => {
  if (Number.isNaN(n)) throw new Error("that result is not a real number.");
  if (!Number.isFinite(n) || Math.abs(n) >= 1e15) throw new Error("that result is too large.");
  const scaled = Math.round(n * 1e10) / 1e10;
  if (scaled === 0) return "0";
  if (Number.isInteger(scaled)) return String(scaled);
  return scaled.toFixed(10).replace(/0+$/, "").replace(/\.$/, "");
};

ghost.define({
  id: "community.calculator",
  name: "Calculator",
  version: "1.0.0",
  author: "Ghost Typist",
  description: "Type /= 3^2, then Tab, for the answer. () and + - * / ^ all work.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "=",
      help: "What you type after the /. = makes the command /=. You can also use calc, or both: =, calc." }
  ],
  commands: {
    calc: {
      title: "Calculate",
      nameFrom: "command",
      usage: "<sum>",
      examples: ["3^2", "(1+2)*4", "1/2", "2^3^2"],
      run(ctx) { return calculate(ctx.args); }
    }
  }
});
