---
translation_locale: kk
translation_source: /blockchain/nfts.md
translation_source_hash: 76608347790f14eb5a2d58ac26f0e194ccc34b1cb5e8983e2d6ac390fcb60ec6
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# NFTs {#nfts}

Iroha NFT — бұл бір иесі бар ерекше блокчейн тіркелім объектісі. Жазба өз идентификаторы, метадеректері, өмірлік цикл оқиғалары және меншік құқығын беру семантикасына ие болуы керек, бірақ сандық баланс қажет болмаған кезде NFTs пайдаланыңыз.

Сандық [актив](/kk/blockchain/assets.md) сияқты емес, NFT дәлдікке, активтерді шығару саясатына немесе әр есепшотқа арналған мөлшерге ие емес. NFT бір тіркелген объект ретінде бар, және меншік тікелей сол объектіде бақыланады.

## Құрылым {#structure}

Тіркелген `Nft` мыналарды қамтиды:

- `id`: бір `NftId`
- `content`: NFT сипаттайтын метадеректер
- `owned_by`: NFT-ді иеленетін есептік жазба

`content` алаңы – бұл `Metadata` картасы. Оны ықшам ұстаңыз: сипаттамалық алаңдарды, тұрақты сілтемелерді, криптографиялық хэштерді, URIs немесе SoraFS жолдарын осында сақтаңыз. Үлкен құжаттарды, медиа файлдарды немесе жиі өзгеретін қолданба күйін чейннен тыс сақтап, тек тексерілетін сілтемені ғана NFT-те сақтаңыз.

## Осы жұмыс ағынын Taira бойынша іске қосыңыз {#try-it-on-taira}

Қоғамдық Taira тест желісінде қазіргі уақытта NFT жазбалар бар-жоғын тексеріңіз:

```bash
curl -fsS 'https://taira.sora.org/v1/nfts?limit=5&include_total=true' \
  | jq '{total, nft_ids: [.items[].id]}'
```

Тірі OpenAPI құжатын түйін арқылы көрсетілген NFT маршруттар үшін тексеріңіз:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/nfts") or startswith("/v1/explorer/nfts"))'
```

Бос `items` массиві қоғамдық тест желісінде жарамды жауап болып табылады. Бұл ағымдағы бетте NFTs жоқ екенін білдіреді, NFT нұсқаулардың қол жетімсіз екенін емес.

## NFT ЖСН {#nft-ids}

`NftId` осы мәтін формасын қолданады:

```text
name$domain
name$domain.dataspace
```

Мысалы, `badge$docs.universal` идентификаторы `docs.universal` доменіндегі `badge` NFT-ін білдіреді. Деректер кеңістігі көрсетілмесе, ағымдағы талдағыш `universal` кеңістігін қолданады, сондықтан `badge$docs` атауы `badge$docs.universal` ретінде шешіледі.

NFT идентификаторлары үшін тұрақты атауларды пайдаланыңыз. Бұл идентификатор нұсқауларда, сұраныстарда, рұқсаттарда, оқиға сүзгілерінде және қолданба сілтемелерінде пайдаланылатын объектінің жеке идентификаторы болып табылады.

## Өмірлік цикл {#lifecycle}

NFT өмірлік цикл операциялары Iroha нұсқаулық операцияларын пайдаланады:

- [`Register`](/kk/blockchain/instructions.md#un-register) жасайды NFT бастапқысымен `content`.
- [`Unregister`](/kk/blockchain/instructions.md#un-register) алып тастайды NFT.
- [`Transfer`](/kk/blockchain/instructions.md#transfer) өзгерістер `owned_by`.
- [`SetKeyValue` және `RemoveKeyValue`](/kk/blockchain/instructions.md#setkeyvalue-removekeyvalue) жаңарту NFT метадеректер.

## Оны жергілікті түрде көріп көріңіз {#try-it-locally}

Бұл мысалдар сіз жергілікті желіні іске қосып, [CLI нұсқаулық](/kk/get-started/operate-iroha-via-cli.md) арқылы алынған клиент конфигурациясына ие екеніңізді болжайды:

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN='<OWNED_DOMAIN>.universal'
export NFT_ID="badge_intro\$$NFT_DOMAIN"
```

