---
translation_locale: fr
translation_source: /guide/advanced/metrics.md
translation_source_hash: 868481b9f7482e936d6c7013557c7ff5334c7bb93fabf74d6eb726e526fb4e43
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Performance et métriques {#performance-and-metrics}

Iroha Les performances dépendent de la charge de travail, de la topologie du validateur, du réseau
Les conditions et les paramètres de consensus. TPS Le numéro n'est donc utile que
lorsqu'il est lié à une mise en marche de référence avec une configuration fixe.

Pour la planification des capacités, considérer les performances comme une enveloppe opérationnelle:

- le réseau accepte le taux de transaction demandé
- s'engager à maintenir la latence dans le budget cible
- les files d'attente des transactions restent limitées
- le consensus ne repose pas sur des modifications répétées de la vue ou des voies de récupération

Utilisez cette page pour estimer si un déploiement est dans une haute, moyenne ou basse
l'état de performance pour un nombre donné de nœuds, le seuil de latence du réseau et la cible
TPS.

## Ce qu'il faut mesurer {#what-to-measure}

Commencez par les surfaces exposées par Torii:

```bash
export TORII=http://127.0.0.1:8180

curl -s "$TORII/status" | jq .
curl -s -H 'Accept: application/json' "$TORII/v1/sumeragi/status" | jq .
curl -s "$TORII/v1/sumeragi/phases" | jq .
curl -s "$TORII/v1/sumeragi/rbc" | jq .
curl -s "$TORII/v1/sumeragi/params" | jq .
curl -s "$TORII/metrics" > metrics.prom
```

Vous pouvez essayer le même schéma de lecture uniquement contre le public Taira:

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

Le public Taira Les métriques sont utiles pour apprendre les noms des signaux.
comme chiffres de la capacité de production pour votre déploiement.

Les mêmes instantanés de consensus sont disponibles via le CLI:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
iroha --config ./localnet/client.toml ops sumeragi params
```

La visibilité de télémétrie dépend du profil configuré. `extended` quand vous
besoin `/metrics`, et utilisation `full` pendant les essais lorsque vous avez également besoin des informations détaillées
Sumeragi les itinéraires des opérateurs.

```toml
telemetry_enabled = true
telemetry_profile = "full"
```

## Bandes de performance {#performance-bands}

Utilisez ces bandes pour une course observée à la capacité cible `Y` TPS et la latence
le budget `L` La charge de travail dure assez longtemps pour inclure le réchauffement,
état stable et au moins une période de charge maximale attendue.

| Groupe | Conditions | La signification |
| --- | --- | --- |
| En haut | Le débit accepté est au-dessus `Y`, la latence de commande p95 est inférieure `0.8 * L`, Les files d'attente restent inférieures à 10% de la capacité et les comptoirs de changement de vue/récupération sont plats | Le déploiement dispose d'espace pour la charge de travail demandée |
| Moyenne | Le débit accepté est proche de `Y`, la latence de commande p95 est inférieure `L`, Les files d'attente sont stables en dessous de 50% de la capacité et les changements de vue sont rares. | Le déploiement fonctionne, mais il y a une tolérance d'explosion limitée |
| Faible | Le débit accepté est inférieur `Y`, dépasse la latence de commande p95 `L`, Les files d'attente augmentent pendant la course ou les compteurs de changement de vue/de contrainte augmentent continuellement | La charge de travail demandée dépasse au moins un goulot d'étranglement |

La règle clé est la direction de la file d'attente. TPS est supérieur à celui engagé TPS
et la file d'attente continue de croître, le déploiement est surchargé même si des échantillons courts
Je suis en bonne santé.

## Compte des nœuds et quorum {#node-count-and-quorum}

Plus de validateurs améliorent la tolérance aux défauts mais augmentent la coordination, la signature,
Les coûts d'exploitation du réseau Sumeragi mise en œuvre:

- le nombre de validateurs `n` dérive le budget de la faute `f = floor((n - 1) / 3)`
- pour `n >= 4`, le quorum est `2f + 1`
- pour `n <= 3`, tous les validateurs sont requis pour l'engagement
- les pairs observateurs synchronisent des blocs mais ne votent pas, ne proposent pas ou ne collectent pas

| Validateurs | Budget défectueux | Commit quorum | Note de capacité |
| --- | --- | --- | --- |
| 1 à 3 | 0 décalage pratique hors ligne | tous les validateurs | Utilisée pour le développement et les petits essais; tout validateur manquant peut retarder les engagements |
| 4 | 1 | 3 | Minimum commun pour la tolérance à défaut unique |
| 7 | 2 | 5 | Plus résilient, avec plus de voix et de propagande |
| 10 | 3 | 7 | Coûts de coordination plus élevés; la mise au point des réseaux et des collecteurs est plus importante |

Lors de l'évaluation des "nœuds X", séparez les validateurs du vote des observateurs.
les observateurs coûtent généralement moins cher que l'ajout de validateurs, mais les observateur
Bloquer les plaisanteries, synchroniser le disque et la bande passante du réseau.

## Facteurs qui influencent les performances {#factors-that-influence-performance}

### Forme de charge de travail {#workload-shape}

La même chose TPS peuvent être bon marché ou coûteux selon ce que chaque transaction fait.
Le dossier:

- nombre d'instructions par transaction
- compte des signatures et des algorithmes de signature
- taille des octets de transaction et taille de la charge utile décompressée
- rapport lecture/écriture
- taille des métadonnées et opérations d'actifs
- contrat intelligent, déclencheur et IVM coût de l'exécution
- charge de requête en cours d'exécution contre les mêmes pairs

Les petites transactions de transfert ne sont pas un proxy pour les contrats lourds ou les métadonnées lourdes
les charges de travail.

### Timing du consensus {#consensus-timing}

Sumeragi Le calendrier est contrôlé par le Sumeragi Paramètres:

- `block_time_ms`
- `commit_time_ms`
- `min_finality_ms`
- `pacing_factor_bps`
- Les délais de phase NPoS lorsque le mode NPoS est activé

Inspectez-les avec:

```bash
iroha --config ./localnet/client.toml ops sumeragi params
curl -s "$TORII/v1/sumeragi/params" | jq .
```

Les objectifs de synchronisation plus faibles ne peuvent améliorer la latence que lorsque le réseau, le stockage
les couches d'exécution peuvent suivre. Une fois que vous voyez des changements, des récupérations de charge utile manquantes, ou
les contraintes apparaissent, la baisse des délais rend généralement les performances plus mauvaises.

### Le collectionneur Fanout {#collector-fanout}

Les paramètres des collecteurs influent sur la rapidité avec laquelle les votes d'engagement convergent:

- `sumeragi.collectors.k` contrôle le nombre de collecteurs qui rassemblent des voix par hauteur
- `sumeragi.collectors.redundant_send_r` Il s'agit d'un système de contrôle du vote supplémentaire après un
  délais locaux
- `sumeragi.collectors.parallel_topology_fanout` ajoute la topologie à côté de
  collecteurs

L'augmentation de la capacité peut réduire la latence de la queue dans les réseaux plus grands ou moins fiables,
Mais il augmente aussi le trafic.
télémétrie avec des indicateurs de latence et de pression inversée avant de modifier ces valeurs:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

### Conditions du réseau {#network-conditions}

Les performances consensuelles sont sensibles à:

- RTT entre les validateurs
- nervosité et perte de paquets
- bande passante pour les charges utiles de bloc et RBC les morceaux
- liens asymétriques entre les régions
- NAT, un pare-feu ou un comportement de relais qui retarde la connectivité entre pairs

En règle de planification, fixez le budget de latence suffisamment élevé pour couvrir plusieurs
les déplacements aller-retour du validateur plus l'exécution et le temps d'engagement du disque. RTT est
si la latence d'engagement est déjà proche de la latence souhaitée, l'objectif n'est pas réaliste.

### Les files d'attente et les limites d'entrée {#queues-and-admission-limits}

Les paramètres d'admission et de file d'attente définissent la quantité de pression d'éclatement qu'un paire peut absorber:

- `queue.capacity`
- `queue.capacity_per_user`
- `queue.transaction_time_to_live_ms`
- limitations de transaction génèse telles que les signatures maximales, les instructions, les octets et
  octets décomprimés
- Caps de file d'attente p2p et limites d'entrée par consensus

Une grande capacité de file d'attente peut cacher la surcharge pendant un certain temps, mais elle ne s'accroît pas
Une file d'attente stable est saine; une file de l'attente croissante est un arriéré.

### Le matériel et le stockage {#hardware-and-storage}

Mesurez tous les validateurs, pas seulement le leader:

- CPU saturation lors de la validation, de la vérification des signatures et de l'exécution
- la pression de mémoire des files d'attente, des instantanés et actives RBC séances
- la latence d'écriture de disque pour le stockage des blocs et les instantanés
- saturation du réseau de transmission/reception
- réglages d'accélération matérielle optionnels lorsqu'ils sont utilisés par la charge de travail

Le validateur de vote le plus lent peut déterminer la latence du réseau.

## Les signaux de Prométhée {#prometheus-signals}

Les noms métriques peuvent varier en fonction du profil et de l'ensemble des fonctionnalités. `/metrics` sur le
votre nœud d'abord, puis construire des tableaux de bord autour des séries disponibles.

Les signaux communs sont les suivants:

| Signal | Exemples de Prometheus | Ce qu'il faut regarder |
| --- | --- | --- |
| Résultats acceptés | `sum(rate(txs{type="accepted"}[5m]))` | Il devrait atteindre ou dépasser l'objectif TPS dans un état stable |
| Les refus | `sum(rate(txs{type="rejected"}[5m]))` | Il doit être expliqué par le plan d'essai |
| Committez la latence | `histogram_quantile(0.95, sum(rate(commit_time_ms_bucket[5m])) by (le))` | Comparer p95/p99 avec le budget de latence |
| Profondeur de file d'attente | `queue_size`, `sumeragi_tx_queue_depth` | Restez confinés pendant la charge maximale |
| Satisfaction de la file d'attente | `sumeragi_tx_queue_saturated` | Des valeurs moyennes non nulles maintenues |
| Afficher les changements | `view_changes`, `sumeragi_view_change_suggest_total`, `sumeragi_view_change_install_total` | Les valeurs en hausse indiquent le timing, la topologie, la charge utile ou les problèmes de réseau |
| Messages abandonnés | `dropped_messages`, `sumeragi_consensus_message_handling_total` | Les baisses de la charge expliquent généralement les pics de latence |
| RBC la pression | `sumeragi_rbc_store_pressure`, `sumeragi_rbc_backpressure_deferrals_total` | Points de pression non zéro pour la récupération ou le stockage des charges utiles |
| Commit quorum | `sumeragi_commit_signatures_counted`, `sumeragi_commit_signatures_required` | Les signatures comptées devraient rapidement atteindre le quorum requis |

Quand une métrique n'existe que dans `/v1/sumeragi/status`, saisir le JSON une capture d'écran
Les mêmes objets que les rayures de Prometheus.

## Estimation du flux de travail {#estimation-workflow}

1. Définissez le scénario:
   - le nombre de validateurs et d'observateurs
   - mode de consensus
   - cible TPS
   - Les budgets pour les délais d'engagement p95 et p99
   - mélange de transactions
   - réseau attendu RTT, le jitter et la bande passante
2. Enregistrer la configuration effective:

   ```bash
   iroha --config ./localnet/client.toml --output-format json ops sumeragi params \
     > artifacts/sumeragi-params.json
   curl -s "$TORII/v1/sumeragi/collectors" \
     > artifacts/sumeragi-collectors.json
   ```

3. Remplissez la charge de travail à la cible. TPS.
4. Capturez l'état et les mesures au début, au milieu et à la fin de la course.
5. Classifier la course avec le tableau des bandes de performance.
6. Si la bande est moyenne ou faible, changez un facteur à la fois et répétez.

## Template de rapport de référence {#benchmark-report-template}

Publier des chiffres de performance uniquement dans un contexte suffisant pour les reproduire:

- Iroha signes de mise en œuvre, de libération et de fonctionnalité
- le nombre de validateurs et d'observateurs
- mode de consensus et Sumeragi paramètres
- collecteur `k`, envoi redondant `r`, et de la topologie
- profil de télémétrie
- matériel, stockage et OS détails
- réseau RTT, les hypothèses de jitter, perte et bande passante
- mélange de transactions et taille de la charge utile
- offert TPS et durée de fonctionnement
- accepté/rejeté TPS
- la latence de mise en œuvre p50/p95/p99
- profondeur et saturation de la file d'attente
- voir les modifications, les messages abandonnés, RBC des compteurs de pression et de charge utile manquantes
- CPU, utilisation de la mémoire, du disque et du réseau par validateur

Sans ces détails, une TPS Le nombre de cas doit être considéré comme anecdotique.

## Pages connexes {#related-pages}

- [Des tests de chaos avec Izanami](./chaos-testing.md)
- [Torii points de fin](../../reference/torii-endpoints.md)
- [Opérer Iroha 3 par le biais CLI](../../get-started/operate-iroha-via-cli.md)
- [Références de configuration par les pairs](../../reference/peer-config/params.md)
