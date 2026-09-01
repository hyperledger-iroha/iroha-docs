# Compatibility Matrix

The compatibility matrix shows cross-SDK scenario coverage for the current
Iroha 3 docs set. By default, the page loads the bundled snapshot generated
from the pinned [`hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha)
revision.

The matrix consists of:

- **Stories** in the first column
- **SDKs** across the remaining columns
- **Status symbols** for covered, failed, and missing data

Only results verified by the refresh workflow are reported as covered or
failed. Scenarios without evidence for the pinned revision are shown as
missing data rather than inheriting results from another source revision.

<CompatibilityMatrixTable />

::: info
Set `VITE_COMPAT_MATRIX_URL` only to override the bundled snapshot with a
compatible live backend. Without that variable, the page loads
`src/public/compat-matrix.json`.
:::
