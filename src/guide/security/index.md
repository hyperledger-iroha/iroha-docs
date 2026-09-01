# Security

Secure an Iroha deployment as you would any system that handles sensitive
data and value. Protect signing keys, network access, node operations,
monitoring, and incident response. A ledger does not remove the need for
these controls.

### Navigation

In this section you can learn about various aspects of securing your Iroha network. To learn more, choose one of the following topics:

- [Security Principles](./security-principles):

  Core principles for protecting data and reducing breach risk.

- [Virtual Private Networks](./vpn.md):

  How to use a VPN to restrict peer-to-peer, Torii, and operator access in private or consortium deployments.

- [Operational Security](./operational-security.md):

  Day-to-day controls for access, monitoring, incident response, and operator
  workstations.

- [Fraud Monitoring](./fraud-monitoring.md):

  How to use ledger events, queries, permissions, and operational signals to detect suspicious activity and preserve response evidence.

- [Password Security](./password-security.md):

  Password entropy, strong-password construction, and common failure modes.

- [Public Key Cryptography](./public-key-cryptography.md):

  Public-key encryption, signatures, and authenticated communication.

  - [Generating Cryptographic Keys](./generating-cryptographic-keys.md):

    Generate supported cryptographic keys with `kagami`.

  - [Storing Cryptographic Keys](./storing-cryptographic-keys.md):

    Store cryptographic keys using layered controls appropriate to the
    deployment.
