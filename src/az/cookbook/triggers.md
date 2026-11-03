---
translation_locale: az
translation_source: /cookbook/triggers.md
translation_source_hash: 946309958fe4e23a7454206b1eb4557f8e853171ce4e04d5373cb36f46b13970
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Səbəblər {#triggers}

## Nəticə {#outcome}

Taira üzərində texniki vasitə ilə sonlu çağırış tetikleyicisi qeydiyyatdan keçirin, onu bir dəfə icra edin, Tətbiq edilmiş sonluğu gözləyin və yekunlaşmış blok tarixçəsindən onun uğurlu tamamlanmasını təsdiqləyin.

## Tələb olunan əvvəlcədən biliklər {#prerequisites}

- [Taira-ya qoşulun](./connect-to-taira.md) səhifəsindən maliyyələşdirilmiş imzalayan, `taira.client.toml` və `TAIRA_ACCOUNT_ID`. Yazmalar `--fee-payer authority` istifadə edir; CLI imzalamadan əvvəl dəqiq haqqı Taira-nın ödəniş aktivində hesablayıb göstərir.
- Taira üçün `TAIRA_ACCOUNT_ID` adlı tetikleyiciyi qeydiyyatdan keçirmək və nəticədə yaranan tetikleyiciyi icra etmək icazəsi. Münasib tokenlər `CanRegisterTrigger` `authority` tərəfindən və `CanExecuteTrigger` `trigger` tərəfindən məhdudlaşdırılır.
- Əgər həmin qrantlar mövcud deyilsə, yaradılmış yerli şəbəkədən və onun administrator müştərisindən istifadə edin. Sürətli icazə verən əsas şəxs həmçinin trigger-in icra edəcəyi təlimatların tələb etdiyi bütün icazələrə malik olmalıdır.

```bash
CONFIG=./taira.client.toml
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## Addımlar {#steps}

### 1. Təlimat dəstəyi olan tetikleyiciyi qeydiyyatdan keçirin {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` `--emit-instructions` tərəfindən çap edilən JSON təlimat massivini qəbul edir. `tx ping` bir `Log` təlimatı yaradır və bu, nümunəni ikinci reyestr obyektinin icazələrinə deyil, triggerin avtorizasiyasına yönəldir.

```bash
iroha --config "$CONFIG" --emit-instructions \
  tx ping --log-level INFO --msg 'cookbook trigger executed' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    trigger register \
    --id "$TRIGGER_ID" \
    --instructions-stdin \
    --repeats 3 \
    --authority "$TAIRA_ACCOUNT_ID" \
    --filter execute
```

Tetik ən çox üç dəfə işləyə bilər. Onun elan edilmiş səlahiyyətli prinsipi, təsadüfən onu yerinə yetirən sorğu göndərən müştəri deyil, hərəkət daxilindəki təlimatları icazələndirir.

### 2. İcradan əvvəl bəyanatı yoxlayın {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" trigger inspect "$TRIGGER_ID"
```

Başqa ödəniş haqqı xərcləməzdən əvvəl I105 səlahiyyətli hesabını, icra filtrini, qalan təkrarları və `executable` daxilindəki yeganə kodlaşdırılmış təlimatı təsdiqləyin.

### 3. Hər iki təbəqəni icra edin və gözləyin {#_3-execute-and-wait-for-both-layers}

İcra əməliyyatı və tətik hərəkəti fərqli sübutlara sahibdir. `--wait` Tətbiq edilmiş əməliyyatın sonluğunu gözləyir; `--trace` həmçinin proqram təminatı icra mühiti tamamlanma diaqnostikasını bildirir.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  trigger execute \
  --wait \
  --trace \
  --timeout-ms 60000 \
  "$TRIGGER_ID"
```

Rust müştəriləri eyni iki tipli təlimatı qurur. Burada `authority` `AccountId`, `client` isə həmin hesab kimi imzalayan `iroha::blocking::Client` obyektidir; `submit` Applied yekunluğunu gözləyir:

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};

let trigger_id: TriggerId = "cookbook_by_call_log".parse()?;
let action = Action::new(
    vec![Log::new(Level::INFO, "cookbook trigger executed".to_owned())],
    Repeats::Exactly(3),
    authority.clone(),
    ExecuteTriggerEventFilter::new()
        .for_trigger(trigger_id.clone())
        .under_authority(authority),
)?;
let fee = FeePaymentIntent::authority(Vec::new(), None);

client.submit(Register::trigger(Trigger::new(trigger_id.clone(), action)), fee.clone())?;
client.submit(ExecuteTrigger::new(trigger_id), fee)?;
```

## Yoxla {#verify}

Tamamlanmış blok tarixçəsini tamamlanma üçün skan edin və azaldılmış təkrarlanma sayını yoxlayın:

```bash
iroha --config "$CONFIG" trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" trigger inspect "$TRIGGER_ID"
```

Ən azı bir tamamlanma uğuru bildirilməlidir. Triger iki icra qaldığı halda aktiv qalmalıdır. Uğurlu bir göndəriş uğurlu triger tamamlanması olmadan kifayət qədər təsdiq sayılmır.

## Problemlərin aradan qaldırılması {#troubleshooting}

- Qeydiyyatın icazə verilmədiyi üçün rədd edilməsi o deməkdir ki, kriptoqrafik imzalayan elan edilmiş icazə subyekti üçün `CanRegisterTrigger` malik deyil. İcrası üçün ayrıca təyin olunmuş `CanExecuteTrigger` token tələb olunur.
- Bir əməliyyat tetikleyici hərəkəti uğursuzluq olaraq bildirərkən Tətbiq oluna bilər. Tamamlama nəticəsini və xətanı oxuyun; sonra hər bir daxil edilmiş təlimat üçün tetikleyici icazə verən əsasın icazələrini yoxlayın.
- `Trigger with id … not found` qeydiyyat əməliyyatının rədd edildiyini və ya icra üçün fərqli Torii/zəncir konfiqurasiyasının istifadə edildiyini bildirə bilər.
- Təkrarlamalar sıfıra çatdıqda, əlavə təkrarlamalar etmək başqa bir üstünlük verilmiş yazıdır. Bu resepti səssizcə qeyri-müəyyən bir tetikleyiciye çevirməyin.
- Təmizlik üçün, `trigger unregister --id "$TRIGGER_ID"` həmin tetik üçün `CanUnregisterTrigger` tələb edir, həmçinin açıq ödəniş seçimi.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [Texniki çağırışla pinlənmiş mənbə kodu reviziyasında inteqrasiya testlərini işə salın](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/triggers/by_call_trigger.rs)
- [Əlamət və tetikleyici inteqrasiya testləri pinlənmiş mənbə kodu reviziyasında](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/events_and_triggers.rs)
- [Sabitlənmiş mənbə kodu revisiyasında təlimatın icrasını işə sal](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)
- [Səbəblər](/az/blockchain/triggers.md)
- [Tətik nümunələri](/az/blockchain/trigger-examples.md)
- [Tədbirlər](./stream-events.md)
