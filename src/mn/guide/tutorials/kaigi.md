---
translation_locale: mn
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: e55c7aebc89c39edb8e7077db2414a6d432aafb05aff8df04c248fce444d7dea
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Хөгжүүлсэн Kaigi а JavaScript Тэмцээн {#embed-kaigi-in-a-javascript-app}

Kaigi хэрэгсэл нь хөрөнгийн мөнгөний дэмжлэгтэй нэгээс нэг аудио / видео уулзалт хийх боломжийг олгодог
түүний амьдралын мөрийг Iroha. Бrowser нь хэвлэл мэдээллийн хэрэгслийг
WebRTC, цаашид Torii болон Kaigi Урьдчилсан уулзалтыг зааж өгөх
бүртгэл, шифрлэгдсэн сигналын мета өгөгдөл, хувийн жагсаалтын дэмжлэг, хэрэглээний үйл явдлууд.

Энэ сургалтын нь хамгийн бага интеграцийн загварыг харуулж байна
[Iroha Тэмцээн JavaScript](https://github.com/soramitsu/iroha-demo-javascript)
апп:

- түгээгч бий болгодог WebRTC санал, хариулт
- өргөдөлний гүүр тэмдэглэл, өргөн мэдүүлэг Kaigi гүйлгээ
- компакт уриалтын холболт зөвхөн уриалтыг авч байна ID Мөн нууцлан урьж байна
- Үйлчлүүлэгч цаг Torii оролцогчдын шифрлэсэн хариулт

Жишээ нь: TypeScript Electron, a
Бrowser нь аюулгүй бэкэндтэй эсвэл вэб аппликейшн нь мөнгөн тэмдэгтийн өргөтгөлийн
Үйлдвэрлэлд байгаа итгэмжлэгдсэнгүй рендерийн кодтой бус хувийн түлхүүр.

## Урьдчилсан шаардлага {#prerequisites}

Та:

- а Kaigi-Шилдэг хүн Torii эцсийн цэг
- зочид буудлын болон зочдын бүртгэл
- бүртгэлийн гарын үсэг зурах товчлогыг аюулгүй аппликейшнээр дамжуулан ашиглах
- Бrowser камер/микрофонны зөвшөөрөл
- Node.js 20+ хэрэглэж байгаа бол JavaScript демо эсвэл эх оронч
  `@iroha/iroha-js` шууд хамааралтай

Тодорхой ажлын сэнслэлийн тулд демонстраныг Iroha эх үүсвэр
Хөдөлмөрийн төлбөр:

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

Demo-ийг ашигла
[`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js)
ах дүүсээс Iroha Эх сурвалжийн хадгаламж `file:` хамааралтай байдал
Хэрэв үндсэн холболт өөрчлөгдөж байгаа бол түүнийг
`iroha/javascript/iroha_js`; цэвэр багцын жагсаалтад
Тавилга, тээврийн ажлын байр `npm run build:native`.

Цагдаагийн байгууллагын хуралдаанаар TAIRA, олон нийтэд шалгаарай Torii .
демо нь дараахь зүйлээс хамаарна:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/v1/kaigi/relays"
curl -fsS "$TAIRA/v1/kaigi/relays/health"
```

Эдгээр команд нь TAIRA амьд байна Kaigi Relay telemetry нь
Тэдгээрийг Kaigi Хөдөлмөрийн хэрэгсэл `CreateKaigi` эсвэл
`JoinKaigi` шалгалтын хэрэгцээг санхүүжүүлсэн TAIRA данс, демоны бүртгэлээр гарын үсэг зурах
гүүр, эсвэл өөр хөрөнгийн сантай гүүр.

## Архитектура {#architecture}

Хөөцөлдөх Kaigi интеграцийг гурван давхар хувааж:

| Хүрэлсүх | Хариуцлага |
| --- | --- |
| UI | дансны сонгон шалгаруулалт, уулзалт хэлбэр, уриалтын сүлжээний дэлгэц, хэвлэл мэдээллийн хяналт |
| WebRTC | `RTCPeerConnection`, орон нутгийн хэвлэл мэдээллийн хэрэгсэл, санал өгөх болон хариултын тодорхойлолт |
| Iroha гүүр | гарын үсэг зурах, `CreateKaigi`, `JoinKaigi`, `EndKaigi`, сигналын санал асуулга |

Хэрэглэлийн гүүр нь Electron-ийн өмнөх зарнаар байж болно API, хөрөнгийн өргөтгөлийг, эсвэл хориог
Энэ нь бага хэмжээний давхаргыг UI:

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

Demo app-д эдгээр гүүрний арга барилыг
`@iroha/iroha-js`, орон нутгийн гарын үсэг, нууцалт Kaigi металл мэдээлэл, Torii Зудлага.

## Хөдөлмөрийн туслагчдыг дуудлаа {#invite-helpers}

Хэрэглээ Torii-Хэрэглэмтэй дуудлага IDs Хөдөлмөрийн `domain.dataspace:meeting` Үргэлт.
хэрэглээ `kaigi.universal:<call-name>` зохион байгуулагдсан уулзалтууд.

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

## WebRTC Хөдөлмөрийн туслагчид {#webrtc-helpers}

Үйлчлөгч санал авдаг, үүнийг хадгалах `CreateKaigi`, болон хадгалах
Энэ нь зочдын хариултыг ашиглах боломжтой.
санал болгож, хариултыг бий болгодог бөгөөд хариуг `JoinKaigi`.

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

Захиргааны урсгалыг та бүхэнд UI энгийн видео элементтэй:

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

## Үйлчлүүлэгч: Хуралдааны холбоосыг байлга {#host-create-a-meeting-link}

Үйлчлүүлэгч урсгал:

1. нээлттэй камер, микрофон
2. . Kaigi сигналын цөмөрний хосууд
3. . WebRTC санал
4. өргөн мэдүүлнэ `CreateKaigi`
5. өргөн хуримтлагдсан уриалтын холбоосыг хуваалцаарай

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

Өргөдлийн `inviteLink` таны UI. Хэрэглэгчид үүнийг хуулбарлаж, өөр хөрөнгийн буудалд нээж болно.
эсвэл үүнийг:

```ts
export function inviteRoute(inviteLink: string): string {
  const invite = parseInviteLink(inviteLink);
  return `/kaigi?call=${encodeURIComponent(invite.callId)}&secret=${encodeURIComponent(
    invite.inviteSecretBase64Url,
  )}`;
}
```

## Зочид: Хуралдаанд оролцох {#guest-join-a-meeting}

Зочид буудлын урсгал:

1. дуудлагаг шалгах
2. нээлт хийлгэсэн дуудлагын санал авна Torii
3. . WebRTC хариулт
4. өргөн мэдүүлнэ `JoinKaigi` Үүнд шифрлэсэн хариуны метадэтгэлтэй

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

Хэрэв уулзалт ил тод бол та
Хувийн уулзалт хийхэд `walletIdentity` хэрэглэгчийн хувьд
ялангуяа үүнийг илрүүлэхээр сонгодог.

## Зохиолч: Та зочингийн хариултыг хэрэглэнэ {#host-apply-the-guest-answer}

Цаашид шууд уулзалтыг зохион байгуулах дараа хөтлөгч үзнэ. Kaigi үйл явдлууд, санал асуулга
Анхны зөв хариуг хостын дундад
холболт.

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

Буцаасан төлбөрөө хадгалах ID Тиймээс таны UI ажиглагч нь
Үйлчлөгч нь буулгаж, эсвэл алдагджээ.

## Хуралдааны төгсгөл {#end-the-meeting}

Харилцааг бүтээсэн хостинг дансаа дуусгах:

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

## Хувийн хэв маягийн санхүүжилт {#private-mode-funding}

Хувь хүн Kaigi бүтээх, нэгтгэх, эцсийн үйл ажиллагаа нь хамгаалалттай байх шаардлагатай XOR .
Таны аппликейшн энэ алдааг олж,
дахин туршиж үзэхээс өмнө өөрийгөө хамгаалах үйл ажиллагаа.

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

Тэмцээн дээр UI хэрэглэгчийг өөрийгөө хамгаалахыг шаарддаг бөгөөд дараа нь
анхны үйл ажиллагааг бий болгох эсвэл нэгтгэх.

## Хөдөлмөрийн эргэлт {#manual-fallback}

Автомат сигналын систем нь амьд мөнгөний цалингаас хамаарна. Kaigi-Шилдэг хүн Torii замыг,
хувийн хэвшлийн баталгаажуулалтын .
хязгаарлалттай орчин:

- Хэрэв `CreateKaigi` шалгаруулалтад хүрээгүй бол санал өгсөн гарын үсэгт уриалгыг үзнэ үү
- Хэрэв `JoinKaigi` алдаатай бол түүхий элдэв хариу багцыг үзнэ
- хост хариуны багцыг татаж, дуудлаа `setRemoteDescription`

Хөдөлмөрийн дутагдал нь алдааны хяналт тавихэд ашигтай WebRTC, Гэхдээ энэ нь
Жүжиглэнгийн цахилгаан Kaigi урсгал.

## Тэсний шалгалтын жагсаалт {#test-checklist}

Нэгжийн шинжилгээний хувьд гүүртэй хандаж, UI хүлээгдэж буй
Kaigi хэрэглэгдэх ачаалл:

- хөтлөгч орон нутгийн хэвлэл мэдээллийн хэрэгслийг бий болгож, `createKaigiMeeting`
- зочид буудлын `iroha://kaigi/join?call=...&secret=...` урилга
- зочид уриалтыг шалгаж, дууддаг `getKaigiCall`, болон өргөн мэдүүлнэ
  `joinKaigiMeeting`
- хариултын сигналыг хүлээн авах санал асуулга эсвэл цаг, хариуг хэрэглэнэ
- хувийн хэвшлийн захиалгаар өөрийгөө хамгаалах XOR Хойсон байна
- Амьдралын сигнал байхгүй бол дасан зохиосон гарааны шуурхай гарч ирнэ

Бүхэл бүтэн шалгалтын хувилбарыг үзнэ үү Kaigi үзлэг, урьдчилсан борлуулалт
гүүрний туршилт:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
```

Хөдөлмөрийн UI төмөр шинжилгээ нь `/kaigi` Ширээний үзүүлэлт, жинхэнэ хэвлэл мэдээллийн туршилтын
аливаа хэрэгсэл нь хоёр санхүүжүүлсэн мөнгөний мөнгөн тэмдэгт болон хоёр ширээ эсвэл төхөөрөмж хэрэгтэй
гарын үсэг зурах, камер, микрофон, WebRTC зөвшөөрөл нь гүйлтийн цаг хугацаагаар өөрчлөдөг.

Хэрэв та TAIRA болон дуудлагад зориулсан чиглэлийн буцалт `404`, нэгдүгээр
хөтөч хөрөнгийг амжилттай ирүүлсэн гэдгийг баталгаажуулах `CreateKaigi`. Эрүүл мэндийн салбар
ямар ч тодорхой дуудлага гарахаас өмнө эцсийн цэгүүдийг ашиглах боломжтой.

## Дараагийн алхам {#next-steps}

- Хэрэглээний бүртгэлийг `RecordKaigiUsage` таны аппликейшн нь найдвартай байх үед
  хуралдааны хугацааны тооцоо.
- Захиргааны болон хяналтын реле `/v1/kaigi/relays` реле ашиглахдаа
  Нүүр хуудас
- Гадаргуу `KaigiRosterSummary`, `KaigiUsageSummary`, болон
  `KaigiRelayHealthUpdated` Операторуудын тасалбар талд бүртгэгдсэн үйл явдлууд.
