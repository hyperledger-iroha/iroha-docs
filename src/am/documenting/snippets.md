---
translation_locale: am
translation_source: /documenting/snippets.md
translation_source_hash: 48d6670f100c7c6368fa03f163c9ff9e0322d36e51c22f89562b23b0e2ee2a2f
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# የኮድ ቅንጥቦች {#code-snippets}

የመነጩ ቅንጥቦች ምሳሌዎችን ካመነጫቸው የ Iroha ክለሳ ኮድ፣ ውቅር እና ስኪማዎች ጋር እንደተያያዙ ያቆያሉ።

## መንፈስን የሚያድስ Iroha አርቲፋክቶች {#refreshing-iroha-artifacts}

መደበኛ የጣቢያ ግንባታዎች የአውታረ መረብ መዳረሻ ወይም የወንድም ወይም እህት ማከማቻ እንዳያስፈልጋቸው Iroha የተገኙ ቅንጥቦች ተመዝግበዋል።. በግልፅ ያድሷቸው -

```bash
pnpm refresh:iroha --source /path/to/iroha
```

የተመዘገበው `etc/refresh-iroha.ts` የስራ ሂደት የንፁህ ምንጭ ፍተሻውን ከ`provenance/iroha.json` ጋር ያረጋግጣል፣ `/src/snippets` እና Torii OpenAPI ነጥብ-በ-ጊዜ ውሂብ እይታን ያድሳል፣ እና SHA-256 ምስጠራ ሃሾችን ያዘምናል። ይዘቱን እና የምንጩ ለውጦችን አንድ ላይ ይገምግሙ። መደበኛ ጥገኝነት መጫን እና VitePress ግንባታዎች ተለዋዋጭ ቅርንጫፍ ሳያመጡ ተመዝግበው የገቡ ፋይሎችን ይጠቀማሉ።

## ቅንጥቦችን ጨምሮ {#including-snippets}

የመነጨ ወይም የአካባቢ ምንጭን ለማካተት [VitePress ኮድ-ቅንጭብ አገባብ](https://vitepress.dev/guide/markdown#import-code-snippets) ን ይጠቀሙ -

```md
<<< @/snippets/client.template.toml
```

የተሰየመ ኮድ ክልል የክልሉን ስም በማያያዝ ሊካተት ይችላል -

```md
<<< @/example_code/lorem.rs#ipsum
```

በእጅ የተጻፉ ምሳሌዎችን ትንሽ ያድርጉት። ለህዝብ በይነገጾች፣ ለማዋቀሪያ አብነቶች፣ ለተፈጠሩ መርሃግብሮች እና ለትዕዛዝ ውፅዓት የታደሱ የምንጭ አርቲፋክቶችን ይምረጡ።
