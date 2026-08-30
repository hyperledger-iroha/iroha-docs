---
translation_locale: uz
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: f766c604b0220fc03cacd7c0b9cbb5f94f415c5ec61eba89de7a5e310a1dfe79
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SORA 3-da qurilgan: Taira va Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3 - Iroha 3 va SORA Nexus ustida qurilgan dasturga qaraydigan ommaviy ishga tushirish yo'li. Avvalo Taira ustida quring va mashq qiling, so'ngra o'sha xil mijoz shaklini faqat alohida asosiy tarmoq kalitlaringiz bo'lganda, to'lovlar uchun haqiqiy XOR va ishlab chiqarish ruxsatnomasi bo'lganida Minamoto ustiga ko'chiring:

Ushbu qo'llanma Iroha mijozini jamoatchi SORA tarmoqlari uchun qanday konfiguratsiya qilishni ko'rsatadi:

- Taira sinov tarmog'i `https://taira.sora.org`
- Minamoto asosiy tarmoq `https://minamoto.sora.org`

Taira ni integratsiya sinovlari, kran mablag'i bilan ta'minlangan yozish kanarlari va ishga tushirish mashg'ulotlari uchun ishlating. Minamoto-ni faqat ishlab chiqarish tayyor bo'lgan asosiy tarmoq faoliyati uchun foydalaning. Ikkala tarmog'i ham XOR da to'lovlarni oladi:

- Taira ommaviy krandan testnet XOR foydalanadi.
- Minamoto haqiqiy ishlatiladi XOR. Yoʻq Minamoto faucet.

## Qurilish yo'li {#builder-path}

|qadam |Taira Testnet |Minamoto Asosiy |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|Tarmoqning holatini oʻqishni boshlash |`/status` kalitsiz so'rovlar |`/status` kalitsiz so'rovlar |
|Maʼlumotlar maydonini tanlang |Ochiq `universal` dan foydalaning , agar sizning dasturingizga boshqariladigan yo'nalish kerak bo'lmasa |Xuddi shu maʼlumotlar maydonidan faqat asosiy tarmoqning tasdiqlanganidan soʻng foydalanish |
|Toʻlov aktivini oling .|Ommaviy Taira krandan foydalanish |XOR mablag ' bilan ta ' minlangan Minamoto hisobidan yoki tasdiqlangan xazina oqimidan oling |
|Test yozadi |Foydalanuvchi tomonidan moliyalashtirilgan sinovdan foydalanish XOR |Sinov vositalaridan foydalanmang; real XOR xarajatlarini yozadi |
|Taʼlim berish |Logika, monitoring va imzolashni qayta sinab ko'ring |alohida kalitlar, moliyalashtirish va ozod qilish nazoratlaridan foydalanish |

Amaliy oqim quyidagicha:

1. Mijozni Taira ga qarshi yaratish va ommaviy `universal` ma'lumotlar maydonidan foydalanish.
2. Imzolovchi qo'shing va Taira kran bilan moliyalashtiring.
3. Taira ga qarshi o'zingizning dasturingiz mantiqasini muvaffaqiyatsizliklar zerikarli va kuzatilishi mumkin bo'lgunga qadar mashq qiling.
4. O'ziga xos Minamoto imzochini yaratish, uni haqiqiy XOR bilan moliyalashtirish va faqat o'sha tasdiqlangan operatsiyalarni mainnetga ko'chirish.

## Mulohazalar kitobi bilan davom eting {#continue-with-the-cookbook}

Ushbu qo'llanma yordamida tarmoqni tanlash, imzolashni sozlash va to'lovlarni moliyalashtirish uchun foydalaning. Keyin siz yaratmoqchi bo'lgan dasturning xatti-harakatiga mos keladigan retsept bilan davom eting:

|Maqsad|Resepti |
| --- | --- |
|Taira ni tekshiring va mijozni sozlang | [Taira](/uz/cookbook/connect-to-taira.md) raqamiga ulanish|
|Birinchi yozishni yuboring va natijani tasdiqlang .| [Transaksiyalarni taqdim etish va tekshirish ](/uz/cookbook/submit-and-verify-transactions.md) |
|Ro'yxatdan o'tish va ko'chirish qiymati | [O'zgaruvchan aktivlar](/uz/cookbook/fungible-assets.md) |
|Filtrlangan ilova holatini oʻqing | [Query Ledger State](/uz/cookbook/query-ledger-state.md) |
|Amalga oshirilgan oʻzgarishlarga munosabatda boʻlish | [Stream voqealari](/uz/cookbook/stream-events.md) |

Oziq-ovqat kitobi har bir ish oqimiga e'tibor qaratadi va Taira mablag' yoki SORA Nexus tarmoq kontekstiga muhtoj bo'lganda uni bu yerga bog'laydi.

