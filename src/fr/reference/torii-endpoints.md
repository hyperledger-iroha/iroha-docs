---
translation_locale: fr
translation_source: /reference/torii-endpoints.md
translation_source_hash: 995701cfca9594b88a0da73a5b582c75c5962449a9ccf150e65738d3656d4f02
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Torii Points de référence {#torii-endpoints}

Torii est la passerelle HTTP, SSE et WebSocket pour Iroha 3. Elle sert à la fois les points d'extrémité de l'opérateur face au registre APIs et celui du gestionnaire.

Les règles actuelles du protocole sont les suivantes:

- Le format binaire canonique est Norito
- de nombreux endpoints prennent également en charge JSON lorsque vous envoyez `Accept: application/json`
- Les mesures sont exposées au format Prometheus.

Pour des détails sur le format, la négociation du contenu, les drapeaux de mise en page, les hachages de schéma et les lignes directrices Norito RPC, voir la référence [Norito](/fr/reference/norito.md).

## Les points de fin communs {#common-endpoints}

|Le point final |Le format |Objectif |
| ------------------------------------- | -------------- | ---------------------------------------------------------------- |
|`POST /v1/pipeline/transactions` |Norito |Soumettre une transaction signée |
|`POST /v1/query` |Norito |Soumettre une requête signée |
|`GET /v1/events/ws` |WebSocket |Abonnez-vous aux flux d' événements |
|`GET /v1/events/sse` |SSE |Abonnez-vous à des flux d'événements sur SSE |
|`GET /v1/blocks/stream` |WebSocket |Flux de blocs engagés |
|`GET /v1/peers` |JSON |Liste des pairs exposés par Torii |
|`GET /livez` |Le texte |La viabilité des processus seulement; elle n' implique pas la préparation au protocole |
|`GET /readyz` |JSON |La préparation complète des nœuds, y compris les contrôles obligatoires en espèces hors ligne |
|`GET /health` |JSON |Sondage de préparation avec la même invariante en espèces hors ligne |
|`GET /v1/api/version` |Le texte |La version actuelle de l' en-tête de bloc|
|`GET /status` |Norito ou JSON |Statut de diagnostic à haut niveau; demande explicite JSON |
|`GET /metrics` |Prométhée |L' endpoint de grattage Prometheus |
|`GET /v1/schema` |JSON |Une capture instantanée du schéma de modèle de données servi par le nœud lorsque activé |
|`GET /openapi` ou `GET /openapi.json` |JSON |document OpenAPI pour les lignes actives Torii HTTP |
|`GET /v1/parameters` |JSON |Résumé des paramètres du nœud |
|`GET /v1/node/capabilities` |JSON |Capacité des nœuds et métadonnées du modèle de données |
|`GET /v1/time/now` |JSON |Capture instantanée de l' horloge du nœud|
|`GET /v1/time/status` |JSON |Statut de synchronisation du temps |

Pour une demande SSE, annoncez le flux natif plus un retrait de type:

```http
Accept: text/event-stream, application/json
```

Torii d'abord négocie une JSON ou Norito la représentation à la couche de demande, puis valide le natif `text/event-stream` Réponse. Envoi uniquement `text/event-stream` est donc rejetée par: `406`; le [recette d'événements en continu](/fr/cookbook/stream-events.md) Il utilise l'en-tête complet.

`/openapi` est le contrat principal généré pour les itinéraires représentés dans le schéma, Le document actuel omet l'inventaire des sondes opérationnelles. `/livez` et `/readyz`, et de ses `/health` la description peut être retardé le gestionnaire de préparation. Générer des clients de route à partir du document en direct, mais valider la vitalité et la préparation directement contre le nœud en cours d'exécution et les manipulateurs fixés. La surface exacte dépend toujours des fonctionnalités de construction et de la configuration du temps d'exécution. [Torii API console](/fr/reference/torii-api-console.md) pour charger ce document en direct, test JSON Route, copie curl les requêtes, et générer le code client à partir du schéma actuel.

## Essayez les itinéraires en direct Taira {#try-live-taira-routes}

Le réseau de test public Taira expose la même surface Torii JSON que les clients d'application utilisent pour l'exploration en lecture seulement.

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

Essayez de lire les ressources contre l'état actuel du monde:

