---
translation_locale: uz
translation_source: /help/deployment-issues.md
translation_source_hash: 3e4042ed4e92a8df567f3500a84cfe32a3d10e22663204b07423ff4cf0fd0c5c
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Joylashtirish muammolarini bartaraf etish {#troubleshooting-deployment-issues}

Ushbu bo‘lim Iroha 3 joylashtirishlari uchun muammo yechish bo‘yicha maslahatlarni taklif qiladi. Agar siz duch kelayotgan muammo bu yerda tasvirlanmagan bo‘lsa, biz bilan [Telegram](https://t.me/hyperledgeriroha) orqali bog‘laning.

## Yaratilgan artefaktlardan boshlang {#start-with-generated-artifacts}

Mahalliy va sinov joylashtirishlarida qo‘lda yozilgan tugun fayllari o‘rniga Kagami yaratgan artefaktlardan foydalaning:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Yaratilgan katalogda tarmoq hamkasblari konfiguratsiyalari, blokcheyn boshlang‘ich materiali, ishga tushirish skriptlari va Iroha 3 qurilish liniyasi uchun README mavjud.

## tarmoq qo‘shnisi ishga tushmayapti {#peer-does-not-start}

Avvalo ushbu narsalarni tekshiring:

- `iroha3d --config <path>` tarmoq hamkasbining o‘z TOML faylini ko‘rsatadi.
- Tugun konfiguratsiyasidagi `public_key` va `private_key` ayni kalit juftligiga tegishli.
- `genesis.public_key` blokcheyn boshlang‘ich tranzaksiyasini imzolash uchun ishlatilgan kalitga mos keladi.
- Tasdiqlovchi tugun identifikatorlari BLS-Normal kalitlaridan foydalanadi; `trusted_peers_pop` mahalliy kalit va ishonchli tugunlarning egalik dalillarini o‘z ichiga oladi.
- Torii va P2P portlari allaqachon boshqa jarayon tomonidan bog‘lanmagan.
- Kura do'kon katalogi bir xil tarmoqqa tegishli va boshqa tarmoq profilidan nusxalanmagan.

Daemon bir nechta TOML qatlamini o‘qisa, konfiguratsiya izini kuzatishdan foydalaning:

```bash
cargo run -p irohad --bin iroha3d -- --config ./config.toml --trace-config
```

## Docker va Tahrirlash {#docker-and-compose}

Docker’da bir xil manba versiyasidan yigʻilgan bajariladigan fayllar bilan toʻrtta validatorni ishga tushirish uchun [Ishga tushurish Iroha 3](/uz/get-started/launch-iroha.md) qoʻllanmasiga amal qiling.

Validator jurnallarini koʻrish uchun toʻplam katalogida `python3 poc.py logs` buyrugʻini bajaring.

Agar compose joylashtirish boshlansa va keyin to'xtab qolsa, daemon jurnallarini tekshiring:

- mos kelmaydigan `chain`
- bitta tarmoq ishtirokchisi boshqa blokcheyn boshlang‘ich tranzaksiyasi yoki manifestdan foydalanmoqda
- reklama qilingan P2P manzillar faqat konteyner tarmog‘i ichida ishlaydi
- blokcheyn boshlang'ichini qayta yaratgandan keyin mahalliy hajmni qayta ishlatish

Yangi genezis bloki uchun tugun ombori boʻsh boʻlishi kerak. Oʻsha tarmoqni qayta ishga tushirish uchun avval `python3 poc.py down`, keyin `python3 poc.py up` buyrugʻini bajaring. `state/` katalogini tarmoqning toʻrtta Docker jildi bilan birga saqlang.

## Kubernetes {#kubernetes}

Kubernetes uchun har bir tasdiqlovchini holatli infratuzilma sifatida ko‘ring:

- har bir tarmoq ishtirokchisiga barqaror identifikatsiya kaliti va barqaror doimiy hajm bering
- klaster ichida boshqa tarmoq qatnashchilari echishi mumkin bo‘lgan P2P manzillarni ochib berish
- konfiguratsiya va blokcheyn genesis fayllarini rollout uchun o'zgarmas konfiguratsiya sifatida o'rnating
- barcha blokcheyn boshlang‘ich yoki topologiya o‘zgarishlarini ongli ravishda amalga oshiring, avtomatik config-map yangilanishi sifatida emas

Agar pod takror-takror qayta ishga tushsa, poddagi render qilingan konfiguratsiyani kutilgan bilan solishtiring [`peer.template.toml`](/uz/reference/peer-config/index.md#template) va tarmoq qo‘shnisi eski ma’lumotlarni qayta yuborayotganini tekshiring Kura ma'lumot.

## SORA Nexus profili {#sora-profile}

SORA Nexus, SoraFS yoki bir nechta yo‘lakdan foydalanadigan xususiy yoki mahalliy Iroha 3 muhitida standart fon xizmatini ushbu profil yoqilgan holda ishga tushiring.

```bash
cargo run -p irohad --bin iroha3d -- --config ./config.toml --sora
```

Xuddi shu profilni bir xil tarmoqdagi validatorlar bo‘ylab doimiy ravishda ishlating.

Jamoat Taira validatorlari maxsus launcherdan foydalanadi, bu Taira'ning aniq zanjiri, ro‘yxati, o‘chirilgan embedded-SoraFS xotirasi va ishga tushiruvchi imzolovchi profilini ta’minlaydi. Ishga tushirishdan oldin render qilingan Taira konfiguratsiyani tekshiring:

```bash
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

Ochiq Taira tasdiqlovchi tugunini oddiy `iroha3d` bilan ishga tushirmang; majburiy profil uchun [`iroha3d` CLI ma’lumotnomasiga](/uz/reference/iroha3d-cli.md) qarang.
