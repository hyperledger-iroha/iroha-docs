---
translation_locale: az
translation_source: /blockchain/events.md
translation_source_hash: 2777cbe4e72a50c4790e50b59c3e695feb5814314cc9afccdfd994f6409c195e
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-supplemental-naming-link+reviewed-delta
---
# Tədbirlər {#events}

Typed event bildirişləri blokzincir daxilində müəyyən hadisələr baş verdikdə göndərilir, məsələn, yeni hesab yaradıldı və ya blok yekunlaşdırıldı. Müxtəlif hadisə növləri vardır:

- proqram təminatı işləmə iş axını hadisələri
- veri hadisələri
- vaxt əsaslı hadisə bildirişləri
- icra hadisələrini tetiklemek

## proqram təminatı işləmə iş axını Hadisələr {#pipeline-events}

Əməliyyatlar və bloklar emal konveyerindən keçdikcə konveyer hadisələri yayımlanır. Əməliyyat hadisəsi əməliyyatın həşini, blok hündürlüyünü, zolaq və məlumat məkanı ID-lərini və statusu daşıyır: `Queued`, `Expired`, `Approved` və ya rədd səbəbi ilə birlikdə `Rejected`. Blok hadisəsi blok başlığını və statusu daşıyır: `Created`, `Approved`, səbəbi ilə birlikdə `Rejected`, `Committed` və ya `Applied`.

### Bu iş axınını Taira üzərində işə sal {#try-it-on-taira}

İctimai proqram təminatı emal iş axını hadisə axınının qoşulduğunu yoxlayın:

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

Axını açıq saxlamadan yoxlaya biləcəyiniz zaman nöqtəsində məlumat görüntüsü üçün, son tədqiqatçı əməliyyatlarını oxuyun:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?limit=5' \
  | jq '{next_cursor, txs: [.items[] | {hash, block, status, executable}]}'
```

Canlı hadisələrə ehtiyacınız olduqda terminalda SSE marşrutunu açın:

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

Əgər axın açıq olduğu müddətdə heç bir əməliyyat göndərilmirsə, marşrut sağlam olsa belə, əmrlə əlaqədar hər hansı bir xəbərdarlıq verilməyə bilər.

## Məlumat Hadisələri {#data-events}

Data hadisələri blokçeyn dəftər məlumatları ilə əlaqəli dəyişiklik olduqda, məsələn, şəbəkə iştirakçıları, domenlər, hesablar, aktivlər, aktiv tərifləri, NFTs, tetikleyicilər ilə əlaqədar olaraq yayımlanır, rollar, zəncirdaxili konfiqurasiya, icraçı vəziyyəti, sübutlar, məxfi aktivlər, körpülər və ya SORA Nexus-xüsusi obyektlər. Bu tip hadisələr [məlumat hadisəsi filtrləri](./filters.md#data-event-filters)-da istifadə olunur.

## vaxt əsaslı hadisə bildirişləri {#time-events}

Vaxt əsaslı hadisə bildirişləri dünya vəziyyəti görünüşü [zaman tetikleyiciləri](./triggers.md#time-triggers)-ı işlətməyə hazır olduqda yayımlanır.

## Tətik İcrası Hadisələri {#trigger-execution-events}

Tetik icra hadisələri o zaman yayımlanır ki [`ExecuteTrigger`](./instructions.md#executetrigger) Təlimat yerinə yetirilir. Sürətləyici başa çatdıqdan sonra tetik tamamlama hadisələri yayımlanır.
