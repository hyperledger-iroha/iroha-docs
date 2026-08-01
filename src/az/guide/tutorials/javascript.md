---
translation_locale: az
translation_source: /guide/tutorials/javascript.md
translation_source_hash: feddadb1b50c5cc8beea188fd7053eeaae58d6ab9203687e9a1378f203229168
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# JavaScript və TypeScript {#javascript-and-typescript}

Gündəlik JavaScript SDK Bu `@iroha/iroha-js` paketin tərkibində Iroha Mənbə ağacı. Node.js- Birincisi. SDK üçün Torii, Norito qurucuları, imzalama, səhifələşdirmə, Connect previews və Kagemusha komandanın nəqliyyatı.

## Mənbədən tikin {#build-from-source}

Paket hazırda ictimai npm qeydiyyatdan mövcud deyil. Onu hədəflədiyiniz düyün kimi eyni bağlanmış Iroha mənbə dəyişikliyi ilə qurun:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

Yerli quruluş `cargo build -p iroha_js_host` əhatə edir və SDK başlanğıcında istifadə olunan platformanın xüsusi yoxlama sumasını qeyd edir. Mənbə qurmaq yerləri ki, təsdiq olunmuş host `native/`. Yalnız məqsədəuyğun olaraq ayrı qurulmuş, yoxlama miqdarı təsdiqlənmiş host təmin edərkən `IROHA_JS_NATIVE_DIR` müəyyənləşdirin. Paket yalnız ESM-dir; CommonJS -dən dinamik istifadə edin `import()`.

## Tez başlanğıc {#quickstart}

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { generateKeyPair } from "@iroha/iroha-js/crypto";

const torii = new ToriiClient("http://127.0.0.1:8080", {
  authToken: "dev-token",
});

const keys = generateKeyPair();
console.log(keys.publicKey);
```

## Taira Yalnız oxumaq üçün cəhd edin {#try-taira-read-only}

İstifadə olunmuş `fetch` ilə Node.js 24 sondaya Taira imzalanmadan əvvəl və Norito əməliyyat kodu:

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

`taira-readonly.mjs` kimi saxlayın, sonra çalışdırın:

```bash
node taira-readonly.mjs
```

Bu yalnız oxunma yoxlamaları işlədikdən sonra imzalanmış SDK zənglərə keçin. İctimai Taira müvəqqəti olaraq doymuş bir sıra və ya qapı xətalarını geri qaytara bilər, buna görə canlı şəbəkə testlərini CI seçmək üçün saxlayın.

Fəaliyyətli alt yol idxalları:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

Yalnız brauzer üçün Connect bootstrap üçün Node-first `ToriiClient` səthini idxal etmək yerinə `@iroha/iroha-js/connect-browser` istifadə edin.

## Native Escrow {#native-escrow}

JavaScript və TypeScript tətbiqlər yerli escrow vasitəsilə istifadə edə bilər Kotodama Müqavilələrin icrası. `@iroha/iroha-js/kotodama-compiler`; birbaşa yerli escrow əməliyyatı qurucuları hazırda JavaScript SDK. Baxın. [Dövlət vəsaitinin kreditləşdirilməsi](/az/blockchain/escrow.md#javascript-and-typescript-kotodama) "Eskrow host call" nümunəsində.

## Hal-hazırda mövcud olan əhatə {#current-coverage}

SDK aşağıdakılara diqqət yetirir:

- Torii HTTP və WebSocket köməkçilər
- Norito əməliyyat və təlimat qurucuları
- Kotodama kompilyasiyası, o cümlədən "escrow host-call builtins"
- Ed25519 imzalanma və açar nəsli
- səhifə açma və yenidən sınama köməkçiləri
- Browser bootstrap köməkçilərini bağlayın
- Kagemusha hazırlığı, dolandırılması, ödəniş və əməliyyat statusu olan nəqliyyat köməkçiləri

## Əvvəlki istinadlar {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
