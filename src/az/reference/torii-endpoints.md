---
translation_locale: az
translation_source: /reference/torii-endpoints.md
translation_source_hash: 9bec41b1b419e252fdcff8328e7950a294bdad3ac40112a5a7f2ce451d19e9cb
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Torii Son nöqtələr {#torii-endpoints}

Torii Bu HTTP, SSE, və WebSocket qapı Iroha 3. Bu, hər iki kitabçaya yönəlmiş xidmət edir APIs və operatorun son nöqtələri.

Mövcud protokol qaydaları aşağıdakılardır:

- kanonik ikili format Norito dir.
- JSON göndərdiyiniz zaman bir çox uç nöqtəsi də `Accept: application/json` dəstəkləyir
- Metriklər Prometheus formatında təqdim olunur.

Format ətraflı məlumatları, məzmun danışıqları, düzənlik bayraqları, sxem haşları və Norito RPC rəhbərliyi üçün [Norito istinadına baxın ](/az/reference/norito.md).

## Ümumi məqsədlər {#common-endpoints}

|Son nöqtə |Format |Məqsəd|
| --- | --- | --- |
|`POST /transaction` |Norito |İmzalanmış bir əməliyyat təqdim edin |
|`POST /query` |Norito |İmzalanmış sorğu göndərin |
|`GET /events` |WebSocket |Tədbir axınlarına abunə olun |
|`GET /block/stream` |WebSocket |Əlaqə bağlanmış bloklar axın |
|`GET /peers` |JSON |Torii tərəfindən məruzə edilən rəfiqə siyahısı |
|`GET /health` |JSON |Yüngül ömrü son nöqtəsi |
|`GET /api_version` |JSON |API standart versiyası |
|`GET /status` |JSON |Operatorlar üçün yüksək səviyyəli status ümumiləşdirilməsi |
|`GET /metrics` |Prometheus |Prometheus scrape endpoint |
|`GET /schema` |JSON |Nodu tərəfindən xidmət edilən məlumat model sxeminin sürətli görüntüsü |
|`GET /openapi` və ya `GET /openapi.json` |JSON |Aktiv Torii HTTP yolları üçün OpenAPI sənədi |
|`GET /v1/parameters` |JSON |Qeydiyyat parametrləri görüntüsü |
|`GET /v1/node/capabilities` |JSON |Node qabiliyyəti və məlumat modelinin metadataları |
|`GET /v1/api/versions` |JSON |Dəstəklənən Torii API versiyaları |
|`GET /v1/events/sse` |SSE |Uzunmüddətli müştərilər üçün tədbir axını |
|`GET /v1/time/now` |JSON |Nodu divar saatı snapshot |
|`GET /v1/time/status` |JSON |Vaxt sinxronizasiyasının vəziyyəti |

`/openapi` İdarə olunan bir düyün üçün etibarlı son nöqtələr siyahısıdır. qurma xüsusiyyətləri və icra vaxt konfigüratsiyası, belə ki, yaradılmış müştərilər canlı OpenAPI İstifadəçidən istifadə edin. [Torii API konsol](/az/reference/torii-api-console.md) Bu canlı sənədi yükləmək üçün test JSON marşrutlar, nüsxə curl tələblər, və mövcud sxemdən müştəri kodu yaratmaq.

## Canlı Taira Yolları sınayın. {#try-live-taira-routes}

İctimai Taira testnet tətbiq müştərilərinin yalnız oxumaq üçün istifadə etdiyi eyni Torii JSON səthini aşkar edir. Bu əmrlərə açar tələb olunmur:

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

Müasir dünya vəziyyəti ilə müqayisədə mənbə oxumağa çalışın:

```bash
curl -fsS "$TAIRA_ROOT/v1/domains?limit=5" \
  | jq -r '.items[].id'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=5" \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

İctimai testnet marşrutu `502` qaytarırsa, vaxt çıxırsa və ya doymuş bir sıra bildirirsə, onu son nöqtənin mövcudluğu problemi kimi qəbul edin və müştəri kodunuzu səhv salmadan əvvəl daha sonra yenidən cəhd edin.

## Konsensus və Runtime Son nöqtələri {#consensus-and-runtime-endpoints}

|Son nöqtə |Format |Məqsəd|
| --- | --- | --- |
|`GET /v1/sumeragi/commit-certificates` |JSON |Sonuncu öhdəlik sertifikatlarının ümumiləşdirilməsi |
|`GET /v1/sumeragi/validator-sets` |JSON |Validator tarixini təyin edir |
|`GET /v1/sumeragi/validator-sets/{height}` |JSON |Validator blok hündürlüyündə təyin edilmişdir |
|`GET /v1/sumeragi/status` |Norito və ya JSON |Konsensus vəziyyətinin dəqiq görüntüsü |
|`GET /v1/sumeragi/status/sse` |SSE |Davamlı konsensus vəziyyət axını |
|`GET /v1/sumeragi/leader` |JSON |Hələlik lider məlumatları |
|`GET /v1/sumeragi/qc` |Norito və ya JSON |Ən son quorum sertifikatı ümumiləşdirilməsi |
|`GET /v1/sumeragi/checkpoints` |JSON |Konsensus yoxlama məntəqələrinin ümumiləşdirilməsi |
|`GET /v1/sumeragi/consensus-keys` |JSON |Aktiv konsensus açarları |
|`GET /v1/sumeragi/bls_keys` |JSON |Aktiv BLS konsensus açarları |
|`GET /v1/sumeragi/phases` |JSON |Ən son mərhələli gecikmə nümunəsi |
|`GET /v1/sumeragi/rbc` |JSON |RBC sessiya və keçid ölçüləri |
|`GET /v1/sumeragi/rbc/sessions` |JSON |Aktiv RBC iclası görüntüsü |
|`GET /v1/sumeragi/pacemaker` |JSON |Pacemaker statusu |
|`GET /v1/sumeragi/params` |JSON |Hələlik zəncirdəki Sumeragi parametrləri |
|`GET /v1/sumeragi/collectors` |JSON |Deterministik kollektor planı görüntüsü |
|`GET /v1/sumeragi/key-lifecycle` |JSON |Konsensus əsas həyat dövrü statusu |
|`GET /v1/sumeragi/telemetry` |JSON |Konsensus telemetriyası sürətli görüntüsü |
|`GET /v1/sumeragi/evidence` |JSON |Ədalət qeydləri, istintaq silsiləsi ilə filtrlənir |
|`GET /v1/sumeragi/evidence/count` |JSON |Əldə edilən sübutların sayı|
|`POST /v1/sumeragi/evidence/submit` |JSON |Konsensus üçün sübutlar təqdim edin |
|`GET /v1/sumeragi/commit_qc/{hash}` |Norito və ya JSON |Bir blok hash üçün QC qeydini bağlayın |
|`GET /v1/runtime/abi/active` |JSON |Aktiv işləmə vaxtı ABI təsvirçisi |
|`GET /v1/runtime/abi/hash` |JSON |Aktiv işləmə vaxtı ABI hash |
|`GET /v1/runtime/metrics` |JSON |İndirmə vaxtı ölçülərinin sürətli görüntüsü|
|`GET /v1/runtime/upgrades` |JSON |İndirmə vaxtının yenilənməsi siyahısı |
|`POST /v1/runtime/upgrades/propose` |JSON |Döyüş vaxtının təkmilləşdirilməsini təklif edin|
|`POST /v1/runtime/upgrades/activate/{id}` |JSON |Təqdim olunan icra vaxtının təkmilləşdirilməsini aktivləşdirin |
|`POST /v1/runtime/upgrades/cancel/{id}` |JSON |Tələb olunan icra vaxtının yenilənməsini ləğv edin |

## App və SORA marşrut ailələri {#app-and-sora-route-families}

Torii tətbiqetmə ilə üzləşən xüsusiyyətlər toplusu ilə qurulduqda, kəşfçilər üçün əlavə JSON ailələrini, SORA xidmətlərini, körpü axınlarını, sübutları və saxlamalarını aşkar edir. Bu ailələrin hamısı hər bir şəbəkə profilində aktiv deyil.

|Yol ailəsi |Məqsəd|
| --- | --- |
|`/v1/accounts/*`, `/v1/domains/*`, `/v1/assets/*` |JSON oxumaq, sorğu köməkçisi, onboarding köməkçisi və portfel və ya sahibinin görünüşləri |
|`/v1/nfts/*`, `/v1/rwas/*`, `/v1/confidential/*` |NFT, real dünya aktivləri və məxfi aktivlər baxışları |
|`/v1/aliases/*`, `/v1/assets/aliases/*`, `/v1/sns/*`, `/v1/identifiers/*` |Ad, alias və identifikator qətnaməsi |
|`/v1/explorer/*` |Explorer-ə yönəlmiş hesab, aktiv, blok, əməliyyat, təlimat, metrik və axın görünüşləri |
|`/v1/transactions/*`, `/v1/pipeline/*`, `/v1/iso20022/*` |Əməliyyat tarixçəsi, boru kəmərinin bərpası və ya vəziyyəti və ISO 20022 köməkçisi |
|`/v1/contracts/*` |Müqavilə kodu, yerləşdirmə, paket, zəng, görünüş, hadisə, fəaliyyət, rollup və dövlət yolları |
|`/v1/multisig/*`, `/v1/controls/*` |Multisig təklifləri, təsdiqləri və köçürmə nəzarətində köməkçiləri |
|`/v1/bridge/*`, `/v1/ledger/*`, `/v1/proofs/*` |Nəticə, dövlət sübutu, blok sübutü, sübut saxlama və sübut sorğusunun yolları |
|`/v1/da/*` |Məlumatların mövcudluğu, manifestlər, sübut siyasətləri, öhdəliklər və niyyətlər |
|`/v1/zk/*` |ZK kökləri, sübut yoxlamaları, IVM sübutları, səslərin sayılması, sübut açarları, sübut qeydləri və əlavələr |
|`/v1/gov/*`, `/v1/ministry/*` |İdarəetmə təklifləri, səsvermələr, şura dövləti, qorunan ad sahələri, gündəlik təklifləri, qanunvericilik və yekunlaşdırma. |
|`/v1/nexus/*`, `/v1/sccp/*` |Nexus yol, məlumat sahəsi və çarşı silsilə sübut köməkçiləri |
|`/v1/musubi/*` |Musubi paketlər qeydiyyatı oxucuları və təlimat qurucuları |
|`/v1/subscriptions/*` |Abunə planları, abunə həyat dövrü, istifadə və ödəmə köməkçiləri |
|`/v1/sorafs/*`, `/sorafs/*`, `/.well-known/sorafs/*` |SoraFS təchizatçı kəşfi, məhdudluq sübutları, pinning, saxlama və ictimai məzmun xidmətləri |
|`/v1/soracloud/*`, `/v1/soradns/*`, `/soradns/*`, `/api/*` |SoraCloud xidmət həyat dövrü, özəl hesablama/model axınları, ictimai kəşfiyyat və ev sahibliyi edilən tətbiqlərin yönləndirməsi |
|`/v1/connect/*`, `/v1/vpn/*` |Iroha Qoşulma seansları, WebSocket nəqliyyatı, VPN seansları, profilləri və rəsmlər |
|`/v1/app-api/*`, `/v1/api/*`, `/v1/content/*` |App API bağlamaları və paket / CID dəstəklənən məzmun yönləndirmələri |
|`/v1/operator/*`, `/v1/mcp` |Operatorun təsdiqlənməsi və yerli MCP JSON-RPC körpüsü |
|`/v1/offline/*`, `/v1/repo/*`, `/v1/space-directory/*`, `/v1/ram-lfe/*` |Offline hazırlıq, saxlama müqavilələri, məlumat sahəsi manifestləri və [RAM-LFE köməkçiləri ](/az/blockchain/ram-lfe.md#torii-routes) |
|`/v1/kaigi/*`, `/v1/webhooks/*`, `/v1/notify/*`, `/v1/telemetry/*` |Əməkdaşlıq, webhook, push bildirişləri və canlı telemetri inteqrasiyaları |

## ISO 20022 Köprü {#iso-20022-bridge}

Torii tətbiqə baxan API və körpünün işləmə vaxtı aktivləşdirildiyi zaman ISO 20022 köprüsünü `/v1/iso20022/*` altında aşkar edir. Köprü məqsədəuyğun olaraq məhdudlaşdırılmışdır: Bu, ümumi məqsədli ISO 20022 clearing gateway deyil, seçilmiş ödəniş mesajlarının imzalanmış Iroha ötürülmələrinə çevrilməsi və kitabın statusunu izləmək üçün dəstəklənən bir alt dəstdir.

### Torii ISO 20022 Son nöqtələr {#torii-iso-20022-endpoints}

|Metod və son nöqtə |Məqsəd|
| --- | --- |
|`POST /v1/iso20022/pacs008` |FI-dən FI müştəri kreditinin ötürülməsini təqdim etmək və uyğunlaşdırılmış Iroha aktivin ötürülməsi qurmaq |
|`POST /v1/iso20022/pacs009` | Bir təqdim edin FI-Yaxşı.FI kredit köçürülməsi üçün istifadə olunur PvP və ya qiymətli kağızlarla əlaqəli nakit maliyyələşdirmə |
|`POST /v1/iso20022/pacs002` |Ödəniş vəziyyətinin hesabatını təqdim edin |
|`POST /v1/iso20022/pacs004` |Ödəniş ödənilməsi haqqında məlumat təqdim edin|
|`POST /v1/iso20022/camt056` |Ödənişlərin ləğv edilməsi üçün müraciət etmək |
|`POST /v1/iso20022/sese023` |Qiymətli kağızların hesablanması üçün göstərici təqdim edin |
|`POST /v1/iso20022/sese024` |Qiymətli kağızlar üzrə hesablama vəziyyətini bildirin |
|`POST /v1/iso20022/sese025` |Qiymətli kağızların hesablanması təsdiqini təqdim edin |
|`POST /v1/iso20022/colr012` |Əmanətlərin əvəz edilməsi ilə bağlı məlumat göndərin |
|`GET /v1/iso20022/messages/{msg_id}` |Bir mesaj üçün kanonik körpü qeydini oxuyun.|
|`GET /v1/iso20022/audit/messages` |Düzü-düzgün mesajlar yoxlama manifestini oxuyun.|
|`GET /v1/iso20022/messages/{msg_id}/pacs002` |Hələki ödəniş statusunu `pacs.002` XML olaraq qaytarın. |
|`GET /v1/iso20022/messages/{msg_id}/pacs004` |Hələki ödəniş ödənilməsini `pacs.004` XML kimi təqdim edin. |
|`GET /v1/iso20022/messages/{msg_id}/camt029` |Müvafiq ləğv qətnaməsini `camt.029` XML kimi qaytarın. |
|`GET /v1/iso20022/messages/{msg_id}/sese024` |Hal-hazırda olan məzənnənin statusunu `sese.024` XML olaraq vermək. |
|`GET /v1/iso20022/messages/{msg_id}/sese025` |Hələlik hesablanma təsdiqini `sese.025` XML olaraq təqdim edin. |

`pacs.008` təqdimatlarında ID, banklararası hesablaşma məbləği, valyuta, hesablama tarixi, borclu və kreditor IBANs və borcu və borclu şəxs BICs mesajı olmalıdır. Referensiya məlumatları qurulduqda, körpü əməliyyatın boru kəmərinə girməsindən əvvəl BIC, IBAN və ISO 4217 valyuta keçidlərini də yoxlayır.

`pacs.009` təqdimatlarında biznes mesajı ID, mesajın tərifi ID, yaradılış vaxtı, banklararası hesablama məbləği, valyuta, hesablama tarixi göstərilməlidir. təlimat verən və təlimat alan agent BICs, borclu şəxs və kreditor IBANs. Əgər mesajda `Purp` yer alırsa, körpü hazırda yalnız qiymətli kağızlar üçün maliyyələşdirilməni qəbul edir: `Purp=SECU`.

İndiki `pacs.008` və `pacs.009` təqdimat son nöqtələri qəbul edilir XML ISO qovşaqlar və ya körpü sınaqlarında istifadə olunan düz sahə formatı. `SplmtryData` sahələr hədəf saxlaya bilər Iroha başlıq, mənbə və hədəf hesabı IDs və ya ünvanlar və aktivlərin müəyyənləşdirilməsi ID. Cavab: `202 Accepted` ilə `message_id`, `transaction_hash`, `status`, `pacs002_code`, və həll edilmiş başlıq / hesab / aktiv kontekstində.

### Əlavə Parser və xəritələşmə dəstəyi {#additional-parser-and-mapping-support}

İndiki IVM ISO köməkçi, həmçinin aşağıdakı mesaj ailələrini təsdiqləyir və materiallaşdırır. təsdiqləmə, hesablama xəritələşdirilməsi və ya aşağı axınındakı uyğunlaşdırma. Torii marşrutlar.

|Mesaj ailəsi |Hal-hazırda dəstək |
| --- | --- |
|`head.001` |`BizMsgIdr`, `MsgDefIdr` sahələri, yaradılış vaxtı və seçmə yolu ilə göndərən / qəbul edən BIC sahələri daxil olmaqla ISO pultları üçün iş arzusunun başlıqlarının təsdiqlənməsi |
|`pacs.007`, `pacs.028`, `pacs.029` |Ödənişlərin geri qaytarılması, status tələbləri və araşdırmanın həlli / status analizi |
|`pain.001`, `pain.002` |Müştəri ödənişinin başlanması və ödəniş statusu hesabatının təsdiq edilməsi |
|`camt.052`, `camt.053`, `camt.054` |Hesab hesabatı, bəyanat və bildirişlərin təsdiqlənməsi |

## Kaigi Sessiyalar {#kaigi-sessions}

Kaigi ödənişli, real vaxt audio / video otaqları təmin edir SORA Nexus. Bir tətbiqetmə üçün hər hansı bir konfrans vəziyyətini zəncirdən kənarda saxlamaq əvəzinə kitabın dəstəklədiyi sessiyanın yaradılması, siyahı dəyişiklikləri, relay manifestoları, şifrələnmiş siqnallaşdırma və istifadə ölçüsü lazım olduqda istifadə edin.

Əsas səhifəyə yönəlmiş həyat dövrü:

- `CreateKaigi`: bir domen altında zəng yaratmaq və onun siyasəti, cədvəlini, metadatalarını və seçim relay manifestini saxlamaq.
- `JoinKaigi` və `LeaveKaigi`: Şəxsi rejimdə iştirakçılar öhdəliklərdən istifadə edirlər, iştirakçı hesabını açıqlamaq əvəzinə ləğv edənlər və qeydiyyat sənədləri IDs Birbaşa.
- `RecordKaigiUsage`: ölçülmüş müddəti və qaz ümumiliklərini əlavə edin.
- `EndKaigi`: iclası bağlayın və son vaxt möhürünü qeyd edin.

Torii Relay telemetriyasını aşkar edir `/v1/kaigi/relays`, `/v1/kaigi/relays/{relay_id}`, `/v1/kaigi/relays/health`, və `/v1/kaigi/relays/events` tətbiq API Telemetriya xüsusiyyətləri aktivləşdirilmişdir. Kaigi domen hadisələri kimi `KaigiRosterSummary`, `KaigiRelayManifestUpdated`, `KaigiRelayHealthUpdated`, və `KaigiUsageSummary`.

### CLI Duman testi {#cli-smoke-test}

Başlayın: `iroha kaigi` CLI Əgər siz a Torii son nöqtəsi qəbul edir Kaigi birləşmədən əvvəl əməliyyatlar UI. Sürətli başlanğıc komandanı aktivə qarşı müvəqqəti bir otaq yaradır Torii Son nöqtə və çağırış identifikatoru ilə bir ümumiləşdirmə yazır, komandanı qoşulur və SoraNet İstifadəçi:

```bash
iroha kaigi quickstart --auto-join-host --summary-out kaigi-summary.json
```

Scenario axınları üçün otağın həyat dövrünü açıq şəkildə idarə edin:

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

İstifadə `--room-policy public` İzləyici biletləri olmadan relaylar açıq ola biləcək otaqlar üçün və ya `--room-policy authenticated` Çıxışlar izləyicinin təsdiqlənməsini tələb etməlidir. `--privacy-mode zk-roster-v1` yalnız şəbəkənin Kaigi Rost və istifadəni yoxlayan açarları qurulmuşdur; əks halda birləşmələr, yarpaqlar, və fərdi istifadə qeydləri deterministik yoxlama zamanı uğursuz olur.

### JavaScript demo ilə sınaq {#testing-with-the-javascript-demo}

End-to-end cüzdan testi üçün [soramitsu/iroha-demo-javascript](https://github.com/soramitsu/iroha-demo-javascript) masaüstü demo istifadə edin. Demo bir elektron və Vue tətbiqidir ki, yerli `@iroha/iroha-js` bağlaması vasitəsilə birbaşa Torii ilə danışır və brauzer doğma bir-bir media üçün `/kaigi` marşrutunu ehtiva edir.

Demo ilə istifadə edin [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js) Qəzetdən Iroha Mənbə ehtiyatı. demo pin SDK vasitəsilə `file:../iroha/javascript/iroha_js`, Beləliklə, hər iki kassanı bu qardaşı düzənlikdə saxlayın:

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

Node.js 20 və ya daha yeni bir Rust vasitə zəncirindən istifadə edin ki, yerli `iroha_js_host` modulu quraşdırıla bilsin. Mənbəyi dəyişdirdikdən sonra qardaşı Iroha kassasında SDK yenidən qurun; təmiz paket tərtibində `npm run build:native` üçün lazım olan yük iş məkanı yoxdur.

Nəzarət edilmiş bir sınaq üçün demo Kaigi -ə malik olan Torii son nöqtəyə yönəltmək:

1. SORA/Kaigi tətbiqi ilə üzləşən APIs nodu aktivləşdirməklə Iroha düyünü başlatın və ya ehtiyacınız olan Kaigi səthlərini aşkar edən ictimai bir son nöqtədən istifadə edin.
2. `/health` ilə əsas əlçatanlığı yoxlayın, sonra canlı marşrut səthini `/openapi` və ya `/openapi.json` ilə yoxlayın. Bəzi yerləşdirmələrdə `/v1/health` də aşkar edilir, lakin `/health` daşınma qabiliyyətinin yoxlanmasıdır.
3. TAIRA üçün canlı görüşə cəhd etmədən əvvəl relay telemetriya marşrutlarını yoxlayın:

   ```bash
   TAIRA=https://taira.sora.org
   curl -fsS "$TAIRA/health"
   curl -fsS "$TAIRA/v1/kaigi/relays"
   curl -fsS "$TAIRA/v1/kaigi/relays/health"
   ```

Bu yoxlamalar Torii və Kaigi relay telemetriyasının əldə edilə biləcəyini sübut edir. Onlar bir görüş yaratmır; `CreateKaigi` və `JoinKaigi` hələ də maliyyələşdirilmiş cüzdanlara və imzalanan əməliyyatların təqdim olunmasına ehtiyac duyurlar.
4. Demosunu açın, Ayarlara gedin, Torii URL təyin edin və tətbiq endpoint-dən zəncirini ID və şəbəkə prefiksini yükləsin.
5. Demo-da iki yerli cüzdan yaratın və ya bərpa edin. Ev sahibinin və qonağın ayrı cüzdan vəziyyətinə malik olması üçün ayrı tətbiq pəncərələrindən, profillərindən və ya maşınlardan istifadə edin.

Kaigi UI testi üçün:

1. Ev sahibi pəncərəsində Kaigi açın, toplantı başlatmaq seçin, bir ad təyin edin və Xüsusi dəvət və ya Şəffaf dəvət seçin.
2. Kamera və mikrofonu açın seçin ki, WebRTC yerli mediaya malik olsun.
3. Bir canlı cüzdan `CreateKaigi` göndərir; sonra tətbiq `iroha://kaigi/join?call=...&secret=...` dəvəti və `#/kaigi?...` geri dönüş yolu göstərir.
4. Ev sahibinin pəncərəsini açıq saxla və dəvətnaməni qonaqla bölüş.
5. Qonaq pəncərəsində dəvəti açın və ya qoşulma iclasında yapışdırın, yerli media aktivləşdirin və qoşulma görüşünü seçin. Canlı bir cüzdan Torii-dən şifrələnmiş ev sahibinin təklifini alır və şifreli cavab meta məlumatları ilə `JoinKaigi` təqdim edir.
6. Ev sahibi Kaigi çağırış siqnallarını yayımlayaraq və ya səsvermə yolu ilə ilk cavabı avtomatik olaraq tətbiq etməlidir. Hər iki pəncərədə bağlı media və yenilənmiş əlaqə məlumatları göstərilməlidir.
7. Sessiyanı aparıcıdan bitirin və ya eyni zəng üçün CLI `iroha kaigi end` əmri ilə istifadə edin ID.

Şəxsi Kaigi qoruyan ehtiyaclar XOR Əgər demo bildirir ki, şəxsi giriş nöqtəsi haqqı Kaigi qoruyan ehtiyaclar XOR, tətbiqetmə içərisindəki öz qoruyucu təzyiqdən istifadə edin və yaratmaq və ya qoşulma hərəkətini yenidən sınayın. Əgər sübut istehsalı, özəl maliyyələşdirmə və ya canlı siqnallaşdırma mövcud deyilsə, demo şəffaf / əl axınına qayıda bilər. Bu vəziyyətdə, Gelişmiş siqnal açın, xam təklif və ya cavab paketini kopyalayın və digər pəncərəyə yapışdırın.

Demo repo-da avtomatik yoxlamalar üçün aşağıdakıları icra edin:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
npm run verify
```

Fokuslaşdırılmış Vitest suiteları Kaigi toplantı bağlantısı yaradılması, kompakt dəvət yükləməsi, xüsusi yaratın / qoşulun / bitirin körpü zəngləri, özünü qorumaq istəkləri, əl fallback və cavab sorğularını əhatə edir. UI duman testi masaüstü və mobil ölçülü mənzillərdəki `/kaigi` marşrutunu ehtiva edir. İki cüzdan arasındakı canlı media hələ də iki pəncərəli əl testi tələb edir, çünki brauzer kamerası / mikrofon icazələri və həmyaşıd media axını mühitə aiddir.

Nümunə inteqrasiya kodu üçün [Nümunəsi Kaigi-nin JavaScript App](/az/guide/tutorials/kaigi.md)-də yerləşdirilmişdir.

## Hələlik və Metriklər {#status-and-metrics}

Status və ölçülər son nöqtələri ilk növbədə idarəetmə pəncərələrinə daxil edilir:

- `/status` ən yüksək səviyyəli həmyaşıd, blok, sıra və konsensus sahələrini açıqlayır
- `/metrics` Prometheus hesablayıcıları, ölçülərini və histogramlarını aşkar edir.

Nexus-ə malik olan qovşaqlarda status çıxışı həmçinin yol və məlumat məkanı haqqında məlumatlı hissələri də əhatə edir. `nexus.enabled = false` zamanı bu hissələr buraxılır.

## JSON vs Norito {#json-vs-norito}

Bir neçə operator son nöqtəsi default olaraq Norito qaytarır. Son nöqtə JSON dəstəklədiyi zaman, göndərin:

```http
Accept: application/json
```

Bu xüsusilə aşağıdakılara aiddir:

- `/v1/sumeragi/status`
- `/v1/sumeragi/qc`
- `/v1/sumeragi/commit_qc/{hash}`

Bir son nöqtə qəbul edərkən və ya yazılanları qaytararkən Norito birbaşa, istifadə `application/x-norito` məzmun növü və ya üstünlük verilən `Accept` Qiymət. [Norito](/az/reference/norito.md#torii-and-norito-rpc) Nəqliyyat detalları üçün.

## Telemetriya Profilləri {#telemetry-profiles}

Son nöqtələrin görünməsi qovşağın `telemetry.profile` parametrindən asılıdır. Cari konfiqurasiya beş profil səviyyəsini təqdim edir:

|Profil |`/status` |`/metrics` |İnkişafçıların marşrutları |
| --- | --- | --- | --- |
|`disabled` |xeyr |xeyr |xeyr |
|`operator` |bəli |xeyr |xeyr |
|`extended` |bəli |bəli |xeyr |
|`developer` |bəli |xeyr |bəli |
|`full` |bəli |bəli |bəli |

## CLI Qısa yollar {#cli-shortcuts}

`iroha` CLI artıq bu son nöqtələrdən bir çoxunu əhatə edir:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml ops sumeragi params
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

## Əvvəlki istinadlar {#upstream-references}

- [README API və müşahidə qabiliyyətinin ümumi görünüşü ](https://github.com/hyperledger-iroha/iroha/blob/main/README.md)
- [ISO 20022 körpü tətbiqi](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_torii/src/iso20022_bridge.rs)
- [Performans və ölçmələr](/az/guide/advanced/metrics.md)
