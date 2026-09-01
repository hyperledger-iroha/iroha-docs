---
translation_locale: mn
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: f766c604b0220fc03cacd7c0b9cbb5f94f415c5ec61eba89de7a5e310a1dfe79
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# SORA 3 дээр барина: Taira ба Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3 нь Iroha 3 ба SORA Nexus дээр суурилсан апп-д зориулсан олон нийтийн байршуулалтын зам юм. Эхлээд Taira-д барьж, дадлага хий, дараа нь зөвхөн тусдаа mainnet түлхүүр, төлбөрт зориулсан жинхэнэ XOR, болон үйлдвэрлэлийн зөвшөөрөлтэй үедээ ижил хэрэглэгчийн хэлбэрийг Minamoto-д шилжүүл.

Энэ хичээл нь олон нийтийн SORA 3 сүлжээнд Iroha клиент хэрхэн тохируулахыг харуулдаг:

- Taira тестнет дээр `https://taira.sora.org`
- Minamoto үндсэн сүлжээ `https://minamoto.sora.org` дээр

Нэгтгэх сорилын тест, тестнетээр санхүүжүүлсэн бичлэг канарууд болон нэвтрүүлгийн давтлагад Taira-ийг ашиглана уу. Зөвхөн үйлдвэрлэлд бэлэн гол сүлжээний үйл ажиллагаанд Minamoto-ийг ашиглана уу. Аль аль сүлжээ XOR-ээр шимтгэл авдаг:

- Taira нь олон нийтийн туршилтын сүлжээний санхүүжүүлэх үйлчилгээ ашиглан туршилтын сүлжээ XOR -ийг ашиглаж байна.
- Minamoto нь бодит XOR ашигладаг. Minamoto тестнетийн санхүүжилтийн үйлчилгээ байхгүй.

## Барилгын зам {#builder-path}

|Алхам| Taira Туршилтын сүлжээ| Minamoto Мэйннет |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|Сүлжээний төлөвийг уншиж эхлэх|Түлхүүргүй `/status` асуулга|Түлхүүргүй `/status` асуулга|
|Өгөгдлийн санг сонгоно уу|Таны аппликейшн удирддаг гүйцэтгэлийн зам шаарддаггүй бол нийтийн `universal` ашигла.|Гол сүлжээний зөвшөөрөл авсны дараа л ижил дата орон зайг ашиглана уу|
|Төлбөрийн хөрөнгө авах|Олон нийтийн Taira тестнет санхүүжүүлэх үйлчилгээг ашиглана уу|Санхүүжилт авсан Minamoto данс буюу батлагдсан сангийн урсгалаас XOR хүлээн авах|
|Шалгалт бичдэг|Тестнетийн санхүүжсэн тестийг ашигла XOR|Туршилтын хэрэгслийг битгий ашигла; бичлэгүүд нь бодит XOR зарцуулдаг|
|Өргөж дэмжих|Дахин оролдох логик, хяналт, криптографын гарын үсэг зурлагчийг удирдахийг хадгалах|Тусгай түлхүүр, санхүүжилт, гаргах хяналтуудыг ашиглана уу|

Практик урсгал нь:

1. Клиентийг Taira-тэй нийцүүлэн бүтээж, нийтийн `universal` мэдээллийн санг ашиглана уу.
2. Криптографийн гарын үсэг оруулж, түүнийг Taira тестнет санхүүжүүлэх үйлчилгээтэйгээр санхүүжүүл.
3. Аппликейшнийхээ логикыг Taira-той туршиж үзээрэй, алдаанууд уйтгартай бөгөөд ажиглагдахуйц болох хүртэл.
4. Minamoto-д зориулсан тусдаа гарын үсэг зурагч үүсгэж, бодит XOR-аар санхүүжүүлээд, зөвхөн туршилтаар баталсан ижил үйлдлүүдийг mainnet-д шилжүүлнэ.

## Хоолны номоор үргэлжлүүлэх {#continue-with-the-cookbook}

Энэхүү зааврыг ашиглан сүлжээг сонгоод, криптографийн гарын үсэг зурдаг төхөөрөмжийг тохируулж, шимтгэл төлбөрлөлтийг бэлдэнэ үү. Дараа нь баримталж бүтээхийг хүсч буй програмын үйлдэлтэй нийцсэн жорыг үргэлжлүүлнэ үү:

|Тэмцээн|Жор|
| --- | --- |
| Taira-ыг шалгаж, клиентээ тохируулна уу| [Taira-д холбогдох](/mn/cookbook/connect-to-taira.md) |
|Эхний бичвэрийг илгээж, үүний үр дүнг баталгаажуулна уу| [Гүйлгээг илгээж шалгах](/mn/cookbook/submit-and-verify-transactions.md) |
|Бүртгэх, гаргах, утгыг шилжүүлэх| [Ширээний хөрөнгө](/mn/cookbook/fungible-assets.md) |
|Шүүлтүүртэй програмын төлөвийг унших| [Блокчэйн бүртгэлийн төлвийг лавлах](/mn/cookbook/query-ledger-state.md) |
|Төгсгөлд хүрсэн өөрчлөлтөд хариу үйлдэл үзүүл| [Өргөдлийн үйл явдлууд](/mn/cookbook/stream-events.md) |

