---
translation_locale: fr
translation_source: /blockchain/smart-contracts.md
translation_source_hash: 4281cb307762443c85b67659310da69f1f1ea5b99926bad43b90abe36e87075e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Contrats intelligents {#smart-contracts}

Iroha les transactions exécutent `Executable` des charges utiles. Le modèle de données actuel prend en charge :

- `Executable::Instructions` : un ensemble ordonné d'opérations d'instruction Iroha
- `Executable::ContractCall` : un appel par référence à une instance de contrat déployée
- `Executable::Ivm` : Iroha VM bytecode
- `Executable::IvmProved` : Iroha VM bytecode avec une superposition d'instructions précalculée et des engagements de preuve

Kotodama est le langage de contrat intelligent de haut niveau de Iroha. Un fichier source `.ko` se compile en bytecode IVM déterministe, stocké conventionnellement comme un artefact `.to` pour le déploiement. Kotodama cible uniquement IVM. Il ne cible pas RISC-V ni WebAssembly.

La première version ne prend en charge que la version 1 de ABI. La politique syscall et pointeur-ABI est un contrat V1 inconditionnel appliqué lors de l'admission et de l'exécution ; il n'existe aucun mode d'exécution logicielle alternatif.

## Quand utiliser les contrats intelligents {#when-to-use-smart-contracts}

Utilisez des instructions normales lorsque la transaction peut être exprimée directement :

- enregistrer ou désenregistrer des objets
- émission, brûler ou transférer des actifs
- mettre à jour les métadonnées
- accorder ou révoquer des autorisations
- exécuter un déclencheur
- définir les paramètres sur la chaîne

Utilisez un contrat intelligent lorsque la transaction nécessite une logique intégrée qui est difficile à exprimer sous forme de séquence d'instructions statiques, ou lorsqu'une instance de contrat déployée doit être appelée par référence.

## IVM Exécutables {#ivm-executables}

`Executable::Ivm` transporte du bytecode brut IVM. Les nœuds exécutent ce bytecode dans les limites d'exécution du logiciel configurées pour la chaîne. Gardez le bytecode petit et déterministe ; les contrats font partie de l'exécution des transactions et affectent donc le consensus.

`Executable::IvmProved` est destiné aux flux portant une preuve. Il contient :

- IVM bytecode
- une superposition d'instructions déterministe
- un engagement envers les événements d'exécution
- un engagement en matière de politique gazière

La preuve lie la superposition au bytecode exécuté. Selon la politique de la chaîne de traitement, les validateurs peuvent vérifier la preuve et rejouer l'exécution comme contrôle de sécurité supplémentaire.

## Appels de contrat déployé {#deployed-contract-calls}

`Executable::ContractCall` invoque une instance de contrat déployée par adresse. Utilisez ceci lorsque le code du contrat est enregistré séparément et que les transactions doivent y faire appel par référence au lieu de transporter le bytecode à chaque fois.

## Cycle de vie et propriété du contrat {#contract-lifecycle-and-ownership}

Chaque adresse déployée conserve un enregistrement `ContractLifecycleControlV1`, y compris lorsque le contrat est inactif. L'enregistrement contient l'origine immuable du premier déploiement, le propriétaire actuel et en attente, toute délégation réversible du Parlement, le hachage cryptographique du code actif, une révision de comparaison et d'échange non nulle, et toute suspension d'urgence retenue. Un déploiement direct enregistre le compte qui déploie. Un déploiement du Parlement enregistre son proposant, l'ID du contenu de la proposition et l'ID de la tentative de gouvernance réussie.

Le propriétaire du cycle de vie est soit un compte, soit le Parlement. Les changements de propriété de compte utilisent une offre et une acceptation séparées ; accepter une offre annule toute délégation du Parlement. Un propriétaire de compte peut permettre au Parlement d'activer ou de désactiver le contrat, puis révoquer cette délégation, mais la délégation ne permet jamais au Parlement de transférer la propriété. Les modifications détenues par le Parlement et l'acceptation par le Parlement sont mises en œuvre par des effets de gouvernance certifiés.

Les instructions brutes `ActivateContractInstance` et `DeactivateContractInstance` sont disponibles uniquement pour le propriétaire actuel du compte. Elles doivent comporter le `expected_revision` exact de l'enregistrement ; les révisions périmées ou nulles échouent si elles sont fermées. L'activation brute ne peut pas créer un enregistrement de cycle de vie, et elle valide l'artefact enregistré, le manifeste technique et ABI avant de modifier `active_code_hash`. La désactivation efface le hachage cryptographique du code actif mais conserve la propriété et la provenance. Chaque transition réussie du cycle de vie fait avancer la révision et émet l'état complet après transition.

L'activation peut également mettre en scène un hook de cycle de vie déclaré dans le manifeste de l'étape un. Une première activation dont le manifeste technique contient un point d'entrée `EntryPointKind::Hajimari` (`hajimari`/`始まり`) met en scène `Hajimari`. Rebindre une adresse active à un code dont le manifeste technique contient un point d'entrée `EntryPointKind::Kaizen` (`kaizen`/`改善`) étapes `Kaizen`. La liaison change immédiatement, mais le contrat n'est pas prêt : chaque appel `Kotoage` et `View` est rejeté jusqu'à ce que le hook de l'étape exacte réussisse. Une autre activation est également rejetée tant qu'un hook est en attente.

Invoquez le hook mis en scène avec `Executable::ContractCall` à la même adresse de contrat et le nouveau hash cryptographique du code, en utilisant exactement le point d'entrée `hajimari` ou `kaizen` et les arguments déclarés par son manifeste technique. L'environnement d'exécution du logiciel fournit l'autorisation à portée d'adresse et de sélecteur `CanInvokeContractEntrypoint` ; les appelants ne doivent pas créer ou accorder cette autorisation. Le marqueur en attente contient un `transition_id` déterministe généré par l'environnement d'exécution et le nouveau `code_hash` ; un marqueur `Kaizen` contient également `previous_code_hash`. Les clients ne calculent ni ne soumettent `transition_id`. Un hook réussi consomme le marqueur de manière atomique, tandis qu'un hook échoué le laisse en attente pour une nouvelle tentative ultérieure.

Une proposition de Parlement de niveau d'urgence peut imposer une suspension pour au maximum 3 600 blocs lorsqu'elle lie la révision actuelle, le hachage cryptographique du code et une valeur de digest cryptographique d'incident non nulle. Les appels sont bloqués depuis la hauteur d'imposition jusqu'à, mais sans inclure, la hauteur d'expiration. L'expiration rétablit l'exécution mais n'efface pas la retenue. Une action certifiée `CompleteEmergencyHoldRetrospective` doit ultérieurement lier les identifiants exacts de la retenue et la valeur du digest cryptographique ainsi qu'une racine de constatation non nulle avant que l'enregistrement soit effacé ; aucune autre retenue ne peut être imposée tant que ce rétrospectif reste en suspens.

Lorsque l'application API est activée, lisez l'état conservé avec `GET /v1/gov/contracts/{contract_address}`. Son champ `found` signifie qu'un enregistrement du cycle de vie existe, et non que l'adresse contient actuellement du code actif.

## Directives opérationnelles {#operational-guidance}

- Maintenez les contrats déterministes. Le comportement du contrat ne doit pas dépendre de l'heure locale, de l'état du système de fichiers hôte, des appels réseau ou d'autres entrées locales d'un pair.
- Garder les charges utiles compactes. Un bytecode volumineux augmente la taille des transactions et le coût de propagation des blocs.
- Préférez les instructions écrites pour les modifications simples du registre blockchain. Elles sont plus faciles à auditer et moins coûteuses à exécuter.
- Considérez les autorisations de mise à niveau de contrat et d'inscription comme des contrôles opérationnels à haut risque.

Voir aussi :

- [Instructions](/fr/blockchain/instructions.md)
- [Déclencheurs](/fr/blockchain/triggers.md)
- [Autorisations](/fr/blockchain/permissions.md)
- [Schéma du modèle de données](/fr/reference/data-model-schema.md)
