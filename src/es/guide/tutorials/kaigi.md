---
translation_locale: es
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: 24dc7e6a41ea8a06d24663aebaeca2469c522e391a5de61f039c47a1cd020c91
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Embedado Kaigi en una aplicación JavaScript {#embed-kaigi-in-a-javascript-app}

Kaigi permite a una aplicación crear reuniones de audio/vídeo uno-a-uno respaldadas por cartera cuyo ciclo de vida se registra a través de Iroha. El navegador todavía maneja los medios con WebRTC, mientras que Torii y las instrucciones Kaigi proporcionan el registro duradero de la reunión, metadatos de señalización cifrados, apoyo a la lista privada y eventos de uso.

Este tutorial muestra el patrón de integración mínimo usado por la aplicación [Iroha Demo JavaScript](https://github.com/soramitsu/iroha-demo-javascript):

- El prestador de servicios crea ofertas y respuestas WebRTC
- una solicitud de puente y presenta Kaigi transacciones
- Los enlaces de invitación compactos contienen únicamente la llamada ID y la invitación secreta
- el anfitrión observa Torii las respuestas de los participantes cifradas

Los ejemplos utilizan TypeScript y están escritos para que puedan ejecutarse en Electron, un navegador con un backend seguro o una aplicación web con una extensión de cartera.

## Los requisitos previos {#prerequisites}

Necesitas:

- un punto final Torii con capacidad para Kaigi
- Una cuenta para el anfitrión y una cuenta para el huésped
- acceso a la clave de firma de cada cuenta a través de un puente o cartera de aplicaciones seguros
- permisos de cámara/micrófono del navegador
- Node.js 20+ si está utilizando directamente el enlace demo o nativo `@iroha/iroha-js` de JavaScript

Para obtener una referencia de trabajo completa, clone la demostración junto a un Iroha checkout de fuente:

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

Utilice la demostración con [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js) desde el repositorio de origen hermano Iroha. Su dependencia `file:` resuelve ese checkout directamente. Si el enlace nativo cambia, reconstruirlo bajo `iroha/javascript/iroha_js`; un directorio de paquetes limpios no contiene el espacio de trabajo Cargo necesario para `npm run build:native`.

Antes de ejecutar una reunión en vivo en TAIRA, compruebe la superficie pública Torii de la que depende la demostración:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/v1/kaigi/relays"
curl -fsS "$TAIRA/v1/kaigi/relays/health"
```

Estos comandos comprueban que TAIRA está en vivo y que la telemetría de retransmisión Kaigi está disponible. No envían transacciones Kaigi. Una prueba real `CreateKaigi` o `JoinKaigi` necesita cuentas financiadas TAIRA y firmar a través del puente de la demostración u otro puente respaldado por cartera.

## Arquitectura {#architecture}

Mantenga la integración Kaigi dividida en tres capas:

|La capa |Responsabilidad |
| --- | --- |
|UI |Selección de cuenta, formulario de reunión, visualización del enlace de invitación, controles de medios |
|WebRTC |`RTCPeerConnection`, medios locales, descripciones de las ofertas y respuestas |
|Puente Iroha |firmar, `CreateKaigi`, `JoinKaigi`, `EndKaigi`, encuestas de señales |

El puente de la aplicación puede ser un preload Electron API, una extensión de billetera o un punto final de backend. Debe exponer una pequeña superficie al UI:

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

En la aplicación de demostración, estos métodos de puente se implementan con `@iroha/iroha-js`, firma local, metadatos cifrados Kaigi y llamadas Torii.

## Invita a los ayudantes {#invite-helpers}

Utilización Torii- llamada compatible IDs en el `domain.dataspace:meeting` La demostración utiliza el formulario `kaigi.universal:<call-name>` para las reuniones generadas.

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

## WebRTC Ayudantes {#webrtc-helpers}

El anfitrión crea una oferta, la almacena a través `CreateKaigi`, y mantiene la ventana abierta para que pueda aplicar la respuesta del invitado. El invitado recoge la oferta encriptada, crea una respuesta, y las publicaciones que responden con `JoinKaigi`.

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

adjunta las transmisiones a tu UI con elementos de vídeo ordinarios:

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

## Anfitrión: Crea un enlace a la reunión {#host-create-a-meeting-link}

El flujo del anfitrión:

1. cámara abierta y micrófono
2. crear un par de teclas de señal Kaigi
3. crear una oferta WebRTC
4. presentar `CreateKaigi`
5. compartir un enlace de invitación compacto

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

Muestre `inviteLink` en su UI. El usuario puede copiarlo, abrirlo en otra billetera o convertirlo en una ruta de la aplicación como:

```ts
export function inviteRoute(inviteLink: string): string {
  const invite = parseInviteLink(inviteLink);
  return `/kaigi?call=${encodeURIComponent(invite.callId)}&secret=${encodeURIComponent(
    invite.inviteSecretBase64Url,
  )}`;
}
```

## Invitado: Únete a una reunión {#guest-join-a-meeting}

El flujo de invitados:

1. analizar la invitación
2. Recoger la oferta de llamada cifrada en Torii
3. crear una respuesta WebRTC
4. presentar `JoinKaigi` con metadatos encriptados de la respuesta

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

Si la reunión es transparente, puede incluir una cadena de visualización de billetera en la solicitud para unirse. Para las reuniones privadas, mantenga `walletIdentity` sin establecer a menos que el usuario elija explícitamente revelarlo.

## Anfitrión: Aplique la respuesta del invitado {#host-apply-the-guest-answer}

Después de crear una reunión en vivo, el anfitrión debe ver los eventos Kaigi y sondear las señales de respuesta cifradas. Aplicar la primera respuesta válida a la conexión entre pares del anfitriones.

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

Guarde la suscripción devuelta ID para que su UI pueda detener al observador cuando el anfitrión cuelgue o se aleje.

## Concluye la reunión {#end-the-meeting}

Terminar la llamada desde la misma cuenta de host que lo creó:

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

## Financiamiento en el modo privado {#private-mode-funding}

Las operaciones de creación, incorporación y finalización privadas Kaigi pueden requerir que se proteja XOR por la tarifa del punto de entrada privado. Su aplicación debe detectar ese error y ofrecer una acción de auto-protección antes de volver a intentar.

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

En la demostración, el UI le pide al usuario que se autoproteja y luego vuelve a intentar la acción original de crear o unirse.

## Regreso manual {#manual-fallback}

La señalización automática depende de una cartera en vivo, rutas Kaigi-capaces Torii y generación de pruebas en modo privado. Mantenga un retroceso manual para el desarrollo y entornos restringidos:

- en caso de que `CreateKaigi` no cumpla, muestra una invitación manual que contenga la oferta
- si `JoinKaigi` falla, muestra un paquete de respuestas en bruto
- dejar que el anfitrión pegue el paquete de respuesta y llame a `setRemoteDescription`

El retroceso manual es útil para la depuración WebRTC, pero no proporciona las mismas garantías de señalización privada en cadena que el flujo en directo Kaigi.

## Lista de comprobación {#test-checklist}

Para los ensayos unitarios, simula el puente y asegure que su UI pasa las cargas útiles esperadas de Kaigi:

- el anfitrión crea medios locales y envía `createKaigiMeeting`
- El anfitrión muestra una invitación `iroha://kaigi/join?call=...&secret=...`
- el invitado analiza la invitación, llama a `getKaigiCall` y presenta `joinKaigiMeeting`
- las encuestas de acogida o los relojes para señales de respuesta y aplica la respuesta
- Indicadores de modo privado para autoprotección cuando falta el XOR protegido.
- El retroceso manual aparece cuando la señal en vivo no está disponible.

Para un conjunto completo de pruebas de referencia, consulte la vista Kaigi y los ensayos del puente de precarga de la aplicación demo:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
```

La prueba de humo UI verifica que la ruta `/kaigi` renderiza. Una prueba de medios reales aún necesita dos carteras financiadas más dos ventanas o dispositivos porque los permisos de firma de transacciones, cámara, micrófono y WebRTC varían según el tiempo de ejecución.

Si está realizando pruebas con TAIRA y una ruta específica de la llamada devuelve `404`, confirmar primero que la cartera de acogida se ha presentado con éxito `CreateKaigi`. Los puntos finales de salud del relevo pueden estar disponibles antes de que exista una llamada en particular.

## Los próximos pasos {#next-steps}

- Añadir la grabación de uso con `RecordKaigiUsage` cuando su aplicación tiene contabilidad fiable de duración de sesión.
- Registro y monitoreo de relés a través de `/v1/kaigi/relays` cuando se utilicen manifiestos de relé.
- Eventos de superficie `KaigiRosterSummary`, `KaigiUsageSummary`, y `KaigiRelayHealthUpdated` en el panel del operador.
