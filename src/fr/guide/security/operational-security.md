---
translation_locale: fr
translation_source: /guide/security/operational-security.md
translation_source_hash: 042673aca63962b4b3f91e59c29bc5030ada7d63f082991899951301cb1f6887
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Sécurité opérationnelle {#operational-security}

La sécurité opérationnelle protège les personnes, les hôtes, les informations d'identification et les procédures autour d'un déploiement Iroha. Les enregistrements du registre acceptent les changements d'état.

Utilisez les commandes ci-dessous comme base de déploiement. Ajustez-les à la valeur à risque et aux exigences de votre organisation.

## Établissement d'une ligne de base opérationnelle {#establish-an-operational-baseline}

- Maintenir un inventaire des hôtes validateurs, identités de pairs, autorités de compte, dispositifs de signature, terminaux publics et personnes responsables.
- Utilisez des identifiants distincts pour le développement, les tests et la production. Assignez à chaque signataire, au porteur de jeton et à la clé privée d'un même environnement.
- Gardez l'automatisation de la configuration et du déploiement dans le contrôle des versions révisibles. Injectez les secrets en temps d'exécution à partir d'un magasin secret ou d'un dispositif de signature agréé.
- Enregistrer les hashes ou signatures attendues des objets de sortie. Vérifiez-les avant le déploiement. Limitez qui peut remplacer les binaires, le matériel génétique, la configuration ou les définitions de service.
- Appliquer le moins de privilèges aux comptes du système d'exploitation, aux autorisations Iroha et à l'administration du réseau.
- Testez les procédures de sauvegarde, de restauration, de remplacement des clés et de récupération des pairs avant le lancement en production.

Révision [Principes de sécurité](./security-principles.md) et [Préparation à la libération](../best-practices/release-readiness.md) lors de la définition du point de départ.

## Protégez les clés et les signatures {#protect-keys-and-signers}

- Gardez les clés privées, le matériel de semence, les jetons du porteur, les en-têtes d'autorisation et les secrets de récupération hors du contrôle de la source, émettez des traceurs, des transcriptions de chat, des captures d'écran et des documents publics.
- Utilisez des signatures matérielles ou isolées pour les autorités de haute valeur. Gardez la matière première clé en dehors des navigateurs et des processus d'application à usage général lorsque le client peut déléguer une signature.
- Utiliser des autorités distinctes pour les transactions de routine, la gouvernance, le déploiement et la récupération.
- Encrivez le stockage secret et ses sauvegardes. Appliquez les mêmes commandes d'accès à une sauvegarde de clé privée que la clé en direct.
- Maintenir une procédure de remplacement ou de révocation testée. Remplacer une clé lorsque la politique l'exige ou lorsqu'une exposition est suspectée.
- Exiger un examen indépendant des modifications apportées à l'adhésion au validateur, aux rôles privilégiés ou aux actifs de grande valeur.

Voir [Génération de clés cryptographiques](./generating-cryptographic-keys.md) et [Rétention de clés Cryptographiques ](./storing-cryptographic-keys.md) pour les lignes directrices spécifiques à la clé.

## Les nœuds de durcissement et l'accès des opérateurs {#harden-nodes-and-operator-access}

- Exécutez les nœuds et les outils de l'opérateur sur les systèmes actuellement supportés par le fournisseur. Désactivez les services inutiles.
- Accorder aux opérateurs nommés un accès administratif uniquement par le biais de canaux vérifiés et cryptés.
- Mettez des interfaces non publiques sur un réseau privé ou [VPN](./vpn.md).
- Exposer uniquement les routes Torii, la surveillance et l'application requises par le déploiement.
- Protéger toutes les entrées publiques avec des limites de tarifs et une sécurité des transports adaptés à l'environnement.
- Protégez les fichiers de configuration et les informations d'identification avec des autorisations restreintes. Gardez les secrets hors des lignes de commande, des listes de processus et de l'historique du shell.
- Départ des fonctions de validateur, client, surveillance et sauvegarde lorsque le modèle de risque nécessite un contrôle indépendant.
- Synchronisez le temps à partir de sources fiables, conservez suffisamment de journaux système, service et réseau pour enquêter.

## Des flux de travail sécurisés dans le navigateur et les administrateurs {#secure-browser-and-admin-workflows}

Pour un opérateur qui utilise une interface Web:

- Utilisez un navigateur entièrement mis à jour, actuellement pris en charge par le fournisseur sur une station de travail gérée.
- Utilisez un profil d'opérateur ou un dispositif dédié avec uniquement les extensions requises.
- Veuillez vérifier l'origine et le certificat avant d'approuver une demande.
- Traiter les domaines similaires, les redirections inattendues et les demandes de matières premières clés comme des incidents.
- Bloquer les sites non liés et les extensions de la session active de l'opérateur.
- Utilisez des sessions de courte durée, demandez une ré-authentification pour des actions privilégiées.
- Afficher les détails de la transaction au signataire. L'opérateur doit être en mesure de vérifier l'autorité, le réseau, les instructions, les actifs et les frais avant l'approbation.

L'isolement du navigateur réduit l'exposition. Les opérateurs doivent toujours examiner les transactions et utiliser une signature sécurisée.

## Surveiller et répondre {#monitor-and-respond}

Suivez ces signaux:

- changements de validateur et d'adhésion par les pairs
- échecs répétés de l'autorisation ou instructions privilégiées inhabituelles
- changements inattendus de logiciel, de configuration ou d'itinéraire
- défaillances de signature, de requête et de transaction en dehors de la ligne de base normale
- l'épuisement des ressources, le consensus bloqué ou la perte de pairs attendus
- changements d'actif, de permis et de compte correspondant aux règles en matière de fraude

Envoyer des alertes à un canal indépendant de l'hôte affecté. Préserver les journaux pertinents, les instantanés de configuration, les événements du registre et les hachages de transaction avec des timestamps. Voir [Fraud Monitoring](./fraud-monitoring.md) et [Performance and Metrics](../advanced/metrics.md).

## Plan de rétablissement {#recovery-plan}

Préparer le plan de récupération avant l'introduction de la production.

- qui peut déclarer et coordonner un incident
- comment contacter les validateurs, les exploitants d'infrastructure, les propriétaires d'applications et les utilisateurs concernés
- quelles autorités peuvent révoquer les autorisations, remplacer les clés ou modifier l'adhésion des pairs
- où sont stockés des binaires fiables, la configuration, les enregistrements de génèse, les sauvegardes et les stocks clés
- comment valider le réseau et les applications dépendantes après la récupération

En cas d'incident:

1. Isolez l'hôte, l'identifiant, la route ou l'autorité affectés. Préservez les preuves.
2. Gardez les journaux et les références du registre, enregistrez toutes les actions de récupération.
3. Révoquer ou remplacer les identifiants et autorisations exposés par le biais du processus de gouvernance approuvé.
4. Restaurer les logiciels et la configuration à partir d'objets vérifiés.
5. Confirmez l'appartenance des pairs, l'état du consensus, les routes publiques, la surveillance et les lectures des applications. Ne reprenez les écritures qu'après la réussite de ces vérifications.
6. Documenter la cause profonde, mettre à jour les contrôles, l'automatisation et les exercices.

::: warning

Suivre des procédures d'examen préalable pour les actions de registre irréversibles. Exiger les approbations appropriées à l'autorité et aux actifs concernés.

:::
