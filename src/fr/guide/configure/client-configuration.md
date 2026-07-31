---
translation_locale: fr
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 0d897a79e6118de2e7e88a45f1daf1444b515fd35e7b2562f7c1cc18ed0a83b4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Configuration du client {#client-configuration}

Iroha CLI et SDK les clients utilisent TOML Le référentiel envoie le
courant par défaut à `defaults/client.toml`; Les réseaux locaux générés écrivent également un
correspondance `client.toml` dans leur répertoire de sortie.

::: details Template de configuration du client

<<< @/snippets/client.template.toml

:::

## Les champs de base {#core-fields}

Au minimum, une configuration client identifie la chaîne. Torii point final, et
compte de signature:

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
- `[account].domain` est utilisé par CLI les raccourcis et le codage du sélecteur d'adresse;
  le canonique `AccountId` elle-même est sans domaine.
- `[account].public_key` et `[account].private_key` signer les transactions.

Pour le réseau local par défaut, c'est
géré par le manifeste génétique.

::: info Sensitivité du cas

Iroha Les noms sont sensibles aux cas après l'analyse canonique.
`wonderland.universal`, `Wonderland.universal`, et
`looking_glass.universal` sont des domaines littéraux distincts.

:::

## L'authentification de base {#basic-authentication}

Le choix `[basic_auth]` la section ajoute un HTTP `Authorization` en-tête
les demandes des clients. Iroha les pairs n'interprètent pas directement ces informations;
quand ils Torii est derrière un proxy inverse comme Nginx.

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## Paramètres de transaction {#transaction-settings}

Le comportement de la transaction est configuré avec le `[transaction]` section suivante:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` est la durée de vie de l'opération en millisecondes.
- `status_timeout_ms` contrôle combien de temps le client attend une transaction
  Le statut de l'entreprise.
- `nonce = true` demande au client d'inclure une nonce si des transactions répétées
  produisent des haches différentes.

## Connectez les paramètres de file d'attente {#connect-queue-settings}

Courant Iroha Les clients peuvent également utiliser l'option `[connect]` section pour le local
état de file d'attente:

```toml
[connect]
queue_root = "./queue"
```

Utilisez ceci lorsqu'un flux de travail a besoin d'un stockage durable des files d'attente côté client.

## Génération de configurations {#generating-configurations}

Pour les réseaux locaux jetables, préférer Kagami parce qu'il écrit correspondant Iroha
3 configs, génèse, scripts et un README:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Utilisez le généré `./localnet/client.toml` avec le CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
