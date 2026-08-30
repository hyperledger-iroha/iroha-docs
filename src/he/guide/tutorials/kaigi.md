---
translation_locale: he
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: 24dc7e6a41ea8a06d24663aebaeca2469c522e391a5de61f039c47a1cd020c91
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# כרוך Kaigi באפליקציה JavaScript {#embed-kaigi-in-a-javascript-app}

Kaigi מאפשרת יישום ליצור פגישות אוודיו / וידאו חד-משמעיות בעלות תמיכה בכספת, אשר מחזור חייהם נרשם באמצעות Iroha. הדפדפן עדיין מטפל בתקשורת עם WebRTC, בעוד ש Torii והנחיות של Kaigi מספקות את הקלטת הפגישות המתמשכת, נתוני סיגנל מוצפנים, תמיכה רשימה פרטית, אירועי שימוש.

הדרכה זו מראה את דפוס האינטגרציה המינימלי המשמשת על ידי אפליקציית [Iroha דמו JavaScript](https://github.com/soramitsu/iroha-demo-javascript):

- המציג יוצר הצעות ותשובות WebRTC
- סימנים של גשר בקשה ומגיש Kaigi עסקאות.
- קישורים קומפקטיים של הזמנה נושאים רק את ההזמנה ID והזמנה סודית.
- המארח מעקב Torii עבור תשובות משתתפים מוצפנות

הדוגמאות משתמשות TypeScript וכתבו כך שהם יכולים להפעיל באלקטרון, דפדפן עם קצה אחורי מאובטח, או אפליקציה אינטרנט עם הרחבת הארנק. לשמור על מפתחות פרטיות מחוץ לקוד המוצג לא אמין בהצירה.

## תנאים מוקדמים {#prerequisites}

אתה צריך:

- נקודת סוף Torii בעלת יכולת Kaigi
- חשבון עבור המארח וחשבון עבור האורח
- גישה למפתח החתימה של כל חשבון דרך גשר או ארנק אפליקציה מאובטח
- אישור מצלמת הדפדפן/מיקרופון
- Node.js 20+ אם אתה משתמש JavaScript דמו או ילידי `@iroha/iroha-js` חיבור ישיר

כדי לקבל תקשורת עבודה מלאה, הקלון את הדמו לצד בדיקת מקור Iroha:

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

השתמש בדמו עם [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js) ממחסנת המקור האחים Iroha . תלותה ב `file:` פותרת את הצ'אוקוט ישירות. אם הקשר המקומי משתנה, לבנות אותו מחדש תחת `iroha/javascript/iroha_js`; תיווך חבילות נקיים לא מכיל את חלל העבודה של Cargo הנדרש על ידי `npm run build:native`.

לפני הפעלת פגישה בשידור חי ב- TAIRA, בדוק את השטח הציבורי של Torii שדמו תלוי בו:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/v1/kaigi/relays"
curl -fsS "$TAIRA/v1/kaigi/relays/health"
```

פקודות אלה מאשרות כי TAIRA הוא חי וכי טלמטריה מרחבת Kaigi זמינה. הם לא מספקים עסקאות Kaigi. מבחן אמיתי `CreateKaigi` או `JoinKaigi` צריך לממן חשבונות TAIRA ולחתום דרך הגשר של הדמו או גשר אחר בעל תמיכה בארנק .

## ארכיטקטורה {#architecture}

לשמור על האינטגרציה Kaigi מחולקת לשלושה שכבות:

|שכבה |אחריות |
| --- | --- |
|UI |בחירת חשבון, טופס פגישה, תצוגה של קישור הזמנה, בקרת מדיה |
|WebRTC |`RTCPeerConnection`, תקשורת מקומית, תיאור הצעות ותשובות |
|גשר Iroha|חתימה, `CreateKaigi`, `JoinKaigi`, `EndKaigi`, סקר סימן |

גשר האפליקציה יכול להיות תשלום מקודם של אלקטרון API, הרחבת ארנק, או נקודת סוף אחורית. זה צריך לחשוף פנימה קטנה ל- UI:

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

באפליקציה הדמו, שיטות הגשר הללו מתבצעות עם `@iroha/iroha-js`, חתימה מקומית, נתונים מטאטא Kaigi מוצפן, וקריאות Torii.

## הזמינו עוזרים {#invite-helpers}

השתמש בטלפון Torii תואם IDs בנוסח `domain.dataspace:meeting`. הדמו משתמש `kaigi.universal:<call-name>` עבור פגישות שנוצרו.

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

## WebRTC עוזרים {#webrtc-helpers}

המארח יוצר הצעה, מאחסן אותה דרך `CreateKaigi`, והוא שומר את החלון פתוח כדי שיוכל ליישם את התשובה של האורח. האורח לוקח את ההצעה המוצפנת, יוצר תשובה, ושירותים שמגיבים `JoinKaigi`.

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

קבל את הזרמים ל- UI שלך עם אלמנטים וידאו רגילים:

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

## מארח: ליצור קישור לפגישה {#host-create-a-meeting-link}

זרימת המארח:

1. מצלמה פתוחה ומיקרופון
2. ליצור זוג מפתחות סימן Kaigi
3. ליצור הצעה WebRTC
4. להגיש `CreateKaigi`
5. לשתף קישור הזמנה קומפקטי

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

הראה `inviteLink` ב- UI שלך. המשתמש יכול להעתיק אותו, לפתוח אותו בארנק אחר, או להפוך אותו למסלול אפליקציה כגון:

```ts
export function inviteRoute(inviteLink: string): string {
  const invite = parseInviteLink(inviteLink);
  return `/kaigi?call=${encodeURIComponent(invite.callId)}&secret=${encodeURIComponent(
    invite.inviteSecretBase64Url,
  )}`;
}
```

## אורח: הצטרף לפגישה {#guest-join-a-meeting}

זרימת האורחים:

1. לנתח את ההזמנה
2. לקבל את הצעת השיחה המוצפנת מ Torii
3. ליצור תשובה WebRTC
4. להגיש `JoinKaigi` עם מטאמידה של תשובה מוצפנת.

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

אם הפגישה היא ברורה, אתה יכול לכלול שרשרת תצוגה של הארנק בקשה להצטרף. עבור פגישות פרטיות, לשמור `walletIdentity` ללא הגדרה אלא אם כן המשתמש בוחר במפורש לחשוף אותו.

## המארח: השתמש בתשובה של האורחים {#host-apply-the-guest-answer}

לאחר יצירת פגישה בשידור חי, המארח צריך לצפות באירועים Kaigi ולחקור על אותות תשובה מוצפנת. ליישם את התשובה הטובה הראשונה לקשר הדירוג של המארח.

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

שמור את המנוי החזר ID כך ש- UI שלך יכול לעצור את הצופה כאשר המארח תלוי או נעה.

## סיום הפגישה {#end-the-meeting}

לסיים את השיחה מאותו חשבון המארח שברא אותו:

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

## מימון במצב פרטי {#private-mode-funding}

מבצעים פרטיים Kaigi ליצור, להצטרף ולסתיים עשויים דורשים הגנת XOR עבור תשלום נקודת כניסה פרטית. האפליקציה שלך צריכה לתפוס את הטעות הזו ולהציע פעולה של הגנה עצמית לפני ניסיון נוסף.

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

בדמו, UI מבקש מהמשתמש להגנה עצמית ולאחר מכן מנסה מחדש את פעולה היצירה המקורית או הצטרף.

## סיבוב ידני {#manual-fallback}

סיגנול אוטומטי תלוי בכספת חיה, בדרכים Kaigi-אפשרות Torii, ויצירת ראיות במצב פרטי. לשמור על אחורה ידנית עבור פיתוח וסביבות מוגבלות:

- אם `CreateKaigi` לא מצליח, הראה הזמנה ידנית המכילה את ההצעה.
- אם `JoinKaigi` נכשל, הראה קופסת תשובה חלקה.
- תן למארח להדביק את פקטת התשובה ולהתקשר `setRemoteDescription`

הפסגה ידנית היא שימושית לטיפול בגין WebRTC, אך אינה מספקת את אותן ערבות סימן פרטי על שרשרת כמו זרימת Kaigi חיה.

## רשימת בדיקות {#test-checklist}

במבחנים של יחידה, תצחקו על הגשר ותגידו כי UI שלכם עובר את המשאבים הפועלים הנקפים Kaigi:

- מארח יוצר מדיה מקומית ומגיש `createKaigiMeeting`
- המארח מראה הזמנה `iroha://kaigi/join?call=...&secret=...`
- אורח בוחן את ההזמנה, מתקשר `getKaigiCall` ומגיש `joinKaigiMeeting`
- מארח סקרים או שעונים עבור אותות תשובה ומיישב את התשובה.
- דרישות מצב פרטי להגנה עצמית כאשר חסרה הגנת XOR
- ההפסקות ידנית מופיעות כאשר סיגנול חי אינו זמין

עבור קבוצת בדיקות התייחסות מלאה, ראה את תצפית Kaigi של אפליקציה דמו ובדיקות גשר טרום:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
```

בדיקת העשן UI מאשרת כי המסלול `/kaigi` משפיע. מבחן מדיה אמיתי עדיין זקוק לשני ארנקים מיועדים ועוד שני חלונות או מכשירים מכיוון שהרשימות לחתימת עסקאות, מצלמה, מייקרופון ו- WebRTC משתנות בהתאם לזמן הפעלה.

אם אתם בוחנים נגד TAIRA ומסלול קlamo ספציפי חוזר `404`, ראשית, אישרו כי הארנק המארח הוצא בהצלחה `CreateKaigi`. נקודות הסיום לבריאות הקשר יכולות להיות זמינות לפני כל שיחת מסוימת קיימת.

## הצעדים הבאים {#next-steps}

- הוסף רישום שימוש עם `RecordKaigiUsage` כאשר האפליקציה שלך בעלת חשבונות אמינים של משך הפגישה.
- רישום ומעקב על רילייים באמצעות `/v1/kaigi/relays` כאשר משתמשים במניפסטים של ריליי.
- אירועים על פני השטח `KaigiRosterSummary`, `KaigiUsageSummary`, ו `KaigiRelayHealthUpdated` בדשבורד המפעיל שלך.
