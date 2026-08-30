---
translation_locale: fr
translation_source: /reference/iroha3d-cli.md
translation_source_hash: d621aa09f50cb44cb99af372100f418c44c3714b879a556038e47598949a3a6f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` est le daemon de pair standard Iroha 3. Le paquet Cargo s'appelle `irohad`, alors invoquez le binaire à partir d'une vérification source avec:

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

Pour le réseau de test public Taira, l'image de sortie utilise `iroha3d_taira`. Elle accepte le même CLI. Il impose également la chaîne canonique Taira, l'ensemble de validateurs, les paramètres de stockage et les clés de signature en temps d'exécution. Valider une configuration Taira sans ouvrir les informations d'identification de l'exécution comme suit:

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

L'exploitant doit rendre le profil canonique Taira avant utilisation. Le modèle enregistré a des paramètres d'exemple. L'opérateur doit remplacer chaque réglage d'exemple. N'utilisez pas les réglages génériques Nexus ou de production SoraFS lors des essais contre Taira.

## `--config` {#arg-config}

- Type: parcours de fichier
- Nom de famille: `-c`

Parcours vers la configuration [peer](/fr/reference/peer-config/index.md).

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- Type: parcours de fichier

Manifeste de génèse facultatif JSON utilisé pour la validation par consensus.

## `--check-config` {#arg-check-config}

Valider la configuration résolue et le matériel de génèse disponible, puis sortir sans connexion de prise réseau.

## Sceaux de qualification Kagemusha {#kagemusha-qualification-seals}

Ces options de file-path nécessitent `--check-config` et effectuent une qualification Kagemusha complète avant d'écrire un sceau canonique:

- `--write-kagemusha-catalog-qualification-seal <PATH>` qualifie le catalogue.
- `--write-kagemusha-validator-qualification-seal <PATH>` qualifie le validateur local à l'égard de la réservation de promotion signée.

Les deux options d'étanchéité sont en conflit.

## `--trace-config` {#arg-trace-config}

- Type: drapeau
- Environnement: `TRACE_CONFIG`

Activer les journaux de suivi pendant la lecture et l'analyse des couches de configuration.

## `--config-blake3` {#arg-config-blake3}

- Type: digeste hexadecimal BLAKE3 à 64 chiffres
- Les exigences: `--config`

Exiger que les octets du fichier de configuration correspondent au digeste fourni. Un fichier lié à l'intégrité doit être aplanié; il ne peut contenir `extends`.

## `--terminal-colors` {#arg-terminal-colors}

- Type: Boolean, présenté comme `--terminal-colors=true` ou `--terminal-colors=false`
- Par défaut: détection de la capacité du terminal
- Environnement: `TERMINAL_COLORS`

Résultats de commande couleur ANSI.

## `--language` {#arg-language}

- Type: chaîne

Supprimez le langage du système utilisé pour les messages de démons.

## `--sora` {#arg-sora}

- Type: drapeau
- Environnement: `IROHA_SORA_PROFILE`

Activer le profil Sora Nexus. Ce profil configure le SoraFS, la poignée de main du SoraNet et le consensus à plusieurs voies. Invoquez toujours le lanceur Taira avec ce drapeau.

## FastPQ dépassements {#fastpq-overrides}

`--fastpq-execution-mode <MODE>` et `--fastpq-poseidon-mode <MODE>` n'acceptent que `cpu` ou `gpu`. Les options restantes prévalent sur les étiquettes de télémétrie:

- `--fastpq-device-class <LABEL>`
- `--fastpq-chip-family <LABEL>`
- `--fastpq-gpu-kind <LABEL>`

À titre d'exemple:

```shell
iroha3d --fastpq-execution-mode gpu \
  --fastpq-poseidon-mode cpu \
  --fastpq-device-class apple-m4 \
  --fastpq-chip-family m4 \
  --fastpq-gpu-kind integrated
```

## L'aide générée {#generated-help}

La sortie complète ci-dessous est générée à partir de l'engagement source Iroha fixé.

<<< @/snippets/iroha3d-help.md
