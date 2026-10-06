// ghost {"id":"community.password","name":"Password","version":"1.3.1","author":"Ghost Typist","description":"Type /password, then Tab, for a random password. /password 24 special changes one use. Memorable is three or more English words.","icon":"key","tags":["commands"],"capabilities":["1 command"]}
//
// Type /password and press Tab. The extension's Options say what you type after the slash (it can be
// several names, such as "password, p"), so the command is named where you can change it.

// ponytail: common words in the script. A longer list if three of these stops feeling varied.
const english = `
able acid acorn actor adult alarm album alert alley amber angel ankle apple april apron armor arrow
attic audio award bacon badge bagel baker ballet bamboo banana banner barley barn barrel basin
basket beach beacon bead beak bean beard beaver beetle berry bike birch bird bison black blanket
blaze bloom board boat body bolt bone book boot bottle boulder bowl branch brass bread breeze brick
bridge bright brook broom brown brush bubble bucket buffalo bulb bull bundle bunny butter button
cabin cable cactus cake camel camera camp canal candle candy cane canoe canyon cape cargo carpet
carrot castle catch cattle cave cedar ceiling cello cement cereal chain chair chalk charm chart
cheese cherry chess chest chick child chimney chip circle circus clam clap clay cliff clock cloth
cloud clover clown club coal coast coat cocoa coffee coin cold collar comet comic copper coral cork
corn corner cotton couch cougar cousin cover crab crane crater cream creek cricket crown crumb crust
crystal cub cup curl curtain cushion daisy dance dawn deer denim desert desk diamond diary dinner
dirt dish dock doctor doll dolphin donkey door dove dragon drain drawer dream dress drift drill
drink drum duck dune dust eagle earth east elbow elder elm ember engine fabric falcon family farm
feather fence fern fiddle field film finch finger fire fish flag flame flask flight flint flood
floor flour flower flute foam fog folk food foot forest fork fort fossil fountain fox frame friend
frog frost fruit fuel garden garlic gate gear giant gift ginger glacier glass glove glow goat gold
goose grain grape grass gravel green grill ground grove guitar gulf hammer hand harbor hare harp
harvest hawk haze heart hedge helmet herb heron hill hive honey hood hook horn horse hose house ice
ink insect iron island ivory jacket jazz jelly jewel journal juice jungle kettle king kite kitten
knee knife knight knot koala ladder lady lake lamb lamp land lantern lark lava lawn leaf lemon lens
letter lettuce light lily lime linen lion lizard loaf lobster lock lodge lotus lunch magnet mail
mango manor maple marble march market marsh mask meadow meal melon metal milk mill mint mirror mist
mitten mole money monkey month moon moose morning moss moth motor mouse mouth muffin mug mule music
mustard nail napkin navy neck needle nest night north nose note novel nurse oak oasis ocean oil
olive onion opal orange orchard otter oven owl oyster paddle paint palace palm panda panel panther
paper parade park parrot party pasta path peach peanut pear pearl pebble pen pencil penguin penny
pepper perch petal piano pickle picnic pie pier pigeon pillow pilot pine pink pipe pizza plain plane
planet plank plant plate plaza plum pocket poem poet point pond pony pool porch potato pouch powder
prairie prince print prize pump puppet puppy purple purse quail quartz queen quilt rabbit raccoon
radio raft rail rain raisin rake ranch raven reed reef ribbon rice ridge ring river road robin rock
rocket roof room root rope rose ruby rug ruler saddle sail salad salmon salt sand scale scarf school
sea seal season seed shadow shark sheep shell shield ship shirt shoe shop shore shovel shrimp silk
silver singer sister skate skirt sky sled sleep sleet sleeve slope smoke snail snake snow soap sock
soda sofa soil song sound soup south sparrow spear spider spinach spoon spring square squirrel
stable stage stair stamp star steam steel stem stick stone stool store storm story stove straw
stream street string sugar summer sun supper swan sweet swing sword table tail tank tea team tent
thorn thread throne thunder tiger tile timber tin toast tomato tongue tool tooth torch tower town
trail train trap tray tree tribe trout truck trumpet trunk tulip tuna tunnel turkey turnip turtle
twig twin uncle valley vanilla vase velvet vest vine violet violin wagon walnut walrus wand water
wave weasel weather wedge whale wheat wheel whistle willow wind window wine wing winter wire wolf
wood wool world worm wreath wrist yard yarn yellow yogurt zebra zipper
`.trim().split(/\s+/);

