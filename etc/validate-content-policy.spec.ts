import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, test } from 'vitest'
import { validateContentPolicy } from './validate-content-policy'

describe('content policy validation', () => {
  test('accepts current first-release terminology', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-policy-'))
    await writeFile(path.join(root, 'README.md'), '# Iroha 3\n\nCanonical documentation.\n')
    expect(await validateContentPolicy(root)).toEqual([])
  })

  test('reports unbalanced Markdown containers while ignoring fenced examples', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-policy-'))
    await writeFile(
      path.join(root, 'README.md'),
      [
        '::: warning Release status This title accidentally contains the prose. :::',
        '',
        '```md',
        '::: tip This literal example is not a real container.',
        '```',
      ].join('\n'),
    )

    expect(await validateContentPolicy(root)).toEqual(['README.md:1: unclosed Markdown container directive warning'])
  })

  test('accepts balanced and nested Markdown containers', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-policy-'))
    await writeFile(
      path.join(root, 'README.md'),
      ['::: warning Release status', 'Body.', '::: details More', 'Nested.', ':::', ':::'].join('\n'),
    )

    expect(await validateContentPolicy(root)).toEqual([])
  })

  test('reports retired repository and release guidance', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-policy-'))
    await mkdir(path.join(root, 'src'))
    await writeFile(
      path.join(root, 'src', 'old.md'),
      'See hyperledger-iroha/iroha-2-docs on the i23-features branch. Use pnpm get-snippets with Node.js 18+.\n',
    )

    const errors = await validateContentPolicy(root)
    expect(errors).toHaveLength(5)
    expect(errors.every((error) => error.startsWith('src/old.md:1:'))).toBe(true)
  })

  test('reports implementation source links to a mutable branch', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-policy-'))
    await writeFile(
      path.join(root, 'README.md'),
      'See https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_cli/README.md.\n',
    )

    expect(await validateContentPolicy(root)).toEqual(['README.md:1: mutable implementation source link'])
  })

  test('reports the retired extensionless OpenAPI route', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-policy-'))
    await writeFile(path.join(root, 'README.md'), 'Fetch `GET /openapi` before generating a client.\n')

    expect(await validateContentPolicy(root)).toEqual(['README.md:1: retired extensionless OpenAPI route'])
  })

  test('reports retired SORA 2 burn-claim guidance', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-policy-'))
    await mkdir(path.join(root, 'src'))
    await writeFile(
      path.join(root, 'src', 'old-minamoto.md'),
      'Burn SORA 2 XOR after block 25,867,650, then use minamoto.sora.org/claim.\\n',
    )

    expect(await validateContentPolicy(root)).toEqual([
      'src/old-minamoto.md:1: retired SORA 2 migration guidance',
      'src/old-minamoto.md:1: retired Minamoto burn-claim block',
      'src/old-minamoto.md:1: retired Minamoto claim application',
    ])
  })

  test('reports retired Offline Note V2 guidance', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-policy-'))
    await mkdir(path.join(root, 'src'))
    await writeFile(
      path.join(root, 'src', 'old-offline.md'),
      'Call get_offline_v2_readiness at /v1/offline/v2/readiness before issuing Offline Note V2.\\n',
    )

    expect(await validateContentPolicy(root)).toEqual(['src/old-offline.md:1: retired Offline Note V2 API'])
  })

  test('reports pre-release FastPQ, Norito, and SoraDNS narratives', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-policy-'))
    await mkdir(path.join(root, 'src'))
    await writeFile(
      path.join(root, 'src', 'old-rollout.md'),
      [
        'The digest is absent until per-delta digest plumbing is available.',
        'Clients fall back to JSON during rollout; Norito RPC rollout comes later.',
        'Use the Transitional compatibility gateway when clients cannot resolve SoraDNS names directly yet.',
      ].join('\n'),
    )

    expect(await validateContentPolicy(root)).toEqual([
      'src/old-rollout.md:1: pre-release FastPQ digest promise',
      'src/old-rollout.md:2: Norito rollout narrative',
      'src/old-rollout.md:3: transitional SoraDNS gateway narrative',
    ])
  })

  test('reports retired or unpublished JavaScript and Sumeragi guidance', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-policy-'))
    await mkdir(path.join(root, 'src'))
    await writeFile(
      path.join(root, 'src', 'old-sdk.md'),
      [
        'npm install @iroha/iroha-js',
        'Import OfflineQrStream from node_modules/@iroha/iroha-js.',
        'Run ops sumeragi collectors and ops sumeragi rbc status.',
        'Run ops sumeragi phases.',
        'GET /v1/sumeragi/commit-certificates',
        'GET /v1/sumeragi/bls_keys',
      ].join('\n'),
    )

    expect(await validateContentPolicy(root)).toEqual([
      'src/old-sdk.md:1: unpublished JavaScript registry install',
      'src/old-sdk.md:2: nonexistent OfflineQrStream API',
      'src/old-sdk.md:2: unsupported node_modules native SDK build',
      'src/old-sdk.md:3: retired Sumeragi CLI command',
      'src/old-sdk.md:4: retired Sumeragi CLI command',
      'src/old-sdk.md:5: retired Sumeragi route',
      'src/old-sdk.md:6: retired Sumeragi route',
    ])
  })

  test('reports retired local Sumeragi and telemetry settings', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-policy-'))
    await writeFile(
      path.join(root, 'README.md'),
      [
        'sumeragi.consensus_mode = "permissioned"',
        'sumeragi.collectors.redundant_send_r = 2',
        'telemetry_enabled = true',
        '[sumeragi.da]',
        'sumeragi.advanced.da.quorum_timeout_multiplier = 2',
        'availability_timeout_floor_ms = 1000',
        'Increase collector fanout after a benchmark.',
      ].join('\n'),
    )

    expect(await validateContentPolicy(root)).toEqual([
      'README.md:1: retired local Sumeragi consensus mode',
      'README.md:2: retired Sumeragi collector setting',
      'README.md:3: retired telemetry boolean',
      'README.md:4: retired Sumeragi DA tuning table',
      'README.md:5: retired Sumeragi DA tuning table',
      'README.md:5: retired Sumeragi DA timeout setting',
      'README.md:6: retired Sumeragi DA timeout setting',
      'README.md:7: retired consensus collector fanout guidance',
    ])
  })

  test('reports retired Soracloud private-model and singular transaction routes', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-policy-'))
    await writeFile(
      path.join(root, 'README.md'),
      [
        'POST /v1/soracloud/model/run-private',
        'POST /v1/soracloud/model/run-private/finalize',
        'POST /v1/soracloud/model/decrypt-output',
        'POST /v1/transaction',
      ].join('\n'),
    )

    expect(await validateContentPolicy(root)).toEqual([
      'README.md:1: retired Soracloud private-model route',
      'README.md:2: retired Soracloud private-model route',
      'README.md:3: retired Soracloud private-model route',
      'README.md:4: nonexistent singular versioned transaction route',
    ])
  })

  test('reports the retired Kaigi CLI prefix and quickstart option', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-policy-'))
    await writeFile(
      path.join(root, 'README.md'),
      ['iroha kaigi quickstart --auto-join-host', 'iroha app kaigi quickstart'].join('\n'),
    )

    expect(await validateContentPolicy(root)).toEqual([
      'README.md:1: retired Kaigi CLI prefix',
      'README.md:1: retired Kaigi quickstart option',
    ])
  })

  test('reports retired Soracloud and nonexistent shield CLI commands', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-policy-'))
    await writeFile(
      path.join(root, 'README.md'),
      [
        'iroha app soracloud app init',
        'iroha soracloud app local-plan',
        'iroha soracloud app deploy',
        'iroha soracloud status',
        'iroha soracloud rollback',
        'iroha soracloud config-set',
        'iroha soracloud secret-set',
        'iroha app zk shield',
        'iroha app zk unshield',
      ].join('\n'),
    )

    expect(await validateContentPolicy(root)).toEqual([
      'README.md:1: retired Soracloud CLI prefix',
      'README.md:2: retired Soracloud app command',
      'README.md:3: retired Soracloud app command',
      'README.md:4: retired unscoped Soracloud service command',
      'README.md:5: retired unscoped Soracloud service command',
      'README.md:6: retired unscoped Soracloud service command',
      'README.md:7: retired unscoped Soracloud service command',
      'README.md:8: nonexistent shield or unshield CLI command',
      'README.md:9: nonexistent shield or unshield CLI command',
    ])
  })

  test('reports retired Musubi surfaces and CLI workflows', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-policy-'))
    await mkdir(path.join(root, 'src'))
    await writeFile(
      path.join(root, 'src', 'old-musubi.md'),
      [
        'Resolve FindMusubiReleaseByRef and mutate with SetMusubiShortAlias.',
        'cargo run -p musubi -- install --gateway-provider provider-a',
        'musubi publish --dry-run',
      ].join('\n'),
    )

    expect(await validateContentPolicy(root)).toEqual([
      'src/old-musubi.md:1: retired Musubi query or instruction name',
      'src/old-musubi.md:2: retired Musubi CLI workflow',
      'src/old-musubi.md:3: retired Musubi CLI workflow',
    ])
  })

  test('reports the retired daemon executable and invalid FastPQ CLI mode', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-policy-'))
    await mkdir(path.join(root, 'src'))
    await writeFile(
      path.join(root, 'src', 'old-daemon.md'),
      [
        'irohad --config ./config.toml',
        'cargo run --bin irohad -- --help',
        'See /reference/irohad-cli.md.',
        'Use target/release/irohad.',
        'iroha3d --fastpq-execution-mode auto',
        'execution_mode = auto | cpu | gpu',
      ].join('\n'),
    )

    expect(await validateContentPolicy(root)).toEqual([
      'src/old-daemon.md:1: retired irohad executable or route',
      'src/old-daemon.md:2: retired irohad executable or route',
      'src/old-daemon.md:3: retired irohad executable or route',
      'src/old-daemon.md:4: retired irohad executable or route',
      'src/old-daemon.md:5: unsupported FastPQ auto mode',
      'src/old-daemon.md:6: unsupported FastPQ auto mode',
    ])
  })

  test('allows the current iroha3d binary from the irohad Cargo package', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-policy-'))
    await writeFile(
      path.join(root, 'README.md'),
      'cargo run -p irohad --bin iroha3d -- --help\nSource: crates/irohad\n',
    )

    expect(await validateContentPolicy(root)).toEqual([])
  })

  test('requires the canonical Taira SoraFS profile in every matching route', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-policy-'))
    const routeDirectory = path.join(root, 'src', 'fr', 'blockchain')
    await mkdir(routeDirectory, { recursive: true })
    await writeFile(
      path.join(routeDirectory, 'sora-nexus-services.md'),
      [
        'fc56984b-2be7-431d-840e-21514d1883f0',
        '369',
        'hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94',
        'https://taira.sora.org',
        'https://taira-validator-1.sora.org',
        'https://taira-validator-2.sora.org',
        'https://taira-validator-3.sora.org',
        'https://taira-validator-4.sora.org',
        'torii_gateway chunk_range_fetch potr_mldsa',
        'https://{cid}.sorafs.taira.sora.org/{path}',
        '[sorafs.storage]\nenabled = false',
        'max_capacity_bytes = 13743895347',
        '[sorafs.discovery]\ndiscovery_enabled = true',
        '[sorafs.discovery.admission]\nenvelopes_dir = "configs/soranexus/taira/sorafs_admission"',
        'trusted_council_keys = ["REPLACE_WITH_TAIRA_SORAFS_COUNCIL_PUBLIC_KEY"]',
        'signature_threshold = "REPLACE_WITH_TAIRA_SORAFS_COUNCIL_SIGNATURE_THRESHOLD"',
        '[sorafs.gateway]\nrequire_manifest_envelope = true',
        'enforce_admission = true',
        'enforce_capabilities = true',
        '[sorafs.gateway.untrusted_hosting]\nenabled = true',
        'path_gateway_redirect = true',
        'redirect_html_only = true',
        '[sorafs.gateway.untrusted_hosting.cid_host_suffixes]',
        'live = "sorafs.sora.org"',
        'taira = "sorafs.taira.sora.org"',
        '[sorafs.repair]\nenabled = false',
        'claim_ttl_secs = 900',
        'heartbeat_interval_secs = 60',
        'max_attempts = 3',
        'worker_concurrency = 4',
        '[sorafs.gc]\nenabled = false',
        'interval_secs = 900',
        'max_deletions_per_run = 500',
        'retention_grace_secs = 86400',
        '[gov.sorafs_pin_policy]\nrequire_council_signatures = false',
      ].join('\n'),
    )

    expect(await validateContentPolicy(root)).toEqual([])

    await writeFile(path.join(routeDirectory, 'sora-nexus-services.md'), 'https://{cid}.sorafs.sora.org/{path}\n')
    const errors = await validateContentPolicy(root)
    expect(errors).toHaveLength(2)
    expect(errors[0]).toContain('incomplete canonical Taira SoraFS profile')
    expect(errors[1]).toBe('src/fr/blockchain/sora-nexus-services.md: production SoraFS content origin used for Taira')
  })

  test('leaves verbatim generated artifacts to provenance validation', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-policy-'))
    await mkdir(path.join(root, 'src', 'snippets'), { recursive: true })
    await mkdir(path.join(root, 'src', 'public', 'openapi'), { recursive: true })
    await writeFile(path.join(root, 'src', 'snippets', 'kagami-cli.md'), 'Current option: iroha2\\n')
    await writeFile(path.join(root, 'src', 'public', 'openapi', 'torii.json'), '{"profile":"iroha2"}\\n')
    await writeFile(path.join(root, 'src', 'prose.md'), 'Current option: iroha2\\n')

    expect(await validateContentPolicy(root)).toEqual([
      'src/prose.md:1: retired major-version documentation',
      'src/prose.md:1: retired major-version binary or identifier',
    ])
  })

  test('ignores abandoned atomic translation staging trees', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-policy-'))
    const staging = path.join(root, '.iroha-docs-translation-1234-abcd', 'fr')
    await mkdir(staging, { recursive: true })
    await writeFile(path.join(staging, 'old.md'), 'Iroha 2\\n')

    expect(await validateContentPolicy(root)).toEqual([])
  })

  test('ignores documented local translation environments and model caches', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-policy-'))
    for (const directory of ['.cache', '.venv-translate']) {
      await mkdir(path.join(root, directory), { recursive: true })
      await writeFile(path.join(root, directory, 'model-metadata.json'), '{"profile":"iroha2"}\n')
    }

    expect(await validateContentPolicy(root)).toEqual([])
  })
})
