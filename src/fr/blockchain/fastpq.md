---
translation_locale: fr
translation_source: /blockchain/fastpq.md
translation_source_hash: 98c258ab99bcc7d7d51b69ddd26e39b19ef4eb14d53001825f3737144d68f0e5
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# FastPQ {#fastpq}

FastPQ est le chemin de preuve STARK d'Iroha pour des effets d'exécution sélectionnés. Il ne remplace ni l'exécution normale des transactions ni le consensus. Les transactions passent toujours par ISI, IVM et Sumeragi comme d'habitude ; FastPQ prouve ensuite les effets pris en charge à partir de l'enregistrement source capturé par l'exécution du bloc.

L'intégration actuelle de l'hôte comporte deux axes principaux :

- les effets sur les actifs numériques des blocs finalisés, prouvés par la voie d'exécution du prouveur du nœud
- les enveloppes de preuve AXT de SORA Nexus dont le `fastpq_binding` contient une liaison FastPQ

## Chemin du témoin de transfert {#transfer-witness-path}

Les transferts numériques transparents créent une transcription de transfert structurée lorsque l'instruction modifie les soldes. La transcription enregistre :

- le compte source, le compte de destination, la définition de l'actif et le montant
- soldes de l'expéditeur et du destinataire avant et après le transfert
- le hachage cryptographique du point d'entrée de la transaction utilisé comme hachage cryptographique du lot
- un condensé d'autorité dérivé du compte soumetteur
- un condensé Poseidon pour les transcriptions à delta unique
- les témoins de mise à jour de l'arbre de Merkle clairsemé pour les soldes de l'expéditeur et du destinataire

Les transferts par lots utilisent une seule transcription avec plusieurs deltas. Dans ce cas, le condensé Poseidon à delta unique est absent.

L'exécution du bloc regroupe les transcriptions selon l'appel d'exécution qui les a émises et les conserve avec l'enregistrement source FastPQ du bloc. Dans un énoncé de transfert AXT, chaque delta de transfert devient deux lignes de transition :

| Ligne | Clé | Valeur avant | Valeur après |
| --------------- | --------------------------------------------------------------------- | ----------------------- | ---------------------- |
| Débit de l'expéditeur | `FastpqBalanceKeyV1` pour la définition de l'actif et le compte source | solde de l'expéditeur avant | solde de l'expéditeur après |
| Crédit du destinataire | `FastpqBalanceKeyV1` pour la définition de l'actif et le compte de destination | solde du destinataire avant | solde du destinataire après |

Chaque clé est la trame Norito canonique de `FastpqBalanceKeyV1`, construite par `transfer_balance_key` à partir de la définition d'actif typée et du compte sans domaine. Les alias de compte et les formes d'affichage ne constituent jamais du matériel de clé.

## Effets d'exécution {#execution-effects}

La voie d'exécution du prouveur prouve des énoncés complets d'effets d'exécution. Chaque énoncé couvre tous les effets de quantité d'une entrée d'exécution, dans l'ordre d'exécution :

| Effet | Valeurs mises à jour | Règle |
| -------- | ------------------------------ | ------------------------------------------------------------------- |
| Transfert | solde source et solde de destination | le montant passe d'un solde à un autre d'un même actif |
| Émission | solde et offre | les deux augmentent du même montant non nul |
| Destruction | solde et offre | les deux diminuent du même montant |
| Retrait | offre et cycle de vie | l'offre reste à zéro et la présence de l'actif passe de un à zéro |

L'offre ne descend jamais en dessous d'un solde. Chaque clé se compose du domaine `iroha:fastpq:execution-quantity-key:v1`, d'un octet NUL et de l'encodage Norito d'une clé `FastpqExecutionQuantityKeyV1` de solde, d'offre ou de cycle de vie. Les octrois de rôles, les révocations de rôles et les autres opérations ne sont pas prouvés.

Les valeurs des énoncés d'effets d'exécution et de transfert AXT sont des unités entières non négatives exactes à l'échelle décimale de l'actif (`FastpqQuantityUnits`) ; elles ne sont donc pas limitées à `u64`. La construction de l'énoncé rejette une discordance d'échelle, une différence négative et toute incohérence arithmétique ou d'ordre ; elle ne corrige jamais une valeur publique.

## Entrées publiques {#public-inputs}

Chaque énoncé FastPQ comporte des entrées publiques qui lient la preuve au bloc et au contexte d'exécution :

