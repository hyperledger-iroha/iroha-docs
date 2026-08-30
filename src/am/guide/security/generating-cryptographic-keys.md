---
translation_locale: am
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: f3d08a8e7fe7569ef783b93bccdc900ca74b85179a749b48b96c32028c749233
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# ምስጠራ ቁልፎችን ማመንጨት {#generating-cryptographic-keys}

ለ Iroha 3 የclient፣ peer እና validator ቁልፍ ቁሳቁስ ለማመንጨት `kagami keys` ይጠቀሙ።

## መሠረታዊ አጠቃቀም {#basic-usage}

From the Iroha source checkout:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

The parent directory must already exist. The target must be new or already
owned by the current user, mode `0700`, free of symbolic links, and empty.
`kagami` writes `public.key` and `private.key` with mode `0600` and does not
print key material. With `--pop`, it also writes `pop.hex`.

`--out-dir` fails closed on platforms where Kagami cannot enforce these
owner-only filesystem rules. The private-key file is an unencrypted export,
not a hardware or non-exportable production signer. Import it into the
approved custody boundary and remove the export according to the deployment's
procedure.

## ስልተ ቀመሮች {#algorithms}

Common algorithms are:

- `ed25519` for client accounts and streaming identities.
- `secp256k1` when a client account requires a secp256k1 identity.
- `bls_normal` for every node or peer consensus identity.

Check the exact algorithms supported by your build with:

```bash
cargo run --bin kagami -- keys --help
```

## የዲተሪሚኒስት የልማት ቁልፎች {#deterministic-development-keys}

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

## BLS የስምምነት ቁልፎች እና ባለቤትነት ማስረጃዎች {#bls-consensus-keys-and-proofs-of-possession}

Iroha 3 node and peer consensus identities use BLS-normal keys. Generate a
BLS-normal key and proof-of-possession (PoP) with:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

`--pop` is valid only with `bls_normal`; it adds `pop.hex` to the custody
directory.
Signed genesis requires a matching PoP for every voting validator. In peer
configuration, a non-empty `trusted_peers_pop` map selects the validator
subset; trusted peers omitted from that non-empty map are observers. If the map
is empty, all BLS-normal trusted peers enter the bootstrap candidate set, with
voter PoPs still supplied by signed genesis.

## Custody Output {#custody-output}

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
