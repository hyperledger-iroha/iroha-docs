---
translation_locale: uz
translation_source: /blockchain/accounts.md
translation_source_hash: 7a0130655b4caae240ee261bc7d2059914828da258616bc78ccff41ee455e6d3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Hisobvaraqlar {#accounts}

Hisobvaraq - bu bitimlarni imzolash va katta hisob qaydnomasini tuzish mumkin bo'lgan organ.
Hozirgi vaqtda Iroha 3 ma'lumotlar modeli, `AccountId` kanonik va domensiz:
u hisob boshqaruvchisidan kelib chiqdi va kanonik ravishda quyidagicha kodiflanadi: I105.
Inson oʻqishi mumkin boʻlgan domen va maʼlumotlar maydonining kontekstlari alohida hisob nomiga tegishli
bog'lanishlar.

## Qurilish {#structure}

Ro'yxatdan o'tgan `Account` tarkibida:

- `id`: kanonik `AccountId`
- `metadata`: Oʻzboshimchalik bilan hisoblangan metadotlar
- `label`: ko'rsatkichni o'zgartirish
- `uaid`: fakultativ Universal hisob raqami ID qo'llaniladi Nexus oqimlari
- `opaque_ids`: hisob raqamiga bog'liq shaffof identifikatorlar UAID

Hisobot yaratish uchun ishlatiladigan tranzaksiya yuklari `NewAccount`. U oʻz ichiga oladi .
bir xil identifikatsiya, metadotlar, etiket, UAID, va shaffof ID O'zbekiston Respublikasi
ro'yxatdan o'tgan hisob raqami.

`uaid` kanonik hujjatni to'ldiradi `AccountId`; uni almashtirmaydi. Uni ishlating
qachon Nexus Xizmatlar uchun barqaror foydalanuvchi yoki tashkilot tomonidan
ma'lumotlar maydonlari, maxfiylikni saqlab turadigan ro'yxatdan o'tish yoki xizmat ko'rsatish imkoniyatlarini qidirish.
ish vaqti bir-birni saqlab qoladi UAID-hisobga ko'rsatkich, shaffof identifikatorlarni talab qiladi
bir yo'l orqali o'rnatilishi UAID, va ikkilamchi yoki to'qnashuvchi shaffof bo'lmagan
identifikatorlar.
[FHE va UAID](/uz/blockchain/sora-nexus-services.md#fhe-and-uaid) uchun Nexus
xizmat qatlamining oqimi.

## Hisobvaraqlar {#account-controllers}

Boshqaruvchi hisobda qanday harakatlarga ruxsat berilishini belgilaydi.
oqim Ed25519 kalit juftlik foydalanadi, lekin ma'lumotlar modeli ham boyroq
nazoratchilar, masalan, ko'p imzolar siyosati nazoratchilari.

Mijoz konfiguratsiyasi imzolash vakolatini tengdoshlardan alohida saqlash
konfiguratsiya:

```toml
[account]
public_key = "ed0120..."
private_key = { digest_function = "ed25519", payload = "..." }
```

Koʻring [mijoz konfiguratsiyasi](/uz/guide/configure/client-configuration.md) va
[kalit avlod](/uz/guide/security/generating-cryptographic-keys.md) uchun
joriy kalit formatlar.

## Uni sinab koʻring . Taira {#try-it-on-taira}

Bir nechta ilohiy hikoyalarni roʻyxatga oling IDs jamoatchilikdan Taira sinov tarmog'i:

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

Hisobvaraq aktivlarini tekshirish uchun hisobni nusxa olish ID birinchi chaqiriqdan boshlab va URL-kodlash
uni yo'lga qo'yishdan oldin. Python Snippet buni birinchi marta qiladi
ro'yxatga olingan hisobvaraq:

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

Bu ommaviy kitoblar. Hisobotni yaratish yoki yangilash imzolangan bitimdir
va kran mablag ' bilan ta'minlanishini talab qiladi Taira ko'rsatkichlar
[Bogʻlanish SORA Nexus Ma'lumotlar maydonlari](/uz/get-started/sora-nexus-dataspaces.md).

## Ro'yxatga olish va ruxsatnomalar {#registration-and-permissions}

Hisobotlar ro'yxatdan o'tkazilgan va ro'yxatga olinmagan
[`Register` va `Unregister`](/uz/blockchain/instructions.md#un-register)
ko'rsatmalar. Aktiv ishga tushirish vaqtini tasdiqlovchi hisoblarni kim yaratishi mumkinligini hal qiladi
va qaysi ruxsatnoma tokenlari yoki rollari talab qilinadi.

Ro'yxatdan o'tganidan so'ng, hisob quyidagilarni amalga oshirishi mumkin:

- bitimlarni imzolash
- aktivlarni ushlab turish
- o'z domenlari
- roli va ruxsatnoma belgisini olish
- saqlash metadatalari
- alias, rekey, tiklash va Nexus kimlik oqishi, ular
  xususiyatlari qoʻllanilgan

## Kimlik muammolarini hal qilish {#troubleshooting-identity-issues}

Agar bitim kutilmagan tarzda rad etilsa, quyidagilarni tekshirib ko'ring:

- mijozning ommaviy kaliti imzolash uchun ishlatilgan xususiy kalitiga mos keladi
- hisob qayd etilgan bo'lsa yoki amalga oshirilgan
- vakolatli organning yo'l-yo'riq bilan talab qilingan ruxsatnomalari mavjud
- qat'iy hisob maydonlarida kanonik I105 hisob ID, o'qilishi mumkin bo'lganda
  nomlar aktiv hisob-kitobi bilan bog'liq bo'lib chiqariladi

Shuningdek qarang:

- [Ruxsatnomalar](/uz/blockchain/permissions.md)
- [Metadatalar](/uz/blockchain/metadata.md)
- [Mijozning konfiguratsiyasi](/uz/guide/configure/client-configuration.md)
- [SORA Nexus ma'lumotlar maydonlari](/uz/get-started/sora-nexus-dataspaces.md)
