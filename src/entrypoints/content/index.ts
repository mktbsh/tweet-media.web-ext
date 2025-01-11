import { initTweetArticleNode } from "./tweet-html";

export default defineContentScript({
    matches: ['https://x.com/*'],
    main(ctx) {
      const ui = createIntegratedUi(ctx, {
        position: 'inline',
        anchor: 'body',
        onMount() {
          return window.setInterval(watchTweets, 2_500);
        },
        onRemove(intervalId) {
          if (intervalId === undefined) return;
          window.clearInterval(intervalId);
        }
      });
      ui.mount();
    },
  });
  

function watchTweets() {
  console.group("watchTweets");
  const tweets = document.querySelectorAll('article[data-testid="tweet"]');
  for (const tweet of tweets) {
    initTweetArticleNode(tweet)?.attach();
  }
  console.groupEnd();
}