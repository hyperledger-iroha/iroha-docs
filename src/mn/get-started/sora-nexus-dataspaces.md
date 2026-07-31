---
translation_locale: mn
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 63c317ab61ba912176c43c83d5b4f026f23a7a6e5fb633872a133c9ea1295686
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Үргэлжүүл SORA 3: Taira болон Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3 нь аппликейшнээр чиглэсэн олон нийтийн ашиглалтын замаар Iroha 3 болон SORA
Nexus. Үргэлж, туршилт хийх Taira эхлээд, дараа нь ижил клиент хэлбэрийг хөдөлгөөн
. Minamoto Зөвхөн хориотой гол нөөцтэй бол, жинхэнэ XOR төлбөрийн хувьд,
үйлдвэрлэлийн зөвшөөрөл.

Энэ сургалт нь хэрхэн конфигурацийг харуулж байна Iroha олон нийтэд зориулсан үйлчлүүлэгч SORA 3
сүлжээ:

- Taira шалгалтын сүлжээ `https://taira.sora.org`
- Minamoto цахилгаан `https://minamoto.sora.org`

Хэрэглээ Taira Интеграцийн туршилт, крантээр санхүүжүүлсэн бичгийн канарын хувьд;
Хөдөлмөрийн туршилтыг ашиглах. Minamoto Зөвхөн үйлдвэрлэлийн бэлтгэлтэй гол сүлжээний хувьд
Хэвлэл мэдээллийн хэрэгслийн үйл ажиллагаа XOR:

- Taira шинжилгээний сүлжээ ашигладаг XOR Олон нийтийн гаралтай.
- Minamoto бодит хэрэглээ XOR. Үгүй байна Minamoto Улаан цөм.

## Барилгын зам {#builder-path}

| Хадгалт                        | Taira Тэсний сүлжээ                                                | Minamoto Улаанбаатар                                   |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
| Сүлжээний байдлыг уншиж эхэлнэ | Судалгаа `/status` нөөцгүй                                 | Судалгаа `/status` нөөцгүй                       |
| Мэдээллийн орон зайг сонгох            | Олон нийтийн хэрэглээ `universal` Хэрэв таны аппликейшн нь хяналтын замыг хэрэглэхгүй бол | Зөвхөн гол сүлжээний зөвшөөрөл авсан дараа ижил өгөгдлийн орон зай ашиглах |
| Тэмцээний хөрөнгө ав               | Олон нийтийн хэрэглээ Taira гаралтай                                  | Тэмцээ XOR санхүүжүүлсэн Minamoto Санхүүгийн тооцоо болон батлагдсан санхүүгийн урсгал |
| Тест бичиж байна                 | Тэмцээний санхүүжилтээр ашиглах XOR                                   | Тэмцэл хэрэгсэл ашиглахгүй; бичлэг үнэ төлбөр XOR     |
| Хөгжүүлнэ                     | Логик, хяналт тавих, гарын үсэг зурагчдыг дахин туршиж үзээрэй            | Тус системд тусгайлан хангах, санхүүжилт гаргах   |

Үйл ажиллагааны урсгал нь:

1. Хэрэглэгчийн эсрэг Taira олон нийтийг ашиглах `universal` Мэдээллийн орон зай.
2. Тус байгууллагад гарын үсэг зурагч нэмж, Taira Улаан цөм.
3. Хэрэглэлийн логик ашиглах Taira Үргэлжүүд харамсалтай болтол
   ажиглагдаж байна.
4. Өөрөөр хэлбэл Minamoto Санхүүжилт нь бодит XOR, Зөвхөн хөдөлж
   Нэгдсэн үйл ажиллагааг үргэлжлүүлэн явуулах.

## 1. Та юу хийх вэ гэдгийг ойлгох {#_1-understand-what-you-are-setting-up}

Үүнд SORA Nexus, Мэдээллийн орон зай нь сүлжээний замын болон чиглэлийн каталогийн нэг хэсэг юм.
Клиент зөвхөн өөрчлөх замаар шинэ олон нийтийн мэдээллийн орон зай бий болгодоггүй
`client.toml`. Хэрэглэгчийн тохируулалт хоёр зүйлийг хийдэг:

1. үйлчлүүлэгчийг баруун талд зааж байна Torii эцсийн цэг
2. домен, мэдээллийн орчны чиглэлийн хүрээг өөрийн санхүүгийн бүртгэлийн хувьд сонгодог

