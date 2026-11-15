---
translation_locale: uz
translation_source: /blockchain/accounts.md
translation_source_hash: d956bfb8c698fa463ef9fa84a91d50cf0e2100885eba670121ad78753f87d88d
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Hisoblar {#accounts}

Hisob — tranzaksiyalarni imzolashi va reyestr holatiga egalik qilishi mumkin bo‘lgan vakolatli subyekt. Joriy Iroha 3 ma’lumotlar modelida `AccountId` kanonik va domensiz: u hisob boshqaruvchisidan hosil qilinadi va [I105](/uz/reference/i105.md) shaklida kanonik kodlanadi. Inson o‘qiy oladigan domen va ma’lumotlar makoni konteksti alohida hisob taxallusi bog‘lanishlarida saqlanadi.

## Tuzilishi {#structure}

Ro‘yxatdan o‘tgan `Account` quyidagilarni o‘z ichiga oladi:

- `id`: kanonik `AccountId`
- `metadata`: hisobning ixtiyoriy metama’lumotlari;
- `label`: ixtiyoriy barqaror taxallus;
- `uaid`: SORA Nexus jarayonlarida ishlatiladigan ixtiyoriy universal hisob IDsi
- `opaque_ids`: hisobning UAID qiymatiga bog‘langan oshkor etilmaydigan identifikatorlar.

Hisob yaratish uchun ishlatiladigan tranzaksiya foydali yuki `NewAccount` dir. U ro‘yxatdan o‘tgan hisobdagi ayni identifikator, metama’lumot, yorliq, UAID va oshkor etilmaydigan identifikator maydonlarini olib yuradi.

`uaid` kanonik `AccountId`ni to‘ldiradi, uning o‘rnini bosmaydi. SORA Nexus xizmatlariga ma’lumotlar makonlari bo‘ylab foydalanuvchi yoki tashkilotning barqaror identifikatori, maxfiylikni saqlovchi ro‘yxatga olish yoki xizmat imkoniyatlarini izlash zarur bo‘lsa, undan foydalaning. Bajarish muhiti UAID va hisob o‘rtasida birga-bir indeksni saqlaydi, oshkor etilmaydigan identifikatorlar UAID orqali biriktirilishini talab qiladi hamda takroriy yoki to‘qnashuvchi identifikatorlarni rad etadi. SORA Nexus xizmat qatlami jarayoni uchun [FHE va UAID](/uz/blockchain/sora-nexus-services.md#fhe-and-uaid)ga qarang.

## Hisob boshqaruvchilari {#account-controllers}

Boshqaruvchi hisob amallarni qanday tasdiqlashini belgilaydi. Standart mijoz jarayoni Ed25519 kalit juftligidan foydalanadi, ammo ma’lumotlar modeli ko‘p imzoli siyosat boshqaruvchilari kabi murakkabroq boshqaruvchilarni ham qo‘llaydi.

Mijoz sozlamasi imzolash vakolatini tugun sozlamasidan alohida saqlaydi:

```toml
[account]
profile = "taira"
public_key = "ed0120..."
private_key_file = "/absolute/path/to/private.key"
```

Joriy kalit formatlari uchun [mijoz sozlamasi](/uz/guide/configure/client-configuration.md) va [kriptografik kalitlarni yaratish](/uz/guide/security/generating-cryptographic-keys.md) bo‘limlariga qarang.

## Taira da sinab ko‘rish {#try-it-on-taira}

Ochiq Taira sinov tarmog‘idagi bir nechta kanonik hisob identifikatorini sanang:

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.label // "-")] | @tsv'
```

Hisob aktivlarini tekshirish uchun birinchi chaqiruvdan hisob identifikatorini nusxalang va yo‘lga qo‘yishdan avval URL usulida kodlang. Quyidagi Python parchasi ro‘yxatdagi birinchi hisob uchun shuni bajaradi:

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

Bular ochiq o‘qish amallaridir. Hisob yaratish yoki yangilash imzolangan tranzaksiya bo‘lib, [Taira va Minamoto orqali SORA Nexus uchun ilova yaratish](/uz/get-started/sora-nexus-dataspaces.md) bo‘limida bayon qilingan, faucet orqali mablag‘ bilan ta’minlangan Taira sozlamasini talab qiladi.

## Ro'yxatdan o'tish va ruxsatlar {#registration-and-permissions}

Hisoblar umumiy [`Register` va `Unregister`](/uz/blockchain/instructions.md#un-register) ko‘rsatmalari bilan ro‘yxatdan o‘tkaziladi va ro‘yxatdan chiqariladi. Faol bajarish muhiti tekshiruvchisi hisoblarni kim yarata olishini hamda qaysi ruxsat tokenlari yoki rollar talab qilinishini belgilaydi.

Ro‘yxatdan o‘tgach, hisob quyidagilarni bajarishi mumkin:

- tranzaksiyalarni imzolash
- aktivlarni ushlab turish
- domenlarga egalik qilish
- rollar va ruxsat tokenlarini olish
- metama’lumotlarni saqlash
- tegishli imkoniyatlar yoqilganda taxallus, kalitni almashtirish, tiklash va SORA Nexus identifikatsiyasi jarayonlarida qatnashish

## Identifikatsiya muammolarini bartaraf etish {#troubleshooting-identity-issues}

Agar tranzaksiya kutilmaganda rad etilsa, quyidagilarni tekshiring:

- mijozning ochiq kaliti imzolashda ishlatilgan maxfiy kalitga mosligini;
- hisob genezisda yoki yakunlangan tranzaksiya orqali ro‘yxatdan o‘tganini;
- vakolat ko‘rsatma talab qiladigan ruxsatlarga egaligini;
- qatʼiy hisob maydonlari kanonik I105 hisob identifikatoridan foydalanadi, o‘qiladigan nomlar esa faol hisob taxallusi bog‘lanishi orqali aniqlanadi

Shuningdek qarang:

- [Ruxsatnomalar](/uz/blockchain/permissions.md)
- [Metama’lumotlar](/uz/blockchain/metadata.md)
- [Mijoz sozlamasi](/uz/guide/configure/client-configuration.md)
- [SORA Nexus ma’lumotlar makonlari](/uz/get-started/sora-nexus-dataspaces.md)
