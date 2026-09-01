---
translation_locale: am
translation_source: /guide/tutorials/javascript.md
translation_source_hash: d12c715de68623a7dd671e4f2f91b93dbe9fdee42ed51e3a25fbad2a9b69ca8e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# JavaScript እና TypeScript {#javascript-and-typescript}

የአሁኑ JavaScript SDK በ Iroha ምንጭ ዛፍ ውስጥ ያለው `@iroha/iroha-js` ጥቅል ነው። ለ Torii፣ Norito ግንበኞች፣ ፊርማ፣ ገጽ ማድረግ፣ ቅድመ እይታዎችን ያገናኙ እና የካጌሙሻ ትዕዛዝ መጓጓዣ Node.js-የመጀመሪያው SDK ነው።

## ከምንጩ ይገንቡ {#build-from-source}

ጥቅሉ በአሁኑ ጊዜ በሕዝባዊው npm መዝገብ አይገኝም። ያነጣጠሩት ኖድ ከተገነባበት ተመሳሳይ ቋሚ የ Iroha ምንጭ ክለሳ ይገንቡት፦

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

ቤተኛ ግንባታው `cargo build -p iroha_js_host` ይጠቀለላል እና በ SDK ጅምር ላይ ጥቅም ላይ የዋለውን መድረክ-ተኮር ቼክ ድምር ይመዘግባል። ምንጩ በ`native/` ውስጥ አስተናጋጅ ያረጋገጠ ቦታዎችን ይገነባል። `IROHA_JS_NATIVE_DIR`ን ሆን ተብሎ በተናጠል የተገነባ፣ በቼክሰም የተረጋገጠ አስተናጋጅ ሲያቀርቡ ብቻ ያዘጋጁ። ጥቅሉ ESM-ብቻ ነው; ከ CommonJS፣ ተለዋዋጭ `import()` ይጠቀሙ።

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

## ይሞክሩ Taira ተነባቢ-ብቻ {#try-taira-read-only}

ፊርማ እና Norito የግብይት ኮድ ከማከልዎ በፊት Taira ን ለመመርመር በ Node.js 24 ውስጥ አብሮ የተሰራ `fetch` ይጠቀሙ -

```js
const root = "https://taira.sora.org";

const status = await fetch(`${root}/status`, {
  headers: { Accept: "application/json" },
}).then((res) => res.json());
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

እንደ `taira-readonly.mjs` አስቀምጡት እና ከዚያ ያሂዱት

```bash
node taira-readonly.mjs
```

ወደ የተፈረመ SDK ቴክኒካል ጥሪዎች ይሂዱ እነዚህ ተነባቢ-ብቻ ቼኮች ከሰሩ በኋላ ብቻ ነው። ይፋዊ Taira ለጊዜው የተሞላ ወረፋ ወይም የመግቢያ ስህተት ሊመልስ ይችላል፣ ስለዚህ የቀጥታ አውታረ መረብ ሙከራዎችን በ CI ውስጥ መርጠው እንዲገቡ ያድርጉ።

ጠቃሚ የንዑስ መንገድ ማስመጣት -

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

ለአሳሽ-ብቻ የግንኙነት ቡት ማሰሪያ፣ የኖድ መጀመሪያ `ToriiClient` ገጽን ከማስመጣት ይልቅ `@iroha/iroha-js/connect-browser` ይጠቀሙ።

## ቤተኛ Escrow {#native-escrow}

JavaScript እና TypeScript መተግበሪያዎች ቤተኛ escrow በ Kotodama ኮንትራቶች መጠቀም ይችላሉ። የ escrow አስተናጋጅ-ተግባር ጥሪዎችን በ `@iroha/iroha-js/kotodama-compiler` ያጠናቅሩ; ቀጥታ ቤተኛ የዋስትና ግብይት ግንበኞች በአሁኑ ጊዜ በ JavaScript SDK አይጋለጡም። ለ escrow አስተናጋጅ-ቴክኒካል ጥሪ ምሳሌ [ቤተኛ ንብረት Escrow](/am/blockchain/escrow.md#javascript-and-typescript-kotodama) ይመልከቱ።

## የአሁኑ ሽፋን {#current-coverage}

SDK በሚከተሉት ላይ ያተኩራል -

- Torii HTTP እና WebSocket ረዳቶች
- Norito የግብይት እና መመሪያ ገንቢዎች
- Kotodama ማጠናቀር፣ የ escrow አስተናጋጅ-ቴክኒካል ጥሪ አብሮገነቦችን ጨምሮ
- Ed25519 ፊርማ እና ቁልፍ ማመንጨት
- Pagination እና እንደገና ይሞክሩ ረዳቶች
- የአሳሽ ማስነሻ ረዳቶችን ያገናኙ
- የካጌሙሻ ዝግጁነት፣ መሙላት፣ መቤዠት እና የአሠራር ሁኔታ የትራንስፖርት ረዳቶች

## የላይኛው ማጣቀሻዎች {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
