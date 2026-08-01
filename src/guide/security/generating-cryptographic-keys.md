# Generating Cryptographic Keys

Use `kagami keys` to generate client, peer, and validator key material for
Iroha 3.

## Basic Usage

From the Iroha source checkout:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

JSON output is usually easiest to copy into TOML or automation:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

The command prints a public key and an exposed private key. Treat the private
key as secret material; do not commit generated production keys.

For a secure local export or custody handoff on a supported Unix platform,
write a new key pair to an empty owner-only directory instead of printing the
private key:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

The parent directory must already exist. The target must be new or already
owned by the current user, mode `0700`, free of symbolic links, and empty.
`kagami` writes `public.key` and `private.key` with mode `0600` and does not
print the private key. With `--pop`, it also writes `pop.hex`.

`--out-dir` fails closed on platforms where Kagami cannot enforce these
owner-only filesystem rules. The private-key file is an unencrypted export,
not a hardware or non-exportable production signer. Import it into the
approved custody boundary and remove the export according to the deployment's
procedure.

## Algorithms

Common algorithms are:

- `ed25519` for client accounts and streaming identities.
- `secp256k1` when a client account requires a secp256k1 identity.
- `bls_normal` for every node or peer consensus identity when the build enables
  BLS support.

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
  --json
```

The seed is private-key material. Use deterministic seeds only for local
development and tests. Omit `--seed-hex` to generate a production key from
operating-system randomness.

## BLS Consensus Keys and Proofs-of-Possession

Iroha 3 node and peer consensus identities use BLS-normal keys. Generate a
BLS-normal key and proof-of-possession (PoP) with:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

`--pop` is valid only with `bls_normal`. JSON output includes `pop_hex`.
Signed genesis requires a matching PoP for every voting validator. In peer
configuration, a non-empty `trusted_peers_pop` map selects the validator
subset; trusted peers omitted from that non-empty map are observers. If the map
is empty, all BLS-normal trusted peers enter the bootstrap candidate set, with
voter PoPs still supplied by signed genesis.

## Output Formats

Use the default output for terminal inspection, `--json` for automation, and
`--compact` when another script needs plain line-oriented values:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

For full generated Kagami help:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
