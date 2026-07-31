---
translation_locale: uz
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 63c317ab61ba912176c43c83d5b4f026f23a7a6e5fb633872a133c9ea1295686
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Oʻzlashtiring SORA 3: Taira va Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3 - bu dasturlarga ko'zlangan ommaviy ishga tushirish yo'nalishi Iroha 3 va SORA
Nexus. Oʻz ichiga oʻrganish Taira Avval, so'ngra bir xil mijoz shaklini ko'chirish
to Minamoto faqat sizda alohida mainnet kalitlari bo'lganida, haqiqiy XOR to'lovlar uchun,
va ishlab chiqarish ruxsatnomasi.

Ushbu qoʻllanma qanday qilib Iroha jamoatchilik uchun mijoz SORA 3
tarmoqlar:

- Taira sinov tarmog'i `https://taira.sora.org`
- Minamoto o ' z vaqtida `https://minamoto.sora.org`

Foydalanish Taira integratsiya sinovlari, kran mablag'i bilan ta'minlangan yozish kanallari uchun va
Ishlab chiqarish mashg'ulotlari. Minamoto Faqat ishlab chiqarishga tayyor bo'lgan asosiy tarmoq uchun
Ikkala tarmoq ham o'z faoliyatini amalga oshiradi. XOR:

- Taira testnetdan foydalanadi XOR ommaviy krandan.
- Minamoto haqiqiy foydalanish XOR. Yoʻq Minamoto kran.

## Qurilish yo'li {#builder-path}

| Oʻzgarish                        | Taira Sinov tarmoqlari                                                | Minamoto Mainnet                                   |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
| Tarmoq holatini oʻqishni boshlash | Savol `/status` kalitsiz                                 | Savol `/status` kalitsiz                       |
| Ma'lumotlar maydonini tanlang            | Jamoat uchun foydalanish `universal` agar sizning dasturingizga boshqariladigan yo'l kerak bo'lmasa | Mainnetning tasdiqlanganidan keyin faqat shu ma'lumotlar maydonidan foydalaning |
| Toʻlov aktivini oling               | Jamoatdan foydalanish Taira kran                                  | Qabul qiling XOR mablag ' bilan ta'minlangan Minamoto hisob yoki tasdiqlangan xazina oqimi |
| Sinov yozadi                 | Foyda bilan ta'minlangan sinovdan foydalanish XOR                                   | Sinov vositalaridan foydalanmang; yozish real xarajat XOR     |
| Ma'ruza qilish                     | Logika, monitoring va imzolashni qayta sinab ko'ring            | O'ziga xos kalitlar, moliyalashtirish va chiqarish nazoratlaridan foydalaning   |

Amaliy oqim quyidagicha:

1. Mijozni qarshi quring Taira va jamoatchilikdan foydalanish `universal` ma'lumotlar maydoni.
2. imzochi qoʻshing va uni Taira kran.
3. Foydalanuvchiga qarshi logikangizni ishga tushiring Taira Muvaffaqiyatlar charchatganga qadar va
   kuzatib boriladi.
4. Oʻziga xos yaratish Minamoto imzochi, uni real bilan moliyalashtiring XOR, va faqat harakatlaning
   Mainnet uchun aynan shunday tasdiqlangan operatsiyalar.

## 1. O'zingiz uchun nimalarni rejalashtirayotganingizni tushuning {#_1-understand-what-you-are-setting-up}

Oʻz ichiga SORA Nexus, ma'lumotlar maydoni tarmoq yo'nalishi va yo'naltirish katalogi tarkibiga kiradi.
Mijoz yangi ommaviy ma'lumotlar maydonini faqat o'zgartirish orqali yaratmaydi
`client.toml`. Mijozning oʻrnatilishi ikkita narsani bajaradi:

1. mijozni oʻng tomonga Torii yakuniy nuqta
2. oʻz kanonik hisoboti uchun domen va maʼlumotlar maydonining yoʻnaltirish kontekstini tanlaydi

