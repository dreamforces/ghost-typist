// ghost {"id":"community.url","name":"Short URL","version":"1.1.2","author":"Ghost Typist","description":"Type /url https://example.com/long/address, then Tab, for a short link. Options pick the service.","icon":"link","tags":["commands"],"capabilities":["1 command","network"]}
//
// Type /url and an address, then Tab. The address goes to the chosen service (da.gd, TinyURL, clck.ru or is.gd),
// which returns the short link. A missing https:// is added.

// Each one answers a GET with the short link as plain text. The order is the order tried after the chosen one.
const services = {
  "da.gd": (url) => `https://da.gd/s?url=${encodeURIComponent(url)}`,
  "TinyURL": (url) => `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`,
  "clck.ru": (url) => `https://clck.ru/--?url=${encodeURIComponent(url)}`,
  "is.gd": (url) => `https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`
};

const normalize = (args) => {
  const text = String(args ?? "").trim();
  if (!text) throw new Error("type an address, such as /url https://example.com/a/long/page.");
  if (/\s/.test(text)) throw new Error("use one address, with no spaces.");
  const address = /^[a-z][a-z0-9+.-]*:\/\//i.test(text) ? text : "https://" + text;
  if (!/^https?:\/\/[^/\s.]+\.[^/\s]+/i.test(address)) throw new Error("that is not a web address.");
  if (address.length > 2000) throw new Error("that address is too long.");
  return address;
};

const ask = (service, address) => {
  let reply;
  try { reply = ghost.fetch(services[service](address)); }
  catch (error) { return { error: String((error && error.message) || error) || "the service did not answer." }; }
  const link = String(reply ?? "").trim();
  return /^https:\/\/[^\s]+$/.test(link) ? { link } : { error: link.replace(/^Error[:,]\s*/i, "").slice(0, 120) || "the service did not answer." };
};

// The chosen service first. When it refuses, the next one gets the same address.
const shorten = (args, service) => {
  const address = normalize(args);
  const order = [service, ...Object.keys(services).filter((name) => name !== service)];
  if (!services[service]) order.shift();
  let failure;
  ghost.loading(true);
  try {
    for (const name of order) {
      const result = ask(name, address);
      if (result.link) return result.link;
      failure = failure || result.error;
    }
  } finally {
    ghost.loading(false);
  }
  throw new Error(failure);
};

ghost.define({
  id: "community.url",
  name: "Short URL",
  version: "1.1.2",
  author: "Ghost Typist",
  description: "Type /url https://example.com/long/address, then Tab, for a short link. Options pick the service.",
  icon: "link",
  network: true,
  settings: [
    { id: "command", title: "Command", type: "text", value: "url",
      help: "What you type after the /. Several names work: url, short." },
    { id: "service", title: "Service", type: "choice", value: "da.gd", options: Object.keys(services),
      help: "The address is sent to this service, which keeps the link. All are free and need no account. If one refuses an address, the others are tried in turn." }
  ],
  commands: {
    url: {
      title: "Short link",
      nameFrom: "command",
      usage: "<address>",
      examples: ["github.com/anthropics/claude-code"],
      run(ctx) { return shorten(ctx.args, ctx.settings.service); }
    }
  }
});
