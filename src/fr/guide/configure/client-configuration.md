---
translation_locale: fr
translation_source: /guide/configure/client-configuration.md
translation_source_hash: b3cfc8d8bf51a43b88cefb5ac7fe641717b347f7c89d983bf4c2de80944f1bb8
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Configuration du client {#client-configuration}

Iroha CLI et SDK clients utilisent la configuration TOML. Le dépôt fournit la valeur par défaut actuelle à `defaults/client.toml` ; les réseaux locaux générés écrivent également un `client.toml` correspondant dans leur répertoire de sortie.

::: details Modèle de configuration client

<<< @/snippets/client.template.toml

:::

## Champs principaux {#core-fields}

Une configuration client identifie au minimum la chaîne, son identité réseau, le point d'accès Torii, le contexte réseau du compte et la clé de signature :

```toml
chain = "00000000-0000-0000-0000-000000000000"
network_id = "hash:32C903E5B3497E34C2B844EBFE8A39C19E6CF8F95D44C1FFB8BA9DCB42F91149#A2F0"
torii_url = "http://127.0.0.1:8080/"

[account]
chain_discriminant = 753
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` sélectionne la chaîne à laquelle appartiennent les transactions soumises.
- `network_id` est l'identité réseau dérivée de la genèse à laquelle toute requête signée est liée. Configurez exactement l'un des deux paramètres `network_id` ou `network_id_file` ; un nœud publie cette valeur à `GET /v1/accounts/capabilities`.
- `torii_url` pointe vers le pair réseau Torii HTTP API.
- `[account].chain_discriminant` sélectionne le préfixe de compte I105 du réseau. Pour les réseaux publics, il est possible d'utiliser à la place `[account].profile = "taira"` ou `"minamoto"`. L'un de ces deux modes de sélection est obligatoire ; l'identité canonique `AccountId` est elle-même dépourvue de domaine.
- `[account].public_key` et `[account].private_key` servent à signer les transactions ; `private_key_file` peut remplacer `private_key`.

Le compte doit déjà exister sur la chaîne. Pour le réseau local par défaut, cela est géré par le manifeste technique de genèse de la blockchain inclus.

::: info Sensibilité à la casse

Iroha les noms sont sensibles à la casse après l'analyse canonique. Par exemple, `wonderland.universal`, `Wonderland.universal` et `looking_glass.universal` sont des littéraux de domaine distincts.

:::

## Authentification de base {#basic-authentication}

La section facultative `[basic_auth]` ajoute un en-tête HTTP `Authorization` aux requêtes des clients. Les pairs réseau Iroha n'interprètent pas directement ces informations d'identification ; utilisez-les lorsque Torii est derrière un proxy inverse tel que Nginx.

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## Paramètres de transaction {#transaction-settings}

Le comportement des transactions est configuré avec la section `[transaction]` :

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` est la durée de vie de la transaction en millisecondes.
- `status_timeout_ms` contrôle combien de temps le client attend le statut de la transaction.
- `nonce = true` demande au client d’inclure un nonce afin que des transactions répétées produisent des hachages différents.

## Paramètres de la file d'attente de connexion {#connect-queue-settings}

La CLI `iroha` lit également une section facultative `[connect]` pour l'état de la file d'attente locale. La configuration réutilisable du SDK ne l'accepte pas :

```toml
[connect]
queue_root = "./queue"
```

Utilisez cette section lorsqu'une procédure nécessite un stockage durable de la file d'attente côté client. La valeur par défaut de `connect.queue_root` est `~/.iroha/connect` ; un chemin relatif est résolu depuis le répertoire contenant le fichier TOML du client.

## Génération de configurations {#generating-configurations}

Pour les réseaux locaux jetables, préférez Kagami car il écrit des configurations Iroha 3 correspondantes, le génesis de la blockchain, des scripts et un README :

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

Utilisez le `./localnet/client.toml` généré avec le CLI :

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```
