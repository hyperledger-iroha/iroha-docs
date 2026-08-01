---
translation_locale: fr
translation_source: /guide/security/security-principles.md
translation_source_hash: 20139011c663a0bca6f9e486ef81f698370c34f8f02319317805b0d1dfb049c7
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Principes de sécurité {#security-principles}

Un registre Iroha vérifie les instructions signées et applique des autorisations. Il ne sécurise pas les clés privées, les hôtes, les applications, les postes de travail de l'opérateur ou les procédures de gouvernance. Le déploiement doit protéger ces systèmes.

Utilisez ces principes lors de la conception et du fonctionnement d'un réseau Iroha.

## Traitez l'autorité comme une limite de sécurité {#treat-authority-as-a-security-boundary}

- Une personne ou un processus qui contrôle une clé privée peut agir avec l'autorité assignée à cette clé.
- Donner à chaque environnement et rôle opérationnel une autorité distincte.
- Gardez les clés de production et de récupération séparées des identifiants de développement et d'essais de routine.
- Consignez le propriétaire de chaque autorité, l'endroit où son signataire est conservé et la manière dont cette autorité peut être remplacée ou révoquée.

Voir [Cryptographie à clé publique](./public-key-cryptography.md) et [Stockage des clés cryptographiques](./storing-cryptographic-keys.md).

## Appliquez le moindre privilège {#apply-least-privilege}

- Accordez uniquement les autorisations Iroha, l'accès à l'hôte et l'accès au réseau requis pour un rôle.
- Séparez la signature des transactions courantes des autorités de gouvernance, de déploiement et de récupération.
- Exigez une approbation indépendante pour les modifications pouvant affecter la composition des validateurs, les autorisations privilégiées ou les actifs de grande valeur.
- Réexaminez les accès après les changements de rôle et supprimez ceux qui ne sont plus nécessaires.

## Utilisez des couches de protection {#use-layers-of-protection}

- Protégez les signataires, les applications, les systèmes d'exploitation, les réseaux et l'accès physique. Ne dépendez pas d'un seul contrôle.
- N'exposez que les routes Torii, pair-à-pair, de surveillance et d'application requises par le déploiement.
- Utilisez des canaux authentifiés et chiffrés pour l'accès administratif et les données sensibles.
- Maintenez les systèmes à jour avec les correctifs et désactivez les services que le déploiement n'utilise pas.
- Gardez les secrets hors du contrôle de code source, des lignes de commande, des journaux, des tickets, des discussions et de la documentation publique.

## Faire en sorte que les déploiements soient révisibles {#make-deployments-reviewable}

- Conservez la configuration non secrète et l'automatisation du déploiement dans le contrôle de version.
- Examinez les modifications apportées aux binaires, à la configuration, au matériel de genèse, à la composition des validateurs, aux autorisations et aux routes publiques.
- Vérifiez les artefacts de version avant le déploiement. Consignez les versions et les empreintes approuvées.
- Testez la combinaison binaire et de configuration exacte qui fonctionnera en production.
- Préserver le comportement déterministe du réseau. L'accélération du matériel ne doit pas modifier les résultats visibles par les pairs.

## Surveiller et préserver les preuves {#monitor-and-preserve-evidence}

- Surveiller la santé des pairs, les progrès du consensus, les modifications de permissions, les instructions privilégiées, les échecs d'authentification et les changements inattendus en configuration.
- Envoyez des alertes importantes à un système qui n'est pas dépendant de l'hôte affecté.
- Préservez les journaux pertinents, les références du registre, les instantanés de configuration et les empreintes de transaction avec des horodatages fiables.
- Traiter les données manquantes de surveillance comme un problème opérationnel qui nécessite une enquête.

## Préparez votre récupération avant le lancement {#prepare-recovery-before-launch}

- Définir qui peut déclarer un incident et qui peut approuver des mesures de récupération.
- Testez les procédures de sauvegarde, de restauration, de remplacement des clés, de révocation des autorisations et de récupération des pairs.
- Gardez les artefacts de version fiables, la configuration, les enregistrements de genèse et les inventaires disponibles pendant un incident.
- Rétablissez d'abord les lectures et la surveillance. Ne reprenez les écritures qu'après la réussite des contrôles du réseau restauré et des applications dépendantes.
- Revoir chaque incident et mettre à jour les contrôles, l'automatisation et les exercices.

::: warning

Les actions du registre peuvent être irréversibles. Utilisez des procédures examinées à l'avance et les approbations requises avant de soumettre une transaction de récupération ou de gouvernance.

:::

Continuer avec [Sécurité opérationnelle](./operational-security.md) et [Préparation de libération](../best-practices/release-readiness.md).
