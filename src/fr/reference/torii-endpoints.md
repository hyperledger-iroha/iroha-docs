---
translation_locale: fr
translation_source: /reference/torii-endpoints.md
translation_source_hash: 6ee65d409642c79bea0f2c4ff0d8cd59b0ec0a29e115225045786d0816e8a6a7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Torii Les points de fin {#torii-endpoints}

Torii est le HTTP, SSE, et WebSocket porte d'entrée pour Iroha 3. Ça sert les deux.
à l'aide d'un registre APIs et les points d'extrémité des opérateurs.

Les règles du protocole en vigueur sont les suivantes:

- le format binaire canonique est **Norito**
- de nombreux points d'extrémité JSON quand vous envoyez `Accept: application/json`
- Les mesures sont exposées au format Prometheus

Pour les détails du format, la négociation du contenu, les drapeaux de mise en page, les hashes de schéma et
Norito RPC les directives, voir le [Norito référence](/fr/reference/norito.md).

## Les points de fin communs {#common-endpoints}

| Point final | Formatation | Le but |
| --- | --- | --- |
| `POST /transaction` | Norito | Soumettre une transaction signée |
| `POST /query` | Norito | Envoyer une requête signée |
| `GET /events` | WebSocket | Abonnez-vous aux flux d' événements |
| `GET /block/stream` | WebSocket | Blocs engagés par flux |
| `GET /peers` | JSON | Liste des pairs exposés par Torii |
| `GET /health` | JSON | Point final de vie légère |
| `GET /api_version` | JSON | Par défaut API version |
| `GET /status` | JSON | Résumé de l'état des opérateurs à haut niveau |
| `GET /metrics` | Prometheus | Point d'extrémité de rayure Prometheus |
| `GET /schema` | JSON | Rapidité du schéma de modèle de données servi par le nœud |
| `GET /openapi` ou `GET /openapi.json` | JSON | OpenAPI document pour l'actif Torii HTTP Route |
| `GET /v1/parameters` | JSON | Résumé des paramètres du nœud |
| `GET /v1/node/capabilities` | JSON | Capacité du nœud et métadonnées du modèle de données |
| `GET /v1/api/versions` | JSON | Soutenue Torii API versions |
| `GET /v1/events/sse` | SSE | Flux d'événements pour les clients de longue durée |
| `GET /v1/time/now` | JSON | Impression de l'horloge murale du nœud |
| `GET /v1/time/status` | JSON | Statut de synchronisation temporelle |

`/openapi` est la liste d'endpoints autorisés pour un nœud en cours d'exécution.
la surface dépend des caractéristiques de construction et de la configuration du temps d'exécution, ainsi généré
Les clients devraient préférer le live OpenAPI document sur une liste de itinéraires copiée à la main.
Utilisez le [Torii API console](/fr/reference/torii-api-console.md) pour le charger en direct
document, test JSON Route, copie curl les demandes et générer le code client à partir de
le schéma actuel.

## Essayez de vivre Taira Route {#try-live-taira-routes}

Le public Taira le réseau de test expose la même Torii JSON surface de cette application
Les commandes suivantes ne nécessitent pas de clés:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA_ROOT/openapi.json" \
  | jq -r '.paths | keys[]' \
  | grep '^/v1/' \
  | head -n 20

curl -fsS "$TAIRA_ROOT/v1/node/capabilities" \
  | jq '{abi_version, data_model_version, query: .query.aggregate.supported_resources}'
```

Essayez de lire les ressources contre l'état actuel du monde:

```bash
curl -fsS "$TAIRA_ROOT/v1/domains?limit=5" \
  | jq -r '.items[].id'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=5" \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

Si un itinéraire de réseau d'essai public revient `502`, temps hors, ou rapporte un saturé
faire la queue, traiter comme un problème de disponibilité du point d'arrêt et réessayer plus tard avant
débogage de votre code client.

## Les points de consensus et les points d'expiration {#consensus-and-runtime-endpoints}

| Point final | Formatation | Le but |
| --- | --- | --- |
| `GET /v1/sumeragi/commit-certificates` | JSON | Résumés récents des certificats d'engagement |
| `GET /v1/sumeragi/validator-sets` | JSON | L' historique des réglages de validateur |
| `GET /v1/sumeragi/validator-sets/{height}` | JSON | Validateur réglé à une hauteur de bloc |
| `GET /v1/sumeragi/status` | Norito ou JSON | Imprimante détaillée de l'état du consensus |
| `GET /v1/sumeragi/status/sse` | SSE | Flux d'état de consensus continu |
| `GET /v1/sumeragi/leader` | JSON | Informations actuelles sur les dirigeants |
| `GET /v1/sumeragi/qc` | Norito ou JSON | Résumé du dernier certificat de quorum |
| `GET /v1/sumeragi/checkpoints` | JSON | Résumé des points de contrôle consensuels |
| `GET /v1/sumeragi/consensus-keys` | JSON | Les clés de consensus actives |
| `GET /v1/sumeragi/bls_keys` | JSON | Actifs BLS clés de consensus |
| `GET /v1/sumeragi/phases` | JSON | Le dernier échantillon de latence par phase |
| `GET /v1/sumeragi/rbc` | JSON | RBC métriques de session et de débit |
| `GET /v1/sumeragi/rbc/sessions` | JSON | Actifs RBC capture d'écran de session |
| `GET /v1/sumeragi/pacemaker` | JSON | Statut du marqueur cardiaque |
| `GET /v1/sumeragi/params` | JSON | Courant en chaîne Sumeragi paramètres |
| `GET /v1/sumeragi/collectors` | JSON | Impression instantanée du plan collecteur déterministe |
| `GET /v1/sumeragi/key-lifecycle` | JSON | Statut du cycle de vie clé de consensus |
| `GET /v1/sumeragi/telemetry` | JSON | Télémétrie instantanée du consensus |
| `GET /v1/sumeragi/evidence` | JSON | Enregistrements de preuves, optionnellement filtrés par chaîne de requête |
| `GET /v1/sumeragi/evidence/count` | JSON | Compte des données probantes |
| `POST /v1/sumeragi/evidence/submit` | JSON | Soumettre des preuves de consensus |
| `GET /v1/sumeragi/commit_qc/{hash}` | Norito ou JSON | L'engagement QC enregistrement pour un hash de bloc |
| `GET /v1/runtime/abi/active` | JSON | Temps d'exécution actif ABI le descripteur |
| `GET /v1/runtime/abi/hash` | JSON | Temps d'exécution actif ABI le hachage |
| `GET /v1/runtime/metrics` | JSON | Impression instantanée des métriques d'exécution |
| `GET /v1/runtime/upgrades` | JSON | Liste des mises à jour en cours d' exécution |
| `POST /v1/runtime/upgrades/propose` | JSON | Proposer une mise à niveau de l'heure d'exécution |
| `POST /v1/runtime/upgrades/activate/{id}` | JSON | Activation d'une mise à niveau de temps d'exécution proposée |
| `POST /v1/runtime/upgrades/cancel/{id}` | JSON | Annuler une mise à niveau de l'heure d'exécution proposée |

## App et SORA Familles de route {#app-and-sora-route-families}

Quand ? Torii est construit avec le jeu de fonctionnalités face à l'application, il expose des JSON
familles pour les explorateurs, SORA les services, les flux de ponts, les preuves et le stockage.
Les familles ne sont pas toutes activées sur tous les profils de réseau.

| Famille de routes | Le but |
| --- | --- |
| `/v1/accounts/*`, `/v1/domains/*`, `/v1/assets/*` | JSON Lire, consulter les aides, intégrer les aides et afficher le portefeuille ou le titulaire |
| `/v1/nfts/*`, `/v1/rwas/*`, `/v1/confidential/*` | NFT, les actifs du monde réel et les vues sur les actifs confidentiels |
| `/v1/aliases/*`, `/v1/assets/aliases/*`, `/v1/sns/*`, `/v1/identifiers/*` | Nom, alias et résolution de l'identifiant |
| `/v1/explorer/*` | Vue de compte, d'actif, de bloc, de transaction, d'instructions, de métriques et de flux axés sur l'explorateur |
| `/v1/transactions/*`, `/v1/pipeline/*`, `/v1/iso20022/*` | l'historique des transactions, le rétablissement ou l'état du pipeline; ISO 20022 aides |
| `/v1/contracts/*` | Code de contrat, déploiement, paquet, appel, vue, événement, activité, roulement et itinéraires d'état |
| `/v1/multisig/*`, `/v1/controls/*` | Propositions, approbations et aides au contrôle des transferts |
| `/v1/bridge/*`, `/v1/ledger/*`, `/v1/proofs/*` | Finalité, état de preuve, bloc de preuve, conservation de la preuve et les routes de requête de preuve |
| `/v1/da/*` | Intégration de la disponibilité des données, manifestes, politiques d'épreuve, engagements et intentions précises |
| `/v1/zk/*` | ZK les racines, la vérification des preuves, IVM la preuve, le décompte des votes, les clés de vérification, les dossiers de preuve et les pièces jointes |
| `/v1/gov/*`, `/v1/ministry/*` | Propositions de gouvernance, bulletins de vote, état du conseil, espaces protégés des noms, propositions d'ordre du jour, promulgation et finalisation |
| `/v1/nexus/*`, `/v1/sccp/*` | Nexus les aides à l'épreuve de la voie, de l'espace de données et de la chaîne croisée |
| `/v1/musubi/*` | Musubi lecteurs de registre des paquets et constructeurs d'instructions |
| `/v1/subscriptions/*` | Plans d'abonnement, cycle de vie des abonnements, utilisation et facturation des aides |
| `/v1/sorafs/*`, `/sorafs/*`, `/.well-known/sorafs/*` | SoraFS Découverte des fournisseurs, démonstration de la capacité, mise en place d'étiquettes, récupération de stockage et diffusion du contenu public |
| `/v1/soracloud/*`, `/v1/soradns/*`, `/soradns/*`, `/api/*` | SoraCloud cycle de vie des services, flux informatiques/modèles privés, découverte publique et routage d'applications hébergées |
| `/v1/connect/*`, `/v1/vpn/*` | Iroha Les séances de connexion, WebSocket le transport, VPN séances, profils et reçus |
| `/v1/app-api/*`, `/v1/api/*`, `/v1/content/*` | Application API liaisons et liens/CID- routage de contenu pris en charge |
| `/v1/operator/*`, `/v1/mcp` | Autentification de l'opérateur et natifs MCP JSON-RPC pont |
| `/v1/offline/*`, `/v1/repo/*`, `/v1/space-directory/*`, `/v1/ram-lfe/*` | Préparation en ligne, accords de référentiel, manifestes de sphère de données et [RAM-LFE les aides](/fr/blockchain/ram-lfe.md#torii-routes) |
| `/v1/kaigi/*`, `/v1/webhooks/*`, `/v1/notify/*`, `/v1/telemetry/*` | Collaboration, connexion Web, notification push et intégration en direct de télémétrie |

## ISO 20022 pont {#iso-20022-bridge}

Torii dévoile les ISO 20022 pont sous `/v1/iso20022/*` lorsque l'application est orientée vers
API Le pont est délibérément ciblé:
n'a pas une finalité générale ISO 20022 passerelle de compensation, mais un sous-ensemble pris en charge pour
transformer des messages de paiement sélectionnés en signatures Iroha les transferts et le suivi
leur statut de registre.

### Torii ISO 20022 points de fin {#torii-iso-20022-endpoints}

| Méthode et point final | Le but |
| --- | --- |
| `POST /v1/iso20022/pacs008` | Envoyer une demande FI- Pour...FI le transfert de crédit du client et l'établissement de la correspondance Iroha transfert d'actifs |
| `POST /v1/iso20022/pacs009` | Envoyer une demande FI- Pour...FI transfert de crédit utilisé pour PvP ou le financement en espèces lié aux titres |
| `POST /v1/iso20022/pacs002` | Soumettre un rapport sur l'état des paiements |
| `POST /v1/iso20022/pacs004` | Soumettre une déclaration de paiement |
| `POST /v1/iso20022/camt056` | Soumettre une demande d'annulation de paiement |
| `POST /v1/iso20022/sese023` | Soumettre une instruction de règlement des titres |
| `POST /v1/iso20022/sese024` | Soumettre un message d'état de règlement des titres |
| `POST /v1/iso20022/sese025` | Soumettre une confirmation de règlement des titres |
| `POST /v1/iso20022/colr012` | Envoyer un message de remplacement des garanties |
| `GET /v1/iso20022/messages/{msg_id}` | Lisez le record canonique du pont pour un message |
| `GET /v1/iso20022/audit/messages` | Lisez le manifeste de vérification des messages |
| `GET /v1/iso20022/messages/{msg_id}/pacs002` | Rendre l'état actuel du paiement `pacs.002` XML |
| `GET /v1/iso20022/messages/{msg_id}/pacs004` | Récupérer la déclaration de paiement en cours comme suit: `pacs.004` XML |
| `GET /v1/iso20022/messages/{msg_id}/camt029` | Rendre la résolution d'annulation actuelle `camt.029` XML |
| `GET /v1/iso20022/messages/{msg_id}/sese024` | Rendre l'état actuel du règlement `sese.024` XML |
| `GET /v1/iso20022/messages/{msg_id}/sese025` | Render la confirmation de règlement en cours comme suit: `sese.025` XML |

`pacs.008` les messages doivent fournir le message ID, règlement interbancaire
montant, monnaie, date de règlement, débiteur et créancier IBANs, et le débiteur et
créancier BICs. Lorsque les données de référence sont configurées, le pont vérifie également
BIC, IBAN, et ISO 4217 croisements de devises avant la transaction générée
Il entre dans le pipeline.

`pacs.009` les soumissions doivent fournir le message d'affaires ID, définition du message
ID, temps de création, montant du règlement interbancaire, devise, date du règlement;
l'agent chargé de l'instruction et l'agent BICs, et débiteur et créancier IBANs. Si le
le message comprend `Purp`, le pont accepte actuellement un financement destiné aux titres
uniquement: `Purp=SECU`.

Les `pacs.008` et `pacs.009` les points finaux de soumission sont acceptés XML ISO enveloppes ou
le format de champ plat utilisé lors des essais sur pont. `SplmtryData` champs
peut pincer la cible Iroha compte principal, source et cible IDs ou les adresses,
et définition des actifs ID. La réponse est: `202 Accepted` avec `message_id`,
`transaction_hash`, `status`, `pacs002_code`, et le résolu
contexte de registre/compte/actif.

### Parser et cartographier supplémentaires {#additional-parser-and-mapping-support}

Les IVM ISO l'assistant valide et matérialise également le message suivant
familles pour la validation des enveloppes, la cartographie des établissements ou le déploiement en aval
Ils n'ont pas de réconciliation indépendante Torii les itinéraires.

| Famille de messages | Soutien actuel |
| --- | --- |
| `head.001` | Validation de l'en-tête des demandes d'entreprise pour ISO enveloppes, y compris `BizMsgIdr`, `MsgDefIdr`, le temps de création et l'expéditeur/récepteur optionnel BIC champs |
| `pacs.007`, `pacs.028`, `pacs.029` | Reversation des paiements, demande de statut et résolution/analyse du statut de l'enquête |
| `pain.001`, `pain.002` | Initiation du paiement par le client et validation du rapport d'état de paiement |
| `camt.052`, `camt.053`, `camt.054` | Rapport de compte, déclaration et validation des notifications |

## Kaigi Les séances {#kaigi-sessions}

Kaigi fournit des salles audio/vidéo payantes en temps réel sur SORA Nexus. Utilisez-le lorsque
une application a besoin de création de session protégée par un registre, de changements de liste, de relais
les manifestes, la signalisation cryptée et la mesure de l'utilisation au lieu de conserver toutes
de conférence hors chaîne.

Le cycle de vie en fonction du registre est le suivant:

- `CreateKaigi`: créer un appel sous un domaine et stocker sa politique,
  l'horaire, les métadonnées et le manifeste de relais facultatif.
- `JoinKaigi` et `LeaveKaigi`: Mettez à jour la liste des appels.
  les participants utilisent des engagements, des annulateurs et des preuves de liste au lieu
  compte participant exposant IDs directement.
- `RecordKaigiUsage`: ajouter la durée mesurée et les totaux des gaz.
- `EndKaigi`: fermez la séance et enregistrez le timestamp final.

Torii détecte la télémétrie du relais sous `/v1/kaigi/relays`,
`/v1/kaigi/relays/{relay_id}`, `/v1/kaigi/relays/health`, et
`/v1/kaigi/relays/events` lorsque l'application API et les fonctionnalités de télémétrie sont activées.
L'état de la session se reflète par Kaigi événements de domaine tels que
`KaigiRosterSummary`, `KaigiRelayManifestUpdated`,
`KaigiRelayHealthUpdated`, et `KaigiUsageSummary`.

### CLI Test de fumée {#cli-smoke-test}

Commencez par le `iroha kaigi` CLI lorsque vous voulez vérifier qu'une Torii point final
accepte Kaigi les transactions avant de connecter un UI. La commande de démarrage rapide
crée une salle temporaire contre les actifs Torii point final et imprime un résumé
avec l'identifiant d'appel, rejoindre la commande et SoraNet indice de bobine:

```bash
iroha kaigi quickstart --auto-join-host --summary-out kaigi-summary.json
```

Pour les flux scriptés, gérez explicitement le cycle de vie de la pièce:

```bash
iroha kaigi create \
  --domain streaming \
  --call-name daily \
  --host <i105-account-id> \
  --privacy-mode transparent \
  --room-policy authenticated

iroha kaigi join --domain streaming --call-name daily --participant <i105-account-id>
iroha kaigi leave --domain streaming --call-name daily --participant <i105-account-id>

iroha kaigi record-usage \
  --domain streaming \
  --call-name daily \
  --duration-ms 120000 \
  --billed-gas 1500

iroha kaigi end --domain streaming --call-name daily
```

Utilisation `--room-policy public` pour les salles qui peuvent être exposées par des relais sans spectateur
les billets, ou `--room-policy authenticated` lorsque les sorties doivent nécessiter un spectateur
l'authentification. `--privacy-mode zk-roster-v1` seulement après que le réseau a
le Kaigi les clés de vérification de la liste et de l'utilisation configurées; autrement, joints, feuilles,
et les enregistrements d'utilisation privés échouent lors de la vérification déterministique.

### Les tests avec le JavaScript Démo {#testing-with-the-javascript-demo}

Utilisez le
[soramitsu/iroha-demo-javascript](https://github.com/soramitsu/iroha-demo-javascript)
La démo est un Electron et Vue
l'application qui communique directement avec Torii par le biais du local `@iroha/iroha-js`
obligatoire et comprend une `/kaigi` route pour les supports natifs de navigateur un à un.

Utilisez la démo avec
[`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js)
de la Iroha Le démo pin le SDK à travers
`file:../iroha/javascript/iroha_js`, Alors gardez les deux caisses dans ce frère.
L'allégation:

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

Utilisation Node.js 20 ou plus récents et un Rust chaîne d'outils donc le natif `iroha_js_host`
le module peut construire. SDK dans le frère Iroha dépôt après changement
sa source; la mise en page du paquet propre ne contient pas l'espace de travail Cargo
nécessaires par `npm run build:native`.

Pour un test contrôlé, appuyez la démo sur une Kaigi- capable Torii point final:

1. Commencez une Iroha nœud avec le SORA/Kaigi Applications APIs activé, ou utiliser une
   point final public qui expose les Kaigi les surfaces dont vous avez besoin.
2. Vérifiez la disponibilité de base avec `/health`, puis vérifiez la surface de l'itinéraire
   avec `/openapi` ou `/openapi.json`. Certains déploiements exposent également
   `/v1/health`, mais `/health` est le contrôle de vie portable.
3. Pour TAIRA, vérifier les itinéraires de télémétrie du relais avant d'essayer une réunion en direct:

   ```bash
   TAIRA=https://taira.sora.org
   curl -fsS "$TAIRA/health"
   curl -fsS "$TAIRA/v1/kaigi/relays"
   curl -fsS "$TAIRA/v1/kaigi/relays/health"
   ```

   Ces vérifications prouvent que Torii et Kaigi Les télémetries sont accessibles.
   ne pas créer une réunion; `CreateKaigi` et `JoinKaigi` encore besoin de financement
   les portefeuilles et la présentation des transactions signées.
4. Ouvrez la démo, allez à **Paramètres**, régler le Torii URL, et laisser l'application se charger
   la chaîne ID et le préfixe de réseau depuis le point final.
5. Créer ou restaurer deux portefeuilles locaux dans la démo. Utilisez des fenêtres d'applications séparées,
   les profils ou les machines afin que l'hôte et l'invité aient un état de portefeuille séparé.

Pour tester le Kaigi UI:

1. Dans la fenêtre d'accueil, ouverte **Kaigi**, choisir **Commencez la réunion**, définir un titre,
   et choisir **Invitation privée** ou **Une invitation transparente**.
2. Sélectionner **Allumez la caméra et le micro** Il est donc WebRTC Il y a des médias locaux.
3. Sélectionner **Créer un lien de réunion**. Un portefeuille en direct soumet `CreateKaigi`; le
   l'application montre alors une `iroha://kaigi/join?call=...&secret=...` l'invitation et une
   `#/kaigi?...` La route de retour.
4. Gardez la fenêtre de l'hôte ouverte et partagez l'invitation avec votre invité.
5. Dans la fenêtre invité, ouvrez l'invitation ou collez-la **Participer à la réunion**, tourner
   sur les médias locaux, et sélectionnez **Participer à la réunion**. Un portefeuille en direct
   l'offre d'hébergement cryptée de Torii et soumet `JoinKaigi` avec chiffré
   Répondre aux métadonnées.
6. L'hôte doit appliquer automatiquement la première réponse par streaming ou sondage Kaigi
   Les deux fenêtres doivent afficher des supports connectés et mis à jour
   détails de connexion.
7. Terminer la session de l'hôte, ou utiliser le CLI `iroha kaigi end` commandement pour
   le même appel ID.

Propriété Kaigi besoins protégés XOR Le paiement des frais d'entrée privée.
démo rapporte que le privé Kaigi besoins protégés XOR, utilisez l' app
l'auto-détection de la mise en œuvre et réessayer la création ou rejoindre l'action.
La démocratie peut être réduite à un
débit transparent/manuel. Dans ce cas, ouvert **Signalisation avancée**, copier le
le paquet d'offre ou de réponse brut, et coller dans l'autre fenêtre.

Pour les contrôles automatisés dans le repo démo, exécuter:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
npm run verify
```

La couverture des suites Vitest Kaigi création de liens de réunion, invitation compacte
chargement, appels privés de création/joint/fin du pont, commandes d'auto-détection, manuel
Les résultats des sondages et les réponses aux enquêtes. UI l'essai de fumée comprend le `/kaigi` Route
Les médias en direct entre deux portefeuilles restent
nécessite un test manuel à deux fenêtres car les autorisations de la caméra/microphone du navigateur
et les flux de médias sont spécifiques à l'environnement.

Pour le code d'intégration de l'échantillon, voir
[Embedded Kaigi dans une JavaScript Application](/fr/guide/tutorials/kaigi.md).

## Statut et indicateurs {#status-and-metrics}

Les points d'extrémité de l'état et des métriques sont les premières choses à intégrer dans les tableaux de bord:

- `/status` expose les champs de partage, de blocage, de file d'attente et de consensus de premier niveau
- `/metrics` expose les compteurs, mesurateurs et histogrammes de Prometheus

À l'intérieur Nexus- les nœuds activés, la sortie d'état inclut également la voie et l'espace de données
Les sections. `nexus.enabled = false`, Ces sections sont omises.

## JSON contre Norito {#json-vs-norito}

Retour de plusieurs points d'extrémité des opérateurs Norito par défaut. Lorsque le point final prend en charge
JSON, envoyer:

```http
Accept: application/json
```

Ceci est particulièrement utile pour:

- `/v1/sumeragi/status`
- `/v1/sumeragi/qc`
- `/v1/sumeragi/commit_qc/{hash}`

Lorsqu'un point final accepte ou retourne Norito directement, utilisation
`application/x-norito` en tant que type de contenu ou préféré `Accept` la valeur. voir
[Norito](/fr/reference/norito.md#torii-and-norito-rpc) pour les détails du transport.

## Profils de télémétrie {#telemetry-profiles}

La visibilité des points d'extrémité dépend des paramètres de télémétrie.
cinq niveaux de profil:

| Le profil | `/status` | `/metrics` | Route des développeurs |
| --- | --- | --- | --- |
| `disabled` | Je ne veux pas | Je ne veux pas | Je ne veux pas |
| `operator` | Oui, oui. | Je ne veux pas | Je ne veux pas |
| `extended` | Oui, oui. | Oui, oui. | Je ne veux pas |
| `developer` | Oui, oui. | Je ne veux pas | Oui, oui. |
| `full` | Oui, oui. | Oui, oui. | Oui, oui. |

## CLI Les raccourcis {#cli-shortcuts}

Les `iroha` CLI déjà enveloppe de nombreux endpoints:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml ops sumeragi params
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

## Références en amont {#upstream-references}

- [README API et vue d'ensemble de l'observabilité](https://github.com/hyperledger-iroha/iroha/blob/main/README.md)
- [ISO 20022 mise en œuvre du pont](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_torii/src/iso20022_bridge.rs)
- [Performance et mesures](/fr/guide/advanced/metrics.md)
