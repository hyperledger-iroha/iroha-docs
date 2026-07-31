---
translation_locale: ur
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: e55c7aebc89c39edb8e7077db2414a6d432aafb05aff8df04c248fce444d7dea
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kaigi کو ایک JavaScript ایپ میں شامل کیا گیا {#embed-kaigi-in-a-javascript-app}

Kaigi ایک ایپلی کیشن کو بٹوے کے ذریعہ بیکڈ ون ٹو ون آڈیو / ویڈیو میٹنگز تخلیق کرنے دیتا ہے جس کا لائف سائیکل Iroha کے ذریعے ریکارڈ کیا جاتا ہے۔ براؤزر اب بھی میڈیا کو WebRTC کے ساتھ سنبھالتا ہے ، جبکہ Torii اور Kaigi ہدایات دیرپا میٹنگ ریکارڈ فراہم کرتی ہیں ، خفیہ کردہ سگنلنگ میٹا ڈیٹا۔ نجی فہرست کی حمایت، اور استعمال کے واقعات.

اس سبق میں [Iroha ڈیمو JavaScript](https://github.com/soramitsu/iroha-demo-javascript) ایپ کی طرف سے استعمال کردہ کم از کم انٹیگریشن پیٹرن دکھایا گیا ہے:

- رینڈر WebRTC کی پیشکش اور جوابات تیار کرتا ہے
- ایک درخواست پل پر دستخط کرتا ہے اور Kaigi ٹرانزیکشن پیش کرتا ہے۔
- کمپیکٹ دعوت لنکس صرف کال ID پر مشتمل ہیں اور خفیہ دعوت دیتے ہیں۔
- میزبان Torii خفیہ کردہ شرکاء کے جوابات کی نگرانی کرتا ہے۔

مثالیں TypeScript کا استعمال کرتی ہیں اور اس طرح لکھے گئے ہیں کہ وہ الیکٹران ، ایک محفوظ بیک اینڈ والے براؤزر میں چل سکتے ہیں ، یا پرس کی توسیع والی ویب ایپلیکیشن۔ پیداوار میں نجی چابیاں غیر قابل اعتماد رینڈر کوڈ سے باہر رکھیں۔

## لازمی شرائط {#prerequisites}

آپ کو ضرورت ہے:

- ایک Kaigi قابل Torii اختتامی نقطہ
- میزبان اور مہمان کا حساب
- ایک محفوظ ایپ پل یا بٹوے کے ذریعے ہر اکاؤنٹ کی دستخط کلید تک رسائی۔
- براؤزر کیمرہ / مائکروفون کی اجازتیں
- اگر آپ Node.js ڈیمو یا مقامی `@iroha/iroha-js` بائنڈنگ براہ راست استعمال کررہے ہیں تو JavaScript 20+

مکمل کام کرنے والے حوالہ کے لئے، Iroha ذریعہ چیک آؤٹ کے ساتھ ڈیمو کلون کریں:

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

Iroha سورس ریپوزٹری سے [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js) کے ساتھ ڈیمو کا استعمال کریں۔ اس کی `file:` انحصار براہ راست چیک آؤٹ کو حل کرتی ہے۔ اگر مقامی پابندیاں تبدیل ہوجاتی ہیں تو ، اسے `iroha/javascript/iroha_js` کے تحت دوبارہ بنائیں۔ ایک صاف پیکج ڈائرکٹری میں کارگو ورک اسپیس نہیں ہوتا ہے جس کی ضرورت ہے `npm run build:native` .

TAIRA پر براہ راست میٹنگ چلانے سے پہلے، عوامی سطح Torii کو چیک کریں جس پر ڈیمو انحصار کرتا ہے:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/v1/kaigi/relays"
curl -fsS "$TAIRA/v1/kaigi/relays/health"
```

یہ کمانڈ اس بات کی تصدیق کرتے ہیں کہ TAIRA براہ راست ہے اور Kaigi ریلے ٹیلی میٹری دستیاب ہے۔ وہ Kaigi ٹرانزیکشنز پیش نہیں کرتے ہیں۔ ایک حقیقی `CreateKaigi` یا `JoinKaigi` ٹیسٹ کے لئے TAIRA اکاؤنٹس کو فنڈ کرنے اور ڈیمو کے پل یا کسی دوسرے پرس کے ذریعے دستخط کرنے کی ضرورت ہوتی ہے۔

## فن تعمیر {#architecture}

Kaigi انٹیگریشن کو تین تہوں میں تقسیم کریں:

|پرت |ذمہ داری |
| --- | --- |
|UI |اکاؤنٹ کا انتخاب، میٹنگ فارم، دعوت نامہ لنک ڈسپلے، میڈیا کنٹرول |
|WebRTC |`RTCPeerConnection` ، مقامی میڈیا، پیشکش اور جواب کی تفصیلات |
|Iroha پل |دستخط، `CreateKaigi`، `JoinKaigi`، `EndKaigi`، سگنل پولنگ |

ایپ پل ایک الیکٹران پری لوڈ ہوسکتا ہے API ، پرس کی توسیع ، یا بیک اینڈ اختتام پوائنٹ۔ اس سے ایک چھوٹی سی سطح کو UI کے سامنے رکھنا چاہئے:

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

ڈیمو ایپ میں ، یہ پل کے طریقے `@iroha/iroha-js` ، مقامی دستخط ، خفیہ کردہ Kaigi میٹا ڈیٹا ، اور Torii کالز کے ساتھ نافذ کیے جاتے ہیں۔

## مدد کرنے والوں کو مدعو کریں {#invite-helpers}

Torii کے ساتھ ہم آہنگ کال IDs کو `domain.dataspace:meeting` فارم میں استعمال کریں۔ ڈیمو میں پیدا ہونے والی ملاقاتوں کے لئے `kaigi.universal:<call-name>` کا استعمال کیا جاتا ہے۔

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

## WebRTC مددگار {#webrtc-helpers}

میزبان ایک پیش کش تخلیق کرتا ہے ، اسے `CreateKaigi` کے ذریعے اسٹور کرتا ہے ، اور کھڑکی کو کھلا رکھتا ہے تاکہ وہ مہمان کا جواب لاگو کرسکے۔ مہمان خفیہ کردہ پیش کش کو لے جاتا ہے ، جواب تیار کرتا ہے اور اس کا جواب `JoinKaigi` کے ساتھ پوسٹ کرتا ہے۔

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

UI کو عام ویڈیو عناصر کے ساتھ سلسلہ جات منسلک کریں:

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

## میزبان: ایک ملاقات کا لنک بنائیں {#host-create-a-meeting-link}

میزبان بہاؤ:

1. کھلی کیمرہ اور مائکروفون
2. ایک Kaigi سگنل کلیدی جوڑی بنائیں
3. ایک WebRTC پیشکش بنائیں
4. `CreateKaigi` جمع کروانا
5. ایک جامع دعوت لنک کا اشتراک کریں

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

`inviteLink` کو اپنے UI میں دکھائیں۔ صارف اسے کاپی کرسکتا ہے ، اسے کسی دوسرے بٹوے میں کھول سکتا ہے ، یا اسے ایپ کے راستے میں تبدیل کرسکتا ہے جیسے:

```ts
export function inviteRoute(inviteLink: string): string {
  const invite = parseInviteLink(inviteLink);
  return `/kaigi?call=${encodeURIComponent(invite.callId)}&secret=${encodeURIComponent(
    invite.inviteSecretBase64Url,
  )}`;
}
```

## مہمان: ایک اجلاس میں شرکت کریں {#guest-join-a-meeting}

مہمانوں کا بہاؤ:

1. دعوت نامے کا تجزیہ کریں
2. Torii سے خفیہ کردہ کال کی پیش کش حاصل کریں۔
3. ایک WebRTC جواب بنائیں
4. `JoinKaigi` کو خفیہ کردہ جواب میٹا ڈیٹا کے ساتھ جمع کروائیں۔

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

اگر میٹنگ شفاف ہے تو ، آپ جوائن کی درخواست میں پرس ڈسپلے سٹرنگ شامل کرسکتے ہیں۔ نجی ملاقاتوں کے ل `walletIdentity` کو غیر ترتیب دیں جب تک کہ صارف واضح طور پر اس کا انکشاف کرنے کا انتخاب نہ کریں۔

## میزبان: مہمانوں کے جواب پر عمل کریں {#host-apply-the-guest-answer}

ایک لائیو میٹنگ بنانے کے بعد ، میزبان کو Kaigi واقعات دیکھنا چاہئے اور خفیہ کردہ جواب سگنل کے لئے سروے کرنا چاہئے۔ میزبان کے ہم مرتبہ کنکشن پر پہلا درست جواب لاگو کریں۔

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

واپس کی گئی رکنیت ID کو ذخیرہ کریں تاکہ آپ کا UI میزبان بند ہونے یا دور جانے پر ناظرین کو روک سکے۔

## میٹنگ کا اختتام {#end-the-meeting}

اسی میزبان اکاؤنٹ سے کال کو ختم کریں جس نے اسے بنایا تھا:

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

## پرائیویٹ موڈ میں فنڈنگ {#private-mode-funding}

نجی Kaigi تخلیق ، شمولیت اور اختتامی آپریشنز کو نجی انٹری پوائنٹ فیس کے ل shielded XOR کی ضرورت پڑسکتی ہے۔ آپ کی ایپ کو اس غلطی کو پکڑنا چاہئے اور دوبارہ کوشش کرنے سے پہلے خود شیلڈ کارروائی پیش کرنا چاہئے۔

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

ڈیمو میں ، UI صارف کو خود بچانے کی ترغیب دیتا ہے اور پھر اصل تخلیق یا شمولیت کا دوبارہ کوشش کرتا ہے۔

## مینوئل فال بیک {#manual-fallback}

خود کار طریقے سے سگنلنگ ایک زندہ بٹوے، Kaigi کے قابل Torii راستوں اور نجی موڈ میں ثبوت کی پیداوار پر منحصر ہے. ترقی اور محدود ماحول کے لئے دستی پسماندہ رکھیں:

- اگر `CreateKaigi` ناکام ہو جائے تو، پیشکش پر مشتمل دستی دعوت نامہ دکھائیں
- اگر `JoinKaigi` ناکام ہو جائے تو، خام جواب پیکج دکھائیں
- میزبان کو جواب پیکٹ چسپاں کرنے دیں اور `setRemoteDescription` پر کال کریں۔

دستی فال بیک ڈیبگنگ WebRTC کے لئے مفید ہے، لیکن یہ Kaigi براہ راست بہاؤ کے طور پر نجی آن چین سگنلنگ کی ضمانت نہیں دیتا.

## ٹیسٹ چیک لسٹ {#test-checklist}

یونٹ ٹیسٹوں کے لئے، پل کا مذاق اڑائیں اور اس بات کی تصدیق کریں کہ آپ UI متوقع Kaigi مفید بوجھ سے گزرتا ہے:

- میزبان مقامی میڈیا تخلیق کرتا ہے اور `createKaigiMeeting` جمع کراتا ہے۔
- میزبان ایک `iroha://kaigi/join?call=...&secret=...` دعوت ظاہر کرتا ہے
- مہمان دعوت کو تجزیہ کرتا ہے، `getKaigiCall` پر کال کرتا ہے اور `joinKaigiMeeting` جمع کراتا ہے.
- میزبان سروے یا جواب کے اشارے کے لئے گھڑیاں اور جواب کا اطلاق کرتا ہے
- جب حفاظتی XOR غائب ہو تو پرائیویٹ موڈ میں خود بچانے کے لئے اشارے۔
- جب براہ راست سگنلنگ دستیاب نہیں ہے تو دستی فال بیک ظاہر ہوتا ہے۔

ایک مکمل ریفرنس ٹیسٹ سویٹ کے لئے، ڈیمو ایپ کی Kaigi نقطہ نظر اور پری لوڈ پل ٹیسٹ دیکھیں:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
```

UI دھواں ٹیسٹ اس بات کی تصدیق کرتا ہے کہ `/kaigi` راستہ انجام دیتا ہے۔ ایک حقیقی میڈیا ٹیسٹ کو ابھی بھی دو فنڈ والے بٹوے اور دو کھڑکیوں یا آلات کی ضرورت ہوتی ہے کیونکہ ٹرانزیکشن دستخط ، کیمرہ ، مائکروفون ، اور WebRTC اجازتاں رن ٹائم کے لحاظ سے مختلف ہیں۔

اگر آپ TAIRA کے مقابلے میں ٹیسٹ کر رہے ہیں اور کال مخصوص روٹ `404` لوٹاتا ہے تو ، پہلے اس بات کی تصدیق کریں کہ میزبان بٹوے کو کامیابی سے جمع کرایا گیا ہے `CreateKaigi`. ریلے صحت کے اختتامی پوائنٹس کسی خاص کال کے وجود سے پہلے دستیاب ہوسکتے ہیں۔

## اگلے اقدامات {#next-steps}

- `RecordKaigiUsage` کے ساتھ استعمال ریکارڈنگ شامل کریں جب آپ کی ایپ میں سیشن کی مدت کا قابل اعتماد اکاؤنٹنگ ہو۔
- ریلے مینفیس کا استعمال کرتے ہوئے `/v1/kaigi/relays` کے ذریعے رلیوں کو رجسٹر اور مانیٹر کریں۔
- آپریٹر ڈیش بورڈ میں سطح `KaigiRosterSummary` ، `KaigiUsageSummary`، اور `KaigiRelayHealthUpdated` واقعات.