`AccountId` har doim kanonik va domensiz. `[account].domain` qiymat
`client.toml` yo'nalish va alias kontekstni taqdim etadi; u
ko'pgina arizalar uchun jamoatchilik bilan boshlash
`universal` Ma'lumotlar maydonidan foydalanish `domain.dataspace` shakli uchun
misol:

```text
wonderland.universal
```

Agar sizga yangi tashkiliy ma'lumotlar maydonchasi kerak bo'lsa, katalog va yo'nalish tayyorlang
taklifni oddiy mijoz hisobidan ro'yxatdan o'tkazishning o'rniga.
Koʻring [Yangi ma'lumotlar maydonini yaratish](#_8-provision-a-new-dataspace) quyida.

## 2. Jamoatga murojaat qiling Torii Keyingi nuqta {#_2-check-the-public-torii-endpoint}

Imzolashni o'rnatishdan oldin maqsadli oxirgi nuqtaning faolligini tekshiring.

uchun Taira:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

uchun Minamoto:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Bogʻning koʻrsatilgan maʼlumotlar maydonini va yoʻnalish koʻrinishini tekshiring:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Ushbu buyruqdan `https://minamoto.sora.org/status` asosiy uchun.

## Taira MCP Agentlar uchun {#taira-mcp-for-agents}

Taira shuningdek, a Torii- mahalliy model kontekst protokoli (MCP) koʻprik uchun
Agentni ishga tushirish vaqti. Agentga jonli testnet o'qish, skript kerak bo'lganda uni ishlating
diagnostika yoki o'z uslubini yaratmasdan, qattiq tekshirilgan yozish repetitsiyalari
Torii Avvalo mijoz.

| Oʻrnatish | Qiymat |
| --- | --- |
| MCP yakuniy nuqta | `https://taira.sora.org/v1/mcp` |
| Tarmoq ildiz | `https://taira.sora.org` |
| Maqsadli foydalanish | Taira testnet o'qish va kran mablag'i bilan ta'minlangan yozish repetitsiyalari |
| Ishlab chiqarish ekvivalenti | Ushbu yozuvni Minamoto agar asosiy to'plam bo'lmasa MCP oxirgi nuqta va chiqarib tashlash nazoratlari aniq tasdiqlanadi |

Imzolash materialini qo'shishdan oldin ko'prik metadatalarini tekshiring:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

O ' zbekiston Respublikasining URL foydalanuvchi lokal sifatida MCP Agent ish paytida server.
majburiyatli agent MCP konfig, API tokenlar, yuborilgan muallif boshliqlari, `authority`, yoki
`private_key` ushbu hujjat repo yoki dastur repo qiymatlariga kiradi.

Agent tezkor qoidalar bilan yaxshi ishlaydi Taira:

- Ushbu maqolalarda MCP server ularni chaqirishdan oldin; agar
  serverning hisobotlari `listChanged`.
- Oʻrinli boʻlganlarni afzal koʻrish `iroha.*` xom ashyodan ortiq asboblar `torii.*` asboblar.
- Faqat o'qishni boshlash: holatni tekshirish, hisoblar, aktivlar, aliaslar, bloklar,
  Davlat boshqaruvi holati va taklif qilishdan oldin bitimning holati.
- Hayot test tarmog'i mutatsiyalaridan oldin aniq inson yo'l-yo'riqlarini talab qiling.
  oldindan imzolangan muomala zarbalari, foydalanish `iroha.transactions.submit_and_wait`
  Agent faqat o'z natijalarini taqdim etishning o'rniga, natijani kutadi.
- Transaksiya hashlari, yakuniy holat va serverni tasdiqlash xatolarini qisqartirish
  Agentning javobini.

### Agentlar bilan ishlab chiqish ish oqimi {#development-workflow-with-agents}

Agentlarni rivojlanish yordamchilari sifatida ishlatish Iroha mijozlar, bitimlar tuzuvchilar,
diagnostik skriptlar va testnet ish daftarlari. Agentning vakolatini cheklang:
u kodni tekshiradi, o'qiydi Taira davlat, o'zgarishlarni taklif qilish va mahalliy sinovlar o'tkazish;
lekin u jonli tarmoqni mutatsiya qilmasligi kerak , agar inson aniq ma'lumotni tasdiqlamaguncha
operatsiya.

Amaliy ish oqimi quyidagilardan iborat:

1. Agentdan tegishli hujjatlarni tekshirishini so'rang, SDK kod, CLI qo'mondonlik yoki MCP
   kod yozishdan oldin asbob sxemasi.
2. Agentni avval eng kichik mijoz yo'lini yozishga chaqiring: holatni tekshirish, hisob
   qidirish, alias rezolyutsiya yoki muvozanat qidirish.
3. Faqatgina oʻqish uchun qoʻngʻiroqlar ishlaganidan keyin tranzaksiyalarni yaratish kodini qoʻshish
   Taira.
4. To'g'ridan-to'g'ri o'tkazilgan testlarni, masalan, orqa tomonda saqlang `TAIRA_LIVE=1`, shunda a
   Oddiy birlik sinov yurituvi testnet mablag'larini hech qachon sarflamaydi yoki tarmoqga bog'liq emas
   mavjudligi.
5. Agentni tarmoq ildiz, zanjir, hokimiyat hisobini bildirishni talab qiling.
   ko'rsatmalarning qisqartmasi, to'lov aktivlari va taqdim etishdan oldin kutilayotgan davlat o'zgarishi
   har qanday bitim.
6. Sirli ishlash, qayta urinish xatti-harakatlari, idempotency va
   qabul qilishdan oldin rad etishni nazorat qilish CI yoki doimiy ish oqimlari.

Faqat o'qish uchun foydali MCP rivojlanish vositalari hisobvaraq aktivlarini qidirishni o'z ichiga oladi;
alias rezolyutsiya, blok qidiruv, tranzaksiya qidiruvlari, tranzaksiyalar ro'yxatlari va
pipeline holatini tekshirish. bulardan foydalanib, ishonchni oshirish uchun
imzolangan fayzli yuk.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### Agentlar orqali operatsiya ish oqimi {#transaction-workflow-through-agents}

O ' zbekiston Respublikasi MCP koʻprik imzolangan hujjatni taqdim etishi mumkin Iroha muomala, lekin uni olib tashlamaydi
To'g'ri muomala talablari.
vakolat, ruxsatnomalar, to'lov mablag'lari, zanjir ID, Metadotlar va imzo.

xomashyo uchun Iroha Transaksiyalarni tuzish va imzolash
SDK yoki CLI Avvalo, keyin agentga faqat kanonik imzolangan tranzaksiyani bering
kodlangan bytlar `body_base64`. Agent zarbatni:
`iroha.transactions.submit_and_wait`, yoki
`iroha.transactions.submit` va so'rov `iroha.transactions.wait`.

Xususiy kalitlarni agentga qo'shmang. Agar agent
foydalanuvchining ish vaqti sirlarini yuklaydigan mahalliy kodga yozib qo'ying
atrof muhit, kalitlar, uskuna imzochisi yoki testnet konfiguratsiya faylini e'tiborsiz qoldirish.
Agent hech qachon kalit materialni Markdown, o'rnatish, logga yoki
majburiyatlarni bajaradi.

Transaksiyani taqdim etishdan oldin agentni qisqa muddatli tranzaksiya qilishlari kerak
reja:

- `network`: Taira testnet ildizi va zanjiri ID
- `authority`: ro'yxatdan o'tgan va to'lovlarni to'laydigan hisobvaraq
- `instructions`: ro'yxatga olish, pul tikish, yoqish, o'tkazish, metadotlar, ruxsatnoma yoki
  shartnoma chaqiruvi to'liqligi
- `fee asset`: to'lov olinadigan aktiv Taira
- `preflight reads`: Hisobvaraq, aktivlar balanslari, ruxsatnomalar, alias yoki blok
  allaqachon amalga oshirilgan tekshirishlar
- `expected result`: tasdiqlashdan keyin ko'rinishi kerak bo'lgan holat
- `idempotency`: agar bir xil talabni qayta ko'rib chiqsa nima bo'ladi

Taqdim qilgandan so'ng agentni terminal holatini kutishga majbur qiling, so'ngra
O'qish so'rovi bilan davlat o'zgarishi.

- Transaksiya hash
- terminal holati, masalan: `Committed`, `Applied`, `Rejected`, yoki `Expired`
- blok yoki qidiruvchining tafsilotlari mavjud bo'lganda
- tekshiruv o'qish natijalari
- rad etish xabarini va xato ruxsatnomalar, to'lovlar kabi ko'rinadimi,
  sertifikatlash, o'tkazib yuborilgan holat yoki oxirgi nuqtalar mavjudligi

Misol uchun:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

Imzolangan zarba allaqachon tayyorlangan bo'lsa:

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

Kasallik Taira MCP test tarmog'ining ochiq nazorat yuzi sifatida. Taira kalitlar, testnet XOR,
faucet hisob raqamlari va kanari imzolashlar bir martalik bo'lishi kerak va ular
Minamoto kalitlar va ishlab chiqarishdan chiqarilgan ish oqimlari.

## Hozirda sinab ko'rishingiz mumkin bo'lgan o'yinchoqlar {#toy-examples-you-can-try-now}

Ushbu misollar faqat o'qiladigan, agar qayd etilmagan bo'lsa.
kalitlari va ikkala jamoat tarmoqlariga qarshi ishlash xavfsiz.

Taqqoslash Taira testnet va Minamoto asosiy sog'liqni saqlash:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

O ' zbekiston Respublikasi Davlat soliq qo ' mitasining Taira:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Shunga oʻxshash buyruqni qoʻllash Minamoto asosiy tarmoq koʻrinishi kerak boʻlganda:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Kichik birini quring Node.js dashboard, bot yoki ishga tushirish uchun holatni tekshirish
tekshirish:

```bash
node --input-type=module <<'EOF'
const roots = {
  taira: 'https://taira.sora.org',
  minamoto: 'https://minamoto.sora.org',
};

for (const [name, root] of Object.entries(roots)) {
  const status = await fetch(`${root}/status`).then((res) => res.json());
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

Birinchi yozish o'yinchasi Taira faucet talab. U testnetdan foydalanadi
XOR va hech qachon Minamoto.

## 3. A yaratish Taira Mijoz konfig {#_3-create-a-taira-client-config}

Agar sizda allaqachon mavjud boʻlmaganida kalit juftligini yaratish:

```bash
kagami keys --algorithm ed25519 --json
```

yaratish `taira.client.toml`:

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

Eng yuqori darajadagi `chain` to'g'ri Taira Transaksiyalar zanjiri ID. O ' zbekiston Respublikasi
`[account].profile = "taira"` o'rnatish mustaqil ravishda Taira I105
zanjirni farqlovchi. ID hisob profilini tanlamaydi.

Faqat oʻqish uchun tekshiruvni bajaring:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

Jamoatni boshqaring Taira yozish testlaridan oldin diagnostika:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Moliyalashtirish Taira To'lovlarni amalga oshirishdan oldin kran orqali hisobni o'qing.
Toʻgʻridan-toʻgʻri kran oqimi
[Testnetni olish XOR to ' g'risida Taira](#_4-get-testnet-xor-on-taira).

Foyda uchun talabnoma qabul qilinganidan va hisob qaydnomani moliyalashtirilgandan keyin, Taira
kanary - bu tanlov asosida yozish tutun sinovidir:

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

Kanari imzolangan pingni taqdim etadi, tasdiqlanishini kutadi va
ishga tushirish vaqti belgisi konfiguratsiyasi `--write-config` taqdim etiladi. Taira ommaviy hisoblanadi
testnet, shuning uchun navbat to'ldirilishi imzolangan ping muvaffaqiyatsiz tugashi mumkin
kranning o'zi ishlaydi. `taira doctor` toʻyilgan navbat yoki
kanarilar to'lovlari `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`, oldin kuting va yana urinib koʻring
uni mijoz konfiguratsiyasi xatosi sifatida ko'rib chiqish.

Qo'riqlanmagan tutun sinovlari uchun kanaryani cheklangan qayta sinov bo'limida o'rab oling:

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

Agar `iroha taira doctor` qattiq xatolarni ko'rsatadi.
va to'lovni qabul qilish rad etilishi o'tkinchi ommaviy testnet shartlari hisoblanadi; DNS,
TLS, yoki `status = "fail"` diagnostika yo'q.

## A hosil qilish SORA Nexus Hisobvaraq ID {#generate-a-sora-nexus-account-id}

A SORA Nexus hisob ID kanonik I105 manzildan olingan
hisobning ochiq kalit va maqsadli tarmoq prefiksi.
`[account].domain` mijozdagi qiymat TOML. Shunga oʻxshash ochiq kalit kodlari
farq qiladi IDs to ' g'risida Taira va Minamoto, va ishlab chiqarish foydalanuvchilari
uchun alohida tugmachalar Minamoto.

Hisobni boshqaradigan Ed25519 tugmalarini yaratish yoki yuklash:

```bash
kagami keys --algorithm ed25519 --json
```

Umumiy kalitni Taira hisob ID:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

a ni oʻzgartiring Minamoto "mainnet" prefiksi bilan ochiq kalit:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Natijada keltirilgan hisobdan foydalanish ID qaerda bo'lsa Nexus API yoki CLI buyruq bir
kanonik hisob ID, masalan, Taira kran `account_id`, muvozanat
so'rovlar, qat'iy hisob maydonlari yoki alias bog'lash.
mijoz konfiguratsiyasida xususiy kalitni tanlang va
`[account].profile = "taira"` yoki `[account].profile = "minamoto"`.

Ishlab chiqarish ID o'zidan-o'zi moliyalashtirilgan zanjirdagi hisob raqami yaratmaydi.
Taira, faucet testnet yozish uchun hisob yaratish va moliyalashtirish mumkin.
Minamoto, mainnetning tasdiqlangan o'rnatilishi yoki xazina oqimidan foydalaning.

### Ochiq saqlash va ehtiyot qismlar {#key-storage-and-backup}

Hisobot ID va jamoatchilik kalitini o'zaro baham ko'rish mumkin.
parol, urug' va tiklanish materiallari sirli bo'lishi kerak.

Ushbu amaliyotlardan foydalanish SORA Nexus hisob-kitoblar:

- Xususiy kalitlarni hasharotlar bilan qo'llab-quvvatlanadigan shifrlangan maxfiy soʻz boshqaruvchisiga saqlash
  Keystore yoki maxsus imzolash xizmati.
  ishlab chiqarish kalitlarini shell tarixida, jurnallarda, chatda, chiptalarda nazorat qilish yoki qoldirish;
  yoki kodlanmagan nusxalari.
- Har bir vaft yoki ishlab chiqarish imzochisi uchun noyob yuqori entropik parol so'zlaridan foydalaning.
  Maxfiy so'zlarni maxfiy so'zlar menejerida yoki bo'lingan saqlash jarayonida saqlang, emas
  kodlangan xususiy kalit bilan bir xil fayl yoki ehtiyot qismlar to'plami.
- saqlang Taira va Minamoto kalitlar alohida. Taira kalitlar bir martalik
  testnet materiallari va Minamoto ishlab chiqarish fondlari organi sifatida kalitlar.
- Xususiy kalit, ommaviy kalit, hisobni nusxaga olish ID, hisob profili va har qanday
  imzochini tiklash uchun zarur bo'lgan hisobni qayta tiklash yoki saqlash notlari.
  tarmoq konteksti bo'lmagan kalitni tiklash paytida suiiste'mol qilish oson.
- Hech boʻlmaganda bitta kodlangan offline nusxa va geografik jihatdan bir nusxani saqlang
  ishlab chiqarish imzolari uchun alohida shifrlangan ehtiyot qism.
  ehtiyot qismidan kelib chiqqan holda, faqat o'qish uchun ishlaydigan kichik operatsiya.
- Agar xususiy kalit, parol so'zi, ehtiyot vositasi,
  yoki imzolovchi uy egasi aniqlangan bo'lishi mumkin.

Ko'proq ma'lumot olish uchun
[Kriptografik kalitlarni saqlash](/uz/guide/security/storing-cryptographic-keys.md)
va [Maxfiy soʻz xavfsizligi](/uz/guide/security/password-security.md).

## 4. Testnetni oling XOR to ' g'risida Taira {#_4-get-testnet-xor-on-taira}

To'g'ridan-to'g'ri ommaviy krandan foydalaning.

1. Imzolashni yaratish yoki yuklash va uning kanonikligini hisoblash Taira hisob ID.
2. Hozirgi kran puzzlini olib keling.
3. Agar `difficulty_bits` ko'proq `0`.
4. Kasana uchun talabnoma bering.
5. Joʻnatishdan oldin hisobvaraq yoki aktivlar balansining koʻrinishini kuting
   to'lovlarni to'lash yozadi.

Ochiq kalitni Taira I105 hisob ID faucetdan kutiladigan:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Puzzle olib keling:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
```

faucet - bu ommaviy testnet xizmati.
qaytarish `502`, Timeout yoki boshqa darvoza darajasidagi xato, kutish va qayta urinish
kalitlaringizni yoki mijoz konfiguratsiyasini o'zgartirishdan oldin.

Javob quyidagi shaklda:

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

Qachon `difficulty_bits` bo ' lmoqda `0`, faqat hisobotni taqdim etish ID:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}'
```

Qachon `difficulty_bits` ko'proq `0`, puzlni hal qiling va
Anchorning balandligi plus nonce:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{
    "account_id": "<TAIRA_I105_ACCOUNT_ID>",
    "pow_anchor_height": 741,
    "pow_nonce_hex": "<NONCE_HEX>"
  }'
```

Puzzle algoritmi quyidagicha:

1. Tantanali vazifani bajaring SHA-256 to ' xtatilgan:
   - o ' z kuchini `iroha:accounts:faucet:pow:v2`
   - ko'rsatilgan UTF-8 hisob ID
   - `anchor_height` katta-endyan sifatida `u64`
   - `anchor_block_hash_hex` byte sifatida dekodlangan
   - `challenge_salt_hex` mavjud bo'lganda byte sifatida dekodlangan
2. Sinang . `u64` noneslar katta-endyan 8 byet qiymatlari sifatida kodlangan.
3. Har bir nonce uchun skriptni quyidagilar bilan ishlating:
   - maxfiy soʻz: 8-baytli nonce
   - tuz: 32 baytli qiyinchilik
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - Chiqish uzunligi: 32 byt
4. G'olib bo'lgan nonce - bu kamida `difficulty_bits`
   nol bitlarga olib keladi.

Fauxet javobida moliyalashtirilgan aktiv va navbatdagi tranzaksiya hashlari mavjud:

```json
{
  "account_id": "<TAIRA_I105_ACCOUNT_ID>",
  "asset_definition_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
  "asset_id": "...",
  "amount": "25000",
  "tx_hash_hex": "...",
  "status": "QUEUED"
}
```

Javob hozirda HTTP `202 Accepted`. Aktiv
ta'rif ID yuqorida Taira davlat faucet tomonidan moliyalashtiriladigan haq aktivlari.
kran so'rovni qaytarib berganda qabul qildi `tx_hash_hex` va
`status: "QUEUED"`.

Soʻngra oʻzingizning haq toʻlashingizni taqdim etishdan oldin moliyalashtirilgan aktivni soʻrab oling
Transaksiyalar:

```bash
iroha --config ./taira.client.toml ledger asset get \
  --definition 6TEAJqbb8oEPmLncoNiMRbLEK6tw \
  --account <TAIRA_I105_ACCOUNT_ID>
```

Agar kran talabnomasi qabul qilingan bo'lsa, lekin hisob raqami yoki aktiv ko'rinmasa
Biroq, muomala hali ham testnet navbatini qayta ishlashning orqasida.
va yozishlarni yuborishdan oldin o'qishni yana sinab ko'ring.

Ishga tayyor to'g'ridan-to'g'ri API tekshirish, bularni `taira_faucet_claim.py`
va o ' tkazish Taira I105 hisob ID:

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

with urllib.request.urlopen(f"{root}/v1/accounts/faucet/puzzle") as res:
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
    headers={"content-type": "application/json"},
    method="POST",
)

