import {
    defineExtensionMessaging,
    type ExtensionMessage,
    type GetReturnType,
    type MaybePromise,
    type Message,
  } from "@webext-core/messaging";

  export interface DownloadMediaBase  {
    username: string;
    tweetId: string;
  }

export type DownloadPhotos = DownloadMediaBase & {
    mode: "photos";
    photoURLs: string[]
}

export type DownloadVideos = DownloadMediaBase & {
    mode: "videos";
}

export type DownloadMedia = DownloadMediaBase & {
    mode: "all";
}

export type DownloadMediaParams = DownloadMedia | DownloadPhotos | DownloadVideos;

interface ProtocolMap {
  downloadMedia: (params: DownloadMediaParams) => Promise<void>;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();

export type MessageHandler<K extends keyof ProtocolMap> = (message: Message<ProtocolMap, K> & ExtensionMessage) => undefined | MaybePromise<GetReturnType<ProtocolMap[K]>>