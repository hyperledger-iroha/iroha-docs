---
translation_locale: fr
translation_source: /guide/security/password-security.md
translation_source_hash: 093be5b91700b9a6f85b45dc873c8c29d90397d5c9e3c842a77bfb03e97b37da
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Sécurité des mots de passe {#password-security}

Les mots de passe peuvent protéger les consoles des opérateurs, les magasins secrets, les sauvegardes et les fichiers de clés locaux. Un mot de passe n'est qu'un contrôle. Utilisez-le avec la garde sécurisée des clés, les contrôles d'accès et l'authentification multifactorielle lorsque cela est disponible.

## Utilisez des mots de passe uniques et générés {#use-unique-generated-passwords}

- Générez un mot de passe différent pour chaque compte et environnement.
- Utilisez un gestionnaire de mots de passe pour créer et stocker des mots de passe longs et aléatoires.
- N'utilisez une phrase de passe composée de plusieurs mots que lorsque ses mots sont choisis au hasard dans une liste suffisamment grande.
- Ne mettez pas de noms, de dates, d'adresses, de citations, de motifs de clavier ni de fragments réutilisés dans les mots de passe.
- Utilisez un jeton généré par le service ou une clé cryptographique au lieu d'un mot de passe saisi par un humain lorsque le service prend en charge cette méthode.

La longueur et l'imprévisibilité comptent plus que les substitutions décoratives. Ajouter un symbole à un mot prévisible ne rend pas le résultat sûr.

## Protéger les comptes basés sur des mots de passe {#protect-password-based-accounts}

- Activez l'authentification multi-facteurs résistante au phishing là où elle est disponible.
- Appliquer des limites de taux, une politique de verrouillage et des alertes aux échecs d'authentification répétés.
- Envoyez les mots de passe uniquement via des canaux authentifiés et chiffrés.
- Gardez les mots de passe et les codes de récupération hors des journaux, des lignes de commande, des dépôts de code source, des fichiers de configuration, des tickets et des discussions.
- Stockez les vérificateurs de mot de passe côté serveur avec une fonction de hachage de mot de passe salée et résistante à la mémoire, ainsi que des paramètres appropriés au déploiement.

## Stockage, Récupération et Remplacement {#storage-recovery-and-replacement}

- Utilisez un gestionnaire de mots de passe audité avec des sauvegardes cryptées et testées.
- Conservez les codes de récupération séparément de l'appareil qu'ils permettent de récupérer. Une copie papier protégée hors ligne peut convenir pour le matériel de récupération.
- Limiter l'accès aux exportations du gestionnaire de mots de passe et aux supports de sauvegarde.
- Remplacez un mot de passe après une exposition suspectée, une réutilisation non autorisée ou un événement de politique qui nécessite un remplacement.
- Tester les procédures de récupération de compte avant le lancement en production.

::: warning

Un mot de passe qui déverrouille une clé privée ne peut pas rendre sûre une copie exposée de cette clé. Si une exposition de clé privée est suspectée, suivez la procédure de remplacement ou de révocation des clés de l'environnement de déploiement.

:::

Voir [Sécurité opérationnelle](./operational-security.md) et [Stockage des clés cryptographiques](./storing-cryptographic-keys.md).
