---
translation_locale: fr
translation_source: /reference/iroha3d-cli.md
translation_source_hash: 846370e45fe0e0d605016d6722b1d50c39981f954c7d9040b87fc385eb12ac68
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` est le daemon pair réseau standard Iroha 3. Le paquet Cargo s'appelle `irohad`, donc invoquez le binaire à partir d'une copie de travail du code source avec :

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

Pour le testnet public Taira, l’image de publication utilise `iroha3d_taira`. Elle accepte la même CLI, mais impose aussi le profil canonique de Taira pour la chaîne, les validateurs, le stockage et le signataire de l’environnement d’exécution. Validez une configuration Taira sans ouvrir les identifiants de cet environnement comme ceci :

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

Utilisez la version fournie par l’opérateur du profil canonique de Taira ; le modèle enregistré contient encore des espaces réservés au déploiement. Ne lui substituez pas les paramètres génériques de SORA Nexus ni les paramètres SoraFS de production lorsque vous effectuez des tests sur Taira.

## `--config` {#arg-config}

- Type : chemin de fichier
- Alias : `-c`

Chemin vers le [configuration des pairs réseau](/fr/reference/peer-config/index.md).

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- Type : chemin de fichier

Manifeste technique de genèse de blockchain optionnel JSON utilisé pour la validation du consensus.

## `--check-config` {#arg-check-config}

Validez la configuration résolue et le matériel de genèse blockchain disponible, puis quittez sans lier de sockets réseau.

## `--json` {#arg-json}

- **Type :** option booléenne
- **Exige :** `--check-config`

Afficher les valeurs de compatibilité de cette version compilée et de cette configuration sous la forme d'un objet Norito JSON unique, à la place de la ligne `Ready` ou `Pending`.

## `--check-storage` {#arg-check-storage}

- **Type :** option booléenne
- **Incompatible avec :** `--check-config`

Inspecter en lecture seule le stockage Kura du nœud arrêté et son instantané le plus récent avec les décodeurs de cette version compilée, afficher le résultat sous la forme d'un objet Norito JSON unique et terminer avec un code non nul en cas d'échec. Le contrôle prend le verrou racine du stockage Kura ; il refuse donc un stockage détenu par un nœud en cours d'exécution. Il ne modifie jamais le stockage et n'ouvre jamais les secrets réservés à l'exécution.

## `--check-replay` {#arg-check-replay}

- **Type :** option booléenne
- **Incompatible avec :** `--check-config`, `--check-storage`

Rejouer une copie du stockage du nœud arrêté avec cette version compilée et afficher le résultat sous la forme d'un objet Norito JSON unique. La commande copie les blocs dans un répertoire temporaire, y restaure l'instantané le plus récent ou réexécute la genèse signée, puis réexécute tous les blocs ultérieurs. Elle termine avec un code non nul si un bloc ne reproduit pas son résultat certifié ou si le corps d'un bloc nécessaire manque ; elle n'écrit jamais dans le stockage et n'ouvre jamais les secrets réservés à l'exécution.

## `--require-genesis-inrou-deployment-authority` {#arg-require-genesis-inrou-deployment-authority}

- **Type :** identifiant de compte
- **Exige :** `--check-config`

Pendant la validation hors ligne, exiger que ce compte enregistré conserve l'autorité de déploiement SoraCloud après l'exécution de la genèse signée exacte.

## `--sumeragi-assert-fresh-key` {#arg-sumeragi-assert-fresh-key}

- **Type :** option booléenne

Déclarer, pour ce démarrage uniquement, que les clés de consensus du nœud n'ont jamais signé pour cette chaîne. Sumeragi conserve un enregistrement de sécurité par clé ; sans cet enregistrement, il ne signe rien tant qu'il n'a pas la preuve que l'enregistrement n'a pas été perdu. Fournissez cette option une seule fois, au premier démarrage d'une nouvelle clé, et jamais après une perte de données.

## `--trace-config` {#arg-trace-config}

- Type : drapeau
- Environnement : `TRACE_CONFIG`

Activer les journaux de trace pendant que les couches de configuration sont lues et analysées.

## `--config-blake3` {#arg-config-blake3}

- Type : valeur de condensé cryptographique hexadécimal à 64 chiffres BLAKE3
- Exige : `--config`

Exiger que les octets du fichier de configuration correspondent à la valeur du condensé cryptographique fourni. Un fichier à intégrité contraignante doit être aplati ; il ne peut pas contenir `extends`.

## `--terminal-colors` {#arg-terminal-colors}

- Type : Booléen, passé comme `--terminal-colors=true` ou `--terminal-colors=false`
- Par défaut : détection des capacités du terminal
- Environnement : `TERMINAL_COLORS`

Contrôler la sortie de couleur ANSI.

## `--language` {#arg-language}

- Type : chaîne

Remplacer la langue du système utilisée pour les messages du démon.

## `--sora` {#arg-sora}

- Type : drapeau
- Environnement : `IROHA_SORA_PROFILE`

Activer le profil SORA Nexus utilisé par SoraFS, la négociation SoraNet et le consensus à plusieurs voies. Le lanceur Taira est toujours appelé avec cette option.

## FastPQ remplacements {#fastpq-overrides}

`--fastpq-execution-mode <MODE>` et `--fastpq-poseidon-mode <MODE>` n'acceptent que `cpu` ou `gpu`. Les autres options remplacent les étiquettes de télémétrie :

- `--fastpq-device-class <LABEL>`
- `--fastpq-chip-family <LABEL>`
- `--fastpq-gpu-kind <LABEL>`

Par exemple :

```shell
iroha3d --fastpq-execution-mode gpu \
  --fastpq-poseidon-mode cpu \
  --fastpq-device-class apple-m4 \
  --fastpq-chip-family m4 \
  --fastpq-gpu-kind integrated
```

## Aide générée {#generated-help}

Le résumé des options ci-dessus suit les définitions des arguments de `iroha3d` au commit Iroha fixé. Pour consulter l'aide exacte de votre copie de travail, exécutez :

```shell
cargo run --locked -p irohad --bin iroha3d -- --help
```
