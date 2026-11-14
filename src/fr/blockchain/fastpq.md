---
translation_locale: fr
translation_source: /blockchain/fastpq.md
translation_source_hash: 8f0684c96205d4cbc6a4f913ac57a7ff1aa6fec944e28d70def2663a56fb2ab7
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# FastPQ {#fastpq}

FastPQ est le chemin de preuve STARK de Iroha pour les effets d'exécution sélectionnés. Il ne remplace pas l'exécution normale des transactions ni le consensus. Les transactions restent exécuter ISI, IVM et Sumeragi comme d'habitude ; FastPQ consomme le témoin d'exécution déterministe et transforme les effets pris en charge en lots de preuves.

L'intégration actuelle de l'hôte comporte deux axes principaux :

- transferts d'actifs numériques transparents enregistrés pendant l'exécution des blocs
- les enveloppes de preuve AXT de SORA Nexus dont le `fastpq_binding` contient une liaison FastPQ

## Transférer le chemin du témoin {#transfer-witness-path}

Les transferts numériques transparents créent une transcription de transfert structurée lorsque l'instruction modifie les soldes. La transcription enregistre :

- le compte source, le compte de destination, la définition de l'actif et le montant
- soldes de l'expéditeur et du destinataire avant et après le transfert
- le hachage cryptographique du point d'entrée de la transaction utilisé comme hachage cryptographique du lot
- une valeur de résumé cryptographique principale d'autorisation dérivée du compte soumetteur
- une valeur de résumé cryptographique Poseidon pour des transcriptions à delta unique

Les transferts par lots utilisent une seule transcription avec plusieurs deltas. Dans ce cas, la valeur de digest cryptographique Poseidon à delta unique est absente.

Lors de la finalisation du bloc, Iroha regroupe ces transcriptions par hachage cryptographique d’entrée. Le témoin d’exécution transporte ensuite à la fois les ensembles de transcriptions originaux et les lots de transition FastPQ préparés pour le prouveur.

Chaque delta de transfert devient deux lignes de transition :

| Rang |Forme de la clé|Valeur préalable|Post-valeur|
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|Débit de l'expéditeur| `asset/<asset-definition>/<source-account>`      |solde de l'expéditeur avant|solde de l'expéditeur après|
|Crédit du destinataire| `asset/<asset-definition>/<destination-account>` |solde du récepteur avant|solde du récepteur après|

Les valeurs numériques sont normalisées en unités témoins entières. Une valeur est rejetée pour le regroupement FastPQ si elle ne peut pas être représentée comme un `u64` non négatif à l'échelle décimale sélectionnée.

## Entrées publiques {#public-inputs}

Chaque lot de transition FastPQ comporte des entrées publiques qui lient la preuve au bloc et au contexte d'exécution :

|Entrée|Sens|
| ------------- | --------------------------------------------------------------- |
| `dsid` | Identifiant d’espace de données encodé en octets little-endian |
| `slot`        |Temps de création du bloc converti en nanosecondes|
| `old_root`    |Racine de l'état parent dérivée du témoin d'exécution|
| `new_root`    |Racine de l'état postérieure dérivée du témoin d'exécution|
| `perm_root`   |Engagement de Poséidon concernant les autorisations de rôle actif|
| `tx_set_hash` |hachage cryptographique sur le point d'entrée des hachages cryptographiques de transaction triés et déclenchés par le temps|

L'hôte utilise pour ces lots l'unique ensemble de paramètres de la première version, `fastpq-state-transition-stark-v1`.

## Protocole de preuve {#proof-protocol}

Les artefacts de transfert canoniques sont des preuves DEEP masquées sur le corps de Goldilocks avec une extension de degré 4. Leur relation exacte, leur transcription et leur géométrie de requêtes sont définies dans le [contrat épinglé du protocole DEEP de FastPQ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_deep_protocol_contract.md).

## Ce que le vérificateur contrôle {#what-the-prover-checks}

Avant de construire la trace, le prouveur FastPQ canonise l'ordre du lot par clé de transition, rang de l'opération et ordre d'insertion. Les lignes de transfert nécessitent également des métadonnées de transcription. Un lot avec des lignes de transfert mais sans transcriptions de transfert est invalide.

Pour les relevés de notes de transfert, les vérifications du côté du fournisseur incluent :

