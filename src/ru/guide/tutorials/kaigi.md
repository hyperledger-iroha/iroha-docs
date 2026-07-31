---
translation_locale: ru
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: e55c7aebc89c39edb8e7077db2414a6d432aafb05aff8df04c248fce444d7dea
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Встроенные Kaigi в а JavaScript Приложение {#embed-kaigi-in-a-javascript-app}

Kaigi позволяет приложению создавать аудио-видео встречи один на один, поддерживаемые кошельком
чьи жизненные циклы записываются через Iroha. Браузер по-прежнему обрабатывает СМИ с
WebRTC, в то время как Torii и Kaigi инструкции обеспечивают длительную встречу
запись, зашифрованные метаданные сигнализации, поддержка частного списка и события использования.

В этом руководстве показана минимальная интеграционная схема, используемая
[Iroha Демо JavaScript](https://github.com/soramitsu/iroha-demo-javascript)
приложение:

- рендер создает WebRTC предложения и ответы
- подписывает заявку и представляет Kaigi транзакции
- компактные ссылки приглашения несут только вызов ID и пригласить в тайну
- Ведущий смотрит Torii для зашифрованных ответов участников

Примеры используют TypeScript и написаны так, чтобы они могли работать в электронном
браузер с безопасным бэк-эндетом или веб-приложение с расширением кошелька.
частные ключи, находящиеся за пределами ненадежного кода рендера в производстве.

## Предусмотренные условия {#prerequisites}

Вам нужно:

- а) Kaigi- способный Torii конечная точка
- счет хозяина и счет гостя
- доступ к ключу подписи каждого аккаунта через безопасный мост или кошелек
- разрешения на камеру браузера/микрофон
- Node.js 20+ если вы используете JavaScript демо или родной
  `@iroha/iroha-js` непосредственное связывание

Для полного справочника работы клонируйте демо рядом с Iroha источник
расчетный счет:

```bash
mkdir iroha-wallet-workspace
cd iroha-wallet-workspace
git clone https://github.com/hyperledger-iroha/iroha.git
git clone https://github.com/soramitsu/iroha-demo-javascript.git

cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist

cd ../../../iroha-demo-javascript
npm install
npm run dev
```

Используйте демо с
[`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js)
от брата Iroha Источник хранилища. `file:` зависимость решает, что
Если коренная связь изменится, восстановить ее в соответствии с
`iroha/javascript/iroha_js`; чистый каталог упаковки не содержит:
Рабочее пространство для грузов, необходимое для `npm run build:native`.

Прежде чем провести живую встречу на TAIRA, проверять общественность Torii поверхности, что
демо зависит от:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/v1/kaigi/relays"
curl -fsS "$TAIRA/v1/kaigi/relays/health"
```

Эти команды подтверждают , что TAIRA живая и что Kaigi телеметрия реле
Они не представляют Kaigi - Реальная сделка. `CreateKaigi` или
`JoinKaigi` потребности в финансировании испытаний TAIRA счета и подпись через демо
мостик или другой мост с кошелькой.

## Архитектура {#architecture}

Держи Kaigi интеграция разделена на три уровня:

| Слой | Ответственность |
| --- | --- |
| UI | выбор учетной записи, форма встречи, отображение ссылки приглашения, управление средствами массовой информации |
| WebRTC | `RTCPeerConnection`, местные СМИ, описания предложений и ответов |
| Iroha мостик | подпись, `CreateKaigi`, `JoinKaigi`, `EndKaigi`, сигнальные опросы |

Мост приложения может быть электронным предзагрузкой API, расширение кошелька или задний план
Он должен выявлять небольшую поверхность для UI:

```ts
type KaigiMeetingPrivacy = "private" | "transparent";
type KaigiPeerIdentityReveal = "Hidden" | "RevealAfterJoin";

type KaigiSignalKeyPair = {
  publicKeyBase64Url: string;
  privateKeyBase64Url: string;
};

type KaigiDescription = {
  type: "offer" | "answer";
  sdp: string;
};

type KaigiMeeting = {
  callId: string;
  meetingCode: string;
  title?: string;
  hostAccountId?: string;
  hostDisplayName?: string;
  hostParticipantId?: string;
  hostKaigiPublicKeyBase64Url: string;
  scheduledStartMs: number;
  expiresAtMs: number;
  live: boolean;
  ended: boolean;
  privacyMode: KaigiMeetingPrivacy;
  peerIdentityReveal: KaigiPeerIdentityReveal;
  rosterRootHex: string;
  offerDescription: { type: "offer"; sdp: string };
};

type KaigiSignal = {
  entrypointHash: string;
  callId: string;
  participantId: string;
  participantName: string;
  createdAtMs: number;
  answerDescription: { type: "answer"; sdp: string };
};

type KaigiBridge = {
  generateKaigiSignalKeyPair(): KaigiSignalKeyPair;

  createKaigiMeeting(input: {
    toriiUrl: string;
    chainId: string;
    hostAccountId: string;
    callId: string;
    title?: string;
    scheduledStartMs: number;
    meetingCode: string;
    inviteSecretBase64Url: string;
    hostDisplayName: string;
    hostParticipantId: string;
    hostKaigiPublicKeyBase64Url: string;
    offerDescription: { type: "offer"; sdp: string };
    privacyMode: KaigiMeetingPrivacy;
    peerIdentityReveal: KaigiPeerIdentityReveal;
  }): Promise<{ hash: string }>;

  getKaigiCall(input: {
    toriiUrl: string;
    callId: string;
    inviteSecretBase64Url: string;
  }): Promise<KaigiMeeting>;

  joinKaigiMeeting(input: {
    toriiUrl: string;
    chainId: string;
    participantAccountId: string;
    callId: string;
    hostAccountId?: string;
    hostKaigiPublicKeyBase64Url: string;
    participantId: string;
    participantName: string;
    walletIdentity?: string;
    roomId: string;
    privacyMode: KaigiMeetingPrivacy;
    rosterRootHex: string;
    answerDescription: { type: "answer"; sdp: string };
  }): Promise<{ hash: string }>;

  pollKaigiMeetingSignals(input: {
    toriiUrl: string;
    accountId: string;
    callId: string;
    hostKaigiKeys: KaigiSignalKeyPair;
    afterTimestampMs?: number;
  }): Promise<KaigiSignal[]>;

  watchKaigiCallEvents(
    input: { toriiUrl: string; callId: string },
    onEvent: (event: { kind: string; callId: string }) => void | Promise<void>,
  ): Promise<string>;

  endKaigiMeeting(input: {
    toriiUrl: string;
    chainId: string;
    hostAccountId: string;
    callId: string;
    endedAtMs?: number;
  }): Promise<{ hash: string }>;
};
```

В демо-приложении эти методы моста реализуются с помощью
`@iroha/iroha-js`, локальная подпись, зашифрованная Kaigi метаданные и Torii Позвони.

## Пригласите помощников {#invite-helpers}

Использование Torii- Совместимый звонок IDs в `domain.dataspace:meeting` Форма демонстрации
использование `kaigi.universal:<call-name>` для создаваемых встреч.

```ts
const KAIGI_WINDOW_MS = 24 * 60 * 60 * 1000;

const base64Url = (bytes: Uint8Array): string =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

export function createInviteSecret(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return base64Url(bytes);
}

export function createMeetingCode(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return base64Url(bytes).toLowerCase();
}

export function buildKaigiCallId(domain: string, meetingCode: string): string {
  const qualifiedDomain = domain.includes(".") ? domain : `${domain}.universal`;
  const safeCode = meetingCode
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${qualifiedDomain}:kaigi-${safeCode || "meeting"}`;
}

export function buildInviteLink(input: {
  callId: string;
  inviteSecretBase64Url: string;
}): string {
  const call = encodeURIComponent(input.callId);
  const secret = encodeURIComponent(input.inviteSecretBase64Url);
  return `iroha://kaigi/join?call=${call}&secret=${secret}`;
}

export function parseInviteLink(link: string): {
  callId: string;
  inviteSecretBase64Url: string;
} {
  const url = new URL(link);
  const callId = url.searchParams.get("call")?.trim();
  const inviteSecretBase64Url = url.searchParams.get("secret")?.trim();
  if (!callId || !inviteSecretBase64Url) {
    throw new Error("Kaigi invite link is missing call or secret.");
  }
  return { callId, inviteSecretBase64Url };
}
```

## WebRTC Помощники {#webrtc-helpers}

Хозяин создает предложение, хранит его через `CreateKaigi`, и сохраняет
Открыто окно, чтобы он мог применить ответ гостя.
предлагает, создает ответ и сообщает, что ответ с `JoinKaigi`.

```ts
const rtcConfig: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export async function openLocalMedia(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({
    audio: true,
    video: {
      width: { ideal: 1280 },
      height: { ideal: 720 },
      frameRate: { ideal: 24, max: 30 },
    },
  });
}

export function createPeer(localStream: MediaStream): RTCPeerConnection {
  const peer = new RTCPeerConnection(rtcConfig);
  for (const track of localStream.getTracks()) {
    peer.addTrack(track, localStream);
  }
  return peer;
}

async function waitForIceGathering(peer: RTCPeerConnection): Promise<void> {
  if (peer.iceGatheringState === "complete") {
    return;
  }
  await new Promise<void>((resolve) => {
    const done = () => {
      if (peer.iceGatheringState === "complete") {
        peer.removeEventListener("icegatheringstatechange", done);
        resolve();
      }
    };
    peer.addEventListener("icegatheringstatechange", done);
  });
}

export async function createOfferDescription(
  peer: RTCPeerConnection,
): Promise<{ type: "offer"; sdp: string }> {
  const offer = await peer.createOffer();
  await peer.setLocalDescription(offer);
  await waitForIceGathering(peer);
  const local = peer.localDescription;
  if (!local?.sdp || local.type !== "offer") {
    throw new Error("WebRTC offer was not created.");
  }
  return { type: "offer", sdp: local.sdp };
}

export async function createAnswerDescription(
  peer: RTCPeerConnection,
  offer: { type: "offer"; sdp: string },
): Promise<{ type: "answer"; sdp: string }> {
  await peer.setRemoteDescription(offer);
  const answer = await peer.createAnswer();
  await peer.setLocalDescription(answer);
  await waitForIceGathering(peer);
  const local = peer.localDescription;
  if (!local?.sdp || local.type !== "answer") {
    throw new Error("WebRTC answer was not created.");
  }
  return { type: "answer", sdp: local.sdp };
}
```

Присоедините потоки к своему UI с обычными элементами видео:

```ts
export function attachKaigiMedia(input: {
  peer: RTCPeerConnection;
  localStream: MediaStream;
  localVideo: HTMLVideoElement;
  remoteVideo: HTMLVideoElement;
}): void {
  input.localVideo.srcObject = input.localStream;

  const remoteStream = new MediaStream();
  input.remoteVideo.srcObject = remoteStream;

  input.peer.addEventListener("track", (event) => {
    if (event.streams[0]) {
      input.remoteVideo.srcObject = event.streams[0];
      return;
    }
    remoteStream.addTrack(event.track);
  });
}
```

## Ведущий: Создайте ссылку на встречу {#host-create-a-meeting-link}

Поток хозяина:

1. открытая камера и микрофон
2. создать Kaigi пара сигнальных ключей
3. создать WebRTC предложение
4. подать `CreateKaigi`
5. Поделиться компактной ссылкой на приглашение

```ts
type AccountContext = {
  accountId: string;
  displayName: string;
};

type KaigiContext = {
  bridge: KaigiBridge;
  toriiUrl: string;
  chainId: string;
};

export async function hostKaigiMeeting(input: {
  context: KaigiContext;
  account: AccountContext;
  title?: string;
  privacyMode?: KaigiMeetingPrivacy;
}): Promise<{
  callId: string;
  inviteLink: string;
  peer: RTCPeerConnection;
  localStream: MediaStream;
  hostKaigiKeys: KaigiSignalKeyPair;
  createdAtMs: number;
}> {
  const { bridge, toriiUrl, chainId } = input.context;
  const privacyMode = input.privacyMode ?? "private";
  const scheduledStartMs = Date.now();
  const meetingCode = createMeetingCode();
  const callId = buildKaigiCallId("kaigi", meetingCode);
  const inviteSecretBase64Url = createInviteSecret();
  const hostKaigiKeys = bridge.generateKaigiSignalKeyPair();

  const localStream = await openLocalMedia();
  const peer = createPeer(localStream);
  const offerDescription = await createOfferDescription(peer);

  await bridge.createKaigiMeeting({
    toriiUrl,
    chainId,
    hostAccountId: input.account.accountId,
    callId,
    title: input.title,
    scheduledStartMs,
    meetingCode,
    inviteSecretBase64Url,
    hostDisplayName: input.account.displayName,
    hostParticipantId: "host",
    hostKaigiPublicKeyBase64Url: hostKaigiKeys.publicKeyBase64Url,
    offerDescription,
    privacyMode,
    peerIdentityReveal: "Hidden",
  });

  return {
    callId,
    inviteLink: buildInviteLink({ callId, inviteSecretBase64Url }),
    peer,
    localStream,
    hostKaigiKeys,
    createdAtMs: scheduledStartMs,
  };
}
```

Показать `inviteLink` в вашем UI. Пользователь может скопировать его, открыть в другом кошельке.
или преобразовать его в маршрут приложения, например:

```ts
export function inviteRoute(inviteLink: string): string {
  const invite = parseInviteLink(inviteLink);
  return `/kaigi?call=${encodeURIComponent(invite.callId)}&secret=${encodeURIComponent(
    invite.inviteSecretBase64Url,
  )}`;
}
```

## Гость: Присоединяйтесь к встрече {#guest-join-a-meeting}

Поток гостей:

1. проанализировать приглашение
2. Попробуйте получить зашифрованный звонок от Torii
3. создать WebRTC Ответ
4. подать `JoinKaigi` с зашифрованными метаданными ответа

```ts
export async function joinKaigiMeetingFromInvite(input: {
  context: KaigiContext;
  account: AccountContext;
  inviteLink: string;
}): Promise<{
  callId: string;
  peer: RTCPeerConnection;
  localStream: MediaStream;
}> {
  const { bridge, toriiUrl, chainId } = input.context;
  const { callId, inviteSecretBase64Url } = parseInviteLink(input.inviteLink);

  const meeting = await bridge.getKaigiCall({
    toriiUrl,
    callId,
    inviteSecretBase64Url,
  });

  if (meeting.ended) {
    throw new Error("This Kaigi meeting has already ended.");
  }
  if (Date.now() > meeting.expiresAtMs) {
    throw new Error("This Kaigi invite has expired.");
  }

  const localStream = await openLocalMedia();
  const peer = createPeer(localStream);
  const answerDescription = await createAnswerDescription(
    peer,
    meeting.offerDescription,
  );

  await bridge.joinKaigiMeeting({
    toriiUrl,
    chainId,
    participantAccountId: input.account.accountId,
    callId: meeting.callId,
    hostAccountId: meeting.hostAccountId,
    hostKaigiPublicKeyBase64Url: meeting.hostKaigiPublicKeyBase64Url,
    participantId: "guest",
    participantName: input.account.displayName,
    roomId: meeting.callId,
    privacyMode: meeting.privacyMode,
    rosterRootHex: meeting.rosterRootHex,
    answerDescription,
  });

  return { callId: meeting.callId, peer, localStream };
}
```

Если встреча прозрачна, вы можете включить строку отображения кошелька в
Для частных встреч, держите `walletIdentity` не устанавливается , если пользователь
явно выбирает раскрыть это.

## Ведущий: Используйте ответ гостя {#host-apply-the-guest-answer}

После создания живой встречи хозяин должен смотреть Kaigi события и опросы для
Зашифрованные сигналы ответа. Применить первый действительный ответ к коллегам хоста
связь.

```ts
export async function watchForKaigiAnswer(input: {
  context: KaigiContext;
  hostAccountId: string;
  callId: string;
  hostKaigiKeys: KaigiSignalKeyPair;
  createdAtMs: number;
  peer: RTCPeerConnection;
  onParticipant?: (signal: KaigiSignal) => void;
}): Promise<string | null> {
  const { bridge, toriiUrl } = input.context;
  const seenSignals = new Set<string>();
  let lastSignalAtMs = input.createdAtMs;

  const checkSignals = async (): Promise<boolean> => {
    const signals = await bridge.pollKaigiMeetingSignals({
      toriiUrl,
      accountId: input.hostAccountId,
      callId: input.callId,
      hostKaigiKeys: input.hostKaigiKeys,
      afterTimestampMs: lastSignalAtMs,
    });

    const next = signals.find(
      (signal) => !seenSignals.has(signal.entrypointHash),
    );
    if (!next) {
      return false;
    }

    seenSignals.add(next.entrypointHash);
    lastSignalAtMs = Math.max(lastSignalAtMs, next.createdAtMs);
    await input.peer.setRemoteDescription(next.answerDescription);
    input.onParticipant?.(next);
    return true;
  };

  if (await checkSignals()) {
    return null;
  }

  return bridge.watchKaigiCallEvents(
    { toriiUrl, callId: input.callId },
    async (event) => {
      if (event.kind !== "ended") {
        await checkSignals();
      }
    },
  );
}
```

Сохранить возвращенную подписку ID так что ваша UI может остановить наблюдателя, когда
хозяин повесится или уедет.

## Завершение встречи {#end-the-meeting}

Завершить звонок с той же учетной записи хоста , которая создала его:

```ts
export async function endKaigi(input: {
  context: KaigiContext;
  hostAccountId: string;
  callId: string;
  peer?: RTCPeerConnection;
  localStream?: MediaStream;
}): Promise<void> {
  input.peer?.close();
  input.localStream?.getTracks().forEach((track) => track.stop());

  await input.context.bridge.endKaigiMeeting({
    toriiUrl: input.context.toriiUrl,
    chainId: input.context.chainId,
    hostAccountId: input.hostAccountId,
    callId: input.callId,
    endedAtMs: Date.now(),
  });
}
```

## Финансирование в частном режиме {#private-mode-funding}

Частный Kaigi создать, объединить и завершить операции может потребовать защищенных XOR для
Ваш приложение должно обнаружить эту ошибку и предложить
действие самозащиты перед повторным испытанием.

```ts
type PrivateKaigiFundingBridge = KaigiBridge & {
  getPrivateKaigiConfidentialXorState(input: {
    toriiUrl: string;
    accountId: string;
  }): Promise<{
    shieldedBalance: string | null;
    transparentBalance: string;
    canSelfShield: boolean;
    message?: string;
  }>;

  selfShieldPrivateKaigiXor(input: {
    toriiUrl: string;
    chainId: string;
    accountId: string;
    amount: string;
  }): Promise<{ hash: string }>;
};

export async function selfShieldForPrivateKaigi(input: {
  context: Omit<KaigiContext, "bridge"> & {
    bridge: PrivateKaigiFundingBridge;
  };
  accountId: string;
  amount: string;
}): Promise<void> {
  const { bridge, toriiUrl, chainId } = input.context;
  const state = await bridge.getPrivateKaigiConfidentialXorState({
    toriiUrl,
    accountId: input.accountId,
  });

  if (!state.canSelfShield) {
    throw new Error(
      state.message || "This account cannot self-shield XOR for private Kaigi.",
    );
  }

  await bridge.selfShieldPrivateKaigiXor({
    toriiUrl,
    chainId,
    accountId: input.accountId,
    amount: input.amount,
  });
}
```

В демонстрации UI Призывает пользователя к самозащите, а затем снова пытается
создать или присоединиться к действию.

## Ручная обратная связь {#manual-fallback}

Автоматическая сигнализация зависит от живого кошелька. Kaigi- способный Torii маршруты, и
Проверка генерации в частном режиме.
ограниченные среды:

- если `CreateKaigi` не удается, покажите ручное приглашение с предложением
- если `JoinKaigi` не удается, покажите сырой пакет ответов
- позвольте хосту наклеить пакет ответов и вызвать `setRemoteDescription`

Ручное отступление полезно для дебгурирования WebRTC, но не обеспечивает
такие же частные гарантии сигнализации в цепочке, как и на живых Kaigi поток.

## Тестный список {#test-checklist}

Для единичных испытаний, подставьте мост и утверждайте, что ваш UI превышает ожидаемое
Kaigi полезные грузы:

- хост создает местные СМИ и представляет `createKaigiMeeting`
- хозяин показывает `iroha://kaigi/join?call=...&secret=...` пригласить
- гость анализирует приглашение, звонит `getKaigiCall`, и представляет
  `joinKaigiMeeting`
- проводит опросы или часы для сигналов ответа и применяет ответ
- Примечание для самозащиты при защите XOR отсутствует
- Ручное отступление появляется, когда живая сигнализация недоступна

Для полного ссылочного тестового комплекта см. демо-приложение Kaigi просмотр и загрузка
мостовые испытания:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
```

Сборник UI Дымный тест проверяет, что `/kaigi` Реальный тест на медиа.
все еще нуждается в двух финансируемых кошельках плюс два окна или устройства, потому что транзакция
подпись, камера, микрофон и WebRTC разрешения различаются по времени выполнения.

Если вы тестируете против TAIRA и возвращения маршрута, специфического для вызова `404`, Первый
подтвердить , что хостинг-кошелек успешно представлен `CreateKaigi`. Здоровье эстафеты
конечные точки могут быть доступны до того, как будет проведен конкретный звонок.

## Следующие шаги {#next-steps}

- Добавить запись использования с `RecordKaigiUsage` когда в вашем приложении есть надежные
  учет продолжительности сеанса.
- Регистрационные и мониторинговые реле через `/v1/kaigi/relays` при использовании реле
  Проявления.
- Поверхность `KaigiRosterSummary`, `KaigiUsageSummary`, и
  `KaigiRelayHealthUpdated` события в панели оператора.
