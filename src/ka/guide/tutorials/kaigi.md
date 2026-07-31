---
translation_locale: ka
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: e55c7aebc89c39edb8e7077db2414a6d432aafb05aff8df04c248fce444d7dea
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# შეყვანილი Kaigi JavaScript აპლიკაციაში {#embed-kaigi-in-a-javascript-app}

Kaigi საშუალებას აძლევს აპლიკაციას შექმნას საფულის მხარდაჭერილი ერთი-ერთ აუდიო/ვიდეო შეხვედრები, რომელთა სიცოცხლის ციკლი დაფიქსირებულია Iroha საშუალებით. ბრაუზერი კვლავ მართავს მედიას WebRTC, ხოლო Torii და Kaigi ინსტრუქციები უზრუნველყოფენ მდგრადი შეხვედრების ჩანაწერს, კოდირებულ სიგნალირების მეტა მონაცემებს, კერძო სიაში მხარდაჭერა და გამოყენების ღონისძიებები.

ეს სახელმძღვანელო აჩვენებს მინიმალურ ინტეგრაციის ნიმუშს, რომელსაც იყენებს [Iroha დემო JavaScript](https://github.com/soramitsu/iroha-demo-javascript) აპლიკაცია:

- რედაქტორი ქმნის შეთავაზებებს და პასუხებს WebRTC
- აპლიკაცია ხიდზე აწერს და Kaigi ტრანზაქციებს წარადგენს
- კომპაქტური მოწვევის ბმულები შეიცავს მხოლოდ ზარს ID და მოწვევა საიდუმლო
- მასპინძელი უყურებს Torii ჩიფრული მონაწილეების პასუხებზე

მაგალითები იყენებენ TypeScript და იწერება ისე, რომ მათ შეუძლიათ გაუშვათ Electron- ში, ბრაუზერში უსაფრთხო უკანა მხარით ან ვებ აპლიკაციაზე ქაღალდის გაფართოებით. ინახეთ პირადი გასაღებები არასაიმედო რენდერის კოდის გარეთ წარმოებისას.

## წინაპირობები {#prerequisites}

თქვენ გჭირდებათ:

- Kaigi-სუნებრიობის Torii საბოლოო წერტილი
- ანგარიში მასპინძლისა და სტუმარისათვის.
- წვდომა თითოეული ანგარიშის ხელმოწერის გასაღები უსაფრთხო აპლიკაციის ხიდის ან საფულის მეშვეობით.
- ბრაუზერის კამერა/მიკროფონის ნებართვები
- Node.js 20+ თუ თქვენ იყენებთ JavaScript დემოს ან მშობლიურ `@iroha/iroha-js` დამაკავშირებელ პირდაპირს

სრული სამუშაო რეფერენციის მისაღებად, კლონირებული დემო Iroha წყარო გადახდის გვერდით:

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

გამოიყენეთ დემო [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js) ძმური Iroha წყარო რეპოზიტორიდან. მისი `file:` დამოკიდებულება უშუალოდ ხსნის გადახდას. თუ ადგილობრივი კავშირი იცვლება, აღადგინეთ იგი `iroha/javascript/iroha_js`; სუფთა პაკეტის დირექტორი არ შეიცავს სატვირთო სამუშაო სივრცეს, რომელიც საჭიროა `npm run build:native`.

სანამ TAIRA-ზე პირდაპირი შეხვედრა ჩატარდება, შეამოწმეთ საჯარო Torii ზედაპირი, რომელზეც დემო დამოკიდებულია:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/v1/kaigi/relays"
curl -fsS "$TAIRA/v1/kaigi/relays/health"
```

ეს ბრძანებები ადასტურებს, რომ TAIRA არის ცოცხალი და რომ Kaigi რელე ტელემეტრიია ხელმისაწვდომია. ისინი არ წარუდგენენ Kaigi ტრანზაქციებს. რეალური `CreateKaigi` ან `JoinKaigi` ტესტი საჭიროა ფინანსირებული TAIRA ანგარიშები და ხელმოწერა დემოს ხიდზე ან სხვა ქაღალდის მხარდაჭერით ხიდზე.

## არქიტექტურა {#architecture}

ინტეგრაციის Kaigi გაყოფა სამ ფენაზე:

|ფენა |პასუხისმგებლობა |
| --- | --- |
|UI |ანგარიშის შერჩევა, შეხვედრის ფორმა, მოწვევის ბმულის ჩვენება, მედიის კონტროლი |
|WebRTC |`RTCPeerConnection`, ადგილობრივი მედია, შეთავაზების და პასუხის აღწერილობა |
|Iroha ხიდი |ხელმოწერა, `CreateKaigi`, `JoinKaigi`, `EndKaigi`, სიგნალების გამოკითხვა |

აპლიკაციის ხიდი შეიძლება იყოს ელექტრონული წინასწარ დატვირთვა API, ქაღალდის გაფართოება ან ფულის ბოლო წერტილი. ეს უნდა გამოავლინოს მცირე ზედაპირი UI:

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

დემო აპლიკაციაში, ეს ხიდის მეთოდები განხორციელებულია `@iroha/iroha-js`, ადგილობრივი ხელმოწერა, დაშიფვრა Kaigi მეტა მონაცემებით და Torii ზარით.

## დაპატიჟეთ დამხმარეები {#invite-helpers}

გამოიყენეთ Torii-თან თავსებადი ზარი IDs ფორმაში `domain.dataspace:meeting`. დემო იყენებს `kaigi.universal:<call-name>` გენერირებული შეხვედრებისთვის.

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

მასპინძელი ქმნის შეთავაზებას, ინახავს მას `CreateKaigi`, და ფანჯარა გახსნილია ისე, რომ მას შეუძლია გამოიყენოს სტუმრის პასუხი. სტუმარი იძიებს კოდირებულ შეთავაზებებს, ქმნის პასუხს და აქვეყნებს პასუხს `JoinKaigi` .

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

მიაერთეთ ნაკრებები თქვენს UI ჩვეულებრივი ვიდეო ელემენტებით:

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

მასპინძელი ნაკადი:

1. ღია კამერა და მიკროფონი
2. შეიქმნას Kaigi სიგნალის გასაღები წყვილი
3. შეიქმნას შეთავაზება WebRTC
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

აჩვენეთ `inviteLink` თქვენი UI. მომხმარებელს შეუძლია აკოპიროს იგი, გახსნას სხვა საფულეში ან გადაიყვანოს ის აპლიკაციის მარშრუტით, როგორიცაა:

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
2. მოიტანეთ დაშიფვრილი ზარის შეთავაზება Torii
3. შეიქმნას WebRTC პასუხი
4. წარადგინოს `JoinKaigi` დაშიფვრილი პასუხის მეტა მონაცემებით

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

თუ შეხვედრა გამჭვირვალეა, შეგიძლიათ შეავსოთ ქაღალდის ჩვენების სიგელი გაერთიანების თხოვნაში. კერძო შეხვედრებისთვის, შეინახეთ `walletIdentity`, თუ მომხმარებელი მკაფიოდ არ ირჩევს გამოავლინოს ეს.

## მასპინძელი: გამოიყენე სტუმრის პასუხი {#host-apply-the-guest-answer}

ცოცხალი შეხვედრის შექმნის შემდეგ, მასპინძელმა უნდა უყუროს Kaigi მოვლენებს და გამოკითხოს კოდირებული პასუხის სიგნალების შესახებ. გამოიყენეთ პირველი ბერული პასუხი მასპინძლის თანატოლთა კავშირზე.

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

შეინახეთ დაბრუნებული აბონენტი ID ისე, რომ თქვენი UI შეიძლება შეაჩეროს დამკვირვებელი, როდესაც მასპინძელი დახურავს ან ნავიგირებს გარეთ.

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

კერძო Kaigi შექმნა, გაერთიანება და დასრულების ოპერაციები შეიძლება მოითხოვოს დაცული XOR კერძო შესასვლელი პუნქტის საფასურისათვის. თქვენი აპლიკაცია უნდა აღმოაჩინოს ეს შეცდომა და სთავაზობს თვითშეზღუდვის ქმედება, სანამ განმეორებით ცდილობს.

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

დემოში, UI მოუწოდებს მომხმარებელს თვითშეზღუდვას და შემდეგ განახორციელოს ორიგინალური შექმნის ან შეუერთების ქმედება.

## საბაგირო ჩავარდნა {#manual-fallback}

ავტომატური სიგნალი დამოკიდებულია ცოცხალ საფულეზე, Kaigi -შეწყობილი Torii მარშრუტებზე და მტკიცებულების გამომუშავებაზე კერძო რეჟიმში. შეინახეთ ხელით განვითარებისა და შეზღუდული გარემოსთვის:

- თუ `CreateKaigi` წარუმატებელია, აჩვენეთ შეთავაზების შემცველი სახელმძღვანელო მოწვევა.
- თუ `JoinKaigi` არ გამოვა, აჩვენეთ ნედლეული პასუხის პაკეტი.
- დაუშვას მასპინძელს დააჭიროს პასუხის პაკეტი და დარეკოს `setRemoteDescription`

სასწრაფო რეჟიმში ჩართვისას WebRTC-ის დებეგირება სასარგებლოა, მაგრამ იგი არ უზრუნველყოფს იმავე კერძო ქსელზე სიგნალიზაციის გარანტიებს, როგორც ცოცხალი Kaigi ნაკადი.

## ტესტის შეამოწმებელი სია {#test-checklist}

გაზომილების გამოცდებისთვის, აჩვენეთ ხიდი და ადასტურეთ, რომ თქვენი UI გადადის მოსალოდნელი Kaigi სასარგებლო ტვირთები:

- მასპინძელი ქმნის ადგილობრივ მედიასაშუალებებს და წარადგენს `createKaigiMeeting`
- მასპინძელი აჩვენებს `iroha://kaigi/join?call=...&secret=...` მოწვევას.
- სტუმარი შეისწავლის მოწვევას, ეძახება `getKaigiCall` და წარადგენს `joinKaigiMeeting`;
- მასპინძელი გამოკითხვები ან საათები პასუხის სიგნალებისათვის და იყენებს პასუხს
- კერძო რეჟიმში თვითგადაფარვის ინსტრუმენტები, როდესაც დაცული XOR არ არსებობს
- ხელმოწერილი ჩავარდნა გამოჩნდება, როდესაც ცოცხალი სიგნალი არ არის ხელმისაწვდომი.

სრული რეფერენციული ტესტის კომპლექტისათვის იხილეთ დემოს აპლიკაციის Kaigi ნახვა და პრეტენზიული ხიდის ტესტები:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
```

UI სიგარეტის ტესტი ადასტურებს, რომ `/kaigi` მარშრუტი გამოსცემს. რეალურ მედია-ტესტს ჯერ კიდევ სჭირდება ორი დაფინანსებული საფულე და ორი ფანჯარა ან მოწყობილობა, რადგან ტრანზაქციის ხელმოწერის, კამერის, მიკროფონის და WebRTC ნებართვების შეღავათი იცვლება შესრულების დროით.

თუ თქვენ ტესტირებთ TAIRA-ის წინააღმდეგ და ზარის სპეციფიკური მარშრუტი ბრუნდება `404`, პირველ რიგში დაადასტურეთ, რომ მასპინძელი საფულე წარმატებით წარედგინა `CreateKaigi`. რელეი ჯანმრთელობის საბოლოო წერტილები შეიძლება ხელმისაწვდომი იყოს ნებისმიერი კონკრეტული ზარის არსებობამდე.

## შემდეგი ნაბიჯები {#next-steps}

- დაამატეთ გამოყენების ჩანაწერი `RecordKaigiUsage` მაშინ, როდესაც თქვენს აპლიკაციას აქვს საიმედო სესიის ხანგრძლივობის გათვლა.
- რეგისტრაცია და კონტროლი რელიეების `/v1/kaigi/relays` საშუალებით, როდესაც გამოიყენება რელიე მანიფესტები.
- ზედაპირის `KaigiRosterSummary`, `KaigiUsageSummary` და `KaigiRelayHealthUpdated` მოვლენები თქვენი ოპერატორის დაშბორდის.
