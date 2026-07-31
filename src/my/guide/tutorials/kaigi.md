---
translation_locale: my
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: e55c7aebc89c39edb8e7077db2414a6d432aafb05aff8df04c248fce444d7dea
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ပူးပေါင်းခြင်း Kaigi a တွင် JavaScript App ကို {#embed-kaigi-in-a-javascript-app}

Kaigi အပ်လီကေးရှင်းတစ်ခုအနေနဲ့ Wallet backed one-to-one audio/video အစည်းအဝေးတွေ ဖန်တီးခွင့်ပေးပါတယ်။
၎င်းရဲ့ သက်တမ်း စက်ဝန်းကို မှတ်တမ်းတင်ထားပြီး Iroha. Browser က မီဒီယာကို
WebRTC, တစ်ချိန်တည်းမှာ Torii နောက်ပြီး Kaigi ညွှန်ကြားချက်တွေက ရေရှည်ခံတဲ့ အစည်းအဝေးကိုပေးတယ်။
မှတ်တမ်းတင်ခြင်း၊ ကုဒ်သွင်းထားတဲ့ အချက်ပြမှု metadata များ၊ ပုဂ္ဂလိက စာရင်းထောက်ပံ့မှု၊ အသုံးပြုမှုဖြစ်ရပ်များ။

ဒီသင်ခန်းစာက အနည်းဆုံးပေါင်းစပ်မှုပုံစံကိုပြသသည်
[Iroha Demo JavaScript](https://github.com/soramitsu/iroha-demo-javascript)
app:

- renderer က ဖန်တီးပေးတယ် WebRTC ကမ်းလှမ်းချက်များနှင့် အဖြေများ
- လျှောက်လွှာတံတားကို ရေးသားပြီး တင်ပြပါ Kaigi ငွေပေးချေမှု
- compact invite link တွေက call ကိုပဲ သယ်ဆောင်ပေးတယ် ID လျှို့ဝှက်စွာ ဖိတ်ကြားပါ
- အိမ်ရှင်က စောင့်ကြည့်တယ်။ Torii ကုဒ်သွင်းထားတဲ့ ပါဝင်သူ ဖြေဆိုချက်များအတွက်

နမူနာများတွင် အသုံးပြုသည် TypeScript အီလက်ထရွန် (Electron) ထဲမှာ ပြေးနိုင်အောင် ရေးသားထားတာပါ။
လုံခြုံတဲ့ backend နဲ့ browser ဒါမှမဟုတ် wallet extension ပါတဲ့ web app ကို
မယုံကြည်တဲ့ renderer code ကနေထုတ်လုပ်နေတဲ့ private keys တွေပါ။

## လိုအပ်ချက်များ {#prerequisites}

မင်းလိုအပ်တာက

- (က) Kaigi- အရည်အချင်းရှိသူ Torii အဆုံးသတ်မှတ်ချက်
- အိမ်ရှင်အတွက်စာရင်းနဲ့ ဧည့်သည်အတွက်စာရင်း
- လုံခြုံတဲ့ app တံတား (သို့) ငွေကြေးအိတ်မှတစ်ဆင့် အကောင့်တစ်ခုစီရဲ့ လက်မှတ်ရေးထိုးမှု သော့ကို ဝင်ရောက်နိုင်ခြင်း
- Browser Camera/Microphone ခွင့်ပြုချက်များ
- Node.js 20+ ကိုသုံးနေရင် JavaScript demo သို့မဟုတ် native
  `@iroha/iroha-js` တိုက်ရိုက် ချိတ်ဆက်ခြင်း

Full Working Reference အတွက် demo ကို Iroha အရင်းအမြစ်
စစ်ဆေးမှု:

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

ဒီမိုကို သုံးပါ
[`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js)
ညီအစ်မဆီက Iroha အရင်းအမြစ် သိုလှောင်ရုံပါ။ `file:` ကိုးကားမှုက ဖြေရှင်းပေးတယ်
မူလဘောင်က ပြောင်းလဲသွားရင်
`iroha/javascript/iroha_js`; သန့်ရှင်းတဲ့ အိတ်စာရင်းမှာ
ကုန်ပစ္စည်းများအတွက် လိုအပ်သော အလုပ်ခွင် `npm run build:native`.

တိုက်ရိုက် အစည်းအဝေးကို မလုပ်ခင် TAIRA, အများပြည်သူကို စစ်ဆေးပါ။ Torii မျက်နှာပြင်ကို
demo က အောက်ပါအတိုင်း မူတည်ပါတယ်။

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/v1/kaigi/relays"
curl -fsS "$TAIRA/v1/kaigi/relays/health"
```

ဒီအမိန့်တွေက စစ်ဆေးတာက TAIRA အသက်ရှင်ပြီး Kaigi Relay telemetry ဆိုတာ
ထုတ်လွှင့်ခြင်းမရှိပါ။ Kaigi ငွေလဲလှယ်မှု `CreateKaigi` ဒါမှမဟုတ်
`JoinKaigi` စမ်းသပ်မှုလိုအပ်ချက်များအတွက် ငွေကြေးထောက်ပံ့ TAIRA အကောင့်များနှင့် demo များမှတစ်ဆင့် လက်မှတ်ထိုးခြင်း
တံတား (သို့) အခြားငွေကြေးအထောက်အပံ့တံတားတစ်ခု။

## ဗိသုကာ {#architecture}

ထိန်းထားပါ။ Kaigi ပေါင်းစပ်မှု အဆင့် သုံးဆင့် ခွဲထားခြင်း

| အလွှာ | တာဝန်ရှိမှု |
| --- | --- |
| UI | အကောင့်ရွေးချယ်မှု၊ အစည်းအဝေးပုံစံ၊ ဖိတ်ကြားချက် လင့်ခ် ပြသခြင်း၊ မီဒီယာ ထိန်းချုပ်မှု |
| WebRTC | `RTCPeerConnection`, ဒေသတွင်းမီဒီယာများ၊ ကမ်းလှမ်းချက်နှင့် ဖြေကြားမှု သရုပ်ဖော်ချက်များ |
| Iroha တံတား | လက်မှတ်ရေးထိုးခြင်း၊ `CreateKaigi`, `JoinKaigi`, `EndKaigi`, အချက်ပြချက် မဲပေးခြင်း |

App တံတားဟာ Electron ကို ကြိုတင်သွင်းနိုင်ပါတယ် API, Wallet extension သို့မဟုတ် backend တစ်ခု
အဆုံးအသတ်မှတ်ချက်။ ၎င်းဟာ မျက်နှာပြင်လေးကို UI:

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

ဒီမို app မှာ bridge method တွေကို
`@iroha/iroha-js`, ဒေသတွင်း လက်မှတ်ရေးထိုးခြင်း၊ ကုဒ်သွင်းခြင်း Kaigi metadata နဲ့ Torii ဖုန်းခေါ်တယ်။

## အကူအညီပေးသူများကို ဖိတ်ကြား {#invite-helpers}

အသုံးပြုခြင်း Torii- ကိုက်ညီတဲ့ ဖုန်းခေါ်ဆိုမှု IDs အထဲမှာ `domain.dataspace:meeting` ပုံစံ။ ဒီမို
အသုံးများ `kaigi.universal:<call-name>` အစည်းအဝေးများအတွက်

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

## WebRTC အကူအညီပေးသူများ {#webrtc-helpers}

အိမ်ရှင်က ကမ်းလှမ်းချက်ကို ဖန်တီးပြီး သိမ်းဆည်းပေးတယ်။ `CreateKaigi`, နောက်ပြီး
ဧည့်သည်ရဲ့ အဖြေကို အသုံးချနိုင်အောင် ပြတင်းပေါက်ဖွင့်တယ်။ ဧည့်သည်က ကုဒ်သွင်းထားတဲ့
ကမ်းလှမ်းချက်တစ်ခု ဖန်တီးပြီး အဖြေကို `JoinKaigi`.

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

ရေစီးကြောင်းတွေကို သင့်ရဲ့ UI သာမန်ဗီဒီယိုအစိတ်အပိုင်းများဖြင့်:

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

## ဧည့်သည်: အစည်းအဝေးကို ဆက်သွယ်ရန် ဖန်တီးပါ {#host-create-a-meeting-link}

အိမ်ရှင်စီးဆင်းမှု

1. ဖွင့်ထားတဲ့ ကင်မရာနဲ့ မိုက်ခရိုဖုန်း
2. create a ကို Kaigi signal key pair များ
3. create a ကို WebRTC ကမ်းလှမ်းချက်
4. တင်ပြပါ `CreateKaigi`
5. ဖိတ်ကြားမှု link ကို မျှဝေပါ

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

ပြပွဲ `inviteLink` သင့်မှာ UI. သုံးစွဲသူက ဒါကို ကူးယူနိုင်တယ်၊ အခြားဘတ်ဂျက်မှာ ဖွင့်နိုင်တယ်။
(သို့) app လမ်းကြောင်းတစ်ခုအဖြစ် ပြောင်းလိုက်ပါ

```ts
export function inviteRoute(inviteLink: string): string {
  const invite = parseInviteLink(inviteLink);
  return `/kaigi?call=${encodeURIComponent(invite.callId)}&secret=${encodeURIComponent(
    invite.inviteSecretBase64Url,
  )}`;
}
```

## ဧည့်သည်: အစည်းအဝေးကို တက်ရောက်ပါ {#guest-join-a-meeting}

ဧည့်သည် စီးဆင်းမှု:

1. ဖိတ်ကြားချက်ကို ဆန်းစစ်ပါ
2. ကုဒ်သွင်းထားတဲ့ ဖုန်းခေါ်ဆိုမှု ကမ်းလှမ်းချက်ကို Torii
3. create a ကို WebRTC အဖြေ
4. တင်ပြပါ `JoinKaigi` စကားဝှက်ထားတဲ့ အဖြေ metadata နဲ့

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

အစည်းအဝေးက ပွင့်လင်းမြင်သာတယ်ဆိုရင် wallet display string ကို
ကိုယ်ရေးကိုယ်တာ အစည်းအဝေးများအတွက် `walletIdentity` user ကမသတ်မှတ်ဘူးဆိုရင်
ဒါကို ရှင်းလင်းစွာ ဖော်ပြဖို့ ရွေးချယ်တယ်။

## အိမ်ရှင်: ဧည့်သည်ရဲ့ အဖြေကို အသုံးချပါ {#host-apply-the-guest-answer}

တိုက်ရိုက် အစည်းအဝေးတစ်ခု ဖန်တီးပြီးနောက် အိမ်ရှင်က ကြည့်သင့်တယ်။ Kaigi ဖြစ်ရပ်များနှင့် မဲဆန္ဒပြပွဲများ
ကုဒ်သွင်းထားတဲ့ အဖြေ အချက်ပြမှုတွေပါ။ ပထမဆုံး မှန်ကန်တဲ့ အဖြေကို အိမ်ရှင်ရဲ့ peer
ဆက်သွယ်မှု။

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

ပြန်ပို့ထားသော စာရင်းကို သိုလှောင်ပါ ID ဒီတော့ သင့်ရဲ့ UI စောင့်ကြည့်သူကို ရပ်တန့်နိုင်တယ်
အိမ်ရှင်က ချိတ်လိုက်တယ်၊ ဒါမှမဟုတ် ထွက်သွားတယ်

## အစည်းအဝေး အဆုံးသတ် {#end-the-meeting}

၎င်းကို ဖန်တီးခဲ့သော host account မှခေါ်ဆိုမှုကို အဆုံးသတ်ပါ

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

## ပုဂ္ဂလိက ပုံစံမှ ရင်းနှီးမြှုပ်နှံမှု {#private-mode-funding}

ပုဂ္ဂလိက Kaigi ဖန်တီးခြင်း၊ ပေါင်းစည်းခြင်းနှင့် အဆုံးသတ်ခြင်း လုပ်ငန်းများအတွက် ကာကွယ်မှုလိုအပ်နိုင်သည် XOR အတွက်
သင့်ရဲ့ app က အဲဒီအမှားကို ဖမ်းယူပြီး
ထပ်မံကြိုးစားခင် Self-Shield လုပ်ပါ။

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

ဒီမိုမှာ UI self-shield လုပ်ဖို့ user ကို တိုက်တွန်းပြီး နောက်မှာ
မူလဖန်တီးခြင်း (သို့) ပါဝင်မှု။

## လက်စွဲကျဆင်းခြင်း {#manual-fallback}

အလိုအလျောက် အချက်ပြမှုဟာ တိုက်ရိုက် ငွေကြေးဝယ်စက်ပေါ် မူတည်ပါတယ်။ Kaigi- အရည်အချင်းရှိသူ Torii လမ်းကြောင်းများနှင့်
private mode မှာ proof generation လုပ်ပါ။ development အတွက် manual fallback ကို ထိန်းထားပြီး
ကန့်သတ်ထားတဲ့ ပတ်ဝန်းကျင်များ:

- သင်က `CreateKaigi` ကျရှုံးရင် လက်စွဲဖိတ်စာကို ပြပေးပါ
- သင်က `JoinKaigi` ကျရှုံးသွားရင် ရိုးရိုး အဖြေကို ပြပေးပါ
- host က reply packet ကို paste လုပ်ပြီး call လုပ်ပေးပါ `setRemoteDescription`

Manual fallback သည် debugging အတွက် အသုံးဝင်သည်။ WebRTC, ဒါပေမဲ့
အွန်လိုင်းပေါ်က သီးသန့် အချက်ပြမှု အာမခံချက်များနှင့်အတူ Kaigi စီးဆင်းမှု။

## စမ်းသပ်မှု စစ်ဆေးစာရင်း {#test-checklist}

ယူနစ် စမ်းသပ်မှုအတွက် တံတားကို လှောင်ပြောင်ပြီး သင့်ရဲ့ UI မျှော်မှန်းထားတာကို ကျော်လွန်
Kaigi အသုံးဝင်သော ဝန်ဆောင်မှုများ:

- host က ဒေသတွင်းမီဒီယာတွေကို ဖန်တီးပြီး တင်ပေးတယ်။ `createKaigiMeeting`
- host က display လုပ်ပေးတယ် `iroha://kaigi/join?call=...&secret=...` ဖိတ်ကြားခြင်း
- ဧည့်သည်က ဖိတ်ကြားချက်ကို လေ့လာ၊ ဖုန်းခေါ်ဆို `getKaigiCall`, တင်ပြချက်
  `joinKaigiMeeting`
- ဖြေကြားချက် အချက်ပြမှုအတွက် စစ်တမ်းကောက်ခံသူ (သို့) နာရီများကို အသုံးပြုပြီး အဖြေကို သုံးပါတယ်။
- private mode မှာ self-shield လုပ်ဖို့ အချက်ပြချက်တွေ shielded ဖြစ်တဲ့အခါ XOR ပျောက်နေပြီ
- လက်ကိုင် fallback ပေါ်လာမှာဖြစ်ပြီး live signal မရောက်ရှိတဲ့အခါ

အပြည့်အစုံ Reference Test Suite ကို demo app ရဲ့ Kaigi ကြည့်ရှုခြင်းနှင့် ကြိုတင်တင်တင်သွင်းခြင်း
တံတားစမ်းသပ်ချက်:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
```

နိုင်ငံခြားရေး UI မီးခိုးစမ်းသပ်ချက်က `/kaigi` လမ်းကြောင်းထုတ်ပြန်ချက်။ တကယ့် မီဒီယာ စမ်းသပ်မှု
ငွေကြေးထောက်ပံ့ထားတဲ့ ငွေစက္ကူ နှစ်လုံးနဲ့ ပြတင်းပေါက် (၂) လုံး ဒါမှမဟုတ် ကိရိယာတွေ လိုအပ်နေသေးတယ်
လက်မှတ်ရေးထိုးခြင်း၊ ကင်မရာ၊ မိုက်ခရိုဖုန်းများနှင့် WebRTC ခွင့်ပြုချက်တွေဟာ Runtime နဲ့ မတူပါဘူး။

သင်ဟာ TAIRA ဖုန်းခေါ်ဆိုမှုဆိုင်ရာ လမ်းကြောင်း ပြန်ပို့ချက်များ `404`, ပထမဦးဆုံး
host wallet ကို အောင်မြင်စွာ တင်ပြထားကြောင်း အတည်ပြုပါ။ `CreateKaigi`. Relay ကျန်းမာရေး
နောက်ဆုံးအချက်အလက်တွေဟာ အထူးခေါ်ဆိုမှုတစ်ခုခု မဖြစ်ခင်မှာ ရနိုင်တာပါ။

## နောက်တစ်ဆင့် {#next-steps}

- အသုံးပြုမှု မှတ်တမ်းကို `RecordKaigiUsage` သင့်ရဲ့ app မှာ ယုံကြည်မှုရှိတဲ့အခါ
  အစည်းအဝေးသက်တမ်းစာရင်း။
- မှတ်ပုံတင်ပြီး စောင့်ကြည့်တဲ့ relays တွေကို ဖြတ်သန်းပါ။ `/v1/kaigi/relays` Relay ကိုသုံးတဲ့အခါ
  လက္ခဏာတွေ
- မျက်နှာပြင် `KaigiRosterSummary`, `KaigiUsageSummary`, နှင့်
  `KaigiRelayHealthUpdated` operator dashboard ထဲက ဖြစ်ရပ်တွေပေါ့။
