---
translation_locale: fr
translation_source: /guide/advanced/chaos-testing.md
translation_source_hash: dfd2d4196827da3563e377baae2fb823871d7a2c293dfafb6dc4de37f9ddbc61
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Des tests de chaos avec Izanami {#chaos-testing-with-izanami}

Izanami est l'orchestrateur de chaosnet dans le courant d'eau. Iroha l'espace de travail.
démarre un local jetable Iroha cluster, soumet une charge de travail configurable,
et injecte des défauts dans des pairs sélectionnés afin que les opérateurs puissent vérifier si le
Le réseau continue de progresser en cas d'échec contrôlé.

Utiliser Izanami pour les contrôles de résilience pré-production, la reproduction en régression,
Ne le pointez pas vers un réseau de production: l'outil est
conçu pour posséder les pairs qu'il démarre, y compris le redémarrage par paires, le stockage
les serviettes, la perte artificielle des paquets et le local CPU ou la pression du disque.

## Préalabilités {#prerequisites}

Exécutez Izanami à partir du
[Iroha référentiel source](https://github.com/hyperledger-iroha/iroha),
pas dans ce référentiel de documentation:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build -p izanami
```

Le binaire doit être explicitement autorisé à créer et manipuler des réseaux
Les pairs. `--allow-net` pour chaque non-TUI fonctionner ou activer `allow_net` dans
le TUI.

```bash
cargo run -p izanami -- --allow-net --peers 4 --faulty 1 --duration 120s
```

Pour une configuration d'exécution interactive:

```bash
cargo run -p izanami -- --tui --allow-net
```

Izanami persiste . TUI et CLI les paramètres dans le répertoire de configuration des utilisateurs, donc
examiner les paramètres affichés avant de réutiliser un profil précédent.

## Exécution de la ligne de base {#baseline-run}

Commencez par une base reproductible avant d'ajouter des défauts graves:

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

Cette opération ne réussit que si le cluster atteint l'objectif de bloc demandé,
continue de progresser dans le délai et reste sous la limite facultative p95
le seuil d'intervalle de blocage.

Enregistre le commandement, Semence. Iroha commet, compte des pairs, nombre de pairs défectueux,
profil de la charge de travail, cible TPS, et le seuil de latence avec les journaux.
Ces valeurs, un autre opérateur ne peut pas reproduire le même schéma de défaillance.

## Profils de charge de travail {#workload-profiles}

Izanami a deux profils de charge de travail:

| Le profil  | Utilisez-le pour                                         | Notes                                  |
| -------- | -------------------------------------------------- | -------------------------------------- |
| `stable` | Longues courses de trempage et contrôles reproductibles des performances | Les recettes favorables à l'exécution          |
| `chaos`  | Couverture des voies d'échec                              | Inclut des recettes intentionnellement invalides |

Utilisez d' abord le profil stable:

```bash
cargo run -p izanami -- --allow-net --workload-profile stable --seed 42
```

Passez au profil du chaos lorsque la ligne de base est déjà comprise:

```bash
cargo run -p izanami -- --allow-net --workload-profile chaos --seed 42
```

Les recettes de déploiement des contrats sont désactivées en cours stables sauf explicitement
permis:

```bash
cargo run -p izanami -- \
  --allow-net \
  --workload-profile stable \
  --allow-contract-deploy-in-stable
```

Utilisation `--nexus` lorsque la course doit utiliser le système intégré SORA Nexus les défauts de
l'espace de travail en amont.

## Contrôle des défauts {#fault-controls}

Quand ? `--faulty` est supérieur à zéro, au moins un scénario de défaut doit être
Fault toggles par défaut à activé, et les drapeaux booléens peuvent être
handicapés avec `=false`.

| La faute                    | CLI drapeau                                   | Ce qu'il exerce                          |
| ------------------------ | ------------------------------------------ | ------------------------------------------ |
| Crash et redémarrage        | `--fault-enable-crash-restart`             | Perte et récupération par processus de peer             |
| Éliminer le stockage et redémarrer | `--fault-enable-wipe-storage`              | Récupération de l'état local disparu          |
| Spam de transaction non valide | `--fault-enable-spam-invalid-transactions` | Les voies d'admission et de rejet              |
| La latence du réseau          | `--fault-enable-network-latency`           | Des rumeurs et des messages de consensus retardés |
| Partition réseau        | `--fault-enable-network-partition`         | Isolement temporaire par des pairs de confiance           |
| P2P perte de paquets          | `--fault-enable-network-packet-loss`       | Traffic de la structure d'application diminué          |
| CPU le stress               | `--fault-enable-cpu-stress`                | La pression de validation et de planification locale   |
| Satisfaction du disque          | `--fault-enable-disk-saturation`           | Pression de stockage locale                     |

Pour une course à perte de paquets uniquement:

```bash
cargo run -p izanami -- \
  --allow-net \
  --peers 20 \
  --faulty 5 \
  --duration 800s \
  --fault-window-start 133s \
  --fault-window-end 266s \
  --tps 200 \
  --submitters 20 \
  --max-inflight 512 \
  --fault-enable-crash-restart=false \
  --fault-enable-wipe-storage=false \
  --fault-enable-spam-invalid-transactions=false \
  --fault-enable-network-latency=false \
  --fault-enable-network-partition=false \
  --fault-enable-network-packet-loss=true \
  --fault-enable-cpu-stress=false \
  --fault-enable-disk-saturation=false \
  --fault-network-packet-loss-percent 75 \
  --seed 42
```

Utilisation `--fault-window-start` et `--fault-window-end` pour maintenir un contrôle
période d'état stable avant et après l'échec injecté.
plus facile de distinguer le bruit de démarrage de l'effet du défaut.

## Les formes du scénario {#scenario-shapes}

Le catalogue Izanami en amont présente les défaillances courantes de la communication blockchain
forme à CLI Vous pouvez les modéliser avec les mêmes drapeaux:

| Scénario              | Forme typique                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Charge ciblée         | `--faulty 0`, haut `--tps`, un soumissionnaire, haut `--max-inflight`                                                         |
| Échec transitoire     | Activer l'accident/réinitialisation uniquement à l'intérieur d'une fenêtre de défaillance limitée                                                                  |
| Perte de paquets           | N'activer que la perte de paquets, généralement avec le taux de perte par défaut de 75%                                                          |
| Arrêt et récupération | Utiliser une grande population de pairs défectueux avec crash/restart                                                                    |
| Isolement des dirigeants      | Utilisez exactement un paire défectueux avec seulement des défauts de partition réseau ou de perte de paquets; Izanami suit Sumeragi télémétrie de leader |

Gardez une variable fixe à la fois. Si vous changez le nombre de pairs,
profil, fenêtre de défaillance et TPS En même temps, le résultat est difficile à
l'interprète.

## À quoi regarder ? {#what-to-watch}

Pendant la course, surveillez les mêmes signaux utilisés pour la validation des performances:

- progression de la hauteur des blocs à travers tous les pairs en course
- transactions soumises, acceptées, rejetées et épuisées
- profondeur de file d'attente, saturation des files d'attention et contre-pression du point final
- voir les changements, les voies de récupération, les blocs manquants et le quorum manquant
  certificats
- RBC retard, séances en attente et trafic de consensus diminué ou retardé
- CPU, mémoire, disque et saturation du réseau sur l'hôte exécutant les pairs

Pour l'analyse de la latence de validation, activer les journaux de débogage main-loop:

```bash
RUST_LOG=iroha_core::sumeragi::main_loop=debug \
  cargo run -p izanami -- --allow-net --seed 42
```

Chaque bloc doit émettre `block validation timings` avec `stateless_ms`,
`execution_ms`, et `total_ms`. Comparer ces timings avec le bloc p95
intervalles, compteurs de changement de vue et pression en file d'attente avant le changement
les délais de consensus.

## Interprétation des résultats {#interpreting-results}

Traiter une course comme saine lorsque tous les pairs sélectionnés continuent à commettre des blocages,
l'arriéré ne croît pas sans limite et les défauts cessent de provoquer une nouvelle récupération
activité après la fin de la fenêtre configurée.

Traiter une course comme un échec lorsque:

- blocs de progression plus longs que `--progress-timeout`
- les hauteurs des pairs divergent et ne se reconvergent pas
- dépasse la latence p95 `--latency-p95-threshold`
- Les files d'attente augmentent pour le reste de la course après la fermeture d'une fenêtre de faille
- Les transactions rejetées ou reportées ne sont pas expliquées par les options sélectionnées
  charge de travail
- Le redémarrage par paire, l'effacement du stockage ou la récupération de perte de paquets nécessitent un démarrage manuel.
  le nettoyage

Après un échec, redémarrer avec le même grain et un type de défaut en moins.
Il permet de reproduire la charge de travail et le timing tout en réduisant les défaillances.
à la surface.

## Pages connexes {#related-pages}

- [Performance et métriques](./metrics.md)
- [Randonnée Iroha sur le métal nu](./running-iroha-on-bare-metal.md)
- [Torii points de fin](../../reference/torii-endpoints.md)
