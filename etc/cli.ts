import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { scanAndReport } from './validate-links'
import { scanBuiltLocalesAndReport } from './validate-locales-build'

yargs(hideBin(process.argv))
  .command(
    'validate-links <root>',
    'Parses HTML output of VitePress and detects broken links',
    (y) =>
      y
        .positional('root', { description: "Root directory of VitePress's output", type: 'string', demandOption: true })
        .option('public-path', { description: 'Public path, used in the links', default: null, type: 'string' }),
    async (opts) => {
      await scanAndReport({
        root: opts.root,
        publicPath: opts.publicPath ?? undefined,
      })
    },
  )
  .command(
    'validate-locales <root>',
    'Verifies built locale roots and the language selector',
    (y) =>
      y
        .positional('root', { description: "Root directory of VitePress's output", type: 'string', demandOption: true })
        .option('public-path', { description: 'Public path used in locale links', default: '/', type: 'string' })
        .option('revision', { description: 'Expected deployment revision', default: null, type: 'string' }),
    async (opts) => {
      await scanBuiltLocalesAndReport({
        root: opts.root,
        publicPath: opts.publicPath,
        revision: opts.revision ?? process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GITHUB_SHA,
      })
    },
  )
  .showHelpOnFail(false)
  .parse()