|Entrée|Sens|
| ------------- | ------------------------------------------------------------------------------------ |
| `dsid` | Identifiant de l'espace de données : sa valeur `u64` en ordre little-endian, suivie de huit octets nuls |
| `slot` | Heure de création du bloc en nanosecondes, avec une précision à la milliseconde |
| `old_root` | Racine de l'arbre de Merkle clairsemé des clés touchées avant l'énoncé |
| `new_root` | Racine de l'arbre de Merkle clairsemé des clés touchées après l'énoncé |
| `perm_root` | Engagement sur la table des permissions de rôles de l'état d'exécution |
| `tx_set_hash` | Engagement sur les transactions du bloc au format de transmission, dans l'ordre du bloc |

`old_root` et `new_root` ne couvrent que les clés que l'énoncé touche. Ce ne sont pas la racine persistée de l'état mondial.

`perm_root` est le `Hash` de 32 octets d'Iroha calculé sur le domaine `fastpq:v1:permission-table:blake2b-256`, le nombre d'entrées sous forme de `u64` little-endian et les entrées triées. Chaque entrée se compose du hachage d'un ID de rôle, du hachage de l'une de ses permissions et de l'époque de cette permission sous forme de `u64` little-endian. Une table vide s'engage sur 32 octets nuls. Il s'agit uniquement d'un contexte de rôles et de permissions ; il ne prouve ni l'appartenance des comptes ni l'autorisation.

`tx_set_hash` est le `Hash` d'Iroha calculé sur le domaine `iroha:axt:ordered-transaction-wire-set:v1`, un octet NUL, le nombre de transactions et, pour chaque transaction dans l'ordre du bloc, sa longueur au format de transmission et l'intégralité de ses octets dans ce format. Le nombre et les longueurs sont des valeurs `u64` little-endian. Les transactions ne sont ni triées ni dédupliquées, et les signatures restent dans la préimage.

Le `Hash` d'Iroha est Blake2b-256 avec le bit de poids faible du dernier octet mis à un. Un énoncé comporte également un hachage d'ordonnancement ainsi que l'ensemble de ses lignes canoniques et de ses faits source ; la preuve les lie tous.

## Protocole de preuve {#proof-protocol}

Les artefacts canoniques de FastPQ sont des preuves DEEP masquées sur le corps de Goldilocks avec une extension de degré 4. Leur relation exacte, leur transcription et leur géométrie de requêtes sont définies dans le [contrat épinglé du protocole DEEP de FastPQ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_deep_protocol_contract.md).

Les appelants choisissent un énoncé ordinaire ou AXT ainsi que des limites de ressources. Ils ne choisissent ni les circuits, ni les clés de vérification, ni le nombre de requêtes, ni les détails internes de la transcription. La route ordinaire est `offline_compact::prove_quantity_ordinary_artifact` ; la route AXT est `offline_compact::prove_quantity_axt_artifact`, que `prove_axt_bound_batch` encapsule pour les lots liés. L'API transparente de `Prover`, `Proof` et de rejeu `verify` n'existe que dans les tests et les builds `dev-tools`.

## Ce que la preuve vérifie {#what-the-proof-checks}

Avant tout travail privé, le producteur prépare l'énoncé public. Il vérifie les comptes, les montants, les valeurs, le nombre d'occurrences, l'ordre stable des clés et l'allocation des clés, et rejette un énoncé dont les faits publics sont incohérents. La relation scellée prouve ensuite les deux mises à jour complètes de l'arbre de Merkle clairsemé à 32 niveaux d'une occurrence d'effet ou de transfert par segment. Les limites par défaut autorisent au plus deux segments par artefact.

Chaque trace comporte 65,536 lignes. Le producteur engage 301 colonnes privées et le vérificateur reconstruit indépendamment 41 colonnes publiques. Une entropie cryptographique fraîche masque les colonnes de la trace, le quotient et un polynôme de composition engagé indépendamment. La division du quotient doit être exacte. Le producteur vérifie son propre artefact avant de le renvoyer.

Les valeurs de l'énoncé public ne sont pas masquées. La présence d'une opération dans le format de transmission ne suffit pas à l'admettre : seuls les effets énumérés ci-dessus disposent de relations, et les énoncés AXT n'admettent que des transferts avec témoin.

## Voie d'exécution du prouveur {#prover-lane}

`iroha3d` lance un processus de travail du prouveur FastPQ pendant le démarrage du nœud, avant que Torii n'accepte les soumissions, sauf si Kura démarre avec `init_mode = "fast"`. Le processus de travail initialise son backend en arrière-plan ; le démarrage se poursuit donc si l'initialisation échoue, et la voie d'exécution reste alors désactivée.

