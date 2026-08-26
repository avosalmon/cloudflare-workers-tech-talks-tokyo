import { toggleCaptions } from "../captions-visibility";
import { defineShortcutsSetup } from "@slidev/types";

export default defineShortcutsSetup((_nav, base) => {
  return [
    ...base,
    {
      name: "toggle_captions",
      key: "c",
      fn: toggleCaptions,
    },
  ];
});
