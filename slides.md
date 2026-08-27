---
theme: default
title: Laravel × Durable Objectsで実現するイベント向けライブ翻訳
titleTemplate: "%s — Cloudflare Workers Tech Talks in Tokyo #8"
info: |
  Ryuta Hamasaki
  Cloudflare Workers Tech Talks in Tokyo #8
author: Ryuta Hamasaki
keywords: Laravel, Durable Objects, Cloudflare Workers, WebSocket, live translation
aspectRatio: 16/9
canvasWidth: 1920
transition: fade
mdc: true
layout: default
seoMeta:
  ogTitle: Laravel × Durable Objectsで実現するイベント向けライブ翻訳
  ogDescription: Cloudflare Workers Tech Talks in Tokyo #8。Laravel と Durable Objects で、イベント向けライブ翻訳を作る話。
  ogImage: auto
  ogUrl: https://avosalmon.github.io/cloudflare-workers-tech-talks-tokyo/
  twitterCard: summary_large_image
  twitterTitle: Laravel × Durable Objectsで実現するイベント向けライブ翻訳
  twitterDescription: Cloudflare Workers Tech Talks in Tokyo #8。Laravel と Durable Objects で、イベント向けライブ翻訳を作る話。
  twitterImage: ./og-image.png
  twitterSite: avosalmon
  twitterUrl: https://avosalmon.github.io/cloudflare-workers-tech-talks-tokyo/
---

<!-- 01 -->
<div class="deck-title">
  <h1>Laravel × Durable Objectsで実現する<br>イベント向けライブ翻訳</h1>
  <div class="deck-meta">
    <span>Ryuta Hamasaki</span>
    <span>Cloudflare Workers Tech Talks in Tokyo #8</span>
  </div>
</div>

---

<!-- 02 -->
<div class="profile">
  <div class="profile-copy">
    <h2>Ryuta Hamasaki</h2>
    <p>Senior Software Engineer at Laravel</p>
    <p>@avosalmon</p>
  </div>
  <img class="profile-photo" src="/assets/ryuta-hamasaki.jpg" alt="Ryuta Hamasaki">
</div>

---

<!-- 03 -->
<div class="center-stage logo-stage">
  <img src="/assets/laravel-logo.png" alt="Laravel">
</div>

<!--
Laravelはフレームワーク、エコシステム、会社
APACチーム（Observabilityチーム）
唯一の日本人社員
Laravelエンジニアの自分がなぜ今日ここにいるのか
-->

---
layout: full
class: full live-japan
---

<!-- 04 -->
<img class="full-bleed contain" src="/assets/laravel-live-japan.png" alt="Laravel Live Japan 2026">

<!--
日本初開催のLaravel公式カンファレンス
約600人が参加、40ヶ国以上
参加者の4割、スピーカーの7割が海外
Laravelの作者Taylor Otwell、VoidZero (Cloudflare) など
-->

---
layout: full
class: full
---

<!-- 05 -->
<div class="photo-frame">
  <img class="full-bleed" src="/assets/venue.jpg" alt="Laravel Live Japan venue">
  <img class="corner-logo" src="/assets/tech-world.png" alt="TECH WORLD">
</div>

---
layout: full
class: full
---

<!-- 06 -->
<img class="full-bleed" src="/assets/taylor.jpg" alt="Taylor Otwell at Laravel Live Japan">

---
layout: full
class: full
---

<!-- 07 -->
<img class="full-bleed" src="/assets/live-translation.jpg" alt="Bilingual live translation at Laravel Live Japan">

<!--
日本人外国人関係なく全員が楽しめるイベントにしたかった
ライブ翻訳が必須 → 自分で作った
全てのセッションに日英のライブ翻訳を提供
会場スクリーンや参加者のスマホで見られる
-->

---

<!-- 08 -->
<div class="section-title">
  <h1>今起きたこと</h1>
</div>

---

<!-- 09 -->
<ArchitectureDiagram />

---

<!-- 10 -->
<div class="statement">
  <h1>全部 Laravel で作りたい</h1>
</div>

---

<!-- 11 -->
<div class="feature-slide">
  <h2>Laravel には何でもある</h2>
  <div class="feature-grid">
    <div v-for="feature in [
      'Auth', 'ORM', 'Cache', 'Queue', 'Validation',
      'WebSocket', 'Notification', 'Task Scheduling', 'Billing', 'File Storage',
      'AI SDK', 'Localization', 'Testing', 'Inertia.js', 'Vite Plugin',
    ]" :key="feature" class="feature-chip">{{ feature }}</div>
  </div>
