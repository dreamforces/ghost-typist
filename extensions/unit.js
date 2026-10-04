// ghost {"id":"community.unit","name":"Unit Conversion","version":"1.1.0","author":"Ghost Typist","description":"Type /unit 3 cm in mm, then Tab. in and to both work, for length, area, weight, volume and temperature.","tags":["commands"],"capabilities":["1 command"]}
//
// Type /unit and a conversion, then Tab. 3cm in mm, 3 cm to mm, 4 lbs in kg and 10 m in inches.

const table = {};
const ratio = (dim, label, factor, names) => {
  for (const name of names) table[name] = { dim, label, to: (n) => n * factor, from: (n) => n / factor };
};
const affine = (dim, label, to, from, names) => {
  for (const name of names) table[name] = { dim, label, to, from };
};

ratio("length", "mm", 0.001, ["mm", "millimeter", "millimeters", "millimetre", "millimetres"]);
ratio("length", "cm", 0.01, ["cm", "centimeter", "centimeters", "centimetre", "centimetres"]);
ratio("length", "m", 1, ["m", "meter", "meters", "metre", "metres"]);
ratio("length", "km", 1000, ["km", "kilometer", "kilometers", "kilometre", "kilometres"]);
ratio("length", "in", 0.0254, ["in", "inch", "inches"]);
ratio("length", "ft", 0.3048, ["ft", "foot", "feet"]);
ratio("length", "yd", 0.9144, ["yd", "yard", "yards"]);
ratio("length", "mi", 1609.344, ["mi", "mile", "miles"]);

ratio("area", "mm2", 1e-6, ["mm2", "sq mm", "square millimeter", "square millimeters", "square millimetre", "square millimetres"]);
ratio("area", "cm2", 0.0001, ["cm2", "sq cm", "square centimeter", "square centimeters", "square centimetre", "square centimetres"]);
ratio("area", "m2", 1, ["m2", "sq m", "sqm", "square meter", "square meters", "square metre", "square metres"]);
ratio("area", "km2", 1e6, ["km2", "sq km", "sqkm", "square kilometer", "square kilometers", "square kilometre", "square kilometres"]);
ratio("area", "ha", 10000, ["ha", "hectare", "hectares"]);
ratio("area", "in2", 0.00064516, ["in2", "sq in", "sqin", "square inch", "square inches"]);
ratio("area", "ft2", 0.09290304, ["ft2", "sq ft", "sqft", "square foot", "square feet"]);
ratio("area", "yd2", 0.83612736, ["yd2", "sq yd", "sqyd", "square yard", "square yards"]);
ratio("area", "mi2", 2589988.110336, ["mi2", "sq mi", "sqmi", "square mile", "square miles"]);
ratio("area", "acre", 4046.8564224, ["acre", "acres"]);

ratio("mass", "mg", 0.001, ["mg", "milligram", "milligrams"]);
ratio("mass", "g", 1, ["g", "gram", "grams"]);
ratio("mass", "kg", 1000, ["kg", "kilogram", "kilograms"]);
ratio("mass", "oz", 28.349523125, ["oz", "ounce", "ounces"]);
ratio("mass", "lb", 453.59237, ["lb", "lbs", "pound", "pounds"]);
ratio("mass", "st", 6350.29318, ["st", "stone", "stones"]);

ratio("volume", "ml", 0.001, ["ml", "milliliter", "milliliters", "millilitre", "millilitres"]);
ratio("volume", "l", 1, ["l", "liter", "liters", "litre", "litres"]);
ratio("volume", "tsp", 0.00492892159375, ["tsp", "teaspoon", "teaspoons"]);
ratio("volume", "tbsp", 0.01478676478125, ["tbsp", "tablespoon", "tablespoons"]);
ratio("volume", "fl oz", 0.0295735295625, ["fl oz", "floz", "fluid ounce", "fluid ounces"]);
ratio("volume", "cup", 0.2365882365, ["cup", "cups"]);
ratio("volume", "pt", 0.473176473, ["pt", "pint", "pints"]);
ratio("volume", "qt", 0.946352946, ["qt", "quart", "quarts"]);
ratio("volume", "gal", 3.785411784, ["gal", "gallon", "gallons"]);

affine("temp", "°C", (n) => n, (n) => n, ["c", "celsius", "centigrade"]);
affine("temp", "°F", (n) => (n - 32) * 5 / 9, (n) => n * 9 / 5 + 32, ["f", "fahrenheit"]);
affine("temp", "K", (n) => n - 273.15, (n) => n + 273.15, ["k", "kelvin"]);

const known = (name) => table[name.trim().toLowerCase().replace(/°/g, "").replace(/²/g, "2").replace(/\^2/g, "2").replace(/\s+/g, " ")];

const format = (n) => {
  if (n === 0) return "0";
  const scaled = Math.round(n * 1e6) / 1e6;
  if (scaled === 0) return "0";
  if (Number.isInteger(scaled)) return String(scaled);
  return scaled.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
};

const convert = (source) => {
  const text = String(source ?? "").trim().replace(/\s+/g, " ");
  if (!text) throw new Error("type a conversion, such as 3 cm in mm.");
  const head = /^([+-]?(?:\d+\.?\d*|\.\d+))\s*(.*)$/.exec(text);
  if (!head || !head[2]) throw new Error("use a conversion such as 3 cm in mm or 4 lbs to kg.");
  const amount = Number(head[1]);
  if (!Number.isFinite(amount)) throw new Error("use a conversion such as 3 cm in mm or 4 lbs to kg.");
  const rest = head[2];
  const spots = [];
  const separator = /\s+(?:in|to)\s+/gi;
  let found;
  while ((found = separator.exec(rest))) spots.push(found);
  if (!spots.length) throw new Error("use a conversion such as 3 cm in mm or 4 lbs to kg.");
  for (const spot of spots) {
    const leftName = rest.slice(0, spot.index).trim();
    const rightName = rest.slice(spot.index + spot[0].length).trim();
    const left = known(leftName);
    const right = known(rightName);
    if (!left || !right) continue;
    if (left.dim !== right.dim) throw new Error(`${left.label} and ${right.label} measure different things.`);
    const out = right.from(left.to(amount));
    if (!Number.isFinite(out) || Math.abs(out) >= 1e12) throw new Error("that result is too large.");
    return `${format(out)}${right.label}`;
  }
  const spot = spots[0];
  const leftName = rest.slice(0, spot.index).trim();
  const rightName = rest.slice(spot.index + spot[0].length).trim();
  if (!rightName || !known(leftName)) throw new Error(`${leftName || "that"} is not a unit I know.`);
  throw new Error(`${rightName} is not a unit I know.`);
};

ghost.define({
  id: "community.unit",
  name: "Unit Conversion",
  version: "1.1.0",
  author: "Ghost Typist",
  description: "Type /unit 3 cm in mm, then Tab. in and to both work, for length, area, weight, volume and temperature.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "unit",
      help: "What you type after the /. in and to both work. Acres are international. Cups, pints and gallons are US." }
  ],
  commands: {
    unit: {
      title: "Convert",
      nameFrom: "command",
      usage: "<amount> <unit> in <unit>",
      examples: ["3 cm in mm", "4 lbs in kg", "10 m in inches", "200 acres in km2"],
      run(ctx) { return convert(ctx.args); }
    }
  }
});
