---
translation_locale: hy
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: 24dc7e6a41ea8a06d24663aebaeca2469c522e391a5de61f039c47a1cd020c91
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kaigi ներմուծում JavaScript հավելվածի մեջ {#embed-kaigi-in-a-javascript-app}

Kaigi թույլ է տալիս հավելվածին ստեղծել դրամապանակի աջակցությամբ մեկ-մեկ աուդիո / տեսահոլովակ հանդիպումներ, որոնց կյանքի ցիկլը ձայնագրվում է Iroha միջոցով: Բրաուզերը դեռեւս կառավարում է լրատվամիջոցները WebRTC, մինչդեռ Torii եւ Kaigi հրահանգները ապահովում են ամուր հանդիպման արձանագրություն, կոդավորված ազդանշանային մետադատա ՝ մասնավոր ցուցակի աջակցություն եւ օգտագործման իրադարձություններ:

Այս ձեռնարկը ցույց է տալիս [Iroha Demo JavaScript](https://github.com/soramitsu/iroha-demo-javascript) հավելվածի կողմից օգտագործվող նվազագույն ինտեգրման ձեւաչափը.

- փոխանցողը ստեղծում է WebRTC առաջարկներ եւ պատասխաններ
- դիմումի կամուրջը նշում է եւ ներկայացնում Kaigi գործարքներ
- համապարփակ հրավիրման հղումները կրում են միայն ID կոչը եւ գաղտնի հրավիրումը:
- հյուրընկալողը հետեւում է Torii կոդավորված մասնակիցների պատասխաններին

Օրինակները օգտագործում են TypeScript եւ գրված են այնպես, որ դրանք կարող են գործել Electron- ում, անվտանգ բրաուզերով կամ դրամապանակի ընդլայնմամբ վեբ հավելվածով: Պահեք գաղտնի բանալիները անվստահելի ռենդերային կոդից դուրս արտադրության մեջ:

## Նախադրյալներ {#prerequisites}

Ձեզ հարկավոր է:

- Kaigi-ի կարողության Torii վերջային կետ
- հյուրընկալողի եւ հյուրի հաշվին:
- մուտք գործել յուրաքանչյուր հաշիվի ստորագրման բանալին' ապահով հավելված կամ դրամապանակով
- բրաուզերային տեսախցիկի/միկրոֆոնի թույլտվությունները
- Node.js 20+, եթե դուք ուղղակիորեն օգտագործում եք JavaScript ցուցադրական կամ բնիկ `@iroha/iroha-js` կապը

Աշխատանքի ամբողջական հղման համար կլոնեք ցուցադրությունը Iroha աղբյուրի ստուգման կողքին.

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

Օգտագործեք [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js) դեմոն եղբայրական Iroha աղբյուրի պահեստից: Նրա `file:` կախվածությունը լուծում է այն ստուգումը անմիջապես: Եթե տեղի կապը փոխվում է, վերակառուցեք այն `iroha/javascript/iroha_js`; մաքուր փաթեթների ցուցահանդեսը չի պարունակում Cargo աշխատանքային տարածքը, որը անհրաժեշտ է `npm run build:native`:

Մինչեւ TAIRA հեռուստաընկերությունում ուղիղ հանդիպում անցկացնելուց առաջ, ստուգեք հանրային Torii մակերեսը, որի վրա է կախված ցուցադրությունը.

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/v1/kaigi/relays"
curl -fsS "$TAIRA/v1/kaigi/relays/health"
```

Այս հրամանները ստուգում են, որ TAIRA-ը կենդանի է եւ որ Kaigi ռեալի հեռաչափությունը մատչելի է: Նրանք չեն ներկայացնում Kaigi գործարքներ: Իրական `CreateKaigi` կամ `JoinKaigi` փորձարկման համար անհրաժեշտ է ֆինանսավորվել TAIRA հաշիվներ եւ ստորագրել դեմոյի կամ այլ դրամապանակով աջակցված կամուրջի միջոցով.

## ճարտարապետություն {#architecture}

Պահեք Kaigi ինտեգրումը բաժանված երեք շերտերի:

|Լայնություն |պատասխանատվություն |
| --- | --- |
|UI |հաշիվի ընտրություն, հանդիպման ձեւակերպում, հրավիրման հղումը ցուցադրելը, լրատվամիջոցների վերահսկողությունը |
|WebRTC |`RTCPeerConnection`, տեղական լրատվամիջոցներ, առաջարկի եւ պատասխանների նկարագրություններ |
|Iroha կամուրջ |ստորագրում, `CreateKaigi`, `JoinKaigi`, `EndKaigi`, ազդանշանային ընտրություններ |

Հավելվածի կամուրջը կարող է լինել Էլեկտրոնի նախապատկման API, դրամապանակի ընդլայնում, կամ հետագա վերջային կետ: Այն պետք է բացատրի փոքր մակերեսը UI:

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

Դեմո հավելվածում այս կամուրջային մեթոդները իրականացվում են `@iroha/iroha-js`, տեղական ստորագրություն, կոդավորված Kaigi մետադատա եւ Torii զանգեր:

## Հրավիրեք օգնականներ {#invite-helpers}

Օգտագործեք Torii-ի հետ համատեղելի զանգը IDs ՝ `domain.dataspace:meeting` ձեւաչափում: Դեմոն օգտագործում է `kaigi.universal:<call-name>` ստեղծված հանդիպումների համար:

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

## WebRTC Օգնողներ {#webrtc-helpers}

Հյուրընկալողը ստեղծում է առաջարկ, պահպանում է այն `CreateKaigi` միջոցով եւ բաց է պահում պատուհանը, որպեսզի կարողանա կիրառել հյուրի պատասխանը: Հյուրը վերցնում է կոդավորված առաջարկը, ստեղծում է պատասխան եւ տեղադրում է այդ պատասխանը `JoinKaigi`.

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

Կապեք հոսքերը ձեր UI սովորական տեսանյութերի տարրերով.

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

## Հյուրընկալող. Ստեղծեք հանդիպման կապ {#host-create-a-meeting-link}

Հյուրընկալող հոսքը.

1. բաց տեսախցիկ եւ միկրոֆոն
2. ստեղծել Kaigi ազդանշանային կոճակի զույգ
3. ստեղծել WebRTC առաջարկ
4. ներկայացնել `CreateKaigi`
5. կիսել համապարփակ հրավիրման հղում

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

Ցուցադրեք `inviteLink` ձեր UI- ում: Օգտագործողը կարող է պատճենել այն, բացել այն այլ դրամապանակում կամ փոխակերպել այն հավելվածի երթուղին, ինչպիսիք են'

```ts
export function inviteRoute(inviteLink: string): string {
  const invite = parseInviteLink(inviteLink);
  return `/kaigi?call=${encodeURIComponent(invite.callId)}&secret=${encodeURIComponent(
    invite.inviteSecretBase64Url,
  )}`;
}
```

## Հյուրը. Միացեք հանդիպմանը {#guest-join-a-meeting}

Հյուրերի հոսքը.

1. վերլուծել հրավիրումը
2. ստանալ Torii կոդավորված զանգի առաջարկը:
3. ստեղծել WebRTC պատասխան
4. ներկայացնել `JoinKaigi` կոդավորված պատասխանային մետադատաներով

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

Եթե հանդիպումը թափանցիկ է, դուք կարող եք ներառել դրամապանակի ցուցադրման շղթա միանալու խնդրանքին: Անձնական հանդիպումների համար պահեք `walletIdentity` անսահմանված, եթե օգտագործողը բացարձակապես չի ցանկանում բացահայտել այն:

## Հյուրընկալող. Օգտագործիր հյուրի պատասխանը {#host-apply-the-guest-answer}

Կենդանի հանդիպման ստեղծելուց հետո հյուրընկալողը պետք է դիտի Kaigi իրադարձությունները եւ հարցազրույց անցկացնի գաղտնագրված պատասխանային ազդանշանների համար: Գործադրեք առաջին վավեր պատասխանը հյուրընկերոջ զուգահեռ կապին:

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

Պահպանեք վերադարձված բաժանորդագրությունը ID այնպես, որ ձեր UI կարող է կանգնեցնել դիտողին, երբ հյուրընկալողը կախված կամ նավարկում հեռանում.

## Հանդիպման ավարտը {#end-the-meeting}

Սկսեք զանգը նույն հյուրընկալող հաշիվից, որը ստեղծեց այն.

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

## Անձնական ռեժիմով ֆինանսավորումը {#private-mode-funding}

Հատուկ Kaigi ստեղծել, միանալ եւ ավարտել գործողությունները կարող են պահանջել պաշտպանված XOR մասնավոր մուտքի կետի վճարների համար: Ձեր հավելվածը պետք է հայտնաբերի այդ սխալը եւ առաջարկի ինքնուրույն պաշտպանված գործողություն, նախքան կրկին փորձելը:

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

Դեմոյում UI-ը հորդորում է օգտատերին ինքնապաշտպանվել, ապա կրկին փորձում է ստեղծել կամ միանալ սկզբնական գործողությանը:

## Ձեռք բերման ձեռագիր {#manual-fallback}

Ավտոմատ ազդանշանները կախված են կենդանի դրամապանակից, Kaigi - ի կարողություն ունեցող Torii երթուղներից եւ ապացույցների արտադրությունից մասնավոր ռեժիմում: Գործունական հետընթաց պահեք զարգացման եւ սահմանափակ միջավայրերի համար.

- եթե `CreateKaigi` չի ստացվում, ցուցադրեք առաջարկը պարունակող ձեռագիր հրավեր:
- եթե `JoinKaigi` անհաջողություն է առաջացնում, ցուցադրեք չոր պատասխան փաթեթ:
- թող հյուրընկալողը պատասխանի փաթեթը սեղմել եւ զանգահարել `setRemoteDescription`

Մանուալ հետընթացը օգտակար է WebRTC թարմացման համար, բայց այն չի ապահովում նույն մասնավոր ցանցային ազդանշանների երաշխիքները, ինչպես կենդանի Kaigi հոսքը:

## Թեստային ստուգման ցուցակ {#test-checklist}

Միավորների փորձարկումների համար ստուգեք կամուրջը եւ պնդեք, որ ձեր UI-ն անցնում է սպասվող Kaigi օգտակար բեռները.

- հյուրընկալողը ստեղծում է տեղական լրատվամիջոցներ եւ ներկայացնում `createKaigiMeeting`
- հյուրընկալողը ցուցադրում է `iroha://kaigi/join?call=...&secret=...` հրավիրումը
- հյուրը վերլուծում է հրավիրումը, զանգահարում `getKaigiCall`, եւ ներկայացնում `joinKaigiMeeting`
- հյուրընկալող հարցումների կամ պատասխանային ազդանշանների համար ժամացույցներ եւ կիրառում է պատասխանը
- մասնավոր ռեժիմով ինքնապաշտպանման հրահանգներ, երբ պաշտպանված XOR բացակայում է
- ձեռքի հետընթացը հայտնվում է, երբ կենդանի ազդանշանները հասանելի չեն

Ամբողջական վկայակոչային փորձարկման համալիրի համար դիտեք demo հավելվածի Kaigi տեսանկյունը եւ բեռնվելուց առաջ անցքային փորձարկումները.

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
```

UI ծխի թեստը հաստատում է, որ `/kaigi` երթուղին կատարվում է: Իսկական մեդիա փորձարկման համար դեռ պետք է երկու ֆինանսավորվող դրամապանակներ եւ երկու պատուհան կամ սարք, քանի որ գործարքի ստորագրումը, տեսախցիկը, միկրոֆոնը եւ WebRTC թույլտվությունները տարբերվում են վազման ժամանակով.

Եթե դուք փորձարկում եք TAIRA եւ զանգի հատուկ երթուղու վերադարձնում է `404`, նախ հաստատեք, որ հյուրընկալող դրամապանակը հաջողությամբ ներկայացվել է `CreateKaigi`: Relay առողջության վերջային կետերը կարող են հասանելի լինել նախքան որեւէ կոնկրետ զանգը գոյություն ունենա:

## Հաջորդ քայլերը {#next-steps}

- Ավելացրեք օգտագործման ձայնագրություն `RecordKaigiUsage`, երբ ձեր հավելվածը ունի վստահելի նստաշրջանի տեւողության հաշվառման.
- `/v1/kaigi/relays` միջոցով ռեալի գրանցում եւ վերահսկողություն իրականացնել՝ օգտագործելով ռեալի մանիֆեսներ:
- Surface `KaigiRosterSummary`, `KaigiUsageSummary`, եւ `KaigiRelayHealthUpdated` իրադարձությունները ձեր օպերատորի վահանակում:
