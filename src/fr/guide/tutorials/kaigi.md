---
translation_locale: fr
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: e55c7aebc89c39edb8e7077db2414a6d432aafb05aff8df04c248fce444d7dea
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Embedded Kaigi dans une JavaScript Application {#embed-kaigi-in-a-javascript-app}

Kaigi permet à une application de créer des réunions audio/vidéo individuelles protégées par un portefeuille
dont le cycle de vie est enregistré Iroha. Le navigateur traite toujours les médias avec
WebRTC, alors que Torii et le Kaigi les instructions fournissent la réunion durable
enregistrement, métadonnées de signalisation cryptées, support de liste privée et événements d'utilisation.

Ce tutoriel montre le modèle d'intégration minimal utilisé par les
[Iroha Démo JavaScript](https://github.com/soramitsu/iroha-demo-javascript)
app:

- le rendant crée WebRTC offres et réponses
- une demande de pont signale et soumet Kaigi opérations
- les liens d'invitation compacts ne portent que l'appel ID et inviter secrètement
- les horloges de l'hôte Torii pour les réponses des participants cryptées

Les exemples utilisent TypeScript et sont écrits de sorte qu'ils peuvent fonctionner en Electron, un
navigateur avec un backend sécurisé, ou une application Web avec une extension de portefeuille.
les clés privées en dehors du code de rendu non fiable en production.

## Préalabilités {#prerequisites}

Vous avez besoin de:

- à la Kaigi- capable Torii point final
- compte de l'hôte et de l'invité
- accès à la clé de signature de chaque compte par l'intermédiaire d'un pont ou d'un portefeuille sécurisé
- les autorisations de caméra/microphone du navigateur
- Node.js 20+ si vous utilisez le JavaScript démo ou natif
  `@iroha/iroha-js` liant directement

Pour une référence de travail complète, clonez la démo à côté d'un Iroha source
le dépôt:

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

Utilisez la démo avec
[`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js)
de la sœur Iroha le référentiel source. `file:` la dépendance résolve que
Si la liaison native change, reconstruisez
`iroha/javascript/iroha_js`; un répertoire de paquets propres ne contient pas les
Espaces de travail pour les marchandises nécessaires `npm run build:native`.

Avant de tenir une réunion en direct sur TAIRA, vérifier le public Torii la surface que le
la démo dépend de:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/v1/kaigi/relays"
curl -fsS "$TAIRA/v1/kaigi/relays/health"
```

Ces commandes confirment que TAIRA est en vie et que Kaigi la télémétrie du relais est
Il n'y a pas de Kaigi Les transactions sont effectuées en `CreateKaigi` ou
`JoinKaigi` besoins de test financés TAIRA les comptes et la signature à travers le démo
un pont ou un autre pont à portefeuille.

## Architecture {#architecture}

Gardez le Kaigi l'intégration divisée en trois couches:

| Couche | Responsabilité |
| --- | --- |
| UI | sélection de compte, formulaire de réunion, affichage du lien d'invitation, contrôle des médias |
| WebRTC | `RTCPeerConnection`, médias locaux, descriptions des offres et réponses |
| Iroha pont | signature, `CreateKaigi`, `JoinKaigi`, `EndKaigi`, élections de signaux |

Le pont de l'application peut être un prélèvement électronique API, une extension de portefeuille ou un backend
Il devrait exposer une petite surface à la UI:

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

Dans l'application démo, ces méthodes de bridge sont mises en œuvre avec
`@iroha/iroha-js`, signature locale, chiffrée Kaigi les métadonnées, et Torii Des appels.

## Invitez des assistants {#invite-helpers}

Utilisation Torii- appel compatible IDs dans le `domain.dataspace:meeting` Le démo.
utilisation `kaigi.universal:<call-name>` pour les réunions générées.

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

## WebRTC Les aides {#webrtc-helpers}

L'hôte crée une offre, la stocke `CreateKaigi`, et conserve le
la fenêtre est ouverte pour qu'il puisse appliquer la réponse de l'invité.
proposer, crée une réponse et publie des messages qui répondent avec `JoinKaigi`.

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

Attachez les courants à votre UI avec des éléments vidéo ordinaires:

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

## L'hôte: Créer un lien vers la réunion {#host-create-a-meeting-link}

Le flux hôte:

1. caméra ouverte et microphone
2. créer un Kaigi paire de clés de signal
3. créer un WebRTC offre
4. soumettre `CreateKaigi`
5. partager un lien d'invitation compact

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

Le spectacle `inviteLink` dans votre UI. L'utilisateur peut le copier, l'ouvrir dans un autre portefeuille,
ou le convertir en une route d'application telle que:

```ts
export function inviteRoute(inviteLink: string): string {
  const invite = parseInviteLink(inviteLink);
  return `/kaigi?call=${encodeURIComponent(invite.callId)}&secret=${encodeURIComponent(
    invite.inviteSecretBase64Url,
  )}`;
}
```

## Invité: Assistez à une réunion {#guest-join-a-meeting}

Le flux des invités:

1. analyser l'invitation
2. récupérer l'offre d'appel crypté de Torii
3. créer un WebRTC réponse
4. soumettre `JoinKaigi` avec des métadonnées de réponse cryptées

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

Si la réunion est transparente, vous pouvez inclure une chaîne d'affichage de portefeuille dans le
Pour les réunions privées, conservez `walletIdentity` non réglé à moins que l'utilisateur
Il choisit explicitement de le révéler.

## L'hôte: Appliquez la réponse de l'invité {#host-apply-the-guest-answer}

Après avoir créé une réunion en direct, l'hôte devrait regarder Kaigi événements et sondages pour
les signaux de réponse cryptés. Appliquez la première réponse valide à l'équivalent de l'hôte
connexion.

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

Conserver l' abonnement retourné ID donc votre UI l'observateur peut arrêter lorsque le
l'hôte suspend ou s'en va.

## Fin de la réunion {#end-the-meeting}

Cesser l' appel depuis le même compte hôte qui l' a créé:

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

## Financement en mode privé {#private-mode-funding}

Propriété Kaigi les opérations de création, de fusion et de fin peuvent nécessiter des systèmes protégés XOR pour le
Votre application devrait détecter cette erreur et offrir une
l'action d'auto-défense avant de réessayer.

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

Dans la démonstration, le UI demande à l' utilisateur de se protéger, puis réessaye le
créer ou rejoindre l'action originale.

## Retour manuel {#manual-fallback}

La signalisation automatique dépend d'un portefeuille en direct. Kaigi- capable Torii les itinéraires et
la génération de preuves en mode privé.
environnements restreints:

- si `CreateKaigi` si elle échoue, afficher une invitation manuelle contenant l'offre
- si `JoinKaigi` échec, afficher un paquet de réponse brut
- laissez l'hôte coller le paquet de réponse et appeler `setRemoteDescription`

Les retours manuels sont utiles pour le débogage WebRTC, Mais elle ne prévoit pas les
les mêmes garanties de signalisation privée en chaîne que le live Kaigi le flux.

## Liste des tests {#test-checklist}

Pour les tests unitaires, prenez le pont et affirmez que votre UI dépasse les attentes
Kaigi les charges utiles:

- l'hôte crée des médias locaux et soumet `createKaigiMeeting`
- l'hôte affiche un `iroha://kaigi/join?call=...&secret=...` inviter
- l'invité analyse l'invite, appelle `getKaigiCall`, et soumet
  `joinKaigiMeeting`
- les enquêtes d'accueil ou les montres pour les signaux de réponse et applique la réponse
- les instructions de mode privé pour l'auto-écransage lorsqu'elles sont protégées XOR est manquant
- l'arrêt manuel apparaît lorsque la signalisation en direct n'est pas disponible

Pour une suite complète de tests de référence, voir l'application démo Kaigi vue et prélèvement
les essais de pont:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
```

Les UI l'essai de fumée vérifie que le `/kaigi` Un vrai test de médias.
il a encore besoin de deux portefeuilles financés plus deux fenêtres ou appareils parce que la transaction
signalisation, caméra, microphone et WebRTC les autorisations varient en fonction du temps d'exécution.

Si vous testez contre TAIRA et des retours d'itinéraire spécifiques à l'appel `404`, tout d'abord
confirmer que le portefeuille hôte a été soumis avec succès `CreateKaigi`. Santé du relais
les points d'expiration peuvent être disponibles avant qu'un appel particulier n'existe.

## Les prochaines étapes {#next-steps}

- Ajouter l' enregistrement d' utilisation avec `RecordKaigiUsage` lorsque votre application est fiable
  la comptabilité de la durée des séances.
- Les relais d'enregistrement et de surveillance à travers `/v1/kaigi/relays` lors de l'utilisation du relais
  Les manifestes.
- Surfaces `KaigiRosterSummary`, `KaigiUsageSummary`, et
  `KaigiRelayHealthUpdated` événements dans votre tableau de bord d'opérateur.
