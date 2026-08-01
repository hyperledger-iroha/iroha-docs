---
translation_locale: fr
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: e55c7aebc89c39edb8e7077db2414a6d432aafb05aff8df04c248fce444d7dea
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Embedded Kaigi dans une application JavaScript {#embed-kaigi-in-a-javascript-app}

Kaigi permet à une application de créer des réunions audio/vidéo individuelles protégées par un portefeuille dont le cycle de vie est enregistré via Iroha. Le navigateur traite toujours les médias avec WebRTC, tandis que Torii et les instructions Kaigi fournissent l'enregistrement durable des réunions, les métadonnées de signalisation cryptées, soutien à la liste privée et événements d'utilisation.

Ce tutoriel montre le modèle d'intégration minimal utilisé par l'application [Iroha Demo JavaScript](https://github.com/soramitsu/iroha-demo-javascript):

- le traducteur crée des offres et des réponses WebRTC
- une demande signale un pont et soumet des transactions Kaigi
- Les liens d'invitation compacts ne contiennent que l'appel ID et invitent en secret.
- l'hôte surveille Torii les réponses des participants cryptées

Les exemples utilisent TypeScript et sont écrits pour qu'ils puissent être exécutés dans Electron, un navigateur avec un backend sécurisé, ou une application Web avec une extension de portefeuille.

## Conditions préalables {#prerequisites}

Vous avez besoin de:

- un point final Torii à capacité de Kaigi
- un compte pour l'hôte et un compte pour le client
- accès à la clé de signature de chaque compte par l'intermédiaire d'un portable ou d'un portefeuille sécurisé
- Autorisations de caméra/microphone du navigateur
- Node.js 20+ si vous utilisez directement la liaison démo ou native `@iroha/iroha-js` JavaScript

Pour une référence de travail complète, cloner la démo à côté d'une source Iroha:

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

Utilisez la démonstration avec [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js) du référentiel source frère Iroha. Sa dépendance à `file:` résolve directement ce processus de paiement. Si la liaison native change, reconstruisez-la sous `iroha/javascript/iroha_js`; un répertoire de paquets propre ne contient pas l'espace de travail Cargo nécessaire par `npm run build:native`.

Avant d'exécuter une réunion en direct sur TAIRA, vérifiez la surface publique de Torii dont dépend la démo:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/v1/kaigi/relays"
curl -fsS "$TAIRA/v1/kaigi/relays/health"
```

Ces commandes vérifient que TAIRA est en direct et que la télémétrie de relais Kaigi est disponible. Elles ne soumettent pas de transactions Kaigi. Un test réel `CreateKaigi` ou `JoinKaigi` nécessite le financement des comptes TAIRA et la signature à travers le pont de la démonstration ou un autre pont backed par portefeuille.

## L'architecture {#architecture}

Gardez l'intégration de Kaigi divisée en trois couches:

|Couche |La responsabilité |
| --- | --- |
|UI |sélection de compte, formulaire de réunion, affichage du lien d'invitation, contrôle des médias |
|WebRTC |`RTCPeerConnection`, médias locaux, descriptions d'offres et de réponses |
|Iroha pont|la signature, `CreateKaigi`, `JoinKaigi`, `EndKaigi`, sondage par signal |

Le pont de l'application peut être un prélèvement électronique API, une extension de portefeuille, ou un point d'extrémité de fond. UI:

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

Dans l'application démo, ces méthodes de pont sont mises en œuvre avec `@iroha/iroha-js`, une signature locale, des métadonnées cryptées Kaigi et des appels Torii.

## Invitez des assistants {#invite-helpers}

Utilisation Torii- appel compatible IDs dans le `domain.dataspace:meeting` La démonstration utilise `kaigi.universal:<call-name>` pour les réunions générées.

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

L'hôte crée une offre, la stocke à travers `CreateKaigi`, et garde la fenêtre ouverte pour qu'il puisse appliquer la réponse de l'invité. L'invite récupère l'offre cryptée, crée une réponse, et les messages qui répondent avec `JoinKaigi`.

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

Attachez les flux à votre UI avec des éléments vidéo ordinaires:

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

1. une caméra ouverte et un micro
2. créer une paire de clés de signal Kaigi
3. créer une offre WebRTC
4. déposer `CreateKaigi`
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

Affichez `inviteLink` dans votre UI. L'utilisateur peut le copier, l'ouvrir dans un autre portefeuille ou le convertir en une route d'application telle que:

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
2. obtenir l'offre d'appel crypté auprès de Torii
3. créer une réponse WebRTC
4. soumettre `JoinKaigi` avec des métadonnées de réponse cryptées;

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

Si la réunion est transparente, vous pouvez inclure une chaîne d'affichage de portefeuille dans la demande de rejoindre. Pour les réunions privées, conservez `walletIdentity` désactivé sauf si l'utilisateur choisit explicitement de le révéler.

## L'hôte: Applique la réponse de l'invité {#host-apply-the-guest-answer}

Après avoir créé une réunion en direct, l'hôte devrait regarder les événements Kaigi et enquêter sur les signaux de réponse cryptés. Appliquez la première réponse valide à la connexion partagée de l'hôtesse.

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

Conservez l'abonnement retourné ID afin que votre UI puisse arrêter le spectateur lorsque l'hôte ferme ou s'éloigne.

## Fin de la réunion {#end-the-meeting}

Terminer l' appel depuis le même compte hôte qui l' a créé:

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

Les opérations privées Kaigi de création, d'adhésion et de fin peuvent nécessiter un XOR protégé pour les frais de point d'entrée privé. Votre application doit détecter cette erreur et offrir une action auto-protégée avant de réessayer.

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

Dans la démonstration, le UI demande à l'utilisateur de s'auto-détecter puis tente à nouveau l'action créée ou rejointe d'origine.

## Retour en arrière manuel {#manual-fallback}

La signalisation automatique dépend d'un portefeuille en direct, des routes Kaigi-capables Torii et de la génération de preuves en mode privé. Garder une rétroaction manuelle pour les environnements de développement et restreints:

- si `CreateKaigi` échoue, affichez une invitation manuelle contenant l'offre
- si `JoinKaigi` échoue, afficher un paquet de réponse brut
- laissez l'hôte coller le paquet de réponse et appelez `setRemoteDescription`

La rétroaction manuelle est utile pour le débogage WebRTC, mais elle ne fournit pas les mêmes garanties de signalisation privée sur la chaîne que le flux en direct Kaigi.

## Liste de contrôle des tests {#test-checklist}

Pour les essais d'unité, prenez le pont et affirmez que votre UI dépasse les charges utiles attendues Kaigi:

- l'hôte crée des médias locaux et soumet `createKaigiMeeting`
- l'hôte affiche une invitation `iroha://kaigi/join?call=...&secret=...`
- L'invité analyse l'invitation, appelle `getKaigiCall` et soumet `joinKaigiMeeting`
- d'accueillir des sondages ou des montres pour les signaux de réponse et appliquer la réponse;
- les indications de mode privé pour l'auto-blindage lorsque le XOR est manqué
- la rétroaction manuelle apparaît lorsque le signal en direct n'est pas disponible

Pour une suite complète de tests de référence, voir l'affichage Kaigi de l'application démo et les essais de pont de préchargement:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
```

Le test de fumée UI vérifie que la route `/kaigi` rend. Un vrai test multimédia nécessite toujours deux portefeuilles financés plus deux fenêtres ou appareils car les autorisations de signature de transaction, caméra, microphone et WebRTC varient en fonction du temps d'exécution.

Si vous testez contre TAIRA et qu'une route spécifique à l'appel renvoie `404`, confirmer d'abord que le portefeuille hôte a été soumis avec succès `CreateKaigi`. Les points finaux de santé des relais peuvent être disponibles avant qu'un appel particulier n'existe.

## Les prochaines étapes {#next-steps}

- Ajoutez l'enregistrement de l'utilisation avec `RecordKaigiUsage` lorsque votre application dispose d'une comptabilité fiable de la durée des sessions.
- Enregistrer et surveiller les relais par `/v1/kaigi/relays` lors de l'utilisation des manifestes de relais.
- Les événements de surface `KaigiRosterSummary`, `KaigiUsageSummary` et `KaigiRelayHealthUpdated` dans le tableau de bord de votre opérateur.
