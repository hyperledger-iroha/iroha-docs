---
translation_locale: fr
translation_source: /documenting/snippets.md
translation_source_hash: 48d6670f100c7c6368fa03f163c9ff9e0322d36e51c22f89562b23b0e2ee2a2f
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Extraits de code {#code-snippets}

Les extraits générés maintiennent les exemples liés au code, à la configuration et aux schémas de la révision Iroha qui les a produits.

## Actualisation des artefacts Iroha {#refreshing-iroha-artifacts}

Les extraits dérivés de Iroha sont validés afin que les compilations de site ordinaires ne nécessitent pas d'accès réseau ni de référentiel frère. Actualisez-les explicitement :

```bash
pnpm refresh:iroha --source /path/to/iroha
```

Le flux de travail `etc/refresh-iroha.ts` validé vérifie le checkout de source propre par rapport à `provenance/iroha.json`, régénère `/src/snippets` et la vue de données à un instant Torii OpenAPI, et met à jour les hachages cryptographiques SHA-256. Examinez ensemble les modifications de contenu et de provenance. L'installation normale des dépendances et les compilations VitePress consomment les fichiers enregistrés sans récupérer de branche mutable.

## Inclure des extraits {#including-snippets}

Utilisez le [VitePress syntaxe de fragment de code](https://vitepress.dev/guide/markdown#import-code-snippets) pour inclure la source générée ou locale :

```md
<<< @/snippets/client.template.toml
```

Une région de code nommée peut être incluse en ajoutant le nom de sa région :

```md
<<< @/example_code/lorem.rs#ipsum
```

Gardez les exemples manuscrits petits. Préférez les artefacts source actualisés pour les interfaces publiques, les modèles de configuration, les schémas générés et la sortie des commandes.
