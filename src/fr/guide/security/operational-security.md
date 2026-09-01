---
translation_locale: fr
translation_source: /guide/security/operational-security.md
translation_source_hash: 042673aca63962b4b3f91e59c29bc5030ada7d63f082991899951301cb1f6887
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Sécurité opérationnelle {#operational-security}

La sécurité opérationnelle protège les personnes, les hôtes, les identifiants et les procédures autour d'un déploiement Iroha. Le registre de la blockchain enregistre les changements d'état acceptés. Les opérateurs doivent sécuriser séparément leurs postes de travail, leurs clés de signature et leur processus de réponse aux incidents.

Utilisez les contrôles ci-dessous comme base de déploiement. Ajustez-les en fonction de la valeur à risque et des exigences de votre organisation.

## Établir une référence opérationnelle {#establish-an-operational-baseline}

- Maintenir un inventaire des hôtes validateurs, des identités des pairs du réseau, des principaux d'autorisation de compte, des dispositifs de signature, des points de terminaison publics API et des personnes responsables.
- Utilisez des identifiants séparés pour le développement, le test et la production. Attribuez chaque signataire cryptographique, jeton d'accès et clé privée à un seul environnement.
- Conservez l'automatisation de la configuration et du déploiement dans un contrôle de version révisable. Injectez les secrets à l'exécution du logiciel à partir d'un magasin de secrets approuvé ou d'un dispositif de signature.
- Enregistrez les hachages ou signatures cryptographiques attendus des artefacts de la version. Vérifiez-les avant le déploiement. Limitez qui peut remplacer les binaires, le matériel de genèse de la blockchain, la configuration ou les définitions de service.
- Appliquez le moindre privilège aux comptes du système d'exploitation, aux permissions Iroha et à l'administration réseau. Accordez à chaque rôle seulement le principe d'autorisation dont son travail a besoin.
- Testez les procédures de sauvegarde, de restauration, de remplacement de clé et de récupération entre pairs avant le lancement en production.

Examinez [Principes de sécurité](./security-principles.md) et [Préparation à la sortie](../best-practices/release-readiness.md) lors de la définition de la référence.

## Protéger les clés et les signataires cryptographiques {#protect-keys-and-signers}

- Gardez les clés privées, le matériel de semence, les jetons porteurs, les en-têtes d'autorisation et les secrets de récupération hors du contrôle de version, des systèmes de suivi des problèmes, des transcriptions de chat, des captures d'écran et de la documentation publique.
- Utilisez la signature sécurisée par matériel ou isolée pour les principaux autorisations de grande valeur. Gardez le matériel clé brut en dehors des navigateurs et des processus d'application à usage général lorsqu'un client peut déléguer la signature.
- Utilisez des principes d'autorisation séparés pour les transactions courantes, la gouvernance, le déploiement et la récupération.
- Cryptez le stockage secret et ses sauvegardes. Appliquez les mêmes contrôles d'accès à une sauvegarde de clé privée qu'à la clé active.
- Maintenez une procédure de remplacement ou de révocation testée. Remplacez une clé lorsque la politique l'exige ou lorsqu'une exposition est suspectée.
- Exiger un examen indépendant pour les modifications de l'adhésion des validateurs, des rôles privilégiés ou des actifs de grande valeur.

Voir [Génération de clés cryptographiques](./generating-cryptographic-keys.md) et [Stockage des clés cryptographiques](./storing-cryptographic-keys.md) pour des instructions spécifiques à chaque clé.

## Renforcer les nœuds et l'accès des opérateurs {#harden-nodes-and-operator-access}

- Exécutez des nœuds et des outils opérateurs sur des systèmes actuellement pris en charge par le fournisseur et patchés. Désactivez les services inutiles.
- Donner aux opérateurs nommés un accès administratif uniquement par des canaux audités et chiffrés.
- Mettez les interfaces non publiques sur un réseau privé ou [VPN](./vpn.md).
- Exposez uniquement les Torii, les routes de surveillance et d'application requises par le déploiement.
- Protégez chaque accès public avec des limites de débit et une sécurité de transport appropriées à l'environnement.
- Protégez les fichiers de configuration et les identifiants de service avec des permissions de fichiers restrictives. Gardez les secrets en dehors des lignes de commande, des listes de processus et de l'historique du shell.
- Séparez les fonctions de validation, de client, de surveillance et de sauvegarde lorsque le modèle de risque exige un contrôle indépendant.
- Synchronisez l'heure à partir de sources fiables. Conservez suffisamment de journaux système, de service et de réseau pour l'enquête.

## Navigateur sécurisé et flux de travail administratifs {#secure-browser-and-admin-workflows}

Pour un opérateur qui utilise une interface web :

- Utilisez un navigateur actuellement pris en charge par le fournisseur et entièrement mis à jour sur une station de travail gérée.
- Utilisez un profil d'opérateur dédié ou un appareil avec uniquement les extensions requises.
- Vérifiez l'origine et le certificat avant d'approuver une demande.
- Considérez les domaines similaires, les redirections inattendues et les demandes de matériel clé brut comme des incidents.
- Bloquer les sites et extensions non liés à partir de la session opérateur active.
- Utilisez des sessions de courte durée. Exigez une réauthentification pour les actions privilégiées.
- Afficher les détails de la transaction au signataire cryptographique. L'opérateur doit pouvoir vérifier le principal d'autorisation, le réseau, les instructions, les actifs et les frais avant l'approbation.

L'isolation du navigateur réduit l'exposition. Les opérateurs doivent toujours examiner les transactions et utiliser une signature sécurisée.

## Surveiller et répondre {#monitor-and-respond}

Surveillez ces signaux :

- modifications de l’adhésion des validateurs et des pairs du réseau
- échecs d'autorisation répétés ou instructions privilégiées inhabituelles
- modifications inattendues du logiciel, de la configuration ou des itinéraires
- échecs de signature, de requête et de transaction en dehors de la ligne de base normale
- épuisement des ressources, consensus bloqué ou perte des pairs de réseau attendus
- modifications d'actifs, d'autorisations et de comptes qui correspondent aux règles de fraude

Envoyez des alertes à un canal indépendant de l'hôte concerné. Conservez les journaux pertinents, les vues de données de configuration à un instant précis, les événements du registre blockchain et les hachages cryptographiques des transactions avec des horodatages. Voir [Surveillance de la fraude](./fraud-monitoring.md) et [Performance et mesures](../advanced/metrics.md).

## Plan de récupération {#recovery-plan}

Préparez le plan de récupération avant le lancement de la production. Le plan de récupération doit identifier :

- qui peut déclarer et coordonner un incident
- comment contacter les validateurs, les opérateurs d'infrastructure, les propriétaires d'applications et les utilisateurs concernés
- quels principes d'autorisation peuvent révoquer des autorisations, remplacer des clés ou changer l'appartenance des pairs du réseau
- où sont stockés les binaires de confiance, la configuration, les enregistrements de genèse de la blockchain, les sauvegardes et les inventaires de clés
- comment valider le réseau et les applications dépendantes après la récupération

Lorsqu'un incident se produit :

1. Isolez l'hôte, les identifiants, la route ou le principal d'autorisation affecté. Préservez les preuves.
2. Conservez les journaux et les références du registre blockchain. Enregistrez chaque action de récupération.
3. Révoquez ou remplacez les identifiants et autorisations exposés via le processus de gouvernance approuvé.
4. Restaurer le logiciel et la configuration à partir d'artefacts vérifiés.
5. Confirmez l'adhésion des pairs au réseau, la santé du consensus, les routes publiques, la surveillance et les lectures d'application. Reprenez les écritures seulement après que ces vérifications aient été effectuées.
6. Documentez la cause profonde. Mettez à jour les contrôles, l'automatisation et les exercices.

::: warning

Suivez les procédures préalablement examinées pour les actions irréversibles sur le registre blockchain. Exigez les approbations appropriées du principal d'autorisation et des actifs concernés.

:::
