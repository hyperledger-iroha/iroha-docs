---
translation_locale: fr
translation_source: /guide/security/storing-cryptographic-keys.md
translation_source_hash: 168ee24e84f9225e81365658018717155476ae1508fefba5e0234e0bf6feefbd
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Le stockage des clés cryptographiques {#storing-cryptographic-keys}

Une clé privée peut autoriser toutes les actions permises à l'autorité correspondante. Ne partagez jamais une clé privée. Protégez avec le même soin le matériel de génération, les secrets de récupération, les jetons au porteur et les fichiers de clés exportés.

Choisissez le modèle de conservation avant la mise en production. Il doit être adapté à la valeur exposée, à la politique du contrôleur du compte et au processus de récupération du déploiement.

## Définir les limites de la garde {#define-the-custody-boundary}

- Tenez un inventaire de chaque autorité, clé publique, algorithme, environnement, finalité, dépositaire, emplacement de stockage, sauvegarde et procédure de remplacement.
- Utilisez des clés séparées pour le développement, les essais, la production, les transactions de routine, la gouvernance, le déploiement et la récupération.
- Ne donnez aux personnes et aux processus accès qu'aux clés nécessaires à leur rôle.
- Exigez une approbation indépendante pour les signatures de grande valeur ou de gouvernance lorsque le modèle de risque l'impose.
- Consignez le réseau et l'autorité que chaque signataire peut utiliser. Un service de signature doit rejeter les demandes qui sortent de ce périmètre.

## Choisissez une méthode de stockage appropriée {#choose-an-appropriate-storage-method}

Pour le développement local, les tests contrôlés ou un transfert sécurisé vers le dispositif de conservation, une clé peut être exportée dans un fichier aux permissions restreintes. Sur une plateforme Unix prise en charge, générez un nouveau répertoire de clés avec `kagami` :

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

Le répertoire parent doit exister. Le répertoire cible doit être nouveau ou appartenir déjà à l'utilisateur actuel, avoir le mode `0700`, ne contenir aucun lien symbolique et être vide. Kagami écrit `public.key` et `private.key` avec le mode `0600` ; `--pop` écrit également `pop.hex`. La commande échoue sur les plateformes où Kagami ne peut pas appliquer les règles du système de fichiers qui limitent l'accès au propriétaire.

Le fichier de clé privée est une exportation non chiffrée. Ne le placez pas dans le contrôle de version, les dossiers partagés, les journaux, les tickets, les conversations ni les artefacts de compilation. Importez une clé de production dans son dispositif de conservation approuvé, puis supprimez l'exportation conformément à la procédure de déploiement. Ne réutilisez pas une clé de développement en production.

Pour la production, privilégiez un dispositif de conservation audité, tel que :

- un module matériel de sécurité ou un magasin de clés protégé par le matériel
- un magasin de clés du système d'exploitation ou d'un appareil mobile
- un service de signature isolé
- un gestionnaire de secrets qui ne délivre une clé qu'à une charge de travail autorisée

Conservez le matériel de clé sous une forme non exportable lorsque l'intégration choisie le permet. Vérifiez que le système de conservation prend en charge l'algorithme et l'opération de signature requis par l'autorité Iroha.

Le chiffrement au repos protège une copie stockée. Il ne protège plus la clé après qu'un processus ou un opérateur non autorisé a obtenu les octets déchiffrés. Renforcez la sécurité de l'hôte, limitez les accès à l'exécution et surveillez l'activité de signature.

## Protéger les flux de signature {#protect-signing-workflows}

- Utilisez des identités d'opérateur nominatives, une authentification forte et un accès audité aux systèmes de signature.
- Gardez les clés brutes hors des arguments de ligne de commande, de l'historique du shell, des vidages d'environnement, des listes de processus, des rapports de plantage et des journaux d'application.
- Déverrouillez un signataire uniquement pour l'opération requise. Fermez la session ou laissez-la expirer après utilisation.
- Affichez l'autorité, le réseau, les instructions, les actifs et les frais avant l'approbation.
- Exigez une confirmation explicite pour les transactions privilégiées ou de grande valeur.
- Gardez les clés privées brutes en dehors des pages du navigateur et des processus d'application à usage général lorsque l'intégration client personnalisée peut déléguer la signature.

La configuration du client en texte brut ne convient qu'au développement local et aux tests contrôlés. Une intégration de production doit obtenir les signatures par l'intermédiaire de son dispositif de conservation approuvé. La CLI Iroha standard lit une clé privée dans la configuration du client et ne fournit pas d'adaptateur générique pour signataire externe. Les clients personnalisés peuvent construire le hachage de la charge utile de la transaction et y joindre une signature produite par un signataire externe.

## Sauvegarder et récupérer les clés {#back-up-and-recover-keys}

- Ne sauvegardez que les clés dont la politique de récupération exige une sauvegarde.
- Chiffrez les sauvegardes et conservez-les séparément du signataire actif.
- Appliquez aux sauvegardes les mêmes contrôles d'accès et d'approbation qu'à la clé active.
- Conservez les identifiants de récupération sous une garde indépendante lorsqu'une séparation des fonctions est requise.
- Testez la restauration sans exposer le matériel des clés de production.
- Consignez et examinez chaque création, accès, restauration et destruction de sauvegarde.

Ne supposez pas que le format mnémonique d'un portefeuille sans rapport puisse représenter une clé privée Iroha. Utilisez uniquement un format de récupération pris en charge et testé par le système de conservation choisi.

## Remplacez les clés exposées ou retirées {#replace-exposed-or-retired-keys}

Préparez le remplacement avant qu'un incident ne survienne. La procédure doit préciser :

1. qui peut déclarer une clé exposée ou retirée
2. comment le signataire concerné est isolé
3. comment une nouvelle clé est générée et placée sous une garde approuvée
4. pour un compte, comment le remplacement autorisé du contrôleur ou la récupération sociale crée l'`AccountId` canonique de remplacement et migre l'état associé
5. pour un nœud ou un pair, comment la rotation ou la désactivation autorisée sur la chaîne de la clé de consensus est coordonnée avec la BLS PoP, la politique d'activation et de chevauchement, la configuration de la clé locale, `trusted_peers_pop` et la topologie du déploiement
6. comment les configurations, applications et opérateurs dépendants adoptent le nouvel `AccountId`, la clé publique ou l'identité du pair
7. comment l'autorité de l'ancienne clé est supprimée et comment ses copies sont archivées ou détruites
8. comment le réseau et les applications dépendantes sont ensuite vérifiés

::: warning

Le cryptage ou un nouveau mot de passe ne peuvent pas rendre une clé privée copiée sûre à nouveau. Lorsque l'exposition est soupçonnée, cesser d'utiliser la clé et suivre la procédure de remplacement ou de révocation approuvée.

:::

Voir [Generation de clés cryptographiques](./generating-cryptographic-keys.md), [ Sécurité opérationnelle](./operational-security.md) et [Principes de sécurité](./security-principles.md).
