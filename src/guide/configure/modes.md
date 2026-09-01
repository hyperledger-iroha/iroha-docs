# Public and Private Blockchains

Iroha can run in a variety of configurations. As the administrator of your
own network, you decide which executor and permission policy determine
whether a transaction is accepted.

The common profiles are _private_ permissioned networks and more open
_public_ networks. Both are configured through genesis state and executor
policy, not through separate node binaries.

Below we outline the major differences in these two use cases.

## Permissions

In a _public_ blockchain, most accounts have the same set of permissions.
In a _private_ blockchain, each account receives only its explicit
permissions.

::: info

Refer to the
[dedicated section on permissions](/blockchain/permissions.md) for
more details.

:::

## Peers

In a _public_ blockchain, peer admission is part of chain policy. For a
_private_ blockchain, deployments usually pin the trusted peer set in
configuration and genesis.

::: info

Refer to [peer management](peer-management.md) for more details.

:::

## Registering accounts

Depending on how you decide to set up your
[genesis block (`genesis.json`)](genesis.md), the process for registering
an account might go one of two ways. To understand why, let's talk about
permission first.

The selected executor defines which permission checks apply. You can grant
the default [permission tokens](/blockchain/permissions.md) in genesis to
shape a private, administrator-managed network or a more open network.
Once those permissions are active, the process of registering accounts is
different.

Public and private registration policies usually differ:

- A _public_ registration policy accepts account registrations from any
  eligible user[^1]. The user needs a suitable client, a private key for a
  supported algorithm, and a registration request accepted by policy.

- A _private_ registration policy can authorize one account or one smart
  contract to submit registrations. A custom policy can limit registration to
  a time window. It can also require the submitter to spend a token whose
  supply is fixed because no authority has permission to mint more.

- With the default private-network pattern, an existing account submits the
  registration for each new account.

The default permission validators cover the typical private blockchain
use case.

::: info

Public and private modes are executor and genesis policy choices. Both use the
same node binary. Review the selected executor and genesis permissions before
running an open network.

:::

Refer to the section on
[instructions](/blockchain/instructions.md#un-register) for more
details about `Register<Account>` instructions.

[^1]:
    `Register<Account>` creates ledger state for a canonical, domainless
    `AccountId`; domain routing and aliases are managed separately.