Le processus de travail interroge périodiquement l'état finalisé du nœud et le stockage de Kura. Pour chaque bloc finalisé, il obtient la source authentifiée, en rejouant l'exécution native lorsque la source n'est pas stockée, et prouve les énoncés complets du bloc un par un avec la route ordinaire. Après un redémarrage, il reconstruit le préfixe authentifié à partir de la genèse signée épinglée. Il stocke chaque artefact dans le stockage FastPQ borné de Kura. Un artefact stocké n'est qu'une annonce : avant de passer à la suite, le producteur authentifie la source et vérifie à nouveau l'artefact.

La production de preuves est locale au nœud. Ce n'est pas une barrière d'admission des transactions ni de consensus : l'exécution, la validation et la finalité n'attendent pas de preuve. Un échec pouvant être retenté laisse le travail pour une tentative ultérieure, et un seul producteur s'exécute par processus.

## Vérification {#verification}

Un vérificateur contrôle un artefact par rapport à des attentes qu'il dérive de son propre énoncé authentifié, jamais de l'artefact contrôlé. La vérification décode chaque segment une seule fois dans des limites fixées, évalue l'AIR une seule fois au point hors domaine, authentifie chaque ligne ouverte, chaque feuille du quotient et chaque fibre FRI ainsi que le terminal FRI complet par rapport aux racines engagées, et effectue au plus 385 vérifications de repliement. Elle ne construit aucun témoin privé, aucune trace ni aucune extension de bas degré complète.

Le succès établit la cohérence avec les attentes de l'appelant. Il n'accorde aucune autorité d'exécution, aucune finalité de la source, aucune admission de rejeu ni aucune autorisation de dépense AXT.

Limites par défaut de `offline_compact::VerificationLimits`, que la route ordinaire utilise également :

|Limite|Par défaut|
| ------------------------------- | ------------: |
| Segments par artefact | 2 |
| Octets de transmission de l'artefact | 1 MiB |
| Trame de la preuve enfant | 500,084 octets |
| Octets d'énoncé sur l'ensemble des segments | 512 KiB |
| Requêtes par segment | 77 |
| Requêtes sur l'ensemble des segments | 154 |

La voie d'exécution du nœud plafonne en outre les octets de transmission de l'artefact à `zk.fastpq.proof_sidecar_max_bytes` et à la limite d'objets FastPQ de Kura. Avant le décodage, un blob de preuve AXT peut contenir au plus 2 MiB et sa charge utile FastPQ intégrée au plus 1 MiB.

## Enveloppes de preuve AXT de SORA Nexus {#sora-nexus-axt-proof-envelopes}

Les enveloppes de preuve AXT de SORA Nexus peuvent intégrer un `AxtFastpqBinding`. La validation des enveloppes AXT au niveau des blocs, les vérifications d'enveloppes AXT de l'hôte IVM et `RegisterVerifiedFeeSponsorVaultAllocation` exigent le `fastpq_binding` de l'enveloppe, le comparent à la revendication attendue et appellent le vérificateur FastPQ sur l'enveloppe et la preuve qu'elle intègre. Une liaison absente ou une vérification échouée entraîne le rejet de l'opération.

Le vérificateur n'accepte que les revendications de transfert avec témoin, `tx_predicate` et `value_conservation`. Les types de revendication `authorization` et `compliance` sont des porteurs d'effets opaques sans relation de transfert, et la vérification les rejette. La validation des blocs rejette également les enveloppes qui portent des dépenses distantes, et l'hôte IVM rejette l'admission autonome de `AXT_VERIFY_DS_PROOF`. Les deux restent indisponibles tant que les racines source finalisées, l'ensemble des transactions et l'autorisation de l'émetteur ne peuvent pas être authentifiés.

### Liaison AXT {#axt-binding}

Pour les enveloppes AXT de SORA Nexus, `AxtFastpqBinding` est converti en forme canonique avant la génération de la preuve et la vérification :

- `parameter`, `source_dataspace`, `source_receipt_id` et `verified_effect_type` sont débarrassés de leurs espaces en début et en fin et ne doivent pas être vides
- `source_tx_commitment`, `claim_digest`, `witness_commitment` et `policy_commitment` sont convertis en minuscules et doivent être des encodages hexadécimaux de 32 octets
- `verifier_id` doit valoir `fastpq` et `verifier_version` doit valoir `v1`
- `claim_type` est débarrassé de ses espaces en début et en fin, converti en minuscules et doit désigner l'un des quatre types de revendication ci-dessus
- `target_dsids` ne doit pas être vide et doit être strictement croissant
- `remote_spend_intent_commitments` doit être strictement croissant et respecter la limite de la première version