## 1. Qaysi maqsadlar sari intilayotganingizni tushuning {#_1-understand-what-you-are-setting-up}

SORA Nexus da ma'lumotlar maydonlari tarmoq yo'nalishi va yo'naltirish katalogi tarkibiga kiradi. Mijoz faqat `client.toml` ni o'zgartirgan holda yangi ommaviy ma'lumot maydonini yaratmaydi. Mijozli sozlash ikkita narsani bajaradi:

1. mijozni o'ng Torii oxirgi nuqtaga ko'rsatadi
2. oʻz kanonik hisoboti uchun domen va maʼlumotlar maydonining yoʻnaltirish kontekstini tanlaydi .

`AccountId` har doim kanonik va domensiz. `[account].domain` qiymati `client.toml` yo'nalish va alias kontekstini taqdim etadi; u hisob kimligining bir qismiga aylanmaydi. Aksariyat ilovalar uchun ommaviy `universal` ma'lumotlar maydonidan boshlang. Domen kontekstida `domain.dataspace` shakli ishlatiladi, masalan:

```text
wonderland.universal
```

Agar sizga yangi tashkiliy ma'lumotlar maydonchasi kerak bo'lsa, uni oddiy mijoz hisobidan ro'yxatdan o'tkazishga harakat qilishning o'rniga katalog va yo'nalish taklifini tayyorlang. [Yangi ma'lumot maydonchasini ](#_8-provision-a-new-dataspace) taqdim etishni ko'ring quyida.

## 2. Umumiy Torii yakuniy nuqtani tekshiring. {#_2-check-the-public-torii-endpoint}

Foydalanuvchini sozlashdan oldin maqsadli oxirgi nuqta jonliligini tekshiring.

Taira uchun:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Minamoto uchun:

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Bogʻning aniqlangan maʼlumotlar maydonini va yoʻnalish koʻrinishini tekshiring:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Mainnet uchun `https://minamoto.sora.org/status` bilan bir xil buyruqdan foydalaning.

## Agentlar uchun Taira MCP {#taira-mcp-for-agents}

Taira shuningdek, agentni ishga tushirish vaqtlari uchun Torii-native Model Context Protocol (MCP) ko'prini ochadi. Agentga birinchi navbatda maxsus Torii mijoz qurmasdan turib jonli testnet o'qish, skriptli diagnostika yoki qat'iy ravishda qayta ko'rib chiqilgan yozish repetitsiyalari kerak bo'lganda uni ishlating.

|Oʻrnatish|qiymati |
| --- | --- |
|MCP oxirgi nuqta |`https://taira.sora.org/v1/mcp` |
|Tarmoq ildizlari |`https://taira.sora.org` |
|Maqsadli foydalanish |Taira testnet o'qish va kran mablag'i bilan ta'minlangan yozish repetitsiyalari |
|Ishlab chiqarish ekvivalenti |Ushbu yozuvni Minamoto raqamiga koʻrsatmang , agar asosiy tarmoqning MCP oxirgi nuqtasi va chiqarib tashlash nazoratlari aniq tasdiqlanmagan boʻlsa |

Imzolash materialini qo'shishdan oldin ko'prikning metadatalarini tekshiring:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

URL serverini agent ishga tushirish paytida foydalanuvchiga o'xshagan MCP server sifatida konfiguratsiya qiling. Agentning MCP konfiguratsiyasi, API tokenlari, yuborilgan muallif sarlavhalari, `authority` yoki `private_key` qiymatlarini ushbu hujjat repo yoki dastur repo-ga qo'shmang.

Taira bilan yaxshi ishlaydigan vositachi tezkor qoidalari:

- MCP serveridan vositalarni qo'ng'iroq qilishdan oldin kashf eting; agar server `listChanged` haqida xabar bersa, ularni qayta kashf qiling.
- `iroha.` qurilmalarini xom `torii.` qurilmalariga qaraganda ko'proq yoqadi.
- Faqat o'qishni boshlash: yozishlarni taklif qilishdan oldin holatini, hisob-kitoblarni, aktivlarni, aliaslarni, bloklarni, boshqaruv holati va tranzaksiya holatini tekshirish.
- jonli testnet mutatsiyalaridan oldin aniq inson yo'l-yo'riqini talab qiling. Oldindan imzolangan tranzaksiya zarflari uchun `iroha.transactions.submit_and_wait` dan foydalaning, shunda agent faqat taqdim etishning o'rniga natijani kutadi.
- Agent javobida tranzaksiya hashlari, yakuniy holat va serverni tasdiqlash xatolarini qisqacha ko'rsatish.

### Agentlar bilan rivojlanish ish oqimi {#development-workflow-with-agents}

Agentlarni Iroha mijozlari, tranzaksiya quruvchilar, diagnostika skriptlari va testnet ishga tushirish daftarlari uchun rivojlanish yordamchilari sifatida ishlating. Agentning vakolatini cheklang: u kodni tekshirishi, Taira holatini o'qishi, o'zgarishlarni taklif qilishi va mahalliy sinovlar o'tkazishi mumkin, lekin inson aniq operatsiyani tasdiqlamaguncha jonli tarmoqni mutatsiya qilmasligi kerak.

Amaldagi ish oqimi quyidagilardan iborat:

1. Agent kod yozishdan oldin tegishli hujjatlarni, SDK kodini, CLI buyruqini yoki MCP vosita sxemasini tekshirishni so'rang.
2. Agent birinchi navbatda eng kichik mijoz yo'lini yozsin: holatni tekshirish, hisobni qidirish, alias rezolyutsiyasini yoki balansni qidirish.
3. Transaction-building kodini faqat o'qish uchun qo'ng'iroqlar Taira bilan ishlayotganidan keyin qo'shing.
4. To'g'ridan-to'g'ri jonli tarmoq sinovlarini, masalan `TAIRA_LIVE=1` orqasida o'tkazing, shuning uchun normal birlik sinovlari testnet mablag'larini hech qachon sarflamaydi yoki tarmoq mavjudligiga bog'liq.
5. Agent har qanday tranzaksiyani taqdim etishdan oldin tarmoq ildiz, zanjir, hokimiyat hisobvarag'i, ko'rsatmalarning qisqartmasi, to'lov aktivlari va kutilayotgan holat o'zgarishi haqida xabar berishlarini talab qiling.
6. CI yoki asosiy tarmoq ish oqimlariga ko'tarilishdan oldin sirli ishlash, qayta urinish xatti-harakatlari, idempotency va rad etish xati uchun ishlab chiqarilgan kodni tekshiring.

Ishlab chiqish uchun foydali faqat o'qiladigan MCP vositalar hisobvaraq aktivlarini qidirish, alias rezolyutsiyasi, bloklarni qidirish, tranzaksiyalarni izlash, tranzaksiyalar ro'yxatlari va quvurlarning holatini tekshirishni anglatadi.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### Agentlar orqali operatsiya ish oqimi {#transaction-workflow-through-agents}

O ' zbekiston Respublikasining MCP koʻprik imzolangan hujjatni taqdim etishi mumkin Iroha amal qiladi, ammo bu odatiy bitim talablarini bekor qilmaydi. Transaksiyaga hali ham to'g'ri vakolat, ruxsatnomalar, to'lov mablag'lari, zanjir kerak. ID, Metadatalar va imzo.

Xom Iroha tranzaksiyalari uchun avval tranzaksiya zarfini SDK yoki CLI bilan tuzish va imzolash, so'ngra agentga faqat kanonik imzolangan tranzaksiya bytlari `body_base64` sifatida kodlangan. Agent xotiraga `iroha.transactions.submit_and_wait` yoki `iroha.transactions.submit` va so'rovnoma bilan `iroha.transactions.wait` murojaat qilishi mumkin.

Xususiy kalitlarni agent so'rovnomasiga qo'ymang. Agar agent tranzaksiya tuzish kerak bo'lsa, uni foydalanuvchining ish vaqti sirlarini yuklaydigan mahalliy kodga yozing Agent hech qachon kalit materialni Markdown, fixtures, loglar yoki commitsga yozmasligi kerak.

Transaksiyani taqdim etishdan oldin agentni qisqa tranzaksiya rejasi tuzishga majbur qiling:

- `network`: Taira testnetning ildizi va zanjiri ID
- `authority`: ro'yxatdan o'tgan va to'lovlarni to'laydigan hisob raqami
- `instructions`: ro'yxat, mint, yoqish, o'tkazish, metadotlar, ruxsatnoma yoki shartnoma qo'ng'iroqlari qisqartmasi
- `fee asset`: Taira bo'yicha to'lanadigan aktivlar
- `preflight reads`: allaqachon amalga oshirilgan hisob raqamlari, aktivlar saldi, ruxsatnomalar, alias yoki blok tekshiruvlari
- `expected result`: tasdiqlashdan keyin ko'rinishi kerak bo'lgan holat
- `idempotency`: agar bir xil talabni qayta ko'rib chiqishsa nima bo'ladi

Taqdim qilgandan so'ng agentni terminal holatini kutishga majbur qiling, keyin o'qish so'rovi bilan holat o'zgarishini tasdiqlang.

- Transaksiya hash
- `Committed`, `Applied`, `Rejected` yoki `Expired` kabi terminal holati
- blok yoki qidiruvchining tafsilotlari mavjud bo'lganda
- tekshiruvi o'qiladigan natijalar
- rad etish xabarlari va xato ruxsatnomalar, to'lovlar, tasdiqlash, eskirgan holat yoki oxirgi nuqta mavjudligi kabi ko'rinadimi

Qoʻriqlangan tezlik namuna:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

Imzolangan zarba allaqachon tayyorlanganida:

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

Taira MCP-ni test tarmog'ini boshqarishning ommaviy yuzi sifatida ko'rib chiqish. Taira kalitlari, test tarog'i XOR, kran hisob raqamlari va kanary imzo beruvchilar bir vaqtning o'zida ishlatilishi mumkin va ular Minamoto kalitlaridan va ishlab chiqarishdan chiqarilgan ish oqimlaridan ajralib turishlari kerak.

## Endi sinab ko'rishingiz mumkin bo'lgan o'yinchoq misollari {#toy-examples-you-can-try-now}

Ushbu namunalar faqat o'qiladi, agar qayd etilmagan bo'lsa. Ular kalitlarni ishlab chiqarishdan oldin ishlaydi va ikkala ommaviy tarmoqga ham qarshi ishlash xavfsizdir.

Taira sinov tarmog'i va Minamoto asosiy tarmog'ining salomatligini taqqoslang:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    -H 'Accept: application/json' \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

Taira tomonidan aniqlangan ommaviy ma'lumotlar maydoni yo'nalishlarining ro'yxatini ko'rsatish:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Mainnet ko'rinishi kerak bo'lganda Minamoto ga nisbatan bir xil buyruqni bajaring:

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Dashboard, bot yoki ishga tushirish tekshiruvi uchun kichik Node.js holatni tekshirishni yaratish:

```bash
node --input-type=module <<'EOF'
const roots = {
  taira: 'https://taira.sora.org',
  minamoto: 'https://minamoto.sora.org',
};

for (const [name, root] of Object.entries(roots)) {
  const status = await fetch(`${root}/status`, {
    headers: { Accept: 'application/json' },
  }).then((res) => res.json());
  const publicSpaces = status.teu_lane_commit
    .filter((lane) => lane.visibility === 'public')
    .map((lane) => `${lane.dataspace_alias}:${lane.block_height}`)
    .join(', ');

  console.log(
    `${name}: ${status.blocks} blocks, ${status.queue_size} queued, public spaces ${publicSpaces}`,
  );
}
EOF
```

Birinchi yozish tomoni o'yinchoq Taira faucet da'vosi bo'lishi kerak. U testnetdan foydalanadi XOR va hech qachon Minamoto ga ko'rsatilishi kerak emas.

## 3. Taira mijoz konfiguratsiyasini yaratish. {#_3-create-a-taira-client-config}

Agar sizda allaqachon yoʻq boʻlsa , kalit juftligini yaratish:

```bash
kagami keys --algorithm ed25519 --out-dir ./taira-client-key
```

`taira.client.toml` ni yaratish:

```toml
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
torii_url = "https://taira.sora.org/"

[account]
domain = "wonderland.universal"
profile = "taira"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

Eng yuqori darajadagi `chain` to'g'ri Taira operatsiyalar zanjiri ID. O ' zbekiston Respublikasining `[account].profile = "taira"` moslama mustaqil ravishda tanlaydi Taira I105 zanjir tanqid qiluvchi. ID hisobning profilini tanlamaydi.

Faqat oʻqish uchun tekshiruvni bajaring:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

Yozish testlaridan oldin ommaviy Taira diagnostikani o'tkazing:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Taira hisobini pul to'lashdan oldin kran orqali mablag' bilan ta'minlang. To'g'ridan-to'g'ri kran oqimi [Testnetni XOR Taira](#_4-get-testnet-xor-on-taira).

Kasana talabnomasi qabul qilinganidan va hisobvaraq moliyalashtirilganidan so'ng, Taira kanari o'z navbatida yozish tutun sinovidir:

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

Kanari imzolangan pingni taqdim etadi, tasdiqlanishini kutadi va `--write-config` taqdim etilganda ishga tushirish vaqtini imzolash konfiguratsiyasini yozadi. Taira ommaviy testnet hisoblanadi, agar `taira doctor` to'ylangan navbatni xabar qilsa yoki kanari qaytarib beradi `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`, uni mijoz konfiguratsiyasi xatosi sifatida ko'rib chiqishdan oldin kuting va yana sinab ko'ring.

Qo'riqlanmagan tutun sinovlari uchun kanaryani cheklangan qayta sinab ko'rish to'plamida o'rab oling:

```bash
ok=false
for attempt in 1 2 3 4 5; do
  iroha --config ./taira.client.toml taira write-canary \
    --public-root https://taira.sora.org \
    --write-config ./taira.canary.client.toml \
    --json && ok=true && break

  sleep 60
done

test "$ok" = true
```

Agar `iroha taira doctor` qat'iy xatolarni ko'rsatadi. navbatning to'ldirilishi va to'lovni qabul qilishni rad etish - bu ommaviy test tarmog'i uchun vaqtincha shartlar; DNS, TLS, yoki `status = "fail"` diagnostikasi yo'q.

## SORA Nexus hisobini yaratish ID {#generate-a-sora-nexus-account-id}

A SORA Nexus hisob ID kanonik hisoblanadi I105 hisobning ommaviy kalitidan va maqsadli tarmoq prefiksidan olingan manzil. Bu `[account].domain` mijozdagi qiymat TOML. Bir xil ommaviy kalitning turli xil kodlash IDs bilan Taira va Minamoto, va ishlab chiqarish foydalanuvchilari uchun alohida kalitlar juftligi yaratish kerak Minamoto.

Hisobotni boshqaradigan Ed25519 tugmalarini yaratish yoki yuklash:

```bash
kagami keys --algorithm ed25519 --out-dir ./nexus-account-key
```

Ochiq kalitni Taira hisob raqamiga ID o'zgartirish:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Minamoto ommaviy kalitni "mainnet" prefiksi bilan almashtirish:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Nexus API yoki CLI buyruqida kanonik hisob ID so'ragan har qanday joyda hosil bo'lgan hisobdan ID foydalaning, masalan, Taira kranidan `account_id`; balans so'rovlari, qat'iy hisob maydonlari yoki alias bog'lashlar. O'xshash xususiy kalitni mijoz konfiguratsiyasida saqlang va `[account].profile = "taira"` yoki `[account].profile = "minamoto"` bilan bir xil ommaviy tarmoqni tanlang.

ID ishlab chiqarish o'zidan-o'zi moliyalashtirilgan zanjirdagi hisobni yaratmaydi. Taira da kran testnet yozish uchun hisobni yarata oladi va mablag' bilan ta'minlaydi. Minamoto da, tasdiqlangan asosiy tarmoqlarni o'rnatish yoki xazina oqimidan foydalaning.

### Ochiqlarni saqlash va saqlab turish {#key-storage-and-backup}

Hisobvaraq ID va ommaviy kalitni almashish mumkin. Muvofiq xususiy kalit, maxfiy so'z, urug' va tiklanish materiallari sirli bo'lishi kerak.

SORA Nexus hisob raqamlari uchun ushbu amaliyotlardan foydalaning:

- Xususiy kalitlarni shifrlangan maxfiy so'z boshqaruvchisida, apparat bilan ta'minlangan kalit do'konida yoki maxsus imzolash xizmatida saqlang. Shell tarixida, ro'yxatlarda, suhbatda, chiptalarda yoki shifrlanmagan nusxada kalitlarni manba nazorati uchun qo'ymang.
- Har bir vaft yoki ishlab chiqarish imzochisi uchun o'ziga xos yuqori entropiyali maxfiy so'zni ishlating. Maxfiy so'zlarni kodlangan xususiy kalit bilan bir xil faylda yoki zaxira to'plamida emas, balki parol boshqaruvchida yoki bo'linadigan saqlash jarayonida saqlang.
- Taira va Minamoto kalitlarini alohida saqlang. Taira kalitlarini bir martalik testnet materiallari sifatida, Minamoto kalitlarini esa ishlab chiqarish mablag'lari bo'yicha organlar sifatida ko'ring.
- Xususiy kalit, ommaviy kalit, hisob raqami ID, hisob profili, va imzochini tiklash uchun zarur bo'lgan har qanday hisobni tiklash yoki saqlash notlari. Tarmoq konteksti bo'lmagan xususiy kalitdan tiklash paytida suiiste'mol qilish oson.
- Ishlab chiqarish imzochilari uchun kamida bitta shifrlangan offline ehtiyot qismini va bitta geografik jihatdan alohida shifrlangan ehtiyot qismni saqlang. Tekshiruvdan oldin faqat o'qishga mo'ljallangan kichik operatsiya bilan tiklanish sinovini amalga oshirish.
- Agar xususiy kalit, maxfiy so'z, ehtiyot vositasi yoki imzolash host ko'rsatilgan bo'lsa, imzolani aylantiring yoki almashtiring.

Ko'proq batafsil ma'lumot olish uchun [Storing Cryptographic Keys](/uz/guide/security/storing-cryptographic-keys.md) va [Password Security](/uz/guide/security/password-security.md) ko'ring.

## 4. Testnet-ni XOR -ga Taira orqali olib boring. {#_4-get-testnet-xor-on-taira}

To'g'ridan-to'g'ri ommaviy krandan foydalaning.

1. Imzolovchini yaratish yoki yuklash va uning kanonik Taira hisobini hisoblash ID.
2. Hozirgi kran puzzlini olib keling.
3. Agar `difficulty_bits` `0` dan katta bo'lsa, puzzlingni hal qiling.
4. Kova uchun talabnoma bering.
5. Hisobvaraq yoki aktivlar balansining ko'rinishini kutib, to'lovlarni to'lash uchun yozma xabar yuborishdan oldin.

Umumiy kalitni Taira I105 hisob raqamiga ID o'zgartirish:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Puzzle olib keling:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle \
  -H 'Accept: application/json' \
  | jq .
```

Faucet - bu ommaviy testnet xizmati. Agar bulma-bulma yoki talab bitik nuqtasi `502`, vaqt o'tishi yoki boshqa darvoza darajasi xatosi qaytarsa, kalitlaringizni yoki mijoz konfiguratsiyasini o'zgartirishdan oldin kuting va yana sinab ko'ring.

Javob quyidagi shaklga ega:

```json
{
  "algorithm": "scrypt-leading-zero-bits-v1",
  "difficulty_bits": 8,
  "anchor_height": 741,
  "anchor_block_hash_hex": "05d2...",
  "challenge_salt_hex": null,
  "scrypt_log_n": 13,
  "scrypt_r": 8,
  "scrypt_p": 1,
  "max_anchor_age_blocks": 6
}
```

Agar `difficulty_bits` `0` bo'lsa, faqat ID hisobini taqdim eting:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}' \
  | tee ./taira-faucet-response.json \
  | jq .
```

`difficulty_bits` `0` dan katta bo'lganda, bulutni hal qiling va ankor balandligi qo'shimcha nonce kiritilsin:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{
    "account_id": "<TAIRA_I105_ACCOUNT_ID>",
    "pow_anchor_height": 741,
    "pow_nonce_hex": "<NONCE_HEX>"
  }' \
  | tee ./taira-faucet-response.json \
  | jq .
```

Puzzle algoritmi quyidagicha:

1. Tushkunlikni SHA-256 sifatida ko'rsatish:
   - `iroha:accounts:faucet:pow:v2` byetlari
   - UTF-8 hisob raqami ID
   - `anchor_height` sifatida katta-endyan `u64`
   - `anchor_block_hash_hex` baytlar sifatida kodlangan
   - `challenge_salt_hex` mavjud bo'lganda baytlar sifatida kodlangan
2. `u64` nonces ko'p-endian 8-bayt qiymatlari sifatida kodlangan harakat qiling.
3. Har bir nonce uchun skriptni quyidagicha ishlating:
   - maxfiy soʻz: 8-baytli nonce
   - tuz: 32 baytli qiyinchilik
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - Ishlab chiqarish uzunligi: 32 byt
4. G'alaba qozonadigan nonce kamida `difficulty_bits` ning nol bitlarga yetakchi bo'lgan birinchi digest.

Fauxet javobida moliyalashtirilgan aktiv va navbatdagi tranzaksiya hashlari o'rnatiladi:

```json
{
  "account_id": "<TAIRA_I105_ACCOUNT_ID>",
  "asset_definition_id": "<TAIRA_FEE_ASSET_DEFINITION_ID>",
  "asset_id": "...",
  "amount": "<FUNDED_AMOUNT>",
  "tx_hash_hex": "...",
  "status": "QUEUED"
}
```

Javob hozirda HTTP `202 Accepted` bilan qaytarilmoqda. Uning `asset_definition_id` - bu ommaviy kran tomonidan moliyalashtiriladigan joriy Taira to'lov aktividir; uni javobdan nusxa olishning o'rniga ID namunasidan olib tashlang. Faxt `tx_hash_hex` va `status: "QUEUED"` qaytarib berganda so'rovni qabul qildi.

Soʻngra oʻzingizning toʻlovlarni toʻlash boʻyicha operatsiyalaringizni taqdim etishdan oldin moliyalashtirilgan aktivni soʻrab oling:

```bash
TAIRA_FEE_ASSET_DEFINITION=$(
  jq -er '.asset_definition_id' ./taira-faucet-response.json
)

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET_DEFINITION" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

Agar faucet uchun talabnoma qabul qilingan bo'lsa, ammo hisob yoki aktiv hali ko'rinmasa, Transaksiya hali ham testnet navbatini qayta ishlashda davom etmoqda. Yozuvlarni yuborishdan oldin o'qishni qayta sinab ko'ring.

Ishga tayyor bo'lgan to'g'ridan-to'g'ri API tekshiruvi uchun buni `taira_faucet_claim.py` sifatida saqlang va Taira I105 hisob raqamiga ID o'ting:

```python
#!/usr/bin/env python3
import hashlib
import json
import sys
import urllib.request


def has_leading_zero_bits(digest: bytes, bits: int) -> bool:
    full, rem = divmod(bits, 8)
    if digest[:full] != b"\0" * full:
        return False
    return rem == 0 or digest[full] >> (8 - rem) == 0


root = "https://taira.sora.org"
account_id = sys.argv[1]

puzzle_request = urllib.request.Request(
    f"{root}/v1/accounts/faucet/puzzle",
    headers={"Accept": "application/json"},
)

with urllib.request.urlopen(puzzle_request) as res:
    puzzle = json.load(res)

claim = {"account_id": account_id}
difficulty = int(puzzle["difficulty_bits"])

if difficulty > 0:
    challenge = hashlib.sha256()
    challenge.update(b"iroha:accounts:faucet:pow:v2")
    challenge.update(account_id.encode())
    challenge.update(int(puzzle["anchor_height"]).to_bytes(8, "big"))
    challenge.update(bytes.fromhex(puzzle["anchor_block_hash_hex"]))
    if puzzle.get("challenge_salt_hex"):
        challenge.update(bytes.fromhex(puzzle["challenge_salt_hex"]))

    n = 1 << int(puzzle["scrypt_log_n"])
    r = int(puzzle["scrypt_r"])
    p = int(puzzle["scrypt_p"])
    salt = challenge.digest()

    for nonce in range(1_000_000):
        nonce_bytes = nonce.to_bytes(8, "big")
        digest = hashlib.scrypt(nonce_bytes, salt=salt, n=n, r=r, p=p, dklen=32)
        if has_leading_zero_bits(digest, difficulty):
            claim["pow_anchor_height"] = puzzle["anchor_height"]
            claim["pow_nonce_hex"] = nonce_bytes.hex()
            break
    else:
        raise SystemExit("faucet nonce not found")

request = urllib.request.Request(
    f"{root}/v1/accounts/faucet",
    data=json.dumps(claim).encode(),
    headers={"Accept": "application/json", "content-type": "application/json"},
    method="POST",
)

with urllib.request.urlopen(request) as res:
    print(json.dumps(json.load(res), indent=2))
```

Fauxet faqat Taira testnet mablag'lari uchun ishlatiladi. XOR testnetdan, fauxet hisoblaridan yoki Taira kanary imzolaridan foydalanmang Minamoto oqimlarida.

## 5. Minamoto mijoz konfigini yaratish {#_5-create-a-minamoto-client-config}

&amp; amp; uchun alohida tugmalar birikmasidan foydalanish Minamoto. Qayta ishlatmang . Taira asosiy tarmog'i kalitlari.

`minamoto.client.toml` ni yaratish:

```toml
chain = "00000000-0000-0000-0000-000000000753"
torii_url = "https://minamoto.sora.org/"

[account]
domain = "wonderland.universal"
profile = "minamoto"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

Eng yuqori darajadagi `chain` joriy bo ' lsa Nexus asosiy tarmoq zanjirlari ID. `[account].profile = "minamoto"` tanlaydi Minamoto I105 zanjirni farqlovchi; oxirgi nuqta o'rinbosari nomi va zanjir ID uni yonma-yon tanlamang.

Minamoto ommaviy kalitini uning kanonik I105 hisob raqamiga ID mainnet prefiksi bilan o'zgartiring:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Hisobvaraqni o'qish-o'qish bilan ta'minlash va moliyalashtirish uchun asosiy tarmoqga kirish yoki boshqaruv oqimi orqali mablag' ajratilmaguncha faqat o'qib chiqish tomonini tekshirish:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

Taira kranini yoki yozish yordamchisini Minamoto ga qarshi ishlatmang.

## 6. Minamoto hisobvarag'ini XOR bilan ta'minlash {#_6-fund-a-minamoto-account-with-xor}

Minamoto to'lovlari XOR ishlab chiqarish bilan to'lanadi va Minamoto da ommaviy kran yo'q. Konfiguratsiya qilingan hisobvaraqni mainnetga o'rnatish yoki xazinani o'tkazish orqali moliyalashtiring yoki mavjud mablag' bilan ta'minlangan Minamoto hisobvarag'idan XOR oling.

Yozib olishni taqdim etishdan oldin ID kanonik hisobini va moliyalashtirishni faqat o'qiladigan tekshirishlar bilan tekshirib ko'ring. Minamoto XOR ni ishlab chiqarish mablag'lari sifatida qabul qiling: birinchi navbatda Taira da bir xil operatsiyani mashg'ul qiling, alohida ishlab chiqarish kalitlarini saqlang va asosiy tarmoq muomalasi qayta tiklanishi mumkin deb taxmin qilmang.

Taira XOR Minamoto to'lovlarini to'lay olmaydi. Testnet saldi va kran talablari Minamoto ga o'tkazilamaydi.

## 7. Mavjud ma'lumotlar maydonida ishlash {#_7-work-inside-an-existing-dataspace}

Ma'lumotlar maydonida yashovchi katta daftar ob'ektlari uchun to'liq malakali domen nomlaridan foydalaning. Masalan, ommaviy ma'lumotlar maydonidagi loyiha domenidan foydalanish kerak:

```text
apps.universal
```

Hisobotingiz kerakli ruxsatlarga ega bo'lganidan so'ng, domen uchun sirsiz `AliasSetupPlanRequestV1` niyat yarating va deklarativ rejalashtiruvchini ishlating:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

Minamoto uchun alohida asosiy tarmoq niyati va rejasi ishlab chiqiladi va tasdiqlanadi. Rejalar o'zlarining zanjirlari, vakolatlari, jonli davlat anchorligi va muddatlariga bog'liq, shuning uchun Taira rejasini targ'ib qilish yoki takrorlash mumkin emas:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

Hisobvaraq aliaslari bir xil ma'lumotlar maydonining suffixidan foydalanadi:

```text
alice@apps.universal
alice@universal
```

Katta hisob maydonlari hali ham kanonikdan foydalanadi I105 hisob IDs. Aliaslarni inson o'qishi mumkin bo'lgan bog'liqliklar sifatida qabul qiling, ular kanonik hisobda hal qilinadi IDs.

## 8. Yangi ma'lumotlar maydonini yaratish {#_8-provision-a-new-dataspace}

Yangi ma'lumotlar maydoni operator va boshqaruv o'zgarishidir. Umumiy Torii oxirgi nuqtasi trafikni konfiguratsiyalangan ma'lumot maydonlariga yo'naltirish mumkin, ammo u noma'lum ma'lumot maydonlari aliaslarini rad etadi.

O'zgarishlarni tayyorlashdan oldin, amaldagi jonli katalogni o'qing:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Operator hisobini ko'rsatish uchun yo'l manifesti holatini ham tekshiring:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

Yo'nalish ID, ma'lumotlar maydoni ID, tasdiqlovchi moslama, xato tolerantligi, manifest, yo'naltirish qoidalari va operatsion egasi birgalikda ko'rib chiqilmagan bo'lsa, yangi aliasni targ'ib qilmang. Kerakli ruxsatnomalarga ega bo'lgan odatiy foydalanuvchi hisobi mavjud ma'lumotlar maydonida domen sotib olish va SNS ijaraga olish mumkin; u yangi ommaviy ma'lumotni xavfsiz qo'sholmaydi.

Xususiy yoki tashkiliy ma'lumotlar maydonchasi uchun katalog o'zgartirishni quyidagilar bilan tayyorlang:

- yagona ma'lumotlar maydonining aliasi va raqamli `id`
- to'g'ri yo'nalishdagi kirish yoki mavjud yo'nalishda berilgan vazifa
- ma'lumotlar maydoni `fault_tolerance`
- yo'naltirish qoidalari u yerga tushishi kerak bo'lgan ko'rsatmalar yoki hisob maydonlari uchun
- ma'lumotlar maydoni UAID qobiliyatlarini ochib berganda Space Directory manifest yoki tenglashtirilgan ishga tushirish dalillari;
- Validator, muvofiqlik, hisob-kitob qilish va monitoring siyosati uchun boshqaruv ma'qullanishi

Tekshirilishi mumkin boʻlgan konfig fragment quyidagicha koʻrinadi:

```toml
[[nexus.lane_catalog]]
index = 5
alias = "payments"
description = "Payments lane"
dataspace = "payments"
visibility = "public"
metadata = {}

[[nexus.dataspace_catalog]]
alias = "payments"
id = 20
description = "Payments dataspace"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "payments"
[nexus.routing_policy.rules.matcher]
account_prefix = "payments."
description = "Route payments domains to the payments dataspace"
```

Operatorning qabul qilishida quyidagi darvozalar bo'lishi kerak:

- `iroha3d --sora --config <config.toml> --trace-config` hal qilingan nod konfiguratsiyasini o'tkazadi
- hosil qilingan yoki ko'rib chiqilgan manifest hash va imzolar bilan arxivlanadi.
- tutun sinovlari oʻtadi Taira har qanday Minamoto rag'batlantirish
- o'zgarishdan keyingi `/status` katalogida belgilangan yo'nalish va ma'lumotlar maydoni ko'rsatilgan;
- `iroha app nexus lane-report --summary` talab qilingan manifestlar yo'qolganligini bildirmaydi

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

Xuddi shu ma'lumotlar maydonini Minamoto ga faqat Taira ishga tushirilishi, tutun sinovlari, monitoring va boshqaruv dalillari to'liq bo'lganidan so'ng targ'ib qilish.

## Bogʻliq sahifalar {#related-pages}

- [Iroha 3](/uz/get-started/install-iroha.md) o'rnatish
- [Iroha 3 orqali CLI](/uz/get-started/operate-iroha-via-cli.md) orqali harakatlaning
- [Xususiy ma'lumotlar maydoni uchun sponsorlik to'lovlari](/uz/get-started/private-dataspace-fee-sponsor.md)
- [Torii oxirgi nuqtalari](/uz/reference/torii-endpoints.md)
- [Ibtido ko'rsatkichi](/uz/reference/genesis.md)
