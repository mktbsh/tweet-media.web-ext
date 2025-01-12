import { downloadPhotos } from "@/messaging/foreground";

const X_IMG_SELECTOR = 'img[src^="https://pbs.twimg.com/media/"]';
const X_VIDEO_SELECTOR = "video";
const SHARE_POST_SELECTOR = `button[aria-label="ポストを共有"]`;
const WXT_ELEMENT_ID =  "wxt-media-download-el";
const WXT_ELEMENT_SELECTOR = `button[data-wxt-element="${WXT_ELEMENT_ID}"]`

interface TweetArticleNode {
  attach: VoidFunction;
}

const empty = { attach: noop };

export function initTweetArticleNode(root: Element): TweetArticleNode {
  const attached = isAttached(root);
  if (attached) return empty;

  const meta = getTweetMetadata(root);
  if (!meta) {
    return empty
  }

  const photoElements = [...root.querySelectorAll<HTMLImageElement>(X_IMG_SELECTOR)];
  const videoCount = checkVideoCount(root);

  const hasPhoto = photoElements.length > 0;
  const hasVideo = videoCount > 0;
  const hasMedia = hasPhoto || hasVideo;
  const status = mediaStatus(photoElements.length, videoCount);


  if (!hasMedia) {
    return empty
  }

  const attach = () => {
    const container = root.querySelector(`div[role="group"]`);
    const button = copyButton(root);
    if (!container || !button) return

    button.addEventListener('click', () => {
      switch (status) {
        case "both": break;
        case "photo":
          return downloadPhotos({
            tweetId: meta.id,
            username: meta.username,
            photoURLs: photoElements.map(v => v.src)
          })
        case "video": break;
        default: break;
      }
    })

    container.appendChild(button);
  }

  return { attach }
}

function mediaStatus(photoCount: number, videoCount: number): "photo" | "video" | "both" {
  if (photoCount > 0 && videoCount > 0) return "both";
  if (photoCount > 0) return "photo";
  return "video"
}

function noop(): void {
  return void 0;
}

function isAttached(root: Element): boolean {
  return root.querySelector(WXT_ELEMENT_SELECTOR) != null;
}

function copyButton(root: Element): HTMLButtonElement | undefined {
  const base = root.querySelector<HTMLButtonElement>(SHARE_POST_SELECTOR);
  if (!base) return;
  const button = base.cloneNode() as HTMLButtonElement;
  button.setAttribute("aria-label", "ダウンロード");
  button.setAttribute("role", "button");
  button.dataset.testid = "download";
  button.dataset.wxtElement = WXT_ELEMENT_ID;
  button.textContent = "DL";
  button.style.fontSize = "13px";
  
  return button;
}

const regex = /^\/([^\/]+)\/status\/(\d+)/;
function getTweetMetadata(root: Element): { url: string; username: string; id: string } | null {
  const href = root.querySelector("a > time")?.parentElement?.getAttribute("href");
  if (!href) return null;

  const match = href.match(regex);
  if (!match) return null;

  const username = match[1];
  const id = match[2];

  if (!username || !id) return null;

  return { url: href, username, id }
}

function checkVideoCount(root: Element): number {
  const videos = [...root.querySelectorAll<HTMLVideoElement>(X_VIDEO_SELECTOR)];
  return videos.length;
}