// CMS-style content model. Pure data — swap for a real CMS later
// without touching layouts.

export type Orientation = "landscape" | "portrait" | "square";
export type VideoSource = "youtube" | "youtube-shorts" | "vimeo";

export type MediaImage = {
  type: "image";
  id: string;
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
  orientation: Orientation;
  aspect?: string; // e.g. "3/4"
};

export type MediaVideo = {
  type: "video";
  id: string;
  source: VideoSource;
  videoId: string; // youtube/vimeo id
  thumbnail: string;
  alt: string;
  caption?: string;
  credit?: string;
  orientation: Orientation;
  duration?: string;
};

export type MediaItem = MediaImage | MediaVideo;

// ---------- Content blocks ----------

export type TextBlock = { type: "text"; id: string; body: string };
export type HighlightBlock = { type: "highlight"; id: string; body: string };
export type QuoteBlock = {
  type: "quote";
  id: string;
  body: string;
  cite?: string;
};
export type SingleImageBlock = {
  type: "image";
  id: string;
  image: MediaImage;
};
export type ImageGridBlock = {
  type: "image-grid";
  id: string;
  images: MediaImage[];
  caption?: string;
};
export type LandscapeVideoBlock = {
  type: "video-landscape";
  id: string;
  video: MediaVideo;
};
export type PortraitVideoGridBlock = {
  type: "video-grid-portrait";
  id: string;
  videos: MediaVideo[];
  caption?: string;
  lightboxGroup: string;
};
export type CaptionBlock = { type: "caption"; id: string; body: string };
export type DividerBlock = { type: "divider"; id: string };
export type ReflectionBlock = {
  type: "reflection";
  id: string;
  label?: string;
  body: string;
};
export type LinkBlock = {
  type: "link";
  id: string;
  title: string;
  url: string;
  source?: string;
};

export type ContentBlock =
  | TextBlock
  | HighlightBlock
  | QuoteBlock
  | SingleImageBlock
  | ImageGridBlock
  | LandscapeVideoBlock
  | PortraitVideoGridBlock
  | CaptionBlock
  | DividerBlock
  | ReflectionBlock
  | LinkBlock;

// ---------- Collections ----------

export type Topic = {
  slug: string;
  name: string;
  description: string;
  cover: string;
};

export type Post = {
  slug: string;
  title: string;
  date: string; // ISO
  excerpt: string;
  cover: MediaImage;
  topic: string; // main topic slug
  topics: string[]; // secondary
  tags: string[];
  place: string;
  format: "essay" | "field notes" | "visual" | "multimedia";
  featured: boolean;
  readingTime: number;
  visibility: "public" | "draft";
  body: ContentBlock[];
  related: string[]; // slugs
};
