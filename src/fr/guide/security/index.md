---
translation_locale: fr
translation_source: /guide/security/index.md
translation_source_hash: ec7fc2f950b007f52d837473ad7021565923e537df1d18b86055fb483cda375c
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Sécurité {#security}

Sécurisez un déploiement Iroha comme vous le feriez pour tout système qui gère des données sensibles et de la valeur. Protégez les clés de signature, l'accès au réseau, les opérations de nœuds, la surveillance et la réponse aux incidents. Un registre ne supprime pas le besoin de ces contrôles.

### La navigation {#navigation}

Dans cette section, vous trouverez des renseignements sur les différents aspects de la sécurité de votre réseau Iroha:

- [Principaux de sécurité](./security-principles):

Principaux principes de base pour la protection des données et la réduction du risque de violation.

- [Les réseaux privés virtuels ](./vpn.md):

Comment utiliser un VPN pour restreindre l'accès entre pairs, Torii et les opérateurs dans des déploiements privés ou de consortiums.

- [Sécurité opérationnelle](./operational-security.md):

Contrôles quotidiennes pour l'accès, le suivi, la réponse aux incidents et les postes de travail des opérateurs.

- [Surveillance des fraudes ](./fraud-monitoring.md):

Comment utiliser les événements du registre, les requêtes, les autorisations et les signaux opérationnels pour détecter une activité suspecte et préserver des preuves de réponse.

- [Sécurité des mots de passe](./password-security.md):

Entropie de mot de passe, construction de mots de passe forts et modes d'échec communs.

- [La cryptographie de la clé publique ](./public-key-cryptography.md):

Le chiffrement à clé publique, les signatures et la communication authentifiée.

  - [Génération de clés cryptographiques](./generating-cryptographic-keys.md):

Générer des clés cryptographiques prises en charge avec `kagami`.

  - [Réglage des clés cryptographiques](./storing-cryptographic-keys.md):

Conserver les clés cryptographiques à l'aide de commandes en couches appropriées au déploiement.
