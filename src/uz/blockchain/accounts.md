---
translation_locale: uz
translation_source: /blockchain/accounts.md
translation_source_hash: 7a0130655b4caae240ee261bc7d2059914828da258616bc78ccff41ee455e6d3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Hisob-kitoblar {#accounts}

Hisobvaraq - bu bitimlarni imzolash va o'z hisobvarag'ining holati bo'lishi mumkin bo'lgan organ. Hozirgi Iroha 3 ma'lumotlar modelida, `AccountId` kanonik va domensiz: u hisob boshqaruvchisidan kelib chiqadi va kanonik ravishda I105 sifatida kodlanadi. Inson o'qishi mumkin bo'lgan domen va ma'lumotlar maydonining konteksti alohida hisob-alias bog'liqliklarga tegishli.

## Tashkilot {#structure}

Ro'yxatga olingan `Account` tarkibida quyidagilar mavjud:

- `id`: kanonik `AccountId`
- `metadata`: o'zboshimchalik bilan hisobdan olingan metadotlar
- `label`: ko'rsatkichni o'zgartirish
- `uaid`: Nexus oqimlari tomonidan foydalaniladigan fakultativ universal hisobvaraq ID
- `opaque_ids`: hisobning UAID bilan bog'liq shaffof identifikatorlar;

Hisobot yaratish uchun ishlatiladigan tranzaksiya faydali yuk `NewAccount`. U ro'yxatdan o'tgan hisobda ishlatiladigan xuddi shu identifikatsiya, metadatalar, etiket, UAID va shaffof bo'lmagan ID maydonlarini o'z ichiga oladi.

`uaid` kanonik qo'shimchalar `AccountId`; bu uni almashtirmaydi. Nexus xizmatlarga ma'lumotlar maydonlari bo'ylab barqaror foydalanuvchi yoki tashkilot muomalasi, maxfiylikni saqlaydigan ro'yxatdan o'tish kerak, yoki xizmat ko'rsatish imkoniyatlarini qidirish. Ish vaqti bir-bir UAID- hisob raqamiga ko'rsatkich, shaffof bo'lmagan identifikatorlarni UAID, va ikkilamchi yoki to'qnashadigan shaffof bo'lmagan identifikatorlarni rad etadi. [FHE va UAID](/uz/blockchain/sora-nexus-services.md#fhe-and-uaid) uchun Nexus xizmat qatlamining oqimi.

## Hisobvaraqlar {#account-controllers}

Muayyan mijoz oqimida Ed25519 kalit juftligi ishlatiladi, ammo ma'lumotlar modeli multisignature siyosati boshqaruvchilari kabi boyroq nazoratchilarni ham qo'llab-quvvatlaydi.

Mijoz konfiguratsiyasi imzolash vakolatini tengdoshlari konfiguratsiyasidan alohida saqlashadi:

```toml
[account]
public_key = "ed0120..."
private_key = { digest_function = "ed25519", payload = "..." }
```

Joriy kalit formatlari uchun [klient konfiguratsiyasini](/uz/guide/configure/client-configuration.md) va [kiylarni ishlab chiqarishni](/uz/guide/security/generating-cryptographic-keys.md) ko'ring.

## Taira bilan sinab ko'ring. {#try-it-on-taira}

Umumiy Taira testnetdan bir nechta kanonik hisobotni IDs ro'yxatga oling:

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

Hisobvaraqlarni tekshirish uchun birinchi chaqiruvdan ID hisobini nusxa olish va uni yo'lga qo'yishdan oldin URL kodlash. Ushbu Python chiziq birinchi ro'yxatga olingan hisob uchun shunday qiladi:

```bash
python3 - <<'PY'
import json
import urllib.parse
import urllib.request

root = "https://taira.sora.org"
accounts = json.load(urllib.request.urlopen(f"{root}/v1/accounts?limit=1"))["items"]
account_id = accounts[0]["id"]
encoded = urllib.parse.quote(account_id, safe="")
assets = json.load(
    urllib.request.urlopen(f"{root}/v1/accounts/{encoded}/assets?limit=5")
)

print(json.dumps({"account_id": account_id, "assets": assets["items"]}, indent=2))
PY
```

Bu ommaviy o'qishlar. hisobni yaratish yoki yangilash imzolangan tranzaksiya bo'lib, [da tasvirlangan kran mablag'i bilan ta'minlanadigan Taira sozlashini talab qiladi SORA Nexus ma'lumotlar joylariga ulanish](/uz/get-started/sora-nexus-dataspaces.md) .

## Ro'yxatdan o'tish va ruxsatlar {#registration-and-permissions}

Hisobotlar [`Register` va `Unregister`](/uz/blockchain/instructions.md#un-register) umumiy yo'l-yo'riqlari bilan ro'yxatdan o'tkaziladi va ro'yxatga olinmaydi. Aktiv ishga tushirish vaqtini tasdiqlovchi hisoblarni kim yaratishi mumkinligini va qaysi ruxsat belgisi yoki rollar kerakligini hal qiladi.

Hisobot ro'yxatdan o'tganidan so'ng quyidagilarni amalga oshirishi mumkin:

- bitimlarni imzolash
- aktivlarni ushlab turish
- o'z domenlari
- rolalar va ruxsatnoma tokenlarini olish
- Metadatalarni saqlash
- ushbu xususiyatlarni qo'llab-quvvatlagan holda alias, rekey, tiklash va Nexus identifikatsiya oqimlarida ishtirok etish

## Kimlik muammolarini hal qilish {#troubleshooting-identity-issues}

Agar bitim kutilmagan tarzda rad etilsa, quyidagilarni tekshirib ko'ring:

- mijozning ommaviy kaliti imzolash uchun ishlatilgan xususiy kalitiga mos keladi;
- hisob qayd etilgan bo'lsa yoki amalga oshirilgan bitim bilan
- ko'rsatma talab qilingan ruxsatlarga ega bo'lgan organ
- qat'iy hisob maydonlarida I105 kanonik ID hisobi ishlatiladi, o'qiladigan nomlar esa aktiv hisob-alias bilan bog'liq holda hal etiladi.

Shuningdek qarang:

- [Ruxsatnomalar](/uz/blockchain/permissions.md)
- [Metadatalar](/uz/blockchain/metadata.md)
- [Xizmatchi konfiguratsiyasi](/uz/guide/configure/client-configuration.md)
- [SORA Nexus ma'lumotlar maydonlari](/uz/get-started/sora-nexus-dataspaces.md)
