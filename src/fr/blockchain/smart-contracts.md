---
translation_locale: fr
translation_source: /blockchain/smart-contracts.md
translation_source_hash: ed622cdb1d6a47635d0753c98f80aaa903b916133f43bc9fdab268512d0ace69
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Les contrats intelligents {#smart-contracts}

Les transactions Iroha exécutent des charges utiles `Executable`. Le modèle de données actuel prend en charge:

- `Executable::Instructions`: un ensemble ordonné d'instructions spéciales Iroha
- `Executable::ContractCall`: appel de référence parallèle à une instance de contrat déployée
- `Executable::Ivm`: code en octets Iroha VM
- `Executable::IvmProved`: code byte Iroha VM avec une superposition précomputée d'instructions et des engagements en matière de preuve

Kotodama est Iroha C'est un langage de contrat intelligent de haut niveau. `.ko` le fichier source compile à déterministique IVM code octal, conservé de manière conventionnelle en tant que `.to` un artefact destiné au déploiement. Kotodama Objectifs IVM; Il n'est pas indépendant. RISC-V ou WebAssembly La cible.

La première version ne prend en charge que la version ABI 1. La politique de syscall et pointer-ABI est appliquée inconditionnellement par l'admission et l'exécution du contrat; il n'y a pas de commutation de compatibilité en temps d'exécution.

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
