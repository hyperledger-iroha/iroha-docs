import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { scanAndReport } from './validate-links'

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
  .showHelpOnFail(false)
  .parse()
