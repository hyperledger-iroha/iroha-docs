---
translation_locale: uz
translation_source: /blockchain/instructions.md
translation_source_hash: 3251078b2b2268ff78563c02a0f935c63dc0569f0b6d38071150cbb4b89394d6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha Maxsus ko'rsatmalar {#iroha-special-instructions}

Biz haqida gapirganimizda [qanday qilib Iroha faoliyat ko'rsatadi](/uz/blockchain/iroha-explained), biz
shunday dedi Iroha Dunyoni oʻzgartirishning yagona yoʻli maxsus koʻrsatmalardir .
Xo'sh, bizda qanday maxsus ko'rsatmalar bor?
tilga oid qo'llanmalar, siz allaqachon bir necha
ko'rsatmalar: `Register<Account>` va `Mint<Numeric>`.

Mana to'liq ro'yxat Iroha Maxsus ko'rsatmalar:

| Ta'lim                                               | Tafsilotlar                                     |
| --------------------------------------------------------- | ------------------------------------------------ |
| [Ro'yxatdan o'tish/ro'yxatdan chiqarish](#un-register)                       | Soʻzlash ID blokchainning yangi entitetiga.    |
| [Minta/burn](#mint-burn)                                   | Numanik aktivlar yoki takrorlashlarni qo'zg'atish. |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) | Blockchain ob'ekti metadatalarini yangilash.               |
| [SetParameter](#setparameter)                             | Chain-wide parametrini o'rnating.                      |
| [Grant/Revoq](#grant-revoke)                             | Ruxsatlar va vazifalarni berish yoki olib tashlash.            |
| [Oʻtkazish](#transfer)                                     | O'z mulkdorligini yoki aktiv qiymatini o'tkazish.               |
| [Asosiy depozit va aktivlar qulflari](#native-escrow-and-asset-locks) | Protokol nazoratida raqamli aktivlarni qulflash.     |
| [ExecuteTrigger](#executetrigger)                         | Ishtirokchilarni bajaring.                                |
| [Yozuvlar/Maʼlumotlar roʻyxati/Yaxshilashtirish](#other-instructions)                 | Ish vaqti xatti-harakatini yozib olish, uzaytirish yoki yangilash.        |

Keling, bu mavzularni qisqacha ko'rib chiqaylik Iroha Maxsus ko'rsatmalar; har bir ob'ekt
ta'lim olish mumkin va har bir kishi uchun qanday ta'lim mavjud
ob'ekt.

## Qisqa ma'lumot {#summary}

Har bir ko'rsatma uchun ushbu ko'rsatmalar mavjud bo'lgan obyektlar ro'yxati mavjud
Masalan, transfer variantlari egalik qilish mumkin bo'lgan katta daftar ob'ektlarini qamrab oladi
va raqamli aktivlarni qamrab oladigan bo'lsa-da, minting raqamli aktivlar va triggerni qamrab oladi
takrorlash.

Ba'zi ko'rsatmalar uchun belgilangan joyni belgilash kerak.
aktivlarni o'tkazganingizda, siz har doim qaysi hisob qaydnomangizni aniqlashingiz kerak
Boshqa tomondan, siz biror narsani ro'yxatdan o'tkazganingizda,
Sizga kerak bo'lgan yagona narsa ro'yxatdan o'tkazishingiz kerak.

| Ta'lim                                               | Ob'ektlar                                                                                                 | Yo'nalish          |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias)                               | Oddiy domen, ma'lumotlar maydonining aliaslari va hisobning aliasi                                                 |                      |
| [Ro'yxatdan o'tish/ro'yxatdan chiqarish](#un-register)                       | hisob raqamlari, aktivlar tavsiflari; NFTs, rollar, qo'zg'atuvchilar, tengdoshlar; domenlarni olib tashlash                                |                      |
| [Minta/burn](#mint-burn)                                   | raqamli aktivlar, qo'zg'atish takrorlashlari                                                                     | hisoblar yoki qo'zg'atuvchilar |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) | mavjud bo'lgan obyektlar [Metadatalar](./metadata.md): domenlar, hisob-kitoblar, aktivlarni aniqlash; NFTs, RWAs, qo'zg'atuvchilar |                      |
| [SetParameter](#setparameter)                             | zanjir parametrlari                                                                                        |                      |
| [Grant/Revoq](#grant-revoke)                             | [roli, ruxsatnoma belgisi](/uz/blockchain/permissions.md)                                                  | Hisobvaraqlar yoki vazifalar    |
| [Oʻtkazish](#transfer)                                     | domenlar, aktivlarning ta'riflari, raqamli aktivlar; NFTs                                                        | hisob raqamlari             |
| [Asosiy depozit va aktivlar qulflari](#native-escrow-and-asset-locks) | raqamli aktivlar eskorlari, aktivlar qulflari, anonim eskor majburiyatlari                                    | xaridorlar, yo'nalishlar yoki nizo bo'linishi |
| [ExecuteTrigger](#executetrigger)                         | qo'zg'atuvchilar                                                                                                |                      |
| [Yozuvlar/Maʼlumotlar roʻyxati/Yaxshilashtirish](#other-instructions)                 | ro'yxatlar, ijrochiga mos bo'lgan foydali yuklamalar, ijrochining yangilanishlari                                                     |                      |

Shuningdek , boshqa bir qarash bor . ISI, kattalik ob'ekti bo'yicha
ular:

| Nihoyat           | Ko'rsatmalar                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| Hisobvaraq          | ro'yxatdan o'tish/ro'yxatdan chiqarish hisobvaraqlari, aktivlarni qabul qilish, hisobvaraqning metadatalarini yangilash, ruxsatnomalar berish/to'xtatish va vazifalar    |
| Domen           | domenlarni o'rnatishni ta'minlash, domenlarni ro'yxatdan chiqarish, domen egaligini o'tkazish, domen metadatalarini yangilash                    |
| Assetning tavsiflanishi | ro'yxatga olish/ro'yxatdan o'tish tavsiflari, mulkdorlikni o'tkazish, metadatalarni yangilash                                         |
| Assetlar            | Menta/burning raqamli miqdori, o'tkazish raqami                                                        |
| Qimmatli qog'ozlar           | jo'natilgan to'lovni ochish, qabul qilish, belgilash, ozod etish, bekor qilish, nizolarni hal etish, o'z ichiga olish yoki natijali vasiylik yozuvlarini tugatish |
| NFT              | ro'yxatga olish/ro'yxatdan chiqarish NFTs, mulkdorlikni o'tkazish, metadatalarni yangilash                                                |
| RWA              | partiyalarni ro'yxatga olish, miqdorni o'tkazish, saqlab qolish/ochirish, muzlatish/cheklash, sotib olish, birlashtirish, metadatalar va nazoratlarni yangilash |
| Trigger          | ro'yxatdan o'tish/ro'yxatdan chiqarish, mint/yolg'onish qo'zg'atuvchi takrorlashlar, ijro etish qo'zgʻatuvchi, yangilanish qo'ng'atuvchi metadata                 |
| Dunyo            | rola va tengdoshlarni ro'yxatdan o'tkazish/nozaradan chiqarish, parametrlarni belgilash, ijrochini yangilash                                    |

## CLI Misollar {#cli-examples}

Ushbu sahifadagi misollar siz yuqori tomondan buyruqlarni ishga tushirayotganingizni nazarda tutadi
Iroha ish maydonida andoza lokal mijoz konfiguratsiyasiga qarshi:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

Agar siz `iroha` ikkilamchi, foydalanish
`iroha --config ./defaults/client.toml` o'rniga joy egalarini almashtiring.
Quyidagilar sizning tarmog'ingizdagi qiymatlar bilan:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

Jamoatni maqsad qilib qo'yganda Taira testnetdan foydalanish Taira mijoz konfiguratsiyasi.
Pul to'lanadigan namunalarni ishga tushirishdan oldin kran yordamchisini
[Testnetni olish XOR to ' g'risida Taira](/uz/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
sifatida `taira_faucet_claim.py`, so'ngra talabnoma testnet XOR krandan:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Foyda bilan ta'minlangan aktiv ko'rinilgandan so'ng, kerakli gaz aktivini qo'shing
Transaksiyalarni yozish uchun metadotlar:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` domenlarni yaratish uchun odatdagi birinchi chiqarilish yo'li va
o'zlarining SNS Bu ma'lumotlar maydonini, egasini, ijara shartnomasini aniq ravishda bog'laydi.
so'z, va quote qo'riqchi, keyin yaratadi yoki kerakli barcha holat atomik ta'mirlaydi.
Sertifikatlarni ishlatish `POST /v1/aliases/setup/plan` yakuniy nuqta yoki moslash
CLI ish oqimi:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

Niyat va reja sirsiz, lekin qadam belgilarini qo'llash va taqdim etadi
belgilangan hisobda oddiy tranzaksiya bo'ladi.
zanjir, hokimiyat, jonli davlat quti va muddat; hech qachon bir-biridan qayta foydalanmang
tarmoq.

## (Un) Ro'yxatdan o ' tkazish {#un-register}

Ro'yxatdan o'tish va ro'yxatdan chiqarmaslik ID a ga
blokchainning yangi entiteti.

Ro'yxatdan o ' tkazilishi mumkin bo ' lgan hamma narsa ikkalasi ham `Registrable` va `Identifiable`,
lekin hamma narsa emas `Identifiable` bo ' lmoqda `Registrable`. Aksariyat narsalar
to'g'ridan-to'g'ri ro'yxatdan o'tkazilgan, lekin ba'zi hollarda blokcheyndagi vakillik
xavfsizlik va samaradorlik sabablari uchun biz
Bunday ma'lumotlar tuzilmalari uchun qurilmalar (masalan, `NewAccount`), va tengdoshlar
ro'yxatdan o'tish uchun maxsus mulkdorlik hujjati ko'rsatmasi mavjud.
ro'yxatdan o'tishi mumkin bo'lgan hamma narsa ro'yxatga olinmagan bo'lishi mumkin, ammo bu emas
qattiq va tezkor qoida.

Hisobvaraqlarni, aktivlar tavsiflarini qayd etishingiz mumkin. NFTs, tengdoshlar, rollar va
qoʻllanmalar. `EnsureAlias`; xom `Register::Domain` faydali yuk
genesis/bootstrap uchun mo'ljallangan.
`RegisterPeerWithPop`, O'rtacha kalitga egalik guvohnomasini o'z ichiga oladi.
[anjumanning nomi](/uz/reference/naming.md) cheklovlar haqida bilish
entitet nomlarini qo'yish.

RWA ko'pchilik o'zlariga bag'ishlangan `RegisterRwa` Ta'limotlar.
amaldagi kodda `UnregisterRwa` yo'l-yo'riq; foydalanish
`RedeemRwa` ko'rsatilgan miqdorni iste'foga chiqarishga.

::: info

Shuni yodda tutingki , siz o ' z
[genesis blok](/uz/guide/configure/genesis.md) yo'nalishi `genesis.json`
(ma'lum qilib aytganda, ruxsatnoma ro'yxatidan o'tish yoki yo'qligini
hisobini ro'yxatdan o'tkazish jarayoni juda farq qilishi mumkin.
General, biz buni quyidagicha qisqartirishimiz mumkin:

- A _jamoatchilik_ Blockchain, har kim hisob qayd etish mumkin bo'lishi kerak.
- A _xususiy_ blokchaina, ro'yxatdan o'tish uchun noyob jarayon bo'lishi mumkin
  hisob-kitoblar. _odatiy_ xususiy blokchaina, ya'ni blokchainasiz
  hisoblarni ro'yxatdan o'tkazish uchun har qanday noyob jarayonlar, sizga hisob kerak
  boshqa hisob qayd etish.

Biz ushbu farqlar haqida batafsil muhokama qilamiz.
[xususiy va ommaviy blokchainlarni taqqoslash](/uz/guide/configure/modes.md).

:::

::: info

Tengdoshni ro'yxatga olish hozirda tengdoshlarni qo'shishning yagona usuli
tarmoqga o'rnatilgan original ishonchli tengdoshning bir qismi.

:::

Refer tilga oid yo'lboshchilardan biriga murojaat qilib ,
obyektlarni blokcheynda ro'yxatga olish jarayoni:

| Til              | Qo'llanma                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| CLI                   | Foydalanish [Iroha CLI](/uz/get-started/operate-iroha-via-cli.md) domenlarni tuzish va hisob-kitoblar va aktivlarni ro'yxatga olish. |
| Rust                  | Foydalanish [Rust qoʻllanma](/uz/guide/tutorials/rust.md).                                                      |
| Kotlin/Java           | Foydalanish [Kotlin/Java qo'llanmasi](/uz/guide/tutorials/kotlin-java.md).                                        |
| Python                | Foydalanish [Python qoʻllanma](/uz/guide/tutorials/python.md).                                                  |
| JavaScript/TypeScript | Foydalanish [JavaScript/TypeScript qoʻllanma](/uz/guide/tutorials/javascript.md).                               |

Oddiy domenni rejalashtirish va qo'llash, so'ngra domeni yo'q bo'lganda ro'yxatdan o'tish
ko'proq vaqt kerak:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain unregister --id docs.universal
```

Ro'yxatga olish va ro'yxatdan chiqarish hisobvaraqlari:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

Qimmatli va ro'yxatdan o'tmagan aktivlarning ta'riflari:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition register \
  --id "$ASSET_DEF" \
  --name docs_token \
  --alias docs_token#docs.universal \
  --scale 0

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition unregister --id "$ASSET_DEF"
```

Ro'yxatdan o'tish va ro'yxatdan chiqarish NFTs. NFT ro'yxatga olish uning mazmunini o'qiydi JSON bilan
standart kirish:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

Ro'yxatdan o'tish va ro'yxatdan chiqarish vazifasi:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

Triggerlarni ro'yxatdan o'tkazish va ularni ro'yxatga olish
yig'ilgan IVM Bytecode yoki seriyalangan ko'rsatma ro'yxati.
a) `Log` ko'rsatmalar CLI va uni qo'zg'atuvchi ro'yxatga kiritadi:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml -o \
  ledger transaction ping --log-level INFO --msg "hourly cleanup" |
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger register --id hourly_cleanup \
  --instructions-stdin \
  --filter time \
  --time-start 5m \
  --time-period-ms 3600000

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger unregister --id hourly_cleanup
```

Ro'yxatga olish va ro'yxatdan chiqarish tengdoshlar. BLS kalit va PoP bilan `kagami`
agar sizda ular mavjud bo'lmasa:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## Minta/burn {#mint-burn}

O'simlik va yoqish cheklangan raqamli aktivlar va qo'zg'atuvchilarni anglatadi.
takrorlanishlar soni. Ba'zi aktivlar o'zgartirilmaydigan deb e'lon qilinishi mumkin, ya'ni
ular ro'yxatdan o'tganidan so'ng faqat bir marta chizilgan bo'lishi mumkin.

Moddiyyatlar muayyan hisobvaraqqa, odatda ro'yxatdan o'tgan hisobvaraqqa yoziladi
Asset miqdorlari salbiy emas, shuning uchun siz
hech qachon `$-1.0` bir aktiv yoki salbiy miqdorni yoqish va mint olish.

Tilga oid yoʻl-yoʻriqchilardan birini koʻrib chiqing
blokcheynda aktivlarni qalinlashtirish jarayoni:

- [CLI](/uz/get-started/operate-iroha-via-cli.md)
- [Rust](/uz/guide/tutorials/rust.md)
- [Kotlin/Java](/uz/guide/tutorials/kotlin-java.md)
- [Python](/uz/guide/tutorials/python.md)
- [JavaScript/TypeScript](/uz/guide/tutorials/javascript.md)

Quyidagilar aktivlarning yonishining misollari:

- [CLI](/uz/get-started/operate-iroha-via-cli.md)
- [Rust](/uz/guide/tutorials/rust.md)

Minta va yoqish raqamli aktivlari:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset mint \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 100

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset burn \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 10
```

Mint va yonish qo'zg'atuvchi takrorlashlar:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## Oʻtkazish {#transfer}

O'tkazishlar hisob raqamlari o'rtasida mulkdorlik yoki qiymatni o'tkazadi.
variantlar domenlar, aktivlarning ta'riflari, raqamli aktivlarni qamrab oladi va NFTs. RWA
ko'plik harakatlari maxsus foydalanadi `TransferRwa` va `ForceTransferRwa`
ko'rsatmalar [Haqiqiy dunyodagi aktivlar](/uz/blockchain/rwas.md).

Buning uchun hisob-kitob berish kerak
[aktivlarni o'tkazish uchun ruxsatnoma](/uz/reference/permissions.md). O ' zbekiston Respublikasining
aktivlarni o'tkazishga doir misol
[CLI](/uz/get-started/operate-iroha-via-cli.md) yoki
[Rust](/uz/guide/tutorials/rust.md).

Hisob aktivlarini oʻtkazish:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

O'tkazish domeni, aktivlar ta'riflanishi va NFT mulkdorlik:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## Asset-Locks va Native Escrow {#native-escrow-and-asset-locks}

Native escrow ko'rsatmalari hisob qaydnomada boshqariladigan protokolda raqamli aktivlarni blokirovka qilish
ko'rsatkichlar. Ular bozor uslubidagi hisob-kitob uchun ishlatiladi, umumiy aktiv
qulflar va anonim himoya qilingan depozit oqimlari.

Bozordagi depozitni qo'llash `OpenAssetEscrow`, `AcceptAssetEscrow`,
`MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`,
`OpenEscrowDispute`, va `ResolveEscrowDispute`. Umumiy aktivlar qulflaridan foydalanish
`OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, va
`ExpireAssetLock`. Anonim depozitlar bozor hayot davrini aks ettiradi
`OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`,
`MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`,
`CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, va
`ResolveAnonymousEscrowDispute`.

Bular ISIs hozirda birinchi sinfga ega emas CLI Buyruqlar. SDK
qurilmalar yoki seriyalangan ko'rsatma yuklari va qarang
[Asosiy aktivlar eskorovi](/uz/blockchain/escrow.md) hayot davri tafsilotlari uchun,
ruxsatnomalar, so'rovlar, hodisalar va Rust misollar.

## Grant/Revoq {#grant-revoke}

Konti uchun grant va bekor qilish yoʻl-yoʻriqlari ishlatiladi
[ruxsatnomalar va vazifalar](permissions.md).

`Grant` foydalanuvchiga doimiy ravishda bitta ruxsat berish uchun ishlatiladi; yoki
ruxsatnomalar guruhi ("roly").
yo'l orqali olib tashlanadi `Revoke` ko'rsatmalar.
ehtiyotkorlik bilan ishlatish kerak.

Hisobvaraqdagi rolni berish va bekor qilish:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

Ruxsat berish va bekor qilish to'g'risidagi belgilar.
standart kirishdan olingan obyekt:

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

Rol uchun ruxsatnomalar berish va bekor qilish:

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

Ushbu koʻrsatmalar obʼektni yangilash [Metadatalar](/uz/blockchain/metadata.md). Foydalanish
`SetKeyValue` metadotlar yozuvini qo'shish yoki almashtirish; va `RemoveKeyValue` to
birini o'chirib tashlang.

Metadatalar `set` buyruqlarni oʻqib JSON standart kirish qiymatidan:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

Hisob-kitoblar, aktivlarni belgilash uchun ham xuddi shunday model mavjud. NFTs, RWAs,
va qoʻzgʻatuvchi:

```bash
printf '{"display_name":"Alice"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account meta set --id "$ALICE" --key profile

printf '{"issuer":"docs"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition meta set --id "$ASSET_DEF" --key issuer

printf '{"color":"blue"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft meta set --id 'badge$docs.universal' --key traits

printf '{"owner":"ops"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger meta set --id hourly_cleanup --key owner
```

## `SetParameter` {#setparameter}

`SetParameter` faol ma'lumotlar tomonidan aniqlangan zanjir bo'ylab parametrlar o'zgarishi
model va ijrochi.

Tek bir parametrni oʻtkazib , parametrni moslash JSON standartdagi ob'ekt
kirish:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

Ushbu koʻrsatma ijro etish uchun ishlatiladi [qo'zg'atuvchilar](./triggers.md).

O ' zbekiston Respublikasi CLI qoʻzgʻatuvchilarni roʻyxatdan oʻtkazish va qoʻzgʼatuvchilarning bajarilishi hodisalariga obuna boʻlish
to'g'ridan-to'g'ri. `execute trigger` buyruq, shuning uchun
qo'llanma taqdim etish `ExecuteTrigger` ko'rsatma, seriyalangan yaratish
`InstructionBox` bilan SDK yoki ijrochi vositasi va natijada o'tadi JSON
toʻplam orqali `ledger transaction stdin`:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## Boshqa ko'rsatmalar {#other-instructions}

Iroha shuningdek, ishga tushirish vaqti va ijrochi uchun past darajadagi ko'rsatmalarni aniqlaydi
integratsiya:

- `Log`: ijro etish paytida ro'yxatga olishni chiqarish
- `CustomInstruction`: ijrochiga xos bo'lgan transport JSON foydali yuklar
- `Upgrade`: ijrochi yangilanishini faollashtirish

A-ni taqdim etish `Log` Ping yordamchisi bilan ko'rsatmalar:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

Oʻzlashtirilgan ijrochi koʻrsatmasini seriyalangan sifatida taqdim etish `InstructionBox`. O ' zbekiston Respublikasi
Faydali yukning shakli ijrochiga mos, shuning uchun buyruqni
muvofiqlashtirish SDK yoki ijrochi asboblari:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

Amalga oshiruvchini yigʻilgandan yangilash IVM Byte kod fayli:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
