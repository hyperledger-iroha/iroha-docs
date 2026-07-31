---
translation_locale: am
translation_source: /reference/torii-endpoints.md
translation_source_hash: 6ee65d409642c79bea0f2c4ff0d8cd59b0ec0a29e115225045786d0816e8a6a7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Torii የመጨረሻ ነጥቦች {#torii-endpoints}

Torii ነው HTTP, SSE, እና WebSocket ለ Iroha 3. ለሁለቱም ያገለግላል
መቁጠሪያ-ተኮር APIs እና የኦፕሬተር መጨረሻ ነጥቦች.

የአሁኑ የፕሮቶኮል ደንቦች የሚከተሉት ናቸው:

- የካኖኒካል ባይንሪ ቅርጸት **Norito**
- ብዙ መጨረሻ ነጥቦች ደግሞ ድጋፍ JSON ሲላክ `Accept: application/json`
- መለኪያዎች በፕሮሜቴየስ ቅርጸት ተለይተዋል

ለቅጽ ዝርዝሮች ፣ ይዘት ድርድር ፣ አቀማመጥ ባንዲራዎች ፣ የሥርዓቶች ሃሽስ እና
Norito RPC መመሪያ, ተመልከት [Norito ማጣቀሻ](/am/reference/norito.md).

## የተለመዱ የመጨረሻ ነጥቦች {#common-endpoints}

| የመጨረሻ ነጥብ | ቅርጸት | ዓላማ |
| --- | --- | --- |
| `POST /transaction` | Norito | የተፈረመ ግብይት ያቅርቡ |
| `POST /query` | Norito | የተፈረመ ጥያቄ ያቅርቡ |
| `GET /events` | WebSocket | የዝግጅት ዥረቶችን ይመዝገቡ |
| `GET /block/stream` | WebSocket | የዥረት የተዋቀሩ ብሎኮች |
| `GET /peers` | JSON | በጋዜጣዎች የተገለጠ የባልደረባ ዝርዝር Torii |
| `GET /health` | JSON | ቀለል ያለ የአኗኗር መጨረሻ ነጥብ |
| `GET /api_version` | JSON | ነባሪ API ስሪት |
| `GET /status` | JSON | ለአስተናጋጆች የከፍተኛ ደረጃ ሁኔታ ማጠቃለያ |
| `GET /metrics` | ፕሮሜቲየስ | የፕሮሜቲየስ ማጭበርበሪያ መጨረሻ |
| `GET /schema` | JSON | በኖዱ የሚገለጸው የውሂብ ሞዴል መርሃግብር ቅጽበታዊ ገጽ እይታ |
| `GET /openapi` ወይም `GET /openapi.json` | JSON | OpenAPI ለነባሪው ሰነድ Torii HTTP መስመሮች |
| `GET /v1/parameters` | JSON | የአገናኝ መለኪያ ቅጽበታዊ ገጽ እይታ |
| `GET /v1/node/capabilities` | JSON | የአውታረ መረብ አቅም እና የመረጃ ሞዴል ሜታዳታ |
| `GET /v1/api/versions` | JSON | የተደገፈ Torii API ስሪቶች |
| `GET /v1/events/sse` | SSE | ለረጅም ጊዜ የቆዩ ደንበኞች የዝግጅት ዥረት |
| `GET /v1/time/now` | JSON | የአገናኝ ግድግዳ ሰዓት ቅጽበታዊ ገጽ እይታ |
| `GET /v1/time/status` | JSON | የጊዜ ማመሳሰል ሁኔታ |

`/openapi` ለሂደቱ ኖት ትክክለኛውን የመጨረሻ ነጥብ ዝርዝር ነው።
ወለል የግንባታ ባህሪያት እና ሩጫ ጊዜ ውቅር ላይ የተመሠረተ ነው, ስለዚህ የተፈጠረ
ደንበኞች የቀጥታ OpenAPI በእጅ የተቀረጸ የመንገድ ዝርዝር ላይ ሰነድ።
ይጠቀሙ [Torii API ኮንሶል](/am/reference/torii-api-console.md) ይህን በቀጥታ ለመጫን
ሰነድ፣ ሙከራ JSON መንገድ፣ ቅጂ curl ጥያቄዎችን, እና ከ ደንበኛ ኮድ ማመንጨት
የአሁኑ መርሃግብር።

## በሕይወት ለመኖር ሞክር Taira መንገዶች {#try-live-taira-routes}

የሕዝብ Taira የሙከራ አውታረመረብ ተመሳሳይ ነገር ያጋልጣል Torii JSON ይህ መተግበሪያ
ደንበኞቹ ለንባብ ብቻ የሚጠቀሙባቸው ናቸው. እነዚህ ትዕዛዞች ቁልፎች አያስፈልጋቸውም:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA_ROOT/openapi.json" \
  | jq -r '.paths | keys[]' \
  | grep '^/v1/' \
  | head -n 20

curl -fsS "$TAIRA_ROOT/v1/node/capabilities" \
  | jq '{abi_version, data_model_version, query: .query.aggregate.supported_resources}'
```

አሁን ባለው የዓለም ሁኔታ ላይ የሚገኘውን መረጃ ይሞክሩ:

```bash
curl -fsS "$TAIRA_ROOT/v1/domains?limit=5" \
  | jq -r '.items[].id'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=5" \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

የህዝብ የሙከራ አውታረመረብ መንገድ ከተመለሰ `502`, ጊዜ ውጭ, ወይም የተሞላ ሪፖርት
ረድፍ, አንድ መጨረሻ ነጥብ ተደራሽነት ጉዳይ እንደ ያዙ እና በኋላ ላይ እንደገና ይሞክሩ በፊት
የደንበኛ ኮድዎን ማረም.

## የጋራ ስምምነት እና የአሂድ ጊዜ መጨረሻ ነጥቦች {#consensus-and-runtime-endpoints}

| የመጨረሻ ነጥብ | ቅርጸት | ዓላማ |
| --- | --- | --- |
| `GET /v1/sumeragi/commit-certificates` | JSON | የቅርብ ጊዜ የተዋጣለት የምስክር ወረቀት ማጠቃለያዎች |
| `GET /v1/sumeragi/validator-sets` | JSON | የማረጋገጫ ስብስብ ታሪክ |
| `GET /v1/sumeragi/validator-sets/{height}` | JSON | በብሎክ ቁመት ላይ የተቀመጠ ማረጋገጫ |
| `GET /v1/sumeragi/status` | Norito ወይም JSON | ዝርዝር የስምምነት ሁኔታ ቅጽበታዊ ገጽ እይታ |
| `GET /v1/sumeragi/status/sse` | SSE | ቀጣይነት ያለው የጋራ ስምምነት ሁኔታ ፍሰት |
| `GET /v1/sumeragi/leader` | JSON | ወቅታዊ የአመራር መረጃ |
| `GET /v1/sumeragi/qc` | Norito ወይም JSON | የቅርብ ጊዜው የኳሮም የምስክር ወረቀት ማጠቃለያ |
| `GET /v1/sumeragi/checkpoints` | JSON | የስምምነት ፍተሻ ነጥብ ማጠቃለያ |
| `GET /v1/sumeragi/consensus-keys` | JSON | የጋራ ስምምነት ቁልፎች |
| `GET /v1/sumeragi/bls_keys` | JSON | ንቁ BLS የስምምነት ቁልፎች |
| `GET /v1/sumeragi/phases` | JSON | የቅርብ ጊዜውን በየደረጃው መዘግየት ናሙና |
| `GET /v1/sumeragi/rbc` | JSON | RBC የስብሰባ እና የውጤት መለኪያዎች |
| `GET /v1/sumeragi/rbc/sessions` | JSON | ንቁ RBC የስብሰባ ቅጽበታዊ ገጽ እይታ |
| `GET /v1/sumeragi/pacemaker` | JSON | የልብ ምት ማስቀመጫ ሁኔታ |
| `GET /v1/sumeragi/params` | JSON | የአሁኑ ሰንሰለት Sumeragi መለኪያዎች |
| `GET /v1/sumeragi/collectors` | JSON | የዴተሪሚኒስት አሰባሳቢ ዕቅድ ቅጽበታዊ ገጽ እይታ |
| `GET /v1/sumeragi/key-lifecycle` | JSON | የስምምነት ቁልፍ የሕይወት ዑደት ሁኔታ |
| `GET /v1/sumeragi/telemetry` | JSON | የስምምነት ቴሌሜትሪ ቅጽበታዊ ገጽ እይታ |
| `GET /v1/sumeragi/evidence` | JSON | የመረጃ መዝገቦች፣ በምርጫ መስመር የተጣራ |
| `GET /v1/sumeragi/evidence/count` | JSON | የምስክር ወረቀቶች ብዛት |
| `POST /v1/sumeragi/evidence/submit` | JSON | የስምምነት ማስረጃዎችን ማቅረብ |
| `GET /v1/sumeragi/commit_qc/{hash}` | Norito ወይም JSON | ቁርጠኝነት QC ለብሎክ ሃሽ መዝገብ |
| `GET /v1/runtime/abi/active` | JSON | ንቁ የስራ ሰዓት ABI መግለጫ |
| `GET /v1/runtime/abi/hash` | JSON | ንቁ የስራ ሰዓት ABI ሃሽ |
| `GET /v1/runtime/metrics` | JSON | የስራ ሰዓት መለኪያዎች ቅጽበታዊ ገጽ እይታ |
| `GET /v1/runtime/upgrades` | JSON | የስራ ሰዓት ማሻሻያ ዝርዝር |
| `POST /v1/runtime/upgrades/propose` | JSON | የስራ ሰዓት ማሻሻያ ያቅርቡ |
| `POST /v1/runtime/upgrades/activate/{id}` | JSON | የቀረበውን የስራ ሰዓት ማሻሻያ አክቲቭ ማድረግ |
| `POST /v1/runtime/upgrades/cancel/{id}` | JSON | የቀረበውን የስራ ሰዓት ማሻሻያ መሰረዝ |

## መተግበሪያ እና SORA የመንገድ ቤተሰቦች {#app-and-sora-route-families}

መቼ Torii መተግበሪያ-ተኮር ባህሪያት ስብስብ ጋር የተገነባ ነው, ይህ ተጨማሪ ያጋልጣል JSON
ለሰፋሪዎች ቤተሰቦች፣ SORA አገልግሎቶች, ድልድይ ፍሰቶች, ማስረጃዎች እና ማከማቻ.
ሁሉም ቤተሰቦች በሁሉም የኔትወርክ መገለጫዎች ላይ አልተፈቀዱም ።

| የመንገድ ቤተሰብ | ዓላማ |
| --- | --- |
| `/v1/accounts/*`, `/v1/domains/*`, `/v1/assets/*` | JSON ማንበብ፣ መጠይቅ ረዳቶች፣ የማስገባት ረዳቶች እና የፖርፎሊዮ ወይም ባለቤት እይታዎች |
| `/v1/nfts/*`, `/v1/rwas/*`, `/v1/confidential/*` | NFT, በእውነተኛ ዓለም ውስጥ ያሉ ንብረቶች እና ምስጢራዊ የንብረት እይታዎች |
| `/v1/aliases/*`, `/v1/assets/aliases/*`, `/v1/sns/*`, `/v1/identifiers/*` | ስም፣ ቅጽል ስያሜ እና መታወቂያ ጥራት |
| `/v1/explorer/*` | በአሰሳ ላይ የተመሠረተ መለያ, ንብረት, ብሎክ, ግብይት, መመሪያ, ሜትሪክ እና ዥረት እይታዎች |
| `/v1/transactions/*`, `/v1/pipeline/*`, `/v1/iso20022/*` | የግብይት ታሪክ፣ የቧንቧ መስመር መልሶ ማግኛ ወይም ሁኔታ ISO 20022 ረዳቶች |
| `/v1/contracts/*` | የውል ኮድ, ማሰማራት, ጥቅል, ጥሪ, እይታ, ክስተት, እንቅስቃሴ, rollup, እና ሁኔታ መስመሮች |
| `/v1/multisig/*`, `/v1/controls/*` | ባለብዙ ስምምነቶች ፕሮፖዛሎች፣ ማጽደቅ እና የዝውውር ቁጥጥር ረዳቶች |
| `/v1/bridge/*`, `/v1/ledger/*`, `/v1/proofs/*` | የመጨረሻነት፣ የአቋም ማስረጃ፣ የማገጃ ማስረጃ፣ ማስረጃ ማቆየት እና ማስረጃ መጠይቅ መንገዶች |
| `/v1/da/*` | የመረጃ ተደራሽነት አጠቃቀም፣ ማሳያዎች፣ የማረጋገጫ ፖሊሲዎች፣ ግዴታዎች እና የፒን ዓላማዎች |
| `/v1/zk/*` | ZK ሥሮች፣ ማስረጃ ማረጋገጫ፣ IVM ማረጋገጫ፣ የድምፅ አሰጣጥ፣ የማረጋገጫ ቁልፎች፣ የምስክር ወረቀቶች እና አባሪ ሰነዶች |
| `/v1/gov/*`, `/v1/ministry/*` | የአስተዳደር ፕሮፖዛሎች፣ የምርጫ ወረቀቶች፣ የምክር ቤት ሁኔታ፣ የተጠበቁ የስም ቦታዎች፣ አጀንዳ ፕሮፖዛል፣ ህግ አውጥቶ ማጠናቀቅ |
| `/v1/nexus/*`, `/v1/sccp/*` | Nexus የመንገድ ፣ የመረጃ ቦታ እና የመስቀለኛ ሰንሰለት መከላከያ ረዳቶች |
| `/v1/musubi/*` | Musubi የፓኬጅ መዝገብ አንባቢዎች እና መመሪያ ሰሪዎች |
| `/v1/subscriptions/*` | የደንበኝነት ምዝገባ ዕቅዶች ፣ የደንበኛው የሕይወት ዑደት ፣ አጠቃቀም እና ክፍያ ረዳቶች |
| `/v1/sorafs/*`, `/sorafs/*`, `/.well-known/sorafs/*` | SoraFS የአቅራቢው ግኝት፣ የኃይል አቅም ማረጋገጫ፣ የማስቀመጥ፣ የማከማቻ እና የህዝብ ይዘት አገልግሎት መስጠት |
| `/v1/soracloud/*`, `/v1/soradns/*`, `/soradns/*`, `/api/*` | SoraCloud የአገልግሎት ሕይወት ዑደት፣ የግል የሂሳብ/ሞዴል ፍሰቶች፣ የህዝብ ግኝት እና የተስተናገደ የመተግበሪያ አቅጣጫ |
| `/v1/connect/*`, `/v1/vpn/*` | Iroha የግንኙነት ክፍለ ጊዜዎች, WebSocket መጓጓዣ፣ VPN ስብሰባዎች፣ መገለጫዎች እና ደረሰኞች |
| `/v1/app-api/*`, `/v1/api/*`, `/v1/content/*` | መተግበሪያ API ማያዣዎች እና ጥቅል/CID- የተደገፈ ይዘት ማስተላለፍ |
| `/v1/operator/*`, `/v1/mcp` | የኦፕሬተር ማረጋገጫ እና ተወላጅ MCP JSON-RPC ድልድይ |
| `/v1/offline/*`, `/v1/repo/*`, `/v1/space-directory/*`, `/v1/ram-lfe/*` | የመስመር ላይ ዝግጁነት፣ የመረጃ ቋት ስምምነቶች፣ የውሂብ ጎታ ማኒፌስታዎች፣ እና [RAM-LFE ረዳቶች](/am/blockchain/ram-lfe.md#torii-routes) |
| `/v1/kaigi/*`, `/v1/webhooks/*`, `/v1/notify/*`, `/v1/telemetry/*` | ትብብር, የድር አገናኝ, የግፋ ማሳወቂያ እና የቀጥታ ቴሌሜትሪ ውህደቶች |

## ISO 20022 ድልድይ {#iso-20022-bridge}

Torii የሚገልጸው ISO 20022 ድልድይ በታች `/v1/iso20022/*` አፕሊኬሽኑ ሲታይ
API ድልድዩ ሆን ተብሎ ተዘግቷል:
አጠቃላይ አላማ የሌለው ISO 20022 የማጣሪያ መግቢያ, ነገር ግን ለ የሚደገፍ ንዑስ ስብስብ
የተመረጡ የክፍያ መልዕክቶችን ወደ ተፈርሟቸው መለወጥ Iroha ማስተላለፍ እና መከታተል
የመጽሐፉ ሁኔታ።

### Torii ISO 20022 የመጨረሻ ነጥቦች {#torii-iso-20022-endpoints}

| ዘዴ እና መጨረሻ ነጥብ | ዓላማ |
| --- | --- |
| `POST /v1/iso20022/pacs008` | አንድ ማቅረብ FI-ወደ-FI የደንበኛ የብድር ማስተላለፍ እና ማመሳሰል መገንባት Iroha የንብረት ማስተላለፍ |
| `POST /v1/iso20022/pacs009` | አንድ ማቅረብ FI-ወደ-FI ለ ጥቅም ላይ የዋለው የብድር ማስተላለፍ PvP ወይም ከዋጋ ምንዛሬዎች ጋር የተያያዙ የገንዘብ ድጋፍ |
| `POST /v1/iso20022/pacs002` | የክፍያ ሁኔታ ሪፖርት ማቅረብ |
| `POST /v1/iso20022/pacs004` | የክፍያ መልዕክት ማቅረብ |
| `POST /v1/iso20022/camt056` | የክፍያ መሰረዝ ጥያቄ ማቅረብ |
| `POST /v1/iso20022/sese023` | የዋጋ ንብረቶችን የማስተካከል መመሪያ ማቅረብ |
| `POST /v1/iso20022/sese024` | የዋጋ ምንዛሬዎች የማስተካከያ ሁኔታ መልዕክት ያቅርቡ |
| `POST /v1/iso20022/sese025` | የዋጋ ንብረቶችን የማስተካከል ማረጋገጫ ማስገባት |
| `POST /v1/iso20022/colr012` | የዋስትና ምትክ መልዕክት ያቅርቡ |
| `GET /v1/iso20022/messages/{msg_id}` | አንድ መልዕክት ለማግኘት የካኖኒክ ድልድይ መዝገብን አንብብ |
| `GET /v1/iso20022/audit/messages` | የተስተካከለ መልዕክት ኦዲት ማኒፌስት ያንብቡ |
| `GET /v1/iso20022/messages/{msg_id}/pacs002` | የአሁኑን የክፍያ ሁኔታ እንደ `pacs.002` XML |
| `GET /v1/iso20022/messages/{msg_id}/pacs004` | የአሁኑን የክፍያ መልዕክት እንደ `pacs.004` XML |
| `GET /v1/iso20022/messages/{msg_id}/camt029` | የአሁኑን የመሰረዝ ውሳኔ እንደ `camt.029` XML |
| `GET /v1/iso20022/messages/{msg_id}/sese024` | የአሁኑን የፍርድ ሂሳብ ሁኔታ እንደ `sese.024` XML |
| `GET /v1/iso20022/messages/{msg_id}/sese025` | የአሁኑን የፍጆታ ማረጋገጫ እንደ `sese.025` XML |

`pacs.008` ማቅረቢያዎች መልዕክቱን ማቅረብ አለባቸው ID, በይነ ባንክ ሂሳብ
መጠን፣ ምንዛሬ፣ የፍርድ ቀን፣ ዕዳ እና አበዳሪ IBANs, እና ባለዕዳ
አበዳሪ BICs. የማጣቀሻ መረጃ ሲዋቀር ድልድዩ
BIC, IBAN, እና ISO 4217 ከተፈጠረው ግብይት በፊት የዋጋ መስቀል
ወደ ቧንቧው ይገባል።

`pacs.009` ማቅረቢያዎች የንግድ መልዕክቱን ማቅረብ አለባቸው ID, መልዕክት ትርጉም
ID, የመፍጠር ጊዜ፣ ከባንኮች መካከል የሚፈፀመው የፍርድ ክፍያ መጠን፣ ምንዛሬ፣ የፍርድ ቀን፣
የማስተማር እና የተማረ ሰራተኛ BICs, እንዲሁም ባለዕዳ እና አበዳሪ IBANs. የ
መልዕክት ያካትታል `Purp`, ድልድዩ በአሁኑ ወቅት ለዋጋ ንብረቶች የሚውል የገንዘብ ድጋፍ ይቀበላል
ብቻ: `Purp=SECU`.

የ `pacs.008` እና `pacs.009` የመላኪያ መጨረሻ ነጥቦች ተቀባይነት አላቸው XML ISO ፖስታዎች ወይም
በድልድይ ሙከራዎች ውስጥ ጥቅም ላይ የዋለው ጠፍጣፋ መስክ ቅርጸት። `SplmtryData` መስኮች
ዒላማውን ማሰር ይችላሉ Iroha መለያ፣ ምንጭ እና ግብ ሂሳብ IDs ወይም አድራሻዎች፣
እና የአክሲዮን ትርጉም ID. መልሱ `202 Accepted` ጋር `message_id`,
`transaction_hash`, `status`, `pacs002_code`, እና የተቋረጡ
መቁጠሪያ/ሂሳብ/አክሲዮን አውድ።

### ተጨማሪ የፓርሰር እና የካርታ ድጋፍ {#additional-parser-and-mapping-support}

የ IVM ISO ረዳት ደግሞ የሚከተለውን መልእክት ያረጋግጣል እና ይጨምራል
የኮንቨሎፕ ማረጋገጫ ፣ የመኖሪያ ቦታ ካርታ አሰጣጥ ወይም ወደ ታች የሚወስዱ ቤተሰቦች
ማስታረቅ: እነሱ ራሳቸውን ችለው የላቸውም Torii መንገዶች.

| የመልዕክት ቤተሰብ | የአሁኑ ድጋፍ |
| --- | --- |
| `head.001` | ለንግድ ማመልከቻ ራስጌ ማረጋገጫ ISO ፖስታዎች፣ `BizMsgIdr`, `MsgDefIdr`, የመፍጠር ጊዜ እና አማራጭ ላኪ/አቀባዩ BIC መስኮች |
| `pacs.007`, `pacs.028`, `pacs.029` | የክፍያ መልሶ ማቋረጥ፣ የጥናት ሁኔታ ጥያቄ እና የምርመራ መፍትሔ/ጥናት ሁኔታ ትንታኔ |
| `pain.001`, `pain.002` | የደንበኛው የክፍያ ጅምር እና የክፍያው ሁኔታ ሪፖርት ማረጋገጫ |
| `camt.052`, `camt.053`, `camt.054` | የሂሳብ ሪፖርት፣ መግለጫ እና የማሳወቂያ ማረጋገጫ |

## Kaigi ስብሰባዎች {#kaigi-sessions}

Kaigi የሚከፈልባቸው፣ በእውነተኛ ሰዓት የድምጽ/ቪዲዮ ክፍሎች ያቀርባል SORA Nexus. ሲጠቀሙበት
አንድ ትግበራ በሊጅር የተደገፈ ክፍለ ጊዜ መፍጠር ፣ የዝርዝሩ ለውጦች ፣ ሪሌ ያስፈልገዋል
በመረጃ መለያዎች፣ በማስመሰል የተደገፈ የምልክት አሰጣጥ እና የመጠቀም መለኪያ
ከስቴቱ ውጪ የስብሰባ ስብሰባዎች።

የመጽሐፉ አጠቃላይ የህይወት ዑደት የሚከተለው ነው

- `CreateKaigi`: በአንድ ጎራ ስር ጥሪ መፍጠር እና ፖሊሲውን ማከማቸት፣
  የጊዜ ሰሌዳ፣ ሜታዳታ እና አማራጭ ተለጣፊ መግለጫ።
- `JoinKaigi` እና `LeaveKaigi`: የስልክ ዝርዝሩን ያዘምኑ።
  ተሳታፊዎች ተሳትፎዎችን፣ አሻራዎችን እና የዘርፉ ማስረጃዎችን ይጠቀማሉ
  የድርጅቱ ተሳታፊዎች መለያ IDs በቀጥታ።
- `RecordKaigiUsage`: የሚለካውን ጊዜ እና የጋዝ አጠቃላይ እሴት ይጨምሩ.
- `EndKaigi`: ስብሰባውን አቁም እና የመጨረሻውን የጊዜ ማህተም ይመዝገቡ።

Torii የሬሌ ቴሌሜትሪ `/v1/kaigi/relays`,
`/v1/kaigi/relays/{relay_id}`, `/v1/kaigi/relays/health`, እና
`/v1/kaigi/relays/events` መተግበሪያው API እና የቴሌሜትሪ ባህሪዎች ተችለዋል.
የስብሰባው ሁኔታ በ Kaigi የመሳሰሉ የጎራ ክስተቶች
`KaigiRosterSummary`, `KaigiRelayManifestUpdated`,
`KaigiRelayHealthUpdated`, እና `KaigiUsageSummary`.

### CLI የጭስ ሙከራ {#cli-smoke-test}

ከ `iroha kaigi` CLI አንድ Torii የመጨረሻ ነጥብ
ተቀባይነት አለው Kaigi ከግንኙነት በፊት ግብይቶች UI. ፈጣን ማስጀመሪያ ትዕዛዝ
በሥራ ላይ ላሉት ሰዎች ጊዜያዊ ክፍል ይፈጥራል Torii የመጨረሻ ነጥብ እና ማጠቃለያ ያትማል
የስልክ መታወቂያ ጋር, ትእዛዝ መቀላቀል, እና SoraNet የሽቦ ፍንጭ:

```bash
iroha kaigi quickstart --auto-join-host --summary-out kaigi-summary.json
```

ለስክሪፕት ፍሰቶች የክፍሉን የሕይወት ዑደት በግልጽ ያስተዳድሩ

```bash
iroha kaigi create \
  --domain streaming \
  --call-name daily \
  --host <i105-account-id> \
  --privacy-mode transparent \
  --room-policy authenticated

iroha kaigi join --domain streaming --call-name daily --participant <i105-account-id>
iroha kaigi leave --domain streaming --call-name daily --participant <i105-account-id>

iroha kaigi record-usage \
  --domain streaming \
  --call-name daily \
  --duration-ms 120000 \
  --billed-gas 1500

iroha kaigi end --domain streaming --call-name daily
```

አጠቃቀም `--room-policy public` ሪሌዎች ያለ ተመልካች ሊያጋልጡ የሚችሉ ክፍሎች
ትኬቶች ወይም `--room-policy authenticated` መቼ መውጫዎች ተመልካች ያስፈልጋቸዋል
ማረጋገጫ `--privacy-mode zk-roster-v1` አውታረ መረቡ
የ Kaigi ዝርዝር እና አጠቃቀምን የሚያረጋግጡ ቁልፎች የተቀናጁ; አለበለዚያ መቀላቀል, ቅጠሎች,
እና የግል አጠቃቀም መዝገቦች በ Deterministic ማረጋገጫ ወቅት ይወድቃሉ.

### ሙከራ JavaScript ማሳያ {#testing-with-the-javascript-demo}

ይጠቀሙ
[soramitsu/iroha-demo-javascript](https://github.com/soramitsu/iroha-demo-javascript)
የ ዴስክቶፕ ማሳያ ለ መጨረሻ-ወደ-መጨረሻ ቦርሳ ፈተና.
በቀጥታ ወደ Torii በአካባቢው በኩል `@iroha/iroha-js`
አስገዳጅ እና ያካትታል `/kaigi` የአሳሽ ተወላጅ አንድ-ወደ-አንድ ሚዲያ መንገድ.

ማሳያውን ይጠቀሙ
[`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js)
ከ Iroha የመረጃ ምንጭ ማከማቻ SDK በኩል
`file:../iroha/javascript/iroha_js`, ስለዚህ ሁለቱንም ቼኮች በዚህ ወንድም ውስጥ ጠብቁ
አቀማመጥ:

```bash
mkdir iroha-wallet-workspace
cd iroha-wallet-workspace
git clone https://github.com/hyperledger-iroha/iroha.git
git clone https://github.com/soramitsu/iroha-demo-javascript.git

cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist

cd ../../../iroha-demo-javascript
npm install
npm run dev
```

አጠቃቀም Node.js 20 ወይም ከዚያ በላይ እና Rust መሣሪያ ሰንሰለት ስለዚህ ተወላጅ `iroha_js_host`
ሞጁል መገንባት ይችላሉ. SDK በወንድማማች Iroha ከተቀየረ በኋላ ካሳ
ምንጩ፤ ንጹሕ የፓኬጅ አቀማመጥ የካርጎ የሥራ ቦታን አይይዝም።
የሚያስፈልገው `npm run build:native`.

ለቁጥጥር ሙከራ, አንድ ላይ ማሳያ አቅጣጫ Kaigi- አቅም ያለው Torii የመጨረሻ ነጥብ:

1. አንድ ይጀምሩ Iroha ጋር አገናኝ SORA/Kaigi የመተግበሪያ አቀማመጥ APIs የተፈቀደ ወይም መጠቀም
   የሕዝብ መጨረሻ ነጥብ Kaigi የሚያስፈልጋችሁን ወለሎች።
2. በመጠቀም መሰረታዊውን ተደራሽነት ይፈትሹ `/health`, ከዚያም የቀጥታ መንገድን ገጽ ይፈትሹ
   ጋር `/openapi` ወይም `/openapi.json`. አንዳንድ ልውውጦች ደግሞ ያጋልጣሉ
   `/v1/health`, ግን `/health` ተንቀሳቃሽ የህይወት ፍተሻ ነው።
3. ለ TAIRA, በቀጥታ ስብሰባ ከመሞከርዎ በፊት የሬል ቴሌሜትሪ መንገዶችን ያረጋግጡ

   ```bash
   TAIRA=https://taira.sora.org
   curl -fsS "$TAIRA/health"
   curl -fsS "$TAIRA/v1/kaigi/relays"
   curl -fsS "$TAIRA/v1/kaigi/relays/health"
   ```

   እነዚህ ቼኮች እንደሚያሳዩት Torii እና Kaigi ተለጣፊ ቴሌሜትሪ ሊደረስባቸው ይችላል.
   ስብሰባ አይፈጥሩ፤ `CreateKaigi` እና `JoinKaigi` አሁንም የገንዘብ ድጋፍ ያስፈልጋል
   የኪስ ቦርሳዎች እና የተፈረሙ ግብይቶች።
4. ማሳያውን ይክፈቱ, ሂድ **ቅንብሮች**, ያዘጋጁ Torii URL, እና መተግበሪያውን መጫን ይፍቀዱ
   ሰንሰለት ID እና አውታረ መረብ ቅድመ ማስረጃ ከ መጨረሻው ነጥብ.
5. ማሳያ ውስጥ ሁለት አካባቢያዊ ቦርሳዎች መፍጠር ወይም መልሶ ማግኘት. የተለየ መተግበሪያ መስኮቶች ይጠቀሙ,
   መገለጫዎች ወይም ማሽኖች ስለዚህ አስተናጋጁ እና እንግዳው የተለየ የኪስ ቦርሳ ሁኔታ አላቸው.

ለመፈተሽ Kaigi UI:

1. በአስተናጋጅ መስኮት ውስጥ ክፍት **Kaigi**, ይምረጡ **ስብሰባውን ጀምር**, አንድ ርዕስ ያዘጋጁ፣
   እና ይምረጡ **የግል ግብዣ** ወይም **ግልፅ ግብዣ**.
2. ይምረጡ **ካሜራ እና ማይክሮፎን ያበራሉ** ስለዚህ WebRTC የአካባቢው ሚዲያዎች አሉት።
3. ይምረጡ **የስብሰባ አገናኝ ይፍጠሩ**. የቀጥታ ቦርሳ ያቀርባል `CreateKaigi`; የ
   መተግበሪያው ከዚያም አንድ ያሳያል `iroha://kaigi/join?call=...&secret=...` ግብዣ እና ሀ
   `#/kaigi?...` የመመለሻ መንገድ።
4. የእንግዳ ተቀባይ መስኮቱን ክፍት አድርግ፤ ግብዣውን ከጎብኚው ጋር አጋራ።
5. በእንግዳ መስኮት ውስጥ, ግብዣውን ይክፈቱ ወይም ያስገቡ **ስብሰባ ላይ ይሳተፉ**, ዞር
   በአካባቢያዊ ሚዲያዎች ላይ, እና ይምረጡ **ስብሰባ ላይ ይሳተፉ**. የቀጥታ ቦርሳ
   የተመሰጠረ አስተናጋጅ አቅርቦት Torii እና ያቀርባል `JoinKaigi` የተደበቀ
   መልሱ ሜታዳታ።
6. አስተናጋጁ የመጀመሪያውን መልስ በራስ-ሰር በማስተላለፍ ወይም በምርመራ ማመልከት አለበት Kaigi
   ሁለቱም መስኮቶች የተገናኙ ሚዲያዎችን ማሳየት አለባቸው
   የግንኙነት ዝርዝሮች።
7. ክፍለ ጊዜውን ከአስተናጋጁ ያጠናቅቁ ወይም CLI `iroha kaigi end` ትዕዛዝ
   ተመሳሳይ ጥሪ ID.

የግል Kaigi የተጠበቁ ፍላጎቶች XOR የግል የመግቢያ ነጥብ ክፍያ ለመክፈል።
የማሳያ ሪፖርቶች የግል Kaigi የተጠበቁ ፍላጎቶች XOR, በመተግበሪያው ውስጥ ያለውን
በራስ-መከላከያ ማስጠንቀቂያ እና እንደገና ይሞክሩ የፍጠር ወይም መቀላቀል እርምጃ.
የግል የገንዘብ ድጋፍ, ወይም የቀጥታ ምልክት አይገኝም ነው, ማሳያ ወደ
ግልፅ/የእጅ ፍሰት **የላቀ የምልክት አሰጣጥ**, ኮፒ
ጥሬ አቅርቦት ወይም መልስ ጥቅል, እና ወደ ሌላ መስኮት ውስጥ አጣብቁ.

በዴሞ ሬፖ ውስጥ ለተፈቀደ ቁጥጥር የሚከተሉትን ይሂዱ:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
npm run verify
```

ትኩስ Vitest ስብስቦች ሽፋን Kaigi የስብሰባ አገናኝ መፍጠር፣ የታመቀ ግብዣ
መጫን፣ የግል መፍጠር/ማቀላቀል/መጨረሻ ድልድይ ጥሪዎች፣ ራስን የመከላከል ማሳሰቢያዎች፣ ማኑዋል
የሕዝብ አስተያየት ሰጪዎች UI የጭስ ሙከራ `/kaigi` መንገድ
በዴስክቶፕ እና በተንቀሳቃሽ ስልክ መጠን ያላቸው የመታያ ገጾች ላይ.
የአሳሽ ካሜራ/ማይክሮፎን ፍቃዶች ስለሚኖሩ በእጅ ሁለት መስኮት ሙከራ ያስፈልጋል
እና የእኩዮች ሚዲያ ዥረቶች ለአካባቢው የተወሰኑ ናቸው።

ለናሙና ውህደት ኮድ ተመልከት
[የተካተቱ Kaigi በ JavaScript መተግበሪያ](/am/guide/tutorials/kaigi.md).

## ሁኔታ እና መለኪያዎች {#status-and-metrics}

የደረጃ እና መለኪያዎች መጨረሻ ነጥቦች ወደ ዳሽቦርዶች ውስጥ የሚገቡት የመጀመሪያ ነገሮች ናቸው:

- `/status` የከፍተኛ ደረጃ እኩዮች ፣ ብሎኮች ፣ ረድፍ እና ስምምነት መስኮችን ያሳያል
- `/metrics` የፕሮሜቲየስ ቆጣሪዎችን፣ መለኪያዎችን እና ሂስቶግራሞችን ያሳያል

ላይ Nexus-የተፈቀዱ አገናኞች፣ የአቋም ውፅዓት እንዲሁ የመንገድ እና የውሂብ-ቦታ-ማወቅን ያካትታል
ክፍሎች. `nexus.enabled = false`, እነዚህ ክፍሎች ተጥለዋል።

## JSON በ. Norito {#json-vs-norito}

በርካታ የኦፕሬተር መጨረሻ ነጥቦች ይመለሳሉ Norito ነባሪ በሆነ መንገድ።
JSON, ይላኩ:

```http
Accept: application/json
```

ይህ በተለይ ለ:

- `/v1/sumeragi/status`
- `/v1/sumeragi/qc`
- `/v1/sumeragi/commit_qc/{hash}`

አንድ መጨረሻ ነጥብ ተቀባይነት ሲሰጥ ወይም ሲመለስ Norito በቀጥታ መጠቀም
`application/x-norito` እንደ ይዘት አይነት ወይም ተመራጭ `Accept` እሴት ይመልከቱ
[Norito](/am/reference/norito.md#torii-and-norito-rpc) የትራንስፖርት ዝርዝሮች።

## የቴሌሜትሪ መገለጫዎች {#telemetry-profiles}

የመጨረሻ ነጥብ ተደራሽነት በቴሌሜትሪ ቅንብሮች ላይ የተመሠረተ ነው.
አምስት የመገለጫ ደረጃዎች

| መገለጫ | `/status` | `/metrics` | የገንቢዎች መንገዶች |
| --- | --- | --- | --- |
| `disabled` | አይደለም | አይደለም | አይደለም |
| `operator` | አዎ | አይደለም | አይደለም |
| `extended` | አዎ | አዎ | አይደለም |
| `developer` | አዎ | አይደለም | አዎ |
| `full` | አዎ | አዎ | አዎ |

## CLI አቋራጮች {#cli-shortcuts}

የ `iroha` CLI ከእነዚህ የመጨረሻ ነጥቦች ውስጥ ብዙዎቹን አስቀድሞ ያጠቃልላል:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml ops sumeragi params
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

## የላይኛው መስመር ማጣቀሻዎች {#upstream-references}

- [README API እና የታየበት አጠቃላይ እይታ](https://github.com/hyperledger-iroha/iroha/blob/main/README.md)
- [ISO 20022 ድልድይ አተገባበር](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_torii/src/iso20022_bridge.rs)
- [አፈፃፀም እና መለኪያዎች](/am/guide/advanced/metrics.md)
