# NFTs

## Outcome

Inspect Taira NFT state, then register, update, transfer, and query a
unique NFT on a generated local network. The workflow uses a fully
qualified `name$domain.dataspace` NFT ID and canonical I105 owner IDs.

## Prerequisites

- `curl`, `jq`, Python 3.11 or later, and the current `iroha` CLI.
- Read-only Taira access.
- For writes, a generated local network from
  [Launch Iroha](/get-started/launch-iroha.md), with
  `./localnet/client.toml` and Torii on `http://127.0.0.1:8080`.

## Steps

### 1. Inspect the public Taira collection

An empty page is a successful read: it means no visible NFTs are in the
requested page.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nfts: [.items[] | {id, owned_by, content}]}'
```

NFTs are unique records, not numeric balances. They have an ID, one owner,
and a compact `content` metadata map.

### 2. Prepare local owner IDs

The write example uses the checked-in `wonderland.universal` domain. Derive
the configured authority without exposing its private key, then choose
another registered account as the transfer destination.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
NFT_ID='cookbook_badge$wonderland.universal'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
CURRENT_OWNER="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

NEW_OWNER="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg owner "$CURRENT_OWNER" \
      '[.items[].id | select(. != $owner)][0]'
)"
```

The `$` separator belongs to the NFT text form. Keep the complete
`wonderland.universal` domain and dataspace suffix.

### 3. Register the NFT with initial content

The CLI reads the initial JSON object from standard input. The current
authority becomes the owner.

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### 4. Update the content map

Metadata values are JSON. Setting a key inserts or replaces that one entry;
it does not replace the entire NFT record.

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5. Transfer ownership

Supply both canonical I105 account IDs. An alias must be resolved before it
is used as `--from` or `--to`.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning Permission boundary

On Taira, every write also needs `--metadata ./taira.tx-metadata.json` and
an explicit fee payer. Registration, transfer, removal, and metadata
updates are checked by the active runtime (`CanRegisterNft`,
`CanTransferNft`, `CanUnregisterNft`, and `CanModifyNftMetadata` in the
default permission surface). Use a domain assigned to your application or
keep this walkthrough on localnet.

:::

For contract-owned workflows, Kotodama exposes typed NFT host calls. The
following is the exact lifecycle fixture compiled and executed by the
pinned IVM documentation test:

```kotodama
seiyaku NftFlow {
    kotoage fn nft_issue_and_transfer() authorize("NftAuthority") {
        let owner = AccountId::parse(
            "sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV",
        );
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft, owner);
        let to = AccountId::parse(
            "sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76",
        );
        ledger::nft::transfer(
            source: owner,
            nft: nft,
            destination: to,
        );
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft);
    }
}
```

The two fixed I105 values are upstream test fixtures; the harness registers
the destination before execution. They are not `CURRENT_OWNER` and
`NEW_OWNER` from the CLI walkthrough. For an application contract, supply
its actual canonical accounts, then compile, test, deploy, and call it
through [Smart contracts](./smart-contracts.md). Do not submit unreviewed
bytecode to Taira, and remember that contract execution still passes
runtime authorization.

## Verify

Read the NFT directly and assert that its owner changed while its content
remained attached:

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

If the CLI wraps the record in an output envelope, inspect the JSON once
and apply the assertion to the contained NFT object. The authoritative
invariants are `id`, `owned_by`, and `content`.

## Troubleshooting

- `name$domain` can default to the universal dataspace in some parsers, but
  cookbook and application IDs should use the explicit
  `name$domain.dataspace` form.
- A repeated registration of the same NFT ID is rejected. Use a fresh
  localnet or choose a stable new ID for a distinct record.
- Metadata input must be valid JSON on standard input. A shell string
  without JSON quoting is not a metadata value.
- A transfer signed by an account other than the current owner needs an
  exact permission; changing `--from` does not change the signer.
- After transfer, the original client may no longer be allowed to mutate or
  unregister the NFT. Use the new owner's signer or an authorized
  controller.
- Taira can return an empty NFT collection. Do not treat `items: []` as
  proof that NFT instructions are unavailable.

## Source and related docs

- [NFT integration tests at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/nft.rs)
- [Kotodama NFT host-call tests at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [Exact Kotodama NFT lifecycle fixture at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/ivm/docs/examples/12_nft_flow.ko)
- [NFTs](/blockchain/nfts.md)
- [Metadata](/blockchain/metadata.md)
- [Instructions](/blockchain/instructions.md)
- [Permission tokens](/reference/permissions.md)
