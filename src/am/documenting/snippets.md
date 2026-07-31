---
translation_locale: am
translation_source: /documenting/snippets.md
translation_source_hash: e188082e05db85d5e514b782f93648fb402a09740840c9201e47db353f2192f5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# የኮድ ቅንጥቦች {#code-snippets}

የተፈጠሩ ቁርጥራጮች ከተዘጋጁት Iroha ማሻሻያ ጋር ከኮድ ፣ ከመዋቅር እና ከሥርዓቶች ጋር የተገናኙ ምሳሌዎችን ይይዛሉ ።

## የአድማጭ Iroha ዕቃዎች {#refreshing-iroha-artifacts}

Iroha የተወሰዱ ቁርጥራጮች በተለመደው የጣቢያ ግንባታዎች ውስጥ ይመረመራሉ የአውታረ መረብ መዳረሻ ወይም የወንድማማች ማከማቻ አያስፈልጋቸውም ። በግልፅ ያድሱት:

```bash
pnpm refresh:iroha --source /path/to/iroha
```

የተመዘገቡት [`etc/refresh-iroha.ts`](https://github.com/hyperledger-iroha/iroha-docs/blob/main/etc/refresh-iroha.ts) የስራ ፍሰት ንፁህ ምንጭ ማረጋገጫን ከ `provenance/iroha.json`, ይለወጣል `/src/snippets` እና Torii OpenAPI ቅጽበታዊ ገጽ እይታ እና ዝማኔዎች SHA-256 ሃሽስ. ይዘቱን እና የመነሻ ለውጦችን አብረው ይመልከቱ. መደበኛ ጥገኛነት መጫን እና VitePress ገንቢዎች ተቀባይነት ያላቸውን ቅርንጫፎች ሳያገኙ የተቀናጀውን ፋይል ይበላሉ።

## ቁርጥራጮችን ጨምሮ {#including-snippets}

የተፈጠረውን ወይም አካባቢያዊ ምንጭ ለማካተት የ [VitePress ኮድ-ስኒፕት አገባብ ](https://vitepress.dev/guide/markdown#import-code-snippets) ይጠቀሙ:

```md
<<< @/snippets/client.template.toml
```

አንድ የተሰየመ ኮድ ክልል ከክልሉ ስም ጋር በመደመር ሊካተት ይችላል:

```md
<<< @/example_code/lorem.rs#ipsum
```

በእጅ የተጻፉትን ምሳሌዎች አነስተኛ ያድርጉ። ለሕዝብ በይነገጾች ፣ ለቅጥያ አብነቶች ፣ ለተፈጠሩ መርሃግብሮች እና ለትእዛዝ ውፅዓት የታደሱ ምንጭ ቅርፀቶችን ይመርጣሉ ።
