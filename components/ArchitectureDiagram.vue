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

      <text class="lane-label" x="470" y="39">APPLICATION</text>
      <text class="lane-label" x="475" y="234">REALTIME PIPELINE</text>
      <text class="lane-label" x="410" y="484">LIVE AUDIENCE</text>

      <!-- Control flow: admin → Laravel → Postgres. -->
      <path
        class="connector"
        d="M254 278V102Q254 91 265 91H470"
        :marker-end="`url(#${uid}-arrow)`"
      />
      <path
        class="connector return"
        d="M470 132H296Q278 132 278 150V278"
        :marker-end="`url(#${uid}-arrow)`"
      />
      <text class="route-label" x="351" y="77" text-anchor="middle">
        START TRANSLATION
      </text>
      <text class="route-label" x="374" y="157" text-anchor="middle">
        WEBSOCKET URL + TOKEN
      </text>
      <path
        class="connector"
        d="M670 111H790"
        :marker-end="`url(#${uid}-arrow)`"
      />

      <!-- Audio enters the browser. -->
      <path
        class="connector"
        d="M122 321H205"
        :marker-end="`url(#${uid}-arrow)`"
      />
      <text class="route-label" x="164" y="304" text-anchor="middle">AUDIO</text>

      <!-- Browser ⇄ Durable Object. -->
      <path
        class="connector data"
        d="M315 296H475"
        :marker-end="`url(#${uid}-arrow)`"
      />
      <path
        class="connector return"
        d="M475 344H315"
        :marker-end="`url(#${uid}-arrow)`"
      />
      <text class="route-label" x="395" y="279" text-anchor="middle">AUDIO</text>
      <text class="protocol-label" x="395" y="324" text-anchor="middle">
        WEBSOCKET
      </text>
      <text class="route-label" x="395" y="370" text-anchor="middle">
        TRANSLATION
      </text>

      <!-- Durable Object ⇄ translation service. -->
      <path
        class="connector data"
        d="M705 296H940"
        :marker-end="`url(#${uid}-arrow)`"
      />
      <path
        class="connector return"
        d="M940 344H705"
        :marker-end="`url(#${uid}-arrow)`"
      />
      <text class="route-label" x="822" y="279" text-anchor="middle">AUDIO</text>
      <text class="protocol-label" x="822" y="324" text-anchor="middle">
        WEBSOCKET
      </text>
      <text class="route-label" x="822" y="370" text-anchor="middle">
        TRANSLATION
      </text>

      <!-- Durable Object → attendee fan-out. -->
      <path class="connector" d="M590 375V444Q590 454 580 454H442" />
      <path class="connector" d="M590 454H738Q748 454 748 464V490" />
      <path
        class="connector"
        d="M442 454V490"
        :marker-end="`url(#${uid}-arrow)`"
      />
      <path
        class="connector"
        d="M590 454V490"
        :marker-end="`url(#${uid}-arrow)`"
      />
      <path
        class="connector"
        d="M748 464V490"
        :marker-end="`url(#${uid}-arrow)`"
      />
      <text class="protocol-label" x="590" y="430" text-anchor="middle">
        WEBSOCKET
      </text>

      <!-- Laravel application -->
      <g class="node" :class="{ focused: focus === 'web' }">
        <rect class="node-bg" x="470" y="61" width="200" height="100" rx="14" />
        <text class="node-title" x="495" y="104">Web App</text>
        <text class="node-detail" x="495" y="132">
          {{ labels ? "Laravel / Inertia / React" : "Laravel application" }}
        </text>
      </g>

      <!-- Postgres -->
      <g class="node database">
        <rect class="node-bg" x="790" y="61" width="190" height="100" rx="14" />
        <g transform="translate(812 80)">
          <ellipse class="db-shape" cx="27" cy="10" rx="25" ry="9" />
          <path class="db-shape" d="M2 10v36c0 5 11 10 25 10s25-5 25-10V10" />
          <path class="db-divider" d="M2 23c0 5 11 10 25 10s25-5 25-10M2 36c0 5 11 10 25 10s25-5 25-10" />
        </g>
        <text class="node-title" x="882" y="105">Postgres</text>
        <text class="node-detail" x="882" y="132">Application data</text>
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
      <g class="node core" :class="{ focused: focus === 'durable' }">
        <rect class="node-bg" x="475" y="255" width="230" height="120" rx="16" />
        <text class="node-title" x="503" y="306">WebSocket Server</text>
        <text class="node-detail" x="503" y="337">
          {{ labels ? "Workers + Durable Objects" : "Durable Object per event" }}
        </text>
      </g>

      <!-- Translation service -->
      <g class="node" :class="{ focused: focus === 'api' }">
        <rect class="node-bg" x="940" y="255" width="220" height="120" rx="16" />
        <text class="node-title" x="968" y="306">Translation API</text>
        <text class="node-detail" x="968" y="337">Speech → translated text</text>
      </g>

      <!-- Audience devices -->
      <g class="phone" transform="translate(410 490)">
        <rect class="phone-shell" width="64" height="96" rx="10" />
        <rect class="phone-screen" x="7" y="8" width="50" height="69" rx="4" />
        <circle class="phone-home" cx="32" cy="87" r="3" />
        <text class="language" x="32" y="51" text-anchor="middle">あ</text>
        <text class="device-label" x="32" y="122" text-anchor="middle">
          JAPANESE
        </text>
      </g>
      <g class="phone" transform="translate(558 490)">
        <rect class="phone-shell" width="64" height="96" rx="10" />
        <rect class="phone-screen" x="7" y="8" width="50" height="69" rx="4" />
        <circle class="phone-home" cx="32" cy="87" r="3" />
        <text class="language" x="32" y="51" text-anchor="middle">中</text>
        <text class="device-label" x="32" y="122" text-anchor="middle">
          CHINESE
        </text>
      </g>
      <g class="phone" transform="translate(716 490)">
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

.connector.return {
  stroke-dasharray: 5 5;
}

marker path {
  fill: #647083;
}

.lane-label,
.route-label,
.protocol-label,
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

.route-label,
.protocol-label {
  paint-order: stroke;
  stroke: rgb(255 255 255 / 96%);
  stroke-width: 11px;
  stroke-linejoin: round;
}

.protocol-label {
  fill: #40506a;
  font-size: 12px;
  letter-spacing: 1.6px;
}

.node-bg {
  fill: #fff;
  stroke: #cbd2dc;
  stroke-width: 1.5;
  filter: drop-shadow(0 7px 10px rgb(28 39 56 / 7%));
}

.core .node-bg {
  fill: #f4f6f9;
  stroke: #8e99a8;
  stroke-width: 2;
}

.node.focused .node-bg {
  fill: #283b5d;
  stroke: #283b5d;
  stroke-width: 2;
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
