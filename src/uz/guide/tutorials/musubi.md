---
translation_locale: uz
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 621d1795fd1c3cc62462a9a91af68fe684c0ff5293f5e77801420dc8318bac38
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# Musubi Kotodama Paketlar {#musubi-kotodama-packages}

Musubi - Kotodama manba paketlari uchun birinchi chiqarilgan paketa menejeri. U zanjirda to'g'ri bog'liqlik grafiyasini hal qiladi, SoraFS ni tasdiqlaydi manba arxivlari, tanlangan ish maydonini to'playdi va sinab ko'radi, kanonik CAR arxivlarini yaratadi va Iroha orqali o'zgarmas nashrlarni chop etadi.

Agar kerak bo'lsa, Musubi dan foydalaning:

- qayta ishlatilishi mumkin bo'lgan Kotodama funksiya kutubxonalarini chop etish
- to'g'ri o'tish grafikini `Musubi.lock` ga yoping
- yakuniylashtirilgan SoraFS arxiv majburiyatlaridan bog'liqlik manbaini rekonstruksiya qilish
- bitta paket yoki ko'p paketli ish maydonini qurish va sinovdan o'tkazish
- zaryaddagi reyestr orqali paketlarni tekshirish, nashr etish, olib tashlash, saqlash yoki boshqa nomlarga ega bo'lish

## Toʻplam nomlari {#package-names}

Canonical paketlarni tanlashda quyidagilar ishlatiladi:

```text
namespace/package
```

Toʻgʻri chiqarilish identifikatorlari versiyani qoʻshadi:

```text
namespace/package@version
```

Nom maydonidan oldin `@` ko'rsatkichi yo'q. Nomlar maydonasi yoki ma’lumotlar makonining ildizidir: `universal` yoki domenlarga moslashtirilgan ma'lumotlar maydonchasi, masalan: `dex.universal`. Katakchi ushbu tarkibiy nomlar maydonini paketni talab qilishdan oldin bitta barqaror uy ma’lumotlar makonida bog'laydi.

## Manifest va qulflash fayli {#manifest-and-lockfile}

Bir paketda yopilgan birinchi nashrdan foydalaniladi . `Musubi.toml` sxema. Manifestoda deklaratsiya qilinishi kerak `manifest-version = 1`, Kotodama nashr `"1"`, va IVM ABI versiyasi `1`; o'zgaruvchan ma'lumotlar mavjud emas; yoki ABI yo'nalish.

```toml
manifest-version = 1

[package]
namespace = "dex.universal"
name = "swap-core"
version = "0.1.0"
edition = "1"
abi-version = 1

[lib]
source-dir = "src"
exports = ["quote"]

[dependencies.math]
package = "std.universal/math"
version = "^1.0.0"
```

Tavakkalchiliklar to'g'ri versiyalardan, parvarishlash yoki tilde talablaridan foydalanishlari mumkin. `1.*`, va komma bilan ajratiladigan taqqoslash to'plamlari: `>=1.0.0,<2.0.0`. Tavakkalchilik jadvali kalitlari - mahalliy import nomli alias; `package` har doim kanonik reyestr tanlovi hisoblanadi.

`Musubi.lock` grafikni to'g'ri genesisdan kelib chiqqan `NetworkId` va yakuniy reyestr snapshotlariga bog'laydi. U tanlangan ish maydonining ildizlari va o'zgaruvchan bo'lmagan chiqarish nodlarini yozib oladi. maxfiylik, manba, interfeys, arxiv, ABI va to'g'ri bog'liqlik chegarasi majburiyatlari o'z ichiga oladi.

## Taira SoraFS olib kelishni sozlash {#configure-taira-sorafs-fetching}

Taira bu ish oqimi uchun ommaviy test tarmog'idir. Taira Xizmatchi konfiguratsiyasi bilan cheklangan zanjir va joriy to'g'rilashtirilgan genesisdan kelib chiqadigan tarmoq identifikatsiyasi; so'ngra pastki provayderga mos tasdiqlangan xarid bog'liqlarini qo'shing. A Taira Oʻrnatish oʻzgartirish mumkin `NetworkId`; uni mustahkam zanjirdan xulosa qilishning o'rniga imzolangan joylashtirish profilidan yangilash UUID. Hisobvaraq imzolash materiallari va provayder operator kalitlari faqat egalik qiluvchilarning ish vaqti fayllarida qolishi kerak.

