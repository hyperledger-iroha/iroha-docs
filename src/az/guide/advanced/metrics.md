---
translation_locale: az
translation_source: /guide/advanced/metrics.md
translation_source_hash: fc62efbb6100308bb7a929e18c9c8b6860372abd6d0009616ea63d7c77b6b1eb
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Performans və Ölçülər {#performance-and-metrics}

Iroha performans iş yükündən, təsdiqləyici topologiyasından, şəbəkə şərtlərindən və konsensus parametrlərindən asılıdır. Buna görə də, tək bir TPS nömrəsi yalnız sabit konfiqurasiyaya malik benchmark icrası ilə əlaqələndirildiyi zaman faydalıdır.

Tutum planlaması üçün performansı əməliyyat məlumatı konteyneri kimi qəbul edin:

- şəbəkə tələb olunan əməliyyat sürətini qəbul edir
- protokolun yekunlaşdırılması gecikməsi hədəf büdcə daxilində qalır
- əməliyyat növbələri məhdud qalır
- konsensus təkrarlanan baxış dəyişikliklərinə və ya bərpa yollarına əsaslanmır

Bu səhifədən istifadə edərək müəyyən bir düyün sayı, şəbəkə gecikmə həddi və hədəf TPS üçün yerləşdirmənin yüksək, orta və ya aşağı performans vəziyyətində olub-olmadığını təxmin edə bilərsiniz.

## Nəyi Ölçmək {#what-to-measure}

İctimai node vaxt nöqtəsi məlumat baxışı və Prometheus yığımı ilə başlayın, sonra operator tərəfindən təsdiqlənmiş konsensus vəziyyəti üçün CLI istifadə edin. Operator açarı hədəf node tərəfindən icazə verilməli və yalnız proqram icra mühitində yüklənir:

```bash
export TORII=http://127.0.0.1:8180
export OPERATOR_KEY_FILE=./secrets/operator.key

curl -s -H 'Accept: application/json' "$TORII/status" | jq .
curl -s "$TORII/metrics" > metrics.prom

iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi status
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi diagnostics
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi qc
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi params
```

İctimai Taira anonim düyün anlarının şəklini öyrənmək üçün faydalıdır. Onun operator diaqnostikaları Taira operator açarı olmadan qəsdən mövcud deyil:

```bash
TAIRA=https://taira.sora.org

curl -fsS -H 'Accept: application/json' "$TAIRA/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA/v1/time/now" \
  | jq '{now_ms, offset_ms}'
```

Öz yerləşdirməniz üçün istehsal tutumu rəqəmləri kimi ictimai testnet müşahidələrindən istifadə etməyin.

Telemetriya görünürlüğü konfiqurasiya edilmiş profilə bağlıdır. `operator` status və diaqnostika anlıqlarını aktiv edir. `extended` `/metrics` və bahalı zamanlamaları əlavə edir, Əvvəllər `developer` lider, QC, parametrlər və sübut kimi inkişafçı zaman nöqtəsi məlumat baxışlarını əlavə edir, lakin `/metrics`-ü aktiv etmir. Bir işləmə həm dəstələrə ehtiyac duyursa, `full`-dən istifadə edin. `telemetry_profile` tək ilk buraxılış telemetriya açarıdır.

```toml
telemetry_profile = "full"
```

## Performans Səviyyələri {#performance-bands}

Müşahidə olunan hədəf keçid sürəti üçün bu zolaqlardan istifadə edin `Y` TPS və gecikmə büdcəsi `L` millisekund. İş yükünü kifayət qədər uzun müddət işlədin ki, istismar, sabit vəziyyət və ən azı bir gözlənilən yüksək yüklər dövrünü əhatə etsin.

|Qrup|Şərtlər|Mənası|
| --- | --- | --- |
|Yüksək|Qəbul edilmiş ötürmə `Y` səviyyəsində və ya üstündədir, p95 protokol yekunlaşdırma gecikməsi `0.8 * L`-dən aşağıdır, növbələr tutumun 10%-dən aşağı qalır və görünüş-dəyişmə/bərpa sayğacları düz qalır|Yerinə yetirmə tələb olunan iş yükü üçün boşluğa sahibdir|
|Orta|Qəbul olunan vasitəçilik `Y`-a yaxındır, p95 protokol tamamlanma gecikməsi `L`-in altında, növbələr tutumun 50%-dən aşağı səviyyədə stabildir və görünüş dəyişiklikləri nadirdir|Yerləşdirmə işləyir, lakin məhdud ani yüklənmə dözümlülüyü var|
|Aşağı|Qəbul edilmiş ötürmə `Y`-dan aşağıdır, p95 protokolun yekunlaşdırma gecikməsi `L`-i aşır, iş zamanı növbələr artır və ya görünüş dəyişikliyi/backpressure sayğacları davamlı olaraq yüksəlir|Tələb olunan iş yükü ən azı bir dar nöqtəni aşır|

Əsas qayda növbənin istiqamətidir. Əgər təqdim olunan TPS sonlaşdırılmış TPS-dən böyükdürsə və növbə böyüməyə davam edirsə, quraşdırma hətta kiçik nümunələr sağlam görünsə də yüklənir.

## Node sayı və kvorum {#node-count-and-quorum}

Daha çox doğrulayıcı səhv tolere etməni artırır, lakin əlaqələndirmə, imza və şəbəkə yayılma xərclərini artırır. İlk buraxılış Sumeragi protokolu bunu tələb edir:

- dəqiq `n = 3f + 1` səsvermə komitəsi
- `4 <= n <= 31`, yəni etibarlı ölçülər 4, 7, 10 və sairədir
- konsensusun yekunlaşması üçün `2f + 1` iştirakçı sayı
- müşahidəçi şəbəkə yoldaşları blokları sinxronizasiya edir, amma səs vermir, təklif etmir və ya toplaşdıra bilmirlər

|Təsdiqləyicilər|Xəta büdcəsi|konsensusun yekunlaşdırılması üçün kvorum|Tutum qeydi|
| --- | --- | --- | --- |
| 4 | 1 | 3 |Bir səhv tolerantlığı üçün ümumi minimum|
| 7 | 2 | 5 |Daha davamlı, daha çox səs və yayım trafiki ilə|
| 10 | 3 | 7 |Daha yüksək əlaqələndirmə xərci; şəbəkə və giriş tənzimlənməsi daha çox əhəmiyyət daşıyır|
| 31 | 10 | 21 |Maksimum ilk buraxılış komitəsi; müqayisə koordinasiyası və imza xərclərini diqqətlə|

blokçeyn mənşə nəsli və başlanğıc təsdiqi uyğun gəlməyən komitə ölçülərini rədd edir; buraxılışın qəbul edə bilməyəcəyi bir topologiyanı benchmark etməyin.

“X düyünləri”ni qiymətləndirərkən, səsvermə təsdiqləyiciləri ilə müşahidəçiləri ayırın. Müşahidəçilərin əlavə edilməsi adətən təsdiqləyiciləri əlavə etməkdən daha ucuz başa gəlir, amma müşahidəçilər hələ də blok yayımı, blok sinxronizasiyası, disk və şəbəkə bant genişliyindən istifadə edirlər.

## Performansa Təsir Edən Faktorlar {#factors-that-influence-performance}

### İş Yükü Forması {#workload-shape}

Eyni TPS hər əməliyyatın nə etdiyindən asılı olaraq ucuz və ya bahalı ola bilər. Qeyd:

- əməliyyat başına təlimatların sayı
- imza sayı və imzalama alqoritmləri
- əməliyyat bayt ölçüsü və dekompressiya olunmuş yükgöndərmə ölçüsü
- oxuma/yazma nisbəti
- metaməlumat ölçüsü və aktiv əməliyyatları
- ağıllı müqavilə, tetikleyici və IVM icra xərci
- sorğu yüklənməsi eyni şəbəkə yoldaşlarına qarşı işləyir

Kiçik köçürmə əməliyyatları müqavilə-yüklü və ya metadata-yüklü iş yüklərinin vasitəsi deyil.

### Razılaşma Tempi {#consensus-cadence}

Effektiv Sumeragi parametr zaman nöqtəsi məlumat görüntüsü imzalanmış dəyişməz blok kadençası və saat sürüşməsi sərhədini ehtiva edir:

- `block_cadence_ms`
- `max_clock_drift_ms`

Onları ilə yoxlayın:

```bash
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi params
```

`block_cadence_ms` imzalanmış blokçeyn başlanğıcı ilə təyin olunur və başlanğıcda dondurulur; bu, canlı tənzimləmə düyməsi deyil. Yalnız fərqli imzalanmış blokçeyn başlanğıcı girişlərinə malik şəbəkələri ayrı benchmark ssenariləri kimi müqayisə edin. Baxış dəyişiklikləri, çatışmayan yük götürmələri və ya tərs təzyiq meydana gəldikdə, daha qısa dövr adətən davamlı ötürülən məlumatın artmasındansa, yüklənməni daha görünən edir.

### Namizəd və Daxilolma Hüdudları {#candidate-and-ingress-bounds}

Qovşaq-yerli Sumeragi sərhədlər, bir təsdiqləyicinin nə qədər namizəd və bərpa işi saxlaya biləcəyini müəyyən edir:

- `sumeragi.block.max_transactions`
- `sumeragi.block.max_payload_bytes`
- `sumeragi.block.proposal_queue_scan_multiplier`
- `sumeragi.queues.commands`
- `sumeragi.queues.bodies` və `sumeragi.queues.body_bytes`
- `sumeragi.queues.body_source_bytes`, `sumeragi.queues.chunks` və `sumeragi.queues.ready_bodies`

Çox kiçik sərhədlər növbə və ya yük bərpası təzyiqi yaradır; həddindən böyük sərhədlər isə saxlanılan yaddaşı və sui-istifadə edən şəbəkəyə mövcud iş miqdarını artırır Həmyaşıdı. Hər dəfə bir sərhədi dəyişdirməzdən əvvəl diaqnostikaların müəyyən zaman nöqtəsinə aid verilənlər görüntüsünü proses yaddaşı, mesaj işlənməsi və bədən çatışmazlığı göstəriciləri ilə müqayisə edin:

```bash
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi diagnostics
```

### Şəbəkə Şəraitləri {#network-conditions}

Konsensus performansı aşağıdakılara həssasdır:

- RTT təsdiqləyicilər arasında
- titrəmə və paket itkisi
- blok yükləri və imzalanmış RS16 parçalar üçün genişlik
- regionlar arasında qeyri-bərabər əlaqələr
- NAT, firewall və ya şəbəkə digər düyünlərə qoşulmanı gecikdirən ötürücü davranış

Planlaşdırma qaydası olaraq, gecikmə büdcəsini bir neçə doğrulayıcı tura, həmçinin icra və diskdə yadda saxlama vaxtını əhatə edəcək qədər yüksək qoyun. Əgər p95 şəbəkə RTT artıq istənilən p95 protokol yekunlaşma gecikməsinə yaxınsa, hədəf realist deyil.

### Növbələr və Qəbul Məhdudiyyətləri {#queues-and-admission-limits}

Qəbul və növbə parametrləri şəbəkə dostunun nə qədər ani təzyiqi qəbul edə biləcəyini müəyyən edir:

- `queue.capacity`
- `queue.capacity_per_user`
- `queue.max_retained_bytes`
- `queue.transaction_time_to_live_ms`
- blok zənciri başlanğıc əməliyyatı limitləri, məsələn, maksimum imzalar, təlimatlar, baytlar və dekompressiya olunmuş baytlar
- p2p növbə hədləri və konsensus giriş limitləri

Yüksək növbə tutumu bir müddət üçün yüklənməni gizlədə bilər, amma davamlı işləmə sürətini artırmır. Sabit növbə sağlamdır; artan növbə isə gecikmədir.

### Avadanlıq və Saxlama {#hardware-and-storage}

Hər bir təsdiqləyicini ölçün, yalnız lideri deyil:

- CPU doğrulama, imza yoxlaması və icra zamanı doyma
- növbələrdən yaddaş təzyiqi, vaxt nöqtəsi məlumat baxışları və yük bərpa tamponları
- blok saxlama və zaman nöqtəsi üzrə məlumat görüntüləri üçün disk yazma gecikməsi
- şəbəkə göndərmə/qəbul doyması
- iş yükü tərəfindən istifadə edildikdə ixtiyari aparat sürətləndirmə parametrləri

Ən yavaş səs verən yoxlayıcı şəbəkənin son gecikməsini müəyyən edə bilər.

## Prometey Siqnalları {#prometheus-signals}

Metrlərin adları yoxlanılmış telemetriya kataloqundan gəlir. Seriyaların mövcudluğu və nümunə götürülməsi hələ də quruluş xüsusiyyətlərindən və `telemetry_profile`-dən asılıdır, buna görə bir dashbord yaratmadan əvvəl hədəf nodda `/metrics`-i yoxlayın.

Ümumi siqnallar bunlardır:

|Siqnal|Prometey nümunələri|Nəyə baxmalı|
| --- | --- | --- |
|Qəbul edilmiş ötürmə sürəti| `sum(rate(txs{type="accepted"}[5m]))` |Sabit vəziyyətdə hədəf TPS-ə çatmalı və ya onu aşmalıdır|
|Rədd etmələr| `sum(rate(txs{type="rejected"}[5m]))` |Test planı ilə izah edilə bilməlidir|
|protokolun yekunlaşdırılma gecikməsi| `histogram_quantile(0.95, sum(rate(commit_time_ms_bucket[5m])) by (le))` |p95/p99-i gecikmə büdcəsi ilə müqayisə edin|
|Növbə dərinliyi| `queue_size`, `sumeragi_tx_queue_depth` |Yüksək yüklənmə zamanı məhdud qalmalıdır|
|Növbənin doyması| `sumeragi_tx_queue_saturated` |Davamlı sıfırdan fərqli dəyərlər həddindən artıq yüklənmə deməkdir|
|Dəyişiklikləri göstər| `view_changes`, `sumeragi_view_change_suggest_total`, `sumeragi_view_change_install_total` |Yüksələn dəyərlər zamanlama, topologiya, yükləmə və ya şəbəkə problemi göstərir|
|Atılmış mesajlar| `dropped_messages`, `sumeragi_consensus_message_handling_total` |Yük zamanı düşmələr adətən gecikmə artımlarını izah edir|
|Yük və DA bərpası| `sumeragi_missing_block_requests`, `sumeragi_missing_block_oldest_ms`, `sumeragi_missing_block_fetch_total`, `sumeragi_da_gate_block_total`, `sumeragi_da_gate_satisfied_total` |Davamlı sorğular, artan yaş və ya təkrarlanan DA qapılar bədən və ya parça əldə etmə çətinliyini göstərir|
|konsensusun yekunlaşdırılması üçün kvorum| `sumeragi_commit_signatures_counted`, `sumeragi_commit_signatures_required` |Sayılan imzalar tələb olunan səs çoxluğuna tez çatmalıdır|

Bir metrik yalnız `/v1/sumeragi/status` mövcud olduqda, JSON nöqtəsində vaxt məlumatlarının görünüşünü Prometheus skreypi ilə eyni işləmə artefaktlarında tutun.

## Təxmin İş Axını {#estimation-workflow}

1. Ssenarini müəyyən edin:
   - təsdiqləyici sayı və müşahidəçi sayı
   - konsensus rejimi
   - target TPS
   - p95 və p99 protokolunun yekunlaşdırılması-latentlik büdcələri
   - əməliyyat qarışığı
   - gözlənilən şəbəkə RTT, sıçrayış və bant genişliyi
2. Effektiv konfiqurasiyanı qeyd edin:

   ```bash
   iroha --config ./localnet/client.toml \
     --operator-private-key-file "$OPERATOR_KEY_FILE" \
     --output-format json ops sumeragi params \
     > artifacts/sumeragi-params.json
   iroha --config ./localnet/client.toml \
     --operator-private-key-file "$OPERATOR_KEY_FILE" \
     --output-format json ops sumeragi status \
     > artifacts/sumeragi-status.json
   iroha --config ./localnet/client.toml \
     --operator-private-key-file "$OPERATOR_KEY_FILE" \
     --output-format json ops sumeragi diagnostics \
     > artifacts/sumeragi-diagnostics.json
   ```

3. İş yükünü hədəf TPS üzərində işlədin.
4. Qaçışın əvvəlində, ortasında və sonunda vəziyyət və göstəriciləri qeyd edin.
5. İşi performans-zolaq cədvəli ilə təsnif edin.
6. Əgər zolaq Orta və ya Aşağıdırsa, bir faktoru bir vaxtda dəyişdirin və təkrarlayın.

## Benchmark Hesabat Şablonu {#benchmark-report-template}

Performans göstəricilərini yalnız onları təkrarlamaq üçün kifayət qədər kontekst ilə birlikdə dərc edin:

- Iroha protokolun yekunlaşdırılması, buraxılışı və xüsusiyyət bayraqları
- təsdiqləyici və müşahidəçi sayı
- konsensus rejimi, imzalı blok kadençası və DA tərtibatı
- dəqiq `3f + 1` komitə, kvorum və müşahidəçi siyahısı
- `sumeragi.block`, `sumeragi.queues`, `sumeragi.limits`, şəbəkə-giriş və əməliyyat-növbəsi sərhədləri
- telemetriya profili
- avadanlıq, saxlama və OS detallar
- şəbəkə RTT, tərpənmə, itkilər və genişlik fərziyyələri
- əməliyyat qarışığı və yük ölçüləri
- təklif olunan TPS və işləmə müddəti
- qəbul edildi/rədd edildi TPS
- p50/p95/p99 protokolunun yekunlaşma gecikməsi
- növbə dərinliyi və doyma
- dəyişikləri baxın, batmış mesajlar, blok alınmalarının itməsi və DA-qapı sayğacları
- CPU, hər bir təsdiqləyici üzrə yaddaş, disk və şəbəkə istifadəsi

Bu detallarsız, TPS nömrəsi hekayəvi kimi qəbul edilməlidir.

## Əlaqəli Səhifələr {#related-pages}

- [Izanami ilə Xaos Testi](./chaos-testing.md)
- [Torii API son nöqtələr](../../reference/torii-endpoints.md)
- [Iroha 3-i CLI vasitəsilə işlədin](../../get-started/operate-iroha-via-cli.md)
- [şəbəkə həmkarı konfiqurasiya istinadı](../../reference/peer-config/params.md)
