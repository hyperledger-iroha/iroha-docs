---
translation_locale: az
translation_source: /blockchain/events.md
translation_source_hash: 16b8cacc9bdf156d4b1e1a93b720085adcabb0002a34b9dc564a9926f573de63
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Tədbirlər {#events}

Typed event bildirişləri blokzincir daxilində müəyyən hadisələr baş verdikdə göndərilir, məsələn, yeni hesab yaradıldı və ya blok yekunlaşdırıldı. Müxtəlif hadisə növləri vardır:

- proqram təminatı işləmə iş axını hadisələri
- veri hadisələri
- vaxt əsaslı hadisə bildirişləri
- icra hadisələrini tetiklemek

## proqram təminatı işləmə iş axını Hadisələr {#pipeline-events}

Proqram təminatı işləmə iş axını hadisələri, əməliyyatlar təqdim edildikdə, icra edildikdə və ya blokda yekunlaşdıqda yayımlanır. Proqram təminatı işləmə iş axını hadisəsi aşağıdakı məlumatları özündə ehtiva edir: hadisəyə səbəb olan obyektin növü (əməliyyat və ya blok), onun kriptoqrafik xəşi və statusu. Status ya `Validating` (təsdiqləmə davam edir), ya `Rejected`, ya da `Committed` ola bilər. Əgər bir vahid rədd edilibsə, rədd edilmə səbəbi göstərilir.

### Bu iş axınını Taira üzərində işə sal {#try-it-on-taira}

İctimai proqram təminatı emal iş axını hadisə axınının qoşulduğunu yoxlayın:

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

Axını açıq saxlamadan yoxlaya biləcəyiniz zaman nöqtəsində məlumat görüntüsü üçün, son tədqiqatçı əməliyyatlarını oxuyun:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

Canlı hadisələrə ehtiyacınız olduqda terminalda SSE marşrutunu açın:

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

Əgər axın açıq olduğu müddətdə heç bir əməliyyat göndərilmirsə, marşrut sağlam olsa belə, əmrlə əlaqədar hər hansı bir xəbərdarlıq verilməyə bilər.

## Məlumat Hadisələri {#data-events}

Data hadisələri blokçeyn dəftər məlumatları ilə əlaqəli dəyişiklik olduqda, məsələn, şəbəkə iştirakçıları, domenlər, hesablar, aktivlər, aktiv tərifləri, NFTs, tetikleyicilər ilə əlaqədar olaraq yayımlanır, rollar, zəncirdaxili konfiqurasiya, icraçı vəziyyəti, sübutlar, məxfi aktivlər, körpülər və ya SORA/Nexus-xüsusi obyektlər. Bu tip hadisələr [məlumat hadisəsi filtrləri](./filters.md#data-event-filters)-da istifadə olunur.

## vaxt əsaslı hadisə bildirişləri {#time-events}

Vaxt əsaslı hadisə bildirişləri dünya vəziyyəti görünüşü [zaman tetikleyiciləri](./triggers.md#time-triggers)-ı işlətməyə hazır olduqda yayımlanır.

## Tətik İcrası Hadisələri {#trigger-execution-events}

Tetik icra hadisələri o zaman yayımlanır ki [`ExecuteTrigger`](./instructions.md#executetrigger) Təlimat yerinə yetirilir. Sürətləyici başa çatdıqdan sonra tetik tamamlama hadisələri yayımlanır.
