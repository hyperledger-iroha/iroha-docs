---
translation_locale: fr
translation_source: /help/configuration-issues.md
translation_source_hash: 9d153d9cb8ce0341b35ba5a7e3823198e58464768e2a9a92ff8a5723f85e9351
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Résolution des problèmes de configuration {#troubleshooting-configuration-issues}

Cette section propose des conseils pour résoudre les problèmes de configuration d’Iroha 3. Commencez par [vérifier les clés](./overview.md#check-the-keys), car elles constituent la cause la plus fréquente de problèmes dans Iroha.

Si le problème que vous rencontrez n'est pas décrit ici, contactez-nous via [Télégramme](https://t.me/hyperledgeriroha).

## Genèse obsolète dans une configuration Docker Compose {#outdated-genesis-on-a-docker-compose-setup}

Lorsque vous utilisez Iroha avec Docker Compose, l’un des conteneurs de pairs peut échouer avec l’erreur `Failed to deserialize raw genesis block`. Cela signifie généralement que le pair, la transaction de genèse signée et la configuration générée proviennent de révisions ou de profils Iroha différents.

Depuis le répertoire du kit, exécutez `python3 poc.py logs` pour consulter les journaux des validateurs. Suivez le guide [Lancer Iroha 3](/fr/get-started/launch-iroha.md) pour compiler et lancer quatre validateurs dans Docker avec des binaires issus de la même révision.

Utilisez `python3 poc.py down` et `python3 poc.py up` pour redémarrer le même réseau. Conservez `state/` avec ses quatre volumes Docker.

::: info

Il n’existe pas de mécanisme automatique général pour remplacer la genèse d’un réseau actif. Procédez comme pour une migration coordonnée : conservez l’ancien état, démarrez des pairs compatibles et ne basculez les validateurs vers la nouvelle configuration qu’après l’accord des opérateurs sur le plan.

:::

## Format Multihash des clés privées et publiques {#multihash-format-of-private-and-public-keys}

Dans la [configuration du client](/fr/guide/configure/client-configuration.md), les clés sont données au [format multihash](https://github.com/multiformats/multihash).

Si vous n'avez jamais travaillé avec un multi-hash auparavant, il est naturel de supposer que le côté droit n'est pas une représentation hexadécimale des octets de la clé (deux symboles par octet), mais plutôt les octets encodés comme ASCII (ou UTF-8), et appeler `from_hex` sur le littéral de chaîne à la fois dans l'instanciation `public_key` et `private_key`.

Il est également naturel de supposer que l'appel de `PrivateKey::try_from_str` sur le littéral de chaîne ne donnerait que la clé correcte. Donc, si vous obtenez le nombre de bits de la clé incorrectement, par exemple 32 octets au lieu de 64, cela provoquerait un message d'erreur.

Ces deux hypothèses sont incorrectes. Malheureusement, les messages d'erreur n'aident pas à déboguer ce type particulier de défaillance.

Comment réparer : utilisez `hex_literal`. Cela transformera également une chaîne de caractères moche en un joli petit tableau de nombres évidemment hexadécimaux.

::: warning

Même l'implémentation `try_from_str` ne peut pas vérifier si une chaîne donnée est un `PrivateKey` valide et vous avertir si ce n'est pas le cas.

Il détectera certaines erreurs évidentes, par exemple si la chaîne contient un symbole invalide. Cependant, comme nous visons à supporter de nombreux formats de clés, il ne peut pas faire grand-chose d'autre. Il ne peut pas non plus dire si la clé est la clé privée correcte pour le compte donné, sauf si vous soumettez une instruction.

:::

Ce genre d'erreurs subtiles peut être évité, par exemple, en désérialisant directement à partir de littéraux de chaîne, ou en générant une nouvelle paire de clés là où cela a du sens.