with urllib.request.urlopen(request) as res:
    print(json.dumps(json.load(res), indent=2))
```

Faxt nafaqat Taira testnet mablag'lari. XOR, kran
hisob-kitoblar yoki Taira qo'riqchi minorasi Minamoto oqib ketadi.

## 5. Minamoto Mijoz konfig {#_5-create-a-minamoto-client-config}

O ' zga tugmalar birikmasidan foydalanish Minamoto. Qayta ishlatmang Taira asosiy tarmoq kalitlari.

yaratish `minamoto.client.toml`:

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

Eng yuqori darajadagi `chain` joriy Nexus asosiy tarmoq zanjirlari ID.
`[account].profile = "minamoto"` tanlaydi Minamoto I105 zanjir
diskriminant; oxirgi nuqta o'rinbosari nomi va zanjir ID uni mutlaqo tanlamang.

a ni oʻzgartiring Minamoto uning kanonik kaliti I105 hisob ID bilan
asosiy prefiks:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Hisobvaraq rezervassiya va moliyalashtirilmaguncha faqat o'qish tomonlarini tekshirish
asosiy tarmoqlarni o'rnatish yoki boshqaruv oqimi orqali:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

O ' z kuchini ishlatmang Taira suv quvurlari yoki yozuvchi-kanar yordamchisi Minamoto.

## 6. Fond a Minamoto Hisobvaraq XOR {#_6-fund-a-minamoto-account-with-xor}

Minamoto to'lovlar ishlab chiqarish bilan to'lanadi XOR, va Minamoto ommaviy emas
Konfiguratsiya qilingan hisobvaraqni tasdiqlangan asosiy tarmoqni o'rnatish orqali moliyalashtirish
yoki xazinani o'tkazish yoki olish XOR mavjud moliyalashtirilgan Minamoto
hisob.

Kanonik hisobni tekshirish ID va avval o'qishga oid tekshirishlar bilan moliyalashtirish
yozishni taqdim etish. Minamoto XOR ishlab chiqarish mablag'lari sifatida:
bir xil operatsiya Taira birinchi navbatda, ishlab chiqarish kalitlarini alohida saqlang va
Mainnet operatsiyasining qayta tiklanishi mumkinligini tasavvur qiling.

Taira XOR to'lash mumkin emas Minamoto to'lovlar. Testnet balanslari va kran talablari
o'tkazilmaydi Minamoto.

## 7. Mavjud ma'lumotlar maydonida ishlash {#_7-work-inside-an-existing-dataspace}

Katta koʻrsatkichlarda mavjud boʻlgan obʼektlar uchun toʻliq malakali domen nomlaridan foydalanish
ma'lumotlar maydoni. Misol uchun, ommaviy ma'lumot maydonidagi loyiha domeni
foydalanish:

```text
apps.universal
```

Hisobotingiz kerakli ruxsatlarga ega bo'lganidan so'ng, sirsiz ro'yxatdan o'ting
`AliasSetupPlanRequestV1` domen uchun niyat va deklarativ rejalashtiruvchini ishlatish:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

uchun Minamoto, alohida asosiy tarmoq niyatlari va rejalarini yaratish va tasdiqlash.
o'z zanjirlariga, vakolatlariga, tirik davlat anchariga va muddatga bog'liq, shuning uchun
Taira rejaning ilgari surilishi yoki takrorlanishi mumkin emas:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

Hisobvaraqning aliaslari bir xil ma'lumotlar maydonining suffixidan foydalanadi:

```text
alice@apps.universal
alice@universal
```

Katta hisob maydonlari hali ham kanonikdan foydalanadi I105 hisob IDs. Nomzodlarni davolash
inson o'qishi mumkin bo'lgan bog'liqliklar sifatida, ular kanonik hisobga javob beradi IDs.

## 8. Yangi ma'lumotlar maydonini yaratish {#_8-provision-a-new-dataspace}

Yangi ma'lumotlar maydoni operator va boshqaruv o'zgarishidir. Torii
yakuniy nuqta trafikni konfiguratsiya qilingan ma'lumotlar maydonlariga yo'naltirish mumkin, ammo uni rad etadi
ma'lumotlar maydonining noma'lum aliaslari.

O'zgarishlarni tayyorlashdan oldin, joriy jonli katalogni olish:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Operator hisobini olish uchun yo'nalishning ko'rsatkichlarini tekshirish:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

Yangi aliasni targ'ib qilmang , agar yo'l ID, ma'lumotlar maydoni ID, sertifikatlash usuli to'plami,
xato tolerantligi, manifest, yo'nalish qoidalari va operatsion egasi
talab qilingan huquqlarga ega bo'lgan odatdagi foydalanuvchi hisobi
domen sotib olish va uning SNS mavjud ma'lumotlar maydonida ijara
alias planner; u yangi ommaviy ma'lumotlar maydonini xavfsiz qo'sholmaydi.

Xususiy yoki tashkiliy ma'lumotlar maydonchasi uchun katalog o'zgarishini quyidagilar bilan tayyorlang:

- yagona ma'lumotlar maydonining aliasi va raqamli `id`
- muvofiq yo'nalishdagi kirish yoki mavjud yo'nalishda berilgan vazifa
- ma'lumotlar maydoni `fault_tolerance`
- yo'nalish qoidalari ko'rsatmalar yoki hisobning joylashishi kerak bo'lgan maydonlari uchun
  bu yerda
- Space Directory manifest yoki teng ko'rsatkichli ishga tushirish guvohnomasi, agar
  ma'lumotlar maydonining ko'rinishi UAID qobiliyatlari
- Validator, muvofiqlik, hisob-kitob qilish va monitoring uchun boshqaruvni tasdiqlash
  siyosat

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

Operatorning qabul qilishi quyidagi darvozalarni o'z ichiga olishi kerak:

- `irohad --sora --config <config.toml> --trace-config` O ' tkaziladi
  Yechilgan nod konfiguratsiyasi
- hosil qilingan yoki ko'rib chiqilgan manifest hash va imzolar bilan arxivlanadi
- tutun sinovlari oʻtadi Taira har qanday Minamoto rag'batlantirish
- o'zgarishdan keyingi `/status` Katalog maqsadli yo'nalish va ma'lumotlar maydonini ko'rsatadi
- `iroha app nexus lane-report --summary` yo'qolganligini bildirmaydi
  manifestlar

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

Xuddi shu ma'lumotlar maydonini Minamoto faqat Taira ishga tushirish,
tutun sinovlari, monitoring va boshqaruv hujjati to'liq.

## Bogʻliq sahifalar {#related-pages}

- [Oʻrnatish Iroha 3](/uz/get-started/install-iroha.md)
- [Operatsiya qilish Iroha 3 orqali CLI](/uz/get-started/operate-iroha-via-cli.md)
- [Xususiy ma'lumotlar maydonchasi uchun sponsorlik haqi](/uz/get-started/private-dataspace-fee-sponsor.md)
- [Torii yakuniy nuqtalar](/uz/reference/torii-endpoints.md)
- [Ibtidoga oid ma'lumot](/uz/reference/genesis.md)
