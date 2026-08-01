---
translation_locale: fr
translation_source: /guide/security/public-key-cryptography.md
translation_source_hash: 3d317c00e75525d70f6cb9ef7f8eeec6911e2f124af8052cd2fc719b264d43f9
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# La cryptographie de la clé publique {#public-key-cryptography}

La cryptographie des clés publiques utilise une clé publique et une clé privée connexes. La clé publique peut être partagée. La clé privée doit rester sous le contrôle de l'autorité. La sécurité dépend de l'utilisation d'un algorithme pris en charge, la génération de clés avec un hasard sécurisé, et la protection de la clé privée.

## Signatures numériques {#digital-signatures}

Un signataire crée une signature numérique avec une clé privée. Un vérificateur vérifie la signature avec la clé publique correspondante.

Une signature valide indique que les octets signés n'ont pas été modifiés et que le détenteur de la clé privée les a approuvés. Elle n'identifie pas une personne par elle-même. L'identité dépend de la manière dont la clé publique ou le contrôleur du compte a été enregistré et réglementé.

Les signatures fournissent des preuves d'intégrité et d'autorisation, elles ne cryptent pas le contenu signé.

## Le chiffrement de la clé publique {#public-key-encryption}

Certains mécanismes à clé publique chiffrent des données pour la clé publique d'un destinataire. Le destinataire déchiffre ces données avec la clé privée correspondante. Le chiffrement et les signatures sont des opérations distinctes et peuvent utiliser différentes clés ou différents algorithmes.

La signature d'une transaction Iroha ne rend pas les données du registre public confidentielles. Utilisez le mécanisme de confidentialité approuvé du déploiement lorsque le contenu de la charge utile doit rester privé.

## Les clés du côté du client {#keys-on-the-client-side}

Chaque transaction doit satisfaire à la politique configurée du contrôleur de compte. Un compte simple peut utiliser une clé de signature. Un compte réglementé peut utiliser une politique de contrôle plus complexe.

Le logiciel client doit protéger les clés privées et le matériel du contrôleur. La configuration client en texte clair convient uniquement au développement local et aux tests contrôlés. Les intégrations de production doivent utiliser un gestionnaire de secrets, un stockage de clés supporté par le matériel, un service de signature isolé ou une autre limite de signature vérifiée.

Utilisez des clés séparées pour des environnements et des objectifs distincts. La réutilisation d'une clé relie ces utilisations et augmente l'impact de l'exposition.

Voir [Génération de clés cryptographiques](./generating-cryptographic-keys.md), [Rétention de clés Cryptographiques ](./storing-cryptographic-keys.md) et [Sécurité opérationnelle](./operational-security.md).
