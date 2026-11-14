---
translation_locale: kk
translation_source: /reference/naming.md
translation_source_hash: 15d095e674edf780c5859abe6f4615d53338e3304e8eedfa494017911204d4b6
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-supplemental-naming-link+reviewed-delta
---
# Атау қою дәстүрлері {#naming-conventions}

Есептік жазбаларды, домендерді немесе активтерді атаған кезде, сіз Iroha пайдаланып келген келесі дәстүрлерді ескеруіңіз керек:

1. Белгілі бір құрылым түрлеріне арналған бірнеше сақталған бөлгіштер бар:

   - `@` есеп шотына арналған лақап аттар мен шектеулі есеп шоттары/қоғамдық кілт формалары үшін резервтелген
   - `#` актив анықтамасының айырымдары мен актив балансы литералдары үшін сақталған
   - `::` келісімшарт ауыспалы атауларына арналған
   - `.` домен және деректер кеңістігін құжаттау үшін сақталған
   - `$` `name$domain.dataspace` сияқты NFT идентификаторларына арналған

2. Атау бос болмауы, Unicode NFC пішінінде болуы, ұзындығы ең көбі 255 UTF-8 байт болуы және бос орын, басқару және екі бағытты басқару таңбаларынсыз болуы керек.

## Осы жұмыс ағынын Taira бойынша іске қосыңыз {#try-it-on-taira}

Қоғамдық актив синонимін оның бір протокол стандартты актив анықтамасы идентификаторына түрлендіріңіз:

```bash
curl -fsS https://taira.sora.org/v1/assets/aliases/resolve \
  -H 'content-type: application/json' \
  -d '{"alias":"usd#wonderland"}' \
  | jq '{alias, asset_definition_id, asset_name, status: .alias_binding.status}'
```

Оны активтердің анықтамалар тізімімен салыстырыңыз:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=20' \
  | jq -r '.items[] | select(.alias != null) | [.alias, .id, .name] | @tsv'
```

`#` таңба активтің лақап атын домен контекстінен бөледі. Оны жай аттарға қоспаңыз, егер сіз әдейі актив лақап атын немесе актив қалдық мәнін жазып отырмасаңыз.
