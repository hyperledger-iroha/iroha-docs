---
translation_locale: pt
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: 7a9f03e45a17ecbc4a2d7182d4c9aff88d5f6f0b77e0ecfde86bed56d0ddebba
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Incorporar Kaigi em um App JavaScript {#embed-kaigi-in-a-javascript-app}

Kaigi registra o ciclo de vida de uma reunião em Iroha enquanto o navegador transmite áudio e vídeo via WebRTC. O livro razão da blockchain armazena a chamada, alterações na lista de participantes, metadados de sinalização criptografados e o status final; não é um relé de mídia.

Este tutorial segue o atual [Iroha JavaScript demonstração](https://github.com/soramitsu/iroha-demo-javascript). A demonstração implementa um perfil de aplicação da primeira versão:

- um anfitrião e um convidado
- `transparent` Kaigi modo de privacidade
- `authenticated` política do quarto
- `RevealAfterJoin` comportamento de identidade de par de rede
- uma oferta criptografada nos metadados da chamada e uma resposta criptografada nos metadados da transação comprometida

O protocolo Kaigi também define `zk-roster-v1`, mas a demonstração atual não gera nem envia esse fluxo de prova. Não apresente um controle em modo privado a menos que sua ponte implemente o contrato completo de prova atual.

## Pré-requisitos {#prerequisites}

Você precisa:

- Node.js 20 ou mais recente e uma cadeia de ferramentas Rust
- um endpoint API Torii capaz de Kaigi
- separar contas financiadas de anfitrião e convidado
- a chave de assinatura de cada conta em uma carteira privilegiada ou ponte de aplicativo
- permissão de câmera e microfone em ambos os contextos do navegador

A demonstração consome `@iroha/iroha-js` através da dependência irmã `file:../iroha/javascript/iroha_js`. Construa o SDK a partir do checkout de código-fonte Iroha antes de instalar a demonstração:

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

O limpo SDK o pacote não contém o workspace do Cargo exigido por `npm run build:native`, então reconstrua isso no Iroha cópia de trabalho do código-fonte após SDK alterações. O documentado SDK a fonte está fixada em [`javascript/iroha_js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js).

## Verifique o endpoint API {#check-the-endpoint}

Para a testnet pública Taira, primeiro verifique a acessibilidade de Torii:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/openapi.json" >/dev/null
```

Essas solicitações provam apenas que o Torii e o documento de API que ele anuncia estão acessíveis. Elas não provam que uma chamada Kaigi específica exista nem que sua carteira possa enviar transações.

Não faça sondagens em `/v1/kaigi/relays`, `/v1/kaigi/relays/{relay_id}` ou `/v1/kaigi/relays/health` com solicitações `curl` não assinadas. Essas três rotas exigem uma assinatura de operador incluída na lista de permissões. O fluxo de eventos de retransmissão requer uma assinatura de conta de rede exata e canônica.

Na demonstração, abra **Configurações**, insira a URL do Torii e deixe que a descoberta de endpoints carregue o UUID da cadeia, o `NetworkId` exato e o prefixo de rede. Uma ponte de escrita deve vincular os três valores ao endpoint selecionado; nunca construa um `NetworkId` a partir do UUID da cadeia nem do prefixo.

## Modelo de Rota e Autenticação {#route-and-authentication-model}

As escritas de Kaigi são instruções dentro de transações comuns com tarifa cotada e assinadas. Envie-as através de `POST /v1/pipeline/transactions` e aguarde a evidência do bloco finalizado.

As leituras do aplicativo são:

| Rota                               |Autenticação|
| ----------------------------------- | --------------------------------------- |
| `/v1/kaigi/calls/{call_id}`         |público|
| `/v1/kaigi/calls/{call_id}/signals` |solicitação de conta de rede exata canônica|
| `/v1/kaigi/calls/{call_id}/events`  |solicitação de conta de rede exata canônica|

O JavaScript SDK expõe estes como `getKaigiCall` e `listKaigiCallSignals`. A lista de sinais usa paginação por cursor exata. Reutilize o cursor retornado sem alterações; não o substitua por um deslocamento ou apenas por um carimbo de data/hora como continuidade.

## Continue Assinando Fora do Renderizador {#keep-signing-outside-the-renderer}

Divida a integração em três limites:

|Fronteira|Responsabilidade|
| ----------------- | -------------------------------------------------------------------- |
|Renderizador          |formulário de reunião, link de convite, controles de mídia, WebRTC ofertas e respostas|
|Ponte privilegiada|acesso à chave, estimativa de preço da taxa, construção de instrução, assinatura, esperas de finalização|
| Torii             |registro de chamadas, leituras de sinais comprometidos, envio de transação|

A ponte voltada para o renderizador deve aceitar a identidade do endpoint API explicitamente e manter o material da chave privada protegido atrás da fronteira. A superfície de demonstração atual é equivalente a este contrato reduzido:

```ts
type ConnectionIdentity = {
  toriiUrl: string
  chainId: string
  networkId: string
  networkPrefix: number
}

type KaigiSignalKeyPair = {
  publicKeyBase64Url: string
  privateKeyBase64Url: string
}

type KaigiMeeting = {
  callId: string
  meetingCode: string
  hostAccountId?: string
  hostKaigiPublicKeyBase64Url: string
  scheduledStartMs: number
  expiresAtMs: number
  createdAtMs: number
  live: boolean
  ended: boolean
  privacyMode: 'transparent'
  peerIdentityReveal: 'RevealAfterJoin'
  offerDescription: { type: 'offer'; sdp: string }
}

type KaigiSignalPage = {
  items: Array<{
    entrypointHash: string
    callId: string
    participantId: string
    participantName: string
    createdAtMs: number
    answerDescription: { type: 'answer'; sdp: string }
  }>
  nextCursor?: string
}

type KaigiBridge = {
  generateKaigiSignalKeyPair(): KaigiSignalKeyPair

  createKaigiMeeting(
    input: ConnectionIdentity & {
      hostAccountId: string
      callId: string
      title?: string
      scheduledStartMs: number
      meetingCode: string
      inviteSecretBase64Url: string
      hostDisplayName: string
      hostParticipantId: string
      hostKaigiPublicKeyBase64Url: string
      offerDescription: { type: 'offer'; sdp: string }
    },
  ): Promise<{ hash: string }>

  getKaigiCall(input: {
    toriiUrl: string
    callId: string
    inviteSecretBase64Url: string
  }): Promise<KaigiMeeting>

  joinKaigiMeeting(
    input: ConnectionIdentity & {
      participantAccountId: string
      callId: string
      inviteSecretBase64Url: string
      participantId: string
      participantName: string
      answerDescription: { type: 'answer'; sdp: string }
    },
  ): Promise<{ hash: string }>

  pollKaigiMeetingSignals(input: {
    toriiUrl: string
    networkId: string
    networkPrefix: number
    accountId: string
    callId: string
    hostKaigiKeys: KaigiSignalKeyPair
    limit?: number
    cursor?: string
  }): Promise<KaigiSignalPage>

  endKaigiMeeting(
    input: ConnectionIdentity & {
      hostAccountId: string
      callId: string
      endedAtMs?: number
    },
  ): Promise<{ hash: string }>
}
```

O resultado real da demonstração também contém evidências de bloco finalizadas e qualquer taxa cotada. Não trate apenas o hash criptográfico de uma transação como sucesso.

## Contrato de Convite {#invite-contract}

Use um ID de chamada no formato exato `domain.dataspace:meeting`. O demo gera chamadas sob `kaigi.universal` e usa um segredo de convite criptograficamente aleatório de 24 bytes codificado como 32 caracteres base64url sem preenchimento.

Um convite canônico contém exatamente um parâmetro `call` e um parâmetro `secret`:

```text
iroha://kaigi/join?call=kaigi.universal%3Akaigi-<meeting>&secret=<base64url>
```

O fallback no aplicativo é exatamente a mesma consulta em `#/kaigi`. Rejeite parâmetros duplicados, desconhecidos, vazios, preenchidos ou não canônicos. A demonstração define o prazo de validade da reunião para 24 horas após `scheduledStartMs`.

O segredo do convite decifra os metadados da oferta do anfitrião. É um segredo portador: não o registre, coloque-o em análises ou armazene-o nos metadados do registro blockchain. O par de chaves separado do anfitrião X25519 decifra os sinais de resposta do convidado e deve permanecer local na sessão do anfitrião.

## Ciclo de Vida da Reunião {#meeting-lifecycle}

### Hospedeiro {#host}

1. Verifique se a identidade da carteira selecionada corresponde à cadeia UUID do endpoint API, ao exato `NetworkId` e ao prefixo.
2. Abra a mídia local e crie um `RTCPeerConnection`.
3. Crie uma oferta SDP e espere a conclusão da coleta ICE.
4. Gere o segredo do convite e o par de chaves de sinal do host Kaigi.
5. Criptografe a oferta com o segredo do convite.
6. Cite e assine uma transação contendo `CreateKaigi` em modo transparente e autenticado.
7. Espere pela evidência do bloco finalizado antes de exibir o convite como ativo.

Mantenha a sessão do host aberta. Consulte a rota de sinal com a assinatura de solicitação canônica da conta do host, descriptografe a primeira resposta válida com a chave de sinal do host e aplique-a com `setRemoteDescription`. Leve `nextCursor` adiante exatamente quando houver mais páginas disponíveis.

### Convidado {#guest}

1. Analise e valide o convite exato.
2. Busque o registro de chamada pública e descriptografe sua oferta com o segredo do convite.
3. Rejeitar uma reunião encerrada, expirada, não ao vivo ou não transparente.
4. Abra a mídia local, aplique a oferta, crie uma resposta SDP e conclua a coleta ICE.
5. Criptografe a resposta com a chave pública Kaigi do host.
6. Cite e assine uma transação contendo `JoinKaigi` mais os metadados de resposta canônicos.
7. Espere pela evidência do bloco finalizado antes de mostrar que o convidado entrou.

### Fim {#end}

Apenas o anfitrião pode enviar `EndKaigi`. Feche a conexão de rede com o par e as faixas de mídia, envie a instrução assinada e aguarde a finalização. Uma transparente o participante pode usar `LeaveKaigi`; uma partida `zk-roster-v1` é off-chain no protocolo da primeira versão e a instrução nativa rejeita artefatos de saída de privacidade.

## Manual WebRTC Reversão {#manual-webrtc-fallback}

A demonstração mantém um caminho de sinalização Avançado para desenvolvimento local. Isso permite que o host e o convidado copiem pacotes de oferta e resposta brutos WebRTC quando a sinalização automática baseada em livro-razão não estiver disponível.

Trate isso como um modo diferente. Isso não cria, participa ou encerra um registro Kaigi, não fornece finalização de transação e não deve ser apresentado como equivalente ao fluxo on-chain.

## Testar a Integração {#test-the-integration}

Execute as suítes de demonstração atualmente focadas:

```bash
npm test -- \
  tests/kaigiView.spec.ts \
  tests/kaigi.spec.ts \
  tests/kaigiCrypto.spec.ts \
  tests/kaigiInvite.spec.ts \
  tests/kaigiStore.spec.ts

npm run verify
```

Os testes cobrem o perfil transparente atual, análise estrita de convites, sinalização criptografada, persistência local de sessão e o fallback manual. Um teste de mídia real ainda requer duas carteiras financiadas e duas janelas ou dispositivos; os testes simulados WebRTC e de renderização não provam a câmera, microfone, a travessia de NAT, autenticação de solicitação canônica ou a finalização de transações ao vivo.

Para a matriz completa de endpoints API e o ciclo de vida CLI, consulte [Torii API endpoints: Kaigi sessões](/pt/reference/torii-endpoints.md#kaigi-sessions).
