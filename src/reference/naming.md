# Naming Conventions

When you are naming accounts, domains, or assets, you have to keep in mind the following conventions used in Iroha:

1. There is a number of reserved separators that are used for specific types of constructs:

   - `@` is reserved for account aliases and scoped account/public-key forms
   - `#` is reserved for asset definition aliases and asset balance literals
   - `::` is reserved for contract aliases
   - `.` is reserved for domain and data space qualification
   - `$` is reserved for NFT identifiers such as `name$domain.dataspace`

2. A name must be non-empty, in Unicode NFC form, at most 255 UTF-8 bytes long, and free of whitespace, control, and bidirectional-control characters.

## Try It on Taira

Resolve a public asset alias into its canonical asset definition ID:

```bash
curl -fsS https://taira.sora.org/v1/assets/aliases/resolve \
  -H 'content-type: application/json' \
  -d '{"alias":"usd#wonderland"}' \
  | jq '{alias, asset_definition_id, asset_name, status: .alias_binding.status}'
```

Compare that with the asset definition list:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=20' \
  | jq -r '.items[] | select(.alias != null) | [.alias, .id, .name] | @tsv'
```

The `#` character separates an asset alias from the domain context. Keep it out of plain names unless you are intentionally writing an asset alias or asset balance literal.
