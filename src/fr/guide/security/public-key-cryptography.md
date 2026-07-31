---
translation_locale: fr
translation_source: /guide/security/public-key-cryptography.md
translation_source_hash: fd8bca2c8909c6dfead2e2f7f4f4711ab80339a98b7e227c02aa3ff965380718
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# La cryptographie de la clé publique {#public-key-cryptography}

La cryptographie des clés publiques fournit les moyens de communication sécurisée et de protection des données, en permettant des activités telles que la sécurité des transactions en ligne, les communications par courrier électronique chiffrées, etc.

La cryptographie à clé publique utilise une paire de clés cryptographiques - une clé publique et une clé privée - pour créer une méthode hautement sécurisée de transmission d'informations sur les réseaux en ligne.

Il est facile de faire une clé publique à partir d'une clé privée, mais le contraire est plutôt difficile, sinon impossible. Cela garde les choses en sécurité. Vous pouvez partager librement votre clé publique sans risquer votre clé privée qui reste sécurisée.

## Le chiffrement et les signatures {#encryption-and-signatures}

La cryptographie de la clé publique permet aux individus d'envoyer des messages et des données chiffrés qui ne peuvent être déchiffrés que par le destinataire prévu possédant sa clé privée correspondante. En d'autres termes, la clé publique fonctionne comme un verrou, et la clé privée sert de clé unique réelle qui déverrouille les données cryptées.

Ce processus de cryptage garantit non seulement la vie privée et la confidentialité des informations sensibles, mais établit également l'authenticité de l'expéditeur. Cette signature sert de timbre d'approbation numérique, permettant de vérifier l'identité de l'expéditeur et la validité des données transférées.

## Les clés du côté du client {#keys-on-the-client-side}

Chaque transaction doit être signée par une autorité de compte. La clé privée ou le matériel du contrôleur pour cette autorité doivent rester secrets, de sorte que le logiciel client est responsable du stockage et de la signature sécurisés.

::: avertissement

Tous les clients sont différents, mais la configuration du client en texte brut ne convient qu'au développement et aux réseaux de test contrôlés.

:::

L'enregistrement d'un nouveau compte implique la génération de matériel du contrôleur, tel qu'une paire de clés Ed25519, et la soumission de la partie publique au réseau.

Pour que la cryptographie des clés publiques fonctionne efficacement, évitez de réutiliser les clés lorsque vous devez spécifier une nouvelle clé. Bien qu'il n'y ait rien qui vous empêche de le faire, les clefs publiques sont publiques, ce qui signifie que si un attaquant voit la même clé publique utilisée, Ils savent que les clés privées sont identiques.

Même si les clés privées fonctionnent selon des principes légèrement différents de ceux des mots de passe, il est conseillé de les rendre aussi aléatoires que possible, de ne jamais les stocker non cryptés et de ne jamais en partager avec qui que ce soit.