Гал тогооны ном нь тус бүрийн ажлын урсгалыг төвлөрүүлж, энд дахин холбодог нь шаардлагатай үед Taira санхүүжилт эсвэл SORA Nexus сүлжээний нөхцлийг оруулахад зориулагдсан.

## 1. Та юу тохируулж байгаагаа ойлгох {#_1-understand-what-you-are-setting-up}

SORA Nexus-д, дата орон зайн хэсэг нь сүлжээний гүйцэтгэх зурвас ба маршрутын каталогийн хэсэг юм. Клиент шинэ олон нийтийн дата орон зайг зөвхөн `client.toml`-г сольсноор үүсгэдэггүй. Клиентийн тохиргоо хоёр зүйлийг хийдэг:

1. клиентийг зөв Torii API тэгшлэлд чиглүүлдэг
2. өөрийн ганц протокол стандартад нийцсэн дансны хувьд домайн ба өгөгдлийн зайны чиглүүлэх контекстийг сонгодог

`AccountId` нь үргэлж ганц протокол-стандарт ба домэйнгүй байдаг. `client.toml`-т байгаа `[account].domain` утга нь чиглэл болон_ALIAS_ контекстийг хангадаг; энэ нь дансны танилцуулгын хэсэг болдоггүй. Төвөггүй програмуудын ихэнхэд нийтийн `universal` өгөгдлийн сангаас эхлэх хэрэгтэй. Домэйн контекст нь `domain.dataspace` хэлбэрийг ашигладаг, жишээ нь:

```text
wonderland.universal
```

