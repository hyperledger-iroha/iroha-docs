# Genesis

Genesis defines the initial chain state. The editable source is a JSON manifest, and an Iroha 3 node consumes a signed Norito transaction file.

::: details Default genesis source template (defaults/genesis.template.json)

<<< @/snippets/genesis.json

:::

## Files

The upstream repository ships a default source template at `defaults/genesis.template.json`. A template is incomplete and cannot be validated, signed, or used by a node until `kagami genesis materialize` turns it into a manifest. Kagami-generated networks write their own manifest and signed transaction into the output directory:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

The generated `README.md` in that directory records the exact files and launch commands for the selected profile.

## Peer Configuration

Peers point at the signed genesis transaction in the `[genesis]` section of `config.toml`, and pin its expected hash in a separate file:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
expected_hash_file = "./genesis.expected_hash"
```

All peers in the network must agree on the signed genesis transaction and the genesis public key. Every start, fresh or restart, needs the expected hash: configure exactly one of `expected_hash_file` or the inline `expected_hash`. `kagami genesis sign --expected-hash-out` writes the file.

## Signing Genesis

If you edit a manifest manually, validate and sign it before starting peers:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt \
  --expected-hash-out ./genesis.expected_hash
```

`GENESIS_PRIVATE_KEY_FILE` must be an owner-held mode-`0600`, single-link regular file containing one canonical private-key multihash and a final newline. Kagami rejects symbolic links and never accepts a raw genesis private key on the command line.

Every signed genesis, permissioned or NPoS, must include an exact `3f + 1` validator topology with a BLS Proof-of-Possession for each validator. The Kagami `localnet generate`, `wizard`, and `sora-network generate` commands handle those details automatically.

## Recommitting Genesis

A fresh network starts from its signed genesis. To test a different genesis in a disposable localnet, stop the peers, remove their generated state directory, and start from the new signed genesis. A running network must never replace genesis as an upgrade mechanism. Changes to protocol definitions require governed selection transitions and qualification for the selected definitions and obligations.
