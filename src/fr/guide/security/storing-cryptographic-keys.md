---
translation_locale: fr
translation_source: /guide/security/storing-cryptographic-keys.md
translation_source_hash: 168ee24e84f9225e81365658018717155476ae1508fefba5e0234e0bf6feefbd
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Stockage des clés cryptographiques {#storing-cryptographic-keys}

Une clé privée peut autoriser chaque action permise à son principal d'autorisation. Ne partagez jamais une clé privée. Protégez le matériau de départ, les secrets de récupération, les jetons porteurs et les fichiers de clés exportés avec la même attention.

Choisissez le design de garde avant le lancement de la production. Le design doit correspondre à la valeur à risque, à la politique du contrôleur de compte et au processus de récupération du déploiement.

## Définir la limite de garde {#define-the-custody-boundary}

- Conservez un inventaire de chaque principal d'autorisation, clé publique, algorithme, environnement, objectif, dépositaire, emplacement de stockage, sauvegarde et procédure de remplacement.
- Utilisez des clés séparées pour le développement, les tests, la production, les transactions courantes, la gouvernance, le déploiement et la récupération.
- Donnez aux personnes et aux processus l'accès uniquement aux clés requises par leur rôle.
- Exiger une approbation indépendante pour les signatures de grande valeur ou de gouvernance lorsque le modèle de risque le nécessite.
- Enregistrez quel réseau et quel principal d'autorisation un signataire cryptographique peut utiliser. Un service de signature doit rejeter les demandes en dehors de ce périmètre.

## Choisir une méthode de stockage appropriée {#choose-an-appropriate-storage-method}

Pour le développement local, les tests contrôlés ou un transfert sécurisé de clé, une clé peut être exportée vers un fichier à accès restreint. Sur une plateforme Unix prise en charge, générez un nouveau répertoire de clés avec `kagami` :

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

Le répertoire parent doit exister. La cible doit être nouvelle ou déjà possédée par l'utilisateur actuel, mode `0700`, sans liens symboliques, et vide. Kagami écrit `public.key` et `private.key` avec le mode `0600` ; `--pop` écrit également `pop.hex`. La commande échoue sur les plateformes où Kagami ne peut pas appliquer les règles du système de fichiers réservées au propriétaire.

Le fichier de clé privée est une exportation non chiffrée. Tenez-le à l’écart du contrôle de source, des dossiers partagés, des journaux, des tickets, des conversations et des artefacts de compilation. Importez une clé de production dans son périmètre de garde approuvé, puis supprimez l’exportation conformément à la procédure de déploiement. Ne réutilisez pas une clé de développement en production.

Pour la production, privilégiez une frontière de garde auditée telle que :

- un module de sécurité matériel ou un magasin de clés basé sur le matériel
- un magasin de clés du système d'exploitation ou mobile
- un service de signature isolé
- un gestionnaire de secrets qui ne libère une clé qu'à une charge de travail autorisée

Conservez le matériel clé non exportable lorsque l'intégration sélectionnée prend en charge cette propriété. Confirmez que le système de conservation prend en charge l'algorithme et l'opération de signature requis par le principal d'autorisation Iroha.

Le chiffrement des données au repos protège une copie stockée. Il ne protège pas une clé après qu'un processus ou un opérateur non autorisé a obtenu les octets décryptés. Renforcez l'hôte, restreignez l'accès en temps d'exécution aux logiciels et surveillez l'activité de signature.

## Protéger les flux de travail de signature {#protect-signing-workflows}

- Utilisez des identités d'opérateurs nommées, une authentification forte et un accès audité aux systèmes de signature.
- Gardez les clés non chiffrées hors des arguments de ligne de commande, de l'historique du shell, des vidages d'environnement, des listes de processus, des rapports de plantage et des journaux d'application.
- Déverrouillez un signataire cryptographique uniquement pour l'opération requise. Fermez ou expirez la session après utilisation.
- Affichez le principal d'autorisation, le réseau, les instructions, les actifs et les frais avant approbation.
- Exiger une confirmation explicite pour les transactions privilégiées ou de grande valeur.
- Gardez les clés privées brutes en dehors des pages du navigateur et des processus d'application à usage général lorsqu'une intégration client personnalisée peut déléguer la signature.

La configuration client en texte clair convient uniquement au développement local et aux tests contrôlés. Une intégration en production devrait obtenir les signatures via sa frontière de conservation approuvée. Le stock Iroha CLI lit une clé privée à partir de la configuration du client et ne fournit pas d'adaptateur de signataire externe générique. Les clients personnalisés peuvent construire le hachage cryptographique de la charge utile de la transaction et joindre une signature produite par un signataire cryptographique externe.

## Sauvegarder et récupérer les clés {#back-up-and-recover-keys}

- Sauvegardez uniquement les clés dont la politique de récupération nécessite une sauvegarde.
- Chiffrez les sauvegardes et gardez-les séparées du signataire cryptographique actif.
- Appliquez les mêmes contrôles d'accès et d'approbation à une sauvegarde qu'à la clé active.
- Conservez les informations d'identification de récupération sous garde indépendante lorsque la séparation des fonctions est requise.
- Tester la restauration sans exposer le matériel clé de production.
- Enregistrez et examinez chaque création, accès, restauration et destruction de sauvegarde.

Ne supposez pas qu’un format de mnémonique de portefeuille non lié puisse représenter une clé privée Iroha. Utilisez uniquement un format de récupération pris en charge et testé par le système de garde sélectionné.

## Remplacer les clés exposées ou désaffectées {#replace-exposed-or-retired-keys}

Préparez le remplacement avant un incident. La procédure doit identifier :

1. qui peut déclarer qu'une clé est exposée ou mise hors service
2. comment le signataire cryptographique affecté est isolé
3. comment une nouvelle clé est générée et placée en garde approuvée
4. pour un compte, comment le remplacement autorisé du contrôleur ou la récupération sociale crée le canonique de remplacement `AccountId` et migre l'état lié
5. pour un nœud ou un pair de réseau, comment une rotation ou une désactivation autorisée de clé de consensus en chaîne est coordonnée avec le BLS PoP, la politique d'activation et de chevauchement, la configuration locale des clés, `trusted_peers_pop`, et la topologie de déploiement
6. comment les configurations, applications et opérateurs dépendants adoptent le nouveau `AccountId`, la clé publique ou l'identité du pair réseau
7. comment le principal d'autorisation de l'ancienne clé est supprimé et que ses copies sont archivées ou détruites
8. comment le réseau et les applications dépendantes sont vérifiés ensuite

::: warning

Le chiffrement ou un nouveau mot de passe ne peut pas rendre une clé privée copiée à nouveau sûre. En cas de suspicion d’exposition, cessez d’utiliser la clé et suivez la procédure approuvée de remplacement ou de révocation.

:::

Voir [Génération de clés cryptographiques](./generating-cryptographic-keys.md), [Sécurité opérationnelle](./operational-security.md), et [Principes de sécurité](./security-principles.md).