ghost.define({
  id: "community.password",
  name: "Password",
  version: "1.3.1",
  author: "Ghost Typist",
  description: "Type /password, then Tab, for a random password. /password 24 special changes one use. Memorable is three or more English words.",
  icon: "key",
  settings: [
    { id: "command", title: "Command", type: "text", value: "password",
      help: "What you type after the /. Several names work: password, p." },
    { id: "length", title: "Length", type: "number", value: 16, help: "4 to 128 characters." },
    { id: "characters", title: "Characters", type: "choice", value: "Letters and digits",
      options: ["Letters and digits", "Letters, digits and symbols", "Letters", "Digits"] },
    { id: "symbols", title: "Symbols", type: "text", value: "!@#$%^&*_-+=?",
      when: { setting: "characters", equals: "Letters, digits and symbols" }, help: "The symbols it may use." },
    { id: "ambiguous", title: "Avoid look-alikes", type: "toggle", value: false, help: "Leaves out 0 O 1 l I." },
    { id: "memorable", title: "Memorable", type: "toggle", value: false,
      help: "At least three English words. Symbols such as . , - separate them when every character is allowed. One letter in each word may be a digit, such as 1, 3 or 5. Otherwise a capital starts each word." }
  ],
  commands: {
    password: {
      title: "Random password",
      nameFrom: "command",
      usage: "[length] [kind]",
      examples: ["", "24 special", "12 memorable"],
      run(ctx) {
        const avoid = ctx.settings.ambiguous ? /[0O1lI]/g : null;
        const clean = (s) => avoid ? s.replace(avoid, "") : s;
        const symbols = clean(ctx.settings.symbols.replace(/\s/g, "")) || "!@#$%^&*_-+=?";
        const classes = { letters: clean("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"), digits: clean("0123456789"), symbols };
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
          const shown = (w) => w[0].toUpperCase() + w.slice(1);
          let pool = english.filter((w) => !avoid || !/[0O1lI]/.test(shown(w)));
          if (pool.length < 3) pool = english.slice();
          for (let n = pool.length - 1; n > 0; n--) {
            const j = ghost.random(n + 1);
            [pool[n], pool[j]] = [pool[j], pool[n]];
          }
          const count = Math.max(3, Math.ceil(length / 6));
          const words = pool.slice(0, count).map(shown);
          const everyKind = allowed.includes("digits") && allowed.includes("symbols");
          if (!everyKind) return words.join("");
          // One letter in each word: sleep → Sl3ep, not S133p.
          const leet = { a: "5", e: "3", i: "1", l: "1", o: "0", s: "5", t: "7", b: "8", g: "6" };
          const spell = (w) => {
            const chars = [...w];
            const spots = chars.flatMap((c, i) => leet[c] && !(avoid && "01".includes(leet[c])) ? [i] : []);
            if (!spots.length) return w;
            const i = spots[ghost.random(spots.length)];
            chars[i] = leet[chars[i]];
            return chars.join("");
          };
          const spelled = words.map(spell);
          if (!spelled.some((w) => /\d/.test(w))) {
            const spare = pool.slice(count).map(shown).map(spell).find((w) => /\d/.test(w));
            if (spare) spelled[spelled.length - 1] = spare;
          }
          const breaks = Array.from(new Set([...".,-", ...symbols])).join("");
          return spelled.reduce((phrase, w, i) => phrase + (i ? pick(breaks) : "") + w, "");
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
