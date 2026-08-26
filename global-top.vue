<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";

const WEBSOCKET_URL =
  "wss://yoyo-translation-proxy.avosalmon.workers.dev/events/01a03df2-a5db-725c-9843-62976e7972be?lang=all";
const MAX_TRANSCRIPT_CHARACTERS = 2400;
const RECONNECT_MAX_DELAY_MS = 30_000;

const transcripts = reactive({
  en: { final: "", interim: "" },
  ja: { final: "", interim: "" },
});
const connectionStatus = ref("connecting");

let socket = null;
let reconnectTimer = null;
let reconnectAttempts = 0;
let disposed = false;

const hasContent = computed(
  () =>
    transcripts.en.final.length > 0 ||
    transcripts.en.interim.length > 0 ||
    transcripts.ja.final.length > 0 ||
    transcripts.ja.interim.length > 0,
);

function normalizeLanguage(language) {
  if (typeof language !== "string") return null;

  const normalized = language.toLowerCase().split("-")[0];
  return normalized === "en" || normalized === "ja" ? normalized : null;
}

function trimTranscript(text) {
  if (text.length <= MAX_TRANSCRIPT_CHARACTERS) return text;

  const tail = text.slice(-MAX_TRANSCRIPT_CHARACTERS);
  const firstBoundary = Math.max(tail.indexOf("\n"), tail.indexOf(" "));
  return firstBoundary > 0 ? tail.slice(firstBoundary + 1) : tail;
}

function isTranslationToken(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    typeof value.text === "string" &&
    typeof value.is_final === "boolean"
  );
}

function applyTranslationTokens(tokens) {
  const incoming = {
    en: { final: "", interim: "" },
    ja: { final: "", interim: "" },
  };
  const touchedLanguages = new Set();

  for (const token of tokens) {
    if (!isTranslationToken(token)) continue;

    const language = normalizeLanguage(token.language);
    if (language === null) continue;

    touchedLanguages.add(language);

    if (token.text === "<p>") {
      incoming[language].final += "\n";
      continue;
    }

    if (token.is_final || token.translation_status === "translation") {
      incoming[language].final += token.text;
    } else {
      incoming[language].interim += token.text;
    }
  }

  for (const language of touchedLanguages) {
    const update = incoming[language];
    if (update.final.length > 0) {
      transcripts[language].final = trimTranscript(
        transcripts[language].final + update.final,
      );
    }
    transcripts[language].interim = update.interim;
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
    transcripts.en.final = "";
    transcripts.en.interim = "";
    transcripts.ja.final = "";
    transcripts.ja.interim = "";
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
          <div class="translation-viewport">
            <p>
              <span>{{ transcripts.en.final }}</span>
              <span>{{ transcripts.en.interim }}</span>
            </p>
          </div>
        </div>
      </section>

      <section class="translation-column japanese" lang="ja">
        <div class="translation-copy">
          <div class="translation-viewport">
            <p>
              <span>{{ transcripts.ja.final }}</span>
              <span>{{ transcripts.ja.interim }}</span>
            </p>
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
  justify-content: flex-end;
  overflow: hidden;
}

.translation-copy p {
  margin: 0;
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
