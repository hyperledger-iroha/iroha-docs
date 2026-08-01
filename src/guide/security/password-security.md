# Password Security

Passwords can protect operator consoles, secret stores, backups, and local key
files. A password is only one control. Use it together with secure key custody,
access controls, and multi-factor authentication where available.

## Use Unique, Generated Passwords

- Generate a different password for every account and environment.
- Use a password manager to create and store long random passwords.
- Use a multi-word passphrase only when its words are selected randomly from a
  sufficiently large list.
- Keep names, dates, addresses, quotations, keyboard patterns, and reused
  fragments out of passwords.
- Use a service-generated token or cryptographic key instead of a human-entered
  password when the service supports that method.

Length and unpredictability matter more than decorative substitutions. Adding
one symbol to a predictable word does not make the result safe.

## Protect Password-Based Accounts

- Enable phishing-resistant multi-factor authentication where it is available.
- Apply rate limits, lockout policy, and alerts to repeated authentication
  failures.
- Send passwords only through authenticated, encrypted channels.
- Keep passwords and recovery codes out of logs, command lines, source
  repositories, configuration files, tickets, and chat.
- Store server-side password verifiers with a salted, memory-hard password
  hashing function and parameters appropriate to the deployment.

## Storage, Recovery, and Replacement

- Use an audited password manager with encrypted, tested backups.
- Store recovery codes separately from the device they recover. A protected
  offline paper copy can be appropriate for recovery material.
- Limit access to password-manager exports and backup media.
- Replace a password after suspected exposure, unauthorized reuse, or a policy
  event that requires replacement.
- Test account-recovery procedures before production launch.

::: warning

A password that unlocks a private key cannot make an exposed copy of that key
safe. If private-key exposure is suspected, follow the deployment's key
replacement or revocation procedure.

:::

See [Operational Security](./operational-security.md) and
[Storing Cryptographic Keys](./storing-cryptographic-keys.md).
