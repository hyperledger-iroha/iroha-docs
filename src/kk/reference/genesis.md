---
translation_locale: kk
translation_source: /reference/genesis.md
translation_source_hash: ac6bad693ed382dede0818132b8649fe14726283508da897a32eea417e5bbb28
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# блокчейн генезис сілтемесі {#genesis-reference}

Қазіргі Iroha 3 жұмыс ағынында `genesis.json` техникалық манифест желі іске қосылған кезде қолданылатын алғашқы транзакциялар мен параметрлерді сипаттайды.

Желі әріптестеріне таратылған қол қойған артефакт `kagami genesis sign` жасаған `.nrt` файлы болып, ол Norito кодын қолданады.

## Негізгі салалар {#main-fields}

Блокчейннің алғашқы техникалық манифесі мынаны анықтай алады:

- `chain` тізбек идентификаторы үшін
- `executor` опциялы орындаушы жаңарту байткод жолы үшін
- `ivm_dir` триггерлер мен жаңартулар қолданатын IVM кітапханалар үшін
- `consensus_mode` техникалық манифестте жарнамаланған бастапқы режим үшін
- `transactions` тапсырыс берілген параметр жаңартулары, нұсқаулар, триггерлер және топология үшін
- `crypto` бастапқы крипто уақытша деректер көзқарасы үшін

`transactions` аясында топология жазбалары желі серіктестерінің идентификаторларын және PoPs бірге жұптайды:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Техникалық манифест жасаңыз {#generate-a-manifest}

Kagami пайдаланып үлгіні жасаңыз:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

Қоғамдық SORA Nexus деректер кеңістігі үшін, `npos` күтілетін консенсус режимі болып табылады. Басқа Iroha 3 орналастырулар мақсатты профильге байланысты рұқсатталған немесе NPoS қолдануы мүмкін.

## Техникалық манифесті қол қою {#sign-the-manifest}

JSON өңделіп, тексерілгеннен кейін, оны орналастырылатын `.nrt` блогына қол қойыңыз:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` техникалық манифесттен блокчейннің бастапқы қоғамдық кілтін оқып, пайдаланушы иелігінде жатқан бір сілтемелі қарапайым файлдан жеке кілтті пайдаланып, орналастыруға болатын қол қойылған блокты шығарады. Файл бір протокол-стандартты жеке кілт мультихэштен тұруы керек және жаңа жолмен аяқталуы тиіс; Kagami символдық сілтемелерді және `0600`-ден өзгеше режимдерді қабылдамайды. Жеке кілттердің жаңа жолда командалық жолда көрсетілуі қабылданбайды. Нәтиже – бұл желідегі әріптестер өз конфигурацияларынан сілтеме жасауға тиіс файл.

## `iroha3d` баптау {#configure-iroha3d}

Деманды қол қойылған блокчейннің алғашқы блогына бағыттаңыз:

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

Генераторды іске асыру және командалық мәліметтер үшін [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami/README.md) қараңыз.
