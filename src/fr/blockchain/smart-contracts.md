---
translation_locale: fr
translation_source: /blockchain/smart-contracts.md
translation_source_hash: c69237ded68aee4d663b00f1aa13d400c4763682af9bd5b5a49ca0edb5905dd2
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Les contrats intelligents {#smart-contracts}

Les transactions Iroha exécutent des charges utiles `Executable`. Le modèle de données actuel prend en charge:

- `Executable::Instructions`: un ensemble ordonné d'instructions spéciales Iroha
- `Executable::ContractCall`: appel de référence parallèle à une instance de contrat déployée
- `Executable::Ivm`: code en octets Iroha VM
- `Executable::IvmProved`: code byte Iroha VM avec une superposition précomputée d'instructions et des engagements en matière de preuve

Kotodama est le langage de contrats intelligents de haut niveau d’Iroha. Un fichier source `.ko` est compilé en bytecode IVM déterministe, stocké par convention sous forme d’un artefact `.to` pour le déploiement. Kotodama cible uniquement l’IVM. Il ne cible ni RISC-V ni WebAssembly.

La première version ne prend en charge que la version 1 de l’ABI. La politique relative à syscall et à pointer-ABI est appliquée sans condition lors de l’admission et de l’exécution des contrats ; il n’existe aucun commutateur de compatibilité à l’exécution.

## Quand utiliser des contrats intelligents {#when-to-use-smart-contracts}

Utilisez les instructions normales lorsque la transaction peut être exprimée directement:

- les objets enregistrés ou non enregistrés
- actifs de la menthe, du brûlure ou du transfert
- mettre à jour les métadonnées
- accorder ou révoquer des autorisations
- d' exécuter un déclencheur
- paramètres sur la chaîne définis

Utilisez un contrat intelligent lorsque la transaction a besoin d'une logique packaged qui est difficile à exprimer sous forme de séquence d'instructions statiques, ou lorsqu'une instance de contrat déployée doit être appelée par référence.

## IVM Exécutables {#ivm-executables}

`Executable::Ivm` contient le code octal brut IVM. Les nœuds exécutent ce code octal à l'intérieur des limites de temps d'exécution configurées pour la chaîne. Gardez un code octal petit et déterministique; les contrats font partie de l'exécution des transactions et affectent donc le consensus.

`Executable::IvmProved` est destiné aux flux de transport à épreuve.

- Le code octal IVM
- une superposition d'instruction déterministe
- un engagement en matière d'exécution des événements
- un engagement en matière de politique du gaz

La preuve lie la superposition au code octal exécuté. Selon la politique du pipeline, les validateurs peuvent vérifier la preuve et reproduire l'exécution en tant que contrôle de sécurité supplémentaire.

## Les appels contractuels déployés {#deployed-contract-calls}

`Executable::ContractCall` invoque une instance de contrat déployée par adresse.Utilisez-la lorsque le code du contrat est enregistré séparément et que les transactions doivent l'appeler par référence au lieu de porter chaque fois le bytecode.

## Cycle de vie et propriété des contrats {#contract-lifecycle-and-ownership}

Chaque adresse déployée conserve un enregistrement `ContractLifecycleControlV1`, y compris pendant que le contrat est inactif. Le registre contient l'origine immuable du premier déploiement, le propriétaire actuel et en attente, toute délégation parlementaire révocable, le code hash actif, une révision non zéro comparer-et-swap, Un déploiement direct attribue le compte soumis en tant que propriétaire et l'enregistre comme étant l'origine du déploiements. Un dépôt parlementaire attribue au Parlement en tant que titulaire et enregistre son proposant, contenu-proposition ID; et une tentative de gouvernance réussie ID uniquement comme provenance.

Les espaces de noms protégés configurés sont réservés au déploiement par le Parlement. `CanRegisterSmartContractCode` autorise l'enregistrement d'un artefact, mais n'autorise pas le déploiement direct ou l'activation brute dans un espace de noms protégé; l'enregistrement initial du cycle de vie doit être créé par la voie de déploiement certifiée par le Parlement.

Le propriétaire du cycle de vie est soit un compte, soit le Parlement. `OfferContractOwnership` suivie de celle du propriétaire en attente `AcceptContractOwnership`; le propriétaire actuel peut retirer une offre non acceptée avec: `CancelContractOwnershipOffer`. L'acceptation accorde l'autorisation à toute délégation du Parlement européen. le compte est titulaire d'un contrat ou est le propriétaire en attente dans une offre en cours.

Un titulaire de compte peut permettre au Parlement d'améliorer, d'activer ou de désactiver le contrat, puis révoquer cette délégation. Les modifications détenues par le Parlement et l'acceptation par le Parlement sont promulguées à travers des effets de gouvernance certifiés.

Les instructions crues `ActivateContractInstance` et `DeactivateContractInstance` ne sont disponibles que pour le titulaire du compte courant. Elles doivent contenir l'exactitude exacte de l'enregistrement `expected_revision`; les modifications obsolètes ou zéro ne peuvent pas être fermées. L'activation brute ne peut pas créer un enregistrement du cycle de vie, et elle valide l'artefact enregistré, le manifeste et ABI avant de modifier `active_code_hash`. Désactivation chaque transition réussie du cycle de vie fait avancer la révision et émet l'état post-complete.

Une proposition parlementaire de niveau d'urgence ne peut imposer un arrêt qu'à travers l'ensemble du pipeline parlementaire et avec les votes Oui à partir d'au moins deux tiers des sièges du jury politique original. Il ne peut que suspendre les appels et déclencher l'exécution: il ne peut pas être étendu ou modifier le code, la propriété ou la délégation. Les appels et les exécutions de déclencheurs correspondants sont bloqués depuis la hauteur d'imposition jusqu'à, mais sans inclure, la hauteur de validité. L'expiration rétablit automatiquement l'exécution mais n'efface pas la retenue. Une action certifiée `CompleteEmergencyHoldRetrospective` doit ensuite lier la retenue exacte IDs et digérer plus une racine de recherche non zéro avant que le dossier ne soit effacé; une autre retenue ne peut pas être imposée jusqu'à ce que cette rétrospective soit complète.

Lorsque l'application API est activée, lisez l'état conservé avec `GET /v1/gov/contracts/{contract_address}`. Son champ `found` signifie qu'un enregistrement du cycle de vie existe, et non que l'adresse a actuellement un code actif.

## Conseils opérationnels {#operational-guidance}

- Gardez les contrats déterministes. Le comportement des contrats ne doit pas dépendre de l'heure locale du mur, de l'état du système de fichiers hôte, des appels réseau ou d'autres entrées locales par les pairs.
- Gardez les charges utiles compactes. Un grand code octal augmente la taille de la transaction et le coût de propagation des blocs.
- Les instructions typées sont préférées pour les modifications simples du registre. Elles sont plus faciles à vérifier et moins chères à exécuter.
- Traiter la mise à niveau du contrat et les autorisations d'enregistrement comme des contrôles opérationnels à haut risque.

Voir aussi:

- [Instructions ](/fr/blockchain/instructions.md)
- [Les déclencheurs ](/fr/blockchain/triggers.md)
- [Autorisations ](/fr/blockchain/permissions.md)
- [Schéma de modèle de données](/fr/reference/data-model-schema.md)
