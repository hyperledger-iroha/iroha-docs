---
translation_locale: kk
translation_source: /reference/genesis.md
translation_source_hash: dda17468f39573a1fcf43474351bd01c4fea38e8b603fd4d8b21780b273c8649
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# блокчейн генезис сілтемесі {#genesis-reference}

Қазіргі Iroha 3 жұмыс ағынында `genesis.json` техникалық манифест желі іске қосылған кезде қолданылатын алғашқы транзакциялар мен параметрлерді сипаттайды.

Желі әріптестеріне таратылған қол қойған артефакт `kagami genesis sign` жасаған `.nrt` файлы болып, ол Norito кодын қолданады.

## Негізгі салалар {#main-fields}

Блокчейннің алғашқы техникалық манифесі мынаны анықтай алады:

- `chain` тізбек идентификаторы үшін
- манифесттегі есептік жазба литералдарын кодтайтын I105 желі префиксіне арналған `chain_discriminant`
- `executor` опциялы орындаушы жаңарту байткод жолы үшін
- `ivm_dir` триггерлер мен жаңартулар қолданатын IVM кітапханалар үшін
- `consensus_mode` техникалық манифестте жарнамаланған бастапқы режим үшін
- `wire_protocol_version` бірінші шығарылымның консенсус тасымалдау хаттамасының нұсқасы үшін
- `consensus_fingerprint` консенсус параметрлерінің міндетті емес типтелген саусақ ізі үшін; JSON манифесттері оны нақты көрсетеді
- `transactions` тапсырыс берілген параметр жаңартулары, нұсқаулар, триггерлер және топология үшін
- қол қойылған Sumeragi биіктік контекстінің параметрлеріне арналған `sumeragi_context`
- тізбек қабылдайтын, `allowed_algorithms` ішінде тізілген нақты қол қою және контроллер алгоритмдеріне арналған `crypto_admission_policy`

`transactions` аясында топология жазбалары желі серіктестерінің идентификаторларын және PoPs бірге жұптайды:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Техникалық манифест жасаңыз {#generate-a-manifest}

Үлгі жасау үшін Kagami пайдаланыңыз. Әр қабылданған алгоритмге `--allowed-signing` параметрін канондық өсу ретімен қайталаңыз; Kagami көрсетілмеген алгоритмдерді өзі қоспайды:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --chain-id <CHAIN_ID> \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> \
  --allowed-signing ed25519 \
  --allowed-signing bls_normal > genesis.json
```

Ашық SORA Nexus деректер кеңістігі үшін күтілетін консенсус режимі — `npos`. Өзге Iroha 3 орналастырулары нысаналы профильге қарай рұқсаттық режимді немесе NPoS қолдана алады.

## Техникалық манифесті қол қою {#sign-the-manifest}

JSON өңделіп, тексерілгеннен кейін, оны орналастырылатын `.nrt` блогына қол қойыңыз:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt \
  --expected-hash-out genesis.expected_hash
```

`kagami genesis sign` орналастыруға болатын қол қойылған блокты шығару үшін генезис кілт жұбын иесі ұстайтын бір сілтемелі қарапайым файлдағы жеке кілттен шығарады. Оның жарияланған генезис ашық кілтіне сәйкес келуін талап ету үшін `--expected-public-key` беріңіз. Файл бір протокол-стандартты жеке кілт мультихэштен тұруы керек және жаңа жолмен аяқталуы тиіс; Kagami символдық сілтемелерді және `0600`-ден өзгеше режимдерді қабылдамайды. Командалық жолда шикі жеке кілттер қабылданбайды. Нәтиже – бұл желідегі әріптестер өз конфигурацияларынан сілтеме жасауға тиіс файл.

## `iroha3d` баптау {#configure-iroha3d}

Демонға қол қойылған генезис блогын және оның күтілетін хэшін бекітетін файлды көрсетіңіз. Бұл файлды `kagami genesis sign --expected-hash-out` жазады; түйін оны алғаш іске қосқанда да, қайта іске қосқанда да талап етеді:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
expected_hash_file = "genesis.expected_hash"
```

## Қатысты құралдар {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet generate`
- `cargo xtask kagami-profiles`

Генераторды іске асыру және командалық мәліметтер үшін [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_kagami/README.md) қараңыз.