</div>

<!--
Laravelはフレームワークじゃない。エコシステム。
Frontend: Inertia, Vite plugin
-->

---
layout: full
class: full
---

<!-- 12 -->
<img class="full-bleed" src="/assets/laravel-cloud.png" alt="Laravel Cloud">

<!--
Laravel
Database
Cache
File storage
WebSocket
Queue
-->

---

<!-- 13 -->
<ArchitectureDiagram focus="durable" />

<!--
LaravelにはReverbという公式のWebSocketサーバーがあるが、ReverbはLaravelで発生したイベントをチャンネルへ配信するPusher互換サーバー。
YOYOには、複数方向のWebSocketとライブ中の状態を管理するサーバーが必要。
自前でPHPのWebSocketサーバーを作ることもできるけど、インフラどうする？
複数イベントが同時に開催されても問題なく捌けるようにしたい。
世界のどこでイベントが開催されてもレイテンシーを最小にしたい。
-->

---
layout: full
class: full
---

<!-- 14 -->
<img class="full-bleed contain" src="/assets/durable-objects.png" alt="Introducing Durable Objects">

---

<!-- 15 -->
<div class="concept-slide">
  <h2>IDを指定すると、<br>専用のコンピュートと SQLite が付いてくる</h2>
  <DurableConcept kind="identity" />
</div>

---

<!-- 16 -->
<div class="concept-slide">
  <h2>WebSocket サーバーとクライアントの<br>両方になれる <span class="check">✓</span></h2>
  <DurableConcept kind="bridge" />
</div>

---

<!-- 18 -->
<div class="concept-slide">
  <h2>イベントIDごとに固有のインスタンスが<br>立ち上がる <span class="check">✓</span></h2>
  <DurableConcept kind="instances" />
</div>

---

<!-- 19 -->
<div class="concept-slide">
  <h2 class="heading-with-mark">
    <span class="heading-mark">👉</span>
    <span>複数イベントが同時に開催されても<br>問題なくスケールする</span>
  </h2>
  <DurableConcept kind="scale" />
</div>

<!--
状態と実行負荷をイベント単位に分離できる。
同じイベントの接続と処理を1つのインスタンスへ集約。
イベント間で水平にスケール。
-->

---

<!-- 20 -->
<div class="concept-slide">
  <h2>最初のリクエストに近いデータセンターに<br>インスタンスが配置される <span class="check">✓</span></h2>
  <DurableConcept kind="placement" />
</div>

---

<!-- 21 -->
<div class="concept-slide">
  <h2 class="heading-with-mark">
    <span class="heading-mark">👉</span>
    <span>世界のどこでイベントが開催されても<br>レイテンシーを小さくできる</span>
  </h2>
  <DurableConcept kind="latency" />
</div>

---

<!-- 22 -->
<div class="bullet-slide">
  <h2>さらに</h2>
  <ul>
    <li>ローカルで簡単に動かせる（wrangler dev）</li>
    <li>デプロイがめっちゃ簡単（wrangler deploy）</li>
    <li>使っていない間は hibernate する</li>
    <li>インスタンスごとに専用のSQLiteに状態を永続化</li>
  </ul>
</div>

<!--
Outbound WS connectionはhibernateしない。
イベントの休憩中は翻訳APIのWSコネクションを切れば、hibernateする。
-->

---

<!-- 23 -->
<ArchitectureDiagram labels />

<!--
WebSocketサーバー：Cloudflare Workers + DO
その他全てはLaravel（ユーザー管理、認証、イベント管理、メール送信、課金）
Laravelアプリ、Postgres、Cache、ファイルストレージ、Queueなど、Laravel Cloudでホスティング
-->

---
class: dark
---

<!-- 24 -->
<SequenceDiagram kind="admin" />

<!--
Adminのフロー。
LaravelがHTTPで認可し、JWTを渡す。
ブラウザがeventId付きのWSを開く。
最初のメッセージでJWTを送り、DOが検証する。
URLのeventIdとtokenのeventIdが一致しないとリジェクト。
認証前の音声はリジェクト。
-->

---
class: dark code-stage compact
---

<!-- 25 -->

```ts {all|14-15|17}
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const match = url.pathname.match(/^\/events\/([^/]+)$/); // /events/1234567890

    if (!match) {
      return new Response("Not Found", { status: 404 });
    }

    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected WebSocket", { status: 426 });
    }

    const eventId = match[1];
    const stub = env.EVENT_SESSION.getByName(eventId);

    return stub.fetch(request);
  },
} satisfies ExportedHandler<Env>;
```