- le solde de l'expéditeur ne doit pas être inférieur à zéro
- `sender_after` doit être égal à `sender_before - amount`
- `receiver_after` doit être égal à `receiver_before + amount`
- la transcription doit couvrir chaque ligne de transfert dans le lot
- lorsqu’il est présent, le condensé Poseidon à delta unique doit correspondre à la préimage de la transcription
- les preuves de Merkle clairsemées fournies doivent être décodées comme version 1 ; les chemins manquants sont remplis par des preuves synthétiques déterministes

La trace contient des colonnes de sélecteur pour le transfert, l'émission, la destruction, l'octroi de rôle, la révocation de rôle, la définition des métadonnées et les lignes de recherche de permissions. Les lignes d'opérations numériques comportent également des deltas signés, des deltas cumulés par actif et des compteurs d'approvisionnement.

## Voie d'exécution du prouveur {#prover-lane}

`iroha3d` démarre la voie d'exécution du FastPQ prover au démarrage si le backend du prover peut être initialisé. La voie d'exécution est une tâche en arrière-plan avec une file d'attente limitée. Après qu'un bloc produit un témoin d'exécution, le chemin de validation soumet un travail de prouveur contenant le hachage cryptographique du bloc, sa hauteur, sa vue et son témoin.

Si la voie d'exécution ne fonctionne pas ou si la file d'attente est pleine, le travail est ignoré et le traitement normal du bloc continue. Cela signifie que la voie d'exécution du prouveur en arrière-plan n'est pas une porte d'admission des transactions ni de consensus. C'est un chemin de production de preuve sur un état qui a déjà été exécuté.

La voie d'exécution construit un prouveur avec :

```text
parameter = "fastpq-state-transition-stark-v1"
execution_mode = cpu | gpu
poseidon_mode = cpu | gpu
```

Les deux paramètres par défaut sont `cpu`. Sélectionner `gpu` est une demande explicite en mode échec fermé : si le support GPU n'est pas compilé ou si un backend GPU demandé échoue au pré-vol, la voie d’exécution du prouveur reste désactivée. La première version n’a pas de valeur `auto` et ne bascule pas d’un mode demandé GPU vers CPU.

## Vérification {#verification}

FastPQ La vérification de la preuve reconstruit l'engagement de lot canonique et rejoue le transcript public. Le vérificateur vérifie la version du protocole, la version de l'ensemble de paramètres, les limites de répétition, l'engagement de trace, les entrées publiques, les ouvertures de Merkle échantillonnées, les ouvertures AIR et la chaîne de requêtes FRI.

Les limites de lecture par défaut incluent :

|Limiter|Par défaut|
| ------------------ | ------: |
|Lignes de transition|     256 |
|Taille de la charge par lot|256 KiB|
| FRI couches         |      16 |
|Rechercher des ouvertures|     128 |

## Enveloppes de preuve AXT de SORA Nexus {#sora-nexus-axt-proof-envelopes}

Les enveloppes de preuve AXT de SORA Nexus peuvent intégrer un `AxtFastpqBinding`. La validation des enveloppes AXT au niveau des blocs, les vérifications d'enveloppes AXT de l'hôte IVM et `RegisterVerifiedFeeSponsorVaultAllocation` exigent le `fastpq_binding` de l'enveloppe, le comparent à la revendication attendue et appellent le vérificateur FastPQ sur l'enveloppe et la preuve qu'elle intègre. Une liaison absente ou une vérification échouée entraîne le rejet de l'opération.

### AXT Liaison Math {#axt-binding-math}

Pour les enveloppes AXT de SORA Nexus, `AxtFastpqBinding` est converti en forme canonique avant de rejouer la preuve. Les valeurs `parameter`, `verifier_id` ou `verifier_version` vides sont rejetées ; l’identifiant du vérificateur doit être `fastpq` et la version `v1`, et les flux AXT maintenus utilisent `fastpq-state-transition-stark-v1`. Le type de revendication est débarrassé de ses espaces en début et en fin, puis converti en minuscules.

Les entrées publiques AXT FastPQ sont des hachages cryptographiques d'octets déterministes :

$$
\operatorname{dsid}=\operatorname{dsid\_bytes}(\operatorname{source\_dsid})
$$

$$
\operatorname{slot}=\operatorname{le64}(\operatorname{source\_tx\_commitment}[0..8])
$$

$$
\operatorname{old\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:old\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{policy\_commitment}\|
\operatorname{effect\_type}
)
$$

