---
translation_locale: fr
translation_source: /reference/peer-config/index.md
translation_source_hash: 5cc6ddf62a45f655d61a0ff3ebc7e20b939fe78c9d542087b717c2e17e19250d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Configuration Iroha {#configuring-iroha}

La configuration de pair locale est définie en TOML C'est différent de la chaîne
la configuration a changé à travers [`SetParameter`](/fr/blockchain/instructions.md#setparameter)
Le comportement de production doit être représenté dans un fichier de configuration
ou un paramètre en chaîne; les variables d'environnement ne sont pas des portes de fonctionnement.

Utilisation [`--config`](../irohad-cli#arg-config) CLI argument pour spécifier le chemin vers le fichier de configuration.

## Template {#template}

Pour une description détaillée de chaque paramètre, veuillez consulter le [Paramètres](./params.md) de référence.

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## Composition des fichiers de configuration {#composing-configuration-files}

TOML les fichiers de configuration ont un `extends` champ, pointant vers d'autres TOML Il peut s'agir d'un seul chemin ou
plusieurs voies:

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha lire de manière récurrente tous les fichiers spécifiés dans `extends` et les rangons en couches, où ceux-ci recouvrent
les données précédentes au niveau d'un paramètre. `config.toml`:

::: code-group

```toml [config.toml]
extends = ["a.toml", "b.toml"]

[torii]
address = "0.0.0.0:8080"
```

```toml [a.toml]
chain = "whatever"
```

```toml [b.toml]
[torii]
address = "localhost:4000"
max_content_len = 2048
```

:::

The la configuration résultante sera `chain` à partir `a.toml`, `max_content_len` à partir `b.toml`, et `torii.address` à partir
`config.toml` (surcrits) `b.toml`).

## Résolution des problèmes {#troubleshooting}

Passage [`--trace-config`](../irohad-cli#arg-trace-config) CLI flag pour voir une trace de la façon dont la configuration est lue et analysée.
