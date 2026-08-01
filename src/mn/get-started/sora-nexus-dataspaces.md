---
translation_locale: mn
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 8cc510f79468efa58732b806c254155d4d7225c0876272bd8126ea07e8607888
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SORA 3: Taira болон Minamoto дээр барилдана. {#build-on-sora-3-taira-and-minamoto}

SORA 3 нь Iroha 3 болон SORA Nexus дээр баригдсан аппликейшнээр чиглэсэн олон нийтийн нэвтрүүлгийн зам юм. Эхлээд Taira дээр бүтээж, туршиж үзээрэй, дараа нь ижил үйлчлүүлэгч хэлбэрийг Minamoto-д өөр хоорондоо байршуулах бол зөвхөн гарын сүлжээний түлхүүртэй байх үед, төлбөрийн хувьд жинхэнэ XOR болон үйлдвэрлэлийн зөвшөөрөлтэй байх болно.

Энэ сургалтанд Iroha үйлчлүүлэгчийг олон нийтийн SORA 3 сүлжээний хувьд хэрхэн тохируулж байгааг харуулж байна:

- Taira шинжилгээний сүлжээг `https://taira.sora.org`
- Minamoto үндсэн сүлжээ `https://minamoto.sora.org`

Хэрэглээ Taira Интеграцийн туршилт, крантан санхүүжүүлсэн бичгийн канар болон нэвтрүүлэгт хичээл хийхэд ашиглах. Minamoto Зөвхөн үйлдвэрлэлийн бэлэн гол сүлжээний үйл ажиллагаанд зориулагдсан. XOR:

- Taira нь олон нийтийн кранны туршилтын сүлжээг XOR ашигладаг.
- Minamoto бодит хэрэглээ XOR. Үгүй байна. Minamoto Төмөрөг.

## Барилгын зам {#builder-path}

|Хурдал |Taira Тэснэт |Minamoto Улаанбаатар |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|Сүлжээний орчинг эхлүүлнэ |`/status` нөөцгүй асуулт |`/status` нөөцгүй асуулт |
|Мэдээллийн орон зай сонгох |Таны аппликейшн нь хяналтын замыг хэрэглэхгүй бол олон нийтийн `universal` ашигла.|Үүнтэй ижил өгөгдлийн талбайг зөвхөн гол сүлжээний зөвшөөрөл авсан дараа ашиглах |
|Тэмцээний хөрөнгө ав.|Олон нийтийн Taira кран ашиглах |XOR нь санхүүжүүлсэн Minamoto дансанд эсвэл батлагдсан сангийн урсгалаас хүлээн авна |
|Тест бичиж байна|Тэмцээний санхүүжилттэй туршилтыг ашигла XOR |Экспериментийн хэрэгсэл ашиглахгүй; бичдэг зарцуулахад бодит XOR |
|Хөгжүүлнэ|Логик, хяналт, гарын үсэг зурагчдыг дахин туршиж үзээрэй |Үндэсний түлхүүр, санхүүжилт, нэвтрүүлгийн хяналтыг тусгайлан ашиглаарай |

Үйл ажиллагааны урсгал нь:

1. Хэрэглэгчийг Taira-ийн эсрэг барьж, олон нийтийн `universal` мэдээллийн орон зайг ашиглах.
2. Үүнээс нэг гарын үсэг зурагч нэмж, Taira крантай санхүүжүүлнэ.
3. Taira -ийн эсрэг аппликейшн логикийг ашиглаж, алдаа нь харамсалтай, ажиглах боломжтой хүртэл.
4. Өөрөөр хэлбэл Minamoto гарын үсэг зурагч бий болгож, түүнийг бодит XOR мөнгөөр санхүүжүүлж, зөвхөн ижил батлагдсан үйл ажиллагааг гол сүлжээ рүү шилжүүлнэ.

## Хөдөлмөрийг үргэлжлүүлэн үзээрэй {#continue-with-the-cookbook}

Энэ удирдамжийг ашиглан сүлжээ сонгох, гарын үсэг зурагч тавих, санхүүжилтийн төлбөрийг хангахын тулд ашигла. Дараа нь та бүтээхийг хүсч буй аппликейшн заншилтай нийцсэн рецептээр үргэлжлүүлээрэй:

|Зорилго .|Тэмцээ |
| --- | --- |
|Taira хяналт тавих, үйлчлүүлэгчийг тохируулна | [Taira](/mn/cookbook/connect-to-taira.md)-д холбох|
|Анх бичиж, үр дүнг нь баталгаажуулна.| [Арилжааны танилцуулалт, шалгалт ](/mn/cookbook/submit-and-verify-transactions.md) |
|Тодруул, санхүүжилт, хөдөлгөөн үнэ цэнэ | [Хөдөлмөрийн хөрөнгө](/mn/cookbook/fungible-assets.md) |
|Сэтгэврийн хэрэгслийн байдлыг уншина уу | [Судалгааны бүртгэлийн байдал](/mn/cookbook/query-ledger-state.md) |
|Үндсэн хуулийн өөрчлөлтөд хариуцлага | [Уламжлах үйл явдлууд](/mn/cookbook/stream-events.md) |

Сургалтын хуудас нь ажлын урсгалыг төвлөрүүлж, Taira санхүүжилт эсвэл SORA Nexus сүлжээний хүрээнд шаардлагатай үед энд холбоно.

## 1. Та юу хийх вэ гэдгийг ойлгох {#_1-understand-what-you-are-setting-up}

SORA Nexus-д өгөгдлийн орон зай нь сүлжээний замын болон чиглэлийн каталогийн нэг хэсэг юм. Клиент зөвхөн `client.toml` -ийг өөрчлөхөөр шинэ олон нийтийн өгөгдлийг бий болгодоггүй. Клиентын тохируулалт хоёр зүйлийг хийдэг:

1. үйлчлүүлэгчийг баруун Torii төгсгөлд чиглүүлж байна
2. доменийн болон мэдээллийн орчны чиглэлийн хүрээг санхүүгийн бүртгэлийн хувьд сонгон шалгаруулдаг

`AccountId` нь үргэлж каноник бөгөөд доменгүй байдаг. `client.toml`-ийн `[account].domain` үнэ цэнэ маршрутизаж, алиасейн хүрээг хангадаг; энэ нь дансны тодорхойлогын нэг хэсэг болдоггүй юм. ихэнх хэрэгслийн хувьд олон нийтийн `universal` мэдээллийн орон зайтай эхэлнэ. Доменийн хүрээ нь `domain.dataspace` хэлбэрийг ашигладаг:

```text
wonderland.universal
```

Хэрэв та шинэ зохион байгуулалтын өгөгдлийн орон зай хэрэгтэй бол энгийн үйлчлүүлэгчдийн дансаас бүртгүүлэхээс өөрөөр каталог, маршрутизарын саналыг бэлтгэж үзээрэй. [New Dataspace](#_8-provision-a-new-dataspace)-ийг бүрдүүлнэ үү:

## 2. Олон нийтийн Torii төгсгөлийг шалгаарай. {#_2-check-the-public-torii-endpoint}

Та гарын үсэг зурагчдыг тохируулахын өмнө зорилтын төгсгөл хэсгийг идэвхжүүлэхийг шалгаарай.

Taira хувьд:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Minamoto хувьд:

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Нөөц нь илрүүлсэн мэдээллийн орон зай, замын үзэлтийг шалгаарай:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

`https://minamoto.sora.org/status`-тай ижил команд нь гол сүлжээний хувьд ашиглана.

## Taira MCP агентлагчид {#taira-mcp-for-agents}

Taira ч гэсэн а Torii-Үндэсний загварын хүрээлэнгийн протокол (MCP Хөдөлмөрийн хэрэгслийн цахилгаан станцыг ашиглах зохиосон оношилгоо, эсвэл дүрэм шинжилгээний туршилтыг сайн боловсруулахгүйгээр хянасан Torii Хэрэглэгч хамгийн түрүүнд.

|Хажуулалтын|Үр дүн |
| --- | --- |
|MCP эцсийн цэг |`https://taira.sora.org/v1/mcp` |
|Сүлжээний гарал |`https://taira.sora.org` |
|Дашрамдсан хэрэглээ |Taira шалгалтын сүлжээний уншдаг, цөмөрөөр санхүүжүүлсэн бичгийн туршилтууд |
|Үйлдвэрлэлийн тэнцүү |Энэ нэвтрүүлгийг Minamoto гэж заахгүй бол гол сүлжээний MCP эцсийн цэг болон чөлөөлөх хяналтын системийг ялангуяа баталгаажуулахгүй бол|

Гэрээ батлах материалыг нэмэхээс өмнө гүүрний метабараа шалгаарай:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

URL-ийг агенттын ажиллагаанд хэрэглэгчийн орон нутгийн MCP сервер болгон тохируулна. Энэ докумын репо эсвэл аппликейшн репод агент MCP -ийн конфигурац, API -ийн токенүүд, шилжүүлсэн авторын цол, `authority`, эсвэл `private_key` -ийн үнэ цэнийг нэгтгэхгүй байх.

Taira нь сайн ажилладаг агентгийн шуурхай журам:

- MCP серверийн хэрэгсэлүүдийг дуудлахаасаа өмнө олж илрүүлнэ; сэрвер `listChanged` тайлан гаргах тохиолдолд дахин олж илрэнэ.
- `iroha.` тоног төхөөрөмжийг түүхий эд `torii.` тоног төhөөрөмжээс илүү сонгодог.
- Зөвхөн уншигч эхлүүлнэ: бичиг дэвшүүлэхийн өмнө бүртгэлийн байдал, данс, эд хөрөнгө, нууц нэр, блок, засаглалын байдал, гүйлгээний байдлыг шалгаарай.
- Testnet-ийн амьд шилжилтээс өмнө хүний тодорхой заалыг шаардаарай. урьдчилан гарын үсэг зурсан транзакцын хуудасны хувьд `iroha.transactions.submit_and_wait` -ийг ашиглаж, агент зөвхөн өргөн мэдүүлэхийн оронд үр дүнг хүлээх болно.
- Тус агент хариуцсан транзакцын хэш, эцсийн байдал, серверний баталгаажуулах алдааг товчлуул.

### Хөдөлмөрийн үйл ажиллагааны урсгал {#development-workflow-with-agents}

Iroha үйлчлүүлэгчид, транзакцын бүтээн байгуулагчид, оношилгооны скриптүүд болон тестнет-ийн гүйлгээний номыг хөгжүүлэхэд туслах агент ашиглах. Агентгийн эрх мэдлийг хязгаарлах: Энэ нь код шалгаж, Taira хэсгийг уншиж, өөрчлөлтийг санал болгож, орон нутгийн туршилт явуулж болно. Гэхдээ хүн яг үйл ажиллагааг зөвшөөрөх хүртэл амьд сүлжээг өөрчлөх боломжгүй.

Үйл ажиллагааны үйл явц нь:

1. SDK код, CLI команд, эсвэл MCP хэрэгслийн схэмыг код бичэхийн өмнө агент холбогдох баримт бичиг, [PH000000) кодыг шалгахыг хүснэ.
2. Агент нь хамгийн бага үйлчлүүлэгч замыг түрээслүүлээрэй: байдлын хяналт, дансны хайлт, нууц товчлол, эсвэл тэнцвэр хайл.
3. Taira -ийн эсрэг зөвхөн уншдаг дуудлага хийсний дараа л гүйлгээний бүтээн байгуулалтын код нэмнэ.
4. Амьд сүлжээний туршилтын сонгон шалгаруулалтыг `TAIRA_LIVE=1` дэргэд байлгаарай, тиймээс хэвийн нэгжийн туршилтын ажил хэзээ ч тест сүлжээгийн хөрөнгийг зарцуулахгүй эсвэл сүлжээтэй холбоотой байдаг.
5. Төлөөлөгч нь тухайн гүйлгээг хүргүүлэхийн өмнө сүлжээний түшиг, зангилал, эрх мэдлийн сан, заалын товч танилцуулалт, төлбөрийн хөрөнгө, төлөвлөсөн байдлын өөрчлөлтийг мэдээлэх ёстой.
6. CI эсвэл гол сүлжээний ажлын урсгалд сурталчлахын өмнө нууц үйл ажиллагаа, дахин туршиж үзэх заншил, идэвхгүй байдал, татгалзлын үйл ажиллагаанд үүссэн кодтыг хянан шалгаарай.

Хөгжлийн зориулалттай зөвхөн уншдаг MCP хэрэгсэл нь дансны хөрөнгийн хайгуул, нууц үсэгний шийдэл, блок хайгууль, гүйлгээний хайгуул, гүйлгэний жагсаалтууд, урсгалын байдлын хяналт-шинжилгээ юм.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### Транзакцын үйл ажиллагааны урсгал Агентууд дамжуулан {#transaction-workflow-through-agents}

MCP гүүр нь гарын үсэг зурсан Iroha гүйлгээг өргөн мэдүүлж болно, гэхдээ энэ нь хэвийн гүйлгээний шаардлагыг арилгахгүй байна. Үйлдвэрлэлт аливаа зөв эрх мэдэл, зөвшөөрөл, төлбөрийн санхүүжилт, ID сүлжээ, метадэтгэлэг болон гарын үсгийн шаардлагатай байна.

Iroha түүхий эдийн гүйлгээний хувьд гүйлгэний хувилбарыг хамгийн түрүүнд SDK эсвэл CLI тэмдэгээр бүрдүүлж, гарын үсэг зурж, дараа нь төлөөлөгчэд зөвхөн хуулийн дагуу гарын үсэг зурсан гүйлгээний байт `body_base64` гэсэн кодтой. Тус төлөөлөгч хуудасыг `iroha.transactions.submit_and_wait` буюу `iroha.transactions.submit` болон анкетаг `iroha.transactions.wait`ээр өргөн мэдүүлж болно.

Шаардлагатай төлөөлөгчийн анкетад хувийн түлхэгийг элсэхгүй. Хэрэв төлөөлөгч транзакцийг хийх шаардлагатай бол хэрэглэгчийн гүйлгээний цаг үеийн нууцыг борлуулах орон нутгийн код руу чиглүүлээрэй Байгаль орчин, түлхүүр, хардварын гарын үсэг зурагч, эсвэл тестнет конфигурацийн файлыг үл тоомлосон. Тус агент нь гол материалыг хэзээ ч Markdown, Fixtures, logs, эсвэл commit-т бичихгүй байх ёстой

Арилжаа гаргахаас өмнө төлөөлөгчэд богино хугацааны гүйлгээний төлөвлөгөөг гаргах ёстой:

- `network`: Taira шинжилгээний сүлжээний түлхүүр, зангилаа ID
- `authority`: гарын үсэг зурж, төлбөр төлөх бүртгэл
- `instructions`: бүртгэл, мэнт, галзуу, шилжүүлэн суулгах, метадэтгэл, зөвшөөрөл, эсвэл гэрээний дуудлагын товчоо
- `fee asset`: Taira дээр төлөх хөрөнгийн сан
- `preflight reads`: аль хэдийн гүйцэтгэсэн данс, хөрөнгийн тэнцвэр, зөвшөөрөл, нууц нэр буюу блок хяналт
- `expected result`: батлагдсанаас хойш харагдах байх ёстой байдал
- `idempotency`: ижил хүсэлтийг дахин шалгах тохиолдолд юу болох вэ?

Судалгаа хийсний дараа төлөөлөгч терминалын байдлын хүлээлт хийх, дараа нь уншигч асуултаар өөрчлөлтийн байдлыг баталгаажуулах.

- гүйлгээний хэш
- `Committed`, `Applied`, `Rejected` эсвэл `Expired` зэрэг галт тэрэгний байдал.
- Блок эсвэл хайгуулын тодруулгыг ашиглах боломжтой бол
- шалгалтын уншлын үр дүн
- татгалзлын мэдээ болон алдаа нь зөвшөөрөл, төлбөр, баталгаажуулалт, хуучин байдал эсвэл төгсгөл хэсгийн хүртээмжтэй харагдаж байгаа эсэх

Жишээ нь:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

Гарын үсэг зурсан хуудас аль хэдийн бэлтгэсэн тохиолдолд:

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

Taira MCP-ийг олон нийтийн шинжилгээний сүлжээний хяналтын талбай болгон авч үзнэ. Taira товчоо, шинжилгээны сүлжээ XOR, крантын тооцоо, канарийн гарын үсэг зурагч нь нэг удаа ашиглах боломжтой бөгөөд Minamoto товчоос болон үйлдвэрлэлийн нэвтрүүлгийн ажлын урсгалаас тусгаар тогтнох ёстой.

## Та одоо туршиж үзэх боломжтой тоглоомын жишээ {#toy-examples-you-can-try-now}

Эдгээр жишээ нь зөвхөн унших боломжтой бөгөөд та түлхүүр үүсгэхээс өмнө үйл ажиллагаа явуулдаг бөгөөд олон нийтийн хоёр сүлжээний эсрэг аюулгүй байдаг.

Taira шинжилгээний сүлжээ болон Minamoto гол сүлжээний эрүүл мэндийг харьцуулаарай:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    -H 'Accept: application/json' \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

Taira нэвтрүүлсэн олон нийтийн мэдээллийн орон зайны замын жагсаалт:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Minamoto -ийн эсрэг ижил команд гүйцэтгэхэд гол сүлжээний дүрс хэрэгтэй:

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Дашборд, бот эсвэл нэвтрүүлгийн шалгаруулалтын хувьд Node.js статусын жижиг сонд бий болгох:

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

Эхний бичгийн талын тоглоом нь Taira крантын дуудлага байх ёстой. Энэ нь шалгалтын сүлжээ XOR ашигладаг бөгөөд хэзээ ч Minamoto руу чиглэхгүй байх ёстой.

## 3. Taira үйлчлүүлэгчдийн тохируулалтыг бий болгох {#_3-create-a-taira-client-config}

Хэрэв та аль хэдийн нэгтэйгүй бол түлхүүрний хосууд үүсгэх:

```bash
kagami keys --algorithm ed25519 --json
```

`taira.client.toml` бүтээх:

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

Хамгийн дээд түвшний `chain` нь яг Taira гүйлгээний сүлжээ ID юм. `[account].profile = "taira"` тохируулалт тусгаар тогтнолоо Taira I105 сүлжээний ялгааг сонгон шалгаруулдаг. ID сүлжээ нь дансны профилийг сонгодоггүй.

Зөвхөн уншдаг шалгалтыг хий:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

Эрүүл мэндийн шинжилгээ хийхээс өмнө олон нийтийн Taira оношилгоог гүйцэтгэх:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Taira дансны санхүүжилтийг төлбөрийн төлбөр тооцоо явуулахын өмнө кран ашаар дамжуулаарай. Турах крангийн урсгал нь [Get Testnet XOR дээр Taira](#_4-get-testnet-xor-on-taira) .

Төмөрлөгийн хүсэлтийг хүлээн зөвшөөрч, дансыг санхүүжүүлсэний дараа Taira канар нь сонгон шалгаруулалтын төмрийн шинжилгээ юм:

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

Canary нь гарын үсэг зурсан ping-ийг өргөн мэдүүлж, баталгааг хүлээдэг бөгөөд `--write-config` хангагдсанаар "runtime signer config" бичдэг. Taira бол олон нийтийн тест сүлжээ юм. Хэрэв `taira doctor` нь дүүрэн шуурхайг мэдэгдсэн бол эсвэл `PRTRY:NEXUS_FEE_ADMISSION_REJECTED` -ийг буцаасан бол үйлчлүүлэгчийн конфигурацийн алдаатай гэж үзэхээс өмнө хүлээх, дахин туршиж үзээрэй.

Төмөрний хяналтгүй шинжилгээ хийхэд канаринг хязгаарлагдмал дахин туршилтын сүлжээнд ороод:

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

`iroha taira doctor` нь хүнд алдааг үзүүлдэг бол дахин туршиж үзэхийг зогсоо. Захиргааны тохирдол, төлбөрийн хүлээн зөвшөөрөгдөх татгалз нь олон нийтийн тест сүлжээний түр хугацааны нөхцөл байдаг; DNS, TLS эсвэл `status = "fail"` оношилгооны хувьд тийм биш юм.

## SORA Nexus бүртгэл үүсгэн байгуулах ID {#generate-a-sora-nexus-account-id}

SORA Nexus данс ID бол дансны олон нийтийн ач холбогдол болон зорилтот сүлжээний префикстээс үүдэн үүссэн I105 элбэг хаяг юм. Энэ нь `[account].domain` үнэлгээ нь үйлчлүүлэгч TOML . Энэ нь Taira болон Minamoto-д өөр хоорондын IDs нууцыг кодлодог бөгөөд үйлдвэрлэлийн хэрэглэгчид Minamoto-ийн хувьд тусгай ач холбогдол эзэмшүүлэхэд оршино.

Эд25519 товчлогыг үүсгэх эсвэл борлуулах:

```bash
kagami keys --algorithm ed25519 --json
```

Олон нийтийн түлхүүрг Taira дансанд ID шилжүүлнэ:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Minamoto олон нийтийн түлхэгийг гол сүлжээний префикстэй өөрчлөх:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Үр дүнд хүрсэн мэдээллийг ашигла ID хаана ч Nexus API эсвэл CLI Захиргааны захирамж санхүүгийн мэдээллийг хүснэ. ID, Тухайлбал, Taira цөмөр `account_id`, тэнцвэрлэлийн асуултууд, хяналтын сангийн хатуу бүсүүд, эсвэл нууц үсэгтэй холболт. танай үйлчлүүлэгчийн конфигурацынд хувийн түлхэгийг сонгож, `[account].profile = "taira"` эсвэл `[account].profile = "minamoto"`.

ID-ийг үүсгэх нь өөрөө санхүүжүүлсэн зах зээлийн дансыг бий болгодоггүй. Taira дээр, кран нь тестнэт бичгийн дансыг бий болгож, санхүүжүүлж болно. Minamoto-д зөвшөөрөлтэй гол сүлжээний борлуулалт эсвэл санхүүгийн урсгал ашиглах боломжтой.

### Нүүрний хадгаламж, санхүүжилт {#key-storage-and-backup}

Санхүүжилт ID болон олон нийтийн товчийг хуваалцах боломжтой. Үүнд нийцсэн хувийн түлхүүр, нууц үгс, үр тариа, сэргээлт материалыг нууцаар хадгалж байх ёстой.

SORA Nexus бүртгэлд дараах үйл ажиллагааг ашиглах:

- Шаардлагатай нууц үгний менежер, хардварын дэмжлэгтэй түлхүүр дэлгүүр, эсвэл зориулсан гарын үсэг зурах үйлчилгээгээр хувийн түлхүүдийг хадгалах. Үндсэн нөөцийг эх үүсвэрийн хяналт тавих болон үйлдвэрлэлийн түлхлийг шэлтийн түүх, тэмдэглэл, чат, билет, эсвэл үл шифрлэсэн сүлжээнд үлдээх хэрэггүй.
- Үндэсний нууц үсэг зурагч эсвэл үйлдвэрлэлийн гарын үсэг зурагчийн хувьд онцгой өндөр энтропий нууц үгийн хэрэглэж, нууц үгийг нууц үсгийн менежерт эсвэл хуваасан хадгаламжийн үйл явцад хадгалж байгуулж, шифрлэгдсэн хувийн түлхүүртэй ижил файл эсвэл сүлжээний хуулбаргүй.
- Taira болон Minamoto мөрийг тусдаа хадгалах. Taira мөрийг нэг удаа хэрэглэх шинжилгээний сүлжээний материалын хувьд, Minamoto мөрийг үйлдвэрлэлийн сангийн байгууллагын хувьд авч үзээрэй.
- Шаардлагатай ач холбогдол, олон нийтийн ач холбогдол ID, дансны хувилбар, болон бүртгэлийн нөхөн сэргээлт, хадгаламжийн тэмдэглэлүүд нь гарын үсэг зурсан хүнийг сэргээхэд шаардлагатай. Сүлжээний хүрээлэнгүй хувийн товч нь сэргээлтийн үеэр ашиглах хялбар.
- Үйлдвэрлэлийн гарын үсэг зурагчдад хамгийн багадаа нэг шифрлэгдсэн офлайн сахилга, газар зүйн хувьд тусгасан шифрлэгдсэн сахилга хадгалж байх. Сахилгаас өмнө зөвхөн уншдаг жижиг үйлдэлээр сэргээлт туршиж үзээрэй.
- Хувийн ачкыч, нууц үгс, сүлжээн хамгаалах хэвлэл мэдээллийн хэрэгсэл эсвэл гарын үсэг зурагч хост илэрсэн бол гарын үсгийн шилжүүлнэ эсвэл солиулна.

Дэлгэрэнгүй дэлгэрэнгүй үзвэл [Санх нууц товчоо хадгалах](/mn/guide/security/storing-cryptographic-keys.md) болон [ Хууль нууцын аюулгүй байдлыг хангах ](/mn/guide/security/password-security.md).

## 4. Testnet XOR-ийг Taira дээр аваарай. {#_4-get-testnet-xor-on-taira}

Олон нийтийн галт тэрэгээр шууд ашигла.

1. Тухайн гарын үсэг зурагчдыг үүсгэх эсвэл борлуулах, түүний Taira санхүүгийн ID дансыг тооцох.
2. Одоогийн цахилгаан бутлуурын цогцлыг ав.
3. `difficulty_bits` нь `0`-ээс илүү бол цогцолборыг шийдээрэй.
4. Тэмцээний хүсэлтийг хүргүүлнэ.
5. Төсвийн төлбөрийн албан бичгийг илгээхийн өмнө дансны болон хөрөнгийн тэнцвэр нь харагдана гэж хүлээх.

Олон нийтийн түлхүүрг Taira I105 дансанд ID шилжүүлэх:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Тэмцээг аваарай:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle \
  -H 'Accept: application/json' \
  | jq .
```

Тэмцэл нь олон нийтийн тест сүлжээний үйлчилгээ юм. Хэрэв цогцолбор эсвэл шаардлагын төгсгөлийн цэг `502`, цаг хугацааны хорио, эсвэл гадаад замын түвшний өөр алдааг буцааж өгөөч, та өөрийн товчоо болон үйлчлүүлэгчдийн конфигуралыг өөрчлөхөөс өмнө хүлээгээд дахин туршиж үзээрэй.

Энэ хариу нь дараах хэлбэртэй:

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

`difficulty_bits` нь `0` бол зөвхөн ID бүртгэлээ хүргүүлнэ:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}' \
  | tee ./taira-faucet-response.json \
  | jq .
```

Хэрэв `difficulty_bits` нь `0`-ээс илүү бол цогцолборыг шийдэж, анкерний өндөр болон нэнс нэмж:

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

Тэмцээний алгоритм:

1. Хөгдөлмөрийг SHA-256 гэж бүтээж:
   - `iroha:accounts:faucet:pow:v2` -ийн байт
   - UTF-8 бүртгэл ID
   - `anchor_height` нь их хэмжээний `u64` юм.
   - `anchor_block_hash_hex` нь байт хэлбэрээр кодлогдсон
   - `challenge_salt_hex` нь байт хэлбэрээр кодлогдсон бол
2. `u64` нонс-ийг 8-байтын томоохон түвшинээр кодлосон гэж үзээрэй.
3. Нонс бүрийн хувьд:
   - Пароль: 8-байтын нонс
   - тус: 32 байтын сорилт
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - гарааны урт: 32 байт
4. Ялалт байгуулсан нонс нь хамгийн багадаа `difficulty_bits` нөлөөний битүүдтэй анхны дигест юм.

Тэмцээний хариу нь санхүүжүүлсэн хөрөнгийн болон шуурхай гүйлгээний хэшийг бүрдүүлнэ:

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

Тус хариу нь одоогоор HTTP `202 Accepted`ээр буцааж байна. Түүний `asset_definition_id` нь олон нийтийн крангийн санхүүжилтээр олгогдсон одоогийн Taira төлбөрийн актив юм; үүнийг үлгэр жишээг нунтаглахын оронд хариулснаас гаргаж авах ID. Кран нь хүсэлтээ хүлээн зөвшөөрсөн бол `tx_hash_hex` болон `status: "QUEUED"` -ийг буцаадаг.

Дараа нь өөрийн төлбөр тооцооны гүйлгээг хүргэхээс өмнө санхүүжүүлсэн хөрөнгийн талаар санал асуулга хийх:

```bash
TAIRA_FEE_ASSET_DEFINITION=$(
  jq -er '.asset_definition_id' ./taira-faucet-response.json
)

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET_DEFINITION" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

Тэмцээний шаардлагыг хүлээн зөвшөөрсөн ч данс эсвэл актив нь одоог хүртэл харагдахгүй бол транзакцын үйл ажиллагаа нь хэвээр байгаа нь testnet-ийн нийтийн шугам боловсруулалтын дараа байна.

Урьдчилгааны бэлэн шууд API хяналтын хувьд үүнийг `taira_faucet_claim.py` гэж хадгалж, Taira I105 дансанд ID шилжүүлнэ:

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

Тэмцэг нь зөвхөн Taira тестнэтийн санхүүжилтэд зориулагдсан. XOR тестийн сүлжээ, крантын тооцоо, эсвэл Taira канарын гарын үсэг зурагчдыг Minamoto урсгалд ашиглахгүй байна.

## 5. Minamoto үйлчлүүлэгчдийн тохируулалтыг бий болгох {#_5-create-a-minamoto-client-config}

Minamoto -ийн хувьд тусгай товчоо ашиглаж, Taira товчоог гол сүлжээний хувьд дахин хэрэглэхгүй.

`minamoto.client.toml` бүтээх:

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

Хамгийн дээд түвшний `chain` одоогийн Nexus гол сүлжээний зангирал ID. `[account].profile = "minamoto"` сонгодог Minamoto I105 зах зээлийн ялгавар; төгсгөлийн байрны нэр болон зах зээлийг ID Үүнийг тодорхойгүйгээр сонгохгүй байх.

Minamoto олон нийтийн түлхүүрг I105 хуудасны ID хуудас руу mainnet-ийн товчоотой хувиргана:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Хэтгэлэг нь гол сүлжээний борлуулалтын болон удирдлагын урсгалаар хангагдаж, санхүүжүүлэх хүртэл зөвхөн унших талын шалгалтыг явуулаарай:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

Taira кран эсвэл бичгийн магнитын туслах Minamoto-ийн эсрэг ажиллуулахгүй байх.

## 6. XOR компанийн Minamoto дансны санхүүжилт. {#_6-fund-a-minamoto-account-with-xor}

Minamoto төлбөр нь XOR үйлдвэрлэлээр төлдөг бөгөөд Minamoto-д олон нийтийн кран байхгүй. Хуримтлагдсан дансны санхүүжилтийг одоогоор зөвшөөрсөн гол сүлжээний борлуулалт эсвэл санхүүгийн шилжүүлэлтийн тусламжтайгаар олгох, эсвэл XOR-ийг одоо байгаа Minamoto -ийн санхүүжүүлсэн дансанд дамжуулан авах.

ID санхүүжилтийн санхүүжилтийг зөвхөн уншигч шалгалтаар баталгаажуулна. Minamoto XOR-ийг үйлдвэрлэлийн санхүүжилтээр авч үзээрэй: эхлээд ижил үйл ажиллагааг Taira дээр туршиж, үйлдвэрлэлийн түлхүүрээ тусдаа хадгалах, гол сүлжээний гүйлгээг сэргээн босгож болно гэж бодож болохгүй.

Taira XOR нь Minamoto төлбөрийг төлөхгүй байна. Тэснэтийн үлдэгдэл болон крантын барааг Minamoto-д шилжүүлэхгүй.

## 7. Одоогоор байгаа мэдээллийн орон зайны дотор ажиллах {#_7-work-inside-an-existing-dataspace}

Мэдээллийн талбайны дотоод хэсэгт оршин суугаа томоохон бүртгэлийн объектүүдэд бүрэн эрх бүхий доменын нэрийг ашиглах. Жишээ нь, олон нийтийн мэдээллийн талбай дахь төслийн доменд:

```text
apps.universal
```

Танай дансанд шаардлагатай зөвшөөрөл гарсны дараа доменийн нууцгүй `AliasSetupPlanRequestV1` зориулалтыг бий болгож, зарлигийн төлөвлөгөөг ашиглаж болно:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

Үүнд Minamoto, Үндсэн зорилт, төлөвлөгөөг тусгаарлан боловсруулж батлах. тэдгээрийн сүлжээ, эрх мэдэл, амьдрал-гоцны анкер, цаг хугацаа, Taira төлөвлөгөөг сурталчлах, дахин тоглох боломжгүй:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

Акаунтын нууц нэрүүд нь ижил мэдээллийн орчны хавсралтыг ашигладаг:

```text
alice@apps.universal
alice@universal
```

Сэтгэвчсэн бүртгэлийн талбар нь ч мөн адил ашигладаг I105 бүртгэл IDs. Үндсэн хуулийн дагуу батлагдсан хүний уншдаг холболт гэж нэрлэх. IDs.

## 8. Шинэ мэдээллийн орон зайг бүрдүүлэх {#_8-provision-a-new-dataspace}

Шинэ өгөгдлийн талбай нь оператор болон засаглалын өөрчлөлт юм. Олон нийтийн Torii төгсгөлийн цэг нь замын хөдөлгөөнийг конфигуруулсан өгөгдэл талбай руу чиглүүлж болно, гэхдээ энэ нь тодорхойгүй өгөгдлөлийн талбайн нууц нэрсийг үгүйсгэнэ.

Өөрчлөл хийхээс өмнө одоогийн амьд жагсаалтыг аваарай:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Үйлчлүүлэгчдийн бүртгэлийн хувьд авто замын тайзнаа шалгаруулаарай:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

ID, өгөгдлийн орон зай ID, баталгаажуулагч багц, алдаа хүлээх хүчин чадал, илтгэл, чиглэлийн дүрэм, үйл ажиллагааны эзэмшигч хамтдаа хяналт тавихгүй бол шинэ нууцыг сурталчлахгүй. Шаардлагатай зөвшөөрөлтэй хэвийн хэрэглэгчийн данс нь SNS доменийг худалдан авч, одоогийн өгөгдлийн орон зайны дотор байршуулж болно; шинэ олон нийтийн өгөгдэл орчныг аюулгүй нэмэх боломжгүй.

Шаардлагатай эсвэл байгууллагын мэдээллийн орон зайд дараахь каталогийн өөрчлөлтийг хийх:

- цорын ганц өгөгдлийн орон зайн нэрэмжит болон тооны `id`
- нийцсэн замын нэвтрүүлэг эсвэл одоогийн замын хуваарилалт
- Мэдээллийн орон зай `fault_tolerance`
- Тухайн чиглэлийн заавар, бүртгэлийн хүрээний чиглэлийн дүрэмүүд
- UAID ур чадварыг мэдээллийн орон зай нь илрүүлэхэд Space Directory manifest эсвэл ижил төстэй нэвтрүүлгийн гэрэл баримт
- баталгаажуулагч, нийцүүлэл, зохицуулалтын болон хяналтын бодлогын удирдлагын зөвшөөрөл

Эдгээгдэх конфигурацын хэсгүүд иймэрхүү харагдаж байна:

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

Үйлчлүүлэгч хүлээн зөвшөөрөх нь дараах хаалгуудыг багтаасан байх ёстой:

- `irohad --sora --config <config.toml> --trace-config` нь шийдвэрлэсэн түймрийн конфигурацийг дамжуулж байна
- бүтээсэн эсвэл шинжилгээ хийсэн манифст хэшүүд, гарын үсэгтэйгээр архивлагдана.
- төмрийн шинжилгээ Taira нь ямар нэгэн Minamoto сурталчилгаанаас өмнө явагдана
- `/status` өөрчлөлтийн дараах жагсаалтад төлөвлөсөн замыг болон мэдээллийн орон зайг харуулж байна
- `iroha app nexus lane-report --summary` нь шаардлагыг хангасан тэмдэглэлгүй байна гэж мэдэгдэхгүй

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

Зөвхөн Taira нэвтрүүлэг, дулааны шинжилгээ, хяналт тавих, засаглалын баримтыг дуусгасан дараа ижил мэдээллийн орчныг Minamoto -д сурталчлах.

## Үүнтэй холбоотой хуудсууд {#related-pages}

- [Нөөц Iroha 3](/mn/get-started/install-iroha.md)
- [Iroha 3 замаар үйл ажиллагаа явуулж байна CLI](/mn/get-started/operate-iroha-via-cli.md)
- [Хувийн өгөгдлийн талбайны төлөө төлбөр тооцоо](/mn/get-started/private-dataspace-fee-sponsor.md)
- [Torii эцсийн цэгүүд](/mn/reference/torii-endpoints.md)
- [Эхлэл ](/mn/reference/genesis.md) нэвтрүүлэг
