---
translation_locale: fr
translation_source: /guide/advanced/metrics.md
translation_source_hash: fc62efbb6100308bb7a929e18c9c8b6860372abd6d0009616ea63d7c77b6b1eb
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Performance et mesures {#performance-and-metrics}

La performance de Iroha dépend de la charge de travail, de la topologie des validateurs, des conditions du réseau et des paramètres de consensus. Un seul chiffre TPS n'est donc utile que lorsqu'il est lié à un test de référence avec une configuration fixe.

Pour la planification de la capacité, considérez la performance comme un conteneur de données opérationnelles :

- le réseau accepte le taux de transaction demandé
- la latence de commit reste dans le budget cible
- les files d'attente des transactions restent limitées
- le consensus ne repose pas sur des changements de vue répétés ou des chemins de récupération

Utilisez cette page pour estimer si un déploiement se trouve dans un état de performance élevé, moyen ou faible pour un nombre de nœuds donné, un seuil de latence réseau et un TPS cible.

## Ce qu'il faut mesurer {#what-to-measure}

Commencez avec la vue des données du point dans le temps du nœud public et la récupération Prometheus, puis utilisez le CLI pour l'état de consensus authentifié par l'opérateur. La clé de l'opérateur doit être autorisée par le nœud cible et est chargée uniquement au moment de l'exécution du logiciel :

```bash
export TORII=http://127.0.0.1:8180
export OPERATOR_KEY_FILE=./secrets/operator.key

curl -s -H 'Accept: application/json' "$TORII/status" | jq .
curl -s "$TORII/metrics" > metrics.prom

iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi status
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi diagnostics
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi qc
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi params
```

Public Taira est utile pour apprendre la forme des instantanés de nœuds anonymes. Ses diagnostics d'opérateur sont intentionnellement indisponibles sans une clé d'opérateur Taira :

```bash
TAIRA=https://taira.sora.org

curl -fsS -H 'Accept: application/json' "$TAIRA/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA/v1/time/now" \
  | jq '{now_ms, offset_ms}'
```

Ne pas utiliser les observations du testnet public comme chiffres de capacité de production pour votre propre déploiement.

La visibilité de la télémétrie dépend du profil configuré. `operator` active les instantanés de statut et de diagnostics. `extended` ajoute `/metrics` et des minuteries coûteuses, tandis que `developer` ajoute des vues de données à un moment donné pour les développeurs telles que leader, QC, paramètres et preuves sans activer `/metrics`. Utilisez `full` lorsqu'une exécution nécessite les deux ensembles. `telemetry_profile` est le seul interrupteur de télémétrie de première version.

```toml
telemetry_profile = "full"
```

## Plages de performance {#performance-bands}

Utilisez ces bandes pour une exécution observée à un débit cible `Y` TPS et à un budget de latence `L` millisecondes. Exécutez la charge de travail suffisamment longtemps pour inclure la montée en température, l'état stable et au moins une période de charge maximale prévue.

|Bande|Conditions|Signification|
| --- | --- | --- |
|Haut|Le débit accepté est égal ou supérieur à `Y`, la latence de commit p95 est inférieure à `0.8 * L`, les files d'attente restent en dessous de 10 % de la capacité, et les compteurs de changement de vue/récupération sont stables|Le déploiement dispose de marge pour la charge de travail demandée|
|moyenne|Le débit accepté est proche de `Y`, la latence de commit p95 est inférieure à `L`, les files d'attente sont stables en dessous de 50 % de la capacité, et les changements de vue sont rares|Le déploiement fonctionne, mais il y a une tolérance limitée aux pics|
|basse|Le débit accepté est inférieur à `Y`, la latence de commit p95 dépasse `L`, les files d'attente augmentent pendant l'exécution, ou les compteurs de changement de vue/rétropression augmentent continuellement|La charge de travail demandée dépasse au moins un goulot d'étranglement|

La règle clé est la direction de la file d'attente. Si le nombre soumis TPS est supérieur au nombre engagé TPS et que la file d'attente continue de croître, le déploiement est surchargé même si de courts échantillons semblent sains.

## Nombre de nœuds et quorum {#node-count-and-quorum}

Plus de validateurs améliorent la tolérance aux pannes, mais augmentent les coûts de coordination, de signature et de propagation sur le réseau. Le protocole de première version Sumeragi nécessite :

- un comité de vote exact `n = 3f + 1`
- `4 <= n <= 31`, donc les tailles valides sont 4, 7, 10, et ainsi de suite
- un quorum de validation de `2f + 1`
- les pairs du réseau observateur synchronisent les blocs mais ne votent pas, ne proposent pas et ne collectent pas

|Validateurs|Budget de défaut|Quorum de commit|Note de capacité|
| --- | --- | --- | --- |
| 4 | 1 | 3 |Minimum commun pour une tolérance à une faute|
| 7 | 2 | 5 |Plus résilient, avec plus de trafic de votes et de propagation|
| 10 | 3 | 7 |Coût de coordination plus élevé ; le réglage du réseau et de l'entrée importe davantage|
| 31 | 10 | 21 |Comité de première publication maximum ; coordination de référence et coût de signature avec soin|

la génération et la validation initiale de la blockchain rejettent les tailles de comité non conformes ; ne pas évaluer une topologie que la version ne peut pas accepter.

Lors de l'évaluation des « nœuds X », séparez les validateurs votants des observateurs. Ajouter des observateurs coûte généralement moins cher que d'ajouter des validateurs, mais les observateurs consomment toujours la propagation des blocs, la synchronisation des blocs, l'espace disque et la bande passante réseau.

## Facteurs qui influencent la performance {#factors-that-influence-performance}

### Forme de la charge de travail {#workload-shape}

Le même TPS peut être bon marché ou cher selon ce que fait chaque transaction. Enregistrer :

- nombre d'instructions par transaction
- nombre de signatures et algorithmes de signature
- taille en octets de la transaction et taille de la charge utile décompressée
- ratio lecture/écriture
- taille des métadonnées et opérations sur les ressources
- contrat intelligent, déclencheur et coût d'exécution de IVM
- requête en cours d'exécution contre les mêmes pairs du réseau

Les petites transactions de transfert ne sont pas un indicateur des charges de travail riches en contrats ou en métadonnées.

### Cadence de consensus {#consensus-cadence}

La vue des données à un instant donné du paramètre Sumeragi effectif contient la cadence de bloc immuable signée et la limite de dérive de l'horloge :

- `block_cadence_ms`
- `max_clock_drift_ms`

Inspectez-les avec :

```bash
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi params
```

`block_cadence_ms` est engagé par la genèse de la blockchain signée et figé au démarrage ; ce n’est pas un réglage actif. Comparez les réseaux avec différents inputs de genèse de blockchain signés uniquement comme des scénarios de référence séparés. Une fois que des changements de vue, des récupérations de charge utile manquante ou une contre-pression apparaissent, une cadence plus courte rend généralement la surcharge plus visible plutôt que d'augmenter le débit durable.

### Candidat et limites d'entrée {#candidate-and-ingress-bounds}

Les limites locales au nœud Sumeragi déterminent combien de travaux candidats et de récupération un validateur peut conserver :

- `sumeragi.block.max_transactions`
- `sumeragi.block.max_payload_bytes`
- `sumeragi.block.proposal_queue_scan_multiplier`
- `sumeragi.queues.commands`
- `sumeragi.queues.bodies` et `sumeragi.queues.body_bytes`
- `sumeragi.queues.body_source_bytes`, `sumeragi.queues.chunks` et `sumeragi.queues.ready_bodies`

Des limites trop petites créent une pression sur la file d'attente ou la récupération des charges utiles ; des limites surdimensionnées augmentent la mémoire retenue et la quantité de travail disponible pour un réseau abusif pair. Comparez la vue des données diagnostics à un instant donné avec la mémoire du processus, la gestion des messages et les métriques du corps manquant avant de modifier une limite à la fois :

```bash
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi diagnostics
```

### Conditions du réseau {#network-conditions}

La performance du consensus est sensible à :

- RTT entre validateurs
- gigue et perte de paquets
- bande passante pour les charges utiles de blocs et les segments signés RS16
- liens asymétriques entre les régions
- NAT, pare-feu ou comportement de relais qui retarde la connectivité des pairs sur le réseau

Comme règle de planification, fixez le budget de latence suffisamment élevé pour couvrir plusieurs allers-retours du validateur plus le temps d'exécution et de validation sur le disque. Si le p95 du réseau RTT est déjà proche de la latence de validation p95 souhaitée, l'objectif n'est pas réaliste.

### Files d'attente et limites d'admission {#queues-and-admission-limits}

Les paramètres d'admission et de file d'attente définissent combien de pression de rafale un pair du réseau peut absorber :

- `queue.capacity`
- `queue.capacity_per_user`
- `queue.max_retained_bytes`
- `queue.transaction_time_to_live_ms`
- limites des transactions de genèse, comme le nombre maximal de signatures, d’instructions, d’octets et d’octets décompressés
- plafonds de file d'attente p2p et limites d'entrée de consensus

Une grande capacité de file d'attente peut cacher une surcharge pendant un certain temps, mais elle n'augmente pas le débit durable. Une file stable est saine ; une file en croissance est un retard accumulé.

### Matériel et Stockage {#hardware-and-storage}

Mesurez chaque validateur, pas seulement le leader :

- CPU saturation pendant la validation, la vérification de la signature et l'exécution
- pression mémoire provenant des files d'attente, des vues de données à un instant donné et des tampons de récupération de charges utiles
- latence d'écriture disque pour le stockage en blocs et les vues de données ponctuelles
- saturation de transmission/réception réseau
- paramètres d'accélération matérielle optionnels lorsqu'ils sont utilisés par la charge de travail

Le validateur votant le plus lent peut déterminer la latence en bout de réseau.

## Signaux de Prométhée {#prometheus-signals}

Les noms des métriques proviennent du catalogue de télémétrie enregistré. La disponibilité des séries et l'échantillonnage dépendent toujours des fonctionnalités de construction et de `telemetry_profile`, donc inspectez `/metrics` sur le nœud cible avant de créer un tableau de bord.

Les signaux courants incluent :

|Signal|Exemples de Prometheus|Que regarder|
| --- | --- | --- |
|Débit accepté| `sum(rate(txs{type="accepted"}[5m]))` |Doit atteindre ou dépasser l'objectif TPS à l'état stable|
|Rejets| `sum(rate(txs{type="rejected"}[5m]))` |Devrait pouvoir être expliqué par le plan de test|
|Latence de validation| `histogram_quantile(0.95, sum(rate(commit_time_ms_bucket[5m])) by (le))` |Comparer p95/p99 avec le budget de latence|
|Profondeur de la file d'attente| `queue_size`, `sumeragi_tx_queue_depth` |Doit rester limité pendant la charge de pointe|
|Saturation de la file| `sumeragi_tx_queue_saturated` |Des valeurs non nulles soutenues signifient une surcharge|
|Changements de vue| `view_changes`, `sumeragi_view_change_suggest_total`, `sumeragi_view_change_install_total` |Une hausse signale des problèmes de temporisation, de topologie, de charge utile ou de réseau|
|Messages perdus| `dropped_messages`, `sumeragi_consensus_message_handling_total` |Les baisses pendant la charge expliquent généralement les pics de latence|
|Charge utile et récupération DA| `sumeragi_missing_block_requests`, `sumeragi_missing_block_oldest_ms`, `sumeragi_missing_block_fetch_total`, `sumeragi_da_gate_block_total`, `sumeragi_da_gate_satisfied_total` |Des demandes persistantes, un âge croissant ou des portes DA répétées indiquent des problèmes d'acquisition de corps ou de morceaux|
|Quorum de commit| `sumeragi_commit_signatures_counted`, `sumeragi_commit_signatures_required` |Les signatures comptées devraient atteindre rapidement le quorum requis|

Lorsqu’une métrique n’existe que dans `/v1/sumeragi/status`, capturez la vue des données à un instant donné JSON dans les mêmes artefacts de l’exécution que le scrape de Prometheus.

## Flux de travail d'estimation {#estimation-workflow}

1. Définir le scénario :
   - nombre de validateurs et nombre d'observateurs
   - mode de consensus
   - cible TPS
   - budgets de latence des commits p95 et p99
   - composition des transactions
   - réseau prévu RTT, gigue et bande passante
2. Enregistrez la configuration effective :

   ```bash
   iroha --config ./localnet/client.toml \
     --operator-private-key-file "$OPERATOR_KEY_FILE" \
     --output-format json ops sumeragi params \
     > artifacts/sumeragi-params.json
   iroha --config ./localnet/client.toml \
     --operator-private-key-file "$OPERATOR_KEY_FILE" \
     --output-format json ops sumeragi status \
     > artifacts/sumeragi-status.json
   iroha --config ./localnet/client.toml \
     --operator-private-key-file "$OPERATOR_KEY_FILE" \
     --output-format json ops sumeragi diagnostics \
     > artifacts/sumeragi-diagnostics.json
   ```

3. Exécutez la charge de travail sur la cible TPS.
4. Capturez le statut et les métriques au début, au milieu et à la fin de l'exécution.
5. Classez l’exécution à l’aide du tableau des plages de performance.
6. Si la bande est Moyenne ou Basse, changez un facteur à la fois et répétez.

## Modèle de rapport de référence {#benchmark-report-template}

Publiez les chiffres de performance uniquement avec suffisamment de contexte pour les reproduire :

- Iroha valider, publier et indicateurs de fonctionnalité
- comptes de validateurs et d'observateurs
- mode de consensus, cadence des blocs signés et disposition DA
- comité exact `3f + 1`, quorum et liste des observateurs
- `sumeragi.block`, `sumeragi.queues`, `sumeragi.limits`, limites d'entrée du réseau et de la file d'attente des transactions
- profil de télémétrie
- matériel, stockage et détails OS
- réseau RTT, gigue, perte et hypothèses de bande passante
- répartition des transactions et tailles des charges
- offert TPS et durée d'exécution
- accepté/rejeté TPS
- latence de commit p50/p95/p99
- profondeur de file d'attente et saturation
- voir les modifications, les messages abandonnés, les récupérations de blocs manquants et les compteurs DA-gate
- CPU, utilisation de la mémoire, du disque et du réseau par validateur

Sans ces détails, un numéro TPS devrait être considéré comme anecdotique.

## Pages liées {#related-pages}

- [Test de Chaos avec Izanami](./chaos-testing.md)
- [Torii API points de terminaison](../../reference/torii-endpoints.md)
- [Faire fonctionner Iroha 3 via CLI](../../get-started/operate-iroha-via-cli.md)
- [référence de configuration des pairs réseau](../../reference/peer-config/params.md)
