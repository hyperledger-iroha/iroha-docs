---
translation_locale: fr
translation_source: /reference/compatibility-matrix.md
translation_source_hash: 5928eaf7e65023ad1867ca8d125efa61da6d8fe505b91e71b2c2121b183ce06e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Matrice de compatibilité {#compatibility-matrix}

La matrice de compatibilité indique des SDK couverture des scénarios pour le courant
Iroha 3 Par défaut, la page charge l'instantané généré
de ceux qui sont attachés [`hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha)
révision.

La matrice est composée de:

- **Des histoires** dans la première colonne
- **SDKs** sur les colonnes restantes
- **Symbole de statut** pour les données couvertes, ratées et manquantes

Seuls les résultats vérifiés par le flux de travail de rafraîchissement sont déclarés comme couverts ou
Les scénarios sans preuve de la révision fichée sont affichés comme
les données manquantes au lieu d'hériter des résultats provenant d'une autre révision de la source.

<CompatibilityMatrixTable />

::: info
Ensemble `VITE_COMPAT_MATRIX_URL` uniquement pour remplacer l'instantané avec un
la page est chargée
`src/public/compat-matrix.json`.
:::
