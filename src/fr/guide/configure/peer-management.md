---
translation_locale: fr
translation_source: /guide/configure/peer-management.md
translation_source_hash: 4e48c937ca973319cd060876b123ff405d27d9d8bc11818e608d821295412c77
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Gestion par les pairs {#peer-management}

Si vous avez suivi l'un des guides spécifiques à la langue, vous disposez maintenant d'un réseau bien fonctionnant auquel les gens voudront adhérer.

## Blockchain publique {#public-blockchain}

Dans un réseau ouvert, l'admission de pairs est toujours une décision de politique en chaîne. Un nœud peut exécuter le logiciel correct et se connecter à Torii, mais il ne participe au consensus qu'après que le réseau a admis son identité de pair.

## Chaîne de blocs privée {#private-blockchain}

Dans un contexte bancaire, permettre à tout le monde de se joindre à leur temps libre est un risque pour la sécurité. Iroha Les déploiements fixent généralement la topologie des pairs dans la configuration et la génèse au lieu de s'appuyer sur une découverte ouverte.

### Enregistrement des pairs {#registering-peers}

Pour ajouter un peer au réseau, il doit être enregistré manuellement. Discutons des étapes à prendre pour compléter ce processus.

#### 1. Accordez aux utilisateurs des autorisations {#_1-grant-the-user-permissions}

Le compte qui enregistre le coéquipier doit disposer du `Permission` approprié, qui peut être accordé par l'intermédiaire d'un `Role` ou sous forme de permis direct.

Comment décider si vous devez accorder un rôle? L'octroi de rôles a du sens si l'utilisateur doit servir comme administrateur, où il est de sa responsabilité de maintenir les pairs dans le réseau à long terme. Une autorisation unique est utile lorsque la partie qui enregistre le paire n'est pas responsable de l'enregistrement des pairs en général, mais que l'administrateur du réseau n'a pas besoin (ou ne veut pas) passer du temps à mettre en place un nouveau pair.

::: informations

L'exécuteur par défaut utilise le jeton d'autorisation `CanManagePeers` pour enregistrer et ne pas enregistrer des pairs.

:::

Nous discutons plus en détail des autorisations et des rôles dans un chapitre séparé [ ](/fr/blockchain/permissions.md).

#### 2. Mettre en place un groupe de travail {#_2-set-up-a-peer}

Une fois qu'un nouveau coéquipier a obtenu des autorisations, il doit être mis en place.

Demandez la configuration de pair actuelle avant d'admettre un nœud. Torii expose le paramètre du nœud et les points d'extrémité de capacité à cet effet. Les exploitants doivent vérifier que les délais, les tailles de lot et d'autres paramètres pertinents pour le consensus correspondent au réseau.

Pour simplifier le processus, vous pouvez demander à l'administrateur du réseau une version modifiée de `config.toml`, qui exclut les renseignements privilégiés, tels que les clés privées des pairs.

#### 3. soumettre l'instruction {#_3-submit-the-instruction}

Une fois que votre coéquipier a commencé à courir, vous devez soumettre l'instruction par rapport au registre. Le coéquipier passera par le processus de poignée de main et commencera à discuter avec le réseau.

::: astuce

La soumission d'une instruction d'enregistrement par les pairs ne permet pas (et ne peut pas) d'installer un nouveau processus par les paires.

:::

### Les pairs non inscrits {#unregistering-peers}

Pour des raisons de sécurité, ce processus est unilatéral. Le réseau arrive à un consensus qu'il veut supprimer un paire, mais le paire lui-même ne sait pas grand-chose sur la raison pour laquelle personne ne parle à lui.

Dans la plupart des cas, si vous voulez annuler l'enregistrement d'un coéquipier, vous devez le faire parce que c'est une faute byzantine. Le simple fait de " fantasmer " ce paire rend la vie du malveillant acteur sur le réseau plus difficile.
