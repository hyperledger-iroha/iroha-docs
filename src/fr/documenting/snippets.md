---
translation_locale: fr
translation_source: /documenting/snippets.md
translation_source_hash: e188082e05db85d5e514b782f93648fb402a09740840c9201e47db353f2192f5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Snippets de code {#code-snippets}

Les extraits générés gardent des exemples liés au code, à la configuration et aux schémas de
le Iroha révision qui les a produites.

## Un réconfort Iroha Artéfacts {#refreshing-iroha-artifacts}

Iroha- les extraits dérivés sont vérifiés afin que les constructions de sites ordinaires ne nécessitent pas
accès au réseau ou à un référentiel frère.

```bash
pnpm refresh:iroha --source /path/to/iroha
```

Les enregistrés
[`etc/refresh-iroha.ts`](https://github.com/hyperledger-iroha/iroha-docs/blob/main/etc/refresh-iroha.ts)
le flux de travail vérifie la vérification des sources propres par rapport à `provenance/iroha.json`,
régénère `/src/snippets` et le Torii OpenAPI une photo instantanée et des mises à jour SHA-256
Les modifications du contenu et de la provenance sont révisées ensemble.
installation et VitePress Les constructions consomment les fichiers enregistrés sans
Il vient chercher une branche mutable.

## Comprenant des fragments {#including-snippets}

Utilisez le
[VitePress syntaxe des extraits de code](https://vitepress.dev/guide/markdown#import-code-snippets)
pour inclure la source générée ou locale:

```md
<<< @/snippets/client.template.toml
```

Une région de code nommée peut être incluse en ajoutant son nom de région:

```md
<<< @/example_code/lorem.rs#ipsum
```

Gardez les exemples écrits à la main petits.
interfaces, modèles de configuration, schémas générés et sortie des commandes.