```toml
torii_url = "https://taira.sora.org/"
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
network_id = "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"

[musubi.fetch]
network_id = "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"
client_id = "musubi-taira"
request_timeout_ms = 30000

[[musubi.fetch.provider_gateways]]
provider_id = "REPLACE_WITH_ADMITTED_PROVIDER_ID_HEX"
url = "REPLACE_WITH_ADVERTISED_PROVIDER_HTTPS_ORIGIN"
operator_public_key = "REPLACE_WITH_PROVIDER_AUTHORIZED_OPERATOR_PUBLIC_KEY"
operator_private_key_file = "./secrets/taira-sorafs-provider.key"
```

Taira ning qabul qilingan provayderlarini ommaviy testnetda toping:

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'
```

Provayder katalogi provayder kimligini va reklama qilingan oxirgi nuqtalarni taqdim etadi. Tanlangan provayderdan moslashtirish operatorining ruxsatnomasini oling. Ish vaqti ushbu kalitdan cheklangan oqim tokenlarini so'rash uchun foydalanadi; tokenlar CLI argumentlari ham, qulf fayli tarkibi ham emas.

Foydalanish uchun Taira tasdiqlovchi pin URL koʻrsatilgan `url`. Checking-in tasdiqlovchilar o'rnatilgan SoraFS saqlashni o'chirib qo'ydi. `https://taira-validator-{1,2,3,4}.sora.org` oxirgi nuqtalar pin ro'yxatdan o'tishni qabul qilishadi, arxiv o'qishlari esa tanlangan qabul qilingan provayderning HTTPS kelib chiqishi.

## Mahalliy ish oqimi {#local-workflow}

Yuqoridagi Iroha ish maydonining ildizidan paketlar direktoriyasini yaratish yoki kiritish va Musubi ni Cargo orqali ishlatish:

```bash
mkdir -p examples/swap-core
cd examples/swap-core

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  init . --namespace dex.universal --name swap-core --export quote

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  add std.universal/math --version '^1.0.0' --rename math

cargo run --manifest-path ../../Cargo.toml -p musubi -- fetch --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- check --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- build --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- test --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- package --config client.toml
```

`fetch` yakuniy reyestr grafikini hal qiladi, ruxsat etilgan taqdirda `Musubi.lock`-ni yangilaydi va o'zgaruvchan bo'lmagan mahalliy saqlanishni tasdiqlangan SoraFS joylardan to'ldiradi. `check`, `build`, `test` va `package` o'z ishlaridan oldin bir xil graf va saqlanishni tekshirishni amalga oshiradi.

`--locked` dan foydalanib, hech qanday qulf fayli o'zgarishini rad eting. `--offline`-dan faqat registry indekslari va barcha zarur arxivlar allaqachon saqlangan bo'lganda foydalaning. `--frozen` bu ikki cheklovni birlashtiradi. Offline cache muvaffaqiyatsizlikka uchraydi; Musubi hech qachon hal qilinmagan qulf faylini yozmaydi.

Tayanch manbalari `math::add()` kabi malakali qo'ng'iroqlarni deterministik ichki Kotodama nomlariga qayta yozish orqali bog'lanadi. Eksport qilinmagan funktsiyaga bog'liqlik chaqirichi rad etiladi. Import qilingan kutubxonalar funksiyalarni aks ettiradi; mahalliy `[[contract]]` va `[[test]]` maqsadlari aniq paket maqsadlari bo'lib qolmoqda.

## Keshni tekshirish va ta'mirlash {#cache-verification-and-repair}

Umumiy kecha buyruqlari o'zgaruvchan, reyestr bilan bog'liq arxivlarda ishlaydi:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair` karantinlar ishonchli avlodlarni buzuq qiladi va so'nggi provayder dalillari ruxsat berganida aniq arxivni qayta tiklaydi. Hayotsiz bo'sh mutatsiya uchun kesish niyat bilan yopiladi; `--dry-run` dan foydalanib, tasniflangan nomzodlarni tekshiradi.

## Qopish va nashr etish {#packaging-and-publishing}

Arxivni yozishdan oldin toza ijobiy fayl to'plamini tekshirib ko'ring, so'ngra kanonik paketni yaratish:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` `target/package/<namespace>-<name>-<version>.car` deb yozadi. CAR kanonik paket manifestini, semantik chiqarilish manifestini, aniq tekshiruv qulfini, manba daraxtini, interfeysni bog'laydi digest va SoraFS arxiv majburiyati. Birinchi nashrda `pack`, `--car-out`, `--sorafs-manifest-out` yoki `--source-plan-out` bo'yicha alohida buyruqlar yo'q CLI.

Joriy nashr imzolangan, qayta tiklanishi mumkin bo'lgan tarmoq ish oqimidir. Tanlangan `client.toml` tarkibida kerakli `[musubi.publication]` bog'lanishlari, shuningdek, hisob va Taira tarmoq konfiguratsiyasi bo'lishi kerak.

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

