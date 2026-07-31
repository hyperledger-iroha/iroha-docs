---
translation_locale: ar
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: e55c7aebc89c39edb8e7077db2414a6d432aafb05aff8df04c248fce444d7dea
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# مدمج Kaigi في JavaScript التطبيق {#embed-kaigi-in-a-javascript-app}

Kaigi يسمح للتطبيق بإنشاء اجتماعات صوتية / فيديو فردية مدعومة محفظة
التي يتم تسجيلها من خلال Iroha. المتصفح لا يزال يتعامل مع وسائل الإعلام
WebRTC, بينما Torii و Kaigi التعليمات توفر الاجتماع الدائم
سجل، وتشفير البيانات المعدنية للإشارة، دعم القائمة الخاصة، وحوادث الاستخدام.

هذه الدروسية تظهر النمط الحد الأدنى للتكامل المستخدم من قبل
[Iroha التجربة JavaScript](https://github.com/soramitsu/iroha-demo-javascript)
التطبيق:

- الجهاز الذي يقوم بتقديم WebRTC العروض والردود
- علامات الطلب و تقديمها Kaigi المعاملات
- وصلات الدعوة المدمجة تحمل الدعوة فقط ID ودعوة سرية
- المضيف يراقب Torii للإجابات المشفرة للمشاركين

تستخدم الأمثلة TypeScript ويتم كتابتها بحيث يمكن أن تعمل في إلكترون،
متصفح مع خلفية آمنة، أو تطبيق ويب مع امتداد محفظة.
مفاتيح خاصة خارج رموز التنسيق غير الموثوق بها في الإنتاج.

## الشروط المسبقة {#prerequisites}

تحتاجين:

- (أ) Kaigi- قادر Torii نقطة النهاية
- حساب للمضيف وحساب للضيف
- الوصول إلى مفتاح التوقيع لكل حساب عبر جسر أو محفظة تطبيق آمن
- الإذن للكاميرا / الميكروفون المتصفح
- Node.js 20+ إذا كنت تستخدم JavaScript التجريبية أو الأصلية
  `@iroha/iroha-js` الالتزام المباشر

للحصول على إشارة عمل كاملة ، قم بتقليد التجربة بجوار Iroha المصدر
التسجيل:

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

استخدم التجربة مع
[`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js)
من الأخوة Iroha مخزن المصدر `file:` تعتمد تساعد على
إذا تغير الارتباط الأصلي، أعيد بناؤه تحت
`iroha/javascript/iroha_js`; إداري حزمة نظيفة لا يحتوي على
مساحة عمل الشحن المطلوبة من `npm run build:native`.

قبل إجراء اجتماع مباشر TAIRA, تحقق من الجمهور Torii السطح
التجربة تعتمد على:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/v1/kaigi/relays"
curl -fsS "$TAIRA/v1/kaigi/relays/health"
```

هذه الأوامر تثبت أن TAIRA هو على قيد الحياة وهذا Kaigi تلميتر الترسل هو
المتاحة. Kaigi المعاملات `CreateKaigi` أو
`JoinKaigi` احتياجات الاختبار مدعومة TAIRA الحسابات والتوقيع من خلال التجربة
جسر أو جسر آخر ذو محفظة.

## الهندسة المعمارية {#architecture}

احتفظي Kaigi التكامل مقسم إلى ثلاث طبقات:

| الطبقة | المسؤولية |
| --- | --- |
| UI | اختيار الحساب، نموذج الاجتماع، عرض رابط الدعوة، التحكم في وسائل الإعلام |
| WebRTC | `RTCPeerConnection`, وسائل الإعلام المحلية، وصف العروض والرد |
| Iroha الجسر | التوقيع `CreateKaigi`, `JoinKaigi`, `EndKaigi`, استطلاع الإشارات |

يمكن أن تكون جسر التطبيق إلكترونية API, إضافة محفظة أو خلفية
نقطة النهاية. يجب أن تعرض سطح صغير UI:

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

في تطبيق التجربة، يتم تنفيذ هذه الطرق الجسرية مع
`@iroha/iroha-js`, توقيع محلي، مشفر Kaigi البيانات الأساسية، و Torii مكالمات.

## دع المساعدين {#invite-helpers}

الاستخدام Torii-المكالمة المتوافقة IDs في `domain.dataspace:meeting` النموذج التجريبي
استخدامات `kaigi.universal:<call-name>` للاجتماعات المنتجة.

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

## WebRTC المساعدون {#webrtc-helpers}

المضيف يخلق عرضاً، ويحفظه `CreateKaigi`, ويحافظ على
فتح نافذة حتى يتمكن من تطبيق إجابة الضيف. الضيف يحصل على المشفرة
تقدم، يخلق إجابة، ونشر أن الإجابة مع `JoinKaigi`.

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

ربط التيارات إلى الخاص بك UI مع عناصر الفيديو العادية:

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

## المضيف: قم بإنشاء رابط للاجتماع {#host-create-a-meeting-link}

تدفق المضيف:

1. كاميرا مفتوحة وميكروفون
2. خلق Kaigi زوج مفاتيح الإشارة
3. خلق WebRTC العرض
4. تقديم `CreateKaigi`
5. مشاركة رابط دعوة

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

أظهر `inviteLink` في UI. يمكن للمستخدم نسخها، فتحها في محفظة أخرى،
أو تحويلها إلى طريق التطبيق مثل:

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
2. احصل على عرض المكالمة المشفرة من Torii
3. خلق WebRTC الإجابة
4. تقديم `JoinKaigi` مع البيانات الوصفية للرد المشفرة

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

إذا كان الاجتماع شفافا، يمكنك إدراج سلسلة عرض محفظة في
طلب المشاركة في الاجتماعات الخاصة `walletIdentity` غير المحدد إلا إذا كان المستخدم
يختار صراحة الكشف عنه

## المضيف: تطبيق إجابة الضيف {#host-apply-the-guest-answer}

بعد إنشاء اجتماع مباشر، يجب على المضيف مشاهدة Kaigi الأحداث والاستطلاع
إشارات الإجابة المشفرة. تطبيق أول إجابة صالحة على نظير المضيف
الإتصال

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

تخزين الاشتراك المرجع ID إذاً UI يمكن أن يوقف المراقب عندما
المضيف يغلق أو يبتعد

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

خاصة Kaigi يمكن أن تتطلب عمليات إنشاء، الانضمام، والانتهاء XOR لـ
رسوم نقطة دخول خاصة. يجب أن يكتشف تطبيقك هذا الخطأ ويعرض
إجراءات الحماية الذاتية قبل محاولة أخرى.

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

في التجربة، UI يطالب المستخدم بالتحميض الذاتي ثم يحاول مرة أخرى
إنشاء أو الانضمام إلى العمل الأصلي.

## الإرجاع اليدوي {#manual-fallback}

الإشارات الآلية تعتمد على محفظة حية Kaigi- قادر Torii الطرق، و
إنتاج دليل في الوضع الخاص. الحفاظ على التراجع يدوي للتطوير
البيئات المحدودة:

- إذا `CreateKaigi` إذا فشلت، أرسل دعوة يدوية تحتوي على العرض
- إذا `JoinKaigi` الفشل، إظهار حزمة الإجابة الخام
- اسمحوا للمضيف بتثبيت حزمة الإجابة والاتصال `setRemoteDescription`

الإرجاع اليدوي مفيد للتشغيل WebRTC, ولكن لا توفر
نفس ضمانات الإشارة الخاصة على السلسلة كما هو الحال Kaigi التدفق

## قائمة اختبار {#test-checklist}

للاختبارات الوحدة، استهزاء الجسر وتأكيد أن UI يتجاوز المتوقع
Kaigi الحمولات المفيدة:

- المضيف يخلق وسائل الإعلام المحلية ويرسل `createKaigiMeeting`
- المضيف يعرض `iroha://kaigi/join?call=...&secret=...` دعوة
- الضيف يحلل الدعوة، الاتصالات `getKaigiCall`, و يقدم
  `joinKaigiMeeting`
- تستضيف استطلاعات الاستقصاء أو ساعات للإشارات الإجابة وتطبق الإجابة
- إشارات النظام الخاص للوقاية الذاتية عند الحماية XOR مفقود
- يظهر الإرجاع اليدوي عندما لا توجد إشارات حية

للحصول على مجموعة اختبار مرجعية كاملة، انظر التطبيق التجريبي Kaigi الرؤية والتحميل السابق
اختبارات الجسر:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
```

(الـ) UI اختبار الدخان يثبت أن `/kaigi` أداء الممر. اختبار صحفي حقيقي
لا يزال يحتاج إلى محفظتين مدعومين بالإضافة إلى نافذة أو أجهزة لأن المعاملة
التوقيع والكاميرا والميكروفون WebRTC الإذنات تختلف حسب وقت التشغيل.

إذا كنت تختبر ضد TAIRA وعودة مسار محدد للدعوة `404`, أولاً
تأكيد أن محفظة المضيف قدمت بنجاح `CreateKaigi`. صحة الرصيف
يمكن أن تكون النقاط النهائية متاحة قبل وجود أي دعوة معينة.

## الخطوات التالية {#next-steps}

- إضافة تسجيل استخدام مع `RecordKaigiUsage` عندما يكون التطبيق الخاص بك موثوق
  محاسبة مدة الجلسة
- تسجيل ومراقبة الروافذ من خلال `/v1/kaigi/relays` عند استخدام الرصيف
  المظاهر.
- سطح الأرض `KaigiRosterSummary`, `KaigiUsageSummary`, و
  `KaigiRelayHealthUpdated` الأحداث في لوحة التحكم الخاصة بك
