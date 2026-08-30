# Musubi Kotodama Packages

Musubi is the first-release package manager for Kotodama source packages.
It resolves an exact on-chain dependency graph, authenticates SoraFS source
archives, compiles and tests the selected workspace, builds canonical CAR
archives, and publishes immutable releases through Iroha.

Use Musubi when you need to:

- publish reusable Kotodama function libraries
- pin an exact transitive graph in `Musubi.lock`
- reconstruct dependency source from finalized SoraFS archive commitments
- build and test one package or a multi-package workspace
- inspect, publish, yank, maintain, or alias packages through the on-chain
  registry

## Package Names

Canonical package selectors use:

```text
namespace/package
```

Exact release identifiers add a version:

```text
namespace/package@version
```

There is no leading `@` before a namespace. A namespace is either a
dataspace root such as `universal` or a domain-qualified dataspace such as
`dex.universal`. The ledger binds that structural namespace to one stable
home dataspace before a package can be claimed.

## Manifest and Lockfile

A package uses the closed first-release `Musubi.toml` schema. The manifest
must declare `manifest-version = 1`, Kotodama edition `"1"`, and IVM ABI
version `1`; there is no alternate manifest or ABI mode.

```toml
manifest-version = 1

[package]
namespace = "dex.universal"
name = "swap-core"
version = "0.1.0"
edition = "1"
abi-version = 1

[lib]
source-dir = "src"
exports = ["quote"]

[dependencies.math]
package = "std.universal/math"
version = "^1.0.0"
```

Dependencies can use exact versions, caret or tilde requirements, wildcards
such as `1.*`, and comma-separated comparator sets such as
`>=1.0.0,<2.0.0`. The dependency table key is the parent-local import
alias; `package` is always the canonical registry selector.

`Musubi.lock` binds the graph to the exact genesis-derived `NetworkId` and
a finalized registry snapshot. It records the selected workspace roots and
immutable release nodes, including release, source, interface, archive,
ABI, and exact dependency-edge commitments. Parallel versions are allowed
when the resolved graph requires them.

## Configure Taira SoraFS Fetching

Taira is the public testnet for this workflow. Start from a Taira client
configuration with the checked-in chain and current pinned genesis-derived
network identity, then add the provider-specific authenticated fetch
bindings below. A Taira reset can change the `NetworkId`; refresh it from
the signed deployment profile instead of inferring it from the stable chain
UUID. Account signing material and provider operator keys must remain in
owner-only runtime files.

```toml
torii_url = "https://taira.sora.org/"
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
network_id = "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"

[musubi.fetch]
network_id = "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"
client_id = "musubi-taira"
request_timeout_ms = 30000

[[musubi.fetch.provider_gateways]]
provider_id = "REPLACE_WITH_ADMITTED_PROVIDER_ID_HEX"
url = "REPLACE_WITH_ADVERTISED_PROVIDER_HTTPS_ORIGIN"
operator_public_key = "REPLACE_WITH_PROVIDER_AUTHORIZED_OPERATOR_PUBLIC_KEY"
operator_private_key_file = "./secrets/taira-sorafs-provider.key"
```

Discover Taira's admitted providers from the public testnet root:

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'
```

The provider catalog supplies provider identities and advertised endpoints.
Obtain the matching operator authorization from the chosen provider. The
runtime uses that key to request bounded stream tokens; tokens are neither
CLI arguments nor lockfile content.

Do not use a Taira validator pin URL as `url`. The checked-in validators
have embedded SoraFS storage disabled. Their
`https://taira-validator-{1,2,3,4}.sora.org` endpoints accept pin
registration, while archive reads use the selected admitted provider's
HTTPS origin.

## Local Workflow

From the upstream Iroha workspace root, create or enter the package
directory and run Musubi through Cargo:

```bash
mkdir -p examples/swap-core
cd examples/swap-core

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  init . --namespace dex.universal --name swap-core --export quote

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  add std.universal/math --version '^1.0.0' --rename math

cargo run --manifest-path ../../Cargo.toml -p musubi -- fetch --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- check --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- build --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- test --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- package --config client.toml
```

`fetch` resolves the finalized registry graph, updates `Musubi.lock` when
allowed, and fills the immutable local cache from authenticated SoraFS
locations. `check`, `build`, `test`, and `package` perform the same graph
and cache checks before their own work.

