---
translation_locale: fr
translation_source: /guide/advanced/chaos-testing.md
translation_source_hash: 5ceee448217a42e4f8bbae9595486b79019e7a880dfd0f2c71bf580409d0e4b9
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Test de Chaos avec Izanami {#chaos-testing-with-izanami}

Izanami est l’orchestrateur du réseau de chaos dans l’espace de travail source d’Iroha. Il démarre un cluster Iroha local jetable, soumet une charge de travail configurable et injecte des défaillances dans des pairs sélectionnés afin que les opérateurs puissent vérifier que le réseau continue à progresser dans des conditions de panne contrôlées.

Utilisez Izanami pour les vérifications de résilience en pré-production, la reproduction de régressions et le réglage du consensus. Ne le dirigez pas vers un réseau de production : l'outil est conçu posséder les pairs du réseau qu'il démarre, y compris les redémarrages des pairs du réseau, les effacements de stockage, les partitions temporaires de pairs de confiance et la pression locale CPU ou sur le disque.

## Prérequis {#prerequisites}

Exécutez Izanami depuis le [Iroha dépôt source](https://github.com/hyperledger-iroha/iroha), pas depuis ce dépôt de documentation :

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build -p izanami
```

Le binaire doit être explicitement autorisé à créer et à manipuler des pairs réseau connectés. Passez `--allow-net` pour chaque exécution non-TUI, ou activez `allow_net` dans le TUI.

```bash
cargo run -p izanami -- --allow-net --peers 4 --faulty 1 --duration 120s
```

Pour une configuration d'exécution interactive :

```bash
cargo run -p izanami -- --tui --allow-net
```

Izanami conserve les paramètres TUI et CLI sous le répertoire de configuration utilisateur. Le fichier de première version contient un octet de disposition V1 explicite ; les paramètres préliminaires ou autrement non versionnés sont rejetés et doivent être recréés plutôt que migrés. Vérifiez les paramètres affichés avant de réutiliser un profil actuel.

## Exécution de référence {#baseline-run}

Commencez avec une ligne de base reproductible avant d'ajouter des défauts graves :

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

Cette exécution réussit uniquement si le cluster atteint la cible de bloc demandée, continue de progresser dans le délai imparti et reste en dessous du seuil optionnel de l'intervalle de bloc p95.

Enregistrez la commande, la graine, le commit Iroha, le nombre de pairs du réseau, le nombre de pairs défectueux, le profil de charge de travail, la cible TPS et le seuil de latence avec les journaux. Sans ces valeurs, un autre opérateur ne peut pas rejouer le même schéma de panne.

## Profils de charge de travail {#workload-profiles}

Izanami a deux profils de charge de travail :

|Profil|Utilisez-le pour| Notes |
| -------- | -------------------------------------------------- | -------------------------------------- |
| `stable` |Longues courses d'endurance et contrôles de performance reproductibles|Favorise les recettes sûres pour l'exécution|
| `chaos`  |Couverture des chemins de défaillance|Inclut des recettes intentionnellement invalides|

Utilisez d'abord le profil stable :

```bash
cargo run -p izanami -- --allow-net --workload-profile stable --seed 42
```

Passez au profil chaos lorsque la ligne de base est déjà comprise :

```bash
cargo run -p izanami -- --allow-net --workload-profile chaos --seed 42
```

Les recettes de déploiement de contrat sont désactivées dans les exécutions stables sauf si elles sont explicitement autorisées :

```bash
cargo run -p izanami -- \
  --allow-net \
  --workload-profile stable \
  --allow-contract-deploy-in-stable
```

Utilisez `--nexus` lorsque l'exécution doit utiliser les valeurs par défaut SORA Nexus intégrées provenant de l'espace de travail en amont.

## Contrôles de faille {#fault-controls}

Lorsque `--faulty` est supérieur à zéro, au moins un scénario de faute doit être activé. Les bascules de faute sont activées par défaut, et les indicateurs booléens peuvent être désactivés avec `=false`.

|Faute| CLI drapeau                                   |Ce qu'il exerce|
| ------------------------ | ------------------------------------------ | ------------------------------------------ |
|Planter et redémarrer| `--fault-enable-crash-restart`             |perte et récupération du processus de pair réseau|
|Effacer le stockage et redémarrer| `--fault-enable-wipe-storage`              |Récupération après perte de l'état local|
|Spam de transaction invalide| `--fault-enable-spam-invalid-transactions` |Chemins d'admission et de rejet|
|Latence réseau| `--fault-enable-network-latency`           |Rumeurs lentes et messages de consensus retardés|
|Partition de réseau| `--fault-enable-network-partition`         |Isolement temporaire des pairs de confiance|
| CPU stress               | `--fault-enable-cpu-stress`                |Validation locale et pression sur la planification|
|Saturation du disque| `--fault-enable-disk-saturation`           |Pression de stockage local|

Pour une exécution uniquement de partition de réseau :

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

Utilisez `--fault-window-start` et `--fault-window-end` pour maintenir une période à l'état stable contrôlé avant et après la défaillance injectée. Cela facilite la distinction entre le bruit du démarrage et l'effet de la panne.

## Formes de scénario {#scenario-shapes}

Le catalogue Izanami en amont cartographie les formes courantes de défaillance de communication blockchain vers des profils CLI. Vous pouvez les modéliser avec les mêmes indicateurs :

|Scénario|Forme typique|
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
|Charge ciblée| `--faulty 0`, élevé `--tps`, un soumetteur, élevé `--max-inflight` |
|Échec transitoire|Activer le crash/redémarrage uniquement à l'intérieur d'une fenêtre de défaillance limitée|
|Arrêt et récupération|Utilisez une grande population de pairs défectueux avec crash/redémarrage|
|Isolement du leader|Utilisez exactement un seul pair réseau défectueux avec uniquement le défaut de partition réseau ; Izanami suit la télémétrie du leader Sumeragi|

Gardez une variable fixe à la fois. Si vous modifiez le nombre de pairs du réseau, le profil de charge de travail, la fenêtre de défaut et TPS dans la même exécution, le résultat est difficile à interpréter.

## Que regarder {#what-to-watch}

Pendant l'exécution, surveillez les mêmes signaux utilisés pour la validation des performances :

- progression de la hauteur de bloc sur chaque pair réseau en cours d'exécution
- transactions soumises, acceptées, rejetées et expirées
- profondeur de la file d'attente, saturation de la file d'attente, et contre-pression du point de terminaison API
- afficher les modifications, les chemins de récupération, les blocs manquants et les certificats de quorum manquants
- arriéré de disponibilité signé RS16, sessions en attente et trafic de consensus retardé
- CPU, saturation de la mémoire, du disque et du réseau sur l'hôte exécutant les pairs du réseau

Pour l'analyse de la latence de validation, activez les journaux de débogage de la boucle principale :

```bash
RUST_LOG=iroha_core::sumeragi::main_loop=debug \
  cargo run -p izanami -- --allow-net --seed 42
```

Chaque bloc doit émettre `block validation timings` avec `stateless_ms`, `execution_ms`, et `total_ms`. Comparez ces timings avec les intervalles de blocs p95, les compteurs de changement de vue, et la pression de la file d'attente avant de modifier les minuteries de consensus.

## Interprétation des résultats {#interpreting-results}

Considérez qu'une exécution est saine lorsque tous les pairs du réseau sélectionnés continuent de valider des blocs, que l'arriéré ne croît pas indéfiniment et que les défauts cessent de provoquer de nouvelles activités de récupération après la fin de la fenêtre configurée.

Considérez une course comme un échec lorsque :

- le blocage du progrès dure plus longtemps que `--progress-timeout`
- les hauteurs des pairs du réseau divergent et ne se rejoignent pas
- La latence p95 dépasse `--latency-p95-threshold`
- les files d'attente augmentent pour le reste de l'exécution après la fermeture d'une fenêtre de faute
- Les transactions rejetées ou expirées ne sont pas expliquées par la charge de travail sélectionnée
- Le redémarrage d’un pair réseau, l’effacement du stockage ou la récupération de partition nécessite un nettoyage manuel

Après un échec, relancez avec la même graine et un type de faute en moins. Cela permet de garder la charge de travail et le timing reproductibles tout en réduisant la surface de défaillance.

## Pages liées {#related-pages}

- [Performance et mesures](./metrics.md)
- [Exécution de Iroha sur du matériel nu](./running-iroha-on-bare-metal.md)
- [Torii API points de terminaison](../../reference/torii-endpoints.md)
