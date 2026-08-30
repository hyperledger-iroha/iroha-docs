---
translation_locale: az
translation_source: /blockchain/sora-nexus-services.md
translation_source_hash: 0dcdda5185d25e113fb636b8b2aede6081ca8ee89b8b38c50b69fed88622df49
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SORA Nexus Xidmət {#sora-nexus-services}


SORA Nexus Iroha 3 ətrafında tətbiqə yönəlmiş xidmət təyyarələrini əlavə edir. Bu xidmətlər ayrı bir kitabxana deyil. Onlar Iroha dünya dövlətləri, Norito manifestləri, idarəetmə qeydləri və Torii marşrut ailələri ilə bağlanır.

Mövcudluq qovşaq quruluşuna və şəbəkə profilinə bağlıdır. Məqsəd qovluğunda istehsal olunan tətbiq-API yollarını aşkar etmək üçün [ `/openapi`](/az/reference/torii-endpoints.md#app-and-sora-route-families) istifadə edin. İctimai yerli SoraFS CID və tanınmış marşrutlar bu yaradılan sənədin xaricində quraşdırılır, buna görə də bir yerləşdirməni yoxlayınca həmin marşrutları birbaşa araşdırın.

## Komponent xəritəsi {#component-map}

|Komponent |Rolu |Əsas səthlər |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
|Soracloud |Tətbiqlərin tətbiqi, ev sahibliyi edilən xidmətlər, özəl model/iş vaxtı vəziyyəti və xidmət həyat dövrü nəzarəti. |`/v1/soracloud/`, `/api/`, `iroha app soracloud ...` |
|İçəridə.|Soracloud canlı HTTP təyyarəyə ehtiyacı olan xidmət tənzimləmələri üçün ev sahibliyi edilən HTTP iş vaxtı. |Soracloud icra vaxtının quruluşu, host imkanları reklamları, replika icra zamanı vəziyyətində |
|SoraNet |Dairələr üçün məxfilik və nəqliyyat örtüyü, relay trafiki, VPN, Qoşulma seansları və axın marşrutları.|`/v1/connect/`, `/v1/vpn/`, SoraNet marşrut metadataları |
|Məlumatların mövcudluğu (DA) |Nexus zolaqlar, SoraFS manifestləri və sübut axınları ilə istinad edilən pay yükləri üçün mövcudluq sübutları, öhdəlik və niyyət qatı. |`/v1/da/`, `FindDaPinIntent`, `[sumeragi.da]` |
|SoraFS |Manifestlər, CAR paylı yüklər, sabitləşdirilmiş məzmun, qapı alınması və bərpa olunma sübutları axınları üçün məzmunu ünvanlanmış saxlama materialı. |`/v1/sorafs/`, `/sorafs/`, `FindSorafsProviderOwner` |
|SoraDNS |SORA ev sahibliyi edilən xidmətlər və məzmunlar üçün təyinatlı adlandırma və həllçi attestasiyası qatı. |`/v1/soradns/`, `/soradns/`, həllçi lüğət hadisələri |
|Aitai |Tətbiq səviyyəli fiat və aktivlərin hesablanması koridoru, ayrı bir kitabxana ilə deyil, yerli depozit qeydləri ilə dəstəklənir. | `OpenAssetEscrow`, `FindAssetEscrow*`, `EscrowEventFilter`, Kotodama `escrow_*` binalar |

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

## Ümumi axınlar {#common-flows}

### Hosted Split tətbiqi {#hosted-split-application}

Tipik bir qarışıq təyyarə tətbiqi bütün parçaları birlikdə istifadə edir:

1. Statik frontend aktivləri SoraFS vasitəsilə paketlənir və bağlanır.
2. Məsələn, ictimai ev sahibi `<app>.sora`, SoraDNS vasitəsilə qeydiyyatdan keçirilir.
3. Soracloud yolları `/api/v1/search` və ya `/api/v1/stream` ilə Inrou HTTP xidməti.
4. Soracloud yolları `/api/auth` və `/api/v1/user` deterministik IVM idarəçilərinə.
5. Gizlilikə ehtiyacı olan müştərilər eyni məzmuna və ya API marşrutuna SoraNet dairəsi vasitəsilə daxil ola bilərlər.

|Yol.|Arxa təyyarə.|Niyə?|
| ----------------- | --------------------- | ------------------------------------------------- |
| `/`               |SoraFS statik məzmun |Yeniləməli məzmunun kök və qapı saxlanılması |
|`/assets/*` |SoraFS statik məzmun |Məzmunla ünvanlanan aktivlər və açıq sübutlar |
|`/api/auth*` |Soracloud IVM |Yenidən oynamaq üçün təhlükəsiz yazıçı və cüzdanı çağırış halı |
|`/api/v1/user*` |Soracloud IVM |İdarəetmə üçün həssas dövlət mutasiyaları |
|`/api/v1/search*` |Soracloud Inrou |Canlı HTTP xidməti, saxlama, SSE və ya toplayıcı vəziyyət |

### Mətn nəşri {#content-publication}

SoraFS nəşri onlara bir ad göstərilmədən əvvəl davamlı əşyalar istehsal edir:

1. Faydalı yük və ya dizayn yaratın.
2. CAR bir arxivə yığın və parça planı.
3. Bir Norito manifestini pin siyasəti və idarəetmə məlumatları ilə qurun.
4. Manifesti Torii ünvanına təqdim edin.
5. Hədəf profili açıq sübut tələb edərkən DA pin niyyətini və ya mövcudluğun öhdəliyini qeyd edin.
6. Manifesti SoraDNS adına və ya Soracloud statik frontend marşrutuna bağlayın.

### Şəxsi gəzinti və ya axın yolu {#private-fetch-or-streaming-route}

SoraNet SoraFS və ya Soracloud qarşısında otura bilər:

1. Müştəri adı və ya manifestini həll edir.
2. Mühafizə direktoru və ya marşrut manifestində giriş və çıxış relayləri seçilir.
3. Nəqliyyat yığılır və SoraNet dairəsi vasitəsilə göndərilir.
4. Çıxış relayı SoraFS qapısına, Torii axınına və ya Soracloud marşrutuna çatır.

## Aitai {#aitai}

Aitai SORA tətbiqi koridoru bazar üslubunda ödənişlər üçün bir alıcı və satıcının zəncirdən kənarda ödənişi əlaqələndirdiyi, lakin Iroha isə Yeni rəqəmli aktivlərin saxlama axınları üçün müqaviləyə məxsus bir əmanət hesabı əvəzinə yerli escrow instruction ailəsi istifadə edilməlidir.

Native escrow kitabda saxlayır. Satıcı `OpenAssetEscrow` ilə təklif açır, alıcı `AcceptAssetEscrow` və `MarkEscrowPaymentSent` ilə zəncirdən kənarda ödənişi qəbul edir və qeyd edir; Satıcı `ReleaseAssetEscrow` ilə buraxır və ya ödəniş işarələnmədən əvvəl ləğv edir. Alıcı və satıcı razılaşmasa, hər iki tərəf mübahisə aça bilər və `CanResolveEscrowDispute` ilə həlli edən qapalı məbləği paylaya bilər.

Bütün həyat dövrü, ümumi aktivlər bağlamaları, anonim depozitlər, sorğular, hadisələr və Rust nümunələri üçün [Native Asset Escrow](/az/blockchain/escrow.md)-yə baxın.

|Aitai səth|Bunu istifadə edin.|
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
|`OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow` |XOR nominal hesablama axınları da daxil olmaqla, şəffaf sayısal aktiv təklifləri. |
|`OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow` |Mühafizə olunmuş təkliflər maliyyələşdirmə və bağlanma hərəkətləri üçün sübut əlavələrindən istifadə edir. |
|`OpenEscrowDispute`, `ResolveEscrowDispute`, `OpenAnonymousEscrowDispute`, `ResolveAnonymousEscrowDispute` |Mübahisələrin açılması və məhkəmə üslubunda həll edilməsi. |
|`FindAssetEscrowById`, `FindAssetEscrowsBySeller`, `FindAssetEscrowsByBuyer`, `FindAssetEscrowsByStatus` |App status səhifələri, uyğunlaşdırma işləri və dəstək vasitələri. |
|`EscrowEventFilter` |Yaşayış şəffaf escrow abunələri escrow id, satıcı, alıcı, status və ya hadisə növü ilə. |
| Kotodama `escrow_open_offer`, `escrow_accept`, `escrow_mark_payment_sent`, `escrow_release`, `escrow_cancel`, `escrow_open_dispute`, `escrow_resolve_dispute` |Kotodama müqavilə çağırışları V1 əmanət sistemi tərəfindən təsdiqlənir. |

İctimai Taira və ya Minamoto istifadəsi üçün, zəncirdən kənar ödəniş rayonu və hər hansı bir dəstək və ya məhkəmə iş axını tətbiq siyasəti kimi qəbul edin. Iroha saxlama vəziyyətini, həyat dövrü hadisələrini, sübut hashlərini və yekun aktiv hərəkətini qeyd edir; o, fiat hesablanmasını özbaşına yoxlamır.

## Hədəf Qeydiyyatını yoxlayın {#check-a-target-node}

Bu səhifədən nümunələrdən istifadə etməzdən əvvəl, hədəflədiyiniz düyündə yol ailəsinin mövcud olduğunu təsdiqləyin:

```bash
export TORII_URL=https://taira.sora.org

curl -fsS "$TORII_URL/openapi.json" \
  | jq '.paths | keys[] | select(test("^/v1/(soracloud|sorafs|soradns|connect|vpn|da)/"))'

curl -fsS -H 'Accept: application/json' "$TORII_URL/status" | jq .
```

Profil tərəfindən `/openapi.json` ifşa edilmirsə, `/openapi` cəhd edin. Düzgün marşrutun mövcudluğu quraşdırma xüsusiyyətlərindən və şəbəkə konfigurasiyasından asılıdır. Sənəddə ictimai yerli SoraFS CID və tanınmış marşrutlar siyahıya alınmır; aşağıda təsvir edildiyi kimi bu son nöqtələrini birbaşa yoxlayın .

### Taira Yalnız oxumaq üçün siqaret yoxlamaları {#taira-read-only-smoke-checks}

İctimai Taira son nöqtəsi oxunma tərəfi yoxlamaları üçün faydalıdır, ancaq ictimai testnet vəziyyətini dəyişdirmək niyyətində olan və icazəli hesabı idarə etmədiyiniz təqdirdə mutasiya edən nümunələr üçün istifadə etməyin.

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

Taira yerləşdirilmə xüsusi idarəetmə təyyarəsinin yollarını aşkar edə bilər ki, bunlar OpenAPI yol xəritəsində qeyd edilmir. `/openapi` tərkibindəki yollar üçün yaradılmış müqavilə kimi qəbul edin və sonra yerləşdirilməyə xüsusi və ictimai yerli SoraFS yolları mövcud olduğu kimi sənədləşdirmədən əvvəl dərhal təsdiqləyin.

## Soracloud {#soracloud}

Soracloud SORA tətbiqi nəzarət təyyarəsidir. İstifadə paketlərini, xidmət tənzimləmələrini, marşrutlamasını, tətbiq vəziyyətini, etibarlı quruluş girişlərini, şifrələndirilmiş xidməti sirlərini, modelləri qeydiyyat qeydlərini, özəl nəticə seanslarını və icra vaxtının qəbulu ilə izləyir.

Soracloud iki həyata keçirmə təyyarəsini istifadə edir:

|İcra təyyarəsi |İndirmə vaxtı |Bunu istifadə edin.|
| ---------------------- | ------- | -------------------------------------------------------------------------------------------- |
|`DeterministicService` |`Ivm` |Müəllif, xəzinə vəziyyəti, təsdiqlənmiş oxumalar, sifariş edilmiş poçt qutusu işçiləri, idarəetmə həssas mutasiyaları |
|`HttpService` |`Inrou` |Canlı HTTP APIs, toplayıcı ağır iş, saxlama ilə dəstəklənmiş xidmətlər, SSE, brauzerlə dəstəkləyən axınlar |

Nəzarət təyyarəsi səlahiyyətlidir. Deploy, upgrade, rollback, config, secret, model və status əmrləri Torii vasitəsilə göndərilir və öhdəsindən gəlmiş dünya vəziyyətini oxuyur; onlar ayrı bir CLI - yerli güzgüdən asılı deyil. İctimai marşrut ən uzun prefiks əsaslanır, buna görə bir qeydiyyata alınmış ev sahibi trafikini ev sahibliyi edilən HTTP marşrutları və müəyyənləşdirilmiş API marşrutlar arasında bölə bilər.

### Fərqli bir tətbiqi düzəldin {#scaffold-a-split-app}

Split-app şablon statik frontend əlavə bir hosted canlı API və bir deterministic vault/API xidməti yaratır:

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

`local-plan` marşrut bölünməsi, uşaq xidməti manifestləri, iş məkanı skript yolları və gözlənilən frontend nəşriyyat rejimi çap edir. `doctor` yerli buraxılış müqaviləsini Torii iştirak etməzdən əvvəl təsdiqləyir.

### İstifadəçi tətbiqinin vəziyyətini təyin və yoxlayın {#deploy-and-inspect-app-state}

```bash
export SORACLOUD_TORII_URL=https://<soracloud-enabled-torii>

iroha app soracloud app deploy \
  --manifest ./apps/solswap-indexer/app_manifest.json \
  --torii-url "$SORACLOUD_TORII_URL"

iroha app soracloud app status \
  --manifest ./apps/solswap-indexer/app_manifest.json \
  --torii-url "$SORACLOUD_TORII_URL"
```

Artıq yerləşdirilmiş bir xidmət üçün xidmətin həcminə uyğun əmrlərdən istifadə edin:

```bash
iroha app soracloud status \
  --service-name solswap_indexer_live \
  --torii-url "$SORACLOUD_TORII_URL"

iroha app soracloud rollback \
  --service-name solswap_indexer_live \
  --target-version 0.1.0 \
  --torii-url "$SORACLOUD_TORII_URL"
```

### Gizli və gizli materiallar {#config-and-secret-material}

Soracloud konfig və gizli girişlər səlahiyyətli yerləşdirmə vəziyyətinin bir hissəsidir. İstifadə, yeniləmə və geri qaytarma tələb olunan konfig və ya gizli bağlamalar yoxdursa və ya aktiv manifestlərlə uyğun olmayan zaman bağlanmır.

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

Profiliniz üçün tələb olunan dəqiq etibarnamə bayraqları üçün CLI köməkliyindən istifadə edin:

```bash
iroha app soracloud config-set --help
iroha app soracloud secret-set --help
```

## İnrou {#inrou}

Inrou ev sahibliyi edir. HTTP İstifadə olunan vaxt Soracloud. Bir Iroha əhatə olunmuş dərəcəsi Soracloud İndirmə vaxtı layihələri qəbul edilmişdir Soracloud Yerli materiallaşdırma planına daxil olunaraq, təyin edilmiş hosted-servis repliklərini loopback xidmətləri kimi başlatır. və etibarlı modelə təkrarlanan iş vaxtı vəziyyətini bildirir.

Bir canlı HTTP səthə ehtiyacı olan iş yükləri üçün Inrou-dan istifadə edin, məsələn, toplayıcı ağır APIs, SSE axınları, saxlama dəstəkləyən idarəetmə cihazları və ya brauzer dəstəklənmiş xidmətlər.

### İdarəetmə vaxtı tələbləri {#runtime-requirements}

- Konteyner manifestinin işləmə vaxtı `Inrou` olmalıdır.
- Xidmət manifestinin icra təyyarəsi `HttpService` olmalıdır.
- `HttpService + Inrou` dəqiq bir `PersistentRootLeaseVolume` tələb edir ki, `/`-də quraşdırılsın.
- Yenilənmiş Inrou xidmətləri dəyişən paylaşılan vəziyyətdə saxlandıqda, həmçinin ortaq xidmətin və ya məxfi kirayə saxlanmasının ehtiyacına malikdirlər.
- İstehsalat hostinq qovşaqları yalnız bir proxy kimi fəaliyyət göstərmək əvəzinə real Inrou qabiliyyətini reklam etməlidirlər.

### Məlum bir parça {#manifest-fragment}

Aşağıdakı nümunə iki manifestin formasını göstərir. Bu bir parçadır, tam yerləşdirmə paketi deyil.

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

İdarəetmə müddətində hər bir quraşdırılmış kirayə həcmi, həcm adından alınan ətraf mühit dəyişənləri vasitəsilə açıqlanır:

```text
SORACLOUD_LEASE_VOLUME_ROOT_DISK_DIR
SORACLOUD_LEASE_VOLUME_ROOT_DISK_MOUNT_PATH
SORACLOUD_LEASE_VOLUME_INDEX_STATE_DIR
SORACLOUD_LEASE_VOLUME_INDEX_STATE_MOUNT_PATH
```

## SoraNet {#soranet}

SoraNet məxfilik və nəqliyyat üst örtüsüdür. O, hədəf qapısı və ya xidməti ilə birbaşa bağlanmamalı olan trafik üçün relye əsaslı marşrutlar təmin edir. Nəqliyyat dizaynında giriş, orta və çıxış relay rolları, QUIC nəqliyyat, səs-küylü əsaslı hibrid əl sıxması, qabiliyyət danışıqları, relay direktoru metadataları və sabit ölçülü doldurulmuş hüceyrələr istifadə olunur.

Nexus yerləşdirmələrində, SoraNet məzmun alımlarını, qapı trafikini, VPN və ya Connect seanslarını və Norito axın yollarını daşıya bilər. Dizayn girişləri `norito-stream` dəstəkləyən relayları işarələyə bilər ki, bu da müştərilərə Torii RPC və ya axın trafikinə uyğun yolları üstün tutmağa imkan verir.

### Axtarış Konfigurasiyası {#streaming-configuration}

Nexus profili SoraNet axın marşrutları üçün təchizatı təmin edir:

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

İzləyicinin təsdiqlənməsini tələb etməyən məzmun marşrutları üçün `access_kind = "read-only"` istifadə edin. `authenticated`-dən istifadə edin, çıxış relayı Torii və ya bir ev sahibliyi xidmətinə keçiddən əvvəl biletləri və ya izləyicinin kimliyini tətbiq etməlidir.

### SoraNet-Fəaliyyətli SoraFS Get {#soranet-aware-sorafs-fetch}

İndiki SoraFS gətirmək CLI Yerli proxy manifestini və spool yayıra bilər SoraNet brauzer uzantıları üçün marşrut meta məlumatları və ya SDK Adapterlər, orkestrator. JSON müəyyənləşdirməlidir. `local_proxy` ilə `"emit_browser_manifest": true`, və CLI qurulması lazımdır. `local-quic-proxy` Dəstək. Taira, qəbul edilmiş provayderlərin kataloqunu ictimai testnet kökündə yoxlamaq; sonra həmin provayder üçün verilən qorunan təminatçı tupleyi doldur:

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

Ümumi qeydlər təminatçısının hesabatları, hissə qəbulu, yerli proxy metadataları və çatdırılma üçün istifadə olunan effektiv marşrut parametrləri.

### Relay Incentive Verifier Roster {#relay-incentive-verifier-roster}

İndirim təşviqinin qəbul edilməsi tələb olunan hər bir yoxlama uğurlu olmadıqda sübutları rədd edir. `incentives.enable` doğru olduqda, `incentives.trusted_verifier_ids` ən azı bir kanonik hesab ID ehtiva etməlidir Rost heç vaxt 64 girişdən çox olmamalıdır, hətta təşviqlər söndürülməsə də. Runtime onu təyinatlı bir sıra olaraq saxlayır və relye başlanğıcı zamanı etibarsız rostar geometriyasını rədd edir.

Hər `RelayBandwidthProofV1` sabit bir çərçivə / təyinat büdcəsi ilə dekodlaşdırılır və bütün çərçiliyi istehlak etməlidir. Sığortanın təsdiqləyici hesabı qurulmuş siyahıda olmalıdır və `RelayBandwidthProofV1::verify_signature()` relay qapanmadan və ya performans akkumulyatorunu dəyişdirmədən əvvəl uğurlu olmalıdır. Relay etibarsız bir imzaçıya və ya imzalanmayan / saxtalaşdırılmış sübutlara diqqət yetirmir. Belə bir sübut heç bir ölçmə əlavə etmir və təşviq fotoşəkillərini yarada bilməz.

## Məlumatların mövcudluğu (DA) {#data-availability-da}

DA dünya vəziyyətində birbaşa yerləşdirilməsi üçün çox böyük, məxfiliyə həssas və ya xidmətə xüsusi olan paylı yüklər üçün mövcudluğun sübut qatıdır. Deterministik öhdəlikləri və geri alınma öhdəliyi qeyd olunur ki, təsdiqləyicilər, qapı vasitələri və müştərilər hansı baytların vəd olunması, hansı siyasət tətbiq edilməsi və hansı sübutların müşahidə edildiyi barədə razılaşa bilərlər.

DA Kura və SoraFS əvəz edilmir:

- Kura blok axını və konsensus bərpası məlumatlarını saxlayır.
- SoraFS məzmun ünvanlı baytları, CAR payloadları və manifestləri saxlayır və xidmət edir.
- DA öhdəlikləri, sübut siyasətlərini, sübut açılışlarını və bu baytların planlaşdırılmasına, audit edilməsinə və kitabın vəziyyətinə bağlanmasına imkan verən pin niyyətlərini qeyd edir.

DA tətbiqi və ya Nexus zolağı istifadə etmək üçün əsas kitabda görünən vəd lazımdır ki, zəncirdən kənar məlumatlar geri alına bilər. Ümumi nümunələr arasında ödəniş axınları üçün zolaq pay yükü öhdəlikləri, nəşr edilmiş məzmun üçün SoraFS pin niyyətləri var; Sonrakı yoxlama üçün saxlanılması lazım olan sübut qutusları və ictimai vəziyyətində tam yük deyil, həzm olunması lazım olan tətbiq əşyaları.

### Həyat dövrü {#lifecycle}

|Səhnə |Qeyd olunanlar |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
|Niyyət |Bir bilet, manifest istinadı, alias, zolaq / dövr / ardıcıllıq istinadları, saxlama siyasəti və ya replikasiya məqsədi. |
|Məsuliyyət |Manifesti, yol yükünü, sübut dəstini və ya məzmun kökünü kitabın görünən qeydinə bağlayan materialı aşkarlayın. |
|Düzü .|Mövcudluq səsləri, sübut açılışları, təchizatçı attestasiyası və ya hədəf şəbəkəsi tərəfindən qəbul edilmiş digər profilə aid dəlillər. |
|Sual |`FindDaPinIntentByTicket`, `FindDaPinIntentByManifest`, `FindDaPinIntentByAlias` və ya `FindDaPinIntentByLaneEpochSequence` vasitəsilə qapaq niyyətli axtarışlar. |

DA ilə dəstəklənən ümumi nəşriyyat axını:

1. WSV xaricindəki paylı yükü, məsələn SoraFS CAR faylını və ya Nexus yol paylı yükünü qurmaq və ya qəbul etmək.
2. Norito manifestində və ya marşrut xüsusi öhdəlik qeydində paylı yükün təsvir edilməsi.
3. `/v1/da/*` vasitəsilə və ya şəbəkənin imzalanmış əməliyyat yolu vasitəsilə bu marşrut ailəsi aktivləşdirildiyi zaman manifest, pin niyyətini və ya öhdəliyi göndərin.
4. Müddətçilərin və ya mövcudluq təminatçılarının aktiv sübut siyasəti ilə tələb olunan sübutları toplamalarına icazə verin.
5. Bir əlifba, ödəniş sübutu və ya faydalı yükdən asılı olan qapı yolu təbliğ etməzdən əvvəl nəticədəki pin niyyətini və ya öhdəliyini soruşun.

### Alqoritmik Model {#algorithmic-model}

DA bir faydalı yükü imzalanmış, yenidən oynatma ilə qorunan, blok-indeksiyalı bir öhdəliyə çevirir. Əhəmiyyətli alqoritmlər müəyyənləşdirilir ki, təsdiqçilər və qapılar eyni baytlardan eyni həcmləri yenidən hesablaya bilərlər.

1. Torii göndərilən paylı yükü kanonikalaşdırır. `(lane_id, epoch, sequence)`, paylı yük baytları, sıxılma metadataları, hissə ölçüsü, silmə profili ilə qəbul edilən istehlak tələbini qəbul edir, Gzip, deflate və ya Zstandard pay yüklərini tələb edildikdən sonra düyünin kanonik bayt uzunluğunun `total_size` bərabər olduğunu yoxlayır.
2. Yolu və hissə parametrlərini təsdiqləyin. Yolu Nexus yol kataloqunda olmalıdır. `chunk_size` iki, ən azı iki bayt olan sıfır olmayan bir güc olmalıdır; və qurulmuş maksimumdan böyük olmur. Təmizləmə profili məlumat parçacıqlarını və ən azı iki paritə parçacığı daxil etməlidir. Yol kataloqunda sübut sxemi seçilir, ya `merkle_sha256` ya da `kzg_bls12_381`.
3. Şəbəkə siyasətini tətbiq edin. Blob sinifi üçün qurulmuş replikasiya və saxlama əsas xəttini qovur. İctimai metadata düz mətn olaraq qalmalıdır; yalnız idarəetmə meta məlumatları manifestə yazılmadan əvvəl nodun qurulmuş idarəetmə metadata açarı ilə şifrələnir.
4. Kanonik pay yükü sabit ölçülü bir profil ilə parçalanır. `chunk_size`. Torii Faydalı yük həzmini, bərpa qabiliyyətinin sübut edilməsi ağacının kökünü və hər hissə üzrə öhdəlikləri hesablayır. BLAKE3 Baytları üzərində öhdəliklər.
5. Təmizləmə öhdəliklərini əlavə edin. Çünklər `data_shards` zolaqlarına qruplaşdırılır. Son zolaqda olmayan hüceyrələr paritənin hesablanması üçün sıfır doldurulur. RS(16) paritə yaratır Satır / qlobal parity shards; seçmə `row_parity_stripes` matris boyunca sütun üslubunda zolaq parity əlavə edin. Parity shard öhdəlikləri BLAKE3 kiçik ədədli `u16` simvollarının həzmidir.
6. Manifesti qurun. `DaManifestV1` yol, dövr, qrup sinifi, kodek, payload digest, parça kök, parça ölçüsü, silinmə profili, saxlama siyasəti, kirayə qiyməti, parça öhdəlikləri, seçim IPA öhdəliyi, metadata və buraxılış vaxtı qeyd olunur. Saxlama biletinin müəyyənləşdirilməsidir: düyün əvvəlcə boş bir biletlə manifest şablonunu hash edir, sonra bu barmaq izi son `storage_ticket` olaraq geri yazır.
7. Yeniləmə münaqişələrini rədd edin. Yeniləmə açarı `(lane_id, epoch, sequence, manifest_fingerprint)`. Eyni barmaq izi olan bir nüsxə idempotentdir. Yaşlı bir ardıcıllıq və ya fərqli barmaq izi ilə eyni ardıcıllık rədd olunur.
8. İmzalanmış əşyaları buraxın. Torii PDP öhdəliyini hesablayır, `DaIngestReceipt` imzalayır, bir `DaCommitmentRecord` tikir və manifest üçün qabıq əşyalarını yazır; PDP öhdəliyi, öhdəlik qeydləri, öhdənim cədvəli, pin niyyəti, qəbulu sənədi və qəbulu günlüğü. Qəbulu kursorunu hər `(lane_id, epoch)` üçün monoton şəkildə inkişaf etdirir.

Əməkdaşlıq qeydləri blokların daşıdığı bir şeydir.

- Yol, dövr və ardıcıllıq
- Çağırıcı blob ID və kanonik manifest hash
- Şəbəkə süqutu sistemi
- ədəd kök
- KZG zolaqları üçün seçməli KZG öhdəlik
- PDP/proof digest
- saxlama sinifi və saxlama biletləri
- Torii DA təsdiq imzası

Bir blok DA qeydlərini yerləşdirmədən əvvəl, blok birləşmə yolu paketini təsdiqləyir:

- `(lane_id, epoch, sequence)` birləşmədə unikal olmalıdır.
- Manifest hashlər sıfır olmayan və qovşaqda unikal olmalıdır.
- Ödəniş sübutı sxemi konfigüratsiya edilmiş zolaq siyasətinə uyğun olmalıdır.
- Merkle zolaqları KZG öhdəliklərini rədd edir; KZG zolaqlar isə sıfır olmayan KZG öhdəliyinə ehtiyac duyurlar.
- Pin niyyətləri linka, manifest hash, saxlama biletləri, sahib hesabı və alias toqquşma qaydaları ilə kanonikalaşdırılır, sıralanır və filtrlənir.

Bloq başlığı DA sübut siyasətləri, öhdəliklər və pin niyyətləri üçün hash saxlayır. üzvlük sübutları üçün öhdəliyin qovluğu da yarpaqları olan Merkle kökünü aşkar edir canonik Norito-kodlanmış `DaCommitmentRecord` dəyərlərinin hashidir. Ana düyünləri sol və sağ uşaqların konkatenasiyasını hash edir; nadir bir yarpaq dəyişmədən növbəti təbəqəyə keçirilir.

### Əldə edilən sübutların yoxlanması {#proof-verification}

`/v1/da/commitments/prove` bir blokda bir öhdəlik üçün sübut təqdim edə bilər. Sübutun öhdəliyi, blok hündürlüyü, qrupdakı indeks, qrup hashı, qrup uzunluğu, Merkle kök və qardaş yolu var. Verifikasiya yoxlamaları:

1. Proof bundle hash blok başlığının DA öhdəlik hashinə uyğun gəlir.
2. Proof blok hündürlüyü istinad edilən blok başlığı ilə uyğun gəlir.
3. İndeks sərhədlərdədir və öhdəlik həmin indeksdəki bağ girişinə bərabərdir.
4. Şəbəkə mühafizəsi siyasəti bu öhdəliyi qəbul edir.
5. Bağlanış yaprağından qardaşı yolunun qatılması təchiz olunmuş kökün yenidən qurulmasını təmin edir.
6. Yenidən qurulan kök birləşmiş köklə bərabərdir.

Bu, müəyyən bir blok pay yükündə xüsusi bir mövcudluq öhdəliyi daxil olduğunu sübut edir; bu, hər bir nüsxənin hazırda onlayn olduğunu sübut etmir. Canlı geri alınma qabiliyyəti SoraFS təchizatçıların aparılması, PDP/PoTR yoxlamaları və ya profilə aid mövcudluq sübutları vasitəsilə ayrı-ayrı yoxlanılır.

### Konsensus Əlaqəsi {#consensus-interaction}

DA etibarlı yayım (RBC) vasitəsilə Sumeragi ilə birləşdirilir, lakin ikinci bitmə protokoludur. RBC təklif pay yüklərini yayır və bərpa edir: təklifçi `(height, view, payload_hash)`, həmyaşıd mübadilə hissələri üçün bir iclas elan edir və `READY`/`DELIVER` siqnalları eyni pay yükünü kifayət qədər təsdiqləyicilərin müşahidə etdiyini izləyirlər.

Iroha 3 -də bir həmyaşıllıq blokun gözlənilirki pay yükünü aşağıdakı hallarda mövcud hesab edir:

- Yerli gözlənilir bloklar hash-i nəzərdə tutulan payload-a hash edir və ya
- RBC blok hash, hündürlük, görünüş və payload hash uyğun bir yük bərpa etdi.

Əgər heç bir şərt təsdiqlənmirsə, həmkarları `missing_local_data` qeyd edir, RBC və ya blok sinxronizasiyası vasitəsilə pay yükünü bərpa etməyə çalışır və DA qapısını status və telemetriya üzrə bildirir. Hal-hazırda həyata keçirilən bu DA siqnalları yekunluq üçün məsləhətlidir: blok hələ də ayrı bir DA quorum sertifikatından deyil, ötürülmə sertifikatından əlavə olan yerli pay yükündən yekunlaşır.

DA vaxtlandırması bərpa pəncərələrini genişləndirir. Effektiv DA quorum müddəti qurulmuş blokdan və hədəfləmə müddətlərindən alınır, sonra `sumeragi.advanced.da.quorum_timeout_multiplier` ilə qatlanır. Mövcudluq müddəti `max(quorum_timeout, availability_timeout_floor_ms) * availability_timeout_multiplier`. Bu mövcudluq müddətinin bitməsindən əvvəl, düyün payload bərpasına üstünlük verir və vaxtından qabaq yenidən planlaşdırılmasını qaçırır; başa çatdıqdan sonra normal bərpa və görünüş dəyişikliyi yolları davam edə bilər.

### Operator qeydləri {#operator-notes}

Iroha 3 konsensus profilləri daxildir RBC-faydalı yükün yayılması, manifest qoruyucusu, DA birləşmələrin təsdiqlənməsi və bərpa telemetriyası. `[sumeragi.da]` Bir blok üçün öhdəliklər və sübut açılışları üzrə məhdudiyyətlər, əlavə `[sumeragi.advanced.da]` Qorum və mövcudluq davranışı üçün vaxt çıxışı qatlayıcıları. Bu parametrləri bir şəbəkədəki təsdiqçilər arasında tutarlı saxlayın Profil.

Marşrut aşkarlanması üçün bağın OpenAPI sənədi ilə başlayın:

```bash
curl -fsS "$TORII_URL/openapi.json" \
  | jq '.paths | keys[] | select(startswith("/v1/da/"))'
```

istifadə edin. [sorğu istinadı](/az/reference/queries.md#nexus-data-availability-and-packages) gedişi üçün DA sorğu adları, və [Peer konfigurasiyası şablonu](/az/reference/peer-config/) Yerli işçilər üçün `[sumeragi.da]` Təsərrüfatınız tərəfindən aşkar edilmiş düymələr.

## SoraFS {#sorafs}

SoraFS mərkəzləşdirilmiş məzmunu ünvanlanan saxlama materialıdır. O, baytları müəyyənləşdirici parçalara, CAR arxivlərə və Norito məzmunu kökləri bağlayan manifestlərə qovurulur. Qazanma təminatçıları məzmunu təqdim etməzdən əvvəl manifestləri və hissə öhdəliklərini təsdiqləyirlər.

Tipik SoraFS İstifadələr arasında statik tətbiq aktivləri, sənədləşdirmə binaları, zona daxildir İdarəetmə və idarəetmə sübutları qrupları. Iroha Məlumat modellərinin məruz qalması SoraFS giriş tədbirləri və [`FindSorafsProviderOwner`](/az/reference/queries.md#nexus-data-availability-and-packages) Təchizatçının mülkiyyətini həll etmək üçün müraciət.

### Testnet Profili Taira {#taira-testnet-profile}

Taira kanonik ictimaiyyətdir SoraFS testnet. Onun verifikasiya edilmiş təsdiqçi profili zəncirdən istifadə edir `fc56984b-2be7-431d-840e-21514d1883f0` və zəncir ayırdçısı `369`. Nəşr olunduğu SoraFS parametrlər aşağıdakılardır:

- şəbəkə ID: `hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94`
- Gateway bazası URL: `https://taira.sora.org`
- çubuq Torii URLs: `https://taira-validator-1.sora.org` vasitəsilə `https://taira-validator-4.sora.org`
- kəşf imkanları: `torii_gateway`, `chunk_range_fetch` və `potr_mldsa`
- təcrid edilmiş məzmun mənşəyi: `https://{cid}.sorafs.taira.sora.org/{path}`
- İctimai pin siyasəti: `require_council_signatures = false` ilə icazəsiz və ödənişli hədəfləndirilmiş

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

Taira təsdiqləyiciləri saxlama, təmir və tullantı toplamaq üçün SoraFS əhatə olunmuşdur. Disk büdcəsi yoxlama; bu, təsdiqləyici saxlama provayderidir demək deyil. Testdən əvvəl hazırda qurulmuş qapı və pin istiqamətlərini oxumaq üçün `GET /v1/sorafs/storage/peers?limit=4` istifadə edin

İndiki `sorafs.sora.org` CID sufiks canlı / istehsal profilidir, yox Taira. İçəri qoymayın. Taira istehsal tətbiqləri öz şəbəkə kimliyindən, idarəetmə açarlarından istifadə etməlidirlər. Təchizatçının qəbul materialı, pin son nöqtələri və güc/bərpa siyasəti; heç vaxt kopyalama. Taira istehsal konfiqurasiyasına verilən etibarnamələr və ya son nöqtə fərziyyələri.

### İctimai Yerli CID və Site Gateways {#public-local-cid-and-site-gateways}

SoraFS imkanlı olan hər bir Torii düyün, seçmə tətbiqi API qurulmadıqda belə bu anonim ictimai marşrutları quraşdırır:

|Metod və son nöqtə |Məqsəd|
| ---------------------------------- | -------------------------------------------------------------------- |
|`GET /.well-known/sorafs/manifest` |Kanonik istək ev sahibi tərəfindən seçilmiş manifesti qaytarın |
|`GET /v1/sorafs/cid/{cid}` |CID üçün məhdudlaşdırılmış yerli manifest metadataları və fayl girişlərini qaytarın. |
|`GET /sorafs/cid/{cid}` |Yerli məzmunla ünvanlanan bir sayt üçün kök sənədinə xidmət edin |
|`GET /sorafs/cid/{cid}/{*path}` |Bu CID altında bir normallaşdırılmış yol və ya bir sərhədləşdirilmiş bayt aralığında xidmət edin. |

Bu yollar heç vaxt `x-sorafs-stream-token` və ya `x-sorafs-token-id` qəbul etmirlər. Hər iki başlıqların mövcudluğu pis bir tələbdir. İctimai oxuma qabiliyyəti; bir saxlama çatışmazlığı uzaqdan provayder hidratasiyasına icazə vermir. Mühafizə olunmuş provayder CAR və parçalı yollar ayrı təsdiq edilmiş protokol səthləri olaraq qalır.

Bayt oxumazdan əvvəl, Torii Yerli manifestin kanonik kodlamasını, semantik məhdudiyyətləri, həzmini və kökünü təsdiqləyir CID. Bundan sonra etibarlı yerli təchizatçı kimliyini, idarəetmənin qəbulunu və manifestə uyğunluğu tələb edir. CID, Qeydiyyat dərəcəsi / qadağan siyasəti effektiv müştərinin ünvanından istifadə edir, ötürülmüş ünvanları yalnız konfigüralaşdırılmış etibarlı proxy vasitəsilə hörmətlə təmin etmək. Əgər siyasət, uyğunluq, şəxsiyyət və ya qəbul dövlətləri yoxdursa, Torii müraciətini rədd edir.

Bir istək sondan sonuna qədər ictimai qapı icazəsinə malikdir; proses üzrə məhdudiyyət 64 eyni vaxtda oxunur, Ətraflı müraciətlərin qaytarılması `503 Service Unavailable` və `Retry-After: 1`. Açıq cavablar 16 ilə məhdudlaşdırılır. MiB, fayl siyahıları əvvəlcədən 50 girişə və ən çox 500-ə qaytarılır və tam fayl və ya bir bayt aralığı 8 ilə məhdudlaşdırılır MiB. Soruşma analizi quruluşa və göndərməyə bağlıdır `app_api` qurmaq, 32 bitlik şifrələnmiş və imzalanmamış bir kod qəbul edir `limit`, digər sorğu açarlarını unudub, sonuncu təkrarlanmasına imkan verir `limit` qalib gəlmək və dəyərini bağlamaq `1..=500`. Heç bir xüsusiyyətsiz minimal quruluş `app_api` yalnız bir kanonik qəbul edir `limit=1..500` bilinməyən, təkrarlanan, yüzdə kodlanmış və ya qeyri-kanonik formaları rədd edir. `limit=<1..500>` Bu birləşmədə aparıcı olan davranışlar üçün cütlük. CIDs, Qonaqlar, yollar və məsafə başlıqları hər iki quruluşda kanonik və tək qiymətlidir. HTML, CSS, JavaScript, SVG, XML, PDF, və ya Wasm məzmun yalnız konfiqurasiya edilmiş bir CID-əldə edilən təcrid edilmiş mənşəli (və ya oraya yönəldilir), bu da bir paylaşılan yol qapısı mənşəlinin etibarsız məzmunu icra etməsinin qarşısını alır.

### Yükləyin, tikin və təqdim edin {#pack-build-and-submit}

Aşağıdakı mutasiya nümunəsində Taira `NetworkId`, pin endpoint, replikasiya mərtəbəsi və idarəetmə siyasəti istifadə olunur. maliyyələşdirilmiş testnet hesabından və yalnız birbaşa sahibi olan açar faylundan istifadə edin. Taira konsey imzalanmadan icazəsiz pinləri qəbul edir, lakin hələ də tənzimlənən ödənişi tələb edir.

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

`manifest submit` `/v1/sorafs/pin/register` tələb edir. Əgər hədəf qovşağı onu yönləndirmirsə, əmr pozulur; ilk buraxılış CLI ümumi `/transaction` son nöqtəsinə geri dönmür.

### Verifikasiya və gətirin {#verify-and-fetch}

Mühafizə olunmuş alacaq tuple provayder-specificdir. Provayderini ID və reklam əsasını URL əldə edin Taira 's provayder kataloqundan, ve giriş açarı və axın tokenunu bu vasitəsilə əldə edin Təchizatçının qəbul axını. Bu dəyərlər təsdiqçi saxlama parametrləri deyil. Çeklənmiş Taira təsdiqçilərində saxlama söndürülmüşdür, buna görə bir təsdiqçi pinini URL təminatçı üçün əvəz etməyin URL.

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

### Geri qaytarılma sübutunun yoxlanılması {#proof-of-retrievability-checks}

Operatorlar yoxlaya, ixrac edə və bərpa oluna biləcəklik sübutunun nəticələrini bildirə bilərlər. Çətinliklər şəbəkənin sübut boru kəməri ilə planlaşdırılır; CLI onların nəticələrinin səthinə çıxarılır.

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

SoraDNS üçün müəyyənləşdirilmiş adlandırma qatıdır SORA Xidmətlər və məzmun. Adları normallaşdırır, dizaynların yeniləmələrini həll edir Iroha, və imzalanmış zona və ya həllçi paketləri vasitəsilə paylayır SoraFS. Çözümçülər və girişlər kəşfiyyat metadatalarına güvənmədən əvvəl həllçi attestasiyası sənədlərini yoxlayır.

Brauzerə daxil olmaq üçün SoraDNS qeydiyyatdan keçmiş bir FQDN -dən qapı hostlarını çıxarır. Kayd olunmuş boşluq hostı kanonik tətbiq mənşəli olaraq qalır, yerləşdirilmiş qapı profilləri isə bu mənşəli üçün brauzer və Torii geri dönüş yollarını ortaya qoyur.

### Ev sahibliyi formaları {#host-forms}

|Formular|Misal |Məqsəd|
| --- | --- | --- |
|Zülm mənşəli |`https://<fqdn>/<path>` |Kanonik tətbiq URL manifestlərdə və buraxılış qeydlərində qeyd olunur |
|Taira brauzer qapısı |`https://<fqdn>.mon.taira.sora.net/<path>` |Aktiv bir alias üçün ictimai brauzer qapısı |
|Torii fallback yol |`https://taira.sora.org/soradns/<fqdn>/<path>` |Torii aktiv bir alias üçün debug və fallback yolu |
|Canonical hash gateway |`<base32(blake3(name))>.gw.sora.id` |Deterministik giriş kimliyi və GAR yoxlama |

`/soradns/<alias>/...` fallback üstünlük verilən ictimaiyyət URL deyil. Alətlər, tətbiq manifestləri və frontend konfigüratisiyası boşluq host özü üstünlük verməlidir. Əgər Taira-də bir alias aktiv deyilsə, brauzer qapısı və ya fallback yolu tətbiqetmə yönümləməsinin başlanmasından əvvəl `404` -ni geri qaytara bilər və ya TLS -ni səhv edə bilər.

### Derive Gateway Hostləri {#derive-gateway-hosts}

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

GAR payloadlar kanonik hash host, kanonik wildcard və seçilmiş gözəl host əhatə etməlidir.

### Resolver dizaynı görüntüsünü alın {#fetch-a-resolver-directory-snapshot}

```bash
curl -i "$TORII_URL/v1/soradns/directory/latest"

soradns_resolver directory fetch \
  --record-url "$TORII_URL/v1/soradns/directory/latest" \
  --directory-url https://gateway.example.org/soradns/directory/latest.car \
  --output ./state/soradns-directory

soradns_resolver rad verify \
  --rad ./state/soradns-directory/rad/resolver-a.norito
```

Gateways, həllçi attestasiyası sənədinin çatışmaması, müddəti bitmiş, imzalanmamış və ya Merkle kökünün ən son dizaynında bağlanmayan həllçilərini rədd etməlidir. Hələ heç bir həllçi dizayni nəşr edilmədiyi şəbəkədə `/v1/soradns/directory/latest` marşrut aktiv olsa da, `404` qaytara bilər.

### İctimai DNS Nümayəndəliyi {#public-dns-delegation}

SoraDNS host mənşəyi normal internet DNS deleqasiyasını əvəz etmir. Əgər ictimai DNS adı SoraDNS qapısına göstərilməlidirsə,

- alt domenlər üçün seçilmiş gözəl host üçün CNAME nəşr edin.
- Əsas adlar üçün ALIAS/ANAME və ya A/AAAA qeydlərini hər hansı bir yayılma qapısına IPs istifadə edin.
- GAR yoxlamaları üçün kanonik hash hostu SoraDNS giriş domenində saxlayın.

## FHE və UAID {#fhe-and-uaid}

FHE ilə bağlı Nexus xidmətləri üçün mövcud olan səthlər aşağıdakılardır:

- `iroha_crypto::fhe_bfv` skalar şifrəli mətnin qiymətləndirilməsi üçün deterministik BFV dəstəyini tətbiq edir. Tanımlayıcı qətnaməsi `BfvIdentifierPublicParameters` və `BfvIdentifierCiphertext` istifadə edir, burada 0 slot giriş bayt uzunluğunu saxlayır və sonrakı slotlar hər biri bir şifrələnmiş bayt saxlayır.
- Soracloud dövlət və vəzifə sxemləri modeli FHE idarəetmə ilə idarə olunan parametrlər dəstləri olan şifrəli mətn iş yükləri; icra siyasətləri, şifrəli mətn öhdəlikləri, sorğu zarfları və açıqlama tələbləri.

BFV identifikator yolu məxfiliyini qorumaq üçün istifadə olunur. Bir müştəri Torii həllinə şifrəli bir identifikator göndərə bilər. Çözücü qiymətləndirir O, aktiv identifikator siyasətinə uyğun olaraq `OpaqueAccountId` nömrəsini əldə edir və bir rüsum buraxır. `ClaimIdentifier` sonra həmin rüsumunu hədəf hesabına əlavə edilmiş UAID ilə bağlayır.

İndiki UAID Bu axın ətrafında kimlik və bacarıqlar bağlanır. `UniversalAccountId` hash ilə təsdiqlənir və kimi göstərir `uaid:<hash>`. Parserlər hər ikisini qəbul edirlər. `uaid:<hash>` və ya 64 hex sərt həzmini. `Account` və `NewAccount` istisna olmaqla, `uaid` və `opaque_ids` Runtime qeydiyyatı bir-bir tətbiq edir UAID- hesabla indeks, ikiqat və ya toqquşma qeyri-şəffaf identifikatorları rədd edir, UAID. Hər dəfə UAID Hesab bağlama dəyişiklikləri, Runtime yenidən qurur Space Directory məlumat sahəsi bağlamalar bu UAID.

Space Directory UAID bir `AssetPermissionManifest` əhatə imkanları göstərir. UAID, məlumat məkanı, aktivləşdirmə və seçmə müddəti bitən dövrü adlandırır və məlumat məkanı, proqram, üsul, varlıq və AMX rolu ilə daxil olan icazə / rədd girişlərini sifariş edir. Qiymətləndirmə rədd-qalibdir: ilk uyğunluq rədd edilməsi istəyi rədd edir, əks halda son uyğunlaşma icazəsi namizəd hər hansı bir məbləğ məhdudiyyətinə qarşı yoxlanılır. Bu manifestlərin nəşri, müddəti bitməsi və ləğvi `CanPublishSpaceDirectoryManifest` ilə qorunur.

Soracloud FHE dövlət üçün tətbiq olunan sxemlər:

|Şəkil|Nəyin nəzarətindədir?|
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
|`SoraStateBindingV1` ilə `FheCiphertext` |Dövlət açarının prefiksi altında olan dəyərlərin FHE şifrə mətnləri olduğunu bildirir. |
|`FheParamSetV1` |Şema adları, arxa son, modul silsiləsi, polinom dərəcəsi, boşluq sayısı, təhlükəsizlik hədəfi, həyat dövrü və parametr həzmləri. |
|`FheExecutionPolicyV1` |Şifrəli mətn ölçüsünü, düz mətnin ölçüsü, giriş/çıxış sayını, qatlama dərinliyini, fırlanmaları, başlanğıc şkaflarını və yuvarlaq rejimini məhdudlaşdırır. |
|`FheGovernanceBundleV1` |Qəbulu təsdiq üçün bir tətbiq siyasəti ilə müəyyən edilmiş bir parametr cütləşdirir. |
|`FheJobSpecV1` |Şifre mətni dövlət açarları və öhdəlikləri üzərində deterministik `Add`, `Multiply`, `RotateLeft` və ya `Bootstrap` işlərini təsvir edir. |
|`CiphertextQuerySpecV1` |Xidmət, bağlama, açar prefiksi, nəticə məhdudiyyəti, metadata səviyyəsi və seçim yolu ilə daxil edilmə sübutuna görə yalnız şifrəli mətn istintaqları göstərir.|
|`DecryptionRequestV1` |Şifrələmə səlahiyyətləri siyasəti çərçivəsində bir şifrəli mətn öhdəliyi üçün açıqlama tələb edir. |

`FheJobSpecV1::validate_for_execution` iş, icra siyasəti və parametrlər dəstinin qəbuldan əvvəl razılaşdığını yoxlayır. Həmçinin əməliyyat xüsusi qaydaları tətbiq edir: əlavə və qatlama üçün ən azı iki giriş lazımdır, rotate və bootstrap dəqiq bir girişə ehtiyac duyurlar və tələb olunan dərinlik, rotasiya sayı, bootstrap sayı, giriş sayı, payload bytes və deterministik çıxış ölçüsü siyasət sərhədləri daxilində olmalıdır.

UAID şifrə mətni deyil və FHE siyasəti özü də deyil. Hesabı tapmaq üçün istifadə olunan sabit hesab qabiliyyətinin təkançısı, qeyri-aşkar identifikator iddiaları və bir xidməti və ya məlumat məkanının axını icazə verən Yer Dizini bağlamalarıdır. FHE sxemləri, parametrlər dəstləri, icra siyasətləri, şifrəli mətn öhdəlikləri və şifrələmə səlahiyyətlərinin siyasəti vasitəsilə şifrələnmiş paylı yüklərin qəbulunu və icrasını ayrı-ayrı idarə edir.

Mümkün olan Torii səthlər aşağıdakılardır:

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

İctimai metadata sərhədi sxemlərdə açıq şəkildə göstərilmişdir: UAID bağlamalar, qeyri-müəyyən identifikator qeydləri, manifest həyat dövrü, dövlət açarı digestləri, şifrəli mətn ölçüləri, şifrələnmiş mətn öhdəlikləri, siyasət adları, parametrlər təyin olunmuş versiyalar, iş əməliyyatları, çıxış vəziyyət açarları, İdentifikator düz mətnləri, şifrələnmiş vəziyyət, modellərin giriş və çıxışları və FHE gizli açarları bu ictimai sorğu qeydlərindən kənarda yerləşir.

## Əməliyyat yoxlama siyahısı {#operational-checklist}

- Hədəf Torii düyünündə `/openapi` ilə yaradılmış xidmət ailələrini təsdiqləyin və birbaşa ictimai yerli SoraFS CID və yaxşı bilinən marşrutları araşdırın.
- Soracloud tətbiq manifestləri, SoraFS manifestları, SoraDNS həllçi direktoru qeydləri, SoraNet relay direktoru qeydlərini və DA pin niyyətlərini və ya mövcudluq öhdəliklərini idarəetmə həssaslıq artefaktları kimi qəbul edin
- Eyni SORA Nexus profilini bir şəbəkədəki təsdiqçilər arasında ardıcıl olaraq istifadə edin.
- Ad hoc node-lokal yollara güvənmək əvəzinə Inrou kök və paylaşılan kirayə həcmlərini manifestlarda saxlayın.
- Məzmun əlifbasını təşviq etmədən əvvəl SoraFS sübut təsdiqindən istifadə edin.
- Monitor SoraNet əllə sıxışmaq uğursuzluqları, DA quorum və ya mövcudluq müddətləri, SoraFS Gateway rəddləri, SoraDNS RAD təzəlik və Soracloud Sağlamlıq xidmətləri.
- İctimai testnet istifadəsi üçün Taira profilindən istifadə edin və [ ilə başlayın SORA Nexus verilənlər bazasına bağlanın ](/az/get-started/sora-nexus-dataspaces.md).

Həmçinin bax:

- [Torii bitki nöqtələri](/az/reference/torii-endpoints.md)
- [Məlumat hadisələri filtrləri](/az/blockchain/filters.md#data-event-filters)
- [Məlumat istintaq](/az/reference/queries.md#nexus-data-availability-and-packages)
- [Kanonik Taira təsdiqləyici konfigürasiyası sabitləşdirilmiş komitdə](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/configs/soranexus/taira/config.toml)
