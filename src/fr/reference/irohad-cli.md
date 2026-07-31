---
translation_locale: fr
translation_source: /reference/irohad-cli.md
translation_source_hash: 184b15bb99f4be90c1f2ae6980d480bf1170590a2febf80f4b92fe9dfd76f7c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `irohad` CLI {#irohad-cli}

`irohad` commence une Iroha 3 Le démons de l'âge.

```shell
irohad --config path/to/config.toml
```

## `--config` {#arg-config}

- **Type:** Voie du fichier
- **Le prénom:** `-c`

Le chemin de la [la configuration](/fr/reference/peer-config/index.md) Le dossier.

```shell
irohad --config path/to/iroha.toml
```

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- **Type:** Voie du fichier

Voie facultative vers un manifeste génétique JSON Utilisez ceci lorsque le déploiement
valide le démarrage par rapport à un manifeste généré par Kagami.

```shell
irohad --config path/to/iroha.toml --genesis-manifest-json path/to/genesis.manifest.json
```

## `--trace-config` {#arg-trace-config}

Il permet de suivre les journaux de lecture et d'analyse des configurations. Cela peut être utile pour résoudre les problèmes de configuration.

- **Type:** drapeau
- **ENV:** `TRACE_CONFIG`

```shell
irohad --trace-config
```

## `--terminal-colors` {#arg-terminal-colors}

- **Type:** Boolean, aussi bien `--terminal-colors=false` ou
  `--terminal-colors=true`
- **Par défaut:** support du terminal de détection automatique
- **ENV:** `TERMINAL_COLORS`

La possibilité d'activer ANSI- de couleur ou non.

Par défaut, Iroha détermine si le terminal prend en charge la sortie colorée
ou pas.

Pour désactiver explicitement les couleurs:

```shell
irohad --terminal-colors=false

# or via env

export TERMINAL_COLORS=false
irohad
```

## `--language` {#arg-language}

- **Type:** Chaîne à cordes

Remplacez le langage système utilisé pour les messages démoniaques.

```shell
irohad --language en-US
```

## `--sora` {#arg-sora}

- **Type:** drapeau

Activer le Sora Nexus profil de caractéristique pour SoraFS, le SoraNet une poignée de main, et
des flux de consensus à plusieurs voies.

```shell
irohad --config path/to/iroha.toml --sora
```

## `--fastpq-execution-mode` {#arg-fastpq-execution-mode}

- **Type:** `auto`, `cpu`, ou `gpu`

Remplacement FASTPQ mode d'exécution du prover.

```shell
irohad --fastpq-execution-mode auto
```

## `--fastpq-poseidon-mode` {#arg-fastpq-poseidon-mode}

- **Type:** `auto`, `cpu`, ou `gpu`

Remplacement FASTPQ Le mode pipeline Poseidon.

```shell
irohad --fastpq-poseidon-mode cpu
```

## `--fastpq-device-class` {#arg-fastpq-device-class}

- **Type:** Chaîne à cordes

Remplacez le FASTPQ étiquette de classe des dispositifs de télémétrie.

```shell
irohad --fastpq-device-class apple-m4
```

## `--fastpq-chip-family` {#arg-fastpq-chip-family}

- **Type:** Chaîne à cordes

Remplacez le FASTPQ étiquette familiale des puces de télémétrie.

```shell
irohad --fastpq-chip-family m4
```

## `--fastpq-gpu-kind` {#arg-fastpq-gpu-kind}

- **Type:** Chaîne à cordes

Remplacez le FASTPQ télémétrie GPU- Une sorte d'étiquette.

```shell
irohad --fastpq-gpu-kind integrated
```
