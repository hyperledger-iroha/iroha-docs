---
translation_locale: fr
translation_source: /blockchain/expressions.md
translation_source_hash: 8ad29a13df0efcc68b21323a48cfbcd71ab25b97c063709c827b08422cd9aad0
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Expressions, conditionnelles, logique {#expressions-conditionals-logic}

Tous les [Iroha Opérations d'instruction](./instructions.md) fonctionnent sur des expressions. Chaque expression a un `EvaluatesTo`, qui est utilisé dans l'exécution des instructions. Bien que vous puissiez spécifier le nom du compte Directement, vous pouvez également spécifier l'identifiant du compte via une opération mathématique ou sur les chaînes de caractères. Vous pouvez également vérifier si un compte est enregistré sur la blockchain.

En utilisant des expressions qui mettent en œuvre `EvaluatesTo<bool>`, vous pouvez configurer une logique conditionnelle et exécuter des opérations plus sophistiquées sur la chaîne. Par exemple, vous pouvez soumettre une instruction `Mint` uniquement si un compte spécifique est enregistré.

Rappelez-vous que vous pouvez combiner cela avec des requêtes, et, en tant que tel, vous pouvez programmer la blockchain pour faire des choses incroyables. C'est ce que nous appelons des contrats intelligents, la caractéristique définissante de l'utilisation avancée de la technologie blockchain.
