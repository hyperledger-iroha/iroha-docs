---
translation_locale: pt
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: e55c7aebc89c39edb8e7077db2414a6d432aafb05aff8df04c248fce444d7dea
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Incorporado Kaigi em um aplicativo JavaScript {#embed-kaigi-in-a-javascript-app}

Kaigi permite que um aplicativo crie reuniões de áudio/vídeo individuais apoiadas por carteira cujo ciclo de vida é gravado através do Iroha. O navegador ainda lida com mídia com o WebRTC, enquanto a Torii e as instruções Kaigi fornecem o registro duradouro das reuniões, metadados criptografados de sinalização, Apoio à lista privada e eventos de utilização.

Este tutorial mostra o padrão de integração mínimo usado pelo aplicativo [Iroha Demo JavaScript](https://github.com/soramitsu/iroha-demo-javascript):

- O fornecedor cria WebRTC ofertas e respostas
- um ponto de inscrição e apresenta transações Kaigi
- Os links de convite compactos contêm apenas a chamada ID e o convite secreto.
- o anfitrião observa Torii as respostas dos participantes criptografadas

Os exemplos usam TypeScript e são escritos para que possam ser executados no Electron, um navegador com backend seguro, ou um aplicativo web com uma extensão de carteira.

## Pré-requisitos {#prerequisites}

Precisas de:

- Um ponto final Torii com capacidade para Kaigi
- Uma conta para o anfitrião e uma conta para o hóspede
- acesso à chave de assinatura de cada conta através de uma ponte ou carteira de aplicativos seguros
- Permissões de câmera/microfone do navegador
- Node.js 20+ se estiver a utilizar diretamente a ligação de demonstração ou nativa `@iroha/iroha-js` JavaScript

Para obter uma referência de trabalho completa, clone a demonstração ao lado de um Iroha checkout de fonte:

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

Use a demonstração com [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js) do repositório fonte irmão Iroha . Sua dependência de `file:` resolve esse checkout diretamente. Se a ligação nativa mudar, reconstruí-la sob `iroha/javascript/iroha_js`; um diretório de pacote limpo não contém o espaço de trabalho Cargo necessário para `npm run build:native`.

Antes de executar uma reunião ao vivo no TAIRA, verifique a superfície pública Torii da qual depende a demonstração:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/v1/kaigi/relays"
curl -fsS "$TAIRA/v1/kaigi/relays/health"
```

Estes comandos verificam que TAIRA está ao vivo e que a telemetria de relevo Kaigi está disponível. Eles não enviam transações Kaigi. Um teste real `CreateKaigi` ou `JoinKaigi` precisa financiar contas TAIRA e assinar através da ponte da demonstração ou outra ponte apoiada por carteira.

## Arquitetura {#architecture}

Mantenha a integração Kaigi dividida em três camadas:

|Layer |Responsabilidade |
| --- | --- |
|UI |Selecção de conta, formulário de reunião, exibição do link de convite, controles de mídia |
|WebRTC |`RTCPeerConnection`, mídia local, descrições de ofertas e respostas |
|Iroha ponte |assinatura, `CreateKaigi`, `JoinKaigi`, `EndKaigi`, votação de sinais |

A ponte do aplicativo pode ser um pré-carregamento de elétrons API, uma extensão de carteira, ou um ponto final de fundo. UI:

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

No aplicativo de demonstração, estes métodos de ponte são implementados com `@iroha/iroha-js`, assinatura local, metadados criptografados Kaigi e chamadas Torii.

## Convide Auxiliares {#invite-helpers}

Utilização Torii- chamada compatível IDs No `domain.dataspace:meeting` A demonstração usa `kaigi.universal:<call-name>` para reuniões geradas.

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

## WebRTC Auxiliares {#webrtc-helpers}

O anfitrião cria uma oferta, armazena-a através `CreateKaigi`, e mantém a janela aberta para poder aplicar a resposta do convidado. O convidado pega na oferta criptografada, cria uma resposta, e postagens que respondam com `JoinKaigi`.

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

Anexe os fluxos ao seu UI com elementos de vídeo comuns:

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

## Anfitrião: Crie um link para a reunião {#host-create-a-meeting-link}

O fluxo de hospedeiro:

1. câmera aberta e microfone
2. Crie um par de chaves de sinal Kaigi
3. Crie uma oferta WebRTC
4. apresentar `CreateKaigi`
5. compartilhar um link de convite compacto

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

Mostre `inviteLink` em seu UI. O usuário pode copiá-lo, abrindo-o em outra carteira ou convertê-lo em uma rota de aplicativo como:

```ts
export function inviteRoute(inviteLink: string): string {
  const invite = parseInviteLink(inviteLink);
  return `/kaigi?call=${encodeURIComponent(invite.callId)}&secret=${encodeURIComponent(
    invite.inviteSecretBase64Url,
  )}`;
}
```

## Convidado: compareça a uma reunião {#guest-join-a-meeting}

O fluxo de convidados:

1. Parse o convite
2. Obter a oferta de ligação criptografada da Torii
3. Crie uma resposta WebRTC
4. apresentar `JoinKaigi` com metadados de resposta criptografados

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

Se a reunião é transparente, você pode incluir uma cadeia de exibição da carteira no pedido de união. Para reuniões privadas, mantenha `walletIdentity` desdefinido a menos que o usuário escolha explícitamente revelá-lo.

## Anfitrião: Aplique a resposta do convidado {#host-apply-the-guest-answer}

Após criar uma reunião ao vivo, o anfitrião deve assistir a eventos Kaigi e pesquisar os sinais de resposta criptografados. Aplique a primeira resposta válida à conexão entre pares do anfitriã.

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

Guarde a assinatura devolvida ID para que o seu UI possa parar o observador quando o anfitrião fechar ou navegar embora.

## Conclusão da reunião {#end-the-meeting}

Acabar com a chamada da mesma conta host que a criou:

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

## Financiamento do modo privado {#private-mode-funding}

As operações privadas Kaigi de criação, união e terminação podem exigir proteção XOR para a taxa do ponto de entrada privado.

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

Na demonstração, o UI pede ao usuário para se auto-proteger e depois retenta a ação original de criar ou juntar-se.

## Manual Fallback {#manual-fallback}

A sinalização automática depende de uma carteira ao vivo, rotas com capacidade Kaigi - Torii e geração de prova em modo privado.

- Se o `CreateKaigi` falhar, mostrar um convite manual que contenha a oferta
- Se `JoinKaigi` falhar, indique um pacote de resposta bruto
- Deixar o host colar o pacote de resposta e ligar para `setRemoteDescription`

O retrocesso manual é útil para a depuração WebRTC, mas não fornece as mesmas garantias de sinalização privada na cadeia que o fluxo ao vivo Kaigi.

## Lista de verificação do teste {#test-checklist}

Para os testes unitários, simula a ponte e afirme que o UI passa as cargas úteis esperadas de Kaigi:

- O anfitrião cria mídia local e apresenta `createKaigiMeeting`
- O anfitrião exibe um convite `iroha://kaigi/join?call=...&secret=...`
- O convidado analisa o convite, liga a `getKaigiCall` e apresenta `joinKaigiMeeting`
- Anfitriões de pesquisas ou relógios para sinais de resposta e aplica a resposta
- Indicações de modo privado para auto-proteção quando faltam as proteções XOR
- Retorno manual aparece quando o sinal ao vivo não está disponível

Para um conjunto completo de testes de referência, consulte a visão Kaigi e os testes pré-carregados da ponte do aplicativo demo:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
```

O teste de fumaça UI verifica que a rota `/kaigi` rende. Um teste de mídia real ainda precisa de duas carteiras financiadas mais duas janelas ou dispositivos, porque as permissões para assinar transações, câmera, microfone e WebRTC variam com o tempo de execução.

Se estiver a fazer testes contra TAIRA e uma rota específica de chamada retorna `404`, confirme primeiro que a carteira hospedeira foi enviada com êxito `CreateKaigi`.

## Próximos passos {#next-steps}

- Adicionar gravação de uso com `RecordKaigiUsage` quando o seu aplicativo tem contabilidade confiável da duração da sessão.
- Registrar e monitorar os relés através de `/v1/kaigi/relays` quando se utilizam manifestos de relés.
- Eventos de superfície `KaigiRosterSummary`, `KaigiUsageSummary` e `KaigiRelayHealthUpdated` no painel do operador.
