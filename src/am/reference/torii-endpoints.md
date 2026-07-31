---
translation_locale: am
translation_source: /reference/torii-endpoints.md
translation_source_hash: 6ee65d409642c79bea0f2c4ff0d8cd59b0ec0a29e115225045786d0816e8a6a7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Torii መጨረሻ ነጥቦች {#torii-endpoints}

Torii ለ HTTP ፣ SSE እና WebSocket የጌትዌይ ነው ። ለ Iroha 3 ያገለግላል በሪጀር-ተኮር APIs እና በኦፕሬተር መጨረሻ ነጥቦች ላይ።

አሁን ያሉት የፕሮቶኮል ደንቦች የሚከተሉት ናቸው:

- የሁለትዮሽ ቅርጸት Norito ነው
- ብዙ መጨረሻ ነጥቦችም ድጋፍ ያደርጋሉ JSON ሲላክ `Accept: application/json`
- መለኪያዎች በፕሮሜቲየስ ቅርጸት የተገለጹ ናቸው

ለቅርጸት ዝርዝሮች ፣ የይዘት ድርድር ፣ አቀማመጥ ባንዲራዎች ፣ የስኪማ ሃሽስ ፣ እና Norito RPC መመሪያ ፣ የ [Norito ማጣቀሻን ይመልከቱ ](/am/reference/norito.md).

## የጋራ መደምደሚያዎች {#common-endpoints}

|የመጨረሻ ነጥብ |ቅርጸት |ዓላማ|
| --- | --- | --- |
|`POST /transaction` |Norito |የተፈረመ ግብይት ያቅርቡ |
|`POST /query` |Norito |የተፈረመ ጥያቄ ያቅርቡ |
|`GET /events` |WebSocket |የዝግጅት ዥረቶችን ይመዝገቡ|
|`GET /block/stream` |WebSocket |የተዋቀሩ ብሎኮችን |
|`GET /peers` |JSON |በ Torii የተጋለጡ የአቻዎች ዝርዝር |
|`GET /health` |JSON |ቀለል ያለ የኑሮ ደረጃ |
|`GET /api_version` |JSON |ነባሪው API ስሪት |
|`GET /status` |JSON |ለኦፕሬተሮች ከፍተኛ ደረጃ ያለው የደረጃ አጠቃላይ መግለጫ |
|`GET /metrics` |ፕሮሜቲየስ |የፕሮሜቲየስ ማጭበርበሪያ መጨረሻ |
|`GET /schema` |JSON |በመረጃ ሞዴል መርሃግብር ቅጽበታዊ ገጽ እይታ በአገናኙ የተገለጸ |
|`GET /openapi` ወይም `GET /openapi.json` |JSON |የ OpenAPI ሰነድ ለሥራ ላይ የሚውሉ Torii HTTP መንገዶች |
|`GET /v1/parameters` |JSON |የአገናኝ መለኪያ ቅጽበታዊ ገጽ እይታ |
|`GET /v1/node/capabilities` |JSON |የአውታረ መረብ አቅም እና የመረጃ ሞዴል ሜታዳታ |
|`GET /v1/api/versions` |JSON |የሚደገፉ Torii API ስሪቶች |
|`GET /v1/events/sse` |SSE |ለረጅም ጊዜ የቆዩ ደንበኞች የዝግጅት ዥረት|
|`GET /v1/time/now` |JSON |የአገናኝ የግድግዳ ሰዓት ቅጽበታዊ ገጽ እይታ|
|`GET /v1/time/status` |JSON |የጊዜ ማመሳሰል ሁኔታ |

`/openapi` የሂደት ኖት ትክክለኛ ገጽታ በግንባታ ባህሪዎች እና በመሮጫ ጊዜ ውቅር ላይ የተመሠረተ ነው ፣ ስለዚህ የተፈጠሩ ደንበኞች የቀጥታ OpenAPI በእጅ በተገለጸው የመንገድ ዝርዝር ላይ ሰነድ። [Torii API ኮንሶል](/am/reference/torii-api-console.md) ያንን የቀጥታ ሰነድ ለመጫን, ሙከራ JSON መስመሮች፣ ቅጂ curl ጥያቄዎችን ያቀርባል፣ እና ከወቅቱ መርሃግብር የደንበኛ ኮድ ይፈጥራል።

## የቀጥታ Taira መስመሮችን ይሞክሩ {#try-live-taira-routes}

የህዝብ Taira የሙከራ አውታረመረብ የመተግበሪያ ደንበኞች ለንባብ-ብቻ ፍለጋ የሚጠቀሙበትን ተመሳሳይ Torii JSON ወለል ይገልጻል። እነዚህ ትዕዛዞች ቁልፎችን አያስፈልጋቸውም:

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

በዛሬው የዓለም ሁኔታ ላይ የሚገኘውን ጽሑፍ ይሞክሩ:

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

|የመንገድ ቤተሰብ |ዓላማ|
| --- | --- |
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

## ISO 20022 ድልድይ {#iso-20022-bridge}

Torii ያጋልጣል ISO 20022 ድልድይ በታች `/v1/iso20022/*` አፕሊኬሽኑ ሲታይ API ድልድዩ ሆን ተብሎ የተቀመጠ ነው: ይህ አጠቃላይ አላማ አይደለም ISO የተመረጡ የክፍያ መልዕክቶችን ወደ ፊርማዎች ለመቀየር የሚረዳ ንዑስ ስብስብ Iroha ማስተላለፍ እና ዋና መለያቸውን ለመከታተል.

### Torii ISO 20022 የመጨረሻ ነጥቦች {#torii-iso-20022-endpoints}

|ዘዴና መጨረሻ ነጥብ |ዓላማ|
| --- | --- |
|`POST /v1/iso20022/pacs008` |ከ FI ወደ FI የደንበኛ የብድር ማስተላለፍ ያቅርቡ እና ተመጣጣኝ የሆነውን Iroha የአክሲዮን ማስተላለፍን ያጠናቅቁ |
|`POST /v1/iso20022/pacs009` |ለ PvP ወይም ከዋጋ አክሲዮኖች ጋር የተያያዘ የገንዘብ ድጋፍ ጥቅም ላይ የዋለውን ከ FI ወደ FI የብድር ማስተላለፍ ማቅረብ |
|`POST /v1/iso20022/pacs002` |የክፍያ ሁኔታ ሪፖርት ማቅረብ |
|`POST /v1/iso20022/pacs004` |የክፍያ መልዕክት ማቅረብ |
|`POST /v1/iso20022/camt056` |የክፍያ መሰረዝ ጥያቄ ማቅረብ |
|`POST /v1/iso20022/sese023` |የዋጋ ምንዛሬዎች የማስተካከያ መመሪያ ማቅረብ |
|`POST /v1/iso20022/sese024` |የዋጋ ንብረቶችን የማስተካከል ሁኔታ መልዕክት ያቅርቡ |
|`POST /v1/iso20022/sese025` |የዋጋ ንብረቶችን የማስተካከያ ማረጋገጫ ማስገባት |
|`POST /v1/iso20022/colr012` |የዋስትና ምትክ መልዕክት ማቅረብ |
|`GET /v1/iso20022/messages/{msg_id}` |አንድ መልዕክት ለማግኘት የቅዱሳን መጻሕፍት ድልድይ መዝገብን አንብቡ።|
|`GET /v1/iso20022/audit/messages` |የሐሰት መልእክት ኦዲት ማኔፊስት ያንብቡ ።|
|`GET /v1/iso20022/messages/{msg_id}/pacs002` |የአሁኑን የክፍያ ሁኔታ `pacs.002` XML አድርገው ያስገቡ።|
|`GET /v1/iso20022/messages/{msg_id}/pacs004` |የአሁኑን የክፍያ ማመልከቻ `pacs.004` XML አድርገው ያስገቡ።|
|`GET /v1/iso20022/messages/{msg_id}/camt029` |የአሁኑን የመሰረዝ ጥራት `camt.029` XML አድርገው ያስገቡ።|
|`GET /v1/iso20022/messages/{msg_id}/sese024` |የአሁኑን የፍትሃዊነት ሁኔታ `sese.024` XML አድርገው ያስገቡ።|
|`GET /v1/iso20022/messages/{msg_id}/sese025` |የአሁኑን የፍትሃዊነት ማረጋገጫ `sese.025` XML አድርገው ያስገቡ።|

`pacs.008` ማቅረቢያዎች መልዕክቱን ማቅረብ አለባቸው ID, የበይነ ባንክ መፈፀም መጠን፣ ምንዛሬ፣ የመፈፀም ቀን፣ አበዳሪ እና አበዳሪ IBANs, እንዲሁም ባለዕዳ እና አበዳሪ BICs. የማጣቀሻ ውሂብ ሲዋቀር ድልድይ ደግሞ BIC, IBAN, እና ISO የተፈጠረው ግብይት ወደ ቧንቧው ከመግባቱ በፊት 4217 ምንዛሬ መስቀለኛ መንገድዎች ።

`pacs.009` ማቅረቢያዎች የቢዝነስ መልዕክት ID፣ መልዕክት ትርጉም ID፣ የመፍጠር ጊዜ፣ ከባንኮች መካከል የሚፈፀመው የፍርድ ክፍያ መጠን፣ ምንዛሬ፣ የፍርድ ቤቱ ቀን፣ መመሪያ የሚሰጥ እና የተሰጠ ወኪል BICs እንዲሁም ባለዕዳና አበዳሪ IBANs መሆን አለባቸው። መልዕክቱ `Purp`ን የሚያካትት ከሆነ, ድልድዩ በአሁኑ ጊዜ ለዋጋ ንብረቶች ብቻ የገንዘብ ድጋፍ ይቀበላል: `Purp=SECU`.

የ `pacs.008` እና `pacs.009` የመላኪያ መጨረሻ ነጥቦች በድልድይ ሙከራዎች ውስጥ ጥቅም ላይ የሚውለውን XML ISO ፖስታ ወይም ጠፍጣፋ የመስክ ቅርጸት ይቀበላሉ ። አማራጭ `SplmtryData` መስኮች የዒላማውን Iroha መቁጠሪያ ፣ ምንጭ እና የዒላማ ሂሳብ IDs ወይም አድራሻዎችን እንዲሁም የአክሲዮን ፍቺን ID መለየት ይችላሉ ። መልሱ `202 Accepted` በ `message_id`, `transaction_hash`, `status`, `pacs002_code` እና የተፈታውን መቁጠሪያ / ሂሳብ / ንብረት አውድ ጋር ነው.

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
- `JoinKaigi` እና `LeaveKaigi`: የጥሪ ዝርዝሩን ያዘምኑ። የግል ሁነታ ውስጥ ተሳታፊዎች በቀጥታ የተሳታፊውን ሂሳብ IDs ከማጋለጥ ይልቅ ግዴታዎች ፣ መሰረዞች እና የዝርዝር ማረጋገጫዎችን ይጠቀማሉ።
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

`--room-policy public` በሬሌዎች ያለ ተመልካች ትኬት ሊጋለጡ ለሚችሉ ክፍሎች ወይም `--room-policy authenticated` መውጫዎች የመመልከቻ ማረጋገጫን በሚጠይቁበት ጊዜ ይጠቀሙ። አውታረመረብ የ Kaigi ዝርዝር እና የአጠቃቀም ማረጋገጫ ቁልፎች ከተዋቀሩ በኋላ ብቻ `--privacy-mode zk-roster-v1` ይጠቀሙ; አለበለዚያ ተያያዥነት፣ ቅጠሎች እና የግል አጠቃቀም መዝገቦች በዴተሪሚኒስት ማረጋገጫ ወቅት ይወድቃሉ።

### በ JavaScript ማሳያ ላይ ሙከራ ማድረግ {#testing-with-the-javascript-demo}

[soramitsu/iroha-demo-javascript](https://github.com/soramitsu/iroha-demo-javascript) ዴስክቶፕ ማሳያውን ለ መጨረሻ እስከ መጨረሻ የኪስ ቦርሳ ሙከራ ይጠቀሙ። ማሳያው በቀጥታ ወደ Torii የሚናገር ኤሌክትሮን እና ቪዩ መተግበሪያ ነው ። በአካባቢያዊ `@iroha/iroha-js` አገናኝ በኩል እና ለአሳሽ ተወላጅ አንድ-ወደ-አንድ ሚዲያ የ `/kaigi` መንገድን ያካትታል ።

የ ማሳያውን ይጠቀሙ [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js) ከ Iroha የመረጃ ምንጭ መዝገብ. SDK በኩል `file:../iroha/javascript/iroha_js`, ስለዚህ ሁለቱንም ሳንቲሞች በዚህ ወንድማማች አቀማመጥ ውስጥ ጠብቁ

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
4. ማሳያውን ይክፈቱ ፣ ወደ ቅንብሮች ይሂዱ ፣ Torii URL ን ያዘጋጁ ፣ እና መተግበሪያው ሰንሰለት ID እና የአውታረ መረብ ቅድመ-እስከ መጨረሻው ድረስ እንዲጭን ያድርጉ ።
5. በዴሞ ውስጥ ሁለት አካባቢያዊ የኪስ ቦርሳዎችን ይፍጠሩ ወይም መልሰው ያግኙ። አስተናጋጁ እና ጎብኚው የተለየ የኪስቦርሳ ሁኔታ እንዲኖራቸው የተለያዩ የመተግበሪያ መስኮቶችን ፣ መገለጫዎችን ወይም ማሽኖችን ይጠቀሙ ።

Kaigi UI ለመሞከር:

1. በአስተናጋጅ መስኮት ውስጥ Kaigi ን ይክፈቱ፣ ስብሰባን ይጀምሩ የሚለውን ይምረጡ፣ ርዕስ ያዘጋጁ እና የግል ጥሪ ወይም ግልፅ ግብዣ ይምረጡ።
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

የፍጻሜ ነጥብ ታይነት በቴሌሜትሪ ቅንብሮች ላይ የተመሠረተ ነው.

|መገለጫ |`/status` |`/metrics` |የገንቢዎች መንገዶች |
| --- | --- | --- | --- |
|`disabled` |አይደለም|አይደለም|አይደለም|
|`operator` |አዎ .|አይደለም|አይደለም|
|`extended` |አዎ .|አዎ .|አይደለም|
|`developer` |አዎ .|አይደለም|አዎ .|
|`full` |አዎ .|አዎ .|አዎ .|

## CLI አቋራጮች {#cli-shortcuts}

`iroha` CLI ቀድሞውኑ ከእነዚህ የመጨረሻ ነጥቦች ውስጥ ብዙዎችን ያጠቃልላል:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml ops sumeragi params
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

## የላይኛው መስመር ማጣቀሻዎች {#upstream-references}

- [README API እና የታየበት አጠቃላይ እይታ ](https://github.com/hyperledger-iroha/iroha/blob/main/README.md)
- [ISO 20022 ድልድይ ትግበራ](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_torii/src/iso20022_bridge.rs)
- [አፈፃፀም እና መለኪያዎች](/am/guide/advanced/metrics.md)
