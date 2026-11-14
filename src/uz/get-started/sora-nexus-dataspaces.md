---
translation_locale: uz
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 3d2285e5a27819897b6dcc6d165c468baead29d2922420728fcfbe2433d36fdd
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# SORA Nexus asosida yarating: Taira va Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA Nexus Iroha 3 asosidagi ochiq joylashtirish yo‘llarini beradi. Avval Taira tarmog‘ida yarating va mashq qiling, so‘ng faqat alohida mainnet kalitlari, komissiyalar uchun haqiqiy XOR va ishlab chiqarishga ruxsat bo‘lganda ayni mijoz shaklini Minamoto tarmog‘iga ko‘chiring.

Bu qo‘llanma ochiq SORA Nexus tarmoqlari uchun Iroha mijozini sozlashni ko‘rsatadi:

- Taira sinov tarmog'i `https://taira.sora.org`
- Minamoto asosiy tarmoq `https://minamoto.sora.org`

Taira ni integratsiya sinovlari, kran mablag'i bilan ta'minlangan yozish kanarlari va ishga tushirish mashg'ulotlari uchun ishlating. Minamoto-ni faqat ishlab chiqarish tayyor bo'lgan asosiy tarmoq faoliyati uchun foydalaning. Ikkala tarmog'i ham XOR da to'lovlarni oladi:

- Taira ommaviy krandan testnet XOR foydalanadi.
- Minamoto haqiqiy ishlatiladi XOR. Yoʻq Minamoto faucet.

## Qurilish yo'li {#builder-path}

|qadam |Taira Testnet |Minamoto Asosiy |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|Tarmoqning holatini oʻqishni boshlash |`/status` kalitsiz so'rovlar |`/status` kalitsiz so'rovlar |
| Ma’lumotlar makonini tanlash | Ilovaga governance boshqaradigan yo‘lak kerak bo‘lmasa, ochiq `universal`dan foydalaning | Ayni ma’lumotlar makonidan faqat mainnet ruxsatidan keyin foydalaning |
|Toʻlov aktivini oling .|Ommaviy Taira krandan foydalanish |XOR mablag ' bilan ta ' minlangan Minamoto hisobidan yoki tasdiqlangan xazina oqimidan oling |
| Sinov yozuvlari | Sinov uchun ajratilgan XOR mablag‘idan foydalaning | Sinov vositalarini ishlatmang; yozuvlar haqiqiy XOR sarflaydi |
|Taʼlim berish |Logika, monitoring va imzolashni qayta sinab ko'ring |alohida kalitlar, moliyalashtirish va ozod qilish nazoratlaridan foydalanish |

Amaliy oqim quyidagicha:

1. Mijozni Taira tarmog‘iga mos yarating va ochiq `universal` ma’lumotlar makonidan foydalaning.
2. Imzolovchi qo'shing va Taira kran bilan moliyalashtiring.
3. Nosozliklar odatiy va kuzatiladigan holga kelguncha ilova mantiqingizni Taira da sinab ko‘ring.
4. O'ziga xos Minamoto imzochini yaratish, uni haqiqiy XOR bilan moliyalashtirish va faqat o'sha tasdiqlangan operatsiyalarni mainnetga ko'chirish.

## Mulohazalar kitobi bilan davom eting {#continue-with-the-cookbook}

Ushbu qo'llanma yordamida tarmoqni tanlash, imzolashni sozlash va to'lovlarni moliyalashtirish uchun foydalaning. Keyin siz yaratmoqchi bo'lgan dasturning xatti-harakatiga mos keladigan retsept bilan davom eting:

|Maqsad|Resepti |
| --- | --- |
|Taira ni tekshiring va mijozni sozlang | [Taira](/uz/cookbook/connect-to-taira.md) raqamiga ulanish|
|Birinchi yozishni yuboring va natijani tasdiqlang .| [Transaksiyalarni taqdim etish va tekshirish ](/uz/cookbook/submit-and-verify-transactions.md) |
|Ro'yxatdan o'tish va ko'chirish qiymati | [O'zgaruvchan aktivlar](/uz/cookbook/fungible-assets.md) |
|Filtrlangan ilova holatini oʻqing | [Reyestr holatini so‘rash](/uz/cookbook/query-ledger-state.md) |
|Tasdiqlangan oʻzgarishlarga munosabatda boʻlish | [Stream voqealari](/uz/cookbook/stream-events.md) |