```bash
curl -fsS "$TAIRA_ROOT/v1/domains?limit=5" \
  | jq -r '.items[].id'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=5" \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

Si un itinéraire de testnet public renvoie `502`, s'éteint ou rapporte une file d'attente saturée, traitez-le comme un problème de disponibilité des terminaux et réessayez plus tard avant de déboguer votre code client.

## Consensus et points d'arrêt du temps de fonctionnement {#consensus-and-runtime-endpoints}

|Le point final |Le format |Le but |
| --- | --- | --- |
|`GET /v1/sumeragi/commit-certificates` |JSON |Résumés récents des certificats d' engagement |
|`GET /v1/sumeragi/validator-sets` |JSON |L' historique de réglage du validateur |
|`GET /v1/sumeragi/validator-sets/{height}` |JSON |Le validateur est réglé à une hauteur de bloc |
|`GET /v1/sumeragi/status` |Norito ou JSON |Résumé détaillé de l' état du consensus |
|`GET /v1/sumeragi/status/sse` |SSE |flux continu d' état de consensus |
|`GET /v1/sumeragi/leader` |JSON |Informations actuelles sur les dirigeants |
|`GET /v1/sumeragi/qc` |Norito ou JSON |Le dernier résumé du certificat de quorum |
|`GET /v1/sumeragi/checkpoints` |JSON |Résumé des points de contrôle du consensus |
|`GET /v1/sumeragi/consensus-keys` |JSON |Les clés de consensus actives |
|`GET /v1/sumeragi/bls_keys` |JSON |Les clés de consensus actives BLS |
|`GET /v1/sumeragi/phases` |JSON |Le dernier échantillon de latence par phase |
|`GET /v1/sumeragi/rbc` |JSON |RBC métriques de la session et du débit |
|`GET /v1/sumeragi/rbc/sessions` |JSON |Une capture d'écran de session active RBC |
|`GET /v1/sumeragi/pacemaker` |JSON |L' état du pacemaker |
|`GET /v1/sumeragi/params` |JSON |Paramètres de courant en chaîne Sumeragi |
|`GET /v1/sumeragi/collectors` |JSON |Résumé du plan collecteur déterministe |
|`GET /v1/sumeragi/key-lifecycle` |JSON |Statut du cycle de vie clé de consensus |
|`GET /v1/sumeragi/telemetry` |JSON |Télémétrie instantanée de consensus |
|`GET /v1/sumeragi/evidence` |JSON |Enregistrement des preuves, optionnellement filtré par chaîne de requête |
|`GET /v1/sumeragi/evidence/count` |JSON |Le nombre des preuves .|
|`POST /v1/sumeragi/evidence/submit` |JSON |Soumettre des preuves de consensus |
|`GET /v1/sumeragi/commit_qc/{hash}` |Norito ou JSON |Commit QC enregistrement pour un hash de bloc |
|`GET /v1/runtime/abi/active` |JSON |Décrivain de temps d'exécution actif ABI |
|`GET /v1/runtime/abi/hash` |JSON |Hachage de l'exécution active ABI |
|`GET /v1/runtime/metrics` |JSON |Résumé des métriques d' exécution |
|`GET /v1/runtime/upgrades` |JSON |Liste des mises à jour en cours d' exécution |
|`POST /v1/runtime/upgrades/propose` |JSON |Proposer une mise à niveau de l' heure d' exécution |
|`POST /v1/runtime/upgrades/activate/{id}` |JSON |L' activation d' une mise à niveau de temps d' exécution proposée |
|`POST /v1/runtime/upgrades/cancel/{id}` |JSON |Annuler une mise à niveau de l' heure d' exécution proposée |

## App et SORA Familles de route {#app-and-sora-route-families}

Lorsque Torii est construit avec le jeu de fonctionnalités face à l'application, il expose des familles supplémentaires JSON pour les explorateurs, SORA services, débit de ponts, preuves et stockage. Ces familles ne sont pas toutes activées sur chaque profil réseau.

`/openapi` décrit les itinéraires enregistrés dans le catalogue de l'app-API généré; il est autoritaire pour les entrées qu'il contient, et non pas pour chaque route montée En particulier, les routes locales publiques SoraFS CID et bien connues sont montées à l'extérieur du document généré et doivent être examinées directement.

|La famille des routes |Objectif |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
|`/v1/accounts/`, `/v1/domains/`, `/v1/assets/*` |JSON les lecteurs, les aides à la requête, les aides d'intégration et les vues du portefeuille ou du titulaire |
|`/v1/nfts/`, `/v1/rwas/`, `/v1/confidential/*` |NFT, actifs du monde réel et vues confidentielles d'actifs |
|`/v1/aliases/`, `/v1/assets/aliases/`, `/v1/sns/`, `/v1/identifiers/` |Nom, prénom et résolution de l'identifiant |
|`/v1/explorer/*` |Compte, actif, bloc, transaction, instruction, métriques et flux orientés vers l'explorateur |
|`/v1/transactions/`, `/v1/pipeline/`, `/v1/iso20022/*` |L'historique des transactions, le rétablissement ou l'état du pipeline et les aides ISO 20022 |
|`/v1/contracts/*` |Code de contrat, déploiement, paquet, appel, affichage, événement, activité, mise en œuvre et routes d'état |
| `/v1/multisig/`, `/v1/controls/`                                        |Propositions, approbations et aides à la gestion des transferts |
|`/v1/bridge/`, `/v1/ledger/`, `/v1/proofs/*` |Finalité, preuve d'état, preuve de blocage, retenue des preuves et routes de requête des preuves |
|`/v1/da/*` |Intégration de la disponibilité des données, manifestes, politiques de preuve, engagements et intentions précises |
|`/v1/zk/*` |ZK racines, vérification des preuves, vérification de IVM, dénombrement des voix, clés de vérification, dossiers et pièces jointes |
| `/v1/gov/`, `/v1/ministry/`                                             |Propositions de gouvernance, bulletins de vote, état des conseils, espaces protégés, propositions d'ordre du jour, promulgation et finalisation |
| `/v1/nexus/`, `/v1/sccp/`                                               |Nexus la voie, l'espace de données, et les aides à l'épreuve croisée chaîne |
|`/v1/musubi/*` |Musubi lecteurs de registre des paquets et constructeurs d'instructions |
|`/v1/subscriptions/*` |Les plans d'abonnement, le cycle de vie des abonnements, l'utilisation et les aides à la charge |
|`/v1/sorafs/`, `/sorafs/`, `/.well-known/sorafs/*` |SoraFS Découverte du fournisseur, preuve de capacité, pinning, récupération de stockage et service public de contenu |
|`/v1/soracloud/`, `/v1/soradns/`, `/soradns/`, `/api/` |SoraCloud cycle de vie des services, flux informatiques / modèles privés, découverte publique et routage d'applications hébergées |
| `/v1/connect/`, `/v1/vpn/`                                              |Iroha Connecter les séances, WebSocket le transport, VPN les sessions, les profils et les reçus |
|`/v1/app-api/`, `/v1/api/`, `/v1/content/*` |App API liaisons et bundle/routage de contenu soutenu par CID |
| `/v1/operator/*`, `/v1/mcp`                                               |L'authentification de l'opérateur et le pont natif MCP JSON-RPC|
|`/v1/offline/`, `/v1/repo/`, `/v1/space-directory/`, `/v1/ram-lfe/` |Préparation en ligne, accords de référentiel, manifestes d'espace de données et aides [RAM-LFE ](/fr/blockchain/ram-lfe.md#torii-routes)  |
|`/v1/kaigi/`, `/v1/webhooks/`, `/v1/notify/`, `/v1/telemetry/` |Collaboration, connexion web, notifications push et intégration en direct de télémétrie |

## L'authentification des comptes, la visibilité et les cursors de l'explorateur {#account-authentication-visibility-and-explorer-cursors}

### Protocole de demande de compte dans l'application {#app-account-request-protocol}

Les itinéraires face à l'application n'acceptent pas d'en-tête d'authentification, une preuve directe de clé unique ou un témoin multisig. Chaque en-tête d'authentification doit apparaître au plus une fois.

Pour une preuve directe, envoyez les quatre en-têtes ensemble:

- `X-Iroha-Account`: le hex de l'adresse du compte en minuscules canoniques exactes `0x` ou un alias du compte canonique actif ASCII. Le texte I105 n'est pas sécurisé en tant que valeur du champ HTTP; utilisez l'orthographe canonique en hex pour ce compte.
- `X-Iroha-Signature`: la charge utile strictement rembourrée de base 64 signature.
- `X-Iroha-Timestamp-Ms`: un timestamp décimal Unix non signé canonique en millisecondes, dans la fenêtre de biais configurée.
- `X-Iroha-Nonce`: de 1 à 256 octets imprimables ASCII (`0x21` à `0x7e`), uniques dans la fenêtre de lecture.

Le contrôleur à clé unique enregistré signe ces octets exacts:

```text
iroha.app.request.network.v1\0 || <genesis-derived network_id[32]> ||
<UPPERCASE_METHOD>\n
<exact request path>\n
<canonical query>\n
<lowercase hex SHA-256 of the raw body>\n
<canonical timestamp_ms>\n
<nonce>
```

La construction de requête canonique analyse la requête brute comme: `application/x-www-form-urlencoded` (`+` signifie espace), le pourcentage décode ses paires, les tries par `(key, value)`, Le protocole admet au plus 64 paires décodées et 64 paires KiB de texte brut de requête. Hash le corps octets exactement comme transmis. N'insérez pas un séparateur entre le réseau fixe de 32 octets ID et la méthode en majuscules.

Le vérificateur V1 limite également le jeton méthode à 32 octets, le chemin de demande codé en pourcentage à 64 KiB, et une identification directe du compte à 36 KiB avant analyse. Les pseudonymes de compte ont la limite structurelle plus stricte de trois segments de noms plus leurs séparateurs. Le dépassement d'une limite ne permet pas l'authentification avant la vérification des signatures ou l'attribution de la taille source.

Un contrôleur multisigne doit envoyer `X-Iroha-Witness` en tant que base 64 canonique strictement rembourrée Norito et omettre `X-Iroha-Signature`, `X-Iroha-Timestamp-Ms`, et `X-Iroha-Nonce`. `X-Iroha-Account` est facultatif sous cette forme; lorsqu'il y a lieu, il doit être égal au témoin `subject_account`. Les États membres `CanonicalRequestWitnessV1` contient `schema_version`, `subject_account`, `timestamp_ms`, `nonce`, une Iroha `Hash` de la requête de réseau exacte octets à travers le corps digeste mais sans Les signatures des membres sont au plus 64 et chaque membre signe la lettre canonique. Norito Le code de la même charge utile sans le tableau des signatures. Le témoin codé est plafonné à 1 MiB.

Ne pas fournir d'en-têtes d'authentification sélectionne un accès anonyme. La fourniture de preuves partielles, mixtes, répétées, malformées, périmées ou reproduites échoue à l'authentisation; elle ne revient jamais à la visibilité anonyme.

### Protocole de demande de l'exploitant {#operator-request-protocol}

Les itinéraires marqués comme étant authentifiés par l'opérateur nécessitent les quatre en-têtes singleton:

- `x-iroha-operator-public-key`: la clé publique multihash canonique Iroha.
- `x-iroha-operator-timestamp-ms`: le timestamp Unix décimal non signé canonique en millisecondes.
- `x-iroha-operator-nonce`: de 1 à 256 octets imprimables ASCII, uniques pour cette clé dans la fenêtre de lecture.
- `x-iroha-operator-signature`: la charge utile strictement rembourrée de base 64 signature.

Les valeurs d'en-tête ne doivent pas contenir l'espace blanc qui les entoure.

```text
iroha.operator.http-request.network.v1\0 || <genesis-derived network_id[32]> ||
<UPPERCASE_METHOD>\n
<exact request path>\n
<canonical query>\n
<lowercase hex SHA-256 of the raw body>\n
<canonical timestamp_ms>\n
<nonce>
```

Le chemin, la requête, le corps, le timestamp et les règles nonce sont les mêmes règles canoniques utilisées par le protocole d'application. La clé doit également être admise par `[torii.operator_signatures]`: l'enregistrer dans `allowed_public_keys` ou activer explicitement `allow_node_key` lors de l'utilisation de la clé de nœud. Lorsque le cache de répétition est saturé, Torii rejette la demande avec `503 Service Unavailable`. L'authentification optionnelle WebAuthn ou l'opérateur mTLS est un facteur supplémentaire et ne remplace jamais cette signature exacte de la demande.

Les routes ISO 20022 appliquent deux contrôles indépendants. La demande doit d'abord passer par ce protocole d'autorisation et de signature des opérateurs; le gestionnaire ISO requiert ensuite la même clé pour occuper le rôle exact de participant ou d'audit décrit ci-dessous:

### La visibilité du registre et les curseurs de l'explorateur {#ledger-visibility-and-explorer-cursors}

Les lectures de livre face à l'application utilisent la limite optionnelle du compte d'application ci-dessus. Une demande non signée ne reçoit que des espaces de données configurés comme publics. les espaces de données liés au courant UAID de l'appelant, chaque espace de données restreint nommé par une autorisation exacte `CanReadRestrictedDataspace { dataspace }`, ou toutes les routes lorsque le compte dispose de `CanReadAllLedgerData`.

Le même objet de visibilité filtre le compte, le domaine, la définition d'actif, l'actif NFT, RWA, le détenteur et l'explorateur. L'historique des transactions engagées et des instructions n'est affiché que lorsque chaque étape du parcours enregistrée pour la transaction est visible. par conséquent caché lorsqu'une seule jambe du participant est hors de la portée de l'appelant; le contexte de routage manquant, obsolète ou malformé n'est visible que pour un lecteur mondial.

Les six collections Explorer prises en charge dans le monde entier utilisent des curseurs de base64url non transparents. La limite par défaut de la page est 25, le maximum est 100, et une page inspecte au plus 512 touches candidates. Chaque curseur est lié à sa collection, aux filtres, à la dernière clé canonique et au digeste de route visible de l'appelant, de sorte qu'il ne peut pas être reproduit sur une autre requête ou après que la visibilité de l'auteur a changé.

Bloc, transaction, dernière transaction, instruction et historique de la dernière instruction les curseurs fixent également la hauteur de l'instantané engagée et bloquent le hash. Les réponses exposent `pagination.limit`, `pagination.snapshot_height`, `pagination.snapshot_hash`, `pagination.next_cursor`, et `pagination.has_more`. Torii rejette un curseur pour une autre trajectoire ou un ensemble de filtres, un digeste de visibilité modifié; ou une capture d'écran que le nœud ne peut plus valider. Torii Le permis d'admission de la requête pendant que le travailleur bloquant s'enfuit.

L'explorateur WebSocket les flux émettent des résumés filtrés et recommencent à calculer la visibilité lorsque les autorisations du registre changent. `GET /v1/blocks/stream` L'itinéraire est différent: il émet des blocs entièrement signés, `CanReadAllLedgerData` pendant la poignée de main, et ferme si cette autorisation est révoquée plus tard. N'utilisez pas le flux natif pour un explorateur de l'espace de données.

## ISO pont 20022 {#iso-20022-bridge}

Torii dévoile les ISO 20022 pont sous `/v1/iso20022/*` lorsque l'application est tournée vers API Le pont est délibérément ciblé: il ne s'agit pas d'un objet général. ISO 20022 passerelle de compensation, mais un sous-ensemble pris en charge pour transformer des messages de paiement sélectionnés en signatures Iroha les transferts et pour le suivi de leur statut dans le registre.

Configurer un local durable `torii.iso_bridge.store_dir` avant d'admettre toute soumission. Le champ de configuration est facultatif uniquement afin qu'un nœud puisse démarrer pour une utilisation en lecture seulement ou pour le diagnostic: chaque soumission authentifiée ISO requiert le répertoire, et renvoie la réessayable `503 Service Unavailable` lorsque la persistance est absente ou qu'une pierre tombale de replay ou une écriture rich-record échouent.

### Torii ISO 20022 Points d'arrêt {#torii-iso-20022-endpoints}

|Méthode et point final |Le but |
| --- | --- |
|`POST /v1/iso20022/pacs008` |soumettre un transfert de crédit client FI à FI et effectuer le transfert d'actifs correspondant Iroha |
|`POST /v1/iso20022/pacs009` |Soumettre un transfert de crédit FI vers FI utilisé pour PvP ou des fonds en espèces liés à des valeurs mobilières |
|`POST /v1/iso20022/pacs002` |Soumettre un rapport d' état de paiement appartenant à la contrepartie; les besoins de règlement comprennent des éléments de preuve de transaction engagée |
|`POST /v1/iso20022/pacs004` |Soumettre une déclaration de paiement détenue par la contrepartie |
|`POST /v1/iso20022/camt056` |Soumettre une demande d' annulation de paiement déposée par l' initiateur |
|`POST /v1/iso20022/sese023` |Soumettre une instruction de règlement des titres |
|`POST /v1/iso20022/sese024` |Soumettre un message d' état de règlement des titres détenus par la contrepartie |
|`POST /v1/iso20022/sese025` |Soumettre une confirmation de règlement des titres détenus par la contrepartie |
|`POST /v1/iso20022/colr012` |Envoyer un message de remplacement des garanties |
|`GET /v1/iso20022/messages/{msg_id}` |Lisez le record canonique du pont pour un message |
|`GET /v1/iso20022/audit/messages` |Lisez le manifeste de vérification des messages falsifiés .|
|`GET /v1/iso20022/messages/{msg_id}/pacs002` |Retourner l'état actuel du paiement en `pacs.002` XML |
|`GET /v1/iso20022/messages/{msg_id}/pacs004` |Retourner la déclaration de paiement en cours comme `pacs.004` XML |
|`GET /v1/iso20022/messages/{msg_id}/camt029` |Retourner la résolution d'annulation actuelle comme `camt.029` XML |
|`GET /v1/iso20022/messages/{msg_id}/sese024` |Rendre l'état actuel du règlement `sese.024` XML |
|`GET /v1/iso20022/messages/{msg_id}/sese025` |Retourner la confirmation du règlement en cours comme `sese.025` XML |

Les déclarations `pacs.008` doivent contenir le message ID, le montant du règlement interbancaire, la devise, la date de règlement, le débiteur et le créancier IBANs, et le débiteurs et le créant BICs. Lorsque les données de référence sont configurées, le pont vérifie également les intersections de devises BIC, IBAN et ISO 4217 avant que la transaction générée n'entre dans l'oléoduc.

Les déclarations `pacs.009` doivent contenir le message d'affaires ID, la définition du message ID, l'heure de création, le montant du règlement interbancaire, la devise, la date du règlement; l'agent chargé BICs, le débiteur et le créancier IBANs. Si le message comprend `Purp`, le pont n'accepte actuellement que des fonds destinés aux valeurs mobilières: `Purp=SECU`.

Les points finaux de soumission `pacs.008` et `pacs.009` acceptent les enveloppes XML ISO ou le format de champ plat utilisé dans les essais de pont. Les champs optionnels `SplmtryData` peuvent saisir le registre cible Iroha compte source et cible IDs ou adresses, ainsi que la définition d'actif ID. La réponse est `202 Accepted` avec `message_id`, `transaction_hash`, `status`, `pacs002_code` et le contexte de registre/compte/actif résolu.

### Autorisation et propriété du cycle de vie des participants {#participant-authorization-and-lifecycle-ownership}

Chaque entrée de participant a un participant unique ID, une ou plusieurs clés publiques de l'opérateur, un ou plusieurs identifiants financiers, un ensemble de profils autorisés et le `originator`, `counterparty`, ou les deux rôles. Les clés de l'opérateur et les identifiants financiers ne peuvent appartenir à plus d'un participant. Configurer séparément `audit_admin_keys`; une clé d'administration d'audit ne peut pas non plus être une clé de mutation des participants.

Toutes les routes ISO nécessitent une nouvelle signature de l'opérateur. Pour un dépôt initial `pacs.008`, `pacs.009`, `sese.023` ou `colr.012`, l'opéraire authentifié doit appartenir au participant identifié par l'identité financière de l'en-tête de la demande `From`. L'identité `To` doit se résoudre à un participant configuré avec le rôle de `counterparty` et le profil sélectionné doit être autorisé pour les deux parties. L'entrée durable enregistre l'auteur, la contrepartie, le participant admissible et la clé de l'opérateur, ainsi que le profil d'origine et la politique de signature embarquée.

L'autorisation du cycle de vie est dérivée de cet enregistrement immuable plutôt que des valeurs sélectionnées par l'appelant:

|Le message du cycle de vie |Participant requis |
| ---------------------------------------------- | -------------------------------------------------- |
|`pacs.002`, `pacs.004`, `sese.024`, `sese.025` |contrepartie originale avec le rôle de `counterparty` |
|`camt.056` |L'auteur original avec le rôle `originator` |

Le profil et la politique de signature originaux restent fichés pour l'ensemble le cycle de vie, donc un appelant ne peut pas sélectionner un profil plus faible pour une mise à jour. `pacs.002` code qui représente le règlement (`ACSC`, `ACCP`, `SETT`, ou `SETTLED`) modifie le registre d'origine à réglé uniquement lorsque Torii a engagé une preuve de transaction.

L'un ou l'autre des parties originales peut lire son enregistrement de message et les documents générés dans la boîte de réception. Le point final d'audit ne renvoie que les enregistrements dans lesquels le participant authentifié est l'auteur ou la contrepartie. Un administrateur de vérification configuré séparément reçoit une vue globale d'audit en lecture seule et ne peut pas soumettre ou modifier des messages. Les participants inconnus et les identifiants de messages non liés ne sont pas communiqués.

### Identification de lecture durable et documents de boîte de réception signés {#durable-replay-identity-and-signed-outbox-documents}

Torii aborte le démarrage d'une pierre tombale illisible, surdimensionnée, malformée, mal nommée, contradictoire ou explicitement incompatible. Il aborde également un enregistrement riche avec une version explicitement incompatible du schéma, un participant, un profil ou une politique de signature absents de la configuration actuelle, ou une pierre tombale en direct manquante ou inégalée.

D'autres dommages aux archives riches sont traités différemment: des fichiers illisibles ou surdimensionnés, JSON invalide, des enregistrements de schéma d'actualité invalides, des noms de fichiers non canoniques et des identités de lecture contradictoires sont enregistrés ou omis. Un indice d'audit de version courante illégable ou non valide est régénéré à partir des dossiers conservés; seule une version explicitement incompatible de l'indice d' audit aborte le démarrage. Surveiller les journaux de démarrage et concilier le manifeste d'audit régénéré au lieu de supposer que chaque fichier rich-record corrompu empêche le nœud de servir.

Chaque enregistrement riche conservé maintient l'origine du participant immuable. Une pierre tombale durable séparée maintient le message ID, le hash de charge utile, le message d'affaires ID et UETR pour la déduplication complète TTL même après que les détails du record riche ont été taillés.

Torii persiste l'admission de répétition avant qu'elle ne signe ou ne traite un message du cycle de vie. est entièrement occupée par des enregistrements protégés ou des identités de répétition non expirées, les soumissions reçoivent `503 Service Unavailable` rétractable sans mutation du cycle de vie ni de l'état comptable.

Chaque document généré `pacs.002`, `pacs.004`, `camt.029`, `sese.024` ou `sese.025` est retourné sous la forme de `application/xml` avec les en-têtes de réponse suivants:

|En-tête|Le sens .|
| ------------------------------ | ----------------------------------------------------- |
|`X-Iroha-Iso-Signature-Domain` |Toujours `iroha.iso20022.outbound.v2` |
|`X-Iroha-Iso-Signer` |La clé publique canonique pour le signataire de pont configuré |
|`X-Iroha-Iso-Signature` |La signature de base 64 sur les octets XML séparés par domaine |

Vérifiez la signature sur la séquence UTF-8 en octets `iroha.iso20022.outbound.v2`, un octet zéro et le corps de réponse exact. Ne reformattez pas ou ne normalisez pas le XML avant vérification.

### Appui supplémentaire aux analyses et cartographies {#additional-parser-and-mapping-support}

L'assistant IVM ISO valide et matérialise également les familles de messages suivantes pour la validation des enveloppes, la cartographie des établissements ou la reconciliation en aval. Ils n'ont pas de routes autonomes Torii.

|La famille des messages |Soutien actuel |
| --- | --- |
|`head.001` | Validation de l'en-tête des demandes d'entreprise pour ISO enveloppes, y compris `BizMsgIdr`, `MsgDefIdr`, le temps de création et l'expéditeur/récepteur optionnel BIC champs |
|`pacs.007`, `pacs.028`, `pacs.029` |Reversation du paiement, demande d'état et résolution/analyse de l'état de l'enquête |
| `pain.001`, `pain.002` |Initiation du paiement par le client et validation du rapport d' état de paiement |
|`camt.052`, `camt.053`, `camt.054` |Rapport de compte, relevé et validation des notifications |

## Kaigi Sessions {#kaigi-sessions}

Kaigi fournit des salles audio/vidéo payantes en temps réel sur SORA Nexus. Utilisez-le lorsqu'une application a besoin de la création de sessions protégées par un registre, de changements de liste, de manifestes de relais, de signalisation cryptée et de mesure de l'utilisation au lieu de garder toutes les conférences hors chaîne.

Le cycle de vie en fonction du registre est le suivant:

- `CreateKaigi`: créer un appel sous un domaine et stocker sa politique, son calendrier, ses métadonnées et le manifeste de relais optionnel.
- `JoinKaigi` et `LeaveKaigi`: mise à jour de la liste d'appels. En mode privé, les participants utilisent des engagements, des annulateurs et des preuves de liste au lieu d'exposer directement le compte du participant IDs.
- `RecordKaigiUsage`: ajouter la durée mesurée et les totaux des gaz.
- `EndKaigi`: clôture de la session et enregistrement du timestamp final.

Torii détecte la télémétrie du relais sous `/v1/kaigi/relays`, `/v1/kaigi/relays/{relay_id}`, `/v1/kaigi/relays/health`, et `/v1/kaigi/relays/events` lorsque l'application API l'état de la session est reflété par le Kaigi événements de domaine tels que `KaigiRosterSummary`, `KaigiRelayManifestUpdated`, `KaigiRelayHealthUpdated`, et `KaigiUsageSummary`.

### CLI Épreuve de fumée {#cli-smoke-test}

Commencez par le `iroha kaigi` CLI lorsque vous souhaitez vérifier qu'un point d'extrémité Torii accepte les transactions Kaigi avant de connecter un UI. La commande de démarrage rapide crée une pièce temporaire contre le point d'extrémité actif Torii et imprime un résumé avec l'identifiant d'appel, la commande de rejoindre et l'indice de bobine SoraNet:

```bash
iroha kaigi quickstart --auto-join-host --summary-out kaigi-summary.json
```

Pour les flux scriptés, gérer explicitement le cycle de vie de la pièce:

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

Utilisation `--room-policy public` pour les salles qui peuvent être exposées par des relais sans billets d'audience, ou `--room-policy authenticated` Lorsque les sorties doivent nécessiter une authentification du spectateur. `--privacy-mode zk-roster-v1` seulement après que le réseau ait Kaigi les clés de vérification du répertoire et de l'utilisation configurées; autrement, joints, feuilles, et les enregistrements d'utilisation privés échouent lors de la vérification déterministique.

### Test avec le démonstrateur JavaScript {#testing-with-the-javascript-demo}

Utilisez la démonstration de bureau [soramitsu/iroha-demo-javascript](https://github.com/soramitsu/iroha-demo-javascript) pour un test de portefeuille de bout en bout. La démonstration est une application Electron et Vue qui parle directement à Torii via le lien local `@iroha/iroha-js` et comprend une route `/kaigi` pour les médias natifs du navigateur un à un.

Utilisez la démo avec [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js) à partir du Iroha le référentiel de la source. SDK à travers `file:../iroha/javascript/iroha_js`, Alors gardez les deux caisses dans cette mise en page fraternelle:

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

Utilisez Node.js 20 ou plus récents et une chaîne d'outils Rust pour que le module natif `iroha_js_host` puisse être construit. Reconstruisez le SDK dans la caisse sœur Iroha après avoir changé sa source; la mise en page de l'emballage propre ne contient pas l'espace de travail Cargo nécessaire à `npm run build:native`.

Pour un test contrôlé, appuyez la démonstration sur un point d'extrémité Kaigi capable de Torii:

1. Démarrez un nœud Iroha avec l'application SORA/Kaigi orientée vers APIs activée, ou utilisez un point d'extrémité public qui expose les surfaces Kaigi dont vous avez besoin.
2. Vérifiez la facilité d'accès de base avec `/health`, puis vérifiez la surface du trajet en direct avec `/openapi` ou `/openapi.json`. Certains déploiements exposent également `/v1/health`, mais `/health` est le contrôle portable de la durée de vie.
3. Pour TAIRA, vérifiez les itinéraires de télémétrie du relais avant d'essayer une réunion en direct:

   ```bash
   TAIRA=https://taira.sora.org
   curl -fsS "$TAIRA/health"
   curl -fsS "$TAIRA/v1/kaigi/relays"
   curl -fsS "$TAIRA/v1/kaigi/relays/health"
   ```

Ces vérifications prouvent que la télémétrie de relais Torii et Kaigi est accessible. Elles ne créent pas une réunion; `CreateKaigi` et `JoinKaigi` ont encore besoin de portefeuilles financés et de soumission signée de transactions.
4. Ouvrez la démo, allez à Paramètres, définissez Torii URL, et laissez l'application charger la chaîne ID et le préfixe réseau depuis le point final.
5. Créer ou restaurer deux portefeuilles locaux dans la démo. Utilisez des fenêtres d'applications, des profils ou des machines séparés afin que l'hôte et l'invité aient un état de portefeuille séparé.

Pour l'essai du Kaigi UI:

1. Dans la fenêtre hôte, ouvrez Kaigi, choisissez Démarrer une réunion, définissez un titre et sélectionnez Invitation privée ou invitation transparente.
2. Sélectionnez allumez l'appareil photo et le microphone afin que WebRTC ait des médias locaux.
3. Sélectionnez Créer un lien de réunion. Un portefeuille en direct soumet `CreateKaigi`; l'application affiche ensuite une invitation `iroha://kaigi/join?call=...&secret=...` et un itinéraire de retour `#/kaigi?...`.
4. Gardez la fenêtre d'accueil ouverte et partagez l'invitation avec l'hôte.
5. Dans la fenêtre invité, ouvrez l'invitation ou collez-la dans réunion rejoindre, activez les médias locaux et sélectionnez réunion rejoindre. Un portefeuille en direct récupère l'offre d'hôte cryptée de Torii et envoie `JoinKaigi` avec des métadonnées de réponse cryptées.
6. L'hôte doit appliquer automatiquement la première réponse en diffusant ou en sondant les signaux d'appel Kaigi. Les deux fenêtres doivent afficher des supports connectés et des détails de connexion actualisés.
7. Terminer la session à partir de l'hôte ou utiliser la commande CLI `iroha kaigi end` pour le même appel ID.

Propriété Kaigi besoins protégés XOR Si le démonstrateur rapporte que l'entrée privée Kaigi besoins protégés XOR, Utilisez l'interrupteur de protection automatique intégré à l'application et réessayez l'action Créer ou Joindre. Si la génération de preuves, le financement privé ou la signalisation en direct ne sont pas disponibles, la démonstration peut revenir à un flux transparent / manuel. Dans ce cas, ouvrez la signalisation avancée, copiez l'offre brute ou le paquet de réponse, et collez-le dans l'autre fenêtre.

Pour les vérifications automatisées dans le repo de démonstration, exécuter:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
npm run verify
```

La couverture des suites Vitest concentrée Kaigi Création de liens de réunion, chargement d'invitations compactes, création/joint/finition privée des appels de ponts, des rappels d'auto-défense, des retombées manuelles et des sondages. UI l'essai de fumée comprend le `/kaigi` Les médias en direct entre deux portefeuilles nécessitent toujours un test manuel à deux fenêtres car le navigateur Les autorisations de caméra/microphone et les flux multimédias partagés sont spécifiques à l'environnement.

Pour le code d'intégration de l'échantillon, voir [Embedded Kaigi dans une application JavaScript ](/fr/guide/tutorials/kaigi.md).

## Statut et indicateurs {#status-and-metrics}

Les points d'extrémité de l'état et des métriques sont les premières choses à intégrer dans les tableaux de bord:

- `/status` expose les champs de partage, de blocage, de file d'attente et de consensus de premier niveau
- `/metrics` expose les compteurs Prometheus, les gauges et les histogrammes

Sur les nœuds activés Nexus, la sortie d'état comprend également des sections relatives à la voie et aux espaces de données. Lorsque `nexus.enabled = false`, ces sections sont omises.

## JSON par rapport à Norito {#json-vs-norito}

Plusieurs terminaux de l'opérateur retournent Norito par défaut. Lorsque le terminal prend en charge JSON, envoyez:

```http
Accept: application/json
```

Ceci est particulièrement utile pour:

- `/v1/sumeragi/status`
- `/v1/sumeragi/qc`
- `/v1/sumeragi/commit_qc/{hash}`

Lorsqu'un point d'extrémité accepte ou retourne typé Norito directement, utilisation `application/x-norito` en tant que type de contenu ou préféré `Accept` la valeur. Voir [Norito](/fr/reference/norito.md#torii-and-norito-rpc) pour les détails du transport.

## Profiles de télémétrie {#telemetry-profiles}

La visibilité du point d'extrémité dépend de la configuration `telemetry.profile` du noeud. La configuration actuelle expose cinq niveaux de profil:

|Le profil |`/status` |`/metrics` |Routes de développement |
| --- | --- | --- | --- |
|`disabled` |- Je ne sais pas .|- Je ne sais pas .|- Je ne sais pas .|
|`operator` |Oui , oui .|- Je ne sais pas .|- Je ne sais pas .|
|`extended` |Oui , oui .|Oui , oui .|- Je ne sais pas .|
|`developer` |Oui , oui .|- Je ne sais pas .|Oui , oui .|
|`full` |Oui , oui .|Oui , oui .|Oui , oui .|

## CLI Des raccourcis {#cli-shortcuts}

Le `iroha` CLI couvre déjà bon nombre de ces points d'expiration:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml ops sumeragi params
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

## Références en amont {#upstream-references}

- [README API et vue d'ensemble de l'observabilité](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/README.md)
- [ISO 20022 mise en œuvre du pont](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/iso20022_bridge.rs)
- [Performance et métriques ](/fr/guide/advanced/metrics.md)
