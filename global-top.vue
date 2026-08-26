<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
} from "vue";

const WEBSOCKET_URL =
  "wss://yoyo-translation-proxy.avosalmon.workers.dev/events/01a03df2-a5db-725c-9843-62976e7972be?lang=all";
const MAX_CHUNKS_PER_LANGUAGE = 24;
const MAX_TRANSCRIPT_CHARACTERS = 2400;
const RECONNECT_MAX_DELAY_MS = 30_000;
const LANGUAGES = ["en", "ja"];

const transcripts = reactive({
  en: { chunks: [], original: "", interim: "" },
  ja: { chunks: [], original: "", interim: "" },
});
const connectionStatus = ref("connecting");
const englishScroller = ref(null);
const japaneseScroller = ref(null);

let socket = null;
let reconnectTimer = null;
let reconnectAttempts = 0;
let disposed = false;
let nextChunkId = 1;

const hasContent = computed(() =>
  LANGUAGES.some(
    (language) =>
      transcripts[language].chunks.length > 0 ||
      transcripts[language].original.length > 0 ||
      transcripts[language].interim.length > 0,
  ),
);

function normalizeLanguage(language) {
  if (typeof language !== "string") return null;

  const normalized = language.toLowerCase().split("-")[0];
  return normalized === "en" || normalized === "ja" ? normalized : null;
}

function isTranslationToken(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    typeof value.text === "string" &&
    typeof value.is_final === "boolean"
  );
}

function resetTranscripts() {
  for (const language of LANGUAGES) {
    transcripts[language].chunks = [];
    transcripts[language].original = "";
    transcripts[language].interim = "";
  }
}

function trimOriginal(text) {
  if (text.length <= MAX_TRANSCRIPT_CHARACTERS) return text;

  const tail = text.slice(-MAX_TRANSCRIPT_CHARACTERS);
  const firstBoundary = Math.max(tail.indexOf("\n"), tail.indexOf(" "));
  return firstBoundary > 0 ? tail.slice(firstBoundary + 1) : tail;
}

function pushChunk(language, text) {
  const trimmed = text.trim();
  if (trimmed.length === 0) return;

  transcripts[language].chunks.push({
    id: nextChunkId,
    text: trimmed,
  });
  nextChunkId += 1;

  if (transcripts[language].chunks.length > MAX_CHUNKS_PER_LANGUAGE) {
    transcripts[language].chunks.splice(
      0,
      transcripts[language].chunks.length - MAX_CHUNKS_PER_LANGUAGE,
    );
  }
}

function applyTranslationTokens(tokens) {
  const incoming = {
    en: { translation: "", originals: [], interim: "" },
    ja: { translation: "", originals: [], interim: "" },
  };
  const touchedLanguages = new Set();

  for (const token of tokens) {
    if (!isTranslationToken(token)) continue;

    const language = normalizeLanguage(token.language);
    if (language === null) continue;

    touchedLanguages.add(language);

    if (token.text === "<p>") continue;

    if (token.translation_status === "translation") {
      incoming[language].translation += token.text;
      continue;
    }

    if (token.is_final) {
      incoming[language].originals.push(token.text);
    } else {
      incoming[language].interim += token.text;
    }
  }

  for (const language of touchedLanguages) {
    const update = incoming[language];
    let addedTranslation = false;

    if (update.translation.length > 0) {
      pushChunk(language, update.translation);
      addedTranslation = true;
    }

    for (const text of update.originals) {
      transcripts[language].original = trimOriginal(
        transcripts[language].original + text,
      );
    }

    transcripts[language].interim = update.interim;
    scrollLanguage(language, addedTranslation ? "smooth" : "auto");
  }
}

function handleMessage(event) {
  if (typeof event.data !== "string") return;

  let message;
  try {
    message = JSON.parse(event.data);
  } catch {
    return;
  }

  if (message === null || typeof message !== "object") return;

  if (
    message.type === "translation" &&
    message.data !== null &&
    typeof message.data === "object" &&
    Array.isArray(message.data.tokens)
  ) {
    applyTranslationTokens(message.data.tokens);
    return;
  }

  if (message.type === "session_changed") {
    resetTranscripts();
    return;
  }

  if (message.type === "status" && typeof message.status === "string") {
    connectionStatus.value = message.status;
    if (message.status === "ended") {
      socket?.close();
    }
  }
}

