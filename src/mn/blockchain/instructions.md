---
translation_locale: mn
translation_source: /blockchain/instructions.md
translation_source_hash: ade5ba2b693de7e798490be0947099d0306d9565b88550e201dccd181810fb18
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Iroha Ардчилсан заавар {#iroha-special-instructions}

Бид тухайгаа ярьж байхдаа [хэрхэн Iroha үйл ажиллагаа явуулдаг](/mn/blockchain/iroha-explained), Бид үүнийг хэлсэн. Iroha Дэлхийн оршин тогтнолыг өөрчлөх цорын ганц арга бол тусгай тушаал. Хэрэв та энэ сургалтын хэлний талаарх удирдамжийг уншсан бол Та аль хэдийн хэд хэдэн удирдамжийг харсан: `Register<Account>` болон `Mint<Numeric>`.

Iroha тусгай заавар бичгийн бүрэн жагсаалтыг хүргэж байна:

|Сургалтын |Тодруулбал |
| --------------------------------------------------------- | ------------------------------------------------ |
| [бүртгэл / бүртгэлээс татгалзах ](#un-register) |ID нь блокчейн дээр шинэ этгээдэд өгөх. |
| [Mint/Burn](#mint-burn) |Mint/burn санхүүгийн хөрөнгө эсвэл сэргээлтийг үүсгүүлэх. |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |Блокчейн объектын мета өгөгдлийг шинэчлээрэй. |
| [SetParameter](#setparameter) |Захиргааны өргөн хэсгийг байлгаарай. |
| [](#grant-revoke) олгох/сэргээх|Тусгай зөвшөөрөл, үүрэг олгох эсвэл арилгах. |
| [](#transfer) шилжүүлэн суулгах|Ашигт малтмалын эзэмшлийн болон хөрөнгийн үнэ цэнийг шилжүүлнэ. |
| [Үндэсний хадгаламж болон хөрөнгийн хаалгалтын ](#native-escrow-and-asset-locks) |Санхүүгийн эд хөрөнгийг протоколын хяналтад байлгах.|
| [Атомын нууц тооцоо](#atomic-private-settlement) | Нууц pool болон атомын багцуудыг удирдана. |
| [ExecuteTrigger](#executetrigger) |Хөгжүүлэгчийг гүйцэтгэнэ. |
| [Хөгжлийн тэмдэглэл/Хүнзэт хэрэглээ/Үндэсний шинэчлэл ](#other-instructions) |Хөгжлийн явцыг тэмдэглэх, өргөжүүлэх, шинэчлэх. |

Бид Iroha тусгай заалын товчлоор эхэлж үзье. Сургалтын бүрдүүлэхэд ямар объектыг дуудлах боломжтой вэ, болон тухайн объектт зориулсан ямар заавар авах боломжтой вэ

## Тодорхойлолт {#summary}

Тухайлбал, шилжүүлэн суулгах хэлбэрүүд нь эзэмшдэг номын сангийн эд зүйл болон тооны хөрөнгөг хамардаг бол монтажлага нь тооны хөрөнгийг хамардаг бөгөөд дахин давтагдалыг үүсгэдэг.

Зарим даалгаврыг тодорхойлох шаардлагатай. Жишээ нь, хөрөнгийг шилжүүлэн өгөөч бол үргэлж ямар дансанд шилжүүлж байгаагаа тодорхойлох хэрэгтэй. Өөрөөр хэлбэл, та ямар нэгэн зүйлийг бүртгүүлэхэд зөвхөн тухайн зүйл л хэрэгтэй болно.

|Сургалтын |Бүтээгдэхүүн |Зочид буудлага |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias) |Энгийн домен, мэдээллийн орон зай болон бүртгэлийн нууц товчлолтын|                      |
| [бүртгэл / бүртгэлээс татгалзах ](#un-register) |нягтлан бодох бүртгэл, хөрөнгийн тодорхойлолт, NFTs, үүрэг гүйцэтгэх хүчин зүйлүүд, ижил төстэй зүйлс; доменийг устгах |                      |
| [Mint/Burn](#mint-burn) |Санхүүгийн хөрөнгө, сэргээлт үйлдэл |бүртгэл эсвэл үүсгэгчид |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |[метэдэйтэйлүүд](./metadata.md): домен, нягтлан бодох бүртгэл, хөрөнгийн тодорхойлолт, NFTs, RWAs, үүсгэгч |                      |
| [SetParameter](#setparameter) |сүлжээний параметр |                      |
| [](#grant-revoke) олгох/сэргээх| [үүрэг, зөвшөөрлийн тэмдэгүүд](/mn/blockchain/permissions.md) |нягтлан бодох бүртгэл, үүрэг|
| [](#transfer) шилжүүлэн суулгах|доменүүд, хөрөнгийн тодорхойлолтууд, тооны хөрөнгө NFTs |бүртгэл|
| [Үндэсний хадгаламж болон хөрөнгийн хаалгалтын ](#native-escrow-and-asset-locks) |санхүүгийн хөрөнгийн хадгаламж, хөрөнгийн хаалгалт, нууцлагдсан хадгаламжийн үүрэг |худалдан авагчид, чиглэлүүд эсвэл маргаан хуваагдал |
| [Атомын нууц тооцоо](#atomic-private-settlement) | тодорхой чиглэлд хязгаарлагдсан нууц pool, бодлогын эргэлт, эцэслэсэн багц болон цуцлах тэмдэг | |
| [ExecuteTrigger](#executetrigger) |хөдөлгөөнч .|                      |
| [Хөгжлийн тэмдэглэл/Хүнзэт хэрэглээ/Үндэсний шинэчлэл ](#other-instructions) |бүртгэл, гүйцэтгэгчд зориулсан ашиг ачаалал, гүйцэтгэхчийн шинэчлэл |                      |

Түүнчлэн ISI -ийг харахад өөр нэг арга байдаг, тэдгээрийн холбогдох томоохон бүртгэлийн объект:

|Зорилго .|Судалгаа |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|Санхүүжилт |бүртгэл / бүртгэлээс татгалзсан нягтлан бодох бүртгэл, хүлээн авах хөрөнгийн санхүүжилт, дансны шинэчлэл, зөвшөөрөл олгох/сэргээх болон үүрэг гүйцэтгэх .|
|Домен |Доменийг байгуулж, доменийг бүртгэхгүй болгох, доменийн эзэмшилд шилжүүлэх, доменын метадэтгэлийг шинэчлэх. |
|Ашигт малтмалын тодорхойлох |бүртгэл / бүртгэлээс татгалзсан тодорхойлолт, эзэмшлийн шилжүүлэн суулгах, шинэчилсэн метадэтгэл |
|Байгууллага |Mint/burn тооны хэмжээ, санхүүжилтийн тооны хэмжээ |
|Хөрөнгө оруулалт |нээж, хүлээн зөвшөөрөх, төлбөрийг тэмдэглэх, чөлөөлөх, хүчингүй болгох, маргааныг шийдвэрлэх, арилгах, эсвэл эх сурвалжийн хяналтын баримтыг дуусгах. |
|NFT |бүртгэл / бүртгэлээс татгалз NFTs, эзэмшилд шилжүүлэн суулгах, шинэчлэх метадэтгэл |
|RWA |бүрэлдэхүүнийг бүртгүүлэх, нэвтрүүлгийн тоо хэмжээ, хадгалах/жуулгах, хүйцлэх/хүйцлэх, төлөх, нэгтгэх, метадэтгэлийг шинэчлэн тогтоох, хяналтын |
|Триггер|бүртгүүлэх/ашиглах, Mint/burn trigger-ийн давтамжууд, гүйцэтгэх trigger, шинэчлэх trigger-ний метадэтгэл |
|Дэлхий |бүртгүүлэх / бүртгэлээс татгалзсан өрсөлдөөн, үүрэг, параметр тогтоох, гүйцэтгэгч шинэчлэх |

## CLI Жишээ нь: {#cli-examples}

Энэ хуудасны жишээ нь та Iroha ажлын хэсгээс гарааны нутгийн үйлчлүүлэгчний тохируулалтын эсрэг захирамж ажиллуулж байгаа гэж үздэг:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

Хэрэв та `iroha` бинар ашиглаж байгаа бол `iroha --config ./defaults/client.toml`-ийг хэрэглэж, доорх байршуулагчдыг сүлжээний үнэ цэнэтэй орлуулах:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

Олон нийтийг чиглэсэн үед Taira шинжилгээний сүлжээ, Taira Хэрэглэгчийн конфигурац. Төлбөр төлөх жишээг ашиглахаас өмнө, [Тестнет аваарай XOR цаашид Taira](/mn/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) тухайн `taira_faucet_claim.py`, цаашлаад шалгалтын сүлжээ XOR цөмөрээс:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Тэмцээний санхүүжүүлсэн хөрөнгө илэрсэн дараа газын сангийн хэрэглэгдэх метабараа бүртгүүлэхэд хавсралтгүй:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` нь доменүүд болон тэдгээрийн SNS түрээсийн гэрээг бий болгох энгийн анхны нэвтрүүлгийн зам юм. Энэ нь үнэн зөв өгөгдлийн орон зай, эзэмшигч, түрээсийн хугацаа, үнийн саналыг байгуулж, дараа нь бүх шаардлагыг атомын дагуу үүсгэдэг эсвэл засваруулдаг. `POST /v1/aliases/setup/plan` эцсийн нүктейг баталгаажуулсан эсвэл ижил төстэй CLI ажлын урсгалыг ашиглах:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

Зохиол, төлөвлөгөө нь нууцгүй боловч алхамны тэмдэгт хэрэглэж, тохируулсан данстай энгийн гүйлгээг хүргэж байна. Тус төлөвлөгөө нь зангилаа, эрх мэдэлээ, амьд оршин тогтногчдын байр сууриа, эцсийн хугацаатай холбоотой; хэзээ ч өөр сүлжээнд дахин хэрэглэхгүй.

## (Үндэсний) бүртгэл {#un-register}

Блокчейн дээр шинэ байгууллагад ID олгох чиглэлээр бүртгэл хийх, бүртгэхгүй байх нь заавар хэрэглэдэг байна.

Бүх зүйл бүртгэгдэх нь хоёулаа `Registrable` болон `Identifiable`, Гэхдээ энэ бүх зүйл биш `Identifiable` Энэ нь `Registrable`. Ихэнх зүйл шууд бүртгэгддэг боловч зарим тохиолдолд блокчейн дахь төлөөлөл нь их хэмжээний мэдээлэлтэй байдаг. Аюулгүй байдал, гүйцэтгэлийн шалтгааны улмаас бид эдгээр мэдээллийн бүтэцүүдэд "Builders" ашигладаг (гэхдээ: `NewAccount`), хамтарсан бүртгэл нь өөрийн гэсэн эзэмшлийн баталгааны заавартай байдаг. Ер нь бүртгүүлэх боломжтой бүх зүйл ч бүртгэлгүй байж болно, гэхдээ энэ бол хатуу, хурдан дүрэм биш.

Та данс, хөрөнгийн тодорхойлолт, NFTs, дундаж, үүрэг, түлхэцүүдийг бүртгэж болно. Доменийн тохируулалт `EnsureAlias` ашигладаг; түүхий эд `Register::Domain` ашиг ачааллыг генезис / буутстрап хийхэд тусгажээ. Дундаж бүртгэл нь `RegisterPeerWithPop`-ийг ашигладаг бөгөөд энэ нь дундаж товчлогын эзэмшлийн нотолгоотой байдаг. Байгууллагын нэр дээр тавьсан хязгаарлалтын талаар мэдэхийн тулд [ нэрлэх конвенцийг](/mn/reference/naming.md) шалгаарай.

RWA хэсгийг тусгайлан `RegisterRwa` заавар суулгаж бий болгодог. Одоогийн код нь `UnregisterRwa` заавар суулгадаггүй; төлөөлөн тоог түлшүүлэхийн тулд `RedeemRwa` ашиглах.

::: info

Та [ генезисийн блок](/mn/guide/configure/genesis.md)-ийг `genesis.json` -д хэрхэн байгуулж шийдвэрлэхээс хамаарна (мөсгөлдөө, Та зөвшөөрлийн токенүүдийг бүртгэх эсэхээс үл хамааран), дансны бүртгэлийн үйл явц маш өөр байж болно. Ер нь, бид үүнийг ингэж товчлуулж болно:

- Олон нийтийн блокчейн дээр хэн ч бүртгэл хийх боломжтой байх ёстой.
- Хувийн блокчейн дээр дансыг бүртгэхэд өвөрмөц үйл явц байж болно. Түнгийн хувийн блокчейнд буюу дансны бүртгэлийн ямар нэгэн өвөрмөрийн үйл явцгүй блокчейн дотор өөр нэг дансыг бүртгүүлэхэд та данс хэрэгтэй.

Бид [ хувийн болон олон нийтийн блокчейн ](/mn/guide/configure/modes.md) харьцуулахад эдгээр ялгааг маш дэлгэрэнгүй хэлэлцэж байна.

:::

::: info

Тухайн үеийнхнийг бүртгүүлэх нь одоогийн байдлаар сүлжээт анхдагч итгэлийг хүлээсэн сүлжээний нэг хэсэг биш байсан сүлжээнүүд нэмэх цорын ганц арга юм.

:::

Блокчейн объектыг бүртгэхэд хэлний талаар тодорхой удирдамж ашигла:

|Хэл |Дасгалжуулагч|
| --------------------- | ------------------------------------------------------------------------------------------------------- |
|CLI |[Iroha CLI](/mn/get-started/operate-iroha-via-cli.md) доменийг байгуулж, данс, хөрөнгийг бүртгэхэд ашигла. |
|Rust |[Rust сургалтыг ашигла](/mn/guide/tutorials/rust.md). |
|Kotlin/Java |[Kotlin/Java сургалтыг ашиглах ](/mn/guide/tutorials/kotlin-java.md). |
|Python |[Python сургалтыг ашигла](/mn/guide/tutorials/python.md). |
|JavaScript/TypeScript |[JavaScript/TypeScript сургалтыг ашиглаарай ](/mn/guide/tutorials/javascript.md). |

Ердийн доменийн тохируулалтыг төлөвлөж, хэрэглэж, дараа нь доменийг дахин шаардлагагүй үедээ бүртгэхгүй байх:

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

бүртгэлтэй болон бүртгэлгүй бүртгэлийн сан:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

Ашигт малтмалын тодорхойлолтыг бүртгэж, бүртгүүлэхээс татгалзах:

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

Бүртгэл болон бүртгэлээс татгалздаг NFTs. NFT бүртгэл нь түүний агуулгыг уншдаг JSON стандарт нэвтрүүлэгээс:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

бүртгэлийн болон бүртгэлээс татгалзсан үүрэг:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

Тавилгагчдыг бүртгүүлж, тавилаагүй болго. Триггерийн бүртгэл нь IVM байт кодыг бүрдүүлсэн эсвэл цувралтай заалын жагсаалтыг хийх шаардлагатай. Энэ жишээ нь `Log` заалыг CLI-ийн дагуу барьж, түүнийг цахилгаан бүртгэлд оруулж байна:

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

Сэтгүүлчид бүртгэлтэй, бүртгэлгүй байна. Үргэлж BLS түлхүүр, PoP хамтран `kagami` Хэрэв та аль хэдийн эдэлгээгүй бол:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./peer-key
PEER_KEY=$(tr -d '\n' < ./peer-key/public.key)
PEER_POP=$(tr -d '\n' < ./peer-key/pop.hex)

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## Мунт/Бурн {#mint-burn}

Чингисэл, түймэрлэх нь тооны хөрөнгө болон хязгаарлалттай дахин давтагдалтай үйл ажиллагаа явуулдаг. Зарим хөрөнгийг хянах боломжгүй гэж мэдэгдэх боломжтой бөгөөд энэ нь тэдгээрийг бүртгэлийн дараа ганцхан удаа хянах боломжтой гэсэн үг юм.

Ашигт малтмалын санхүүжилт нь тухайн хөрөнгийг анх бүртгэсэн дансанд ордог. Ашигт малтмалын хэмжээ нь сөрөг биш тул та хэзээ ч `$-1.0` хөрөнгийг авч чадахгүй эсвэл сөрөг хэмжээг шатааж, мөнгөн тэмдэг авах боломжгүй юм.

Mint блокчейн хөрөнгийг хэлний хувьд тодорхой заавар ашиглах:

- [CLI](/mn/get-started/operate-iroha-via-cli.md)
- [Rust](/mn/guide/tutorials/rust.md)
- [Kotlin/Java](/mn/guide/tutorials/kotlin-java.md)
- [Python](/mn/guide/tutorials/python.md)
- [JavaScript/TypeScript](/mn/guide/tutorials/javascript.md)

Энэ нь хөрөнгийн түймрийн жишээ юм:

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

Мунт, галзуугийн үрэвслийн давтагдал:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## Хөдөлмөрийн шилжилт {#transfer}

Хөдөлмөрийн хөрөнгө оруулалт нь хөрөнгийн эзэмшилт эсвэл үнэ цэнийг бүртгэлийн хооронд шилжүүлнэ. Гаалийн шилжүүлэн суулгах хэлбэрүүд домен, хөрөнгийн тодорхойлолт, тооны хөрөнгө болон NFTs. RWA хэмжээний хөдөлгөөн нь `TransferRwa` болон `ForceTransferRwa` [Дэлхийн эд хөрөнгийг ](/mn/blockchain/rwas.md)-д заасан зориулсан чиглэлийг ашигладаг .

Үүнтэй холбоотойгоор, [хөрөнгийг шилжүүлэн суулгах зөвшөөрөл](/mn/reference/permissions.md). Ашигт малтмалын хөрөнгийг [CLI](/mn/get-started/operate-iroha-via-cli.md) эсвэл [Rust](/mn/guide/tutorials/rust.md).

Санхүүгийн хөрөнгийг шилжүүлэх:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

Хөдөлмөрийн домен, хөрөнгийн тодорхойлолт, NFT эзэмшлийн:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## Үндэсний хадгаламж, хөрөнгийн гулгалт {#native-escrow-and-asset-locks}

Үндэсний хадгаламжийн заавар санхүүгийн хөрөнгийг номоор хяналтын протоколын хяналтад байлгадаг. Тэд зах зээлийн хэв маягтай зохицуулалт, нийтлэг хөрөнгийн хаалгуулах, нууцлан хамгаалалттай хадгаламж урсгалд ашиглагддаг.

Зах зээлийн хадгаламжийн хэрэглээ `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, болон `ResolveEscrowDispute`. Ашигт малтмалын нууцлал ашиглах `OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, болон `ExpireAssetLock`. Үндэсний зах зээлийн амьдралын эргэлтийг тодорхойлох `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, болон `ResolveAnonymousEscrowDispute`.

Эдгээр ISIs одоогийн байдлаар нэгдүгээр ангитай биш CLI тушаалуудыг ашиглах SDK барилгын ажилтнууд эсвэл цувралтай сургалтын хэрэглэгдэх ачааллууд, [Тухайн хөрөнгийн хяналт тавих](/mn/blockchain/escrow.md) амьдралын мөрийн дэлгэрэнгүй мэдээлэл, зөвшөөрөл, асуултууд, үйл явдлууд, Rust үлгэр жишээ.

## Атомын нууц тооцоо {#atomic-private-settlement}

Засаглалын хяналттай атомын нууц тооцооны заавар нь ил тод Native AMX-ээс тусдаа. `ActivatePrivateSettlementPoolV1` засаглалын засварласан проекц болон каноник эх үүсвэрийн үүргээс тодорхой чиглэлд нэг нууц `pool` үүсгэнэ. `FinalizeAtomicPrivateSettlementV1` оролцогч бүх хороо баталгаажуулсан бүрэн багцыг атомын зарчмаар хэрэгжүүлнэ. `AbortAtomicPrivateSettlementV1` зөвхөн ивээн тэтгэгчийн зөвшөөрсөн нийтэд нээлттэй төгсгөлийн тэмдгийг нийтэлнэ.

`RotatePrivateSettlementPoolPolicyV1`-ийг зөвхөн нууцлалын засаглал гүйцэтгэнэ. Заавар нь одоогийн засаглалын digest-тэй яг таарахыг шаардана; чиглэл, `pool`, хөрөнгө холбох үүрэг, төлөвийн хязгаар, replay багцууд болон эцэслэсэн баримтуудыг хадгалж, нийтэд нээлттэй revision-ийг нэгээр нэмэгдүүлэн аудиторын түлхүүрийн шинэ epoch-ийг ашиглана. Эргэлт нь оруулсан өндөрт идэвхжих бөгөөд яг тэр өндөрт ижил чиглэл болон `pool`-ийн баримтыг эцэслэхгүй. Нийтэд нээлттэй revision-ийн удам нь эргэлтээс өмнө эцэслэсэн баримтуудыг дахин эхлүүлсний дараа ч хүчинтэй, яг адил давталтыг idempotent байлгана. Хуучин бодлогоор боловсруулагдаж буй багцууд төлөв өөрчлөгдөхөөс өмнө fail closed болно. Операторууд хуучин тайлах түлхүүрүүдийг хадгалах, эсвэл түлхүүрийг устгахаас өмнө капсулыг засаглалын дагуу дахин боож турших ёстой.

Энэ зам анхдагчаар унтраалттай бөгөөд үйлдвэрлэлийн хэрэглээнд тэнцсэн гэж баталгаажаагүй. Тохиргоо, эрх мэдэл, аудит, сэргээх болон гаргалтын шаардлагыг [өгөгдлийн орон зайн хооронд атомын нууц тооцоо ажиллуулах](/get-started/atomic-private-settlement) хэсгээс үзнэ үү.

## Төлөөт / Хуцалтгүй болгох {#grant-revoke}

Төлбөрийн [ зөвшөөрөл, үүрэг ](permissions.md)-д олгох болон цуцахыг хориглох заавар ашиглана.

`Grant` нь хэрэглэгчдэд ганцхан зөвшөөрөл, эсвэл тусгай зөвшөөрлийн бүлэг ("роль") байнга олгоход ашиглагддаг. олгогдсон үүрэг болон зөвшөөрлийг зөвхөн `Revoke` заавар дамжуулан арилгаж болно.

Ахуйн нэгжээс үүрэг олгох, цуцалах:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

Тусгай зөвшөөрлийн токенүүдийг олгох, хүчингүй болгох. Тухайн зөвшөөрлийн команд нь зөвшөөрлийн объектыг стандартын өгөгдөлөөс уншдаг:

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

Эдгээр заавар нь объект [ метаданга](/mn/blockchain/metadata.md)-ийг шинэчлэх. Метадангийн өгөгдлийг элсүүлэх эсвэл солихын тулд `SetKeyValue` ашиглаж, нэггээрийг устгахын тулд `RemoveKeyValue`.

Metadata `set` команд нь JSON -ийн үнэлгээг стандарт өгөгдөлөөс уншиж байна:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

Санхүүжилт, хөрөнгийн тодорхойлолт NFTs, RWAs-ийн хувьд мөн адил хэв маяг байдаг бөгөөд түлхүүр нь:

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

`SetParameter` нь идэвхтэй өгөгдлийн загвар болон гүйцэтгэгчээр илэрсэн зангилаа дагуулсан параметрүүдийг өөрчлөх болно.

Стандарт нэвтрүүлэг дээр JSON цорын ганц параметрын объектээр дамжуулан хэсгийг байгуулж:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

Энэ заалыг [ үүсгэгчдийг ](./triggers.md) гүйцэтгэхэд ашигладаг.

Үндсэн хуулийн CLI нэвтрүүлэгчүүдийг бүртгэж, цахилгаан үйлдлийн үйл явдлыг шууд бүртгэх боломжтой. `execute trigger` захирамж, тийм ч заавар ирүүлэх `ExecuteTrigger` заавар, цувралтай үүсгэх `InstructionBox` нэгтэй SDK эсвэл гүйцэтгэгч хэрэгсэл болон үр дүнд хүрсэн JSON түвшний `ledger transaction stdin`:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## Бусад заавар {#other-instructions}

Iroha нь цахилгаан хэрэгслийн цаг хугацаа болон гүйцэтгэгчдийн интеграцын доод түвшний заалыг ч илрүүлнэ:

- `Log`: гүйцэтгэх явцад бүртгэл гаргана.
- `CustomInstruction`: гүйцэтгэгчд зориулсан JSON ашиг ачаалал тээвэрлэх
- `Upgrade`: гүйцэтгэгч шинэчлэлийг идэвхжүүлнэ

`Log` заавар бичгийг Пинг хяналтын тусламжтайгаар хүргүүлнэ:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

Хөдөлмөрийн хэрэгслийн гүйцэтгэгчний заавар `InstructionBox` хэлбэрээр хүргүүлнэ. Хөдөлмөр ачааллын хэлбэр нь гүйцэтгэгчийн хувьд тодорхой байдаг тул сургалтыг тохируулагч SDK эсвэл гүйцэтгэврийн хэрэгсэлээр үүсгэх:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

IVM байт кодын файлын гүйцэтгэгчдээс шинэчлэл:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
