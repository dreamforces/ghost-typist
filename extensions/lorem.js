// ghost {"id":"community.lorem","name":"Placeholder","version":"1.0.1","author":"Ghost Typist","description":"Type /lorem, then Tab, for a paragraph of placeholder text. Add a topic, or 1s for one sentence and 3p for three paragraphs.","tags":["writing","commands"],"capabilities":["1 command"]}
//
// Type /lorem, then Tab. The writing model fills in placeholder prose.
// A topic focuses it. A length at the end wins over the option: 1s is one sentence, 4s is four, 3p is three paragraphs.

const lengths = { "1 sentence": "1s", "1 paragraph": "1p", "2 paragraphs": "2p", "3 paragraphs": "3p" };

const instruction = "Write placeholder prose about the topic. Return only the prose. No title, no bullet list, no quotation marks, and do not say that it is placeholder text. Use calm, plain sentences a reader could paste into a draft. Follow the length exactly and then stop. One sentence means one sentence. Several sentences stay in one paragraph. One paragraph means one paragraph of three or four sentences. Several paragraphs have a blank line between them. When the topic is none, write generic placeholder prose and do not invent a named subject.";

const samples = [
  { user: "Topic: tea\nLength: 1 sentence", reply: "Tea has been brewed for thousands of years and remains one of the most popular drinks in the world." },
  { user: "Topic: bicycles\nLength: 2 sentences, in one paragraph", reply: "Bicycles turn a rider's effort into an easy way to travel short distances. They need no fuel, cost little to keep, and work on city streets and quiet paths alike." },
  { user: "Topic: maps\nLength: 1 paragraph of three or four sentences", reply: "Maps turn a landscape into something a person can fold up and carry. Early ones were drawn by hand from what travelers remembered, and later ones were printed so the same coast and the same roads could be shared. A map still answers a simple question: where is this, and how do I get there?" },
  { user: "Topic: libraries\nLength: 2 paragraphs, with a blank line between them", reply: "Libraries gather books, records and quiet rooms so anyone can read, study or look something up.\n\nMany now lend ebooks and offer classes alongside the shelves, and learning there still costs nothing at the door." }
];

const lengthOf = (count, kind) => {
  if (kind === "s") return count === 1 ? "1 sentence" : count + " sentences, in one paragraph";
  return count === 1 ? "1 paragraph of three or four sentences" : count + " paragraphs, with a blank line between them";
};

const request = (args, fallback) => {
  const words = String(args || "").trim().split(/\s+/).filter(Boolean);
  let unit = lengths[fallback] || "1p";
  const last = words.length ? words[words.length - 1] : "";
  if (/^\d+[a-z]+$/i.test(last)) {
    if (!/^\d+[sp]$/i.test(last)) throw new Error("Use 1s for a sentence or 1p for a paragraph.");
    unit = last.toLowerCase();
    words.pop();
  } else if (/^\d+$/.test(last)) {
    throw new Error("Say 4s for four sentences or 3p for three paragraphs.");
  }
  const topic = words.join(" ");
  if (topic.length > 200) throw new Error("Keep the topic to a short phrase.");
  const count = Number(unit.slice(0, -1));
  const kind = unit.slice(-1);
  if (kind === "s" && (count < 1 || count > 12)) throw new Error("Ask for up to 12 sentences.");
  if (kind === "p" && (count < 1 || count > 6)) throw new Error("Ask for up to 6 paragraphs.");
  const length = lengthOf(count, kind);
  return {
    ask: {
      instruction,
      text: "Topic: " + (topic || "none") + "\nLength: " + length,
      examples: samples,
      maxTokens: kind === "s" ? Math.min(2048, 80 * count + 32) : Math.min(2048, 280 * count + 32),
      separateParagraphs: kind === "p" && count > 1
    }
  };
};

ghost.define({
  id: "community.lorem",
  name: "Placeholder",
  version: "1.0.1",
  author: "Ghost Typist",
  description: "Type /lorem, then Tab, for a paragraph of placeholder text. Add a topic, or 1s for one sentence and 3p for three paragraphs.",
  settings: [
    { id: "command", title: "Command", type: "text", value: "lorem",
      help: "What you type after the /. Tab on /lorem writes a paragraph. Add a topic to focus it. A trailing 1s or 3p overrides Length." },
    { id: "length", title: "Length", type: "choice", value: "1 paragraph",
      options: ["1 sentence", "1 paragraph", "2 paragraphs", "3 paragraphs"],
      help: "How much to write when you do not type a length such as 1s or 3p." }
  ],
  commands: {
    lorem: {
      title: "Placeholder text",
      nameFrom: "command",
      usage: "[topic or 1s]",
      examples: ["", "1s", "printing", "printing 3p"],
      written: [
        { input: "printing", output: "Printing has revolutionized how we share information by allowing ideas to be copied and distributed quickly and efficiently. From the early days of movable type to modern digital presses, this technology has made books, newspapers, and documents accessible to people everywhere. Today, printing continues to evolve with new methods that offer greater speed, lower costs, and higher quality, ensuring that our knowledge and creativity can reach a global audience." },
        { input: "printing 1s", output: "Printing has revolutionized how we share information by allowing ideas to be copied and distributed quickly and efficiently." },
        { input: "printing 4s", output: "Printing has revolutionized how we share information by allowing mass production of text and images. From ancient block prints to modern digital presses, the technology has evolved significantly over time. This invention made books and newspapers affordable, helping to spread knowledge across the globe. Today, printing continues to play a vital role in education, business, and everyday life." },
        { input: "printing 3p", output: "Printing has revolutionized how we share information, allowing ideas to travel from one person to another with incredible speed and ease. From the early days of movable type to modern digital presses, this technology has made knowledge accessible to everyone, breaking down barriers that once kept information locked away.\n\nThe evolution of printing methods has shaped history, enabling the spread of literature, the preservation of art, and the democratization of education. Whether it is a single handwritten letter or a massive book printed in a factory, each method has left an indelible mark on culture and society.\n\nToday, printing continues to adapt to new technologies, offering everything from high-quality offset presses to eco-friendly digital solutions. As we move forward, the ability to produce physical copies of documents and images remains a vital part of our daily lives, ensuring that our stories and creations can be seen by all." }
      ],
      run(ctx) {
        const result = request(ctx.args, ctx.settings.length);
        ghost.loading(true);
        return result;
      }
    }
  }
});
