---
translation_locale: dz
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: 24dc7e6a41ea8a06d24663aebaeca2469c522e391a5de61f039c47a1cd020c91
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kaigi ལུ་ JavaScript App ནང་བཙུགས་འབདཝ་ཨིན། {#embed-kaigi-in-a-javascript-app}

Kaigi གིས་ལག་ལེན་ཅིག་ལུ་ Wallet-རྒྱབ་སྐྱོར་འབད་མི་ One-to-One སྒྲ་དང་གློག་བརྙན་ཞལ་འཛོམས་ཚུ་ བཟོ་ཚུགས་ནི་ཨིནམ་ད་ སྲོལ་འཁོར་འདི་ Iroha གྱི་ཐོག་ལས་ ཐོ་བཀོད་འབད་ཡོདཔ་ཨིན། བརྒྱུད་བཤལཔ་འདི་གིས་ WebRTC གི་ཐོག་ལས་ བརྡ་བརྒྱུད་དེ་ ལག་ལེན་འཐབ་དོ་ཡོདཔ་ད་ Torii དང་ Kaigi གི་བཀོད་རྒྱ་ཚུ་གིས་ ཞལ་འཛོམས་ཀྱི་ཐོ་ཡིག་བརྟན་ཏོག་ཏོ་དང་། ཟིན་བྲིས་ཅན་གྱི་བརྡ་དོན་གི་ metadata འདི་ཡང་མཁོ་སྒྲུབ་འབདཝ་ཨིན། སྒེར་གྱི་ཐོ་ཡིག་གི་ རྒྱབ་སྐྱོར་དང་ ལག་ལེན་གྱི་དོན་རྐྱེན་ཚུ་

འ་ནི་ལྷབ་སྦྱང་འདི་ [Iroha Demo JavaScript](https://github.com/soramitsu/iroha-demo-javascript) ཌེམོ་གིས་ལག་ལེན་འཐབ་མི་མཉམ་འབྲེལ་གྱི་ལུགས་ཉུང་སུ་ཅིག་སྟོན་ནུག

- བཀྲམ་སྟོན་མི་གིས་ WebRTC གྲོས་འདེབས་དང་ལན་ཚུ་བཟོ་དོ་ཡོདཔ་ཨིན།
- ཐོ་བཀོད་ཡིག་ཚང་གི་རྟགས་མཚན་དང་ ཡིག་ཐོག་ལུ་ Kaigi གྱི་ཚོང་འབྲེལ་ཚུ་ ཕུལ་དགོ།
- མཉམ་ཆུང་གི་མགྲོན་བརྡ་ཚུ་ནང་ ID འབུ་གཏད་རྐྱངམ་ཅིག་ཡོདཔ་མ་ཚད་ གསང་བའི་མགྲོན་འབོད་ཡང་ཡོདཔ་ཨིན།
- འཛུལ་ཞུགས་འབད་མི་གི་རྒྱབ་སྐྱོར་ལུ་ བལྟ་རྟོག་འབད་མི་དེ་ Torii

དཔེ་འདི་ TypeScript ལག་ལེན་འཐབ་སྟེ་བྲིས་ཡོདཔ་ད་ དེ་ཚུ་ Electron, ཉེན་སྲུང་ཅན་གྱི་རྒྱབ་ཐུག་ལུ་ཡོད་མི་ བལྟ་བཤལཔ་ ཡང་ན་ དངུལ་ཁུག་གི་རྒྱ་ཁྱོན་ཡོད་པའི་ web app ནང་ལུ་ལག་ལེན་འབད་ཚུགསཔ་ཨིན། སྒེར་གྱི་ལྡེ་མིག་ཚུ་ བཟོ་སྐྲུན་འབད་བའི་སྐབས་ དམ་ཚིག་མ་བསྐྱེད་མི་ renderer code ཀྱི་ཕྱི་ཁར་བཞག་དགོ།

## དགོས་མཁོ་ཚུ་ {#prerequisites}

ཁྱོད་ཀྱིས་:

- Kaigi ཚད་ལྡན་མཇུག་ཐིག་ Torii
- སྦྱིན་བདག་དང་མགྱོནམ་ཚུ་གི་རྩིས་ཁྲ་
- ཐོ་བཀོད་འབད་ནིའི་ཁ་བྱང་གི་ལྡེ་མིག་ཚུ་ ཉེན་སྲུང་ཅན་གྱི་ ཨེཔ་བི་ལིཌི་ ཡང་ན་ བརྒྱུད་འཕྲིན་ཨེབ་གཏང་ཐོག་ལས་
- བརྟག་དཔྱད་འཕྲུལ་ཆས་དང་ གློག་ཀླད་ལག་ལེན་གྱི་ཆོག་ཐམ་
- Node.js 20+ ཁྱོད་ཀྱིས་ཐད་ཀར་དུ་ JavaScript ཌེ་མོ་ ཡང་ན་ རང་ལུགས་ཀྱི་ `@iroha/iroha-js` འབྲེལ་མཐུད་ལག་ལེན་འཐབ་པ་ཅིན་

སྒྲིག་འཇུག་དོན་ཡོངས་བསྡོམས་གི་དོན་ལུ་ Iroha source checkout གྱི་སྦོ་ལོགས་ཁར་ demo འདི་ clone ചെയ്യുക:

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

ཌེ་མོ་འདི་ལག་ལེན་འཐབ་ནི་ [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js) སྤུན་ཆ་ཚུ་གི་ནང་ལས་ Iroha གཞི་རྟེན་རྩིས་ཁང་། འདི་ `file:` འབྲེལ་བ་འཐབ་ནི་དེ་ checkout འདི་ཐད་ཀར་དུ་སེལ་འཐུ་འབདཝ་ཨིན། གལ་སྲིད་ native binding བསྒྱུར་བཅོས་འབད་བ་ཅིན་ `iroha/javascript/iroha_js`; དྭངས་འཕྲོས་འཕྲོས་ཅན་གྱི་ ཡིག་སྣོད་ནང་ ལཱ་འབད་སའི་ས་ཁོངས་ཚུ་མེདཔ་ཨིན། `npm run build:native`.

TAIRA གི་ཐོག་ལུ་ ཐད་ཀར་དུ་ཚོགས་འདུ་འགོ་འདྲེན་འཐབ་པའི་ཧེ་མར་ ཌེམ་ཨོ་གི་ཁ་ཐུག་ལས་ མི་མང་གི་ཁ་ཐུག་གི་ཁ་ཐུག་ལུ་ Torii བརྟག་དཔྱད་འབད་:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/v1/kaigi/relays"
curl -fsS "$TAIRA/v1/kaigi/relays/health"
```

འ་ནི་བཀའ་རྒྱ་འདི་ TAIRA འདི་ངོ་མ་ཨིནམ་དང་ Kaigi བརྒྱུད་འཕྲིན་ལག་ལེན་འཐབ་ཚུགསཔ་སྦེ་བརྟག་དཔྱད་འབདཝ་ཨིན། ཁོང་གིས་ Kaigi གྱི་ཚོང་འབྲེལ་ཚུ་མ་གཏངམ་ཨིན། ངོ་མ་ `CreateKaigi` ཡང་ན་ `JoinKaigi` ཀྱི་བརྟག་དཔྱད་དེ་ TAIRA རྩིས་ཁྲ་ཚུ་གི་དོན་ལུ་ མ་དངུལ་སྤྲོད་དགོཔ་མ་ཚད་ དཔྱད་རིག་གི་གཞུང་ལམ་ཡང་ན་ དངུལ་རྐྱང་རྒྱབ་སྐྱོར་ཡོད་པའི་གཞུང་ལམ་གཞན་ཅིག་ལས་ ཐོ་བཀོད་འབད་དགོཔ་ཨིན་མས།

## བཟོ་རིག་ {#architecture}

Kaigi སྦྱོར་བ་འདི་ དབྱེ་ཁག་གསུམ་ལུ་བགོ་བཤའ་བརྐྱབ་དགོ།

|གྲལ་ཐིག་ |འགན་འཁྲི་ |
| --- | --- |
|UI |རྩིས་ཁྲ་གདམ་ཁ་, ཞལ་འཛོམས་བཟོ་ཐིག་, འབད། བསྡུ་ཡིག་གི་འགྲེམས་སྟོན་, བརྡ་བརྒྱུད་འཛིན་སྐྱོང་ཚུ་ |
|WebRTC |`RTCPeerConnection`, ས་གནས་ཀྱི་ བརྡ་བརྒྱུད་, གྲོས་འདེབས་དང་ལན་གྱི་འགྲེལ་བཤད་ |
|Iroha ལྕགས་རི་ |མཚམས་འཇོག་འབད་ཐངས་, `CreateKaigi`, `JoinKaigi`, `EndKaigi`, རྟགས་མཚན་བརྡ་བསྡུས། |

ཨེཔ་པི་ལིཀ་འདི་ Electron preload API, wallet extension, ཡང་ན་ backend endpoint འབད་ནི་ཨིན། འདི་གིས་ surface ཆུང་ཀུ་ཅིག་ལུ་ UI ལུ་བཏོན་དགོཔ་ཨིན།

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

ཌེ་མོ་ཨེཔ་ནང་ལུ་ འ་ནི་ Bridge ཐབས་ལམ་ཚུ་ `@iroha/iroha-js`, ས་གནས་ཁ་ཐོ་བཀོད་, ཀི་རིཌ་འབད་མི་ Kaigi metadata, དང་ Torii བརྒྱུད་འཕྲིན་ཚུ་དང་གཅིག་ཁར་ལག་ལེན་འཐབ་ཡོདཔ་ཨིན།

## གྲོགས་རམ་འབད་མི་ལུ་འབོ་འབད། {#invite-helpers}

Torii-དང་མཐུན་པའི་ཅ་ལ་ IDs འདི་ `domain.dataspace:meeting` གི་བཟོ་རྣམ་ནང་ལག་ལེན་འཐབ་ཨིན། གྲོས་བསྡུར་འབད་ནིའི་དོན་ལས་ ཌེ་མོ་གིས་ `kaigi.universal:<call-name>` ལག་ལེན་འཐབ་ཨིན།

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

## WebRTC གྲོགས་རམ་འབད་མི་ {#webrtc-helpers}

host གིས་ གྲོས་འདེབས་ཅིག་བཟོ་ཞིནམ་ལས་ `CreateKaigi` ནང་ལུ་བཙུགསཔ་ཨིན། དེ་ལས་ སྒོ་སྒྲིག་འདི་སྒོ་ཕྱེཝ་སྦེ་བཞག་ཡོདཔ་ད་ འདི་གིས་མགྲོན་པོ་གི་ལན་འདི་ལག་ལེན་འབད་ཚུགས། མགྲོན་པོ་འདི་གིས་ ཨེབ་གཏང་ཅན་གྱི་ གྲོས་འདེབས་དེ་འཚོལ་ཞིནམ་ལས་ལན་འདི་བཟོཝ་ཨིན། དེ་ལས་ལན་འདི་ `JoinKaigi` ཟེར་བཀོད་འོང་།

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

ཁྱོད་ཀྱིས་ UI ལུ་ རྒྱུན་ལམ་ཚུ་ སྤྱིར་བཏང་གློག་བརྙན་གྱི་ཆ་ཤས་ཚུ་དང་གཅིག་ཁར་ མཐུད་སྦྲེལ་འབད་:

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

## འཛོམས་འདུ་ འགོ་འདྲེན་འཐབ་མི་: འཛོམས་འདུའི་འབྲེལ་མཐུད་ཅིག་བཟོ་ {#host-create-a-meeting-link}

host flow འདི་:

1. གློག་བརྙན་ཁ་ཕྱེཝ་དང་ གློག་ཀླད་ཚུ་
2. Kaigi བརྡ་དོན་ལྡེ་མིག་རྐྱབས་ཅིག་བཟོ་ནི།
3. ཁྱོད་ཀྱིས་ WebRTC གྲོས་འདེབས་བཟོ་དགོ།
4. ཕུལ་ `CreateKaigi`
5. སྦྲགས་ཡོད་པའི་འབོ་ཐིག་ཚུ་བགོ་བཤའ་རྐྱབས།

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

ཁྱོད་ཀྱིས་ `inviteLink` འདི་ཁྱོད་ཀྱི་ UI ནང་ལུ་བཏོན་ཚུགས། ལག་ལེན་འཐབ་མི་གིས་འདི་འདྲ་བཤུས་རྐྱབ་སྟེ་ བརྒྱུད་འཕྲིན་གཞན་ནང་ཕྱེ་ཚུགས། ཡང་ན་འདི་བཟུམ་ཅིག་སྦེ་ལག་ལེན་ལམ་ཁ་ལུ་བསྒྱུར་ཚུགས།

```ts
export function inviteRoute(inviteLink: string): string {
  const invite = parseInviteLink(inviteLink);
  return `/kaigi?call=${encodeURIComponent(invite.callId)}&secret=${encodeURIComponent(
    invite.inviteSecretBase64Url,
  )}`;
}
```

## སྐུ་མགྲོན་: ཞལ་འཛོམས་ནང་ བཅའ་མར་གཏོགས་ {#guest-join-a-meeting}

མགྲོན་པོ་གི་རྒྱུན་འགྲུལ་:

1. གནང་བ་འདི་ བརྟག་ཞིབ་འབད་
2. ཁྱོད་ཀྱིས་ Torii ལས་ སྦྲགས་ཡོད་པའི་འབོ་ནི་གི་ གྲོས་འདེབས་འཚོལ་ཚུགས།
3. ཁྱོད་ཀྱིས་ WebRTC གྱི་ལན་འདི་བཟོ་དགོ།
4. `JoinKaigi` སྦྲགས་ཡོད་པའི་ལན་བརྡ་དོན་ཚུ་ནང་བཙུགས་དགོ།

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

གྲོས་འཛོམས་འདི་ གསལ་ཏོག་ཏོ་སྦེ་ཨིན་པ་ཅིན་ ཁྱོད་ཀྱིས་ བསྡུ་སྒྲིག་འབད་དགོ་པའི་ཞུ་ཡིག་ནང་ wallet display string ཚུ་བཙུགས་ཚུགས། སྒེར་གྱི་ཚོགས་སྟོན་ཚུ་གི་དོན་ལུ་ `walletIdentity` འདི་སེལ་འཐུ་མ་འབད་བ་ཅིན་ ལག་ལེན་པ་གིས་ ཁ་གསལ་སྦེ་མངོན་སུམ་བཟོ་ནི་སྦེ་ གདམ་ཁ་རྐྱབ་ཨིན།

## མགྲོན་པོ་གིས་སླབ་མིའི་ལན་འདི་ ལག་ལེན་འཐབ་ {#host-apply-the-guest-answer}

ཐད་ཀར་དུ་ཚོགས་འདུ་བཟོ་ཚར་ཞིནམ་ལས་ host གིས་ Kaigi ལས་རིམ་ཚུ་བལྟ་ནི་དང་ སྦྲགས་ཡོད་པའི་ལན་བརྡ་དོན་འཚོལ་ཞིབ་འབད་དགོཔ་ཨིན། འགོ་ཐོག་གི་བདེན་པའི་ལན་འདི་ host གི་ peer connection ལུ་བཙུགས་དགོ།

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

ལོག་འོང་མི་ subscription ID འདི་ལུ་བཞག་ ཁྱོད་ཀྱིས་ UI བལྟ་མི་དེ་ བཀག་ཚུགས་པའི་དོན་ལུ་ host གྱིས་ཐོ་བཀོད་འབད་ཞིནམ་ལས་ ཡང་ན་འགྱོ་འགྱོཝ་ད་.

## ཞལ་འཛོམས་མཇུག་བསྡུ་ནི་ {#end-the-meeting}

བརྒྱུད་འཕྲིན་འདི་བཟོ་མི་ hosts account ལས་མཇུག་བསྡུ་ནི།

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

## སྒེར་གྱི་གནས་སྟངས་ནང་ དངུལ་འབྲེལ་མཐུན་རྐྱེན་ {#private-mode-funding}

སྒེར་གྱི་ Kaigi བཟོ་སྐྲུན་འབད་ནི་དང་ མཉམ་འབྲེལ་འབད་ནི་ དེ་ལས་ མཇུག་བསྡུ་ནིའི་ བྱ་བ་ཚུ་གིས་ སྒེར་གྱི་འཛུལ་སྒོ་གི་འཐུས་གི་དོན་ལུ་ ཉེན་སྲུང་ཅན་གྱི་ XOR དགོཔ་ཨིན། ཁྱོད་ཀྱི་ལག་ལེན་འདི་གིས་ འཛོལ་བ་འདི་འཛིན་བཟུང་འབད་ཞིནམ་ལས་ ལོག་སྤྱོད་མ་འབད་བའི་ཧེ་མར་ རང་བཞིན་གྱི་ ཉེན་སྲུང་གི་བྱ་རིམ་ཅིག་ གྲོས་འདེབས་འབད་དགོ།

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

ཌེ་མོ་ནང་ལུ་ UI གིས་ ལག་ལེན་འཐབ་མི་ལུ་ རང་བཞིན་སྲུང་སྐྱོབ་འབད་ནིའི་དོན་ལུ་ བསླབ་བྱ་བྱིན་ཞིནམ་ལས་ ཨེབ་གོང་བཟོ་ནི་དང་ མཉམ་འབྲེལ་འབད་ནིའི་ དཔའ་བཅམ་ནུག

## ལག་ཁྱེར་གྱི་རྒྱབ་སྐྱོར་ {#manual-fallback}

འཕྲུལ་ཆས་བརྡ་སྟོན་འདི་ རང་བཞིན་གྱི་དངུལ་ཁུག་ངོ་མ་དང་ Kaigi-ནུས་ཤུགས་ཅན་གྱི་ Torii ལམ་ལུགས་ དེ་ལས་ སྒེར་གྱི་གནས་སྟངས་ནང་ལུ་ བརྟག་ཞིབ་བཟོ་ཐངས་ལས་བརྟེན་ཨིན། གོང་འཕེལ་དང་ བཀག་དམ་ཅན་གྱི་ གནས་སྟངས་ཚུ་གི་དོན་ལུ་ ལག་ལེན་ཐོག་ལས་ རྒྱབ་སྐྱོར་འབད་:

- གལ་སྲིད་ `CreateKaigi` འདི་མ་གྲུབ་པ་ཅིན་ གྲོས་འདེབས་དེ་ལག་ལེན་ཐོག་ལས་ སྟོན་བྱིན་དགོ།
- གལ་སྲིད་ `JoinKaigi` ཕྱིར་འབུད་འབད་མ་ཚུགསཔ་ཨིན་པ་ཅིན་ ཐབས་ལམ་གྱི་རྒྱབ་སྣོན་མ་བཏུབ་པའི་ལན་འདི་བཏོན་དགོ།
- བརྒྱུད་འཕྲིན་འདི་ host གིས་ལན་ཐོ་བཀོད་འབད་ཞིནམ་ལས་ `setRemoteDescription` ལུ་འབོ་བཅུག།

ལག་རྩལ་གྱི་རྒྱབ་སྐྱོར་དེ་ WebRTC ཌེ་བི་གཱོན་དོན་ལུ་ ཕན་ཐོགས་ཅན་ཨིན་ཏེ་འབད་རུང་ འདི་གིས་ཕྲང་ལམ་ Kaigi རྒྱུན་འགྲུལ་དང་འདྲཝ་སྦེ་ སྒེར་སྡེའི་ནང་བརྡ་སྟོན་གི་མཐུན་རྐྱེན་མ་བྱིན་པས།

## དཔྱད་ཞིབ་དཔྱད་ཡིག་ {#test-checklist}

ཡུ་ནིཊ་བརྟག་དཔྱད་ཚུ་གི་དོན་ལུ་ རྒྱང་འབུབ་འདི་ བལྟ་ཞིནམ་ལས་ ཁྱོད་ཀྱི་ UI གིས་ अपेक्षित ཁེ་ཕན་གྱི་ཁེ་རྒུད་ཚུ་ Kaigi ལས་བརྒལ་མེད་ཟེར་བཀོད་དགོ།

- host གིས་ ས་གནས་ཀྱི་ བརྡ་བརྒྱུད་ཚུ་ བཟོ་ཞིནམ་ལས་ `createKaigiMeeting` བཏང་ཨིན།
- host གིས་ `iroha://kaigi/join?call=...&secret=...` འབད།
- མགྲོན་པོ་གིས་མགྲོན་བརྡ་དེ་ བསྐྱར་ཞིབ་འབད་ཞིནམ་ལས་ `getKaigiCall` ལུ་འབོ་སྟེ་ `joinKaigiMeeting` ཕུལ་ནུག
- བསྐྱར་ཞིབ་ཚོགས་ཁང་ ཡང་ན་ ལན་གསལ་བརྡ་སྟོན་གི་དོན་ལུ་ཆུ་ཚོད་ཚུ་དང་ལན་འདི་ལག་ལེན་འཐབ་ཨིན།
- སྒེར་གྱི་གནས་སྟངས་ནང་ རང་གིས་རང་ལུ་སྲུང་སྐྱོབ་འབད་ནིའི་བརྡ་སྟོན་ཚུ་ XOR སྦ་ཟོན་མེད་པ་ཅིན་ཨིན།
- གློག་ཐག་ར་བ་བརྡ་སྟོན་ཚུ་མ་ཐོབ་པའི་སྐབས་ ལག་ལེན་གྱི་རྒྱབ་སྐྱོར་བཏོན་འོང་།

ཚད་གཞི་བརྟག་དཔྱད་སྡེ་ཚན་གྱི་ཆ་ཤས་ཚུ་གི་དོན་ལུ་ བརྟག་ཞིབ་ལག་ལེན་གྱི་ Kaigi མཐོང་སྣང་དང་ སྔོན་འགོག་རྒྱུགས་ཀྱི་བརྟག་དཔྱད་ཚུ་བལྟ་ନ୍ତୁ:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
```

UI དུ་བ་བརྟག་དཔྱད་འདི་གིས་ `/kaigi` ཕྲང་ལམ་དེ་ བཏོན་དོ་ཡོདཔ་ ངེས་བདེན་བཟོཝ་ཨིན། བདེན་པའི་བརྡ་བརྒྱུད་བརྟག་དཔྱད་ལུ་ དངུལ་རྐྱང་གི་དངུལ་ཁུག་གཉིས་དང་ སྒོ་སྒྲིག་གཉིས་ ཡང་ན་ སེལ་འཐུ་འབད་དགོཔ་ཡོད་ ག་ཅི་སྨོ་ཟེར་བ་ཅིན་ བྱ་སྟབས་མ་བདེཝ་ལག་ལེན་གྱི་རྟགས་བཀོད་, པར་ཆས་, མི་ཀོརོ་ཕཱན་ དེ་ལས་ WebRTC གི་ཆོག་ཐམ་ཚུ་ དུས་རྒྱུན་ལས་བརྒལ་མེད་ནི་དེ་གིས་ཨིན།

ཁྱོད་ཀྱིས་ TAIRA དང་ཕྱདཔ་ད་ བརྟག་དཔྱད་འབད་དོ་ཡོདཔ་དང་ བརྒྱུད་འབུད་ལུ་དམིགས་ཏེ་ ཕྲང་ལམ་ཅིག་གིས་ `404` སླར་ལོག་འབདཝ་ཨིན་པ་ཅིན་ འགོ་དང་པ་ ཁྱོད་ཀྱིས་ host wallet གིས་ གྲུབ་འབྲས་ལྡན་པའི་ཐོག་ལུ་ `CreateKaigi` བཏབ་ཡོདཔ་ ངེས་བདེན་བཟོཝ་ཨིན། བརྒྱུད་འབུའི་མཐའ་མཇུག་གི་ཐིག་ཚུ་ དམིགས་བསལ་གྱི་ བརྒྱུད་འབུདཔ་མ་འབྱུང་བའི་ཧེ་མ་ལས་ ལག་ལེན་འཐབ་ཚུགས་འོང་།

## གྲོས་བསྡུར་གྱི་རིམ་པ་ཚུ་ {#next-steps}

- ལག་ལེན་གྱི་ཐོ་ཡིག་འདི་ `RecordKaigiUsage` དང་གཅིག་ཁར་བཙུགས་ནི་དེ་ ཁྱོད་ཀྱིས་ལག་ལེན་ནང་ལུ་ ཡིད་ཆེས་ཅན་གྱི་ དུས་ཡུན་རྩིས་སྤྲོད་འབད་ཚུགས་པའི་སྐབས་ཨིན།
- `/v1/kaigi/relays`བརྒྱུད་དེ་ འབྲེལ་མཐུད་ལག་ལེན་འཐབ་པའི་སྐབས་ རེ་རེ་ཚུ་ ཐོ་བཀོད་དང་ ལྟ་རྟོག་འབདཝ་ཨིན།
- ཌེཤ་བཱའོར་ནང་ལུ་ surface `KaigiRosterSummary`, `KaigiUsageSummary`,དང་ `KaigiRelayHealthUpdated` གི་བྱུང་རྐྱེན་ཚུ་འབདཝ་ཨིན།
