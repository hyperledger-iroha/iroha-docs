---
translation_locale: kk
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 9c9d3bcf68364768385cf1049d4595d6305d0556c2be2ec651dd30c04424da15
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Желіде іске қосудың кілттері {#keys-for-network-deployment}

Әрбір желіге клиенттер, әріптестер, генез қолтаңбалау және NPoS немесе Nexus профильдер үшін BLS растаушы сәйкестіктер үшін ерекше негізгі материалдар қажет.

## Кілттерді қай жерде пайдаланады? {#where-keys-are-used}

- Клиенттің қолтаңбалау кілтісі `client.toml` бөлімшесінде `[account]` сақталады.
- Әр қатарлы `config.toml` кілттерінде `public_key` және `private_key` ретінде сақталады.
- `trusted_peers`-да кез келген теңгерімнің қоғамдық кілтін пайдаланады.
- BLS куәландырушы NPoS профильдері үшін иелік дәлелдемелері `trusted_peers_pop` -де сақталады.
- Жаратушы жазбаға қол қою кезінде `[genesis].public_key` теңгерімдегі конфигурация және сәйкес келетін жеке кілті пайдаланылады.

Жергілікті немесе сынақ орнату үшін Kagami осы файлдардың барлығын біріктіріп пайдалансын:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Қолданыстағы желі немесе профиль үшін басшылыққа алынатын ағынды пайдалану:

```bash
cargo run --bin kagami -- wizard
```

## Жеке кілттер жұптарын құру {#generate-individual-key-pairs}

Use `kagami keys` for standalone key material:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --out-dir ./client-key
```

For BLS validator material, include a Proof-of-Possession:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

Use `--seed-hex` only with an exact 32-byte hexadecimal secret for reproducible
development fixtures. For production deployment, omit it so Kagami uses
operating-system randomness, then move the unencrypted private-key export into
the approved custody boundary. The command never prints private keys.

## Жақсылар арасындағы келісім {#peer-consistency}

Барлық растаушылар бірдей генезистік транзакция, топология, сенімді ортақ кілттер және растаушы PoPs туралы келісуі тиіс. Жалғыз жоғалған немесе сәйкес келмейтін ортақ кілт желісін бастаудан немесе келісімге қол жеткізуден сақтай алады.

Минималды византиялық қатеге төзімді орналасу үшін кем дегенде төрт теңдікті пайдаланыңыз. Әр теңдіктің өз жеке кілті болуы керек, бірақ әрбір теңдік конфигурациясы бірдей сенімді теңдіктерді қажет етеді.

## Клиенттің шоттары {#client-accounts}

`client.toml` клиент шоты желіде бар болуы тиіс. Ол генез манифестімен немесе кейінгі транзакция арқылы тіркелуі мүмкін. Генез қолтаңбалау идентификациясын ұзақ мерзімді өтінім шоты ретінде пайдаланудан аулақ болыңыз; генезис артықшылықтары тек генезис кезеңінде қолданылады, ал өндіріс клиенттері өздерінің есептері мен рөлдерін пайдалануы тиіс.
