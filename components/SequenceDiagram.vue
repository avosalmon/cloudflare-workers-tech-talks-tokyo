<script setup>
defineProps({
  kind: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="sequence">
    <template v-if="kind === 'admin'">
      <div class="actors four">
        <div>Admin</div>
        <div>Laravel</div>
        <div>Worker</div>
        <div>Durable Object</div>
      </div>
      <div class="lanes four">
        <div style="--end: 8"></div>
        <div style="--end: 3"></div>
        <div style="--end: 5"></div>
        <div style="--end: 8"></div>
      </div>
      <div class="messages four">
        <div class="message c1-c2 row1 right">
          <b>POST</b> /translation/start
        </div>
        <div class="message c2-c1 row2 left">{ url, token }</div>
        <div class="message c1-c3 row3 right"><b>WS</b> /events/{eventId}</div>
        <div class="message c3-c4 row4 right"><em>getByName</em>(eventId)</div>
        <div class="note c4 row4-note">未認証</div>
        <div class="message c1-c4 row5 right">
          { type: <mark>"auth"</mark>, token }
        </div>
        <div class="note c4 row5-note">署名・期限・event_id を検証</div>
        <div class="message c4-c1 row6 left">
          { type: <mark>"status"</mark>, status: <mark>"authenticated"</mark> }
        </div>
        <div class="message c1-c4 row7 right">
          binary audio <span class="accent">•••</span>
        </div>
      </div>
    </template>

    <template v-else-if="kind === 'attendee'">
      <div class="actors four">
        <div>Attendee</div>
        <div>Laravel</div>
        <div>Worker</div>
        <div>Durable Object</div>
      </div>
      <div class="lanes four">
        <div style="--end: 7"></div>
        <div style="--end: 3"></div>
        <div style="--end: 5"></div>
        <div style="--end: 7"></div>
      </div>
      <div class="messages four">
        <div class="message c1-c2 row1 right"><b>GET</b> /events/{id}/live</div>
        <div class="message c2-c1 row2 left">{ websocket_url }</div>
        <div class="message c1-c3 row3 right">
          <b>WS</b> /events/{eventId}?lang=<mark>ja</mark>
        </div>
        <div class="message c3-c4 row4 right"><em>getByName</em>(eventId)</div>
        <div class="note c4 row4-note">未認証のまま = attendee</div>
        <div class="message c4-c1 row6 left">
          { type: <mark>"translation"</mark>, data }
        </div>
      </div>
    </template>

    <template v-else-if="kind === 'translations'">
      <div class="actors three">
        <div>Admin</div>
        <div>Durable Object</div>
        <div>Translation API</div>
      </div>
      <div class="lanes three">
        <div style="--end: 8"></div>
        <div style="--end: 8"></div>
        <div style="--end: 8"></div>
      </div>
      <div class="messages three">
        <div class="message c2-c1 row1 left">
          { status: <mark>"authenticated"</mark> }
        </div>
        <div class="message c2-c3 row3 right"><b>WS</b> target: ja</div>
        <div class="message c2-c3 row4 right">
          { language: <mark>"ja"</mark>, ... }
        </div>
        <div class="message c2-c3 row6 right"><b>WS</b> target: en</div>
        <div class="message c2-c3 row7 right">
          { language: <mark>"en"</mark>, ... }
        </div>
      </div>
    </template>

    <template v-else-if="kind === 'broadcast'">
      <div class="actors four">
        <div>Admin</div>
        <div>Durable Object</div>
        <div>Translation API</div>
        <div>Attendee</div>
      </div>
      <div class="lanes four">
        <div style="--end: 8"></div>
        <div style="--end: 8"></div>
        <div style="--end: 4"></div>
        <div style="--end: 8"></div>
      </div>
      <div class="messages four">
        <div class="message c1-c2 row1 right">binary audio</div>
        <div class="message c2-c3 row2 right">binary audio × N</div>
        <div class="message c3-c2 row3 left">
          { language: <mark>"ja"</mark>, data:
          <mark>"translated text..."</mark> }
        </div>
        <div class="message c2-c4 row5 right">
          { language: <mark>"ja"</mark>, data:
          <mark>"translated text..."</mark> }
        </div>
        <div class="note c4 row5-note">?lang=ja</div>
        <div class="callout row6">en の結果は ja 選択者には送らない</div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.sequence {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 74cqh;
  color: #d3ddea;
  font-family: var(--deck-mono);
}

.actors {
  position: absolute;
  z-index: 3;
  top: 2%;
  left: 5%;
  display: grid;
  width: 90%;
  text-align: center;
}

.actors.four,
.messages.four,
.lanes.four {
  grid-template-columns: repeat(4, 1fr);
}

.actors.three,
.messages.three,
.lanes.three {
  grid-template-columns: repeat(3, 1fr);
}

.actors div {
  color: #d8e1ec;
  font-size: clamp(0.95rem, 1.45cqw, 1.9rem);
  font-weight: 700;
}

.lanes,
.messages {
  position: absolute;
  top: 8%;
  bottom: 7%;
  left: 5%;
  display: grid;
  width: 90%;
  grid-template-rows: repeat(8, 1fr);
}

.lanes {
  z-index: 0;
}

.lanes > div {
  grid-column: var(--col, auto);
  grid-row: var(--start, 1) / var(--end, 9);
  justify-self: center;
  width: 1px;
  background: rgb(186 202 220 / 28%);
}

.messages {
  z-index: 2;
}

.message {
  --span: 2;
  position: relative;
  align-self: center;
  margin-inline: calc(50% / var(--span));
  padding: 0 1.8cqw 0.8cqh;
  border-bottom: 1.5px solid rgb(184 198 214 / 55%);
  font-size: clamp(0.72rem, 1.12cqw, 1.46rem);
  white-space: nowrap;
}

.message::after {
  position: absolute;
  right: -1px;
  bottom: -7px;
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
  border-left: 11px solid #c792ea;
  content: "";
}

.message.left::after {
  right: auto;
  left: -1px;
  border-right: 11px solid #c792ea;
  border-left: 0;
}

.message b,
.message em {
  color: #82aaff;
  font-style: italic;
}

.message mark {
  padding: 0;
  background: transparent;
  color: var(--deck-yellow);
}

.accent {
  color: var(--deck-cyan);
  letter-spacing: 0.28em;
}

.note {
  align-self: center;
  padding-left: calc(50% + 1cqw);
  color: #c9d2dd;
  font-family: "Zen Kaku Gothic New", var(--deck-mono);
  font-size: clamp(0.68rem, 0.96cqw, 1.25rem);
}

.callout {
  --span: 3;
  grid-column: 2 / 5;
  align-self: start;
  margin-top: 1.2cqh;
  margin-left: calc(50% / var(--span) + 1.8cqw);
  padding: 0.4cqh 1cqw 0.2cqh;
  border-left: 0.35cqw solid var(--deck-violet);
  color: #cbd5e2;
  font-family: "Zen Kaku Gothic New", sans-serif;
  font-size: clamp(0.72rem, 1.06cqw, 1.4rem);
}

.c1-c2 {
  grid-column: 1 / 3;
}
.c2-c1 {
  grid-column: 1 / 3;
}
.c1-c3 {
  --span: 3;
  grid-column: 1 / 4;
}
.c3-c4 {
  grid-column: 3 / 5;
}
.c1-c4,
.c4-c1 {
  --span: 4;
  grid-column: 1 / 5;
}
.c2-c3,
.c3-c2 {
  grid-column: 2 / 4;
}
.c2-c4 {
  --span: 3;
  grid-column: 2 / 5;
}
.c4 {
  grid-column: 4;
}
.c2 {
  grid-column: 2;
}

.row1 {
  grid-row: 1;
}
.row2 {
  grid-row: 2;
}
.row3 {
  grid-row: 3;
}
.row4,
.row4-note {
  grid-row: 4;
}
.row5,
.row5-note {
  grid-row: 5;
}
.row6 {
  grid-row: 6;
}
.row7 {
  grid-row: 7;
}
</style>