$$
\operatorname{new\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:new\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{effect\_type}
)
$$

$$
\operatorname{perm\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:perm\_root}\|
\operatorname{policy\_commitment}\|
\operatorname{verifier\_id}\|
\operatorname{verifier\_version}
)
$$

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq-json:tx\_set\_hash}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{witness\_commitment}
)
$$

Les clés de transition AXT sont :

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

La réclamation `authorization` insère une ligne d'attribution de rôle :

$$
\operatorname{role\_id}=\operatorname{claim\_digest}
$$

$$
\operatorname{permission\_id}=\operatorname{witness\_commitment}
$$

$$
\operatorname{epoch}=
\operatorname{le64}(\operatorname{policy\_commitment}[0..8])
$$

et une ligne de métadonnées liant la politique d'autorisation. La revendication `compliance` insère deux lignes de métadonnées : une pour la politique et une pour les espaces de données cibles.

Pour `tx_predicate` et `value_conservation`, un montant d'effet explicite est utilisé lorsque la liaison contient un montant source ou destination positif. Sinon, le code dérive un montant déterministe borné :

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

Ensuite, les mêmes équations de transfert sont utilisées :

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

Les identifiants de compte expéditeur et destinataire synthétiques sont générés à partir de graines de clés :

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

Le hachage cryptographique du lot de transfert est :

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

La valeur de condensat cryptographique du manifeste technique du lot AXT est SHA-256 sur le codage Norito de la liaison canonique :

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## Ensembles de paramètres {#parameter-sets}

La première version comporte exactement un ensemble de paramètres canonique, `fastpq-state-transition-stark-v1`. Il vise une sécurité de 128 bits sur le corps de Goldilocks avec une extension de degré 4 (`X^4 - 7`) et utilise une taille de trace `2^16`, une taille LDE `2^19`, une arité FRI de 2, un facteur d'expansion de 8, au plus 17 réductions et 136 requêtes.

## Configuration {#configuration}

La configuration de FastPQ se trouve sous `zk.fastpq`.

```toml
[zk.fastpq]
execution_mode = "cpu"
poseidon_mode = "cpu"

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
```

Les mêmes étiquettes d'exécution et de télémétrie peuvent être remplacées depuis `iroha3d` :

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

Les variables d'environnement sont également prises en charge pour les champs de configuration. Les variables spécifiques à FastPQ incluent :

- `FASTPQ_EXECUTION_MODE`
- `FASTPQ_POSEIDON_MODE`
- `FASTPQ_DEVICE_CLASS`
- `FASTPQ_CHIP_FAMILY`
- `FASTPQ_GPU_KIND`
- `FASTPQ_METAL_QUEUE_FANOUT`
- `FASTPQ_METAL_COLUMN_THRESHOLD`
- `FASTPQ_METAL_MAX_IN_FLIGHT`
- `FASTPQ_METAL_THREADGROUP`
- `FASTPQ_METAL_TRACE`
- `FASTPQ_DEBUG_METAL_ENUM`

## Métriques {#metrics}

Lorsque la télémétrie est activée, FastPQ exporte des métriques sur la sélection du backend et le comportement de l’environnement d’exécution Metal :

|Métrique|Signification|
| --------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`     |Mode d'exécution demandé et résolu par les étiquettes du backend et de l'appareil|
| `fastpq_poseidon_pipeline_total`  |Chemin de pipeline de traitement Poseidon demandé et résolu|
| `fastpq_metal_queue_depth`        |Limite de file d'attente Metal, nombre maximum en vol, nombre de dispatch, et fenêtre d'échantillonnage|
|`fastpq_metal_queue_ratio`        |Queue métallique ratios d'occupation et de chevauchement|
| `fastpq_zero_fill_duration_ms`    |Durée de remplissage à zéro de l’hôte pour les exécutions Metal|
| `fastpq_zero_fill_bandwidth_gbps` |Bande passante à remplissage de zéros dérivée|

Pour le triage de performance général, utilisez ceux-ci avec les signaux de consensus et de file d'attente listés dans [Performance et mesures](/fr/guide/advanced/metrics.md).

## Référence Connexe {#related-reference}

- [Schéma du modèle de données](/fr/reference/data-model-schema.md) pour la vue de données ponctuelle de type nœud-autoritaire
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- [Options FastPQ d’`iroha3d`](/fr/reference/iroha3d-cli.md#fastpq-overrides)
