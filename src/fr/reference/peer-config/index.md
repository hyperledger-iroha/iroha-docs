---
translation_locale: fr
translation_source: /reference/peer-config/index.md
translation_source_hash: 5cc6ddf62a45f655d61a0ff3ebc7e20b939fe78c9d542087b717c2e17e19250d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Configuration Iroha {#configuring-iroha}

La configuration locale des pairs est définie dans les fichiers TOML. Cela diffère de la configuration en chaîne modifiée par l'intermédiaire des instructions [`SetParameter`](/fr/blockchain/instructions.md#setparameter). Le comportement de production doit être représenté dans un fichier de configuration ou un paramètre en chaîne; les variables d'environnement ne sont pas des portes de fonctionnalité.

Utilisez l'argument [`--config`](../irohad-cli#arg-config) CLI pour spécifier le chemin vers le fichier de configuration.

## Template {#template}

Pour une description détaillée de chaque paramètre, veuillez vous référer à la référence [Paramètres](./params.md).

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## Composer des fichiers de configuration {#composing-configuration-files}

Les fichiers de configuration TOML ont un champ `extends` supplémentaire, pointant vers d'autres fichiers TOML (s). Il peut s'agir d'un seul chemin ou de plusieurs chemins:

::: groupe de codes

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha lit récursivement tous les fichiers spécifiés dans `extends` et les compose en couches, où ces dernières surécrivent les précédentes au niveau d'un paramètre. Par exemple, si la lecture de `config.toml`:

::: groupe de codes

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

La configuration qui en résulte sera: `chain` à partir `a.toml`, `max_content_len` à partir `b.toml`, et `torii.address` à partir `config.toml` (sur écriture) `b.toml`).

## Résolution des problèmes {#troubleshooting}

Passez le drapeau [`--trace-config`](../irohad-cli#arg-trace-config) CLI pour voir une trace de la façon dont la configuration est lue et analysée.
