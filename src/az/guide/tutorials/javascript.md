---
translation_locale: az
translation_source: /guide/tutorials/javascript.md
translation_source_hash: d12c715de68623a7dd671e4f2f91b93dbe9fdee42ed51e3a25fbad2a9b69ca8e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# JavaScript və TypeScript {#javascript-and-typescript}

Cari JavaScript SDK Iroha mənbə ağacında `@iroha/iroha-js` paketidir. Bu, Torii, Norito qurucular, imzalama, səhifələmə, Connect önizləmələri və Kagemusha əmr daşınması üçün Node.js-ilk SDK-dir.

## Mənbədən Qur {#build-from-source}

Paket hazırda ictimai npm qeydiyyatdan mövcud deyil. Hədəf aldığınız node ilə eyni pin edilmiş Iroha mənbə reviziyasından onu qurun:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

Yerli bina `cargo build -p iroha_js_host`-i əhatə edir və SDK başlanğıcında istifadə olunan platforma-spesifik yoxlama cəmini qeyd edir. Mənbə bina həmin təsdiqlənmiş hostu `native/`-də yerləşdirir. Yalnız ayrıca qurulmuş, yoxlanılmış host təmin edərkən `IROHA_JS_NATIVE_DIR` təyin edin. Paket yalnız ESM-dır; CommonJS-dən dinamik `import()` istifadə edin.

## Tez Başlanğıc {#quickstart}

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { generateKeyPair } from "@iroha/iroha-js/crypto";

const torii = new ToriiClient("http://127.0.0.1:8080", {
  authToken: "dev-token",
});

const keys = generateKeyPair();
console.log(keys.publicKey);
```

## Sına Taira Yalnız Oxuma {#try-taira-read-only}

İmzalama və Norito əməliyyat kodunu əlavə etmədən əvvəl Node.js 24-də daxili `fetch`-dan Taira-ni yoxlamaq üçün istifadə edin:

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

Onu `taira-readonly.mjs` kimi yadda saxlayın, sonra işlədin:

```bash
node taira-readonly.mjs
```

Yalnız bu yalnız-oxu yoxlamaları işləndikdən sonra imzalı SDK texniki çağırışlara keçin. İctimai Taira müvəqqəti olaraq doyma növbəsi və ya şlüz xətası verə bilər, buna görə canlı şəbəkə testlərini CI-də seçim əsasında saxlayın.

Faydalı altyol idxalları:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

Yalnız brauzer üçün Connect bootstrap istifadə etmək üçün Node-ə öncədən `ToriiClient` səthi idxal etmək əvəzinə `@iroha/iroha-js/connect-browser`-dan istifadə edin.

## Yerli Etibarnamə {#native-escrow}

JavaScript və TypeScript tətbiqləri Kotodama müqavilələri vasitəsilə yerli etibar saxlamasından istifadə edə bilər. Etibar host-funksiyası çağırışlarını `@iroha/iroha-js/kotodama-compiler` ilə tərtib edin; birbaşa yerli depozit əməliyyatı qurucuları hazırda JavaScript SDK tərəfindən açıq deyil. Depozit host-texniki çağırış nümunəsi üçün [Yerli Aktiv Əmanət](/az/blockchain/escrow.md#javascript-and-typescript-kotodama)-ə baxın.

## Cari Əhatə {#current-coverage}

SDK aşağıdakılara diqqət yetirir:

- Torii HTTP və WebSocket köməkçilər
- Norito əməliyyat və təlimat qurucuları
- Kotodama yığımı, daxil olmaqla eskro idarəçisi-texniki çağırış daxili funksiyaları
- Ed25519 imzalama və açar yaradılması
- səhifələmə və təkrar köməkçiləri
- Brauzer başlanğıc köməkçilərini qoşun
- Kagemusha hazırlığı, doldurma, geri ödəmə və əməliyyat-statusu nəqliyyat köməkçiləri

## Yuxarı Axın İstinadları {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
