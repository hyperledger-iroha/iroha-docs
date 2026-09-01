---
translation_locale: fr
translation_source: /reference/torii-endpoints.md
translation_source_hash: f04e5e78329996d70926c4fd5dc034d41605d0a82fffd6460f67b252269480d9
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Torii API points de terminaison {#torii-endpoints}

Torii est la passerelle HTTP, SSE et WebSocket pour Iroha 3. Elle sert à la fois les points de terminaison APIs orientés grand livre et les points de terminaison API des opérateurs.

Les règles actuelles du protocole sont :

- le format binaire canonique est Norito
- de nombreux points de terminaison API prennent également en charge JSON lorsque vous envoyez `Accept: application/json`
- les métriques sont exposées au format Prometheus

Pour les détails sur le format, la négociation de contenu, les indicateurs de mise en page, les hachages cryptographiques du schéma et les directives Norito RPC, voir le [Norito référence](/fr/reference/norito.md).

## Points de terminaison courants API {#common-endpoints}

| API point de terminaison                         |Format|But|
| -------------------------------- | -------------- | ---------------------------------------------------------------- |
| `POST /v1/pipeline/transactions` |Norito|Soumettre une transaction signée|
| `POST /v1/query`                 | Norito         |Soumettre une requête signée|
| `GET /v1/events/ws`              | WebSocket      |S'abonner aux flux d'événements|
| `GET /v1/events/sse`             | SSE            |S'abonner aux flux d'événements via SSE|
| `GET /v1/blocks/stream`          | WebSocket      |Flux des blocs engagés|
| `GET /v1/peers`                  | JSON           |liste des pairs réseau exposée par Torii|
| `GET /livez`                     |Texte|Vivacité uniquement du processus ; cela n'implique pas la disponibilité du protocole|
| `GET /readyz`                    | JSON           |Préparation complète du nœud, y compris les vérifications obligatoires de l'argent hors ligne|
| `GET /health`                    | JSON           |Sonde de disponibilité avec le même invariant de trésorerie hors ligne|
| `GET /v1/api/version`            |Texte|Version actuelle de l'en-tête de bloc|
| `GET /status`                    | Norito ou JSON |Statut de diagnostic de haut niveau ; demande JSON explicitement|
| `GET /metrics`                   |Prométhée|Point de terminaison de collecte Prometheus API|
| `GET /v1/schema`                 | JSON           |Vue des données ponctuelles du schéma du modèle de données servie par le nœud lorsqu'elle est activée|
|`GET /openapi.json`| JSON           | OpenAPI document pour les HTTP itinéraires actifs Torii |
| `GET /v1/parameters`             | JSON           |Vue des données à un instant donné du paramètre de nœud|
| `GET /v1/node/capabilities`      | JSON           |Capacité du nœud et métadonnées du modèle de données|
| `GET /v1/time/now`               | JSON           | Instantané de l’horloge système du nœud |
| `GET /v1/time/status`            | JSON           |État de la synchronisation temporelle|

Pour une demande SSE, annoncez le flux natif ainsi qu'une solution de repli typée :

```http
Accept: text/event-stream, application/json
```

Torii négocie d'abord une représentation JSON ou Norito au niveau de la couche de requête, puis valide la réponse native `text/event-stream`. L'envoi uniquement de `text/event-stream` est donc rejeté avec `406` ; le [recette d'événements en continu](/fr/cookbook/stream-events.md) utilise l'en-tête complet.

`/openapi.json` est le contrat généré pour les routes représentées dans le schéma, et non un inventaire complet des probes opérationnels. Le document actuel omet `/livez` et `/readyz`, et sa description `/health` peut être en retard par rapport au gestionnaire de disponibilité. Générez des clients de route à partir du document en direct, mais validez la vivacité et la disponibilité directement contre le nœud en cours d'exécution et les gestionnaires épinglés. La surface exacte dépend encore de la compilation Fonctionnalités et configuration d’exécution du logiciel. Utilisez l’[outil interactif pour l’API Torii](/fr/reference/torii-api-console.md) pour charger ce document en direct, tester les routes JSON, copier les requêtes curl et générer le code client à partir du schéma actuel.

Chaque opération OpenAPI basée sur un catalogue inclut un objet `x-iroha-route-auth`. Les outils MCP basés sur un catalogue exposent le même contrat que `_meta["iroha/routeAuth"]`. Les deux projections comportent `schemaVersion`, `stableRouteId`, `authentication` et `admission`. Traitez la version `1` comme un contrat exact : rejetez un `schemaVersion` non pris en charge au lieu de deviner comment ses étiquettes d'authentification ou d'admission devraient être interprétées. Les métadonnées de la route décrivent la limite de la requête ; elles ne remplacent pas les identifiants requis par cette limite.

## Essayer les itinéraires en direct Taira {#try-live-taira-routes}

Le testnet public Taira expose la même surface Torii JSON que les clients d'application utilisent pour l'exploration en lecture seule. Ces commandes ne nécessitent pas de clés :

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS -H 'Accept: application/json' "$TAIRA_ROOT/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA_ROOT/openapi.json" \
  | jq -r '.paths | keys[]' \
  | grep '^/v1/' \
  | head -n 20

curl -fsS -H 'Accept: application/json' \
  "$TAIRA_ROOT/v1/node/capabilities" \
  | jq '{abi_version, data_model_version, query: .query.aggregate.supported_resources}'
```

Essayez les lectures de ressources par rapport à l'état actuel du monde :

```bash
curl -fsS "$TAIRA_ROOT/v1/domains?limit=5" \
  | jq -r '.items[].id'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=5" \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

Si un itinéraire de testnet public renvoie `502`, expire ou signale une file d'attente saturée, considérez-le comme un problème de disponibilité de point de terminaison API et réessayez plus tard avant de déboguer votre code client.

## Points de terminaison du consensus et de l’environnement d’exécution {#consensus-and-runtime-endpoints}

Chaque itinéraire Sumeragi ci-dessous nécessite la signature de demande de l'opérateur. Les itinéraires de statut, diagnostics, flux, leader, clé, QC et paramètre nécessitent également une version avec télémétrie activée.

| Point de terminaison                                  |Format|But|
| ----------------------------------------- | -------------- | ------------------------------------------------------- |
| `GET /v1/sumeragi/status`                 | Norito ou JSON |Statut de consensus détenu par le réducteur autoritaire|
| `GET /v1/sumeragi/diagnostics`            | JSON           |Diagnostics non autoritatifs du pipeline, de la file d’attente et de la voie d’exécution|
| `GET /v1/sumeragi/status/sse`             | SSE            |Flux continu de statut de consensus autoritaire|
| `GET /v1/sumeragi/leader`                 | JSON           |Informations sur le leader actuel|
| `GET /v1/sumeragi/qc`                     | Norito ou JSON |Instantanés des certificats de quorum le plus élevé et verrouillé|
| `GET /v1/sumeragi/consensus-keys`         | JSON           |Clés de consensus actives|
| `GET /v1/sumeragi/bls-keys`               | JSON           |Clés de consensus actives BLS|
| `GET /v1/sumeragi/params`                 | JSON           | Paramètres actuels en chaîne Sumeragi |
|`GET /v1/sumeragi/evidence`| JSON           |Enregistrements de preuves, éventuellement filtrés par chaîne de requête|
| `GET /v1/sumeragi/evidence/count`         | JSON           |Nombre d'enregistrements de preuves|
| `GET /v1/runtime/abi/active`              | JSON           |Descripteur ABI de l’environnement d’exécution actif|
| `GET /v1/runtime/abi/hash`                | JSON           |Hachage de l’ABI de l’environnement d’exécution actif|
| `GET /v1/runtime/metrics`                 | JSON           |Instantané des métriques de l’environnement d’exécution|
| `GET /v1/runtime/upgrades`                | JSON           |Liste des mises à niveau de l’environnement d’exécution|
|`POST /v1/runtime/upgrades/propose`       | JSON           |Proposer une mise à niveau de l’environnement d’exécution|
| `POST /v1/runtime/upgrades/activate/{id}` | JSON           |Activer une mise à niveau proposée de l’environnement d’exécution|
| `POST /v1/runtime/upgrades/cancel/{id}`   | JSON           |Annuler une mise à niveau proposée de l’environnement d’exécution|

## Application et Familles de Routes SORA {#app-and-sora-route-families}

Lorsqu'Torii est construit avec l'ensemble de fonctionnalités orienté application, il expose des familles JSON supplémentaires pour les explorateurs, les services SORA, les flux de pont, les preuves et le stockage. Ces familles ne sont pas toutes activées sur chaque profil réseau.

`/openapi.json` décrit les routes enregistrées dans le catalogue d'applications généré API ; il est faisant autorité pour les entrées qu'il contient, pas pour chaque route montée par le processus. En particulier, les SoraFS CID locaux publics et les itinéraires bien connus sont montés en dehors de ce document généré et doivent être sondés directement.

|Famille de routes|But|
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `/v1/accounts/*`, `/v1/domains/*`, `/v1/assets/*`                         | JSON lit, aide à la requête, aide à l'intégration, et vues du portefeuille ou du détenteur|
| `/v1/nfts/*`, `/v1/rwas/*`, `/v1/confidential/*`                          |NFT, vue des actifs réels et des actifs confidentiels|
| `/v1/aliases/*`, `/v1/assets/aliases/*`, `/v1/sns/*`, `/v1/identifiers/*` |Résolution de nom, alias et identifiant|
| `/v1/explorer/*`                                                          |Vues orientées explorateur pour compte, actif, bloc, transaction, instruction, métrique et flux|
| `/v1/transactions/*`, `/v1/pipeline/*`, `/v1/iso20022/*`                  |Historique des transactions, récupération ou état du pipeline de traitement, et ISO 20022 assistants|
| `/v1/contracts/*`                                                         |Code de contrat, déployer, regrouper, appeler, voir, événement, activité, rollup et routes d'état|
| `/v1/multisig/*`, `/v1/controls/*`                                        |Propositions multisignatures, approbations et assistants de contrôle de transfert|
| `/v1/bridge/*`, `/v1/ledger/*`, `/v1/proofs/*`                            |Finalité, preuve d'état, preuve de bloc, conservation de la preuve et routes de requête de preuve|
| `/v1/da/*`                                                                |Ingestion de disponibilité des données, manifestes techniques, politiques de preuve, engagements et intentions de fixation|
| `/v1/zk/*`                                                                | ZK racines, vérification de preuve, IVM démonstration, dépouillement des votes, clés de vérification, enregistrements de preuve et pièces jointes |
| `/v1/gov/*`, `/v1/ministry/*`                                             |Propositions de gouvernance, bulletins de vote, état du conseil, espaces de noms protégés, propositions d'ordre du jour, adoption et finalisation|
| `/v1/nexus/*`, `/v1/sccp/*`                                               | Nexus voie d'exécution, espace de données et aides à la preuve inter-chaînes|
| `/v1/musubi/*`                                                            |Musubi lectures du registre de paquets et constructeurs d'instructions|
| `/v1/subscriptions/*`                                                     |Plans d'abonnement, cycle de vie de l'abonnement, utilisation et aides à la facturation|
| `/v1/sorafs/*`, `/sorafs/*`, `/.well-known/sorafs/*`                      | SoraFS découverte de fournisseurs, preuves de capacité, fixation, récupérations de stockage et diffusion de contenu public |
| `/v1/soracloud/*`, `/v1/soradns/*`, `/soradns/*`, `/api/*`                | SoraCloud cycle de vie du service, flux de calcul/modèle privés, découverte publique et routage d'applications hébergées|
| `/v1/connect/*`, `/v1/vpn/*`                                              |Iroha Connecter des sessions, WebSocket transport, VPN sessions, profils et enregistrements de résultats de protocole|
| `/v1/app-api/*`, `/v1/api/*`, `/v1/content/*`                             |Liaisons de l'application API et routage de contenu pris en charge par bundle/CID|
| `/v1/operator/*`, `/v1/mcp`                                               |Authentification de l'opérateur et pont natif MCP JSON-RPC|
| `/v1/offline/*`, `/v1/repo/*`, `/v1/space-directory/*`, `/v1/ram-lfe/*`   |Prêt hors ligne, accords de dépôt, manifestes techniques de l’espace de données, et [RAM-LFE assistants](/fr/blockchain/ram-lfe.md#torii-routes)|
| `/v1/kaigi/*`, `/v1/webhooks/*`, `/v1/notify/*`, `/v1/telemetry/*`        |Intégrations de collaboration, webhook, notification push et télémétrie en direct|

## Authentification du compte, visibilité et curseurs de l'explorateur {#account-authentication-visibility-and-explorer-cursors}

### Protocole de demande de compte d'application {#app-account-request-protocol}

Les routes côté application acceptent soit aucun en-tête d'authentification, soit une preuve directe à clé unique, soit un témoin multisignature. Chaque en-tête d'authentification ne doit apparaître qu'une seule fois au maximum.

Pour une preuve directe, envoyez les quatre en-têtes ensemble :

- `X-Iroha-Account` : l'adresse de compte hexadécimale canonique exacte en minuscules `0x` ou un alias de compte canonique actif ASCII. Le texte I105 n'est pas sûr en tant que valeur de champ HTTP ; utilisez l'orthographe hexadécimale canonique pour ce compte.
- `X-Iroha-Signature` : la charge utile de signature en base64 rembourrée stricte.
- `X-Iroha-Timestamp-Ms` : un horodatage Unix décimal non signé canonique en millisecondes, dans la fenêtre de décalage configurée.
- `X-Iroha-Nonce` : 1 à 256 octets imprimables ASCII (`0x21` à `0x7e`), uniques dans la fenêtre de relecture.

Le contrôleur à touche unique enregistré signe ces octets exacts :

```text
iroha.app.request.network.v1\0 || <genesis-derived network_id[32]> ||
<UPPERCASE_METHOD>\n
<exact request path>\n
<canonical query>\n
<lowercase hex SHA-256 of the raw body>\n
<canonical timestamp_ms>\n
<nonce>
```

La construction de requête canonique analyse la requête brute comme `application/x-www-form-urlencoded` (`+` signifie espace), décode ses paires en pourcentage, les trie par `(key, value)`, et les réencode en formulaire. Le protocole admet au maximum 64 paires décodées et 64 KiB de texte de requête brut. Effectuez un hachage cryptographique des octets du corps exactement tels que transmis. N'insérez pas de séparateur entre l'ID réseau fixe de 32 octets et la méthode en majuscules.

Le vérificateur V1 limite également le jeton de méthode à 32 octets, le chemin de requête encodé en pourcentage à 64 KiB, et une identité de compte directe à 36 KiB avant l'analyse. Les alias de compte ont la limite structurelle plus stricte de trois segments de nom plus leurs séparateurs. Dépasser une limite entraîne l'échec de l'authentification avant la vérification de la signature ou l'allocation de taille source.

Un contrôleur multisignature doit plutôt envoyer `X-Iroha-Witness` en tant que Norito canonique en base64 strictement rembourré et omettre `X-Iroha-Signature`, `X-Iroha-Timestamp-Ms` et `X-Iroha-Nonce`. `X-Iroha-Account` est facultatif sous cette forme ; lorsqu'il est présent, il doit être égal au témoin `subject_account`. Le `CanonicalRequestWitnessV1` contient `schema_version`, `subject_account`, `timestamp_ms`, `nonce`, un Iroha `Hash` des octets de requête du réseau exact via la valeur du résumé cryptographique du corps mais sans champs de fraîcheur, et au maximum 64 signatures de membres. Chaque membre signe l'encodage canonique Norito de cette même charge utile sans le tableau de signatures. Les membres vérifiés doivent satisfaire à la politique multisig actuelle du compte. Le témoin encodé est limité à 1 MiB.

Ne pas fournir d’en-têtes d’authentification sélectionne l’accès anonyme. Fournir une preuve partielle, mixte, répétée, malformée, obsolète ou reproduite échoue à l’authentification ; elle ne retombe jamais sur la visibilité anonyme.

### Protocole de demande d'opérateur {#operator-request-protocol}

Les routes marquées comme authentifiées par l'opérateur nécessitent les quatre en-têtes singleton :

- `x-iroha-operator-public-key` : la clé publique multihash canonique Iroha.
- `x-iroha-operator-timestamp-ms` : le timestamp Unix décimal non signé canonique en millisecondes.
- `x-iroha-operator-nonce` : 1 à 256 octets imprimables ASCII, uniques pour cette clé dans la fenêtre de relecture.
- `x-iroha-operator-signature` : la charge utile de signature en base64 rembourrée stricte.

Les valeurs des en-têtes ne doivent pas contenir d'espaces autour. Les signes de la clé opérateur :

```text
iroha.operator.http-request.network.v1\0 || <genesis-derived network_id[32]> ||
<UPPERCASE_METHOD>\n
<exact request path>\n
<canonical query>\n
<lowercase hex SHA-256 of the raw body>\n
<canonical timestamp_ms>\n
<nonce>
```

Les règles concernant le chemin, la requête, le corps, le timestamp et la valeur nonce cryptographique sont les mêmes règles canoniques utilisées par le protocole de l'application. La clé doit également être admise par `[torii.operator_signatures]` : listez-la dans `allowed_public_keys`, ou activez explicitement `allow_node_key` lors de l'utilisation de la clé du nœud. La saturation du cache de lecture échoue en fermeture avec `503 Service Unavailable`.

La signature exacte de la requête est toujours obligatoire. Lorsque `[torii.operator_auth].enabled = true`, chaque route d'opérateur ordinaire nécessite également un `x-iroha-operator-session` valide ; lorsque `require_mtls = true`, elle nécessite en plus `x-forwarded-client-cert` provenant d'un point d'entrée fiable. Aucun des deux facteurs ne remplace la signature de la requête.

WebAuthn l'inscription et la connexion utilisent ces quatre JSON API points de terminaison :

|Méthode et point de terminaison API|But|
| --------------------------------------------- | ---------------------------------------- |
| `POST /v1/operator/auth/registration/options` |Commencer l'inscription des informations d'identification WebAuthn|
| `POST /v1/operator/auth/registration/verify`  |Vérifier et conserver les identifiants|
| `POST /v1/operator/auth/login/options`        |Commencer l'authentification WebAuthn|
| `POST /v1/operator/auth/login/verify`         |Vérifiez l'affirmation et délivrez une session|

Configurez `torii.operator_auth.tokens` avec des valeurs de bootstrap dédiées. Avant qu'aucun identifiant n'existe, envoyez-en un en tant que `x-iroha-operator-token` pour commencer la première inscription. Ce jeton n'autorise jamais une route d'opérateur ordinaire, et les valeurs de l'écouteur `x-api-token` ne sont jamais réutilisées pour ce processus. Une fois qu'un identifiant existe, l'inscription d'un autre identifiant nécessite une session authentifiée. La vérification de connexion renvoie le jeton de session à envoyer avec chaque nouvelle signature de requête exacte du réseau de l'opérateur. Les identifiants persistent sous `<torii.data_dir>/operator_auth/operator_webauthn.json`.

ISO 20022 routes appliquent deux vérifications indépendantes. La requête doit d'abord passer cette liste blanche d'opérateurs et le protocole de signature ; le gestionnaire ISO exige ensuite que la même clé occupe exactement le rôle de participant ou d'auditeur décrit ci-dessous.

### Visibilité du registre de la blockchain et curseurs de l'explorateur {#ledger-visibility-and-explorer-cursors}

Les lectures du grand livre blockchain côté application utilisent la limite de compte d'application facultative ci-dessus. Une requête non signée reçoit uniquement les espaces de données configurés comme publics. Une requête signée valide ajoute des espaces de données liés au UAID actuel de l'appelant, chaque espace de données restreint étant nommé par une permission exacte `CanReadRestrictedDataspace { dataspace }`, ou toutes les routes lorsque le compte possède `CanReadAllLedgerData`.

Utilisez l'itinéraire qui correspond au principal d'autorisation de l'appelant :

|Méthode et point de terminaison API|Authentification et visibilité|
| ------------------------------------- | --------------------------------------------------------------- |
| `POST /v1/transactions/visible/query` |Signature de compte canonique ; applique la visibilité de l'appelant|
| `POST /v1/transactions/query`         |Signature de la demande de l'opérateur ; permet la vue globale de l'opérateur|
| `GET /v1/triggers/completed`          |Signature de demande de l'opérateur ; lit les enregistrements de complétion locaux au nœud|

Le même objet de visibilité filtre le compte, le domaine, la définition de l'actif, l'actif, NFT, RWA, le titulaire et les lectures de l'Explorateur. Un objet absent et un objet qui se trouve en dehors des routes visibles de l'appelant sont intentionnellement indiscernables. L'historique des transactions commises et des instructions est affiché uniquement lorsque chaque tronçon de trajet enregistré pour la transaction est visible. Une transaction en espace de données mixte est donc caché lorsque même un volet d’un participant est en dehors de la portée de l'appelant ; le contexte de routage manquant, obsolète ou mal formé n'est visible que par un lecteur global.

Les six collections Explorer soutenues par le monde utilisent des curseurs de clé base64url canoniques opaques. La limite de page par défaut est de 25, le maximum est de 100, et une page inspecte au maximum 512 clés candidates. Chaque curseur est lié à sa collection, à ses filtres, à sa dernière clé canonique et à la valeur de hachage cryptographique de l'ensemble de routes visibles de l'appelant, de sorte qu'il ne peut pas être rejoué sur une autre requête ou après que la visibilité de l'appelant ait changé.

Les curseurs d'historique de bloc, transaction, dernière transaction, instruction et dernière instruction verrouillent en outre la hauteur de la vue des données validées à un point dans le temps et le hachage cryptographique du bloc. Les réponses exposent `pagination.limit`, `pagination.snapshot_height`, `pagination.snapshot_hash`, `pagination.next_cursor` et `pagination.has_more`. Un curseur pour un autre itinéraire ou ensemble de filtres, une valeur de résumé cryptographique de visibilité modifiée, ou une vue de données à un instant précis que le nœud ne peut plus valider échoue en mode fermé. L'exploration de l'historique reste à l'intérieur du permis d'admission de requête de Torii pendant que le travailleur bloquant s'exécute.

Les flux Explorer WebSocket émettent des résumés filtrés et recalculent la visibilité à mesure que les permissions du grand livre blockchain changent. La route native `GET /v1/blocks/stream` est différente : il émet des blocs signés complets, nécessite `CanReadAllLedgerData` lors de la poignée de main, et se ferme si cette autorisation est ultérieurement révoquée. N'utilisez pas le flux natif pour un explorateur limité à un espace de données.

## ISO Pont 20022 {#iso-20022-bridge}

Torii expose le pont ISO 20022 sous `/v1/iso20022/*` lorsque l’API applicative et l’environnement d’exécution du pont sont activés. Ce pont est volontairement limité : il ne s’agit pas d’une passerelle de compensation ISO 20022 générique, mais d’un sous-ensemble pris en charge qui convertit certains messages de paiement en transferts Iroha signés et suit leur état dans le registre distribué.

Configurez un `torii.iso_bridge.store_dir` local durable avant d'accepter toute soumission. Le champ de configuration est facultatif uniquement pour qu'un nœud puisse démarrer en lecture seule ou à des fins de diagnostic : chaque soumission authentifiée ISO nécessite le répertoire, et renvoie `503 Service Unavailable` réessayable lorsque la persistance est absente ou qu'un échec de réécriture de replay-tombstone ou de rich-record se produit.

### Torii ISO 20022 API points de terminaison {#torii-iso-20022-endpoints}

|Méthode et point de terminaison API|But|
| -------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `POST /v1/iso20022/pacs008`                  |Soumettez un transfert de crédit client de FI à FI et créez le transfert d'actif Iroha correspondant|
| `POST /v1/iso20022/pacs009`                  |Soumettre un transfert de crédit FI-à-FI utilisé pour PvP ou le financement en espèces lié aux titres|
| `POST /v1/iso20022/pacs002`                  |Soumettre un rapport sur le statut de paiement détenu par la contrepartie ; le règlement nécessite des preuves de transaction engagée|
| `POST /v1/iso20022/pacs004`                  |Soumettre un retour de paiement détenu par la contrepartie|
| `POST /v1/iso20022/camt056`                  |Soumettre une demande d'annulation de paiement détenue par l'initiateur|
| `POST /v1/iso20022/sese023`                  |Soumettre une instruction de règlement de valeurs mobilières|
| `POST /v1/iso20022/sese024`                  |Soumettre un message de statut de règlement de titres détenus par la contrepartie|
| `POST /v1/iso20022/sese025`                  |Soumettre une confirmation de règlement de titres détenus par la contrepartie|
| `POST /v1/iso20022/colr012`                  |Soumettre un message de substitution de garantie|
| `GET /v1/iso20022/messages/{msg_id}`         |Lisez l'enregistrement de pont canonique pour un message|
| `GET /v1/iso20022/audit/messages`            |Lire le manifeste technique d'audit des messages inviolables|
| `GET /v1/iso20022/messages/{msg_id}/pacs002` |Afficher le statut de paiement actuel comme `pacs.002` XML|
| `GET /v1/iso20022/messages/{msg_id}/pacs004` |Rendre le retour de paiement actuel comme `pacs.004` XML|
| `GET /v1/iso20022/messages/{msg_id}/camt029` |Rendre la résolution d'annulation actuelle en tant que `camt.029` XML|
| `GET /v1/iso20022/messages/{msg_id}/sese024` |Afficher le statut actuel du règlement comme `sese.024` XML|
| `GET /v1/iso20022/messages/{msg_id}/sese025` |Afficher la confirmation de règlement actuelle comme `sese.025` XML|

Les soumissions `pacs.008` doivent fournir l'identifiant du message, le montant du règlement interbancaire, la devise, la date de règlement, le débiteur et le créancier IBANs, ainsi que le débiteur et le créancier BICs. Lorsque les données de référence sont configurées, le pont vérifie également les correspondances de devises 4217 BIC, IBAN et ISO avant que la transaction générée n'entre dans le pipeline de traitement.

`pacs.009` les soumissions doivent fournir l'identifiant du message commercial, l'identifiant de définition du message, l'heure de création, le montant du règlement interbancaire, la devise, la date de règlement, l'agent donneur d'instructions et l'agent instruit BICs, et le débiteur et le créancier IBANs. Si le message inclut `Purp`, le pont accepte actuellement uniquement le financement à des fins de titres : `Purp=SECU`.

Les points de terminaison de soumission `pacs.008` et `pacs.009` API acceptent des conteneurs de données XML ISO ou le format de champ plat utilisé par les tests de pont. Les champs facultatifs `SplmtryData` peuvent épingler le grand livre blockchain cible Iroha, les identifiants ou adresses des comptes source et cible, et l'identifiant de définition d'actif. La réponse est `202 Accepted` avec `message_id`, `transaction_hash`, `status`, `pacs002_code`, et le contexte résolu du grand livre/compte/actif.

### Autorisation des participants et gestion du cycle de vie {#participant-authorization-and-lifecycle-ownership}

Chaque passerelle activée possède un catalogue de participants. Chaque entrée de participant a un identifiant de participant unique, une ou plusieurs clés publiques d'opérateur, un ou plusieurs identifiants financiers, un ensemble de profils autorisés, et les rôles `originator`, `counterparty`, ou les deux. Les clés d'opérateur et les identifiants financiers ne peuvent pas appartenir à plusieurs participants. Configurez `audit_admin_keys` séparément ; une clé d'administration d'audit ne peut pas être également une clé de mutation de participant.

Toutes les routes ISO nécessitent une nouvelle signature de l'opérateur. Pour une soumission initiale `pacs.008`, `pacs.009`, `sese.023` ou `colr.012`, l'opérateur authentifié doit appartenir au participant identifié par l'identité financière `From` de l'en-tête de l'application. L'identité `To` doit correspondre à un participant configuré avec le rôle `counterparty`, et le profil sélectionné doit être autorisé pour les deux parties. L'enregistrement durable consigne l'initiateur, la contrepartie, le participant admis et la clé de l'opérateur, ainsi que le profil original et la politique de signature intégrée.

L'autorisation du cycle de vie est dérivée de cet enregistrement immuable plutôt que des valeurs sélectionnées par l'appelant :

|Message de cycle de vie|Participant requis|
| ---------------------------------------------- | -------------------------------------------------- |
| `pacs.002`, `pacs.004`, `sese.024`, `sese.025` |Contrepartie originale avec le rôle `counterparty`|
| `camt.056`                                     |Originateur original avec le rôle `originator`|

Le profil et la politique de signature d'origine restent épinglés pendant tout le cycle de vie, de sorte qu'un appelant ne peut pas choisir un profil plus faible pour une mise à jour. Un code `pacs.002` qui représente le règlement (`ACSC`, `ACCP`, `SETT` ou `SETTLED`) modifie l'enregistrement original pour le marquer comme réglé uniquement lorsque Torii a fourni des preuves de transaction.

Chaque partie originale peut lire son enregistrement de messages et les documents de boîte d’envoi générés. Le point de terminaison d’audit API renvoie uniquement les enregistrements dans lesquels le participant authentifié est l’initiateur ou la partie adverse. Un administrateur d'audit configuré séparément reçoit une vue d'audit globale en lecture seule et ne peut ni soumettre ni modifier des messages. Les participants inconnus et les identifiants de messages non associés ne sont pas divulgués.

### Identité de Relecture Durable et Documents de Boîte d'Envoi Signés {#durable-replay-identity-and-signed-outbox-documents}

Les marqueurs de suppression durable de rejouabilité sont la limite stricte d’admission. Torii interrompt le démarrage en cas de marqueur de suppression durable illisible, surdimensionné, mal formé, mal nommé, en conflit ou explicitement incompatible. Il interrompt également pour un enregistrement riche avec une version de schéma explicitement incompatible, un participant, un profil ou une politique de signature absente de la configuration actuelle, ou un marqueur de suppression durable en direct manquant ou non conforme.

Les autres dommages aux enregistrements riches sont traités différemment : les fichiers illisibles ou trop volumineux, les JSON invalides, les enregistrements du schéma actuel invalides, les noms de fichiers non canoniques et les identités de lecture conflictuelles sont consignés ou ignorés. Un index d'audit de version actuelle illisible ou invalide est régénéré à partir des enregistrements conservés ; seule une version d'index d'audit explicitement incompatible interrompt le démarrage. Surveillez les journaux de démarrage et réconciliez le manifeste technique d'audit régénéré au lieu de supposer que chaque fichier enrichi corrompu empêche le nœud de fonctionner.

Chaque enregistrement riche conservé maintient la provenance immuable des participants. Un marqueur de suppression durable séparé conserve l'ID du message, le hachage cryptographique de la charge utile, l'ID du message commercial et UETR pour la déduplication complète TTL même après que les détails de l'enregistrement riche ont été supprimés.

Torii persiste à rejouer l'admission avant de signer ou de traiter un message du cycle de vie. Il n'évince jamais une identité de replay non expirée. Si la capacité configurée est entièrement occupé par des enregistrements protégés ou des identités de relecture non expirées, les soumissions reçoivent `503 Service Unavailable` réessayable sans modifier l'état du cycle de vie ou de la comptabilité.

Chaque document généré `pacs.002`, `pacs.004`, `camt.029`, `sese.024` ou `sese.025` est renvoyé en tant que `application/xml` avec ces en-têtes de réponse :

|En-tête|Signification|
| ------------------------------ | ----------------------------------------------------- |
| `X-Iroha-Iso-Signature-Domain` |Toujours `iroha.iso20022.outbound.v2`|
| `X-Iroha-Iso-Signer`           |Clé publique canonique pour le signataire cryptographique de pont configuré|
| `X-Iroha-Iso-Signature`        |Signature Base64 sur les XML octets séparés par domaine|

Vérifiez la signature sur la séquence d'octets UTF-8 `iroha.iso20022.outbound.v2`, un octet zéro, et le corps exact de la réponse. Ne reformatez pas et ne normalisez pas le XML avant la vérification.

### Support supplémentaire pour l'analyse et le mappage {#additional-parser-and-mapping-support}

L'assistant IVM ISO valide également et matérialise les familles de messages suivantes pour la validation des conteneurs de données, le mappage de règlement ou la réconciliation en aval. Ils n'ont pas de routes Torii autonomes.

|Message famille|Support actuel|
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `head.001`                         |Validation de l'en-tête de l'application commerciale pour les conteneurs de données ISO, y compris `BizMsgIdr`, `MsgDefIdr`, l'heure de création et les champs optionnels expéditeur/destinataire BIC|
| `pacs.007`, `pacs.028`, `pacs.029` |Annulation de paiement, demande de statut et résolution de l'enquête/analyse du statut|
| `pain.001`, `pain.002`             |Initiation du paiement client et validation du rapport de l'état des paiements|
| `camt.052`, `camt.053`, `camt.054` |Validation du rapport de compte, de l'état et des notifications|

## Sessions de visioconférence Kaigi {#kaigi-sessions}

Kaigi fournit des salles audio/vidéo payantes en temps réel sur SORA Nexus. Utilisez-le lorsqu'une application nécessite la création de sessions avec registre, des modifications de liste de participants, la transmission de manifestes techniques, le signalement chiffré et la mesure de l'utilisation au lieu de conserver tout l'état de conférence hors chaîne.

Le cycle de vie orienté grand livre est :

- `CreateKaigi` : créer un appel sous un domaine et stocker sa politique, son calendrier, ses métadonnées et son manifeste technique de relais optionnel.
- `JoinKaigi` : mettez à jour la liste d'appels. En mode `zk-roster-v1`, la vue publique des appels affiche les nombres d'engagements et de nullificateurs au lieu des identifiants de compte des participants.
- `LeaveKaigi` : supprimer un participant d’un appel transparent. Le départ en mode privé est hors chaîne dans le protocole de première version.
- `RecordKaigiUsage` : ajouter les totaux de la durée mesurée et du coût d'exécution des transactions.
- `EndKaigi` : fermer la session et enregistrer l'horodatage final.

Torii expose les lectures suivantes côté application :

|Route|Authentification|But|
| ----------------------------------- | --------------------------------------- | ------------------------------------------ |
|`/v1/kaigi/calls/{call_id}`|publique|enregistrement d'appel actuel|
| `/v1/kaigi/calls/{call_id}/signals` |demande canonique exacte du compte réseau|métadonnées de signalisation validées et paginées|
| `/v1/kaigi/calls/{call_id}/events`  |demande canonique exacte du compte réseau|flux du cycle de vie des appels|
| `/v1/kaigi/relays`                  |demande d'opérateur sur liste autorisée|résumé du relais|
| `/v1/kaigi/relays/{relay_id}`       |demande d'opérateur sur liste autorisée|l'inscription et les détails de santé d'un relais|
| `/v1/kaigi/relays/health`           |demande d'opérateur sur liste autorisée|santé globale du relais|
| `/v1/kaigi/relays/events`           |demande canonique exacte du compte réseau|flux des événements d’enregistrement et de santé des relais|

L'application API doit être activée. Le résumé du relais et les routes de santé sont des surfaces opérateur même si elles sont en lecture seule ; une demande non signée `curl` est pas une sonde de disponibilité valide. L'état de la session est également reflété à travers les événements de domaine Kaigi tels que `KaigiRosterSummary`, `KaigiRelayManifestUpdated`, `KaigiRelayHealthUpdated` et `KaigiUsageSummary`.

### CLI Test de fumée {#cli-smoke-test}

Commencez par le `iroha app kaigi` CLI lorsque vous voulez vérifier qu'un point de terminaison Torii API accepte les transactions Kaigi avant de connecter un UI. La commande de démarrage rapide crée une salle sur le point de terminaison API configuré et affiche son identifiant d'appel ainsi que ses métadonnées de connexion :

```bash
iroha app kaigi quickstart \
  --domain kaigi.universal \
  --summary-out kaigi-summary.json
```

Pour les flux scénarisés, gérez explicitement le cycle de vie de la salle :

```bash
iroha app kaigi create \
  --domain kaigi.universal \
  --call-name daily \
  --host <i105-account-id> \
  --privacy-mode transparent \
  --room-policy authenticated

iroha app kaigi join \
  --domain kaigi.universal \
  --call-name daily \
  --participant <i105-account-id>

iroha app kaigi leave \
  --domain kaigi.universal \
  --call-name daily \
  --participant <i105-account-id>

iroha app kaigi record-usage \
  --domain kaigi.universal \
  --call-name daily \
  --duration-ms 120000 \
  --billed-gas 1500

iroha app kaigi end --domain kaigi.universal --call-name daily
```

Utilisez `--room-policy public` pour les salles que les relais peuvent exposer sans billets pour les spectateurs, ou `--room-policy authenticated` lorsque les sorties doivent nécessiter l'authentification des spectateurs. Utilisez `--privacy-mode zk-roster-v1` uniquement après le le réseau a la liste Kaigi et les clés de vérification d'utilisation configurées ; sinon, les adhésions, les départs et les enregistrements d'utilisation privés échouent lors de la vérification déterministe.

### JavaScript Intégration {#javascript-integration}

La [démo JavaScript d’Iroha](https://github.com/soramitsu/iroha-demo-javascript) actuelle met en œuvre un profil de réunion individuelle transparent et authentifié. Elle n’expose pas le flux de preuve `zk-roster-v1` du protocole. Son moteur de rendu crée des offres et des réponses WebRTC, tandis qu’un pont privilégié utilise le checkout local [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js) pour obtenir une cotation, signer, soumettre et attendre la finalisation des transactions Kaigi.

Voir [Intégrer Kaigi dans une application JavaScript](/fr/guide/tutorials/kaigi.md) pour l'authentification exacte de l'itinéraire, le format d'invitation, la limite du pont et les commandes actuelles de test de démonstration.

## Statut et métriques {#status-and-metrics}

Les points de terminaison de statut et de métriques API sont les premiers à intégrer dans les tableaux de bord :

- `/status` expose les champs de réseau de niveau supérieur, de bloc, de file d'attente et de consensus
- `/metrics` expose des compteurs, des jauges et des histogrammes Prometheus

Sur les nœuds activés Nexus, la sortie de l'état inclut également des sections conscientes de la voie d'exécution et de l'espace de données. Lorsque `nexus.enabled = false`, ces sections sont omises.

## JSON contre Norito {#json-vs-norito}

Plusieurs points de terminaison de l'opérateur API renvoient Norito par défaut. Lorsque le point de terminaison API prend en charge JSON, envoyez :

```http
Accept: application/json
```

Ceci est particulièrement utile pour :

- `/v1/sumeragi/status`
- `/v1/sumeragi/qc`

Lorsque un point de terminaison API accepte ou renvoie directement des Norito typés, utilisez `application/x-norito` comme type de contenu ou valeur `Accept` préférée. Voir [Norito](/fr/reference/norito.md#torii-and-norito-rpc) pour les détails du transport.

## Profils de télémétrie {#telemetry-profiles}

API La visibilité du point de terminaison dépend du paramètre `telemetry.profile` du nœud. La configuration actuelle expose cinq niveaux de profil :

|Profil| `/status` | `/metrics` |Itinéraires de développeur|
| ----------- | --------- | ---------- | ---------------- |
| `disabled`  |non|non|non|
| `operator`  |oui|non|non|
| `extended`  |oui|oui|non|
| `developer` |oui|non|oui|
| `full`      |oui|oui|oui|

## CLI Raccourcis {#cli-shortcuts}

Le `iroha` CLI enveloppe déjà beaucoup de ces points de terminaison API :

```bash
export IROHA_OPERATOR_KEY_FILE=/run/secrets/iroha/operator.key

iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi diagnostics
iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  ops sumeragi params
iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi evidence count
```

## Références en amont {#upstream-references}

- [README API et aperçu de l'observabilité](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/README.md)
- [ISO mise en œuvre du pont 20022](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/iso20022_bridge.rs)
- [Performance et métriques](/fr/guide/advanced/metrics.md)
