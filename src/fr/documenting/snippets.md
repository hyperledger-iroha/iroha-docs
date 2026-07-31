---
translation_locale: fr
translation_source: /documenting/snippets.md
translation_source_hash: e188082e05db85d5e514b782f93648fb402a09740840c9201e47db353f2192f5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Des extraits de code {#code-snippets}

Les extraits générés tiennent des exemples liés au code, à la configuration et aux schémas de la révision Iroha qui les a produits.

## Artéfacts de rafraîchissement Iroha {#refreshing-iroha-artifacts}

Les extraits dérivés de Iroha sont vérifiés dans les constructions de sites ordinaires qui ne nécessitent pas d'accès au réseau ou un référentiel frère.

```bash
pnpm refresh:iroha --source /path/to/iroha
```

Les personnes enregistrées [`etc/refresh-iroha.ts`](https://github.com/hyperledger-iroha/iroha-docs/blob/main/etc/refresh-iroha.ts) le flux de travail vérifie la vérification des sources propres par rapport aux `provenance/iroha.json`, régénère `/src/snippets` et le Torii OpenAPI une capture d'écran et des mises à jour SHA-256 Haches. Révisez les changements de contenu et d'origine ensemble. VitePress Les constructions consomment les fichiers enregistrés sans obtenir une branche mutable.

## Comprenant les fragments {#including-snippets}

Utilisez la syntaxe [VitePress code-snippet](https://vitepress.dev/guide/markdown#import-code-snippets) pour inclure les sources générées ou locales:

```md
<<< @/snippets/client.template.toml
```

Une région de code nommée peut être incluse en y ajoutant le nom de la région:

```md
<<< @/example_code/lorem.rs#ipsum
```

Gardez les exemples écrits à la main petits. préférer des artefacts de source mis à jour pour les interfaces publiques, modèles de configuration, schémas générés et sortie de commandes.
