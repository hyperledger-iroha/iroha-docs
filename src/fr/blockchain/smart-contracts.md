---
translation_locale: fr
translation_source: /blockchain/smart-contracts.md
translation_source_hash: ed622cdb1d6a47635d0753c98f80aaa903b916133f43bc9fdab268512d0ace69
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Contrats intelligents {#smart-contracts}

Iroha exécuter les transactions `Executable` Les charges utiles. le modèle de données actuel
soutient:

- `Executable::Instructions`: un ensemble ordonné de Iroha Instructions spéciales
- `Executable::ContractCall`: un appel de référence parallèle à un contrat déployé
  exemple
- `Executable::Ivm`: Iroha VM code par défaut
- `Executable::IvmProved`: Iroha VM code octal avec une instruction précomputée
  engagements de superposition et d'épreuve

Kotodama est Iroha C'est un langage de contrat intelligent de haut niveau. `.ko` fichier source
compile à déterministe IVM code octal, conservé conventionnellement sous forme d'un `.to`
un artefact destiné au déploiement. Kotodama cibles IVM; Ce n'est pas un stand-alone RISC-V
ou WebAssembly cible.

La première version ne prend en charge que ABI La version 1. Le syscall et le pointeur ABI
la politique est appliquée de manière inconditionnelle par l'admission et l'exécution du contrat;
n'y a pas de commutateur de compatibilité en temps d'exécution.

## Quand utiliser des contrats intelligents {#when-to-use-smart-contracts}

Utilisez des instructions normales lorsque la transaction peut être exprimée directement:

- objets enregistrés ou non enregistrés
- actifs de la menthe, du brûlure ou du transfert
- mise à jour des métadonnées
- accorder ou révoquer des autorisations
- d' exécuter un déclencheur
- paramètres de chaîne définis

Utilisez un contrat intelligent lorsque la transaction a besoin de logique packaged qui est
difficile à exprimer en tant que séquence d'instructions statiques, ou lorsqu'une
L'instance de contrat doit être appelée par référence.

## IVM Les éléments exécutables {#ivm-executables}

`Executable::Ivm` porte crues IVM Les nœuds exécutent ce code en byte à l'intérieur
les limites de temps d'exécution configurées pour la chaîne.
déterministe; les contrats font partie de l'exécution des transactions et affectent donc
Le consensus.

`Executable::IvmProved` est destiné aux flux de transport à épreuve. il contient:

- IVM code par défaut
- une superposition d'instruction déterministe
- un engagement sur les événements d'exécution
- un engagement en matière de politique du gaz

La preuve lie la superposition au code octal exécuté.
la politique, les validateurs peuvent vérifier l'exécution de la preuve et de répétition en tant que complément
vérification de la sécurité.

## Appels contractuels déployés {#deployed-contract-calls}

`Executable::ContractCall` invoque une instance de contrat déployée par adresse.
Utilisez ceci lorsque le code du contrat est enregistré séparément et que les transactions doivent être effectuées
appeler par référence au lieu de porter le code octal à chaque fois.

## Conseils d'exploitation {#operational-guidance}

- Le comportement des contrats ne doit pas dépendre de la situation locale.
  l'heure du mur, l'état du système de fichiers hôte, les appels réseau ou d'autres paramètres locaux
  les entrées.
- Gardez les charges utiles compactes. Un grand code octal augmente la taille et le blocage des transactions
  le coût de propagation.
- Les instructions typées sont préférées pour les modifications simples du registre.
  l'audit et moins cher à exécuter.
- Traiter la mise à niveau des contrats et les autorisations d'enregistrement comme présentant un risque élevé
  les contrôles opérationnels.

Voir aussi:

- [Instructions](/fr/blockchain/instructions.md)
- [Les déclencheurs](/fr/blockchain/triggers.md)
- [Autorisations](/fr/blockchain/permissions.md)
- [Schéma de modèle de données](/fr/reference/data-model-schema.md)
