---
translation_locale: kk
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: e55c7aebc89c39edb8e7077db2414a6d432aafb05aff8df04c248fce444d7dea
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kaigi-ны JavaScript қосымшасына енгізу {#embed-kaigi-in-a-javascript-app}

Kaigi қолданбаға Iroha арқылы өмірлік циклі жазылған бір-бір аудио/видео кездесулерін құруға мүмкіндік береді. Браузер әлі күнге дейін WebRTC арқылы медиамен айналысады, ал Torii және Kaigi нұсқаулықтары тұрақты жиналыс жазбасын, шифрланған сигнал беру метадеректерін ұсынады. жеке тізімді қолдау және пайдалану оқиғалары.

Бұл оқу құралы [Iroha Demo JavaScript](https://github.com/soramitsu/iroha-demo-javascript) қосымшасы пайдаланатын интеграцияның ең аз үлгісін көрсетеді:

- тапсырушы WebRTC ұсыныстар мен жауаптарды жасайды
- Өтініш күперін белгілейді және Kaigi операцияларды ұсынады
- жинақталған шақыру сілтемелері ID шақыруды ғана қамтиды және шақыру құпиясы
- Ұйымдастырушы Torii шифрланған қатысушылардың жауаптарын бақылайды

Үлгілер TypeScript пайдаланады және олар Electron, қауіпсіз бэкэнд бар браузерде немесе қапшықтың кеңейтуі бар веб-қосымшада жұмыс істеуі үшін жазылады.

## Алдын ала талаптар {#prerequisites}

Сізге қажет:

- Kaigi қабілетті Torii соңғы нүктесі
- қоректенуші және қонақ үшін есеп беру
- әрбір шоттың қолтаңбалау кілтіне қауіпсіз қосымша көпірінен немесе қапшығынан қол жеткізу
- браузерлік камера/микрофон рұқсаттары
- Node.js 20+ егер сіз тікелей JavaScript демо немесе түпкілікті `@iroha/iroha-js` бұзылуды қолдансаңыз

Толық жұмыс анықтамасын алу үшін Iroha көзін тексерудің жанында демоны клондаңыз:

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

Iroha Source Repository-ден [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js) демоны пайдаланыңыз. оның `file:` тәуелділігі тікелей тексеруді шешеді. Егер түпкілікті байлауды өзгертсеңіз, оны `iroha/javascript/iroha_js` деп қайта құру; таза пакет каталогында `npm run build:native` үшін қажет жүк жұмыс кеңістігі жоқ.

TAIRA желісіндегі тікелей кездесуді жүргізгенге дейін, демонстрация көз каранды болатын қоғамдық Torii бетін тексеру:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/v1/kaigi/relays"
curl -fsS "$TAIRA/v1/kaigi/relays/health"
```

Бұл командалар TAIRA тірі екенін және Kaigi релелік телеметрияның қолжетімді екендігін тексереді. Олар Kaigi транзакцияларды ұсынбайды. Шынайы `CreateKaigi` немесе `JoinKaigi` сынақ үшін TAIRA шоттары қаржыландырылуы және демонстрациялық көпір арқылы немесе басқа да қапшықты қолдаған көпір арқылы қол қою қажет.

## Архитектура {#architecture}

Kaigi интеграциясын үш қабатқа бөлуге тиіс:

|Қабат |Жауапкершілік |
| --- | --- |
|UI |тіркелгі таңдау, кездесу формасы, шақыру сілтемелерін көрсету, БАҚ-ны басқару |
|WebRTC |`RTCPeerConnection`, жергілікті ақпарат құралдары, ұсыныстар мен жауаптардың сипаттамасы |
|Iroha көпір|қол қою, `CreateKaigi`, `JoinKaigi`, `EndKaigi`, сигналдау |

Қолданба көпірі электронды алдын ала жүктеу API, қапшықты кеңейту немесе аяқ нүкте болуы мүмкін. Ол UI кішкентай бетіне әсер етуі керек:

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

Демонстрациялық қолданбада бұл көпір әдістері `@iroha/iroha-js`, жергілікті қолтаңбалау, шифрланған Kaigi метамәліметтері және Torii шақырулармен іске асырылады.

## Көмекшілерді шақырыңыз {#invite-helpers}

Torii-мен үйлесімді шақыруды IDs `domain.dataspace:meeting` нысанында пайдаланыңыз. Демонстрацияланған кездесулер үшін `kaigi.universal:<call-name>` қолданылады.

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

## WebRTC Көмекшілер {#webrtc-helpers}

Үйлестіруші ұсыныс жасайды, оны `CreateKaigi` арқылы сақтайды және қонақтың жауабын қолдана алу үшін терезеді ашық ұстайды. Қонақ шифрланған ұсынысты алып, жауап береді және жауапты `JoinKaigi` деп жариялайды.

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

Әдеттегі бейне элементтерімен ағымдарды UI қосқанда:

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

## Ұйымдастырушы: Кездесуге сілтеме жасаңыз {#host-create-a-meeting-link}

Қабылдаушы ағыны:

1. ашық камера және микрофон
2. Kaigi сигнал кілті жұпын құру
3. WebRTC ұсынысын жасау
4. тапсыру `CreateKaigi`
5. шақырудың тығыз сілтемесін бөліңіз

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

Шоу `inviteLink` Сіздің UI. Пайдаланушы оны көшіріп алуға, басқа қапсыққа ашуға немесе келесідей қосымша бағытына айналдыра алады:

```ts
export function inviteRoute(inviteLink: string): string {
  const invite = parseInviteLink(inviteLink);
  return `/kaigi?call=${encodeURIComponent(invite.callId)}&secret=${encodeURIComponent(
    invite.inviteSecretBase64Url,
  )}`;
}
```

## Қонақшы: Кездесуге қатысу {#guest-join-a-meeting}

Қонақтардың ағыны:

1. шақыруды талдау
2. Torii арқылы шифрланған шақыру ұсынысын алуға болады
3. WebRTC жауап жасаңыз
4. `JoinKaigi` шифрланған жауап метамәдени деректерімен тапсырылады

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

Егер кездесу ашық болса, сіз қосылу өтінішіне қапшықтың дисплейін қосуға болады. Жеке кездесулер үшін `walletIdentity` белгісі қойылмасын, егер пайдаланушы анықты түрде оны ашуды таңдамаса.

## Қонақжайшы: Мейманның жауабын қолдан {#host-apply-the-guest-answer}

Тікелей кездесуді жасағаннан кейін, үйлестіруші Kaigi іс-шараларын көруі және шифрланған жауап сигналдары үшін сауалнама жүргізуі керек.

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

Қайтарылған жазылуды ID сақтаңыз, сондықтан сіздің UI қожайыны жабылып кеткенде немесе кетіп бара жатқанда бақылаушыны тоқтата алады.

## Кездесудің аяқталуы {#end-the-meeting}

Тапсырманы жасаған хост тіркелгісінен шақыруды тоқтату:

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

## Жеке режимдегі қаржыландыру {#private-mode-funding}

Жеке Kaigi құру, қосылу және аяқтау операцияларына жеке кіру нүктесі төлемі үшін қалқандалған XOR қажет болуы мүмкін. Сіздің қолданбаңыз бұл қателікті анықтап, қайтадан тырысу алдында өзін-өзі қорғайтын іс-қимыл жасауы керек.

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

Демода UI пайдаланушыны өзін-өзі қорғауға шақырады, содан кейін бастапқы құру немесе қосылу әрекетіне қайталап әрекет етеді.

## Қолданбалы қайту {#manual-fallback}

Автоматты сигнализация терезелік қапшыққа, Kaigi -ға қабілетті Torii бағыттарға және жеке режимде дәлелдеу туындысына байланысты.

- Егер `CreateKaigi` сәтсіздікке ұшыраса, ұсынысты қамтитын қолма-қол шақыруды көрсету.
- егер `JoinKaigi` сәтсіздікке ұшыраса, шикі жауап пакети көрсетілсін
- қоректенуші жауап пакеттерін тіркеп, `setRemoteDescription` шақырсын.

WebRTC тегістеу үшін қолма-қол қайтарым пайдалы, бірақ ол тірі Kaigi ағыны сияқты жеке тізбектегі сигнал беру кепілдіктерін бермейді.

## Тексеру тізімі {#test-checklist}

Бөлшек сынақтары үшін көпірді ойлап көріңіз және UI сіздің күтілетін Kaigi пайдалы жүктемелерді өтемін деп растаңыз:

- Үйлестіруші жергілікті БАҚ-ты жасайды және `createKaigiMeeting` береді
- қоректенуші `iroha://kaigi/join?call=...&secret=...` шақыруын көрсетеді
- қонақ шақыруды зерттейді, `getKaigiCall` шақырады және `joinKaigiMeeting` береді.
- жауап беретін сигналдарды қабылдайтын сауалнамалар немесе сағаттар және жауапты қолданады
- қорғалған кезде XOR өзін-өзі қорғайтын жеке режимдегі ескертулер жоқ
- Тікелей сигналдар болмаған кезде қолма-қол кері қайту пайда болады .

Толық анықтамалық сынақ жиынтығы үшін демо қосымшаның Kaigi көрінісі мен жүктелу алдындағы көпірлік сынақтарын қараңыз:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
```

UI түтін сынағы `/kaigi` бағытының орындалғанын растайды. нақты медиа сынағына әлі де екі қаржыландырылған қапсық пен екі терезе немесе құрылғы қажет, өйткені транзакцияны қолтаңбалау, камера, микрофон және WebRTC рұқсаттары орындау уақытына байланысты өзгеріп отырады.

Егер сіз TAIRA-ге қарсы тестілеу жүргізсеңіз және шақыруға арналған маршрут `404` қайтарса, алдымен қоректендірілген қапшықтың табысты тапсырылуын растаңыз `CreateKaigi`.

## Келесі қадамдар {#next-steps}

- Қолданбаңызда сеанс ұзақтығының сенімді есепке алынуы болған кезде `RecordKaigiUsage` арқылы пайдалануды тіркеуді қосу.
- Релелерді тіркеу және бақылау `/v1/kaigi/relays` арқылы релелік манифесттерді пайдалану кезінде.
- Оператор панеліңіздегі беті `KaigiRosterSummary`, `KaigiUsageSummary` және `KaigiRelayHealthUpdated` оқиғалары.
