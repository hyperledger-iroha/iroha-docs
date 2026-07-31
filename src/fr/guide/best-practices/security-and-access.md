---
translation_locale: fr
translation_source: /guide/best-practices/security-and-access.md
translation_source_hash: f0163734d618d91337b437da703743014d01c57c4cb603fbc2e66316f3654779
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Sécurité et accès {#security-and-access}

Pratique de la sécurité dans le Iroha doit être basée sur une autorité étroite, contrôlée
la détention des clés, l'exposition explicite au réseau et les changements vérifiables.

## Prise en charge de la clé {#key-custody}

- Générer des clés de production avec entropie de niveau de production et stocker privé
  les clés extérieures aux dépôts, les traqueurs de données, les invites, les journaux de chat et CI
  la sortie.
- Utilisez un matériel clé séparé pour les clients, les pairs, la signature de génèse,
  les validateurs, les sponsors des frais et les comptes techniques.
- Retourner les touches selon un processus écrit et répéter la récupération avant une
  Un incident en direct.
- Utiliser un stockage matériel ou système d'exploitation pour des valeurs élevées
  signer des clés lorsque le risque de déploiement le justifie.

Vous voyez ?
[Génération de clés cryptographiques](/fr/guide/security/generating-cryptographic-keys.md)
et
[Le stockage des clés cryptographiques](/fr/guide/security/storing-cryptographic-keys.md).

## Autorisations {#permissions}

- Accordez le plus petit jeton d'autorisation ou rôle qui soutient le flux de travail.
- préférer des comptes techniques dédiés aux services, déclencheurs, agents et
  Automatisation. Évitez d'exécuter l'automatisation à longue durée de vie via un
  compte de l'opérateur.
- Autorisations d'examen pour la gestion par les pairs, la mutation des métadonnées, le montage,
  la combustion, l'enregistrement de déclenchement, les changements d'exécuteur et SORA/Nexus
  gouvernance avant le lancement de la production.
- Révoquer les autorisations temporaires après la fenêtre d'entretien ou la migration
  qui les nécessitait.

Vous voyez ? [Autorisations](/fr/blockchain/permissions.md) et
[Les jetons d'accès](/fr/reference/permissions.md).

## Exposition au réseau {#network-exposure}

- Restreindre les pairs, Torii, télémétrie et les itinéraires de l'opérateur selon
  L'accès à la lecture publique n'implique pas d'écriture ou de
  accès de l'opérateur.
- Utilisation VPNs, les pare-feu, les proxies inversées, TLS la résiliation et les limites de taux
  le cas échéant pour le déploiement.
- Gardez les identifiants d'auteur de base, les jetons proxy et les en-têtes transférés hors des
  config engagée.
- Teste que les clients non autorisés ne peuvent pas atteindre des itinéraires restreints.

Vous voyez ? [Réseaux privés virtuels](/fr/guide/security/vpn.md) et
[Torii Les points de fin](/fr/reference/torii-endpoints.md).

## Surveillance de la fraude et des abus {#fraud-and-abuse-monitoring}

- Surveiller les événements du registre et les signaux opérationnels pour des actifs inattendus
  les mouvements, les autorisations accordées, les changements de déclencheur, les modifications des pairs et répétées
  les transactions rejetées.
- Préserver des preuves avec les hashes de transaction, la hauteur du bloc, les enregistrements d'événements,
  des journaux et des instantanés de statut.
- Alertes de route aux responsables de la sécurité, des opérations et des propriétaires d'entreprises
  pour les actifs ou les flux de travail concernés.

Vous voyez ? [Surveillance des fraudes](/fr/guide/security/fraud-monitoring.md).

## Garde de l'agent et de l'automatisation {#agent-and-automation-guardrails}

- Démarrez l'automatisation avec des autorisations de lecture uniquement et ajoutez une autorisation d'écriture uniquement
  une fois que le flux de travail a été examiné.
- Exiger l'approbation humaine explicite pour les mutations du réseau en direct, sauf si le
  L'automatisation est un service de production déployé délibérément.
- N'exposez pas les clés privées aux instructions de l'agent.
  les secrets des variables environnementales, des chaînes de clés, des signataires matériels ou
  les fichiers de configuration ont été ignorés.
- Décisions d'automatisation du journal de manière à soutenir les audits sans fuite
  Le matériel secret.
