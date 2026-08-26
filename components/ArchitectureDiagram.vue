<script setup>
const props = defineProps({
  focus: {
    type: String,
    default: "",
  },
  labels: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="architecture" :class="{ 'has-labels': labels }">
    <div class="top-flow">
      <span class="flow-caption">Start translation</span>
      <span class="flow-line"></span>
      <div class="node web" :class="{ focused: focus === 'web' }">
        <span v-if="labels" class="stack-label laravel"
          >Laravel / Inertia / React</span
        >
        <span class="node-icon">L</span>
        <strong>Web App</strong>
      </div>
      <span class="mini-arrow"></span>
      <div class="database">
        <span class="db-disc"></span>
        <span class="db-disc"></span>
        <span class="db-disc"></span>
        <small>Postgres</small>
      </div>
    </div>

    <div class="main-flow">
      <div class="microphone" aria-label="Microphone">
        <span class="mic-head"></span>
        <span class="mic-stand"></span>
      </div>
      <div class="arrow one-way"><span>Audio</span></div>
      <div class="laptop" aria-label="Admin laptop">
        <span class="screen"></span>
        <span class="base"></span>
      </div>
      <div class="duplex">
        <div class="arrow right"><span>Audio</span></div>
        <div class="arrow left"><span>Translation</span></div>
      </div>
      <div class="node durable" :class="{ focused: focus === 'durable' }">
        <span v-if="labels" class="stack-label worker"
          >Cloudflare Workers + DO</span
        >
        <span class="node-icon">DO</span>
        <strong>WebSocket Server</strong>
      </div>
      <div class="duplex">
        <div class="arrow right"><span>Audio</span></div>
        <div class="arrow left"><span>Translation</span></div>
      </div>
      <div class="node api" :class="{ focused: focus === 'api' }">
        <span class="node-icon">AI</span>
        <strong>Translation API</strong>
      </div>
    </div>

    <div class="client-flow">
      <span class="socket-label">WebSocket</span>
      <span class="client-trunk"></span>
      <div class="phones">
        <div class="phone">
          <span class="phone-screen">あ</span>
          <small>Japanese</small>
        </div>
        <div class="phone">
          <span class="phone-screen">中</span>
          <small>Chinese</small>
        </div>
        <div class="phone">
          <span class="phone-screen">한</span>
          <small>Korean</small>
        </div>
      </div>
    </div>

    <div class="token-flow">
      <span class="token-line"></span>
      <span>WebSocket URL + token</span>
    </div>
  </div>
</template>

<style scoped>
.architecture {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 62cqh;
  color: #3b4553;
  font-family: "Inter", sans-serif;
}

.architecture strong,
.architecture small,
.architecture span {
  font-size: clamp(0.7rem, 1.05cqw, 1.35rem);
}

.top-flow {
  position: absolute;
  top: 2%;
  left: 24%;
  display: flex;
  width: 53%;
  height: 22%;
  align-items: center;
  gap: 1.2cqw;
}

.flow-caption {
  position: absolute;
  top: 1%;
  left: 12%;
  color: #5e6978;
}

.flow-line {
  width: 27%;
  height: 2px;
  background: #8b97a6;
}

.flow-line::after,
.mini-arrow::after {
  display: block;
  width: 0;
  height: 0;
  margin-top: -5px;
  margin-left: auto;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 9px solid #8b97a6;
  content: "";
}

.node {
  position: relative;
  display: grid;
  min-width: 15cqw;
  height: 11cqh;
  align-items: center;
  padding: 1.2cqh 1.3cqw;
  border: 2px solid #cad2dd;
  border-radius: 0.8cqw;
  background: rgb(255 255 255 / 92%);
  grid-template-columns: auto 1fr;
  gap: 0.8cqw;
  text-align: center;
}

.node.focused {
  border-color: var(--deck-red);
  background: #fff0f2;
  box-shadow: 0 0 0 0.45cqw rgb(239 83 100 / 12%);
}

.node-icon {
  display: grid;
  width: 3.2cqw;
  height: 3.2cqw;
  place-items: center;
  border-radius: 0.7cqw;
  background: #edf2ff;
  color: var(--deck-blue);
  font-size: clamp(0.65rem, 0.88cqw, 1.1rem) !important;
  font-weight: 800;
}

.durable .node-icon {
  background: #fff1e8;
  color: var(--deck-orange);
}

.api .node-icon {
  background: #e8faf4;
  color: #188564;
}

.stack-label {
  position: absolute;
  top: -3.3cqh;
  left: 0;
  width: 100%;
  color: var(--deck-red);
  font-size: clamp(0.62rem, 0.9cqw, 1.15rem) !important;
  font-weight: 700;
  white-space: nowrap;
}

.mini-arrow {
  width: 3.5cqw;
  height: 2px;
  background: #8b97a6;
}

.database {
  position: relative;
  display: flex;
  width: 6cqw;
  height: 9cqh;
  flex-direction: column;
  justify-content: center;
}

.db-disc {
  display: block;
  width: 4.5cqw;
  height: 2.4cqh;
  margin-top: -0.35cqh;
  border-radius: 50%;
  background: #555;
  box-shadow: inset 0 -0.45cqh 0 #333;
}

.database small {
  position: absolute;
  top: 100%;
  left: -0.4cqw;
}

.main-flow {
  position: absolute;
  top: 34%;
  left: 1%;
  display: grid;
  width: 98%;
  align-items: center;
  grid-template-columns: 5.5cqw 10cqw 7cqw 19cqw 17cqw 19cqw 17cqw;
}

.microphone {
  position: relative;
  width: 5cqw;
  height: 9cqh;
}

.mic-head {
  position: absolute;
  top: 0;
  left: 1.45cqw;
  width: 2.2cqw;
  height: 5.4cqh;
  border-radius: 2cqw;
  background: #969da5;
}

.mic-stand {
  position: absolute;
  top: 5cqh;
  left: 0.8cqw;
  width: 3.5cqw;
  height: 2.5cqh;
  border-bottom: 0.35cqh solid #696f77;
  border-left: 0.2cqw solid #696f77;
  border-right: 0.2cqw solid #696f77;
  border-radius: 0 0 2cqw 2cqw;
}

.mic-stand::after {
  position: absolute;
  top: 2.5cqh;
  left: 1.5cqw;
  width: 0.2cqw;
  height: 2cqh;
  background: #696f77;
  content: "";
}

.laptop {
  position: relative;
  width: 6.5cqw;
  height: 8.5cqh;
}

.screen {
  position: absolute;
  left: 0.6cqw;
  width: 5.3cqw;
  height: 6.7cqh;
  border: 0.4cqw solid #535961;
  border-radius: 0.5cqw;
  background: #59a8d9;
}

.base {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 6.5cqw;
  height: 1.1cqh;
  background: #cdd1d6;
  clip-path: polygon(10% 0, 90% 0, 100% 100%, 0 100%);
}

.arrow {
  position: relative;
  height: 2px;
  background: #8894a3;
}

.arrow span {
  position: absolute;
  bottom: 0.75cqh;
  left: 50%;
  padding: 0 0.3cqw;
  background: rgb(255 255 255 / 94%);
  transform: translateX(-50%);
  white-space: nowrap;
}

.arrow::after {
  position: absolute;
  top: -5px;
  right: -1px;
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 9px solid #8894a3;
  content: "";
}

.arrow.left::after {
  right: auto;
  left: -1px;
  border-right: 9px solid #8894a3;
  border-left: 0;
}

.duplex {
  display: grid;
  gap: 2.4cqh;
}

.client-flow {
  position: absolute;
  top: 57%;
  left: 41%;
  width: 30%;
  height: 39%;
}

.socket-label {
  position: absolute;
  top: 0;
  left: 34%;
  padding: 0.45cqh 0.7cqw;
  border: 1px solid #cad2dd;
  border-radius: 0.4cqw;
  background: #fff;
}

.client-trunk {
  position: absolute;
  top: 6cqh;
  left: 49%;
  width: 2px;
  height: 8cqh;
  background: #8793a3;
}

.client-trunk::after {
  position: absolute;
  top: 7.7cqh;
  left: -10.5cqw;
  width: 21cqw;
  height: 5cqh;
  border-top: 2px solid #8793a3;
  border-right: 2px solid #8793a3;
  border-left: 2px solid #8793a3;
  border-radius: 1.2cqw 1.2cqw 0 0;
  content: "";
}

.phones {
  position: absolute;
  top: 18cqh;
  left: -1cqw;
  display: flex;
  width: 31cqw;
  justify-content: space-between;
}

.phone {
  display: grid;
  gap: 1cqh;
  text-align: center;
}

.phone-screen {
  display: grid;
  width: 4.1cqw;
  height: 8.8cqh;
  place-items: center;
  border: 0.55cqw solid #4c5259;
  border-radius: 0.65cqw;
  background: #58a8d8;
  color: white;
  font-family: "Zen Kaku Gothic New", sans-serif;
  font-weight: 800;
}

.token-flow {
  position: absolute;
  top: 25%;
  left: 24%;
  display: flex;
  width: 29%;
  align-items: center;
  gap: 0.8cqw;
  color: #536170;
}

.token-line {
  width: 8cqw;
  height: 2px;
  background: #8894a3;
}
</style>
