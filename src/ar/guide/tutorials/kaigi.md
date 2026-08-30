---
translation_locale: ar
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: 24dc7e6a41ea8a06d24663aebaeca2469c522e391a5de61f039c47a1cd020c91
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# تم دمج Kaigi في تطبيق JavaScript {#embed-kaigi-in-a-javascript-app}

Kaigi يسمح للتطبيق بإنشاء اجتماعات صوتية / فيديو أحادية إلى واحدة مدعومة محفظة يتم تسجيلها من خلال Iroha. لا يزال المتصفح يتعامل مع وسائل الإعلام مع WebRTC ، في حين أن Torii و Kaigi التعليمات توفر سجل اجتماع طويل الأمد، وتشفير بيانات إشارة الميتا، دعم القائمة الخاصة وأحداث الاستخدام.

يظهر هذا البرنامج التعليمي نمط التكامل الحد الأدنى المستخدم من قبل تطبيق [Iroha Demo JavaScript](https://github.com/soramitsu/iroha-demo-javascript):

- يقوم المرسل بإنشاء عروض وإجابات WebRTC
- تسجيل الطلب وتقديم Kaigi المعاملات
- وصلات الدعوة الصغيرة تحمل فقط الدعوة ID وتدعو السرية
- يراقب المضيف Torii إجابات المشاركين المشفرة.

تستخدم الأمثلة TypeScript وكتبت بحيث يمكن تشغيلها في إلكترون، متصفح مع خلفية آمنة، أو تطبيق ويب مع امتداد محفظة. الحفاظ على المفاتيح الخاصة خارج رموز رينر غير موثوق بها في الإنتاج.

## الشروط المسبقة {#prerequisites}

تحتاجين:

- نقطة نهاية Torii قادرة على Kaigi
- حساب للمضيف وحساب للضيف
- الوصول إلى مفتاح التوقيع لكل حساب عبر جسر أو محفظة تطبيق آمنة.
- تصريحات الكاميرا / الميكروفون المتصفح
- Node.js 20+ إذا كنت تستخدم الارتباط التجريبي JavaScript أو الوطني `@iroha/iroha-js` مباشرة

للحصول على إشارة عمل كاملة، قم بتقليد النموذج التجريبي إلى جانب Iroha المصدر:

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

استخدم التجربة مع [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js) من الأخوة Iroha مخزن المصدر. `file:` تعتمد تسوية ذلك التحقق مباشرة. إذا تغير الالتزام الأصلي، أعيد بناءها تحت `iroha/javascript/iroha_js`; دليل حزمة نظيفة لا يحتوي على مساحة العمل الشحن المطلوبة من قبل: `npm run build:native`.

قبل إجراء اجتماع مباشر على TAIRA، تحقق من السطح العام Torii الذي يعتمد عليه التجربة:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/v1/kaigi/relays"
curl -fsS "$TAIRA/v1/kaigi/relays/health"
```

تتحقق هذه الأوامر من أن TAIRA على الهواء الطلق ويتم توفير telemetry الراسلة Kaigi. لا تقدم المعاملات Kaigi. يحتاج اختبار حقيقي `CreateKaigi` أو `JoinKaigi` إلى تمويل حسابات TAIRA والتوقيع عبر جسر التجربة أو جسر آخر مدعوم من محفظة.

## العمارة {#architecture}

الحفاظ على تكامل Kaigi مقسمة إلى ثلاث طبقات:

|الطبقة|المسؤولية |
| --- | --- |
|UI |اختيار الحساب، نموذج الاجتماع، عرض رابط الدعوة، التحكم في وسائل الإعلام |
|WebRTC |`RTCPeerConnection` ، وسائل الإعلام المحلية، وصف العروض والإجابات |
|Iroha الجسر|التوقيع، `CreateKaigi` ، `JoinKaigi`، `EndKaigi`، استطلاع الإشارات |

يمكن أن تكون جسر التطبيق تحميل إلكترون مسبق API ، أو امتداد محفظة، أو نقطة نهاية خلفية. يجب أن يعرض سطحًا صغيرًا إلى UI:

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

في تطبيق التجربة، يتم تنفيذ هذه الطرق الجسرية مع `@iroha/iroha-js` ، والتوقيع المحلي، والبيانات الأساسية المشفرة Kaigi، والمكالمات Torii.

## دع المساعدين {#invite-helpers}

استخدم المكالمة Torii متوافقة مع IDs في نموذج `domain.dataspace:meeting`. تستخدم النموذج التجريبي `kaigi.universal:<call-name>` للاجتماعات التي يتم إنتاجها.

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

## WebRTC المساعدين {#webrtc-helpers}

يقوم المضيف بإنشاء عرض، ويخزنه عبر `CreateKaigi` ، ويحافظ على نافذة مفتوحة حتى يتمكن من تطبيق إجابة الضيوف. يحصل الضيوف على العرض المشفر، ويخلق إجابة، ونشر الإجابة مع `JoinKaigi` .

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

ربط التدفقات إلى UI مع عناصر الفيديو العادية:

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

## المضيف: قم بإنشاء رابط للقاء {#host-create-a-meeting-link}

تدفق المضيف:

1. كاميرا مفتوحة وميكروفون
2. إنشاء زوج مفتاح إشارة Kaigi
3. إعداد عرض WebRTC
4. تقديم `CreateKaigi`
5. مشاركة رابط دعوة مشترك

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

عرض `inviteLink` في UI. يمكن للمستخدم نسخها، فتحها في محفظة أخرى، أو تحويلها إلى طريق التطبيق مثل:

```ts
export function inviteRoute(inviteLink: string): string {
  const invite = parseInviteLink(inviteLink);
  return `/kaigi?call=${encodeURIComponent(invite.callId)}&secret=${encodeURIComponent(
    invite.inviteSecretBase64Url,
  )}`;
}
```

## الضيوف: انضموا إلى الاجتماع {#guest-join-a-meeting}

تدفق الضيوف:

1. تحليل الدعوة
2. الحصول على عرض المكالمة المشفرة من Torii
3. إعداد إجابة WebRTC
4. تقديم `JoinKaigi` مع البيانات الأساسية للرد المشفرة.

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

إذا كان الاجتماع شفافاً، يمكنك إضافة سلسلة عرض محفظة في طلب الانضمام. بالنسبة للاجتماعات الخاصة، ابق `walletIdentity` غير محددة ما لم يختار المستخدم صراحة الكشف عنها.

## المضيف: استخدم رد الضيوف {#host-apply-the-guest-answer}

بعد إنشاء اجتماع مباشر ، يجب على المضيف مشاهدة Kaigi الأحداث والاستطلاع لإشارات الإجابة المشفرة. تطبيق أول إجابة صالحة على اتصال الأقران من المضيف .

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

تخزين الاشتراك المرجع ID حتى يتمكن UI من إيقاف المراقب عندما يغلق المضيف أو يتحرك بعيداً.

## إنهاء الاجتماع {#end-the-meeting}

إنهاء المكالمة من نفس الحساب المضيف الذي أنشأها:

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

## التمويل الخاص {#private-mode-funding}

يمكن أن تتطلب العمليات الخاصة Kaigi إنشاء، الانضمام، وإنهاءها حماية XOR مقابل رسوم نقطة الدخول الخاصة. يجب على تطبيقك اكتشاف هذا الخطأ وتقديم إجراء حماية ذاتي قبل المحاولة مرة أخرى.

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

في التجربة ، UI يطلب من المستخدم الحماية الذاتية ثم يحاول إعادة عمل الإنشاء الأصلي أو الانضمام.

## التراجع اليدوي {#manual-fallback}

تعتمد الإشارات الآلية على محفظة حية، طرق قادرة Kaigi - Torii ، وتوليد الدليل في الوضع الخاص. الحفاظ على التراجع اليدوي للتطوير والبيئات المحدودة:

- إذا فشل `CreateKaigi` ، أرسل دعوة يدوية تحتوي على العرض.
- إذا فشل `JoinKaigi` ، أرسل حزمة إجابة خامة
- السماح للمضيف بتثبيت حزمة الإجابة واتصال `setRemoteDescription`

يُفيد التخفيض اليدوي للتحريف WebRTC، لكنه لا يوفر نفس ضمانات الإشارة الخاصة على السلسلة مثل تدفق Kaigi المباشر.

## قائمة الاختبار {#test-checklist}

للاختبارات الوحيدة، قم بتعبير عن الجسر وتأكيد أن UI الخاص بك يمر الحملات المفيدة المتوقعة Kaigi:

- يقوم المضيف بإنشاء وسائل إعلام محلية وتقديم `createKaigiMeeting`
- يظهر المضيف دعوة `iroha://kaigi/join?call=...&secret=...`
- يقوم الضيف بتحليل الدعوة، ويدعو `getKaigiCall` ، ويقدم `joinKaigiMeeting`.
- تستضيف استطلاعات الاستقصاء أو ساعات لإشارات الإجابة وتطبيق الإجابة
- إشارات الوضع الخاص للدفاع عن النفس عند غياب الدفاع XOR
- التراجع اليدوي يظهر عندما لا توجد إشارات حية

للحصول على مجموعة اختبارات مرجعية كاملة، انظر عرض Kaigi للتطبيق التجريبي واختبارات الجسر المسبق لتحميل:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
```

يثبت اختبار الدخان UI أن مسار `/kaigi` يعطي. لا يزال اختبار الوسائط الحقيقي يحتاج إلى محفظتين ممولة بالإضافة إلى نوافذ أو أجهزة اثنتين لأن إذن التوقيع على المعاملات والكاميرا والميكروفون و WebRTC تختلف حسب وقت تشغيلها.

إذا كنت تقوم بإجراء اختبار ضد TAIRA وتعطي مسار محدد للاتصال `404` ، تأكد أولاً من أن محفظة المضيف قد تم إرسالها بنجاح `CreateKaigi`. يمكن توفير نقاط نهاية صحية الترسل قبل وجود أي اتصال معين.

## الخطوات التالية {#next-steps}

- إضافة تسجيل الاستخدام مع `RecordKaigiUsage` عندما يكون التطبيق الخاص بك يحسب مدة الجلسة بشكل موثوق.
- تسجيل ومراقبة الروايات من خلال `/v1/kaigi/relays` عند استخدام مظاهر الرواية.
- الأحداث السطحية `KaigiRosterSummary` ، `KaigiUsageSummary`، و `KaigiRelayHealthUpdated` في لوحة التحكم الخاصة بالعميل.
