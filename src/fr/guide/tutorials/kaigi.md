---
translation_locale: fr
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: 7a9f03e45a17ecbc4a2d7182d4c9aff88d5f6f0b77e0ecfde86bed56d0ddebba
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Intégrer Kaigi dans une application JavaScript {#embed-kaigi-in-a-javascript-app}

Kaigi enregistre le cycle de vie d'une réunion sur Iroha tandis que le navigateur transporte l'audio et la vidéo via WebRTC. Le registre blockchain stocke l'appel, les mutations de la liste des participants, les métadonnées de signalisation chiffrées et le statut final ; ce n'est pas un relais média.

Ce tutoriel suit le [Iroha JavaScript démo](https://github.com/soramitsu/iroha-demo-javascript) actuel. La démonstration implémente un profil d'application de première version :

- un hôte et un invité
- `transparent` Kaigi mode de confidentialité
- `authenticated` politique de la chambre
- `RevealAfterJoin` comportement de l'identité du pair réseau
- une offre chiffrée dans les métadonnées de l'appel et une réponse chiffrée dans les métadonnées de la transaction engagée

Le protocole Kaigi définit également `zk-roster-v1`, mais la démonstration actuelle ne génère ni ne soumet ce flux de preuve. Ne présentez pas un contrôle en mode privé à moins que votre passerelle n'implémente le contrat de preuve complet actuel.

## Prérequis {#prerequisites}

Vous avez besoin de :

- Node.js 20 ou plus récent et une chaîne d'outils Rust
- un point de terminaison Torii API capable de Kaigi
- séparer les comptes hôte et invité financés
- la clé de signature de chaque compte dans un portefeuille privilégié ou un pont d'application
- autorisation de la caméra et du microphone dans les deux contextes de navigateur

La démo consomme `@iroha/iroha-js` via la dépendance sœur `file:../iroha/javascript/iroha_js`. Construisez le SDK à partir de la source Iroha avant d’installer la démo :

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

Le propre SDK le paquet ne contient pas l'espace de travail Cargo requis par `npm run build:native`, alors reconstruis-le dans le Iroha copie de travail du code source après SDK changements. Le documenté SDK la source est épinglée à [`javascript/iroha_js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js).

## Vérifiez le point de terminaison API {#check-the-endpoint}

Pour le réseau de test public Taira, vérifiez d'abord que Torii est accessible :

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/openapi.json" >/dev/null
```

Ces requêtes prouvent seulement que Torii et le document d'API qu'il annonce sont accessibles. Elles ne prouvent pas qu'un appel Kaigi précis existe ni que votre portefeuille peut soumettre des transactions.

Ne sondez pas `/v1/kaigi/relays`, `/v1/kaigi/relays/{relay_id}` ou `/v1/kaigi/relays/health` avec des requêtes `curl` non signées. Ces trois routes nécessitent une signature d'opérateur autorisée. Le flux d'événements de relais nécessite une signature de compte canonique liée au réseau exact.

Dans la démonstration, ouvrez **Paramètres**, saisissez l'URL de Torii et laissez la découverte des endpoints charger l'UUID de la chaîne, le `NetworkId` exact et le préfixe réseau. Un pont d'écriture doit lier ces trois valeurs à l'endpoint sélectionné ; ne construisez jamais un `NetworkId` à partir de l'UUID de la chaîne ni du préfixe.

## Modèle de routage et d'authentification {#route-and-authentication-model}

Les écritures Kaigi sont des instructions contenues dans des transactions ordinaires tarifées et signées. Soumettez-les via `POST /v1/pipeline/transactions` et attendez la preuve d'un bloc finalisé.

Les lectures de l'application sont :

|Route|Authentification|
| ----------------------------------- | --------------------------------------- |
| `/v1/kaigi/calls/{call_id}`         |publique|
| `/v1/kaigi/calls/{call_id}/signals` |requête de compte canonique liée au réseau exact|
| `/v1/kaigi/calls/{call_id}/events`  |requête de compte canonique liée au réseau exact|

Le JavaScript SDK expose ceux-ci en tant que `getKaigiCall` et `listKaigiCallSignals`. La liste de signaux utilise une pagination par curseur exact. Réutilisez le curseur retourné tel quel ; ne le remplacez pas par un décalage ou une continuation basée uniquement sur un horodatage.

## Continuez à signer en dehors du rendu {#keep-signing-outside-the-renderer}

Divisez l'intégration en trois limites :

|Frontière|Responsabilité|
| ----------------- | -------------------------------------------------------------------- |
|Rendu|formulaire de réunion, lien d'invitation, contrôles multimédias, WebRTC offres et réponses|
|Pont privilégié|accès clé, estimation du prix des frais, construction des instructions, signature, attentes de finalité|
| Torii             |enregistrement d'appel, lectures de signal engagées, soumission de transaction|

Le pont côté rendu devrait accepter l'identité de point de terminaison API explicitement et garder le matériel de clé privée derrière la frontière. La surface de démonstration actuelle est équivalente à ce contrat réduit :

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

Le résultat réel de la démonstration comporte également une preuve de bloc finalisée et tous les frais cités. Ne considérez pas un hash cryptographique de transaction seul comme un succès.

## Contrat d'invitation {#invite-contract}

Utilisez un ID d'appel sous la forme exacte `domain.dataspace:meeting`. La démo génère des appels sous `kaigi.universal` et utilise un secret d'invitation cryptographiquement aléatoire de 24 octets encodé sous forme de 32 caractères base64url non remplis.

Une invitation canonique contient exactement un paramètre `call` et un paramètre `secret` :

```text
iroha://kaigi/join?call=kaigi.universal%3Akaigi-<meeting>&secret=<base64url>
```

Le mécanisme de secours intégré à l'application est exactement la même requête sur `#/kaigi`. Rejeter les paramètres dupliqués, inconnus, vides, rembourrés ou non canoniques. La démo fixe l'expiration de la réunion à 24 heures après `scheduledStartMs`.

Le secret d'invitation décrypte les métadonnées de l'offre de l'hôte. C'est un secret porteur : ne le consignez pas, ne l'intégrez pas aux analyses et ne le stockez pas dans les métadonnées du registre blockchain. La paire de clés distincte X25519 de l'hôte décrypte les signaux de réponse des invités et doit rester locale à la session de l'hôte.

## Cycle de vie de la réunion {#meeting-lifecycle}

### Hôte {#host}

1. Vérifiez que l'identité du portefeuille sélectionné correspond à la chaîne UUID, à l'exact `NetworkId` et au préfixe du point de terminaison API.
2. Ouvrez les médias locaux et créez un `RTCPeerConnection`.
3. Créez une offre SDP et attendez que la collecte ICE se termine.
4. Générez le secret d'invitation et la paire de clés de signal de l'hôte Kaigi.
5. Chiffrez l'offre avec le secret d'invitation.
6. Citez et signez une transaction contenant `CreateKaigi` en mode transparent et authentifié.
7. Attendez les preuves du bloc finalisé avant d'afficher l'invitation comme active.

Maintenez la session hôte ouverte. Interrogez la route du signal avec la signature de requête canonique du compte hôte, déchiffrez la première réponse valide avec la clé de signal de l'hôte et appliquez-la avec `setRemoteDescription`. Transmettez `nextCursor` exactement lorsque d'autres pages sont disponibles.

### Invité {#guest}

1. Analyser et valider l'invitation exacte.
2. Récupérez l'enregistrement des appels publics et déchiffrez son offre avec le secret d'invitation.
3. Rejeter une réunion terminée, expirée, non en direct ou non transparente.
4. Ouvrez les médias locaux, appliquez l'offre, créez une réponse SDP, et terminez la collecte ICE.
5. Chiffrez la réponse avec la clé publique Kaigi de l'hôte.
6. Citez et signez une transaction contenant `JoinKaigi` plus les métadonnées de réponse canonique.
7. Attendez la preuve du bloc finalisé avant de montrer que l'invité a rejoint.

### Fin {#end}

Seul l'hôte peut soumettre `EndKaigi`. Fermez la connexion avec le pair du réseau et les pistes médias, soumettez l'instruction signée et attendez la finalisation. Un transparent le participant peut utiliser `LeaveKaigi` ; un départ `zk-roster-v1` est hors chaîne dans le protocole de première version et l'instruction native rejette les artefacts de sortie privée.

## Manuel WebRTC Repli {#manual-webrtc-fallback}

La démo conserve un chemin de signalisation Avancé pour le développement local. Elle permet à l'hôte et à l'invité de copier les paquets d'offre et de réponse bruts WebRTC lorsque la signalisation automatique basée sur le grand livre est indisponible.

Considérez ceci comme un mode différent. Il ne crée, ne rejoint ni ne termine un enregistrement Kaigi, ne fournit pas de finalité de transaction, et ne doit pas être présenté comme équivalent au flux sur la chaîne.

## Tester l'intégration {#test-the-integration}

Exécuter les suites de démonstration actuellement focalisées :

```bash
npm test -- \
  tests/kaigiView.spec.ts \
  tests/kaigi.spec.ts \
  tests/kaigiCrypto.spec.ts \
  tests/kaigiInvite.spec.ts \
  tests/kaigiStore.spec.ts

npm run verify
```

Les tests couvrent le profil transparent actuel, l'analyse stricte des invitations, le signalement chiffré, la persistance locale des sessions et le repli manuel. Un test de média réel nécessite encore deux portefeuilles financés et deux fenêtres ou appareils ; Les tests simulés WebRTC et de rendu ne prouvent pas la caméra, le microphone, la traversée NAT, l'authentification de la demande canonique ou la finalité de la transaction en direct.

Pour la matrice complète des points de terminaison API et le cycle de vie CLI, voir [Torii API points de terminaison : Kaigi sessions](/fr/reference/torii-endpoints.md#kaigi-sessions).
