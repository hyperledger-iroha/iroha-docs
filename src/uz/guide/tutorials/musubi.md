---
translation_locale: uz
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 6b33c687fd1d81d931b932d38908d9a87e9c619e5aca5714d09d892160a6b704
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama Paketlar {#musubi-kotodama-packages}

Musubi Kotodama manba paketi uchun paket menejeri bo'lib xizmat qiladi. Bu ishlab chiquvchilarga yukga o'xshash ish oqimini taqdim etadi, u bilan birgalikda qo'shilishi mumkin bo'lgan Kotodama funksiyalarini baham ko'rish va global birinchi kelgan nomlar jadvali o'rniga SORA va Iroha nomlar maydonlariga bog'liq holda paket kimligini saqlash mumkin.

Agar kerak bo'lsa, Musubi dan foydalaning:

- qayta ishlatiladigan Kotodama manba kutubxonalarini nashr etish
- `Musubi.lock`da aniq o'tish manbalariga bog'liq bo'lgan belgilar
- tasdiqlangan SoraFS arxiv majburiyatlaridan bog'liqlik manbaini rekonstruksiya qilish
- paket nomlar maydonini xuddi shu nomlar maydosidagi dapp kontrakt aliaslariga ulash
- zanjir bo'yicha reyestr orqali paketlarni tekshirish, nashr etish, olib tashlash yoki boshqa nomlar bilan tanishish

## Toʻplam nomlari {#package-names}

Canonik paket identifikatorlaridan foydalanish:

```text
namespace/package
```

Toʻgʻri chiqarilgan maʼlumotlardan foydalanish:

```text
namespace/package@version
```

Nomlar maydonidan oldin `@` ko'rsatkichi yo'q. `@` ajratgichisi versiya sufiksi uchun qo'yiladi.

Nomlar maydonidagi segment Kotodama dapp shartnoma aliaslari tomonidan ishlatiladigan suffixga mos keladi:

|Xatchoʻp id |O ' zaro bog ' liq shartnoma alias shakli |
| ------------------------- | ---------------------------- |
|`universal/math` |`router::universal` |
|`dex.universal/swap-core` |`router::dex.universal` |

Ism maydonlari `<dataspace>` yoki `<domain>.<dataspace>` shakliga ega. Agar paketda dapp bog'lanishi bo'lsa, Musubi har bir bog'langan shartnoma aliasida paket bilan bir xil nom maydonining suffixidan foydalanilishini tekshiradi.

## Koʻrinadi {#manifest}

To'plam `Musubi.toml` bilan boshlanadi:

```toml
[package]
namespace = "dex.universal"
name = "swap-core"
version = "0.1.0"

[dependencies.math]
package = "std.universal/math"
version = "^1.0.0"

[exports]
functions = ["quote"]

[dapp]
namespace = "dex.universal"
contracts = ["router::dex.universal"]
```

Muvofiqliklarda aniq versiyalar, ehtiyotkorlik talablari, tilde talablari, `1.*` kabi wildcardlar yoki `>=1.0.0,<2.0.0` kabi taqqoslovchi ro'yxatlardan foydalanish mumkin.

`Musubi.lock` tanlangan o'zgaruvchan grafikni zanjirdagi reyestrdan qayd etadi. Har bir qulflangan nod uning kanonik paket ref, tanlangan talab, SoraFS manifest digest, manba arxiv hash, byt soni, fayl soni, eksport qilingan funktsiyalar, deterministik manba arxiv rejasi va bog'liqlik aliaslarini saqlaydi. Qisqa aliaslar qulf fayliga kirishdan oldin yechiladi.

## Mahalliy ish oqimi {#local-workflow}

Yuqori tomondan Iroha ish maydonining ildizidan, Musubi ni Cargo orqali yuriting:

```bash
cargo run -p musubi -- init --namespace dex.universal --name swap-core --dapp
cargo run -p musubi -- add std.universal/math --version '^1.0.0' --alias math
cargo run -p musubi -- install --config client.toml
cargo run -p musubi -- build src/lib.ko --manifest-out target/lib.contract.json
cargo run -p musubi -- pack \
  --car-out source.car \
  --sorafs-manifest-out manifest.norito \
  --source-plan-out source-plan.norito
```

`install --offline` dan foydalanib, to'g'ri versiya bog'liqliklari uchun hal qilinmagan qulf faylini yozing. CI da `install --locked`dan foydalanib, eskirgan qulf faylini rad etish uchun foydalaning.

`build` `math::add()` kabi qo'ng'iroqlarni deterministik ichki Kotodama funksiya nomlariga qayta yozish orqali saqlangan qaramlik manbalarini bog'laydi. Bu qaramlik eksport qilmagan funktsiyalarga qo'ngʻiroqlarni rad etadi. Musubi v1 kutubxonalari faqat funktsiyalarga ega: davlat deklaratsiyalarini, qo'zg'atuvchilarni, kotoba bloklarini, konstantalarni yoki boshqa funktsiya bo'lmagan shartnoma elementlarini o'z ichiga olgan bog'liqlik manbalari rad etiladi.

## Manbalarni olish arxivlari {#fetching-source-archives}

Musubi yo'q bo'lgan bog'liqlik manbalarini o'rnatishda yoki keyinchalik kecha kichik buyruqlar orqali olib kelishi mumkin:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --provider-payload math.payload

cargo run -p musubi -- cache import math --source-root ../math
cargo run -p musubi -- cache fetch math --provider-payload math.payload
```

To'g'ridan-to'g'ri darvozalarni olish uchun SoraFS darvoza provayderining bir yoki undan ortiq xususiyatlaridan foydalanish kerak:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --gateway-provider 'name=hot-a,provider-id=1111111111111111111111111111111111111111111111111111111111111111,base-url=https://gw.example,stream-token=BASE64,package=math'
```

Ma'muriyat provayderlarining fayllar va darvoza provayderlari bitta olish operatsiyasi uchun bir-birlarini istisno qiladilar. Agar bittadan ko'proq qulflangan paket yo'q bo'lsa, har bir darvoza providerini `package=<dependency-alias>`, `package=<namespace/package@version>`, `package=<namespace/package>` yoki `manifest=<64-hex SoraFS manifest digest>` bilan qamrab oling.

Eshik `base-url` va `privacy-url` qiymatlardan foydalanish kerak `https://` andoza. Mahalliy test darvozalari foydalanish mumkin `http://localhost`, `http://127.0.0.1`, yoki `http://[::1]` faqat `--gateway-allow-insecure-localhost`. Stream tokenlari ishga tushirish vaqti ma'lumotnomalar va yozilmaydi `Musubi.lock`.

## Nashr etish {#publishing}

`pack` deterministikni hisoblaydi BLAKE3-256 manba arxivini hash qo'shib, manba byti va faylni hisoblaydi. `--car-out`, `--sorafs-manifest-out`, yoki `--source-plan-out` ta'minlanadi, u ham deterministik quradi SoraFS CAR foydali yuk, SoraFS ko'rsatilgan; va Musubi bir xil manba fayllari to'plamidan manbali arxiv rejasi.

nashr etishdan oldin quruq oʻtishni ishlatish:

```bash
cargo run -p musubi -- publish --config client.toml --dry-run
```

Yo'q `--dry-run`, `publish` &amp; amp; oldindan koʻrsatilgan asarlar `.musubi/dist/<namespace>/<name>/<version>/`, ko'rsatkich va foydali yukni o'z ichiga oladi Torii Bu ... SoraFS saqlash pin oxirgi nuqtasi `--upload`, hosil bo ' lgan SoraFS pin, va taqdim etadi `PublishMusubiRelease` tahrirga qarang: Iroha mijoz.

Bo'lishgan nashrlarda quyidagilar bo'lishi kerak:

- bo'sh bo'lmagan kanonik manba arxivlari
- deterministik manba arxiv rejasi
- kamida bitta eksport qilingan Kotodama funksiyasi
- Chiqarilgan chiqindilarni tanlamaydigan bog'liqlik yozuvlari
- kontrakt nomlari paket nomi maydoniga mos keladigan, agar mavjud bo'lsa, dapp bog'i

## Ro'yxatdan o'tish va hayot davri {#registry-queries-and-lifecycle}

Reyestrni qidirib toping va tekshirib koʻring:

```bash
cargo run -p musubi -- search swap --config client.toml
cargo run -p musubi -- versions dex.universal/swap-core --config client.toml
cargo run -p musubi -- alias resolve swap --config client.toml
```

Yanking yangi rezolyutsiyadan chiqarishni yashiradi, ammo mavjud qulf fayllarini qayta tiklanishi mumkinligini saqlaydi:

```bash
cargo run -p musubi -- yank dex.universal/swap-core@0.1.0 \
  --reason "bad archive" \
  --config client.toml \
  --dry-run
```

Musubi `namespace/package` kanonik paket nomini qo'llab, global nomni o'tkazib yuborishdan qochadi. Nomlar maydonida nashr etish ushbu Kotodama dapp nomi maydonida ishlatiladigan bir xil mulkdorlik yoki vakolat berilgan ruxsatnoma modeli tomonidan tasdiqlangan bo'lishi kerak. Ko'rsatilgan global qisqa aliaslar paketga egalik qilishdan ajralib turadi: `SetMusubiShortAlias` uchun `CanSetMusubiShortAlias` ruxsatnomasi kerak va maqsadli paketda allaqachon kamida bitta faol nashr bo'lishi kerak.

## Iroha Yuzlar {#iroha-surfaces}

Musubi birinchi sinfdagi Iroha ko'rsatmalar va so'rovlarni ishlatadi:

|Yer yuzi |Maqsad|
| ---------------------------- | -------------------------------------------------- |
|`PublishMusubiRelease` |Oʻzgarmas paketni nashr eting. |
|`YankMusubiRelease` |mavjud bo'lgan chiqindilarni olib tashlangan deb belgilang.|
|`SetMusubiShortAlias` |Qisqa global aliasni paket identifikatoriga bogʻlash. |
|`AssertMusubiReleaseExists` |Konkret paket versiyasi mavjud bo'lishi kerak. |
|`FindMusubiReleaseByRef` |To'g'ri paket ma'lumotnomasi bo'yicha ruxsatnoma oling. |
|`FindMusubiPackageVersions` |Toʻplam identifikatorining versiyalarini roʻyxatdan oʻtkazing. |
|`FindMusubiPackageReleases` |Toʻplamning toʻliq roʻyxatini koʻrsatish. |
|`SearchMusubiPackages` |Xatchoʻplarni nomlar va matn boʻyicha qidirish. |
|`FindMusubiShortAliasByName` |Qisqa aliasni hal qiling. |

Torii koʻrsatkichlar Musubi HTTP yo'nalish oilasi `/v1/musubi/`. Agentga qaraydi MCP asboblar quyidagicha aniqlanadi: `iroha.musubi.` nomlar. Ko'ring [Torii oxirgi nuqtalar](/uz/reference/torii-endpoints.md) va [soʻrov maʼlumotlari](/uz/reference/queries.md) kengligi uchun API Xaritasi.