`AccountId` Энэ нь үргэлж хуулийн дагуу байдаг бөгөөд доменгүй. `[account].domain` үнэ цэнэ
`client.toml` чиглэлийн болон нууц товчлогын хүрээнд хангадаг; энэ нь
Эдгээрийн ихэнх хэрэгслийн хувьд олон нийтийн
`universal` Мэдээллийн орон зай. Доменийн хүрээнд ашигладаг `domain.dataspace` хэлбэр,
жишээ:

```text
wonderland.universal
```

Хэрэв та шинэ зохион байгуулалтын өгөгдлийн орон зай хэрэгтэй бол каталог, маршрутизарыг бэлтгэнэ
Зөвлөгөөг энгийн үйлчлүүлэгчдийн дансанд бүртгэхээс өөр.
Та үзээрэй. [Шинэ өгөгдлийн орон зайг бүрдүүлэх](#_8-provision-a-new-dataspace) Дээр нь.

## 2. Олон нийтэд шалгаарай Torii Үр дүн {#_2-check-the-public-torii-endpoint}

Сургуулагч тохируулахаасаа өмнө зорилтын төгсгөл хэсгийг идэвхжүүлэхийг шалгаарай.

Үүнд Taira:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Үүнд Minamoto:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Нөөц нь илрүүлсэн мэдээллийн орон зай, замын үзэлтийг шалгаарай:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Үүнд ижил команд `https://minamoto.sora.org/status` Энэ нь "Mainnet" гэсэн үг.

## Taira MCP Төлөөлөгчдийн хувьд {#taira-mcp-for-agents}

Taira мөн а Torii- үндсэн загварын хүрээлэн буй сүлжээ (MCP) гүүр
Агент ажиллуулах цаг. Агент амьд тестнет уншиж, скрипт хэрэгтэй үед ашиглах
эмчилгээ, ёсоор хяналт шалгалт хийх
Torii Хэрэглэгчийн өмнө.

| Харилцааг хангах | Үр дүн |
| --- | --- |
| MCP эцсийн цэг | `https://taira.sora.org/v1/mcp` |
| Түлжээний түлх | `https://taira.sora.org` |
| Дашрамдсан хэрэглээ | Taira тестнэтийн уншлага, цөмөрээс санхүүжүүлсэн бичгийн туршилтууд |
| Үйлдвэрлэлийн тэнцвэр | Энэ нэвтрүүлгийг Minamoto гол сүлжээнээс бусад MCP эцсийн цэг болон чөлөөлөгчийн хяналт шалгалтыг тодорхой зөвшөөрсөн байна |

Бүргийн метадэтгэлийг гарын үсэг зурах материалыг нэмэхээс өмнө шалгаарай:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

Тэмцээний URL хэрэглэгчийн орон нутгийн хувьд MCP Хэвлэл мэдээллийн хэрэгслийн үйл ажиллагааны цагаар үйлчлүүлэгч.
үүрэг гүйцэтгэх агент MCP төхөөрөмж, API Токенүүд, дамжуулсан зохиолчдын толгой, `authority`, эсвэл
`private_key` Энэ баримт бичгийн repo эсвэл аппликейшнүүдийн repo-д орсон үнэ цэнэ.

Эдгээрийн дагуу сайн ажилладаг Taira:

- Хөдөлмөрийн хэрэгслийг олох MCP нэвтрүүлэгт оролцогчдыг дуудлахаасаа өмнө
  серверний тайлан `listChanged`.
- Үргэлжүүлэгч `iroha.*` тоног төхөөрөмж `torii.*` хэрэгсэл.
- Зөвхөн уншигчдан эхлүүлнэ: хяналт шалгах байдал, данс, хөрөнгө, нууц нэр, блок,
  Төрийн захиргааны төлөв байдал, бүтээн байгуулалтын нөхцөл байдлыг санал болгохын өмнө бичиж байна.
- Амьдралтай шинжилгээний сүлжээний мутацын гарахаас өмнө хүний тодорхой заалыг шаарддаг.
  урьдчилан гарын үсэг зурсан гүйлгээний хуудас, хэрэглээ `iroha.transactions.submit_and_wait`
  Тиймээс агент нь зөвхөн хүргэхээс илүү үр дүнг хүлээж байна.
- Транзакцын хэшүүд, эцсийн байдал, серверний баталгаажуулах алдааг товчлуул
  Тухайн агент хариу өгнө.

### Хөдөлмөрийн урсгал {#development-workflow-with-agents}

Үндэсний хөгжлийн туслалцаа үзүүлэх агент ашиглах Iroha үйлчлүүлэгчид, гүйлгээний бүтээн байгуулагч,
Хөдөлмөрийн хэрэгслийг шалгах, шинжилгээний шугамжлангийн номын сан.
Энэ нь код шалгаж, уншиж болно Taira Улсын хэмжээнд өөрчлөлт оруулах, орон нутгийн шинжилгээ хийх,
Гэхдээ энэ нь амьд сүлжээг хүний баталгаажуулах хүртэл өөрчилж болохгүй.
Үйл ажиллагаа.

Үйл ажиллагааны урсгал нь:

1. Тус агент холбогдох эмчүүдийг шалгахыг хүсээрэй. SDK код, CLI команд, эсвэл MCP
   хэрэгслийн схем код бичэхийн өмнө.
2. Агент нь хамгийн бага үйлчлүүлэгч замыг түрээслүүлээрэй: байдлын шалгалт, данс
   хайлт, эсвэл тэнцвэрлэлийн хайл.
3. Зөвхөн уншигч дуудлагатай харьцуулахад транзакцын бүтээн байгуулалтын код нэмнэ
   Taira.
4. Жижиг сүлжээний туршилт, жишээ нь хойно `TAIRA_LIVE=1`, тийм ч
   хэвийн нэгжийн туршилтын гүйлгээ хэзээ ч туршилтын сүлжээний хөрөнгийг зарцуулахгүй эсвэл сүлжээээс хамаарна
   ашиглах боломжтой
5. Түлжээний түлхүүр, сүлжээн, эрх мэдлийн дансыг мэдээлэхыг агенттан шаард.
   заалын товчлолт, төлбөрийн актив, хүлээгдсэн байдлын өөрчлөлт
   аливаа гүйлгээ.
6. Тагнуулын ажиллагаа, дахин туршиж үзэх заншил, тасарчгүй байдал,
   Хөгжлийн хяналт тавих CI эсвэл цахим ажлын урсгал.

Зөвхөн уншихад ашигтай MCP Хөгжлийн хэрэгсэл нь сангийн хөрөнгийг хайх явдал юм.
Алиасын шийдвэрлэлт, блок хайлт, гүйлгээний хайлт, транзакцийн жагсаалтууд,
Хөдөлмөр замын байдлын хяналт шалгаруулалтыг
гарын үсэг зурсан хэрэглээний ачаа.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### Транзакцын ажлын урсгал Агентүүдээр дамжуулан {#transaction-workflow-through-agents}

Хөдөлмөрийн MCP bridge нь гарын үсэг зурсан Iroha гүйлгээ, гэхдээ энэ нь арилгахгүй
Хэрэг эрхлэхэд ч зөв
эрх мэдэл, зөвшөөрөл, төлбөрийн санхүүжилт, сүлжээ ID, Мета мэдээлэл, гарын үсэг.

Нүүрсний бүтээгдэхүүн Iroha гүйлгээ, бүтээн байгуулалтын цогцолборыг
SDK эсвэл CLI Нэгдүгээрт, дараа нь төлөөлөгчэд зөвхөн гарын үсэг зурсан санхүүгийн гүйлгээ өгөх
Байтс `body_base64`. Тус агент нь хуудасны хуудасыг
`iroha.transactions.submit_and_wait`, эсвэл
`iroha.transactions.submit` болон санал асуулга `iroha.transactions.wait`.

Тэнгэрийн хэрэгслийн нөөцийг агент-ын дуудлагад элсэхгүй байх.
Хэрэглэгчийн цагийн нууцыг татаж байгаа орон нутгийн код руу чиглүүлэх
Байгаль орчин, түлхүүр, хардварын гарын үсэг зурагч, эсвэл тестнет конфигуратын файлыг үл тооцсон.
агент нь хэзээ ч гол материалыг Markdown, тоног төхөөрөмж, тэмдэгт, эсвэл
үүрэг гүйцэтгэнэ.

Худалдааны төлөөлөгчтэй хийхээс өмнө богино хэмжээний гүйлгээ хий
төлөвлөгөө:

- `network`: Taira шинжилгээний сүлжээний гарал, зангилаа ID
- `authority`: бүртгэл хийж, төлбөр тооцоо
- `instructions`: бүртгэл, мөрийн тэмдэг, шатахуун, шилжүүлэн суулгах, метадэтгэл, зөвшөөрөл, эсвэл
  гэрээний дуудлагын товч танилцуулга
- `fee asset`: төлөх хөрөнгийг Taira
- `preflight reads`: Санхүүжилт, хөрөнгийн тэнцвэр, зөвшөөрөл, нууц үсэг эсвэл блок
  аль хэдийн хийгдсэн шалгалтууд
- `expected result`: батлагдсанаас хойш харагдах ёстой байдал
- `idempotency`: ижил хүсэлтийг дахин туршиж үзвэл яах вэ?

Хөдөлмөрийг хүргүүлсний дараа агент нь хориотой байдлыг хүлээгээд,
Урьдчилсан тайлан нь:

- гүйлгээний хэш
- терминалын байдал: `Committed`, `Applied`, `Rejected`, эсвэл `Expired`
- Блок эсвэл хайгуулын тодруулалт
- шалгалтын уншлын үр дүн
- татгалзлын мэдээ, алдаа нь зөвшөөрөл, төлбөртэй харагдаж байгаа эсэх;
  баталгаажуулалт, богино байдал эсвэл эцсийн тоног төхөөрөмжийн хүртээмж

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

Эмчилгээ Taira MCP олон нийтийн туршилтын сүлжээний хяналтын талбай болгон. Taira түлхүүр, туршилтын сүлжээ XOR,
цахилгаан хэрэгслийн санхүүжилт, канарь гарын үсэг зурагч нар нэг удаа ашиглах боломжтой бөгөөд
Minamoto тоног төхөөрөмж, үйлдвэрлэлийн чөлөөт ажлын урсгал.

## Одоо туршиж үзэх боломжтой тоглоом {#toy-examples-you-can-try-now}

Эдгээр жишээ нь зөвхөн уншихад зориулагдсан байдаг.
нөөцтэй, хоёр нийтийн сүлжээний эсрэг давамгайлсан.

Сахна Taira туршилтын сүлжээ, Minamoto гол эрүүл мэндийн:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

Олон нийтийн мэдээллийн орон зайд Taira:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Үүнтэй адил команд хий Minamoto гол сүлжээний үзэл баримт хэрэгтэй үед:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Хэдэн жижиг бүтээн байгуулалт Node.js Дашборд, бот эсвэл ашиглалтын нөхцөл байдлын шинжилгээ
шалгалт:

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

Эхний бичгийн тоглоом нь Taira Тэмцээний хэрэглээ.
XOR Энэ нь хэзээ ч Minamoto.

## 3. Taira Хэрэглэгчийн тасалбар {#_3-create-a-taira-client-config}

Хэрэв та аль хэдийн нэгтэйгүй бол түлхүүрний хосууд үүсгэх:

```bash
kagami keys --algorithm ed25519 --json
```

Бүтээгдэхүүн `taira.client.toml`:

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

Хамгийн дээд түвшний `chain` яг л Taira гүйлгээний сүлжээ ID. Хөдөлмөрийн
`[account].profile = "taira"` тохируулалтыг тусгаар тогтнолоо сонгодог Taira I105
Хадгалдааны ялгавар. ID дансны профилийг сонгохгүй байна.

Зөвхөн уншигчтай шалгалт хий:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

Иргэдийг удирдах Taira бичгийн шинжилгээний өмнө оношилгоо:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Санхүүжилт Taira Та төлбөр тооцоо гаргахаас өмнө гарын үсэг хянах.
Турах урангийн урсгал нь
[Тестнэт аваарай XOR цаашид Taira](#_4-get-testnet-xor-on-taira).

Тэмцээний хүсэлтийг хүлээн зөвшөөрч, дансыг санхүүжүүлсний дараа Taira
Канар нь сонголттой цахилгаан согтууруулах туршилтыг хийдэг:

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

Канар нь гарын үсэг зурсан шилжилт илгээж, батлагыг хүлээдэг бөгөөд
цагийн гарын үсэг зурагч тохируулалт `--write-config` хангагдана. Taira олон нийтийн
шалгалтын сүлжээн, тиймээс шуурхайны дүүрэн байдал нь гарын үсэг зурсан пинг-ийг
Төмөрөг нь өөрөө ажилладаг. `taira doctor` хяналт шалгалт
Канарын үрэгдэл `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`, өмнө хүлээгээд дахин туршиж үзээрэй
Хэрэглэгчийн конфигурацийн алдаатай гэж үздэг.

Улаангүй дулааны туршилт хийхэд канаринг хязгаарлалттай дахин туршилтын сүлжээнд багтааарай:

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

Хэрэв `iroha taira doctor` Төмөрлөгийн давхарчлал
төлбөрийн хүлээн зөвшөөрөгдлийг татгалзах нь олон нийтийн тестний зах зээлийн түр хугацааны нөхцөл юм; DNS,
TLS, эсвэл `status = "fail"` Хөдөлмөрийн шинжлэх ухааны хувьд тийм биш.

## A-г үүсгэх SORA Nexus Санхүүжилт ID {#generate-a-sora-nexus-account-id}

А SORA Nexus бүртгэл ID - энэ нь хуулийн дагуу I105 УИХ-ын гишүүн
Эдгээрийн хэрэгсэл
`[account].domain` үйлчлүүлэгчийн үнэлгээ TOML. Үүнтэй ижил олон нийтийн түлхүүр нь
янз бүрийн IDs цаашид Taira болон Minamoto, үйлдвэрлэлийн хэрэглэгчид
тусгаар тогтносон түлхүүр Minamoto.

Эд25519 товчлогыг үүсгэх эсвэл борлуулах:

```bash
kagami keys --algorithm ed25519 --json
```

Олон нийтийн түлхэгийг Taira бүртгэл ID:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

A-г өөрчлөх Minamoto гол сүлжээний товчлолтой олон нийтийн цөм:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Үр дүнд хүрсэн мэдээллийг ашигла ID хаана ч Nexus API эсвэл CLI Захиргаач нь
Каноникийн тэмдэглэл ID, Тухайлбал, Taira гаралтай `account_id`, тэнцвэр
асуултууд, хатуу бүртгэлийн талбар, эсвэл нууц нэртэй холболт.
танай үйлчлүүлэгчийн конфигурацынд хувийн цөм, мөн ижил олон нийтийн сүлжээг сонгох
`[account].profile = "taira"` эсвэл `[account].profile = "minamoto"`.

Үндсэн хуулийн ID Энэ нь өөрөө санхүүжүүлсэн зах зээлийн дансыг бий болгохгүй.
Taira, Тэснэт-ийн захиалгаар санхүүжүүлэх боломжтой.
Minamoto, зөвшөөрөлтэй гол сүлжээний борлуулалт эсвэл сангийн урсгал ашиглана.

### Нүүрний хадгаламж, санхүүжилт {#key-storage-and-backup}

Санхүүжилт ID Олон нийтийн ачкыйг хуваалцах боломжтой.
Үндсэн шилжилт, үр тариа, нөхөн сэргээлт материалыг нууцлан хадгалж байх ёстой.

Эдгээр арга хэмжээг ашиглах SORA Nexus бүртгэл:

- Хувийн түлхэгийг кодлогдсон нууц үгний менежерт хадгалах, хардвартай дэмжлэг үзүүлэх
  түлхүүр дэлгүүр, эсвэл зориулсан гарын үсэг зурах үйлчилгээ.
  үйлдвэрлэлийн товчлогыг шолтын түүх, бүртгэл, яриа хэлэлцээ, тавилан дээр хянах эсвэл үлдээх;
  эсвэл нууцалтгүй захиалгыг хийх.
- Арьс сангийн эсвэл үйлдвэрлэлийн гарын үсэг зурагчдын хувьд онцгой өндөр энтропий нууц үгийг ашигла.
  Хууль нууц үгсийг нууц үгний менежер эсвэл хуваасан хадгаламжийн үйл явцад хадгалах,
  Худалдах хувийн түлхүүртэй ижил файл эсвэл сүлжээн захиргааны багц.
- Хөрөөж байна Taira болон Minamoto Хүйцүүр нь тусгаарлагдана. Taira нэг удаа хэрэглэхэд зориулсан цөм
  туршилтын сүлжээний материал, Minamoto Үйлдвэрлэлийн сангийн эрх мэдэл болгон гол түлхүүр.
- Хувийн, олон нийтийн гол, дансны санхүүжилт ID, бүртгэлийн хувилбар,
  Санхүүжилт гаргагч нөхөн сэргээлтийн тулд хэрэглэгдэх дансны сэргээлт, хадгаламжийн тэмдэглэл
  сүлжээний хүрээлэнгээс ангид нь сэргээлтийн үеэр ашиглах хялбар.
- Ядаж нэг шифрлэгдсэн офлайн нунтаг хадгалах, географийн хувьд
  үйлдвэрлэлийн гарын үсэг зурагчдын тусгай шифрлэгдсэн нунтаглал.
  Хөдөлмөрийн санхүүжилтээс шалтгаалж, зөвхөн уншилт хийхэд зориулсан бага үйлдэл.
- Хувийн ачкыч, нууц үгс, сүлжээн захиргааны хэвлэл,
  эсвэл гарын үсэг зурсан зочид буудлын илрүүлэн гарсан байж болно.

Дэлгэрэнгүй мэдээллийг үзнэ үү
[Криптографийн түлхүүр хадгалах](/mn/guide/security/storing-cryptographic-keys.md)
болон [Хууль нууцын аюулгүй байдал](/mn/guide/security/password-security.md).

## 4. Тэснет аваарай XOR цаашид Taira {#_4-get-testnet-xor-on-taira}

Нийтийн шилжилтээс шууд ашигла.

1. Дахилгач үүсгэж, борлуулах болон түүний санхүүгийн тооцоо Taira бүртгэл ID.
2. Одоогийн гарааны цогцолборыг аваарай.
3. Хэрэв `difficulty_bits` нь `0`.
4. Тэмцээний хүсэлтгээ хүргүүлнэ.
5. Санхүүжилт болон хөрөнгийн үлдэгдэл илгээхийн өмнө харагдахыг хүлээх
   Төлбөр төлөх бичиг.

Олон нийтийн түлхүүрг Taira I105 бүртгэл ID Цэцээр хүлээгддэг:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Тэмцээг ав:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
```

Тэмцэл нь олон нийтийн туршилтын сүлжээний үйлчилгээ юм.
эргэлт `502`, цаг хугацааны хорио, эсвэл галт тэрэгний түвшинд өөр алдаа, хүлээх, дахин туршиж үзэх
Таний нөөц эсвэл үйлчлүүлэгчдийн тохируулалтыг өөрчлөхөөс өмнө.

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

Хэзээ `difficulty_bits` бол `0`, зөвхөн бүртгэл өгнө ID:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}'
```

Хэзээ `difficulty_bits` нь `0`, цогцолборыг шийдэж,
анкергийн өндөр болон нонс:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{
    "account_id": "<TAIRA_I105_ACCOUNT_ID>",
    "pow_anchor_height": 741,
    "pow_nonce_hex": "<NONCE_HEX>"
  }'
```

Тэмцээний алгоритм нь:

1. Хөгдөлмөрийг SHA-256 дууссан:
   - байт `iroha:accounts:faucet:pow:v2`
   - УИХ-ын гишүүн UTF-8 бүртгэл ID
   - `anchor_height` Их бөх шиг `u64`
   - `anchor_block_hash_hex` байтээр кодлогдсон
   - `challenge_salt_hex` нэвтрүүлэгт оролцох үед байт хэлбэрээр кодлогдсон
2. Та үүнийг туршиж үзээрэй. `u64` Big-endian 8-byte-ийн үнэ цэнэтэй нонс.
3. Нонс бүртгүүлэхэд:
   - Пароль: 8-байтын нонс
   - тус: 32 байтын сорилт
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - гаргах урт: 32 байт
4. Хамгийн түрүүнд хамгийн багадаа `difficulty_bits`
   нурууны битэд хүргэдэг.

Тэмцээний хариу нь санхүүжүүлсэн актив болон шуурхай гүйлгээний хэшийг бүрдүүлдэг:

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

Үүнд хариу нь одоо HTTP `202 Accepted`. Ашигт малтмал
тодорхойлолт ID Дээр нь Taira Төрийн хангамжийн санхүүжилттэй төлбөрийн хөрөнгө.
түлхүүр нь хүсэлтээ хүлээн зөвшөөрсөн тохиолдолд буцааж өгсөн `tx_hash_hex` болон
`status: "QUEUED"`.

Дараа нь өөрийн төлбөрийг гаргахаас өмнө санхүүжүүлсэн хөрөнгийн талаар санал асуулга явуулна
гүйлгээ:

```bash
iroha --config ./taira.client.toml ledger asset get \
  --definition 6TEAJqbb8oEPmLncoNiMRbLEK6tw \
  --account <TAIRA_I105_ACCOUNT_ID>
```

Тэмцээний шаардлагыг хүлээн зөвшөөрсөн боловч сан эсвэл актив нь харагдахгүй бол
Гэсэн хэдий ч, гүйлгээ нь олон нийтийн тестний шугамыг боловсруулж байна.
уншихдаа дахин туршиж үзээрэй.

Урьдчилгааны бэлэн шуурхай API шалгалт, үүнийг `taira_faucet_claim.py`
болон дамжуулах Taira I105 бүртгэл ID:

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

Төмөр нь зөвхөн ... Taira тестнэтийн санхүүжилт XOR, гаралтай
бүртгэл, эсвэл Taira Канарын гарын үсэг зурагч Minamoto урсгал.

## 5. Minamoto Хэрэглэгчийн тасалбар {#_5-create-a-minamoto-client-config}

Үргэлт хийхэд тусгай товчоо ашиглах Minamoto. Дахин хэрэглэхгүй Taira Төв сүлжээний түлхүүр

Бүтээгдэхүүн `minamoto.client.toml`:

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

Хамгийн дээд түвшний `chain` одоогийн Nexus гол сүлжээний зангирал ID.
`[account].profile = "minamoto"` сонгодог Minamoto I105 зангирал
зөрчилтэй; төгсгөлийн байрны нэр, зангилаа ID Үүнийг шууд бусдаа сонгохгүй байх.

A-г өөрчлөх Minamoto олон нийтийн ачкыч нь I105 бүртгэл ID .
"mainnet" товчоо:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Хэтгэлээ хангах, санхүүжүүлэх хүртэл зөвхөн уншсан талын шалгалтыг явуулаарай
гол сүлжээний борлуулалт эсвэл удирдлагын урсгал:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

Хөдөлмөрийн хэрэгсэл Taira цахилгаан хэрэгсэл Minamoto.

## 6. а) санхүүжилт Minamoto Хэтгэлэг XOR {#_6-fund-a-minamoto-account-with-xor}

Minamoto Үндэсний үйлдвэрлэлтэй холбоотойгоор төлбөр тооцогдох XOR, болон Minamoto олон нийттэй
түлхүүр. Хувьцаалан зохион байгуулагдсан дансны санхүүжилт нь зөвшөөрөлтэй гол сүлжээний борлуулалтаар хийгдэнэ
эсвэл санхүүгийн шилжүүлэн суулгах, хүлээн авах XOR одоогийн санхүүжүүлсэн Minamoto
Санхүүжилт.

Каноникийн тооллогыг шалгах ID цаашид зөвхөн уншдаг шалгалтуудаас санхүүжүүлэн
Хэвлэл мэдээлэл, мэдээллийн хэрэгсэл Minamoto XOR үйлдвэрлэлийн сангийн хувьд:
ижил үйл ажиллагаа Taira Нэгдүгээрт, үйлдвэрлэлийн голдыг тусдаа хадгалах
гол сүлжээний гүйлгээг сэргээн босгох боломжтой гэж үзнэ.

Taira XOR төлөж чадахгүй Minamoto Тэснэт-ийн үлдэгдэл, цөмөрний эрэлт
Хөдөлмөрийн Minamoto.

## 7. Одоогоор байгаа мэдээллийн орон зайны дотор ажиллах {#_7-work-inside-an-existing-dataspace}

Тодорхой хэмжээний доменийн нэрүүдийг ашиглах
Жишээ нь, олон нийтийн мэдээллийн орон зай дахь төслийн домен
хэрэглээ:

```text
apps.universal
```

Танай дансанд шаардлагатай зөвшөөрөл байгаа дараа нууцгүй захиалгыг бий болго
`AliasSetupPlanRequestV1` доменд зориулсан зорилго, зарлигийн төлөвлөгөөг ашиглах:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

Үүнд Minamoto, Үндсэн зорилго, төлөвлөгөөг тусгайлан боловсруулж батлах.
тэдгээрийн зангил, эрх мэдэл, амьд улс орнуудын анкер, цаг хугацаа
Taira төлөвлөгөөг сурталчлах эсвэл дахин тоглох боломжгүй:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

Хэтгэлийн нууц нэрүүд нь ижил мэдээллийн орон зайн хавсралтыг ашигладаг:

```text
alice@apps.universal
alice@universal
```

Сэтгэвч санхүүгийн талбар нь ч мөн адил I105 бүртгэл IDs. Үндсэн хуулийн дагуу
хүн уншиж болох, ханимын зохицуулалд нийцсэн холбогдсон IDs.

## 8. Шинэ мэдээллийн орон зайг бүрдүүлэх {#_8-provision-a-new-dataspace}

Шинэ мэдээллийн орон нутаг нь оператор болон засаглалын өөрчлөлт. Torii
төгсгөлийн цэг нь замын хөдөлгөөнийг конфигуруулсан өгөгдлийн бүсэд чиглүүлж болно, гэхдээ энэ нь татгалзах болно
Мэдээллийн орон тооны нууц нэр.

Өөрчлөл хийхээс өмнө одоогийн амьд жагсаалтыг аваарай:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Үйлчлүүлэгчдийн бүртгэлийн хувьд замын тайзнаа шалгах:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

Тэмцээний замыг өөрчлөхгүй бол шинэ нууцаар сурталчилгаа хийх хэрэггүй ID, өгөгдлийн орон зай ID, баталгаажуулагч багц,
алдааны хүлээлт, илтгэл, чиглэлийн дүрэм, үйл ажиллагааны эзэн
Хэрэглэгчийн бүртгэлтэй
доменийг эзэмшиж, түүний SNS .
alias Planner; энэ нь аюулгүй шинэ олон нийтийн мэдээллийн орон зайг нэмж чадахгүй.

Шаардлагатай эсвэл байгууллагын мэдээллийн орон зайд:

- цорын ганц өгөгдлийн орон зайн нууц нэр болон тооны `id`
- нийцсэн замын нэвтрүүлэг эсвэл одоогийн замын хуваарилалт
- мэдээллийн орон зай `fault_tolerance`
- Газрын замын заавар, дансны хүрээг хангах ёстой чиглэлийн дүрэмүүд
  Энэ
- Space Directory-ийн манфист эсвэл ижил төстэй нэвтрүүлгийн гэрчилгээ,
  өгөгдлийн орон тооны илрэл UAID чадвар
- баталгаажуулагч, нийцүүлэл, зохицуулалт болон хяналтын үйл ажиллагааны удирдлагын зөвшөөрөл
  бодлого

Эдгээгдэх конфигуратын хэсэг нь иймэрхүү харагдаж байна:

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

- `irohad --sora --config <config.toml> --trace-config` Үндсэн хуулийн
  шийдвэрлэсэн түймрийн конфигурац
- үүсгэн бүтээсэн эсвэл шалгасан манифст хэшүүд болон гарын үсэгтэйгээр архивлагдана
- Төмөр шинжилгээ хийлгэж байна Taira ямар ч Minamoto Хөгжлийн
- өөрчлөлтийн дараа `/status` Каталог нь төлөвлөсөн замыг болон мэдээллийн орчныг харуулж байна
- `iroha app nexus lane-report --summary` сураггүй байна гэж мэдэгдэхгүй
  тэмдэглэлүүд

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

Үүнтэй ижил мэдээллийн орон зайг дэмжих Minamoto Зөвхөн Taira ашиглалтад оруулах,
Хог хаягдлын шинжилгээ, хяналт тавих, удирдлагын баримт бичгийг бүрэн гүйцэтгэж байна.

## Үүнтэй холбоотой хуудсууд {#related-pages}

- [Нэвтрүүлэг Iroha 3](/mn/get-started/install-iroha.md)
- [Хөдөлмөр Iroha 3 дамжуулан CLI](/mn/get-started/operate-iroha-via-cli.md)
- [Хувийн мэдээллийн орчны төлбөр](/mn/get-started/private-dataspace-fee-sponsor.md)
- [Torii эцсийн цэг](/mn/reference/torii-endpoints.md)
- [Эхлэлд дурдсан](/mn/reference/genesis.md)
