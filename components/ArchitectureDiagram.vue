<script setup>
import { useId } from "vue";

defineProps({
  focus: {
    type: String,
    default: "",
  },
  labels: {
    type: Boolean,
    default: false,
  },
});

const uid = useId();

const edges = [
  { d: "M122 321H205", delay: "0s", type: "audio" },
  { d: "M254 278V102Q254 91 265 91H550", delay: "0.75s", type: "control" },
  { d: "M750 111H792", delay: "1.15s", type: "control" },
  { d: "M550 132H296Q278 132 278 150V278", delay: "1.45s", type: "return" },
  { d: "M315 296H525", delay: "2.15s", type: "audio" },
  { d: "M755 296H940", delay: "2.7s", type: "audio" },
  { d: "M940 344H755", delay: "3.4s", type: "return" },
  { d: "M525 344H315", delay: "3.95s", type: "return" },
  { d: "M640 375V454", delay: "3.95s", type: "broadcast", arrow: false },
  { d: "M640 454H492", delay: "4.3s", type: "broadcast", arrow: false },
  { d: "M640 454H798", delay: "4.3s", type: "broadcast", arrow: false },
  { d: "M492 454V490", delay: "4.6s", type: "broadcast" },
  { d: "M640 454V490", delay: "4.6s", type: "broadcast" },
  { d: "M798 454V490", delay: "4.6s", type: "broadcast" },
];
</script>

<template>
  <div class="architecture">
    <svg
      class="diagram"
      viewBox="25 20 1150 620"
      role="img"
      aria-label="Live translation system architecture"
    >
      <defs>
        <marker
          :id="`${uid}-arrow`"
          viewBox="0 0 10 10"
          refX="8.5"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M1 1.5 8.5 5 1 8.5Z" />
        </marker>
      </defs>

      <g class="edges">
        <g v-for="(edge, i) in edges" :key="i">
          <path
            class="connector"
            :class="edge.type"
            :d="edge.d"
            :marker-end="
              edge.arrow === false ? undefined : `url(#${uid}-arrow)`
            "
          />
          <path
            class="flow"
            :class="edge.type"
            :d="edge.d"
            pathLength="1"
            :style="{ '--t': edge.delay }"
          />
        </g>
      </g>

      <text class="route-label" x="408" y="77" text-anchor="middle">
        START TRANSLATION
      </text>
      <text class="route-label" x="423" y="157" text-anchor="middle">
        WEBSOCKET URL + TOKEN
      </text>
      <text class="route-label" x="164" y="304" text-anchor="middle">AUDIO</text>
      <text class="route-label" x="420" y="279" text-anchor="middle">AUDIO</text>
      <g class="protocol">
        <rect x="372" y="309" width="96" height="22" rx="11" />
        <text x="420" y="324" text-anchor="middle">WebSocket</text>
      </g>
      <text class="route-label" x="420" y="370" text-anchor="middle">
        TRANSLATION
      </text>
      <text class="route-label" x="848" y="279" text-anchor="middle">AUDIO</text>
      <g class="protocol">
        <rect x="800" y="309" width="96" height="22" rx="11" />
        <text x="848" y="324" text-anchor="middle">WebSocket</text>
      </g>
      <text class="route-label" x="848" y="370" text-anchor="middle">
        TRANSLATION
      </text>
      <g class="protocol">
        <rect x="592" y="403" width="96" height="22" rx="11" />
        <text x="640" y="418" text-anchor="middle">WebSocket</text>
      </g>

      <!-- Laravel application -->
      <g class="node" :class="{ focused: focus === 'web' }">
        <rect class="node-bg" x="550" y="61" width="200" height="100" rx="14" />
        <text
          class="node-title"
          x="650"
          :y="labels ? 104 : 120"
          text-anchor="middle"
        >
          Web App
        </text>
        <text
          v-if="labels"
          class="node-detail"
          x="650"
          y="132"
          text-anchor="middle"
        >
          Laravel / Inertia / React
        </text>
      </g>

      <!-- Postgres -->
      <g class="database">
        <g transform="translate(788 70) scale(1.45)">
          <ellipse class="db-shape" cx="27" cy="10" rx="25" ry="9" />
          <path class="db-shape" d="M2 10v36c0 5 11 10 25 10s25-5 25-10V10" />
          <path
            class="db-divider"
            d="M2 23c0 5 11 10 25 10s25-5 25-10M2 36c0 5 11 10 25 10s25-5 25-10"
          />
        </g>
        <text class="node-title" x="827" y="176" text-anchor="middle">
          Postgres
        </text>
      </g>

      <!-- Microphone -->
      <g class="microphone" transform="translate(57 278)">
        <rect x="22" width="32" height="59" rx="16" />
        <path d="M10 42a28 28 0 0 0 56 0M38 70v27M21 97h34" />
      </g>

      <!-- Admin laptop -->
      <g class="laptop" transform="translate(205 278)">
        <rect class="device-shell" x="8" width="102" height="66" rx="6" />
        <rect class="device-screen" x="17" y="9" width="84" height="48" rx="2" />
        <path class="laptop-base" d="M1 66h116l14 17H-13Z" />
        <text class="device-label" x="59" y="112" text-anchor="middle">
          ADMIN / SPEAKER
        </text>
      </g>

      <!-- Durable Object -->
      <g
        class="node server"
        :class="{ focused: focus === 'durable' }"
      >
        <rect class="node-bg" x="525" y="255" width="230" height="120" rx="16" />
        <text
          class="node-title"
          x="640"
          :y="labels ? 306 : 323"
          text-anchor="middle"
        >
          WebSocket Server
        </text>
        <text
          v-if="labels"
          class="node-detail"
          x="640"
          y="337"
          text-anchor="middle"
        >
          Workers + Durable Objects
        </text>
      </g>

      <!-- Translation service -->
      <g class="node" :class="{ focused: focus === 'api' }">
        <rect class="node-bg" x="940" y="255" width="220" height="120" rx="16" />
        <text class="node-title" x="968" y="323">Translation API</text>
      </g>

      <!-- Audience devices -->
      <g class="phone" transform="translate(460 490)">
        <rect class="phone-shell" width="64" height="96" rx="10" />
        <rect class="phone-screen" x="7" y="8" width="50" height="69" rx="4" />
        <circle class="phone-home" cx="32" cy="87" r="3" />
        <text class="language" x="32" y="51" text-anchor="middle">あ</text>
        <text class="device-label" x="32" y="122" text-anchor="middle">
          JAPANESE
        </text>
      </g>
      <g class="phone" transform="translate(608 490)">
        <rect class="phone-shell" width="64" height="96" rx="10" />
        <rect class="phone-screen" x="7" y="8" width="50" height="69" rx="4" />
        <circle class="phone-home" cx="32" cy="87" r="3" />
        <text class="language" x="32" y="51" text-anchor="middle">中</text>
        <text class="device-label" x="32" y="122" text-anchor="middle">
          CHINESE
        </text>
      </g>
      <g class="phone" transform="translate(766 490)">
        <rect class="phone-shell" width="64" height="96" rx="10" />
        <rect class="phone-screen" x="7" y="8" width="50" height="69" rx="4" />
        <circle class="phone-home" cx="32" cy="87" r="3" />
        <text class="language" x="32" y="51" text-anchor="middle">한</text>
        <text class="device-label" x="32" y="122" text-anchor="middle">
          KOREAN
        </text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.architecture {
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
  overflow: hidden;
  font-family: "Inter", sans-serif;
}

