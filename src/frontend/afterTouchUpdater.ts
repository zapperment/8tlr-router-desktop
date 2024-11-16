import { createUpdater } from "./updater";

export function createAfterTouchUpdater() {
  return createUpdater("at");
}
