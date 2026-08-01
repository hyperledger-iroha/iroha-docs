---
translation_locale: fr
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 0d897a79e6118de2e7e88a45f1daf1444b515fd35e7b2562f7c1cc18ed0a83b4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Configuration du client {#client-configuration}

Iroha CLI et SDK les clients utilisent TOML configuration. Le référentiel envoie la valeur par défaut actuelle à `defaults/client.toml`; les réseaux locaux générés écrivent également un correspondant `client.toml` dans leur répertoire de sortie.

::: details Template de configuration du client

<<< @/snippets/client.template.toml

:::

## Les champs de base {#core-fields}

Une configuration client identifie au minimum la chaîne, le point final Torii et le compte de signature:

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` sélectionne la chaîne à laquelle appartiennent les transactions soumises.
- `torii_url` points par rapport aux autres Torii HTTP API.
- `[account].domain` est utilisé par les raccourcis CLI et le codage du sélecteur d'adresses; le canonique `AccountId` lui-même n'est pas de domaine.
- Les transactions `[account].public_key` et `[account].private_key` sont signées.

Le compte doit déjà exister sur la chaîne. Pour le réseau local par défaut, il est géré par le manifeste génétique bundled.

::: info Sensitivité du cas

Les noms Iroha sont sensibles aux cas après l'analyse canonique. Par exemple, `wonderland.universal`, `Wonderland.universal` et `looking_glass.universal` sont des lettres de domaine distinctes.

:::

## L'authentification de base {#basic-authentication}

La section optionnelle `[basic_auth]` ajoute une en-tête HTTP `Authorization` aux demandes du client. Les pairs Iroha n'interprètent pas directement ces informations d'identification; utilisez-les lorsque Torii est derrière un proxy inverse tel que Nginx.

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## Paramètres de transaction {#transaction-settings}

Le comportement de la transaction est configuré avec la section `[transaction]`:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` est la durée de vie de l'opération en millisecondes.
- `status_timeout_ms` contrôle combien de temps le client attend l'état de la transaction.
- `nonce = true` demande au client d'inclure un nonce afin que les transactions répétées produisent des hachages différents.

## Connectez les paramètres de file d'attente {#connect-queue-settings}

Les clients actuels Iroha peuvent également utiliser la section optionnelle `[connect]` pour l'état local de la file d'attente:

```toml
[connect]
queue_root = "./queue"
```

Utilisez ceci lorsque un flux de travail a besoin d'un stockage durable des files d'attente du côté client.

## Génération de configurations {#generating-configurations}

Pour les réseaux locaux jetables, préférer Kagami parce qu'il écrit des configures correspondantes Iroha 3, génèse, scripts et un README:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Utilisez le `./localnet/client.toml` généré avec le CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