.diagram {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.connector {
  fill: none;
  stroke: #647083;
  stroke-width: 2.3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.connector.return,
.connector.broadcast {
  stroke-dasharray: 5 5;
}

.flow {
  fill: none;
  stroke: #3153a4;
  stroke-width: 3.6;
  stroke-linecap: round;
  stroke-dasharray: 0.2 1;
  stroke-dashoffset: 0.2;
  opacity: 0;
  filter: drop-shadow(0 0 3.5px rgb(49 83 164 / 60%));
  animation: packet 6.6s linear infinite;
  animation-delay: var(--t, 0s);
}

.flow.return,
.flow.broadcast {
  stroke: #f6821f;
  filter: drop-shadow(0 0 3.5px rgb(246 130 31 / 60%));
}

@keyframes packet {
  0%,
  1.5% {
    stroke-dashoffset: 0.2;
    opacity: 0;
  }
  3% {
    opacity: 1;
    stroke-dashoffset: 0.18;
  }
  15% {
    stroke-dashoffset: -1;
    opacity: 1;
  }
  17%,
  100% {
    stroke-dashoffset: -1;
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .flow {
    animation: none;
    display: none;
  }
}

marker path {
  fill: #647083;
}

.lane-label,
.route-label,
.device-label {
  fill: #697486;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1.25px;
}

.lane-label {
  fill: #98a1af;
  font-size: 12px;
  letter-spacing: 2.2px;
}

.route-label {
  paint-order: stroke;
  stroke: rgb(255 255 255 / 96%);
  stroke-width: 11px;
  stroke-linejoin: round;
}

.protocol rect {
  fill: #eef2f6;
  stroke: #c5ced8;
  stroke-width: 1;
}

.protocol text {
  fill: #4a5568;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.node-bg {
  fill: #fff;
  stroke: #cbd2dc;
  stroke-width: 1.5;
  filter: drop-shadow(0 7px 10px rgb(28 39 56 / 7%));
}

.node.focused .node-bg {
  fill: #283b5d;
  stroke: #283b5d;
  stroke-width: 2;
}

.node.server.focused .node-bg {
  fill: #c94c3c;
  stroke: #b84336;
}

.node-title {
  fill: #202a38;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.25px;
}

.node-detail {
  fill: #6a7483;
  font-size: 14px;
  font-weight: 500;
}

.node.focused .node-title,
.node.focused .node-detail {
  fill: #fff;
}

.node.focused .node-detail {
  fill-opacity: 0.72;
}

.db-shape {
  fill: #4d5663;
}

.db-divider {
  fill: none;
  stroke: #fff;
  stroke-opacity: 0.55;
  stroke-width: 1.5;
}

.microphone rect {
  fill: #8d97a5;
}

.microphone path {
  fill: none;
  stroke: #647083;
  stroke-width: 4;
  stroke-linecap: round;
}

.device-shell,
.phone-shell {
  fill: #3f4957;
}

.device-screen,
.phone-screen {
  fill: #3153a4;
}

.laptop-base {
  fill: #aeb7c3;
}

.phone-home {
  fill: #7f8996;
}

.language {
  fill: #fff;
  font-family: "Zen Kaku Gothic New", sans-serif;
  font-size: 25px;
  font-weight: 700;
}
</style>
