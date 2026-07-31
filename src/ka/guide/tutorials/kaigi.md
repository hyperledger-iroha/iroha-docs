---
translation_locale: ka
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: e55c7aebc89c39edb8e7077db2414a6d432aafb05aff8df04c248fce444d7dea
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ჩასმული Kaigi ა JavaScript აპლიკაცია {#embed-kaigi-in-a-javascript-app}

Kaigi საშუალებას აძლევს აპლიკაციამ შექმნას საფულის მხარდაჭერილი ერთი-ერთ აუდიო/ვიდეო შეხვედრები
რომლის სიცოცხლის ციკლი დაფიქსირებულია Iroha. ბრაუზერი კვლავ მართავს მედიას
WebRTC, ხოლო Torii და Kaigi ინსტრუქციები უზრუნველყოფს ხანგრძლივი შეხვედრის
ჩანაწერი, დაშიფრებული სიგნალის მეტა მონაცემები, კერძო სიაში მხარდაჭერა და გამოყენების მოვლენები.

ეს სახელმძღვანელო გვიჩვენებს მინიმალური ინტეგრაციის ნიმუში გამოყენებული
[Iroha დემო JavaScript](https://github.com/soramitsu/iroha-demo-javascript)
აპლიკაცია

- რედაქტორი ქმნის WebRTC შეთავაზებები და პასუხები
- აპლიკაციის ხიდზე წარწერა და წარდგენა Kaigi ოპერაციები
- კომპაქტური მოწვევის ბმულები ატარებენ მხოლოდ ზარს ID და მიიწვიე საიდუმლო,
- მასპინძელი საათები Torii ჩიფრული მონაწილეების პასუხებისთვის

მაგალითების გამოყენება TypeScript და წერია ისე, რომ მათ შეუძლიათ გაშვება ელექტრონში, a
ბრაუზერი უსაფრთხო backend, ან ვებ აპლიკაცია ფულის გაფართოებით.
წარმოებაში არსებული არასაიმედო რენდერის კოდის გარეთ პირადი გასაღები.

## წინაპირობები {#prerequisites}

თქვენ გჭირდებათ:

- ბ) Kaigi-მძლავრი. Torii საბოლოო წერტილი
- ანგარიში მასპინძლისა და სტუმრისთვის
- თითოეული ანგარიშის ხელმოწერის გასაღების წვდომა უსაფრთხო აპლიკაციის ხიდის ან კაპიტალის მეშვეობით
- ბრაუზერის კამერა/მიკროფონის ნებართვები
- Node.js 20+ თუ თქვენ იყენებთ JavaScript დემო ან ადგილობრივი
  `@iroha/iroha-js` პირდაპირი კავშირი

სრული სამუშაო რეფერენციის მისაღებად, კლონირება დემოს გვერდით Iroha წყარო
გადახდა:

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

გამოიყენეთ დემო
[`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js)
ძმისაგან Iroha წყარო რეპოზიტორი. `file:` დამოკიდებულება ხსნის, რომ
თუ ადგილობრივი კავშირი შეიცვლება, აღადგინეთ იგი
`iroha/javascript/iroha_js`; სუფთა პაკეტის დირექტორი არ შეიცავს:
სატვირთო სამუშაო სივრცე `npm run build:native`.

სანამ პირდაპირი შეხვედრა TAIRA, შეამოწმეთ საზოგადოება Torii ზედაპირი, რომ
დემო დამოკიდებულია:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/v1/kaigi/relays"
curl -fsS "$TAIRA/v1/kaigi/relays/health"
```

ეს ბრძანებები ადასტურებს, რომ TAIRA არის ცოცხალი და რომ Kaigi რელეების ტელემეტრიის
ხელმისაწვდომია. ისინი არ წარადგენენ Kaigi ტრანზაქციები. `CreateKaigi` ან
`JoinKaigi` კვლევის საჭიროებები დაფინანსებული TAIRA ანგარიშები და დემო-ის მეშვეობით ხელმოწერა
ხიდი ან სხვა საფულეზე დამყარებული ხიდი.

## არქიტექტურა {#architecture}

შეინახეთ Kaigi ინტეგრაცია სამ ფენაზე გაყოფილი:

| ფენა | პასუხისმგებლობა |
| --- | --- |
| UI | ანგარიშის შერჩევა, შეხვედრის ფორმა, მოწვევის ბმულის ჩვენება, მედია კონტროლი |
| WebRTC | `RTCPeerConnection`, ადგილობრივი მედია, შეთავაზებისა და პასუხების აღწერა |
| Iroha ხიდი | ხელმოწერა, `CreateKaigi`, `JoinKaigi`, `EndKaigi`, სიგნალის გამოკითხვა |

აპლიკაციის ხიდი შეიძლება იყოს ელექტრონული წინასწარი დატვირთვა API, საფულის გაგრძელება ან უკანა ბოლო
საბოლოო წერტილი. ის უნდა გამოავლინოს მცირე ზედაპირი UI:

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

დემო აპლიკაციაში, ეს ხიდის მეთოდები განხორციელებულია
`@iroha/iroha-js`, ადგილობრივი ხელმოწერა, დაშიფვრა Kaigi მეტა მონაცემები და Torii ზარი.

## დავეხმაროთ {#invite-helpers}

გამოყენება Torii-საკომპეტენტური ზარი IDs დაწვრილებით `domain.dataspace:meeting` ფორმა. დემო
გამოყენება `kaigi.universal:<call-name>` წარმოქმნილი შეხვედრებისთვის.

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

## WebRTC დამხმარეები {#webrtc-helpers}

მასპინძელი ქმნის შეთავაზებას, ინახავს მას `CreateKaigi`, და ინახავს
ფანჯარა გაიხსნება, რათა მას შეუძლია გამოიყენოს სტუმრის პასუხი. სტუმარი მოიძიებს დაშიფრებული
შეთავაზება, ქმნის პასუხს და პოსტები, რომ პასუხი `JoinKaigi`.

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

შეაერთეთ ნაკადები თქვენს UI ჩვეულებრივი ვიდეო ელემენტებით:

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

## მასპინძელი: შექმენით შეხვედრის ბმული {#host-create-a-meeting-link}

მასპინძლის ნაკადი:

1. ღია კამერა და მიკროფონი
2. შექმნას a Kaigi სიგნალის საკვანძო წყვილი
3. შექმნას a WebRTC შეთავაზება
4. წარადგინოს `CreateKaigi`
5. გაუზიარეთ კომპაქტური მოწვევის ბმული

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

ჩვენება `inviteLink` თქვენი UI. მომხმარებელს შეუძლია მისი კოპირება, გახსნა სხვა საფულეში.
ან გადააქციეთ ის აპლიკაციის მარშრუტი, როგორიცაა:

```ts
export function inviteRoute(inviteLink: string): string {
  const invite = parseInviteLink(inviteLink);
  return `/kaigi?call=${encodeURIComponent(invite.callId)}&secret=${encodeURIComponent(
    invite.inviteSecretBase64Url,
  )}`;
}
```

## სტუმარი: მიდი შეხვედრაზე {#guest-join-a-meeting}

სტუმრების ნაკადი:

1. შეამოწმეთ მოწვევა
2. მიიღეთ კოდირებული ზარის შეთავაზება Torii
3. შექმნას a WebRTC პასუხი
4. წარადგინოს `JoinKaigi` ჩიფრული პასუხის მეტა მონაცემებით

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

თუ შეხვედრა გამჭვირვალეა, შეგიძლიათ ჩართოთ საფულეების ჩვენების სიგელი
შეხება. კერძო შეხვედრებისთვის, `walletIdentity` ამოხსნა, თუ მომხმარებელი
აშკარად ირჩევს ამის გამოცხადებას.

## მასპინძელი: გამოიყენეთ სტუმრის პასუხი {#host-apply-the-guest-answer}

მას შემდეგ, რაც შექმნილია ცოცხალი შეხვედრა, მასპინძელი უნდა უყუროს Kaigi ღონისძიებები და გამოკითხვა
ჩიფრული პასუხის სიგნალები. გამოიყენეთ პირველი ვალიდური პასუხი მასპინძლის თანატოლებს
კავშირი.

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

შეინახეთ დაბრუნებული აბონენტი ID ასე რომ თქვენი UI შეიძლება შეაჩეროს დამკვირვებელი, როდესაც
მასპინძელი დახურება ან გაემგზავრება.

## შეხვედრის დასრულება {#end-the-meeting}

შეწყვიტეთ ზარი იმავე მასპინძელი ანგარიშიდან, რომელმაც შექმნა ის:

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

## კერძო რეჟიმის დაფინანსება {#private-mode-funding}

კერძო Kaigi შექმნა, შეკრება და დასრულების ოპერაციები შეიძლება მოითხოვოს დაცული XOR სამინისტრო
თქვენი აპლიკაციამ უნდა დააკავშიროს ეს შეცდომა
თვითშეზღუდვის მოქმედება, სანამ განმეორებით შეეცდებით.

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

დემოში, UI მომხმარებელს აძლევს თვითგადაკეტვა და შემდეგ კვლავ ცდილობს
ორიგინალური შექმნა ან შეუერთება მოქმედება.

## მანიუალური გადაცემა {#manual-fallback}

ავტომატური სიგნალი დამოკიდებულია ცოცხალ საფულეზე. Kaigi-მძლავრი. Torii მარშრუტები და
მტკიცებულება წარმოება კერძო რეჟიმში. შეინახეთ ხელით fallback განვითარების და
შეზღუდული გარემო:

- თუ `CreateKaigi` ვერ შეასრულებს, აჩვენეთ სახელმძღვანელო მოწვევა შეთავაზების შემცველობით
- თუ `JoinKaigi` არასწორია, აჩვენეთ ნედლეული პასუხის პაკეტი
- დაუშვათ მასპინძელს დააჭიროს პასუხის პაკეტი და მოუწოდოთ `setRemoteDescription`

საბაგირო ჩავარდნა სასარგებლოა დებეგინგისთვის WebRTC, მაგრამ ის არ უზრუნველყოფს
იგივე პირადი ქსელზე სიგნალის გარანტიები, როგორც პირდაპირი Kaigi დევნა.

## ტესტის სარეკლამო სია {#test-checklist}

ერთეულის ტესტებისთვის, გაეცინეთ ხიდს და ადასტურეთ, რომ თქვენი UI აღემატება მოსალოდნელი
Kaigi სასარგებლო ტვირთები:

- მასპინძელი ქმნის ადგილობრივ მედიასაშუალებებს და წარადგენს `createKaigiMeeting`
- მასპინძელი აჩვენებს `iroha://kaigi/join?call=...&secret=...` მოწვევა
- სტუმარი შეისწავლის მოწვევას, ზარებს `getKaigiCall`, და წარუდგენს
  `joinKaigiMeeting`
- მასპინძელი გამოკითხვები ან საათები პასუხების სიგნალებისთვის და იყენებს პასუხს
- პირადი რეჟიმის მოთხოვნები თვითგადაფარვისთვის, როდესაც დაცულია XOR აკლია
- ხელმოწერილი ჩავარდნა გამოჩნდება, როდესაც ცოცხალი სიგნალი არ არის ხელმისაწვდომი

სრული რეფერენციული ტესტის კომპლექტისათვის იხილეთ დემოს აპლიკაცია Kaigi ხედვა და წინასწარი გადატვირთვა
ხიდის გამოცდები:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
```

სააგენტო UI ღუმელის ტესტი ადასტურებს, რომ `/kaigi` რეალური მედია ტესტი.
ჯერ კიდევ საჭიროებს ორი დაფინანსებული ქაღალდი პლუს ორი ფანჯრები ან მოწყობილობები, რადგან ტრანზაქცია
ხელმოწერა, კამერა, მიკროფონი და WebRTC ნებართვები განსხვავდება გამშვები დროის მიხედვით.

თუ თქვენ ტესტირებას TAIRA და ზარის სპეციფიკური მარშრუტის დაბრუნება `404`, პირველი
დაადასტურეთ, რომ მასპინძელი საფულე წარმატებით შევიდა `CreateKaigi`. რელეების ჯანმრთელობა
საბოლოო წერტილები შეიძლება იყოს ხელმისაწვდომი, სანამ რაიმე კონკრეტული ზარი არ არსებობს.

## შემდეგი ნაბიჯები {#next-steps}

- დაამატეთ გამოყენების ჩანაწერი `RecordKaigiUsage` როდესაც თქვენი აპლიკაცია აქვს საიმედო
  სესიის ხანგრძლივობის აღრიცხვა.
- რეგისტრირება და მონიტორინგი რელიეების საშუალებით `/v1/kaigi/relays` რელეის გამოყენებისას
  მანიფესტები.
- ზედაპირი `KaigiRosterSummary`, `KaigiUsageSummary`, და
  `KaigiRelayHealthUpdated` მოვლენები თქვენს ოპერატორის დაშბორდში.
