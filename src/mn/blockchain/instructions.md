---
translation_locale: mn
translation_source: /blockchain/instructions.md
translation_source_hash: ef50253c5478c9d8c3e14529dc4c2f3de67c344901c82c65be77ceb237a29598
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Iroha-гийн тусгай зааврууд {#iroha-special-instructions}

Бид [Iroha хэрхэн ажилладаг](/mn/blockchain/iroha-explained) талаар тайлбарлахдаа дэлхийн төлөвийг зөвхөн Iroha-гийн тусгай заавруудаар өөрчилдөг гэж хэлсэн. Тэгвэл ямар тусгай зааврууд байдаг вэ? Хэрэв та энэ зааврын хэл тус бүрийн гарын авлагыг уншсан бол `Register<Account>` болон `Mint<Numeric>` зэрэг хэд хэдэн заавартай аль хэдийн танилцсан.

Iroha-гийн тусгай заавруудын бүрэн жагсаалт:

| Заавар | Тайлбар |
| --------------------------------------------------------- | ------------------------------------------------ |
| [Бүртгэх/Бүртгэлээс хасах](#un-register) | Блокчэйн дээрх шинэ объектод ID олгох. |
| [Mint/Burn](#mint-burn) | Тоон хөрөнгө эсвэл триггерийн давталтыг гаргах/шатаах. |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |Блокчейн объектын метадатаг шинэчилнэ үү.|
| [SetParameter](#setparameter)                             |Сүлжээний хэмжээнд параметр тогтоох.|
| [Grant/Revoke](#grant-revoke) | Зөвшөөрөл болон үүрэг олгох эсвэл цуцлах. |
| [Шилжүүлэх](#transfer) | Өмчлөх эрх эсвэл хөрөнгийн утгыг шилжүүлэх. |
| [Протоколын эскроу ба хөрөнгийн түгжээ](#native-escrow-and-asset-locks) | Тоон хөрөнгийг протоколын хадгалалтад түгжих. |
| [Атомар нууц тооцоо](#atomic-private-settlement) | Нууц тооцооны пулууд болон атомар багцуудыг удирдах. |
| [ExecuteTrigger](#executetrigger) | Триггерүүдийг ажиллуулах. |
| [Log/Custom/Upgrade](#other-instructions) | Лог хөтлөх, гүйцэтгэх орчны үйлдлийг өргөтгөх эсвэл шинэчлэх. |

Эхлээд Iroha-гийн тусгай заавруудыг ямар объект дээр хэрэгжүүлж болох, мөн объект бүрд ямар заавар боломжтойг нэгтгэн харъя.

## Товч мэдээлэл {#summary}

Заавар бүрд түүнийг хэрэгжүүлж болох объектуудын жагсаалт бий. Жишээлбэл, шилжүүлгийн хувилбарууд нь өмчлөх боломжтой леджерийн объектууд болон тоон хөрөнгийг хамардаг бол гаргах үйлдэл нь тоон хөрөнгө болон триггерийн давталтыг хамарна.

Зарим заавруудад очих газрыг зааж өгөх шаардлагатай байдаг. Жишээлбэл, хэрэв та хөрөнгө шилжүүлж байгаа бол та үргэлж аль данс руу шилжүүлэхээ зааж өгөх хэрэгтэй. Нөгөө талаас, ямар нэг зүйлийг бүртгэж байх үед танд шаардлагатай зүйл бол зөвхөн бүртгэх хүсч буй объект юм.

| Заавар | Объектууд | Хүлээн авагч |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias) | ердийн домэйн, өгөгдлийн орон зайн өөр нэр болон дансны өөр нэрийг тохируулах | |
| [Бүртгэх/Бүртгэлээс хасах](#un-register) | данс, хөрөнгийн тодорхойлолт, NFTs, үүрэг, триггер, peer-үүд; домэйн устгах | |
| [Mint/Burn](#mint-burn) | тоон хөрөнгө, триггерийн давталт | данс эсвэл триггер |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) | [мета мэдээлэл](./metadata.md)–тай объектууд: домэйн, данс, хөрөнгийн тодорхойлолт, NFTs, RWAs, триггерууд |                      |
| [SetParameter](#setparameter)                             |гинжийн параметрүүд|                      |
| [Grant/Revoke](#grant-revoke) | [үүрэг болон зөвшөөрлийн токенууд](/mn/blockchain/permissions.md) | данс эсвэл үүрэг |
| [Шилжүүлэх](#transfer) | домэйн, хөрөнгийн тодорхойлолт, тоон хөрөнгө, NFTs | данс |
| [Протоколын эскроу ба хөрөнгийн түгжээ](#native-escrow-and-asset-locks) | тоон хөрөнгийн эскроу, хөрөнгийн түгжээ, нэргүй эскроугийн криптографийн коммитментууд | худалдан авагч, хүлээн авагч эсвэл маргааны хуваарилалт |
| [Атомар нууц тооцоо](#atomic-private-settlement) | маршрут тус бүрийн нууц пулууд, бодлогын сэлгэлт, эцэслэсэн багцууд болон цуцлалтын тэмдэглэгээ | |
| [ExecuteTrigger](#executetrigger) | триггерүүд | |
| [Log/Custom/Upgrade](#other-instructions) | логууд, гүйцэтгэгчид зориулсан payload-ууд, гүйцэтгэгчийн шинэчлэлтүүд | |

ISI-г тухайн зааврын харьцдаг бүртгэлийн объектоор нь мөн ангилж болно:

| Объект | Зааврууд |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| Данс | данс бүртгэх/бүртгэлээс хасах, хөрөнгө хүлээн авах, дансны метадатаг шинэчлэх, зөвшөөрөл болон үүрэг олгох/цуцлах |
| Домэйн | домэйн тохиргоог баталгаажуулах, домэйнийг бүртгэлээс хасах, домэйны өмчлөл шилжүүлэх, домэйны метадатаг шинэчлэх |
| Хөрөнгийн тодорхойлолт | тодорхойлолт бүртгэх/бүртгэлээс хасах, өмчлөл шилжүүлэх, метадата шинэчлэх |
| Хөрөнгө | тоон хэмжээг гаргах/шатаах, тоон хэмжээг шилжүүлэх |
| Эскроу | протоколын хадгалалтын бүртгэлийг нээх, хүлээн авах, төлбөр илгээснийг тэмдэглэх, чөлөөлөх, цуцлах, маргах, шийдвэрлэх, хэсэгчлэн татах эсвэл хугацаа дуусгах |
| NFT | NFTs бүртгэх/бүртгэлээс хасах, өмчлөл шилжүүлэх, метадата шинэчлэх |
| RWA | лотууд бүртгэх, тоо хэмжээ шилжүүлэх, барих/чөлөөлөх, царцаах/царцаалтыг цуцлах, эргүүлэн авах, нэгтгэх, метадата болон хяналтыг шинэчлэх |
| Триггер | бүртгэх/бүртгэлээс хасах, триггерийн давталтыг гаргах/шатаах, триггер ажиллуулах, триггерийн метадатаг шинэчлэх |
| Дэлхий | peer болон үүрэг бүртгэх/бүртгэлээс хасах, параметр тохируулах, гүйцэтгэгчийг шинэчлэх |

## CLI Жишээ {#cli-examples}

Энэ хуудсын жишээнүүдийг upstream Iroha ажлын орчноос анхдагч локал клиент тохиргоотой ажиллуулна гэж үзнэ:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

`iroha` гүйцэтгэх файлыг суулгасан бол оронд нь `iroha --config ./defaults/client.toml` ашиглана. Гүйлгээ илгээдэг командууд мөн `--fee-payer authority` дамжуулж, гарын үсэг зурах данснаас шимтгэл авна; CLI гарын үсэг зурахаас өмнө яг шимтгэлийг тооцож харуулна. Доорх орлуулагч утгуудыг өөрийн сүлжээний утгаар солино:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

Нийтэд нээлттэй Taira туршилтын сүлжээнд хандахдаа Taira үйлчлүүлэгчийн тохиргоог ашиглаж, [Taira дээр туршилтын XOR авах](/mn/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) хэсгийн урьдчилан бэлтгэдэг хөрөнгө авах урсгалаар дансыг санхүүжүүлнэ. Шимтгэлтэй жишээг ажиллуулахын өмнө шимтгэлийн хөрөнгийн үлдэгдэл харагдаж байгааг шалгана:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="$(
  curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
    | jq -er '.asset_definition_id'
)"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Taira бичих үйлдлүүд ижил `--fee-payer authority` сонголт ашиглаж, CLI шимтгэлийг Taira-гийн шимтгэлийн хөрөнгөөр тооцож харуулна. `gas_asset_id` зэрэг шимтгэлийн түлхүүрийг гүйлгээний метадата болгон бүү нэм; үйлчлүүлэгч тэдгээрийг няцаана:

```bash
cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --fee-payer authority \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` нь эхний хувилбарт домэйн болон түүний SNS түрээсийг үүсгэх ердийн зам юм. Энэ нь яг өгөгдлийн орон зай, эзэмшигч, түрээсийн хугацаа болон үнийн саналын шалгах нөхцөлийг мэдэгдлийн хэлбэрээр холбож, дараа нь шаардлагатай бүх төлөвийг атомик байдлаар үүсгэх эсвэл засна. Баталгаажуулалт шаарддаг `POST /v1/aliases/setup/plan` төгсгөлийн цэг эсвэл тохирох CLI урсгалыг ашиглана:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./domain.plan.json
```

Зорилго ба төлөвлөгөө нь нууцгүй боловч хэрэглээний алхам нь тохируулагдсан дансаар энгийн гүйлгээг гарын үсэг зурж, илгээдэг. Төлөвлөгөө нь өөрийн сүлжээ, эрх олгох гол эрхтэн, амьд төлвийн тулгуур, хугацаанд холбогдсон байдаг; өөр сүлжээнд дахин ашиглаж болохгүй.

## (Бүртгүүлэхгүй / Бүртгүүлэх) {#un-register}

Бүртгүүлэх болон бүртгэлээс гаргах нь блокчейнд шинэ объектод ID өгөхдөө ашигладаг зааврууд юм.

Бүртгэлжүүлэх боломжтой бүх зүйл нь `Registrable` ба `Identifiable` байдаг боловч `Identifiable` бүх зүйл `Registrable` биш юм. Ихэнх зүйлс шууд бүртгэлждэг боловч зарим тохиолдолд блокчэйн дэх төлөөлөл илүү их өгөгдөл агуулдаг. Аюулгүй байдал ба гүйцэтгэлийн шалтгаанаар бид ийм өгөгдлийн бүтэцүүдэд зориулан баригчдыг ашигладаг (жишээ нь `NewAccount`), мөн сүлжээний хамтран ажиллагчийн бүртгэл нь үүрэг эзэмшлийг баталгаажуулах тусгай заавартай байдаг. Ерөнхий дүрмийн дагуу бүртгэгдэх боломжтой бүх зүйлсийг мөн цуцалж болно, гэхдээ энэ нь хатуу чанд дүрэм биш юм.

Та данс, хөрөнгийн тодорхойлолт, NFTs, сүлжээний хамтрагчид, үүрэг, триггерүүдийг бүртгүүлэх боломжтой. Домайн тохиргоо нь `EnsureAlias`-ыг ашигладаг; түүхий `Register::Domain` payload нь зориулсан genesis/bootstrap. сүлжээний хамтрагчийн бүртгэл нь сүлжээний хамтрагчийн түлхүүрийн эзэмшлийн баталгаа агуулсан `RegisterPeerWithPop`-ийг ашигладаг. Байгууллагын нэрэнд тавигдсан хязгаарлалтын талаар мэдэхийн тулд манай [нэрлэх журам](/mn/reference/naming.md)-ийг шалгана уу.

RWA их хэмжээг зориулагдсан `RegisterRwa` зааврын дагуу үүсгэдэг. Одоогийн код `UnregisterRwa` зааврыг ил гаргадаггүй; төлөөлөгдсөн хэмжээг устгахад `RedeemRwa` ашигла.

::: info

Тэмдэглэж ав: Та `genesis.json`-д [блокчэйн үүсгэж буй блок](/mn/guide/configure/genesis.md)-ээ хэрхэн тохируулах нь (ялангуяа зөвшөөрлийн токен бүртгэлийг оруулах эсэхэд) хамааран, данс бүртгэх процесст маш их ялгаа гарч болно. Ерөнхийдөө бид үүнийг дараах байдлаар нэгтгэн үзүүлж болно:

- Нийтийн блокчейнд хэн ч данс үүсгэж болох ёстой.
- Хувийн блокчэйнд дансуудыг бүртгэх онцгой процесс байж болно. Ерөнхий хувийн блокчэйнд, жишээ нь дансуудыг бүртгэх ямар ч онцгой процессгүй блокчэйнд, та өөр нэг дансыг бүртгэхийн тулд данстай байх шаардлагатай.

Бид эдгээр ялгааг [хувийн болон нийтийн блокчэйнүүдийг харьцуулах](/mn/guide/configure/modes.md) хийх үедээ нарийн дэлгэрэнгүй авч хэлэлцдэг.

:::

::: info

Сүлжээний түншийг бүртгэх нь одоогоор анхны итгэмжлэгдсэн сүлжээний түншүүдийн багт байгаагүй сүлжээний түншүүдийг сүлжээнд нэмэх цорын ганц арга юм.

:::

Блокчэйн объект бүртгүүлэхийн тулд тухайн хэлний тусгай гарын авлагыг ашиглана уу:

|Хэл|Заавар|
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| CLI                   |Домэйнуудыг тохируулах, данс болон хөрөнгийг бүртгэхийн тулд [Iroha CLI](/mn/get-started/operate-iroha-via-cli.md) ашиглана уу.|
| Rust                  | [Rust сургалт](/mn/guide/tutorials/rust.md)-ыг ашиглаарай.|
| Kotlin/Жава           | [Kotlin/Жава хичээл](/mn/guide/tutorials/kotlin-java.md)-ыг ашиглана уу.|
| Python                | [Python сургалт](/mn/guide/tutorials/python.md)-ыг ашиглана уу.|
| JavaScript/TypeScript | [JavaScript/TypeScript хичээл](/mn/guide/tutorials/javascript.md)-ыг ашиглана уу. |

Ердийн домайн тохиргоог төлөвлөн хэрэглэж, дараа нь домайныг хэрэггүй болсны дараа бүртгэлээс устгана:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger domain unregister --id docs.universal
```

Бүртгүүлэх ба бүртгэлээс хасах дансууд:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  account unregister --id "$BOB"
```

Хөрөнгийн тодорхойлолтыг бүртгэх ба бүртгэлээс хасах:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger asset definition register \
  --id "$ASSET_DEF" \
  --name docs_token \
  --alias docs_token#docs.universal \
  --scale 0

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger asset definition unregister --id "$ASSET_DEF"
```

Бүртгүүлэх ба бүртгэлээс хасах NFTs. NFT бүртгэл нь агуулга JSON-аа стандарт оролтоос уншина:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger nft unregister --id 'badge$docs.universal'
```

Үүрэг бүртгэх болон бүртгэлийг цуцлах:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger role unregister --id operators
```

Триггерийг бүртгэх ба бүртгэлийг устгах. Триггерийг бүртгэхэд боловсруулсан IVM хоёртын код эсвэл дараалсан зааврын жагсаалт шаардлагатай. Энэ жишээ нь CLI-оор `Log` зааврыг бүтээж, үүнийг триггерийн бүртгэл рүү дамжуулна:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --emit-instructions \
  tx ping --log-level INFO --msg "hourly cleanup" |
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  trigger register --id hourly_cleanup \
  --instructions-stdin \
  --filter time \
  --time-start 5m \
  --time-period-ms 3600000

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  trigger unregister --id hourly_cleanup
```

Сүлжээний хамтрагчдыг бүртгэх болон бүртгэл устгах. Хэрэв танд аль хэдийн байхгүй бол BLS түлхүүрийг болон PoP-г `kagami`-той үүсгээрэй:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./peer-key
PEER_KEY=$(tr -d '\n' < ./peer-key/public.key)
PEER_POP=$(tr -d '\n' < ./peer-key/pop.hex)

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger peer unregister --key "$PEER_KEY"
```

## Шинээр үүсгэх/Шатаах {#mint-burn}

гаргах ба устгах нь тоон хөрөнгүүд болон давталтын тоо хязгаарлагдмал триггерүүдийг хэлж болно. Зарим хөрөнгийг дахин үйлдвэрлэх боломжгүй гэж тунхаглаж болно, үүний утга нь бүртгүүлсний дараа зөвхөн нэг удаа гаргаж болно гэсэн үг юм.

Хөрөнгийг тодорхой дансанд гаргадаг бөгөөд ихэвчлэн эхэнд хөрөнгийг бүртгүүлсэн дансанд гаргадаг. Хөрөнгийн хэмжээ эерэг утгатай тул та ямар нэг хөрөнгийн `$-1.0`-ыг огт авч чадахгүй эсвэл сөрөг хэмжээг устгаж, гарсан үр дүнг авах боломжгүй.

Блокчэйн хөрөнгийг гаргахын тулд хэлний тусгай зааврыг ашиглана уу:

- [CLI](/mn/get-started/operate-iroha-via-cli.md)
- [Rust](/mn/guide/tutorials/rust.md)
- [Kotlin/Java](/mn/guide/tutorials/kotlin-java.md)
- [Python](/mn/guide/tutorials/python.md)
- [JavaScript/TypeScript](/mn/guide/tutorials/javascript.md)

Энд хөрөнгийг устгах жишээнүүд байна:

- [CLI](/mn/get-started/operate-iroha-via-cli.md)
- [Rust](/mn/guide/tutorials/rust.md)

тооцооны хөрөнгийг нийтэлж устгах:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger asset mint \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 100

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger asset burn \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 10
```

сарнин болон идэвхжүүлэх давтамжуудыг устгах:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  trigger burn --id hourly_cleanup --repetitions 1
```

## Шилжүүлэх {#transfer}

Шилжүүлэг нь дансуудын хооронд эзэмшил эсвэл үнэ цэнийг шилжүүлдэг. Ерөнхий шилжүүлгийн төрөл нь домэйн, хөрөнгийн тодорхойлолт, тоон хөрөнгө, болон NFTs-ийг хамардаг. RWA тоо хэмжээний хөдөлгөөн нь [Бодит Дэлхийн Хөрөнгүүд](/mn/blockchain/rwas.md)-т тайлбарлагдсан тусгай `TransferRwa` болон `ForceTransferRwa` заавруудыг ашигладаг.

Үүнийг хийхийн тулд дансанд [ач холбогдлыг шилжүүлэх зөвшөөрөл](/mn/reference/permissions.md) эрхийг өгөх хэрэгтэй. Хөрөнгийг [CLI](/mn/get-started/operate-iroha-via-cli.md) эсвэл [Rust](/mn/guide/tutorials/rust.md)-той хэрхэн шилжүүлэх жишээг үзнэ үү.

Тоон хөрөнгийг шилжүүлэх:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

Домэйн, хөрөнгийн тодорхойлолт, болон NFT эзэмшлийг шилжүүлэх:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## Орон нутгийн эскроу ба хөрөнгийн түгжээнүүд {#native-escrow-and-asset-locks}

Төрөлхийн эскроу зааврууд тоон хөрөнгийг блокчейн номын протоколын харуулалтаар удирдах хэвээр түгждэг. Эдгээр нь зах зээлийн маягийн санхүүгийн гүйлгээний төлөвлөлт, ерөнхий хөрөнгийн түгжээг, болон нэрээ нууцлагч хамгаалалттай эскроу урсгалыг хэрэглэхэд ашиглагддаг.

Маркетплейсийн эскроу нь `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, ба `ResolveEscrowDispute`-ийг ашигладаг. Ерөнхий хөрөнгийн түгжээ нь `OpenAssetLock`, `DrawdownAssetLock`-ийг ашигладаг, `CancelAssetLock` ба `ExpireAssetLock`. Нэргүй даатгал нь зах зээлийн амьдралын мөчлөгийг `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, ба `ResolveAnonymousEscrowDispute`–тай тусган харуулдаг.

Эдгээр ISIs одоогоор нэгдүгээр зэрэгтэй байхгүй CLI бичигдсэн командуудыг ашиглана уу SDK барилгын ажилчид эсвэл дараалсан зааврын ачаа, харж байна [Уугуул хөрөнгийн эскроу](/mn/blockchain/escrow.md) амьдралын мөчлөгийн дэлгэрэнгүй мэдээлэл, зөвшөөрөл, асуулт, үйл явдлуудын хувьд Rust жишээнүүд.

## Атомик хувийн санхүүгийн гүйлгээний шийдвэрлэлт {#atomic-private-settlement}

Захиргаанд байдаг атом-приват-нотолгооны зааврын гэр бүл нь ил тод Native AMX-аас тусдаа. `ActivatePrivateSettlementPoolV1` нь нэг замын цар хүрээтэй нууц протоколын өгөгдлийн бүлгийг устгагдсан захиргааны төсөөллөөс ба ганц протокол-стандарт гарал үүсэлтэй криптографийн баталгаа утгаас тогтоодог. `FinalizeAtomicPrivateSettlementV1` нь нэг бүрэн хорооны баталгаажсан багцыг атомын хэмжээнд хэрэгжүүлдэг бол `AbortAtomicPrivateSettlementV1` нь зөвхөн ивээн тэтгэгчээс зөвшөөрөл авсан нийтийн терминал тэмдэглэлийг нийтэд зарладаг.

`RotatePrivateSettlementPoolPolicyV1` нь хувийн нууцын удирдлагад хязгаарлагдана. Энэ нь яг одоогийн удирдлагын криптографийн дижест утгыг шаарддаг, маршрутын, протоколын өгөгдлийн бүлэг, хөрөнгөтэй холбогдсон криптографийн үүрэг амлалтыг хадгалдаг, төлөвийн хил, дахин тоглуулах багцыг, болон эцэслэгдсэн протоколын үр дүнгийн бичлэгүүдийг хадгалдаг, нийгмийн засварыг нэгээр урагшлуулж, шинэ аудиторын түлхүүрийн үеийг ашигладаг. Эргэлт нь оролцсон өндрөөсөө идэвхжиж, нэг зам/сангийн протоколын үр дүнгийн бичлэгтэй тухайн өндрийг хуваалцах боломжгүй. Олон нийтэд үзүүлэх шинэчлэлийн удмын шугам нь эргэлт дахин эхлүүлэхээс өмнөх протоколын үр дүнгийн бүртгэлийг хүчин төгөлдөр, нарийн давтагдах боломжтой байлгадаг; урсгалд байгаа хуучин бодлогын багцууд хаалттайгаар амжилтгүй болдог. Операторууд хадгалагдсан капсулуудын хуучин шифрлэх түлхүүрүүдийг хадгалах эсвэл үүнийг устгахаас өмнө капсулыг дахин боохыг удирдан зохицуулах, турших ёстой.

Энэ зам анхдагчаар идэвхгүй бөгөөд үйлдвэрлэлийн хэрэглээнд бэлэн гэж баталгаажаагүй. Тохиргоо, эрх, аудит, сэргээх болон хувилбар гаргах шаардлагыг [Өгөгдлийн орон зай хоорондын атомик хувийн тооцоо нийлэлтийг ажиллуулах](/mn/get-started/atomic-private-settlement) хэсгээс үзнэ үү.

## Өгөх/Цуцлах {#grant-revoke}

Өглөг ба цуцлах заавруудыг [эрх болон үүрэг](permissions.md) дансанд ашиглана.

`Grant` нь хэрэглэгчид нэг зөвшөөрөл эсвэл зөвшөөрлийн багц ("жагсаалт") байнгын байдлаар олгоход ашиглагддаг. Олгогдсон жагсаалууд болон зөвшөөрлүүдийг зөвхөн `Revoke` заавраар устгаж болно. Иймд эдгээр зааврыг болгоомжтой ашиглах хэрэгтэй.

Дансанд үүрэг олгох ба цуцлах:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  account role revoke --id "$BOB" --role operators
```

Зөвшөөрлийн токен авах ба цуцлах. Зөвшөөрлийн командууд стандарт орноос зөвшөөрлийн объект уншдаг:

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  account permission revoke --id "$BOB"
```

Нэг үүрэгт эрх олгох ба цуцлах:

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

Эдгээр зааврууд объект [мета мэдээлэл](/mn/blockchain/metadata.md)-ийг шинэчилнэ. Мета өгөгдлийн бичлэгийг нэмэх эсвэл солихын тулд `SetKeyValue`-г ашиглаад, нэгийг устгахын тулд `RemoveKeyValue`-ийг ашиглана.

Метадата `set` командууд стандарт орохоос JSON утгыг уншина:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger domain meta remove --id docs.universal --key environment
```

Ижил загвар нь данс, хөрөнгийн тодорхойлолт, NFTs, RWAs, болон триггерүүдэд ашиглагдана:

```bash
printf '{"display_name":"Alice"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  account meta set --id "$ALICE" --key profile

printf '{"issuer":"docs"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger asset definition meta set --id "$ASSET_DEF" --key issuer

printf '{"color":"blue"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger nft meta set --id 'badge$docs.universal' --key traits

printf '{"owner":"ops"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  trigger meta set --id hourly_cleanup --key owner
```

## `SetParameter` {#setparameter}

`SetParameter` идэвхтэй өгөгдлийн загвар ба гүйцэтгэгчээр ил гаргасан сүлжээ даяар параметрүүдийг өөрчилдөг.

Стандарт оруулгаар нэг параметр JSON объект дамжуулан параметр тохируул:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

Энэ зааврыг [триггерүүд](./triggers.md)-ийг гүйцэтгэхэд ашигладаг.

CLI нь анхдагч `execute` шүүлтүүртэй бүртгэсэн өдөөгчид гараар `ExecuteTrigger` заавар илгээж, шаардлагатай бол JSON аргумент нэмэх бөгөөд өдөөгчийн гүйцэтгэлийн үйл явдлыг захиалан хүлээн авч болно:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  trigger execute docs_on_call --args-json '{"reason":"manual run"}'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events --timeout 30s trigger-execute
```

## Өөр зааварчилгаа {#other-instructions}

Iroha нь бас програм хангамжийн гүйцэтгэх орчин ба гүйцэтгэгчийн интеграцын доод түвшний заавруудыг ил болгодог:

- `Log`: гүйцэтгэх явцад бүртгэлийн тэмдэглэл үүсгээрэй
- `CustomInstruction`: гүйцэтгэгч тусгай JSON өгөгдлийг тээвэрлэх
- `Upgrade`: гүйцэтгэгчийн шинэчлэлтийг идэвхжүүлэх

Ping туслагчтай `Log` зааврыг илгээнэ үү:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  tx ping --log-level INFO --msg "hello from docs"
```

Сериаллагдсан `InstructionBox` хэлбэртэй захиалгат гүйцэтгэгчийн зааврыг илгээнэ үү. Дата хэсгийн бүтэц нь гүйцэтгэгчид онцгой тул нийцсэн SDK эсвэл гүйцэтгэгчийн хэрэгсэл ашиглан зааврыг үүсгээрэй:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  tx stdin
```

Компилидсэн IVM байт кодын файлаас гүйцэтгэгчийг шинэчлэх:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