<!--
WorkerのRouting。
Worker = Routing
DO = WS
ここではadminか一般参加者かは分けていない。
-->

---
class: dark code-stage
---

<!-- 26 -->

```ts {all|6-7}
export class EventSession extends DurableObject<Env> {
  async fetch(request: Request): Promise<Response> {
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    this.ctx.acceptWebSocket(server); // server.accept()
    server.serializeAttachment({ authenticated: false });

    return new Response(null, { status: 101, webSocket: client });
  }

  // ...
}
```

<!--
this.ctx.acceptWebSocket(server); // Hibernation API
標準のWebSocketだと、server.accept()
server.serializeAttachment({ authenticated: false }); // コネクションにメタデータを付与。hibernateしても、起き上がったときに復元できる
-->

---

<!-- 28 -->
<div class="auth-slide">
  <h2>WebSocket 認証</h2>
  <div class="auth-snippet">

```js
// This won’t work in browser 😢
new WebSocket(url, {
  headers: { Authorization: "Bearer ..." },
});
```

  </div>
</div>

<!--
なんでAuthorizationヘッダーでtokenを送らないのか。
ブラウザのWebSocketはカスタムヘッダーを送れない。
サーバーサイドJSだと可能。
-->

---

<!-- 29 -->
<div class="center-stage">
  <div class="auth-table">
    <div class="th">方法</div><div class="th">長所</div><div class="th">短所</div>
    <div>URLのqueryにtoken</div><div class="good">handshake前に<br>401を返せる</div><div class="bad">アクセスログに<br>tokenが残る</div>
    <div>接続後の最初のメッセージで<br>tokenを送る</div><div class="good">ログにtokenが<br>残らない</div><div class="bad">認証前にDOが起動し、<br>WSが開く</div>
  </div>
</div>

---
class: dark code-stage compact
---

<!-- 30 -->

```php
class EventTranslationController
{
    public function start(Event $event): JsonResponse
    {
        // ...

        $token = JWT::encode([
            'event_id' => $event->id,
            'user_id' => auth()->id(),
            'exp' => now()->addHour()->timestamp,
        ], $privateKey, 'RS256');

        return response()->json([
            'websocket_url' => "{$this->workerUrl}/events/{$event->id}",
            'token' => $token,
        ]);
    }
}
```

---
class: dark code-stage compact
---

<!-- 31 -->

```ts
// Admin page

const ws = new WebSocket(websocketUrl);

ws.addEventListener("open", () => {
  ws.send(
    JSON.stringify({
      type: "auth",
      token,
    }),
  );
});

ws.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);

  if (message.status === "authenticated") {
    mediaRecorder.start(250);
  }
});
```

<!--
openの直後にtokenとevent詳細を送る。
音声はDOからのreadyを待ってから送る。
-->

---
class: dark code-stage tight
---

<!-- 34 -->

```ts
export class EventSession extends DurableObject<Env> {
  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    const connection = ws.deserializeAttachment() as { authenticated: boolean };

    if (!connection.authenticated) {
      if (typeof message !== "string") {
        ws.close(4401, "Unauthorized");
        return;
      }

      const data = JSON.parse(message);
      if (data.type !== "auth") {
        ws.close(4401, "Unauthorized");
        return;
      }

      const payload = await verifyJwt(data.token);
      if (!payload || payload.event_id !== this.ctx.id.name) {
        ws.close(4403, "Forbidden");
        return;
      }

      ws.serializeAttachment({ authenticated: true });
      this.connectToTranslationApi(payload.languages);
      ws.send(JSON.stringify({ type: "status", status: "authenticated" }));
      return;
    }

    this.sendAudioToTranslationApi(message);
  }
}
```

<!--
DOのtoken verification
-->

---
class: dark
---

<!-- 35 -->
<SequenceDiagram kind="attendee" />

<!--
参加者のコネクション。
指定した言語。
-->

---

<!-- 36 -->
<ArchitectureDiagram labels focus="api" />

<!--
翻訳APIとのWebSocketコネクション。
DOはここで初めてクライアントになる。
-->

---
class: dark
---

<!-- 37 -->
<SequenceDiagram kind="translations" />

<!--
認証のあと、言語ごとに接続する
-->

---
class: dark
---

<!-- 38 -->
<SequenceDiagram kind="broadcast" />

<!--
同じ音声を翻訳APIの全てのコネクションに転送し、返ってきた翻訳結果をlangが一致する参加者へ配信。
-->

