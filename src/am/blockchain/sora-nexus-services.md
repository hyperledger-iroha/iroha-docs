---
translation_locale: am
translation_source: /blockchain/sora-nexus-services.md
translation_source_hash: 0dcdda5185d25e113fb636b8b2aede6081ca8ee89b8b38c50b69fed88622df49
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SORA Nexus አገልግሎቶች {#sora-nexus-services}


SORA Nexus ዙሪያ መተግበሪያ-ተኮር አገልግሎት አውሮፕላኖች ያክላል Iroha 3. እነዚህ አገልግሎቶች የተለዩ መለያዎች አይደሉም ። Iroha የዓለም መንግስት፣ Norito መገለጫዎች፣ የአስተዳደር መዝገቦች እና Torii የጉዞ ቤተሰቦች።

ተደራሽነት በአገናኝ ግንባታ እና በአውታረ መረብ መገለጫ ላይ የተመሠረተ ነው። በዒላማው አገናኝ ላይ የተፈጠሩትን መተግበሪያ-API መስመሮችን ለመፈለግ [ `/openapi`](/am/reference/torii-endpoints.md#app-and-sora-route-families) ይጠቀሙ። የህዝብ አካባቢያዊ SoraFS CID እና በደንብ የታወቁ መስመሮች ከተፈጠረው ሰነድ ውጭ ተጭነዋል ፣ ስለሆነም አንድ ማሰማራት ሲፈትሹ እነዚያን መስመሮች በቀጥታ ይመርምሩ ።

## አካላት ካርታ {#component-map}

|አካል |ሚና |ዋናው ገጽታ |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
|Soracloud |የመተግበሪያ ማሰማራት፣ የተስተናገዱ አገልግሎቶች፣ የግል ሞዴል/የስራ ሰዓት ሁኔታ እና የአገልግሎት የሕይወት ዑደት ቁጥጥር። |`/v1/soracloud/`, `/api/`, `iroha app soracloud ...` |
|ወደ ውስጥ |Soracloud የቀጥታ HTTP አውሮፕላን ለሚያስፈልጋቸው የአገልግሎት ማሻሻያዎች HTTP አሂድ ጊዜን ያስተናግዳል። |Soracloud የስራ ሰዓት ውቅር, አስተናጋጅ አቅም ማስታወቂያዎች, ተለዋዋጭ የሥራ ሰዓት ሁኔታ |
|SoraNet |የግላዊነት እና የትራንስፖርት ሽፋን ለሰርኩቶች ፣ ለሪሌይ ትራፊክ ፣ VPN ፣ ለተገናኙ ክፍለ ጊዜዎች እና ለዥረት መስመሮች። |`/v1/connect/` ፣ `/v1/vpn/`፣ SoraNet የመንገድ ሜታዳታ |
|የመረጃ ተደራሽነት (DA) |Nexus መስመሮች, SoraFS መገለጫዎች እና የማረጋገጫ ፍሰቶች የተመለከቱት ለጠቅላላ ሸቀጦች ተደራሽነት ማስረጃ, ቁርጠኝነት, እና የፒን-ምኞት ንብርብሮች. |`/v1/da/`, `FindDaPinIntent`, `[sumeragi.da]` |
|SoraFS |CAR ጥቅማጥቅሞች፣ የተጣበቁ ይዘቶች፣ የጌትዌይ ማሰባሰቢያዎች እና የማረጋገጫ-የመመለስ ፍሰቶች ይዘት-አስተናጋጅ ማከማቻ ጨርቅ። |`/v1/sorafs/`, `/sorafs/`, `FindSorafsProviderOwner` |
|SoraDNS |ለ SORA አስተናጋጅ አገልግሎቶች እና ይዘት የዲተሪሚኒስት ስም አሰጣጥ እና የመፍትሄ ሰጪ ማረጋገጫ ንብርብር። |`/v1/soradns/`, `/soradns/`, መፍትሔ ማውጫ ክስተቶች |
|አይታይ |በመተግበሪያ ደረጃ ፋይት እና የንብረት መፈፀሚያ አቋራጭ በኦሪጂናል ኤስኮር መዝገቦች የተደገፈ እንጂ በተለየ ዋና መጽሐፍ አይደለም ።|`OpenAssetEscrow`, `FindAssetEscrow*`, `EscrowEventFilter`, Kotodama `escrow_*` ሕንፃዎች |

```mermaid
flowchart LR
    app["Application or user"] --> dns["SoraDNS name resolution"]
    app --> aitai["Aitai escrow app"]
    dns --> route["Soracloud route"]
    dns --> content["SoraFS content gateway"]
    route --> ivm["Deterministic IVM service"]
    route --> inrou["Inrou hosted HTTP service"]
    aitai --> escrow["Native escrow records"]
    content --> da["DA pin intents and commitments"]
    da --> storage["SoraFS providers"]
    app --> net["SoraNet private route"]
    net --> content
    net --> route
    ledger["Iroha world state and governance"] --> dns
    ledger --> route
    ledger --> content
    ledger --> da
    escrow --> ledger
```

## የተለመዱ ፍሰቶች {#common-flows}

### አስተናጋጅ የተከፋፈለ መተግበሪያ {#hosted-split-application}

አንድ የተለመደ የተቀላቀለ አውሮፕላን መተግበሪያ ሁሉንም ቁርጥራጮች በአንድነት ይጠቀማል:

1. በ SoraFS በኩል የታሸጉ እና የተጣበቁ ቋሚ የፊት አክሲዮኖች ናቸው።
2. ለምሳሌ የህዝብ አስተናጋጅ `<app>.sora` በ SoraDNS በኩል ተመዝግቧል ።
3. Soracloud መንገዶች `/api/v1/search` ወይም `/api/v1/stream` ወደ Inrou HTTP አገልግሎት.
4. Soracloud መንገዶች `/api/auth` እና `/api/v1/user` ወደ deterministic IVM አያያዝ.
5. የግላዊነት ፍላጎት ያላቸው ደንበኞች ተመሳሳይ ይዘት ወይም API መንገድ በ SoraNet ወረዳ በኩል መድረስ ይችላሉ ።

|መንገድ |የጀርባ አውሮፕላን |ለምን ?|
| ----------------- | --------------------- | ------------------------------------------------- |
| `/`               |SoraFS ቋሚ ይዘት |ሊተላለፍ የሚችል ይዘት ሥር እና በር መሸጎጫ |
|`/assets/*` |SoraFS ቋሚ ይዘት |በይዘት ላይ የተመሠረቱ ሀብቶች እና ግልፅ ማስረጃዎች |
|`/api/auth*` |Soracloud IVM |የመልሶ ማጫወት ደህንነቱ የተጠበቀ የጽሁፍ እና የኪስ ቦርሳ ፈተና ሁኔታ |
|`/api/v1/user*` |Soracloud IVM |ለአስተዳደር የሚጠቁሙ የመንግሥት ለውጦች |
|`/api/v1/search*` |Soracloud Inrou |የቀጥታ HTTP አገልግሎት, መሸጎጫ, SSE, ወይም ሰብሳቢ  ሁኔታ|

### ይዘት ህትመት {#content-publication}

SoraFS ህትመት አንድ ስም ከመጠቆምዎ በፊት ዘላቂ ቅርሶችን ያወጣል-

1. አንድ ጠቃሚ ጭነት ወይም ማውጫ ይገንቡ.
2. ወደ CAR ማህደር ውስጥ አስቀምጥ እና ቁራጭ ዕቅድ.
3. የፒን ፖሊሲ እና የአስተዳደር መረጃዎችን ያካተተ Norito ማኒፊስት ይፍጠሩ።
4. የምዝገባ ወረቀቱን ለ Torii ማቅረብ።
5. የዒላማው መገለጫ ግልፅ ማስረጃ በሚጠይቅበት ጊዜ DA ፒን ዓላማ ወይም ተደራሽነት ግዴታ ይመዝገቡ።
6. መገለጫውን SoraDNS ስም ወይም Soracloud ቋሚ የፊት መስመር ላይ ያያይዙ።

### የግል ማጓጓዣ ወይም የዥረት መንገድ {#private-fetch-or-streaming-route}

SoraNet ከ SoraFS ወይም Soracloud ፊት ለፊት መቀመጥ ይችላል:

1. ደንበኛው ስሙን ወይም ማስታወሻውን ይፈታል.
2. አንድ ጠባቂ ማውጫ ወይም የመንገድ መመዘኛ መግቢያ እና መውጣት ሪሌዎችን ይመርጣል.
3. ትራፊክ ይሞላል እና በ SoraNet ወረዳ በኩል ይላካል.
4. የ መውጫ ትራንስፖርት ወደ SoraFS መግቢያ በር ፣ Torii ጅረት ወይም Soracloud መንገድ ይደርሳል ።

## አይታይ {#aitai}

Aitai የ SORA መተግበሪያ ኮሪደር ነው የገበያ ቅጥ ስምምነት አንድ ገዢ እና ሻጭ ከሰንሰለት ውጪ ክፍያዎችን በማስተባበር ላይ ሳለ Iroha ይቆጣጠራል በሰንሰለት ላይ ያሉ ንብረቶች ጥበቃ። ለአዳዲስ የቁጥር ንብረቶች የጥበቃ ፍሰቶች የውል ባለቤትነት ኤስሮው ሂሳብን ከመጠቀም ይልቅ የተወለደውን የኤስሮው መመሪያ ቤተሰብ መጠቀም አለበት.

ተወላጅ ዋስትና በዋናው መለያ ውስጥ ጥበቃን ይይዛል። ሻጩ `OpenAssetEscrow` የሚል ቅናሽ ይከፍታል ፣ ገዢው ከሰንሰለት ውጭ ክፍያውን `AcceptAssetEscrow` እና `MarkEscrowPaymentSent` በሚል ይቀበላል እንዲሁም ምልክት ያደርገዋል ። እና ሻጩ ክፍያ ከመታወቁ በፊት `ReleaseAssetEscrow` ይለቀቃል ወይም ይሰርዛል። ገዢው እና ሻጩ የማይስማሙ ከሆነ ሁለቱም ወገኖች ክርክር ሊከፍቱ ይችላሉ እናም በ `CanResolveEscrowDispute` የሚፈታ መፍትሄ ሰጭ የተቆለፈውን መጠን ሊከፋፈል ይችላል።

ለሙሉ የሕይወት ዑደት, አጠቃላይ የንብረቶች መቆለፊያዎች, የማይታወቁ አስክሮዎች, መጠይቆች, ክስተቶች እና Rust ምሳሌዎች, ይመልከቱ [አገር ውስጥ ንብረት አስክሮ ](/am/blockchain/escrow.md).

|የአይታይ ገጽ |ለመጠቀም|
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`                                                    |በ XOR የተሰየሙ የፍርድ ሂሳቦችን ጨምሮ ግልፅ የቁጥር ንብረት አቅርቦቶች። |
| `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`       |የተጠበቁ ቅናሾች ለገንዘብ ድጋፍ እና ለመዝጋት እንቅስቃሴዎች የማረጋገጫ ማያዣዎችን ይጠቀማሉ። |
|`OpenEscrowDispute`, `ResolveEscrowDispute`, `OpenAnonymousEscrowDispute`, `ResolveAnonymousEscrowDispute` |አለመግባባት መፍታት እና የፍርድ ቤት አሰራር። |
|`FindAssetEscrowById`, `FindAssetEscrowsBySeller`, `FindAssetEscrowsByBuyer`, `FindAssetEscrowsByStatus` |የመተግበሪያ ሁኔታ ገጾች፣ የማመቻቸት ስራዎች እና የድጋፍ መሳሪያዎች። |
|`EscrowEventFilter` |በቀጥታ ግልፅ የኤስኮር ምዝገባዎች በኤስኮው መታወቂያ, ሻጭ, ገዢ, ሁኔታ, ወይም ክስተት አይነት.|
| Kotodama `escrow_open_offer`, `escrow_accept`, `escrow_mark_payment_sent`, `escrow_release`, `escrow_cancel`, `escrow_open_dispute`, `escrow_resolve_dispute` |Kotodama የውል ጥሪዎች በ V1 ኤስሮው ሲስተምስ የተደገፉ ናቸው.|

ለህዝብ Taira ወይም Minamoto አጠቃቀም ፣ ከመስመር ውጭ የክፍያ መስመር እና ማንኛውንም ድጋፍ ወይም የፍርድ ቤት የሥራ ፍሰት እንደ ማመልከቻ ፖሊሲ ይያዙ። Iroha የጥበቃ ሁኔታን ፣ የሕይወት ዑደት ክስተቶችን ፣ የምስክር ወረቀቶችን ሃሽዎችን እና የመጨረሻውን የአክሲዮን እንቅስቃሴን ይመዘግባል ፤ በራሱ የፊያት ሂሳብ አያረጋግጥም ።

## የዒላማ አገናኝን ያረጋግጡ {#check-a-target-node}

በዚህ ገጽ ላይ ያሉትን ምሳሌዎች ከመጠቀምዎ በፊት እርስዎ በሚመሩበት ኖድ ላይ የመንገድ ቤተሰብ መኖሩን ያረጋግጡ:

```bash
export TORII_URL=https://taira.sora.org

curl -fsS "$TORII_URL/openapi.json" \
  | jq '.paths | keys[] | select(test("^/v1/(soracloud|sorafs|soradns|connect|vpn|da)/"))'

curl -fsS -H 'Accept: application/json' "$TORII_URL/status" | jq .
```

`/openapi.json` በመገለጫው የተጋለጠ ካልሆነ, `/openapi` ይሞክሩ. ትክክለኛው የመንገድ ተደራሽነት በግንባታ ባህሪዎች እና በአውታረ መረብ ውቅር ላይ የተመሠረተ ነው. ሰነዱ የህዝብ አካባቢያዊ SoraFS CID እና የታወቁ መንገዶችን አይዘረዝርም; እነዚህን መጨረሻ ነጥቦች በቀጥታ ይመልከቱ ከዚህ በታች እንደተገለጸው.

### Taira የትንባሆ ቼኮች ለንባብ ብቻ {#taira-read-only-smoke-checks}

የህዝብ Taira መጨረሻ ነጥብ ለንባብ-ጎን ምርመራዎች ጠቃሚ ነው ፣ ነገር ግን የተፈቀደ መለያ ካልተጠቀሙ እና የሕዝብ የሙከራ ኔትዌር ሁኔታን ለመለወጥ ካሰቡ በስተቀር ለውጦች ምሳሌዎች ላይ አይጠቀሙበት።

```bash
export TORII_URL=https://taira.sora.org

curl -fsS -H 'Accept: application/json' "$TORII_URL/status" \
  | jq '{version: .build.version, peers, blocks, lanes: (.teu_lane_commit | length)}'

curl -fsS "$TORII_URL/v1/connect/status" | jq '{enabled, sessions_active}'

curl -fsS "$TORII_URL/v1/vpn/profile" \
  | jq '{available, relay_endpoint, supported_exit_classes}'

curl -fsS "$TORII_URL/v1/sorafs/storage/peers?limit=4" \
  | jq '{gateway_base_url, pin_torii_urls}'

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/soracloud/status" \
  | jq '.control_plane | {service_count, services: [.services[] | {service_name, current_version}]}'
```

Taira በ OpenAPI የመንገድ ካርታ ላይ ያልተዘረዘሩትን የልውውጥ-ተኮር የቁጥጥር አውሮፕላን መስመሮችን ሊያጋልጥ ይችላል ። `/openapi` ለያዙት መስመሮች የተፈጠረውን ውል አድርገው ይይዙ ፣ ከዚያ በቀጥታ ከመሰየማቸው በፊት የልውውጥን-ተኮራ እና የህዝብ አካባቢያዊ SoraFS መስመሮችን እንደ ይገኛሉ ያረጋግጡ ።

## Soracloud {#soracloud}

Soracloud የ SORA ትግበራ መቆጣጠሪያ አውሮፕላን ነው ። የማሰማራት ጥቅሎችን ፣ የአገልግሎት ማሻሻያዎችን ፣ መስመሮችን ፣ የመተላለፊያ ሁኔታን ፣ ስልጣን ያላቸው የመዋቅር ግቤቶችን ፣ የተመሰጠረ የአገልግሎት ምስጢሮችን ፣ የሞዴል ምዝገባ መዝገቦችን ፣ የግል መደምደሚያ ክፍለ ጊዜዎችን እና የአሂድ ጊዜ ደረሰኞችን ይከታተላል ።

Soracloud ሁለት የፍጻሜ አውሮፕላኖች ይጠቀማል:

|የአፈፃፀም አውሮፕላን |የስራ ሰዓት |ለመጠቀም|
| ---------------------- | ------- | -------------------------------------------------------------------------------------------- |
|`DeterministicService` |`Ivm` |ደራሲ፣ የደብዳቤ ማስቀመጫ ሁኔታ፣ የተረጋገጠ ንባቦች፣ የታዘዙ የፖስታ ሳጥኖች አስተናጋጆች፣ ለአስተዳደር ተለዋዋጭነት |
|`HttpService` |`Inrou` |በቀጥታ HTTP APIs፣ በቅጂ ሰጭ ሥራ፣ ካሽ የተደገፉ አገልግሎቶች፣ SSE፣ በአሳሽ የታገዙ ፍሰት |

የመቆጣጠሪያው አውሮፕላን ባለስልጣን ነው ። ማሰማራት ፣ ማሻሻል ፣ ወደ ኋላ መመለስ ፣ ማዋቀር ፣ ምስጢራዊ ፣ ሞዴል እና ሁኔታ ትዕዛዞች በ Torii በኩል ያቅርቡ እና የተሰማራውን የዓለም ሁኔታ ያንብቡ; እነሱ በተለየ CLI - አካባቢያዊ መስታወት ላይ አይተማመኑም። የህዝብ መስመሮች ረጅሙ ቅድመ-እይታ ላይ የተመሰረቱ ናቸው ፣ ስለሆነም አንድ የተመዘገበ አስተናጋጅ ትራፊክን በተስተናገዱ HTTP መስመሮች እና በ Deterministic API መስመሮች መካከል ሊከፍል ይችላል ።

### የተከፋፈለ አፕሊኬሽን ማዘጋጀት {#scaffold-a-split-app}

የተከፋፈለ የመተግበሪያ አብነት ቋሚ የፊት ጫፍ እና አንድ አስተናጋጅ የቀጥታ API እና አንድ deterministic ዋልት / API አገልግሎት ይፈጥራል:

```bash
iroha app soracloud app init \
  --template split-app \
  --app-name solswap_indexer \
  --app-version 0.1.0 \
  --public-host solswap-indexer.sora \
  --output-dir ./apps/solswap-indexer

iroha app soracloud app local-plan \
  --manifest ./apps/solswap-indexer/app_manifest.json

iroha app soracloud app doctor \
  --manifest ./apps/solswap-indexer/app_manifest.json
```

`local-plan` የመንገድ ክፍፍል፣ የልጆች አገልግሎት ማሳያዎች፣ የስራ ቦታ ስክሪፕት ዱካዎች እና የሚጠበቀው የፊት-መጨረሻ ህትመት ሁነታ ይገለጻል። `doctor` እርስዎ ከማሳተፍዎ በፊት የአካባቢውን የመልቀቂያ ውል ያረጋግጣል Torii.

### የመተግበሪያውን ሁኔታ ማሰማራት እና መመርመር {#deploy-and-inspect-app-state}

```bash
export SORACLOUD_TORII_URL=https://<soracloud-enabled-torii>

iroha app soracloud app deploy \
  --manifest ./apps/solswap-indexer/app_manifest.json \
  --torii-url "$SORACLOUD_TORII_URL"

iroha app soracloud app status \
  --manifest ./apps/solswap-indexer/app_manifest.json \
  --torii-url "$SORACLOUD_TORII_URL"
```

ቀድሞውኑ ለተተገበረ አገልግሎት፣ በአገልግሎት ደረጃ የተቀመጡ ትዕዛዞችን ይጠቀሙ:

```bash
iroha app soracloud status \
  --service-name solswap_indexer_live \
  --torii-url "$SORACLOUD_TORII_URL"

iroha app soracloud rollback \
  --service-name solswap_indexer_live \
  --target-version 0.1.0 \
  --torii-url "$SORACLOUD_TORII_URL"
```

### ሚስጥራዊና ተደራሽ የሆነ ቁሳቁስ {#config-and-secret-material}

Soracloud ውቅር እና ምስጢራዊ ግቤቶች የሥልጣን ማሰማራት ሁኔታ አካል ናቸው. አስፈላጊው ውቅር ወይም ምስጢራዊ አገናኞች ሲጎድሉ ወይም ከንቃት ማሳያዎች ጋር የማይጣጣሙ ከሆነ የማሰማራት ፣ የማሻሻል እና የመመለስ ችግር ይዘጋል ።

```bash
iroha app soracloud config-set \
  --service-name solswap_indexer_live \
  --config-name indexer/public_config \
  --value-file ./config/public-config.json \
  --torii-url "$SORACLOUD_TORII_URL"

iroha app soracloud secret-set \
  --service-name solswap_indexer_live \
  --secret-name indexer/api_key \
  --secret-file ./secrets/api-key.envelope.json \
  --torii-url "$SORACLOUD_TORII_URL"
```

በመገለጫዎ የሚፈለጉትን ትክክለኛ የምስክር ወረቀት ባንዲራዎች ለማግኘት CLI ን ይጠቀሙ:

```bash
iroha app soracloud config-set --help
iroha app soracloud secret-set --help
```

## ኢንሮው {#inrou}

የኢንሮው አስተናጋጅ HTTP የተጠቀመበት የስራ ሰዓት Soracloud. አንድ Iroha የተካተተው አንጓ Soracloud የስራ ሰዓት ፕሮጀክቶች ተቀባይነት አግኝተዋል Soracloud በአካባቢያዊ ማተሚያ ዕቅድ ውስጥ ማስገባት ፣ የተመደቡትን የተስተናገዱ አገልግሎቶችን እንደ ሉፕ ባክ አገልግሎቶች ይጀምራል ፣ እና ሪፖርቶች የሂደት ሰዓት ሁኔታ ወደ ስልጣናዊ ሞዴል ይመለሳሉ.

ለቀጥታ HTTP ወለል ለሚያስፈልጋቸው የስራ ጭነቶች Inrou ን ይጠቀሙ ፣ ለምሳሌ በቅጂ-ከባድ APIs ፣ SSE ዥረቶች ፣ በማከማቻ የተደገፉ አያያዝዎች ወይም በአሳሽ የሚረዱ አገልግሎቶች።

### የስራ ሰዓት መስፈርቶች {#runtime-requirements}

- የኮንቴነር ማኒፌስት ሩጫ ጊዜ `Inrou` መሆን አለበት.
- የአገልግሎት ማሳያ አፈፃፀም አውሮፕላን `HttpService` መሆን አለበት ።
- `HttpService + Inrou` በ `/` ላይ የተጫነ በትክክል አንድ `PersistentRootLeaseVolume` ይጠይቃል ።
- የተደገፉ የ Inrou አገልግሎቶች ተለዋዋጭ የተጋራ ሁኔታን በሚጠብቁበት ጊዜም የተጋራ አገልግሎት ወይም ምስጢራዊ ኪራይ ማከማቻ ያስፈልጋቸዋል።
- የምርት ማስተናገጃ ማእከሎች እንደ ወኪል ብቻ ከመሥራት ይልቅ በእውነተኛ የ Inrou አቅም ላይ ማስታወቂያ ማቅረብ አለባቸው ።

### በግልጽ የሚታየው ቁራጭ {#manifest-fragment}

ከዚህ በታች ያለው ምሳሌ የሁለቱን መገለጫዎች ቅርፅ ያሳያል ። ይህ የተሟላ የማሰማራት ጥቅል ሳይሆን ቁራጭ ነው።

```jsonc
// container_manifest.json
{
  "schema_version": 1,
  "runtime": { "runtime": "Inrou", "value": null },
  "bundle_path": "/bundles/solswap-indexer.inrou",
  "entrypoint": "/app/bin/launch-indexer.sh",
  "args": [],
  "env": {
    "RUST_LOG": "info",
  },
  "inrou": {
    "schema_version": 1,
    "guest_os": { "guest_os": "DebianSlim", "value": null },
    "guest_images": {
      "x86_64": {
        "kernel_image_path": "/inrou/x86_64/vmlinux",
        "rootfs_image_path": "/inrou/x86_64/rootfs.ext4",
        "initrd_image_path": null,
      },
      "aarch64": {
        "kernel_image_path": "/inrou/aarch64/vmlinux",
        "rootfs_image_path": "/inrou/aarch64/rootfs.ext4",
        "initrd_image_path": null,
      },
    },
  },
  "lifecycle": {
    "start_grace_secs": 60,
    "stop_grace_secs": 30,
    "healthcheck_path": "/api/indexer/v1/health",
  },
}
```

```jsonc
// service_manifest.json
{
  "schema_version": 1,
  "service_name": "solswap_indexer_live",
  "service_version": "0.1.0",
  "execution_plane": { "execution_plane": "HttpService", "value": null },
  "replicas": 2,
  "route": {
    "host": "solswap-indexer.sora",
    "path_prefix": "/api/v1/search",
    "service_port": 8080,
    "visibility": { "visibility": "Public", "value": null },
    "tls_mode": { "tls": "Required", "value": null },
  },
  "lease_volumes": [
    {
      "volume_name": "root_disk",
      "kind": {
        "lease_volume": "PersistentRootLeaseVolume",
        "value": null,
      },
      "storage_class": { "storage_class": "Warm", "value": null },
      "mount_path": "/",
      "max_total_bytes": 8589934592,
    },
    {
      "volume_name": "index_state",
      "kind": { "lease_volume": "ServiceLeaseVolume", "value": null },
      "storage_class": { "storage_class": "Warm", "value": null },
      "mount_path": "/var/lib/solswap-indexer",
      "max_total_bytes": 1073741824,
    },
  ],
}
```

በሂደት ጊዜ እያንዳንዱ የተጫነ የኪራይ መጠን ከጅምላው ስም የሚመነጩ የአካባቢ ተለዋዋጮች አማካኝነት ይገለጻል-

```text
SORACLOUD_LEASE_VOLUME_ROOT_DISK_DIR
SORACLOUD_LEASE_VOLUME_ROOT_DISK_MOUNT_PATH
SORACLOUD_LEASE_VOLUME_INDEX_STATE_DIR
SORACLOUD_LEASE_VOLUME_INDEX_STATE_MOUNT_PATH
```

## SoraNet {#soranet}

SoraNet የግላዊነት እና የትራንስፖርት ሽፋን ነው ። በቀጥታ ከዒላማው መግቢያ በር ወይም አገልግሎት ጋር መገናኘት የሌለባቸው በትራፊክ ላይ የተመሠረቱ መንገዶችን ያቀርባል ። የትራንስፖርት ዲዛይን የመግቢያ ፣ መካከለኛ እና መውጫ ሪያል ሚናዎችን ፣ QUIC ትራንስፖርት ፣ በጩኸት ላይ የተመሠረተ ሃይብሪድ እጅ መንሻ ፣ የአቅም ድርድር ፣ የሬሌ ማውጫ ሜታዳታ እና ቋሚ መጠን ያላቸው የታሸጉ ሴሎችን ይጠቀማል ።

በ Nexus ትግበራዎች ውስጥ, SoraNet የይዘት መያዣዎችን, የጌትዌይ ትራፊክን, VPN ወይም የግንኙነት ክፍለ ጊዜዎችን እና Norito ዥረት መስመሮችን ማጓጓዝ ይችላል. የመረጃ ቋት ግቤቶች ለ `norito-stream` የሚደግፉ ሪሌዎችን ምልክት ሊያደርጉ ይችላሉ, ይህም ደንበኞች ለ Torii RPC ወይም ለዥረት ትራፊክ ተስማሚ የሆኑ መንገዶችን እንዲመርጡ ያስችላቸዋል.

### የአውታረ መረብ ውቅር {#streaming-configuration}

የ Nexus መገለጫ ለዥረት መስመሮች SoraNet አቅርቦትን ያስችላል:

```toml
[streaming]
feature_bits = 0b11

[streaming.soranet]
enabled = true
exit_multiaddr = "/dns/torii/udp/9443/quic"
padding_budget_ms = 25
access_kind = "authenticated"
provision_spool_dir = "./storage/streaming/soranet_routes"
provision_spool_max_bytes = 0
provision_window_segments = 4
provision_queue_capacity = 256
```

`access_kind = "read-only"` ን ለተመልካች ማረጋገጫ የማይጠይቁ የይዘት መስመሮች ይጠቀሙ። ወደ Torii ወይም ወደ አስተናጋጅ አገልግሎት ከመግባቱ በፊት የመውጫ ዥረት ትኬቶችን ወይም ተመልካቾችን ማንነት ማስከበር ሲኖርበት `authenticated` ን ይጠቀሙ።

### SoraNet-ማወቅ SoraFS ማምጣት {#soranet-aware-sorafs-fetch}

የ SoraFS ማምጣት CLI አንድ አካባቢያዊ ወኪል ማሳያ እና spool ማሰራጨት ይችላሉ SoraNet የአሳሽ ማራዘሚያዎች የጉዞ ሜታዳታ ወይም SDK አስማሚዎች. JSON መወሰን አለበት `local_proxy` ጋር `"emit_browser_manifest": true`, እና CLI የተሰራ መሆን አለበት `local-quic-proxy` ድጋፍ። Taira, የታዘዙትን አቅራቢዎች ካታሎግ በህዝባዊ የሙከራ ኔትወርክ ሥር ይፈትሹ ፣ ከዚያ ለዚያ አቅራቢ የተሰጠውን የተጠበቀ አቅራቢ ቱፕል ይሙሉ:

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'

: "${TAIRA_SORAFS_PROVIDER_ID:?set the admitted provider ID from Taira discovery}"
: "${TAIRA_SORAFS_GATEWAY_KEY:?set the provider gateway key}"
: "${TAIRA_SORAFS_PROVIDER_URL:?set the advertised provider base URL}"
: "${TAIRA_SORAFS_STREAM_TOKEN_FILE:?set the issued stream-token file}"

cargo run -p sorafs_orchestrator --features=local-quic-proxy --bin=sorafs_cli -- \
  fetch \
  --plan=artifacts/payload_plan.json \
  --manifest-id=<manifest-digest-hex> \
  --orchestrator-config=artifacts/orchestrator.json \
  --provider=name=taira,provider-id="$TAIRA_SORAFS_PROVIDER_ID",gateway-key="$TAIRA_SORAFS_GATEWAY_KEY",base-url="$TAIRA_SORAFS_PROVIDER_URL",stream-token="$(cat "$TAIRA_SORAFS_STREAM_TOKEN_FILE")" \
  --output=artifacts/payload.bin \
  --json-out=artifacts/fetch_summary.json \
  --local-proxy-manifest-out=artifacts/proxy_manifest.json \
  --local-proxy-mode=bridge \
  --local-proxy-norito-spool=storage/streaming/soranet_routes \
  --local-proxy-kaigi-spool=storage/streaming/soranet_routes \
  --local-proxy-kaigi-policy=authenticated \
  --max-peers=2 \
  --retry-budget=4
```

ማጠቃለያ መዝገብ አቅራቢ ሪፖርቶች, ቁርጥራጭ ደረሰኞች, አካባቢያዊ ወኪል ሜታዳታ, እና ለማምጣት ጥቅም ላይ የዋሉ ውጤታማ የመንገድ ቅንብሮች.

### የቅልጥፍና ማበረታቻ ተቆጣጣሪ ዝርዝር {#relay-incentive-verifier-roster}

የቅልጥፍና ማበረታቻ የመውሰድ ማስረጃዎችን ውድቅ ያደርገዋል ሁሉም አስፈላጊ ምርመራዎች ስኬታማ ካልሆኑ በስተቀር. `incentives.enable` እውነት ከሆነ, `incentives.trusted_verifier_ids` ቢያንስ አንድ የካኖኒካል መለያ ID ሊኖረው ይገባል. የዝርዝሩ ማበረታቻዎች የተሰናከሉ ቢሆንም እንኳ ከ 64 ግቤቶች መብለጥ የለበትም ። ሩጫው ጊዜ እንደ ተወስኖ የታቀደ ስብስብ ያስቀምጣል ፣ እና በትራንስፖርት ጅምር ወቅት ልክ ያልሆነ የዝርዝሩን ጂኦሜትሪ ውድቅ ያደርጋል ።

እያንዳንዱ `RelayBandwidthProofV1` በተወሰነ ክፈፍ/የመከፋፈል በጀት መሠረት ይገለጻል እናም ሙሉውን ክፈፍ ያጠቃልላል ። የምስክር ወረቀቱ ማረጋገጫ መለያ በተዋቀረው ዝርዝር ውስጥ መኖር አለበት ፣ እና `RelayBandwidthProofV1::verify_signature()` ተለጣፊው ከመቆለፉ ወይም የአሠራር accumulator ን ከመቀየሩ በፊት ስኬታማ መሆን አለበት ። ሬሌው የማይታመን ፊርማውን ወይም የፊርማውን ልክ ያልሆነ / የተበላሸ ማስረጃን ችላ ይላል ። እንዲህ ዓይነቱ ማስረጃ ምንም ዓይነት መለኪያ አይጨምርም እናም የማበረታቻ ቅጽበታዊ ገጽ እይታን ሊያመጣ አይችልም ።

## የመረጃ ተደራሽነት (DA) {#data-availability-da}

DA በጣም ትልቅ ፣ ለግላዊነት ስሜታዊ ወይም በቀጥታ በዓለም ሁኔታ ውስጥ ለማስቀመጥ በጣም ለአገልግሎት የተወሰነ ለሆኑ ጥቅማጥቅሞች ተደራሽነት-ማስረጃ ንብርብሮች ነው ። ይህ የዲተሪሚኒስት ግዴታዎች እና የማገገም ግዴታዎችን ይመዝግባል ስለዚህ ማረጋገጫ ሰጪዎች ፣ መግቢያ ገጾች እና ደንበኞች የትኞቹ ባይቶች የተስፋ ቃል እንደተደረጉ ፣ የትኛው ፖሊሲ የሚተገበር እና የትኞቹ ማስረጃዎች እንደተመለከቱ መስማማት ይችላሉ.

DA Kura ወይም SoraFS ን አይተካም።

- Kura የተጠናቀቁ የብሎክ ዥረት እና ስምምነት መልሶ ማግኛ ውሂብ ያስቀምጣል.
- SoraFS ይዘት-አድራሻ ባይቶች, CAR ጠቃሚ ጭነቶች, እና ማኒፌስቶዎች ይከማቻሉ እና ያገለግላል.
- DA እነዚያን ባይቶች መርሐግብር፣ ኦዲት እና ወደ መቁጠሪያው ሁኔታ እንዲመለሱ የሚያስችሏቸውን ግዴታዎች፣ የምስክርነት ፖሊሲዎች፣ የምሥክርነት ክፍተቶች እና የፒን ዓላማዎችን ይመዝግባል።

DA አፕሊኬሽን ወይም Nexus ጎዳና ከሰንሰለት ውጭ ያሉ መረጃዎች አሁንም ሊገኙ እንደሚችሉ በመጽሐፉ ውስጥ የሚታየው ቃል ሲያስፈልግ ይጠቀሙ። የተለመዱ ምሳሌዎች የመቆጣጠሪያ ፍሰቶች የጎዳና ተጠቃሚነት ግዴታዎች ፣ ለታተሙ ይዘቶች የ SoraFS ፒን ዓላማዎችን ያካትታሉ ። ለቀጣይ ማረጋገጫ መቀመጥ ያለባቸው የምስክር ወረቀት ጥቅሎች እና የማመልከቻ ዕቃዎች አጠቃላይ ሁኔታው ሙሉውን ጭነት ከመሆን ይልቅ ዲጅስት መሆን አለባቸው።

### የሕይወት ዑደት {#lifecycle}

|ደረጃ |ተመዝግቧል|
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
|ዓላማው|አንድ ትኬት, ግልፅ ማጣቀሻ, ቅጽል ስያሜ, መንገድ / ዘመን / ቅደም ተከተል አመልካች, የማቆየት ፖሊሲ, ወይም የመተግበሪያ ግብ. |
|ቁርጠኝነት |ማኒፌስት፣ የመንገድ ጭነት፣ የማረጋገጫ ጥቅል ወይም የይዘት ሥር ወደ መቁጠሪያ-የሚታይ መዝገብ የሚያገናኝ ቁሳቁስ ይዘርፉ። |
|ማስረጃዎች|ተደራሽነት ድምጾች፣ የምስክር ወረቀት ክፍት ቦታዎች፣ የአቅራቢዎች ማረጋገጫዎች ወይም በዒላማው አውታረመረብ ተቀባይነት ያላቸው ሌሎች መገለጫ-ተኮር ማስረጃዎች። |
|ጥያቄ |በ `FindDaPinIntentByTicket`, `FindDaPinIntentByManifest`, `FindDaPinIntentByAlias` ወይም `FindDaPinIntentByLaneEpochSequence` በኩል የፒን ዓላማ ፍለጋዎች።|

በ DA የተደገፈ አንድ መደበኛ የሕትመት ፍሰት:

1. ከ WSV ውጭ ያለውን ጠቃሚ ጭነት መገንባት ወይም መቀበል፣ ለምሳሌ የ SoraFS CAR ፋይል ወይም የ Nexus ጎዳና ተጠቃሚ ጭነት።
2. በ Norito መገለጫ ወይም በመንገድ-ተኮር ግዴታ መዝገብ ውስጥ የዋጋ ጭነት ይግለጹ.
3. ይህ የመንገድ ቤተሰብ ሲነቃ በ `/v1/da/*` በኩል ወይም በአውታረ መረቡ የተፈረመ የግብይት ጎዳና አማካኝነት ማኒፌስት ፣ ፒን ዓላማ ወይም ቃል ኪዳንን ያቅርቡ ።
4. ማረጋገጫ ሰጪዎች ወይም ተደራሽነት አቅራቢዎች በንቃት ማስረጃ ፖሊሲው የሚጠየቀውን ማስረጃ እንዲሰበስቡ ያድርጉ።
5. አንድ ስያሜ ከማስተዋወቅዎ በፊት የተገኘውን የፒን ዓላማ ወይም ቁርጠኝነት ይጠይቁ ፣ የፍጆታ ማስረጃ ወይም በገቢው ጭነት ላይ የሚመረኮዝ የመግቢያ መንገድ ።

### የአልጎሪዝም ሞዴል {#algorithmic-model}

DA አንድ ጠቃሚ ጭነት ወደ ተፈርሟል, እንደገና መጫወት የተጠበቀ, ብሎክ-የተመዘገበ ግዴታ ይቀይረዋል. አስፈላጊ ስልተ ቀመሮች ናቸው ስለዚህ ማረጋገጫዎች እና መግቢያዎች ከ ተመሳሳይ ባይት ተመሳሳይ ዲጀቶችን እንደገና ማስላት ይችላሉ.

1. Torii በ `(lane_id, epoch, sequence)` ፣ በጠቅላላ ጭነት ባይቶች ፣ በመጭመቂያ ሜታዳታ ፣ በክፍሉ መጠን ፣ በመሰረዝ መገለጫ የመውሰድ ጥያቄን ይቀበላል ። የማከማቻ ፖሊሲ እና የመላኪያ ፊርማ። አንጓው ሲጠየቅ gzip ፣ deflate ወይም Zstandard ጥቅማጥቅሞችን ይሰብራል ፣ ከዚያ የካኖኒካዊ ባይት ርዝመት `total_size` መሆኑን ያረጋግጣል ።
2. የመንገድ እና የክፍያ መለኪያዎችን ያረጋግጡ ። የመንገድ Nexus የመንገድ ካታሎግ ውስጥ መኖር አለበት ። `chunk_size` ሁለት ፣ ቢያንስ ሁለት ባይት ያልሆነ ኃይል ሊኖረው ይገባል ። እና ከተዋቀረው ከፍተኛ መጠን አይበልጥም። የመሰረዝ መገለጫው የውሂብ ቅንጣቶችን እና ቢያንስ ሁለት የእኩልነት ቅንጣቶችን ሊያካትት ይገባል ። የመስመሩ ካታሎግ `merkle_sha256` ወይም `kzg_bls12_381` የሆነውን የማረጋገጫ መርሃ ግብር ይመርጣል ።
3. የአውታረ መረብ ፖሊሲን ተግባራዊ ያድርጉ። ኖዱ ለብሎብ ክፍል የተቀየሰውን የመተባበር እና የማቆያ መሰረታዊ መስመር ያስገድዳል ። የህዝብ ሜታዳታ በቀጥታ ጽሑፍ ውስጥ መቆየት አለበት ፣ በመስተዳድሩ ውስጥ ከመፃፉ በፊት በመስተዳደሩ አስተዳደር ሜታዳታ ቁልፍ ብቻ የተመሰጠረ ነው ።
4. ቁርጥራጭ እና ግዴታ. የካኖኒካል ጥቅማጥቅሞች ከ `chunk_size` የተወሰደ ቋሚ መጠን ያለው መገለጫ ጋር ይከፈላሉ. Torii የክፍያ ጭነት ዲጀስት, የመረጃ ማስረጃ መልሶ ማግኛ ዛፍ ሥር እና በአንድ ቁራጭ ግዴታዎች ያሰላስላል. የውሂብ ቁርጥሮች በባይቶቻቸው ላይ BLAKE3 ግዴታዎች ይይዛሉ.
5. የመሰረዝ ግዴታዎች ይጨምሩ. ቁርጥራጮች ወደ `data_shards` ጎማዎች ይመደባሉ. የመጨረሻው ጎማ ውስጥ የጎደሉ ሴሎች ለፓሪቲ ስሌት ዜሮ የተሞሉ ናቸው. RS(16) ፓሪቲ ይፈጥራል ረድፍ/ዓለም አቀፋዊ እኩልነት ቁርጥራጮች; አማራጭ `row_parity_stripes` በመግቢያው ላይ አምድ-ቅጥ ባንድ እኩልነት ይጨምሩ. የእኩልነት ቁራጭ ግዴታዎች BLAKE3 አነስተኛ መጠን ያላቸው የ `u16` ምልክቶች ናቸው።
6. መገለጫውን ይገንቡ. `DaManifestV1` ጎዳና, ዘመን, ቅጥያ ክፍል, ኮዴክ, ጠቃሚ ጭነት ዳይጀስት, ቁራጭ ሥር, ቁራጮች መጠን, የመሰረዝ መገለጫ, የማቆየት ፖሊሲ, የኪራይ ዋጋ, ቁራጮችን ግዴታዎች, አማራጭ IPA ግዴታ, ሜታዳታ, እና እትም ጊዜ ይመዘግባል. የማከማቻ ትኬት የተወሰነ ነው: ኖዱ በመጀመሪያ በባዶ ትኬት አማካኝነት በማኒፌስት አብነት ላይ ሃሽ ያደርጋል, ከዚያ ያንን የጣት አሻራ እንደ የመጨረሻው `storage_ticket` ይጽፋል.
7. የመልሶ ማጫዎቻ ግጭቶችን ውድቅ ያድርጉ። የመልሶ የማጫዎቻ ቁልፍ `(lane_id, epoch, sequence, manifest_fingerprint)` ነው ። ተመሳሳይ የጣት አሻራ ያለው ዳግመኛ ቅጂ የማይችል ነው። የቆየ ቅደም ተከተል ወይም የተለየ የጣት ሥዕላዊ መግለጫ ያለው ተመሳሳይ ቅደም ተከተል ውድቅ ይደረጋል ።
8. የተፈረሙትን ዕቃዎች ያቅርቡ. Torii ይለካሉ PDP ቁርጠኝነት፣ ፊርማ ሀ `DaIngestReceipt`, ይገነባል `DaCommitmentRecord`, ለእነዚያ ለታዋቂዎችም (በመጽሐፉ ውስጥ) የሚጻፍ ነው ፡ ፡ PDP ተሳትፎ፣ ተሳትፎ መዝገብ፣ የተሳትፎ መርሃግብር፣ የፒን ዓላማ፣ ደረሰኝ ፋይል እና ደረሰኝ መዝገብ። የምስክር ወረቀት ካርሰር በአንድ ጊዜ በቀን አንድ ጊዜ ይቀጥላል `(lane_id, epoch)`.

የግንኙነት መዝገቦች ብሎኮች የሚሸከሙት ነገር ናቸው። አንድ መዝገብ ይያዛል፦

- ጎዳና፣ ዘመን እና ቅደም ተከተል
- የ caller blob ID እና canonical manifest ሃሽ
- የመንገድ መከላከያ ስርዓት
- ቁራጭ ሥር
- ለ KZG ጎዳናዎች አማራጭ KZG ግዴታ።
- PDP/የማረጋገጫ ማስቀመጫ
- የማከማቻ ክፍል እና ማከማቻ ትኬት
- Torii DA የምስክርነት ፊርማ

አንድ ብሎክ DA መዝገቦችን ከማካተት በፊት, የብሎክ ስብስብ መንገድ ጥቅሉን ያረጋግጣል:

- `(lane_id, epoch, sequence)` በቡድኑ ውስጥ ልዩ መሆን አለበት.
- የተገለጹት ሃሽዎች በቡድኑ ውስጥ ዜሮ ያልሆኑ እና ልዩ መሆን አለባቸው።
- የኃላፊነት ማረጋገጫ መርሃግብር ከተዋቀረው የመንገድ ፖሊሲ ጋር የሚስማማ መሆን አለበት።
- የሜርክል መስመሮች KZG ግዴታዎችን ውድቅ ያደርጋሉ; የ KZG መስመሮች ዜሮ ያልሆነ KZG ግዴታ ይጠይቃሉ።
- የፒን ዓላማዎች በመንገድ ፣ በማኒፌስት ሃሽ ፣ በማከማቻ ትኬት ፣ በባለቤት መለያ እና በስያሜ ስም-መገጣጠሚያ ደንቦች መሠረት ይገለጻሉ ።

የብሎክ ራስጌ ለ DA ማስረጃ ፖሊሲዎች ፣ ግዴታዎች እና ፒን ዓላማዎች ሃሽዎችን ያስቀምጣል ። ለአባልነት ማስረጃዎች ፣ የግዴታ ጥቅል እንዲሁ ቅጠሎቹን የሚያንፀባርቅ ሜርክል ሥርን ያሳያል ። Norito-የተለጠፉ የ `DaCommitmentRecord` እሴቶች ሃሽ ናቸው ። የወላጅ ኖዶች የግራ እና የቀኝ ልጆች ኮንኬኔሽን ሀሽ ናቸው ፣ አንድ ያልተለመደ ቅጠል ያለ ለውጥ ወደ ቀጣዩ ንብርብሮች ይነሳል ።

### ማስረጃ ማረጋገጫ {#proof-verification}

`/v1/da/commitments/prove` በአንድ ብሎክ ውስጥ ለአንድ ግዴታ ማረጋገጫ ሊያቀርብ ይችላል ። ማስረጃው ግዴታን ፣ የብሎክ ቁመት ፣ በቡድኑ ውስጥ ያለውን ኢንዴክስ ፣ የቡድኑን ሃሽ ፣ የቡድን ርዝመቱን ፣ ሜርክል ሥርን እና የወንድም መንገድን ይ containsል ። የማረጋገጫ ቁጥሮች:

1. የማረጋገጫ ጥቅል ሃሽ የብሎክ ራስጌው DA ግዴታ ሀሽ ጋር ይዛመዳል.
2. የማረጋገጫው ብሎክ ቁመት ከተጠቀሰው የብሎክ ራስጌ ጋር ይዛመዳል ።
3. መረጃ ጠቋሚው በድንበር ውስጥ ነው እናም ግዴታው በዚያ መረጃ ጠቋሜታ ላይ ያለውን የቡንዶች ዝርዝር እኩል ነው።
4. የመንገድ መከላከያ ፖሊሲው ግዴታውን ይቀበላል ።
5. ከተቀማጭ ወረቀት የወንድማማች ጎዳናውን ማጠፍ የተሰጠውን ሥር እንደገና ያድሳል ።
6. ዳግም የተገነባው ሥር የቡድን ሥር ጋር እኩል ነው።

ይህ በተወሰነ የብሎክ ጥቅማጥቅሞች ውስጥ አንድ የተወሰነ ተደራሽነት ግዴታ እንደተካተተ ያረጋግጣል; እያንዳንዱ ቅጂ በአሁኑ ጊዜ በመስመር ላይ መሆኑን አያረጋግጥም. የቀጥታ መልሶ ማግኛ በ SoraFS አቅራቢዎች ምርመራዎች ፣ PDP/PoTR ፍተሻዎች ወይም ለፕሮፋይል የተወሰኑ የእውቀት ማስረጃዎችን በመጠቀም በተናጠል ይመረመራል ።

### የስምምነት መስተጋብር {#consensus-interaction}

DA አስተማማኝ ስርጭት (RBC) አማካኝነት ከ Sumeragi ጋር ይገናኛል ፣ ግን ሁለተኛው የፍፃሜ ፕሮቶኮል አይደለም ። RBC የቀረበውን ጠቃሚ ጭነት ያሰራጫል እና ይመልሳል- አቅራቢው ለ `(height, view, payload_hash)` ክፍለ ጊዜ ፣ ለአቻ ልውውጥ ክፍሎች እና ለ `READY`/`DELIVER` ምልክቶች በቂ ማረጋገጫ ሰጪዎች ተመሳሳይ ጥቅማጥቅሞችን እንደተመለከቱ ይከታተላል።

በ Iroha 3 ውስጥ አንድ ባልደረባ በሚከተለው ጊዜ ሊገኝ የሚችለውን የተጠበቀ የብሎክ ጠቃሚ ጭነት ይቆጥረዋል-

- የአከባቢው የታገዘ ብሎክ ባይት ሃሽ ወደ የሚጠበቀው የፍጆታ ጭነት ሃሽ ይለያል ፣ ወይም
- RBC የብሎክ ሃሽ, ቁመት, እይታ, እና ጠቃሚ ጭነት ሃሽ ጋር የሚዛመድ አንድ payload መልሶ አግኝቷል.

አንዳቸውም ሁኔታዎች ካልተፈጸሙ, የጋራ መዝገቦች `missing_local_data`, በ RBC ወይም በብሎክ ማመሳሰል አማካኝነት ጠቃሚ ጭነት መልሶ ለማግኘት ይሞክራል, እና ሁኔታ እና ቴሌሜትሪ ውስጥ DA በር ሪፖርት ያደርጋል. አሁን ባለው ትግበራ ውስጥ እነዚህ DA ምልክቶች ለፍፃሜነት አማካሪ ናቸው-አንድ ብሎክ አሁንም የሚጠናቀቀው ከተመዘገበው የምስክር ወረቀት እና ከሚዛመደው አካባቢያዊ ጥቅማጥቅሞች እንጂ በተለየ የ DA ጥራዝ ምስክር ወረቀት አይደለም ።

DA የጊዜ ሰሌዳ ማግኛ መስኮቶች ያስፋፋል. DA የቁጥር ጊዜ ቆይታ ከተዋቀረው ብሎክ እና የተደራጁትን ጊዜዎች የሚመነጭ ሲሆን ከዚያ በ `sumeragi.advanced.da.quorum_timeout_multiplier`. የጊዜ ገደቡ `max(quorum_timeout, availability_timeout_floor_ms) * availability_timeout_multiplier`. ይህ ተደራሽነት የጊዜ ገደብ ከመጠናቀቁ በፊት አንጓው የፍጆታ ጭነት መልሶ ማግኘትን ይደግፋል እንዲሁም ቀደም ሲል እንደገና መወሰን ይከላከላል; ከተጠናቀቀ በኋላ መደበኛ የመልሶ ማግኛ እና የእይታ ለውጥ መንገዶች ሊቀጥሉ ይችላሉ።

### የኦፕሬተር ማስታወሻዎች {#operator-notes}

Iroha 3 የስምምነት መገለጫዎች በ RBC የተደገፈ የፍጆታ ጭነት ስርጭት ፣ የማኒፌስት መጠባበቂያዎች ፣ DA ጥቅል ማረጋገጫ እና የማገገም ቴሌሜትሪ ያካትታሉ ። የእኩዮች አብነት `[sumeragi.da]` ገደቦችን ያሳያል ለአንድ ብሎክ ግዴታዎች እና የማረጋገጫ ክፍተቶች ፣ እንዲሁም `[sumeragi.advanced.da]` የጊዜ ገደብ ማባዣዎች ለቁጥር እና ለተደራሽነት ባህሪ። እነዚህ ቅንብሮች በአንድ የአውታረ መረብ መገለጫ ውስጥ በተያያዙ ማረጋገጫ ሰጪዎች መካከል ተኳሃኝ ይሁኑ ።

የመንገድ ግኝት ለመጀመር ከአገናኙ OpenAPI ሰነድ ይጀምሩ-

```bash
curl -fsS "$TORII_URL/openapi.json" \
  | jq '.paths | keys[] | select(startswith("/v1/da/"))'
```

ይጠቀሙ [የጥያቄ ማጣቀሻ](/am/reference/queries.md#nexus-data-availability-and-packages) ለአሁኑ DA መጠይቅ ስሞች, እና [የእኩዮች ውቅር አብነት](/am/reference/peer-config/) ለአካባቢው `[sumeragi.da]` በግንባታዎ የተጋለጡ ቁርጥራጮች።

## SoraFS {#sorafs}

SoraFS ያልተማከለ ይዘት-አስተናጋጅ ማከማቻ ጨርቅ ነው. እሱ ባይቶችን በዲተሪሚኒስት ቁርጥራጮች, CAR መዝገቦች ውስጥ ያሸንፋል, እና Norito የይዘቱን ሥሮች የሚያገናኙ መገለጫዎች, የማከማቻ አቅራቢዎች ይዘትን ከማስተላለፍ በፊት አቅም እና የይዘት ተገኝነትን ያስታውሳሉ ፣ የጌትዌይ ግንባታዎችም ማኒፌሶችን እና የተወሰኑ ግዴታዎችን ያረጋግጣሉ ።

የተለመዱ SoraFS አጠቃቀሞች ቋሚ የመተግበሪያ ሀብቶችን ፣ የሰነድ ግንባታዎችን ፣ የዞን ጥቅሎችን ፣ የሞዴል ወይም የአርቴፋክት ማጣቀሻዎችን እና የአስተዳደር ማስረጃ ጥቅሎችን ያካትታሉ። የ Iroha የውሂብ ሞዴል SoraFS የጌትዌይ ክስተቶችን እና ለጋሽ ባለቤትነት መፍትሄ የ [ `FindSorafsProviderOwner`](/am/reference/queries.md#nexus-data-availability-and-packages) መጠይቅ ያሳያል ።

### Taira የሙከራ መርጃ መገለጫ {#taira-testnet-profile}

Taira የካኖኒክ የህዝብ የሙከራ ኔትወርክ ነው SoraFS። የተረጋገጠ የማረጋገጫ መገለጫው ሰንሰለት `fc56984b-2be7-431d-840e-21514d1883f0` እና ሰንሰለት ልዩነት `369` ይጠቀማል ። የታተሙት SoraFS ቅንብሮች የሚከተሉት ናቸው:

- መረብ ID: `hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94`
- የጌትዌይ መሠረት URL: `https://taira.sora.org`
- ፒን Torii URLs: ከ `https://taira-validator-1.sora.org` እስከ `https://taira-validator-4.sora.org`
- የማግኘት ችሎታዎች: `torii_gateway`, `chunk_range_fetch`, እና `potr_mldsa`
- የተለዩ ይዘት መነሻ: `https://{cid}.sorafs.taira.sora.org/{path}`
- የህዝብ ፒን ፖሊሲ: ያለፈቃድ እና ክፍያ የታገደ, `require_council_signatures = false`

```toml
[sorafs.storage]
enabled = false
max_capacity_bytes = 13743895347

[sorafs.discovery]
discovery_enabled = true
known_capabilities = ["torii_gateway", "chunk_range_fetch", "potr_mldsa"]

[sorafs.discovery.publish]
gateway_base_url = "https://taira.sora.org"
pin_torii_urls = [
  "https://taira-validator-1.sora.org",
  "https://taira-validator-2.sora.org",
  "https://taira-validator-3.sora.org",
  "https://taira-validator-4.sora.org",
]

[sorafs.gateway.untrusted_hosting]
enabled = true
path_gateway_redirect = true
redirect_html_only = true

[sorafs.gateway.untrusted_hosting.cid_host_suffixes]
taira = "sorafs.taira.sora.org"

[sorafs.repair]
enabled = false

[sorafs.gc]
enabled = false

[gov.sorafs_pin_policy]
require_council_signatures = false
```

የ Taira ማረጋገጫ ሰጪዎች SoraFS የማከማቻ ፣ የጥገና እና የቆሻሻ መጣያ መሰብሰብን ያሰናክላሉ ። የተዋቀረው አቅም አሁንም የመረጋገጫ ሰጭ አካል ሆኖ ይቆያል። የዲስክ-በጀት ፍተሻ; ይህ ማለት ማረጋገጫው የማከማቻ አቅራቢ ነው ማለት አይደለም. የሙከራ በፊት የአሁኑን የተዋቀሩ የጌትዌይ እና የፒን መዳረሻዎችን ለማንበብ `GET /v1/sorafs/storage/peers?limit=4` ይጠቀሙ።

የ `sorafs.sora.org` CID ቅደም ተከተል የቀጥታ / የምርት መገለጫ ነው ፣ Taira አይደለም ። በ Taira ማሳያዎች ፣ የመነሻ ማረጋገጫዎች ወይም በአሳሽ ሙከራዎች ውስጥ አያካትቱት። የምርት ልውውጦች የራሳቸውን የአውታረ መረብ ማንነት, አስተዳደር ቁልፎች, አቅራቢ የመግቢያ ቁሳቁስ, ፒን መጨረሻ ነጥቦች, እና አቅም / ጥገና ፖሊሲ መጠቀም አለባቸው; Taira ማረጋገጫ ወይም የመጨረሻ ነጥብ ግምቶችን ወደ ምርት ውቅር ውስጥ በጭራሽ አይገልጹም.

### የሕዝብ አካባቢያዊ CID እና የጣቢያ መግቢያዎች {#public-local-cid-and-site-gateways}

SoraFS የተፈቀደለት እያንዳንዱ Torii አንጓ እነዚህን ስም አልባ የህዝብ መስመሮች ይጫናል አማራጭ መተግበሪያው API ባይገነባም እንኳ:

|ዘዴና መጨረሻ ነጥብ |ዓላማ|
| ---------------------------------- | -------------------------------------------------------------------- |
|`GET /.well-known/sorafs/manifest` |በካኖኒካል ጥያቄ አስተናጋጅ የተመረጠውን ማኔፊስት ይመልሱ |
|`GET /v1/sorafs/cid/{cid}` |ለአንድ CID የተገደበ አካባቢያዊ ማኒፌስት ሜታዳታ እና የፋይል ማስገቢያዎችን ይመልሱ |
|`GET /sorafs/cid/{cid}` |ለአንድ አካባቢያዊ ይዘት አድራሻ ላለው ጣቢያ የስር ሰነዱን ያገለግሉ |
|`GET /sorafs/cid/{cid}/{*path}` |በዚያ CID ስር አንድ መደበኛ መንገድ ወይም አንድ የተወሰነ የባይት ክልል ያገለግሉ|

እነዚህ መስመሮች `x-sorafs-stream-token` ወይም `x-sorafs-token-id` በጭራሽ አይቀበሉም ። የሁለቱም ራስጌዎች መኖራቸው መጥፎ ጥያቄ ነው። ቀደም ሲል በአውራጃው ባለሥልጣን አካባቢያዊ መደብር ውስጥ ያለው የካኖኒካል ማኒፌስት ነው የተጠበቀ አቅራቢ CAR እና ቁርጥራጭ መስመሮች የተረጋገጡ የፕሮቶኮል ወለሎች ሆነው ይቆያሉ ።

ባይቶችን ከመነበቡ በፊት Torii የአከባቢው ማኒፌስት ካኖኒካል ኮዲንግ ፣ የሴማንቲክ ገደቦች ፣ ዲጀስት እና ሥር CID ያረጋግጣል ። ከዚያ ለማኒፌስት ፣ CID እና ለአቅራቢው ስልጣናዊ የአከባቢ አቅራቢ ማንነት ፣ የአስተዳደር እውቅና እና የተደነገገው ተገዢነት ይጠይቃል ። የጌትዌይ ተመን / እገዳ ፖሊሲ ውጤታማውን የደንበኛ አድራሻ ይጠቀማል ፣ የተላኩ አድራሻዎችን የሚያከብራው በተዋቀሩ የታመኑ ወኪሎች በኩል ብቻ ነው ። ፖሊሲ ፣ ተገዢነት ፣ ማንነት ወይም የመግቢያ ሁኔታ ከሌለ Torii ጥያቄውን ውድቅ ያደርጋል።

አንድ ጥያቄ መጨረሻ-ወደ-መጨረሻ የህዝብ መግቢያ ፍቃድ ይዟል; ለሂደቱ በሙሉ ገደቡ 64 concurrent ንባቦች ነው, ከመጠን በላይ ጥያቄዎችን በመመለስ `503 Service Unavailable` እና `Retry-After: 1`. በግልጽ የሚታዩ መልሶች በ 16 ላይ የተገደቡ ናቸው MiB, የፋይል ዝርዝሮች በነባሪነት ወደ 50 ግቤቶች እና ከፍተኛውን 500 ይመልሳሉ ፣ እና ሙሉ ፋይል ወይም ነጠላ ባይት ክልል በ 8 ይገደባል ። MiB. መጠይቅ ትንታኔ በግንባታ ላይ የተመሠረተ ነው. `app_api` build ያልተፈረመ የ32 ቢት ዲኮድ ተቀባይነት አለው `limit`, ሌሎች መጠይቅ ቁልፎችን ችላ ይላል, የመጨረሻው እንዲደጋገም ይፈቅድለታል `limit` ያሸንፋል, እና ዋጋ ወደ clamps `1..=500`. ያለ ባህሪ አነስተኛ ግንባታ `app_api` የሚቀበለው አንደኛው ብቻ ነው `limit=1..500` የማይታወቁ, ተደጋጋሚ, መቶኛ-ኮድ, ወይም ያልቻሉ ቅጾች ይክዳል. `limit=<1..500>` በግንባታዎች ውስጥ ተንቀሳቃሽ የሆነ ባህሪን ያመጣል ። CIDs, አስተናጋጆች, መስመሮች, እና ክልል ራስጌዎች በሁለቱም ግንባታዎች ውስጥ ቀኖናዊ እና ነጠላ ዋጋ አላቸው. HTML, CSS, JavaScript, SVG, XML, PDF, ወይም Wasm ይዘት ብቻ ነው የተዋቀረ CID-የተገኘ ገለልተኛ አመጣጥ (ወይም ወደዚያ የሚመራ) ፣ የተጋራ የመንገድ-ጌትዌይ አመጣጥ የማይታመን ይዘት እንዳይፈጽም ይከላከላል ።

### ማሸግ፣ መገንባትና ማስተላለፍ {#pack-build-and-submit}

የሚከተለው የዝግመተ ለውጥ ምሳሌ የተረጋገጠ Taira `NetworkId` ፣ ፒን መጨረሻ ነጥብ ፣ የማባዛት ወለል እና የአስተዳደር ፖሊሲን ይጠቀማል ። የገንዘብ ድጋፍ የተደረገለት የሙከራ ኔት መለያ እና ለአንድ ጊዜ ባለቤት ብቻ የሚሆን ቁልፍ ፋይል ይጠቀሙ። Taira ያለፍቃድ ፒኖዎችን ያለ ምክር ቤት ፊርማዎች ይፈቅዳል ፣ ግን አሁንም የሚገዛውን ክፍያ ይከፍላል።

```bash
cargo run -p sorafs_orchestrator --bin sorafs_cli -- \
  car pack \
  --input=./dist \
  --car-out=artifacts/site.car \
  --plan-out=artifacts/site.chunk-plan.json \
  --summary-out=artifacts/site.car-summary.json

: "${TAIRA_AUTHORITY:?set a funded Taira I105 account}"
export TAIRA_NETWORK_ID='hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94'
export TAIRA_PIN_TORII_URL=https://taira-validator-1.sora.org
export TAIRA_PRIVATE_KEY_FILE="${TAIRA_PRIVATE_KEY_FILE:-./secrets/taira-authority.ed25519}"
export TAIRA_RETENTION_EPOCH=$(( $(date -u +%s) + 86400 ))

cargo run -p sorafs_orchestrator --bin sorafs_cli -- \
  manifest build \
  --summary=artifacts/site.car-summary.json \
  --manifest-out=artifacts/site.manifest.to \
  --manifest-json-out=artifacts/site.manifest.json \
  --pin-min-replicas=1 \
  --pin-storage-class=warm \
  --pin-retention-epoch="$TAIRA_RETENTION_EPOCH"

cargo run -p sorafs_orchestrator --bin sorafs_cli -- \
  manifest submit \
  --manifest=artifacts/site.manifest.to \
  --chunk-plan=artifacts/site.chunk-plan.json \
  --torii-url="$TAIRA_PIN_TORII_URL" \
  --network-id="$TAIRA_NETWORK_ID" \
  --authority="$TAIRA_AUTHORITY" \
  --private-key-file="$TAIRA_PRIVATE_KEY_FILE" \
  --summary-out=artifacts/site.manifest.submit.json \
  --response-out=artifacts/site.manifest.submit.body
```

`manifest submit` `/v1/sorafs/pin/register` ያስፈልገዋል. ዒላማው ኖት መንገዱን የማይመራ ከሆነ ትዕዛዙ ይከሽፋል; የመጀመሪያው ልቀት CLI ወደ አጠቃላይ `/transaction` መጨረሻ ነጥብ አይመለስም.

### አረጋግጥና አምጣ {#verify-and-fetch}

የተጠበቀ የመውሰድ ቱፕል ለአቅራቢ-ተኮር ነው። የአቅራቢውን ID እና የታወጁትን መሠረት URL ከ Taira አቅራቢ ካታሎግ ያግኙ ፣ እና በበሩ ቁልፍን እና የዥረት ቶከንን በዚያ በኩል ያግኙ። የአቅራቢው የመግቢያ ፍሰት እነዚህ እሴቶች የማረጋገጫ-የማከማቻ ቅንብሮች አይደሉም ። የተመለከቱት Taira ማረጋገጫ ሰጪዎች የተቀረጹትን ማከማቻ አሰናክተዋል ፣ ስለሆነም ለማረጋገጫ ፒን URL ለአቅራቢ URL አይተኩ ።

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'

: "${TAIRA_SORAFS_PROVIDER_ID:?set the admitted provider ID from Taira discovery}"
: "${TAIRA_SORAFS_GATEWAY_KEY:?set the provider gateway key}"
: "${TAIRA_SORAFS_PROVIDER_URL:?set the advertised provider base URL}"
: "${TAIRA_SORAFS_STREAM_TOKEN_FILE:?set the issued stream-token file}"

cargo run -p sorafs_orchestrator --bin sorafs_cli -- \
  proof verify \
  --manifest=artifacts/site.manifest.to \
  --car=artifacts/site.car \
  --chunk-plan=artifacts/site.chunk-plan.json \
  --summary-out=artifacts/site.verify.json

cargo run -p sorafs_orchestrator --bin sorafs_cli -- \
  fetch \
  --plan=artifacts/site.chunk-plan.json \
  --manifest-id=<manifest-digest-hex> \
  --provider=name=taira,provider-id="$TAIRA_SORAFS_PROVIDER_ID",gateway-key="$TAIRA_SORAFS_GATEWAY_KEY",base-url="$TAIRA_SORAFS_PROVIDER_URL",stream-token="$(cat "$TAIRA_SORAFS_STREAM_TOKEN_FILE")" \
  --output=artifacts/site.fetch.tar \
  --json-out=artifacts/site.fetch.json
```

### የመመለሻ ማስረጃ ምርመራዎች {#proof-of-retrievability-checks}

ኦፕሬተሮች የመረጃ ማረጋገጫ ውጤቶችን መመርመር ፣ ወደ ውጭ መላክ እና ሪፖርት ማድረግ ይችላሉ ። ተግዳሮቶች በኔትወርኩ የማረጋገጫ ቧንቧ የተዘረዘሩ ናቸው; CLI ውጤቶቻቸውን ያስወጣል ።

```bash
cargo run -p sorafs_orchestrator --bin sorafs_cli -- \
  por status \
  --torii-url="$TAIRA_PIN_TORII_URL" \
  --manifest=<manifest-digest-hex> \
  --status=failed \
  --limit=20

cargo run -p sorafs_orchestrator --bin sorafs_cli -- \
  por report \
  --torii-url="$TAIRA_PIN_TORII_URL" \
  --week=<YYYY-Www> \
  --format=json
```

## SoraDNS {#soradns}

SoraDNS ለ SORA አገልግሎቶች እና ይዘት የተወሰነ ስያሜ ንብርብር ነው ። ስሞችን መደበኛ ያደርገዋል ፣ በ Iroha ውስጥ የመፍትሄ ሰጪ ማውጫ ዝመናዎችን ያቀርባል ፣ እና በ SoraFS በኩል የተፈረሙ የዞን ወይም የመፍትሄ ሰጪ ቡድኖችን ያሰራጫል። የመፍትሔ ሰጪዎች እና መግቢያ ገጾች የመፍትሄ ማስረጃ ማረጋገጫ ሰነዶችን ከማመንዎ በፊት ይፈትሻሉ።

ለአሳሽ መዳረሻ SoraDNS የጌትዌይ አስተናጋጆችን ከተመዘገበ FQDN ያመነጫል ። የተመዘገበው የከንቱነት አስተናጋጅ ቀኖናዊ የመተግበሪያ መነሻ ሆኖ ይቆያል ፣ የተሰማሩ የጌትዎይ መገለጫዎች ለዚያ መነሻ የአሳሽ እና Torii ወደ ኋላ የሚመለሱ መንገዶችን ያሳያሉ።

### አስተናጋጅ ቅጾች {#host-forms}

|ቅጽ |ምሳሌ|ዓላማ|
| --- | --- | --- |
|የከንቱነት አመጣጥ|`https://<fqdn>/<path>` |ካኖኒካዊ መተግበሪያ URL በምናፊስት እና በመልቀቂያ ማስታወሻዎች ውስጥ ተመዝግቧል |
|Taira አሳሽ መግቢያ |`https://<fqdn>.mon.taira.sora.net/<path>` |ንቁ ስያሜ ለማግኘት የህዝብ አሳሽ መግቢያ በር |
|Torii ወደ ኋላ መንገድ |`https://taira.sora.org/soradns/<fqdn>/<path>` |Torii ንቁ ቅጽል ስያሜ ለማግኘት የቦክስ እና ወደ ኋላ መንገድ |
|የካኖኒካል ሃሽ ጌትዌይ |`<base32(blake3(name))>.gw.sora.id` |የፍተሻ በር ማንነት እና GAR ማረጋገጫ |

የ `/soradns/<alias>/...` fallback የህዝብ ተመራጭ አይደለም URL. የመሣሪያ, የመተግበሪያ መገለጫዎች, እና የፊት-መጨረሻ ውቅር የከንቱነት አስተናጋጅ ራሱ ይመርጣሉ. አንድ ስያሜ በ Taira ላይ ንቁ ካልሆነ የአሳሽ መግቢያ በር ወይም ወደኋላ የመመለስ መንገድ ከመተግበሪያው መስመራዊነት ከመጀመሩ በፊት `404` ሊመለስ ወይም TLS ሊያሰናከል ይችላል።

### የጌትዌይ አስተናጋጆች {#derive-gateway-hosts}

```ts
import {
  deriveSoradnsGatewayHosts,
  hostPatternsCoverDerivedHosts,
} from '@iroha/iroha-js'

const derived = deriveSoradnsGatewayHosts('docs.sora')
console.log(derived.canonicalHost)
console.log(derived.prettyHost)

const taira = deriveSoradnsGatewayHosts('solswap-indexer.sora', {
  prettySuffix: 'mon.taira.sora.net',
})
console.log(taira.prettyHost)

const patterns = [
  derived.canonicalHost,
  derived.canonicalWildcard,
  derived.prettyHost,
]
console.log(hostPatternsCoverDerivedHosts(patterns, derived))
```

GAR ጥቅማጥቅሞች የካኖኒካል ሃሽ አስተናጋጅ, የካኖኒካል ካርድ, እና የተመረጡ ቆንጆ አስተናጋጁ መሸፈን አለባቸው.

### አንድ Resolver ማውጫ ቅጽበታዊ ገጽ እይታ ያግኙ {#fetch-a-resolver-directory-snapshot}

```bash
curl -i "$TORII_URL/v1/soradns/directory/latest"

soradns_resolver directory fetch \
  --record-url "$TORII_URL/v1/soradns/directory/latest" \
  --directory-url https://gateway.example.org/soradns/directory/latest.car \
  --output ./state/soradns-directory

soradns_resolver rad verify \
  --rad ./state/soradns-directory/rad/resolver-a.norito
```

የጌትዌይዎች የመፍትሄ ሰጪ ማረጋገጫ ሰነዱ የጎደለው ፣ ጊዜው ያለፈበት ፣ ያልተፈረመ ወይም በአዲሱ ማውጫ Merkle root ውስጥ ያልተመሰረተው ተሟጋቾችን መቃወም አለባቸው። እስካሁን ምንም ዓይነት የመፍትሔ ሰጪ ማውጫ ባልተለጠፈበት አውታረመረብ ላይ `/v1/soradns/directory/latest` መንገዱን ቢያበራም `404` ሊመልስ ይችላል።

### የህዝብ DNS ተልዕኮ {#public-dns-delegation}

SoraDNS አስተናጋጅ ማመንጨት መደበኛ የበይነመረብ DNS ውክልናን አይተካም። አንድ የህዝብ DNS ስም ወደ SoraDNS መግቢያ በር የሚያመለክት ከሆነ:

- ለ ንዑስ ጎራዎች፣ ለተመረጠው ውብ አስተናጋጅ CNAME ይለጥፉ።
- ለከፍተኛ ስሞች ALIAS/ANAME ወይም A/AAAA መዝገቦችን በ gateway anycast IPs ውስጥ ይጠቀሙ።
- ለ GAR ፍተሻዎች ቀኖናዊውን ሃሽ አስተናጋጅ በ SoraDNS የጌትዌይ ጎራ ስር ያስቀምጡ

## FHE እና UAID {#fhe-and-uaid}

ለ Nexus አገልግሎቶች የሚገኙት ከ FHE ጋር የተያያዙ ቦታዎች የሚከተሉትን ያካትታሉ:

- `iroha_crypto::fhe_bfv` ለስካላር ምስጢራዊ ጽሑፍ ግምገማ የ deterministic BFV ድጋፍን ይተግብራል ። የመለየት ጥራት `BfvIdentifierPublicParameters` እና `BfvIdentifierCiphertext` ን ይጠቀማል ፣ እዚያም ክፍተት 0 የመግቢያ ባይት ርዝመት የሚከማች ሲሆን በኋላ ላይ ክፍተቶች እያንዳንዳቸው አንድ የተመሰጠረ ባይት ያስቀምጣሉ ።
- Soracloud የስቴት እና የስራ መርሃግብሮች ሞዴል FHE በመንግስት አስተዳደር የሚተዳደሩ ፓራሜትር ስብስቦች ፣ የማስፈፀም ፖሊሲዎች ፣ የኮምፒተር ጽሑፍ ግዴታዎች ፣ የጥያቄ ፖስታዎች እና የመግለጫ ጥያቄዎችን ያካተቱ የቁልፍ ጽሑፍ ሥራ ጭነቶች።

የ BFV መታወቂያ መንገድ ግላዊነትን ለመጠበቅ ምዝገባ ጥቅም ላይ ይውላል. አንድ ደንበኛ የተመሰጠረ መታወቂያ ወደ Torii መፍትሔ ማቅረብ ይችላሉ. መፍትሄው ይገመግማል በአክቲቭ መታወቂያ ፖሊሲው መሠረት `OpaqueAccountId` ይወጣል እንዲሁም ደረሰኝ ያወጣል። `ClaimIdentifier` ከዚያ ያንን ደረሰኝ ከዒላማ ሂሳብ ጋር የተያያዘውን UAID ያገናኛል.

የ UAID የውሂብ ሞዴሉ ውስጥ፣ `UniversalAccountId` በሃሽ የተደገፈ እና እንደ ይታያል `uaid:<hash>`. የፓርሰሮች ተቀባይነት ሁለቱም `uaid:<hash>` ወይም ጥሬ የሆነው የ64 ሄክሰርስ ዲጀስት። `Account` እና `NewAccount` አማራጭ ይጨምሩ `uaid` እና `opaque_ids` መስኮች. የስራ ሰዓት ምዝገባ አንድ-ወደ-አንድ UAID-ከሂሳብ ወደ ሂሳብ መረጃ ጠቋሚ፣ ተደጋጋሚ ወይም የሚጋጩ ግልጽ ያልሆኑ መታወቂያዎችን ይክዳል፣ እና ያለ ግልጽ ያልሆኑ UAID. አንድ ጊዜ UAID የሂሳብ አስገዳጅነት ለውጦች, ሩጫ ጊዜ እንደገና ይገነባል ቦታ ማውጫ የውሂብ ጎታ አስገዳጅነቶች በዚያ UAID.

የቦታ ማውጫ UAID ላይ የማያያዝ ችሎታዎች ይገልጻል. አንድ `AssetPermissionManifest` የ UAID, የውሂብ ቦታ, ንቅናቄ እና አማራጭ ማብቂያ ዘመን ስሞች ይሰጣሉ, እና የመረጃ ቦታ, ፕሮግራም, ዘዴ, ንብረት, እና AMX ሚና የተዘረዘሩ መፍቀድ / ውድቅ ግቤቶችን ያስቀምጣል. . ግምገማ ውድቅ-ማሸነፍ ነው: የመጀመሪያው ተዛማጅ ውድቅ ጥያቄውን ውድቅ ያደርገዋል, አለበለዚያ የመጨረሻው ተዛማጅ ፍቃድ እጩ ከማንኛውም መጠን ገደብ ጋር ይመረምራል. እነዚህን ማኒፊስቶች ማተም, ማጠናቀቅ እና መሰረዝ በ `CanPublishSpaceDirectoryManifest` የተጠበቀ ነው.

ለ Soracloud FHE ሁኔታ የተተገበሩ ስርዓቶች የሚከተሉት ናቸው:

|መርሃ ግብር|ምን ይቆጣጠራል?|
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
|`SoraStateBindingV1` ከ `FheCiphertext` ጋር |አንድ የስቴት ቁልፍ ቅድመ እሴት FHE ምስጠራ ጽሑፎች እንደሆኑ ይገልጻል.|
|`FheParamSetV1` |ስያሜዎች መርሃግብር, የጀርባ ጫፍ, ሞዱል ሰንሰለት, ፖሊኖሚያል ዲግሪ, ክፍተቶች ብዛት, የደህንነት ግብ, የሕይወት ዑደት, እና ልኬቶች |
|`FheExecutionPolicyV1` |የቁልፍ ጽሑፍ መጠን, ቀላል ጽሑፍ መጠን, የመግቢያ / ውፅዓት ብዛት, የማባዛት ጥልቀት, ማሽከርከሪያዎች, bootstraps, እና ክብ ሁነታ ገደቦች. |
|`FheGovernanceBundleV1` |ተቀባይነት ማረጋገጫ ለማግኘት አንድ ማስፈፀሚያ ፖሊሲ ጋር አንድ መለኪያ ቅንብር. |
|`FheJobSpecV1` |`Add`, `Multiply`, `RotateLeft` ወይም `Bootstrap` በ ciphertext ሁኔታ ቁልፎች እና ግዴታዎች ላይ የሚሰሩትን ሥራ ይገልጻል። |
|`CiphertextQuerySpecV1` |መጠይቆች በሲቪል ፣ በማያያዝ ፣ በመቁልፍ ቅድመ-ፊደል ፣ በውጤት ገደብ ፣ በሜታዳታ ደረጃ እና አማራጭ የማካተት ማረጋገጫ ብቻ ናቸው ። |
|`DecryptionRequestV1` |በዲክሪፕሽን ባለሥልጣን ፖሊሲ መሠረት ለአንድ የኮምፒተር ጽሑፍ ግዴታ ግልፅነትን ይጠይቃል። |

`FheJobSpecV1::validate_for_execution` የስራ፣ የአፈፃፀም ፖሊሲ እና የፓራሜትር ስብስብ ከመግባቱ በፊት ይስማማሉ የሚለውን ያረጋግጣል። በተጨማሪም ለአሠራር የተወሰኑ ደንቦችን ያስገድዳል፦ ማከልና ማባዛት ቢያንስ ሁለት ግብዓቶች ያስፈልጋቸዋል፤ rotate እና bootstrap በትክክል አንድ ግብዓት ያስፈልጋቸዋል, እና የተጠየቀው ጥልቀት, የሽግግር ብዛት, የመነሻ ቁጥር, የመግቢያ ብዛት, ጠቃሚ ጭነት ባይቶች, እና ውስን የውጤት መጠን በፖሊሲ ገደቦች ውስጥ መቆየት አለበት.

UAID የቁልፍ ጽሑፍ አይደለም እና እራሱም ፖሊሲው አይደለም FHE ። ሂሳቡን ለማግኘት ጥቅም ላይ የሚውለው የተረጋጋ የመለያ አቅም መልህቅ ፣ ግልጽ ያልሆኑ የማጣሪያ የይገባኛል ጥያቄዎች እና የአገልግሎት ወይም የውሂብ ቦታ ፍሰት የሚያፀድቁ የቦታ ማውጫ ትስስርዎች ናቸው ። FHE መርሃግብሮች በፓራሜትር ስብስቦች ፣ በመፈፀም ፖሊሲዎች ፣ በ ciphertext ግዴታዎች እና በዲክሪፕት ባለስልጣን ፖሊሲዎች አማካኝነት የተመሰጠረ ጥቅማጥቅሞችን ለመቀበል እና ለማስፈጸም በተናጠል ይቆጣጠራሉ ።

ተዛማጅ Torii ወለሎች የሚከተሉትን ያካትታሉ:

- `/v1/identifier-policies`
- `/v1/identifiers/resolve`
- `/v1/accounts/{account_id}/identifiers/claim-receipt`
- `/v1/identifiers/receipts/{receipt_hash}`
- `/v1/accounts/{uaid}/portfolio`
- `/v1/space-directory/uaids/{uaid}`
- `/v1/space-directory/uaids/{uaid}/manifests`
- `/v1/soracloud/model/run-private`
- `/v1/soracloud/model/run-private/finalize`
- `/v1/soracloud/model/decrypt-output`

የህዝብ ሜታዳታ ወሰን በሥርዓቶቹ ውስጥ ግልፅ ነው: UAID አገናኞች, ግልጽ ያልሆኑ መታወቂያ መዝገቦች, መገለጫ የሕይወት ዑደት, የስቴት ቁልፍ ማጣቀሻዎች, የ ciphertext መጠኖች, የ Ciphertext ግዴታዎች, የፖሊሲ ስሞች, ለፓራሜትር የተቀመጡ ስሪቶች, የሥራ አፈፃፀም, የውጤት ሁኔታ ቁልፎች, እና የመግለጫ ጥያቄ ሜታዳታ ሊታይ ይችላል ። የማጣቀሻ ቀላል ጽሑፎች ፣ የተከፈተው ሁኔታ ፣ የሞዴል ግብዓት እና ውፅዓት ፣ እና FHE ምስጢራዊ ቁልፎች ከእነዚህ የህዝብ መጠይቅ መዝገቦች ውጭ ናቸው ።

## የስራ ፍተሻ ዝርዝር {#operational-checklist}

- በዒላማው Torii አንጓ ላይ `/openapi` ጋር የተፈጠሩትን የአገልግሎት ቤተሰቦች ያረጋግጡ ፣ እና የህዝብ አካባቢያዊ SoraFS CID እና በደንብ የታወቁ መንገዶችን በቀጥታ ይመርምሩ።
- የ Soracloud ማሰማራት መገለጫዎች ፣ SoraFS መገለጫዎችን ፣ SoraDNS መፍትሄ ማውጫ መዝገቦችን ፣ SoraNet ተለጣፊ ማውጫ መዝገብን እና DA ፒን ዓላማዎችን ወይም ተገኝነት ግዴታዎችን እንደ አስተዳደር-ስሜታዊ ቅርሶች ይይዙ።
- ተመሳሳይ SORA Nexus መገለጫን በአንድ አውታረመረብ ውስጥ በተለያዩ ማረጋገጫ ሰጪዎች ላይ በቋሚነት ይጠቀሙ።
- በ ad hoc node-local paths ላይ ከመተማመን ይልቅ Inrou ሥር እና የተጋሩ የኪራይ መጠኖችን በመግለጫዎች ውስጥ ያቆዩ.
- የይዘት ስያሜዎችን ከማስተዋወቅዎ በፊት SoraFS ማስረጃ ማረጋገጫ ይጠቀሙ።
- ተቆጣጣሪ SoraNet የእጅ መጨናነቅ ውድቀቶች፣ DA የቁጥር ገደብ ወይም ተደራሽነት ጊዜያት፣ SoraFS የጌትዌይ ውድቀቶች፣ SoraDNS RAD ትኩስነት እና Soracloud የጤና አገልግሎት.
- ለህዝብ የሙከራ አውታረመረብ አጠቃቀም የ Taira መገለጫ ይጠቀሙ እና ከ [ ጋር ይጀምሩ ወደ SORA Nexus የውሂብ ጎራዎች ይገናኙ](/am/get-started/sora-nexus-dataspaces.md).

በተጨማሪም ተመልከት።

- [Torii መጨረሻ ነጥቦች](/am/reference/torii-endpoints.md)
- [የመረጃ ክስተት ማጣሪያዎች ](/am/blockchain/filters.md#data-event-filters)
- [መጠይቅ ማጣቀሻ ](/am/reference/queries.md#nexus-data-availability-and-packages)
- [ቀናተኛ Taira ማረጋገጫ ኮንፊግሬሽን በተጣበቀ ኮሚቴ ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/configs/soranexus/taira/config.toml)
