---
translation_locale: az
translation_source: /cookbook/triggers.md
translation_source_hash: 6c8f436b5a41cf41c0ac37aeed6b6cd8c73009cfcca2fe7f5642cef1ad115e6f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Triggerlər {#triggers}

## Nəticə {#outcome}

Taira -də məhdud bitmə çağırışı tetikleyicisini qeyd edin, onu bir dəfə icra edin, tətbiq edilən yekunluğu gözləyin və blok tarixindən uğurla tamamlanmasını təsdiqləyin.

## Əvvəlki şərtlər {#prerequisites}

- Maliyyələşdirilmiş bir imzaçı, `taira.client.toml`, `taira.tx-metadata.json`, və `TAIRA_ACCOUNT_ID` üçün [Bağlantı Taira](./connect-to-taira.md).
- Taira icazəsi ilə `TAIRA_ACCOUNT_ID` üçün bir tetikçi qeydiyyatdan keçirilir və nəticəli tetikçi icra olunur. Müvafiq nömrələr `CanRegisterTrigger` tərəfindən `authority` və `CanExecuteTrigger` tərəfindən `trigger` tərəfindən məhdudlaşdırılır.
- Əgər bu yardımlar mövcud deyilsə, yaradılmış yerli şəbəkəni və onun administrator müştərisini istifadə edin. Trigger səlahiyyətliyinə, eyni zamanda, triggerin icra edəcəyi təlimatlar üçün tələb olunan bütün icazələr lazımdır.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## Dərslər {#steps}

### 1. Təlimat əsaslı tetikləyici qeyd edin. {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` JSON təlimatları sıralarını qəbul edir. Bir `Log` təlimatı bu nümunəni ikinci bir kitabxana obyektinin icazələrinə deyil, tetikləyici icazələrə yönəldir.

```bash
printf '%s\n' \
  '[{"Log":{"level":"INFO","message":"cookbook trigger executed"}}]' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger trigger register \
    --id "$TRIGGER_ID" \
    --instructions-stdin \
    --repeats 3 \
    --authority "$TAIRA_ACCOUNT_ID" \
    --filter execute
```

Trigger ən çox üç dəfə işləyə bilər. Onun bəyan etdiyi səlahiyyət, onu yerinə yetirən zəng edən deyil, hərəkətin içərisindəki təlimatlara icazə verir.

### 2. Bəyannaməni icra etməzdən əvvəl yoxlayın. {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" ledger trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

Başqa bir ödəniş xərcləmədən əvvəl I105 səlahiyyətini, icra filtrini, qalan təkrarlamaları və vahid `Log` göstəriciyi təsdiq edin.

### 3. Hər iki qatı icra edin və gözləyin. {#_3-execute-and-wait-for-both-layers}

İcra əməliyyatı və başlanğıc hərəkəti fərqli sübutlara malikdir. `--wait` tətbiqi əməliyyatın yekunlaşdırılmasını gözləyir; `--trace` həmçinin iş vaxtı başa çatdırılma diaqnostikasını bildirir.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger trigger execute \
  --wait \
  --trace \
  --timeout-ms 60000 \
  "$TRIGGER_ID"
```

Rust müştəriləri eyni iki yazılmış təlimat hazırlayır. Burada `authority` bu hesab kimi bir `AccountId` və `client` əlamətləri:

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};

let trigger_id: TriggerId = "cookbook_by_call_log".parse()?;
let action = Action::new(
    vec![Log::new(Level::INFO, "cookbook trigger executed".to_owned()).into()],
    Repeats::Exactly(3),
    authority.clone(),
    ExecuteTriggerEventFilter::new()
        .for_trigger(trigger_id.clone())
        .under_authority(authority),
);
let fee = FeePaymentIntent::authority(Vec::new(), None);

client.submit_blocking(Register::trigger(Trigger::new(trigger_id.clone(), action)), fee.clone())?;
client.submit_blocking(ExecuteTrigger::new(trigger_id), fee)?;
```

## Tətbiq edin {#verify}

Tələb olunmuş blokların tarixini tamamlamaq üçün tarayın və azaldılmış təkrarlama sayını yoxlayın:

```bash
iroha --config "$CONFIG" ledger trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

Ən azı bir tamamlama uğurlu olduğunu bildirməlidir. Trigger iki icra olunandan sonra aktiv qalmalıdır. Başarılı təqdimat uğurlu tamamlanma olmadan kifayət qədər yoxlama demək deyil.

## Problemlərin həlli {#troubleshooting}

- Qeyri-mümkün olduğu üçün qeydiyyatdan imtina edilməsi müayinəçinin olmaması deməkdir. `CanRegisterTrigger` icra edilməsi üçün ayrı-ayrı həcmli `CanExecuteTrigger` Qeydiyyat.
- Bir əməliyyat tətbiq olunduğu müddətdə başlatma hərəkəti uğursuzluğunu bildirir. Tamamlanma nəticəsini və səhvini oxuyun; sonra hər yerləşdirilmiş təlimat üçün başlatma səlahiyyətlərinin yoxlanılmasına baxın.
- `trigger not found` qeydə alınmış əməliyyatın rədd edildiyini və ya yerinə yetirilməsi üçün fərqli Torii / silsilə konfigurasiyasından istifadə edildiyini bildirə bilər.
- Təkrarlar sıfıra çatdıqda, daha çox təkrarlama düzəltmək başqa bir imtiyazlı yazıdır. Bu resepti qeyri-müəyyən müddət üçün dəyişdirməyin.
- Təmizləmə üçün `ledger trigger unregister --id "$TRIGGER_ID"` bu tetikləyici və açıq ödəniş seçimi üçün `CanUnregisterTrigger` tələb edir.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [Qeyri-dövlət çağırışı ilə bağlanmış komitdə inteqrasiya testləri ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/triggers/by_call_trigger.rs)
- [Qeydiyyatlı komitdə hadisə və tetikleme inteqrasiyası sınaqları](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events_and_triggers.rs)
- [Trigger təlimatının bağlanmış commit-də icrası](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)
- [Triggerlər](/az/blockchain/triggers.md)
- [Trigger nümunələri](/az/blockchain/trigger-examples.md)
- [Hadisələr](./stream-events.md)