---
class: dark code-stage tight
---

<!-- 39 -->

```ts {23}
export class EventSession extends DurableObject<Env> {
  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    const connection = ws.deserializeAttachment() as { authenticated: boolean };

    if (!connection.authenticated) {
      if (typeof message !== "string") {
        ws.close(4401, "Unauthorized");
        return;
      }

      const data = JSON.parse(message);
      if (data.type !== "auth") {
        ws.close(4401, "Unauthorized");
        return;
      }

      const payload = await verifyJwt(data.token);
      if (!payload || payload.event_id !== this.ctx.id.name) {
        ws.close(4403, "Forbidden");
        return;
      }

      this.connectToTranslationApi(payload.languages);
      ws.send(JSON.stringify({ type: "status", status: "authenticated" }));
      return;
    }

    this.sendAudioToTranslationApi(message);
  }
}
```

---
class: dark code-stage compact
---

<!-- 40 -->

```ts {all|13}
private translationSockets = new Map<string, WebSocket>()

private connectToTranslationApi(languages: string[]) {
  for (const language of languages) {
    const ws = new WebSocket(this.env.TRANSLATION_API_URL)

    ws.addEventListener("open", () => {
      ws.send(JSON.stringify({ type: "config", language }))
      this.translationSockets.set(language, ws)
    })

    ws.addEventListener("message", (event) => {
      this.broadcastToClients(language, event.data)
    })
  }
}
```

<!--
Translation APIのWSコネクション。
outboundのWebSocketはhibernateできないので標準のWebSocket API。
ライブ中はDOが起き続ける。休憩でこの接続を閉じると、参加者の接続は残したままhibernateできる。
-->

---
class: dark code-stage
---

<!-- 41 -->

```ts
private broadcastToClients(language: string, data: string) {
  const payload = JSON.stringify({
    type: "translation",
    language,
    data: JSON.parse(data),
  })

  for (const [ws, metadata] of this.clients) {
    if (metadata.language === language) {
      ws.send(payload)
    }
  }
}
```

<!--
Translation APIからの翻訳結果を配信
-->

---
class: dark code-stage tight
---

<!-- 42 -->

```ts {all|2,12-23|2-10}
export class EventSession extends DurableObject<Env> {
  private clients = new Map<WebSocket, { authenticated: boolean; language?: string }>();

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);

    for (const ws of this.ctx.getWebSockets()) {
      this.clients.set(ws, ws.deserializeAttachment());
    }
  }

  async fetch(request: Request): Promise<Response> {
    const lang = new URL(request.url).searchParams.get("lang") ?? undefined;
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    const state = { authenticated: false, language: lang };

    this.ctx.acceptWebSocket(server);
    server.serializeAttachment(state);
    this.clients.set(server, state);

    return new Response(null, { status: 101, webSocket: client });
  }
}
```

<!--
hibernationから起き上がるときにconstructorが呼ばれる
-->

---

<!-- 45 -->
<div class="bullet-slide">
  <h2>今後やりたいこと</h2>
  <div class="future-list">
    <div class="future-item">
      <span class="future-icon">▤</span>
      <span>翻訳結果をSQLiteに保存</span>
    </div>
    <div class="future-item">
      <span class="future-icon">◖</span>
      <span>音声出力（TTS）</span>
    </div>
  </div>
</div>

<!--
まだDurableじゃない。
途中参加者へ直近の翻訳結果を配信。
イベント終了時にLaravelのPostgresに保存。
-->

---

<!-- 46 -->
<div class="closing">
  <h1>Laravel 🤝 Durable Objects</h1>
</div>

<!--
Railsでも何でも良い。
メインのスタックがCloudflareじゃなくても、リアルタイムな機能とDOは相性が抜群。
-->

---

<!-- 47 -->
<div class="closing">
  <h1 class="url">databaseschool.com</h1>
</div>

<!--
DOについて偉そうに喋っているけど、最初はAIに書かせた。
動いたけど何をやっているのか理解していないし、正しいかどうかの判断もできなかった。
今日登壇することが決まってからちゃんと勉強した。
AIが書いたコードを評価するために、体系的に学ぶことが大事だと再認識。
-->

---

<!-- 48 -->
<div class="closing">
  <h1 class="url">yoyotranslate.app</h1>
</div>

<!--
日本のエンジニアコミュニティは日本に閉じている。
プログラミングに国境なんてない。
日本のエンジニアコミュニティがもっと世界と繋がったらいいなと思う。
Early Accessは無料。
-->
