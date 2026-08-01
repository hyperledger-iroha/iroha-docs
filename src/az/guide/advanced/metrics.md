---
translation_locale: az
translation_source: /guide/advanced/metrics.md
translation_source_hash: 868481b9f7482e936d6c7013557c7ff5334c7bb93fabf74d6eb726e526fb4e43
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Performans və Metriklər {#performance-and-metrics}

Iroha performans iş yükündən, validator topologiyasından, şəbəkə şərtlərindən və konsensus parametrlərindən asılıdır. TPS Bu səbəbdən, sayı yalnız sabit konfigüratsiyaya malik olan bir istinad göstəricisi ilə bağlı olduqda faydalı olur.

Mümkünlüklərin planlaşdırılması üçün səmərəli fəaliyyətə əməliyyat bağlamı kimi baxın:

- şəbəkə tələb olunan əməliyyat dərəcəsini qəbul edir.
- hədəf büdcəsi daxilində gecikmə müddətini təyin etmək
- Transaksiya sıraları məhdud qalır.
- konsensus təkrarlanan görünüş dəyişikliklərinə və ya bərpa yollarına asılı deyil

Bu səhifədən istifadə edərək bir tətbiqin verilən qovşaq sayı, şəbəkə gecikmə həddi və hədəf TPS üçün yüksək, orta və ya aşağı performans vəziyyətində olub olmadığını qiymətləndirmək üçün istifadə edin.

## Nələri ölçmək lazımdır {#what-to-measure}

Torii ilə məruz qalan operator səthləri ilə başlayın:

```bash
export TORII=http://127.0.0.1:8180

curl -s "$TORII/status" | jq .
curl -s -H 'Accept: application/json' "$TORII/v1/sumeragi/status" | jq .
curl -s "$TORII/v1/sumeragi/phases" | jq .
curl -s "$TORII/v1/sumeragi/rbc" | jq .
curl -s "$TORII/v1/sumeragi/params" | jq .
curl -s "$TORII/metrics" > metrics.prom
```

İctimaiyyətə Taira qarşı eyni yalnız oxunma nümunəsini cəhd edə bilərsiniz:

```bash
TAIRA=https://taira.sora.org

curl -fsS "$TAIRA/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA/v1/time/status" \
  | jq '{healthy: .health.healthy, peers, samples_used, rtt_count: .rtt.count}'

curl -fsS "$TAIRA/metrics" \
  | grep -E '^(block_height|queue_size|sumeragi_tx_queue_depth|txs|view_changes)' \
  | head -n 20
```

Ictimai Taira ölçüləri siqnal adlarını öyrənmək üçün faydalıdır. Onları öz tətbiqiniz üçün istehsal qabiliyyətinin sayı kimi istifadə etməyin.

CLI vasitəsilə eyni konsensus görüntüləri mövcuddur:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
iroha --config ./localnet/client.toml ops sumeragi params
```

Telemetri görünüşü konfigürə olunmuş profildən asılıdır. `/metrics` lazım olduqda `extended` istifadə edin və detallı Sumeragi operator yollarına ehtiyac duyduğunuz zaman sınaq dövründə `full` istifadə edin.

```toml
telemetry_enabled = true
telemetry_profile = "full"
```

## Performance Bands {#performance-bands}

Bu bantları hədəf keçid `Y` TPS və gecikmə büdcəsi `L` millisecondlarda müşahidə olunmuş bir iş üçün istifadə edin. İş yükünü istilik, sabit vəziyyət və ən azı gözlənilən zirvə yükünün bir dövrü əhatə etmək üçün kifayət qədər uzun sürün.

|Band |Şərtlər |Məna|
| --- | --- | --- |
|Yüksək .|Qəbul olunan keçid səviyyəsi `Y` və ya ondan yuxarıdır, p95 cəlbedici gecikmə müddəti `0.8 * L` -dən aşağıdır, növbələr potensialın 10% -dən aşağı qalır və görünüş dəyişikliyi / bərpa hesablamaları düzdür |Göndərmədə tələb olunan iş yükü üçün yer var |
|Orta |Qəbul olunan keçid gücü `Y` yaxınlaşır, p95 cəlbedici gecikmə müddəti `L` -dən aşağıdır, növbələr 50% -dən aşağı sabitdir və görünüş dəyişiklikləri nadir hallarda olur.|İstifadə işləyir, lakin məhdud partlayış tolerantlığı var |
|Aşağı |Qəbul olunan keçid səviyyəsi `Y` -dən aşağıdır, p95 cəlbedici gecikmə müddəti `L` -dən çoxdur, səyahət zamanı növbələr artır və ya görünüş dəyişikliyi / geri təzyiq hesablayıcıları davamlı olaraq artır. |Tələb olunan iş yükü ən azı bir şüşə boğazından çoxdur |

Əsas qayda növbənin istiqamətidir. Əgər təqdim edilən TPS öhdəlikdən böyükdürsə TPS və növbənin artması davam etsə, qısa nümunələr sağlam görünsə də, yerləşdirilmə həddindən artıq yüklənir.

## Qeydiyyatın sayı və quorum {#node-count-and-quorum}

Daha çox validatorlar səhv tolerantlığını yaxşılaşdırır, lakin koordinasiya, imzalanma və şəbəkə üçün xərcləri artırır. Sumeragi icrası:

- təsdiqləyici sayı `n` səhv büdcəsini `f = floor((n - 1) / 3)` çıxarır.
- `n >= 4` üçün komitə quorum `2f + 1`dir.
- `n <= 3` üçün bütün təsdiqçilər öhdəlik almaq üçün tələb olunur.
- müşahidəçi həmyaşıdları sinxron bloklar, lakin səs vermək, təklif etmək və ya toplamaq deyil

|Validatorlar |Xəta büdcəsi |Quorum qəbul edin.|Mükəmməllik notası |
| --- | --- | --- | --- |
|1-dən 3-dək|0 praktiki offline slack |bütün təsdiqçilər |İnkişaf və kiçik sınaqlar üçün faydalıdır; hər hansı bir yoxlayıcı öhdəlikləri dayandıra bilər. |
| 4 | 1 | 3 |Bir səhv tolerantlığı üçün ümumi minimum |
| 7 | 2 | 5 |Daha davamlı, daha çox səsvermə və təbliğat nəqliyyatı ilə |
| 10 | 3 | 7 |Daha yüksək koordinasiya xərcləri; şəbəkə və kollektor tənzimlənməsi daha vacibdir |

"X qovşaqlarını" qiymətləndirərkən səsvermə təsdiqləyicilərini müşahidəçilərdən ayırın. Müşahidəçilərin əlavə edilməsi ümumiyyətlə təsdiqləyicilərin əlavə edilməsindən daha ucuz başa gəlir, lakin müşahidəçılar hələ də blok dedikodunu, blok sinxronlaşmasını, disk və şəbəkə bant genişliyini istehlak edirlər.

## Fəaliyyətlərə təsir edən amillər {#factors-that-influence-performance}

### İş yükünün forması {#workload-shape}

Eyni TPS hər bir əməliyyatın nə ilə bağlı olaraq ucuz və ya bahalı ola bilər.

- Hər əməliyyat üçün təlimatların sayı
- İmzaların sayılması və imzalanma alqoritmləri
- Transaction byte ölçüsü və dekompressed payload ölçüsü
- oxuma və yazma nisbəti
- Metadalanın ölçüsü və aktiv əməliyyatları
- Smart contract, trigger və IVM icra xərcləri
- eyni həmyaşıdlara qarşı hərəkət edən sorğu yükü

Kiçik köçürmə əməliyyatları müqavilə ağır və ya metadata ağır iş yükləri üçün bir təyinat deyil.

### Razılaşma vaxtı {#consensus-timing}

Sumeragi vaxtlandırılması effektiv Sumeragi parametrləri ilə tənzimlənir:

- `block_time_ms`
- `commit_time_ms`
- `min_finality_ms`
- `pacing_factor_bps`
- NPoS rejiminin aktivləşdirildiyi zaman NPoS mərhələ vaxtları.

Onları yoxlayın:

```bash
iroha --config ./localnet/client.toml ops sumeragi params
curl -s "$TORII/v1/sumeragi/params" | jq .
```

Aşağı vaxtlandırma hədəfləri yalnız şəbəkə, saxlama və icra təbəqələrinin davam edə biləcəyi müddətdə gecikmə sürətini yaxşılaşdıra bilər. Dəyişikliklər görüldükdən sonra, itkin payload alınması və ya geri təzyiq meydana çıxdıqdan sonra zamanlayıcıların azaldılması ümumiyyətlə performansını pisləşdirir.

### Kollektor Fanout {#collector-fanout}

Kollektor parametrləri komitə səslərinin nə qədər sürətli birləşməsinə təsir edir:

- `sumeragi.collectors.k` hündürlüyünə görə nə qədər toplayıcı səs topladığını idarə edir
- `sumeragi.collectors.redundant_send_r` yerli müddətdən sonra əlavə səsverməni idarə edir.
- `sumeragi.collectors.parallel_topology_fanout` topologiyayı kollektorlarla birlikdə əlavə edir.

Daha böyük və ya daha az etibarlı şəbəkələrdə bayraq gecikməsini azalda bilər, lakin həmçinin trafik artırır. Bu dəyərləri dəyişdirməkdən əvvəl ümumi mövcudluğu və kollektor telemetriyasını gecikmə və geri basınç ölçülərinə müqayisə edin:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

### Şəbəkənin şərtləri {#network-conditions}

Konsensus nəticələri aşağıdakılara görə həssasdır:

- RTT təsdiqləyicilər arasında
- həyəcan və paket itkisi
- blok payliq yükləri və RBC parçalar üçün bant genişliyi
- regionlar arasındakı asimetrik əlaqə
- NAT, həmyaşıd bağlantısını gecikdirən yanğın divarı və ya relay davranışları

Planlaşdırma qaidəsi olaraq, bir neçə təsdiqçi dönüş səyahətini və icra və disk təzyiqi vaxtını əhatə etmək üçün gecikmə büdcəsini kifayət qədər yüksəkləşdirin. p95 şəbəkəsi RTT artıq istədiyiniz p95 təzyiq gecikməsinə yaxındırsa, hədəf realist deyil.

### Səfərlər və giriş məhdudiyyəti {#queues-and-admission-limits}

Giriş və sıra parametrləri bir həmyaşıdın nə qədər partlayış təzyiqi əhatə edə biləcəyini müəyyənləşdirir:

- `queue.capacity`
- `queue.capacity_per_user`
- `queue.transaction_time_to_live_ms`
- max imzaları, təlimatları, bayt və dekompressiya edilmiş bayt kimi genesis əməliyyat məhdudiyyətləri
- p2p növbənin həddləri və konsensus daxil olmaq məhdudiyyətləri

Yüksək növbə qabiliyyəti bir müddət həddindən artıq yükü gizlədə bilər, lakin bu da davamlı keçid artımını artırmır.

### Hardver və saxlama {#hardware-and-storage}

Yalnız lider deyil, hər təsdiqçiyi ölçün:

- CPU təsdiqləmə, imzalanma yoxlaması və icra zamanı doymuşluğu
- Sifarişlər, sürətli görüntülər və aktiv RBC seanslardan olan yaddaş təzyiqi
- blok saxlama və sürətli şəkillər üçün disk yazma gecikməsi
- şəbəkənin ötürülməsi/alması sıxlığı
- İş yükü tərəfindən istifadə olunduğu zaman texniki sürətlənmə parametrləri

Ən yavaş səsvermə təsdiqçisi şəbəkənin quyruq gecikməsini müəyyən edə bilər.

## Prometheus siqnalları {#prometheus-signals}

Metrik adları profil və xüsusiyyətlər dəstindən asılı olaraq dəyişə bilər. Əvvəlcə nodunuzda `/metrics` yoxlayın, sonra mövcud seriya ətrafında taxtalar qurun.

Ümumi siqnallar aşağıdakılardır:

|Sinyal |Prometheus nümunələri |Nəyə baxmaq lazımdır?|
| --- | --- | --- |
|Qəbul olunan keçid |`sum(rate(txs{type="accepted"}[5m]))` |Hələlik sabit vəziyyətdə hədəf TPS -i yerinə yetirməlidir və ya aşmalıdır. |
|Təkliflər |`sum(rate(txs{type="rejected"}[5m]))` |Test planı ilə izah edilməlidir.|
|Gecikmə vaxtını təyin edin.|`histogram_quantile(0.95, sum(rate(commit_time_ms_bucket[5m])) by (le))` |Qeydiyyat büdcəsi ilə p95/p99-u müqayisə edin |
|Səyahət dərinliyi |`queue_size`, `sumeragi_tx_queue_depth` |Çıxışın zirvəsi zamanı məhdudlaşdırılmalıdır.|
|Səyahət doymuşluğu |`sumeragi_tx_queue_saturated` |Dayanmış sıfır olmayan dəyərlər həddindən artıq yükləndirilmə deməkdir |
|Dəyişiklikləri baxın |`view_changes`, `sumeragi_view_change_suggest_total`, `sumeragi_view_change_install_total` |Artan qiymətlər zamanlama, topologiya, pay yükü və ya şəbəkə problemini göstərir |
|İndirildiyi mesajlar |`dropped_messages`, `sumeragi_consensus_message_handling_total` |Yükləmə zamanı azalma ümumiyyətlə gecikmə zirvələrini izah edir .|
|RBC basıncı |`sumeragi_rbc_store_pressure`, `sumeragi_rbc_backpressure_deferrals_total` |Faydalı yüklərin bərpası və ya saxlanılması üçün sıfır olmayan təzyiq nöqtələri |
|Quorum qəbul edin.|`sumeragi_commit_signatures_counted`, `sumeragi_commit_signatures_required` |Sayılan imzalar tezliklə tələb olunan quorumuna çatmalıdır.|

Bir metrik yalnız `/v1/sumeragi/status`də mövcud olduqda, Prometheus sürüşməsi ilə eyni dövrdəki əşyalarda JSON sürüşməsini tutun.

## Qiymətləndirmə iş axını {#estimation-workflow}

1. Ssenariyi təyin edin:
   - təsdiqləyici və müşahidəçi sayı
   - konsensus rejimi
   - hədəf TPS
   - p95 və p99 büdcələri ilə bağlı
   - əməliyyat qarışığı
   - gözlənilir şəbəkə RTT, jitter və bant genişliyi
2. Fəaliyyətli quruluşu qeyd edin:

   ```bash
   iroha --config ./localnet/client.toml --output-format json ops sumeragi params \
     > artifacts/sumeragi-params.json
   curl -s "$TORII/v1/sumeragi/collectors" \
     > artifacts/sumeragi-collectors.json
   ```

3. İş yükünü hədəflə TPS yerinə yetirin.
4. Yarışın başlanğıcında, ortasında və sonunda status və ölçüləri tutun.
5. Döyüşü performans bandı cədvəli ilə təsnif edin.
6. Əgər bant orta və ya aşağıdırsa, bir-birində bir faktor dəyişdirin və təkrarlayın.

## Benchmark Report Şablonu {#benchmark-report-template}

Xidmət göstəricilərini yalnız onları təkrarlamaq üçün kifayət qədər kontekstlə nəşr edin:

- Iroha təyinat, buraxılış və xüsusiyyət bayraqları
- Validator və müşahidəçi sayları
- konsensus rejimi və Sumeragi parametrləri
- kollektor `k`, redundant göndərmək `r` və topoloji fanout
- Telemetrik profil
- Hardver, saxlama və OS detalları
- şəbəkə RTT, jitter, itki və bant genişliyi fərziyyələri
- əməliyyat qarışığı və paylı yük ölçüləri
- təklif edilən TPS və icra müddəti
- Qəbul edilmiş və rədd edilmiş TPS
- p50/p95/p99 commit latency
- növbənin dərinliyi və doymuşluğu
- görünüş dəyişiklikləri, buraxılmış mesajlar, RBC təzyiqi və itkin payload hesablamaları
- CPU, hər bir validator üçün yaddaş, disk və şəbəkə istifadəsi

Bu məlumatlar olmadan TPS nömrəsi anekdot kimi qəbul edilməlidir.

## Əlaqəli səhifələr {#related-pages}

- [Izanami ilə Kaos Testləri](./chaos-testing.md)
- [Torii bitki nöqtələri](../../reference/torii-endpoints.md)
- [Iroha 3 vasitəsilə CLI](../../get-started/operate-iroha-via-cli.md) istifadə etmək
- [Peer konfigurasiyası istinadı](../../reference/peer-config/params.md)
