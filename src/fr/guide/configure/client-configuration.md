---
translation_locale: fr
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 6da8a0abddc9723b16477a935a3953ebd497300f02eadd635e4e38027a11d095
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Configuration du client {#client-configuration}

Iroha CLI et SDK clients utilisent la configuration TOML. Le dépôt fournit la valeur par défaut actuelle à `defaults/client.toml` ; les réseaux locaux générés écrivent également un `client.toml` correspondant dans leur répertoire de sortie.

::: details Modèle de configuration client

<<< @/snippets/client.template.toml

:::

## Champs principaux {#core-fields}

Au minimum, une configuration client identifie la chaîne, le point de terminaison Torii API et le compte de signature :

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` sélectionne la chaîne à laquelle appartiennent les transactions soumises.
- `torii_url` pointe vers le pair réseau Torii HTTP API.
- `[account].domain` est utilisé par les raccourcis CLI et le codage du sélecteur d'adresse ; le `AccountId` canonique lui-même est sans domaine.
- `[account].public_key` et `[account].private_key` signent des transactions.

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

Les clients actuels Iroha peuvent également utiliser la section facultative `[connect]` pour l'état de la file d'attente locale :

```toml
[connect]
queue_root = "./queue"
```

Utilisez ceci lorsqu'un flux de travail nécessite un stockage de file d'attente côté client durable.

## Génération de configurations {#generating-configurations}

Pour les réseaux locaux jetables, préférez Kagami car il écrit des configurations Iroha 3 correspondantes, le génesis de la blockchain, des scripts et un README :

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Utilisez le `./localnet/client.toml` généré avec le CLI :

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
