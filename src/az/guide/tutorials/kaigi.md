---
translation_locale: az
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: e55c7aebc89c39edb8e7077db2414a6d432aafb05aff8df04c248fce444d7dea
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kaigi-ni JavaScript tətbiqetməsinə daxil etmək {#embed-kaigi-in-a-javascript-app}

Kaigi bir tətbiqə pullu dəstəkləyən bir-bir audio / video görüşləri yaratmağa imkan verir ki, onların həyat dövrü Iroha vasitəsilə qeyd olunur. Brauzer hələ də medianı WebRTC ilə idarə edir, Torii və Kaigi təlimatları davamlı toplantı qeydini, şifrələnmiş siqnal metadatalarını təmin edir. özəl siyahı dəstək və istifadə hadisələri.

Bu təlimat [Iroha Demo JavaScript](https://github.com/soramitsu/iroha-demo-javascript) tətbiqi tərəfindən istifadə olunan minimal inteqrasiya nümunəsini göstərir:

- Renderer WebRTC təklifləri və cavabları yaradır
- Ərizə köprüni işarələyir və Kaigi əməliyyatları təqdim edir.
- Kompakt dəvət linkləri yalnız ID çağırışı və gizli dəvət alır
- aparıcı Torii şifreli iştirakçı cavabları üçün izləyir

nümunələr TypeScript istifadə edir və Electron, etibarlı bir arka uçlu brauzerdə və ya cüzdan uzantısı olan veb tətbiqetməsində işləmək üçün yazılıblar.

## Əvvəlki şərtlər {#prerequisites}

Sənə lazım:

- Kaigi -ə malik olan Torii son nöqtəsi
- Ev sahibi və qonaq hesabı.
- Hər hesabın imza açarına təhlükəsiz bir tətbiq köprü və ya cüzdan vasitəsilə daxil olmaq
- brauzer kamerası/mikrofon icazələri
- Node.js 20+ if you're using the JavaScript demo or native `@iroha/iroha-js` binding directly

Tam işləmə istinadı üçün Iroha mənbə verilişinin yanındakı demo klonlayın:

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

Iroha mənbə anbarından olan [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js) ilə demo istifadə edin. Onun `file:` asılılığı birbaşa yoxlanışı həll edir. Doğrudan bağlama dəyişsə, onu `iroha/javascript/iroha_js` altında yenidən qurun; təmiz paketlər dizaynında `npm run build:native` üçün lazım olan yük iş məkanı yoxdur.

TAIRA şəbəkəsində canlı iclas keçirməzdən əvvəl demo-dan asılı olan ictimai Torii səthini yoxlayın:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/v1/kaigi/relays"
curl -fsS "$TAIRA/v1/kaigi/relays/health"
```

Bu əmrlər təsdiq edir ki, TAIRA canlıdır və bu Kaigi relay telemetriyası mövcuddur. Kaigi real əməliyyatlar. `CreateKaigi` və ya `JoinKaigi` sınaq ehtiyacları maliyyələşdirilir TAIRA Hesablar və demo körpüsü vasitəsilə imzalanma və ya başqa bir cüzdan dəstəkləyən körpü.

## Memarlıq {#architecture}

Kaigi inteqrasiyasını üç təbəqədə bölün:

|Layer |Məsuliyyət |
| --- | --- |
|UI |Hesab seçimi, iclas forması, dəvət linklərinin göstərilməsi, media nəzarətləri |
|WebRTC |`RTCPeerConnection`, yerli media, təklif və cavab təsvirləri |
|Iroha köprü |İmzalama, `CreateKaigi`, `JoinKaigi`, `EndKaigi`, siqnal səsverməsi |

Tətbiq köprü elektron yüklənmə ola bilər API, bir cüzdan uzantısı və ya arka plan son nöqtəsi olmalıdır. UI:

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

Demo tətbiqində bu köprü üsulları `@iroha/iroha-js`, yerli imzalanma, şifrələnmiş Kaigi metadata və Torii zənglərlə həyata keçirilir.

## Yardımçıları dəvət edin {#invite-helpers}

Torii-ə uyğun zəng IDs istifadə edin `domain.dataspace:meeting` formasında. Demo iclaslar üçün `kaigi.universal:<call-name>` istifadə edir.

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

## WebRTC Yardımçılar {#webrtc-helpers}

Qonaq bir təklif yaradır, onu `CreateKaigi` vasitəsilə saxlayır və qonağın cavabını tətbiq etmək üçün pəncərəni açıq saxlayır. Qonaq şifrələnmiş təklifi alır, bir cavab yaratır və cavabı `JoinKaigi` ilə göndərir.

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

Axını UI ilə adi video elementləri ilə bağlayın:

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

## Ev sahibi: Toplantı ilə əlaqə qurun {#host-create-a-meeting-link}

Ev sahibi axını:

1. Açıq kamera və mikrofon
2. bir Kaigi siqnal açar cütü yaratmaq
3. WebRTC təklifini yaratmaq
4. `CreateKaigi` təqdim etmək
5. kompakt bir dəvət linkini paylaşın

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

`inviteLink` nümayiş etdirin UI. İstifadəçi onu nüsxələyə, başqa cüzdanda aça və ya tətbiqi yolu kimi çevirə bilər:

```ts
export function inviteRoute(inviteLink: string): string {
  const invite = parseInviteLink(inviteLink);
  return `/kaigi?call=${encodeURIComponent(invite.callId)}&secret=${encodeURIComponent(
    invite.inviteSecretBase64Url,
  )}`;
}
```

## Qonaq: İclasda iştirak edin {#guest-join-a-meeting}

Qonaq axını:

1. dəvətnaməni təhlil edin
2. Torii -dən şifrələnmiş çağırış təklifini alın.
3. WebRTC cavabını yaratın
4. `JoinKaigi` şifrələnmiş cavab metadataları ilə təqdim edin

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

Əgər toplantı şəffafdırsa, birləşmə tələbinə cüzdan nümayiş etdirmə xətti daxil edə bilərsiniz. `walletIdentity` İstifadəçinin açıq şəkildə ifadə etməsini seçmədiyi təqdirdə, müəyyənləşdirilməz.

## Ev sahibi: Qonağın cavabını tətbiq edin {#host-apply-the-guest-answer}

Canlı bir görüş yaratdıqdan sonra aparıcı Kaigi hadisələrini izləməlidir və şifrələnmiş cavab siqnalları üçün sorğu verməlidir. İlk etibarlı cavabı aparıcının həmyaşıd əlaqəsi ilə tətbiq edin.

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

Geri qaytarılan abunə ID saxlayın ki, sizin UI aparıcısı bağlandıqda və ya uzaqlaşdıqda izləyicini dayandıra bilər.

## Görüşün bitməsi {#end-the-meeting}

Çıxışı yaratmış eyni ev sahibi hesabından bitirin:

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

## Özəl rejimdə maliyyələşdirmə {#private-mode-funding}

Xüsusi Kaigi yaratmaq, qoşulmaq və bitirmə əməliyyatları xüsusi giriş nöqtəsi haqqı üçün qorunmuş XOR tələb edə bilər. Tətbiqiniz bu səhvini aşkar etməlidir və yenidən cəhd etməkdən əvvəl öz-özünə qorunma hərəkəti təklif edir.

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

Demo-da, UI istifadəçini özünü qorumağa çağırır və sonra orijinal yaratmaq və ya qoşulma hərəkətini yenidən sınayır.

## Əlyazmalar {#manual-fallback}

Avtomatik siqnallaşdırma canlı bir cüzdan, Kaigi -ə malik olan Torii marşrutlardan və şəxsi rejimdə sübut istehsalından asılıdır. İnkişaf və məhdud mühitlər üçün əl ilə geri çəkilmə saxlayın:

- `CreateKaigi` uğursuz olarsa, təklif daxil olan əl dəvəti göstərin
- Əgər `JoinKaigi` uğursuz olsa, xam cavab paketini göstərin
- Ev sahibi cavab paketini yapışdırsın və `setRemoteDescription` çağırın.

Manual fallback WebRTC debug etmək üçün faydalıdır, lakin canlı Kaigi axını ilə eyni şəxsi silsilədə siqnallaşdırma zəmanətləri təmin etmir.

## Test yoxlama siyahısı {#test-checklist}

Birlik sınaqları üçün körpüdən istifadə edin və UI planlaşdırılan Kaigi paylı yüklərin keçdiyini təsdiqləyin:

- Ev sahibi yerli media yaratır və `createKaigiMeeting` təqdim edir.
- Ev sahibi `iroha://kaigi/join?call=...&secret=...` dəvətnaməsini göstərir
- qonaq dəvətnaməni təhlil edir, `getKaigiCall` çağırır və `joinKaigiMeeting` təqdim edir.
- cavab siqnalları üçün aparıcı səsvermələr və ya saatlar və cavabı tətbiq edir;
- Gizli rejimdə XOR qorunma zamanı özünü qorumaq üçün təyinatlar yoxdur
- canlı siqnal tapılmadıqda əl ilə geri çəkilmə görünür

Tam bir istinad sınaq kompleksi üçün demo tətbiqinin Kaigi görünüşünü və yüklənmədən əvvəlki körpü testlərini baxın:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
```

UI duman testi `/kaigi` marşrutunun işlədiyini təsdiqləyir. Həqiqi media testi hələ də iki maliyyələşdirilmiş cüzdan və ya iki pəncərə və ya qurğuya ehtiyac duyur, çünki əməliyyat imzalanması, kamera, mikrofon və WebRTC icazələri icra vaxtı ilə dəyişir.

Əgər TAIRA ilə mübarizə aparırsınızsa və çağırış üçün xüsusi bir marşrut `404` qaytarırsa, əvvəlcə ev sahibi cüzdanın uğurla təqdim olunduğunu təsdiqləyin `CreateKaigi`.

## Növbəti addımlar {#next-steps}

- Tətbiqinizin etibarlı seans müddətinin hesablanması olduğu zaman `RecordKaigiUsage` ilə istifadə qeydini əlavə edin.
- Relay manifestlərindən istifadə edərkən `/v1/kaigi/relays` vasitəsilə relayləri qeydə alıb izləyin.
- Əməliyyatçının idarəetmə cədvəlindəki səth `KaigiRosterSummary`, `KaigiUsageSummary` və `KaigiRelayHealthUpdated` hadisələri.
