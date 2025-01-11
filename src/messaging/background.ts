import type { MessageHandler } from "./protocol";

const DOWNLOAD_DIR = "saved-tweet-media";

export const downloadMediaHandler: MessageHandler<"downloadMedia"> = async (
  msg
) => {
  const { tweetId, username, mode } = msg.data;

  const outDir = [DOWNLOAD_DIR, username, tweetId].join("/");

  switch (mode) {
    case "all":
      return;
    case "photos": {
      return downloadPhotos(outDir, msg.data.photoURLs);
    }
    case "videos":
      return;
    default:
      throw new Error(`Invalid mode: ${mode}`);
  }
};

async function downloadPhotos(outDir: string, photoURLs: string[]) {
  for (const photoURL of photoURLs) {
    if (!URL.canParse(photoURL)) continue;

    const url = getOriginalImageURL(photoURL);
    const id = extractIdFromPath(url.pathname);
    const format = url.searchParams.get("format") || "jpg";

    chrome.downloads.download({
      url: url.toString(),
      filename: `${outDir}/${id}.${format}`
    });
    
  }
}

function getOriginalImageURL(url: string): URL {
  const u = new URL(url);
  u.searchParams.set("name", "orig");
  return u;
}

function extractIdFromPath(pathname: string): string {
  const [empty, media, id] = pathname.split("/");

  const isOK = empty === "" && media === "media" && id.length > 0;
  if (isOK) return id;

  throwErr(`Invalid path: ${pathname}`);
}

function throwErr(message?: string, options?: ErrorOptions): never {
  throw new Error(message, options);
}
