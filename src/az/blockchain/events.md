---
translation_locale: az
translation_source: /blockchain/events.md
translation_source_hash: 16b8cacc9bdf156d4b1e1a93b720085adcabb0002a34b9dc564a9926f573de63
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Hadisələr {#events}

Tədbirlər blok kateqoriyasında müəyyən hadisələr baş verdiyi zaman yayılır, məsələn yeni bir hesab yaradıldıqda və ya blok bağlandıqdan sonra.

- boru kəməri hadisələri
- məlumat hadisələri
- Zaman hadisələri
- icra hadisələrini başlatmaq

## Pipeline hadisələri {#pipeline-events}

Pipeline hadisələri bir blok üçün əməliyyatların təqdim edilməsi, icrası və ya öhdəlik verilməsi zamanı yayılır. Bir boru xəttində baş verən hadisə aşağıdakı məlumatları ehtiva edir: bir hadisənin (transaksiyanın və ya blokun) səbəbi olan subyekt növü, hash və statusunu. Vəziyyət `Validating` (təkrarlanan təsdiqlənmə), `Rejected` və ya `Committed` ola bilər. Əgər bir müəssisə rədd edilibsə, rəddin səbəbi göstərilmişdir.

### Taira üzərində sınayın. {#try-it-on-taira}

İctimai boru xəttinin hadisələr axınının quraşdırıldığını yoxlayın:

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

Bir axını açıq saxlamadan yoxlaya biləcəyiniz bir anlıq şəkil üçün son araşdırmaçı əməliyyatlarını oxuyun:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

Canlı tədbirlərə ehtiyac duyduğunuz zaman terminalda SSE marşrutunu açın:

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

Axın açıq olduğu müddətdə heç bir əməliyyat təqdim edilmirsə, yol sağlam olsa da əmr sakit qala bilər.

## Məlumat hadisələri {#data-events}

Məlumat hadisələri, həmyaşıdlar, domenlər, hesablar, aktivlər, aktiv tərifləri, NFTs, tetikləyicilər, rollar, zəncirdə quruluş, icraçı dövləti, sübutlar, məxfi aktivlər, körpülər və ya SORA/Nexus-specific obyektlərlə əlaqəli bir dəyişiklik olduqda yayılır. Bu cür hadisələr [ məlumat hadisələri filtrlərində istifadə olunur ](./filters.md#data-event-filters).

## Vaxt hadisələri {#time-events}

Zaman hadisələri dünya vəziyyəti görünüşü [ vaxt tetikleyiciləri ](./triggers.md#time-triggers) idarə etməyə hazır olduqda yayılır.

## Trigger icra hadisələri {#trigger-execution-events}

Trigger icra hadisələri [`ExecuteTrigger`](./instructions.md#executetrigger) təlimatının icrası zamanı yayılır. Trigger əməliyyatının bitməsindən sonra tetikləyici tamamlama hadisələri yayılır.
