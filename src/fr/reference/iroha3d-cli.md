---
translation_locale: fr
translation_source: /reference/iroha3d-cli.md
translation_source_hash: bf4a63b05a149f0c935190b63cdb838b0a0265e99baedfc9b5bf00a9e621b108
translation_status: machine-validated
translation_engine: bing-translator-llm
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

Utilisez la version fournie par l’opérateur du profil canonique de Taira ; le modèle enregistré contient encore des espaces réservés au déploiement. Ne lui substituez pas les paramètres génériques de Nexus ni les paramètres SoraFS de production lorsque vous effectuez des tests sur Taira.

## `--config` {#arg-config}

- Type : chemin de fichier
- Alias : `-c`

Chemin vers le [configuration des pairs réseau](/fr/reference/peer-config/index.md).

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- Type : chemin de fichier

Manifeste technique de genèse de blockchain optionnel JSON utilisé pour la validation du consensus.

## `--check-config` {#arg-check-config}

Validez la configuration résolue et le matériel de genèse blockchain disponible, puis quittez sans lier de sockets réseau.

## Sceaux de qualification Kagemusha {#kagemusha-qualification-seals}

Ces options de chemin de fichier nécessitent `--check-config` et effectuent une qualification complète de Kagemusha avant d'écrire un sceau canonique :

- `--write-kagemusha-catalog-qualification-seal <PATH>` qualifie le catalogue.
- `--write-kagemusha-validator-qualification-seal <PATH>` qualifie le validateur local par rapport à la réservation de promotion signée configurée.

Les deux options de sceau sont en conflit l'une avec l'autre.

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

Activez le profil Sora Nexus utilisé par SoraFS, la poignée de main SoraNet et le consensus multi-voies. Le lanceur Taira est toujours invoqué avec ce drapeau.

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

Le résumé des options ci-dessus est vérifié par rapport aux définitions actuelles des arguments `iroha3d`. La vue des données générée à un instant précis contrôlée n'est intentionnellement pas affichée tant que son statut de provenance est en attente. Pour inspecter l'aide exacte pour votre extraction, exécutez :

```shell
cargo run --locked -p irohad --bin iroha3d -- --help
```
