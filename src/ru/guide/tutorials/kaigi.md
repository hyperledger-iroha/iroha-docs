---
translation_locale: ru
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: 24dc7e6a41ea8a06d24663aebaeca2469c522e391a5de61f039c47a1cd020c91
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Встроенные Kaigi в приложение JavaScript {#embed-kaigi-in-a-javascript-app}

Kaigi позволяет приложению создавать подкрепленные кошельком одиночные аудио/видео встречи, жизненный цикл которых записывается через Iroha. В браузере все еще обрабатываются средства массовой информации с помощью WebRTC, в то время как Torii и инструкции Kaigi обеспечивают прочную запись заседаний, зашифрованные метаданные сигнализации. поддержка личного списка и события использования.

В этом руководстве показана минимальная интеграционная схема, используемая приложениями [Iroha Demo JavaScript](https://github.com/soramitsu/iroha-demo-javascript):

- предоставляющий услуги создает предложения и ответы WebRTC
- подписывает заявление и представляет транзакции Kaigi
- компактные ссылки приглашения содержат только вызов ID и приглашение секретное
- принимающий Torii следит за зашифрованными ответами участников

Примеры используют TypeScript и записываются таким образом, чтобы они могли работать в Electron, браузере с безопасным бэк-эндем. или веб-приложение с расширением кошелька. Сохраняйте частные ключи за пределами ненадежного рендерного кода в производстве.

## Предварительные условия {#prerequisites}

Вам нужно:

- конечная точка Torii с возможностью Kaigi
- счет для хозяина и счет для гостя
- доступ к ключевой подписи каждого аккаунта через безопасный мост или кошелек
- разрешения на браузерную камеру/микрофон
- Node.js 20+, если вы используете JavaScript демо или родной `@iroha/iroha-js` непосредственная связь

Для получения полного справочника работы, клонируйте демо рядом с источником Iroha:

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

Используйте демо с [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js) из братьев источника хранилища Iroha. Его зависимость от `file:` решает, что проверка напрямую. Если нативная связывающая изменяется, восстановить его под `iroha/javascript/iroha_js`; чистый каталог пакетов не содержит рабочее пространство Cargo необходимого для `npm run build:native`.

Прежде чем провести живую встречу на TAIRA, проверьте общественную поверхность Torii, от которой зависит демонстрация:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/v1/kaigi/relays"
curl -fsS "$TAIRA/v1/kaigi/relays/health"
```

Эти команды проверяют, что TAIRA живет и что телеметрия эстафеты Kaigi доступна. Они не представляют транзакции Kaigi. Реальный тест `CreateKaigi` или `JoinKaigi` требует финансирования счетов TAIRA и подписания через мост демонстрации или другой мост, поддерживаемый кошельком.

## Архитектура {#architecture}

Сохраняйте интеграцию Kaigi разделенной на три уровня:

|Слой |Ответственность |
| --- | --- |
|UI |выбор учетной записи, форма встречи, отображение ссылки приглашения, управление средствами массовой информации |
|WebRTC |`RTCPeerConnection`, местные СМИ, описание предложений и ответов |
|Iroha мост|Подписание, `CreateKaigi`, `JoinKaigi`, `EndKaigi`, сигнальные опросы |

Мост приложения может быть электронным загрузкой API, расширение кошелька или конечный пункт задней панели. UI:

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

В демо-приложении эти методы моста реализуются с помощью `@iroha/iroha-js`, локальной подписи, зашифрованных метаданных Kaigi и звонков Torii.

## Пригласите помощников {#invite-helpers}

Использование Torii- Совместимый звонок IDs в `domain.dataspace:meeting` В демонстрации используется `kaigi.universal:<call-name>` для создаваемых встреч.

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

## WebRTC Помощи {#webrtc-helpers}

Ведущий создает предложение, хранит его через `CreateKaigi`, и держит окно открытым, чтобы он мог применить ответ гостя. Гость получает зашифрованное предложение, создает ответ и отправляет сообщения, отвечающие на `JoinKaigi`.

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

Присоедините потоки к UI с помощью обычных элементов видео:

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
2. создать пару сигнальных ключей Kaigi
3. создать предложение WebRTC
4. представлять `CreateKaigi`
5. поделиться компактной ссылкой на приглашение

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

Покажите `inviteLink` в своем UI. Пользователь может скопировать его, открыть его в другом кошельке или конвертировать его на маршрут приложения, например:

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

1. Проанализировать приглашение
2. получать предложение о зашифрованном звонке от Torii
3. создать ответ WebRTC
4. представляет `JoinKaigi` с зашифрованными метаданными ответа

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

Если совещание прозрачно, вы можете включить строку отображения кошелька в запрос по присоединению. Для частных встреч не устанавливайте `walletIdentity`, если пользователь явно не хочет раскрывать его.

## Ведущий: Используйте ответ гостя {#host-apply-the-guest-answer}

После создания живой встречи хозяин должен смотреть события Kaigi и опросить зашифрованные сигналы ответа. Применить первый действительный ответ к одноранговой связи хозяина.

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

Сохраняйте возвращенную подписку ID так, чтобы ваш UI мог остановить наблюдателя, когда хост отключается или уходит.

## Завершение встречи {#end-the-meeting}

Заканчивать звонок с той же учетной записи хоста , которая создала его:

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

Частные операции создания, присоединения и окончания Kaigi могут потребовать защищенного XOR за плату частной точки входа. Ваше приложение должно обнаружить эту ошибку и предложить действие самозащиты перед повторным испытанием.

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

В демонстрации UI побуждает пользователя к самозащите, а затем снова пытается создать или присоединиться к действию оригинального.

## Ручное возвращение {#manual-fallback}

Автоматическая сигнализация зависит от живого кошелька, маршрутов Kaigi-способных Torii и генерации доказательств в частном режиме. Сохраняйте ручную обратную связь для разработки и ограниченной среды:

- если `CreateKaigi` не удастся, укажите ручную приглашение с предложением.
- если `JoinKaigi` не удается, укажите сырой пакет ответов.
- позвольте хосту наклеить пакет ответов и вызвать `setRemoteDescription`

Ручная обратная связь полезна для отладки WebRTC, но она не обеспечивает те же гарантии частного сигнализации в цепочке, что и живый поток Kaigi.

## Тестный список {#test-checklist}

Для испытаний на единице выделите мостик и подтвердите, что ваш UI проходит ожидаемые полезные загрузки Kaigi:

- Ведущий создает местные СМИ и представляет `createKaigiMeeting`
- Ведущий показывает приглашение `iroha://kaigi/join?call=...&secret=...`
- гость анализирует приглашение, звонит `getKaigiCall`, и представляет `joinKaigiMeeting`
- проводит опросы или часы для сигналов ответа и применяет ответ
- Присутствуют сигналы в режиме частного режима для самозащиты при отсутствии защищенной XOR
- Ручное отступление появляется , когда живая сигнализация недоступна

Для полного справочного тестового комплекта см. показатель Kaigi демонстрационного приложения и испытания моста до загрузки:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
```

В настоящее время UI дымный тест подтверждает, что `/kaigi` Реальному тесту СМИ все еще нужны два финансируемых кошелька плюс два окна или устройства, потому что подпись транзакции, камера, микрофон, и WebRTC разрешения различаются в зависимости от времени запуска.

Если вы тестируете на TAIRA и маршрут, определенный для вызова, возвращает `404`, сначала подтвердить, что принимающий кошелек успешно представил `CreateKaigi`. Окончательные точки по охране эстафеты могут быть доступны до того, как будет проведен какой-либо конкретный звонок.

## Следующие шаги {#next-steps}

- Добавьте запись использования с помощью `RecordKaigiUsage`, если у вашего приложения есть надежный учет продолжительности сеанса.
- Регистрация и мониторинг реле через `/v1/kaigi/relays` при использовании манифестов эстафеты.
- События поверхности `KaigiRosterSummary`, `KaigiUsageSummary` и `KaigiRelayHealthUpdated` в панели управления оператора.