Foydalanish `--detach` Operatsiya jurnali va urug'lar kirish chegarasi uzoq muddatli bo'lganidan keyin qaytish uchun. `publish --resume <operation-id> --config client.toml`. Eng chiroyli `--recover <operation-id>` yo'nalish faqat yo'qolgan o'zgaruvchan bo'lmagan yordamchi yozuvlar uchun mukammal kirishdan oldin jurnal rekonstruksiya qiladi. `--dry-run` yoki umumiy ommaviy yuklash to'siqlari; ishga tushirish `package --list` va `package` mahalliy parvozdan oldin.

## Ro'yxatdan o'tish va hayot davri {#registry-queries-and-lifecycle}

O'sha Taira mijoz konfiguratsiyasi bo'yicha yakuniy reyestrni qidirib toping va tekshirish:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  search swap --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  info dex.universal/swap-core --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  versions dex.universal/swap-core --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  alias resolve swap --config client.toml
```

Yanking yangi rezolyutsiyalardan o'zgarmas chiqarishni istamaydi, ammo mavjud aniq qulflar qayta tiklanishi mumkin. Avval joriy yank tekshiruvini o'qing, so'ngra solishtirish va qo'yish mutatsiyasini taqdim eting:

```bash
: "${EXPECTED_YANK_REVISION:?set the current non-zero yank revision}"

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  yank dex.universal/swap-core 0.1.0 \
  --expected-revision="$EXPECTED_YANK_REVISION" \
  --reason="bad archive" \
  --config client.toml
```

Ushbu holatni o'zgartirish uchun `unyank` ni bir xil paket, versiya va yangi o'qilgan qayta ko'rib chiqish bilan ishlatish. Global aliaslar o'zlarining narxli ro'yxatga olish, qayta maqsad qilish tarixi va solishtirish-va qo'yish o'zgarishlariga ega; ular paketlarga egalik qilish uchun qisqartma yo'llar emas.

## Iroha Yuzlar {#iroha-surfaces}

Musubi birinchi nashrdagi V1 ko'rsatmalar va so'rovlarni ishlatadi:

|Yer yuzi | Maqsad                                                        |
| ---------------------------------------------------- | -------------------------------------------------------------- |
|`RegisterMusubiNamespaceBindingV1` |Nomlar maydonini uning barqaror uy ma'lumot maydonlariga bog'lash. |
|`RegisterMusubiArchiveV1` |Oʻzgarmas autentifikatsiya qilingan manba arxivini roʻyxatga olish. |
|`AddMusubiArchiveLocationV1` |SoraFS arxivning tasdiqlangan joyini qo'shish yoki yangilash. |
|`PublishMusubiReleaseV1` |To'plamni talab qilish yoki yangilash va bitta o'zgaruvchan chiqarishni e'lon qilish. |
|`SetMusubiReleaseYankV1` |To'g'ri bo'shash holatini taqqoslash va o'rnatish. |
|`InviteMusubiPackageMaintainerV1` |Xususan paket roli takliflari oqimini boshlash. |
|`RegisterMusubiAliasV1` / `RetargetMusubiAliasV1` |Boshqaruvli global aliasni ro'yxatdan o'tkazish yoki qayta maqsad qilish. |
|`AssertMusubiReleaseDigestV1` |To'g'ri o'zgaruvchan bo'lmagan chiqarib tashlashni tasdiqlang. |
|`FindMusubiExactPackageV1` |To'g'ri paket va uni qayta ko'rib chiqish. |
|`FindMusubiExactReleaseV1` |To'g'ri bo'lgan bir snapshotni o'qing. |
|`FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` |To'xtatish yoki yakuniy ravishda chiqarilgan nomzodlarni ro'yxatga olish. |
|`FindMusubiArchiveLocationsV1` |Amalga oshirilgan provayder tomonidan qo'llab-quvvatlanadigan arxiv joylarini o'qing. |
|`FindMusubiAliasV1` / `FindMusubiAliasHistoryV1` |Hozirgi alias maqsadini yoki uning o'zgarmas tarixini o'qing. |

Torii `/v1/musubi/*` ostida dastur yo'nalishlari oilasini ochib beradi. MCP vositalarida joriy `iroha.musubi.queries.*` va `iroha.musubi.instructions.*` nomlari ishlatiladi. kengroq API xaritasi uchun [Torii oxirgi nuqtalarini ](/uz/reference/torii-endpoints.md) va [ so'rov ma'lumotini ](/uz/reference/queries.md) ko'ring.
