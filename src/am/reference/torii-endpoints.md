---
translation_locale: am
translation_source: /reference/torii-endpoints.md
translation_source_hash: 995701cfca9594b88a0da73a5b582c75c5962449a9ccf150e65738d3656d4f02
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Torii መጨረሻ ነጥቦች {#torii-endpoints}

Torii ለ HTTP ፣ SSE እና WebSocket የጌትዌይ ነው ። ለ Iroha 3 ያገለግላል በሊጅ-ተኮር APIs እና በኦፕሬተር የመጨረሻ ነጥቦች ላይ።

አሁን ያሉት የፕሮቶኮል ደንቦች የሚከተሉት ናቸው:

- የሁለትዮሽ ቅርጸት Norito ነው
- ብዙ መጨረሻ ነጥቦችም ድጋፍ ያደርጋሉ JSON ሲላክ `Accept: application/json`
- መለኪያዎች በፕሮሜቲየስ ቅርጸት የተገለጹ ናቸው

ለቅርጸት ዝርዝሮች ፣ የይዘት ድርድር ፣ አቀማመጥ ባንዲራዎች ፣ የስኪማ ሃሽስ ፣ እና Norito RPC መመሪያ ፣ የ [Norito ማጣቀሻን ይመልከቱ ](/am/reference/norito.md).

## የጋራ መደምደሚያዎች {#common-endpoints}

|የመጨረሻ ነጥብ |ቅርጸት |ዓላማ|
| ------------------------------------- | -------------- | ---------------------------------------------------------------- |
|`POST /v1/pipeline/transactions` |Norito |የተፈረመ ግብይት ያቅርቡ |
|`POST /v1/query` |Norito |የተፈረመ ጥያቄ ያቅርቡ |
|`GET /v1/events/ws` |WebSocket |የዝግጅት ዥረቶችን ይመዝገቡ|
|`GET /v1/events/sse` |SSE |ከ SSE በላይ ለሆኑ ክስተቶች ዥረቶች ይመዝገቡ|
|`GET /v1/blocks/stream` |WebSocket |የተሰማሩ ብሎኮችን |
|`GET /v1/peers` |JSON |በ Torii የተጋለጡ የአቻዎች ዝርዝር |
|`GET /livez` |ጽሑፍ |የፕሮሰስ-ብቻ ሕይወት; ይህ ፕሮቶኮል ዝግጁነት አያመለክትም |
|`GET /readyz` |JSON |ከመስመር ውጭ የሚደረጉ የግዴታ የገንዘብ ቼኮችን ጨምሮ የተሟላ የአገናኝ ዝግጁነት |
|`GET /health` |JSON |ተመሳሳይ ከመስመር ውጭ የገንዘብ ተለዋዋጭ ጋር ዝግጁነት ምርመራ |
|`GET /v1/api/version` |ጽሑፍ |የአሁኑ የብሎክ ራስጌ ስሪት |
|`GET /status` |Norito ወይም JSON |የከፍተኛ ደረጃ የምርመራ ሁኔታ; በግልጽ መጠየቅ JSON|
|`GET /metrics` |ፕሮሜቲየስ |የፕሮሜቲየስ ማጭበርበሪያ መጨረሻ ነጥብ |
|`GET /v1/schema` |JSON |የሂሳብ ሞዴል መርሃግብር ቅጽበታዊ ገጽ እይታ በኖዱ ሲገለግል |
|`GET /openapi` ወይም `GET /openapi.json` |JSON |የ OpenAPI ሰነድ ለሥራ ላይ የሚውሉ Torii HTTP መንገዶች |
|`GET /v1/parameters` |JSON |የአገናኝ መለኪያ ቅጽበታዊ ገጽ እይታ |
|`GET /v1/node/capabilities` |JSON |የአውታረ መረብ አቅም እና የውሂብ ሞዴል ሜታዳታ |
|`GET /v1/time/now` |JSON |የአገናኝ የግድግዳ ሰዓት ቅጽበታዊ ገጽ እይታ|
|`GET /v1/time/status` |JSON |የጊዜ ማመሳሰል ሁኔታ |

ለ SSE ጥያቄ የአገር ውስጥ ዥረት እና የተጻፈ የወደፊት መልሶ ማቋረጥ ማስታወቂያ ያቅርቡ:

```http
Accept: text/event-stream, application/json
```

Torii በመጀመሪያ በጠየቀው ንብርብሮች ላይ የ JSON ወይም Norito ውክልናን ይደራደራል ፣ ከዚያ የተፈጥሮውን `text/event-stream` ምላሽ ያረጋግጣል ። ስለሆነም መላክ ብቻ `text/event-stream` ከ `406` ጋር ውድቅ ነው ፤ የ [ ዥረት ክስተቶች የምግብ አዘገጃጀት መመሪያ ](/am/cookbook/stream-events.md) ሙሉውን ራስጌ ይጠቀማል።

`/openapi` በፕሮግራሙ ውስጥ ለተገለጹት መስመሮች የመጀመሪያው የተፈጠረው ውል ነው ፣ የአሁኑ ሰነድ የተሟላ የኦፕሬቲንግ ሳንድ ዝርዝር አይደለም። `/livez` እና `/readyz`, እና የእሱ `/health` መግለጫ ዝግጁነት አስተዳዳሪ መዘግየት ይችላሉ. የቀጥታ ሰነድ ከ መንገድ ደንበኞች ማመንጨት, ነገር ግን በቀጥታ በሂደት ላይ ካለው አገናኝ እና በተጣበቁ አስተናጋጆች ላይ የኑሮ ሁኔታን እና ዝግጁነትን ያረጋግጡ። ትክክለኛው ወለል አሁንም በግንባታ ባህሪዎች እና በመሮጫ ጊዜ ውቅር ላይ የተመሠረተ ነው። [Torii API ኮንሶል](/am/reference/torii-api-console.md) ያንን የቀጥታ ሰነድ ለመጫን, ሙከራ JSON መስመሮች፣ ቅጂ curl ጥያቄዎችን ያቀርባል፣ እና ከወቅቱ መርሃግብር የደንበኛ ኮድ ይፈጥራል።

## የቀጥታ Taira መስመሮችን ይሞክሩ {#try-live-taira-routes}

የህዝብ Taira የሙከራ አውታረመረብ የመተግበሪያ ደንበኞች ለንባብ-ብቻ ፍለጋ የሚጠቀሙበትን ተመሳሳይ Torii JSON ወለል ይገልጻል። እነዚህ ትዕዛዞች ቁልፎችን አያስፈልጋቸውም:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS -H 'Accept: application/json' "$TAIRA_ROOT/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA_ROOT/openapi.json" \
  | jq -r '.paths | keys[]' \
  | grep '^/v1/' \
  | head -n 20

curl -fsS -H 'Accept: application/json' \
  "$TAIRA_ROOT/v1/node/capabilities" \
  | jq '{abi_version, data_model_version, query: .query.aggregate.supported_resources}'
```

በዛሬው የዓለም ሁኔታ ላይ የሚገኘውን መረጃ ይሞክሩ:

```bash
curl -fsS "$TAIRA_ROOT/v1/domains?limit=5" \
  | jq -r '.items[].id'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=5" \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

አንድ የህዝብ የሙከራ አውታረመረብ መንገድ `502` የሚመልስ ከሆነ ፣ ጊዜዎችን ያቆማል ወይም የተሟላ ረድፍ ሪፖርት የሚያደርግ ከሆነ ፣ እንደ መጨረሻ ነጥብ ተደራሽነት ችግር አድርገው ይመለከቱት እና ከደንበኛ ኮድዎን ከማስተካከልዎ በፊት በኋላ እንደገና ይሞክሩ ።

## የጋራ ስምምነት እና የአሂድ ጊዜ መጨረሻ ነጥቦች {#consensus-and-runtime-endpoints}

|የመጨረሻ ነጥብ |ቅርጸት |ዓላማ|
| --- | --- | --- |
|`GET /v1/sumeragi/commit-certificates` |JSON |የቅርብ ጊዜ ተሳትፎ የምስክር ወረቀት ማጠቃለያዎች |
|`GET /v1/sumeragi/validator-sets` |JSON |የማረጋገጫ ቅንብር ታሪክ |
|`GET /v1/sumeragi/validator-sets/{height}` |JSON |ማረጋገጫው በብሎክ ቁመት ላይ ተዘጋጅቷል|
|`GET /v1/sumeragi/status` |Norito ወይም JSON |የስምምነት ሁኔታ ዝርዝር ፎቶግራፍ |
|`GET /v1/sumeragi/status/sse` |SSE |ቀጣይነት ያለው የጋራ ስምምነት ሁኔታ |
|`GET /v1/sumeragi/leader` |JSON |ወቅታዊ መሪ መረጃ |
|`GET /v1/sumeragi/qc` |Norito ወይም JSON |የቅርብ ጊዜው የቁጥር ማረጋገጫ ማጠቃለያ |
|`GET /v1/sumeragi/checkpoints` |JSON |የስምምነት ፍተሻ ነጥቦች ማጠቃለያ |
|`GET /v1/sumeragi/consensus-keys` |JSON |የጋራ ስምምነት ቁልፎች |
|`GET /v1/sumeragi/bls_keys` |JSON |ንቁ BLS የጋራ ቁልፎች |
|`GET /v1/sumeragi/phases` |JSON |የመጨረሻው የደረጃ መዘግየት ናሙና |
|`GET /v1/sumeragi/rbc` |JSON |RBC የስብሰባ እና የውጤት ፍሰት መለኪያዎች |
|`GET /v1/sumeragi/rbc/sessions` |JSON |ንቁ RBC ክፍለ ጊዜ ቅጽበታዊ ገጽ እይታ|
|`GET /v1/sumeragi/pacemaker` |JSON |የልብ ምት ማመቻቸት |
|`GET /v1/sumeragi/params` |JSON |የአሁኑ ሰንሰለት Sumeragi መለኪያዎች |
|`GET /v1/sumeragi/collectors` |JSON |የዴተሪሚኒስት ሰብሳቢ ዕቅድ ቅጽበታዊ ገጽ እይታ |
|`GET /v1/sumeragi/key-lifecycle` |JSON |የጋራ ቁልፍ የሕይወት ዑደት ሁኔታ |
|`GET /v1/sumeragi/telemetry` |JSON |የጋራ ስምምነት ቴሌሜትሪ ቅጽበታዊ ገጽ እይታ |
|`GET /v1/sumeragi/evidence` |JSON |የምስክርነት መዛግብት፣ በምርጫ መስመር የተጣራ |
|`GET /v1/sumeragi/evidence/count` |JSON |የምስክር ወረቀቶች ብዛት|
|`POST /v1/sumeragi/evidence/submit` |JSON |የስምምነት ማስረጃዎችን ማቅረብ |
|`GET /v1/sumeragi/commit_qc/{hash}` |Norito ወይም JSON |ለብሎክ ሃሽ QC መዝገብ ግዴታ |
|`GET /v1/runtime/abi/active` |JSON |ተንቀሳቃሽ የስራ ሰዓት ABI መግለጫ |
|`GET /v1/runtime/abi/hash` |JSON |ንቁ የስራ ሰዓት ABI ሃሽ |
|`GET /v1/runtime/metrics` |JSON |የሂደት ጊዜ መለኪያዎች ቅጽበታዊ ገጽ እይታ |
|`GET /v1/runtime/upgrades` |JSON |የስራ ሰዓት ማሻሻያ ዝርዝር |
|`POST /v1/runtime/upgrades/propose` |JSON |የስራ ሰዓት ማሻሻያ ያቅርቡ |
|`POST /v1/runtime/upgrades/activate/{id}` |JSON |የቀረበውን የስራ ሰዓት ማሻሻያ አክቲቭ ማድረግ |
|`POST /v1/runtime/upgrades/cancel/{id}` |JSON |የቀረበውን የስራ ሰዓት ማሻሻያ መሰረዝ |

## አፕ እና SORA የመንገድ ቤተሰቦች {#app-and-sora-route-families}

Torii በመተግበሪያ-ተኮር ባህሪ ስብስብ ሲገነባ ለተመራማሪዎች ተጨማሪ JSON ቤተሰቦችን ፣ SORA አገልግሎቶችን ፣ የድልድይ ፍሰቶችን ፣ ማረጋገጫዎችን እና ማከማቻን ያሳያል ። እነዚህ ቤተሰቦች በሁሉም የአውታረ መረብ መገለጫዎች ላይ አልተገበሩም ።

`/openapi` በተፈጠረው መተግበሪያ-API ካታሎግ ውስጥ የተመዘገቡትን መስመሮች ይገልጻል፤ የሚካተቱትን እያንዳንዱን መንገድ ሳይሆን ለሚያካትታቸው አድራሻዎች እውቅና ይሰጣል። በተለይ የህዝብ አካባቢያዊ SoraFS CID እና የታወቁ መስመሮች ከተፈጠረው ሰነድ ውጭ ተጭነው በቀጥታ መመርመር አለባቸው ።

|የመንገድ ቤተሰብ |ዓላማ|
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
|`/v1/accounts/`, `/v1/domains/`, `/v1/assets/*` |JSON ያነባል፣ የሚጠይቅ ረዳት፣ የማስገባት ረዳት እንዲሁም ፖርትፎሊዮ ወይም ባለቤት እይታዎች |
|`/v1/nfts/`, `/v1/rwas/`, `/v1/confidential/*` |NFT ፣ በእውነተኛ ዓለም ንብረት፣ እና ምስጢራዊ ንብረት እይታዎች |
|`/v1/aliases/`, `/v1/assets/aliases/`, `/v1/sns/`, `/v1/identifiers/` |ስም፣ ቅጽል ስያሜ እና መታወቂያ ጥራት |
|`/v1/explorer/*` |Explorer-oriented account, asset, block, transaction, instruction, metric, and stream views  ለሰፋፊው የተመሠረቱ መለያዎች፣ ንብረቶች፣ ብሎኮች፣ ግብይቶች፣ መመሪያዎች፣ መለኪያዎች እና ፍሰት እይታዎች|
|`/v1/transactions/`, `/v1/pipeline/`, `/v1/iso20022/*` |የግብይት ታሪክ፣ የቧንቧ መስመር መልሶ ማቋቋም ወይም ሁኔታ፣ እና ISO 20022 ረዳት |
|`/v1/contracts/*` |የኮንትራት ኮድ, ማሰማራት, ጥቅል, ጥሪ, እይታ, ክስተት, እንቅስቃሴ, rollup, እና ሁኔታ መስመሮች |
|`/v1/multisig/` ፣ `/v1/controls/` |ባለብዙ ስምምነቶች ጥቆማዎች፣ ማጽደቅ እና የዝውውር ቁጥጥር ረዳቶች |
|`/v1/bridge/`, `/v1/ledger/`, `/v1/proofs/*` |ፍፃሜ፣ የስቴት ማስረጃ፣ ብሎክ ማስረጃ፣ ማስረጃ ማቆየት እና ማስረጃ ጥያቄ መስመሮች |
|`/v1/da/*` |የውሂብ ተደራሽነት አጠቃቀም፣ ማሳያዎች፣ የማረጋገጫ ፖሊሲዎች፣ ግዴታዎች እና የፒን ዓላማዎች |
|`/v1/zk/*` |ZK ሥሮች፣ የምስክርነት ማረጋገጫ፣ IVM ማስረጃ፣ የድምፅ መቁጠር፣ የማረጋገጫ ቁልፎች፣ የምሥክርነት መዝገቦች እና አባሪዎች |
|`/v1/gov/` ፣ `/v1/ministry/` |የአስተዳደር ፕሮፖዛሎች፣ የምርጫ ወረቀቶች፣ የምክር ቤት ሁኔታ፣ የተጠበቁ የስም ቦታዎች፣ የአጀንዳ ፕሮፖዛል፣ አዋጅ ማውጣትና ማጠናቀቅ |
|`/v1/nexus/` ፣ `/v1/sccp/` |Nexus ጎዳና, የመረጃ ቦታ, እና መስቀለኛ ሰንሰለት መከላከያ ረዳቶች |
|`/v1/musubi/*` |Musubi የፓኬጅ መዝገብ አንባቢዎች እና መመሪያ አምራቾች |
|`/v1/subscriptions/*` |የደንበኝነት ምዝገባ ዕቅዶች፣ የደንበኞቻችን የሕይወት ዑደት፣ አጠቃቀም እና ክፍያዎች |
|`/v1/sorafs/`, `/sorafs/`, `/.well-known/sorafs/*` |SoraFS አቅራቢ ግኝት, አቅም ማረጋገጫ, ፒኒንግ, የማከማቻ ያመጣል, እና የሕዝብ ይዘት በማቅረብ |
|`/v1/soracloud/`, `/v1/soradns/`, `/soradns/`, `/api/` |SoraCloud የአገልግሎት የሕይወት ዑደት፣ የግል ኮምፒውተር/ሞዴል ፍሰቶች፣ የህዝብ ግኝት እና የተስተናገደ የመተግበሪያ አሰራር |
|`/v1/connect/` ፣ `/v1/vpn/` |Iroha የግንኙነት ክፍለ ጊዜዎች፣ WebSocket ትራንስፖርት፣ VPN ክፍለ ጊዜዎች ፣ መገለጫዎች እና ደረሰኞች |
|`/v1/app-api/`, `/v1/api/`, `/v1/content/*` |App API ትስስር እና ጥቅል/CID የተደገፈ ይዘት አሰላለፍ |
|`/v1/operator/*` ፣ `/v1/mcp` |የኦፕሬተር ማረጋገጫ እና የአገር ውስጥ MCP JSON-RPC ድልድይ |
|`/v1/offline/`, `/v1/repo/`, `/v1/space-directory/`, `/v1/ram-lfe/` |ከመስመር ውጪ ዝግጁነት ፣ የመረጃ ቋት ስምምነቶች ፣ የውሂብ ቦታ ማኒፊስቶች እና [RAM-LFE ረዳቶች ](/am/blockchain/ram-lfe.md#torii-routes) ።|
|`/v1/kaigi/`, `/v1/webhooks/`, `/v1/notify/`, `/v1/telemetry/` |ትብብር, የድር አገናኝ, የግፋ ማሳወቂያዎች እና የቀጥታ ቴሌሜትሪ ውህደቶች |

## የሂሳብ ማረጋገጫ፣ ታይነት እና የአሰሳ አሳሽ መርማሪዎች {#account-authentication-visibility-and-explorer-cursors}

### የመተግበሪያ መለያ ጥያቄ ፕሮቶኮል {#app-account-request-protocol}

በመተግበሪያው ላይ የተመሠረቱ መስመሮች የማረጋገጫ ራስጌዎችን አይቀበሉም ፣ አንድ ቀጥተኛ የአንድ ቁልፍ ማስረጃ ወይም አንድ ባለብዙ ምልክት ምስክር። እያንዳንዱ የማረጋገጫ ራዕይ ቢያንስ አንድ ጊዜ መታየት አለበት ።

ቀጥተኛ ማስረጃ ለማግኘት አራቱን ራስጌዎች በአንድ ላይ ላክ:

- `X-Iroha-Account`: ትክክለኛውን የካኖኒክ አነስተኛ ፊደል `0x` የሂሳብ አድራሻ hex ወይም ንቁ ካኖኒክ ASCII የሂሳብ ቅጽል ስም። I105 ጽሑፍ እንደ HTTP የመስክ ዋጋ ደህንነቱ የተጠበቀ አይደለም; ለዚያ ሂሳብ የካኖኒካል hex ፊደል ይጠቀሙ ።
- `X-Iroha-Signature`: ጥብቅ የተሸፈነ-መሠረት 64 ፊርማ ጠቃሚ ጭነት.
- `X-Iroha-Timestamp-Ms`: በቅንብሮች ውስጥ በሚልሰከንዶች ውስጥ ካኖኒካል ያልተፈረመ የአስርዮሽ የዩኒክስ ጊዜ ማህተም።
- `X-Iroha-Nonce`: ከ1 እስከ 256 ሊታተሙ የሚችሉ ASCII ባይት (`0x21` እስከ `0x7e`) ፣ በድጋሚ ማጫወት መስኮት ውስጥ ልዩ ናቸው።

የተመዘገበው ነጠላ ቁልፍ መቆጣጠሪያ እነዚህን ትክክለኛ ባይቶች ይፈርዳል:

```text
iroha.app.request.network.v1\0 || <genesis-derived network_id[32]> ||
<UPPERCASE_METHOD>\n
<exact request path>\n
<canonical query>\n
<lowercase hex SHA-256 of the raw body>\n
<canonical timestamp_ms>\n
<nonce>
```

የካኖኒካል መጠይቅ ግንባታ ጥሬውን መጠይቅ እንደ `application/x-www-form-urlencoded` (`+` ማለት ቦታ ነው) ይመረምራል ፣ መቶኛ - ጥንዶቹን ያከብራል ፣ በ `(key, value)` ያከፋፍላል ፣ እና እንደገና ቅርጸት-የኮድ ያደርጋቸዋል። ፕሮቶኮሉ በከፍተኛ ሁኔታ 64 የተከፈቱ ጥንዶች እና 64 KiB ጥሬ የጥያቄ ጽሑፍ ይፈቅዳል ። አካሉን ባይቶች በትክክል እንደተላለፈው ይሸፍኑ ። ቋሚ 32-ባይት አውታረመረብ ID እና ትልቅ ፊደል ዘዴ መካከል መለያያ አያስገቡ።

የ V1 ማረጋገጫ ደግሞ ዘዴ ምልክት 32 ባይት, መቶኛ-ኮድ ጥያቄ መንገድ በ 64 KiB, እና ቀጥተኛ መለያ መታወቂያ 36 KiB ላይ ፓነል በፊት ይገድባል. የሂሳብ ስያሜዎች ከሶስት ስም ክፍሎች እና ከመለያዎቻቸው የበለጠ ጥብቅ የሆነ መዋቅራዊ ገደብ አላቸው ። አንድ ጠርዝ አልፎ ከመፈረም ማረጋገጫ ወይም ምንጭ መጠን አከፋፈል በፊት የማረጋገጫ ውድቀት ነው።

አንድ ባለብዙ ምልክት መቆጣጠሪያ ይልቅ መላክ አለበት `X-Iroha-Witness` እንደ ጥብቅ የተሸፈነ-መሠረት64 ቀኖናዊ Norito እና ማስወገድ `X-Iroha-Signature`, `X-Iroha-Timestamp-Ms`, እና `X-Iroha-Nonce`. `X-Iroha-Account` በዚህ ቅጽ ውስጥ አማራጭ ነው፤ በሚገኝበት ጊዜ ምስክሩ ጋር እኩል መሆን አለበት። `subject_account`. የ `CanonicalRequestWitnessV1` ይዟል `schema_version`, `subject_account`, `timestamp_ms`, `nonce`, አንድ Iroha `Hash` የ ትክክለኛ አውታረ መረብ ጥያቄ ባይቶች በሰውነት ማጣሪያ በኩል ግን ያለ እያንዳንዱ አባል የካኖኒክ ፊርማውን ይፈርዳል Norito የተረጋገጡ አባላት በሂሳቡ ውስጥ ያለው የአሁኑ ባለብዙ ፊደላት ፖሊሲ ማሟላት አለበት. MiB.

ምንም የማረጋገጫ ራስጌዎችን ማቅረብ ማንኛውንም ስም አልባ መዳረሻን ይመርጣል ። ማንኛውም ክፍልፋይ ፣ የተቀላቀለ ፣ ተደጋጋሚ ፣ የተበላሸ ፣ የቆየ ወይም እንደገና የተጫወተ ማስረጃ ማቅረብ የማረጋገጫ ውድቀት ነው ፤ ወደ አናኒም ታይነት በጭራሽ አይመለስም።

### የኦፕሬተሮች ጥያቄ ፕሮቶኮል {#operator-request-protocol}

እንደ ኦፕሬተር የተረጋገጡ ሆነው ምልክት የተደረገባቸው መስመሮች በአራቱም የሲንግልተን ራስጌዎች ውስጥ ያስፈልጋሉ-

- `x-iroha-operator-public-key`: ቀኖናዊው Iroha ባለብዙ ቁልፍ የሕዝብ ቁልፍ።
- `x-iroha-operator-timestamp-ms`: በሚሊሰከንዶች ውስጥ ካኖኒካዊ ያልፈረመ የዩኒክስ የአስርዮሽ ጊዜ ምልክት።
- `x-iroha-operator-nonce`: ከ 1 እስከ 256 የታተሙ ASCII ባይት፣ በድጋሚ ማጫወት መስኮቱ ውስጥ ለዚያ ቁልፍ ልዩ።
- `x-iroha-operator-signature`: ጥብቅ የተሸፈነ-መሠረት 64 ፊርማ ጠቃሚ ጭነት.

የርዕስ እሴቶች በዙሪያው ያለውን ነጭ ቦታ ሊይዙ አይችሉም.

```text
iroha.operator.http-request.network.v1\0 || <genesis-derived network_id[32]> ||
<UPPERCASE_METHOD>\n
<exact request path>\n
<canonical query>\n
<lowercase hex SHA-256 of the raw body>\n
<canonical timestamp_ms>\n
<nonce>
```

የመንገድ ፣ መጠይቅ ፣ አካል ፣ የጊዜ ማህተም እና nonce ደንቦች በመተግበሪያ ፕሮቶኮል ውስጥ ጥቅም ላይ የሚውሉ ተመሳሳይ የካኖኒክ ደንቦች ናቸው ። ቁልፉ እንዲሁ በ `[torii.operator_signatures]`: በ `allowed_public_keys` ይዘርዝሩት ወይም የአገናኝ ቁልፍን በሚጠቀሙበት ጊዜ በግልጽ `allow_node_key` ን ያበራሉ። የመልሶ ማጫዎቻ ካሽ ሲሞላ Torii ጥያቄውን በ `503 Service Unavailable` ይክዳል። አማራጭ WebAuthn ወይም mTLS ኦፕሬተር ማረጋገጫ ተጨማሪ ነገር ነው እናም ይህንን ትክክለኛ የጠየቅ ፊርማ በጭራሽ አይተካም።

ISO 20022 መስመሮች ሁለት ገለልተኛ ምርመራዎችን ያካሂዳሉ። ጥያቄው በመጀመሪያ ይህንን የኦፕሬተር ፍቃድ ዝርዝር እና ፊርማ ፕሮቶኮልን ማለፍ አለበት ፣ ከዚያ ISO አስተላላፊ ከዚህ በታች የተገለጸውን ትክክለኛ ተሳታፊ ወይም ኦዲት ሚና ለመያዝ ተመሳሳይ ቁልፍ ይፈልጋል።

### የመቁጠሪያ መገለጫ እና የአሰሳ አቅጣጫዎች {#ledger-visibility-and-explorer-cursors}

መተግበሪያ-ተኮር መቁጠሪያ አንብቦች ከላይ ያለውን አማራጭ የመተግበሪያ ሂሳብ ወሰን ይጠቀማሉ. ያልተፈረመ ጥያቄ ብቻ ነው የሚቀበለው የህዝብ ሆኖ የተዋቀሩ የውሂብ ጎራዎች. አንድ ትክክለኛ የተፈረመ ጥያቄ ያክላል ለተጠሪው የአሁኑ UAID የተያያዙ የውሂብ ክፍሎች፣ እያንዳንዱ በተጨባጭ `CanReadRestrictedDataspace { dataspace }` ፈቃድ የተሰየመ የተገደበ የውሂብ ቦታ ወይም ሂሳቡ `CanReadAllLedgerData` ካለው ሁሉም መስመሮች።

ተመሳሳይ ታይነት ዕቃዎች ማጣሪያዎች ሂሳብ, ጎራ, ሀብት-ትርጉም, ንብረት, NFT, RWA, ባለቤት, እና Explorer ን ያነባል. አንድ የጎደለው ነገር እና ከጠሪው ከሚታየው መንገድ ውጭ የሆነ ነገር ሆን ተብሎ ሊለዩ አይችሉም. ለግብይቱ የተመዘገቡት እያንዳንዱ የመንገድ እግር በሚታይበት ጊዜ ብቻ የተሰማሩ ግብይቶች እና መመሪያ ታሪክ ይታያል። ስለዚህ አንድ ተሳታፊ እግር እንኳን ከጠሪው አቅጣጫ ውጭ በሚሆንበት ጊዜ ተደብቋል; የጎደለው ፣ የቆየ ወይም የተበላሸ የጉዞ አውድ ለአለምአቀፍ አንባቢ ብቻ ይታያል።

በስድስት በዓለም ላይ የተደገፉ የኤክስፕሎረር ስብስቦች ግልጽ ያልሆኑ የካኖኒካል base64url ቁልፍ ሰሌዳዎችን ይጠቀማሉ ። ነባሪ ገጽ ገደቡ 25 ነው ፣ ከፍተኛው 100 ሲሆን አንድ ገጽ በከፍተኛ ደረጃ 512 የእጩ ቁልፎችን ይመረምራል። እያንዳንዱ ማጣሪያ ከስብሰባው ፣ ከማጣሪያዎች ፣ ከካኖኒካል የመጨረሻ ቁልፍ እና ከተጠቃሚው ከሚታየው የመንገድ ስብስብ ጋር የተቆራኘ ነው ፣ ስለሆነም በሌላ መጠይቅ ወይም ከተጠቃሚውን ታይነት ከተቀየረ በኋላ እንደገና መጫወት አይችልም ።

የብሎክ, ግብይት, የቅርብ ጊዜ-ግብይት, መመሪያ, እና የቅርብ ጊዜ መመሪያ ታሪክ ካርሰሮች በተጨማሪ የተሰጠውን ቅጽበታዊ ገጽ እይታ ቁመት እና የብሎክ ሃሽ ይለጥፋሉ. ምላሾች `pagination.limit`, `pagination.snapshot_height`, `pagination.snapshot_hash`, `pagination.next_cursor`, እና `pagination.has_more` ያሳያሉ። Torii ለሌላ መንገድ ወይም ለፊልተር ስብስብ ፣ ለተቀየረ የእይታ ዳይጀስት ወይም ኖዱ ከእንግዲህ ማረጋገጥ የማይችል ቅጽበታዊ ገጽ እይታን ለመለየት ሾፌርን ውድቅ ያደርጋል። የማገጃ ሰራተኛው በሚሰራበት ጊዜ የታሪክ ስካን በ Torii የጥያቄ-መግቢያ ፈቃድ ውስጥ ይቀራል።

ኤክስፕሎረር WebSocket ዥረቶች የተጣራ ማጠቃለያዎችን ያወጣሉ እና መቁጠሪያ ፍቃዶች ሲለወጡ የእይታን እንደገና ይለካሉ። ቤተኛው `GET /v1/blocks/stream` መንገድ የተለየ ነው: ሙሉውን ያወጣል የተፈረመባቸው ብሎኮች፣ በእጅ መጨናነቅ ወቅት `CanReadAllLedgerData` ይጠይቃል፣ እና ይህ ፈቃድ በኋላ ላይ ከተሰረዘ ይዘጋል።

## ISO 20022 ድልድይ {#iso-20022-bridge}

Torii ያጋልጣል ISO 20022 ድልድይ በታች `/v1/iso20022/*` አፕሊኬሽኑ ሲታይ API ድልድዩ ሆን ተብሎ የተቀመጠ ነው: ይህ አጠቃላይ አላማ አይደለም ISO የተመረጡ የክፍያ መልዕክቶችን ወደ ፊርማዎች ለመቀየር የሚረዳ ንዑስ ስብስብ Iroha ማስተላለፍ እና ዋና መለያቸውን ለመከታተል.

ማንኛውንም ማቅረቢያ ከመቀበልዎ በፊት ዘላቂ የሆነ አካባቢያዊ `torii.iso_bridge.store_dir` ን ያዋቅሩ ። የቅንጅት መስኩ አማራጭ ነው ፣ ስለሆነም አንድ አገናኝ ለማንበብ ብቻ ወይም ለምርመራ ጥቅም ላይ ሊውል ይችላል: እያንዳንዱ የተረጋገጠ ISO ማቅረቢያ ማውጫውን ይፈልጋል ፣ እና ጽናት ሲጎድለው ወይም እንደገና መጫወት-የመቃብር ድንጋይ ወይም የበለፀገ መዝገብ መጻፍ ሲከሽፍ ሊመለስ የሚችል `503 Service Unavailable` ይመለሳል ።

### Torii ISO 20022 የመጨረሻ ነጥቦች {#torii-iso-20022-endpoints}

|ዘዴና መጨረሻ ነጥብ |ዓላማ|
| --- | --- |
|`POST /v1/iso20022/pacs008` |ከ FI ወደ FI የደንበኛ የብድር ማስተላለፍ ያቅርቡ እና ተመጣጣኝ የሆነውን Iroha የአክሲዮን ማስተላለፍን ያጠናቅቁ |
|`POST /v1/iso20022/pacs009` |ለ PvP ወይም ከዋጋ አክሲዮኖች ጋር የተያያዘ የገንዘብ ድጋፍ ጥቅም ላይ የዋለውን ከ FI ወደ FI የብድር ማስተላለፍ ማቅረብ |
|`POST /v1/iso20022/pacs002` |የደንበኛው ባለቤትነት ያለው የክፍያ ሁኔታ ሪፖርት ማቅረብ; የማስተካከያ ፍላጎቶች የተሰማሩ የግብይት ማስረጃዎች |
|`POST /v1/iso20022/pacs004` |የደንበኛው ባለቤት የሆነ የክፍያ ማስረጃ ማቅረብ |
|`POST /v1/iso20022/camt056` |የክፍያ መሰረዝ የሚጠይቅ የመነሻ ባለቤትነት ያለው ጥያቄ ማቅረብ |
|`POST /v1/iso20022/sese023` |የዋጋ ምንዛሬዎች የማስተካከያ መመሪያ ማቅረብ |
|`POST /v1/iso20022/sese024` |በተቃራኒው ባለቤትነት የተያዙት የዋጋ ንብረቶች የማስተካከያ ሁኔታ መልዕክት ያቅርቡ |
|`POST /v1/iso20022/sese025` |በተቃራኒው ወገን ባለቤትነት የተያዙ እሴቶችን የማስተካከል ማረጋገጫ ማስገባት |
|`POST /v1/iso20022/colr012` |የዋስትና ምትክ መልዕክት ማቅረብ |
|`GET /v1/iso20022/messages/{msg_id}` |አንድ መልዕክት ለማግኘት የቅዱሳን መጻሕፍት ድልድይ መዝገብን አንብቡ።|
|`GET /v1/iso20022/audit/messages` |የሐሰት መልእክት ኦዲት ማኒፌስት ያንብቡ ።|
|`GET /v1/iso20022/messages/{msg_id}/pacs002` |የአሁኑን የክፍያ ሁኔታ `pacs.002` XML አድርገው ያስገቡ።|
|`GET /v1/iso20022/messages/{msg_id}/pacs004` |የአሁኑን የክፍያ ማመልከቻ `pacs.004` XML አድርገው ያስገቡ።|
|`GET /v1/iso20022/messages/{msg_id}/camt029` |የአሁኑን የመሰረዝ ጥራት `camt.029` XML አድርገው ያስገቡ።|
|`GET /v1/iso20022/messages/{msg_id}/sese024` |የአሁኑን የፍትሃዊነት ሁኔታ `sese.024` XML አድርገው ያስገቡ።|
|`GET /v1/iso20022/messages/{msg_id}/sese025` |የአሁኑን የፍትሃዊነት ማረጋገጫ `sese.025` XML አድርገው ያስገቡ።|

`pacs.008` ማቅረቢያዎች መልዕክቱን ማቅረብ አለባቸው ID, የበይነ ባንክ መፈፀም መጠን፣ ምንዛሬ፣ የመፈፀም ቀን፣ አበዳሪ እና አበዳሪ IBANs, እንዲሁም ባለዕዳ እና አበዳሪ BICs. የማጣቀሻ ውሂብ ሲዋቀር ድልድይ ደግሞ BIC, IBAN, እና ISO የተፈጠረው ግብይት ወደ ቧንቧው ከመግባቱ በፊት 4217 ምንዛሬ መስቀለኛ መንገድዎች ።

`pacs.009` ማቅረቢያዎች የቢዝነስ መልዕክቱን መስጠት አለባቸው ID, መልዕክት ትርጉም ID, የመፍጠር ጊዜ፣ በይነ ባንክ መፈፀም መጠን፣ ምንዛሬ፣ የመፈፀም ቀን፣ መመሪያ የሚሰጥ እና የተሰጠው ወኪል BICs, እንዲሁም ባለዕዳ እና አበዳሪ IBANs. መልዕክቱ የሚያካትት ከሆነ `Purp`, ድልድዩ በአሁኑ ጊዜ ለዋጋ ንብረቶች ብቻ የሚውል የገንዘብ ድጋፍ ይቀበላል `Purp=SECU`.

የ `pacs.008` እና `pacs.009` የመላኪያ መጨረሻ ነጥቦች በድልድይ ሙከራዎች ውስጥ ጥቅም ላይ የሚውለውን XML ISO ፖስታ ወይም ጠፍጣፋ የመስክ ቅርጸት ይቀበላሉ ። አማራጭ `SplmtryData` መስኮች የዒላማውን Iroha መቁጠሪያ ሊያስገቡ ይችላሉ ፣ ምንጭ እና የዒላማ ሂሳብ IDs ወይም አድራሻዎች፣ እንዲሁም የንብረት ማብራሪያ ID። መልሱ `202 Accepted` በ `message_id` ፣ `transaction_hash` ፣ `status` ፣ `pacs002_code` እና በተፈፀመው መቁጠሪያ/ሂሳብ/ንብረት አውድ ነው ።

### የተሳታፊው ፈቃድ እና የህይወት ዑደት ባለቤትነት {#participant-authorization-and-lifecycle-ownership}

እያንዳንዱ የተፈቀደ ድልድይ ተሳታፊ ካታሎግ አለው ። እያንዳንዱ ተሳታፊ ግቤት ልዩ ተሳታፊ ID ፣ አንድ ወይም ከዚያ በላይ ኦፕሬተሮች የህዝብ ቁልፎች ፣ አንድ ወይም ተጨማሪ የገንዘብ መታወቂያዎች ፣ የተፈቀደ የመገለጫ ስብስብ እና `originator` ፣ `counterparty` ወይም ሁለቱም ሚናዎች አሉት ። የኦፕሬተር ቁልፎች እና የገንዘብ መታወቂያዎች ከአንድ በላይ ተሳታፊ ሊሆኑ አይችሉም ። `audit_admin_keys` ን በተናጠል ያዋቅሩ; የአውዲት አስተዳዳሪ ቁልፍም እንዲሁ የተሳታፊ ለውጥ ቁልፍ ሊሆን አይችልም ።

ሁሉም ISO የመንገድ መስመሮች አዲስ ኦፕሬተር ፊርማ ያስፈልጋቸዋል. `pacs.008`, `pacs.009`, `sese.023`, ወይም `colr.012` በማመልከቻው ራስጌ የተገለጸውን ተሳታፊ የሚያመለክተው ኦፕሬተር መሆን አለበት። `From` የገንዘብ ማንነት. `To` ማንነት ጋር የተዋሃደ ተሳታፊ መፍታት አለበት `counterparty` ለሁለቱም ወገኖች የተመረጠው መገለጫ ሊፈቀድላቸው ይገባል. የተሳታፊና ኦፕሬተር ቁልፍ፣ እንዲሁም የኦሪጂናል መገለጫ እና የተቀረጸ ፊርማ ፖሊሲን በመቀበል።

የሕይወት ዑደት ፍቃድ የሚገኘው በተጠቃሚው የተመረጡ እሴቶች ሳይሆን ከዚህ የማይለወጥ መዝገብ ነው-

|የሕይወት ዑደት መልእክት |አስፈላጊ ተሳታፊ |
| ---------------------------------------------- | -------------------------------------------------- |
|`pacs.002`, `pacs.004`, `sese.024`, `sese.025` |የ `counterparty` ሚና ያለው የመጀመሪያው ግብረ አበሮ|
|`camt.056` |የ `originator` ሚና ያለው የመጀመሪያው አዘጋጅ |

የመጀመሪያው መገለጫ እና ፊርማ ፖሊሲ ለጠቅላላው ተጣብቆ ይቆያል። የህይወት ዑደት፣ ስለዚህ ደራሲው ለተዘመነበት ጊዜ ደካማ የሆነ መገለጫ መምረጥ አይችልም። `pacs.002` ክፍያውን የሚያመለክት ኮድ (`ACSC`, `ACCP`, `SETT`, ወይም `SETTLED`) ከመጀመሪያው መዝገብ ወደ ተመጣጣኝ የሚቀይረው Torii የግብይት ማስረጃ የተፈጸመበት ነው።

ማንኛውም የመጀመሪያ ወገን የመልእክቱን መዝገብ እና የተፈጠሩ የውጪ ሳጥን ሰነዶችን ማንበብ ይችላል። የኦዲት መጨረሻ ነጥብ የተረጋገጠ ተሳታፊው ኦሪጅነር ወይም ተቃዋሚ አካል የሆነባቸው መዝገቦች ብቻ ይመልሳል ። በተናጠል የተዋቀረ የኦዲት አስተዳዳሪ የአለምአቀፍ ንባብ-ብቻ የኦዲት እይታን ይቀበላል እናም መልዕክቶችን ማቅረብ ወይም መለወጥ አይችልም። ያልታወቁ ተሳታፊዎች እና ተዛማጅ ያልሆኑ መልዕክት መታወቂያዎች አይገለጡም።

### ዘላቂ የመልሶ ማጫዎቻ መታወቂያ እና የተፈረሙ የቤት ውስጥ ሳጥን ሰነዶች {#durable-replay-identity-and-signed-outbox-documents}

Torii የማይነበብ ፣ ከመጠን በላይ ፣ የተበላሸ ፣ በስም የተሳሳተ ፣ የሚጋጭ ወይም በግልጽ የማይጣጣም የመቃብር ድንጋይ ለመጀመር ያስወግዳል ። በተጨማሪም በግልጽ የማይጣጣም የስኪማ ስሪት ፣ ከአሁኑ ውቅር የተጎድለው ተሳታፊ ፣ መገለጫ ወይም ፊርማ ፖሊሲ ወይም የጎደለው ወይም ያልተዛመደ የቀጥታ የመቃብር ድንጋይ ጋር ለበለፀገ መዝገብ አቋራጭ ነው ።

ሌሎች የበለፀጉ መዝገቦች ጉዳት በተለየ መንገድ ይስተናገዳል: የማይነበቡ ወይም ከመጠን በላይ የሆኑ ፋይሎች, ልክ ያልሆኑ JSON, ልክ ያልሆኑ የአሁኑ ቅደም ተከተል መዛግብት, ቀኖናዊ ያልሆኑ የፋይል ስሞች, እና ተቃራኒ የመልሶ ማጫወት ማንነቶች ተመዝግበዋል ወይም ትተውታል. የማይነበብ ወይም ልክ ያልሆነ የአሁኑ ስሪት የኦዲት መረጃ ጠቋሚ ከተያዙት መዝገቦች ውስጥ ይታደሳል፤ በግልጽ ተኳሃኝ ያልሆነ የኦዲት ማውጫ ስሪት ብቻ ይጀምራል. የመነሻ መዝገቦችን ይከታተሉ እና እያንዳንዱ የተበላሸ የበለፀጉ መዛግብት ፋይል አገናኙን ከማገልገል ይከላከላል ብሎ ከመገምገም ይልቅ የተመለሰውን ኦዲት ማኒፌስት ያመሳስሉ ።

እያንዳንዱ የተከማቸ ሀብታም መዝገብ የማይለወጥ ተሳታፊ መነሻን ይይዛል። የተለየ ዘላቂ የመቃብር ድንጋይ መልእክቱን ID ፣ የዋጋ ጭነት ሃሽ ፣ የንግድ መልዕክት ID እና UETR ለሙሉ ማባዛት ይጠብቃል TTL እንኳን ሀብታም መዝገቡ ዝርዝሮች ከተቆረጡ በኋላም ።

Torii የህይወት ዑደት መልዕክት ከመፈረም ወይም ከማቀናበርዎ በፊት እንደገና መጫወት መቀበል ይቀጥላል. ያልተጠናቀቀ የመልሶ ማጫወት ማንነት በጭራሽ አይነጥቅም ። ሙሉ በሙሉ የተጠበቁ መዝገቦችን ወይም ያልተጠናቀቁ የመልሶ ማጫዎቻ ማንነቶችን ይይዛል ፣ አቅርቦቶች የህይወት ዑደት ወይም የሂሳብ ሁኔታ ሳይለዋወጡ ሊመለሱ የሚችሉ `503 Service Unavailable` ይቀበላሉ ።

እያንዳንዱ የተፈጠረ `pacs.002`, `pacs.004`, `camt.029`, `sese.024` ወይም `sese.025` ሰነድ የሚከተሉትን የምላሽ አርዕስተኞች ይዞ እንደ `application/xml` ይመለሳል:

|ራስጌ |ትርጉም|
| ------------------------------ | ----------------------------------------------------- |
|`X-Iroha-Iso-Signature-Domain` |ሁሌም `iroha.iso20022.outbound.v2` |
|`X-Iroha-Iso-Signer` |የተዋቀረው የድልድይ ፊርማ አድራሻ ለካኖኒካል የህዝብ ቁልፍ |
|`X-Iroha-Iso-Signature` |በዘርፉ በተከፋፈለባቸው XML ባይት ላይ Base64 ፊርማ |

በ UTF-8 ባይት ቅደም ተከተል `iroha.iso20022.outbound.v2` ፣ በአንድ ዜሮ ባይት እና በትክክለኛው የምላሽ አካል ላይ ፊርማውን ያረጋግጡ ። ከማረጋገጫ በፊት XML ን እንደገና ቅርጸት ወይም መደበኛ አያድርጉት።

### ተጨማሪ የፓርሰር እና የካርታ ድጋፍ {#additional-parser-and-mapping-support}

የ IVM ISO ረዳት እንዲሁ የሚከተሉትን መልዕክት ቤተሰቦች ለ envelope ማረጋገጫ ፣ ለመቆጣጠሪያ ካርታ አሰጣጥ ወይም ለዝቅተኛ ማስተካከያ ያረጋግጣል እና ይጨምራል ። እነሱ ገለልተኛ የሆኑ Torii መስመሮች የላቸውም።

|መልዕክት ቤተሰብ |የአሁኑ ድጋፍ |
| --- | --- |
|`head.001` |የ ISO ፖስታዎች የንግድ ማመልከቻ ራስጌ ማረጋገጫ, `BizMsgIdr`, `MsgDefIdr`, የመፍጠር ጊዜ, እና አማራጭ ላኪ / ተቀባይ BIC መስኮች ጨምሮ |
|`pacs.007`, `pacs.028`, `pacs.029` |የክፍያ መልሶ ማቋረጥ፣ የጥናት ሁኔታ ጥያቄ እና የምርመራ መፍትሔ/የጥናት ሁኔታ ትንታኔ|
|`pain.001` ፣ `pain.002` |የደንበኛው የክፍያ ጅምር እና የክፍያው ሁኔታ ሪፖርት ማረጋገጫ |
|`camt.052`, `camt.053`, `camt.054` |የሂሳብ ሪፖርት፣ መግለጫ እና የማሳወቂያ ማረጋገጫ |

## Kaigi ስብሰባዎች {#kaigi-sessions}

Kaigi በ SORA Nexus ላይ የተከፈለ ፣ በእውነተኛ ጊዜ የድምፅ / ቪዲዮ ክፍሎችን ያቀርባል ። መተግበሪያው ሁሉንም ኮንፈረንስ ሁኔታ ከሰንሰለት ውጭ ከማቆየት ይልቅ በመዝገብ-ተደገፈ ክፍለ ጊዜ መፍጠር ፣ ዝርዝር ለውጦች ፣ ሪሌ ማሳያዎች ፣ ምስጠራ ምልክቶች እና አጠቃቀም መለኪያዎችን በሚፈልግበት ጊዜ ይጠቀሙ።

መቁጠሪያ-ተኮር የሕይወት ዑደት ነው:

- `CreateKaigi`: በአንድ ጎራ ስር ጥሪን መፍጠር እና ፖሊሲውን ፣ መርሃግብርውን ፣ ሜታዳታውን እና አማራጭ የስርጭት ማኒፌስቶውን ማከማቸት።
- `JoinKaigi` እና `LeaveKaigi`: የጥሪ ዝርዝሩን ያዘምኑ። የግል ሁነታ ውስጥ ተሳታፊዎች በቀጥታ የተሳታፊውን ሂሳብ IDs ከማጋለጥ ይልቅ ግዴታዎች ፣ መሰረዞች እና የዝርዝር ማስረጃዎችን ይጠቀማሉ ።
- `RecordKaigiUsage`: የሚለካው ጊዜ እና የጋዝ ጠቅላሎች ይጨምሩ.
- `EndKaigi`: ክፍለ ጊዜውን አቁም እና የመጨረሻውን የጊዜ ማህተም ይመዝገቡ.

Torii ተለጣፊ ቴሌሜትሪን በ `/v1/kaigi/relays`, `/v1/kaigi/relays/{relay_id}`, `/v1/kaigi/relays/health`, እና `/v1/kaigi/relays/events` መተግበሪያው API እና የቴሌሜትሪ ባህሪያት ተቀባይነት አላቸው. Kaigi እንደ ጎራ ክስተቶች `KaigiRosterSummary`, `KaigiRelayManifestUpdated`, `KaigiRelayHealthUpdated`, እና `KaigiUsageSummary`.

### CLI የጭስ ሙከራ {#cli-smoke-test}

ከ `iroha kaigi` CLI ማረጋገጥ ከፈለጉ Torii መጨረሻ ነጥብ ይቀበላል Kaigi ከግንኙነት በፊት የሚደረጉ ግብይቶች UI. የ ፈጣን ማስጀመር ትዕዛዝ ንቁ ጋር ጊዜያዊ ክፍል ይፈጥራል Torii መጨረሻ ነጥብ እና ጥሪ መታወቂያ ጋር ማጠቃለያ ይደብቃል, ትእዛዝ መቀላቀል, እና SoraNet የመንሸራተት ፍንጭ:

```bash
iroha kaigi quickstart --auto-join-host --summary-out kaigi-summary.json
```

ለስክሪፕት ፍሰቶች የክፍሉን የሕይወት ዑደት በግልፅ ያስተዳድሩ:

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

አጠቃቀም `--room-policy public` ሪሌዎች ያለ ተመልካች ትኬት ሊያጋልጡባቸው የሚችሉ ክፍሎች፣ ወይም `--room-policy authenticated` መውጫዎች ተመልካች ማረጋገጫ የሚጠይቁበት ጊዜ። `--privacy-mode zk-roster-v1` ብቻ አውታረ መረብ Kaigi ዝርዝር እና አጠቃቀምን የሚያረጋግጡ ቁልፎች ተስተካክለዋል; አለበለዚያ መቀላቀል ፣ ቅጠሎች, እና የግል አጠቃቀም መዝገቦች በ Deterministic ማረጋገጫ ወቅት አልተሳኩም.

### በ JavaScript ማሳያ ላይ ሙከራ ማድረግ {#testing-with-the-javascript-demo}

[soramitsu/iroha-demo-javascript](https://github.com/soramitsu/iroha-demo-javascript) ዴስክቶፕ ማሳያውን ለ መጨረሻ እስከ መጨረሻ የኪስ ቦርሳ ሙከራ ይጠቀሙ። ማሳያው በቀጥታ ወደ Torii የሚናገር ኤሌክትሮን እና ቪዩ መተግበሪያ ነው ። በአካባቢያዊ `@iroha/iroha-js` አገናኝ በኩል እና ለአሳሽ ተወላጅ አንድ-ወደ-አንድ ሚዲያ የ `/kaigi` መንገድን ያካትታል ።

የ ማሳያውን ይጠቀሙ [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js) ከ Iroha የመረጃ ምንጭ መዝገብ. SDK በኩል `file:../iroha/javascript/iroha_js`, ስለዚህ ሁለቱንም ሳንቲሞች በዚህ ወንድማማች አቀማመጥ ውስጥ ጠብቁ

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

Node.js 20 ወይም ከዚያ በላይ እና የ Rust መሳሪያ ሰንሰለት ይጠቀሙ ስለዚህ የተፈጥሮው `iroha_js_host` ሞዱል ሊገነባ ይችላል። ምንጩን ከተቀየረ በኋላ በወንድሙ Iroha ቼክ ውስጥ ያለውን SDK እንደገና ይገንቡ; ንፁህ የታሸገ አቀማመጥ ለ `npm run build:native` የሚያስፈልገውን የካርጎ የሥራ ቦታ አይ containsልም።

ለቁጥጥር ሙከራ ማሳያውን ወደ Kaigi-አቅም ያለው Torii መጨረሻ ነጥብ አመልክቱ:

1. የ SORA/Kaigi መተግበሪያ-ተኮር APIs ገቢር ጋር አንድ Iroha አንጓ ይጀምሩ, ወይም የሚፈልጉትን Kaigi ወለሎች የሚያጋልጥ የህዝብ መጨረሻ ነጥብ ይጠቀሙ.
2. በ `/health` አማካኝነት መሰረታዊ ተደራሽነትን ይፈትሹ፣ ከዚያም የቀጥታ መንገድን ወለል በ `/openapi` ወይም `/openapi.json` ይፈትሹ። አንዳንድ ልውውጦች ደግሞ `/v1/health` ን ያጋልጣሉ ፣ ግን `/health` የተንቀሳቃሽ የህይወት ፍተሻ ነው።
3. ለ TAIRA በቀጥታ ስብሰባ ከመሞከርዎ በፊት የቴሌሜትሪ መንገዶችን ያረጋግጡ:

   ```bash
   TAIRA=https://taira.sora.org
   curl -fsS "$TAIRA/health"
   curl -fsS "$TAIRA/v1/kaigi/relays"
   curl -fsS "$TAIRA/v1/kaigi/relays/health"
   ```

   እነዚህ ቼኮች እንደሚያሳዩት Torii እና Kaigi ተለጣፊ ቴሌሜትሪ ተደራሽ ነው። ስብሰባ አይፈጥሩም፤ `CreateKaigi` እና `JoinKaigi` አሁንም የገንዘብ ቦርሳ እና የተፈረመ ግብይት ማቅረቢያ ያስፈልጋቸዋል.
4. ማሳያውን ይክፈቱ ፣ ወደ ቅንብሮች ይሂዱ ፣ Torii URL ን ያዘጋጁ ፣ እና መተግበሪያው ሰንሰለት ID እና የአውታረ መረብ ቅድመ-እስከ መጨረሻው ድረስ እንዲጫን ያድርጉ ።
5. በዴሞ ውስጥ ሁለት አካባቢያዊ የኪስ ቦርሳዎችን ይፍጠሩ ወይም መልሰው ያግኙ። አስተናጋጁ እና ጎብኚው የተለየ የኪስቦርሳ ሁኔታ እንዲኖራቸው የተለያዩ የመተግበሪያ መስኮቶችን ፣ መገለጫዎችን ወይም ማሽኖችን ይጠቀሙ ።

Kaigi UI ለመሞከር:

1. በአስተናጋጅ መስኮት ውስጥ Kaigi ን ይክፈቱ፣ ስብሰባን ይጀምሩ የሚለውን ይምረጡ፣ ርዕስ ያዘጋጁ እና የግል ግብዣ ወይም ግልፅ ግብዣን ይምረጡ።
2. WebRTC አካባቢያዊ ሚዲያ እንዲኖረው ካሜራ እና ማይክሮፎን ያግኙ የሚለውን ይምረጡ።
3. የስብሰባ አገናኝ ይፍጠሩ የሚለውን ይምረጡ. አንድ የቀጥታ ቦርሳ `CreateKaigi` ያቀርባል; ከዚያም መተግበሪያው `iroha://kaigi/join?call=...&secret=...` ጥሪ እና `#/kaigi?...` ወደ ኋላ መንገድ ያሳያል.
4. አስተናጋጅ መስኮቱን ክፍት አድርግ፤ ግብዣውን ከጎብኚው ጋር አጋራ።
5. በእንግዳ መስኮቱ ውስጥ ግብዣውን ይክፈቱ ወይም በመቀላቀል ላይ ይቀላቀሉ, አካባቢያዊ ሚዲያዎችን ያበራሉ, እና መቀላቀል ስብሰባን ይምረጡ. የቀጥታ ቦርሳ ከ Torii የተመሰጠረ አስተናጋጅ አቅርቦትን ያገኛል እና ከተመሰጠራው መልስ ሜታዳታ ጋር `JoinKaigi` ያቀርባል.
6. አስተናጋጁ የመጀመሪያውን መልስ በራስ-ሰር በማስተላለፍ ወይም Kaigi የጥሪ ምልክቶችን በመመርመር ማመልከት አለበት። ሁለቱም መስኮቶች የተገናኙ ሚዲያዎችን እና የዘመኑ የግንኙነት ዝርዝሮችን ማሳየት አለባቸው።
7. ክፍለ ጊዜውን ከአስተናጋጁ ያጠናቅቁ, ወይም CLI `iroha kaigi end` በተመሳሳይ ጥሪ ላይ ትዕዛዝ ID.

የግል Kaigi ያስፈልገዋል ይከላከላል XOR ለግል መግቢያ ነጥብ ክፍያ ለመክፈል. የ ማሳያ ሪፖርት ከሆነ የግል Kaigi ያስፈልገናል ይከላከላሉ XOR, በመተግበሪያው ውስጥ ራስ-መከላከል ጥያቄን ይጠቀሙ እና እንደገና ይሞክሩ ያድርጉ ወይም እርምጃ ይቀላቀሉ. የማረጋገጫ ማመንጨት ፣ የግል ፋይናንስ ወይም የቀጥታ ምልክት የማይገኝ ከሆነ ማሳያው ወደ ግልፅ / በእጅ ፍሰት ተመልሶ ሊመጣ ይችላል ። በዚህ ሁኔታ ውስጥ የላቀ ምልክትን ይክፈቱ ፣ ጥሬውን አቅርቦት ወይም መልስ ጥቅልን ቅጂ ያድርጉ እና ወደ ሌላ መስኮት ይስኩት ።

በዲሞ ሪፖ ውስጥ ለተፈቀደ ቁጥጥር የሚከተሉትን ይሂዱ:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
npm run verify
```

የተኮር የቪቴስት ስብስቦች Kaigi የመሰብሰቢያ አገናኝ ፈጠራን ፣ የታመቀ ግብዣ ጭነት ፣ የግል መፍጠር / መቀላቀል / መጨረስ ድልድይ ጥሪዎችን ፣ የራስ-መከላከያ ትዕዛዞችን ፣ የእጅ መውደዶችን እና መልስ ምርጫዎችን ይሸፍናል ። የ UI ጭስ ሙከራ በዴስክቶፕ እና በተንቀሳቃሽ ስልክ መጠን ባለው እይታዎች ላይ ያለውን `/kaigi` መንገድ ያካትታል ። በሁለት የኪስ ቦርሳዎች መካከል ያለው የቀጥታ ሚዲያ አሁንም በእጅ ሁለት መስኮት ሙከራ ያስፈልገዋል ምክንያቱም የአሳሽ ካሜራ / ማይክሮፎን ፍቃዶች እና የእኩዮች ሚዲያ ዥረቶች ለአካባቢው ልዩ ናቸው ።

የናሙና ውህደት ኮድ ለማግኘት [በ JavaScript App](/am/guide/tutorials/kaigi.md) ውስጥ የተካተተውን Kaigi ተመልከት.

## ሁኔታና መለኪያዎች {#status-and-metrics}

የደረጃ እና መለኪያዎች መጨረሻ ነጥቦች በዳሽቦርዶች ውስጥ የሚገቡት የመጀመሪያው ነገር ናቸው:

- `/status` ከፍተኛ-ደረጃ እኩዮች, ብሎክ, ረድፍ እና ስምምነት መስኮች ይገልጻል
- `/metrics` የፕሮሜቲየስ ቆጣቢዎችን ፣ መለኪያዎችን እና ሂስቶግራሞችን ያጋልጣል

Nexus በተፈቀደላቸው አንጓዎች ላይ የሁኔታው ውፅዓት የመንገድ መንገድ እና የውሂብ ቦታን የሚመለከቱ ክፍሎችን ያጠቃልላል ። `nexus.enabled = false` በሚሰጥበት ጊዜ እነዚህ ክፍሎች ይወገዳሉ ።

## JSON እና Norito {#json-vs-norito}

በርካታ የኦፕሬተር ማብቂያ ነጥቦች ይመለሳሉ Norito ነባሪ በሆነ መንገድ። JSON, መላክ:

```http
Accept: application/json
```

ይህ በተለይ ለሚከተሉት ሁኔታዎች ጠቃሚ ነው

- `/v1/sumeragi/status`
- `/v1/sumeragi/qc`
- `/v1/sumeragi/commit_qc/{hash}`

አንድ የፍጻሜ ነጥብ ሲቀበል ወይም ሲመዘገብ Norito በቀጥታ, አጠቃቀም `application/x-norito` እንደ ይዘት አይነት ወይም ተመራጭ `Accept` እሴት. [Norito](/am/reference/norito.md#torii-and-norito-rpc) ለትራንስፖርት ዝርዝሮች።

## የቴሌሜትሪ መገለጫዎች {#telemetry-profiles}

የ መጨረሻ ነጥብ ታይነት የአገናኙ `telemetry.profile` ቅንብር ላይ የተመሠረተ ነው. የአሁኑ ውቅር አምስት የመገለጫ ደረጃዎችን ያሳያል:

|መገለጫ |`/status` |`/metrics` |የገንቢዎች መንገዶች |
| --- | --- | --- | --- |
|`disabled` |አይደለም|አይደለም|አይደለም|
|`operator` |አዎ .|አይደለም|አይደለም|
|`extended` |አዎ .|አዎ .|አይደለም|
|`developer` |አዎ .|አይደለም|አዎ .|
|`full` |አዎ .|አዎ .|አዎ .|

## CLI አቋራጮች {#cli-shortcuts}

`iroha` CLI ቀድሞውኑ ከእነዚህ መጨረሻ ነጥቦች ውስጥ ብዙዎችን ያጠቃልላል:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml ops sumeragi params
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

## የላይኛው መስመር ማጣቀሻዎች {#upstream-references}

- [README API እና የታየበት አጠቃላይ እይታ ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/README.md)
- [ISO 20022 ድልድይ ትግበራ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/iso20022_bridge.rs)
- [አፈፃፀም እና መለኪያዎች](/am/guide/advanced/metrics.md)
