import {type DownloadPhotos, sendMessage } from "./protocol";

export async function downloadPhotos(data: Omit<DownloadPhotos, "mode">): Promise<void> {
    return sendMessage("downloadMedia", { ...data, mode: "photos" });
}

export async function downloadVideos(data: Omit<DownloadPhotos, "mode">): Promise<void> {
    return sendMessage("downloadMedia", {
        ...data,
        mode: "videos"
    })
}

export async function downloadMedia(data: Omit<DownloadPhotos, "mode">): Promise<void> {
    return sendMessage("downloadMedia", {
        ...data,
        mode: "all"
    })
}