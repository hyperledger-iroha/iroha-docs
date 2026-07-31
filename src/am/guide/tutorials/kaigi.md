---
translation_locale: am
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: e55c7aebc89c39edb8e7077db2414a6d432aafb05aff8df04c248fce444d7dea
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# የተካተቱ Kaigi በ JavaScript መተግበሪያ {#embed-kaigi-in-a-javascript-app}

Kaigi አንድ መተግበሪያ በኪስ ቦርሳ የተደገፈ አንድ-ወደ-አንድ የድምጽ / ቪዲዮ ስብሰባዎችን እንዲፈጥር ያስችለዋል
የህይወት ዑደቱ በ Iroha. አሳሹ አሁንም ሚዲያዎችን በ
WebRTC, በወቅቱ Torii እና Kaigi መመሪያዎች ዘላቂ ስብሰባ ያቀርባሉ
መዝገብ፣ የተመሰጠረ የምልክት ሜታዳታ፣ የግል ዝርዝር ድጋፍ እና የአጠቃቀም ክስተቶች።

ይህ አጋዥ መተግበሪያ በ
[Iroha ማሳያ JavaScript](https://github.com/soramitsu/iroha-demo-javascript)
መተግበሪያ:

- ማቅረቢያው ይፈጥራል WebRTC ቅናሾች እና መልሶች
- የማመልከቻ ድልድይ ምልክቶች እና ያቀርባል Kaigi ግብይቶች
- የታመሙ የጥሪ አገናኞች ጥሪውን ብቻ ይሸከማሉ ID እና በስውር ይጋብዙ
- አስተናጋጅ ሰዓቶች Torii ለተሳታፊዎች የተሰየሙ መልሶች

ምሳሌዎቹ TypeScript እና በኤሌክትሮን ውስጥ ሊሰሩ እንዲችሉ የተጻፉ ናቸው
ደህንነቱ የተጠበቀ የጀርባ አድራሻ ያለው አሳሽ ወይም የኪስ ቦርሳ ማራዘሚያ ያለው የድር መተግበሪያ።
በማምረት ላይ ካሉ የማይታመኑ የሬንደር ኮዶች ውጭ ያሉ የግል ቁልፎች።

## ቅድመ ሁኔታዎች {#prerequisites}

የሚያስፈልግህ:

- ሀ Kaigi- አቅም ያለው Torii የመጨረሻ ነጥብ
- ለአስተናጋጁና ለጉብኝቱ መለያ
- ደህንነቱ በተጠበቀ የመተግበሪያ ድልድይ ወይም Wallet በኩል ለእያንዳንዱ መለያ ፊርማ ቁልፍ መዳረሻ
- የአሳሽ ካሜራ/ማይክሮፎን ፍቃዶች
- Node.js 20+ የሚጠቀሙ ከሆነ JavaScript ዲሞ ወይም ተወላጅ
  `@iroha/iroha-js` በቀጥታ የሚጣበቅ

ሙሉ የሥራ ማጣቀሻ ለማግኘት, አንድ አጠገብ ማሳያ ክሎን Iroha ምንጭ
የገቢ ማስከበሪያ:

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

ማሳያውን ይጠቀሙ
[`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js)
ከወንድም Iroha የመረጃ ምንጭ መዝገብ። `file:` ጥገኛነት ያፈራል
በቀጥታ ካሳ. የአገር ውስጥ አገናኝ ከተቀየረ,
`iroha/javascript/iroha_js`; ንጹህ የታሸገ ማውጫ የ
የጭነት የሥራ ቦታ `npm run build:native`.

በቀጥታ ስብሰባ ከማካሄድ በፊት TAIRA, የሕዝብን ፍለጋ Torii የ
ማሳያ የሚወሰነው:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/v1/kaigi/relays"
curl -fsS "$TAIRA/v1/kaigi/relays/health"
```

እነዚህ ትዕዛዞች TAIRA በሕይወት ነው እና ይህ Kaigi ተለጣፊ ቴሌሜትሪ
የሚቀርቡት Kaigi ግብይቶች `CreateKaigi` ወይም
`JoinKaigi` የሙከራ ፍላጎቶች የገንዘብ ድጋፍ TAIRA ሂሳቦች እና ማሳያ በኩል ፊርማ
ድልድይ ወይም ሌላ የኪስ ቦርሳ የተደገፈ ድልድይ።

## ሥነ ሕንፃ {#architecture}

ይያዙ Kaigi ውህደት በሦስት ደረጃዎች የተከፋፈለ:

| ሽፋን | ኃላፊነት |
| --- | --- |
| UI | የመለያ ምርጫ፣ የስብሰባ ቅጽ፣ የጥሪ አገናኝ ማሳያ፣ የመገናኛ ብዙሃን መቆጣጠሪያዎች |
| WebRTC | `RTCPeerConnection`, የአካባቢው ሚዲያዎች፣ የዕድሜ ልክ አቅርቦቶችና መልሶች |
| Iroha ድልድይ | ፊርማ ማድረግ፣ `CreateKaigi`, `JoinKaigi`, `EndKaigi`, የምልክት ምርጫ |

የመተግበሪያው ድልድይ የኤሌክትሮን ቅድመ ጭነት ሊሆን ይችላል API, የኪስ ቦርሳ ማራዘሚያ ወይም የጀርባ ጫፍ
የመጨረሻው ነጥብ. UI:

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

ማሳያ መተግበሪያ ውስጥ, እነዚህ ድልድይ ዘዴዎች ጋር ተተግብረዋል
`@iroha/iroha-js`, አካባቢያዊ ፊርማ፣ የተመሰጠረ Kaigi ሜታዳታ እና Torii ጥሪዎች።

## ረዳቶችን ይጋብዙ {#invite-helpers}

አጠቃቀም Torii- ተኳሃኝ ጥሪ IDs በ `domain.dataspace:meeting` ቅጽ.
አጠቃቀም `kaigi.universal:<call-name>` ለተፈጠሩ ስብሰባዎች።

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

## WebRTC ረዳቶች {#webrtc-helpers}

አስተናጋጁ ቅናሽ ይፈጥራል፣ ያከማችዋል `CreateKaigi`, እና የ
እንግዳውን መልስ ተግባራዊ ማድረግ እንዲችል መስኮቱ ይከፈታል።
ቅናሽ, አንድ መልስ ይፈጥራል, እና መልሱን ጋር ልጥፎች `JoinKaigi`.

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

ዥረቶቹን ወደ እርስዎ ያያይዙ UI የተለመዱ የቪዲዮ አካላት:

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

## አስተናጋጅ፦ የመሰብሰቢያ አገናኝ ይፍጠሩ {#host-create-a-meeting-link}

አስተናጋጅ ፍሰት:

1. ክፍት ካሜራ እና ማይክሮፎን
2. አንድ መፍጠር Kaigi የምልክት ቁልፍ ጥንድ
3. አንድ መፍጠር WebRTC ቅናሽ
4. ማቅረብ `CreateKaigi`
5. የታመቀ የግብዣ አገናኝ ያጋሩ

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

ማሳያ `inviteLink` በእርስዎ ውስጥ UI. ተጠቃሚው መገልበጥ ይችላል, ሌላ የኪስ ቦርሳ ውስጥ መክፈት,
ወይም እንደ የሚከተለው የመተግበሪያ መንገድ ይቀይሩ:

```ts
export function inviteRoute(inviteLink: string): string {
  const invite = parseInviteLink(inviteLink);
  return `/kaigi?call=${encodeURIComponent(invite.callId)}&secret=${encodeURIComponent(
    invite.inviteSecretBase64Url,
  )}`;
}
```

## እንግዳ፦ በስብሰባው ላይ ተገኝ {#guest-join-a-meeting}

የእንግዶች ፍሰት:

1. ግብዣውን አጠናቅቁ
2. የኮድ የተደረገውን ጥሪ አቅርቦት ከ Torii
3. አንድ መፍጠር WebRTC መልስ
4. ማቅረብ `JoinKaigi` የተመሰጠረ የምላሽ ሜታዳታ ጋር

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

ስብሰባው ግልፅ ከሆነ, በቦርሳ ማሳያ ገመድ ውስጥ ማካተት ይችላሉ
ለግል ስብሰባዎች፣ `walletIdentity` ተጠቃሚው ካልሆነ በስተቀር
በግልጽ ለመግለጽ ይመርጣል.

## አስተናጋጅ፦ የእንግዳውን መልስ ተግባራዊ አድርግ {#host-apply-the-guest-answer}

የቀጥታ ስብሰባ ከተፈጠረ በኋላ አስተናጋጁ ማየት ይኖርበታል Kaigi ክስተቶች እና የምርመራ
የመጀመሪያውን ትክክለኛ መልስ በአስተናጋጁ እኩዮች ላይ ይተግብሩ
ግንኙነት.

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

የተመለሰውን ምዝገባ ያስቀምጡ ID ስለዚህ የእርስዎ UI መቆጣጠሪያውን ማቆም ይችላሉ
አስተናጋጁ ተዘግቶ ወይም ሄዶ ይጓዛል።

## ስብሰባው ያበቃል {#end-the-meeting}

ጥሪውን ከፈጠረው ተመሳሳይ አስተናጋጅ መለያ አቁሙ:

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

## የግል አሰራር የገንዘብ ድጋፍ {#private-mode-funding}

የግል Kaigi መፍጠር, መቀላቀል, እና መጨረሻ ሥራዎች የተከላከሉ ያስፈልጋቸዋል ይችላል XOR ለ
የእርስዎ መተግበሪያ ያንን ስህተት መያዝ አለበት እና አንድ
እንደገና ከመሞከርዎ በፊት ራስን የመከላከል እርምጃ።

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

ማሳያ ውስጥ, UI ተጠቃሚው ራሱን እንዲከላከል ያደርገዋል ከዚያም እንደገና ይሞክራል
የመጀመሪያውን ድርጊት መፍጠር ወይም መቀላቀል።

## የእጅ መውደቅ {#manual-fallback}

አውቶማቲክ ምልክት በቀጥታ ቦርሳ ላይ የተመሠረተ ነው, Kaigi- አቅም ያለው Torii መስመሮች እና
የግል ሁነታ ውስጥ ማስረጃ ማመንጨት.
የተገደቡ አካባቢዎች

- ከሆነ `CreateKaigi` ካልተሳካ፣ ግብዣውን የሚይዝ የእጅ ጥሪ አሳይ
- ከሆነ `JoinKaigi` አልተሳካም, ጥሬ መልስ ፓኬጅ ማሳየት
- አስተናጋጁ የምላሹን ፓኬጅ እንዲለጠፍ እና ለመደወል ይፍቀዱ `setRemoteDescription`

በእጅ ወደ ኋላ መመለስ ለ debugging ጠቃሚ ነው WebRTC, ነገር ግን
የቀጥታ ስርጭት ጋር ተመሳሳይ የግል ሰንሰለት ላይ የምልክት ዋስትናዎች Kaigi ፍሰት.

## የሙከራ የቼክ ዝርዝር {#test-checklist}

ለአንድነት ምርመራዎች ድልድዩን አስመስለው UI ከሚጠበቀው በላይ
Kaigi ጠቃሚ ጭነቶች:

- አስተናጋጅ አካባቢያዊ ሚዲያዎችን ይፈጥራል እና ያቀርባል `createKaigiMeeting`
- አስተናጋጅ `iroha://kaigi/join?call=...&secret=...` ግብዣ
- እንግዳው ግብዣውን ይመረምራል፣ ጥሪዎችን ያቀርባል `getKaigiCall`, እና ያቀርባል
  `joinKaigiMeeting`
- የድምፅ ማመልከቻዎችን ለማስተናገድ ወይም መልስ ምልክቶችን ለመከታተል ሰዓቶች እና መልሱን ይተግብራል
- የግል ሁነታ በራስ-መከላከያ የሚደረግላቸው ማሳሰቢያዎች XOR ጠፍቷል
- የቀጥታ ምልክት በማይገኝበት ጊዜ በእጅ ወደኋላ መመለስ ይታያል።

ሙሉውን የመረጃ አሰጣጥ የሙከራ ስብስብ ለማግኘት የማሳያ መተግበሪያውን ይመልከቱ Kaigi እይታ እና ቅድመ ጭነት
ድልድይ ሙከራዎች:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
```

የ UI የጭስ ሙከራው `/kaigi` እውነተኛ የመገናኛ ብዙሃን ሙከራ
አሁንም ሁለት የገንዘብ ገንዘቦች እና ሁለት መስኮቶች ወይም መሣሪያዎች ያስፈልገዋል ምክንያቱም ግብይት
ፊርማ፣ ካሜራ፣ ማይክሮፎን እና WebRTC ፍቃዶች በስራ ሰዓት ይለያያሉ።

እናንተ ሙከራ ከሆኑ TAIRA እና ለጥሪው የተወሰነ የመንገድ ተመላሽ `404`, በመጀመሪያ
አስተናጋጅ ቦርሳው በተሳካ ሁኔታ እንደቀረበ ያረጋግጡ `CreateKaigi`. የሬሌ ጤና
ማንኛውም የተወሰነ ጥሪ ከመደረጉ በፊት የመጨረሻ ነጥቦች ሊገኙ ይችላሉ።

## ቀጣይ እርምጃዎች {#next-steps}

- የአጠቃቀም መዝገብን በ `RecordKaigiUsage` የእርስዎ መተግበሪያ አስተማማኝ ጊዜ
  የክፍለ ጊዜ ቆይታ ሂሳብ።
- በመመዝገብ እና በመከታተል ላይ የሚገኙት ሪሌዎች `/v1/kaigi/relays` ሪሌን ሲጠቀሙ
  መገለጫዎች።
- ገጽታ `KaigiRosterSummary`, `KaigiUsageSummary`, እና
  `KaigiRelayHealthUpdated` በኦፕሬተር ዳሽቦርድዎ ውስጥ ያሉ ክስተቶች።
