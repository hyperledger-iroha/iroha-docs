# Genesis Reference

In the current Iroha 3 workflow, a `genesis.json` manifest describes the first
transactions and parameters that will be applied when the network starts.

The signed artifact distributed to peers is a Norito-encoded `.nrt` file
produced by `kagami genesis sign`.

## Main Fields

A genesis manifest can define:

- `chain` for the chain identifier
- `chain_discriminant` for the I105 network prefix used to encode account
  literals in the manifest
- `executor` for an optional executor upgrade bytecode path
- `ivm_dir` for IVM libraries used by triggers and upgrades
- `consensus_mode` for the initial mode advertised by the manifest
- `wire_protocol_version` for the first-release consensus wire protocol version
- `consensus_fingerprint` for the optional typed fingerprint of consensus
  parameters, which JSON manifests state explicitly
- `transactions` for ordered parameter updates, instructions, triggers, and topology
- `sumeragi_context` for the signed Sumeragi height-context parameters
- `crypto_admission_policy` for the exact signing and controller algorithms
  that the chain admits, listed in `allowed_algorithms`

Within `transactions`, topology entries pair peer ids and PoPs together:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Generate a Manifest

Use Kagami to generate a template. Repeat `--allowed-signing` for every
admitted algorithm, in ascending canonical order; Kagami does not fill in
omitted algorithms:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --chain-id <CHAIN_ID> \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> \
  --allowed-signing ed25519 \
  --allowed-signing bls_normal > genesis.json
```

For the public SORA Nexus data space, `npos` is the expected consensus mode.
Other Iroha 3 deployments may use permissioned or NPoS depending on the target
profile.

## Sign the Manifest

After editing and validating the JSON, sign it into a deployable `.nrt` block:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt \
  --expected-hash-out genesis.expected_hash
```

`kagami genesis sign` derives the genesis key pair from the private key in an
owner-held, single-link regular file to produce the deployable signed block.
Pass `--expected-public-key` to require that it matches the published genesis
public key. The file must contain one canonical private-key
multihash followed by a newline; Kagami rejects symbolic links and modes other
than `0600`. Raw private keys are not accepted on the command line. The result
is the file that peers should reference from their config.

## Configure `iroha3d`

Point the daemon at the signed genesis block and at the file that pins its
expected hash. `kagami genesis sign --expected-hash-out` writes that file,
and the node requires it on fresh starts and restarts:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
expected_hash_file = "genesis.expected_hash"
```

## Related Tools

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet generate`
- `cargo xtask kagami-profiles`

For the generator implementation and command details, see the
[Kagami README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_kagami/README.md).
