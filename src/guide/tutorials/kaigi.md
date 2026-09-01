# Embed Kaigi in a JavaScript App

Kaigi records a meeting's lifecycle on Iroha while the browser carries
audio and video over WebRTC. The ledger stores the call, roster mutations,
encrypted signaling metadata, and final status; it is not a media relay.

This tutorial follows the current
[Iroha JavaScript demo](https://github.com/soramitsu/iroha-demo-javascript).
The demo implements one first-release application profile:

- one host and one guest
- `transparent` Kaigi privacy mode
- `authenticated` room policy
- `RevealAfterJoin` peer identity behavior
- an encrypted offer in the call metadata and an encrypted answer in
  committed transaction metadata

The Kaigi protocol also defines `zk-roster-v1`, but the current demo does
not generate or submit that proof flow. Do not present a private-mode
control unless your bridge implements the complete current proof contract.

## Prerequisites

You need:

- Node.js 20 or newer and a Rust toolchain
- a Kaigi-capable Torii endpoint
- separate funded host and guest accounts
- each account's signing key in a privileged wallet or application bridge
- camera and microphone permission in both browser contexts

The demo consumes `@iroha/iroha-js` through the sibling dependency
`file:../iroha/javascript/iroha_js`. Build the SDK from the Iroha source
checkout before installing the demo:

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

The clean SDK package does not contain the Cargo workspace required by
`npm run build:native`, so rebuild it in the Iroha source checkout after
SDK changes. The documented SDK source is pinned at
[`javascript/iroha_js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js).

## Check the Endpoint

For the public Taira testnet, first verify Torii reachability:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/openapi.json" >/dev/null
```

These requests prove only that Torii and its advertised API document are
reachable. They do not prove that a particular Kaigi call exists or that
your wallet may submit transactions.

Do not probe `/v1/kaigi/relays`, `/v1/kaigi/relays/{relay_id}`, or
`/v1/kaigi/relays/health` with unsigned `curl` requests. Those three routes
require an allow-listed operator signature. The relay event stream requires
a canonical exact-network account signature.

In the demo, open **Settings**, enter the Torii URL, and let endpoint
discovery load the chain UUID, exact `NetworkId`, and network prefix. A
write bridge must bind all three values to the selected endpoint; never
construct a `NetworkId` from the chain UUID or prefix.

## Route and Authentication Model

Kaigi writes are instructions inside ordinary quoted and signed
transactions. Submit them through `POST /v1/pipeline/transactions` and wait
for finalized block evidence.

The application reads are:

| Route                               | Authentication                          |
| ----------------------------------- | --------------------------------------- |
| `/v1/kaigi/calls/{call_id}`         | public                                  |
| `/v1/kaigi/calls/{call_id}/signals` | canonical exact-network account request |
| `/v1/kaigi/calls/{call_id}/events`  | canonical exact-network account request |

The JavaScript SDK exposes these as `getKaigiCall` and
`listKaigiCallSignals`. The signal list uses exact cursor pagination. Reuse
the returned cursor unchanged; do not replace it with an offset or a
timestamp-only continuation.

## Keep Signing Outside the Renderer

Split the integration into three boundaries:

| Boundary          | Responsibility                                                       |
| ----------------- | -------------------------------------------------------------------- |
| Renderer          | meeting form, invite link, media controls, WebRTC offers and answers |
| Privileged bridge | key access, fee quote, instruction building, signing, finality waits |
| Torii             | call record, committed signal reads, transaction submission          |

The renderer-facing bridge should accept endpoint identity explicitly and
keep private key material behind the boundary. The current demo surface is
equivalent to this reduced contract:

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

The real demo result also carries finalized block evidence and any quoted
fee. Do not treat a transaction hash alone as success.

## Invite Contract

Use a call ID in exact `domain.dataspace:meeting` form. The demo generates
calls under `kaigi.universal` and uses a 24-byte cryptographically random
invite secret encoded as 32 unpadded base64url characters.

A canonical invite contains exactly one `call` and one `secret` parameter:

```text
iroha://kaigi/join?call=kaigi.universal%3Akaigi-<meeting>&secret=<base64url>
```

The in-app fallback is the same exact query on `#/kaigi`. Reject duplicate,
unknown, empty, padded, or non-canonical parameters. The demo sets the
meeting expiry to 24 hours after `scheduledStartMs`.

The invite secret decrypts the host's offer metadata. It is a bearer
secret: do not log it, put it in analytics, or store it in ledger metadata.
The host's separate X25519 key pair decrypts guest answer signals and must
remain local to the host session.

## Meeting Lifecycle

### Host

1. Verify that the selected wallet identity matches the endpoint's chain
   UUID, exact `NetworkId`, and prefix.
2. Open local media and create an `RTCPeerConnection`.
3. Create an SDP offer and wait for ICE gathering to finish.
4. Generate the invite secret and host Kaigi signal key pair.
5. Encrypt the offer with the invite secret.
6. Quote and sign a transaction containing `CreateKaigi` in transparent,
   authenticated mode.
7. Wait for finalized block evidence before displaying the invite as live.

Keep the host session open. Poll the signal route with the host account's
canonical request signature, decrypt the first valid answer with the host
signal key, and apply it with `setRemoteDescription`. Carry `nextCursor`
forward exactly when more pages are available.

### Guest

1. Parse and validate the exact invite.
2. Fetch the public call record and decrypt its offer with the invite
   secret.
3. Reject an ended, expired, non-live, or non-transparent meeting.
4. Open local media, apply the offer, create an SDP answer, and finish ICE
   gathering.
5. Encrypt the answer to the host's Kaigi public key.
6. Quote and sign a transaction containing `JoinKaigi` plus the canonical
   answer metadata.
7. Wait for finalized block evidence before showing the guest as joined.

### End

Only the host may submit `EndKaigi`. Close the peer connection and media
tracks, submit the signed instruction, and wait for finality. A transparent
participant may use `LeaveKaigi`; a `zk-roster-v1` departure is off-chain
in the first-release protocol and the native instruction rejects
privacy-leave artifacts.

## Manual WebRTC Fallback

The demo retains an **Advanced signaling** path for local development. It
lets the host and guest copy raw WebRTC offer and answer packets when
automatic ledger-backed signaling is unavailable.

Treat this as a different mode. It does not create, join, or end a Kaigi
record, does not provide transaction finality, and must not be presented as
equivalent to the on-chain flow.

## Test the Integration

Run the current focused demo suites:

```bash
npm test -- \
  tests/kaigiView.spec.ts \
  tests/kaigi.spec.ts \
  tests/kaigiCrypto.spec.ts \
  tests/kaigiInvite.spec.ts \
  tests/kaigiStore.spec.ts

npm run verify
```

The tests cover the current transparent profile, strict invite parsing,
encrypted signaling, local session persistence, and the manual fallback. A
real media test still requires two funded wallets and two windows or
devices; mocked WebRTC and renderer tests do not prove camera, microphone,
NAT traversal, canonical request authentication, or live transaction
finality.

For the complete endpoint matrix and CLI lifecycle, see
[Torii endpoints: Kaigi sessions](/reference/torii-endpoints.md#kaigi-sessions).
