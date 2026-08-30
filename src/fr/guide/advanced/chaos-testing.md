---
translation_locale: fr
translation_source: /guide/advanced/chaos-testing.md
translation_source_hash: 5ceee448217a42e4f8bbae9595486b79019e7a880dfd0f2c71bf580409d0e4b9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Des tests de chaos avec Izanami {#chaos-testing-with-izanami}

Izanami est l'orchestrateur de chaosnet dans l'espace de travail Iroha en amont. Il démarre un cluster local jetable Iroha, soumet une charge de travail configurable et injecte des défauts dans des pairs sélectionnés afin que les opérateurs puissent vérifier si le réseau continue à progresser en cas de panne contrôlée.

Utilisez Izanami pour les vérifications de résilience pré-production, la reproduction en régression et l'ajustement du consensus. Ne le pointez pas vers un réseau de production: l'outil est conçu pour posséder les pairs qu'il démarre, y compris les redémarrages par pairs, les serviettes de stockage, les partitions temporaires de confiance des pairs et la pression discale locale CPU.

## Conditions préalables {#prerequisites}

Exécuter Izanami depuis le référentiel source [Iroha ](https://github.com/hyperledger-iroha/iroha), et non de ce référential de documentation:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build -p izanami
```

Le binaire doit être explicitement autorisé à créer et manipuler des pairs en réseau. Passer `--allow-net` pour chaque exécution non-TUI, ou activer `allow_net` dans le TUI.

```bash
cargo run -p izanami -- --allow-net --peers 4 --faulty 1 --duration 120s
```

Pour une configuration d'exécution interactive:

```bash
cargo run -p izanami -- --tui --allow-net
```

Izanami persiste les paramètres TUI et CLI dans le répertoire de configuration de l'utilisateur. Le fichier de première version a un octet explicite de mise en page V1; les réglages pré-édition ou autrement non versionnés sont rejetés et doivent être recréés plutôt que migrés. Revoir les paramètres affichés avant de réutiliser un profil actuel.

## Exécution de base {#baseline-run}

Commencez par une ligne de base reproductible avant d'ajouter des défauts graves:

```bash
cargo run -p izanami -- \
  --allow-net \
  --peers 4 \
  --faulty 1 \
  --duration 5m \
  --target-blocks 100 \
  --progress-interval 15s \
  --progress-timeout 120s \
  --latency-p95-threshold 2s \
  --tps 15 \
  --max-inflight 32 \
  --submitters 1 \
  --seed 42
```

Cette opération ne réussit que si le cluster atteint l'objectif de bloc demandé, continue à progresser dans le délai et reste en dessous du seuil d'intervalle de bloc optionnel p95.

Enregistrez la commande, le seed, Iroha commit, le nombre de pairs, le compte de pairs défectueux, le profil de charge de travail, la cible TPS et le seuil de latence avec les journaux. Sans ces valeurs, un autre opérateur ne peut pas reproduire le même modèle d'échec.

## Profils de charge de travail {#workload-profiles}

Izanami a deux profils de charge de travail:

|Le profil |Utilisez-le pour |Notes |
| -------- | -------------------------------------------------- | -------------------------------------- |
|`stable` |Longues séries d' immersion et vérifications de performances reproductibles |Favori des recettes sûres à l' exécution |
|`chaos` |Couverture des voies d'échec |Inclut des recettes intentionnellement invalides |

Utilisez d' abord le profil stable:

```bash
cargo run -p izanami -- --allow-net --workload-profile stable --seed 42
```

Passez au profil de chaos lorsque la ligne de base est déjà comprise:

```bash
cargo run -p izanami -- --allow-net --workload-profile chaos --seed 42
```

Les recettes de déploiement des contrats sont désactivées en séries stables, sauf autorisation explicite:

```bash
cargo run -p izanami -- \
  --allow-net \
  --workload-profile stable \
  --allow-contract-deploy-in-stable
```

Utiliser `--nexus` lorsque l'exécution doit utiliser les paramètres par défaut intégrés SORA Nexus de l'espace de travail en amont.

## Contrôles de défaut {#fault-controls}

Quand ? `--faulty` s'il est supérieur à zéro, au moins un scénario de défaut doit être activé. Fault toggles par défaut en activé, et les drapeaux booléens peuvent être désactivés avec `=false`.

|Faute |CLI drapeau |Ce qu' elle exerce |
| ------------------------ | ------------------------------------------ | ------------------------------------------ |
|Crash et redémarrage .|`--fault-enable-crash-restart` |Perte et récupération de processus par les pairs |
|Effacer le stockage et redémarrer |`--fault-enable-wipe-storage` |Récupération de l' état local disparu |
|Spam de transaction non valide |`--fault-enable-spam-invalid-transactions` |Route d'admission et de rejet |
|La latence du réseau |`--fault-enable-network-latency` |Des rumeurs lentes et des messages de consensus retardés .|
|Partition réseau |`--fault-enable-network-partition` |L' isolement temporaire entre pairs de confiance |
|CPU stress |`--fault-enable-cpu-stress` |Prise en charge de la validation locale et de la planification |
|La saturation du disque |`--fault-enable-disk-saturation` |Pressure de stockage locale |

Pour une mise en œuvre uniquement par partition réseau:

```bash
cargo run -p izanami -- \
  --allow-net \
  --peers 4 \
  --faulty 1 \
  --duration 5m \
  --fault-window-start 60s \
  --fault-window-end 180s \
  --tps 15 \
  --submitters 1 \
  --max-inflight 32 \
  --fault-enable-crash-restart=false \
  --fault-enable-wipe-storage=false \
  --fault-enable-spam-invalid-transactions=false \
  --fault-enable-network-latency=false \
  --fault-enable-network-partition=true \
  --fault-enable-cpu-stress=false \
  --fault-enable-disk-saturation=false \
  --seed 42
```

Utilisez `--fault-window-start` et `--fault-window-end` pour maintenir une période d'état stable contrôlée avant et après la défaillance injectée. Cela facilite la distinction entre le bruit de démarrage et l'effet du défaut.

## Les formes du scénario {#scenario-shapes}

Le catalogue Izanami en amont trace les formes communes d'échec de communication de la blockchain vers CLI profils.

|Scénario |La forme typique |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
|Charge ciblée |`--faulty 0`, haut de gamme `--tps`, un soumissionnaire, élevé `--max-inflight` |
|Une défaillance transitoire |Activer l'arrêt / redémarrage uniquement à l'intérieur d'une fenêtre de défaillance délimitée |
|Arrêt et récupération |Utiliser une grande population de pairs défectueux avec crash / redémarrage |
|Isolement des dirigeants |Utilisez exactement un homologue défectueux avec seulement la défaillance de partition réseau; Izanami suit Sumeragi leader télémétrie |

Gardez une variable fixe à la fois. Si vous changez le nombre de pairs, le profil de charge de travail, la fenêtre d'erreur et TPS en même temps, le résultat est difficile à interpréter.

## À quoi faire attention ? {#what-to-watch}

Pendant la course, surveillez les mêmes signaux utilisés pour la validation des performances:

- progression de la hauteur des blocs à travers tous les pairs en course
- les transactions soumises, acceptées, rejetées et épuisées
- profondeur de file d'attente, saturation de file et pression inversée du point final
- voir les modifications, les voies de récupération, les blocs manquants et les certificats de quorum manquants.
- le dossier de disponibilité signé RS16, les séances en attente et le trafic consensuel retardé;
- CPU, mémoire, disque et saturation du réseau sur l'hôte exécutant les pairs.

Pour l'analyse de la latence de validation, activer les journaux de débogage main-loop:

```bash
RUST_LOG=iroha_core::sumeragi::main_loop=debug \
  cargo run -p izanami -- --allow-net --seed 42
```

Chaque bloc doit émettre `block validation timings` avec `stateless_ms`, `execution_ms` et `total_ms`. Comparer ces délais avec les intervalles de blocs p95, les compteurs de changement de vue et la pression de file d'attente avant de changer les timers de consensus.

## Les résultats de l'interprétation {#interpreting-results}

Traiter une course comme saine lorsque tous les pairs sélectionnés continuent à commettre des blocs, le backlog ne croît pas sans limite et que les défauts cessent de provoquer une nouvelle activité de récupération après la fin de la fenêtre configurée.

Traiter une course comme un échec lorsque:

- les stands de progression des blocs plus longs que `--progress-timeout`
- les hauteurs des pairs divergent et ne se reconvergent pas
- une latence de p95 supérieure à `--latency-p95-threshold`
- Les files d'attente augmentent pour le reste de la course après la fermeture d'une fenêtre de défaillance
- Les opérations rejetées ou reportées ne sont pas expliquées par la charge de travail sélectionnée.
- le redémarrage par les pairs, l'effacement du stockage ou la récupération des partitions nécessitent un nettoyage manuel

Après une défaillance, redémarrer avec le même grain et un type de faille en moins. Cela permet de reproduire la charge de travail et le timing tout en restreignant la surface de défaillance.

## Pages connexes {#related-pages}

- [Performance et métriques](./metrics.md)
- [En fonctionnement Iroha sur le métal nu](./running-iroha-on-bare-metal.md)
- [points d'extrémité Torii](../../reference/torii-endpoints.md)
