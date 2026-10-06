// ghost {"id":"community.url","name":"Short URL","version":"1.0.0","author":"Ghost Typist","description":"Type /url https://example.com/long/address, then Tab, for a short link. Options pick the service.","tags":["commands"],"capabilities":["1 command","network"]}
//
// Type /url and an address, then Tab. The address goes to the chosen service (is.gd or TinyURL),
// which returns the short link. A missing https:// is added.

const services = {
  "is.gd": (url) => `https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`,
  "TinyURL": (url) => `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`
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

const shorten = (args, service) => {
  const address = normalize(args);
  let reply;
  ghost.loading(true);
  try {
    try { reply = ghost.fetch(services[service](address)); }
    catch (error) { throw new Error(String((error && error.message) || error) || "the service did not answer."); }
  } finally {
    ghost.loading(false);
  }
  const link = String(reply ?? "").trim();
  if (!/^https:\/\/[^\s]+$/.test(link)) throw new Error(link.replace(/^Error:\s*/i, "").slice(0, 120) || "the service did not answer.");
  return link;
};

ghost.define({
  id: "community.url",
  name: "Short URL",
  version: "1.0.0",
  author: "Ghost Typist",
  description: "Type /url https://example.com/long/address, then Tab, for a short link. Options pick the service.",
  network: true,
  settings: [
    { id: "command", title: "Command", type: "text", value: "url",
      help: "What you type after the /. Several names work: url, short." },
    { id: "service", title: "Service", type: "choice", value: "is.gd", options: ["is.gd", "TinyURL"],
      help: "The address is sent to this service, which keeps the link. Both are free and need no account." }
  ],
  commands: {
    url: {
      title: "Short link",
      nameFrom: "command",
      usage: "<address>",
      examples: ["https://example.com/a/very/long/page?with=query"],
      run(ctx) { return shorten(ctx.args, ctx.settings.service); }
    }
  }
});
