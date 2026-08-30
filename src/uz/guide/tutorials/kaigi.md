---
translation_locale: uz
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: 24dc7e6a41ea8a06d24663aebaeca2469c522e391a5de61f039c47a1cd020c91
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kaigi ni JavaScript dasturida o'rnatish {#embed-kaigi-in-a-javascript-app}

Kaigi dasturga pulmonada qo'llab-quvvatlanadigan bir-bir audio / video uchrashuvlarni yaratish imkonini beradi, ularning hayot davri Iroha orqali qayd etiladi. Brauzer hali ham WebRTC bilan ommaviy axborot vositalarini boshqaradi, Torii va Kaigi ko'rsatmalari esa uzoq muddatli uchrashuvlar yozuvini, shifrlangan signallash metadatalarini taqdim etadi. shaxsiy ro'yxatni qo'llab-quvvatlash va foydalanish tadbirlari.

Ushbu qo'llanma [Iroha Demo JavaScript](https://github.com/soramitsu/iroha-demo-javascript) dasturida ishlatiladigan minimal integratsiya namunasini ko'rsatadi:

- Renderer WebRTC taklif va javoblarni yaratadi
- talabnoma ko'prikini belgilaydi va Kaigi tranzaksiyalarini taqdim etadi
- Kompakt taklif bog'lari faqat ID chaqiruvni olib boradi va maxfiy taklif qiladi.
- uy egasi Torii ishtirokchilarning shifrlangan javoblarini kuzatib boradi

Misollar TypeScript dan foydalanadi va ular Electron, xavfsiz backendli brauzerda yoki qopchiq kengaytmasi bo'lgan veb-ilovalarda ishlashi mumkinligi uchun yozilmoqda.

## Oldindan talablar {#prerequisites}

Sizga kerak:

- Kaigi -ga ega bo'lgan Torii oxirgi nuqtasi
- uy egasi uchun hisob va mehmon uchun hisob
- har bir hisobvaraqning imzo kalitini xavfsiz ilova ko'prik yoki hamyon orqali olish
- brauzer kamerasi/mikrofon uchun ruxsatlar
- Node.js 20+ agar siz to'g'ridan-to'g'ri JavaScript demo yoki nativ `@iroha/iroha-js` bog'lashdan foydalangan bo'lsangiz

To'liq ishlaydigan ma'lumot uchun Iroha manbali checkoutning yonida demo nusxasini klonlash:

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

Iroha manba omboridan [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js) bilan demodan foydalaning. uning `file:` bog'ligi to'g'ridan-to'g'ri checkoutni hal qiladi. Agar mahalliy bog'lanish o'zgarsa, uni `iroha/javascript/iroha_js` ostida qayta qurish; toza paket direktoriyasida `npm run build:native` uchun kerakli Cargo ish maydonlari mavjud emas.

