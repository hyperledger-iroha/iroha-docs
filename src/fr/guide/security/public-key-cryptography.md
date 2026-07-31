---
translation_locale: fr
translation_source: /guide/security/public-key-cryptography.md
translation_source_hash: fd8bca2c8909c6dfead2e2f7f4f4711ab80339a98b7e227c02aa3ff965380718
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# La cryptographie des clés publiques {#public-key-cryptography}

La cryptographie des clés publiques fournit les moyens d'une communication sécurisée et de la protection des données, permettant des activités telles que des transactions en ligne sécurisées, des communications par courrier électronique chiffrées, etc.

La cryptographie à clé publique utilise une paire de clés cryptographiques _le public_ clé et un _privé_ - créer une méthode de transmission d'informations hautement sécurisée sur les réseaux en ligne.

Il est facile de faire une clé publique à partir d'une clé privée, mais le contraire est plutôt difficile, sinon impossible. Cela garde les choses en sécurité. Vous pouvez librement partager votre clé publique sans risquer votre clé privée qui reste sécurisée.

## Le chiffrement et les signatures {#encryption-and-signatures}

La cryptographie des clés publiques permet aux individus d'envoyer des messages chiffrés et des données qui ne peuvent être déchiffrées que par le destinataire souhaité possédant leur clé privée correspondante.

Ce processus de cryptage garantit non seulement la confidentialité des informations sensibles, mais établit également l'authenticité de l'expéditeur. _signature_ Cette signature sert de timbre d'approbation numérique, vérifiant l'identité de l'expéditeur et la validité des données transférées. _le public_ clé peut vérifier que la personne qui a initié la transaction a utilisé votre _privé_ La clé.

## Les clés du côté client {#keys-on-the-client-side}

Chaque transaction doit être signée par une autorité de compte.
le matériel contrôleur pour cette autorité doit rester secret, donc le logiciel client est
responsable du stockage et de la signature sécurisés.

::: warning

Tous les clients sont différents, mais la configuration du client en texte brut est seulement appropriée
Pour les réseaux de développement et d'essais contrôlés, l'intégration de la production devrait être
utiliser un gestionnaire secret, le stockage de clés matérialisé ou une autre signature vérifiée
La frontière.

:::

Registering un nouveau compte implique la génération de matériel de contrôle, tel qu'un
Ed25519 paire de clés, et soumettre la partie publique au réseau.
Les transactions effectuées à partir de ce compte doivent être signées par la clé privée correspondante ou
la politique du contrôleur de compte configuré.

Pour que la cryptographie des clés publiques fonctionne efficacement, évitez de réutiliser les clés lorsque vous devez spécifier une nouvelle clé. _le public_, Ce qui signifie que si un attaquant voit la même clé publique utilisée, il saura que les clés privées sont identiques.

Même si _privé_ Les clés fonctionnent selon des principes légèrement différents de ceux des mots de passe, le conseil*pour les rendre aussi aléatoires que possible, ne jamais les stocker non cryptés et ne jamais les partager avec personne en aucune circonstance*applique.
