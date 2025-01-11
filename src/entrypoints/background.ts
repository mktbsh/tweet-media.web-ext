import { downloadMediaHandler } from "@/messaging/background";
import { onMessage } from "@/messaging/protocol";

export default defineBackground(() => {
  onMessage('downloadMedia', downloadMediaHandler)
});
