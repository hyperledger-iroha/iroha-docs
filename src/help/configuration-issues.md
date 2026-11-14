# Troubleshooting Configuration Issues

This section offers troubleshooting tips for Iroha 3 configuration. Make sure you
[checked the keys](./overview.md#check-the-keys) first, as it is the most
common source of issues in Iroha.

If the issue you are experiencing is not described here, contact us via
[Telegram](https://t.me/hyperledgeriroha).

## Outdated genesis on a Docker Compose setup

When you are using the Docker Compose version of Iroha, you might encounter
the issue of one of the peer containers failing with the
`Failed to deserialize raw genesis block` error. This usually means the peer,
signed genesis transaction, and generated configuration were produced by
different Iroha revisions or profiles.

From the kit directory, run `python3 poc.py logs` to inspect the validator logs. Follow [Launch Iroha 3](/get-started/launch-iroha.md) to build and run four validators with matching binaries in Docker.

Use `python3 poc.py down` and `python3 poc.py up` to restart the same network. Keep `state/` together with its four Docker volumes.

::: info

There is no general automatic rewrite path for replacing genesis on a live
network. Treat this as a coordinated migration: preserve the old state, bring
up compatible peers, and only move validators to the new configuration after
the operators agree on the migration plan.

:::

## Multihash Format of Private and Public Keys

If you look at the
[client configuration](/guide/configure/client-configuration.md), you will
notice that the keys there are given in
[multi-hash format](https://github.com/multiformats/multihash).

If you've never worked with multi-hash before, it is natural to assume that
the right-hand-side is not a hexadecimal representation of the key bytes
(two symbols per byte), but rather the bytes encoded as ASCII (or UTF-8),
and call `from_hex` on the string literal in both the `public_key` and
`private_key` instantiation.

It is also natural to assume that calling `PrivateKey::try_from_str` on the
string literal would yield only the correct key. So if you get the number
of bits in the key wrong, e.g. 32 bytes vs 64, that it would raise an error
message.

**Both of these assumptions are wrong.** Unfortunately, the error messages
don't help in de-bugging this particular kind of failure.

**How to fix**: use `hex_literal`. This will also turn an ugly string of
characters into a nice small table of obviously hexadecimal numbers.

::: warning

Even the `try_from_str` implementation cannot verify if a given string is a
valid `PrivateKey` and warn you if it isn't.

It will catch some obvious errors, e.g. if the string contains an invalid
symbol. However, since we aim to support many key formats, it can't do much
else. It cannot tell if the key is the _correct_ private key _for the given
account_ either, unless you submit an instruction.

:::

These sorts of subtle mistakes can be avoided, for example, by
deserialising directly from string literals, or by generating a fresh
key-pair in places where it makes sense.
