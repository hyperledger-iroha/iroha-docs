---
translation_locale: uz
translation_source: /blockchain/instructions.md
translation_source_hash: ade5ba2b693de7e798490be0947099d0306d9565b88550e201dccd181810fb18
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Iroha maxsus ko‘rsatmalari {#iroha-special-instructions}

[Iroha qanday ishlashi](/uz/blockchain/iroha-explained) haqida gapirganimizda, Iroha maxsus ko‘rsatmalari global holatni o‘zgartirishning yagona yo‘li ekanini aytdik. Qanday maxsus ko‘rsatmalar mavjud? Ushbu qo‘llanmadagi tilga xos yo‘riqnomalarni o‘qigan bo‘lsangiz, ularning bir nechtasini ko‘rgansiz: `Register<Account>` va `Mint<Numeric>`.

Iroha maxsus ko‘rsatmalarining to‘liq ro‘yxati quyidagicha:

|Ko‘rsatma |Tavsifi |
| --------------------------------------------------------- | ------------------------------------------------ |
| [Ro‘yxatdan o‘tkazish/ro‘yxatdan chiqarish](#un-register) | Blokcheyndagi yangi obyektga ID beradi yoki uni ro‘yxatdan chiqaradi. |
| [Mint/Burn](#mint-burn) |Raqamli aktiv miqdorini yoki qo‘zg‘atuvchi takrorlanishlarini chiqarish/yoqish. |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |Blokcheyn obyekti metama’lumotini yangilash. |
| [SetParameter](#setparameter) |Butun zanjir uchun parametrni sozlash. |
| [Grant/Revoke](#grant-revoke) |Ruxsat va rollarni berish yoki olib tashlash. |
| [Transfer](#transfer) |Egalik yoki aktiv qiymatini o‘tkazish. |
| [Mahalliy eskrou va aktiv qulflari](#native-escrow-and-asset-locks) |Raqamli aktivlarni protokol saqlovida qulflash. |
| [Atomik maxfiy hisob-kitob](#atomic-private-settlement) | Maxfiy jamg‘armalar va atomik paketlarni boshqaradi. |
| [ExecuteTrigger](#executetrigger) |Qo‘zg‘atuvchilarni bajarish. |
| [Log/Custom/Upgrade](#other-instructions) |Bajarish muhiti xatti-harakatini qayd etish, kengaytirish yoki yangilash. |

Avval Iroha maxsus ko‘rsatmalarining qisqacha tavsifini ko‘ramiz: har bir ko‘rsatmani qaysi obyektlarga qo‘llash mumkin va har bir obyekt uchun qaysi ko‘rsatmalar mavjud.

## Qisqacha ma’lumot {#summary}

Har bir ko‘rsatma uni qo‘llash mumkin bo‘lgan obyektlar ro‘yxatiga ega. Masalan, o‘tkazish variantlari egalik qilish mumkin bo‘lgan reyestr obyektlari va raqamli aktivlarni, chiqarish esa raqamli aktivlar va qo‘zg‘atuvchi takrorlanishlarini qamrab oladi.

Ba’zi ko‘rsatmalar manzilni belgilashni talab qiladi. Masalan, aktivlarni o‘tkazishda ularni qaysi hisobga yuborayotganingizni doim ko‘rsatish kerak. Biror narsani ro‘yxatdan o‘tkazishda esa ro‘yxatga olinadigan obyektning o‘zi kifoya.

|Ko‘rsatma |Obyektlar |Manzil|
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias) |oddiy domen, ma’lumotlar makoni taxallusi va hisob taxallusini sozlash |                      |
| [Ro‘yxatdan o‘tkazish/ro‘yxatdan chiqarish](#un-register) |hisoblar, aktiv ta’riflari, NFTs, rollar, qo‘zg‘atuvchilar, tugunlar; domenni olib tashlash |                      |
| [Mint/Burn](#mint-burn) |raqamli aktivlar, qo‘zg‘atuvchi takrorlanishlari |hisoblar yoki qo‘zg‘atuvchilar |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) | [metama’lumotga ega obyektlar](./metadata.md): domenlar, hisoblar, aktiv ta’riflari, NFTs, RWAs, triggerlar |                      |
| [SetParameter](#setparameter) |zanjir parametrlari |                      |
| [Grant/Revoke](#grant-revoke) | [rollar, ruxsat tokenlari](/uz/blockchain/permissions.md) |hisoblar yoki rollar |
| [Transfer](#transfer) |domenlar, aktiv ta’riflari, raqamli aktivlar, NFTs |hisoblar |
| [Mahalliy eskrou va aktiv qulflari](#native-escrow-and-asset-locks) |raqamli aktiv eskroulari, aktiv qulflari, anonim eskrou majburiyatlari |xaridorlar, maqsad hisoblar yoki nizodagi taqsimotlar |
| [Atomik maxfiy hisob-kitob](#atomic-private-settlement) |muayyan yo‘nalish doirasidagi maxfiy jamg‘armalar, siyosat almashishlari, yakunlangan paketlar va to‘xtatish belgilari | |
| [ExecuteTrigger](#executetrigger) |qoʻzgʻatuvchilar |                      |
| [Log/Custom/Upgrade](#other-instructions) |jurnal yozuvlari, ijrochiga xos foydali yuklar, ijrochi yangilanishlari |                      |

ISI ko‘rsatmalarini ular o‘zgartiradigan reyestr obyekti bo‘yicha ham tasniflash mumkin:

|Nishon |Ko‘rsatmalar |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|Hisob|hisoblarni ro‘yxatdan o‘tkazish/chiqarish, aktivlarni qabul qilish, hisob metama’lumotini yangilash, ruxsat va rollarni berish/bekor qilish |
|Domen |domen sozlamasini ta’minlash, domenlarni ro‘yxatdan chiqarish, domen egaligini o‘tkazish, domen metama’lumotini yangilash |
|Aktiv ta’rifi |ta’riflarni ro‘yxatdan o‘tkazish/chiqarish, egalikni o‘tkazish, metama’lumotni yangilash |
|Aktiv |raqamli miqdorni chiqarish/yoqish, raqamli miqdorni o‘tkazish |
|Eskrou |mahalliy saqlov yozuvini ochish, qabul qilish, to‘lov yuborilganini belgilash, chiqarish, bekor qilish, nizolash, hal qilish, qisman olish yoki muddati tugatish |
|NFT |NFTs ni ro‘yxatdan o‘tkazish/chiqarish, egalikni o‘tkazish, metama’lumotni yangilash |
|RWA |lotlarni ro‘yxatdan o‘tkazish, miqdorni o‘tkazish, ushlab turish/bo‘shatish, muzlatish/muzdan chiqarish, qaytarib olish, birlashtirish, metama’lumot va boshqaruvlarni yangilash |
|Qo‘zg‘atuvchi |ro‘yxatdan o‘tkazish/chiqarish, takrorlanish sonini oshirish/kamaytirish, qo‘zg‘atuvchini bajarish, qo‘zg‘atuvchi metama’lumotini yangilash |
|Global holat |tugunlar va rollarni ro‘yxatdan o‘tkazish/chiqarish, parametrlarni sozlash, ijrochini yangilash |

## CLI misollari {#cli-examples}

Ushbu sahifadagi misollar buyruqlarni yuqori oqimdagi Iroha ish maydonidan standart mahalliy mijoz sozlamasi bilan bajarayotganingizni nazarda tutadi:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

Agar `iroha` bajariluvchi faylini o‘rnatgan bo‘lsangiz, uning o‘rniga `iroha --config ./defaults/client.toml` dan foydalaning. Quyidagi to‘ldirgichlarni tarmog‘ingizdagi qiymatlar bilan almashtiring:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

Ochiq Taira sinov tarmog‘i bilan ishlaganda Taira mijoz sozlamasidan foydalaning. Haq talab qiladigan misollarni bajarishdan oldin [Taira-da sinov tarmog‘i XOR aktivini olish](/uz/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) bo‘limidagi yordamchini `taira_faucet_claim.py` sifatida saqlang, so‘ng xizmatdan sinov XOR aktivini oling:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Faucet bergan aktiv ko‘ringach, yozuvchi tranzaksiyalarga talab qilinadigan gaz aktivi metama’lumotini biriktiring:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` birinchi relizda domenlar va ularning SNS ijaralarini yaratishning odatiy yo‘lidir. U aynan qaysi ma’lumotlar makoni, egasi, ijara muddati va kotirovka cheklovi ishlatilishini deklarativ tarzda bog‘laydi, so‘ng talab qilinadigan holatni atomik yaratadi yoki tuzatadi. Autentifikatsiyalangan `POST /v1/aliases/setup/plan` so‘nggi nuqtasi yoki unga mos CLI jarayonidan foydalaning:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

Niyat va reja hech qanday sirni o‘z ichiga olmaydi, ammo qo‘llash bosqichi sozlangan hisob bilan odatiy tranzaksiyani imzolaydi va yuboradi. Reja o‘z zanjiri, vakolati, joriy holat tayanchi va muddati bilan bog‘langan; uni boshqa tarmoqda hech qachon qayta ishlatmang.

## Ro‘yxatdan o‘tkazish/chiqarish {#un-register}

Ro'yxatdan o'tkazish va ro'yxatdan chiqarish ko'rsatmalari blokcheyndagi yangi obyektga ID berish yoki uni olib tashlash uchun ishlatiladi.

Ro‘yxatdan o‘tkazish mumkin bo‘lgan har bir narsa `Registrable` hamda `Identifiable`, ammo har bir `Identifiable` obyekt `Registrable` emas. Ko‘p obyektlar bevosita ro‘yxatdan o‘tkaziladi, ayrimlarining blokcheyndagi ko‘rinishi esa ancha ko‘p ma’lumotga ega. Xavfsizlik va unumdorlik sababli bunday tuzilmalar uchun quruvchilar (masalan, `NewAccount`) ishlatiladi; tugunni ro‘yxatdan o‘tkazish uchun esa egalikni tasdiqlash isbotini olib yuradigan maxsus ko‘rsatma bor. Odatda ro‘yxatdan o‘tkaziladigan narsani ro‘yxatdan chiqarish ham mumkin, biroq bu qat’iy qoida emas.

Hisoblar, aktiv ta’riflari, NFTs, tugunlar, rollar va qo‘zg‘atuvchilarni ro‘yxatdan o‘tkazish mumkin. Domen sozlamasi `EnsureAlias` dan foydalanadi; xom `Register::Domain` foydali yuki genezis/yuklash jarayoni uchun ajratilgan. Tugunni ro‘yxatdan o‘tkazish uchun `RegisterPeerWithPop` ishlatiladi va u tugun kalitiga egalik isbotini olib yuradi. Obyekt nomlariga qo‘yiladigan cheklovlarni [nomlash qoidalari](/uz/reference/naming.md) bo‘limidan ko‘ring.

RWA lotlari maxsus `RegisterRwa` ko‘rsatmasi bilan yaratiladi. Joriy kod `UnregisterRwa` ko‘rsatmasini taqdim etmaydi; ifodalangan miqdorni muomaladan chiqarish uchun `RedeemRwa` dan foydalaning.

::: info

`genesis.json` dagi [genezis blokini](/uz/guide/configure/genesis.md) qanday sozlashingizga, xususan ruxsat tokenlarini ro‘yxatdan o‘tkazishni kiritishingiz yoki kiritmasligingizga qarab, hisobni ro‘yxatdan o‘tkazish jarayoni keskin farq qilishi mumkin. Umuman, buni quyidagicha jamlash mumkin:

- _Ochiq_ blokcheynda har kim hisobni ro‘yxatdan o‘tkaza olishi kerak.
- _Xususiy_ blokcheynda hisoblarni ro‘yxatdan o‘tkazish uchun o‘ziga xos jarayon bo‘lishi mumkin. Bunday alohida jarayoni bo‘lmagan _odatiy_ xususiy blokcheynda boshqa hisobni ro‘yxatdan o‘tkazish uchun avval hisobga ega bo‘lish kerak.

[Xususiy va ochiq blokcheynlarni taqqoslash](/uz/guide/configure/modes.md) bo‘limida bu farqlar batafsil muhokama qilinadi.

:::

::: info

Hozircha tugunni ro‘yxatdan o‘tkazish — dastlabki ishonchli tugunlar to‘plamiga kirmagan tugunlarni tarmoqqa qo‘shishning yagona yo‘li.

:::

Blokcheyn obyektlarini ro‘yxatdan o‘tkazish uchun tilga oid qo‘llanmalardan foydalaning:

|Til |Qoʻllanma |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
|CLI |Domenlarni sozlash hamda hisoblar va aktivlarni ro‘yxatdan o‘tkazish uchun [Iroha CLI](/uz/get-started/operate-iroha-via-cli.md) dan foydalaning. |
|Rust |[Rust qo‘llanmasidan](/uz/guide/tutorials/rust.md) foydalaning. |
|Kotlin/Java |[Kotlin/Java qo‘llanmasidan](/uz/guide/tutorials/kotlin-java.md) foydalaning. |
|Python |[Python qo‘llanmasidan](/uz/guide/tutorials/python.md) foydalaning. |
|JavaScript/TypeScript |[JavaScript/TypeScript qo‘llanmasidan](/uz/guide/tutorials/javascript.md) foydalaning. |

Oddiy domen sozlamasini rejalashtiring va qo‘llang, so‘ng domen kerak bo‘lmay qolganda uni ro‘yxatdan chiqaring:

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

Hisoblarni ro‘yxatdan o‘tkazing va ro‘yxatdan chiqaring:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

Aktiv ta’riflarini ro‘yxatdan o‘tkazing va ro‘yxatdan chiqaring:

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

NFTs ni ro‘yxatdan o‘tkazing va ro‘yxatdan chiqaring. NFT-ni ro‘yxatdan o‘tkazish uning JSON tarkibini standart kirishdan o‘qiydi:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

Rollarni ro‘yxatdan o‘tkazing va ro‘yxatdan chiqaring:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

Qo‘zg‘atuvchilarni ro‘yxatdan o‘tkazing yoki chiqaring. Qo‘zg‘atuvchini ro‘yxatdan o‘tkazish uchun kompilyatsiyalangan IVM bayt-kodi yoki ketma-ketlashtirilgan ko‘rsatmalar ro‘yxati kerak. Bu misol CLI yordamida `Log` ko‘rsatmasini tuzib, uni qo‘zg‘atuvchini ro‘yxatdan o‘tkazishga uzatadi:

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

Tugunlarni ro‘yxatdan o‘tkazing va ro‘yxatdan chiqaring. BLS kaliti va PoP hali bo‘lmasa, ularni `kagami` yordamida yarating:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./peer-key
PEER_KEY=$(tr -d '\n' < ./peer-key/public.key)
PEER_POP=$(tr -d '\n' < ./peer-key/pop.hex)

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## Mint/burn {#mint-burn}

Chiqarish va yoqish raqamli aktivlarga hamda takrorlanish soni cheklangan qo‘zg‘atuvchilarga taalluqli bo‘lishi mumkin. Ayrim aktivlar chiqarib bo‘lmaydigan qilib e’lon qilinadi; bunday aktiv ro‘yxatdan o‘tkazilgach faqat bir marta chiqarilishi mumkin.

Aktivlar muayyan hisobga, odatda aktivni avval ro‘yxatdan o‘tkazgan hisobga chiqariladi. Aktiv miqdori manfiy bo‘lmaydi; `$-1.0` aktivga ega bo‘lish yoki manfiy miqdorni yoqib yangi aktiv chiqarish mumkin emas.

Blokcheyn aktivlarini chiqarish uchun tilga oid qo‘llanmalardan foydalaning:

- [CLI](/uz/get-started/operate-iroha-via-cli.md)
- [Rust](/uz/guide/tutorials/rust.md)
- [Kotlin/Java](/uz/guide/tutorials/kotlin-java.md)
- [Python](/uz/guide/tutorials/python.md)
- [JavaScript/TypeScript](/uz/guide/tutorials/javascript.md)

Aktivlarni yoqish misollari:

- [CLI](/uz/get-started/operate-iroha-via-cli.md)
- [Rust](/uz/guide/tutorials/rust.md)

Raqamli aktivlarni chiqaring va yoqing:

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

Qo‘zg‘atuvchi takrorlanishlarini chiqaring va yoqing:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## Oʻtkazish {#transfer}

O‘tkazmalar hisoblar o‘rtasida egalik yoki qiymatni ko‘chiradi. Umumiy o‘tkazma variantlari domenlar, aktiv ta’riflari, raqamli aktivlar va NFTs ni qamrab oladi. RWA miqdorini ko‘chirish uchun [Real dunyo aktivlari](/uz/blockchain/rwas.md) bo‘limida tavsiflangan maxsus `TransferRwa` va `ForceTransferRwa` ko‘rsatmalari ishlatiladi.

Buning uchun hisobga [aktivlarni o‘tkazish ruxsati](/uz/reference/permissions.md) berilishi kerak. Aktivlarni [CLI](/uz/get-started/operate-iroha-via-cli.md) yoki [Rust](/uz/guide/tutorials/rust.md) yordamida o‘tkazish misoliga qarang.

Raqamli aktivlarni oʻtkazish:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

Domen, aktiv ta’rifi va NFT egaligini o‘tkazing:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## Mahalliy eskrou va aktiv qulflari {#native-escrow-and-asset-locks}

Mahalliy eskrou ko‘rsatmalari raqamli aktivlarni reyestr boshqaradigan protokol saqlovida qulflaydi. Ular bozor uslubidagi hisob-kitoblar, umumiy aktiv qulflari va anonim himoyalangan eskrou jarayonlari uchun ishlatiladi.

Bozor eskrousi `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute` va `ResolveEscrowDispute` ko‘rsatmalaridan foydalanadi. Umumiy aktiv qulflari `OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock` va `ExpireAssetLock` ko‘rsatmalaridan foydalanadi. Anonim eskrou bozor eskrousi hayot siklini `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute` va `ResolveAnonymousEscrowDispute` orqali takrorlaydi.

Bu ISIs uchun hozircha maxsus CLI buyruqlari yo‘q. Tiplashtirilgan SDK quruvchilari yoki ketma-ketlashtirilgan ko‘rsatma foydali yuklaridan foydalaning. Hayot sikli, ruxsatlar, so‘rovlar, hodisalar va Rust misollari uchun [Mahalliy aktiv eskrousi](/uz/blockchain/escrow.md) bo‘limiga qarang.

## Atomik maxfiy hisob-kitob {#atomic-private-settlement}

Boshqariladigan atomik maxfiy hisob-kitob ko‘rsatmalari shaffof Mahalliy AMX-dan alohida. `ActivatePrivateSettlementPoolV1` tahrirlangan boshqaruv proyeksiyasi va kanonik boshlang‘ich majburiyatlardan muayyan yo‘nalish doirasida bitta maxfiy `pool` yaratadi. `FinalizeAtomicPrivateSettlementV1` barcha qatnashuvchi qo‘mitalar tasdiqlagan butun paketni atomik qo‘llaydi. `AbortAtomicPrivateSettlementV1` faqat homiy vakolat bergan ochiq yakun belgisini e’lon qiladi.

`RotatePrivateSettlementPoolPolicyV1` ni faqat maxfiylik boshqaruvi bajarishi mumkin. Ko‘rsatma amaldagi boshqaruv dayjesti bilan aniq moslikni talab qiladi; yo‘nalish, `pool`, aktivni bog‘lash majburiyati, holat chegarasi, takrorlash to‘plamlari va yakunlangan kvitansiyalarni saqlaydi, ochiq tahrir raqamini bittaga oshiradi va auditor kalitining yangiroq davridan foydalanadi. Almashish kiritish balandligida kuchga kiradi va ayni balandlikda o‘sha yo‘nalish hamda `pool` uchun kvitansiya yakunlanmaydi. Ochiq tahrirlar nasabi almashishdan oldin yakunlangan kvitansiyalarni qayta ishga tushirilgandan keyin ham yaroqli, ularning aynan takrorlanishini esa idempotent saqlaydi. Eski siyosat bilan jarayondagi paketlar hech qanday holat o‘zgarishisiz xavfsiz tarzda rad etiladi. Operatorlar saqlangan kapsulalar uchun eski deshifrlash kalitlarini saqlashi yoki ularni yo‘q qilishdan oldin kapsulalarni boshqariladigan tartibda qayta o‘rash jarayonini tasdiqlab, sinovdan o‘tkazishi kerak.

Bu yo‘l standart holatda o‘chirilgan va ishlab chiqarish uchun tayyor deb tasdiqlanmagan. Sozlama, vakolat, tekshiruv, tiklash va reliz talablari uchun [ma’lumotlar makonlari orasida atomik maxfiy hisob-kitobni ishga tushirish](/uz/get-started/atomic-private-settlement) bo‘limiga qarang.

## Berish/bekor qilish (`Grant`/`Revoke`) {#grant-revoke}

Berish va bekor qilish ko‘rsatmalari hisob [ruxsatlari va rollarini](permissions.md) boshqaradi.

`Grant` foydalanuvchiga bitta ruxsat yoki ruxsatlar guruhini (“rol”) doimiy beradi. Berilgan rol va ruxsatlarni faqat `Revoke` ko‘rsatmasi bilan olib tashlash mumkin. Shu sababli bu ko‘rsatmalardan ehtiyotkorlik bilan foydalaning.

Hisobga rol bering yoki undan rolni bekor qiling:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

Ruxsat tokenlarini bering yoki bekor qiling. Ruxsat buyruqlari ruxsat obyektini standart kirishdan o‘qiydi:

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

Bu ko‘rsatmalar obyekt [metama’lumotini](/uz/blockchain/metadata.md) yangilaydi. Metama’lumot yozuvini kiritish yoki almashtirish uchun `SetKeyValue`, o‘chirish uchun `RemoveKeyValue` dan foydalaning.

Metama’lumotga oid `set` buyruqlari JSON qiymatini standart kirishdan o‘qiydi:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

Ayni andoza hisoblar, aktiv ta’riflari, NFTs, RWAs va qo‘zg‘atuvchilar uchun ham mavjud:

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

`SetParameter` faol ma’lumotlar modeli va ijrochi taqdim etgan butun zanjir parametrlarini o‘zgartiradi.

Standart kirish orqali bitta parametr JSON obyektini uzatib parametrni sozlang:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

Bu ko‘rsatma [qo‘zg‘atuvchilarni](./triggers.md) bajarish uchun ishlatiladi.

CLI qo‘zg‘atuvchilarni ro‘yxatdan o‘tkazishi va ularning bajarilish hodisalariga bevosita obuna bo‘lishi mumkin. Unda tiplashtirilgan `execute trigger` buyrug‘i yo‘q. `ExecuteTrigger` ni qo‘lda yuborish uchun SDK yoki ijrochi vositasi yordamida ketma-ketlashtirilgan `InstructionBox` yarating va hosil bo‘lgan JSON massivini `ledger transaction stdin` orqali uzating:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## Boshqa ko‘rsatmalar {#other-instructions}

Iroha bajarish muhiti va ijrochi integratsiyasi uchun quyi darajadagi ko‘rsatmalarni ham taqdim etadi:

- `Log`: bajarish vaqtida jurnal yozuvini chiqaradi
- `CustomInstruction`: ijrochiga xos JSON foydali yukini olib yuradi
- `Upgrade`: ijrochi yangilanishini faollashtiradi

Ping yordamchisi bilan `Log` ko‘rsatmasini yuboring:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

Maxsus ijrochi ko‘rsatmasini ketma-ketlashtirilgan `InstructionBox` sifatida yuboring. Foydali yuk shakli ijrochiga xos bo‘lgani uchun ko‘rsatmani unga mos SDK yoki ijrochi vositasi bilan yarating:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

Ijrochini kompilyatsiyalangan IVM bayt-kod faylidan yangilang:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
