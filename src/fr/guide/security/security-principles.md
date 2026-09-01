---
translation_locale: fr
translation_source: /guide/security/security-principles.md
translation_source_hash: 20139011c663a0bca6f9e486ef81f698370c34f8f02319317805b0d1dfb049c7
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Principes de sécurité {#security-principles}

Un registre blockchain Iroha vérifie les instructions signées et applique les permissions. Il ne sécurise pas les clés privées, les hôtes, les applications, les stations de travail des opérateurs ou les procédures de gouvernance. Le déploiement doit protéger ces systèmes.

Utilisez ces principes lors de la conception et de l'exploitation d'un réseau Iroha.

## Considérer le principal d'autorisation comme une barrière de sécurité {#treat-authority-as-a-security-boundary}

- Une personne ou un processus qui contrôle une clé privée peut agir avec le principal d'autorisation attribué à cette clé.
- Attribuez à chaque environnement et rôle opérationnel un principal d'autorisation distinct.
- Gardez les clés de production et les clés de récupération séparées des identifiants de développement et de test habituels.
- Enregistrez qui possède chaque principal d'autorisation, où se trouve son signataire cryptographique et comment il peut être remplacé ou révoqué.

Voir [Cryptographie à clé publique](./public-key-cryptography.md) et [Stockage des clés cryptographiques](./storing-cryptographic-keys.md).

## Appliquer le principe du moindre privilège {#apply-least-privilege}

- Accorder uniquement les autorisations Iroha, l'accès à l'hôte et l'accès au réseau nécessaires pour un rôle.
- Séparer la signature des transactions de routine de l'autorité principale de gouvernance, de déploiement et de récupération.
- Exiger une approbation indépendante pour les modifications pouvant affecter l'adhésion des validateurs, les autorisations privilégiées ou les actifs de grande valeur.
- Vérifiez l'accès après les changements de rôle et supprimez les accès qui ne sont plus nécessaires.

## Utiliser des couches de protection {#use-layers-of-protection}

- Protégez les signataires cryptographiques, les applications, les systèmes d'exploitation, les réseaux et l'accès physique. Ne comptez pas sur un seul contrôle.
- Exposez uniquement les Torii, les pairs réseau, la surveillance et les routes d'application requis par le déploiement.
- Utilisez des canaux authentifiés et chiffrés pour l'accès administratif et les données sensibles.
- Maintenez les systèmes à jour et désactivez les services que le déploiement n'utilise pas.
- Gardez les secrets hors du contrôle de version, des lignes de commande, des journaux, des tickets, des discussions et de la documentation publique.

## Rendre les déploiements examinables {#make-deployments-reviewable}

- Conservez la configuration non secrète et l'automatisation du déploiement dans le contrôle de version.
- Passez en revue les modifications des binaires, de la configuration, du matériel de genèse de la blockchain, de l’adhésion des validateurs, des autorisations et des routes publiques.
- Vérifiez les artefacts de version avant le déploiement. Enregistrez les versions approuvées et les empreintes cryptographiques.
- Testez la combinaison exacte de binaire et de configuration qui sera utilisée en production.
- Préservez le comportement déterministe du réseau. L'accélération matérielle ne doit pas modifier les résultats visibles par les pairs.

## Surveiller et préserver les preuves {#monitor-and-preserve-evidence}

- Surveillez la santé des pairs du réseau, la progression du consensus, les modifications des autorisations, les instructions privilégiées, les échecs d'authentification et les changements de configuration inattendus.
- Envoyez des alertes importantes à un système qui ne dépend pas de l'hôte affecté.
- Conservez les journaux pertinents, les références du registre distribué, les instantanés de configuration et les hachages de transaction avec des horodatages fiables.
- Considérez les données de surveillance manquantes comme un problème opérationnel nécessitant une enquête.

## Préparer la récupération avant le lancement {#prepare-recovery-before-launch}

- Définir qui peut déclarer un incident et qui peut approuver les actions de récupération.
- Tester les procédures de sauvegarde, de restauration, de remplacement de clés, de révocation des permissions et de récupération des pairs réseau.
- Conservez les artefacts de version de confiance, la configuration, les enregistrements de genèse de la blockchain et les inventaires disponibles pendant un incident.
- Restaurez d'abord la lecture et la surveillance. Reprenez les écritures uniquement après que le réseau récupéré et les applications dépendantes aient passé leurs contrôles.
- Examinez chaque incident et mettez à jour les contrôles, l'automatisation et les exercices.

::: warning

Les actions sur le registre blockchain peuvent être irréversibles. Utilisez des procédures préalablement examinées et les approbations requises avant de soumettre une transaction de récupération ou de gouvernance.

:::

Continuez avec [Sécurité opérationnelle](./operational-security.md) et [Préparation à la sortie](../best-practices/release-readiness.md).
