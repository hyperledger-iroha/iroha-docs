# Security Principles

An Iroha ledger verifies signed instructions and applies permissions. It does
not secure private keys, hosts, applications, operator workstations, or
governance procedures. The deployment must protect those systems.

Use these principles when designing and operating an Iroha network.

## Treat Authority as a Security Boundary

- A person or process that controls a private key can act with the authority
  assigned to that key.
- Give each environment and operational role a separate authority.
- Keep production keys and recovery keys separate from routine development and
  test credentials.
- Record who owns each authority, where its signer is held, and how it can be
  replaced or revoked.

See [Public-Key Cryptography](./public-key-cryptography.md) and
[Storing Cryptographic Keys](./storing-cryptographic-keys.md).

## Apply Least Privilege

- Grant only the Iroha permissions, host access, and network access required
  for a role.
- Separate routine transaction signing from governance, deployment, and
  recovery authority.
- Require independent approval for changes that can affect validator
  membership, privileged permissions, or high-value assets.
- Review access after role changes and remove access that is no longer needed.

## Use Layers of Protection

- Protect signers, applications, operating systems, networks, and physical
  access. Do not rely on one control.
- Expose only the Torii, peer, monitoring, and application routes required by
  the deployment.
- Use authenticated and encrypted channels for administrative access and
  sensitive data.
- Keep systems patched and disable services that the deployment does not use.
- Keep secrets out of source control, command lines, logs, tickets, chat, and
  public documentation.

## Make Deployments Reviewable

- Keep non-secret configuration and deployment automation in version control.
- Review changes to binaries, configuration, genesis material, validator
  membership, permissions, and public routes.
- Verify release artifacts before deployment. Record the approved versions and
  hashes.
- Test the exact binary and configuration combination that will run in
  production.
- Preserve the deterministic behavior of the network. Hardware acceleration
  must not change peer-visible results.

## Monitor and Preserve Evidence

- Monitor peer health, consensus progress, permission changes, privileged
  instructions, authentication failures, and unexpected configuration changes.
- Send important alerts to a system that does not depend on the affected host.
- Preserve relevant logs, ledger references, configuration snapshots, and
  transaction hashes with reliable timestamps.
- Treat missing monitoring data as an operational problem that requires
  investigation.

## Prepare Recovery Before Launch

- Define who can declare an incident and who can approve recovery actions.
- Test backup, restore, key replacement, permission revocation, and peer
  recovery procedures.
- Keep trusted release artifacts, configuration, genesis records, and
  inventories available during an incident.
- Restore reads and monitoring first. Resume writes only after the recovered
  network and dependent applications pass their checks.
- Review every incident and update controls, automation, and exercises.

::: warning

Ledger actions may be irreversible. Use pre-reviewed procedures and the
required approvals before submitting a recovery or governance transaction.

:::

Continue with [Operational Security](./operational-security.md) and
[Release Readiness](../best-practices/release-readiness.md).