Хэрэв танд шинэ байгууллагын өгөгдлийн сан шаардлагатай бол энгийн хэрэглэгчийн дансаас бүртгэхийн оронд каталог ба маршрут төлөвлөлтийг бэлдээрэй. Доор [Шинэ өгөгдлийн санг хангах](#_8-provision-a-new-dataspace) үзнэ үү.

## 2. Олон нийтийн Torii API төгсгөлийн цэгийг шалгах {#_2-check-the-public-torii-endpoint}

Криптографийн гарын үсэг үүсгэгчийг тохируулахын өмнө зорьсон API төгсгөл амьд байгаа эсэхийг шалгана уу.

Taira-ийн хувьд:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Minamoto-ийн хувьд:

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Толгойноос ил гаргасан өгөгдлийн зай болон гүйцэтгэх замыг харах:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Mainnet-д зориулж `https://minamoto.sora.org/status` утгатай ижил тушаалыг ашиглана уу.

## Taira MCP Агентуудад зориулсан {#taira-mcp-for-agents}

Taira мөн агентын програм хангамжийн гүйцэтгэх орчны хувьд Torii-үндэслэсэн Model Context Protocol (MCP) гүүрийг ил болгодог. Агент жив тестнет уншилт, скриптчилсэн оношлогоо, эсвэл нарийвчилсан бичих дасгалууд хэрэгтэй бол өөрийн Torii клиентийг эхлээд үүсгэхгүйгээр үүнийг ашиглана уу.

|Тохиргоо|Үнэлэмж|
| --- | --- |
| MCP API төгсгөл цэг | `https://taira.sora.org/v1/mcp` |
|Сүлжээний үндэс| `https://taira.sora.org` |
|Зориулалтын хэрэглээ| Taira тестнет уншлагууд болон тестнетээр санхүүжүүлсэн бичлэгийн дадлага|
|Үйлдвэрлэлийн тэнцүү| Энэ орох хэсгийг чиглүүлэхгүй байх Minamoto гол сүлжээ байхгүй бол MCP API төгсгөл болон гаргах хяналтыг ил тод зөвшөөрсөн |

Гэрчилгээний материал нэмэхээсээ өмнө гүүрний метадатыг шалгаарай:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

URL-ыг агентын гүйцэтгэх орчинд хэрэглэгчийн дотоод MCP серверээр тохируулна. Агентын MCP тохиргоо, API токен, дамжуулсан баталгаажуулалтын header, `authority` эсвэл `private_key` утгыг энэ баримтын эсвэл аппликейшний репозиторт хувилбарын хяналтаар бүү хадгал.

Agent-ийн зааварчилгааны дүрэмүүд Taira-д сайн ажилладаг:

- Тэдгээрийг дуудахдаа MCP серверээс хэрэгслүүдийг олж мэд; хэрвээ сервер `listChanged` гэж мэдээлвэл дахин олж мэд.
- Түүхий `torii.*` хэрэгслээс илүү боловсруулсан `iroha.*` хэрэгслийг илүүд үзнэ үү.
- Зөвхөн унших горимыг эхлүүлэх: бичлэгийг санал болгохоос өмнө төлөв, данс, хөрөнгө, хаягууд, блокууд, удирдлагын төлөв болон гүйлгээний төлөвийг шалгана уу.
- Шинэчлэгдсэн туршилтын сүлжээнд орохоос өмнө тодорхой хүний заавар шаардлагатай. Урьдчилан гарын үсэг зурсан гүйлгээний өгөгдлийн хадгалагчид зориулан, `iroha.transactions.submit_and_wait` ашиглаарай, ингэснээр агент зөвхөн илгээх бус үр дүнг хүлээх болно.
- Гүйлгээний криптограф хэшийг, эцсийн төлөв болон серверийн баталгаажуулалтын алдааг агентын хариундаа нэгтгэн дүгнэ.

### Агентуудтай Хөгжүүлэлтийн Ажлын Үйл Явц {#development-workflow-with-agents}

АГЕНТ-ыг Iroha клиентүүд, гүйлгээний бүтээгчид, оношлогооны скриптүүд, тестнетийн ажиллах зааварчилгаанд хөгжүүлэлтийн туслах болгон ашиглана уу. АГЕНТ-ын эрх олголтын үндэсийг нарийн байлга: энэ кодыг шалгаж, Taira төлөвийг уншиж, өөрчлөлт санал болгож, локал туршилтуудыг гүйцэтгэж чадна, гэхдээ яг ямар үйлдлийг хийхийг хүн зөвшөөртөл амьд сүлжээг өөрчилж болохгүй.

Практик ажлын урсгал нь:

1. Төлөөлөгчөөс код бичихээсээ өмнө холбогдох баримт бичиг, SDK код, CLI тушаал, эсвэл MCP хэрэгслийн схемийг шалгахыг гуй.
2. Агент хамгийн жижиг клиент замыг эхэнд нь бичнэ үү: төлөв байдлыг шалгах, дансны хайлт, нэрийн шийдэл, эсвэл үлдэгдлийн хайлт.
3. Гүйлгээ үүсгэх кодуудыг зөвхөн зөвхөн унших API хүсэлтүүд Taira-ийг ажиллуулсны дараа нэмнэ үү.
4. Амьд сүлжээний туршилтуудыг сонголттой байлга, жишээлбэл `TAIRA_LIVE=1`-ын ард, ингэснээр энгийн нэгж тестийн гүйцэтгэл туршилтын сүлжээний санхүүг зарцуулах эсвэл сүлжээний боломжтой байдлаас хамаарахгүй.
5. Агентээс ямар ч гүйлгээ илгээхийн өмнө сүлжээний үндэс, сүлжээний гинжин холбоо, эрх олголтын гол данс, зааврын товлосон агууламж, төлбөрийн хөрөнгө ба хүлээгдэж буй төлөвийн өөрчлөлтийг тайлагнахыг шаард.
6. Нууцын удирдлага, дахин оролдлогын зан байдал, идемпотент байдлын болон татгалзах ажиллагааг хянаж, CI эсвэл mainnet урсгал руу шилжүүлэхээс өмнө үүсгэсэн кодыг шалгаарай.

Хөгжүүлэлтийн зориулалттай ашигтай зөвхөн унших MCP хэрэгслүүд нь дансны хөрөнгийн хайлт, овог нэрийн шийдэл, блок хайлт, гүйлгээ хайлт, гүйлгээний жагсаалт, програм хангамжийн боловсруулалтын ажлын урсгалын байдлын шалгалтыг агуулна. Алингийн ч гарын үсэгтэй мэдээллийг илгээхээс өмнө эдгээрийг ашиглан итгэлцлээ нэмэгдүүлээрэй.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### Агентуудын дамжуулсан гүйлгээний ажиллах урсгал {#transaction-workflow-through-agents}

MCP гүүр нь гарын үсэгтэй Iroha гүйлгээ илгээж чаддаг боловч хэвийн гүйлгээний шаардлагыг арилгахгүй. Гүйлгээ нь зөв эрх олгосон гол эзэн, зөвшөөрөл, шимтгэл, сүлжээний ID, мета өгөгдөл, болон гарын үсэгтэй байх шаардлагатай.

Түүхий Iroha гүйлгээний хувьд эхлээд SDK эсвэл CLI ашиглан гүйлгээний өгөгдлийн агуулагчийг бүтээж, гарын үсэг зур, дараа нь агентт зөвхөн нэг протокол стандартын гарын үсэг зурсан гүйлгээний байт `body_base64` байдлаар кодлогдсон. Агент `iroha.transactions.submit_and_wait`-ээр өгөгдлийн контейнерийг илгээж болно, эсвэл `iroha.transactions.submit`-оор илгээж, `iroha.transactions.wait`-аар шалгаж болно.

Хувийн түлхүүрийг агентын зааварт бүү хуул. Агент гүйлгээ үүсгэх шаардлагатай бол хэрэглэгчийн орчны хувьсагч, түлхүүрийн сан, техник хангамжийн гарын үсгийн төхөөрөмж эсвэл git-д ороогүй testnet тохиргооны файлаас нууцыг ачаалдаг локал кодыг зааж өг. Түлхүүрийн материалыг Markdown, туршилтын өгөгдөл, лог эсвэл эцсийн хариунд бичихийг агентэд бүү зөвшөөр.

Гүйлгээ илгээхээс өмнө агентээс богино гүйлгээний төлөвлөгөө гаргуулаарай:

- `network`: Taira тестнет үндэс ба гинжин ID
- `authority`: шимтгэлд гарын үсэг зурж төлдөг данс
- `instructions`: бүртгэх, гаргах, устгах, шилжүүлэх, мета мэдээлэл, зөвшөөрөл, эсвэл гэрээний техник нээх товч тайлбар
- `fee asset`: Taira-д төлбөр төлөгдөх хөрөнгө
- `preflight reads`: данс, хөрөнгийн үлдэгдэл, зөвшөөрөл, хаяглал, эсвэл блок шалгалт аль хэдийн хийгдсэн
- `expected result`: баталгаажуулсны дараа харагдах ёстой төлөв
- `idempotency`: хэрвээ ижил хүсэлтийг дахин оролдвол юу болох вэ

Илгээсний дараа агентийг эцсийн төлөвт хүрэхийг хүлээнэ үү, дараа нь уншиж шалгах асуултаар төлөв өөрчлөгдсөнийг баталгаажуулна. Ашигтай дуусах тайланд дараах зүйлс орно:

- гүйлгээний криптограф хэш
- терминалын байдал гэх мэт `Committed`, `Applied`, `Rejected`, эсвэл `Expired`
- боломжтой үед блок эсвэл судалгааны дэлгэрэнгүй
- баталгаажуулалтын уншсан үр дүн
- татгалзсан мессеж ба амжилтгүйдлийн шалтгаан нь зөвшөөрөл, төлбөр, баталгаажуулалт, хуучирсан төлөв эсвэл API төгсгөлд ашиглах боломжтой эсэхээс хамаарч байгаа эсэх

Жишээ болгох хамгаалагдсан процесс:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

Гарын үсэгтэй өгөгдлийн сав бэлэн болсон үед:

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

Taira MCP-ийг олон нийтийн тестнетийн хяналтын гадаргуу гэж үз. Taira түлхүүрүүд, тестнетийн XOR, тестнет санхүүгийн үйлчилгээ эрхлэх дансууд, мөн канарь криптографын гарын үсэг зурдаг төхөөрөмжүүд нь түр ашиглагдах бөгөөд Minamoto түлхүүрүүд болон үйлдвэрлэлийн гаргах үйл явцтай тусдаа байх ёстой.

## Одоо туршиж болох жишээ тоглоом {#toy-examples-you-can-try-now}

Эдгээр жишээнүүд зөвхөн унших зориулалттай бөгөөд тэмдэглэгдээгүй бол бичиж болохгүй. Эдгээр нь түлхүүр үүсгэхээс өмнө ажиллаж, олон нийтийн сүлжээн дээр аюулгүй ажиллана.

Тестнет Taira болон мэйннет Minamoto эрүүл мэндийг харьцуул:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    -H 'Accept: application/json' \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

Taira-аар ил гаргасан олон нийтийн өгөгдлийн сангийн гүйцэтгэлийн зурвасуудыг жагсаана уу:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Үндсэн сүлжээний үзэлтийг авах шаардлагатай бол Minamoto-д ижил командыг ажиллуулна уу:

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Хянах самбар, бот, эсвэл байрлуулалтын шалгалтанд зориулж жижиг Node.js статуст шалгагч бүтээх:

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

Эхний бичих талын тоглоом нь Taira тестнет санхүүжилтийн үйлчилгээний нэхэмжлэл байх ёстой. Энэ нь тестнет XOR-ийг ашигладаг бөгөөд хэзээ ч Minamoto руу чиглүүлэх ёсгүй.

## 3. Taira Клиент тохиргоо үүсгэх {#_3-create-a-taira-client-config}

Хэрэв та аль хэдийн үүсгээгүй бол түлхүүр хос үүсгээрэй:

```bash
kagami keys --algorithm ed25519 --out-dir ./taira-client-key
```

Бий болгох `taira.client.toml`:

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

Топ түвшний `chain` нь яг Taira гүйлгээний сүлжээний ID юм. `[account].profile = "taira"` тохиргоо нь Taira I105 сүлжээний ялгагчийг бие даан сонгодог. Сүлжээний ID нь дансны профайлийг сонгодоггүй.

Зөвхөн унших горимд шалгалт ажиллуулна:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

Туршилт бичихээс өмнө нийтийн Taira оношилгоог ажиллуулна уу:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Төлбөртэй бичих үйлдэл ажиллуулахын өмнө Taira дансыг faucet-аар санхүүжүүлнэ. Шууд faucet урсгалыг [Taira-аас testnet XOR авах](#_4-get-testnet-xor-on-taira) хэсэгт тайлбарласан.

Тестнет тэтгэлэгийн үйлчилгээний хүсэлтийг хүлээн авч, дансанд санхүүжилт орсны дараа, Taira канар хэвлэж бичих туршилт нь сонголттой юм:

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

Canary нь гарын үсэгтэй ping илгээж, баталгаажуулалтыг хүлээгээд, `--write-config` өгсөн бол гүйцэтгэх орчны гарын үсэг зурагчийн тохиргоог бичнэ. Taira нь нийтийн testnet тул faucet өөрөө ажиллаж байсан ч дараалал дүүрэхэд гарын үсэгтэй ping амжилтгүй болж болно. Хэрэв `taira doctor` дараалал дүүрснийг мэдээлэх эсвэл canary `PRTRY:NEXUS_FEE_ADMISSION_REJECTED` буцаавал клиент тохиргооны алдаа гэж үзэхээсээ өмнө хүлээгээд дахин оролдоно уу.

Анхааралгүй утааны туршилтын хувьд, канарийг хязгаарлагдмал дахин оролдлогын давталтанд оруулна:

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

`iroha taira doctor` нь хатуу алдааг харуулвал дахин оролдохоо зогсоо. Очирлолоор дүүрсэн болон төлбөрийн зөвшөөрлийг татгалзсан нь түр зуурын олон нийтийн тестнет нөхцөл юм; DNS, TLS, эсвэл `status = "fail"` оношлогоо нь тийм биш.

## SORA Nexus дансны ID үүсгэх {#generate-a-sora-nexus-account-id}

A SORA Nexus дансны ID нь дансны олон нийтийн түлхүүр болон зорилтот сүлжээний урьдчилсан хэсгээс гаралтай нэг протокол-стандартын I105 хаяг юм. Энэ нь `[account].domain` утга биш юм клиент TOML-д. Тухайн нийтэд зориулсан түлхүүр Taira ба Minamoto-д өөр ID-үүдээр кодлогдож байна, мөн үйлдвэрлэлийн хэрэглэгчид Minamoto-д зориулж тусдаа түлхүүрийн хос үүсгэх шаардлагатай.

Дансны менежмент хийх Ed25519 түлхүүр хосыг үүсгэх эсвэл ачааллах:

```bash
kagami keys --algorithm ed25519 --out-dir ./nexus-account-key
```

Олон нийтийн түлхүүрийг Taira дансны дугаар болгон хөрвүүлэх:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Гол сүлжээний урьдач тэмдэгтэй Minamoto нийтийн түлхүүрийг хөрвүүлэх:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Гарах дансны ID-г нэг протокол стандартын дансны ID шаардагдах Nexus, API эсвэл CLI команд бүрт ашиглана уу, жишээлбэл Taira тестнет санхүүгийн үйлчилгээ `account_id`, үлдэгдлийн лавлагаа, хатуу дансны талбарууд, эсвэл овог нэрийн холболтууд. Тохирох нууц түлхүүрийг клиент тохиргоондоо хадгалах ба `[account].profile = "taira"` эсвэл `[account].profile = "minamoto"`-той адил нийтийн сүлжээг сонгоно уу.

ID үүсгэснээр дансаа санхүүжүүлсэн блокчэйн данс болгож чадахгүй. Taira дээр туршилтын сүлжээний санхүүжилтийн үйлчилгээ туршилтын сүлжээнд бичлэг хийх зориулалтаар дансыг үүсгэж, санхүүжүүлж чадна. Minamoto дээр зөвшөөрөгдсөн үндсэн сүлжээний бүртгэл эсвэл сангийн урсгалыг ашиглана.

### Түлхүүр хадгалах ба нөөцлөх {#key-storage-and-backup}

Дансны ID болон олон нийтийн түлхүүрийг хуваалцаж болно. Тохирсон хувийн түлхүүр, нууц үг, үрийн өгөгдөл болон сэргээх материалыг нууц гэж үзэх ёстой.

Эдгээр дадал зуршлуудыг SORA Nexus дансанд ашиглаарай:

- Хувийн түлхүүрийг шифрлэгдсэн нууц үгийн менежер, техник хангамж дэмжсэн түлхүүр хадгалах газар, эсвэл тусгай гарын үсэг зурдаг үйлчилгэээнд хадгалаарай. Протоколын эцсийн түлхүүрийг эх кодны хяналтанд оруулахгүй, үйлдвэрлэлийн түлхүүрийг командын түүх, лог, чат, тасалбар, эсвэл шифрлэгдээгүй нөөцлөлтөд бүү үлдээгээрэй.
- Тодорхой өндөр энтропитэй нууц үгийг бүх хадгалах сан эсвэл үйлдвэрлэлийн криптографийн гарын үсэгтэй нэг бүрд хэрэглэнэ үү. Нууц үгийг нууц үгийн менежер эсвэл хуваарилагдсан хадгалалтын процессд хадгалаарай, кодлогдсон хувийн түлхүүртэй нэг файл эсвэл нөөцлөлтийн багцад биш.
- Taira ба Minamoto түлхүүрийг тусад нь хадгал. Taira түлхүүрийг туршилтын сүлжээний хэрэгсэл гэж үзэж, Minamoto түлхүүрийг үйлдвэрлэлийн хөрөнгийн эрх олгох гол гэж үзээрэй.
- Криптографийн гарын үсэг зурагчийг сэргээхэд шаардлагатай хувийн түлхүүр, олон нийтийн түлхүүр, дансны ID, дансны профайл болон дансыг сэргээх эсвэл хадгалахад шаардлагатай тэмдэглэлүүдийг нөөцөлнө үү. Сүлжээний нөхцөлгүй хувийн түлхүүрийг сэргээх явцад буруу ашиглах нь амархан.
- Үйлдвэрлэлийн криптографийн гарын үсэг зурдаг төхөөрөмжүүдийн хувьд хамгийн багадаа нэг нууцлалтай оффлайн нөөцлөлт, нэг газарзүйн хувьд тусдаа нууцлалтай нөөцлөлттэй байх хэрэгтэй. Нөөцлөлтөд найдаххаас өмнө жижиг унших-зуух үйлдлээр сэргээх тест хийх.
- Хувийн түлхүүр, нууц үг, нөөцлөх төхөөрөмж эсвэл гарын үсэг зурдаг хост ил болсон байж болзошгүй бол криптографын гарын үсэглэгчийг эргүүлэх эсвэл солих.

Дэлгэрэнгүй мэдээллийг [Криптографийн түлхүүр хадгалах](/mn/guide/security/storing-cryptographic-keys.md) ба [Нууц үгийн аюулгүй байдал](/mn/guide/security/password-security.md)-ээс үзнэ үү.

## 4. Taira-ээс XOR тестнетийг авах {#_4-get-testnet-xor-on-taira}

Олон нийтийн тестнет санхүүжилтийн үйлчилгээг шууд ашиглана уу. Урсгал нь:

1. Криптографийн гарын үсэг гаргаж эсвэл ачаалж, түүний нэг протоколын стандарт Taira дансны ID-г тооцоолно уу.
2. Одоогийн тестнет санхүүгийн үйлчилгээний тааврыг олж ав.
3. Хэрвээ `difficulty_bits` нь `0` -ээс их бол тааврыг шийд.
4. Тестнетийн санхүүжилтийн үйлчилгээний хүсэлтийг илгээнэ үү.
5. Төлбөртэй бичлэгүүдийг илгээхээсээ өмнө данс буюу хөрөнгийн үлдэгдэл харагдахыг хүлээнэ үү.

Нийтийн түлхүүрийг тестнетийн санхүүжүүлэх үйлчилгээ хүлээж буй Taira I105 дансны ID болгон хөрвүүлнэ:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Тоглоомын тааврыг ав:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle \
  -H 'Accept: application/json' \
  | jq .
```

Тестнет санхүүжүүлэх үйлчилгээ нь нийтийн тестнет үйлчилгээ юм. Хэрвээ таавар эсвэл claim API эцсийн цэг `502`, хугацаа дуусах эсвэл бусад gateway-тэй холбоотой алдаа буцааж өгвөл, түлхүүр эсвэл клиент тохиргоогоо өөрчлөхийн өмнө түр хүлээж, дахин оролдоно уу.

Хариу нь дараах хэлбэртэй байна:

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

Хэрэв `difficulty_bits` нь `0` бол, зөвхөн дансны ID-г илгээнэ үү:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}' \
  | tee ./taira-faucet-response.json \
  | jq .
```

Хэрэв `difficulty_bits` нь `0`-ээс их байвал, тааврыг шийдэж, бэхэлгээний өндөр болон криптографийн nonce утгыг оруулна уу:

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

Тааварын алгоритм нь:

1. Сорилыг SHA-256 дээр барь.
   - `iroha:accounts:faucet:pow:v2`-ийн байтууд
   - UTF-8 дансны ID
   - `anchor_height` их-байршилт `u64`
   - `anchor_block_hash_hex` бит болгон задлав
   - `challenge_salt_hex` байт болгон задлагдсан үед, байвал
2. Том эцсийн 8-н баайттай утга шиг кодлогдсон `u64` криптографийн nonce утгуудыг туршаад үз.
3. Нэг бүрийн криптографийн nonce утгын хувьд scrypt-ийг ашиглана:
   - нууц үг: 8-байт криптографийн nonce утга
   - давс: 32-байт сорилт
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - гаралтын урт: 32 байт
4. Ялагч криптографийн nonce утга нь хамгийн багадаа `difficulty_bits` урд нь тэг биттэй анхны криптографийн дайджест утга юм.

Faucet-ийн хариу нь санхүүжүүлсэн хөрөнгө болон дараалалд оруулсан гүйлгээний хэшийг агуулна:

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

Хариу нь одоогоор HTTP `202 Accepted` -оор буруу өгөгдсөн байна. Үүний `asset_definition_id` нь олон нийтийн туршилтын сүлжээний санхүүжилтийн үйлчилгээгээр санхүүжүүлсэн одоогийн Taira төлбөрийн хөрөнгө юм; Тооцоог жишээ ID хуулбарлахын оронд хариулаас гаргаж ав. Туршилтын сүлжээний санхүүгийн үйлчилгээ нь `tx_hash_hex` ба `status: "QUEUED"`-г буцаахад хүсэлтийг хүлээн авсан болно.

Дараа нь өөрийн төлбөртэй гүйлгээг илгээхээс өмнө санхүүжүүлсэн хөрөнгийг санал хураа.

```bash
TAIRA_FEE_ASSET_DEFINITION=$(
  jq -er '.asset_definition_id' ./taira-faucet-response.json
)

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET_DEFINITION" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

Хэрэв тестнет санхүүжүүлэх үйлчилгээний хүсэлтийг хүлээн авсан боловч данс эсвэл хөрөнгө харагдаж эхлээгүй бол гүйлгээ нь одоо ч олон нийтийн тестнетийн ээлжинд боловсруулагдаж байна. Бичлэгүүдийг илгээхээс өмнө уншихыг хүлээж, дахин оролд.

Шуурхай ажиллах бэлэн шууд API шалгалт хийхийн тулд үүнийг `taira_faucet_claim.py` гэж хадгалаад Taira I105 дансны ID-г дамжуулна уу:

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

Faucet нь зөвхөн Taira testnet-ийн хөрөнгөд зориулагдсан. Testnet XOR, faucet данс эсвэл Taira canary гарын үсэг зурагчийг Minamoto урсгалд бүү ашигла.

## 5. Minamoto Клиент тохиргоог үүсгэх {#_5-create-a-minamoto-client-config}

Minamoto зориулж тусад нь түлхүүр хос хэрэглэ. Taira түлхүүрийг гол сүлжээнд дахин бүү ашигла.

Бий болгох `minamoto.client.toml`:

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

Дээд түвшний `chain` нь одоогийн Nexus үндсэн сүлжээний оюуны ID юм. `[account].profile = "minamoto"` нь Minamoto I105 сүлжээний ялгааг сонгодог; API төгсгөлийн хостын нэр болон сүлжээний ID нь үүнийг шууд сонгохгүй.

Minamoto нийтийн түлхүүрийг гол сүлжээний урьдчилсан тэмдэгтэйгээр нэг протокол-стандартын I105 дансны ID болгон хөрвүүлэх:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Гүйлгээг зөвхөн уншигч талыг шалгахыг ажиллуулна, данс үндсэн сүлжээний бүртгэл эсвэл захиргааны урсгалын дагуу бүртгэгдэж, санхүүжтэл:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

Тестнет санхүүжилтийн Taira үйлчилгээг эсвэл Minamoto-тэй эсрэг write-canary туслахыг ажиллуулахаас зайлсхий.

## 6. XOR дээр Minamoto дансыг санхүүжүүлэх {#_6-fund-a-minamoto-account-with-xor}

Minamoto-ийн шимтгэл нь үйлдвэрлэл XOR-ээр төлөгддөг бөгөөд Minamoto-д олон нийтийн тестнет санхүүжилтийн үйлчилгээ байхгүй. Бүртгэгдсэн дансыг баталгаатай мейннет оролцоо эсвэл сангийн шилжүүлгээр санхүүжүүлэх эсвэл одоо байгаа санхүүжүүлсэн Minamoto дансаас XOR авах.

Нэг протокол-стандарт дансны ID болон санхүүжилтийг бичлэг илгээхээс өмнө зөвхөн унших шалгалтаар баталгаажуулна уу. Minamoto XOR-г үйлдвэрлэлийн сан гэж үзнэ: эхлээд Taira-д ижил үйлдлийг давталж үзэх, үйлдвэрлэлийн түлхүүрүүдийг тусад нь хадгалах, гол сүлжээнд хийх гүйлгээг дахин тохируулж болно гэж бодохгүй байх.

Taira XOR-оор Minamoto-ийн шимтгэл төлөх боломжгүй. Testnet үлдэгдэл болон faucet claim Minamoto руу шилжихгүй.

## 7. Бодсон өгөгдлийн орон дотор ажиллах {#_7-work-inside-an-existing-dataspace}

Өгөгдлийн зайд орших блокчэйн бүртгэлийн объектоор бүрэн тодорхойлогдсон домайн нэрийг ашиглана. Жишээлбэл, олон нийтийн өгөгдөлд орших төслийн домайн нь дараах байдлаар ашиглах ёстой:

```text
apps.universal
```

Таны данс шаардлагатай зөвшөөрөлтэй болсны дараа домэйны хувьд нууцгүй `AliasSetupPlanRequestV1` зорилгыг үүсгээд тунхагласан төлөвлөгчийг ашиглана уу:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

Minamoto-ийн хувьд тусдаа mainnet зорилго ба төлөвлөгөөг үүсгэж, зөвшөөрөл олгоно уу. Төлөвлөгөөнүүд нь өөрийн гинжин, эрх олгох гол, амьд байдлын цэг, хугацаатай холбогддог тул Taira төлөвлөгөөг ахиулах эсвэл дахин тоглуулах боломжгүй:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

Дансны овгууд ижил өгөгдлийн сангийн дэд нэрийг ашигладаг:

```text
alice@apps.universal
alice@universal
```

Хатуу дансны талбарууд одоо ч ганц протокол стандарттай I105 дансны ID-уудыг ашигладаг. Нэрийн өөр хувилбаруудыг ганц протокол стандарттай дансны ID-д задалдаг хүний уншиж болох холбоосууд гэж үзээрэй.

## 8. Шинэ өгөгдлийн санг бэлтгэх {#_8-provision-a-new-dataspace}

Шинэ өгөгдлийн орон зай нь оператор болон удирдлагын өөрчлөлт юм. Олон нийтийн Torii API эцсийн цэг нь замын хөдөлгөөнийг тохируулсан өгөгдлийн орон зай руу чиглүүлж чадна, гэхдээ танигдаагүй өгөгдлийн орон зайгийн овгийг татгалзах болно.

Өөрчлөлт хийхээс өмнө одоогийн амьд каталогийг хадгалаарай:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Үйлдлийн нээлтийн дансны хувьд, гүйцэтгэлийн замын техникийн тайлангийн байрыг мөн шалгана уу:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

Гүйцэтгэх эгнээний ID, өгөгдлийн сангийн ID, баталгаажуулагчийн багц, алдааг тэсвэрлэх чадвар, техникийн тайлбар, чиглүүлэх дүрэм, үйл ажиллагааны эзэн бүгдийг хамтдаа хянаагүй бол шинэ нэрийг сурталчлаарай. Шаардагдах эрхтэй энгийн хэрэглэгчийн данс нь алиас төлөвлөгчийн тусламжтайгаар домайн болон түүний SNS түрээсийг одоо байгаа өгөгдлийн орон зайд авах боломжтой; шинэ нийтийн өгөгдлийн орон зайг аюулгүйгээр нэмэх боломжгүй.

Хувийн болон байгууллагын өгөгдлийн сангийн хувьд дараахтай хамт каталогийн өөрчлөлтийг бэлдэнэ үү:

- онцгой өгөгдлийн сангийн овог ба тоон `id`
- таарах гүйцэтгэх урсгалын орох эсвэл одоо байгаа гүйцэтгэх урсгалын үүрэг
- өгөгдлийн сан `fault_tolerance`
- тэнд хүрэх ёстой зааварчилгаа эсвэл дансны хүрээний чиглэл тогтоох дүрмүүд
- датаспейс UAID чадамж олгодог бол Орон зайн лавлахын манифест эсвэл түүнтэй дүйцэх нэвтрүүлэлтийн нотолгоо
- баталгаажуулагчийн засаглалын баталгаа, нийцэл, санхүүгийн гүйлгээний шийдвэрлэлт, хяналтын бодлого

Хянан үзэх боломжтой тохиргооны хэсэг ингэж харагддаг:

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

Операторын хүлээн зөвшөөрөлд эдгээр хаалтууд орсон байх ёстой:

- `iroha3d --sora --config <config.toml> --trace-config` шийдэгдсэн зангилааны тохиргоог дамжуулдаг
- Үүсгэсэн эсвэл хянагдсан техникийн мэдүүлгийг криптографийн хэш болон гарын үсэгтэйгээр архивладаг
- утаж үзэх тестүүд Taira-д ямар нэг Minamoto дэвшүүлэлтээс өмнө амжилттай болдог
- солигдсоны дараах `/status` каталогт төлөвлөсөн гүйцэтгэх зурвас ба өгөгдлийн сан харагдана
- `iroha app nexus lane-report --summary` шаардлагатай техник үзүүлэлтүүд дутуу байгааг мэдээлэхгүй байна

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

Ижил датасын зайг зөвхөн Taira байршуулалт, сорилтын тестүүд, хяналт, засаглалын нотолгоо дууссаны дараа Minamoto руу шилжүүлэх.

## Холбогдсон хуудаснууд {#related-pages}

- [Суурилуулах Iroha 3](/mn/get-started/install-iroha.md)
- [Iroha 3 -г CLI ашиглан ажиллуулна](/mn/get-started/operate-iroha-via-cli.md)
- [Хувийн өгөгдлийн сангийн ивээн тэтгэгчийн төлбөр](/mn/get-started/private-dataspace-fee-sponsor.md)
- [Torii API төгсгөлийн цэгүүд](/mn/reference/torii-endpoints.md)
- [блокчэйн үүсгэж эхлэх лавлагаа](/mn/reference/genesis.md)
