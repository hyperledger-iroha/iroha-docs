---
translation_locale: am
translation_source: /documenting/snippets.md
translation_source_hash: e188082e05db85d5e514b782f93648fb402a09740840c9201e47db353f2192f5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# የኮድ ቁርጥራጮች {#code-snippets}

የተፈጠሩ ቁርጥራጮች ምሳሌዎችን ከኮድ, ውቅር እና ስኬሞች ጋር ይገናኛሉ
የ Iroha እነዚህ ሰዎች የተፈጠሩበት ለውጥ ነው።

## የሚያድስ Iroha የእጅ ዕቃዎች {#refreshing-iroha-artifacts}

Iroha-የተመነጩ ቁርጥራጮች እንዲሁ የተለመዱ የጣቢያ ግንባታዎች አያስፈልጋቸውም
የአውታረ መረብ መዳረሻ ወይም ወንድማማች ማህደር።

```bash
pnpm refresh:iroha --source /path/to/iroha
```

ተመዝግበው የነበሩት
[`etc/refresh-iroha.ts`](https://github.com/hyperledger-iroha/iroha-docs/blob/main/etc/refresh-iroha.ts)
የስራ ፍሰት ከንጹህ ምንጭ ጋር የተያያዘውን ማረጋገጫ ያረጋግጣል `provenance/iroha.json`,
ይለወጣል `/src/snippets` እና Torii OpenAPI ቅጽበታዊ ገጽ እይታ እና ዝማኔዎች SHA-256
ሃሽስ. ይዘቱን እና የመነሻ ለውጦችን አብረው ይመልከቱ. መደበኛ ጥገኛነት
መጫን እና VitePress Builds ያለምንም ውስጥ የተረጋገጡ ፋይሎችን ይበላሉ
የሚቀይር ቅርንጫፍ እየመጣሁ ነው።

## ስኒፕቶችን ጨምሮ {#including-snippets}

ይጠቀሙ
[VitePress የኮድ ቅንጥብ አገባብ](https://vitepress.dev/guide/markdown#import-code-snippets)
የተፈጠረ ወይም አካባቢያዊ ምንጭን ለማካተት:

```md
<<< @/snippets/client.template.toml
```

አንድ የተሰየመ ኮድ ክልል የክልሉ ስሙን በማከል ሊካተት ይችላል-

```md
<<< @/example_code/lorem.rs#ipsum
```

በእጅ የተጻፉትን ምሳሌዎች አነስተኛ አድርጉ።
በይነገጾች፣ የቅንብሮች አብነቶች፣ የተፈጠሩ መርሃግብሮች እና የትእዛዝ ውፅዓት።
