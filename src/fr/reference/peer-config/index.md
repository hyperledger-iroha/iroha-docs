---
translation_locale: fr
translation_source: /reference/peer-config/index.md
translation_source_hash: dd44f8f12cc456d6f37e1ceb3e82cf4a979e80115c75e28dcb1fe4f29469aaf4
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Configuration de Iroha {#configuring-iroha}

La configuration des pairs du réseau local est définie dans TOML fichiers. Cela est différent de la configuration sur la chaîne modifiée via [`SetParameter`](/fr/blockchain/instructions.md#setparameter) instructions. Le comportement de production doit être représenté dans une configuration fichier ou un paramètre sur la chaîne ; les variables d'environnement ne sont pas des portes de fonctionnalité.

Utiliser [`--config`](../iroha3d-cli#arg-config) CLI argument pour spécifier le chemin vers le fichier de configuration.

## Modèle {#template}

Pour une description détaillée de chaque paramètre, veuillez vous référer à la référence [Paramètres](./params.md).

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## Composer des fichiers de configuration {#composing-configuration-files}

Les fichiers de configuration TOML ont un champ supplémentaire `extends`, pointant vers d'autres fichiers TOML. Il peut s'agir d'un seul chemin ou de plusieurs chemins :

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha lira récursivement tous les fichiers spécifiés dans `extends` et les composera en couches, où les derniers écraseront les précédents au niveau des paramètres. Par exemple, si l'on lit `config.toml` :

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

La configuration résultante sera `chain` de `a.toml`, `max_content_len` de `b.toml`, et `torii.address` de `config.toml` (remplace `b.toml`).

## Dépannage {#troubleshooting}

Passer [`--trace-config`](../iroha3d-cli#arg-trace-config) CLI indicateur pour voir une trace de la façon dont la configuration est lue et analysée.
