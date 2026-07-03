import type { MediaImage, MediaVideo, Post, Topic } from "./types";

// Deterministic placeholder imagery (replace with real CMS assets).
const img = (seed: string, w: number, h: number): string =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const photo = (
  id: string,
  seed: string,
  alt: string,
  orientation: "landscape" | "portrait" | "square" = "landscape",
  caption?: string,
): MediaImage => {
  const dims =
    orientation === "portrait"
      ? [900, 1200]
      : orientation === "square"
      ? [1000, 1000]
      : [1400, 900];
  return {
    type: "image",
    id,
    src: img(seed, dims[0], dims[1]),
    alt,
    caption,
    orientation,
    aspect:
      orientation === "portrait"
        ? "3/4"
        : orientation === "square"
        ? "1/1"
        : "3/2",
  };
};

const video = (
  id: string,
  source: MediaVideo["source"],
  videoId: string,
  thumbSeed: string,
  alt: string,
  orientation: "landscape" | "portrait",
  duration: string,
  caption?: string,
): MediaVideo => ({
  type: "video",
  id,
  source,
  videoId,
  thumbnail:
    orientation === "portrait"
      ? img(thumbSeed, 720, 1280)
      : img(thumbSeed, 1600, 900),
  alt,
  caption,
  orientation,
  duration,
});

// ---------- Topics ----------

export const topics: Topic[] = [
  {
    slug: "architecture",
    name: "Architecture",
    description:
      "Buildings as quiet collaborators — concrete, timber, and the negotiated silence between rooms.",
    cover: img("architecture-cover", 1600, 1000),
  },
  {
    slug: "transit",
    name: "Transit",
    description:
      "Stations, ferries, sleeper cars. The unstructured time between places, where most observation happens.",
    cover: img("transit-cover", 1600, 1000),
  },
  {
    slug: "natural-light",
    name: "Natural Light",
    description:
      "Studies in the way light arrives — through fog, between buildings, across water.",
    cover: img("light-cover", 1600, 1000),
  },
  {
    slug: "daily-objects",
    name: "Daily Objects",
    description:
      "Tools, vessels, surfaces. An informal inventory of what the hand returns to.",
    cover: img("objects-cover", 1600, 1000),
  },
  {
    slug: "weather",
    name: "Weather",
    description:
      "Atmospheric conditions as protagonist — fog, low cloud, rain on cold iron.",
    cover: img("weather-cover", 1600, 1000),
  },
];

// ---------- Posts ----------

