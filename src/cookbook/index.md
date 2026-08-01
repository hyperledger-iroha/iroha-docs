# Iroha 3 Application Cookbook

Build against Iroha 3 with small, verifiable recipes that start on the
Taira testnet and keep Minamoto mainnet read-only. Each recipe states
whether it is a public read, a normal funded-account write, or a
permission-gated operation. Commands use current I105 account IDs, explicit
fee selection, and the behavior checked in at Iroha commit
[`bc7114ed1c7f265a156d2100ff09e851cc95702c`](https://github.com/hyperledger-iroha/iroha/tree/bc7114ed1c7f265a156d2100ff09e851cc95702c).

Start with [Connect to Taira](./connect-to-taira.md). It creates the client
configuration and fee metadata reused by the command-line recipes. Never
copy a fee asset ID from this documentation: derive it from the current
Taira faucet response.

## Access levels

- **Public** — no signer or network permission is required.
- **Write-ready** — use a funded Taira test account, an explicit fee payer,
  and the current fee asset returned by the faucet.
- **Permission required** — Taira must grant the named runtime permission
  or governed namespace. Use a generated local network when that grant is
  not available; local success does not confer Taira authority.

No cookbook recipe sends a write to Minamoto.

## Start and submit

| Recipe                                                                | Taira access | What you finish with                                                 |
| --------------------------------------------------------------------- | ------------ | -------------------------------------------------------------------- |
| [Connect to Taira](./connect-to-taira.md)                             | Write-ready  | A funded I105 signer, live fee asset, and applied canary transaction |
| [Submit and verify transactions](./submit-and-verify-transactions.md) | Write-ready  | A quoted transaction, terminal pipeline result, and stored receipt   |

## Ledger state

| Recipe                                            | Taira access                                                 | What you finish with                                           |
| ------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------- |
| [Accounts and aliases](./accounts-and-aliases.md) | Permission required                                          | An I105 account plus a resolvable human-readable alias         |
| [Fungible assets](./fungible-assets.md)           | Permission required                                          | A registered definition, minted balance, and verified transfer |
| [NFTs](./nfts.md)                                 | Permission required                                          | A registered NFT, transferred ownership, and post-state query  |
| [Metadata](./metadata.md)                         | Write-ready for owned objects; permission required otherwise | A metadata write followed by an exact read                     |
| [Query ledger state](./query-ledger-state.md)     | Public for public state                                      | Paginated and filtered results without a write                 |

## Access and automation

| Recipe                                              | Taira access        | What you finish with                                           |
| --------------------------------------------------- | ------------------- | -------------------------------------------------------------- |
| [Permissions and roles](./permissions-and-roles.md) | Permission required | A scoped permission collected in a reusable role               |
| [Stream events](./stream-events.md)                 | Public              | A reconnecting SSE consumer that reconciles after a disconnect |
| [Triggers](./triggers.md)                           | Permission required | A by-call trigger, execution receipt, and completion event     |
| [Multisig](./multisig.md)                           | Write-ready         | A weighted multisig account and quorum-approved proposal       |

## Application patterns

| Recipe                                  | Taira access                                                         | What you finish with                                                 |
| --------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [Smart contracts](./smart-contracts.md) | Permission required                                                  | Checked Kotodama bytecode, deployment artifacts, and a contract call |
| [Wallet Connect](./wallet-connect.md)   | Write-ready when Connect is enabled                                  | A wallet-approved asset transfer and reconciled transaction hash     |
| [Native escrow](./native-escrow.md)     | Write-ready for asset owners; dispute resolution requires permission | A native lock or marketplace escrow with queried final state         |

## Verified example surfaces

The marks below describe runnable examples in each recipe, not every SDK
that can access the feature.

| Recipe                | HTTP / curl | CLI | Rust | JavaScript | Python | Kotodama |
| --------------------- | :---------: | :-: | :--: | :--------: | :----: | :------: |
| Connect to Taira      |      ✓      |  ✓  |  —   |     —      |   —    |    —     |
| Submit and verify     |      ✓      |  ✓  |  —   |     —      |   —    |    —     |
| Accounts and aliases  |      ✓      |  ✓  |  —   |     —      |   —    |    —     |
| Fungible assets       |      ✓      |  ✓  |  —   |     ✓      |   —    |    —     |
| NFTs                  |      ✓      |  ✓  |  —   |     —      |   —    |    ✓     |
| Metadata              |      ✓      |  ✓  |  —   |     —      |   —    |    —     |
| Query ledger state    |      ✓      |  ✓  |  ✓   |     ✓      |   —    |    —     |
| Permissions and roles |      —      |  ✓  |  ✓   |     —      |   —    |    —     |
| Stream events         |      ✓      |  —  |  —   |     ✓      |   —    |    —     |
| Triggers              |      —      |  ✓  |  ✓   |     —      |   —    |    —     |
| Multisig              |      —      |  ✓  |  ✓   |     —      |   —    |    —     |
| Smart contracts       |      —      |  ✓  |  —   |     —      |   —    |    ✓     |
| Wallet Connect        |      ✓      |  —  |  ✓   |     ✓      |   —    |    —     |
| Native escrow         |      —      |  —  |  ✓   |     ✓      |   ✓    |    ✓     |

Each recipe links to production architecture, operations, SDK, and API
guidance. The recipe itself shows one successful path. It also includes the
checks needed to prove the result.
