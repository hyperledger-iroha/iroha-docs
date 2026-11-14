---
translation_locale: az
translation_source: /reference/torii-endpoints.md
translation_source_hash: 32f53c1fad49ecd320c46636f707e105db86b2080a4500f6006a3a91e97b9c7f
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Torii son nöqtələri {#torii-endpoints}

Torii Iroha 3 üçün HTTP, SSE və WebSocket keçididir. O, həm reyestrlə işləyən APIs, həm də operator son nöqtələri təqdim edir.

Hazırkı protokol qaydaları bunlardır:

- tək protokol-standart ikili format Norito
- `Accept: application/json` göndərdikdə bir çox son nöqtə JSON-u da dəstəkləyir
- metrikanlar Prometheus formatında göstərilir

Format detalları, məzmun vasitəsi, yerləşdirmə bayraqları, sxema kriptoqrafik xesləri və Norito RPC qaydaları üçün [Norito istinad](/az/reference/norito.md)-a baxın.

## Ümumi son nöqtələr {#common-endpoints}

| Son nöqtə | Format | Məqsəd |
| -------------------------------- | -------------- | ---------------------------------------------------------------- |
| `POST /v1/pipeline/transactions` | Norito         |İmzalanmış əməliyyatı göndərin|
| `POST /v1/query`                 | Norito         |İmzalı sorğunu təqdim edin|
| `GET /v1/events/ws`              | WebSocket      |Tədbir axınlarına abunə olun|
| `GET /v1/events/sse`             | SSE            |SSE üzərində hadisə axınlarına abunə olun|
| `GET /v1/blocks/stream`          | WebSocket      |Axın yekunlaşdırılmış bloklar|
| `GET /v1/peers`                  | JSON           | Onlayn şəbəkə həmkarlarının ID-ləri; operator sorğusunun imzasını tələb edir|
| `GET /livez`                     |Mətn|Yalnız proses canlılığı; bu, protokol hazırlığını ifadə etmir|
| `GET /readyz` | Mətn | Konsensus qəbulu və mayak mühafizəsi əlçatan olduqda hazırdır; fövqəladə Fast başlanğıcı zamanı və ya konfiqurasiya edilmiş ISO 20022 körpüsü audit qeydlərini davamlı saxlaya bilmədikdə `503` |
| `GET /health` | Mətn | Torii-nin canlılığı; `Healthy` qaytarır |
| `GET /v1/api/version`            |Mətn|Kanonik imzalanmış blokun ötürmə formatı versiyası; genezisdən əvvəl `503`|
| `GET /status`                    | Norito və ya JSON |Yüksək səviyyəli diaqnostik vəziyyət; sorğu JSON açıq şəkildə|
| `GET /metrics` | Prometheus | Prometheus metrik toplama son nöqtəsi |
| `GET /v1/schema`                 | JSON           |Node tərəfindən aktivləşdirildikdə təqdim olunan məlumat modeli sxemi zaman nöqtəsi məlumat baxışı|
| `GET /openapi.json`              | JSON           | Repozitoriyada saxlanılan, bu yığımın kataloq marşrutlarına qədər azaldılmış OpenAPI müqaviləsi |
| `GET /v1/parameters`             | JSON           |Nod parametr nöqtə-vaxt məlumat görünüşü|
| `GET /v1/node/capabilities`      | JSON           |Node qabiliyyəti və məlumat modeli metadatası|
| `GET /v1/time/now`               | JSON           |Node yerli sistem saatının nöqtə-vaxt məlumat baxışı|
| `GET /v1/time/status`            | JSON           |Vaxt sinxronizasiyası vəziyyəti; operator sorğusunun imzasını tələb edir|

Bir SSE tələbi üçün, yerli axını və əlavə olaraq yazılmış ehtiyatı reklam edin:

```http
Accept: text/event-stream, application/json
```

Torii əvvəlcə sorğu təbəqəsində JSON və ya Norito təmsilçiliyi danışıqlar edir, sonra yerli `text/event-stream` cavabını təsdiqləyir. Yalnız `text/event-stream` göndərilməsi buna görə `406` ilə rədd edilir; [axın-tədbirlər resepti](/az/cookbook/stream-events.md) tam başlığı istifadə edir.

`/openapi.json` OpenAPI proyeksiyası üçün işarələnmiş kataloq marşrutlarına aid, repozitoriyada saxlanılan müqavilədir. O, `/livez`, `/health` və `/readyz` yollarını ehtiva edir. Marşrut müştərilərini hədəf qovşağın təqdim etdiyi sənəddən yaradın və onun yoxlama son nöqtələrini birbaşa yoxlayın. Dəqiq interfeys yığım funksiyalarından və icra mühiti konfiqurasiyasından asılıdır. Canlı sənədi yükləmək, JSON marşrutlarını sınamaq, curl sorğularını köçürmək və cari sxemdən müştəri kodu yaratmaq üçün [Torii API konsolundan](/az/reference/torii-api-console.md) istifadə edin.

Hər kataloq dəstəklənən OpenAPI əməliyyatında bir `x-iroha-route-auth` obyekti daxil edilir. Kataloq dəstəklənən MCP alətlər eyni müqaviləni `_meta["iroha/routeAuth"]` ilə nümayiş etdirir. Hər iki proyeksiya `schemaVersion`, `stableRouteId`, `authentication` və `admission` daşıyır. Versiya `1` dəqiq bir müqavilə kimi qəbul edin: autentifikasiya və ya qəbul etiketlərinin necə şərh olunacağını təxmin etmək yerinə dəstəklənməyən `schemaVersion`-i rədd edin. Marşrut metadatası sorğu sərhədini təsvir edir; o, həmin sərhəd tərəfindən tələb olunan etimadnamələrin yerini tutmur.

## Canlı Taira marşrutlarını sınayın {#try-live-taira-routes}

İctimai Taira test şəbəkəsi, tətbiq müştərilərinin yalnız oxumaq üçün istifadə etdiyi eyni Torii JSON səthini göstərir. Bu əmrlər açarlar tələb etmir:

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

Mövcud dünya vəziyyətinə qarşı resurs oxumalarını sınayın:

```bash
curl -fsS "$TAIRA_ROOT/v1/domains?limit=5" \
  | jq -r '.items[].id'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=5" \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

Açıq testnet marşrutu `502` qaytarırsa, vaxt aşımına uğrayırsa və ya dolmuş növbə bildirirsə, bunu son nöqtənin əlçatanlıq problemi sayın və müştəri kodunda xəta axtarmazdan əvvəl daha sonra yenidən cəhd edin.

## Konsensus və icra mühiti son nöqtələri {#consensus-and-runtime-endpoints}

Aşağıdakı hər Sumeragi marşrutu operator sorğusunun imzasını tələb edir. Vəziyyət, diaqnostika, axın, zolaq, açar və parametr marşrutları həmçinin telemetriyası aktiv yığım tələb edir. İcra mühitinin yenilənməsi, buraxılış və təcridetmə marşrutları da operator sorğusunun imzasını tələb edir; `GET /v1/runtime/abi/active` və `GET /v1/runtime/metrics` kanonik hesab sorğusu imzası tələb edir, `GET /v1/runtime/abi/hash` isə ictimaidir.

| Son nöqtə | Format | Məqsəd |
| ----------------------------------------- | -------------- | ------------------------------------------------------- |
| `GET /v1/sumeragi/status`                 | Norito və ya JSON |Səlahiyyətli azaldıcıya məxsus razılıq statusu|
| `GET /v1/sumeragi/diagnostics`            | JSON           |Avtoritet olmayan proqram təminatı işləmə iş axını, növbə və icra zolağı diaqnostikası|
| `GET /v1/sumeragi/status/sse`             | SSE            |Davamlı səlahiyyətli razılıq vəziyyəti axını|
| `GET /v1/sumeragi/lanes` | Norito və ya JSON | Qlobal zəncirin təsdiqlənmiş zolaqları və bu qovşağın zolaq instansiyalarının vəziyyəti |
| `GET /v1/sumeragi/consensus-keys`         | JSON           |Aktiv konsensus açarları|
| `GET /v1/sumeragi/bls-keys`               | JSON           |Aktiv BLS konsensus açarları|
| `GET /v1/sumeragi/params`                 | JSON           |Cari zəncirdaxili Sumeragi parametrlər|
| `GET /v1/sumeragi/evidence`               | JSON           |Sübut qeydləri, istəyə görə sorğu sətiri ilə süzülə bilər|
| `GET /v1/sumeragi/evidence/count`         | JSON           |Sübut qeydinin sayı|
| `GET /v1/runtime/abi/active`              | JSON           |Aktiv proqram təminatı icra mühiti ABI təsviri|
| `GET /v1/runtime/abi/hash`                | JSON           |Aktiv proqram təminatı icra mühiti ABI kriptoqrafik xəş|
| `GET /v1/runtime/metrics`                 | JSON           |proqram təminatı icra mühiti metrikləri vaxt nöqtəsinə dair məlumat görünüşü|
| `GET /v1/runtime/upgrades`                | JSON           |proqram təminatı icra mühiti yeniləmə siyahısı|
| `POST /v1/runtime/upgrades/propose`       | JSON           |İcra mühiti dəyişiklik dəstini planlaşdıran SORA Parliament təklifinin layihəsini hazırlayın|
| `POST /v1/runtime/upgrades/attest/{id}` | JSON | Planlaşdırılmış dəyişiklik dəsti üçün bu qovşağın attestasiyasını imzalamaq |
| `GET /v1/runtime/release` | JSON | Bu qovşağın buraxılış həşi və onun təsdiqlənmiş və planlaşdırılmış icra mühiti seçimlərini icra edib-etmədiyi |
| `GET /v1/runtime/containments` | JSON | İcra mühiti təriflərinin qeydə alınmış fövqəladə təcridetmələri |
| `POST /v1/runtime/upgrades/cancel/{id}` | JSON           |Planlaşdırılmış dəyişiklik dəstini geri götürən SORA Parliament təklifinin layihəsini hazırlayın|

## Tətbiq və SORA Nexus marşrut ailələri {#app-and-sora-route-families}

Torii tətbiqlərə xidmət edən funksiyalar dəsti ilə yığıldıqda blok tədqiqatçıları, SORA Nexus xidmətləri, körpü axınları, sübutlar və saxlama üçün əlavə JSON ailələri təqdim edir. Bu ailələrin hamısı hər şəbəkə profilində aktiv deyil.

`/openapi.json` yalnız daxil etdiyi əməliyyatlar üçün səlahiyyətlidir, prosesin qoşduğu hər marşrut üçün deyil. Yalnız yaradılmış SDKs üçün təqdim olunan və ya ümumiyyətlə proyeksiya edilməyən kataloq marşrutları qoşulur, lakin orada yoxdur. Sabitlənmiş reviziyada bunlara Kaigi zəng marşrutları, `/v1/app-api/*`, `/v1/kagemusha/{scheme}/wallets/*` altındakı KAGEMUSHA pul kisəsi oxumaları, həmçinin ictimai SoraFS `/sorafs/cid/*` və `/.well-known/sorafs/manifest` marşrutları daxildir. Bu marşrutları birbaşa yoxlayın.

|Marşrut ailəsi|Məqsəd|
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `/v1/accounts/*`, `/v1/domains/*`, `/v1/assets/*`                         |JSON oxuyur, sorğu köməkçiləri, onboarding köməkçiləri və portfel və ya sahib baxışları|
| `/v1/nfts/*`, `/v1/rwas/*`, `/v1/confidential/*`                          |NFT, real dünya aktivləri və məxfi aktiv baxışları|
| `/v1/aliases/*`, `/v1/assets/aliases/*`, `/v1/sns/*`, `/v1/identifiers/*` |Ad, təxəllüs və identifikatorun həlli|
| `/v1/explorer/*`                                                          |Eksplorer yönümlü hesab, aktiv, blok, əməliyyat, göstəriş, metrik və axın baxışları|
| `/v1/transactions/*`, `/v1/pipeline/*`, `/v1/iso20022/*`                  |Əməliyyat tarixi, proqram təminatının işləmə iş axınının bərpası və ya vəziyyəti, və ISO 20022 köməkçiləri|
| `/v1/contracts/*` |Kontrakt kodu, yerləşdirmək, paketləmək, çağırmaq, baxmaq, tədbir, fəaliyyət, toplu əməliyyat və vəziyyət marşrutları|
| `/v1/multisig/*`, `/v1/controls/*`                                        |Çox imzalı təkliflər, təsdiqlər və köçürmə-nəzarət köməkçiləri|
| `/v1/bridge/*`, `/v1/ledger/*`, `/v1/proofs/*`                            |Finalik, dövlət sübutu, blok sübutu, sübutun saxlanması və sübut sorğusu marşrutları|
| `/v1/da/*`                                                                |Məlumat-mövcudluğu qəbul edilməsi, texniki manifestlər, sübut siyasətləri, kriptoqrafik öhdəlik dəyərləri və pin niyyətləri|
| `/v1/zk/*` | ZK kökləri, sübut yoxlaması, səslərin sayılması, yoxlama açarları, sübut qeydləri və əlavələr |
| `/v1/gov/*`, `/v1/ministry/*`                                             |İdarəetmə təklifləri, səsvermə, şura vəziyyəti, qorunan ad sahələri, gündəlik təklifləri, qanunvericilik və yekunlaşdırma|
| `/v1/nexus/*`, `/v1/sccp/*` | SORA Nexus məlumat məkanı, zolaq və zəncirlərarası sübut köməkçiləri |
| `/v1/musubi/*`                                                            | Musubi paket qeydiyyatı oxuyur və təlimat qurucuları|
| `/v1/subscriptions/*`                                                     |Abunə planları, abunə dövrü, istifadə və ödəniş köməkçiləri|
| `/v1/sorafs/*`, `/sorafs/*`, `/.well-known/sorafs/*`                      | SoraFS təminatçı kəşfi, tutum sübutları, pinləmə, yaddaş əldə etmələri və publik məzmun xidmətləri|
| `/v1/soracloud/*`, `/v1/soradns/*`, `/api/*` | SoraCloud xidmət həyat dövrü, özəl hesablama/model axınları, açıq kəşf və yerləşdirilmiş tətbiqlərin marşrutlaşdırılması |
| `/v1/connect/*`, `/v1/vpn/*`                                              |Iroha Sessiyaları qoşun, WebSocket nəqliyyat, VPN sessiyalar, profillər və protokol nəticə qeydləri|
| `/v1/app-api/*`, `/v1/api/*`, `/v1/content/*`                             |Tətbiq API bağlamaları və paket/CID-dəsəkli məzmun yönləndirməsi|
| `/v1/operator/*`, `/v1/mcp`                                               |Operator autentifikasiyası və yerli MCP JSON-RPC körpü|
| `/v1/kagemusha/*`, `/v1/repo/*`, `/v1/space-directory/*`, `/v1/ram-lfe/*` | KAGEMUSHA qeydiyyatı və pul kisəsi yekunluğu oxumaları, geri satınalma müqavilələri, məlumat məkanı manifestləri və [RAM-LFE köməkçiləri](/az/blockchain/ram-lfe.md#torii-routes) |
| `/v1/kaigi/*`, `/v1/webhooks/*`, `/v1/notify/*`, `/v1/telemetry/*`        |Əməkdaşlıq, webhook, push bildirişləri və canlı telemetriya inteqrasiyaları|

## Hesab Doğrulaması, Görünürlük və Explorer Kursorları {#account-authentication-visibility-and-explorer-cursors}

### Tətbiq Hesabı Sorğu Protokolu {#app-account-request-protocol}

Tətbiqə yönəlmiş marşrutlar ya heç bir autentifikasiya başlığı qəbul etmir, ya birbaşa tək açarlı sübut, ya da bir çox imzalı şahid qəbul edir. Hər autentifikasiya başlığı ən çox bir dəfə görünməlidir.

Birbaşa sübut üçün bütün dörd başlığı birlikdə göndərin:

- `X-Iroha-Account`: dəqiq tək protokol-standart hərf kiçik `0x` hesab ünvanı heks və ya aktiv tək protokol-standart ASCII hesab təxəllüsü. I105 mətn HTTP sahə dəyəri kimi təhlükəsiz deyil; həmin hesab üçün tək protokol-standart heks yazılışından istifadə edin.
- `X-Iroha-Signature`: ciddi doldurulmuş-base64 imza yükü.
- `X-Iroha-Timestamp-Ms`: tənzimlənmiş sapma pəncərəsi daxilində, protokol-standartı olan tək tam işarəsiz onluq Unix zaman möhürü (millisaniyə ilə).
- `X-Iroha-Nonce`: 1-dən 256-ya qədər çap edilə bilən ASCII bayt (`0x21` ilə `0x7e` arası), təkrarlama pəncərəsi daxilində unikal.

Qeydiyyatdan keçmiş tək açarlı idarəedicisi bu dəqiq baytları imzalayır:

```text
iroha.app.request.network.v1\0 || <genesis-derived network_id[32]> ||
<UPPERCASE_METHOD>\n
<exact request path>\n
<canonical query>\n
<lowercase hex SHA-256 of the raw body>\n
<canonical timestamp_ms>\n
<nonce>
```

tək protokol-standart sorğu konstruksiyası xam sorğunu `application/x-www-form-urlencoded` kimi parçalayır (`+` boşluq deməkdir), cütlüklərini faiz-dekodlayır, onları `(key, value)` üzrə sıralayır və yenidən forma-enkodlayır. Protokol ən çox 64 dekod edilmiş cütlük və 64 xam sorğu mətnini KiB qəbul edir. Bədənin baytlarını dəqiq olaraq göndərildiyi kimi kriptoqrafik olaraq hash edin. Sabit 32 baytlıq şəbəkə ID-si ilə böyük hərf metod arasında ayrıcı qoymayın.

V1 yoxlayıcısı həmçinin metodu işarə edən tokeni 32 bayta, faizlə kodlanmış sorğu yolunu 64 KiB-ə və birbaşa hesab şəxsiyyətini 36 KiB-ə qədər məhdudlaşdırır və sonra ayırır. Hesab ləqəblərinin daha sərt struktur məhdudiyyəti var: üç ad seqmenti və onların ayırıcıları. Bu həddi aşmaq imzanın yoxlanılmasından və ya mənbə ölçülü bölgüləndirmədən əvvəl autentifikasiyanın uğursuz olmasına səbəb olur.

Multisig nəzarətçi əvəzinə `X-Iroha-Witness`-ı ciddi yastıqlanmış base64 tək protokol-standart Norito kimi göndərməlidir və `X-Iroha-Signature`, `X-Iroha-Timestamp-Ms` və `X-Iroha-Nonce`-ü buraxmalıdır. `X-Iroha-Account` bu formada ixtiyari olaraq daxil edilə bilər; mövcud olduqda, o, şahid `subject_account`-ə bərabər olmalıdır. `CanonicalRequestWitnessV1` `schema_version`, `subject_account`, `timestamp_ms`, `nonce`, tam şəbəkə sorğusu baytlarını bədən kriptoqrafik xülasə dəyəri vasitəsilə, ancaq yenilik sahələri olmadan və ən çox 64 üzv imzası olan Iroha `Hash` ehtiva edir. Hər bir üzv imzalayır eyni yükün imzalar massivsiz vahid protokol-standart Norito kodlamasını. Yoxlanılmış üzvlər hesabın mövcud multisig siyasətinə cavab verməlidirlər. Kodlanmış şahid 1 MiB ilə məhdudlaşdırılır.

Heç bir autentifikasiya başlığı təqdim etməmək anonim giriş seçir. Hər hansı qismən, qarışıq, təkrarlanan, səhv formatlı, köhnəlmiş və ya təkrarlanan sübut təqdim etmək autentifikasiyanı uğursuz edir; bu heç vaxt anonim görünürlüğə qayıtmır.

### Operator Sorğu Protokolu {#operator-request-protocol}

Operator tərəfindən təsdiqlənmiş kimi işarələnmiş marşrutlar dörd tək başlıqın hamısını tələb edir:

- `x-iroha-operator-public-key`: tək protokol-standart Iroha çoxhəş açıq açar.
- `x-iroha-operator-timestamp-ms`: millisekundlarda tək protokol-standartlı işarəsiz desimal Unix zaman damğası.
- `x-iroha-operator-nonce`: 1-dən 256-ya qədər çap edilə bilən ASCII bayt, təkrar pəncərə daxilində o açar üçün unikal.
- `x-iroha-operator-signature`: ciddi şəkildə doldurulmuş base64 imza yükləməsi.

Başlıq qiymətləri ətrafdakı boşluqları ehtiva etməməlidir. Operator açar işarələri:

```text
iroha.operator.http-request.network.v1\0 || <genesis-derived network_id[32]> ||
<UPPERCASE_METHOD>\n
<exact request path>\n
<canonical query>\n
<lowercase hex SHA-256 of the raw body>\n
<canonical timestamp_ms>\n
<nonce>
```

Yol, sorğu, bədən, zaman möhürü və kriptoqrafik nonce dəyəri qaydaları tətbiq protokolunda istifadə olunan tək protokol-standart qaydalarıdır. Açar həmçinin olmalıdır `[torii.operator_signatures]` tərəfindən qəbul edilə bilər: onu `allowed_public_keys` siyahısına daxil edin, və ya node açarını istifadə edərkən açıq şəkildə `allow_node_key`-ni aktiv edin. Replay-cache doyması `503 Service Unavailable` ilə bağlanır.

Dəqiq sorğu imzası həmişə mütləqdir. `[torii.operator_auth].enabled = true` olduqda, hər adi operator marşrutu da etibarlı `x-iroha-operator-session` tələb edir; `require_mtls = true` olduqda isə əlavə olaraq etibarlı girişdən `x-forwarded-client-cert` tələb olunur. Heç bir amil sorğu imzasının yerinə keçmir.

WebAuthn qeydiyyatı və girişi bu dörd JSON son nöqtəsindən istifadə edir:

| Metod və son nöqtə | Məqsəd |
| --------------------------------------------- | ---------------------------------------- |
| `POST /v1/operator/auth/registration/options` | WebAuthn etimadnamə qeydiyyatına başla|
| `POST /v1/operator/auth/registration/verify` |Giriş məlumatlarını təsdiqləyin və saxlayın|
| `POST /v1/operator/auth/login/options`        | WebAuthn autentifikasiyasına başlayın|
| `POST /v1/operator/auth/login/verify`         |İddianı yoxlayın və sessiya verin|

`torii.operator_auth.tokens` xüsusi bootstrap dəyərləri ilə konfiqurasiya edin. Hər hansı bir etimadnamə mövcud olmadan əvvəl, ilk qeydiyyata başlamaq üçün birini `x-iroha-operator-token` kimi göndərin. Həmin token adi operator marşrutunu heç vaxt təsdiqləmir və dinləyici `x-api-token` dəyərləri bu axın üçün heç vaxt yenidən istifadə olunmur. Bir dərəcə mövcud olduqda, başqa bir dərəcəni qeydiyyatdan keçirmək üçün autentifikasiya olunmuş sessiya tələb olunur. Daxil olma yoxlaması hər yeni dəqiq şəbəkə operatoru sorğusunun imzası ilə birlikdə göndərmək üçün sessiya tokenini qaytarır. Dərəcələr `<torii.data_dir>/operator_auth/operator_webauthn.json` altında qalır.

ISO 20022 marşrutları iki müstəqil yoxlamanı tətbiq edir. Sorğu əvvəlcə bu operator icazə siyahısı və imza protokolundan keçməlidir; daha sonra ISO işləyicisi eyni açarın aşağıda təsvir olunan iştirakçı və ya audit rolunu tutmasını tələb edir.

### blokçeyn dəftərçəsi Görünürlüğü və Tədqiqatçı Kursorları {#ledger-visibility-and-explorer-cursors}

Tətbiqlərə xidmət edən reyestr oxumaları yuxarıdakı məcburi olmayan tətbiq hesabı sərhədindən istifadə edir. İmzasız sorğu yalnız açıq konfiqurasiya edilmiş məlumat məkanlarını alır. Etibarlı imzalanmış sorğu çağıranın cari UAID-sinə bağlı məlumat məkanlarını, dəqiq `CanReadRestrictedDataspace { dataspace }` icazəsində göstərilən hər məhdud məlumat məkanını, yaxud hesabda `CanReadAllLedgerData` olduqda bütün marşrutları əlavə edir.

Çağıranın səlahiyyət əsasına uyğun marşrutu istifadə edin:

| Metod və son nöqtə | Autentifikasiya və görünmə |
| ------------------------------------- | --------------------------------------------------------------- |
| `POST /v1/transactions/query` | Məcburi olmayan kanonik hesab imzası; çağıranın məlumat məkanı görünməsini tətbiq edir |
| `GET /v1/triggers/completed`          |Operator sorğu imzası; düyün-yerli tamamlanma qeydlərini oxuyur|

Eyni görünmə obyekti hesab, domen, aktiv tərifi, aktiv, NFT, RWA, sahib və Explorer oxumalarını süzgəcdən keçirir. Mövcud olmayan obyektlə çağıranın görünən marşrutlarından kənardakı obyekt bilərəkdən fərqləndirilmir. Təsdiqlənmiş əməliyyat və təlimat tarixçəsi yalnız əməliyyat üçün qeydə alınmış bütün marşrut hissələri görünəndə göstərilir. Buna görə bir neçə məlumat məkanını əhatə edən əməliyyatın hətta bir iştirakçı hissəsi çağıranın çərçivəsindən kənardadırsa, əməliyyat gizlədilir; çatışmayan, köhnəlmiş və ya səhv qurulmuş marşrut konteksti yalnız qlobal oxucuya görünür.

Altı dünya tərəfindən dəstəklənən Explorer kolleksiyaları şəffaf olmayan tək protokol-standart base64url açar dəsti kursorlarından istifadə edir. Defolt səhifə limiti 25-dir, maksimum limit 100-dür və bir səhifə ən çox 512 namizəd açarı yoxlayır. Hər kursor öz kolleksiyasına, filtrlərinə, tək protokol-standart son açara və zəng edən tərəfindən görünən marşrut dəsti kriptoqrafik xülasə dəyərinə bağlıdır, buna görə də başqa bir sorğuda və ya zəng edən tərəfindən görünürlük dəyişdikdən sonra təkrar istifadə edilə bilməz.

Blok, əməliyyat, son əməliyyat, təlimat və son təlimat tarixi kursorları əlavə olaraq yekunlaşdırılmış zaman-məqam məlumat baxışı hündürlüyünü və blok kriptoqrafik xəşini pinləyir. Cavablar `pagination.limit`, `pagination.snapshot_height`, `pagination.snapshot_hash`, `pagination.next_cursor` və `pagination.has_more`-ü göstərir. Başqa bir marşrut və ya filtr dəsti üçün kursor, dəyişdirilmiş görünənlik kriptoqrafik xülasə dəyəri və ya node-un artıq doğrulaya bilmədiyi zaman-nöqtəsi məlumat baxışı qapalı vəziyyətdə uğursuz olur. Tarix taraması bloklayan işçi işlədiyi zaman Torii-in sorğu-qəbul icazəsinin içərisində qalır.

Explorer WebSocket axınları süzgəcdən keçirilmiş xülasələr verir və reyestr icazələri dəyişdikcə görünməni yenidən hesablayır. Protokolun öz `GET /v1/blocks/stream` marşrutu fərqlidir: o, tam imzalanmış blokları ötürür, əl sıxması zamanı `CanReadAllLedgerData` tələb edir və həmin icazə sonradan ləğv olunarsa bağlanır. Məlumat məkanları ilə məhdudlaşdırılmış tədqiqatçı üçün bu birbaşa axından istifadə etməyin.

## ISO 20022 Körpü {#iso-20022-bridge}

Torii hər yığımda ISO 20022 körpüsünü `/v1/iso20022/*` altında qoşur; körpü göndərişlərə yalnız `torii.iso_bridge.enabled` təyin edildikdə xidmət göstərir. Körpü qəsdən müəyyən sahə ilə məhdudlaşdırılıb: Bu, ümumi məqsədli ISO 20022 təmizləmə keçidi deyil, lakin seçilmiş ödəniş mesajlarını imzalı Iroha köçürmələrə çevirmək və onların blokçeyn dəftər statusunu izləmək üçün dəstəklənmiş bir alt dəstəsidir.

Hər hansı bir təqdimatı qəbul etmədən əvvəl davamlı yerli `torii.iso_bridge.store_dir` qurun. Konfiqurasiya sahəsi yalnız bir node-un yalnız oxumaq üçün və ya diaqnostik istifadə üçün başlaya bilməsi üçün optional (ixtiyari)dir: Hər təsdiqlənmiş ISO təqdimat kataloqu tələb edir və davamlılıq olmadıqda və ya təkrar-mazgal və ya zəngin qeyd yazısı uğursuz olduqda təkrar cəhd edilə bilən `503 Service Unavailable` qaytarır.

### Torii ISO 20022 son nöqtələri {#torii-iso-20022-endpoints}

| Metod və son nöqtə | Məqsəd |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `POST /v1/iso20022/pacs008`                  |FI-dən FI-yə müştəri kredit transferi təqdim edin və uyğun Iroha aktiv transferini yaradın|
| `POST /v1/iso20022/pacs009`                  |PvP və ya qiymətli kağızlarla bağlı nağd maliyyələşdirmə üçün istifadə olunan FI-dən FI-yə kredit köçürməsini təqdim edin|
| `POST /v1/iso20022/pacs002`                  |Əks tərəfə məxsus ödəniş vəziyyəti hesabatını təqdim edin; maliyyə əməliyyatının həlli üçün tamamlanmış əməliyyat sübutu tələb olunur|
| `POST /v1/iso20022/pacs004`                  |Tərəfdaş tərəfindən sahib olunan ödəniş qaytarılmasını təqdim edin|
| `POST /v1/iso20022/camt056`                  |Müəllifə aid ödəniş ləğv etmə sorğusu göndərin|
| `POST /v1/iso20022/sese023`                  |Səhm maliyyə əməliyyatı hesablaşma təlimatını təqdim edin|
| `POST /v1/iso20022/sese024`                  |Tərəf müqabilə aid qiymətli kağızların maliyyə əməliyyatının təsdiq statusu mesajını göndərin|
| `POST /v1/iso20022/sese025`                  |Əks tərəfə aid qiymətli kağızların maliyyə əməliyyatı təsdiqini təqdim edin|
| `POST /v1/iso20022/colr012`                  |Kolleteral əvəzləmə mesajını göndərin|
| `GET /v1/iso20022/messages/{msg_id}`         |Bir mesaj üçün tək protokol-standart körpü qeydini oxuyun|
| `GET /v1/iso20022/audit/messages`            |Müdaxilə edildiyi görünən mesaj yoxlama texniki manifestini oxuyun|
| `GET /v1/iso20022/messages/{msg_id}/pacs002` |Cari ödəniş vəziyyətini `pacs.002` XML kimi göstər|
| `GET /v1/iso20022/messages/{msg_id}/pacs004` |Cari ödənişi `pacs.004` XML kimi göstərin|
| `GET /v1/iso20022/messages/{msg_id}/camt029` |Cari ləğv qərarını `camt.029` XML kimi göstər|
| `GET /v1/iso20022/messages/{msg_id}/sese024` |Cari maliyyə əməliyyatı həll statusunu `sese.024` XML kimi göstər|
| `GET /v1/iso20022/messages/{msg_id}/sese025` |Cari maliyyə əməliyyatı həll təsdiqini `sese.025` XML kimi göstər|

`pacs.008` göndərişlər mesaj ID-sini, banklararası maliyyə əməliyyatının həlli məbləğini, valyutasını, maliyyə əməliyyatının həlli tarixini, borcalanı və kreditoru IBANs, həmçinin borcalanı və kreditoru BICs təmin etməlidir. İstinad məlumatları konfiqurasiya edildikdə, körpü generasiya edilmiş əməliyyat proqram işləmə iş axınına daxil olmamışdan əvvəl BIC, IBAN və ISO 4217 valyuta keçid cədvəllərini də yoxlayır.

`pacs.009` təqdimatlar biznes mesajının ID-sini, mesaj tərifinin ID-sini, yaradılma vaxtını, banklararası maliyyə əməliyyatının həll miqdarını, valyutanı təmin etməlidir, maliyyə əməliyyatının həlli tarixi, göstəriş verən və göstəriş alan agent BICs, həmçinin debitor və kreditor IBANs. Əgər mesaj `Purp` daxil edirsə, körpü hazırda yalnız qiymətli kağızların məqsədli maliyyələşdirilməsini qəbul edir: `Purp=SECU`.

`pacs.008` və `pacs.009` göndərmə son nöqtələri XML ISO zərflərini və ya körpü testlərindəki düz sahə formatını qəbul edir. Məcburi olmayan `SplmtryData` sahələri hədəf Iroha reyestrini, mənbə və hədəf hesab ID-lərini və ya ünvanlarını, eləcə də aktiv tərifi ID-sini sabitləyə bilər. Cavab `message_id`, `transaction_hash`, `status`, `pacs002_code` və həll olunmuş reyestr/hesab/aktiv konteksti ilə `202 Accepted` olur.

### İştirakçı Avtorizasiyası və Həyat Sikli Mülkiyyəti {#participant-authorization-and-lifecycle-ownership}

Hər aktiv körpünün iştirakçı kataloqu vardır. Hər iştirakçı qeydi unikal iştirakçı ID-sinə, bir və ya bir neçə operator açıq açarına, bir və ya bir neçə maliyyə identifikatoruna, icazəli-profil dəstinə və `originator`, `counterparty` və ya hər iki rola malikdir. Operator düymələri və maliyyə identifikatorları birdən çox iştirakçıya aid ola bilməz. `audit_admin_keys`-i ayrıca konfiqurasiya edin; audit-admin düyməsi həm də iştirakçı mutasiya düyməsi ola bilməz.

Bütün ISO marşrutları üçün yeni operator imzası tələb olunur. İlkin `pacs.008`, `pacs.009`, `sese.023` və ya `colr.012` təqdimatı üçün təsdiqlənmiş operator tətbiq başlığı `From` maliyyə şəxsiyyətində göstərilən iştirakçıya aid olmalıdır. `To` şəxsiyyəti `counterparty` roluna malik təyin olunmuş iştirakçıya uyğun olmalıdır və seçilmiş profil hər iki tərəf üçün icazəli olmalıdır. Dayanıqlı qəbul qeydi başlanğıc, qarşı tərəf, qəbul edən iştirakçı və operator açarını, həmçinin ilkin profili və daxili imza siyasətini qeyd edir.

Həyat dövrü icazəsi çağırış edən tərəfindən seçilən dəyərlərdən deyil, həmin dəyişməz qeyddən əldə edilir:

|Həyat dövrü mesajı|Tələb olunan iştirakçı|
| ---------------------------------------------- | -------------------------------------------------- |
| `pacs.002`, `pacs.004`, `sese.024`, `sese.025` | `counterparty` roluna malik orijinal tərəfdaş|
| `camt.056`                                     | `originator` rolu olan orijinal yaradıcı|

Əsas profil və imza siyasəti bütün həyat dövrü boyunca sabit qalır, buna görə də zəng edən şəxs yeniləmə üçün zəif profil seçə bilməz. `pacs.002` kodu nümayiş etdirir Maliyyə əməliyyatının həlli (`ACSC`, `ACCP`, `SETT` və ya `SETTLED`) yalnız Torii əməliyyat sübutunu yekunlaşdırdıqda ilkin qeydi həll olunmuş kimi dəyişdirir.

İlkin tərəflərin hər biri öz mesaj qeydini və yaradılmış çıxış sənədlərini oxuya bilər. Audit son nöqtəsi yalnız autentifikasiya edilmiş iştirakçının göndərən və ya qarşı tərəf olduğu qeydləri qaytarır. Ayrıca konfiqurasiya edilmiş audit inzibatçısı qlobal, yalnız oxuma üçün audit görünüşü əldə edir və mesaj göndərə və ya dəyişə bilməz. Naməlum iştirakçılar və əlaqəsiz mesaj identifikatorları açıqlanmır.

### Davamlı Təkrar Oynatma Şəxsiyyəti və İmzalanmış Çıxış Qutusu Sənədləri {#durable-replay-identity-and-signed-outbox-documents}

Təkrar oynatma davamlı silinmə işarələri ciddi qəbul sərhədidir. Torii oxuna bilməyən, həddən artıq böyük, pozulmuş, səhv adlandırılmış, ziddiyyətli və ya açıq şəkildə uyğun olmayan davamlı silinmə işarəsi üçün başlamanı ləğv edir. O həmçinin açıq-aydın uyğun olmayan sxem versiyasına sahib zəngin qeydlər, mövcud konfiqurasiyada olmayan iştirakçı, profil və ya imza siyasəti, ya da itkin və ya uyğunsuz canlı davamlı silmə markerinə görə də dayandırılır.

Digər zəngin qeyd zədələri fərqli şəkildə işlənir: oxunmaz və ya çox böyük fayllar, etibarsız JSON, etibarsız cari sxem qeydləri, tək protokol-standart olmayan fayl adları və toqquşan təkrar oynatma kimlikləri qeydə alınır və ya keçilir. Oxunmaz və ya etibarsız cari versiya audit indeksi saxlanılan qeydlərdən yenidən yaradılır; yalnız açıq-aşkar uyğunsuz audit indeksi versiyası başlanğıcı dayandırır. Başlatma qeydlərini izləyin və hər bir pozulmuş zəngin-şəhadə faylının nodun xidmət göstərməsinə mane olduğunu fərz etmək əvəzinə yenidən yaradılmış audit texniki manifesti uzlaşdırın.

Hər saxlanılan zəngin qeyd dəyişməz iştirakçı mənşəyini qoruyur. Ayrı, davamlı silmə markerı mesaj ID-si, yük kriptoqrafik hash-i, biznes mesaj ID-si və UETR daxil olmaqla tam deduplikasiyanı TTL zəngin qeyd detalları təmizləndikdən sonra belə saxlayır.

Torii bir həyat dövrü mesajını imzalamadan və ya işlətmədən əvvəl təkrar yayın qəbulunu davam etdirir. Heç vaxt müddəti bitməmiş təkrar yayım şəxsiyyətini çıxarmır. Əgər təyin edilmiş tutum tamamilə qorunan qeydlər və ya müddəti bitməmiş təkrar oynatma identitetləri ilə məşğuldur, təqdimatlar həyat dövrünü və ya hesablama vəziyyətini dəyişdirmədən təkrar cəhd edilə bilən `503 Service Unavailable` alır.

Hər yaradılan `pacs.002`, `pacs.004`, `camt.029`, `sese.024` və ya `sese.025` sənəd bu cavab başlıqları ilə `application/xml` olaraq qaytarılır:

|Başlıq|Mənası|
| ------------------------------ | ----------------------------------------------------- |
| `X-Iroha-Iso-Signature-Domain` |Həmişə `iroha.iso20022.outbound.v2`|
| `X-Iroha-Iso-Signer`           |tənzimlənmiş körpü kriptoqrafik imzalayan üçün tək protokol-standart açıq açar|
| `X-Iroha-Iso-Signature`        |Domen-ayrılmış XML baytlar üzərində Base64 imzası|

İmzanı UTF-8 bayt ardıcıllığı `iroha.iso20022.outbound.v2`, bir sıfır baytı və dəqiq cavab bədəni üzərində təsdiqləyin. Təstiqləməzdən əvvəl XML-ni yenidən formatlaşdırmayın və ya normalizasiya etməyin.

### Əlavə Parslayıcı və Xəritələmə Dəstəyi {#additional-parser-and-mapping-support}

IVM ISO köməkçisi həmçinin verilənlər konteynerinin doğrulanması, maliyyə əməliyyatı həlli xəritələşdirilməsi və ya aşağı axın uyğunlaşdırılması üçün aşağıdakı mesaj ailələrini təsdiqləyir və materiallaşdırır. Onların ayrıca Torii marşrutları yoxdur.

|Mesaj ailəyə|Cari dəstək|
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `head.001`                         |Biznes tətbiqi başlıq yoxlaması ISO məlumat konteynerləri üçün, o cümlədən `BizMsgIdr`, `MsgDefIdr`, yaradılma vaxtı və istəyə bağlı göndərən/qəbul edən BIC sahələri|
| `pacs.007`, `pacs.028`, `pacs.029` |Ödənişin geri qaytarılması, status sorğusu və araşdırma nəticəsinin/statusun təhlili|
| `pain.001`, `pain.002`             |Müştəri ödənişinin başlanması və ödəniş vəziyyəti hesabatının yoxlanılması|
| `camt.052`, `camt.053`, `camt.054` |Hesab hesabatının, bəyanatın və bildirişin təsdiqi|

## Kaigi Sessiyalar {#kaigi-sessions}

Kaigi SORA Nexus üzərində ödənişli, real-vaxt audio/video otaqları təqdim edir. Bütün konfrans vəziyyətini off-chain saxlamaq əvəzinə, tətbiqdə blokçeyn dəftəri dəstəyi ilə sessiya yaradılması, iştirakçı siyahısının dəyişdirilməsi, relé texniki manifestləri, şifrələnmiş siqnal ötürülməsi və istifadənin ölçülməsi lazım olduqda istifadə edin.

Blockchain dəftərxanasının həyat dövrü ilə qarşılıqlı əlaqə belədir:

- `CreateKaigi`: bir domen altında zəng yaradın və onun siyasətini, cədvəllərini, metaverilərini və istəyə bağlı ötürücü texniki manifestini saxlayın.
- `JoinKaigi`: zəng siyahısını yeniləyin. `zk-roster-v1` rejimində, ictimai zəng görünüşü iştirakçı hesab ID-ləri əvəzinə kriptoqrafik öhdəlik dəyərini və ləğvedici saylarını göstərir.
- `LeaveKaigi`: iştirakçını çıxarın. `zk-roster-v1` rejimində iştirakçı çıxışı sübut edir; bu, onun siyahıdakı kriptoqrafik öhdəlik dəyərini silir və ləğvedici qeyd edir.
- `RecordKaigiUsage`: ölçülmüş müddət və əməliyyat icra xərclərinin cəmlərini əlavə et.
- `EndKaigi`: sessiyanı bağlayın və son zaman möhürünü qeyd edin.

Torii aşağıdakı tətbiqə yönəlmiş oxumaları aşkar edir:

|Marşrut|Təsdiqləmə|Məqsəd|
| ----------------------------------- | --------------------------------------- | ------------------------------------------ |
| `/v1/kaigi/calls/{call_id}`         |ictimai|cari zəng qeydi|
| `/v1/kaigi/calls/{call_id}/participation` |tək protokol-standart dəqiq-şəbəkə hesab sorğusu|imzalayan çağıranın öz iştirak vəziyyəti|
| `/v1/kaigi/calls/{call_id}/signals` |tək protokol-standart dəqiq-şəbəkə hesab sorğusu|səhifələnmiş yekunlaşdırılmış siqnallaşdırma metadatası|
| `/v1/kaigi/calls/{call_id}/events` |tək protokol-standart dəqiq-şəbəkə hesab sorğusu|zəng həyat dövrü axını|
| `/v1/kaigi/relays`                  |icazə verilmiş operatorun sorğusu|reley xülasəsi|
| `/v1/kaigi/relays/{relay_id}`       |icazə verilmiş operatorun sorğusu|bir relein qeydiyyat və sağlamlıq detalları|
| `/v1/kaigi/relays/health`           |icazə verilmiş operatorun sorğusu|toplu əlaqə sağlamlığı|
| `/v1/kaigi/relays/events`           |tək protokol-standart dəqiq-şəbəkə hesab sorğusu| əlaqə qeydiyyatı və sağlamlıq hadisəsi axını |

Tətbiq API aktiv olmalıdır. Dörd zəng marşrutu `/openapi.json` daxilində deyil: zəng qeydi, iştirak və siqnallar marşrutları yalnız yaradılmış SDKs üçün təqdim olunur, zəng hadisələri axını isə proyeksiya edilmir.

Reley xülasəsi və sağlamlıq marşrutları yalnız oxumaq üçün olsalar da operator səthləridir; imzasız `curl` sorğusu etibarlı əlçatanlıq yoxlaması deyil. Sessiya vəziyyəti həmçinin `KaigiRosterSummary`, `KaigiRelayManifestUpdated`, `KaigiRelayHealthUpdated` və `KaigiUsageSummary` kimi Kaigi domen hadisələri vasitəsilə əks olunur.

### CLI Tüstü Testi {#cli-smoke-test}

UI interfeysini qoşmazdan əvvəl Torii son nöqtəsinin Kaigi əməliyyatlarını qəbul etdiyini yoxlamaq üçün `iroha app kaigi` CLI ilə başlayın. Sürətli başlanğıc əmri konfiqurasiya edilmiş son nöqtədə otaq yaradır, onun zəng identifikatorunu və qoşulma metaməlumatını ekrana çıxarır:

```bash
iroha app kaigi quickstart \
  --domain kaigi.universal \
  --summary-out kaigi-summary.json
```

Ssenarili axınlar üçün otaq həyat dövrünü açıq şəkildə idarə edin:

```bash
iroha app kaigi create \
  --domain kaigi.universal \
  --call-name daily \
  --host <i105-account-id> \
  --privacy-mode transparent \
  --room-policy authenticated

iroha app kaigi join \
  --domain kaigi.universal \
  --call-name daily \
  --participant <i105-account-id>

iroha app kaigi leave \
  --domain kaigi.universal \
  --call-name daily \
  --participant <i105-account-id>

iroha app kaigi record-usage \
  --domain kaigi.universal \
  --call-name daily \
  --duration-ms 120000 \
  --billed-gas 1500

iroha app kaigi end --domain kaigi.universal --call-name daily
```

`--room-policy public` istifadə edin ki, otaqlar relenin izləyici biletləri olmadan açıq olmasını təmin etsin, və ya `--room-policy authenticated` istifadə edin ki, çıxışlar izləyici autentifikasiyasını tələb etsin. Yalnız `--privacy-mode zk-roster-v1` istifadə edin sonra şəbəkədə Kaigi heyət və istifadənin yoxlanılması üçün açarlar konfiqurasiya olunub; əks halda qoşulmalar, ayrılmalar və şəxsi istifadə qeydləri deterministik yoxlamada uğursuz olur.

### JavaScript İnteqrasiya {#javascript-integration}

Hazırkı [Iroha JavaScript demosu](https://github.com/soramitsu/iroha-demo-javascript) şəffaf, autentifikasiya olunan təkbətək görüş profilini həyata keçirir. O, protokolun `zk-roster-v1` sübut axınını təqdim etmir. Renderer WebRTC təklif və cavablarını yaradır; imtiyazlı körpü isə Kaigi əməliyyatlarının ödənişini hesablamaq, onları imzalamaq, təqdim etmək və yekunlaşmasını gözləmək üçün yerli [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js) mənbə kodu iş nüsxəsindən istifadə edir.

Dəqiq marşrut təsdiqi, dəvət formatı, körpü sərhədi və cari demo test əmrləri üçün [Kaigi ilə JavaScript Tətbiqinə yerləşdirin](/az/guide/tutorials/kaigi.md)-a baxın.

## Vəziyyət və Ölçülər {#status-and-metrics}

Vəziyyət və metrik son nöqtələri idarəetmə panellərinə ilk qoşulmalı mənbələrdir:

- `/status` yüksək səviyyəli şəbəkə bərabəri, blok, növbə və konsensus sahələrini göstərir
- `/metrics` Prometheus sayğaclarını, göstəricilərini və tarixçilərini nümayiş etdirir

SORA Nexus marşrutlaşdırması məcburidir. Vəziyyət çıxışı konfiqurasiya edilmiş məlumat məkanlarını və zolaqları ehtiva edir; bildirilən topologiyanı onların kataloqları və təsdiqlənmiş marşrut vəziyyəti müəyyən edir.

## JSON və Norito {#json-vs-norito}

Bir neçə operator son nöqtəsi standart olaraq Norito qaytarır. Son nöqtə JSON-u dəstəkləyirsə, bunu göndərin:

```http
Accept: application/json
```

Bu xüsusilə bunlar üçün faydalıdır:

- `/v1/sumeragi/status`
- `/status`

Son nöqtə birbaşa tipləşdirilmiş Norito qəbul edir və ya qaytarırsa, məzmun növü və ya üstün tutulan `Accept` qiyməti kimi `application/x-norito` istifadə edin. Ötürmə detalları üçün [Norito](/az/reference/norito.md#torii-and-norito-rpc) bölməsinə baxın.

## Telemetriya Profilləri {#telemetry-profiles}

Son nöqtələrin görünməsi qovşağın kök səviyyəli `telemetry_profile` parametrindən asılıdır. Hazırkı konfiqurasiya beş profil səviyyəsi təqdim edir:

|Profil| `/status` | `/metrics` |Tərtibatçı marşrutları|
| ----------- | --------- | ---------- | ---------------- |
| `disabled` |xeyr|xeyr|xeyr|
| `operator` | bəli |xeyr|xeyr|
| `extended` | bəli | bəli |xeyr|
| `developer` | bəli |xeyr| bəli |
| `full`      | bəli | bəli | bəli |

## CLI Qısayollar {#cli-shortcuts}

`iroha` CLI artıq bu son nöqtələrin çoxunu örtük interfeysləri ilə təqdim edir:

```bash
export IROHA_OPERATOR_KEY_FILE=/run/secrets/iroha/operator.key

iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi diagnostics
iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  ops sumeragi params
iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi evidence count
```

## Yuxarı Axın İstinadları {#upstream-references}

- [README API və müşahidəlik icmalı](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/README.md)
- [ISO 20022 körpü tətbiqi](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii/src/iso20022_bridge.rs)
- [Performans və göstəricilər](/az/guide/advanced/metrics.md)
