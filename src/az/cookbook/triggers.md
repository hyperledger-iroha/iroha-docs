---
translation_locale: az
translation_source: /cookbook/triggers.md
translation_source_hash: 5267fb9bb232d52d9df4bedee414d745ccc30dd52cbc30993df3c5b975a0bc38
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Səbəblər {#triggers}

## Nəticə {#outcome}

Taira üzərində texniki vasitə ilə sonlu çağırış tetikleyicisi qeydiyyatdan keçirin, onu bir dəfə icra edin, Tətbiq edilmiş sonluğu gözləyin və yekunlaşmış blok tarixçəsindən onun uğurlu tamamlanmasını təsdiqləyin.

## Tələb olunan əvvəlcədən biliklər {#prerequisites}

- Maliyyələşdirilən kriptoqrafik imzalayan, `taira.client.toml`, `taira.tx-metadata.json` və `TAIRA_ACCOUNT_ID` [Taira-ə qoşul](./connect-to-taira.md)-dən.
- Taira üçün `TAIRA_ACCOUNT_ID` adlı tetikleyiciyi qeydiyyatdan keçirmək və nəticədə yaranan tetikleyiciyi icra etmək icazəsi. Münasib tokenlər `CanRegisterTrigger` `authority` tərəfindən və `CanExecuteTrigger` `trigger` tərəfindən məhdudlaşdırılır.
- Əgər həmin qrantlar mövcud deyilsə, yaradılmış yerli şəbəkədən və onun administrator müştərisindən istifadə edin. Sürətli icazə verən əsas şəxs həmçinin trigger-in icra edəcəyi təlimatların tələb etdiyi bütün icazələrə malik olmalıdır.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## Addımlar {#steps}

### 1. Təlimat dəstəyi olan tetikleyiciyi qeydiyyatdan keçirin {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` JSON təlimatlar massivini qəbul edir. `Log` təlimatı bu nümunəni ikinci reyestr obyektinin icazələrindən çox, triggerin avtorizasiyasına yönəldir.

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

Tetik ən çox üç dəfə işləyə bilər. Onun elan edilmiş səlahiyyətli prinsipi, təsadüfən onu yerinə yetirən sorğu göndərən müştəri deyil, hərəkət daxilindəki təlimatları icazələndirir.

### 2. İcradan əvvəl bəyanatı yoxlayın {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" ledger trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

Başqa bir ödəniş xərcləmədən əvvəl I105 səlahiyyət prinsipini, icra filtrini, qalan təkrarları və tək `Log` təlimatı təsdiqləyin.

### 3. Hər iki təbəqəni icra edin və gözləyin {#_3-execute-and-wait-for-both-layers}

İcra əməliyyatı və tətik hərəkəti fərqli sübutlara sahibdir. `--wait` Tətbiq edilmiş əməliyyatın sonluğunu gözləyir; `--trace` həmçinin proqram təminatı icra mühiti tamamlanma diaqnostikasını bildirir.

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

Rust müştərilər eyni iki tipli təlimatı qururlar. Burada `authority` bir `AccountId`-dir və `client` həmin hesab kimi imzalanır:

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

## Yoxla {#verify}

Tamamlanmış blok tarixçəsini tamamlanma üçün skan edin və azaldılmış təkrarlanma sayını yoxlayın:

```bash
iroha --config "$CONFIG" ledger trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

Ən azı bir tamamlanma uğuru bildirilməlidir. Triger iki icra qaldığı halda aktiv qalmalıdır. Uğurlu bir göndəriş uğurlu triger tamamlanması olmadan kifayət qədər təsdiq sayılmır.

## Problemlərin aradan qaldırılması {#troubleshooting}

- Qeydiyyatın icazə verilmədiyi üçün rədd edilməsi o deməkdir ki, kriptoqrafik imzalayan elan edilmiş icazə subyekti üçün `CanRegisterTrigger` malik deyil. İcrası üçün ayrıca təyin olunmuş `CanExecuteTrigger` token tələb olunur.
- Bir əməliyyat tetikleyici hərəkəti uğursuzluq olaraq bildirərkən Tətbiq oluna bilər. Tamamlama nəticəsini və xətanı oxuyun; sonra hər bir daxil edilmiş təlimat üçün tetikleyici icazə verən əsasın icazələrini yoxlayın.
- `trigger not found` qeydiyyat əməliyyatının rədd edildiyini və ya icra üçün fərqli Torii/zəncir konfiqurasiyasının istifadə edildiyini bildirə bilər.
- Təkrarlamalar sıfıra çatdıqda, əlavə təkrarlamalar etmək başqa bir üstünlük verilmiş yazıdır. Bu resepti səssizcə qeyri-müəyyən bir tetikleyiciye çevirməyin.
- Təmizlik üçün, `ledger trigger unregister --id "$TRIGGER_ID"` həmin tetik üçün `CanUnregisterTrigger` tələb edir, həmçinin açıq ödəniş seçimi.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [Texniki çağırışla pinlənmiş mənbə kodu reviziyasında inteqrasiya testlərini işə salın](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/triggers/by_call_trigger.rs)
- [Əlamət və tetikleyici inteqrasiya testləri pinlənmiş mənbə kodu reviziyasında](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events_and_triggers.rs)
- [Sabitlənmiş mənbə kodu revisiyasında təlimatın icrasını işə sal](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)
- [Səbəblər](/az/blockchain/triggers.md)
- [Tətik nümunələri](/az/blockchain/trigger-examples.md)
- [Tədbirlər](./stream-events.md)
