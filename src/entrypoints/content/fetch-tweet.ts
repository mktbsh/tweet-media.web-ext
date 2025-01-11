import { type Tweet, TwitterApiError } from "react-tweet/api";

const HOST = "https://react-tweet.vercel.app";

export async function fetchTweet(
  tweetId: string,
  fetchOptions?: RequestInit
): Promise<Tweet | "ok_empty"> {
  const url = endpointURL(tweetId);
  const res = await fetch(url, fetchOptions);
  const json = await res.json();

  if (res.ok) return json.data || "ok_empty";

  throw new TwitterApiError({
    message: `Failed to fetch tweet at "${url}" with "${res.status}".`,
    data: json,
    status: res.status,
  });
}

function endpointURL(id: string): string {
  return `${HOST}/api/tweet/${id}`;
}
