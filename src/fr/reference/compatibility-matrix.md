---
translation_locale: fr
translation_source: /reference/compatibility-matrix.md
translation_source_hash: 5928eaf7e65023ad1867ca8d125efa61da6d8fe505b91e71b2c2121b183ce06e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Matrice de compatibilité {#compatibility-matrix}

La matrice de compatibilité montre la croisée SDK couverture des scénarios pour le courant Iroha 3 docs configurés. Par défaut, la page charge la vue de données ponctuelle groupée générée à partir des éléments épinglés [`hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha) révision.

La matrice se compose de :

- Histoires dans la première colonne
- SDKs à travers les colonnes restantes
- Symboles de statut pour les données couvertes, échouées et manquantes

Seuls les résultats vérifiés par le flux de travail de rafraîchissement sont signalés comme couverts ou échoués. Les scénarios sans preuve pour la révision épinglée sont affichés comme données manquantes plutôt que d'hériter des résultats d'une autre révision source.

<CompatibilityMatrixTable />

::: info
Définissez `VITE_COMPAT_MATRIX_URL` uniquement pour remplacer la vue de données ponctuelles incluse par un backend en direct compatible. Sans cette variable, la page charge `src/public/compat-matrix.json`.
:::
