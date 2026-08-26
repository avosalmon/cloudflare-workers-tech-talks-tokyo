<script setup>
defineProps({
  kind: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="concept">
    <div v-if="kind === 'identity'" class="identity">
      <div class="identity-flow">
        <div class="request-pill">eventId: tokyo-2026</div>
        <div class="route-arrow"><strong>getByName(id)</strong></div>
        <div class="object-card">
          <span class="hex">DO</span>
          <strong>専用コンピュート</strong>
          <span class="separator">+</span>
          <strong>専用 SQLite</strong>
        </div>
      </div>
      <p class="identity-kicker">ステートフルなサーバーレス</p>
    </div>

    <div v-else-if="kind === 'bridge'" class="bridge">
      <div class="endpoint browser">
        <strong>Admin</strong>
        <small>WebSocket client</small>
      </div>
      <div class="socket-line two-way"><span>WebSocket</span></div>
      <div class="object-card compact">
        <span class="hex">DO</span>
        <strong>EventSession</strong>
        <small>server + client</small>
      </div>
      <div class="socket-line two-way"><span>WebSocket</span></div>
      <div class="endpoint api">
        <strong>Translation API</strong>
        <small>WebSocket server</small>
      </div>
    </div>

    <div v-else-if="kind === 'live-state'" class="live-state">
      <div class="audience">
        <div
          v-for="language in ['JA', 'EN', 'ZH']"
          :key="language"
          class="viewer"
        >
          {{ language }}
        </div>
      </div>
      <div class="socket-bus">
        <span class="pulse"></span>
        <span class="pulse delay"></span>
      </div>
      <div class="object-card state">
        <span class="live-dot"></span>
        <strong>EventSession</strong>
        <div class="state-row"><span>admin</span><b>connected</b></div>
        <div class="state-row"><span>audience</span><b>284</b></div>
        <div class="state-row"><span>languages</span><b>3</b></div>
      </div>
      <div class="audio-stream">
        <span
          v-for="height in [35, 70, 45, 88, 52, 76, 38]"
          :key="height"
          :style="{ height: `${height}%` }"
        ></span>
      </div>
    </div>

    <div v-else-if="kind === 'instances'" class="instances">
      <div class="request-pill">eventId: tokyo-2026</div>
      <div class="route-arrow"><strong>getByName()</strong></div>
      <div class="object-card">
        <span class="hex">DO</span>
        <strong>tokyo-2026</strong>
        <small>1 ID = 1 instance</small>
      </div>
    </div>

    <div v-else-if="kind === 'scale'" class="scale">
      <div
        v-for="event in [
          { id: 'tokyo-2026', people: '284', color: 'blue' },
          { id: 'laracon-us', people: '412', color: 'orange' },
          { id: 'paris-meetup', people: '96', color: 'green' },
        ]"
        :key="event.id"
        class="scale-card"
        :class="event.color"
      >
        <div class="object-card compact">
          <span class="hex">DO</span>
          <strong>{{ event.id }}</strong>
        </div>
        <span class="audience-count">{{ event.people }} connections</span>
      </div>
    </div>

    <div v-else-if="kind === 'placement'" class="placement">
      <div class="world">
        <span class="continent americas"></span>
        <span class="continent europe"></span>
        <span class="continent asia"></span>
        <span class="region west">SFO</span>
        <span class="region eu">FRA</span>
        <span class="region jp active">Tokyo</span>
      </div>
      <div class="first-request">
        <span>最初のリクエスト</span>
        <strong>Tokyo</strong>
      </div>
      <div class="placement-arrow"></div>
      <div class="object-card map-card">
        <span class="hex">DO</span>
        <strong>近いロケーションに<br>配置</strong>
      </div>
    </div>

    <div v-else-if="kind === 'latency'" class="latency">
      <div class="latency-stage">
        <div class="latency-globe">
          <div class="globe-land">
            <span class="land americas"></span>
            <span class="land europe"></span>
            <span class="land africa"></span>
            <span class="land asia"></span>
            <svg class="japan-islands" viewBox="0 0 64 90" aria-hidden="true">
              <ellipse cx="36" cy="13" rx="11" ry="8" transform="rotate(18 36 13)" />
              <ellipse cx="24" cy="44" rx="11" ry="25" transform="rotate(30 24 44)" />
              <ellipse cx="14" cy="64" rx="5.5" ry="3.4" transform="rotate(12 14 64)" />
              <ellipse cx="10" cy="74" rx="7" ry="8.5" transform="rotate(18 10 74)" />
            </svg>
            <span class="land australia"></span>
          </div>
          <span class="city-pin sf"><i></i>SF</span>
          <span class="city-pin paris"><i></i>Paris</span>
          <span class="city-pin sydney"><i></i>Sydney</span>
          <span class="city-pin tokyo"><i></i><em>Tokyo</em></span>
        </div>
        <div class="object-card compact globe-do">
          <span class="hex">DO</span>
          <strong>Tokyo</strong>
        </div>
      </div>
      <div class="latency-meter">
        <strong>low latency</strong>
        <span class="meter-bar"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.concept {
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
  color: #273348;
  font-family: "Inter", "Zen Kaku Gothic New", sans-serif;
}

.concept strong {
  font-size: clamp(1.05rem, 1.65cqw, 2.2rem);
}

.concept small,
.concept span {
  font-size: clamp(0.8rem, 1.15cqw, 1.5rem);
}

.identity {
  display: grid;
  width: 80%;
  justify-items: stretch;
  gap: 5cqh;
}

.identity-flow,
.instances {
  display: grid;
  width: 80%;
  align-items: center;
  grid-template-columns: 1.15fr 0.55fr 1.15fr;
  gap: 3cqw;
}

.identity-flow {
  width: 100%;
}

.identity-kicker {
  margin: 0;
  color: var(--deck-blue);
  font-size: clamp(1.55rem, 2.5cqw, 3.1rem);
  font-weight: 800;
  text-align: center;
}

.request-pill {
  padding: 1.4cqh 1.2cqw;
  border: 2px solid #c7d2e6;
  border-radius: 0.7cqw;
  background: #f8faff;
  color: var(--deck-blue);
  font-family: var(--deck-mono);
  font-weight: 700;
}

.identity .request-pill,
.instances .request-pill {
  display: grid;
  min-height: 20cqh;
  place-items: center;
  padding: 2.6cqh 1.8cqw;
  border-radius: 1.2cqw;
  font-size: clamp(1.1rem, 1.7cqw, 2.2rem) !important;
  text-align: center;
}

.route-arrow {
  position: relative;
  height: 3px;
  background: linear-gradient(90deg, #9ba7b8, var(--deck-blue));
}

.route-arrow::after,
.placement-arrow::after {
  position: absolute;
  top: -7px;
  right: -1px;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-left: 12px solid var(--deck-blue);
  content: "";
}

.route-arrow strong {
  position: absolute;
  bottom: 1.2cqh;
  left: 50%;
  color: var(--deck-blue);
  font-family: var(--deck-mono);
  font-size: clamp(0.8rem, 1.05cqw, 1.4rem);
  transform: translateX(-50%);
  white-space: nowrap;
}

.object-card {
  position: relative;
  display: grid;
  min-width: 18cqw;
  min-height: 25cqh;
  align-content: center;
  justify-items: center;
  gap: 1.5cqh;
  padding: 3cqh 2cqw;
  border: 3px solid #ff9b4b;
  border-radius: 2cqw;
  background: linear-gradient(145deg, #fff9f3, #fff);
  box-shadow: 0 1.5cqh 4cqh rgb(203 104 31 / 14%);
  text-align: center;
}

.object-card.compact {
  min-width: 13cqw;
  min-height: 17cqh;
  padding: 2cqh 1.4cqw;
}

.hex {
  display: grid;
  width: 5cqw;
  height: 5cqw;
  place-items: center;
  background: #ff8f35;
  clip-path: polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0 50%);
  color: #fff;
  font-size: clamp(0.85rem, 1.2cqw, 1.6rem) !important;
  font-weight: 900;
}

.separator {
  color: #b0b8c3;
  font-weight: 800;
}

.bridge {
  display: grid;
  width: 93%;
  align-items: center;
  grid-template-columns: 1fr 0.7fr 1.1fr 0.7fr 1fr;
  gap: 1.5cqw;
}

.endpoint {
  display: grid;
  min-height: 20cqh;
  align-content: center;
  justify-items: center;
  gap: 0.8cqh;
  padding: 2cqh 1cqw;
  border: 2px solid #c9d3e0;
  border-radius: 1.4cqw;
  background: #f9fbfe;
  text-align: center;
}

.socket-line {
  position: relative;
  height: 4px;
  background: var(--deck-blue);
}

.socket-line::before,
.socket-line::after {
  position: absolute;
  top: -6px;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  content: "";
}

.socket-line::before {
  left: -1px;
  border-right: 12px solid var(--deck-blue);
}

.socket-line::after {
  right: -1px;
  border-left: 12px solid var(--deck-blue);
}

.socket-line span {
  position: absolute;
  bottom: 1.2cqh;
  left: 50%;
  color: var(--deck-blue);
  font-family: var(--deck-mono);
  transform: translateX(-50%);
}

.live-state {
  display: grid;
  width: 90%;
  align-items: center;
  grid-template-columns: 0.8fr 0.55fr 1.2fr 0.75fr;
  gap: 2.2cqw;
}

.audience {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1cqw;
}

.viewer {
  display: grid;
  width: 5cqw;
  height: 5cqw;
  place-items: center;
  border-radius: 50%;
  background: #eef3ff;
  color: var(--deck-blue);
  font-weight: 800;
}

.socket-bus {
  position: relative;
  height: 5px;
  background: var(--deck-blue);
}

.socket-bus::before,
.socket-bus::after {
  position: absolute;
  top: -5px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--deck-blue);
  content: "";
}

.socket-bus::before {
  left: 0;
}

.socket-bus::after {
  right: 0;
}

.pulse {
  position: absolute;
  top: -0.8cqw;
  left: 25%;
  width: 1.6cqw;
  height: 1.6cqw;
  border: 3px solid #7597e8;
  border-radius: 50%;
  animation: pulse 1.8s infinite;
}

.pulse.delay {
  left: 68%;
  animation-delay: 0.9s;
}

@keyframes pulse {
  0% {
    opacity: 0;
    transform: scale(0.4);
  }
  40% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: scale(1.7);
  }
}