La vérification exige la forme canonique exacte ; elle ne normalise pas une liaison pour le compte de l'appelant.

La liaison s'attache à un lot que l'exécution du bloc a déjà capturé ; elle ne crée pas de transitions. Le lot doit contenir au moins une transition d'état et désigner l'ensemble de paramètres de la liaison, `fastpq-state-transition-stark-v1`. Ses métadonnées `entry_hash` doivent être égales à `source_tx_commitment`, et son `dsid` public doit encoder le `source_dsid` de la liaison. Une revendication de transfert doit porter au moins une transcription de transfert, et le hachage de lot de chaque transcription doit être égal à `source_tx_commitment`.

La liaison écrit ensuite dans le lot des métadonnées liées à la preuve : la liaison canonique, ses quatre condensés, `source_receipt_id`, `target_dsids`, `verified_effect_type`, un `corridor` non vide, la racine de manifeste non nulle, l'engagement DA facultatif, un montant engagé facultatif non nul et le slot d'expiration, où zéro signifie l'absence d'expiration. Enfin, elle ajoute un sceau sur la liaison et sur le lot sans le sceau :

$$
\operatorname{seal} =
\operatorname{Hash}(
\texttt{fastpq:axt:batch-seal:v1}\|
E(\operatorname{binding})\|
E(\operatorname{batch})
)
$$

Ici, $E$ est l'encodage Norito canonique. Modifier le lot, la liaison ou une valeur liée à la preuve après la liaison fait échouer la vérification. Le vérificateur compare également l'espace de données, la racine de manifeste, l'engagement DA, le montant engagé et l'expiration de l'enveloppe avec les valeurs liées à la preuve.

Une enveloppe vérifiée renvoie ses `old_root`, `new_root` et `tx_set_hash` prouvés, ainsi qu'un condensé de l'énoncé. Ce condensé couvre l'espace de données de l'enveloppe sous forme de `u64` little-endian, sa racine de manifeste, l'engagement DA lorsqu'il est présent, la liaison et l'énoncé :

$$
\operatorname{statement\_digest} =
\operatorname{Hash}(
\texttt{fastpq:axt:statement:v1}\|
\operatorname{le64}(\operatorname{dsid})\|
\operatorname{manifest\_root}\|
\operatorname{da\_commitment}\|
E(\operatorname{binding})\|
E(\operatorname{statement})
)
$$

La valeur de condensat cryptographique du manifeste technique du lot AXT est SHA-256 sur le codage Norito de la liaison canonique :

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## Ensembles de paramètres {#parameter-sets}

La première version comporte exactement un ensemble de paramètres, `fastpq-state-transition-stark-v1`. Les lots et les liaisons AXT le désignent, et la génération de preuves AXT rejette tout autre nom. Le contrat du protocole DEEP fixe la géométrie des artefacts de la version publiée :

| Élément | Valeur |
| -------------------------- | ----------------------------------------------------- |
| Corps | Goldilocks `p = 2^64 - 2^32 + 1`, extension `u^4 - 7` |
| Lignes de trace | 65,536 |
| Lignes d'évaluation | 8,388,608 (facteur d'expansion 128) |
| Arités de repliement FRI | `[16, 16, 8, 8, 4]` |
| Requêtes | 77 positions distinctes |
| Grinding | aucun |
| Engagements et transcription | SHA3-256 et SHAKE256 |

La qualification pour la production n'est pas disponible. Les revues indépendantes de solidité, de masquage et de Fiat-Shamir de cette construction restent à mener, et le [dossier épinglé de préparation à la production](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_production_readiness.md) n'avance aucune affirmation de sécurité normalisée par le travail.

## Configuration {#configuration}

La configuration de FastPQ se trouve sous `zk.fastpq`.

```toml
[zk.fastpq]
execution_mode = "cpu"
poseidon_mode = "cpu"
proof_sidecar_queue_cap = 1024
proof_sidecar_max_retries = 16

# Optional telemetry labels.
device_class = "apple-m4"
chip_family = "m4"
gpu_kind = "integrated"

# Optional Metal backend tuning.
metal_queue_fanout = 3
metal_queue_column_threshold = 24
metal_max_in_flight = 5
metal_threadgroup_width = 128
metal_trace = false
metal_debug_enum = false

[zk.fastpq.producer]
poll_interval_ms = 1000
step_timeout_ms = 30000
max_native_steps = 16
max_source_entries = 65536
max_source_statements = 16384
```

