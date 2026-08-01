---
translation_locale: fr
translation_source: /reference/compatibility-matrix.md
translation_source_hash: 5928eaf7e65023ad1867ca8d125efa61da6d8fe505b91e71b2c2121b183ce06e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Matrice de compatibilité {#compatibility-matrix}

La matrice de compatibilité affiche la couverture des scénarios transversaux SDK pour l'ensemble actuel de documents Iroha 3. Par défaut, la page charge le snapshot regroupé généré à partir de la révision [`hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha) coincée.

La matrice est composée de:

- Les histoires de la première colonne
- SDKs dans les colonnes restantes
- Symboles d'état pour les données couvertes, manquantes ou non

Seuls les résultats vérifiés par le flux de travail de mise à jour sont signalés comme couverts ou échoués. Les scénarios sans preuve de la révision fixée sont affichés comme des données manquantes plutôt que d'hériter des résultats d'une autre révision source.

<CompatibilityMatrixTable />

::: info
Définir `VITE_COMPAT_MATRIX_URL` uniquement pour remplacer l'instantané bundled avec un backend en direct compatible. Sans cette variable, la page se charge `src/public/compat-matrix.json`.
:::
