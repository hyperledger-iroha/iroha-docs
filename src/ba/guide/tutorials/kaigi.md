---
translation_locale: ba
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: e55c7aebc89c39edb8e7077db2414a6d432aafb05aff8df04c248fce444d7dea
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kaigi ҡушымтаһына JavaScript ҡушылған {#embed-kaigi-in-a-javascript-app}

Kaigi ҡушымтаға аҡса янсығы ярҙамында бер-бергә аудио/видео осрашыуҙар булдырырға мөмкинлек бирә, уларҙың ғүмер циклы Iroha аша теркәлә. Браузер һаман да WebRTC менән медиа менән эш итә, ә Torii һәм Kaigi күрһәтмәләре оҙайлы йыйылыштар яҙмаһын, шифрланған сигнализация метамәғлүмәттәрен тәьмин итә. шәхси исемлек ярҙамы һәм ҡулланыу ваҡиғалары.

Был дәреслек [Iroha Demo JavaScript](https://github.com/soramitsu/iroha-demo-javascript) ҡушымтаһы ҡулланған минималь интеграция өлгөһөн күрһәтә:

- WebRTC тәҡдимдәр һәм яуаптар тыуҙыра
- Kaigi транзакцияларҙы яҙыу һәм тапшырыу тураһында заявка
- ҡыҫҡа саҡырыу һылтанмалары ID саҡырыуҙы ғына йөрөтә һәм саҡырыу серле
- хужаһы Torii шифрланған ҡатнашыусы яуаптарын күҙәтә

Миҫалдар TypeScript ҡуллана һәм улар Electron, хәүефһеҙ бэкэндлы браузер йәки кеҫә ҡушымтаһы менән веб-программала эшләй алһын өсөн яҙылған.

## Шарттар {#prerequisites}

Һеҙгә кәрәк:

- Kaigi‐ҡа һәләтле Torii һуңғы пункт
- Ҡунаҡсының һәм ҡунаҡтың иҫәбе
- хәүефһеҙ ҡушымта күпере йәки аҡса янсығы аша һәр иҫәп яҙмаһының ҡултамғалау асҡысына инеү
- браузер камераһы/микрофонға рөхсәт
- Node.js 20+ әгәр һеҙ туранан-тура JavaScript демо йәки туғандаш `@iroha/iroha-js` бәйләүҙе ҡулланаһығыҙ

тулы эш референсы өсөн, Iroha сығанаҡ контроле эргәһендәге демоны клонлаштырыу:

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

Демо менән ҡулланырға [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js) ҡустыһынан Iroha сығанағы репозиторияһы. `file:` Әгәр ҙә урындағы бәйләнеш үҙгәрә, уны тергеҙеү `iroha/javascript/iroha_js`; Таҙа пакеттар индексы йөк кәрәкле эш урыны юҡ `npm run build:native`.

TAIRA режимында тере осрашыуҙы башлар алдынан, демонстрация бәйле асыҡ Torii өҫкө йөҙө тикшерегеҙ:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/v1/kaigi/relays"
curl -fsS "$TAIRA/v1/kaigi/relays/health"
```

Был командалар TAIRA тере булыуын һәм Kaigi эстафета телеметрияһы барлығын раҫлай. Улар Kaigi транзакцияларын тапшырмай. ысын `CreateKaigi` йәки `JoinKaigi` тестҡа TAIRA иҫәптәрен финанслау һәм демонстрация күпере йәки башҡа аҡса янсығы менән тәьмин ителгән күпер аша ҡул ҡуйыу кәрәк.

## Архитектура {#architecture}

Kaigi интеграцияһын өс ҡатламға бүлергә кәрәк:

|Япма |Яуаплылыҡ |
| --- | --- |
|UI |аккаунт һайлау, осрашыу формаһы, саҡырыу һылтанмаһын күрһәтеү, киң мәғлүмәт саралары менән идара итеү |
|WebRTC |`RTCPeerConnection`, урындағы киң мәғлүмәт саралары, тәҡдимдәр һәм яуаптар һүрәтләмәләре |
|Iroha күпер |подпись, `CreateKaigi`, `JoinKaigi`, `EndKaigi`, сигнал һайлау |

Ҡулланма күпер электрон алдан йөкмәтелгән була ала API, аҡса янсығы киңәйтеү, йәки артҡы аяҡ пункты. Ул UI:

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

Демо ҡушымтаһында был күпер ысулдары `@iroha/iroha-js`, урындағы ҡултамғалау, шифрланған Kaigi метамәғлүмәттәре һәм Torii шылтыратыуҙар менән тормошҡа ашырыла.

## Ярҙамсыларҙы саҡырығыҙ {#invite-helpers}

Ҡулланыу Torii- яраҡлаштырылған шылтыратыу IDs ҡаҙнаһында `domain.dataspace:meeting` формаһы. демо ҡуллана `kaigi.universal:<call-name>` ойошторолған осрашыуҙар өсөн.

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

## WebRTC Ярҙамсылар {#webrtc-helpers}

Ҡунаҡсы тәҡдим төҙөй, уны `CreateKaigi` аша һаҡлай һәм ҡунаҡтың яуапын ҡулланыу өсөн тәҙрәне аса. Ҡунаҡ шифрланған тәҡдимде алып килә, яуап бирә һәм яуапты `JoinKaigi` менән ебәрә.

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

Ағымдарҙы UI менән ябай видео элементтары менән бәйләгеҙ:

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

## Ҡунаҡсы: осрашыуҙар менән бәйләнеш булдырығыҙ {#host-create-a-meeting-link}

Ҡунаҡсы ағымы:

1. асыҡ камера һәм микрофон
2. Kaigi сигнал асҡысы парын булдырыу
3. WebRTC тәҡдимен төҙөргә
4. `CreateKaigi` тапшырыу
5. компактлы саҡырыу һылтанмаһын бүлегеҙ

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

`inviteLink` күрһәтегеҙ һеҙҙең UI. Ҡулланыусы уны күсерә ала, уны икенсе аҡса янсығында асырға мөмкин, йәки уны ҡулланыу буйынса маршрутҡа үҙгәртергә мөмкин:

```ts
export function inviteRoute(inviteLink: string): string {
  const invite = parseInviteLink(inviteLink);
  return `/kaigi?call=${encodeURIComponent(invite.callId)}&secret=${encodeURIComponent(
    invite.inviteSecretBase64Url,
  )}`;
}
```

## Ҡунаҡ: Осрашыуҙа ҡатнашығыҙ {#guest-join-a-meeting}

Ҡунаҡтар ағымы:

1. саҡырыуҙы анализлау
2. Torii нан шифрланған саҡырыу тәҡдимен алырға.
3. WebRTC яуапты булдырыу
4. `JoinKaigi` шифрланған яуап метамәғлүмәттәре менән тапшырыу

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

Әгәр осрашыу үтә күренмәле булһа, һеҙ ҡушылыу һорауына аҡса янсығы дисплей штрих индерергә мөмкин. шәхси осрашыуҙар өсөн, ҡулланыусы асыҡтан-асыҡ уны асырға һайламаһа, `walletIdentity` unsetted һаҡларға.

## Ҡунаҡсы: Ҡунаҡтың яуаптарын ҡулланығыҙ {#host-apply-the-guest-answer}

Тормош осрашыуҙары булдырылғандан һуң, алып барыусы Kaigi ваҡиғаларын ҡарарға һәм шифрланған яуап сигналдары буйынса һорау алыу үткәрергә тейеш.

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

Ҡайтарылған абонементты ID һаҡлағыҙ, шул рәүешле һеҙҙең UI хост һүнгәндә йәки ситкә киткәндә күҙәтеүсене туҡтата ала.

## Осрашыуҙы тамамлау {#end-the-meeting}

Тап шул иҫәп яҙмаһынан шылтыратыуҙы тамамлау:

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

## Шәхси йүнәлештәге финанслау {#private-mode-funding}

Шәхси Kaigi булдырыу, ҡушылыу һәм тамамлау операциялары шәхси инеү нөктәһе хаҡы өсөн һаҡланған XOR талап итә ала. Һеҙҙең ҡушымтаһы был хатаны асыҡларға тейеш һәм яңынан һынау алдынан үҙ-үҙен һаҡлау сараһын тәҡдим итергә тейеш.

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

Демонстрацияла UI ҡулланыусыны үҙ-үҙен һаҡлауға саҡыра һәм, һуңынан, оригинал булдырыу йәки ҡушылыу хәрәкәтен ҡабатлай.

## Ҡулдан-ҡулға кире ҡайтыу {#manual-fallback}

Автоматик сигнализация тере аҡса янсығына, Kaigi‐ҡа һәләтле Torii маршруттарына һәм шәхси режимда иҫбатлау генерацияһына бәйле. Үҫеш һәм сикләнгән мөхит өсөн ҡулдан үткәрелгән артта ҡалдырыу:

- `CreateKaigi` уңышһыҙ ҡалһа, тәҡдим булған ҡулланма саҡырыуҙы күрһәтегеҙ.
- `JoinKaigi` уңышһыҙ булһа, сыма яуаптар пакетын күрһәтегеҙ.
- Ҡунаҡсыға яуап пакетын йәбештерергә һәм `setRemoteDescription` саҡырырға.

WebRTC-ны дебэглау өсөн ҡулдан күсереү файҙалы, әммә ул тере Kaigi ағымы менән бер үк шәхси селтәрҙә сигнал биреү гарантияһын бирмәй.

## Һынау контроле исемлеге {#test-checklist}

Берәмекле һынауҙар өсөн күпер менән макияж яһағыҙ һәм һеҙҙең UI көтөлә торған Kaigi файҙалы йөкләмәләр үтәүен раҫлағыҙ:

- Ҡунаҡсы урындағы мәғлүмәт сараларын булдыра һәм `createKaigiMeeting` тапшыра.
- Ҡунаҡсыға `iroha://kaigi/join?call=...&secret=...` саҡырыу күрһәтелә
- Ҡунаҡ саҡырыуҙы тикшерә, `getKaigiCall` саҡыра һәм `joinKaigiMeeting` ебәрә.
- яуап сигналдары өсөн тауыш биреүселәрҙе йәки сәғәттәрҙе ҡабул итә һәм яуапты ҡуллана
- XOR һаҡланғанда үҙ-үҙен һаҡлау өсөн шәхси режимда сигналдар юҡ
- тере сигналдар булмағанда ҡулдан ҡайтарылыу барлыҡҡа килә

Тулы референт һынау комплекты өсөн, демо ҡушымтаның Kaigi күренеше һәм йөкләнеү алдынан күпер һынауҙары ҡарағыҙ:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
```

UI төтөн һынауы `/kaigi` маршрутының үтәлешен раҫлай. Ысын медиа һынау өсөн ике аҡсалата кошелек һәм ике тәҙрә йәки ҡоролма кәрәк, сөнки транзакцияға ҡул ҡуйыу, камера, микрофон һәм WebRTC рөхсәттәре башҡарыу ваҡытына ҡарап үҙгәрә.

Әгәр һеҙ TAIRA менән тест үткәрәһегеҙ һәм шылтыратыу буйынса маршрут `404` кире ҡайтара икән, башта хәбәр итегеҙ: ҡабул итеүсе аҡса янсығы уңышлы тапшырылған `CreateKaigi`.

## Киләһе аҙымдар {#next-steps}

- `RecordKaigiUsage` менән ҡулланыу яҙмаһын өҫтәгеҙ, әгәр һеҙҙең ҡушымтаға ышаныслы сеанс оҙайлығы иҫәпкә алынған икән.
- `/v1/kaigi/relays` аша эстафета манифестарын ҡулланғанда эстафетаны теркәп һәм күҙәтеп тороу.
- Өҫкө йөҙҙә `KaigiRosterSummary`, `KaigiUsageSummary`, һәм `KaigiRelayHealthUpdated` ваҡиғалары һеҙҙең оператор панелендә.
