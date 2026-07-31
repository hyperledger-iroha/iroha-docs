---
translation_locale: kk
translation_source: /reference/genesis.md
translation_source_hash: 6710e76508e6a38a6b68d274247cc1383de2472e74f10be85000b30f74cb04a6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Жаратылыс кітабының сілтемесі {#genesis-reference}

Ағымдағы Iroha 3 жұмыс барысында `genesis.json` манифесті желі іске қосылған кезде қолданылатын алғашқы транзакциялар мен параметрлерді сипаттайды.

Бір-біріне таратылған қол қойылған артефакт Norito кодталған `.nrt` файлы болып табылады, оны `kagami genesis sign` шығарды.

## Негізгі салалар {#main-fields}

Жаратылыс манифесті анықтауы мүмкін:

- `chain` тізбекті сәйкестендіру үшін
- `executor` параметрлік орындаушы жаңарту байтек коды жолы үшін
- `ivm_dir` триггерлер мен жаңартулармен пайдаланылатын IVM кітапханалар үшін.
- `consensus_mode` манифестпен жарнамаланған бастапқы режим үшін
- `transactions` параметрлерді жаңарту, нұсқаулар, триггерлер және топология үшін
- `crypto` бастапқы криптовалютасын түсіру үшін

`transactions` шегінде топологиялық жазулар жұптық идентификаторлар және PoPs бірге:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Манифест жасаңыз {#generate-a-manifest}

Үлгі жасау үшін Kagami қолданылсын:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

Қоғамдық SORA Nexus деректер кеңістігі үшін, `npos` күтілетін консенсус режимі болып табылады. Басқа Iroha 3 орналасулары мақсатты профилге байланысты рұқсат етілген немесе NPoS пайдалана алады.

## Манифестке қол қойыңыз {#sign-the-manifest}

JSON кодты өңдегеннен және растағаннан кейін, оны `.nrt` блокқа қолтаңбалаңыз:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key <PRIVATE_KEY> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` генезистің қоғамдық кілтін манифесттен оқып, берілген жеке кілті, тұқым және алгоритмді қолдана отырып, іске қосылатын қолтаңбаланған блокты шығарады. Нәтижесінде әріптестер өз конфигурациясынан сілтеме жасауы тиіс файл болады.

## Конфигурация `irohad` {#configure-irohad}

Димонды қолтаңбаланған генезис блогына бағыттаңыз:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## Қатысушы құралдар {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

Генераторды іске асыру және командалық мәліметтер үшін [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_kagami/README.md) дегенді қараңыз.