export const posts: Post[] = [
  {
    slug: "waiting-for-the-0614-to-mutsu",
    title: "Waiting for the 06:14 to Mutsu",
    date: "2024-12-04",
    excerpt:
      "The station smells of cold iron and kerosene. A series on the visual syntax of rural Japanese transit, where utility meets an unintentional geometry.",
    cover: photo("c-mutsu", "mutsu-station", "Foggy rural train platform at dawn", "landscape"),
    topic: "transit",
    topics: ["weather", "architecture"],
    tags: ["japan", "stations", "winter", "fog"],
    place: "Aomori, JP",
    format: "essay",
    featured: true,
    readingTime: 9,
    visibility: "public",
    related: ["the-quiet-permanence-of-neglected-spaces", "low-cloud-over-trotternish"],
    body: [
      {
        type: "highlight",
        id: "h1",
        body:
          "There is a specific quality of waiting that exists only in rural stations before sunrise — a stillness that is not silence but a low hum, almost mechanical, almost human.",
      },
      {
        type: "text",
        id: "t1",
        body:
          "I arrived at the Aomori prefectural line by way of a sleeper carriage that smelled faintly of warm vinyl and instant coffee. The conductor, in a navy peaked cap that seemed older than the line itself, gestured wordlessly toward bench seven. Outside, the platform lamps cast cones of grey-yellow light onto the lacquered concrete, and the snow fell so slowly it could have been suspended.",
      },
      {
        type: "image",
        id: "i1",
        image: photo("i-platform", "platform-lamp-snow", "Snow falling under a single platform lamp", "landscape", "Platform 2, 05:42. Hand-held, ISO 1600."),
      },
      {
        type: "text",
        id: "t2",
        body:
          "Architecturally, these stations operate within a tightly constrained vocabulary: a corrugated roof, a wooden bench, a vending machine glowing the wrong shade of green. And yet they accumulate — across the country, across decades — into something like a national mood. To stand on one of these platforms is to enter a shared interior.",
      },
      {
        type: "image-grid",
        id: "g1",
        caption: "Three studies of platform geometry. Aomori line, Dec 2023.",
        images: [
          photo("g1a", "ledger-snow", "Snow-covered wooden ledger bench", "portrait"),
          photo("g1b", "platform-window", "Frosted window with hanging schedule", "portrait"),
          photo("g1c", "vending-machine", "Vending machine glowing green at dawn", "portrait"),
          photo("g1d", "track-curve", "Empty track curving into mist", "portrait"),
        ],
      },
      {
        type: "quote",
        id: "q1",
        body:
          "What we call the spirit of a place is, more often, the durable habit of its smallest gestures.",
        cite: "from field notebook, 04 Dec 2023",
      },
      {
        type: "video-grid-portrait",
        id: "vg1",
        lightboxGroup: "mutsu-motion",
        caption: "Motion studies recorded on the morning of departure.",
        videos: [
          video("vg1a", "youtube-shorts", "aqz-KE-bpKQ", "motion-grass", "Wind through tall grass beside the platform", "portrait", "0:12"),
          video("vg1b", "youtube-shorts", "5qap5aO4i9A", "motion-rain", "Rain on the station window", "portrait", "0:08"),
          video("vg1c", "youtube-shorts", "jfKfPfyJRdk", "motion-train", "The 06:14 passing through", "portrait", "0:15"),
          video("vg1d", "youtube-shorts", "DWcJFNfaw9c", "motion-light", "Lamp light moving across painted wall", "portrait", "0:06"),
        ],
      },
      {
        type: "reflection",
        id: "r1",
        label: "Margin note",
        body:
          "The 06:14 arrived three minutes late. The conductor bowed twice in apology — once toward the platform, once toward the train itself.",
      },
      {
        type: "text",
        id: "t3",
        body:
          "By the time we crossed the prefectural border, the sky had taken on the cold, even tone of fluorescent paper. I closed the notebook. There was nothing to add that would not damage the morning.",
      },
      {
        type: "divider",
        id: "d1",
      },
      {
        type: "link",
        id: "l1",
        title: "JR East — Aomori line schedule (PDF)",
        url: "https://www.jreast.co.jp/",
        source: "JR East",
      },
    ],
  },
  {
    slug: "the-quiet-permanence-of-neglected-spaces",
    title: "The quiet permanence of neglected spaces",
    date: "2024-10-19",
    excerpt:
      "A walking essay through Berlin's eastern fringe — courtyards, switchboards, the slow grammar of disuse.",
    cover: photo("c-berlin", "berlin-courtyard", "Empty Berlin courtyard with grey light", "landscape"),
    topic: "architecture",
    topics: ["natural-light", "daily-objects"],
    tags: ["berlin", "walking", "decay", "industrial"],
    place: "Berlin, DE",
    format: "essay",
    featured: true,
    readingTime: 12,
    visibility: "public",
    related: ["waiting-for-the-0614-to-mutsu", "tuscan-hour"],
    body: [
      {
        type: "text",
        id: "bt1",
        body:
          "Friedrichshain in October is a study in restraint. The trees release their colour grudgingly; the courtyards keep their stories filed under unmarked tabs. I walked from Boxhagener Platz toward the river and found, in a recessed alley, a switchboard panel from 1962, its enamel still legible.",
      },
      {
        type: "image",
        id: "bi1",
        image: photo("bi1", "switchboard-1962", "Enamel switchboard panel from 1962", "landscape", "Switchboard, recessed alley off Boxhagener Straße."),
      },
      {
        type: "highlight",
        id: "bh1",
        body:
          "Neglect, when prolonged enough, becomes a form of preservation. The thing remains because no one has thought to argue about it.",
      },
      {
        type: "quote",
        id: "bq1",
        body: "The eye is the first circle; the horizon which it forms is the second.",
        cite: "Emerson, Circles",
      },
      {
        type: "image-grid",
        id: "bg1",
        caption: "Three courtyards, all within four blocks. Each closed by 18:00.",
        images: [
          photo("bg1a", "berlin-court-1", "Berlin courtyard, ivy", "square"),
          photo("bg1b", "berlin-court-2", "Berlin courtyard, bicycles", "square"),
          photo("bg1c", "berlin-court-3", "Berlin courtyard, washing line", "square"),
        ],
      },
      {
        type: "text",
        id: "bt2",
        body:
          "The river, when I reached it, was the same flat grey as the sky, and the wind had picked up enough to make the cables of the construction cranes hum at a pitch close to a cello. I stood for a long time, doing nothing in particular, which is, I have come to believe, the work.",
      },
    ],
  },
  {
    slug: "low-cloud-over-trotternish",
    title: "Low cloud over Trotternish",
    date: "2024-09-02",
    excerpt:
      "Three days on the Isle of Skye in weather that refused to lift. Notes on basalt, wind, and the productive uses of impatience.",
    cover: photo("c-skye", "skye-cliffs", "Misty basalt cliffs", "landscape"),
    topic: "weather",
    topics: ["natural-light"],
    tags: ["scotland", "skye", "fog", "geology"],
    place: "Isle of Skye, UK",
    format: "field notes",
    featured: false,
    readingTime: 6,
    visibility: "public",
    related: ["waiting-for-the-0614-to-mutsu"],
    body: [
      {
        type: "text",
        id: "st1",
        body:
          "The Quiraing was invisible for the first two days. I sat in the rented car with the heater on and a thermos of bitter coffee, reading the same two pages of a book on volcanic geology in rotation.",
      },
      {
        type: "reflection",
        id: "sr1",
        label: "On weather",
        body:
          "Weather is not an obstacle to the work; weather is the work. The photographs of the cleared third day were not better — only different in their politeness.",
      },
      {
        type: "image",
        id: "si1",
        image: photo("si1", "skye-ridge", "Ridge emerging from cloud", "landscape"),
      },
    ],
  },
  {
    slug: "tuscan-hour",
    title: "The Tuscan hour, slightly mistranslated",
    date: "2024-07-14",
    excerpt:
      "An afternoon in Pienza spent failing to photograph the light, and what that failure clarified.",
    cover: photo("c-tuscany", "pienza-stone", "Warm Tuscan stone wall in late sun", "landscape"),
    topic: "natural-light",
    topics: ["daily-objects"],
    tags: ["italy", "tuscany", "summer"],
    place: "Pienza, IT",
    format: "essay",
    featured: false,
    readingTime: 5,
    visibility: "public",
    related: ["low-cloud-over-trotternish"],
    body: [
      {
        type: "text",
        id: "tt1",
        body:
          "There is a particular hour in Tuscany, often mistranslated as 'golden,' which is in fact closer to terracotta — a warm, almost embarrassed pink that lasts perhaps eleven minutes.",
      },
      {
        type: "image",
        id: "ti1",
        image: photo("ti1", "pienza-doorway", "Doorway in pink late light", "portrait"),
      },
      {
        type: "quote",
        id: "tq1",
        body: "To photograph is to confer importance.",
        cite: "Susan Sontag",
      },
    ],
  },
  {
    slug: "copenhagen-typology",
    title: "A small typology of Copenhagen handrails",
    date: "2024-05-22",
    excerpt:
      "Brass, oak, painted iron — twenty handrails along the harbour, ordered by frequency of use.",
    cover: photo("c-cph", "cph-handrail", "Brass handrail along Copenhagen harbour", "landscape"),
    topic: "daily-objects",
    topics: ["architecture"],
    tags: ["copenhagen", "typology", "design"],
    place: "India",
    format: "visual",
    featured: true,
    readingTime: 4,
    visibility: "public",
    related: ["the-quiet-permanence-of-neglected-spaces"],
    body: [
      {
        type: "highlight",
        id: "ch1",
        body:
          "An object's design is most legible at the point of repeated contact. The handrail is the city's most honest interview.",
      },
      {
        type: "image-grid",
        id: "cg1",
        caption: "Twenty handrails, Nyhavn to Refshaleøen. May 2024.",
        images: [
          photo("cg1a", "rail-1", "Brass rail, worn", "square"),
          photo("cg1b", "rail-2", "Painted iron rail", "square"),
          photo("cg1c", "rail-3", "Oak rail at ferry stop", "square"),
          photo("cg1d", "rail-4", "Galvanised rail beside canal", "square"),
          photo("cg1e", "rail-5", "Black-painted handrail on bridge", "square"),
          photo("cg1f", "rail-6", "Stainless rail outside library", "square"),
        ],
      },
    ],
  },
  {
    slug: "field-recordings-vol-04",
    title: "Field recordings, vol. 04 — ambient motion",
    date: "2024-03-08",
    excerpt:
      "A short reel of vertical motion studies — rain, light, crowd, train. Best watched without sound.",
    cover: photo("c-recordings", "ambient-motion", "Blurred ambient motion still", "landscape"),
    topic: "transit",
    topics: ["weather", "natural-light"],
    tags: ["motion", "vertical", "ambient"],
    place: "Various",
    format: "multimedia",
    featured: false,
    readingTime: 3,
    visibility: "public",
    related: ["waiting-for-the-0614-to-mutsu"],
    body: [
      {
        type: "text",
        id: "ft1",
        body:
          "These six recordings were made over a period of seven months, in five cities, with no intent of being collected. They are presented here in the order they were filmed.",
      },
      {
        type: "video-grid-portrait",
        id: "fvg1",
        lightboxGroup: "vol-04",
        videos: [
          video("fv1", "youtube-shorts", "aqz-KE-bpKQ", "fm-1", "Wind through grass", "portrait", "0:12"),
          video("fv2", "youtube-shorts", "5qap5aO4i9A", "fm-2", "Rain on glass", "portrait", "0:08"),
          video("fv3", "youtube-shorts", "jfKfPfyJRdk", "fm-3", "Passing train", "portrait", "0:15"),
          video("fv4", "youtube-shorts", "DWcJFNfaw9c", "fm-4", "Light across wall", "portrait", "0:06"),
          video("fv5", "youtube-shorts", "9bZkp7q19f0", "fm-5", "Crowd in slow motion", "portrait", "0:21"),
          video("fv6", "youtube-shorts", "kXYiU_JCYtU", "fm-6", "Ferry leaving harbour", "portrait", "0:18"),
        ],
      },
      {
        type: "caption",
        id: "fc1",
        body: "All recordings handheld. No stabilisation, no colour correction beyond a single LUT.",
      },
      {
        type: "video-grid-portrait",
        id: "fvg2",
        lightboxGroup: "vol-04-extras",
        caption: "Extras — outtakes that didn't fit the sequence but stayed with me.",
        videos: [
          video("fv7", "vimeo", "76979871", "fm-7", "Steam on a cold morning", "portrait", "0:09"),
          video("fv8", "vimeo", "1084537", "fm-8", "Curtain in a draught", "portrait", "0:11"),
        ],
      },
    ],
  },
];

