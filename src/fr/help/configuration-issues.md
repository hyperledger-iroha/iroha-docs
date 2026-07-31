---
translation_locale: fr
translation_source: /help/configuration-issues.md
translation_source_hash: b62b106e985933d90dab1258d3b991674dd75d14322f2326148164b0fbee0f20
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Troubleshooting des problèmes de configuration {#troubleshooting-configuration-issues}

Cette section offre des conseils de résolution des problèmes pour Iroha 3 la configuration. Assurez-vous que vous
[J' ai vérifié les clés.](./overview.md#check-the-keys) d'abord, car c'est le plus
source commune de problèmes dans Iroha.

Si le problème que vous rencontrez n'est pas décrit ici, contactez-nous par
[Télégramme](https://t.me/hyperledgeriroha).

## Génèse dépassée sur un Docker Compose mise en place {#outdated-genesis-on-a-docker-compose-setup}

Lorsque vous utilisez le Docker Compose version de Iroha, vous pourriez rencontrer
l'émission d'un des conteneurs par rapport aux autres ayant échoué
`Failed to deserialize raw genesis block` l'erreur. Cela signifie généralement le paire,
La transaction génétique signée et la configuration générée ont été produites par
différent Iroha révision ou profil.

Vérifiez l' échec en suivant les étapes suivantes:

1. Utilisation `docker ps` - la vérification des conteneurs actuels.
   le profil généré, vous verrez généralement `hyperledger/iroha:dev`
   les conteneurs. Docker Compose le profil contient quatre pairs
   contenants, même si votre généré `docker-compose.yml` peut être différent.

2. Vérifiez les journaux et recherchez
   `Failed to deserialize raw genesis block` l'erreur. Si vous avez commencé votre
   Iroha en mode daemon avec `docker compose up -d`, utilisation
   `docker compose logs` Le commandement.

La façon de résoudre un tel problème dépend de l'utilisation de Iroha. Si c'est une
démo de base et vous n'avez pas besoin de préserver les données des pairs, régénérer une correspondance
réseau local ou Docker Compose groupe avec Kagami:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml
```

Ensuite, supprimez l'ancien état du conteneur et redémarrez à partir du régénéré
`genesis.signed.nrt`, de même `config.toml` les dossiers, et `client.toml`.

Si vous avez besoin de restaurer le Iroha les données d'instance, faites ce qui suit:

1. Connectez la seconde Iroha paritaire qui copiera les données de la première
   (échoué) paire.
2. Attendez que le nouveau pair synchronise les données avec le premier pair.
3. Laissez le nouveau paire actif.
4. Mettre à jour les fichiers de génèse et de configuration du premier pair uniquement dans le cadre de
   une migration coordonnée.

::: info

Il n'y a pas de voie de réécriture automatique générale pour remplacer la génèse sur un live
Il faut considérer cette migration comme une migration coordonnée: préserver l'ancien état,
les pairs compatibles, et seulement déplacer les validateurs à la nouvelle configuration après
les opérateurs s'accordent sur le plan de migration.

:::

## Format multihash des clés privées et publiques {#multihash-format-of-private-and-public-keys}

Si vous regardez le
[configuration du client](/fr/guide/configure/client-configuration.md), Tu vas le faire.
remarquer que les clés y sont données dans
[format multi-hash](https://github.com/multiformats/multihash).

Si vous n'avez jamais travaillé avec le multi-hash avant, il est naturel de supposer que
le côté droit n'est pas une représentation hexadecimale des octets clés
(deux symboles par octet), mais plutôt les octets codés comme ASCII (ou UTF-8),
et appeler `from_hex` sur la chaîne littérale dans les deux `public_key` et
`private_key` - Je ne sais pas.

Il est également naturel de supposer que l'appel `PrivateKey::try_from_str` sur le
string literal ne produirait que la clé correcte.
de bits dans la clé erronée, par exemple 32 octets contre 64, que cela soulèverait une erreur
Le message.

**Ces deux hypothèses sont fausses.** Malheureusement, les messages d'erreur
ne contribuent pas à dé-débugger ce type d'échec particulier.

**Comment réparer**: utilisation `hex_literal`. Cela va aussi tourner une chaîne de
les caractères dans une petite table de chiffres hexadecimaux évidemment.

::: warning

Même le `try_from_str` la mise en œuvre ne peut pas vérifier si une chaîne donnée est un
valides `PrivateKey` et vous avertir si ce n'est pas le cas.

Il détectera certaines erreurs évidentes, par exemple si la chaîne contient un
Cependant, puisque nous visons à soutenir de nombreux formats clés, il ne peut pas faire beaucoup
Il ne peut pas dire si la clé est _correcte_ clé privée _pour les données
compte_ à moins que vous ne soumettez une instruction.

:::

These Il est possible d'éviter certaines erreurs subtiles, par exemple en
Desérialiser directement à partir de lettres en corde ou générer un nouveau
couples de clés dans les endroits où cela a du sens.