Use `--locked` to reject any lockfile change. Use `--offline` only when
both the registry index and every required archive are already cached.
`--frozen` combines those two constraints. An offline cache miss fails;
Musubi never writes an unresolved lockfile.

Dependency sources are linked by rewriting qualified calls such as
`math::add()` to deterministic internal Kotodama names. A dependency call
to an unexported function is rejected. Imported libraries expose functions;
local `[[contract]]` and `[[test]]` targets remain explicit package
targets.

## Cache Verification and Repair

The public cache commands operate on immutable, registry-committed
archives:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair` quarantines corrupt trusted descendants and refetches exact
archives when finalized provider evidence permits it. Pruning is
deliberately fail-closed for live non-empty mutation; use `--dry-run` to
inspect the classified candidates.

## Packaging and Publishing

Inspect the clean positive file set before writing an archive, then build
the canonical package:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` writes `target/package/<namespace>-<name>-<version>.car`. The CAR
binds the canonical package manifest, semantic release manifest, exact
verification lock, source tree, interface digest, and SoraFS archive
commitment. There are no separate `pack`, `--car-out`,
`--sorafs-manifest-out`, or `--source-plan-out` commands in the
first-release CLI.

Publication is a signed, resumable network workflow. The selected
`client.toml` must contain the required `[musubi.publication]` bindings as
well as the account and Taira network configuration. Package exactly one
workspace member:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

Use `--detach` to return after the operation journal and seed-ingress
boundary are durable. Continue a durable operation with
`publish --resume <operation-id> --config client.toml`. The narrower
`--recover <operation-id>` path only reconstructs missing immutable
sidecars for a pristine pre-ingress journal. There is no publication
`--dry-run` or generic public upload fallback; run `package --list` and
`package` for local preflight.

## Registry Queries and Lifecycle

Search and inspect the finalized registry with the same Taira client
configuration:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  search swap --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  info dex.universal/swap-core --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  versions dex.universal/swap-core --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  alias resolve swap --config client.toml
```

Yanking excludes an immutable release from new resolutions while existing
exact locks remain reproducible. Read the current yank revision first, then
submit a compare-and-set mutation:

```bash
: "${EXPECTED_YANK_REVISION:?set the current non-zero yank revision}"

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  yank dex.universal/swap-core 0.1.0 \
  --expected-revision="$EXPECTED_YANK_REVISION" \
  --reason="bad archive" \
  --config client.toml
```

Use `unyank` with the same package, version, and freshly read revision to
reverse that state. Package ownership and maintainer roles control publish,
yank, metadata, and archive-location permissions. Global aliases have their
own priced registration, retarget history, and compare-and-set revisions;
they are not package ownership shortcuts.

## Iroha Surfaces

Musubi uses first-release V1 instructions and queries:

| Surface                                              | Purpose                                                        |
| ---------------------------------------------------- | -------------------------------------------------------------- |
| `RegisterMusubiNamespaceBindingV1`                   | Bind a namespace to its stable home dataspace.                 |
| `RegisterMusubiArchiveV1`                            | Register an immutable authenticated source archive commitment. |
| `AddMusubiArchiveLocationV1`                         | Add or renew a proven SoraFS archive location.                 |
| `PublishMusubiReleaseV1`                             | Claim or update a package and publish one immutable release.   |
| `SetMusubiReleaseYankV1`                             | Compare-and-set the yanked state of an exact release.          |
| `InviteMusubiPackageMaintainerV1`                    | Start the explicit package role invitation flow.               |
| `RegisterMusubiAliasV1` / `RetargetMusubiAliasV1`    | Register or retarget a governed global alias.                  |
| `AssertMusubiReleaseDigestV1`                        | Assert the exact immutable release digest.                     |
| `FindMusubiExactPackageV1`                           | Read one exact package and its revisions.                      |
| `FindMusubiExactReleaseV1`                           | Read one exact release snapshot.                               |
| `FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` | Resolve or list finalized release candidates.                  |
| `FindMusubiArchiveLocationsV1`                       | Read finalized provider-backed archive locations.              |
| `FindMusubiAliasV1` / `FindMusubiAliasHistoryV1`     | Read the current alias target or its immutable history.        |

Torii exposes the app route family under `/v1/musubi/*`. MCP tools use the
current `iroha.musubi.queries.*` and `iroha.musubi.instructions.*` names.
See [Torii endpoints](/reference/torii-endpoints.md) and the
[query reference](/reference/queries.md) for the broader API map.
