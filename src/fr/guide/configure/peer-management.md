---
translation_locale: fr
translation_source: /guide/configure/peer-management.md
translation_source_hash: f085fa1587595414f95705bbe2cd285752b0fe12cffb9ef29a33399f9a1f3f86
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Gestion des pairs réseau {#peer-management}

Si vous avez suivi l'un des guides spécifiques à une langue, vous disposez maintenant d'un réseau bien fonctionnel que les gens voudront rejoindre.

## Bloc chaîne publique {#public-blockchain}

Dans un réseau ouvert, l'admission des pairs du réseau reste une décision de politique de la chaîne. Un nœud peut exécuter le logiciel correct et se connecter à Torii, mais il ne participe au consensus qu'après que le réseau ait admis son identité de pair du réseau.

## Blockchain privée {#private-blockchain}

Dans un environnement bancaire, permettre à tout le monde de rejoindre à leur convenance représente un risque de sécurité. Pour des raisons de sécurité, les déploiements privés Iroha fixent généralement la topologie des pairs du réseau dans la configuration et le génesis de la blockchain au lieu de se fier à la découverte ouverte.

### Enregistrement des pairs réseau {#registering-peers}

Pour ajouter un pair réseau au réseau, il doit être enregistré manuellement. Discutons des étapes à suivre pour compléter ce processus.

#### 1. Accorder les permissions à l'utilisateur {#_1-grant-the-user-permissions}

Le compte qui enregistre le pair du réseau doit disposer du `Permission` approprié. Cela peut être accordé par le biais d'un `Role` ou sous forme d'une autorisation directe.

Attribuer un rôle lorsqu’un compte gérera les pairs du réseau au fil du temps. Utilisez une attribution de permission directe pour un enregistrement unique par un compte qui ne gère pas autrement les pairs du réseau.

::: info

L'exécuteur par défaut utilise le jeton de permission `CanManagePeers` pour enregistrer et désenregistrer les pairs réseau.

:::

Nous discutons des autorisations et des rôles avec plus de détails dans un [chapitre séparé](/fr/blockchain/permissions.md).

#### 2. Configurer un pair réseau {#_2-set-up-a-peer}

Après qu'un nouveau pair réseau a reçu des autorisations, il doit être configuré.

Demandez la configuration actuelle des pairs réseau avant d'admettre un nœud. Torii expose le paramètre de nœud et les points de terminaison de capacité API à cet effet. Le bootstrap du pair réseau ne négocie pas automatiquement ces valeurs : les opérateurs doivent vérifier que les délais d'attente, les tailles de lots et d'autres paramètres pertinents pour le consensus correspondent au réseau.

Pour simplifier le processus, vous pouvez demander à l'administrateur réseau une version expurgée de `config.toml`, qui exclut les informations privilégiées, telles que les clés privées des pairs du réseau.

#### 3. Soumettez l'instruction {#_3-submit-the-instruction}

Une fois que votre pair réseau fonctionne, vous devez soumettre l'instruction d'enregistrement du pair. Le pair réseau passera par le processus de poignée de main et commencera à discuter avec le réseau.

::: tip

La soumission d'une instruction d'enregistrement d'un pair réseau ne crée pas (et ne peut pas créer) un nouveau processus de pair réseau.

:::

### Désenregistrement des pairs réseau {#unregistering-peers}

Qu'en est-il de la désinscription des pairs du réseau ? Pour des raisons de sécurité, ce processus est unilatéral. Le réseau parvient à un consensus pour vouloir supprimer un pair du réseau, mais le pair du réseau lui-même ne sait pas vraiment pourquoi personne ne communique avec lui.

Dans la plupart des circonstances, si vous voulez désenregistrer un pair réseau, c'est parce qu'il présente une anomalie byzantine. Simplement « ignorer » ce pair réseau rend la vie de l'acteur malveillant sur le réseau plus difficile.
