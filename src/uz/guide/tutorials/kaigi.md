---
translation_locale: uz
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: e55c7aebc89c39edb8e7077db2414a6d432aafb05aff8df04c248fce444d7dea
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Oʻrnatilgan Kaigi a JavaScript Ilova {#embed-kaigi-in-a-javascript-app}

Kaigi dastur pulchasiga asoslangan bir-bir audio / video uchrashuvlarni yaratishga imkon beradi
ularning hayot davri Iroha. Brauzer hali ham media bilan shugʻullanadi
WebRTC, oʻsha paytda Torii va Kaigi ko'rsatmalar doimiy yig'ilishni ta'minlaydi
yozib olish, shifrlangan signallash metadatalari, xususiy ro'yxatni qo'llab-quvvatlash va foydalanish hodisalari.

Ushbu qo'llanma minimal integratsiya modelini ko'rsatadi
[Iroha Demo JavaScript](https://github.com/soramitsu/iroha-demo-javascript)
dastur:

- tarjima qiluvchi yaratadi WebRTC taklif va javoblar
- ariza ko'priklarini belgilaydi va taqdim etadi Kaigi operatsiyalar
- kompakt taklif bog'lari faqat chaqiruvni olib boradi ID Va sirli taklif qilish .
- uy egasi soatlari Torii shriflangan ishtirokchi javoblari uchun

Misollar TypeScript va elektronda ishlaydigan holda yozilmoqda,
xavfsiz backendli brauzer yoki pulka kengaytmasi bo'lgan veb-ilova.
ishlab chiqarishda ishonchli bo'lmagan renderer kodidan tashqaridagi xususiy kalitlar.

## Oldingi shartlar {#prerequisites}

Sizga kerak:

- a) Kaigi- qobiliyatli Torii yakuniy nuqta
- uy egasi va mehmon uchun hisob
- har bir hisobning imzo kalitini xavfsiz dastur ko'prisi yoki hamyon orqali olish
- brauzer kamerasi/mikrofon ruxsatlari
- Node.js Agar siz JavaScript demo yoki mahalliy
  `@iroha/iroha-js` to'g'ridan-to'g'ri bog'lovchi

To'liq ishchi ma'lumot uchun demo-ni Iroha manbai
Checkout:

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

Demo bilan foydalanish
[`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js)
opamizdan Iroha manbai ombor. `file:` bog'liqlik bu
Agar natijali bog'lanish o'zgarsa, uni qayta qurish
`iroha/javascript/iroha_js`; toza paketlar ko'rsatkichida
yuk tashish uchun zarur bo'lgan ish joylari `npm run build:native`.

To ' g'ri uchrashuvni o ' tkazishdan oldin TAIRA, jamoatchilikni tekshirish Torii yuzaga kelishi
demo quyidagilarga bogʻliq:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/v1/kaigi/relays"
curl -fsS "$TAIRA/v1/kaigi/relays/health"
```

Ushbu buyruqlar TAIRA jonli va bu Kaigi relay telemetriyasi
mavjud. Ular taqdim etilmaydi Kaigi Transaksiyalar. `CreateKaigi` yoki
`JoinKaigi` sinov ehtiyojlari moliyalashtirilgan TAIRA hisoblar va demo orqali imzolash
ko'prik yoki boshqa qoplama bilan ta'minlangan ko'priki.

## Arxitektura {#architecture}

O ' zini saqlang Kaigi integratsiya uch qatlamga bo'linadi:

| qatlam | Mas'uliyat |
| --- | --- |
| UI | hisob tanlovi, yig'ilish shakli, taklif bog'liqlarini ko'rsatish, ommaviy axborot vositalarini boshqarish |
| WebRTC | `RTCPeerConnection`, mahalliy ommaviy axborot vositalari, taklif va javob tavsiflari |
| Iroha koʻprik | imzolash, `CreateKaigi`, `JoinKaigi`, `EndKaigi`, signal so'rovlari |

Dastur ko'prisi elektronni oldindan yuklab olish mumkin API, portfeli kengaytmasi yoki orqa tomoni
U kichik suyani UI:

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

Demo dasturida ushbu ko'prik usullari
`@iroha/iroha-js`, mahalliy imzo, shifrlangan Kaigi metadotlar va Torii qo'ng'iroqlar.

## Yordamchilarni taklif qiling {#invite-helpers}

Foydalanish Torii- moslashtirilgan qo'ng'iroq IDs bilan `domain.dataspace:meeting` demo shakli.
foydalanish `kaigi.universal:<call-name>` yaratilgan uchrashuvlar uchun.

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

## WebRTC Yordamchilar {#webrtc-helpers}

Uy egasi taklifni yaratadi, uni saqlash orqali `CreateKaigi`, va saqlaydi
Oyna ochiladi, shunda u mehmonning javobini qo'llashi mumkin. Mehmon shifrlangan
taklif qiladi, javob yaratadi va javobni yozadi `JoinKaigi`.

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

O'zingizning oqimlaringizni UI oddiy video elementlari bilan:

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

## Uy egasi: Yigʻilishlarga bogʻliq aloqa yaratish {#host-create-a-meeting-link}

Uy egasi oqimi:

1. ochiq kamera va mikrofon
2. yaratish Kaigi signal kalitlari juftligi
3. yaratish WebRTC taklif
4. taqdim etish `CreateKaigi`
5. qoʻshish taklif bogʻlamasi

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

Koʻrsatish `inviteLink` sizning UI. Foydalanuvchi uni nusxalash, boshqa hamyonada ochish mumkin.
yoki uni quyidagilar kabi dastur yo'nalishlariga aylantirish:

```ts
export function inviteRoute(inviteLink: string): string {
  const invite = parseInviteLink(inviteLink);
  return `/kaigi?call=${encodeURIComponent(invite.callId)}&secret=${encodeURIComponent(
    invite.inviteSecretBase64Url,
  )}`;
}
```

## Mehmon: Yigʻilishga tashrif buyuring {#guest-join-a-meeting}

Mehmonlar oqimi:

1. taklifni tahlil qilish
2. kodlangan qo'ng'iroq taklifini olish Torii
3. yaratish WebRTC javob
4. taqdim etish `JoinKaigi` javob metadatalari shifrlangan

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

Agar uchrashuv shaffof bo'lsa, siz portfelni ko'rsatuvchi qatorni
Shaxsiy uchrashuvlar uchun `walletIdentity` foydalanuvchi tomonidan oʻrnatilmagan
aniq ravishda buni oshkor qilishni tanlaydi.

## Uy egasi: Qonaqning javobini qoʻllash {#host-apply-the-guest-answer}

O'tirish o'tkazilgandan so'ng, uy egasi tomosha qilishi kerak Kaigi tadbirlar va saylov
&amp; # 91;&amp; # 93; &amp; quot; Xostning tengdoshlariga birinchi haqiqiy javobni qoʻllash
aloqa.

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

Qaytarib berilgan obunalarni saqlash ID Shunday qilib UI kuzatuvchini to ' xtatishi mumkin
uy egasi to'xtab qo'yadi yoki ketadi.

## Uchrashuvni yakunlang {#end-the-meeting}

Uni yaratgan uyning oʻzidan qoʻngʻiroqni tugatish:

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

## Xususiy usulda moliyalashtirish {#private-mode-funding}

Xususiy Kaigi yaratish, qo'shish va yakunlash operatsiyalari himoyalangan talab qilishi mumkin XOR uchun
Sizning dasturingiz ushbu xatoni aniqlab,
qayta urinishdan oldin o'z-o'zini himoya qilish harakatlari.

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

Demoda, UI foydalanuvchini oʻzini himoya qilishga undaydi , soʻngra
dastlabki harakatni yaratish yoki qo'shish.

## Qo'llanma to'sish {#manual-fallback}

Avtomatik signalizatsiya jonli hamyon bilan bog'liq, Kaigi- qobiliyatli Torii yo'nalishlar va
xususiy rejimda dalil ishlab chiqarish.
cheklangan muhitlar:

- agar `CreateKaigi` taklifni o'z ichiga olgan qo'llanma taklifnoma ko'rsatiladi
- agar `JoinKaigi` muvaffaqiyatsiz tugasa, xom javob paketini ko'rsatish
- uy egasi javob paketini qoʻshsin va qoʻngʻiroq qilsin `setRemoteDescription`

Yordamchi xatolik yoʻllari toʻgʻrilash uchun foydali WebRTC, Lekin bu
jonli o'rnatish bilan bir xil xususiy zanjir signallash kafolatlari Kaigi oqim.

## Sinovlar ro'yxati {#test-checklist}

Birlik sinovlari uchun ko'prikni masxara qilib, sizning UI kutilayotganidan past
Kaigi foydali yuklar:

- uy egasi mahalliy ommaviy axborot vositalarini yaratadi va taqdim etadi `createKaigiMeeting`
- uy egasi `iroha://kaigi/join?call=...&secret=...` taklif qilish
- mehmon taklifni tahlil qiladi, qo'ng'iroq qiladi `getKaigiCall`, va taqdim etadi
  `joinKaigiMeeting`
- javob signallari uchun o'tkazuvchi so'rovnomalar yoki soatlar va javobni qo'llaydi
- O'zini himoya qilish uchun xususiy rejimdagi ogohlantirishlar XOR yo'qolgan
- jonli signallar mavjud boʻlmaganida qoʻllanma qaytish paydo boʻladi

To'liq ma'lumotnoma sinovlari uchun demo ilovalarini ko'ring Kaigi ko'rish va oldindan yuklash
ko'prik sinovlari:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
```

O ' zbekiston Respublikasi UI tutun tekshiruvi `/kaigi` yo'nalishlarni ko'rsatadi. Haqiqiy media testi
hali ham ikki moliyalashtirilgan qopchiq va ikkita deraza yoki qurilma kerak , chunki
imzolash, kamera, mikrofon va WebRTC ruxsatnomalar ishga tushirish vaqti bo'yicha farq qiladi.

Agar siz TAIRA va qo'ng'iroqga mos yo'nalishlarni qaytarish `404`, birinchi
uylanuvchi hamyon muvaffaqiyatli taqdim etilganligini tasdiqlang `CreateKaigi`. Relay salomatligi
har qanday maxsus qo'ng'iroq mavjud bo'lishidan oldin oxirgi nuqtalar mavjud bo'lishi mumkin.

## Keyingi qadamlar {#next-steps}

- Foydalanish yozuvini qoʻshish `RecordKaigiUsage` dasturingiz ishonchli boʻlganda
  seanslar davomiyligi hisobini yuritish.
- Ro'yxatga olish va nazorat relaylari orqali `/v1/kaigi/relays` relaydan foydalanishda
  ko'rsatmalar.
- Yer yuzi `KaigiRosterSummary`, `KaigiUsageSummary`, va
  `KaigiRelayHealthUpdated` operator dashboardidagi hodisalar.
