---
translation_locale: fr
translation_source: /guide/configure/peer-management.md
translation_source_hash: 4e48c937ca973319cd060876b123ff405d27d9d8bc11818e608d821295412c77
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Gestion par les pairs {#peer-management}

Si vous avez suivi l'un des guides spécifiques à la langue, vous avez maintenant un
réseau bien fonctionnant auquel les gens voudront adhérer.

## Blockchain publique {#public-blockchain}

Dans un réseau ouvert, l'admission par les pairs est toujours une décision de politique en chaîne.
peut exécuter le logiciel correct et se connecter à Torii, Mais il ne participe que
en consensus après que le réseau ait admis son identité partagée.

## Chaîne de blocs privée {#private-blockchain}

Dans un cadre bancaire, permettre à tout le monde de se joindre à leur loisir est une sécurité
Pour des raisons de sécurité, Iroha les déploiements sont généralement fixés sur la topologie partagée
la configuration et la génèse au lieu de compter sur une découverte ouverte.

### Enregistrement des pairs {#registering-peers}

Pour ajouter un pair au réseau, il faut l'enregistrer manuellement.
les mesures à prendre pour mener à bien ce processus.

#### 1. Accorder aux utilisateurs des autorisations {#_1-grant-the-user-permissions}

Le compte qui enregistre le coéquipier doit contenir les informations appropriées `Permission`.
Cette garantie peut être accordée par le biais d'une `Role` ou en tant que permis direct.

Comment décider si vous devez accorder un rôle?
l'utilisateur est de servir comme un type d'administrateur, où il est leur
La responsabilité de maintenir les pairs dans le réseau à long terme.
l'octroi d'une autorisation est utile lorsque la partie qui enregistre le coéquipier n'est pas
responsable de l'enregistrement des pairs en général, mais l'administrateur du réseau
n'a pas besoin (ou ne veut pas) de passer du temps à créer un nouveau paire.

::: info

L' exécuteur par défaut utilise le `CanManagePeers` jeton de permission pour
les pairs inscrits et non inscrits.

:::

We débattre des autorisations et des rôles avec plus de détails dans un
[chapitre séparé](/fr/blockchain/permissions.md).

#### 2. Mettre en place un groupe de travail {#_2-set-up-a-peer}

Une fois qu'un nouveau coéquipier a obtenu des autorisations, il doit être mis en place.

Demandez la configuration de pair actuelle avant d'admettre un nœud. Torii exposés
paramètre de nœud et les points d'extrémité de la capacité à cet effet.
ne négocient pas ces valeurs automatiquement: les exploitants doivent vérifier que les temps passés,
les tailles de lot et d'autres paramètres pertinents pour le consensus correspondent au réseau.

Pour simplifier le processus, vous pouvez demander à l'administrateur de réseau un
version modifiée de `config.toml`, qui exclut les renseignements privilégiés,
comme les clés privées de pairs.

#### 3. soumettre l'instruction {#_3-submit-the-instruction}

_Après_ votre paire est en cours de course, vous devriez soumettre le _enregistrement partagé_
L'équipe passera par le processus de serrage de main et commence
Je suis en train de discuter avec le réseau.

::: tip

Présentation d'une instruction sur l'enregistrement par les pairs **n'est pas** (et ne peut pas)
à l'instant _nouveau processus par les pairs_.

:::

### Peers non inscrits {#unregistering-peers}

Pour des raisons de sécurité, ce processus est
Le réseau arrive à un consensus qu'il veut supprimer un paire,
Mais le paire lui-même ne sait pas pourquoi personne ne lui parle.

Dans la plupart des cas, si vous souhaitez retirer un coéquipier de l'enregistrement, vous devez le faire
Parce que c'est une faute byzantine.
Le malveillant acteur de la chaîne.
