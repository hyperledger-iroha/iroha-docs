---
translation_locale: fr
translation_source: /blockchain/expressions.md
translation_source_hash: 8ad29a13df0efcc68b21323a48cfbcd71ab25b97c063709c827b08422cd9aad0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Expressions, conditions, logique

Tout le monde [Iroha Instructions spéciales](./instructions.md) fonctionnent sur les expressions.
Chaque expression a une `EvaluatesTo`, qui est utilisé dans l'enseignement
Bien que vous puissiez spécifier le nom du compte directement,
Vous pouvez également spécifier l'identifiant de compte par une opération mathématique ou string.
peut vérifier si un compte est enregistré sur la blockchain aussi.

Utilisation d'expressions qui mettent en œuvre `EvaluatesTo<bool>`Tu peux t' y mettre .
L'exécution des opérations plus sophistiquées sur la chaîne.
par exemple, vous pouvez soumettre une `Mint` instruction uniquement si un compte spécifique est
enregistré.

Rappelez-vous que vous pouvez combiner cela avec des requêtes, et en tant que tel, vous pouvez programmer le
blockchain pour faire des choses incroyables. _le plus intelligent
Les contrats_, la caractéristique définitive de l'utilisation avancée de la blockchain
La technologie.
