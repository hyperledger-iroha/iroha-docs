# Generating Cryptographic Keys

Use `kagami keys` to generate client, peer, and validator key material for
Iroha 3.

## Basic Usage

From the Iroha source checkout:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

The parent directory must already exist. The target must not exist: Kagami
refuses even an existing empty directory. It creates the target with mode
`0700` under owner-only filesystem checks and rejects symbolic links.
`kagami` writes `public.key` and `private.key` with mode `0600` and does not
print key material. With `--pop`, it also writes `pop.hex`.

`--out-dir` fails closed on platforms where Kagami cannot enforce these
owner-only filesystem rules. The private-key file is an unencrypted export,
not a hardware or non-exportable production signer. Import it into the
approved custody boundary and remove the export according to the deployment's
procedure.

## Algorithms

Common algorithms are:

- `ed25519` for client accounts and streaming identities.
- `secp256k1` when a client account requires a secp256k1 identity.
- `bls_normal` for every node or peer consensus identity.

Check the exact algorithms supported by your build with:

```bash
cargo run --bin kagami -- keys --help
```

## Deterministic Development Keys

For reproducible fixtures, pass a 32-byte seed encoded as 64 hexadecimal
characters. An optional `0x` prefix is accepted:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --seed-hex 1111111111111111111111111111111111111111111111111111111111111111 \
  --out-dir ./fixture-client-key
```

The seed is private-key material. Use deterministic seeds only for local
development and tests. Omit `--seed-hex` to generate a production key from
operating-system randomness.

## BLS Consensus Keys and Proofs-of-Possession

Iroha 3 node and peer consensus identities use BLS-normal keys. Generate a
BLS-normal key and proof-of-possession (PoP) with:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

`--pop` is valid only with `bls_normal`; it adds `pop.hex` to the custody
directory.
Signed genesis requires a matching PoP for every voting validator. In peer
configuration, list each validator's PoP in `trusted_peers_pop`: trusted peers
without a valid PoP are excluded from the consensus roster, and an empty map
yields no validators, so a node whose map omits the genesis validators refuses
to start. Run a sync-only node with `[sumeragi] role = "observer"`.

## Custody Output

`kagami keys` requires `--out-dir` and never writes private key material to
standard output. Read `public.key`, `private.key`, and optional `pop.hex` from
the generated directory. Each file contains one canonical value followed by a
newline, which makes explicit file-based automation straightforward:

```bash
PUBLIC_KEY=$(tr -d '\n' < ./client-key/public.key)
```

For full generated Kagami help:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
