---
translation_locale: fr
translation_source: /blockchain/expressions.md
translation_source_hash: 8ad29a13df0efcc68b21323a48cfbcd71ab25b97c063709c827b08422cd9aad0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Les expressions, les conditions et la logique {#expressions-conditionals-logic}

Tout le monde [Iroha Instructions spéciales](./instructions.md) L'objectif de l'expression est d'utiliser les `EvaluatesTo`, Bien que vous puissiez spécifier le nom du compte directement, vous pourriez également spécifier le compte ID Vous pouvez vérifier si un compte est enregistré sur la blockchain aussi.

En utilisant des expressions qui mettent en œuvre `EvaluatesTo<bool>`, vous pouvez configurer une logique conditionnelle et exécuter des opérations plus sophistiquées sur chaîne. Par exemple, vous ne pouvez soumettre une instruction `Mint` que si un compte spécifique est enregistré.

Rappelez-vous que vous pouvez combiner cela avec des requêtes, et en tant que tel, vous pouvez programmer la blockchain pour faire des choses incroyables. C'est ce que nous appelons des contrats intelligents, la caractéristique définitive de l'utilisation avancée de la technologie Blockchain.
