---
translation_locale: fr
translation_source: /help/configuration-issues.md
translation_source_hash: 4b96a4f740203aace2e8c091ed89156146ba117e23eff1d08f3bbb01de92f24a
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Troubleshooting des problèmes de configuration {#troubleshooting-configuration-issues}

Cette section propose des conseils de dépannage pour Iroha 3 la configuration. Assurez-vous que vous [j' ai vérifié les clés](./overview.md#check-the-keys) d'abord, puisqu'il s'agit de la source la plus courante de problèmes en Iroha.

Si le problème que vous rencontrez n'est pas décrit ici, contactez-nous par l'intermédiaire de [Télégramme ](https://t.me/hyperledgeriroha).

## Génèse dépassée sur une configuration Docker Compose {#outdated-genesis-on-a-docker-compose-setup}

Lorsque vous utilisez la version Docker Compose de Iroha, vous pouvez rencontrer le problème d'un des conteneurs peers échouant avec l'erreur `Failed to deserialize raw genesis block`. Cela signifie généralement que la transaction peer, la génèse signée et la configuration générée ont été produites par différentes révisions ou profils Iroha.

Vérifiez l' échec avec les étapes suivantes:

1. Utilisez `docker ps` pour vérifier les conteneurs actuels. En fonction du profil généré, vous verrez généralement des conteneurs `hyperledger/iroha:dev`. Le profil par défaut Docker Compose contient quatre conteneurs de pairs, bien que votre `docker-compose.yml` généré puisse différer.

2. Vérifiez les journaux et recherchez l'erreur `Failed to deserialize raw genesis block`. Si vous avez démarré votre Iroha en mode daemon avec `docker compose up -d`, utilisez la commande `docker compose logs`.

La façon de résoudre un tel problème dépend de l'utilisation de Iroha. Si il s'agit d'une démonstration de base et que vous n'avez pas besoin de préserver les données des pairs, régénérez un localnet ou un paquet Docker Compose correspondant avec Kagami:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml
```

Ensuite, supprimer l'ancien état du conteneur et redémarrer les fichiers régénérés `genesis.signed.nrt`, peer `config.toml`, et `client.toml`.

Si vous devez restaurer les données de l'instance Iroha, faites ce qui suit:

1. Connectez le deuxième pair Iroha qui copiera les données du premier pair (failli).
2. Attends que le nouveau pair synchronise les données avec le premier pair.
3. Laissez le nouveau groupe actif.
4. Mettre à jour les fichiers d'origine et de configuration du premier pair uniquement dans le cadre d'une migration coordonnée.

::: info

Il n'existe pas de voie de réécriture automatique générale pour remplacer la génèse sur un réseau en direct. Traitez-la comme une migration coordonnée: préserver l'ancien état, mettre en place des pairs compatibles et déplacer les validateurs vers la nouvelle configuration seulement après que les opérateurs se soient mis d'accord sur le plan de migration.

:::

## Le format multihash des clés privées et publiques {#multihash-format-of-private-and-public-keys}

Si vous regardez le [configuration du client](/fr/guide/configure/client-configuration.md), Vous remarquerez que les clés y sont données [format multi-hash](https://github.com/multiformats/multihash).

Si vous n'avez jamais travaillé avec le multi-hash auparavant, il est naturel de supposer que le côté droit n'est pas une représentation hexadecimale des octets clés (deux symboles par octet), mais plutôt les octets codés comme ASCII (ou UTF-8), et appeler `from_hex` sur la chaîne littérale à la fois dans l'instance `public_key` et `private_key`.

Il est également naturel de supposer que l'appel `PrivateKey::try_from_str` sur le littéral de la chaîne ne donnerait que la clé correcte. Donc, si vous obtenez le nombre de bits dans la clé mal, par exemple 32 octets contre 64, cela générerait un message d'erreur.

Les deux hypothèses sont fausses. Malheureusement, les messages d'erreur n'aident pas à débogager ce type particulier de défaillance.

Comment réparer: utilisez `hex_literal`. Cela transformera également une chaîne de caractères moche en un joli petit tableau de chiffres hexadecimaux évidemment.

::: warning

Même l'implémentation `try_from_str` ne peut pas vérifier si une chaîne donnée est un `PrivateKey` valide et vous avertir si ce n'est pas le cas.

Il captera certaines erreurs évidentes, par exemple si la chaîne contient un symbole invalide. Cependant, comme nous visons à prendre en charge de nombreux formats de clés, il ne peut pas faire grand-chose d'autre. Il ne peut pas dire si la clé est la bonne clé privée pour le compte donné non plus, sauf si vous soumettez une instruction.

:::

Ces types d'erreurs subtiles peuvent être évités, par exemple, en désérialisant directement à partir des lettres de chaîne ou en générant une nouvelle paire de clés dans les endroits où cela a du sens.
