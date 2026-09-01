---
translation_locale: fr
translation_source: /guide/security/public-key-cryptography.md
translation_source_hash: 3d317c00e75525d70f6cb9ef7f8eeec6911e2f124af8052cd2fc719b264d43f9
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Cryptographie à clé publique {#public-key-cryptography}

La cryptographie à clé publique utilise une clé publique et une clé privée liées. La clé publique peut être partagée. La clé privée doit rester sous le contrôle du principal autorisé. La sécurité dépend de l'utilisation d'un algorithme pris en charge, de la génération de clés avec un aléa sécurisé et de la protection de la clé privée.

## Signatures numériques {#digital-signatures}

Un signataire cryptographique crée une signature numérique avec une clé privée. Un vérificateur vérifie la signature avec la clé publique correspondante.

Une signature valide montre que les octets signés n'ont pas été modifiés et que le détenteur de la clé privée les a approuvés. Elle n'identifie pas une personne à elle seule. L'identité dépend de la façon dont la clé publique ou le contrôleur du compte a été enregistré et géré.

Les signatures fournissent des preuves d'intégrité et d'autorisation. Elles n'encryptent pas le contenu signé.

## Chiffrement à clé publique {#public-key-encryption}

Certain schémas de clés publiques chiffrent les données pour la clé publique d'un destinataire. Le destinataire déchiffre ces données avec la clé privée correspondante. Le chiffrement et les signatures sont des opérations distinctes et peuvent utiliser des clés ou des algorithmes différents.

Iroha La signature de transaction ne rend pas les données du registre public de la blockchain confidentielles. Utilisez le mécanisme de confidentialité approuvé pour le déploiement lorsque le contenu de la charge utile doit rester privé.

## Clés côté client {#keys-on-the-client-side}

Chaque transaction doit satisfaire à la politique de contrôle de compte configurée. Un compte simple peut utiliser une seule clé de signature. Un compte géré peut utiliser une politique de contrôle plus complexe.

Le logiciel client doit protéger les clés privées et autres éléments du contrôleur. La configuration client en texte clair n'est adaptée que pour le développement local et les tests contrôlés. Les intégrations en production devraient utiliser un gestionnaire de secrets, un stockage de clés sécurisé par matériel, un service de signature isolé ou une autre frontière de signature auditée.

Utilisez des clés séparées pour des environnements et des usages différents. Réutiliser une clé lie ces usages et augmente l'impact en cas d'exposition.

Voir [Génération de clés cryptographiques](./generating-cryptographic-keys.md), [Stockage des clés cryptographiques](./storing-cryptographic-keys.md), et [Sécurité opérationnelle](./operational-security.md).
