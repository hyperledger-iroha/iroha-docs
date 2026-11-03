import { appendFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { IROHA_GITHUB_REPOSITORY, matchesRefGlob, readProvenance, type IrohaProvenance } from './provenance'

// Selects and verifies the Iroha commit that generated references are pinned to. A pin must carry a
// signature GitHub verifies and must be reachable from the tracked public branch or a release tag,
// so a verified commit that exists only in a fork or an unmerged pull request is never accepted.

const COMMIT_PATTERN = /^[0-9a-f]{40}$/u
const REF_PATTERN = /^refs\/(heads|tags)\/([A-Za-z0-9._/-]+)$/u
const BRANCH_PAGE_SIZE = 100
const BRANCH_PAGE_LIMIT = 5

/** Percent-encodes a ref for a GitHub REST route while keeping the `/` separators GitHub expects. */
const encodeRef = (ref: string) => encodeURIComponent(ref).replace(/%2F/gu, '/')

export interface SourceCommit {
  sha: string
  verified: boolean
  committedAt: string
}

export interface TagRef {
  name: string
  object: { type: string; sha: string }
}

export interface AnnotatedTag {
  verified: boolean
  target: { type: string; sha: string }
}

export type Comparison = 'ahead' | 'behind' | 'identical' | 'diverged'

/** The read-only GitHub queries used to select and verify a pin. */
export interface SourceApi {
  /** Commits reachable from `branch`, newest first. */
  branchCommits(branch: string, page: number, perPage: number): Promise<SourceCommit[]>
  /** A commit addressed by full SHA. */
  commit(sha: string): Promise<SourceCommit>
  /** Tag refs whose names start with `prefix`. */
  tags(prefix: string): Promise<TagRef[]>
  /** An annotated tag object. */
  annotatedTag(sha: string): Promise<AnnotatedTag>
  /** How `head` relates to `base`; `ahead` means `head` contains `base`. */
  compare(base: string, head: string): Promise<Comparison>
}

export interface SourceSelection {
  commit: string
  ref: string
  committedAt: string
  reason: string
}

export interface SelectionResult {
  changed: boolean
  previous: string
  selection?: SourceSelection
  reason: string
}

interface GithubCommitResponse {
  sha: string
  commit: { committer: { date: string } | null; verification?: { verified: boolean } }
}

/** GitHub REST access to the public Iroha repository; `token` only raises rate limits. */
export function githubSourceApi(token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN): SourceApi {
  async function get<T>(route: string): Promise<T> {
    const response = await fetch(`https://api.github.com/repos/${IROHA_GITHUB_REPOSITORY}/${route}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    if (!response.ok) {
      throw new Error(`GitHub API ${route} returned ${response.status}: ${(await response.text()).slice(0, 300)}`)
    }
    return (await response.json()) as T
  }

  const toCommit = (value: GithubCommitResponse): SourceCommit => ({
    sha: value.sha,
    verified: value.commit.verification?.verified === true,
    committedAt: value.commit.committer?.date ?? '',
  })

  return {
    async branchCommits(branch, page, perPage) {
      const query = new URLSearchParams({ sha: branch, per_page: String(perPage), page: String(page) })
      return (await get<GithubCommitResponse[]>(`commits?${query}`)).map(toCommit)
    },
    async commit(sha) {
      return toCommit(await get<GithubCommitResponse>(`commits/${sha}`))
    },
    async tags(prefix) {
      const refs = await get<Array<{ ref: string; object: { type: string; sha: string } }>>(
        `git/matching-refs/tags/${encodeRef(prefix)}`,
      )
      return refs.map((ref) => ({ name: ref.ref.replace(/^refs\/tags\//u, ''), object: ref.object }))
    },
    async annotatedTag(sha) {
      const tag = await get<{ object: { type: string; sha: string }; verification?: { verified: boolean } }>(
        `git/tags/${sha}`,
      )
      return { verified: tag.verification?.verified === true, target: tag.object }
    },
    async compare(base, head) {
      const route = `compare/${encodeRef(base)}...${encodeRef(head)}?per_page=1`
      return (await get<{ status: Comparison }>(route)).status
    },
  }
}

/** Orders release versions such as `v3.0.0-rc.1` < `v3.0.0` < `v3.0.1`; returns a negative number when `a < b`. */
export function compareVersions(a: string, b: string): number {
  const parse = (version: string) => {
    const [core, ...prerelease] = version.replace(/^v/u, '').split('-')
    return { core: core.split('.'), prerelease: prerelease.join('-') }
  }
  const compareIdentifiers = (left: string[], right: string[]) => {
    for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
      if (left[index] === undefined) return -1
      if (right[index] === undefined) return 1
      const numeric = /^\d+$/u.test(left[index]) && /^\d+$/u.test(right[index])
      const order = numeric
        ? Number(left[index]) - Number(right[index])
        : left[index].localeCompare(right[index], 'en', { numeric: true })
      if (order !== 0) return order
    }
    return 0
  }

  const left = parse(a)
  const right = parse(b)
  const core = compareIdentifiers(left.core, right.core)
  if (core !== 0) return core
  if (left.prerelease === right.prerelease) return 0
  if (!left.prerelease) return 1
  if (!right.prerelease) return -1
  return compareIdentifiers(left.prerelease.split('.'), right.prerelease.split('.'))
}

/** The newest commit on `branch` whose signature GitHub verifies. */
export async function newestVerifiedBranchCommit(api: SourceApi, branch: string): Promise<SourceSelection | undefined> {
  for (let page = 1; page <= BRANCH_PAGE_LIMIT; page += 1) {
    const commits = await api.branchCommits(branch, page, BRANCH_PAGE_SIZE)
    const verified = commits.find((commit) => commit.verified)
    if (verified) {
      return {
        commit: verified.sha,
        ref: `refs/heads/${branch}`,
        committedAt: verified.committedAt,
        reason: `newest GitHub-verified commit on ${branch}`,
      }
    }
    if (commits.length < BRANCH_PAGE_SIZE) return undefined
  }
  return undefined
}

/** Resolves a tag to its commit, accepting it when GitHub verifies the tag's or the commit's signature. */
async function verifiedTag(api: SourceApi, tag: TagRef): Promise<SourceSelection | undefined> {
  let commitSha = tag.object.sha
  let tagVerified = false
  if (tag.object.type === 'tag') {
    const annotated = await api.annotatedTag(tag.object.sha)
    if (annotated.target.type !== 'commit') return undefined
    commitSha = annotated.target.sha
    tagVerified = annotated.verified
  } else if (tag.object.type !== 'commit') {
    return undefined
  }

  const commit = await api.commit(commitSha)
  if (!tagVerified && !commit.verified) return undefined
  return {
    commit: commit.sha,
    ref: `refs/tags/${tag.name}`,
    committedAt: commit.committedAt,
    reason: `release tag ${tag.name}`,
  }
}

/** The highest-versioned release tag matching `glob` whose tag or commit signature GitHub verifies. */
export async function newestVerifiedReleaseTag(api: SourceApi, glob: string): Promise<SourceSelection | undefined> {
  const prefix = glob.split('*')[0]
  const tags = (await api.tags(prefix))
    .filter((tag) => matchesRefGlob(tag.name, glob))
    .sort((a, b) => compareVersions(b.name, a.name))
  for (const tag of tags) {
    const selection = await verifiedTag(api, tag)
    if (selection) return selection
  }
  return undefined
}

/**
 * Chooses the commit the next refresh pins: the newer of the tracked branch's newest verified commit
 * and the newest verified release tag, or an explicitly requested tracked ref. A candidate that the
 * current pin already contains, or that is older than a diverged pin, leaves the pin unchanged.
 */
export async function selectIrohaSource(
  api: SourceApi,
  manifest: IrohaProvenance,
  requestedRef?: string,
): Promise<SelectionResult> {
  const { track, commit: previous } = manifest.source
  let candidates: Array<SourceSelection | undefined>

  if (requestedRef) {
    const branch = requestedRef.replace(/^refs\/heads\//u, '')
    const tag = requestedRef.replace(/^refs\/tags\//u, '')
    if (!requestedRef.startsWith('refs/tags/') && branch === track.branch) {
      candidates = [await newestVerifiedBranchCommit(api, track.branch)]
    } else if (!requestedRef.startsWith('refs/heads/') && matchesRefGlob(tag, track.release_tags)) {
      const matching = (await api.tags(tag)).find((candidate) => candidate.name === tag)
      if (!matching) throw new Error(`Iroha tag ${tag} does not exist`)
      candidates = [await verifiedTag(api, matching)]
      if (!candidates[0]) throw new Error(`Iroha tag ${tag} has no GitHub-verified tag or commit signature`)
    } else {
      throw new Error(
        `Requested ref ${requestedRef} is neither the tracked branch ${track.branch} nor a ${track.release_tags} release tag`,
      )
    }
  } else {
    candidates = [
      await newestVerifiedBranchCommit(api, track.branch),
      await newestVerifiedReleaseTag(api, track.release_tags),
    ]
  }

  const available = candidates.filter((candidate): candidate is SourceSelection => candidate !== undefined)
  if (available.length === 0) {
    return { changed: false, previous, reason: 'no GitHub-verified candidate commit was found' }
  }
  // Prefer the newest commit; on a tie, prefer the release tag (listed last).
  const selection = available.reduce((newest, candidate) =>
    Date.parse(candidate.committedAt) >= Date.parse(newest.committedAt) ? candidate : newest,
  )

  if (selection.commit === previous) {
    return { changed: false, previous, selection, reason: `already pinned to the ${selection.reason}` }
  }
  const relation = await api.compare(previous, selection.commit)
  if (relation === 'identical' || relation === 'behind') {
    return { changed: false, previous, selection, reason: `the ${selection.reason} is already contained in the pin` }
  }
  if (relation === 'diverged') {
    const pinned = await api.commit(previous)
    if (Date.parse(selection.committedAt) <= Date.parse(pinned.committedAt)) {
      return { changed: false, previous, selection, reason: `the ${selection.reason} is older than the diverged pin` }
    }
  }
  return { changed: true, previous, selection, reason: selection.reason }
}

/**
 * Requires `commit` to carry a GitHub-verified signature (for a tag, the tag's signature also counts)
 * and to be reachable from `ref`: contained in the branch, or exactly the tagged commit.
 */
export async function verifyPinnedSource(api: SourceApi, commit: string, ref: string): Promise<void> {
  if (!COMMIT_PATTERN.test(commit)) throw new Error(`Pinned commit must be a full 40-character SHA: ${commit}`)
  const match = REF_PATTERN.exec(ref)
  if (!match) throw new Error(`Pinned ref must be refs/heads/<branch> or refs/tags/<tag>: ${ref}`)
  const [, kind, name] = match

  const resolved = await api.commit(commit)
  if (resolved.sha !== commit) throw new Error(`GitHub resolved ${commit} to ${resolved.sha}`)

  let signed = resolved.verified
  if (kind === 'tags') {
    const tag = (await api.tags(name)).find((candidate) => candidate.name === name)
    if (!tag) throw new Error(`Iroha tag ${name} does not exist`)
    if (tag.object.type === 'tag') signed ||= (await api.annotatedTag(tag.object.sha)).verified
  }
  if (!signed) throw new Error(`Iroha commit ${commit} has no signature that GitHub verifies`)

  const relation = await api.compare(commit, name)
  const reachable = relation === 'identical' || (kind === 'heads' && relation === 'ahead')
  if (!reachable) {
    throw new Error(
      kind === 'tags'
        ? `Iroha tag ${name} does not point at ${commit}`
        : `Iroha commit ${commit} is not reachable from ${ref}`,
    )
  }
}

function parseArguments(args: string[]) {
  let requestedRef: string | undefined
  let githubOutput: string | undefined
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]
    if (argument === '--ref') requestedRef = args[++index] || undefined
    else if (argument === '--github-output') githubOutput = args[++index]
    else
      throw new Error(`Unknown argument: ${argument}\nUsage: pnpm select:iroha [--ref <ref>] [--github-output <file>]`)
  }
  return { requestedRef, githubOutput }
}

async function main() {
  const { requestedRef, githubOutput } = parseArguments(process.argv.slice(2))
  const result = await selectIrohaSource(githubSourceApi(), await readProvenance(process.cwd()), requestedRef)
  console.log(JSON.stringify(result, null, 2))
  if (githubOutput) {
    const lines = [
      `changed=${result.changed}`,
      `previous=${result.previous}`,
      `reason=${result.reason}`,
      ...(result.selection
        ? [
            `commit=${result.selection.commit}`,
            `ref=${result.selection.ref}`,
            `committed_at=${result.selection.committedAt}`,
          ]
        : []),
    ]
    await appendFile(githubOutput, `${lines.join('\n')}\n`)
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  void main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
