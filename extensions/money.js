// ghost {"id":"community.money","name":"Currency","version":"1.2.1","author":"Ghost Typist","description":"Type /money 100 usd in gbp, then Tab. Add on 29/01/2026 for a rate up to 5 years ago.","tags":["commands"],"capabilities":["1 command","network"]}
//
// Type /money and an amount, then Tab. Rates are the European Central Bank's, from Frankfurter.
// 100usd in gbp, 100 usd to gbp, $100 in gbp, and 100 gbp in usd on 29/01/2026.

const symbols = { "$": "USD", "£": "GBP", "€": "EUR", "¥": "JPY", "₹": "INR", "₩": "KRW", "₺": "TRY", "₽": "RUB", "฿": "THB" };
const noDecimals = new Set(["BIF", "CLP", "DJF", "GNF", "JPY", "KMF", "KRW", "PYG", "RWF", "UGX", "VND", "VUV", "XAF", "XOF", "XPF"]);
const threeDecimals = new Set(["BHD", "IQD", "JOD", "KWD", "OMR", "TND"]);
const places = (code) => noDecimals.has(code) ? 0 : threeDecimals.has(code) ? 3 : 2;
const money = (amount, code) => `${amount.toFixed(places(code)).replace(".", ",")}${code}`;

const codeOf = (text) => {
  const s = text.trim();
  if (symbols[s]) return symbols[s];
  return /^[a-z]{3}$/i.test(s) ? s.toUpperCase() : null;
};

const amountAndCode = (text) => {
  const s = text.trim();
  for (const sym of Object.keys(symbols)) {
    if (!s.startsWith(sym)) continue;
    const rest = s.slice(sym.length).trim();
    if (!/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(rest)) return null;
    return { amount: Number(rest), code: symbols[sym] };
  }
  const match = /^([+-]?(?:\d+\.?\d*|\.\d+))([a-z]{3})$/i.exec(s.replace(/\s+/g, ""));
  return match ? { amount: Number(match[1]), code: match[2].toUpperCase() } : null;
};

const splitJoin = (body) => {
  const separator = /\s+(?:in|to)\s+/gi;
  let found;
  while ((found = separator.exec(body))) {
    const left = amountAndCode(body.slice(0, found.index));
    const to = codeOf(body.slice(found.index + found[0].length));
    if (left && to) return { amount: left.amount, code: left.code, to };
  }
  return null;
};

const parseDate = (text, language) => {
  let iso;
  try { iso = ghost.date(text, { language }); }
  catch (error) { throw new Error(String((error && error.message) || error)); }
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!parts) throw new Error("that is not a date I understand.");
  const date = new Date(Date.UTC(+parts[1], +parts[2] - 1, +parts[3]));
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const earliest = new Date(today);
  earliest.setUTCFullYear(earliest.getUTCFullYear() - 5);
  if (date.getTime() < earliest.getTime()) throw new Error("currency history goes back 5 years, and no further.");
  if (date.getTime() > today) throw new Error("that date has not happened yet.");
  return iso;
};

const quote = (args, language) => {
  const text = String(args ?? "").trim().replace(/\s+/g, " ");
  if (!text) throw new Error("type an amount, such as 100 usd in gbp.");
  let body = text, when = null;
  const dated = /^(.*)\s+on\s+(.+)$/i.exec(text);
  if (dated) { body = dated[1]; when = parseDate(dated[2], language); }
  const parsed = splitJoin(body);
  if (!parsed) throw new Error("use an amount, such as 100 usd in gbp or $100 to gbp.");
  if (!Number.isFinite(parsed.amount) || parsed.amount < 0) throw new Error("use an amount that is zero or more.");
  if (parsed.amount > 1e12) throw new Error("that amount is too large.");
  if (parsed.amount === 0 || parsed.code === parsed.to) return money(parsed.amount, parsed.to);
  const root = when ? `https://api.frankfurter.app/${when}` : "https://api.frankfurter.app/latest";
  const url = `${root}?amount=${encodeURIComponent(String(parsed.amount))}&from=${parsed.code}&to=${parsed.to}`;
  let payload;
  ghost.loading(true);
  try {
    try { payload = ghost.fetch(url); }
    catch (error) {
      const message = String((error && error.message) || error);
      if (message.includes("404") || message.includes("422")) throw new Error("that currency is not one the rate service knows.");
      throw new Error(message || "the exchange rate did not answer.");
    }
  } finally {
    ghost.loading(false);
  }
  let data;
  try { data = JSON.parse(payload); }
  catch (error) { throw new Error("the exchange rate did not answer."); }
  const converted = data && data.rates ? data.rates[parsed.to] : undefined;
  if (typeof converted !== "number" || !Number.isFinite(converted)) throw new Error("the exchange rate did not answer.");
  return money(converted, parsed.to);
};

ghost.define({
  id: "community.money",
  name: "Currency",
  version: "1.2.1",
  author: "Ghost Typist",
  description: "Type /money 100 usd in gbp, then Tab. Add on 29/01/2026 for a rate up to 5 years ago.",
  network: true,
  settings: [
    { id: "command", title: "Command", type: "text", value: "money",
      help: "in and to both work. A date can be 29/01/2026, 6 October 2026, or last Thursday of last month. English reads an ambiguous number month-first. History goes back 5 years." }
  ],
  commands: {
    money: {
      title: "Convert",
      nameFrom: "command",
      usage: "<amount> <currency> in <currency>",
      examples: ["100 usd in gbp", "$100 in gbp", "100gbp to usd", "100 gbp in usd on 29/01/2026"],
      run(ctx) { return quote(ctx.args, ctx.language); }
    }
  }
});