// ---------- Aggregations ----------

export const allMedia = (): (import("./types").MediaItem & { postSlug: string })[] => {
  const out: (import("./types").MediaItem & { postSlug: string })[] = [];
  for (const p of posts) {
    out.push({ ...p.cover, postSlug: p.slug });
    for (const b of p.body) {
      if (b.type === "image") out.push({ ...b.image, postSlug: p.slug });
      if (b.type === "image-grid") b.images.forEach((i) => out.push({ ...i, postSlug: p.slug }));
      if (b.type === "video-landscape") out.push({ ...b.video, postSlug: p.slug });
      if (b.type === "video-grid-portrait") b.videos.forEach((v) => out.push({ ...v, postSlug: p.slug }));
    }
  }
  return out;
};

export const getPost = (slug: string): Post | undefined =>
  posts.find((p) => p.slug === slug);
export const getTopic = (slug: string): Topic | undefined =>
  topics.find((t) => t.slug === slug);
export const postsByTopic = (slug: string): Post[] =>
  posts.filter((p) => p.topic === slug || p.topics.includes(slug));

export const allYears = (): number[] => {
  const ys = new Set(posts.map((p) => new Date(p.date).getFullYear()));
  return Array.from(ys).sort((a, b) => b - a);
};
export const allPlaces = (): string[] =>
  Array.from(new Set(posts.map((p) => p.place))).sort();
export const allTags = (): string[] =>
  Array.from(new Set(posts.flatMap((p) => p.tags))).sort();
export const allFormats = (): string[] =>
  Array.from(new Set(posts.map((p) => p.format))).sort();
