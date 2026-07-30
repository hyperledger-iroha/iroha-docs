# SDK Tutorials

These pages summarize the Iroha 3 client entry points shipped from the main
workspace, including canonical package names, installation paths, and minimal
starting points.

## Recommended Order

1. [Install Iroha 3](/get-started/install-iroha.md)
2. [Launch Iroha 3](/get-started/launch-iroha.md)
3. Pick an SDK:
   - [Rust](/guide/tutorials/rust.md)
   - [Python](/guide/tutorials/python.md)
   - [JavaScript / TypeScript](/guide/tutorials/javascript.md)
   - [Kotlin, Android, and Java](/guide/tutorials/kotlin-java.md)
   - [Swift and iOS](/guide/tutorials/swift.md)
4. Review the [sample apps](/guide/tutorials/sample-apps.md) when you want a
   complete client application reference.
5. Use [Embed Kaigi](/guide/tutorials/kaigi.md) when you want to add
   wallet-backed audio/video meetings to your own app.
6. Use [Musubi packages](/guide/tutorials/musubi.md) when you need reusable
   Kotodama source libraries with pinned on-chain registry dependencies.

## Samples

The upstream workspace contains JavaScript recipes and Swift/iOS sample
projects. For Android, start with the Kotlin SDK modules and their tests.

- [Sample apps overview](/guide/tutorials/sample-apps.md)
- [Embed Kaigi in a JavaScript app](/guide/tutorials/kaigi.md)

## Source of Truth

All SDK pages here are derived from the current upstream workspace:

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (mirrored during the Kotlin transition)
- `IrohaSwift`
- `crates/musubi`

When in doubt, prefer the README and package metadata in those directories;
they describe the source revision you are building.
