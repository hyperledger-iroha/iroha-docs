# Public Key Cryptography

Public key cryptography uses a related public key and private key. The public
key can be shared. The private key must remain under the authority's control.
Security depends on using a supported algorithm, generating keys with secure
randomness, and protecting the private key.

## Digital Signatures

A signer creates a digital signature with a private key. A verifier checks the
signature with the corresponding public key.

A valid signature shows that the signed bytes were not changed and that the
holder of the private key approved them. It does not identify a person by
itself. Identity depends on how the public key or account controller was
registered and governed.

Signatures provide integrity and authorization evidence. They do not encrypt
the signed content.

## Public Key Encryption

Some public key schemes encrypt data for a recipient's public key. The
recipient decrypts that data with the corresponding private key. Encryption
and signatures are separate operations and may use different keys or
algorithms.

Iroha transaction signing does not make public ledger data confidential. Use
the deployment's approved confidentiality mechanism when payload contents must
remain private.

## Keys on the Client Side

Every transaction must satisfy the configured account-controller policy. A
simple account may use one signing key. A governed account can use a more
complex controller policy.

Client software must protect private keys and other controller material.
Plain-text client configuration is suitable only for local development and
controlled tests. Production integrations should use a secret manager,
hardware-backed key storage, isolated signing service, or another audited
signing boundary.

Use separate keys for separate environments and purposes. Reusing one key
links those uses and increases the impact of exposure.

See [Generating Cryptographic Keys](./generating-cryptographic-keys.md),
[Storing Cryptographic Keys](./storing-cryptographic-keys.md), and
[Operational Security](./operational-security.md).
