---
translation_locale: kk
translation_source: /reference/genesis.md
translation_source_hash: 1312e80d9e662cc3e8cf4d0668ff4bb9e6ce3f74a60bb5287205aeeb5afd5de8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Жаратылыс анықтамасы {#genesis-reference}

Ағымда Iroha 3 жұмыс процесі, а `genesis.json` манифест біріншісін сипаттайды
транзакциялар мен желі іске қосылған кезде қолданылатын параметрлер.

Құрдастарға таратылатын қол қойылған артефакт a Norito-кодталған `.nrt` файл
шығарған `kagami genesis sign`.

## Негізгі өрістер {#main-fields}

Генезис манифесті мыналарды анықтай алады:

- `chain` тізбек идентификаторы үшін
- `executor` қосымша орындаушыны жаңарту байт-код жолы үшін
- `ivm_dir` үшін IVM триггерлер мен жаңартулар пайдаланатын кітапханалар
- `consensus_mode` манифест жариялаған бастапқы режим үшін
- `transactions` реттелген параметр жаңартулары, нұсқаулар, триггерлер және топология үшін
- `crypto` бастапқы криптографиялық сурет үшін

Ішінде `transactions`, топология жазбаларының жұп идентификаторлары және PoPs бірге:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Манифест жасаңыз {#generate-a-manifest}

Қолдану Kagami үлгіні жасау үшін:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

Жұртшылық үшін SORA Nexus деректер кеңістігі, `npos` күтілетін консенсус режимі болып табылады.
Басқа Iroha 3 орналастырулар мақсатқа байланысты рұқсат етілген немесе NPoS пайдалануы мүмкін
профиль.

## Манифестке қол қою {#sign-the-manifest}

Өңдеуден және растаудан кейін JSON, оны орналастыруға болады `.nrt` блок:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` манифесттен генезистік ашық кілтті оқиды және пайдаланады
жасау үшін иесінің жеке кілті, бір сілтемелі кәдімгі файл
орналастырылатын қолтаңбалы блок.Файлда бір канондық жеке кілт болуы керек
жаңа жолдан кейін мультихэш; Kagami символдық сілтемелерден және басқа режимдерден бас тартады
қарағанда `0600`. Пәрмен жолында өңделмеген жеке кілттер қабылданбайды.Нәтиже
құрдастары конфигурациясынан сілтеме жасауы керек файл болып табылады.

## Конфигурациялау `iroha3d` {#configure-iroha3d}

Демонды қол қойылған генезистік блокқа бағыттаңыз:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## Қатысты құралдар {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

Генератордың орындалуы мен пәрмен мәліметтерін қараңыз
[Kagami README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami/README.md).