Oziq-ovqat kitobi har bir ish oqimiga e'tibor qaratadi va Taira mablag' yoki SORA Nexus tarmoq kontekstiga muhtoj bo'lganda uni bu yerga bog'laydi.

## 1. Qaysi maqsadlar sari intilayotganingizni tushuning {#_1-understand-what-you-are-setting-up}

SORA Nexus tizimida ma’lumotlar makoni katalogi ma’lumotlar makonlarini belgilaydi. Yo‘lak katalogi yo‘laklarni alohida belgilaydi: har bir yo‘lak bitta ma’lumotlar makoniga havola qiladi, ma’lumotlar makonida esa bir nechta yo‘lak bo‘lishi mumkin. Mijoz faqat `client.toml`ni o‘zgartirib yangi ochiq ma’lumotlar makonini yaratmaydi. Mijozni sozlash ikki ishni bajaradi:

1. mijozni o'ng Torii oxirgi nuqtaga ko'rsatadi
2. kanonik hisobi uchun tarmoq konteksti va imzolash kalitini tanlaydi

`AccountId` doimo kanonik va domensiz, `client.toml`da esa domen sozlamasi yo‘q: `[account].profile` faqat tarmoqning I105 prefiksini tanlaydi. Domen konteksti taxalluslar va domenga tegishli obyektlarga taalluqli. Ko‘pchilik ilovalar uchun ochiq `universal` ma’lumotlar makonidan boshlang. Domen konteksti `domain.dataspace` shaklidan foydalanadi, masalan:

```text
wonderland.universal
```