TAIRA-da jonli uchrashuvni o'tkazishdan oldin, demo bog'liq bo'lgan ommaviy Torii yuzini tekshiring:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/v1/kaigi/relays"
curl -fsS "$TAIRA/v1/kaigi/relays/health"
```

Ushbu buyruqlar TAIRA jonliligini va Kaigi relay telemetriyasi mavjudligini tasdiqlaydi. Ular Kaigi tranzaksiyalarini taqdim etmaydilar. Haqiqiy `CreateKaigi` yoki `JoinKaigi` sinovlari uchun TAIRA hisobvaraqlari moliyalashtirilishi va demo ko'prikidan yoki boshqa qoplama bilan qo'llab-quvvatlanadigan ko'priktadan o'tish kerak.

## Arxitektura {#architecture}

Kaigi integratsiyasini uch qatlamga bo'ling:

|qatlam |Masʼuliyat |
| --- | --- |
|UI |Hisobot tanlovi, uchrashuv shakli, taklif bog'liqligini ko'rsatish, ommaviy axborot vositalarini boshqarish |
|WebRTC |`RTCPeerConnection`, mahalliy ommaviy axborot vositalari, taklif va javoblar tavsiflari |
|Iroha ko'prik |imzolash, `CreateKaigi`, `JoinKaigi`, `EndKaigi` signal so'rovlarini o'tkazish |

Ilovalar ko'prisi elektron oldindan yuklanishi API, portfeli kengaytmasi yoki orqa tomoni bo'lishi mumkin. U UI kichik yuzaga chiqishi kerak:

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

Demo ilovasida ushbu ko'prik usullari `@iroha/iroha-js`, mahalliy imzo, shifrlangan Kaigi metadata va Torii qo'ng'iroqlar bilan amalga oshiriladi.

## Yordamchilarni taklif eting {#invite-helpers}

Foydalanish Torii- moslashtirilgan qo'ng'iroq IDs bilan `domain.dataspace:meeting` demo shaklida ishlatiladi `kaigi.universal:<call-name>` hosil bo'lgan uchrashuvlar uchun.

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

Uy egasi taklifni yaratadi, uni `CreateKaigi` orqali saqlaydi va mehmonning javobini qo'llashi uchun oynani ochib qo'yadi. Mehmon shifrlangan taklifni olib keladi, javobni yaratib, javobni `JoinKaigi` bilan yuboradi.

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

UI fayllaringizni oddiy video elementlari bilan qo'shing:

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

## Uy egasi: Yigʻilishlar bilan bogʻlaning {#host-create-a-meeting-link}

Qonaqchi oqimi:

1. ochiq kamera va mikrofon
2. Kaigi signal kalitlari juftligini yaratish
3. WebRTC taklifini yaratish
4. `CreateKaigi`ni taqdim etish
5. qoʻshilgan taklif bogʻi

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

`inviteLink` ni UI da ko'rsating. Foydalanuvchi uni nusxaga olish, boshqa hamyonada ochish yoki quyidagilar kabi dastur yo'nalishiga o'zgartirish mumkin:

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

1. Taklifni tahlil qilish
2. Torii dan shafrlangan qo'ng'iroq taklifini olish;
3. WebRTC javobini yaratish
4. `JoinKaigi` so'rov metadatalarini shifrlangan holda taqdim etish

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

Agar uchrashuv shaffof bo'lsa, siz qo'shilish so'roviga bog'liq portfelni ko'rsatish satrini kiritishingiz mumkin. Xususiy uchrashuvlar uchun `walletIdentity` o'rnatilmagan holda saqlang, agar foydalanuvchi aniq ravishda uni oshkor qilishni tanlamasa.

## Uy egasi: Qonaqning javobini qoʻllash {#host-apply-the-guest-answer}

To'g'ridan-to'g'ri uchrashuv yaratilgandan so'ng, uy egasi Kaigi tadbirlarini tomosha qilishi va shifrlangan javob signallari uchun saylov o'tkazishi kerak. Uy egasining tengdoshlar aloqasiga birinchi haqiqiy javobni qo'llash kerak.

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

Qaytarib berilgan obuna ID ni saqlab qo'ying, shunda sizning UI uy egasi to'xtab qolganda yoki ketayotganda kuzatuvchini to'xtatadi.

## Uchrashuvni tugating {#end-the-meeting}

Uni yaratgan oʻsha uy egasi hisobidan qoʻngʻiroqni tugating:

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

Xususiy Kaigi yaratish, qo'shilish va yakunlash operatsiyalari xususiy kirish nuqtasi to'lovi uchun shielded XOR talab qilishi mumkin. Sizning ilovangiz ushbu xatoni aniqlashi kerak va qayta urinishdan oldin o'z-o'zini himoya qilish amalini taklif qilishi kerak.

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

Demoda UI foydalanuvchini o'zini himoya qilishga undaydi va keyin asl yaratish yoki qo'shilish harakatini qayta sinab ko'radi.

## Qo'llanma qaytish {#manual-fallback}

Avtomatik signalizatsiya jonli hamyon, Kaigi -ga mo'ljallangan Torii yo'nalishlariga va xususiy rejimda dalillarni ishlab chiqarishga bog'liq. O'sish va cheklangan muhitlar uchun qo'ldan-qo'l to'g'rilash:

- `CreateKaigi` muvaffaqiyatsiz tugasa, taklifni o'z ichiga olgan qo'llanma taklif ko'rsatilsin
- `JoinKaigi` muvaffaqiyatsiz tugasa, xom javob paketini ko'rsating.
- uy egasi javob paketini qo'shsin va `setRemoteDescription` ni chaqirsin.

WebRTC debug qilish uchun qo'llanma ortish foydali, ammo u jonli Kaigi oqim bilan bir xil xususiy zanjirda signallash kafolatlarini taqdim etmaydi.

## Sinovlar ro'yxati {#test-checklist}

Birlik sinovlari uchun ko'prikni mashq qiling va UI vositasi kutilayotgan Kaigi foydali yuklarni o'tkazib yuborishini ta'kidlang:

- uy egasi mahalliy ommaviy axborot vositalarini yaratadi va `createKaigiMeeting` taqdim etadi.
- Uy egasi `iroha://kaigi/join?call=...&secret=...` taklifini ko'rsatadi.
- mehmon taklifni tahlil qiladi, `getKaigiCall`ga qo'ng'iroq qiladi va `joinKaigiMeeting`ni taqdim etadi.
- javob signallari uchun o'tkazuvchi so'rovnomalar yoki soatlar va javobni qo'llaydi
- O'z-o'zini himoya qilish uchun xususiy rejimdagi ogohlantirishlar, agar XOR himoyalangan bo'lsa yo'q
- jonli signalizatsiya mavjud bo ' lmasa , qo'llanma qaytish paydo bo ' ladi

To'liq referensiyaviy sinov paketini ko'rish uchun demo dasturining Kaigi ko'rinishi va yuklanishdan oldin ko'prik sinovlarini ko'ring:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
```

UI tutun testi `/kaigi` yo'nalishining ishlashini tasdiqlaydi. Haqiqiy media testi hali ham ikkita moliyalashtirilgan qopchiq va ikki deraza yoki qurilma kerak, chunki amallarni imzolash, kamera, mikrofon va WebRTC ruxsatnomalari ishga tushirish vaqti bilan o'zgaradi.

Agar siz TAIRA bilan sinov o'tkazayotgan bo'lsangiz va qo'ng'iroqga mos yo'nalish `404` qaytarilgan bo'lsa, avval uy egasi qopqoqchasining muvaffaqiyatli taqdim etilganligini tasdiqlang `CreateKaigi`.

## Keyingi qadamlar {#next-steps}

- Agar sizning ilovangizda seans muddati ishonchli hisoblangan bo'lsa, `RecordKaigiUsage` bilan foydalanishni qayd etishni qo'shing.
- Relay manifestlaridan foydalangan holda `/v1/kaigi/relays` orqali relaylarni ro'yxatdan o'tkazish va kuzatish.
- Operator ish panelida yuzasi `KaigiRosterSummary`, `KaigiUsageSummary` va `KaigiRelayHealthUpdated` hodisalari.
