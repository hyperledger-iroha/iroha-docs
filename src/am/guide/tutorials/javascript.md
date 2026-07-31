---
translation_locale: am
translation_source: /guide/tutorials/javascript.md
translation_source_hash: feddadb1b50c5cc8beea188fd7053eeaae58d6ab9203687e9a1378f203229168
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# JavaScript እና TypeScript {#javascript-and-typescript}

የአሁኑ JavaScript SDK ነው `@iroha/iroha-js` በፓኬት ውስጥ Iroha
ምንጭ ዛፍ. Node.js-በመጀመሪያ SDK ለ Torii, Norito ገንቢዎች፣ ፊርማ፣
ገጾች፣ የግንኙነት ቅድመ እይታዎች እና የካጌሙሻ ትዕዛዝ ትራንስፖርት።

## ምንጭህን በመመርኮዝ ሥራ {#build-from-source}

ፓኬጁ በአሁኑ ጊዜ ለሕዝብ አይገኝም npm መዝገብ ይገንቡት
ከዚሁ የተጣራ Iroha እንደ ዒላማ ያደረጋችሁት አገናኝ ምንጭ ማሻሻያ:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

የአገሬው ተወላጅ የተሠራ `cargo build -p iroha_js_host` እና መዝገብ
በፕላትፎርሙ ላይ ጥቅም ላይ የዋለው የመቆጣጠሪያ መጠን SDK የመነሻው ቦታዎች ይገነባሉ
የተረጋገጠ አስተናጋጅ `native/`. ስብስብ `IROHA_JS_NATIVE_DIR` ሆን ተብሎ ሲደረግ ብቻ
በተናጠል የተገነባ ፣ በቼክ አኃዝ የተረጋገጠ አስተናጋጅ ማቅረብ። ESM- ብቻ;
ከ CommonJS, አጠቃቀም ተለዋዋጭ `import()`.

## ፈጣን ጅምር {#quickstart}

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { generateKeyPair } from "@iroha/iroha-js/crypto";

const torii = new ToriiClient("http://127.0.0.1:8080", {
  authToken: "dev-token",
});

const keys = generateKeyPair();
console.log(keys.publicKey);
```

## ይሞክሩ Taira የንባብ ብቻ {#try-taira-read-only}

አብሮ የተሰራ አጠቃቀም `fetch` ውስጥ Node.js 24 ለምርመራ Taira ፊርማ ከመጨመርዎ በፊት እና
Norito የግብይት ኮድ:

```js
const root = "https://taira.sora.org";

const status = await fetch(`${root}/status`).then((res) => res.json());
console.log({
  blocks: status.blocks,
  queueSize: status.queue_size,
  peers: status.peers,
});

const domains = await fetch(`${root}/v1/domains?limit=5`).then((res) =>
  res.json(),
);
console.log(domains.items.map((domain) => domain.id));

const assets = await fetch(`${root}/v1/assets/definitions?limit=5`).then((res) =>
  res.json(),
);
for (const asset of assets.items) {
  console.log(asset.id, asset.name, asset.total_quantity);
}
```

እንደ ማስቀመጥ `taira-readonly.mjs`, ከዚያም ይሂዱ:

```bash
node taira-readonly.mjs
```

ፊርማ ላይ ይሂዱ SDK እነዚህ የንባብ-ብቻ ቁጥሮች ከተሰሩ በኋላ ብቻ ይደውሉ። Taira
በጊዜያዊነት የተሞላ ረድፍ ወይም የጌትዌይ ስህተት መመለስ ይችላሉ, ስለዚህ ቀጥታ አውታረ መረብ ጠብቅ
የሙከራ ምርጫ CI.

ጠቃሚ ንዑስ-መንገድ አመጣጥ

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

ለአሳሽ-ብቻ Connect bootstrap መጠቀም `@iroha/iroha-js/connect-browser`
አንጓ-መጀመሪያን ከመምጣቱ ይልቅ `ToriiClient` ወለል.

## የአገር ውስጥ የዋስትና ገንዘብ {#native-escrow}

JavaScript እና TypeScript ማመልከቻዎች አማካኝነት የተፈጥሮ ኤስሮ መጠቀም ይችላሉ Kotodama
ኮንትራቶች.
`@iroha/iroha-js/kotodama-compiler`; ቀጥተኛ ተወላጅ ኤስኮር ግብይት ገንቢዎች
በአሁኑ ጊዜ በ JavaScript SDK. ተመልከት
[የአገር ውስጥ ንብረት ማስከበሪያ](/am/blockchain/escrow.md#javascript-and-typescript-kotodama)
ለኤስሮው አስተናጋጅ ጥሪ ምሳሌ።

## ወቅታዊ ሽፋን {#current-coverage}

የ SDK የሚከተሉትን ያተኩራል-

- Torii HTTP እና WebSocket ረዳቶች
- Norito የግብይት እና መመሪያ ገንቢዎች
- Kotodama የኤስሮው አስተናጋጅ ጥሪ ገንቢዎችን ጨምሮ ማጠናቀር
- Ed25519 ፊርማ እና ቁልፍ ትውልድ
- የገጽ ማጣቀሻ እና ዳግም ሙከራ ረዳቶች
- የአሳሽ ማስነሻ ረዳቶችን ያገናኙ
- ካጌሙሻ ዝግጁነት፣ ማሟያ፣ መመለስ እና የአሠራር ሁኔታ መጓጓዣ
  ረዳቶች

## የላይኛው መስመር ማጣቀሻዎች {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
