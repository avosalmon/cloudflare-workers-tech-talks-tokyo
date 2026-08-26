import { useLocalStorage } from "@vueuse/core";

export const captionsVisible = useLocalStorage(
  "slidev-live-captions-visible",
  true,
);

export function toggleCaptions() {
  captionsVisible.value = !captionsVisible.value;
}
