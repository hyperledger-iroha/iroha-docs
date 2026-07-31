---
translation_locale: mn
translation_source: /blockchain/instructions.md
translation_source_hash: 3251078b2b2268ff78563c02a0f935c63dc0569f0b6d38071150cbb4b89394d6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha Тодруулбал: {#iroha-special-instructions}

Бид тухайн үед [хэрхэн Iroha үйл ажиллагаа явуулдаг](/mn/blockchain/iroha-explained), бид
гэж хэлсэн. Iroha Дэлхий дахинд өөрчлөлт оруулах цорын ганц арга бол тусгай даалгавар.
-Та нар "Байгалгагч" бичгийг уншиж байсан бол,
Энэ сургалтын хэлний талаарх удирдамжууд, та аль хэдийн хэд хэдэн
заавар: `Register<Account>` болон `Mint<Numeric>`.

Энэ бол бүх зүйлсийн жагсаалт. Iroha Тодруулбал:

| Судалгаа                                               | Тодруулбал:                                     |
| --------------------------------------------------------- | ------------------------------------------------ |
| [Бүртгэл/Брэлзүүлэх](#un-register)                       | Хэлэлцүүлэг ID Блокчейн дээр шинэ нэгж рүү.    |
| [Төгс/төгс](#mint-burn)                                   | Мөнгөний санхүүжилт/сөгжүүлэх санхүүжилтийн хөрөнгө эсвэл сэргээлт үйлдэл. |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) | Блокчейн объектын мета өгөгдлийг шинэчлэх.               |
| [SetParameter](#setparameter)                             | Захиргааны өргөн хэсгийг байгуулж.                      |
| [Төлөөт / Хуцалтгүй болгох](#grant-revoke)                             | Та зөвшөөрөл болон үүргийг олгох эсвэл арилгах.            |
| [Хөдөлмөрийн шилжилт](#transfer)                                     | Хууль эзэмшигч эсвэл хөрөнгийн үнэ цэнийг шилжүүлнэ.               |
| [Үндэсний хадгаламж болон хөрөнгийн хаалгуулалт](#native-escrow-and-asset-locks) | Санхүүгийн активүүдийг протоколын хяналтад байлгах.     |
| [ExecuteTrigger](#executetrigger)                         | Тэгжирүүлэгчдийг гүйцэтгэх.                                |
| [Тогтоолын / Хувьсгал / шинэчлэл](#other-instructions)                 | Хөгжлийн явцыг бүртгүүлнэ, өргөжүүлнэ эсвэл шинэчлэнэ.        |

Эхлээд Iroha Ардчилсан заавар, тус бүр ямар зүйлсийг
сургалтын тухай зааж өгөх боломжтой, тус бүрд ямар даалгавар байдаг вэ
Нөхцөл зүйл.

## Тодорхойлолт {#summary}

Энэ чиглэлийн тухайн зүйлсийн жагсаалт байдаг.
Жишээ нь, шилжүүлэн суулгах вариантууд өмчлөх томоохон бүртгэлийн объектыг хамардаг
ба санхүүгийн хөрөнгө, мөн санхүүгийн хөрөнгийг хамардаг
давтагдал.

Зарим даалгаврыг тодорхойлох шаардлагатай. Жишээ нь,
Та хөрөнгө орлогыг шилжүүлэн суулгахдаа үргэлж ямар дансанд байгаагаа тодорхойлох хэрэгтэй
Үүнээс гадна, та ямар нэгэн зүйлийг бүртгэж байгаа бол
Та бүртгэх ёстой зүйл л хэрэгтэй.

| Судалгаа                                               | Бүтээгдэхүүн                                                                                                 | Орчмын газар          |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias)                               | энгийн домен, мэдээллийн орон зай болон данс-акунтын тохируулалт                                                 |                      |
| [Бүртгэл/Брэлзүүлэх](#un-register)                       | нягтлан бодох бүртгэл, хөрөнгийн тодорхойлолт, NFTs, үүрэг, үүсгэгч, ижил төстэй; доменийг арилгах                                |                      |
| [Төгс/төгс](#mint-burn)                                   | тооны хөрөнгө, сэргээлт үйлдэл                                                                     | бүртгэл, үүсгэгч |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) | эд зүйлүүд [металл мэдээлэл](./metadata.md): домен, нягтлан бодох бүртгэл, хөрөнгийн тодорхойлолтууд; NFTs, RWAs, гадаргуулагч |                      |
| [SetParameter](#setparameter)                             | сүлжээний параметр                                                                                        |                      |
| [Төлөөт / Хуцалтгүй болгох](#grant-revoke)                             | [үүрэг, зөвшөөрлийн тэмдэгт](/mn/blockchain/permissions.md)                                                  | нягтлан бодох бүртгэл    |
| [Хөдөлмөрийн шилжилт](#transfer)                                     | доменүүд, хөрөнгийн тодорхойлолтууд, тооны хөрөнгө, NFTs                                                        | нягтлан бодох бүртгэл             |
| [Үндэсний хадгаламж болон хөрөнгийн хаалгуулалт](#native-escrow-and-asset-locks) | Санхүүгийн хөрөнгийн хадгаламж, хөрөнгийн хаалгалт, нууцлагдсан хадгаламжийн үүрэг                                    | худалдан авагч, чиглэл эсвэл маргааны хуваагдал |
| [ExecuteTrigger](#executetrigger)                         | гадаргуулагч                                                                                                |                      |
| [Тогтоолын / Хувьсгал / шинэчлэл](#other-instructions)                 | бүртгэл, гүйцэтгэгчд зориулсан ашиг ачаалл, гүйцэтгэхчийн шинэчлэл                                                     |                      |

Өөр нэг арга ч бий. ISI, томоохон бүртгэлийн объект
тэд:

| Зорилго           | Сургалтууд                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| Санхүүжилт          | бүртгэл / бүртгэлээс татгалзсан данс, хүлээн авах хөрөнгө, дансны шинэчилсэн метрийн өгөгдөл, зөвшөөрөл олгох / хүчингүй болгох болон үүрэг    |
| Домен           | Доменийг байгуулж, доменийг бүртгэхгүй болгох, доменийн эзэмшилд шилжүүлэх, доменын метадэтгэлийг шинэчлэх                    |
| Ашигт малтмалын тодорхойлох | бүртгэл / бүртгэлээс татгалзсан тодорхойлолт, эзэмшлийн шилжүүлэн суулгах, шинэчилсэн метадэтгэг                                         |
| Ашигт малтмал            | Хөдөлмөр/төгслийн тооны хэмжээ, шилжүүлэн суулгах тооны хэмжээ                                                        |
| Хөдөлмөрийн санхүүжилт           | төлбөрийг нээж, хүлээн зөвшөөрч, тэмдэглэж, илгээсэн, чөлөөлөх, цуцлах, маргааныг шийдвэрлэх, арилгах, эсвэл эх орны халамжийн баримтыг дуусгах |
| NFT              | бүртгэл / бүртгэлээс татгалз NFTs, эзэмшлийн шилжүүлэн суулгах, шинэчлэх метадэтгэл                                                |
| RWA              | Товч, нэвтрүүлгийн хэмжээ, хадгалах/арилжүүлэх, хүйцвэрлэх/хүйцвэрлэхийг зогсоох, төлөх, нэгтгэх, метадэтгэлийг шинэчлэх, хяналтын |
| Триггер          | бүртгэл / бүртгэлээс татгалзаж, mint/burn trigger-ийн давтамдлал, гүйцэтгэх trigger, шинэчлэх trigger-ний метабарууд                 |
| Дэлхий            | бүртгэл / бүртгэлээс татгалзсан ижил түвшин, үүрэг, параметр тогтоох, гүйцэтгэгчд шинэчлэл хийх                                    |

## CLI Жишээлбэл {#cli-examples}

Энэ хуудаст байгаа жишээ нь та өрийн урсгаас захирамж явуулж байна гэж үздэг
Iroha ажлын орон зай нь орон нутгийн үйлчлүүлэгчдийн урьдчилсан тохируулгатай:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

Хэрэв та `iroha` дундаж, ашиглах
`iroha --config ./defaults/client.toml` Харин оршин суугчдыг солиод
Дараах нь таны сүлжээний үнэ цэнэтэй:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

Олон нийтийг зорилтот болгоход Taira туршилтын сүлжээ, Taira үйлчлүүлэгчдийн конфигурац.
Нүүр хуудасны тусламжтайгаар төлбөр төлөх жишээг ашиглахаас өмнө
[Тестнэт аваарай XOR цаашид Taira](/mn/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
Үүнд `taira_faucet_claim.py`, Дараа нь эрэлт тестнэт XOR гаралтай бөмбөг:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Нүүрсээр санхүүжүүлсэн хөрөнгө илэрсэн дараа шаардлагатай газийн активг холбох
Транзакцын бичиг баримт:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` доменийг бий болгохын тулд анхны нэвтрүүлэг хийх хэвийн зам бөгөөд
тэдгээрийн SNS Хөдөлмөр эрхлэгч, худалдан авагч
Тэргүүн хэсгийг, захиалгыг, дараа нь бүх шаардлагыг атомын байдлаар бий болгож засварлана.
Үнэлгээний баталгааг ашигла `POST /v1/aliases/setup/plan` эцсийн цэг эсвэл тохируулалт
CLI ажлын урсгал:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

Үндсэн зорилго, төлөвлөгөө нь нууцгүй боловч алхам тэмдэгт хэрэглэж
Нэвтрүүлэгт бүртгэгдсэн дансанд орсон нэгдсэн гүйлгээ.
зангил, эрх мэдэл, амьд оршин тогтнох байдал болон хугацаа; хэзээ ч бие биедээ дахин ашиглахгүй
Хүлжээ.

## (Үндэсний) бүртгэл {#un-register}

Бүртгэл болон бүртгэлгүй байх нь ID a-д
Блокчейн дээр шинэ нэгж.

Бүх зүйл бүртгэгдэж болох нь хоёулаа `Registrable` болон `Identifiable`,
Гэхдээ энэ бүх зүйл биш `Identifiable` бол `Registrable`. Ихэнх зүйл нь
шууд бүртгэгдсэн боловч зарим тохиолдолд блокчейн дахь төлөөлөл
аюулгүй байдал, гүйцэтгэлийн шалтгаанаар бид
Эдгээр мэдээллийн бүтэцүүдийн бүтээн байгуулагчид (ш.д. `NewAccount`), болон ижилхэн
бүртгэл нь өөрийн гэсэн эзэмшилдээ батлах заавартай байдаг.
бүртгэлтэй бүх зүйл нь ч бүртгэлгүй байж болно, гэхдээ энэ биш
Энэ нь хүнд, хурдан дүрэм юм.

Та данс, хөрөнгөний тодорхойлолтыг бүртгэж болно. NFTs, хамтарч, үүрэг гүйцэтгэгч
Доменийн тохируулалтын хэрэглээ `EnsureAlias`; түүхий эд `Register::Domain` хэрэглээний ачаалл
генезис/bootstrap-д зориулагдсан.
`RegisterPeerWithPop`, Энэ нь ижил төстэй түлхэгийг эзэмших гэрчилгээтэй.
[хурлын нэр](/mn/reference/naming.md) хязгаарлалтын талаар мэдэхийн тулд
Бүтээгдэхүүний нэрсийг тавиарай.

RWA Үүнд зориулсан `RegisterRwa` УИХ-ын гишүүн
одоогийн код нь `UnregisterRwa` заавар; хэрэглэх
`RedeemRwa` төлөөлөн тоог тэтгэвэрт гаргах.

::: info

Та өөрийн хувилбарыг хэрхэн зохион байгуулахыг шийдэхээс шалтгаалан
[Женезисийн бөмбөг](/mn/guide/configure/genesis.md) .д `genesis.json`
(Өөрөгчдийн зөвшөөрлийн бүртгэлтэй эсэх нь тодорхой
Токенс) бүртгэлийн үйл явц маш өөр байж болно.
Ерөнхийлөгч, бид үүнийг ингэж товчлуулж болно:

- А _олон нийт_ Блокчейн, хэн ч бүртгэлтэй байх ёстой.
- А _хувийн_ Блокчейн нь бүртгэлийн хувьд өвөрмөц үйл явц байж болно
  Санхүүжилт. _дүрэмт_ хувийн блокчейн буюу
  бүртгэлийн ямар ч өвөрмөц үйл явцыг, та
  Өөр нэг дансыг бүртгэнэ.

Бид эдгээр ялгааг дэлгэрэнгүй хэлэлцэж,
[хувийн болон олон нийтийн блокчейнүүдийг харьцуулаарай](/mn/guide/configure/modes.md).

:::

::: info

Одоогийн байдлаар ижил төстэй хүн бүртгүүлэх цорын ганц арга бол
Хүлжээний анхны найдвартай дундагчийн хэсэг.

:::

Refer Хэлээр тодорхой заагчдын нэгдээс
Блокчейн дээр объектүүдийг бүртгэх үйл явц:

| Хэл              | Дагшлага                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| CLI                   | Хөдөлмөрийн [Iroha CLI](/mn/get-started/operate-iroha-via-cli.md) доменүүдийг байгуулж, данс болон хөрөнгийг бүртгэх. |
| Rust                  | Хөдөлмөрийн [Rust сургалт](/mn/guide/tutorials/rust.md).                                                      |
| Kotlin/Java           | Хөдөлмөрийн [Kotlin/Java сургалт](/mn/guide/tutorials/kotlin-java.md).                                        |
| Python                | Хөдөлмөрийн [Python сургалт](/mn/guide/tutorials/python.md).                                                  |
| JavaScript/TypeScript | Хөдөлмөрийн [JavaScript/TypeScript сургалт](/mn/guide/tutorials/javascript.md).                               |

Гадаад доменийн тохируулалтыг төлөвлөж, хэрэглэж, дараа нь доменийг бүртгэхгүй байх үед
илүү удаан шаардлагатай:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain unregister --id docs.universal
```

Тодруулсан болон бүртгүүлсэн эсэх бодит сан:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

Санхүүжилтийн бүртгэл болон бүртгэлээс татгалзсан хөрөнгийн тодорхойлолтууд:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition register \
  --id "$ASSET_DEF" \
  --name docs_token \
  --alias docs_token#docs.universal \
  --scale 0

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition unregister --id "$ASSET_DEF"
```

Бүртгэл болон бүртгэлээс татгалзсан NFTs. NFT бүртгэл нь түүний агуулгыг уншдаг JSON цаашид
Стандарт өгөгдлийн:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

Бүртгэл болон бүртгэлээс татгалзсан үүрэг:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

Триггер бүртгэх, бүртгэхийг хориглох тушаал
цуглуулсан IVM Байт код эсвэл цувралтай заалын жагсаалт. Энэ жишээ нь
а `Log` УИХ-ын CLI Энэ нь цахилгаан бүртгэлд орж:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml -o \
  ledger transaction ping --log-level INFO --msg "hourly cleanup" |
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger register --id hourly_cleanup \
  --instructions-stdin \
  --filter time \
  --time-start 5m \
  --time-period-ms 3600000

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger unregister --id hourly_cleanup
```

Төгсөгчдийн бүртгэл болон бүртгэлийг цуцлах. BLS түлхүүр, PoP хамтран `kagami`
Хэрэв та аль хэдийн тэдгээрийг аваагүй бол:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## Төгс/төгс {#mint-burn}

Хөдөлмөр, түймэрлэл нь тооны хөрөнгө болон хязгаарлагдмал
Зарим хөрөнгийг эргэлтгүй гэж тодруулж болно.
тэдгээрийг бүртгэл хийсний дараа ганцхан удаа тэмдэглэж болно.

Ашигт малтмалын санхүүжилт
Бага санхүүгийн хэмжээ нь сөрөг биш тул та
хэзээ ч `$-1.0` Мөнгө, хөрөнгийн мөнгийг шатааж, манлай авах болно.

Хэлний тухай зааварчилгааны нэгээс хараарай
Блокчейн дотор хөрөнгийг олборлох үйл явц:

- [CLI](/mn/get-started/operate-iroha-via-cli.md)
- [Rust](/mn/guide/tutorials/rust.md)
- [Kotlin/Java](/mn/guide/tutorials/kotlin-java.md)
- [Python](/mn/guide/tutorials/python.md)
- [JavaScript/TypeScript](/mn/guide/tutorials/javascript.md)

Тэнд хөрөнгийг шатаах жишээ байна:

- [CLI](/mn/get-started/operate-iroha-via-cli.md)
- [Rust](/mn/guide/tutorials/rust.md)

Мөнгөний санхүүжилт:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset mint \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 100

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset burn \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 10
```

Төгс, түймрийн хориог дахин давтахад:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## Хөдөлмөрийн шилжилт {#transfer}

Хөдөлмөрийн санхүүжилт
Үргэлт нь доменүүд, хөрөнгийн тодорхойлолт, тооны хөрөнгө, NFTs. RWA
тоо хэмжээний хөдөлгөөн нь зориулсан `TransferRwa` болон `ForceTransferRwa`
дэд хэсэгт заасан [Байгаль орчин](/mn/blockchain/rwas.md).

Үүний тулд
[хөрөнгийг шилжүүлэх зөвшөөрөл](/mn/reference/permissions.md). Үүнээс
хөрөнгийн шилжүүлэн шилжүүлэх талаарх жишээ
[CLI](/mn/get-started/operate-iroha-via-cli.md) эсвэл
[Rust](/mn/guide/tutorials/rust.md).

Санхүүгийн хөрөнгө шилжүүлнэ

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

Хөдөлмөрийн домен, хөрөнгийн тодорхойлолт, NFT эзэмшилт:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## Тусгай хяналт татварын болон хөрөнгийн гулгал {#native-escrow-and-asset-locks}

Үндэсний захиалгын заавар санхүүгийн активтыг номын сүлжээнд хяналтын протоколд хаах
Хөрөнгийн хэв маягтай зохицуулалт хийхэд ашигладаг
нээлттэй, нууцлан хамгаалалттай хадгаламжийн урсгал.

Зах зээл дээр хадгаламжийн хэрэглээ `OpenAssetEscrow`, `AcceptAssetEscrow`,
`MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`,
`OpenEscrowDispute`, болон `ResolveEscrowDispute`. Үндэсний хөрөнгийн замбараа ашиглах
`OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, болон
`ExpireAssetLock`. Анонимт хадгаламж нь зах зээлийн амьдралын эргэлтийг харуулж байна
`OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`,
`MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`,
`CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, болон
`ResolveAnonymousEscrowDispute`.

Эдгээр ISIs одоогийн байдлаар нэгдүгээр ангитай CLI тушаалыг ашиглах SDK
барилгын ажилтнууд эсвэл цувралтай сургалтын хэрэглээний ачаа,
[Үндэсний хөрөнгийн хяналт](/mn/blockchain/escrow.md) Амьдралын мөрийн дэлгэрэнгүй мэдээллийг,
зөвшөөрөл, асуултууд, үйл явдал Rust Жишээ нь:

## Төлөөт / Хуцалтгүй болгох {#grant-revoke}

Төлбөр олгох, цуцлах журам ашиглагдана
[зөвшөөрөл, үүрэг](permissions.md).

`Grant` хэрэглэгчид нэг удаагийн зөвшөөрөл олгох зорилгоор ашигладаг, эсвэл
зөвшөөрлийн бүлэг ("роль"). олгогдсон үүрэг болон зөвшөөрлийг зөвхөн
цахилгаан замын `Revoke` Энэ чиглэлийн дагуу
ухамсартай хэрэглэх.

Ахуйн нэгжээс үүрэг олгох, цуцалах:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

Тус зөвшөөрлийг олгох, цуцлах токенүүд.
стандарт өгөгдлийн объект:

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

Роль дээр зөвшөөрлийг олгох, цуцлах:

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

Энэ заавар шинэчлэл объектын [металл мэдээлэл](/mn/blockchain/metadata.md). Хэрэглээ
`SetKeyValue` Metadata-ын бүртгэлд оруулж, орлуулах; `RemoveKeyValue` .
Нэг нь устгах.

Мэдээлэл `set` команд унших JSON стандарт өгөгдлийн үнэлгээ:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

Санхүүжилт, хөрөнгийн тодорхойлолтоор ч ижил загвар байдаг. NFTs, RWAs,
болон хөдөлгөөн үүсгэгч:

```bash
printf '{"display_name":"Alice"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account meta set --id "$ALICE" --key profile

printf '{"issuer":"docs"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition meta set --id "$ASSET_DEF" --key issuer

printf '{"color":"blue"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft meta set --id 'badge$docs.universal' --key traits

printf '{"owner":"ops"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger meta set --id hourly_cleanup --key owner
```

## `SetParameter` {#setparameter}

`SetParameter` идэвхтэй мэдээллээр илэрсэн зангилаа дагуулсан параметрүүдийг өөрчлөх
загвар, гүйцэтгэгч.

Нэг үзүүлэлтээр дамжуулан хэсгийг тохируулна JSON стандартын объект
нэвтрүүлэг

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

Энэ захирамжийг гүйцэтгэхэд ашигладаг [гадаргуулагч](./triggers.md).

Хөдөлмөрийн CLI түлхүүжүүлэгчийг бүртгэж, түлхүүжилтийн үйл явдлыг бүртгэх боломжтой
шууд. `execute trigger` команд, тийм ч
гарын авлага ирүүлнэ `ExecuteTrigger` заавар, цувралтай үүсгэх
`InstructionBox` . SDK эсвэл гүйцэтгэгч хэрэгсэл болон үр дүнд хүрсэн JSON
түвшний `ledger transaction stdin`:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## Бусад заавар {#other-instructions}

Iroha мөн зардах цаг болон гүйцэтгэгчний доод түвшний заалыг илрүүлнэ
нэгтгэл:

- `Log`: гүйцэтгэх явцад бүртгэл гаргах
- `CustomInstruction`: гүйцэтгэгчд зориулсан тээвэр JSON хэрэглээний ачаалл
- `Upgrade`: гүйцэтгэгч шинэчлэлийг идэвхжүүлнэ

A-ыг хүргүүлнэ `Log` Пинг хөмрөгчтэй заавар:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

Үндэсний гүйцэтгэгч суурь заалыг цувралтай хэлбэрээр хүргүүлнэ `InstructionBox`. Хөдөлмөрийн
хэрэглэгчийн ачааны хэлбэр нь гүйцэтгэгчд зориулагдсан тул тушаалыг
нийлүүлэх SDK эсвэл гүйцэтгэгч хэрэгсэл:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

Хөгжүүлэгчг нэгдсэн IVM байт кодын файл:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
