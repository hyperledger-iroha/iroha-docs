---
translation_locale: uz
translation_source: /blockchain/instructions.md
translation_source_hash: adc3eff9758dd73e9114e78eaa18ddf6271db3bc4042611e1ed6ed1aac226246
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha Maxsus ko'rsatmalar {#iroha-special-instructions}

Biz gapirganimizda [qanday qilib Iroha faoliyat ko'rsatadi](/uz/blockchain/iroha-explained), Biz shunday deb aytdik Iroha Maxsus ko'rsatmalar dunyo davlatini o'zgartirishning yagona yo'lidir. qanday maxsus ko'rsatmalar bor? Agar siz ushbu qo'llanmada tilga oid qo'llanmalarni o'qigan bo'lsangiz, siz allaqachon bir necha ko'rsatmalarni ko'rgansiz: `Register<Account>` va `Mint<Numeric>`.

Iroha maxsus yo'l-yo'riqlarining to'liq ro'yxati quyidagicha:

|Koʻrsatmalar |Tafsirlar |
| --------------------------------------------------------- | ------------------------------------------------ |
| [Ro'yxatdan o'tish/ro'yxatdan chiqarish ](#un-register) |ID to'g'risida blockchain yangi entitetga berish. |
| [Mint/Burn](#mint-burn) |Raqamli aktivlar yoki takrorlashlarni qo'zg'atadigan raqamlar. |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |Blockchain obyektlari metadatalarini yangilash. |
| [SetParameter](#setparameter) |Chain-wide parametrini oʻrnating. |
| [Grant/Revoke](#grant-revoke) |Ruxsatlar berish yoki olib tashlash. |
| [Transfer](#transfer) |O ' tkazish egaligi yoki aktiv qiymati. |
| [Native escrow va aktivlar qulflari ](#native-escrow-and-asset-locks) |Raqamli aktivlarni protokol nazoratida qulflash. |
| [ExecuteTrigger](#executetrigger) |Qo'zg'atuvchilarni bajaring. |
| [Log/Sustom/Upgrade](#other-instructions) |Ish vaqti xatti-harakatini qayd etish, uzaytirish yoki yangilash. |

Keling, Iroha Maxsus ko'rsatmalarning qisqartmasi bilan boshlaymiz; har bir ko'rsatmalar uchun qaysi ob'ektlarga murojaat qilish mumkin va har bir obyekt uchun qanday ko'rsatмалар mavjud.

## Qisqa ma'lumot {#summary}

Har bir ko'rsatma uchun ushbu ko'rsatmani ishga tushirish mumkin bo'lgan ob'ektlar ro'yxati mavjud. masalan, o'tkazish variantlari egalik qiladigan katta qog'oz ob'ektlarini va raqamli aktivlarni qamrab oladi, minting esa raqamli aktivni qamrab oladi va takrorlashlarni qo'zg'atar.

Ba'zi yo'l-yo'riqlarga ko'ra, maqsadni belgilash kerak bo'ladi. Misol uchun, agar siz aktivlarni o'tkazmoqchi bo'lsangiz, ularni qaysi hisob raqamiga o'tkazayotganingizni har doim ma'lum qilishingiz kerak. Boshqa tomondan, biror narsani ro'yxatdan o'tkazganingizda, sizga faqat ro'yxatga olishni xohlagan ob'ekt kerak.

|Koʻrsatmalar |Ob'ektlar |Yoʻnalish|
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias) |Oddiy domen, ma'lumotlar maydonining aliaslari va hisobning aliaslarini yaratish |                      |
| [Ro'yxatdan o'tish/ro'yxatdan chiqarish ](#un-register) |hisob raqamlari, aktivlar ta'riflari, NFTs, rollar, qo'zg'atuvchilar, tengdoshlar; domenlarni olib tashlash |                      |
| [Mint/Burn](#mint-burn) |raqamli aktivlar, takrorlashlarni qo'zg'atish |hisoblar yoki qoʻzgʻatuvchilar |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |[metadatalarga ega bo'lgan ob'ektlar](./metadata.md): domenlar, hisobotlar, aktivlarning ta'riflari, NFTs, RWAs, triggerlar |                      |
| [SetParameter](#setparameter) |zanjir parametrlari |                      |
| [Grant/Revoke](#grant-revoke) | [vazifalar, ruxsatnoma tokenlari ](/uz/blockchain/permissions.md) |hisoblar yoki vazifalar |
| [Transfer](#transfer) |domenlar, aktivlarning tavsiflari, raqamli aktivlar, NFTs |hisob raqamlari |
| [Native escrow va aktivlar qulflari ](#native-escrow-and-asset-locks) |raqamli aktivlar garovlari, aktivlar qulflari , anonim garov majburiyatlari |xaridorlar, yo'nalishlar yoki nizo bo'linishi |
| [ExecuteTrigger](#executetrigger) |qoʻzgʻatuvchilar |                      |
| [Log/Sustom/Upgrade](#other-instructions) |ro'yxatlar, ijrochiga mos bo'lgan foydali yuklamalar, ijrochining yangilanishlari |                      |

ISI ni ko'rishning boshqa usuli ham mavjud, ular tutadigan katta kitob ob'ekti bo'yicha:

|Nihoyat |Koʻrsatmalar |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|Hisobvaraq|hisoblarni ro'yxatdan o'tkazish/ro'yxatdan chiqarish, aktivlarni qabul qilish, hisob metadatalarini yangilash, ruxsatnomalar berish yoki bekor qilish va vazifalar |
|Domen |domenlarni o'rnatishni ta'minlash, domenlarni ro'yxatdan chiqarish, domen egaligini o'tkazish, domen metadatalarini yangilash |
|Assetning aniqlanishi |ro'yxatga olish/ro'yxatdan o'tish tavsiflari, egalik huquqini o'tkazish, metadatalarni yangilash |
|Asset |O'simlik / yoqish raqamli miqdori, o'tkazish raqamli miqdori |
|Yovuzlik |jo'natilgan to'lovni ochish, qabul qilish, belgilash, ozod etish, bekor qilish, nizolarni hal qilish, olib tashlash yoki mahalliy vasiylik yozuvlarini tugatish.|
|NFT |ro'yxatdan o'tish/ro'yxatdan chiqarish NFTs, mulkdorlikni o'tkazish, metadatalarni yangilash |
|RWA |partiyalarni ro'yxatga olish, miqdorni o'tkazish, saqlab qolish/bajarish, muzlatish/bo'shatish, sotib olish, birlashtirish, metadatalar va nazoratlarni yangilash |
|Ishtirokchi |ro'yxatdan o'tish / ro'yxatni bekor qilish, mint / yoqish qo'zg'atuvchi takrorlashlar, ishga tushirish qo'zgʻatuvchisi, yangilanish qo'ng'atuvchi metadata |
|Dunyo |roli va tengdoshlarini ro'yxatdan o'tkazish/ro'yxatdan chiqarish, parametrlarni belgilash, ijrochini yuklab chiqish |

## CLI Misollar {#cli-examples}

Ushbu sahifadagi misollar siz Iroha ish maydonidan andoza lokal mijoz konfiguratsiyasiga qarshi buyruqlarni ishga tushirayotganingizni ko'rsatadi:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

Agar siz `iroha` ikkilamchi qismini o'rnatgan bo'lsangiz, buning o'rniga `iroha --config ./defaults/client.toml` dan foydalaning. Quyidagi joy egalarini tarmoqdagi qiymatlar bilan almashtiring:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

Jamoatni targ'ib qilishda Taira testnetdan foydalanish Taira Mijoz konfiguratsiyasi. Pul to'lanadigan misollarni ishga tushirishdan oldin , kran yordamchisini [Testnetni olish XOR bilan Taira](/uz/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) koʻrsatilgan `taira_faucet_claim.py`, so'ngra talabnoma testnet XOR krandan:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Fauxitdan moliyalashtirilgan aktiv ko'rinadigan bo'lganidan so'ng, tranzaksiyalarni yozish uchun kerakli gaz aktivlari metadatalarini ilova qiling:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` domenlarni yaratish va ularning SNS ijara shartnomalari uchun odatdagi birinchi chiqarilish yo'li. U aniq ma'lumotlar maydonini, egasini, ijara muddati va narxni saqlashni deklarativ ravishda bog'laydi, so'ngra barcha kerakli holatni atomik tarzda yaratadi yoki ta'mirlaydi. Tasdiqlangan `POST /v1/aliases/setup/plan` oxirgi nuqtadan yoki moslashtirilgan CLI ish oqimidan foydalanish:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

Niyat va reja sirsiz bo'ladi, lekin qadam belgilarini qo'llash va konfiguratsiyalangan hisob bilan odatdagi operatsiya taqdim etadi. Reja uning zanjiriga, hokimiyatiga, jonli davlatni qo'llab-quvvatlashga va muddatga bog'liq; hech qachon uni boshqa tarmog'da qayta ishlatmang.

## (Un) Ro'yxatdan o ' tkazish {#un-register}

Ro'yxatdan o'tish va ro'yxatdan chiqarish ID to'g'risidagi yo'l-yo'riqlarni blockchaindagi yangi entitetga berish uchun qo'llaniladi.

Ro'yxatdan o'tkazilishi mumkin bo'lgan hamma narsa `Registrable` va `Identifiable`, lekin `Identifiable` bo'lganlarning hammasi ham `Registrable` emas. Ko'p narsalar to'g'ridan-to'g'ri ro'yxatga olinadi, ammo ba'zi hollarda blokcha tarkibida ko'proq ma'lumotlar mavjud. Xavfsizlik va ishlash sabablari tufayli biz bunday ma'lumotlar tuzilishi uchun quruvchilardan foydalanamiz (masalan, `NewAccount`), tengdoshlar ro'yxatidan o'tish uchun maxsus mulkdorlik hujjati bo'yicha ko'rsatmalar mavjud.

Siz hisoblar, aktivlarning ta'riflari, NFTs, tengdoshlar, rollar va qo'zg'atuvchilarni ro'yxatdan o'tkazishingiz mumkin. Domen o'rnatishidan `EnsureAlias` foydalanadi; xom `Register::Domain` fayzli yuk genesis / bootstrap uchun mo'ljallangan. Tengdoshlar ro'yxatidan o'tishidan `RegisterPeerWithPop` foydalanadi, u tengdosh kalitga egalik to'g'risidagi dalilni o'z ichiga oladi. Entitet nomlariga qo'yilgan cheklovlar haqida bilish uchun bizning [ nomlash konvensiyalarimiz](/uz/reference/naming.md) ni ko'rib chiqing.

RWA lotlari maxsus `RegisterRwa` ko'rsatma orqali yaratilgan. Joriy kodda `UnregisterRwa` ko'rsatmasi aniqlanmagan; tasvirlangan miqdorni to'xtatish uchun `RedeemRwa`dan foydalaning.

::: info

Shuni e'tiborga olingki, [genesis blokingizni](/uz/guide/configure/genesis.md) `genesis.json` da qanday o'rnatishga qaror qilishingizga qarab (mahsus ravishda, siz ruxsatnoma tokenlarini ro'yxatdan o'tkazishni kiritasizmi yoki yo'qmi), hisobni ro'yxatga olish jarayoni juda farq qilishi mumkin. Umuman olganda, biz buni quyidagicha qisqartirishimiz mumkin:

- Umumiy blokchaynda har kim hisob qaydnomasini ro'yxatdan o'tkazishi kerak.
- Xususiy blokchaynda hisoblarni ro'yxatdan o'tkazish uchun noyob jarayon bo'lishi mumkin. Oddiy xususiy blokchaynada, ya'ni hisoblarini ro'yxatga olishning noyob jarayonlari bo'lmagan blokchaynida sizga boshqa hisob qayd etish uchun hisob kerak bo'ladi.

[ xususiy va ommaviy blokchainlarni ](/uz/guide/configure/modes.md) taqqoslashda ushbu farqlarni batafsil muhokama qilamiz.

:::

::: info

Hozirda tengdoshni ro'yxatdan o'tkazish tarmoqga dastlabki ishonchli tengdoshning bir qismi bo'lmagan tengdoshlarni qo'shishning yagona usuli.

:::

Blockchain obyektlarini ro'yxatdan o'tkazish uchun tilga oid qo'llanmalardan foydalaning:

|Til |Qoʻllanma |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
|CLI |[Iroha CLI](/uz/get-started/operate-iroha-via-cli.md) nomidan domenlarni o'rnatish va hisoblar va aktivlarni ro'yxatdan o'tkazish uchun foydalanish. |
|Rust |[Rust qo'llanma](/uz/guide/tutorials/rust.md)dan foydalaning. |
|Kotlin/Java |[Kotlin/Java qo'llanmasini ](/uz/guide/tutorials/kotlin-java.md) ishlating. |
|Python |[Python qo'llanma](/uz/guide/tutorials/python.md)dan foydalaning. |
|JavaScript/TypeScript |[JavaScript/TypeScript qo'llanmalaridan foydalaning ](/uz/guide/tutorials/javascript.md). |

Oddiy domen o'rnatishni rejalashtirish va qo'llash, so'ngra domeni endi kerak bo'lmaganida uni ro'yxatdan chiqarish:

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

Ro'yxatdan o'tish va ro'yxatdan chiqarish hisobvaraqlari:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

Ro'yxatga olish va ro'yxatdan o'tish aktivlari ta'riflari:

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

Ro'yxatdan o'tish va ro'yxatdan chiqarish NFTs. NFT ro'yxatidan o'qish uning mazmuni JSON standart kirishdan:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

Ro'yxatdan o'tish va ro'yxatdan chiqarish vazifalari:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

Ro'yxatga olish va ro'yxatdan chiqarish qobiliyatlari. Trigger ro'yxatidan o'tish uchun IVM bytecode yoki seriyalangan ko'rsatma ro'yxati kerak. Ushbu misol `Log` ko'rsatmasini CLI bilan quradi va uni qo'llanma ro'yxatini amalga oshiradi:

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

Ro'yxatdan o'tish va ro'yxatdan chiqarish tengdoshlari. Agar sizda hali mavjud bo'lmasa, BLS kalitini va PoP ni `kagami` bilan yarating:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## Mint/burn {#mint-burn}

Minting va yoqish raqamli aktivlarga ishora qilishi mumkin va cheklangan sonli takrorlashlar bilan qo'zg'atadi. Ba'zi aktivlar non-mintable deb e'lon qilinishi mumkin, ya'ni ular ro'yxatdan o'tganidan so'ng faqat bir marta mintlanishi mumkin.

Assetlar muayyan hisobvaraqqa, odatda aktivni ro'yxatdan o'tkazgan hisobvaraqqa qo'yilgan. Asset miqdorlari salbiy emas, shuning uchun siz hech qachon `$-1.0` aktivga ega bo'la olmaysiz yoki salbiy miqdorni yoqib, mint olishingiz mumkin emas.

Mint blockchain aktivlaridan foydalanish uchun tilga oid qo'llanma:

- [CLI](/uz/get-started/operate-iroha-via-cli.md)
- [Rust](/uz/guide/tutorials/rust.md)
- [Kotlin/Java](/uz/guide/tutorials/kotlin-java.md)
- [Python](/uz/guide/tutorials/python.md)
- [JavaScript/TypeScript](/uz/guide/tutorials/javascript.md)

Quyidagilar mol-mulkning yonishining misollari:

- [CLI](/uz/get-started/operate-iroha-via-cli.md)
- [Rust](/uz/guide/tutorials/rust.md)

Minta va yonish raqamli aktivlari:

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

O'tkazishlar mulkdorlikni yoki qiymatni hisobotlar o'rtasida o'tkazadi. Umumiy transfer variantlari domenlar, aktivlar ta'riflari, raqamli aktivlar va NFTs ni qamrab oladi. RWA miqdor harakati `TransferRwa` va `ForceTransferRwa` ko'rsatmalaridan foydalanib, [Real-World Assets](/uz/blockchain/rwas.md) da tasvirlangan.

Buning uchun hisob raqamiga aktivlarni o'tkazish uchun [ ruxsatnoma berilishi kerak ](/uz/reference/permissions.md). [CLI](/uz/get-started/operate-iroha-via-cli.md) yoki [Rust](/uz/guide/tutorials/rust.md) bilan aktivlarni qanday o'tkazishni misol qilib ko'rsating.

Raqamli aktivlarni oʻtkazish:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

O'tkazish domenlari, aktivlar ta'rifi va NFT mulki:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## Native escrow va aktivlar qulflari {#native-escrow-and-asset-locks}

Native escrow ko'rsatmalari raqamli aktivlarni katta qog'ozda boshqariladigan protokol saqlovida qulflaydi. Ular bozor uslubidagi kelishuvlar, umumiy aktivlarni qulflash va anonim himoyalangan escrow oqimlari uchun ishlatiladi.

Bozordagi depozitni ishlatish `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, va `ResolveEscrowDispute`. Umumiy aktivlar qulflaridan foydalanish `OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, va `ExpireAssetLock`. Anonymous escrow bozorning hayot davrini aks ettiradi `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, va `ResolveAnonymousEscrowDispute`.

Ushbu ISIs hozirda birinchi sinfdagi CLI buyruqlariga ega emas. SDK tiklangan quruvchilardan yoki seriyalangan ko'rsatma yuklaridan foydalaning va hayot davri tafsilotlari, ruxsatnomalar, so'rovlar, hodisalar va Rust misollar uchun [Native Asset Escrow](/uz/blockchain/escrow.md)-ni ko'ring .

## Grant/Revoq {#grant-revoke}

Berilish va bekor qilish yo'l-yo'riqlari [ ruxsatnomalar va vazifalar uchun ishlatiladi ](permissions.md).

`Grant` foydalanuvchiga bitta ruxsatnoma yoki bir guruh ruxsatnomalarni (ro'l) doimiy ravishda berish uchun ishlatiladi. Berilgan vazifalar va ruxsatnomalarni faqat `Revoke` ko'rsatmasi orqali olib tashlash mumkin. Bunday holda, ushbu ko'rsatmalardan ehtiyotkorlik bilan foydalanish kerak.

Hisobvaraqdagi rolni berish va bekor qilish:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

Ruxsat berish va bekor qilish toʻgʻrisidagi ruxsatnomalar. Ruxsatlanish buyruqlari standart kirishdan ruxsat obyektini oʻqiydi:

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

Ushbu ko'rsatmalar ob'ekt [metadata](/uz/blockchain/metadata.md) ni yangilash uchun `SetKeyValue` dan foydalanib, metadata yozuvini qo'yish yoki almashtirish uchun va `RemoveKeyValue`dan foydalanib, uni o'chirish uchun.

Metadata `set` buyruqlari standart kirishdan JSON qiymatini o'qiydi:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

Hisobvaraqlar, aktivlar ta'riflari, NFTs, RWAs uchun ham xuddi shunday shakl mavjud va triggerlar:

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

`SetParameter` faol ma'lumotlar modeli va ijrochisi tomonidan aniqlangan zanjir bo'ylab parametrlarni o'zgartiradi.

Standart kirish bo'yicha yagona parametr JSON ob'ektini o'tkazib ko'rish orqali parametrni belgilash:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

Ushbu ko'rsatma [ qo'zg'atuvchilarni ](./triggers.md) bajarish uchun ishlatiladi.

CLI ishga tushiruvchilarni ro'yxatdan o'tkazishi va ishga tushirishni bajarishga to'g'ridan-to'g'ri obuna bo'lishi mumkin. U `execute trigger` buyruqini yozmaydi, shuning uchun qo'llanma `ExecuteTrigger` ko'rsatmasini taqdim etish, SDK yoki ijrochi vositasi bilan seriyalangan `InstructionBox` yaratish va natijada hosil bo'lgan JSON qatlamini `ledger transaction stdin` orqali o'tkazish:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## Boshqa ko'rsatmalar {#other-instructions}

Iroha shuningdek, ishga tushirish vaqti va ijrochi integratsiyasi uchun past darajadagi ko'rsatmalarni ochib beradi:

- `Log`: ijro etish paytida ro'yxatdan o'tish
- `CustomInstruction`: ijrochiga mos bo'lgan JSON foydali yuklarni tashish
- `Upgrade`: ijrochi yangilanishini faollashtiring

Ping yordamchisi bilan `Log` yo'l-yo'riqini yuboring:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

`InstructionBox` seriyalangan ko'rsatma sifatida maxsus ijrochi yo'l-yo'riqlarini taqdim eting. Faydali yukning shakli ijrochiga mos, shuning uchun ko'rsatmani o'xshash SDK yoki ijrochi vositasi bilan hosil qiling:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

Ijro qiluvchi IVM bytecode faylidan yangilanadi:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
