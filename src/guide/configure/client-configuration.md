# Client Configuration

Iroha CLI and SDK clients use TOML configuration. The repository ships the
current default at `defaults/client.toml`; generated local networks also write a
matching `client.toml` into their output directory.

::: details Client configuration template

<<< @/snippets/client.template.toml

:::

## Core Fields

At minimum, a client configuration identifies the chain, its network
identity, the Torii endpoint, the account's network context, and the
signing key:

```toml
chain = "00000000-0000-0000-0000-000000000000"
network_id = "hash:32C903E5B3497E34C2B844EBFE8A39C19E6CF8F95D44C1FFB8BA9DCB42F91149#A2F0"
torii_url = "http://127.0.0.1:8080/"

[account]
chain_discriminant = 753
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` selects the chain to which submitted transactions belong.
- `network_id` is the genesis-derived network identity that every signed
  request binds. Configure exactly one of `network_id` or
  `network_id_file`; a node advertises the value at
  `GET /v1/accounts/capabilities`.
- `torii_url` points at the peer Torii HTTP API.
- `[account].chain_discriminant` selects the network's I105 account
  prefix. The public networks can use `[account].profile = "taira"` or
  `"minamoto"` instead. One of the two is required, and the canonical
  `AccountId` itself is domainless.
- `[account].public_key` and `[account].private_key` sign transactions;
  `private_key_file` can replace `private_key`.

The account must already exist on-chain. For the default local network this is
handled by the bundled genesis manifest.

::: info Case sensitivity

Iroha names are case-sensitive after canonical parsing. For example,
`wonderland.universal`, `Wonderland.universal`, and
`looking_glass.universal` are distinct domain literals.

:::

## Basic Authentication

The optional `[basic_auth]` section adds an HTTP `Authorization` header to
client requests. Iroha peers do not interpret these credentials directly; use
them when Torii is behind a reverse proxy such as Nginx.

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## Transaction Settings

Transaction behavior is configured with the `[transaction]` section:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` is the transaction lifetime in milliseconds.
- `status_timeout_ms` controls how long the client waits for transaction
  status.
- `nonce = true` asks the client to include a nonce so repeated transactions
  produce different hashes.

## Connect Queue Settings

The `iroha` CLI also reads an optional `[connect]` section for local queue
state. The reusable SDK configuration does not accept it:

```toml
[connect]
queue_root = "./queue"
```

Use this when a workflow needs durable client-side queue storage.
`connect.queue_root` defaults to `~/.iroha/connect`, and a relative path
resolves from the directory that contains the client TOML file.

## Generating Configurations

For disposable local networks, prefer Kagami because it writes matching Iroha
3 configs, genesis, scripts, and a README:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

Use the generated `./localnet/client.toml` with the CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```