.state {
  min-height: 34cqh;
}

.state-row {
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 1cqw;
  padding-top: 1cqh;
  border-top: 1px solid #f0d4c1;
}

.state-row b {
  color: #2c7b61;
}

.live-dot {
  position: absolute;
  top: 1.5cqh;
  right: 1.2cqw;
  width: 1cqw;
  height: 1cqw;
  border-radius: 50%;
  background: #2fc686;
  box-shadow: 0 0 0 0.45cqw rgb(47 198 134 / 14%);
}

.audio-stream {
  display: flex;
  height: 18cqh;
  align-items: center;
  justify-content: center;
  gap: 0.45cqw;
}

.audio-stream span {
  width: 0.55cqw;
  min-height: 8%;
  border-radius: 1cqw;
  background: linear-gradient(#7aa1ff, var(--deck-blue));
}

.scale {
  display: grid;
  width: 90%;
  grid-template-columns: repeat(3, 1fr);
  gap: 3cqw;
}

.scale-card {
  display: grid;
  justify-items: center;
  gap: 2cqh;
  padding: 2cqh 1cqw;
  border-radius: 1.5cqw;
}

.scale-card.blue {
  background: #eef3ff;
}

.scale-card.orange {
  background: #fff2e7;
}

.scale-card.green {
  background: #e9f8f1;
}

.audience-count {
  color: #566578;
  font-family: var(--deck-mono);
}

.placement {
  display: grid;
  width: 94%;
  align-items: center;
  grid-template-columns: 1.5fr 0.6fr 0.5fr 1fr;
  gap: 2cqw;
}

.world {
  position: relative;
  width: 42cqw;
  height: 32cqh;
  overflow: hidden;
  border-radius: 50%;
  background: linear-gradient(160deg, #edf5ff, #d8e8fa);
  box-shadow: inset 0 0 0 0.3cqw rgb(49 83 164 / 14%);
}

.continent {
  position: absolute;
  background: #a9c3d9;
}

.americas {
  top: 26%;
  left: 14%;
  width: 8cqw;
  height: 18cqh;
  border-radius: 60% 35% 55% 45%;
  transform: rotate(-12deg);
}

.europe {
  top: 25%;
  left: 45%;
  width: 6cqw;
  height: 8cqh;
  border-radius: 50%;
}

.asia {
  top: 23%;
  left: 57%;
  width: 13cqw;
  height: 15cqh;
  border-radius: 40% 65% 45% 55%;
}

.region {
  position: absolute;
  display: grid;
  width: 3.5cqw;
  height: 3.5cqw;
  place-items: center;
  border: 0.3cqw solid white;
  border-radius: 50%;
  background: #8092aa;
  color: white;
  font-size: clamp(0.55rem, 0.75cqw, 0.95rem) !important;
  font-weight: 800;
}

.region.west {
  top: 27%;
  left: 20%;
}

.region.eu {
  top: 18%;
  left: 48%;
}

.region.jp {
  top: 36%;
  left: 72%;
}

.region.active {
  width: auto;
  min-width: 6.4cqw;
  height: 3.8cqw;
  padding: 0 0.85cqw;
  background: var(--deck-orange);
  box-shadow: 0 0 0 0.75cqw rgb(246 130 31 / 20%);
  font-size: clamp(0.72rem, 1cqw, 1.3rem) !important;
}

.first-request {
  display: grid;
  justify-items: center;
  gap: 1.2cqh;
  color: var(--deck-blue);
  text-align: center;
}

.first-request span {
  font-size: clamp(1.05rem, 1.5cqw, 2rem) !important;
}

.first-request strong {
  font-size: clamp(1.7rem, 2.7cqw, 3.5rem);
}

.placement-arrow {
  position: relative;
  height: 3px;
  background: var(--deck-blue);
}

.map-card {
  min-width: 17cqw;
  min-height: 21cqh;
}

.latency {
  display: grid;
  width: 92%;
  align-items: center;
  grid-template-columns: 1.35fr 0.75fr;
  gap: 5cqw;
}

.latency-stage {
  position: relative;
  width: min(46cqw, 62cqh);
  height: min(46cqw, 62cqh);
}

.latency-globe {
  position: absolute;
  inset: 4%;
  overflow: visible;
  border-radius: 50%;
}

.globe-land {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: 50%;
  background: linear-gradient(160deg, #edf5ff, #d8e8fa);
  box-shadow: inset 0 0 0 0.28cqw rgb(49 83 164 / 16%);
}

.land {
  position: absolute;
  background: #a9c3d9;
}

.city-pin {
  position: absolute;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.45cqw;
  color: var(--deck-blue);
  font-weight: 800;
  font-size: clamp(0.85rem, 1.2cqw, 1.55rem) !important;
}

.city-pin i {
  width: 0.85cqw;
  height: 0.85cqw;
  flex-shrink: 0;
  border: 0.18cqw solid #fff;
  border-radius: 50%;
  background: #8092aa;
  box-shadow: 0 0 0 0.12cqw rgb(49 83 164 / 18%);
}

.latency-globe .land.americas {
  top: 28%;
  left: 9%;
  width: 18%;
  height: 42%;
  border-radius: 60% 35% 55% 45%;
  transform: rotate(-12deg);
}

.latency-globe .land.europe {
  top: 22%;
  left: 42%;
  width: 10%;
  height: 13%;
  border-radius: 48% 55% 42% 50%;
}

.latency-globe .land.africa {
  top: 38%;
  left: 43%;
  width: 9%;
  height: 22%;
  border-radius: 45% 50% 40% 55%;
}

.latency-globe .land.asia {
  top: 17%;
  left: 51%;
  width: 20%;
  height: 27%;
  border-radius: 42% 32% 48% 52%;
}

.japan-islands {
  position: absolute;
  top: 29%;
  left: 74%;
  width: 14%;
  height: 27%;
  overflow: visible;
  fill: #a9c3d9;
}

.latency-globe .land.australia {
  top: 60%;
  left: 76%;
  width: 11%;
  height: 13%;
  border-radius: 50% 45% 55% 40%;
}

.city-pin.sf {
  top: 36%;
  left: 12%;
}

.city-pin.paris {
  top: 24%;
  left: 43%;
}

.city-pin.sydney {
  top: 64%;
  left: 78%;
}

.city-pin.tokyo {
  top: 41%;
  left: 77.8%;
  color: var(--deck-orange);
}

.city-pin.tokyo em {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 0.3cqw);
  font-style: normal;
  font-weight: 800;
  white-space: nowrap;
  transform: translateX(-50%);
}

.city-pin.tokyo i {
  background: var(--deck-orange);
  box-shadow: 0 0 0 0.45cqw rgb(246 130 31 / 22%);
}

.globe-do {
  position: absolute;
  z-index: 3;
  right: -10%;
  top: 58%;
  min-width: 11cqw;
}

.latency-meter {
  display: grid;
  gap: 1.6cqh;
}

.latency-meter strong {
  color: var(--deck-blue);
  font-size: clamp(2.1rem, 3.6cqw, 4.6rem);
  line-height: 1;
}

.meter-bar {
  width: 100%;
  height: 1.8cqh;
  margin-top: 0.6cqh;
  border-radius: 2cqw;
  background: linear-gradient(90deg, #31bd82 0 28%, #e9edf3 28%);
}
</style>