function clearReconnectTimer() {
  if (reconnectTimer !== null) {
    window.clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}

function scheduleReconnect() {
  if (disposed || connectionStatus.value === "ended") return;

  clearReconnectTimer();
  connectionStatus.value = "reconnecting";
  reconnectAttempts += 1;
  const delay = Math.min(
    1000 * 2 ** (reconnectAttempts - 1),
    RECONNECT_MAX_DELAY_MS,
  );
  reconnectTimer = window.setTimeout(connect, delay);
}

function connect() {
  if (disposed) return;
  if (
    socket?.readyState === WebSocket.OPEN ||
    socket?.readyState === WebSocket.CONNECTING
  ) {
    return;
  }

  clearReconnectTimer();
  connectionStatus.value =
    reconnectAttempts > 0 ? "reconnecting" : "connecting";

  try {
    socket = new WebSocket(WEBSOCKET_URL);
  } catch {
    scheduleReconnect();
    return;
  }

  socket.addEventListener("open", () => {
    reconnectAttempts = 0;
    connectionStatus.value = "connected";
  });
  socket.addEventListener("message", handleMessage);
  socket.addEventListener("close", () => {
    socket = null;
    scheduleReconnect();
  });
  socket.addEventListener("error", () => {
    connectionStatus.value = "reconnecting";
  });
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollLanguage(language, behavior) {
  const scrollBehavior = prefersReducedMotion() ? "auto" : behavior;
  const scrollerRef = language === "en" ? englishScroller : japaneseScroller;

  nextTick(() => {
    requestAnimationFrame(() => {
      const scroller = scrollerRef.value;
      if (scroller === null) return;

      scroller.scrollTo({
        top: scroller.scrollHeight,
        behavior: scrollBehavior,
      });
    });
  });
}

function handleVisibilityChange() {
  if (document.visibilityState === "visible") connect();
}

onMounted(() => {
  connect();
  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("online", connect);
});

onBeforeUnmount(() => {
  disposed = true;
  clearReconnectTimer();
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  window.removeEventListener("online", connect);

  if (socket !== null) {
    socket.close();
    socket = null;
  }
});
</script>

<template>
  <Transition name="translation-overlay">
    <aside
      v-if="hasContent"
      class="live-translation-overlay"
      aria-live="polite"
    >
      <section class="translation-column english">
        <div class="translation-copy">
          <div ref="englishScroller" class="translation-viewport">
            <div class="translation-chunks">
              <p
                v-for="chunk in transcripts.en.chunks"
                :key="chunk.id"
                class="translation-chunk"
              >
                <span>{{ chunk.text }}</span>
              </p>
              <p
                v-if="
                  transcripts.en.original.length > 0 ||
                  transcripts.en.interim.length > 0
                "
                class="translation-chunk"
              >
                <span
                  >{{ transcripts.en.original
                  }}{{ transcripts.en.interim }}</span
                >
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="translation-column japanese" lang="ja">
        <div class="translation-copy">
          <div ref="japaneseScroller" class="translation-viewport">
            <div class="translation-chunks">
              <p
                v-for="chunk in transcripts.ja.chunks"
                :key="chunk.id"
                class="translation-chunk"
              >
                <span>{{ chunk.text }}</span>
              </p>
              <p
                v-if="
                  transcripts.ja.original.length > 0 ||
                  transcripts.ja.interim.length > 0
                "
                class="translation-chunk"
              >
                <span
                  >{{ transcripts.ja.original
                  }}{{ transcripts.ja.interim }}</span
                >
              </p>
            </div>
          </div>
        </div>
      </section>
    </aside>
  </Transition>
</template>

<style scoped>
.live-translation-overlay {
  position: absolute;
  z-index: 40;
  right: clamp(1.2rem, 3cqw, 3.5rem);
  bottom: clamp(0.6rem, 1.4cqh, 1.2rem);
  left: clamp(1.2rem, 3cqw, 3.5rem);
  display: grid;
  overflow: hidden;
  background: transparent;
  color: #fff;
  grid-template-columns: 1fr 1fr;
  pointer-events: none;
}

.translation-column {
  display: flex;
  min-width: 0;
  min-height: 0;
  align-items: flex-end;
  padding: 0 clamp(0.9rem, 1.8cqw, 2.2rem);
}

.translation-copy {
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  padding: 0.52em 0.7em;
  border-radius: 0.35em;
  background: rgb(10 16 26 / 78%);
  color: #fff;
  font-family: "Inter", sans-serif;
  font-size: clamp(1rem, 1.55cqw, 2rem);
  font-weight: 700;
  line-height: 1.35;
  text-shadow: 0 0.08em 0.12em rgb(0 0 0 / 72%);
  backdrop-filter: blur(0.35rem);
}

.translation-viewport {
  display: flex;
  height: 3lh;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;
  overflow-anchor: none;
}

.translation-viewport::-webkit-scrollbar {
  display: none;
}

.translation-chunks {
  display: flex;
  margin-top: auto;
  flex-direction: column;
  gap: 0.2em;
}

.translation-chunk {
  margin: 0;
  overflow: hidden;
}

.translation-chunk span {
  display: block;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}

.japanese .translation-copy {
  font-family: "Zen Kaku Gothic New", "Hiragino Sans", sans-serif;
  font-weight: 700;
}

.translation-overlay-enter-active,
.translation-overlay-leave-active {
  transition:
    opacity 220ms ease,
    transform 220ms ease;
}

.translation-overlay-enter-from,
.translation-overlay-leave-to {
  opacity: 0;
  transform: translateY(0.8rem);
}

@media (prefers-reduced-motion: reduce) {
  .translation-overlay-enter-active,
  .translation-overlay-leave-active {
    transition: none;
  }
}
</style>
