---
translation_locale: he
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: e55c7aebc89c39edb8e7077db2414a6d432aafb05aff8df04c248fce444d7dea
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# מוטבע Kaigi ב- JavaScript אפליקציה {#embed-kaigi-in-a-javascript-app}

Kaigi מאפשרת יישום ליצור פגישות אוודיו / וידאו חד-משמעיות עם תמיכה בארנק
אשר מחזור חייו נרשם באמצעות Iroha. הדפדפן עדיין מטפל בתקשורת עם
WebRTC, בזמן Torii ו... Kaigi ההוראות מספקות את הפגישה המתמשכת
רישום, נתונים מטא סיגנליים מוצפנים, תמיכה ברשימה פרטית ואירועים בשימוש.

הדרכה זו מראה את דפוס האינטגרציה המינימלי המשמש על ידי
[Iroha דמו JavaScript](https://github.com/soramitsu/iroha-demo-javascript)
אפליקציה:

- המוצג יוצר WebRTC הצעות ותשובות
- סימנים של גשר בקשה ומספקים Kaigi עסקאות
- קישורים קומפקטיים של הזמנות נושאים רק את ההזמנה. ID ומזמין בסוד
- השעון המארח Torii עבור תשובות משתתפים מוצפן

הדוגמאות משתמשות TypeScript והם נכתבים כך שהם יכולים לפעול באלקטרון,
דפדפן עם סיבוב מאובטח, או אפליקציה אינטרנט עם הרחבת ארנק.
מפתחות פרטיות מחוץ לקוד משדר לא מהימן בהפקה.

## תנאים מוקדמים {#prerequisites}

אתה צריך:

- א Kaigi-יכול Torii נקודת סוף
- חשבון עבור המארח וחשבון עבור האורח
- גישה למפתח החתימה של כל חשבון דרך גשר או ארנק אפליקציה מאובטח
- אישור מצלמה/מיקרופון בלוחץ
- Node.js 20+ אם אתה משתמש JavaScript דמו או ילידי
  `@iroha/iroha-js` חיבור ישיר

כדי לקבל תקשורת עבודה מלאה, הקלון את הדמו ליד Iroha מקור
בדיקת:

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

השתמש בדמו עם
[`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js)
מהאחים Iroha מאגר המקור. `file:` התלות פותרת את
אם הקשר המקומי משתנה, לבנות אותו מחדש תחת
`iroha/javascript/iroha_js`; תיק ארגזים נקיים לא מכיל את
שטח עבודה של מטען הנדרש על ידי `npm run build:native`.

לפני שנערך פגישה חי TAIRA, בדוק את הציבור Torii על פני השטח
הדמו תלויה:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/v1/kaigi/relays"
curl -fsS "$TAIRA/v1/kaigi/relays/health"
```

פקודות אלה מאשרות TAIRA הוא חי וזה Kaigi טלמטריה של משדר הוא
הם לא מספקים Kaigi עסקאות. `CreateKaigi` או
`JoinKaigi` צרכי הבדיקה מיועדים TAIRA חשבונות וחתום דרך הדמו של
גשר או גשר אחר עם ארנק.

## ארכיטקטורה {#architecture}

שמרו על Kaigi אינטגרציה מחולקת לשלושה שכבות:

| שכבה | אחריות |
| --- | --- |
| UI | בחירת חשבון, טופס פגישה, הצגת קישור הזמנה, בקרת מדיה |
| WebRTC | `RTCPeerConnection`, תקשורת מקומית, תיאור הצעות ותשובות |
| Iroha גשר | חתימה, `CreateKaigi`, `JoinKaigi`, `EndKaigi`, סקר סיגנלי |

הגשר של האפליקציה יכול להיות חיפוש מקודם של אלקטרונים API, הרחבה של הארנק, או סיבוב אחורי
נקודת סוף. UI:

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

באפליקציה הדמו, שיטות גשר אלה יושמשות
`@iroha/iroha-js`, חתימה מקומית, מוצפנת Kaigi נתונים מטאטא, ו Torii שיחות.

## הזמינו עוזרים {#invite-helpers}

שימוש Torii-התקשרות מתאימות IDs ב- `domain.dataspace:meeting` טופס הדמו
שימוש `kaigi.universal:<call-name>` עבור פגישות שנוצרו.

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

המארח יוצר הצעה, מאחסן אותה דרך `CreateKaigi`, ושומר על
החלון נפתח כך שהוא יכול ליישם את התשובה של האורח.
הצעה, יוצרת תשובה, ומפרסמים את התשובה `JoinKaigi`.

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

קבל את הזרמים שלך UI עם אלמנטים וידאו רגילים:

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
2. ליצור Kaigi זוג מפתחות סימן
3. ליצור WebRTC הצעה
4. להגיש `CreateKaigi`
5. לחלוק קישור הזמנה קומפקטי

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

הראה `inviteLink` ב- UI. המשתמש יכול להעתיק אותו, לפתוח אותו בארנק אחר,
או להפוך אותו למסלול אפליקציה כגון:

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
2. קבל את הצעת השיחה המוצפנת Torii
3. ליצור WebRTC תשובה
4. להגיש `JoinKaigi` עם נתונים מטאטא של התשובה מוצפנים

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

אם הפגישה היא ברורה, אתה יכול לכלול רצועת תצוגה של הארנק
בקשה להצטרף. לפגישות פרטיות, לשמור `walletIdentity` לא ניתן להגדיר אלא אם כן המשתמש
הוא בוחר באופן מפורש לגלות את זה.

## מארח: השתמש בתשובה של האורחים {#host-apply-the-guest-answer}

לאחר יצירת פגישה חי, המארח צריך לצפות Kaigi אירועים ודיונים
סימני תשובה מוצפנים. תחיל את התשובה הטובה הראשונה לשותף של המארח
קשר.

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

שמור את ההפגשה ID אז שלך UI יכול לעצור את המצפה כאשר
המארח תנתק או נעה.

## סיום הפגישה {#end-the-meeting}

לסיים את השיחה מאותו חשבון מארח שברא אותו:

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

פרטי Kaigi ליצור, להצטרף ולסיים פעולות עשויות לצרוך מגנים XOR עבור
דמי כניסה פרטיים. האפליקציה שלך צריכה לתפוס את הטעות הזו ולהציע
פעולה של הגנת עצמית לפני ניסיון נוסף.

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

בדמו, UI הוא מבקש מהמשתמשים להתגונן בעצמם ואז מנסה שוב
ליצור או להצטרף לפעולה מקורית.

## כוונת ההפסקות ידנית {#manual-fallback}

סיגנול אוטומטי תלוי בארנק חי, Kaigi-יכול Torii מסלולים, ו
ייצור הוכחה במצב פרטי.
סביבות מוגבלות:

- אם `CreateKaigi` אם לא, הראה הזמנה ידנית המכילה את ההצעה.
- אם `JoinKaigi` כשל, הראה פעקת תשובה חלקה
- תן למארח להדביק את פקט התשובה ולהתקשר `setRemoteDescription`

ההפסקות ידנית היא שימושית לתיקון WebRTC, אבל זה לא מספק את
אותן ערבות סיגנוליות פרטיות על שרשרת כמו Kaigi זרימה.

## רשימת בדיקות {#test-checklist}

עבור בדיקות יחידות, להתלונן על הגשר ולהטען כי UI עובר את הציפיות
Kaigi מטענים:

- המארח יוצר מדיה מקומית ומגיש `createKaigiMeeting`
- המארח מראה `iroha://kaigi/join?call=...&secret=...` הזמנה
- אורח מחלק את ההזמנה, מתקשרים `getKaigiCall`, ומגיש
  `joinKaigiMeeting`
- מחקרים מארחים או שעונים עבור אותות תשובה ומיישבים את התשובה
- תורמים למצב פרטי להגנה עצמית בעת הגנת XOR נעלמת.
- ההפסקות ידנית מופיעות כאשר סיגנול חי אינו זמין

עבור קבוצת בדיקות מרמזים מלאה, ראה אפליקציה הדמו Kaigi תצוגה ונטול מקודם
בדיקות גשר:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
```

ה- UI בדיקת עשן מאשרת כי `/kaigi` תוצאות מסלול.
עדיין צריך שני ארנקים מיומנים ועוד שני חלונות או מכשירים כי העסקה
חתימה, מצלמה, מיקרופון ו WebRTC הזכויות משתנות בהתאם לזמן ההפעלה.

אם אתה בוחן נגד TAIRA ומחזור מסלול ספציפי לשיחה `404`, ראשית
אושר כי הארנק המארח הוצא בהצלחה `CreateKaigi`. בריאות הקשר
נקודות-סוף יכולות להיות זמינות לפני שיקום קירור מסוים.

## הצעדים הבאים {#next-steps}

- הוסף רישום שימוש עם `RecordKaigiUsage` כאשר האפליקציה שלך היא אמינה
  חשבונאות שלמות הפגישה.
- רלוויזים לאספקה ומעקב `/v1/kaigi/relays` כאשר משתמשים ברשת
  מוניפסטים.
- פני השטח `KaigiRosterSummary`, `KaigiUsageSummary`, ו
  `KaigiRelayHealthUpdated` אירועים בדשבੋਰਡ המפעיל שלך.