Tashkilot uchun yangi ma’lumotlar makoni kerak bo‘lsa, uni oddiy mijoz hisobidan ro‘yxatdan o‘tkazishga urinish o‘rniga katalog va marshrutlash taklifini tayyorlang. Quyidagi [Yangi ma’lumotlar makonini yaratish](#_8-provision-a-new-data-space)ga qarang.

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

Tugun taqdim etgan ma’lumotlar makoni va yo‘lak ko‘rinishini tekshiring:

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

Ko‘prik faqat holatsiz JSON-RPC `POST` so‘rovlarini qabul qiladi. Imzolash materialini qo‘shishdan oldin uning topish metadatasini tekshiring:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'MCP-Protocol-Version: 2026-07-28' \
  -H 'Mcp-Method: server/discover' \
  -d '{"jsonrpc":"2.0","id":1,"method":"server/discover","params":{"_meta":{"io.modelcontextprotocol/protocolVersion":"2026-07-28","io.modelcontextprotocol/clientCapabilities":{}}}}' \
  | jq '{versions: .result.supportedVersions, server: .result._meta["io.modelcontextprotocol/serverInfo"].name, toolset: .result.capabilities.extensions["org.hyperledger.iroha/tools"].toolsetVersion}'
```

URL serverini agent ishga tushirish paytida foydalanuvchiga o'xshagan MCP server sifatida konfiguratsiya qiling. Agentning MCP konfiguratsiyasi, API tokenlari, yuborilgan autentifikatsiya sarlavhalari, `authority` yoki `private_key` qiymatlarini ushbu hujjat repo yoki dastur repo-ga qo'shmang.

Taira bilan yaxshi ishlaydigan vositachi tezkor qoidalari:

- MCP serveridan vositalarni qo'ng'iroq qilishdan oldin kashf eting; agar server `listChanged` haqida xabar bersa, ularni qayta kashf qiling.
- `iroha.*` qurilmalarini xom `torii.*` qurilmalariga qaraganda ko'proq yoqadi.
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
5. Agent har qanday tranzaksiyani taqdim etishdan oldin tarmoq ildiz, zanjir, vakolat hisobvarag'i, ko'rsatmalarning qisqartmasi, to'lov aktivlari va kutilayotgan holat o'zgarishi haqida xabar berishlarini talab qiling.
6. CI yoki asosiy tarmoq ish oqimlariga ko'tarilishdan oldin sirli ishlash, qayta urinish xatti-harakatlari, idempotency va rad etish xati uchun ishlab chiqarilgan kodni tekshiring.

Ishlab chiqish uchun foydali faqat o'qiladigan MCP vositalar hisobvaraq aktivlarini qidirish, alias rezolyutsiyasi, bloklarni qidirish, tranzaksiyalarni izlash, tranzaksiyalar ro'yxatlari va konveyerlarning holatini tekshirishni anglatadi.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### Agentlar orqali operatsiya ish oqimi {#transaction-workflow-through-agents}

MCP ko‘prigi imzolangan Iroha tranzaksiyasini yubora oladi, lekin odatiy tranzaksiya talablarini bekor qilmaydi. Tranzaksiyaga baribir to‘g‘ri vakolat, ruxsatlar, komissiya mablag‘i, zanjir ID si, metadata va imzo kerak.

Xom Iroha tranzaksiyalari uchun avval tranzaksiya zarfini SDK yoki CLI bilan tuzish va imzolash, so'ngra agentga faqat kanonik imzolangan tranzaksiya bytlari `body_base64` sifatida kodlangan. Agent xotiraga `iroha.transactions.submit_and_wait` yoki `iroha.transactions.submit` va so'rovnoma bilan `iroha.transactions.wait` murojaat qilishi mumkin.

Xususiy kalitlarni agent so‘roviga qo‘ymang. Agar agent tranzaksiya tuzishi kerak bo‘lsa, uni foydalanuvchining ish muhiti, keychain, apparat imzolagichi yoki e’tibordan chiqarilgan testnet konfiguratsiya faylidan sirlarni yuklaydigan mahalliy kodga yo‘naltiring. Agent kalit materialini hech qachon Markdown, sinov ma’lumotlari-lar, loglar yoki commit-larga yozmasligi kerak.

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

Taira taqdim etgan ochiq ma’lumotlar makoni yo‘laklarini sanang:

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
# The exact `network_id` from https://taira.sora.org/v1/accounts/capabilities
network_id = "hash:4978D0BD15FC32B834672B27BBD8A03653B1DF060A1EEE7E9374D29AF3886D91#6774"
torii_url = "https://taira.sora.org/"

[account]
profile = "taira"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

Yuqori darajadagi `chain` — Taira tranzaksiyalarining aniq zanjir ID si, `network_id` esa har bir imzo bog‘lanadigan aniq tarmoq identifikatori. `network_id` yoki `network_id_file`dan aniq bittasini sozlang. `[account].profile = "taira"` sozlamasi Taira I105 zanjir diskriminantini mustaqil tanlaydi. Zanjir ID si hisob profilini tanlamaydi.

Faqat oʻqish uchun tekshiruvni bajaring:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

Yozish testlaridan oldin ommaviy Taira diagnostikani o'tkazing:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Komissiyali yozish amallaridan oldin Taira hisobini faucet orqali moliyalashtiring. Oldindan tayyorlashga asoslangan faucet jarayoni [Taira tarmog‘ida testnet XOR oling](#_4-get-testnet-xor-on-taira)da keltirilgan.

Hisob moliyalashtirilgach, imzolangan log ko‘rsatmasi ixtiyoriy dastlabki yozish tekshiruvi bo‘la oladi. Har bir yuboriladigan tranzaksiya komissiya to‘lovchisini ko‘rsatadi, CLI esa imzolashdan oldin aniq komissiyani hisoblatadi:

```bash
iroha --config ./taira.client.toml --fee-payer authority \
  tx ping --msg "taira smoke test"
```

Buyruq tasdiqni kutadi. Taira ochiq testnet, shuning uchun faucet ishlasa ham navbat to‘lishi pingni muvaffaqiyatsiz qilishi mumkin. `taira doctor` navbat to‘lganini bildirsa yoki ping `PRTRY:NEXUS_FEE_ADMISSION_REJECTED` qaytarsa, buni mijoz sozlamasi xatosi deb hisoblashdan oldin kuting va qayta urining.

Nazorat qilinmaydigan dastlabki sinovlarda pingni cheklangan qayta urinish sikliga o‘rang:

```bash
ok=false
for attempt in 1 2 3 4 5; do
  iroha --config ./taira.client.toml --fee-payer authority \
    tx ping --msg "taira smoke test" && ok=true && break

  sleep 60
done

test "$ok" = true
```

Agar `iroha taira doctor` qat'iy xatolarni ko'rsatadi. navbatning to'ldirilishi va to'lovni qabul qilishni rad etish - bu ommaviy test tarmog'i uchun vaqtincha shartlar; DNS, TLS, yoki `status = "fail"` diagnostikasi yo'q.

## SORA Nexus hisobini yaratish ID {#generate-a-sora-nexus-account-id}

SORA Nexus hisob ID si — hisob ochiq kaliti va maqsad tarmoq prefiksidan hosil qilingan kanonik I105 manzili. Ayni ochiq kalit Taira va Minamoto tarmoqlarida turli ID larga kodlanadi, ishlab chiqarish foydalanuvchilari esa Minamoto uchun alohida kalit juftini yaratishi kerak.

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

SORA Nexus API yoki CLI buyrug‘i kanonik hisob ID sini so‘ragan har joyda, masalan balans so‘rovlari, qat’iy hisob maydonlari yoki taxallus bog‘lanishlarida, hosil bo‘lgan hisob ID sidan foydalaning. Mos maxfiy kalitni mijoz sozlamasida saqlang va `[account].profile = "taira"` yoki `[account].profile = "minamoto"` bilan ayni ochiq tarmoqni tanlang.

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

Ko'proq batafsil ma'lumot olish uchun [Kriptografik kalitlarni saqlash](/uz/guide/security/storing-cryptographic-keys.md) va [Maxfiy soʻzlar xavfsizligi](/uz/guide/security/password-security.md) ko'ring.

## 4. Taira-da test XOR oling {#_4-get-testnet-xor-on-taira}

CLI ning oldindan tayyorlashga asoslangan faucet jarayoni bilan testnet XOR talab qiling. Faucet `taira.client.toml`da sozlangan hisobni moliyalashtiradi va u mavjud bo‘lmasa, avval ro‘yxatdan o‘tkazadi. Jarayon:

1. Faucetning ochiq siyosatini o‘qing: faucet vakolati, komissiya aktivi va miqdor.
2. Talabni tayyorlang. CLI ish isbotini yechadi, Torii tayyorlab imzolagan aniq tranzaksiyani tekshiradi va uni yubormasdan maxfiy jurnal katalogiga saqlaydi.
3. Saqlangan tranzaksiyani bir marta yuboring.
4. Komissiyali yozishlarni yuborishdan oldin aktiv balansi ko‘rinishini kuting.

Siyosatni o‘qing:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
  -H 'Accept: application/json' \
  | tee ./taira-faucet-policy.json \
  | jq .
```

Javob quyidagi shaklga ega:

```json
{
  "schema_version": 1,
  "network_id": "hash:4978D0BD15FC32B834672B27BBD8A03653B1DF060A1EEE7E9374D29AF3886D91#6774",
  "network_prefix": 369,
  "authority": "<TAIRA_FAUCET_AUTHORITY_I105>",
  "asset_definition_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
  "amount": "25000"
}
```

Siyosat imzolanmagan topish ma’lumotidir. Avtomatlashtirish har bir javobga ishonish o‘rniga kutilgan vakolat, aktiv ta’rifi va miqdorni mahkamlashi kerak. `prepare` siz bergan qiymatlardan farq qiladigan tayyorlangan tranzaksiyani rad etadi.

Talabni tayyorlang va yuboring:

```bash
export TAIRA_FEE_ASSET="$(
  jq -er '.asset_definition_id' ./taira-faucet-policy.json
)"

iroha --config ./taira.client.toml --fee-payer authority \
  taira account faucet prepare \
  --journal ./taira-faucet \
  --issuer "$(jq -er '.authority' ./taira-faucet-policy.json)" \
  --asset-definition "$TAIRA_FEE_ASSET" \
  --amount "$(jq -er '.amount' ./taira-faucet-policy.json)"

iroha --config ./taira.client.toml \
  taira account faucet submit --journal ./taira-faucet
```

`prepare` jurnal katalogini maxfiy yaratadi va mavjudini almashtirishni rad etadi, shuning uchun har bir talab uchun yangi katalogdan foydalaning. Faucet — ochiq testnet xizmati. `submit` `Pending` bildirsa, vaqt tugasa yoki `502` olsa, yana bir talab tayyorlash o‘rniga ayni sozlama va jurnal bilan `taira account faucet resume`ni bajaring. Eskirgan ish isboti tayanchi `prepare`ni muvaffaqiyatsiz qiladi; yangi jurnal katalogida qayta tayyorlang.

Soʻngra oʻzingizning toʻlovlarni toʻlash boʻyicha operatsiyalaringizni taqdim etishdan oldin moliyalashtirilgan aktivni soʻrab oling:

```bash
iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

Talab qo‘llangan, lekin aktiv hali ko‘rinmayotgan bo‘lsa, yozish yuborishdan oldin kuting va o‘qishni takrorlang.

Fauxet faqat Taira testnet mablag'lari uchun ishlatiladi. XOR testnetdan, fauxet hisoblaridan yoki Taira kanary imzolaridan foydalanmang Minamoto oqimlarida.

## 5. Minamoto mijoz konfigini yaratish {#_5-create-a-minamoto-client-config}

&amp; amp; uchun alohida tugmalar birikmasidan foydalanish Minamoto. Qayta ishlatmang . Taira asosiy tarmog'i kalitlari.

`minamoto.client.toml` ni yaratish:

```toml
chain = "00000000-0000-0000-0000-000000000753"
# The exact `network_id` from https://minamoto.sora.org/v1/accounts/capabilities
network_id = "<MINAMOTO_NETWORK_ID>"
torii_url = "https://minamoto.sora.org/"

[account]
profile = "minamoto"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

Yuqori darajadagi `chain` — joriy SORA Nexus mainnet zanjir ID si, `network_id` esa Minamoto tarmog‘ining aniq identifikatori; uni birinchi imzolangan amaldan oldin imkoniyatlar marshrutidan o‘qing. `[account].profile = "minamoto"` Minamoto I105 zanjir diskriminantini tanlaydi; endpoint host nomi va zanjir ID si uni yashirin tarzda tanlamaydi.

Minamoto ommaviy kalitini uning kanonik I105 hisob raqamiga ID mainnet prefiksi bilan o'zgartiring:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Hisobvaraqni o'qish-o'qish bilan ta'minlash va moliyalashtirish uchun asosiy tarmoqga kirish yoki boshqaruv oqimi orqali mablag' ajratilmaguncha faqat o'qib chiqish tomonini tekshirish:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

Taira faucet yoki dastlabki yozish sinovi buyruqlarini Minamoto tarmog‘iga qarshi ishlatmang.

## 6. Minamoto hisobvarag'ini XOR bilan ta'minlash {#_6-fund-a-minamoto-account-with-xor}

Minamoto to'lovlari XOR ishlab chiqarish bilan to'lanadi va Minamoto da ommaviy kran yo'q. Konfiguratsiya qilingan hisobvaraqni mainnetga o'rnatish yoki xazinani o'tkazish orqali moliyalashtiring yoki mavjud mablag' bilan ta'minlangan Minamoto hisobvarag'idan XOR oling.

Yozib olishni taqdim etishdan oldin ID kanonik hisobini va moliyalashtirishni faqat o'qiladigan tekshirishlar bilan tekshirib ko'ring. Minamoto XOR ni ishlab chiqarish mablag'lari sifatida qabul qiling: birinchi navbatda Taira da bir xil operatsiyani mashg'ul qiling, alohida ishlab chiqarish kalitlarini saqlang va asosiy tarmoq muomalasi qayta tiklanishi mumkin deb taxmin qilmang.

Taira XOR Minamoto to'lovlarini to'lay olmaydi. Testnet saldi va kran talablari Minamoto ga o'tkazilamaydi.

## 7. Mavjud ma’lumotlar makonida ishlash {#_7-work-inside-an-existing-data-space}

Ma’lumotlar makonidagi reyestr obyektlari uchun to‘liq aniqlashtirilgan domen nomlarini ishlating. Masalan, ochiq ma’lumotlar makonidagi loyiha domeni quyidagicha bo‘lishi kerak:

```text
apps.universal
```

Hisobotingiz kerakli ruxsatlarga ega bo'lganidan so'ng, domen uchun sirsiz `AliasSetupPlanRequestV1` niyat yarating va deklarativ rejalashtiruvchini ishlating:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

Minamoto uchun alohida asosiy tarmoq niyati va rejasi ishlab chiqiladi va tasdiqlanadi. Rejalar o'zlarining zanjirlari, vakolatlari, jonli holat anchorligi va muddatlariga bog'liq, shuning uchun Taira rejasini targ'ib qilish yoki takrorlash mumkin emas:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

Hisob taxalluslari ayni ma’lumotlar makoni suffiksini ishlatadi:

```text
alice@apps.universal
alice@universal
```

Katta hisob maydonlari hali ham kanonikdan foydalanadi I105 hisob IDs. Aliaslarni inson o'qishi mumkin bo'lgan bog'liqliklar sifatida qabul qiling, ular kanonik hisobda hal qilinadi IDs.

## 8. Yangi ma’lumotlar makonini yaratish {#_8-provision-a-new-data-space}

Yangi ma’lumotlar makoni operator va boshqaruv darajasidagi o‘zgarishdir. Ochiq Torii endpointi trafikni sozlangan ma’lumotlar makonlariga yo‘naltira oladi, lekin noma’lum ma’lumotlar makoni taxalluslarini rad etadi.

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

Yo‘lak ID si, ma’lumotlar makoni ID si, validatorlar to‘plami, xatoga chidamlilik, manifest, marshrutlash qoidalari va amaliy mas’ul birgalikda ko‘rib chiqilmaguncha yangi taxallusni ishga kiritmang. Kerakli ruxsatlarga ega oddiy foydalanuvchi hisobi taxallus rejalashtiruvchisi orqali mavjud ma’lumotlar makoni ichida domen va uning SNS ijarasini olishi mumkin; u xavfsiz tarzda yangi ochiq ma’lumotlar makonini qo‘sha olmaydi.

Xususiy yoki tashkilot ma’lumotlar makoni uchun quyidagilarni o‘z ichiga olgan katalog o‘zgarishini tayyorlang:

- noyob ma’lumotlar makoni taxallusi va raqamli `id`
- to'g'ri yo'nalishdagi kirish yoki mavjud yo'nalishda berilgan vazifa
- ma’lumotlar makonining `fault_tolerance` qiymati
- yo'naltirish qoidalari u yerga tushishi kerak bo'lgan ko'rsatmalar yoki hisob maydonlari uchun
- ma’lumotlar makoni UAID imkoniyatlarini taqdim etsa, makonlar katalogi manifesti yoki unga teng joriy qilish dalillari
- validatorlar, muvofiqlik, hisob-kitob va kuzatuv siyosati uchun boshqaruv tasdig‘i

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
instruction = "transfer::asset"
description = "Route asset transfers to the payments dataspace"
```

Operatorning qabul qilishida quyidagi darvozalar bo'lishi kerak:

- `iroha3d --sora --config <config.toml> --trace-config` hal qilingan nod konfiguratsiyasini o'tkazadi
- hosil qilingan yoki ko'rib chiqilgan manifest hash va imzolar bilan arxivlanadi.
- tutun sinovlari oʻtadi Taira har qanday Minamoto rag'batlantirish
- o‘zgarishdan keyingi `/status` katalogi ko‘zlangan yo‘lak va ma’lumotlar makonini ko‘rsatishi
- `iroha app nexus lane-report --summary` talab qilingan manifestlar yo'qolganligini bildirmaydi

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

Ayni ma’lumotlar makonini Minamoto tarmog‘iga faqat Taira joylashtirishi, dastlabki sinovlar, monitoring va boshqaruvga oid dalillar to‘liq bo‘lgach o‘tkazing.

## Bogʻliq sahifalar {#related-pages}

- [Iroha 3](/uz/get-started/install-iroha.md) o'rnatish
- [Iroha 3 orqali CLI](/uz/get-started/operate-iroha-via-cli.md) orqali harakatlaning
- [Xususiy ma’lumotlar makoni komissiyalariga homiylik qilish](/uz/get-started/private-dataspace-fee-sponsor.md)
- [Torii oxirgi nuqtalari](/uz/reference/torii-endpoints.md)
- [Ibtido ko'rsatkichi](/uz/reference/genesis.md)
