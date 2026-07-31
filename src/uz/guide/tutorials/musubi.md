---
translation_locale: uz
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 6b33c687fd1d81d931b932d38908d9a87e9c619e5aca5714d09d892160a6b704
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama Paketlar {#musubi-kotodama-packages}

Musubi uchun paket menejeri hisoblanadi Kotodama manba paketlari.
ishlab chiquvchilar yukga o'xshash ish oqimini Kotodama funksiyalari
to'plamning kimligini SORA va Iroha nom maydonlari oʻrniga
global birinchi kelgan nomlar jadvali.

Foydalanish Musubi agar kerak bo'lsa:

- qayta ishlatilishi mumkin Kotodama manba kutubxonalari
- to'g'ri o'tish manbalariga bog'liq bo'lgan `Musubi.lock`
- ta'sir manbaini tekshirishdan rekonstruksiya qilish SoraFS arxiv majburiyatlari
- paket nomlar maydonini xuddi shu dapp kontrakt aliaslariga ulash
  nomlar maydonlari
- zanjirdagi reyestr orqali paketlarni tekshirish, nashr etish, olib tashlash yoki boshqa nomlarga ega bo'lish

## Toʻplam nomlari {#package-names}

Canonik paket identifikatorlaridan foydalanish:

```text
namespace/package
```

Toʻgʻri chiqarib tashlash maʼlumotlaridan foydalanish:

```text
namespace/package@version
```

Yoʻlboshchi yoʻq `@` nomlar maydonidan oldin. `@` ajratgich qo ' yilgan
versiyasi suffix uchun.

Nomlar maydonining segmentlari tomonidan ishlatiladigan sufiksga mos keladi Kotodama Dapp shartnomasi
nomlar:

| Xatchoʻp identifikatori                | O'zaro bog'liq shartnoma alias shakli |
| ------------------------- | ---------------------------- |
| `universal/math`          | `router::universal`          |
| `dex.universal/swap-core` | `router::dex.universal`      |

Nomlar maydonlari `<dataspace>` yoki `<domain>.<dataspace>` shakli.
paketda Dapp bog'i mavjud, Musubi har bir bog'langan shartnoma aliasini tekshiradi
paket bilan bir xil nomlar maydonidagi so'zlarni ishlatadi.

## Koʻrinadi {#manifest}

Paket quyidagicha boshlanadi: `Musubi.toml`:

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

Bo'rinishlarda aniq versiyalar, ehtiyotkorlik talablari, tilde foydalanish mumkin
talablar, yovvoyi kartalar: `1.*`, yoki qiyosiy ro'yxatlar, masalan:
`>=1.0.0,<2.0.0`.

`Musubi.lock` tanlangan transitiv grafikni zanjirdan yozib oladi
Registr. Har bir qulflangan nod o'z kanonik paketni saqlaydi, tanlangan
talab, SoraFS manifest digest, manba arxivining hash, baytlar soni, fayl
hisob, eksport qilingan funksiyalar, deterministik manba arxiv rejasi va
qisqa aliaslar o'z ichiga kirishdan oldin hal qilinadi
Qopish fayli.

## Mahalliy ish oqimi {#local-workflow}

Oʻsimlikdan Iroha ish maydonining tugmasi, ishga tushirish Musubi yuk orqali:

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

Foydalanish `install --offline` aniq versiya uchun hal qilinmagan qulf faylini yozish
bog'liqliklarni noddan so'rashsiz ishlatish `install --locked` yo'nalishi CI to
o'tkazib yuborilgan qulf faylini rad eting.

`build` qoʻshimcha qoʻngʻiroqlarni qayta yozish orqali saqlangan qaramlik manbalarini bogʻlaydi:
`math::add()` deterministik ichki Kotodama funksiya nomlari.
bog'liqlik eksport qilmagan funksiyalarga qo'ng'iroqlar. Musubi v1 kutubxonalar
faqat funksiyalarga ega: davlat deklaratsiyalarini o'z ichiga olgan bog'liqlik manbalari;
qo'zg'atgichlar, kotoba bloklari, konstantalar yoki boshqa funktsiya bo'lmagan kontrakt elementlari
rad etiladi.

## Manbalarni olib kelish {#fetching-source-archives}

Musubi Yechishda yoki keyinchalik yo'qolgan bog'liqlik manbalarini olib kelishi mumkin
oldindan saqlanuvchi kichik buyruqlar orqali:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --provider-payload math.payload

cargo run -p musubi -- cache import math --source-root ../math
cargo run -p musubi -- cache fetch math --provider-payload math.payload
```

Toʻgʻridan-toʻgʻri kirish darvozalari bir yoki undan koʻpdan foydalanadi SoraFS Gateway provayderining moslamalari:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --gateway-provider 'name=hot-a,provider-id=1111111111111111111111111111111111111111111111111111111111111111,base-url=https://gw.example,stream-token=BASE64,package=math'
```

Provayderning fayllari va darvoza provayderlari bir-biriga nisbatan mutasaddi
Agar birdan ko'proq qulflangan paket yo'q bo'lsa, har
kirish portasi provayderlari `package=<dependency-alias>`,
`package=<namespace/package@version>`, `package=<namespace/package>`, yoki
`manifest=<64-hex SoraFS manifest digest>`.

Eshik `base-url` va `privacy-url` qiymatlardan foydalanish kerak `https://` andoza ravishda.
Mahalliy sinov darvozalaridan foydalanish mumkin `http://localhost`, `http://127.0.0.1`, yoki
`http://[::1]` faqat `--gateway-allow-insecure-localhost`. Oʻsimlik
tokenlar ish vaqti ma'lumotnomalari bo'lib , `Musubi.lock`.

## Nashr etish {#publishing}

`pack` deterministikni hisoblaydi BLAKE3-256 manba arxiv hash qoʻshimcha
manba byti va fayl sonlari. `--car-out`, `--sorafs-manifest-out`, yoki
`--source-plan-out` ta'minlanadi, u ham deterministik SoraFS
CAR foydali yuk, SoraFS ko'rsatilgan; Musubi manba arxiv rejasi
manba fayllari to'plami.

nashr etishdan oldin quruq oʻtish:

```bash
cargo run -p musubi -- publish --config client.toml --dry-run
```

Yo'q `--dry-run`, `publish` andoza artefaktlarni
`.musubi/dist/<namespace>/<name>/<version>/`, koʻrsatkichlarni oʻrnatish
manifest va foydali yuk orqali Torii" SoraFS saqlash pin oxirgi nuqtasi
`--upload`, ishlab chiqarilgan SoraFS pin va taqdim etadi
`PublishMusubiRelease` konfiguratsiya qilingan Iroha mijoz.

O'tkazilgan nashrlarda quyidagilar bo'lishi kerak:

- bo'sh bo'lmagan kanonik manba arxivlari
- deterministik manba arxiv rejasi
- kamida bittasi eksport qilingan Kotodama funksiya
- Chiqindilar bo'yicha chiqarishni tanlamaydigan bog'liqlik yozuvlari
- kontrakt nomlari paketga mos keladigan, agar mavjud bo'lsa, dapp bog'i
  nomlar maydonlari

## Registr soʻrovlari va hayot davri {#registry-queries-and-lifecycle}

Reyestrni quyidagilar yordamida qidirib toping va tekshirib koʻring:

```bash
cargo run -p musubi -- search swap --config client.toml
cargo run -p musubi -- versions dex.universal/swap-core --config client.toml
cargo run -p musubi -- alias resolve swap --config client.toml
```

Yanking yangi rezolyutsiyadan chiqarishni yashiradi, ammo mavjud qulflarni saqlaydi
qayta tiklanishi mumkin:

```bash
cargo run -p musubi -- yank dex.universal/swap-core@0.1.0 \
  --reason "bad archive" \
  --config client.toml \
  --dry-run
```

Musubi jahon nomini qo'zg'atishdan qochadi `namespace/package` ko'rsatilgan
nomlar maydonida nashr etish uchun ruxsat berish kerak
ushbu maqsad uchun ishlatiladigan o'sha mulkdorlik yoki vakolat berilgan ruxsatnoma modeli Kotodama
Dapp nomlar maydoni. Kuratorlashtirilgan global qisqa aliaslar paketdan alohida
mulkdorlik: `SetMusubiShortAlias` talab qiladi `CanSetMusubiShortAlias`
ruxsatnoma, va maqsadli paketda allaqachon kamida bir faol mavjud bo'lishi kerak
ozod qilish.

## Iroha Yer yuzalari {#iroha-surfaces}

Musubi birinchi sinfdan foydalanadi Iroha ko'rsatmalar va savollar:

| Yer yuzi                      | Maqsad                                            |
| ---------------------------- | -------------------------------------------------- |
| `PublishMusubiRelease`       | O'zgaruvchan bo'lmagan paketni nashr eting.              |
| `YankMusubiRelease`          | Mavjud bo'lgan chiqindilarni olib tashlangan deb belgilang.                |
| `SetMusubiShortAlias`        | Qisqacha global aliasni paket identifikatori bilan bog'lang. |
| `AssertMusubiReleaseExists`  | Muvaffaqiyatli paket versiyasi mavjud bo'lishi kerak.       |
| `FindMusubiReleaseByRef`     | To'g'ri paket ma'lumotnomasi bo'yicha ruxsatnoma oling.        |
| `FindMusubiPackageVersions`  | To'plam identifikatori uchun versiyalarni ro'yxatdan o'tkazing.                    |
| `FindMusubiPackageReleases`  | To'plam identifikatori uchun chiqarilgan ma'lumotlarni ro'yxatdan o'tkazish.           |
| `SearchMusubiPackages`       | Nomlar va matn bo'yicha paketlarni qisqacha qidirish.    |
| `FindMusubiShortAliasByName` | Qisqacha aliasni hal qiling.                     |

Torii koʻrsatkichlarini Musubi HTTP yo'nalish oilasi `/v1/musubi/*`.
Agentga qaraydi MCP asbob-uskunalar quyidagicha aniqlanadi: `iroha.musubi.*` nomli nomlar.
[Torii oxirgi nuqtalar](/uz/reference/torii-endpoints.md) va
[so'rov ma'lumotlari](/uz/reference/queries.md) kengroq API Xaritasi.
