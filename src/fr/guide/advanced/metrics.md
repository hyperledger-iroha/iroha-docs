---
translation_locale: fr
translation_source: /guide/advanced/metrics.md
translation_source_hash: 868481b9f7482e936d6c7013557c7ff5334c7bb93fabf74d6eb726e526fb4e43
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Les performances et les mesures {#performance-and-metrics}

Les performances de Iroha dépendent de la charge de travail, de la topologie du validateur, des conditions du réseau et des paramètres de consensus. Un seul numéro TPS n'est donc utile que lorsqu'il est lié à une mise en œuvre de référence avec une configuration fixe.

Pour la planification des capacités, considérer le rendement comme une enveloppe opérationnelle:

- le réseau accepte le taux de transaction demandé;
- engager des séjours de latence dans le budget cible
- Les files d'attente de transaction restent limitées
- Le consensus ne repose pas sur des modifications répétées de la vue ou des voies de récupération.

Utilisez cette page pour estimer si un déploiement est dans un état de performances élevées, moyennes ou faibles pour un nombre donné de nœuds, le seuil de latence du réseau et la cible TPS.

## Ce qu'il faut mesurer {#what-to-measure}

Commencez par les surfaces de l'opérateur exposées par Torii:

```bash
export TORII=http://127.0.0.1:8180

curl -s "$TORII/status" | jq .
curl -s -H 'Accept: application/json' "$TORII/v1/sumeragi/status" | jq .
curl -s "$TORII/v1/sumeragi/phases" | jq .
curl -s "$TORII/v1/sumeragi/rbc" | jq .
curl -s "$TORII/v1/sumeragi/params" | jq .
curl -s "$TORII/metrics" > metrics.prom
```

Vous pouvez essayer le même schéma de lecture uniquement contre public Taira:

```bash
TAIRA=https://taira.sora.org

curl -fsS "$TAIRA/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA/v1/time/status" \
  | jq '{healthy: .health.healthy, peers, samples_used, rtt_count: .rtt.count}'

curl -fsS "$TAIRA/metrics" \
  | grep -E '^(block_height|queue_size|sumeragi_tx_queue_depth|txs|view_changes)' \
  | head -n 20
```

Les mesures publiques Taira sont utiles pour apprendre les noms des signaux. Ne les utilisez pas comme numéros de capacité de production pour votre propre déploiement.

Les mêmes instantanés de consensus sont disponibles via le CLI:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
iroha --config ./localnet/client.toml ops sumeragi params
```

La visibilité de la télémétrie dépend du profil configuré. Utilisez `extended` lorsque vous avez besoin de `/metrics`, et utilisez `full` pendant les essais lorsque vous avez également besoin des routes détaillées de l'opérateur Sumeragi.

```toml
telemetry_enabled = true
telemetry_profile = "full"
```

## Bandes de performance {#performance-bands}

Utilisez ces bandes pour une exécution observée à un débit cible `Y` TPS et un budget de latence `L` millisecondes. Exécutez la charge de travail assez longtemps pour inclure le réchauffement, l'état stable et au moins une période de charge maximale attendue.

|La bande |Conditions |Le sens .|
| --- | --- | --- |
|Très haut .|Le débit accepté est de `Y` ou supérieur, la latence d'engagement p95 est inférieure à `0.8 * L`, les files d'attente restent inférieures à 10% de la capacité et les compteurs de changement de vue/récupération sont plats.|Le déploiement dispose d'espace pour la charge de travail demandée |
|Moyenne|Le débit accepté est proche de `Y`, la latence d'engagement p95 est inférieure à `L`, les files d'attente sont stables en dessous de 50% de la capacité et les changements de vue sont rares. |Le déploiement fonctionne, mais il y a une tolérance d'explosion limitée |
|Faible .|Le débit accepté est inférieur à `Y`, la latence de commande p95 dépasse `L`, les files d'attente augmentent au cours de l'exécution ou les compteurs de changement de vue/de pression arrière augmentent continuellement.|La charge de travail demandée dépasse au moins un goulot d' évier |

La règle clé est la direction de la file d'attente. Si le TPS soumis est supérieur au TPS engagé et que la file continue de croître, le déploiement est surchargé même si les échantillons courts semblent sains.

## Le nombre et le quorum des nœuds {#node-count-and-quorum}

De plus en plus de validateurs améliorent la tolérance aux défauts, mais augmentent les coûts de coordination, de signature et de mise en réseau. Sumeragi mise en œuvre:

- Le nombre de validateurs `n` dérive du budget des défauts `f = floor((n - 1) / 3)`
- pour `n >= 4`, le quorum du comité est `2f + 1`
- pour `n <= 3`, tous les validateurs sont requis pour l'engagement
- Les pairs d'observateurs synchronisent des blocs mais ne votent pas, ne proposent pas ou ne collectent pas

|Vérificateurs |Budget défectueux |Compromettre le quorum |Note de capacité |
| --- | --- | --- | --- |
|1 à 3 |0 laissez-passer pratique hors ligne |tous les validateurs |Utilisée pour le développement et les petits essais; tout validateur manquant peut retarder les engagements |
| 4 | 1 | 3 |Minimum commun pour la tolérance à une seule faute |
| 7 | 2 | 5 |Plus résilient, avec plus de trafic de vote et de propagande |
| 10 | 3 | 7 |Un coût de coordination plus élevé; l'ajustement des réseaux et des collecteurs est plus important |

L'ajout d'observateurs coûte généralement moins cher que l'ajout de validateurs, mais les observateurs consomment toujours des bavardages de bloc, une synchronisation de bloc, un disque et une bande passante réseau.

## Les facteurs qui influencent le rendement {#factors-that-influence-performance}

### Forme de charge de travail {#workload-shape}

Le même TPS peut être bon marché ou coûteux en fonction de ce que chaque transaction fait.

- nombre d'instructions par transaction
- le nombre de signatures et les algorithmes de signature
- la taille des octets de transaction et la taille de la charge utile décompressée
- Le ratio lecture/écriture
- Taille des métadonnées et opérations d'actifs
- le coût de l'exécution du contrat intelligent, du déclencheur et IVM
- charge de requête en cours d'exécution contre les mêmes pairs

Les petites opérations de transfert ne sont pas un prétexte pour des charges de travail lourdes en termes de contrats ou de métadonnées.

### Timing du consensus {#consensus-timing}

Le temps Sumeragi est contrôlé par les paramètres effectifs Sumeragi:

- `block_time_ms` Il est nécessaire d'effectuer une vérification.
- `commit_time_ms`
- `min_finality_ms`
- `pacing_factor_bps`
- Temps de sortie des phases NPoS lorsque le mode NPoS est activé

Inspectez-les avec:

```bash
iroha --config ./localnet/client.toml ops sumeragi params
curl -s "$TORII/v1/sumeragi/params" | jq .
```

Les objectifs de synchronisation inférieure ne peuvent améliorer la latence que pendant que les couches réseau, de stockage et d'exécution peuvent suivre le rythme. Une fois que des modifications sont vues, qu'une charge utile manquante est récupérée ou que des contraintes apparaissent, la réduction du temps rend généralement les performances pires.

### Le collectionneur Fanout {#collector-fanout}

Les paramètres du collecteur influent sur la rapidité avec laquelle les votes d'engagement convergent:

- `sumeragi.collectors.k` contrôle le nombre de collecteurs qui rassemblent des voix par hauteur
- `sumeragi.collectors.redundant_send_r` contrôle le vote additionnel après un délai local
- `sumeragi.collectors.parallel_topology_fanout` ajoute une topologie à côté des collectionneurs

L'augmentation de la diffusion peut réduire la latence des filets dans les réseaux plus grands ou moins fiables, mais elle augmente également le trafic. Comparer la disponibilité globale et la télémétrie collectrice avec les mesures de latence et de contre-pression avant de changer ces valeurs:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

### Conditions du réseau {#network-conditions}

Les performances consensuelles sont sensibles à:

- RTT entre les validateurs
- nervosité et perte de paquets
- largeur de bande pour les charges utiles à bloc et RBC pièces
- des liens asymétriques entre les régions
- NAT, pare-feu ou comportement de relais qui retarde la connectivité par les pairs

En règle de planification, fixez le budget de latence suffisamment élevé pour couvrir plusieurs voyages aller-retour du validateur plus l'exécution et le temps d'engagement sur disque. Si le réseau p95 RTT est déjà proche de la latence d'engaissement p95 souhaitée, l'objectif n'est pas réaliste.

### Les files d'attente et les limites de l'entrée {#queues-and-admission-limits}

Les paramètres d'admission et de file d'attente définissent la quantité de pression d'éclatement qu'un groupe peut absorber:

- `queue.capacity`
- `queue.capacity_per_user`
- `queue.transaction_time_to_live_ms`
- limites de transaction génèse telles que la signature maximale, les instructions, les octets et les octets décomprimés.
- Caps de file d'attente p2p et limites d'entrée par consensus

Une haute capacité de file d'attente peut cacher une surcharge pendant un certain temps, mais elle n'augmente pas le débit durable.

### Le matériel et le stockage {#hardware-and-storage}

Mesurer tous les validateurs, pas seulement le leader:

- CPU saturation pendant la validation, la vérification de la signature et l'exécution
- pression de mémoire des files d'attente, des instantanés et des sessions actives RBC
- la latence d'écriture de disque pour le stockage des blocs et les instantanés
- saturation du réseau de transmission / réception
- réglages d'accélération matérielle optionnels lorsqu'ils sont utilisés par la charge de travail

Le validateur de vote le plus lent peut déterminer la latence du réseau.

## Les signaux de Prométhée {#prometheus-signals}

Les noms métriques peuvent varier selon le profil de construction et l'ensemble des fonctionnalités. Inspect `/metrics` sur votre nœud d'abord, puis construire des tableaux de bord autour des séries disponibles.

Les signaux communs sont les suivants:

|Le signal .|Les exemples de Prometheus |Qu' est-ce qu' il faut regarder ?|
| --- | --- | --- |
|Le débit accepté |`sum(rate(txs{type="accepted"}[5m]))` |Devaient atteindre ou dépasser l' objectif TPS en état de stabilité |
|Réjections |`sum(rate(txs{type="rejected"}[5m]))` |Il devrait être expliqué par le plan d'essai |
|Committez la latence |`histogram_quantile(0.95, sum(rate(commit_time_ms_bucket[5m])) by (le))` |Comparer p95/p99 avec le budget de latence |
|La profondeur de la queue | `queue_size`, `sumeragi_tx_queue_depth` |Il doit rester confiné pendant le pic de charge |
|saturation de la file d'attente |`sumeragi_tx_queue_saturated` |Les valeurs non zéro maintenues sont des moyennes de surcharge |
|Afficher les changements |`view_changes`, `sumeragi_view_change_suggest_total`, `sumeragi_view_change_install_total` |Les valeurs en hausse indiquent le timing, la topologie, la charge utile ou les problèmes de réseau |
|Les messages sont abandonnés | `dropped_messages`, `sumeragi_consensus_message_handling_total` |La baisse de la charge explique généralement les pics de latence |
|La pression RBC | `sumeragi_rbc_store_pressure`, `sumeragi_rbc_backpressure_deferrals_total` |Points de pression non zéro pour la récupération des charges utiles ou les embouteillages de stockage |
|Compromettre le quorum | `sumeragi_commit_signatures_counted`, `sumeragi_commit_signatures_required` |Les signatures comptées devraient rapidement atteindre le quorum requis .|

Lorsqu'une métrique n'existe que dans `/v1/sumeragi/status`, capturer l'instantané JSON dans les mêmes objets de course que le rayonnement Prometheus.

## Estimation du flux de travail {#estimation-workflow}

1. Définissez le scénario:
   - le nombre de validateurs et d'observateurs
   - mode de consensus
   - l'objectif TPS
   - Les budgets pour les engagements de latence p95 et p99
   - mélange de transactions
   - Réseau prévu RTT, jitter et bande passante
2. Enregistrer la configuration effective:

   ```bash
   iroha --config ./localnet/client.toml --output-format json ops sumeragi params \
     > artifacts/sumeragi-params.json
   curl -s "$TORII/v1/sumeragi/collectors" \
     > artifacts/sumeragi-collectors.json
   ```

3. Exécuter la charge de travail à l'objectif TPS.
4. Capture de l'état et des métriques au début, au milieu et à la fin de la course.
5. Classifier la course avec le tableau des bandes de performance.
6. Si la bande est moyenne ou basse, modifiez un facteur à la fois et répétez.

## Template de rapport de référence {#benchmark-report-template}

Publier des numéros de performance uniquement dans un contexte suffisant pour les reproduire:

- Iroha drapeaux d'engagement, de délivrance et de caractéristiques
- le nombre de validateurs et d'observateurs
- Mode de consensus et paramètres Sumeragi
- le collecteur `k`, l'envoi redondant `r`, et la finition de topologie
- profil de télémétrie
- le matériel, le stockage et les détails OS
- Réseau RTT, hypothèses de jitter, de perte et de bande passante
- taille du mélange des transactions et de la charge utile
- offert TPS et durée de fonctionnement
- accepté ou rejeté TPS
- P50/p95/p99 latence d'engagement
- profondeur de file d'attente et saturation
- voir les modifications, les messages abandonnés, la pression RBC et les compteurs de charge utile manquants
- CPU, utilisation de la mémoire, du disque et du réseau par validateur

Sans ces détails, un numéro TPS devrait être considéré comme anecdotique.

## Pages connexes {#related-pages}

- [Les tests de chaos avec Izanami ](./chaos-testing.md)
- [points d'extrémité Torii](../../reference/torii-endpoints.md)
- [L'opération Iroha 3 est effectuée par l'intermédiaire de CLI ](../../get-started/operate-iroha-via-cli.md)
- [Référence de configuration par rapport aux pairs ](../../reference/peer-config/params.md)
