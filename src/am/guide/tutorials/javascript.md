---
translation_locale: am
translation_source: /guide/tutorials/javascript.md
translation_source_hash: d12c715de68623a7dd671e4f2f91b93dbe9fdee42ed51e3a25fbad2a9b69ca8e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# JavaScript እና TypeScript {#javascript-and-typescript}

የአሁኑ JavaScript SDK ነው `@iroha/iroha-js` ጥቅል ውስጥ Iroha ምንጭ ዛፍ. Node.js-በመጀመሪያ SDK ለ Torii, Norito ገንቢዎች, ፊርማ, pagination, አገናኝ ቅድመ እይታዎች, እና Kagemusha ትዕዛዝ ትራንስፖርት.

## ምንጭህን በመመርኮዝ መገንባት {#build-from-source}

ፓኬጁ በአሁኑ ጊዜ ከህዝብ npm መዝገብ ውስጥ አይገኝም. ከተመደቡት አገናኝ ጋር ተመሳሳይ የተጣራ Iroha ምንጭ ማሻሻያ ይገንቡ:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

የተፈጥሮ መገንባት `cargo build -p iroha_js_host` ይሸፍናል እና በ SDK ጅምር ላይ ጥቅም ላይ የዋለውን የመሣሪያ ስርዓት-ተኮር ቼክ አኃዝ ይመዘግባል። ምንጭ መገንባት በ `native/` ውስጥ አስተናጋጅ ያረጋገጡ ቦታዎችን ያስቀምጣል ። `IROHA_JS_NATIVE_DIR` በግለሰብ ደረጃ የተገነባ ፣ የቁጥር መጠን-የተረጋገጠ አስተናጋጅ ሆን ተብሎ በሚሰጥበት ጊዜ ብቻ ያዘጋጁ። ጥቅሉ ESM - ብቻ ነው; ከ CommonJS ጀምሮ ተለዋዋጭ `import()` ይጠቀሙ።

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

## Taira ንባብ ብቻ ይሞክሩ {#try-taira-read-only}

ፊርማ እና Norito የግብይት ኮድ ከመጨመርዎ በፊት Taira ን ለመፈተሽ በ Node.js 24 ውስጥ አብሮ የተሰራውን `fetch` ይጠቀሙ:

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

`taira-readonly.mjs` አድርገው ያስቀምጡት፤ ከዚያም ይሂዱት።

```bash
node taira-readonly.mjs
```

SDK ከተፈረሙ ጥሪዎች ላይ ለመንቀሳቀስ እነዚህ የንባብ-ብቻ ምርመራዎች ከሠሩ በኋላ ብቻ ነው. የህዝብ Taira በጊዜያዊነት የተሞላ ረድፍ ወይም የጌትዌይ ስህተት ሊመልስ ይችላል ፣ ስለሆነም የቀጥታ አውታረመረብ ሙከራዎችን በ CI ውስጥ ይምረጡ።

ጠቃሚ ንዑስ-መንገድ ግዥዎች:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

ለአሳሽ-ብቻ Connect bootstrap የ Node-first `ToriiClient` ገጽን ከመግዛት ይልቅ `@iroha/iroha-js/connect-browser` ይጠቀሙ።

## የአገር ውስጥ ኤስኮር {#native-escrow}

JavaScript እና TypeScript አፕሊኬሽኖች አማካይነት የተፈጥሮ ኤስሮ መጠቀም ይችላሉ Kotodama ኮንትራቶች. `@iroha/iroha-js/kotodama-compiler`; በቀጥታ ተወላጅ የኤስኮር ግብይቶች ገንቢዎች በአሁኑ ወቅት በ JavaScript SDK. ተመልከት [የአገር ውስጥ ንብረት ማስከበሪያ](/am/blockchain/escrow.md#javascript-and-typescript-kotodama) ለኤስሮው አስተናጋጅ ጥሪ ምሳሌ።

## ወቅታዊ ሽፋን {#current-coverage}

SDK የሚከተሉትን ያተኩራል፦

- Torii HTTP እና WebSocket ረዳት
- Norito የግብይት እና መመሪያ ገንቢዎች
- Kotodama ማጠናከሪያ፣ የኤስኮር አስተናጋጅ ጥሪ ገንቢዎችን ጨምሮ
- Ed25519 ፊርማ እና ቁልፍ ትውልድ
- የገጽ ማጣሪያ እና ዳግም ሙከራ ረዳቶች
- የአሳሽ ማስነሻ ረዳቶችን ያገናኙ
- የካጌሙሻ ዝግጁነት፣ ማሟያ፣ የመልቀቂያ እና የአሠራር ሁኔታ የትራንስፖርት ረዳቶች

## የላይኛው መስመር ማጣቀሻዎች {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
