---
translation_locale: my
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: e55c7aebc89c39edb8e7077db2414a6d432aafb05aff8df04c248fce444d7dea
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ထည့်သွင်းထားသည် Kaigi a တွင် JavaScript App ကို {#embed-kaigi-in-a-javascript-app}

Kaigi သည်ပရိုဂရမ်တစ်ခုအတွက် Wallet အားထောက်ပံ့ပြီး တစ်မှတစ်ဆင့် အသံ / ဗီဒီယို အစည်းအဝေးများကိုဖန်တီးခွင့်ပေးသည်၊ ၎င်း၏သက်တမ်းပတ်လည်ကို Iroha မှတစ်ဆင့် မှတ်တမ်းတင်ထားသည်။ ရှာဖွေရေးကိရိယာသည် WebRTC ဖြင့် မီဒီယာများကို ဆက်လက်ကိုင်တွယ်နေဆဲဖြစ်ပြီး Torii နှင့် Kaigi ညွှန်ကြားချက်များသည် ရေရှည်တည်တံ့သော အစည်းအုံမှတ်တမ်း, ကုဒ်သွင်းထားတဲ့ အချက်ပြမှု metadata များကိုရရှိစေသည်။ ပုဂ္ဂလိက စာရင်းထောက်ပံ့မှု၊ အသုံးပြုမှုဖြစ်ရပ်များ။

ဤသင်ခန်းစာသည် [Iroha Demo JavaScript](https://github.com/soramitsu/iroha-demo-javascript) app မှအသုံးပြုသော အနည်းဆုံးပေါင်းစပ်မှုပုံစံကိုပြသသည်-

- ပေးပို့သူက WebRTC ကမ်းလှမ်းချက်များနှင့် အဖြေများကို ဖန်တီးသည်။
- လျှောက်လွှာတံတားမှတ်ပုံတင်ပြီး Kaigi ငွေပေးချေမှု တင်ပြသည်
- တိုက်ရိုက်ဖိတ်ကြားမှု လင့်ခ်များမှာ ဖိတ်ကြားချက် ID ကိုသာ ထည့်သွင်းထားပြီး လျှို့ဝှက်ဖိတ်ကြားချက်ပါ။
- အိမ်ရှင်က Torii ကို ပံ့ပိုးပြီး ပါဝင်သူရဲ့ ဖြေကြားချက်တွေကို စောင့်ကြည့်တယ်။

ဥပမာများမှာ TypeScript ကိုသုံးပြီး Electron, လုံခြုံတဲ့ backend ရှိသော browser သို့မဟုတ် wallet extension ရှိသော web app တွင် run လုပ်နိုင်ရန် ရေးသားထားသည်။ ထုတ်လုပ်မှုအတွင်းတွင် မယုံကြည်သည့် renderer code အပြင်သို့ သီးသန့် key များကို ထိန်းသိမ်းပါ။

## လိုအပ်ချက်များ {#prerequisites}

မင်းလိုအပ်တာက

- Kaigi အရည်အချင်းရှိသော Torii အဆုံးမှတ်
- အိမ်ရှင်အတွက်စာရင်းနဲ့ ဧည့်သည်အတွက်စာရင်း
- လုံခြုံတဲ့ app တံတား (သို့) ပိုက်ဆံအိတ်မှတစ်ဆင့် အကောင့်တစ်ခုစီရဲ့ လက်မှတ်ရေးထိုးမှု သော့ကို ဝင်ရောက်နိုင်ခြင်း
- Browser Camera/microphone ခွင့်ပြုချက်များ
- Node.js 20+ သင်က JavaScript demo သို့မဟုတ် native `@iroha/iroha-js` binding ကို တိုက်ရိုက်အသုံးပြုနေပါက

Full Working Reference အတွက် Iroha source checkout အနားမှာ demo ကို clone လုပ်ပါ။

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

Demo ကိုသုံးပါ [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js) ညီမလေးဆီက Iroha အရင်းအမြစ် သိုလှောင်ခန်း။ `file:` မူလဘိန်းချိတ်ဆက်မှု ပြောင်းလဲရင် `iroha/javascript/iroha_js`; သန့်ရှင်းတဲ့ Package Directory မှာ Cargo အလုပ်ခွင်ကို မပါပါဘူး။ `npm run build:native`.

TAIRA တွင် တိုက်ရိုက် အစည်းအဝေးကို မလုပ်ခင်၊ demo မှီခိုနေသော အများပြည်သူ Torii မျက်နှာပြင်ကို စစ်ဆေးပါ:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/v1/kaigi/relays"
curl -fsS "$TAIRA/v1/kaigi/relays/health"
```

ဤအမိန့်များသည် TAIRA သည်လက်ရှိဖြစ်ကြောင်းနှင့် Kaigi relay telemetry ကိုရရှိနိုင်သည်ကိုစစ်ဆေးသည်။ ၎င်းတို့သည်Kaigi ငွေပေးချေမှုများကို မတင်သွင်းကြပါ။ စစ်မှန်သော `CreateKaigi` သို့မဟုတ် `JoinKaigi` စမ်းသပ်မှုအတွက် TAIRA အကောင့်များမှ ရံပုံငွေလိုအပ်ပြီး demo ၏တံတား (သို့မဟုတ်) အခြား wallet backed တံတားတစ်ခုမှတစ်ဆင့် လက်မှတ်ထိုးရန် လိုအပ်ပါသည်။

## ဗိသုကာ {#architecture}

Kaigi ပေါင်းစပ်မှုကို အလွှာသုံးခုအဖြစ် ခွဲထားပါ။

|အလွှာ |တာဝန်ယူမှု |
| --- | --- |
|UI |အကောင့်ရွေးချယ်မှု၊ အစည်းအဝေးပုံစံ၊ ဖိတ်ကြားချက် လင့်ခ် ပြသခြင်း၊ မီဒီယာ ထိန်းချုပ်မှု |
|WebRTC |`RTCPeerConnection`, ဒေသတွင်းမီဒီယာများ၊ ကမ်းလှမ်းချက်နှင့်ဖြေကြားမှုဖော်ပြချက်များ |
|Iroha တံတား |လက်မှတ်ရေးထိုးခြင်း `CreateKaigi`, `JoinKaigi`, `EndKaigi`၊ အချက်ပြချက်တွက်ချက်မှု |

App တံတားသည် Electron preload API, wallet extension သို့မဟုတ် backend endpoint ဖြစ်နိုင်သည်။ ၎င်းသည် UI သို့အသေးစားမျက်နှာပြင်ကိုပြသသင့်ပါသည်။

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

ဒီမို app မှာ bridge method တွေကို `@iroha/iroha-js`, ဒေသခံ လက်မှတ်ထိုးခြင်း, encrypted Kaigi metadata နဲ့ Torii calls တို့နဲ့ အကောင်အထည်ဖော်ပါတယ်။

## အကူအညီပေးရန် ဖိတ်ကြား {#invite-helpers}

အသုံးပြုခြင်း Torii- ကိုက်ညီတဲ့ ဖုန်းခေါ်ဆိုမှု IDs အထဲမှာ `domain.dataspace:meeting` ဖိုရမ်ကို သုံးပါတယ်။ `kaigi.universal:<call-name>` အစည်းအဝေးတွေ ဖြစ်ပေါ်ဖို့ပါ။

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

အိမ်ရှင်က ကမ်းလှမ်းချက်ကို ဖန်တီးပြီး `CreateKaigi` ကို သိမ်းဆည်းထားပြီး ဧည့်သည်ရဲ့ အဖြေကို အသုံးပြုနိုင်အောင် ပြတင်းပေါက်ကို ဖွင့်ထားတယ်။ ဧည့်သည်က ကုဒ်သွင်းထားတဲ့ ကမ်းလှစ်မှုကိုယူပြီး ဖြေကြားချက်တစ်ခုဖန်တီးကာ `JoinKaigi` ဖြင့် တုံ့ပြန်တဲ့ စာသားတွေကို တင်ပါတယ်။

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

UI ကို သာမန်ဗီဒီယိုအစိတ်အပိုင်းများဖြင့် stream များကို ချိတ်ဆက်ပါ:

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

## ဧည့်သည်များ: အစည်းအဝေးကို ဆက်သွယ်ရန် Link ကို ဖန်တီးပါ။ {#host-create-a-meeting-link}

အိမ်ရှင်စီးဆင်းမှု:

1. ဖွင့်ထားတဲ့ ကင်မရာနဲ့ မိုက်ခရိုဖုန်း
2. Kaigi signal key pair ကို ဖန်တီးပါ။
3. WebRTC ကမ်းလှမ်းချက် ဖန်တီးပါ။
4. `CreateKaigi` ကို တင်ပြပါ။
5. compact invite link ကို မျှဝေပါ။

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

`inviteLink` ကို သင့်ရဲ့ UI မှာပြပါ။ အသုံးပြုသူက ဒါကို ကူးယူနိုင်တယ်၊ အခြားဘတ်ဂျက်မှာ ဖွင့်နိုင်တယ်၊ (သို့) app လမ်းကြောင်းတစ်ခုအဖြစ် ပြောင်းနိုင်တယ်။ ဥပမာ:

```ts
export function inviteRoute(inviteLink: string): string {
  const invite = parseInviteLink(inviteLink);
  return `/kaigi?call=${encodeURIComponent(invite.callId)}&secret=${encodeURIComponent(
    invite.inviteSecretBase64Url,
  )}`;
}
```

## ဧည့်သည်များ: အစည်းအဝေးသို့ တက်ရောက်ပါ {#guest-join-a-meeting}

ဧည့်သည် စီးဆင်းမှု:

1. ဖိတ်ကြားစာကို ဆန်းစစ်ပါ။
2. Torii မှ ကုဒ်သွင်းထားသော ဖုန်းခေါ်ဆိုမှု ကမ်းလှမ်းချက်ကိုယူပါ။
3. WebRTC အဖြေကို ဖန်တီးပါ။
4. `JoinKaigi` ကို ကုဒ်သွင်းထားတဲ့ အဖြေ metadata တွေနဲ့ တင်ပြပါ။

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

အစည်းအဝေးက ပွင့်လင်းမြင်သာမှုရှိပါက join request တွင် wallet display string ကို ထည့်သွင်းနိုင်သည်။ အသုံးပြုသူက ရှင်းလင်းစွာ ဖော်ပြဖို့ ရွေးချယ်မှလွဲ၍ ပုဂ္ဂလိကအစည်းအဝေးများအတွက် `walletIdentity` ကို unsettled ထားပါ။

## အိမ်ရှင်: ဧည့်သည်ရဲ့ အဖြေကို အသုံးချပါ။ {#host-apply-the-guest-answer}

တိုက်ရိုက် အစည်းအဝေးတစ်ခု ဖန်တီးပြီးနောက် အိမ်ရှင်သည် Kaigi ဖြစ်ရပ်များကို ကြည့်ရှုသင့်ပြီး ကုဒ်သွင်းထားသော အဖြေအချက်ပြချက်များအတွက် စစ်ဆေးသင့်သည်။ ပထမဆုံးမှန်ကန်သောအဖြေကို အိမ်ရှင်၏တူချင်းဆက်သွယ်မှုသို့ သက်ရောက်စေပါ။

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

ပြန်ပို့ထားတဲ့ subscription ID ကို သိုလှောင်ထားပါ။ ဒီတော့ သင့်ရဲ့ UI ဟာ host က ချိတ်လိုက်တဲ့အခါ (သို့) ထွက်သွားတဲ့အခါ စောင့်ကြည့်သူကို ရပ်တန့်နိုင်ပါတယ်။

## အစည်းအဝေး အဆုံးသတ် {#end-the-meeting}

ဒါကို ဖန်တီးခဲ့တဲ့ Host Account ကနေ Call ကို အဆုံးသတ်ပါ:

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

## ပုဂ္ဂလိကနည်းဖြင့် ငွေကြေးထောက်ပံ့မှု {#private-mode-funding}

Private Kaigi create, join, and end operations များသည် private entry point fee အတွက် shielded XOR ကိုလိုအပ်နိုင်သည်။ သင်၏ app သည် ထိုအမှားကိုဖမ်းမိပြီး ထပ်မံကြိုးစားရန်မတိုင်မီ self-shield လုပ်ရပ်တစ်ခု ပေးသင့်သည်။

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

ဒီမိုမှာ UI က user ကို self-shield လုပ်ခိုင်းပြီးနောက် မူလ create (သို့) join လုပ်ဆောင်မှုကို ထပ်မံကြိုးစားတယ်။

## လက်စွဲကျဆင်းခြင်း {#manual-fallback}

အလိုအလျောက် အချက်ပြမှုသည် သက်ရှိဘတ်ဂျက်၊ Kaigi-စွမ်းဆောင်နိုင်သော Torii လမ်းကြောင်းများနှင့် ပုဂ္ဂလိကပုံစံတွင် သက်သေခံထုတ်လုပ်မှုအပေါ် မူတည်သည်။ ဖွံ့ဖြိုးတိုးတက်ရေးနှင့် ကန့်သတ်ထားသည့် ပတ်ဝန်းကျင်များအတွက် လက်ကိုင်ကျော့ပြန်မှုကို ထိန်းသိမ်းပါ။

- `CreateKaigi` ကျရှုံးခဲ့ရင် ကမ်းလှမ်းချက်ကို ပါတဲ့ လက်စွဲဖိတ်စာကို ပြသပါ။
- `JoinKaigi` ကျရှုံးခဲ့ရင် ရိုးရိုး အဖြေအိတ်ကို ပြပေးပါ။
- host က reply packet ကို paste လုပ်ပြီး `setRemoteDescription` ကို ဖုန်းဆက်ပေးပါ။

WebRTC ကို Debug လုပ်ရာတွင် Manual Fallback သည် အသုံးဝင်သော်လည်း တိုက်ရိုက် Kaigi စီးဆင်းမှုနှင့်တူသော ပုဂ္ဂလိက on-chain အချက်ပြမှု အာမခံချက်များကို မပေးပါ။

## စမ်းသပ်မှု စစ်ဆေးစာရင်း {#test-checklist}

တစ်စိတ်တစ်ပိုင်း စမ်းသပ်မှုအတွက် တံတားကို လှည့်စားပြီး သင့် UI သည်မျှော်လင့်ထားသော Kaigi အသုံးဝင်ဝန်ဆောင်မှုတွေကို ကျော်လွှားသည်ဆိုပါစို့။

- အိမ်ရှင်က ဒေသတွင်းမီဒီယာကို ဖန်တီးပြီး `createKaigiMeeting` ကိုတင်ပေးတယ်။
- အိမ်ရှင်က `iroha://kaigi/join?call=...&secret=...` ဖိတ်ကြားချက်ကို ပြသပေးသည်။
- ဧည့်သည်က ဖိတ်ကြားချက်ကို စစ်ဆေးပြီး `getKaigiCall` သို့ ဖုန်းခေါ်ဆိုကာ `joinKaigiMeeting` ကို တင်ပြသည်။
- ဖြေကြားချက် အချက်ပြမှုတွေကို လက်ခံတဲ့ စစ်တမ်းတွေ (သို့) နာရီတွေကို သုံးပြီး အဖြေကို အသုံးချတယ်။
- private mode မှာ self-shielding လုပ်ဖို့ ညွှန်ကြားချက်များ XOR ကင်းမဲ့တဲ့အခါမှာ
- တိုက်ရိုက် အချက်ပြမှု မရရှိတဲ့အခါ manual fallback ပေါ်လာတယ်။

Reference test suite တစ်ခုလုံးကို demo app ရဲ့ Kaigi view နဲ့ preload bridge tests တွေကို ကြည့်ပါ။

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
```

UI မီးခိုးစမ်းသပ်မှုသည် `/kaigi` လမ်းကြောင်း၏ ရောင်ပြန်ကြားမှုကို စစ်ဆေးသည်။ တကယ့်မီဒီယာစမ်းသပ်မှုတွင် ငွေကြေးထောက်ပံ့ငွေအိတ်နှစ်လုံးနှင့် ပြတင်းပေါက် (သို့) ကိရိယာ နှစ်ခုလိုအပ်ပါသည်၊ အကြောင်းက ငွေပေးချေမှု လက်မှတ်ရေးထိုးခြင်း၊ ကင်မရာ၊ မိုက်ခရိုဖုန်းနှင့် WebRTC ခွင့်ပြုချက်များသည် လည်ပတ်ချိန်အရ ကွဲပြားခြင်းကြောင့်ဖြစ်သည်။

သင်က စမ်းသပ်နေရင် TAIRA ဖုန်းခေါ်ဆိုမှုအတွက် သီးသန့်လမ်းကြောင်းပြန်ပို့ချက်များ `404`, ပထမဆုံး Host Wallet ကို အောင်မြင်စွာ တင်ပြခဲ့တာကို အတည်ပြုပါ။ `CreateKaigi`. Relay Health Endpoints တွေကို သီးသန့်ခေါ်ဆိုမှု မဖြစ်ခင်မှာ ရယူနိုင်မှာပါ။

## နောက်တစ်ဆင့် {#next-steps}

- `RecordKaigiUsage` နဲ့ သုံးစွဲမှု မှတ်တမ်းတင်မှုကို ထည့်သွင်းပါ သင့်ရဲ့ app မှာ session duration accounting ကို အတည်ပြုနိုင်ရင်။
- `/v1/kaigi/relays` မှတစ်ဆင့် Relay Manifest များကို မှတ်တမ်းတင်ပြီး စောင့်ကြည့်ပါ။
- မျက်နှာပြင် `KaigiRosterSummary`, `KaigiUsageSummary`, နှင့် `KaigiRelayHealthUpdated` ဖြစ်ရပ်များတွင်သင်၏ operator dashboard တွင်။