Les deux modes n'acceptent que `cpu` ou `gpu` et valent `cpu` par défaut. Régler l'un ou l'autre sur `gpu` fait que le hachage des preuves exige un périphérique : Metal sous macOS et CUDA ailleurs. Si la prise en charge du GPU n'est pas compilée ou si le périphérique échoue à la vérification préalable, la voie d'exécution du prouveur reste désactivée ; elle ne bascule jamais vers le CPU. Le périphérique effectue le hachage en masse des feuilles de Merkle et des nœuds parents inférieurs ; la transcription, l'arbre supérieur ordonné et l'arithmétique de la trace restent sur le CPU. Avec `poseidon_mode = "gpu"`, le nœud regroupe également par lots les condensés Poseidon des transcriptions sur le GPU lorsqu'une vérification préalable distincte réussit ; sinon, il les calcule sur le CPU.

`proof_sidecar_max_bytes` plafonne l'artefact encodé que le nœud persiste et vérifie, et vaut par défaut la trame de preuve maximale du prouveur. La table `producer` borne chaque tentative de génération de preuve : son intervalle d'interrogation, son budget de temps, les étapes de rejeu natif (de 1 à 64) ainsi que les entrées et les énoncés source admis avant l'allocation. `metal_queue_fanout` accepte une valeur de 1 à 4.

Les paramètres de mode et d'étiquettes de télémétrie peuvent également être remplacés depuis `iroha3d` :

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

`iroha3d` ignore les variables d'environnement lorsqu'il lit un fichier de configuration ; définissez donc ces valeurs en TOML ou avec les options ci-dessus.

## Métriques {#metrics}

Lorsque la télémétrie est activée, FastPQ exporte des métriques sur la sélection du backend, la persistance des preuves et le comportement d'exécution de Metal :

|Métrique|Signification|
| ----------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`     |Mode d'exécution demandé et résolu par les étiquettes du backend et de l'appareil|
| `fastpq_poseidon_pipeline_total`  |Chemin de pipeline de traitement Poseidon demandé et résolu|
| `fastpq_gpu_disable_total` | Événements de désactivation de l'accélérateur GPU par accélérateur, motif et étiquettes de périphérique |
| `fastpq_gpu_parity_failure_total` | Échecs de parité GPU échantillonnés par accélérateur, motif et étiquettes de périphérique |
| `fastpq_proof_sidecar_queue_depth` | Pièces jointes sidecar de preuves FastPQ en file d'attente |
| `fastpq_proof_sidecar_events_total` | Événements de persistance du sidecar de preuves par événement |
| `fastpq_metal_queue_depth`        |Limite de file d'attente Metal, nombre maximum en cours, nombre d'envois, et fenêtre d'échantillonnage|
|`fastpq_metal_queue_ratio`        |Ratios d'occupation et de chevauchement de la file d'attente Metal|
| `fastpq_zero_fill_duration_ms`    |Durée de remplissage à zéro de l’hôte pour les exécutions Metal|
| `fastpq_zero_fill_bandwidth_gbps` |Bande passante à remplissage de zéros dérivée|

Les métriques de mode, de GPU, de file d'attente Metal et de remplissage à zéro nécessitent le profil de télémétrie `extended` ou `full` et ne sont pas exportées lorsque Kura démarre avec `init_mode = "fast"`. Les métriques de file d'attente Metal et de remplissage à zéro nécessitent également une compilation `fastpq-gpu` sous macOS.

Pour le triage de performance général, utilisez ceux-ci avec les signaux de consensus et de file d'attente listés dans [Performance et mesures](/fr/guide/advanced/metrics.md).

## Référence Connexe {#related-reference}

- [Schéma du modèle de données](/fr/reference/data-model-schema.md) pour l'instantané des types du nœud, qui fait autorité
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `FastpqPublicTransferStatementV1`
- `FastpqBalanceKeyV1`
- `FastpqExecutionQuantityKeyV1`
- `TransferTranscript`
- `AxtFastpqBinding`
- `AxtProofEnvelope`
- [Options FastPQ d’`iroha3d`](/fr/reference/iroha3d-cli.md#fastpq-overrides)