Жасалған жергілікті желі клиенті үшін қолданба доменін тіркемейді. `NFT_DOMAIN` мәнін қол қоюшы есептік жазба иеленетін немесе оған `CanRegisterNft` рұқсаты бар доменге орнатыңыз. Жаңа домен жасау үшін [Домендер](/kk/blockchain/domains.md#registration) бөліміндегі декларативті `app alias setup plan` және `app alias setup apply` үдерісін пайдаланыңыз.

NFT тіркеліңіз. Тіркеу стандартты кірістен бастапқы мазмұнды JSON оқиды:

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft register --id "$NFT_ID"
```

NFT-ны тікелей тексеріп, содан кейін барлық NFTs-ді толық жазбаларымен қатар тізімде:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list --all
```

Метадеректер кілтін қосып, NFT-ны қайтадан оқыңыз:

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

Мета деректер кілтін жойыңыз:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

Қажет болса, NFT-ті аударыңыз. Ағымдағы иесін `owned_by` өрісінен оқу үшін `ledger nft get`, ал алушы есептік жазбасының ID-ін табу үшін `account list --all` пәрменін пайдаланыңыз.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  account list --all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

Өтінімдік нұсқауынан кейін NFT мысалын алып тастаңыз. Егер оны аударсаңыз, оны қайта аударыңыз немесе ағымдағы иесінің есептік жазба конфигурациясымен тіркеуден шығару командаларын жіберіңіз.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft unregister --id "$NFT_ID"
```

## Сұраулар мен оқиғалар {#queries-and-events}

Пайдалану [`FindNfts`](/kk/reference/queries.md#assets-nfts-and-rwas) тізімге енгізу NFTs және [`FindNftsByAccountId`](/kk/reference/queries.md#assets-nfts-and-rwas) тізімге енгізу NFTs есептік жазбаға тиесілі.

NFT тіркеу, жою, аудару және метадеректерді жаңарту NFT деректер оқиғаларын шығарады. Блокчейн тізілімі өзгерістеріне жазылғанда немесе NFT өмірлік цикл оқиғаларына әрекет ететін триггерлерді жасағанда `Nft` деректер оқиғасы сүзгісін қолданыңыз.

## Рұқсаттар {#permissions}

Әдепкі рұқсат беті NFT-ге тән токендерді қамтиды:

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

Рұқсаттарды тексеру белсенді бағдарламалық қамтамасыз ету орындалу ортасын тексерушімен enforced (орындалады), сондықтан желі орындаушыны жаңарту арқылы рұқсат беруді теңшей алады. Ағымдағы әдепкі токендер тізімі үшін [Рұқсат белгішелері](/kk/reference/permissions.md) қараңыз.

## NFTs таңдау {#choosing-nfts}

Өзектілік пен меншік маңызды болатын жазбалар үшін NFT қолданыңыз:

- куәліктер, белгішелер, лицензиялар және куәландырулар
- жазылым немесе кіру жазбалары
- тәндікке байланған немесе есептік жазбаға тіркелген қолданба жазбалары
- чейннен тыс медиа, құжаттар немесе техникалық манифестерге сілтемелер

Фунгибельді баланстар үшін сандық активті пайдаланыңыз, ал деректер тек бар блокчейн тізілім объектісінің қысқаша қасиеті болса, қарапайым [метадеректер](/kk/blockchain/metadata.md) пайдаланыңыз.

Сондай-ақ қараңыз:

- [Активтер](/kk/blockchain/assets.md)
- [Метадеректер](/kk/blockchain/metadata.md)
- [Нұсқаулар](/kk/blockchain/instructions.md)
- [Сұраулар](/kk/blockchain/queries.md)
