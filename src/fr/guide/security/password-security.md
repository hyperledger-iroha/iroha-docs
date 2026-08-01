---
translation_locale: fr
translation_source: /guide/security/password-security.md
translation_source_hash: 093be5b91700b9a6f85b45dc873c8c29d90397d5c9e3c842a77bfb03e97b37da
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Sécurité des mots de passe {#password-security}

Les mots de passe peuvent protéger les consoles d'opérateur, les magasins secrets, les sauvegardes et les fichiers clés locaux. Un mot de passe n'est qu'un seul contrôle. Utilisez-le avec la conservation sécurisée des clés, les contrôles d'accès et l'authentification à plusieurs facteurs lorsque cela est disponible.

## Utilisez des mots de passe uniques générés {#use-unique-generated-passwords}

- Générer un mot de passe différent pour chaque compte et l'environnement.
- Utilisez un gestionnaire de mots de passe pour créer et stocker de longs mots de passe aléatoires.
- Utilisez une phrase de mot de passe à plusieurs mots uniquement lorsque ses mots sont sélectionnés au hasard dans une liste suffisamment importante.
- Conservez les noms, les dates, les adresses, les citations, les modèles de clavier et les fragments réutilisés hors des mots de passe.
- Utilisez un jeton ou une clé cryptographique généré par le service au lieu d'un mot de passe entré par l'homme lorsque le service prend en charge cette méthode.

La longueur et l'imprévisibilité comptent plus que les remplacements décoratifs. L'ajout d'un seul symbole à un mot prévisible ne rend pas le résultat sûr.

## Protéger les comptes basés sur des mots de passe {#protect-password-based-accounts}

- Activer l'authentification à plusieurs facteurs résistante au phishing lorsque celle-ci est disponible.
- Appliquer des limites de tarifs, une politique de verrouillage et des alertes pour les échecs d'authentification répétés.
- Envoyez des mots de passe uniquement par les canaux authentifiés et cryptés.
- Gardez les mots de passe et les codes de récupération à l'écart des journaux, lignes de commande, dépôts sources, fichiers de configuration, billets et chat.
- Conserver les vérificateurs de mots de passe du côté du serveur avec une fonction de hachage des mots de passe salée et durable en mémoire et des paramètres appropriés au déploiement.

## Le stockage, la récupération et le remplacement {#storage-recovery-and-replacement}

- Utilisez un gestionnaire de mot de passe vérifié avec des sauvegardes cryptées et testées.
- Conserver les codes de récupération séparément du dispositif qu'ils récupèrent. Une copie papier hors ligne protégée peut être appropriée pour le matériel de récupération.
- Limiter l'accès aux exportations de gestionnaires de mots de passe et aux supports de sauvegarde.
- Remplacez un mot de passe après une exposition suspectée, une réutilisation non autorisée ou un événement d'une politique qui nécessite un changement.
- Test des procédures de récupération des comptes avant le lancement de la production.

::: warning

Un mot de passe qui déverrouille une clé privée ne peut pas rendre un exemplaire exposé de cette clé en sécurité. Si l'exposition à la clé privée est suspectée, suivez la procédure de remplacement ou de révocation de la clé du déploiement.

:::

Voir [Sécurité opérationnelle](./operational-security.md) et [Couvertures cryptographiques de stockage ](./storing-cryptographic-keys.md).
