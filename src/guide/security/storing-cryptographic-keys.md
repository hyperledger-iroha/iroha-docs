# Storing Cryptographic Keys

A private key can authorize every action permitted to its authority. Never
share a private key. Protect seed material, recovery secrets, bearer tokens,
and exported key files with the same care.

Choose the custody design before production launch. The design must match the
value at risk, the account-controller policy, and the deployment's recovery
process.

## Define the Custody Boundary

- Keep an inventory of each authority, public key, algorithm, environment,
  purpose, custodian, storage location, backup, and replacement procedure.
- Use separate keys for development, test, production, routine transactions,
  governance, deployment, and recovery.
- Give people and processes access only to the keys required by their role.
- Require independent approval for high-value or governance signing when the
  risk model requires it.
- Record which network and authority a signer may use. A signing service must
  reject requests outside that scope.

## Choose an Appropriate Storage Method

For local development, controlled tests, or a secure custody handoff, a key can
be exported to a permission-restricted file. On a supported Unix platform,
generate a new key directory with `kagami`:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

The parent directory must exist. The target must be new or already owned by the
current user, mode `0700`, free of symbolic links, and empty. Kagami writes
`public.key` and `private.key` with mode `0600`; `--pop` also writes `pop.hex`.
The command fails on platforms where Kagami cannot enforce the owner-only
filesystem rules.

The private-key file is an unencrypted export. Keep it out of source control,
shared folders, logs, tickets, chat, and build artifacts. Import a production
key into its approved custody boundary, then remove the export according to the
deployment's procedure. Do not reuse a development key in production.

For production, prefer an audited custody boundary such as:

- a hardware security module or hardware-backed keystore
- an operating-system or mobile keystore
- an isolated signing service
- a secret manager that releases a key only to an authorized workload

Keep key material non-exportable when the selected integration supports that
property. Confirm that the custody system supports the algorithm and signing
operation required by the Iroha authority.

Encryption at rest protects a stored copy. It does not protect a key after an
unauthorized process or operator obtains the decrypted bytes. Harden the host,
restrict runtime access, and monitor signing activity.

## Protect Signing Workflows

- Use named operator identities, strong authentication, and audited access to
  signing systems.
- Keep raw keys out of command-line arguments, shell history, environment
  dumps, process listings, crash reports, and application logs.
- Unlock a signer only for the required operation. Close or expire the session
  after use.
- Show the authority, network, instructions, assets, and fees before approval.
- Require explicit confirmation for privileged or high-value transactions.
- Keep raw private keys outside browser pages and general-purpose application
  processes when a custom client integration can delegate signing.

Plain-text client configuration is suitable only for local development and
controlled tests. A production integration should obtain signatures through
its approved custody boundary. The stock Iroha CLI reads a private key from
client configuration and does not provide a generic external-signer adapter.
Custom clients can construct the transaction payload hash and attach a
signature produced by an external signer.

## Back Up and Recover Keys

- Back up only keys whose recovery policy requires a backup.
- Encrypt backups and keep them separate from the live signer.
- Apply the same access and approval controls to a backup as to the live key.
- Keep recovery credentials under independent custody when separation of
  duties is required.
- Test restoration without exposing production key material.
- Record and review every backup creation, access, restore, and destruction.

Do not assume that an unrelated wallet mnemonic format can represent an Iroha
private key. Use only a recovery format supported and tested by the selected
custody system.

## Replace Exposed or Retired Keys

Prepare replacement before an incident. The procedure must identify:

1. who can declare a key exposed or retired
2. how the affected signer is isolated
3. how a new key is generated and placed in approved custody
4. for an account, how authorized controller replacement or social recovery
   creates the replacement canonical `AccountId` and migrates linked state
5. for a node or peer, how an authorized on-chain consensus-key rotation or
   disablement is coordinated with the BLS PoP, activation and overlap policy,
   local key configuration, `trusted_peers_pop`, and deployment topology
6. how dependent configurations, applications, and operators adopt the new
   `AccountId`, public key, or peer identity
7. how the old key's authority is removed and its copies are archived or
   destroyed
8. how the network and dependent applications are verified afterward

::: warning

Encryption or a new password cannot make a copied private key safe again.
When exposure is suspected, stop using the key and follow the approved
replacement or revocation procedure.

:::

See [Generating Cryptographic Keys](./generating-cryptographic-keys.md),
[Operational Security](./operational-security.md), and
[Security Principles](./security-principles.md).
