---
translation_locale: fr
translation_source: /reference/irohad-cli.md
translation_source_hash: 184b15bb99f4be90c1f2ae6980d480bf1170590a2febf80f4b92fe9dfd76f7c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `irohad` CLI {#irohad-cli}

`irohad` démarre un Iroha 3 daemon de pairs.

```shell
irohad --config path/to/config.toml
```

## `--config` {#arg-config}

- Type: Voie du fichier
- Nom de famille: `-c`

Voie vers le fichier [ de configuration ](/fr/reference/peer-config/index.md).

```shell
irohad --config path/to/iroha.toml
```

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- Type: Voie du fichier

Voie optionnelle vers un fichier de manifeste génèse JSON. Utilisez ceci lorsque le déploiement valide le démarrage contre un manifeste généré par Kagami.

```shell
irohad --config path/to/iroha.toml --genesis-manifest-json path/to/genesis.manifest.json
```

## `--trace-config` {#arg-trace-config}

Il permet de suivre les journaux de lecture et d'analyse des configurations. Cela peut être utile pour résoudre les problèmes de configuration.

- Type: drapeau
- ENV: `TRACE_CONFIG`

```shell
irohad --trace-config
```

## `--terminal-colors` {#arg-terminal-colors}

- Type: Boolean, soit `--terminal-colors=false` ou `--terminal-colors=true`
- Par défaut: prise en charge du terminal de détection automatique
- ENV: `TERMINAL_COLORS`

Activer ou non la sortie en couleur ANSI.

Par défaut, Iroha détermine si le terminal prend en charge la sortie couleur ou non.

Pour désactiver explicitement les couleurs:

```shell
irohad --terminal-colors=false

# or via env

export TERMINAL_COLORS=false
irohad
```

## `--language` {#arg-language}

- Type: cordes

Supprimez le langage du système utilisé pour les messages de démons.

```shell
irohad --language en-US
```

## `--sora` {#arg-sora}

- Type: drapeau

Activer le profil de fonctionnalité Sora Nexus pour SoraFS, la poignée de main SoraNet et les flux de consensus sur plusieurs voies.

```shell
irohad --config path/to/iroha.toml --sora
```

## `--fastpq-execution-mode` {#arg-fastpq-execution-mode}

- Type: `auto`, `cpu`, ou `gpu`

Remplacez le mode d'exécution du prover FASTPQ.

```shell
irohad --fastpq-execution-mode auto
```

## `--fastpq-poseidon-mode` {#arg-fastpq-poseidon-mode}

- Type: `auto`, `cpu`, ou `gpu`

Remplacez FASTPQ le mode pipeline Poseidon.

```shell
irohad --fastpq-poseidon-mode cpu
```

## `--fastpq-device-class` {#arg-fastpq-device-class}

- Type: cordes

Supprimer l'étiquette FASTPQ de la classe des dispositifs de télémétrie.

```shell
irohad --fastpq-device-class apple-m4
```

## `--fastpq-chip-family` {#arg-fastpq-chip-family}

- Type: cordes

Supprimer l'étiquette de famille des puces de télémétrie FASTPQ.

```shell
irohad --fastpq-chip-family m4
```

## `--fastpq-gpu-kind` {#arg-fastpq-gpu-kind}

- Type: cordes

Il est nécessaire d'annuler l'étiquette FASTPQ de type télémétrie GPU.

```shell
irohad --fastpq-gpu-kind integrated
```
