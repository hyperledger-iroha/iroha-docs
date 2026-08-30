---
translation_locale: fr
translation_source: /blockchain/smart-contracts.md
translation_source_hash: 4281cb307762443c85b67659310da69f1f1ea5b99926bad43b90abe36e87075e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Les contrats intelligents {#smart-contracts}


Les transactions Iroha exécutent des charges utiles `Executable`. Le modèle de données actuel prend en charge:

- `Executable::Instructions`: un ensemble ordonné d'instructions spéciales Iroha
- `Executable::ContractCall`: appel de référence parallèle à une instance de contrat déployée
- `Executable::Ivm`: code en octets Iroha VM
- `Executable::IvmProved`: code byte Iroha VM avec une superposition précomputée d'instructions et des engagements en matière de preuve

Kotodama est Iroha C'est un langage de contrat intelligent de haut niveau. `.ko` le fichier source compile à déterministique IVM code octal, conservé de manière conventionnelle en tant que `.to` un artefact destiné au déploiement. Kotodama Objectifs IVM Il n'est pas ciblé RISC-V ou WebAssembly.

La première version ne prend en charge que la version ABI 1. La politique de syscall et pointer-ABI est un contrat V1 inconditionnel appliqué par l'admission et l'exécution; il n'y a pas de mode d'exécution alternatif.

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

Chaque adresse déployée conserve un enregistrement `ContractLifecycleControlV1`, y compris pendant que le contrat est inactif. Le registre contient l'origine immuable du premier déploiement, le propriétaire actuel et en attente, toute délégation parlementaire révocable, le code hash actif, une révision non zéro comparer-et-swap, Un déploiement direct enregistre le compte de déploiements. un déploilement du Parlement enregistre son proposant, son contenu-proposition ID et sa tentative de gouvernance réussie ID.

Le propriétaire du cycle de vie est soit un compte, soit le Parlement. Les changements de propriété des comptes utilisent une offre et une acceptation distinctes; l'acceptation d'une offre élimine toute délégation du Parlement. Un titulaire de compte peut autoriser le Parlement à activer ou à désactiver le contrat, La délégation ne permet jamais au Parlement de transférer la propriété. Les modifications détenues par le Parlement et l'acceptation par ce dernier sont promulguées grâce à des effets de gouvernance certifiés.

Les instructions crues `ActivateContractInstance` et `DeactivateContractInstance` ne sont disponibles que pour le propriétaire du compte courant. Elles doivent contenir l'exactitude exacte de l'enregistrement `expected_revision`; Le temps d'exécution rejette les révisions obsolètes ou zéroes. L'activation brute ne peut pas créer un enregistrement du cycle de vie, et elle valide l'artefact enregistré, le manifeste et ABI avant de modifier `active_code_hash`. Désactivation chaque transition réussie du cycle de vie fait avancer la révision et émet l'état post-complete.

L'activation peut également établir un crochet de cycle de vie déclaré manifeste. Une première activation dont le manifeste contient un point d'entrée `EntryPointKind::Hajimari` (`hajimari`/`始まり`) étapes `Hajimari`. Réinitialisation d'une adresse active à un code dont le manifeste contient un point d'entrée `EntryPointKind::Kaizen` (`kaizen`/`改善`) étapes `Kaizen`. La liaison change immédiatement, Mais le contrat n'est pas prêt: tous les appels `Kotoage` et `View` sont rejetés jusqu'à ce que l'accroche mise en scène réalise son succès.

Invoquer le crochet mise en scène avec `Executable::ContractCall` à la même adresse contractuelle et à un nouveau code hash, en utilisant le code exact `hajimari` ou `kaizen` Le point d'entrée et les arguments déclarés par son manifeste. `CanInvokeContractEntrypoint` l'autorisation; les appelants ne doivent pas créer ou accorder cette autorisation. le marqueur en attente contient un `transition_id` et le nouveau `code_hash`; une `Kaizen` le marqueur contient également `previous_code_hash`. Les clients ne calculent ni ne soumettent `transition_id`. Un crochet réussi consomme le marqueur de manière atomique, tandis qu'un crochet raté le laisse en attente pour une nouvelle tentative ultérieure.

Une proposition parlementaire de niveau d'urgence peut imposer une suspension pour un maximum de 3600 blocs lorsqu'elle lie la révision actuelle, le code hash et un résumé des incidents non zéro. L'expiration restaure l'exécution mais n'efface pas le blocage. Une action certifiée `CompleteEmergencyHoldRetrospective` doit ensuite lier le blocage exact IDs et digérer plus une racine de trouvaille non zéro avant que le dossier ne soit effacé; un autre blocage ne peut être imposé tant que cette rétrospective reste en suspens.

Lorsque l'application API est activée, lisez l'état de conservation avec `GET /v1/gov/contracts/{contract_address}`. Son champ `found` signifie qu'un enregistrement du cycle de vie existe, et non que l'adresse a actuellement un code actif.

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
