# Operational Security

Operational security protects the people, hosts, credentials, and procedures
around an Iroha deployment. The ledger records accepted state changes.
Operators must separately secure their workstations, signing keys, and
incident-response process.

Use the controls below as a deployment baseline. Adjust them to the value at
risk and the requirements of your organization.

## Establish an Operational Baseline

- Maintain an inventory of validator hosts, peer identities, account
  authorities, signing devices, public endpoints, and responsible people.
- Use separate credentials for development, test, and production. Assign each
  signer, bearer token, and private key to one environment.
- Keep configuration and deployment automation in reviewable version control.
  Inject secrets at runtime from an approved secret store or signing device.
- Record the expected hashes or signatures of release artifacts. Verify them
  before deployment. Limit who can replace binaries, genesis material,
  configuration, or service definitions.
- Apply least privilege to operating-system accounts, Iroha permissions, and
  network administration. Grant each role only the authority its work needs.
- Test backup, restore, key-replacement, and peer-recovery procedures before
  production launch.

Review [Security Principles](./security-principles.md) and
[Release Readiness](../best-practices/release-readiness.md) when defining the
baseline.

## Protect Keys and Signers

- Keep private keys, seed material, bearer tokens, authorization headers, and
  recovery secrets out of source control, issue trackers, chat transcripts,
  screenshots, and public documentation.
- Use hardware-backed or isolated signing for high-value authorities. Keep raw
  key material outside browsers and general-purpose application processes when
  a client can delegate signing.
- Use separate authorities for routine transactions, governance, deployment,
  and recovery.
- Encrypt secret storage and its backups. Apply the same access controls to a
  private-key backup as to the live key.
- Maintain a tested replacement or revocation procedure. Replace a key when
  policy requires it or when exposure is suspected.
- Require independent review for changes to validator membership, privileged
  roles, or high-value assets.

See [Generating Cryptographic Keys](./generating-cryptographic-keys.md) and
[Storing Cryptographic Keys](./storing-cryptographic-keys.md) for key-specific
guidance.

## Harden Nodes and Operator Access

- Run nodes and operator tools on currently vendor-supported, patched systems.
  Disable unnecessary services.
- Give named operators administrative access only through audited, encrypted
  channels.
- Put non-public interfaces on a private network or
  [VPN](./vpn.md).
- Expose only the Torii, monitoring, and application routes required by the
  deployment.
- Protect every public ingress with rate limits and transport security
  appropriate to the environment.
- Protect configuration files and service credentials with restrictive file
  permissions. Keep secrets out of command lines, process listings, and shell
  history.
- Separate validator, client, monitoring, and backup duties when the risk model
  requires independent control.
- Synchronize time from trusted sources. Preserve enough system, service, and
  network logs for investigation.

## Secure Browser and Admin Workflows

For an operator who uses a web interface:

- Use a currently vendor-supported, fully updated browser on a managed
  workstation.
- Use a dedicated operator profile or device with only required extensions.
- Verify the origin and certificate before approving a request.
- Treat lookalike domains, unexpected redirects, and requests for raw key
  material as incidents.
- Block unrelated sites and extensions from the active operator session.
- Use short-lived sessions. Require re-authentication for privileged actions.
- Show transaction details to the signer. The operator must be able to verify
  the authority, network, instructions, assets, and fees before approval.

Browser isolation reduces exposure. Operators must still review transactions
and use secure signing.

## Monitor and Respond

Monitor these signals:

- validator and peer membership changes
- repeated authorization failures or unusual privileged instructions
- unexpected software, configuration, or route changes
- signing, query, and transaction failures outside the normal baseline
- resource exhaustion, stalled consensus, or loss of expected peers
- asset, permission, and account changes that match fraud rules

Send alerts to a channel independent of the affected host. Preserve relevant
logs, configuration snapshots, ledger events, and transaction hashes with
timestamps. See [Fraud Monitoring](./fraud-monitoring.md) and
[Performance and Metrics](../advanced/metrics.md).

## Recovery Plan

Prepare the recovery plan before production launch. The recovery plan must
identify:

- who can declare and coordinate an incident
- how to contact validators, infrastructure operators, application owners,
  and affected users
- which authorities can revoke permissions, replace keys, or change peer
  membership
- where trusted binaries, configuration, genesis records, backups, and key
  inventories are stored
- how to validate the network and dependent applications after recovery

When an incident occurs:

1. Isolate the affected host, credential, route, or authority. Preserve
   evidence.
2. Preserve logs and ledger references. Record every recovery action.
3. Revoke or replace exposed credentials and permissions through the approved
   governance process.
4. Restore software and configuration from verified artifacts.
5. Confirm peer membership, consensus health, public routes, monitoring, and
   application reads. Resume writes only after these checks pass.
6. Document the root cause. Update controls, automation, and exercises.

::: warning

Follow pre-reviewed procedures for irreversible ledger actions. Require the
approvals appropriate to the affected authority and assets.

:::
